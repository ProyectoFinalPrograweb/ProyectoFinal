<?php

namespace Database\Seeders;

use App\Models\Favorito;
use App\Models\Genero;
use App\Models\Pelicula;
use App\Models\Resena;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $roles = collect([
            ['nombre' => 'Administrador', 'descripcion' => 'Acceso total al sistema'],
            ['nombre' => 'Moderador', 'descripcion' => 'Revision de peliculas y resenas'],
            ['nombre' => 'Cinefilo', 'descripcion' => 'Usuario estandar de la comunidad'],
        ])->mapWithKeys(function (array $role) {
            $model = Role::updateOrCreate(
                ['nombre' => $role['nombre']],
                ['descripcion' => $role['descripcion']]
            );

            return [$role['nombre'] => $model];
        });

        $users = collect([
            ['name' => 'Admin CinemaITO', 'email' => 'admin@cinemaito.com', 'password' => 'Admin123!', 'role' => 'Administrador'],
            ['name' => 'Moderador ITO', 'email' => 'mod@cinemaito.com', 'password' => 'Moderador123!', 'role' => 'Moderador'],
            ['name' => 'Usuario Cinefilo', 'email' => 'user@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Developer Evaluador', 'email' => 'developer@cinemaito.com', 'password' => 'Developer123!', 'role' => 'Administrador'],
            ['name' => 'Ana Lopez', 'email' => 'ana@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Carlos Ruiz', 'email' => 'carlos@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Diana Perez', 'email' => 'diana@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Eduardo Vega', 'email' => 'eduardo@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Fernanda Soto', 'email' => 'fernanda@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Gabriel Torres', 'email' => 'gabriel@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Moderador'],
            ['name' => 'Hilda Ramos', 'email' => 'hilda@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Romeo Santos', 'email' => 'Romeo@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
            ['name' => 'Ivan Castillo', 'email' => 'ivan@cinemaito.com', 'password' => 'Usuario123!', 'role' => 'Cinefilo'],
        ])->mapWithKeys(function (array $user) use ($roles) {
            $model = User::updateOrCreate(
                ['email' => $user['email']],
                [
                    'name' => $user['name'],
                    'password' => Hash::make($user['password']),
                    'role_id' => $roles[$user['role']]->id,
                ]
            );

            return [$user['email'] => $model];
        });

        $generos = collect([
            ['nombre' => 'Drama', 'descripcion' => 'Historias centradas en conflictos humanos y sociales'],
            ['nombre' => 'Comedia', 'descripcion' => 'Peliculas con tono ligero, humor o satira'],
            ['nombre' => 'Terror', 'descripcion' => 'Relatos de miedo, suspenso y elementos sobrenaturales'],
            ['nombre' => 'Ciencia ficcion', 'descripcion' => 'Futuros posibles, tecnologia y especulacion social'],
            ['nombre' => 'Documental', 'descripcion' => 'Narrativas basadas en hechos reales'],
            ['nombre' => 'Romance', 'descripcion' => 'Historias sobre relaciones afectivas'],
            ['nombre' => 'Fantasia', 'descripcion' => 'Mundos imaginarios y elementos magicos'],
            ['nombre' => 'Accion', 'descripcion' => 'Ritmo rapido, persecuciones y escenas de riesgo'],
            ['nombre' => 'Suspenso', 'descripcion' => 'Tension, misterio y giros narrativos'],
            ['nombre' => 'Animacion', 'descripcion' => 'Obras creadas con tecnicas animadas'],
        ])->mapWithKeys(function (array $genero) {
            $model = Genero::updateOrCreate(
                ['nombre' => $genero['nombre']],
                ['descripcion' => $genero['descripcion']]
            );

            return [$genero['nombre'] => $model];
        });

        $admin = $users['admin@cinemaito.com'];
        $moderador = $users['mod@cinemaito.com'];

        $peliculasDatos = [
            ['titulo' => 'Amores Perros', 'director' => 'Alejandro Gonzalez Inarritu', 'anio' => 2000, 'genero' => 'Drama', 'sinopsis' => 'Tres historias se cruzan despues de un accidente en la Ciudad de Mexico.', 'imagen' => 'https://image.tmdb.org/t/p/w500/wuTj5JvH7n9y3lVvB8k1C5H8aQx.jpg'],
            ['titulo' => 'Roma', 'director' => 'Alfonso Cuaron', 'anio' => 2018, 'genero' => 'Drama', 'sinopsis' => 'Retrato intimo de una familia y su trabajadora domestica en los anos setenta.', 'imagen' => 'https://image.tmdb.org/t/p/w500/uxHzl4b7nQx9vLzV3qN5W3F8Yx.jpg'],
            ['titulo' => 'Macario', 'director' => 'Roberto Gavaldon', 'anio' => 1960, 'genero' => 'Fantasia', 'sinopsis' => 'Un campesino hambriento se encuentra con la Muerte durante Dia de Muertos.', 'imagen' => 'https://image.tmdb.org/t/p/w500/uU3rM7b147v6nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'Cronos', 'director' => 'Guillermo del Toro', 'anio' => 1993, 'genero' => 'Terror', 'sinopsis' => 'Un anticuario descubre un artefacto que ofrece vida eterna a un alto costo.', 'imagen' => 'https://image.tmdb.org/t/p/w500/7aQvR1W0m41eX51V8Z3nQ2KxY7.jpg'],
            ['titulo' => 'Gueros', 'director' => 'Alonso Ruizpalacios', 'anio' => 2014, 'genero' => 'Comedia', 'sinopsis' => 'Dos jovenes recorren la ciudad durante una huelga universitaria.', 'imagen' => 'https://image.tmdb.org/t/p/w500/4s2KxY7nQ21R0Qz5Z3nQ2KxY7.jpg'],
            ['titulo' => 'Noche de Fuego', 'director' => 'Tatiana Huezo', 'anio' => 2021, 'genero' => 'Drama', 'sinopsis' => 'Tres ninas crecen en una comunidad marcada por la violencia.', 'imagen' => 'https://image.tmdb.org/t/p/w500/xV1Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'Temporada de Patos', 'director' => 'Fernando Eimbcke', 'anio' => 2004, 'genero' => 'Comedia', 'sinopsis' => 'Un domingo sin adultos transforma la rutina de dos adolescentes.', 'imagen' => 'https://image.tmdb.org/t/p/w500/yW2Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'La Jaula de Oro', 'director' => 'Diego Quemada-Diez', 'anio' => 2013, 'genero' => 'Drama', 'sinopsis' => 'Jovenes migrantes viajan hacia el norte buscando una nueva vida.', 'imagen' => 'https://image.tmdb.org/t/p/w500/zZ3Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'Ya No Estoy Aqui', 'director' => 'Fernando Frias', 'anio' => 2019, 'genero' => 'Drama', 'sinopsis' => 'Un joven de Monterrey enfrenta el exilio y la nostalgia por su barrio.', 'imagen' => 'https://image.tmdb.org/t/p/w500/aA4Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'Sueno en Otro Idioma', 'director' => 'Ernesto Contreras', 'anio' => 2017, 'genero' => 'Fantasia', 'sinopsis' => 'Un linguista intenta rescatar una lengua indigena a punto de desaparecer.', 'imagen' => 'https://image.tmdb.org/t/p/w500/bB5Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'Museo', 'director' => 'Alonso Ruizpalacios', 'anio' => 2018, 'genero' => 'Suspenso', 'sinopsis' => 'Dos estudiantes planean el robo de piezas arqueologicas del museo nacional.', 'imagen' => 'https://image.tmdb.org/t/p/w500/cC6Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'El Infierno', 'director' => 'Luis Estrada', 'anio' => 2010, 'genero' => 'Accion', 'sinopsis' => 'Un migrante deportado entra al mundo del crimen organizado.', 'imagen' => 'https://image.tmdb.org/t/p/w500/dD7Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'La Camarista', 'director' => 'Lila Aviles', 'anio' => 2018, 'genero' => 'Drama', 'sinopsis' => 'Una trabajadora de hotel busca oportunidades en medio de una rutina exigente.', 'imagen' => 'https://image.tmdb.org/t/p/w500/eE8Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'Hasta los Dientes', 'director' => 'Alberto Arnaut', 'anio' => 2018, 'genero' => 'Documental', 'sinopsis' => 'Investigacion sobre una injusticia cometida contra estudiantes del Tec de Monterrey.', 'imagen' => 'https://image.tmdb.org/t/p/w500/fF9Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
            ['titulo' => 'Ana y Bruno', 'director' => 'Carlos Carrera', 'anio' => 2017, 'genero' => 'Animacion', 'sinopsis' => 'Una nina emprende una aventura para ayudar a su madre.', 'imagen' => 'https://image.tmdb.org/t/p/w500/gG0Z3nQ2KxY7nQ21R0Qz5Z2KxY7.jpg'],
        ];

        $peliculas = collect($peliculasDatos)->mapWithKeys(function (array $pelicula, int $index) use ($admin, $moderador, $generos) {
            $publicador = $index % 3 === 0 ? $moderador : $admin;
            $model = Pelicula::updateOrCreate(
                ['titulo' => $pelicula['titulo']],
                [
                    'director' => $pelicula['director'],
                    'anio' => $pelicula['anio'],
                    'sinopsis' => $pelicula['sinopsis'],
                    'imagen' => $pelicula['imagen'],
                    'genero_id' => $generos[$pelicula['genero']]->id,
                    'usuario_id' => $publicador->id,
                ]
            );

            return [$pelicula['titulo'] => $model];
        });

        $resenasDatos = [
            ['email' => 'user@cinemaito.com', 'pelicula' => 'Amores Perros', 'calificacion' => 9.5, 'comentario' => 'Una pelicula intensa que se siente viva desde la primera escena.'],
            ['email' => 'ana@cinemaito.com', 'pelicula' => 'Roma', 'calificacion' => 9.7, 'comentario' => 'Visualmente hermosa y con una mirada muy humana.'],
            ['email' => 'carlos@cinemaito.com', 'pelicula' => 'Macario', 'calificacion' => 9.0, 'comentario' => 'Un clasico con una atmosfera inolvidable.'],
            ['email' => 'diana@cinemaito.com', 'pelicula' => 'Cronos', 'calificacion' => 8.6, 'comentario' => 'Terror elegante con sello muy personal.'],
            ['email' => 'eduardo@cinemaito.com', 'pelicula' => 'Gueros', 'calificacion' => 8.3, 'comentario' => 'Fresca, rara y muy entretenida.'],
            ['email' => 'fernanda@cinemaito.com', 'pelicula' => 'Noche de Fuego', 'calificacion' => 9.2, 'comentario' => 'Dura, sensible y muy bien actuada.'],
            ['email' => 'hilda@cinemaito.com', 'pelicula' => 'Temporada de Patos', 'calificacion' => 8.5, 'comentario' => 'Minimalista, divertida y llena de detalles.'],
            ['email' => 'ivan@cinemaito.com', 'pelicula' => 'La Jaula de Oro', 'calificacion' => 9.1, 'comentario' => 'Una historia necesaria y conmovedora.'],
            ['email' => 'gabriel@cinemaito.com', 'pelicula' => 'Ya No Estoy Aqui', 'calificacion' => 9.4, 'comentario' => 'Tiene identidad, musica y una gran energia visual.'],
            ['email' => 'user@cinemaito.com', 'pelicula' => 'Sueno en Otro Idioma', 'calificacion' => 8.7, 'comentario' => 'Una propuesta poetica sobre memoria y lenguaje.'],
            ['email' => 'ana@cinemaito.com', 'pelicula' => 'Museo', 'calificacion' => 8.4, 'comentario' => 'Muy buen ritmo y una historia atrapante.'],
            ['email' => 'carlos@cinemaito.com', 'pelicula' => 'El Infierno', 'calificacion' => 8.8, 'comentario' => 'Satira fuerte, incomoda y efectiva.'],
            ['email' => 'diana@cinemaito.com', 'pelicula' => 'La Camarista', 'calificacion' => 8.9, 'comentario' => 'Sencilla en apariencia, pero muy poderosa.'],
            ['email' => 'eduardo@cinemaito.com', 'pelicula' => 'Hasta los Dientes', 'calificacion' => 9.0, 'comentario' => 'Un documental claro, doloroso y necesario.'],
            ['email' => 'fernanda@cinemaito.com', 'pelicula' => 'Ana y Bruno', 'calificacion' => 8.0, 'comentario' => 'Una aventura animada con buen corazon.'],
        ];

        foreach ($resenasDatos as $resena) {
            Resena::updateOrCreate(
                [
                    'usuario_id' => $users[$resena['email']]->id,
                    'pelicula_id' => $peliculas[$resena['pelicula']]->id,
                ],
                [
                    'comentario' => $resena['comentario'],
                    'calificacion' => $resena['calificacion'],
                ]
            );
        }

        $favoritosDatos = [
            ['email' => 'user@cinemaito.com', 'pelicula' => 'Roma'],
            ['email' => 'user@cinemaito.com', 'pelicula' => 'Macario'],
            ['email' => 'ana@cinemaito.com', 'pelicula' => 'Amores Perros'],
            ['email' => 'ana@cinemaito.com', 'pelicula' => 'La Camarista'],
            ['email' => 'carlos@cinemaito.com', 'pelicula' => 'El Infierno'],
            ['email' => 'carlos@cinemaito.com', 'pelicula' => 'Museo'],
            ['email' => 'diana@cinemaito.com', 'pelicula' => 'Cronos'],
            ['email' => 'diana@cinemaito.com', 'pelicula' => 'Noche de Fuego'],
            ['email' => 'eduardo@cinemaito.com', 'pelicula' => 'Gueros'],
            ['email' => 'eduardo@cinemaito.com', 'pelicula' => 'Ya No Estoy Aqui'],
            ['email' => 'fernanda@cinemaito.com', 'pelicula' => 'Ana y Bruno'],
            ['email' => 'gabriel@cinemaito.com', 'pelicula' => 'Hasta los Dientes'],
            ['email' => 'hilda@cinemaito.com', 'pelicula' => 'Temporada de Patos'],
            ['email' => 'ivan@cinemaito.com', 'pelicula' => 'La Jaula de Oro'],
            ['email' => 'developer@cinemaito.com', 'pelicula' => 'Sueno en Otro Idioma'],
        ];

        foreach ($favoritosDatos as $favorito) {
            Favorito::updateOrCreate([
                'usuario_id' => $users[$favorito['email']]->id,
                'pelicula_id' => $peliculas[$favorito['pelicula']]->id,
            ]);
        }

        $this->call(MexicanMoviesCatalogSeeder::class);
    }
}
