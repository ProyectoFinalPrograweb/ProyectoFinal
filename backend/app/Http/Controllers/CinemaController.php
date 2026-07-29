<?php

namespace App\Http\Controllers;

use App\Services\MovieApiService;
use App\Http\Requests\PeliculaIndexRequest;
use App\Http\Requests\StoreGeneroRequest;
use App\Http\Requests\StorePeliculaRequest;
use App\Http\Requests\StoreResenaRequest;
use App\Http\Requests\UpdateGeneroRequest;
use App\Http\Requests\UpdatePeliculaRequest;
use App\Http\Requests\UpdateUserRoleRequest;
use App\Http\Resources\GeneroResource;
use App\Http\Resources\PeliculaResource;
use App\Http\Resources\ResenaResource;
use App\Http\Resources\UserResource;
use App\Models\Favorito;
use App\Models\Genero;
use App\Models\Pelicula;
use App\Models\Resena;
use App\Models\ResenaReaccion;
use App\Models\Role;
use App\Models\User;
use App\Models\UserFollow;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CinemaController extends Controller
{
    public function generos(): JsonResponse
    {
        return response()->json([
            'data' => GeneroResource::collection(Genero::withCount('peliculas')->orderBy('nombre')->get()),
        ]);
    }

    public function peliculas(PeliculaIndexRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $query = Pelicula::with('genero')
            ->withAvg('resenas as calificacion_promedio', 'calificacion')
            ->withCount(['resenas', 'marcadosPorUsuarios as favoritos_count']);

        if (! empty($validated['search'])) {
            $search = $validated['search'];
            $query->where(function ($subquery) use ($search) {
                $subquery
                    ->where('titulo', 'like', "%{$search}%")
                    ->orWhere('director', 'like', "%{$search}%");
            });
        }

        if (! empty($validated['genero_id'])) {
            $query->where('genero_id', $validated['genero_id']);
        }

        match ($validated['orden'] ?? 'calificacion') {
            'vistas' => $query->orderByDesc('favoritos_count'),
            'recientes' => $query->orderByDesc('anio'),
            default => $query->orderByDesc('calificacion_promedio'),
        };

        $peliculas = $query->paginate($validated['per_page'] ?? 12);

        return response()->json([
            'data' => PeliculaResource::collection($peliculas->getCollection()),
            'meta' => [
                'current_page' => $peliculas->currentPage(),
                'last_page' => $peliculas->lastPage(),
                'per_page' => $peliculas->perPage(),
                'total' => $peliculas->total(),
            ],
        ]);
    }

    public function pelicula(Request $request, Pelicula $pelicula): JsonResponse
    {
        $pelicula->load(['genero', 'resenas.usuario', 'resenas.respuestas.usuario'])
            ->loadAvg('resenas as calificacion_promedio', 'calificacion')
            ->loadCount(['resenas', 'marcadosPorUsuarios as favoritos_count']);

        $this->decorateResenas($pelicula->resenas, $request->user());

        $relacionadas = Pelicula::with('genero')
            ->withAvg('resenas as calificacion_promedio', 'calificacion')
            ->withCount(['resenas', 'marcadosPorUsuarios as favoritos_count'])
            ->where('id', '!=', $pelicula->id)
            ->where('genero_id', $pelicula->genero_id)
            ->limit(6)
            ->get();

        $pelicula->setRelation('relacionadas', $relacionadas);

        return response()->json([
            'data' => PeliculaResource::make($pelicula),
        ]);
    }

    public function storeResena(StoreResenaRequest $request, Pelicula $pelicula): JsonResponse
    {
        $validated = $request->validated();

        $resena = Resena::updateOrCreate(
            [
                'usuario_id' => $request->user()->id,
                'pelicula_id' => $pelicula->id,
            ],
            [
                'comentario' => $validated['comentario'],
                'calificacion' => $validated['calificacion'],
            ]
        )->load(['usuario', 'respuestas.usuario']);

        $this->decorateResenas(collect([$resena]), $request->user());

        return response()->json([
            'message' => 'Resena guardada correctamente.',
            'data' => ResenaResource::make($resena),
        ], 201);
    }

    public function perfilUsuario(Request $request, User $user): JsonResponse
    {
        $user->load('role')->loadCount(['seguidores', 'seguidos', 'resenas']);

        $resenas = $user->resenas()
            ->with(['pelicula', 'usuario', 'respuestas.usuario'])
            ->latest()
            ->get();

        $this->decorateResenas($resenas, $request->user());

        $siguiendo = false;
        if ($request->user()) {
            $siguiendo = UserFollow::where('follower_id', $request->user()->id)
                ->where('followed_id', $user->id)
                ->exists();
        }

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $request->user()?->id === $user->id ? $user->email : null,
                'avatar' => $user->avatar,
                'role' => $user->role?->nombre,
                'iniciales' => collect(explode(' ', $user->name))->map(fn ($part) => $part[0] ?? '')->take(2)->join(''),
                'seguidores_count' => $user->seguidores_count,
                'seguidos_count' => $user->seguidos_count,
                'resenas_count' => $user->resenas_count,
                'siguiendo' => $siguiendo,
                'es_mi_perfil' => $request->user()?->id === $user->id,
                'resenas' => ResenaResource::collection($resenas),
            ],
        ]);
    }

    public function toggleSeguir(Request $request, User $user): JsonResponse
    {
        if ($request->user()->id === $user->id) {
            return response()->json([
                'message' => 'No puedes seguir tu propio perfil.',
            ], 422);
        }

        $follow = UserFollow::where('follower_id', $request->user()->id)
            ->where('followed_id', $user->id)
            ->first();

        if ($follow) {
            $follow->delete();
            $siguiendo = false;
            $message = 'Dejaste de seguir este perfil.';
        } else {
            UserFollow::create([
                'follower_id' => $request->user()->id,
                'followed_id' => $user->id,
            ]);
            $siguiendo = true;
            $message = 'Ahora sigues este perfil.';
        }

        return response()->json([
            'message' => $message,
            'siguiendo' => $siguiendo,
            'seguidores_count' => $user->seguidores()->count(),
        ]);
    }

    public function reaccionarResena(Request $request, Resena $resena): JsonResponse
    {
        $validated = $request->validate([
            'tipo' => ['required', 'in:like,dislike'],
        ]);

        $reaccion = ResenaReaccion::where('resena_id', $resena->id)
            ->where('usuario_id', $request->user()->id)
            ->first();

        if ($reaccion && $reaccion->tipo === $validated['tipo']) {
            $reaccion->delete();
            $miReaccion = null;
        } else {
            ResenaReaccion::updateOrCreate(
                ['resena_id' => $resena->id, 'usuario_id' => $request->user()->id],
                ['tipo' => $validated['tipo']]
            );
            $miReaccion = $validated['tipo'];
        }

        return response()->json([
            'message' => 'Reaccion actualizada.',
            'likes' => $resena->reacciones()->where('tipo', 'like')->count(),
            'dislikes' => $resena->reacciones()->where('tipo', 'dislike')->count(),
            'mi_reaccion' => $miReaccion,
        ]);
    }

    public function responderResena(Request $request, Resena $resena): JsonResponse
    {
        $validated = $request->validate([
            'comentario' => ['required', 'string', 'min:2', 'max:700'],
        ]);

        $respuesta = $resena->respuestas()->create([
            'usuario_id' => $request->user()->id,
            'comentario' => $validated['comentario'],
        ])->load('usuario');

        return response()->json([
            'message' => 'Respuesta publicada.',
            'data' => \App\Http\Resources\ResenaRespuestaResource::make($respuesta),
        ], 201);
    }

    public function favoritos(Request $request): JsonResponse
    {
        $peliculas = Pelicula::with('genero')
            ->withAvg('resenas as calificacion_promedio', 'calificacion')
            ->withCount(['resenas', 'marcadosPorUsuarios as favoritos_count'])
            ->whereHas('marcadosPorUsuarios', fn ($query) => $query->where('users.id', $request->user()->id))
            ->get()
            ->each(function (Pelicula $pelicula) use ($request): void {
                $favorito = Favorito::where('usuario_id', $request->user()->id)
                    ->where('pelicula_id', $pelicula->id)
                    ->first();

                $pelicula->en_mi_lista = true;
                $pelicula->vista = (bool) $favorito?->vista;
            });

        return response()->json(['data' => PeliculaResource::collection($peliculas)]);
    }

    public function toggleFavorito(Request $request, Pelicula $pelicula): JsonResponse
    {
        $favorito = Favorito::where('usuario_id', $request->user()->id)
            ->where('pelicula_id', $pelicula->id)
            ->first();

        if ($favorito) {
            $favorito->delete();

            return response()->json([
                'message' => 'Pelicula removida de tu lista.',
                'enMiLista' => false,
            ]);
        }

        Favorito::create([
            'usuario_id' => $request->user()->id,
            'pelicula_id' => $pelicula->id,
        ]);

        return response()->json([
            'message' => 'Pelicula agregada a tu lista.',
            'enMiLista' => true,
        ], 201);
    }

    public function updateVista(Request $request, Pelicula $pelicula): JsonResponse
    {
        $validated = $request->validate([
            'vista' => ['required', 'boolean'],
        ]);

        $favorito = Favorito::firstOrCreate([
            'usuario_id' => $request->user()->id,
            'pelicula_id' => $pelicula->id,
        ]);

        $favorito->update(['vista' => $validated['vista']]);

        return response()->json([
            'message' => $favorito->vista ? 'Pelicula marcada como vista.' : 'Pelicula marcada como por ver.',
            'vista' => (bool) $favorito->vista,
        ]);
    }

    public function adminResumen(): JsonResponse
    {
        return response()->json([
            'data' => [
                'peliculas' => PeliculaResource::collection(Pelicula::with('genero')
                    ->withAvg('resenas as calificacion_promedio', 'calificacion')
                    ->withCount(['resenas', 'marcadosPorUsuarios as favoritos_count'])
                    ->orderBy('titulo')
                    ->get()),
                'usuarios' => UserResource::collection(User::with('role')->withCount(['peliculas', 'resenas'])->orderBy('name')->get()),
                'resenas' => ResenaResource::collection(Resena::with(['usuario', 'pelicula'])->latest()->get()),
                'generos' => GeneroResource::collection(Genero::withCount('peliculas')->orderBy('nombre')->get()),
                'roles' => Role::orderBy('nombre')->get(['id', 'nombre']),
            ],
        ]);
    }

    public function moderadorResumen(): JsonResponse
    {
        return response()->json([
            'data' => [
                'peliculas' => PeliculaResource::collection(Pelicula::with('genero')
                    ->withAvg('resenas as calificacion_promedio', 'calificacion')
                    ->withCount(['resenas', 'marcadosPorUsuarios as favoritos_count'])
                    ->latest()
                    ->get()),
                'resenas' => ResenaResource::collection(Resena::with(['usuario', 'pelicula'])->latest()->get()),
                'generos' => GeneroResource::collection(Genero::withCount('peliculas')->orderBy('nombre')->get()),
            ],
        ]);
    }

    public function storePelicula(StorePeliculaRequest $request): JsonResponse
    {
        $pelicula = Pelicula::create([
            ...$request->validated(),
            'usuario_id' => $request->user()->id,
        ])->load('genero');

        return response()->json([
            'message' => 'Pelicula creada correctamente.',
            'data' => PeliculaResource::make($pelicula),
        ], 201);
    }

    public function updatePelicula(UpdatePeliculaRequest $request, Pelicula $pelicula): JsonResponse
    {
        $pelicula->update($request->validated());
        $pelicula->load('genero')
            ->loadAvg('resenas as calificacion_promedio', 'calificacion')
            ->loadCount(['resenas', 'marcadosPorUsuarios as favoritos_count']);

        return response()->json([
            'message' => 'Pelicula actualizada correctamente.',
            'data' => PeliculaResource::make($pelicula),
        ]);
    }

    public function destroyPelicula(Pelicula $pelicula): JsonResponse
    {
        $pelicula->delete();

        return response()->json([
            'message' => 'Pelicula eliminada correctamente.',
        ]);
    }

    public function storeGenero(StoreGeneroRequest $request): JsonResponse
    {
        $genero = Genero::create($request->validated())->loadCount('peliculas');

        return response()->json([
            'message' => 'Genero creado correctamente.',
            'data' => GeneroResource::make($genero),
        ], 201);
    }

    public function updateGenero(UpdateGeneroRequest $request, Genero $genero): JsonResponse
    {
        $genero->update($request->validated());
        $genero->loadCount('peliculas');

        return response()->json([
            'message' => 'Genero actualizado correctamente.',
            'data' => GeneroResource::make($genero),
        ]);
    }

    public function destroyGenero(Genero $genero): JsonResponse
    {
        if ($genero->peliculas()->exists()) {
            return response()->json([
                'message' => 'No puedes eliminar un genero que tiene peliculas relacionadas.',
            ], 422);
        }

        $genero->delete();

        return response()->json([
            'message' => 'Genero eliminado correctamente.',
        ]);
    }

    public function destroyResena(Resena $resena): JsonResponse
    {
        $resena->delete();

        return response()->json([
            'message' => 'Resena eliminada correctamente.',
        ]);
    }

    public function updateUserRole(UpdateUserRoleRequest $request, User $user): JsonResponse
    {
        $user->update($request->validated());
        $user->load('role')->loadCount(['peliculas', 'resenas']);

        return response()->json([
            'message' => 'Rol de usuario actualizado correctamente.',
            'data' => UserResource::make($user),
        ]);
    }

    public function buscarPeliculasApi(Request $request, MovieApiService $movieApiService): JsonResponse
    {
        $query = (string) $request->query('query', '');
        $results = $movieApiService->searchMovies($query);

        return response()->json([
            'data' => $results,
        ]);
    }

    public function obtenerDetalleApi(int $externalId, MovieApiService $movieApiService): JsonResponse
    {
        $details = $movieApiService->getMovieDetails($externalId);

        if (!$details) {
            return response()->json(['message' => 'No se encontraron detalles para esta pelicula en la API.'], 404);
        }

        return response()->json([
            'data' => $details,
        ]);
    }

    public function sincronizarPosters(MovieApiService $movieApiService): JsonResponse
    {
        $peliculas = Pelicula::all();
        $actualizadas = 0;

        foreach ($peliculas as $pelicula) {
            $poster = $movieApiService->getPosterForTitle($pelicula->titulo);
            if ($pelicula->imagen !== $poster) {
                $pelicula->update(['imagen' => $poster]);
                $actualizadas++;
            }
        }

        return response()->json([
            'message' => "Se sincronizaron los posters de {$actualizadas} peliculas exitosamente.",
            'actualizadas' => $actualizadas,
        ]);
    }

    public function importarYFavorito(Request $request, MovieApiService $movieApiService): JsonResponse
    {
        $validated = $request->validate([
            'external_id' => ['nullable', 'integer'],
            'titulo' => ['required', 'string', 'max:255'],
            'director' => ['nullable', 'string', 'max:255'],
            'anio' => ['nullable', 'integer'],
            'sinopsis' => ['nullable', 'string'],
            'imagen' => ['nullable', 'string'],
            'genero_nombre' => ['nullable', 'string'],
            'vista' => ['nullable', 'boolean'],
        ]);

        $genero = null;
        if (!empty($validated['genero_nombre'])) {
            $genero = Genero::where('nombre', 'like', "%{$validated['genero_nombre']}%")->first();
        }
        if (!$genero) {
            $genero = Genero::first() ?? Genero::create(['nombre' => 'Drama', 'descripcion' => 'General']);
        }

        $pelicula = Pelicula::where('titulo', $validated['titulo'])->first();

        if (!$pelicula) {
            $director = $validated['director'] ?? null;
            $sinopsis = $validated['sinopsis'] ?? null;
            $anio = $validated['anio'] ?? (int) date('Y');
            $imagen = $validated['imagen'] ?? null;

            if (!empty($validated['external_id'])) {
                $details = $movieApiService->getMovieDetails((int) $validated['external_id']);
                if ($details) {
                    $director = $director ?: ($details['director'] ?? 'Desconocido');
                    
                    if (empty($sinopsis) || str_contains($sinopsis, 'Informacion basica')) {
                        $sinopsis = $details['sinopsis'] ?? 'Sin sinopsis.';
                    }
                    
                    $anio = $anio ?: ($details['anio'] ?? (int) date('Y'));
                    $imagen = $imagen ?: ($details['imagen'] ?? null);
                }
            }

            $pelicula = Pelicula::create([
                'titulo' => $validated['titulo'],
                'director' => $director ?: 'Director Desconocido',
                'anio' => $anio ?: (int) date('Y'),
                'sinopsis' => $sinopsis ?: 'Pelicula agregada por la comunidad.',
                'imagen' => $imagen ?: $movieApiService->getPosterForTitle($validated['titulo']),
                'genero_id' => $genero->id,
                'usuario_id' => $request->user()->id,
            ]);
        }

        $favorito = Favorito::firstOrCreate([
            'usuario_id' => $request->user()->id,
            'pelicula_id' => $pelicula->id,
        ]);

        if (isset($validated['vista'])) {
            $favorito->update(['vista' => (bool) $validated['vista']]);
        }

        $pelicula->load(['genero'])
            ->loadAvg('resenas as calificacion_promedio', 'calificacion')
            ->loadCount(['resenas', 'marcadosPorUsuarios as favoritos_count']);

        $pelicula->en_mi_lista = true;
        $pelicula->vista = (bool) $favorito->vista;

        return response()->json([
            'message' => 'Pelicula agregada a tu lista exitosamente.',
            'enMiLista' => true,
            'vista' => (bool) $favorito->vista,
            'data' => PeliculaResource::make($pelicula),
        ], 201);
    }

    private function decorateResenas($resenas, ?User $viewer): void
    {
        $resenas->each(function (Resena $resena) use ($viewer): void {
            $resena->loadCount([
                'reacciones as likes_count' => fn ($query) => $query->where('tipo', 'like'),
                'reacciones as dislikes_count' => fn ($query) => $query->where('tipo', 'dislike'),
            ]);

            $resena->mi_reaccion = $viewer
                ? $resena->reacciones()->where('usuario_id', $viewer->id)->value('tipo')
                : null;
        });
    }
}
