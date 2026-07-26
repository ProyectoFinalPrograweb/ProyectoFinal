import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/StarRating';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { peliculas, resenas, generos } from '../data/mockData';
import './MovieDetailPage.css';

export default function MovieDetailPage() {
  const { id } = useParams();
  const pelicula = peliculas.find(p => p.id === Number(id)) || peliculas[0];
  const genero = generos.find(g => g.id === pelicula.genero_id);
  const peliculaResenas = resenas.filter(r => r.pelicula_id === pelicula.id);
  const relacionadas = peliculas.filter(p => p.id !== pelicula.id && p.genero_id === pelicula.genero_id).slice(0, 6);

  const [enLista, setEnLista] = useState(pelicula.enMiLista || false);
  const [miCalif, setMiCalif] = useState(0);
  const [comentario, setComentario] = useState('');
  const [tab, setTab] = useState('resenas'); // 'resenas' | 'detalles'

  const handleSubmitResena = e => {
    e.preventDefault();
    alert('Reseña enviada al backend próximamente 🎬');
    setComentario('');
    setMiCalif(0);
  };

  return (
    <div className="page-wrapper">
      {/* Hero de la película */}
      <div className="detail-hero">
        <img src={pelicula.imagen} alt={pelicula.titulo} className="detail-hero-img" />
        <div className="detail-hero-overlay" />
      </div>

      <main className="detail-main container">
        {/* Breadcrumb */}
        <div className="detail-breadcrumb animate-fade-in">
          <Link to="/">Inicio</Link>
          <span>›</span>
          <Link to="/explorar">Explorar</Link>
          <span>›</span>
          <span>{pelicula.titulo}</span>
        </div>

        <div className="detail-layout">
          {/* Columna izquierda — Poster */}
          <aside className="detail-poster-col animate-fade-left">
            <div className="detail-poster-wrap">
              <img
                src={pelicula.imagen}
                alt={pelicula.titulo}
                className="detail-poster"
                onError={e => { e.target.src = '/movie_posters.png'; }}
              />
              {pelicula.estreno && (
                <div className="detail-poster-badge">
                  <span className="badge badge-primary">{pelicula.estreno}</span>
                </div>
              )}
            </div>

            {/* Acciones */}
            <div className="detail-actions">
              <button
                className={`btn ${enLista ? 'btn-outline in-list' : 'btn-outline'} detail-action-btn`}
                onClick={() => setEnLista(!enLista)}
              >
                {enLista ? '✓ En Mi Lista' : '+ Mi Lista'}
              </button>
              <button className="btn btn-ghost detail-share-btn">🔗 Compartir</button>
            </div>

            {/* Mini stats */}
            <div className="detail-mini-stats">
              <div className="mini-stat">
                <span className="mini-stat-label">Calificación</span>
                <span className="mini-stat-value rating-badge">{pelicula.calificacion_promedio}</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Vistas</span>
                <span className="mini-stat-value">{pelicula.vistas?.toLocaleString()}</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Reseñas</span>
                <span className="mini-stat-value">{peliculaResenas.length}</span>
              </div>
            </div>
          </aside>

          {/* Columna derecha — Info */}
          <div className="detail-info animate-fade-right">
            {/* Título */}
            <div className="detail-tags">
              {pelicula.tags?.map(tag => (
                <span key={tag} className="badge badge-dark">{tag}</span>
              ))}
              {genero && <span className="badge badge-primary">{genero.nombre}</span>}
            </div>
            <h1 className="detail-title">{pelicula.titulo}</h1>

            <div className="detail-meta">
              <span>{pelicula.anio}</span>
              <span className="meta-dot">·</span>
              <span>{pelicula.duracion}</span>
              <span className="meta-dot">·</span>
              <span>Dir. {pelicula.director}</span>
            </div>

            <StarRating rating={pelicula.calificacion_promedio / 2} max={5} size="lg" />

            <p className="detail-sinopsis">{pelicula.sinopsis}</p>

            <Link to="#" className="btn btn-primary detail-play-btn">
              ▶ Ver Película
            </Link>

            {/* Tabs */}
            <div className="detail-tabs">
              <button
                className={`detail-tab ${tab === 'resenas' ? 'active' : ''}`}
                onClick={() => setTab('resenas')}
              >
                Reseñas ({peliculaResenas.length})
              </button>
              <button
                className={`detail-tab ${tab === 'detalles' ? 'active' : ''}`}
                onClick={() => setTab('detalles')}
              >
                Detalles
              </button>
            </div>

            {/* Reseñas */}
            {tab === 'resenas' && (
              <div className="detail-resenas animate-fade-in">
                {/* Formulario */}
                <form className="resena-form" onSubmit={handleSubmitResena}>
                  <h4>Escribe tu reseña</h4>
                  <StarRating
                    rating={miCalif}
                    max={5}
                    size="lg"
                    interactive
                    onChange={setMiCalif}
                  />
                  <textarea
                    className="form-input resena-textarea"
                    placeholder="¿Qué te pareció esta película? Comparte tu opinión..."
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    rows={3}
                  />
                  <button type="submit" className="btn btn-primary resena-submit-btn">
                    Publicar Reseña
                  </button>
                </form>

                <div className="divider" />

                {/* Lista de reseñas */}
                {peliculaResenas.length === 0 ? (
                  <p className="no-resenas">Sé el primero en escribir una reseña 🎬</p>
                ) : (
                  peliculaResenas.map(r => (
                    <div key={r.id} className="resena-card">
                      <div className="resena-header">
                        <div className="resena-avatar">{r.usuario.avatar}</div>
                        <div>
                          <span className="resena-nombre">{r.usuario.nombre}</span>
                          <span className="resena-fecha">{r.fecha}</span>
                        </div>
                        <StarRating rating={r.calificacion} max={5} size="sm" />
                      </div>
                      <p className="resena-comentario">{r.comentario}</p>
                      <div className="resena-footer">
                        <button className="btn btn-ghost resena-like-btn">♥ {r.likes}</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Detalles técnicos */}
            {tab === 'detalles' && (
              <div className="detail-tecnicos animate-fade-in">
                <div className="tecnico-row">
                  <span className="tecnico-label">Director</span>
                  <span className="tecnico-value">{pelicula.director}</span>
                </div>
                <div className="tecnico-row">
                  <span className="tecnico-label">Año</span>
                  <span className="tecnico-value">{pelicula.anio}</span>
                </div>
                <div className="tecnico-row">
                  <span className="tecnico-label">Duración</span>
                  <span className="tecnico-value">{pelicula.duracion}</span>
                </div>
                <div className="tecnico-row">
                  <span className="tecnico-label">Género</span>
                  <span className="tecnico-value">{genero?.nombre}</span>
                </div>
                <div className="tecnico-row">
                  <span className="tecnico-label">País</span>
                  <span className="tecnico-value">México 🇲🇽</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Relacionadas */}
        {relacionadas.length > 0 && (
          <section className="detail-relacionadas animate-fade-in">
            <div className="section-header">
              <h2>Películas relacionadas</h2>
            </div>
            <div className="scroll-row">
              {relacionadas.map(p => (
                <MovieCard key={p.id} pelicula={p} />
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
