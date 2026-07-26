// ============================================================
// CINEMA ITO — Datos de ejemplo (mock)
// Cuando el backend esté listo, reemplazar estos datos
// por llamadas reales a la API de Laravel.
// ============================================================

export const generos = [
  { id: 1, nombre: "Drama" },
  { id: 2, nombre: "Thriller" },
  { id: 3, nombre: "Comedia" },
  { id: 4, nombre: "Acción" },
  { id: 5, nombre: "Terror" },
  { id: 6, nombre: "Documental" },
  { id: 7, nombre: "Animación" },
  { id: 8, nombre: "Romance" },
];

export const peliculas = [
  {
    id: 1,
    titulo: "Cempasúchil",
    director: "Alejandra Ramírez",
    anio: 2024,
    sinopsis:
      "Una historia de raíz y memoria que sigue a una familia oaxaqueña a través de tres generaciones, unidas por la tradición del Día de Muertos y los secretos que guarda la tierra.",
    imagen: "/movie_posters.png",
    genero_id: 1,
    calificacion_promedio: 9.5,
    vistas: 3420,
    duracion: "2h 14min",
    estreno: "Estreno Exclusivo",
    tags: ["4K HDR"],
    enMiLista: true,
    vista: true,
  },
  {
    id: 2,
    titulo: "Arena Futura",
    director: "Carlos Mendoza",
    anio: 2024,
    sinopsis:
      "En un México distópico del año 2089, una luchadora cibernética busca vengar la muerte de su maestro y descubre una conspiración que amenaza a toda la humanidad.",
    imagen: "/movie_posters.png",
    genero_id: 4,
    calificacion_promedio: 9.2,
    vistas: 5100,
    duracion: "1h 58min",
    estreno: "Premiere",
    tags: ["Acción"],
    enMiLista: true,
    vista: false,
  },
  {
    id: 3,
    titulo: "Cosmos Azteca",
    director: "Sofía Hernández",
    anio: 2023,
    sinopsis:
      "Una arqueóloga descubre una antigua tecnología oculta bajo las pirámides de Teotihuacán que abre un portal a otra dimensión, poniendo en jaque la historia de México.",
    imagen: "/movie_posters.png",
    genero_id: 2,
    calificacion_promedio: 8.8,
    vistas: 4200,
    duracion: "2h 02min",
    estreno: null,
    tags: ["Ciencia Ficción"],
    enMiLista: false,
    vista: true,
  },
  {
    id: 4,
    titulo: "Corazón de Agave",
    director: "Roberto Silva",
    anio: 2023,
    sinopsis:
      "Un romance que nace entre los magueyes de Oaxaca. Dos almas opuestas se enamoran durante la cosecha del mezcal, enfrentando las tradiciones de sus familias rivales.",
    imagen: "/movie_posters.png",
    genero_id: 8,
    calificacion_promedio: 8.0,
    vistas: 2800,
    duracion: "1h 45min",
    estreno: null,
    tags: ["Romance"],
    enMiLista: false,
    vista: false,
  },
  {
    id: 5,
    titulo: "Ciudad de Sombras",
    director: "Jorge Villanueva",
    anio: 2024,
    sinopsis:
      "Tres vidas colisionan en una noche de neón y traición en las implacables calles de la capital. Un thriller visceral que redefine el cine negro contemporáneo.",
    imagen: "/hero_banner.png",
    genero_id: 2,
    calificacion_promedio: 9.8,
    vistas: 7600,
    duracion: "2h 20min",
    estreno: "Estreno Exclusivo",
    tags: ["4K HDR", "Noche de estreno"],
    enMiLista: false,
    vista: false,
    esHero: true,
  },
  {
    id: 6,
    titulo: "Callejón de los Lamentos",
    director: "Patricia Flores",
    anio: 2022,
    sinopsis:
      "Un detective retirado investiga la desaparición de jóvenes artistas en el corazón del Centro Histórico de la Ciudad de México.",
    imagen: "/movie_posters.png",
    genero_id: 2,
    calificacion_promedio: 8.5,
    vistas: 3100,
    duracion: "1h 52min",
    estreno: null,
    tags: ["Thriller"],
    enMiLista: true,
    vista: true,
  },
  {
    id: 7,
    titulo: "La Leyenda No Muere",
    director: "Eduardo Pérez",
    anio: 2024,
    sinopsis:
      "La historia épica de una figura legendaria de la lucha libre mexicana que regresa del retiro para enfrentar un último combate y defender su honor.",
    imagen: "/movie_posters.png",
    genero_id: 3,
    calificacion_promedio: 7.8,
    vistas: 1900,
    duracion: "1h 39min",
    estreno: null,
    tags: ["Comedia", "Acción"],
    enMiLista: false,
    vista: false,
  },
  {
    id: 8,
    titulo: "Tlatelolco: La Última Voz",
    director: "Mariana Guzmán",
    anio: 2023,
    sinopsis:
      "Un documental que recupera los testimonios perdidos de sobrevivientes de 1968, reconstruyendo la memoria colectiva a través de archivos inéditos.",
    imagen: "/movie_posters.png",
    genero_id: 6,
    calificacion_promedio: 9.1,
    vistas: 2400,
    duracion: "1h 28min",
    estreno: null,
    tags: ["Documental"],
    enMiLista: false,
    vista: false,
  },
];

