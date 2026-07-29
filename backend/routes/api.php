<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CinemaController;
use Illuminate\Support\Facades\Route;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('/auth/{provider}/redirect', [AuthController::class, 'redirectToProvider'])->whereIn('provider', ['google', 'facebook']);
Route::get('/auth/{provider}/callback', [AuthController::class, 'handleProviderCallback'])->whereIn('provider', ['google', 'facebook']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::middleware('auth:sanctum')->get('/me', [AuthController::class, 'me']);
Route::middleware('auth:sanctum')->put('/profile', [AuthController::class, 'updateProfile']);
Route::middleware('auth:sanctum')->put('/profile/password', [AuthController::class, 'updatePassword']);
Route::middleware('auth:sanctum')->post('/logout', [AuthController::class, 'logout']);

Route::get('/generos', [CinemaController::class, 'generos']);
Route::get('/peliculas', [CinemaController::class, 'peliculas']);
Route::get('/peliculas/{pelicula}', [CinemaController::class, 'pelicula']);
Route::get('/usuarios/{user}', [CinemaController::class, 'perfilUsuario']);
Route::middleware('auth:sanctum')->post('/peliculas/{pelicula}/resenas', [CinemaController::class, 'storeResena']);
Route::middleware('auth:sanctum')->post('/usuarios/{user}/seguir', [CinemaController::class, 'toggleSeguir']);
Route::middleware('auth:sanctum')->post('/resenas/{resena}/reaccion', [CinemaController::class, 'reaccionarResena']);
Route::middleware('auth:sanctum')->post('/resenas/{resena}/respuestas', [CinemaController::class, 'responderResena']);
Route::middleware('auth:sanctum')->get('/favoritos', [CinemaController::class, 'favoritos']);
Route::middleware('auth:sanctum')->post('/peliculas/{pelicula}/favorito', [CinemaController::class, 'toggleFavorito']);
Route::middleware('auth:sanctum')->put('/peliculas/{pelicula}/vista', [CinemaController::class, 'updateVista']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->get('/admin/resumen', [CinemaController::class, 'adminResumen']);
Route::middleware(['auth:sanctum', 'role:Administrador,Moderador'])->get('/moderador/resumen', [CinemaController::class, 'moderadorResumen']);
Route::middleware(['auth:sanctum', 'role:Administrador,Moderador'])->delete('/moderador/resenas/{resena}', [CinemaController::class, 'destroyResena']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->post('/admin/peliculas', [CinemaController::class, 'storePelicula']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->put('/admin/peliculas/{pelicula}', [CinemaController::class, 'updatePelicula']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->delete('/admin/peliculas/{pelicula}', [CinemaController::class, 'destroyPelicula']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->post('/admin/generos', [CinemaController::class, 'storeGenero']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->put('/admin/generos/{genero}', [CinemaController::class, 'updateGenero']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->delete('/admin/generos/{genero}', [CinemaController::class, 'destroyGenero']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->delete('/admin/resenas/{resena}', [CinemaController::class, 'destroyResena']);
Route::get('/peliculas-api/buscar', [CinemaController::class, 'buscarPeliculasApi']);
Route::get('/peliculas-api/detalle/{id}', [CinemaController::class, 'obtenerDetalleApi']);

Route::middleware('auth:sanctum')->post('/peliculas/importar-favorito', [CinemaController::class, 'importarYFavorito']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->post('/admin/peliculas/sincronizar-posters', [CinemaController::class, 'sincronizarPosters']);
Route::middleware(['auth:sanctum', 'role:Administrador'])->put('/admin/users/{user}/role', [CinemaController::class, 'updateUserRole']);
