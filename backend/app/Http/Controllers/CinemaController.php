<?php

namespace App\Http\Controllers;

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
use App\Models\Role;
use App\Models\User;
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

    public function pelicula(Pelicula $pelicula): JsonResponse
    {
        $pelicula->load(['genero', 'resenas.usuario'])
            ->loadAvg('resenas as calificacion_promedio', 'calificacion')
            ->loadCount(['resenas', 'marcadosPorUsuarios as favoritos_count']);

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
        )->load('usuario');

        return response()->json([
            'message' => 'Resena guardada correctamente.',
            'data' => ResenaResource::make($resena),
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
}
