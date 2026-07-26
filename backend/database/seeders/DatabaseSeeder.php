<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\Role;
use App\Models\User;
use App\Models\Genero;
use App\Models\Pelicula;
use App\Models\Resena;
use App\Models\Favorito;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Crear Roles
        $adminRole = Role::create([
            'nombre' => 'Administrador',
            'descripcion' => 'Acceso total y gestión del sistema'
        ]);
        
        $modRole = Role::create([
            'nombre' => 'Moderador',
            'descripcion' => 'Supervisión de contenido y reseñas'
        ]);
        
        $userRole = Role::create([
            'nombre' => 'Cinéfilo',
            'descripcion' => 'Usuario estándar de la comunidad universitaria'
        ]);

        // 2. Crear Usuarios obligatorios (Credenciales de prueba para evaluación)
        // La contraseña cumple con los requisitos: 8+ chars, Mayúscula, Número y Carácter Especial
        $admin = User::create([
            'name' => 'Admin CinemaITO',
            'email' => 'admin@cinemaito.com',
            'password' => Hash::make('Admin123!'),
            'role_id' => $adminRole->id,
        ]);

        $mod = User::create([
            'name' => 'Moderador ITO',
            'email' => 'mod@cinemaito.com',
            'password' => Hash::make('Moderador123!'),
            'role_id' => $modRole->id,
        ]);

        $user = User::create([
            'name' => 'Estudiante Cinéfilo',
            'email' => 'user@cinemaito.com',
            'password' => Hash::make('Usuario123!'),
            'role_id' => $userRole->id,
        ]);

        // 3. Crear Géneros
        $generosNombres = ['Drama', 'Comedia', 'Terror', 'Sci-Fi / Ciencia Ficción', 'Documental', 'Romance'];
        $generosMod = [];
        foreach ($generosNombres as $nombre) {
            $generosMod[] = Genero::create([
                'nombre' => $nombre,
                'descripcion' => "Películas del género $nombre"
            ]);
        }

        // 4. Crear Películas de prueba (Cine Mexicano)
        $peliculasDatos = [
            ['titulo' => 'Amores Perros', 'director' => 'Alejandro González Iñárritu', 'anio' => 2000, 'sinopsis' => 'Tres historias cruzadas tras un trágico accidente automovilístico en la CDMX.'],
            ['titulo' => 'Sleep Dealer', 'director' => 'Alex Rivera', 'anio' => 2008, 'sinopsis' => 'Un futuro distópico sobre fronteras tecnológicas y recursos hídricos.'],
            ['titulo' => 'Como Agua para Chocolate', 'director' => 'Alfonso Arau', 'anio' => 1992, 'sinopsis' => 'Amor y realismo mágico a través de la cocina mexicana.'],
            ['titulo' => 'El Callejón de los Milagros', 'director' => 'Jorge Fons', 'anio' => 1995, 'sinopsis' => 'Historias entrelazadas en un barrio tradicional del centro histórico.'],
            ['titulo' => 'Roma', 'director' => 'Alfonso Cuarón', 'anio' => 2018, 'sinopsis' => 'Retrato íntimo de una familia y su empleada doméstica en los años 70.'],
            ['titulo' => 'Macario', 'director' => 'Roberto Gavaldón', 'anio' => 1960, 'sinopsis' => 'Un campesino realiza un pacto con la Muerte el Día de Muertos.'],
            ['titulo' => 'Güeros', 'director' => 'Alonso Ruizpalacios', 'anio' => 2014, 'sinopsis' => 'Un viaje en auto por la CDMX durante la huelga universitaria.'],
            ['titulo' => 'El Laberinto del Fauno', 'director' => 'Guillermo del Toro', 'anio' => 2006, 'sinopsis' => 'Fantasía mística y drama histórico en la posguerra.'],
            ['titulo' => 'Cronos', 'director' => 'Guillermo del Toro', 'anio' => 1993, 'sinopsis' => 'Un anticuario descubre un artefacto misterioso que otorga la vida eterna.'],
            ['titulo' => 'Noche de Fuego', 'director' => 'Tatiana Huezo', 'anio' => 2021, 'sinopsis' => 'Tres niñas crecen en una zona montañosa marcada por el peligro.'],
        ];

        $peliculasCreadas = [];
        foreach ($peliculasDatos as $index => $data) {
            $peliculasCreadas[] = Pelicula::create([
                'titulo' => $data['titulo'],
                'director' => $data['director'],
                'anio' => $data['anio'],
                'sinopsis' => $data['sinopsis'],
                'imagen' => null,
                'genero_id' => $generosMod[$index % count($generosMod)]->id,
                'usuario_id' => $admin->id,
            ]);
        }

        // 5. Crear Reseñas de prueba
        Resena::create([
            'usuario_id' => $user->id,
            'pelicula_id' => $peliculasCreadas[0]->id,
            'comentario' => 'Una obra maestra del cine contemporáneo nacional.',
            'calificacion' => 9.5
        ]);

        Resena::create([
            'usuario_id' => $user->id,
            'pelicula_id' => $peliculasCreadas[1]->id,
            'comentario' => 'Muy buena propuesta de ciencia ficción con crítica social.',
            'calificacion' => 8.8
        ]);

        // 6. Agregar a Favoritos de prueba
        Favorito::create([
            'usuario_id' => $user->id,
            'pelicula_id' => $peliculasCreadas[0]->id,
        ]);
    }
}