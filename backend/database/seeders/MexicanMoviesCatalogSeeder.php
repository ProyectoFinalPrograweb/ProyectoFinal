<?php

namespace Database\Seeders;

use App\Models\Genero;
use App\Models\Pelicula;
use App\Models\User;
use App\Services\MovieApiService;
use Illuminate\Database\Seeder;

class MexicanMoviesCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $movieApiService = app(MovieApiService::class);
        $admin = User::where('email', 'admin@cinemaito.com')->first() ?? User::firstOrFail();

        $generos = Genero::all()->keyBy('nombre');
        $fallbackGenero = $generos['Drama'] ?? Genero::firstOrCreate(
            ['nombre' => 'Drama'],
            ['descripcion' => 'Historias centradas en conflictos humanos y sociales']
        );

        $movies = [
            ['titulo' => 'Los Olvidados', 'director' => 'Luis Bunuel', 'anio' => 1950, 'genero' => 'Drama', 'sinopsis' => 'Un retrato duro de jovenes marginados en la Ciudad de Mexico.'],
            ['titulo' => 'El Angel Exterminador', 'director' => 'Luis Bunuel', 'anio' => 1962, 'genero' => 'Fantasia', 'sinopsis' => 'Un grupo de invitados descubre que no puede abandonar una mansion despues de una cena.'],
            ['titulo' => 'Nazarín', 'director' => 'Luis Bunuel', 'anio' => 1959, 'genero' => 'Drama', 'sinopsis' => 'Un sacerdote intenta vivir de acuerdo con sus ideales en un entorno hostil.'],
            ['titulo' => 'Simon del Desierto', 'director' => 'Luis Bunuel', 'anio' => 1965, 'genero' => 'Comedia', 'sinopsis' => 'Un asceta enfrenta tentaciones y absurdos desde lo alto de una columna.'],
            ['titulo' => 'El', 'director' => 'Luis Bunuel', 'anio' => 1953, 'genero' => 'Drama', 'sinopsis' => 'Un hombre obsesivo transforma su matrimonio en una experiencia opresiva.'],
            ['titulo' => 'Maria Candelaria', 'director' => 'Emilio Fernandez', 'anio' => 1944, 'genero' => 'Drama', 'sinopsis' => 'Una joven indigena enfrenta el rechazo social y los prejuicios de su comunidad.'],
            ['titulo' => 'Enamorada', 'director' => 'Emilio Fernandez', 'anio' => 1946, 'genero' => 'Romance', 'sinopsis' => 'Un general revolucionario se enamora de una mujer de fuerte caracter.'],
            ['titulo' => 'La Perla', 'director' => 'Emilio Fernandez', 'anio' => 1947, 'genero' => 'Drama', 'sinopsis' => 'El hallazgo de una perla altera la vida de una familia humilde.'],
            ['titulo' => 'Rio Escondido', 'director' => 'Emilio Fernandez', 'anio' => 1948, 'genero' => 'Drama', 'sinopsis' => 'Una maestra llega a un pueblo dominado por el abuso de poder.'],
            ['titulo' => 'Salon Mexico', 'director' => 'Emilio Fernandez', 'anio' => 1949, 'genero' => 'Drama', 'sinopsis' => 'Una bailarina de cabaret intenta proteger el futuro de su hermana.'],
            ['titulo' => 'Aventurera', 'director' => 'Alberto Gout', 'anio' => 1950, 'genero' => 'Drama', 'sinopsis' => 'Una mujer marcada por la traicion busca sobrevivir en el mundo nocturno.'],
            ['titulo' => 'El Rey del Barrio', 'director' => 'Gilberto Martinez Solares', 'anio' => 1950, 'genero' => 'Comedia', 'sinopsis' => 'Un lider de barrio combina picardia, musica y enredos comicos.'],
            ['titulo' => 'Ahí Esta el Detalle', 'director' => 'Juan Bustillo Oro', 'anio' => 1940, 'genero' => 'Comedia', 'sinopsis' => 'Un malentendido convierte a un hombre comun en sospechoso de asesinato.'],
            ['titulo' => 'El Padrecito', 'director' => 'Miguel M. Delgado', 'anio' => 1964, 'genero' => 'Comedia', 'sinopsis' => 'Un joven sacerdote llega a un pueblo y transforma a sus habitantes con humor.'],
            ['titulo' => 'El Bolero de Raquel', 'director' => 'Miguel M. Delgado', 'anio' => 1957, 'genero' => 'Comedia', 'sinopsis' => 'Un bolero se hace cargo de un niño mientras intenta resolver su vida.'],
            ['titulo' => 'Dos Tipos de Cuidado', 'director' => 'Ismael Rodriguez', 'anio' => 1953, 'genero' => 'Comedia', 'sinopsis' => 'Dos amigos se enfrentan entre canciones, rivalidades y malentendidos.'],
            ['titulo' => 'Nosotros los Pobres', 'director' => 'Ismael Rodriguez', 'anio' => 1948, 'genero' => 'Drama', 'sinopsis' => 'Una familia de barrio enfrenta pobreza, injusticia y la fuerza de sus lazos.'],
            ['titulo' => 'Ustedes los Ricos', 'director' => 'Ismael Rodriguez', 'anio' => 1948, 'genero' => 'Drama', 'sinopsis' => 'La continuacion de una historia familiar marcada por dolor y desigualdad.'],
            ['titulo' => 'Pepe el Toro', 'director' => 'Ismael Rodriguez', 'anio' => 1953, 'genero' => 'Drama', 'sinopsis' => 'Pepe enfrenta nuevos retos personales y familiares en el barrio.'],
            ['titulo' => 'Tizoc', 'director' => 'Ismael Rodriguez', 'anio' => 1957, 'genero' => 'Romance', 'sinopsis' => 'Un romance tragico surge entre mundos sociales distintos.'],
            ['titulo' => 'El Esqueleto de la Señora Morales', 'director' => 'Rogelio A. Gonzalez', 'anio' => 1960, 'genero' => 'Comedia', 'sinopsis' => 'Una comedia negra sobre matrimonio, apariencia y crimen.'],
            ['titulo' => 'La Oveja Negra', 'director' => 'Ismael Rodriguez', 'anio' => 1949, 'genero' => 'Drama', 'sinopsis' => 'Un conflicto familiar explora orgullo, tradicion y dolor.'],
            ['titulo' => 'Las Poquianchis', 'director' => 'Felipe Cazals', 'anio' => 1976, 'genero' => 'Drama', 'sinopsis' => 'Recreacion de un caso criminal que sacudio a Mexico.'],
            ['titulo' => 'Canoa', 'director' => 'Felipe Cazals', 'anio' => 1976, 'genero' => 'Suspenso', 'sinopsis' => 'Un grupo de trabajadores es perseguido por una comunidad manipulada por el miedo.'],
            ['titulo' => 'El Apando', 'director' => 'Felipe Cazals', 'anio' => 1976, 'genero' => 'Drama', 'sinopsis' => 'La vida carcelaria revela violencia, corrupcion y desesperacion.'],
            ['titulo' => 'Rojo Amanecer', 'director' => 'Jorge Fons', 'anio' => 1989, 'genero' => 'Drama', 'sinopsis' => 'Una familia vive desde su departamento los sucesos del 2 de octubre de 1968.'],
            ['titulo' => 'El Callejon de los Milagros', 'director' => 'Jorge Fons', 'anio' => 1995, 'genero' => 'Drama', 'sinopsis' => 'Historias cruzadas revelan deseos y conflictos en un barrio popular.'],
            ['titulo' => 'Danzon', 'director' => 'Maria Novaro', 'anio' => 1991, 'genero' => 'Drama', 'sinopsis' => 'Una telefonista emprende un viaje para encontrar a su pareja de baile.'],
            ['titulo' => 'Como Agua para Chocolate', 'director' => 'Alfonso Arau', 'anio' => 1992, 'genero' => 'Romance', 'sinopsis' => 'La cocina, el amor y la tradicion familiar se mezclan con realismo magico.'],
            ['titulo' => 'Sólo con tu Pareja', 'director' => 'Alfonso Cuaron', 'anio' => 1991, 'genero' => 'Comedia', 'sinopsis' => 'Una comedia sobre engaños, miedo y segundas oportunidades.'],
            ['titulo' => 'Y Tu Mama Tambien', 'director' => 'Alfonso Cuaron', 'anio' => 2001, 'genero' => 'Drama', 'sinopsis' => 'Dos amigos emprenden un viaje que cambia su forma de entender la vida.'],
            ['titulo' => 'Japón', 'director' => 'Carlos Reygadas', 'anio' => 2002, 'genero' => 'Drama', 'sinopsis' => 'Un hombre viaja a un pueblo remoto en busca de silencio y final.'],
            ['titulo' => 'Luz Silenciosa', 'director' => 'Carlos Reygadas', 'anio' => 2007, 'genero' => 'Drama', 'sinopsis' => 'Un conflicto amoroso y espiritual surge en una comunidad menonita.'],
            ['titulo' => 'Heli', 'director' => 'Amat Escalante', 'anio' => 2013, 'genero' => 'Drama', 'sinopsis' => 'Una familia es golpeada por la violencia y la corrupcion.'],
            ['titulo' => 'La Region Salvaje', 'director' => 'Amat Escalante', 'anio' => 2016, 'genero' => 'Ciencia ficcion', 'sinopsis' => 'Deseo, violencia y misterio se cruzan alrededor de una presencia inexplicable.'],
            ['titulo' => 'Miss Bala', 'director' => 'Gerardo Naranjo', 'anio' => 2011, 'genero' => 'Suspenso', 'sinopsis' => 'Una aspirante a reina de belleza queda atrapada en una red criminal.'],
            ['titulo' => 'Después de Lucía', 'director' => 'Michel Franco', 'anio' => 2012, 'genero' => 'Drama', 'sinopsis' => 'Una adolescente enfrenta acoso y silencio despues de mudarse con su padre.'],
            ['titulo' => 'Nuevo Orden', 'director' => 'Michel Franco', 'anio' => 2020, 'genero' => 'Suspenso', 'sinopsis' => 'Una boda de elite se convierte en el inicio de una ruptura social violenta.'],
            ['titulo' => 'La Zona', 'director' => 'Rodrigo Pla', 'anio' => 2007, 'genero' => 'Suspenso', 'sinopsis' => 'Una comunidad cerrada reacciona con brutalidad ante una intrusion.'],
            ['titulo' => 'Rudo y Cursi', 'director' => 'Carlos Cuaron', 'anio' => 2008, 'genero' => 'Comedia', 'sinopsis' => 'Dos hermanos futbolistas enfrentan fama, rivalidad y sueños rotos.'],
            ['titulo' => 'No Se Aceptan Devoluciones', 'director' => 'Eugenio Derbez', 'anio' => 2013, 'genero' => 'Comedia', 'sinopsis' => 'Un hombre inmaduro aprende a ser padre despues de recibir una sorpresa inesperada.'],
            ['titulo' => 'Nosotros los Nobles', 'director' => 'Gary Alazraki', 'anio' => 2013, 'genero' => 'Comedia', 'sinopsis' => 'Un padre finge perder su fortuna para dar una leccion a sus hijos.'],
            ['titulo' => 'Guten Tag Ramon', 'director' => 'Jorge Ramirez Suarez', 'anio' => 2013, 'genero' => 'Drama', 'sinopsis' => 'Un joven mexicano viaja a Alemania buscando una oportunidad.'],
            ['titulo' => 'La Dictadura Perfecta', 'director' => 'Luis Estrada', 'anio' => 2014, 'genero' => 'Comedia', 'sinopsis' => 'Una satira sobre medios, politica y fabricacion de imagen publica.'],
            ['titulo' => 'La Ley de Herodes', 'director' => 'Luis Estrada', 'anio' => 1999, 'genero' => 'Comedia', 'sinopsis' => 'Un funcionario descubre el poder y la corrupcion en un pueblo olvidado.'],
            ['titulo' => 'Un Mundo Maravilloso', 'director' => 'Luis Estrada', 'anio' => 2006, 'genero' => 'Comedia', 'sinopsis' => 'Una satira sobre desigualdad, medios y discurso politico.'],
            ['titulo' => 'Bardo', 'director' => 'Alejandro Gonzalez Inarritu', 'anio' => 2022, 'genero' => 'Drama', 'sinopsis' => 'Un periodista y documentalista revisa su memoria, identidad y origen.'],
            ['titulo' => 'Biutiful', 'director' => 'Alejandro Gonzalez Inarritu', 'anio' => 2010, 'genero' => 'Drama', 'sinopsis' => 'Un hombre enfrenta enfermedad, familia y culpa en los margenes de Barcelona.'],
            ['titulo' => 'Chicuarotes', 'director' => 'Gael Garcia Bernal', 'anio' => 2019, 'genero' => 'Drama', 'sinopsis' => 'Dos jovenes buscan escapar de su realidad a traves de decisiones cada vez mas riesgosas.'],
            ['titulo' => 'Los Lobos', 'director' => 'Samuel Kishi', 'anio' => 2019, 'genero' => 'Drama', 'sinopsis' => 'Dos niños mexicanos migrantes esperan a su madre mientras imaginan un mundo nuevo.'],
        ];

        foreach ($movies as $movie) {
            $genero = $generos[$movie['genero']] ?? $fallbackGenero;
            $apiPoster = $movieApiService->getPosterForTitle($movie['titulo']);

            Pelicula::updateOrCreate(
                ['titulo' => $movie['titulo']],
                [
                    'director' => $movie['director'],
                    'anio' => $movie['anio'],
                    'sinopsis' => $movie['sinopsis'],
                    'imagen' => $apiPoster,
                    'genero_id' => $genero->id,
                    'usuario_id' => $admin->id,
                ]
            );
        }
    }
}
