import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { peliculas, generos, proximosEstrenos } from '../data/mockData';
import './ExplorarPage.css';

export default function ExplorarPage() {
  const [search, setSearch]     = useState('');
  const [generoId, setGeneroId] = useState(0);
  const [orden, setOrden]       = useState('calificacion');

  const filtradas = peliculas
    .filter(p => {
      const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase()) ||
                          p.director.toLowerCase().includes(search.toLowerCase());
      const matchGenero = generoId === 0 ? true : p.genero_id === generoId;
      return matchSearch && matchGenero;
    })
    .sort((a, b) => {
      if (orden === 'calificacion') return b.calificacion_promedio - a.calificacion_promedio;
      if (orden === 'vistas')       return b.vistas - a.vistas;
      if (orden === 'recientes')    return b.anio - a.anio;
      return 0;
    });

  return (
    <div className="page-wrapper">
      <main className="explorar-page container">

        {/* Header */}
        <div className="explorar-header animate-fade-in">
          <div>
            <h1>Explorar Películas</h1>
            <p>Descubre todo el catálogo de cine mexicano de Cinema ITO.</p>
          </div>
        </div>

        {/* Próximos estrenos — banner */}
        <section className="explorar-estrenos animate-fade-in delay-100">
          <div className="section-header">
            <h2>🎬 Próximos Estrenos</h2>
            <Link to="/cartelera" className="ver-todas">Ver cartelera →</Link>
          </div>
          <div className="estrenos-scroll scroll-row">
            {proximosEstrenos.map(e => (
              <div key={e.id} className="estreno-card">
                <div className="estreno-img-wrap">
                  <img src={e.imagen} alt={e.titulo} onError={el => { el.target.src='/movie_posters.png'; }} />
                  <div className="estreno-overlay">
                    {e.tags.map(t => <span key={t} className="badge badge-primary">{t}</span>)}
                  </div>
                </div>
                <div className="estreno-info">
                  <h4>{e.titulo}</h4>
                  <p className="estreno-fecha">📅 {e.fecha_estreno}</p>
                  <p className="estreno-sinopsis">{e.sinopsis.slice(0, 90)}...</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Controles de búsqueda */}
        <div className="explorar-controls animate-fade-in delay-200">
          <div className="explorar-search input-icon-wrap">
            <span className="icon">🔍</span>
            <input
              id="explorar-search"
              type="text"
              className="form-input"
              placeholder="Buscar por título, director..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select
            className="form-input explorar-select"
            value={generoId}
            onChange={e => setGeneroId(Number(e.target.value))}
          >
            <option value={0}>Todos los géneros</option>
            {generos.map(g => (
              <option key={g.id} value={g.id}>{g.nombre}</option>
            ))}
          </select>

          <select
            className="form-input explorar-select"
            value={orden}
            onChange={e => setOrden(e.target.value)}
          >
            <option value="calificacion">Mejor calificadas</option>
            <option value="vistas">Más vistas</option>
            <option value="recientes">Más recientes</option>
          </select>
        </div>

        {/* Resultados */}
        <div className="explorar-results animate-fade-in delay-300">
          <p className="results-count">{filtradas.length} películas encontradas</p>
          {filtradas.length === 0 ? (
            <div className="mylist-empty">
              <div className="empty-icon">🎬</div>
              <h3>Sin resultados</h3>
              <p>No encontramos películas con esos filtros.</p>
            </div>
          ) : (
            <div className="explorar-grid">
              {filtradas.map(p => (
                <MovieCard key={p.id} pelicula={p} />
              ))}
            </div>
          )}
        </div>

      </main>
      <Footer />
    </div>
  );
}
