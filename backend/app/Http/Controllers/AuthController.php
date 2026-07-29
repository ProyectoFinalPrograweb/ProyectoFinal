<?php

namespace App\Http\Controllers;

use App\Http\Requests\LoginRequest;
use App\Http\Requests\ForgotPasswordRequest;
use App\Http\Requests\RegisterRequest;
use App\Http\Requests\ResetPasswordRequest;
use App\Http\Requests\UpdatePasswordRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Facades\Socialite;
use Throwable;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $role = Role::where('nombre', 'Cinefilo')->firstOrFail();

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role_id' => $role->id,
        ])->load('role');

        return response()->json([
            'message' => 'Cuenta creada correctamente.',
            'user' => UserResource::make($user),
            'token' => $user->createToken('frontend')->plainTextToken,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $user = User::with('role')->where('email', $validated['email'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['El correo o la contrasena no son correctos.'],
            ]);
        }

        return response()->json([
            'message' => 'Inicio de sesion correcto.',
            'user' => UserResource::make($user),
            'token' => $user->createToken('frontend')->plainTextToken,
        ]);
    }

    public function redirectToProvider(string $provider)
    {
        if (! $this->socialProviderIsConfigured($provider)) {
            return $this->redirectToFrontendWithError("El acceso con {$provider} aun no esta configurado.");
        }

        return Socialite::driver($provider)
            ->stateless()
            ->redirect();
    }

    public function handleProviderCallback(Request $request, string $provider)
    {
        if (! $this->socialProviderIsConfigured($provider)) {
            return $this->redirectToFrontendWithError("El acceso con {$provider} aun no esta configurado.");
        }

        if ($request->filled('error')) {
            $message = $request->query('error_description')
                ?: $request->query('error')
                ?: 'El proveedor cancelo el inicio de sesion.';

            Log::warning('OAuth provider returned an error.', [
                'provider' => $provider,
                'error' => $request->query('error'),
                'description' => $request->query('error_description'),
            ]);

            return $this->redirectToFrontendWithError($message);
        }

        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
        } catch (Throwable $exception) {
            Log::warning('OAuth callback failed.', [
                'provider' => $provider,
                'message' => $exception->getMessage(),
            ]);

            return $this->redirectToFrontendWithError('No se pudo validar la cuenta social. Intentalo de nuevo.');
        }

        if (! $socialUser->getEmail()) {
            return $this->redirectToFrontendWithError('La cuenta social no compartio un correo electronico.');
        }

        $role = Role::where('nombre', 'Cinefilo')->firstOrFail();
        $user = User::firstOrCreate(
            ['email' => $socialUser->getEmail()],
            [
                'name' => $socialUser->getName() ?: $socialUser->getNickname() ?: 'Usuario Cinema ITO',
                'password' => Hash::make(Str::random(32)),
                'role_id' => $role->id,
            ]
        );

        $updates = [];
        if (! $user->avatar && $socialUser->getAvatar()) {
            $updates['avatar'] = $socialUser->getAvatar();
        }
        if (! $user->role_id) {
            $updates['role_id'] = $role->id;
        }
        if ($updates) {
            $user->update($updates);
        }

        $user->load('role');
        $payload = base64_encode(json_encode(UserResource::make($user)->resolve()));
        $token = $user->createToken($provider)->plainTextToken;

        return redirect()->away(
            $this->frontendUrl('/login?social_token=' . urlencode($token) . '&social_user=' . urlencode($payload))
        );
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => UserResource::make($request->user()->load('role')),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()?->delete();

        return response()->json([
            'message' => 'Sesion cerrada correctamente.',
        ]);
    }

    private function socialProviderIsConfigured(string $provider): bool
    {
        return filled(config("services.{$provider}.client_id"))
            && filled(config("services.{$provider}.client_secret"))
            && filled(config("services.{$provider}.redirect"));
    }

    private function redirectToFrontendWithError(string $message)
    {
        return redirect()->away($this->frontendUrl('/login?oauth_error=' . urlencode($message)));
    }

    private function frontendUrl(string $path = ''): string
    {
        return rtrim((string) env('FRONTEND_URL', config('app.url')), '/') . $path;
    }

    public function updateProfile(UpdateProfileRequest $request): JsonResponse
    {
        $user = $request->user();
        $user->update($request->validated());

        return response()->json([
            'message' => 'Perfil actualizado correctamente.',
            'user' => UserResource::make($user->load('role')),
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        $validated = $request->validated();

        if (! Hash::check($validated['current_password'], $request->user()->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['La contrasena actual no es correcta.'],
            ]);
        }

        $request->user()->forceFill([
            'password' => Hash::make($validated['password']),
        ])->save();

        return response()->json([
            'message' => 'Contrasena actualizada correctamente.',
        ]);
    }

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {
        $status = Password::sendResetLink($request->validated());

        if ($status !== Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'No se pudo enviar el enlace de recuperacion.',
            ], 500);
        }

        return response()->json([
            'message' => 'Enlace de recuperacion enviado. En local se escribe en storage/logs/laravel.log.',
        ]);
    }

    public function resetPassword(ResetPasswordRequest $request): JsonResponse
    {
        $status = Password::reset(
            $request->validated(),
            function (User $user, string $password): void {
                $user->forceFill([
                    'password' => Hash::make($password),
                    'remember_token' => Str::random(60),
                ])->save();

                $user->tokens()->delete();
            }
        );

        if ($status !== Password::PASSWORD_RESET) {
            return response()->json([
                'message' => 'El token de recuperacion no es valido o expiro.',
            ], 422);
        }

        return response()->json([
            'message' => 'Contrasena actualizada correctamente.',
        ]);
    }

}