export const proximosEstrenos = [
  {
    id: 101,
    titulo: "Noche de Catrina",
    director: "Valeria Montoya",
    fecha_estreno: "2024-10-31",
    sinopsis:
      "En la víspera del Día de Muertos, una fotógrafa descubre que las almas que capta en su lente tienen algo urgente que decirle.",
    imagen: "/movie_posters.png",
    genero_id: 5,
    tags: ["Terror", "Sobrenatural"],
  },
  {
    id: 102,
    titulo: "El Mariachi Digital",
    director: "Ignacio Reyes",
    fecha_estreno: "2024-11-15",
    sinopsis:
      "Una comedia futurista donde la inteligencia artificial intenta aprender las tradiciones musicales de México para salvar una boda.",
    imagen: "/movie_posters.png",
    genero_id: 3,
    tags: ["Comedia", "Música"],
  },
  {
    id: 103,
    titulo: "Sierra Tarahumara",
    director: "Gabriela Torres",
    fecha_estreno: "2024-12-01",
    sinopsis:
      "Un drama íntimo sobre una corredora rarámuri que participa en una ultramaratón internacional llevando en sus pies el peso de su comunidad.",
    imagen: "/movie_posters.png",
    genero_id: 1,
    tags: ["Drama", "Deportes"],
  },
];

export const resenas = [
  {
    id: 1,
    usuario: { nombre: "Valeria M.", avatar: "VM" },
    pelicula_id: 1,
    comentario:
      "Una obra maestra del cine contemporáneo mexicano. Las actuaciones son desgarradoras y la fotografía es simplemente sublime. La escena del altar me dejó sin palabras.",
    calificacion: 5,
    fecha: "2024-08-10",
    likes: 42,
  },
  {
    id: 2,
    usuario: { nombre: "Carlos R.", avatar: "CR" },
    pelicula_id: 1,
    comentario:
      "Hermosa, dolorosa y necesaria. El cine mexicano necesitaba esta película. La dirección de Alejandra Ramírez es impecable, cada cuadro es una pintura.",
    calificacion: 5,
    fecha: "2024-08-12",
    likes: 28,
  },
  {
    id: 3,
    usuario: { nombre: "Sofía L.", avatar: "SL" },
    pelicula_id: 1,
    comentario:
      "Me hizo llorar tres veces. La música original es increíble, perfectamente integrada con la narrativa visual. Sin duda en mi top 5 del año.",
    calificacion: 4,
    fecha: "2024-08-15",
    likes: 19,
  },
];

export const usuarioActual = {
  id: 1,
  nombre: "Angel Gabriel",
  email: "angel@ito.mx",
  avatar: "AG",
  rol: "Cinéfilo",
  bio: "Apasionado del cine mexicano, buscando las historias que el mundo merece ver.",
  peliculas_vistas: 47,
  listas: 3,
  seguidores: 128,
  siguiendo: 64,
  fecha_registro: "2024-01-15",
};

export const estadisticas = {
  peliculas_vistas: 47,
  horas_de_cine: 94,
  calificacion_promedio: 8.3,
  genero_favorito: "Thriller",
  director_favorito: "Jorge Villanueva",
};
