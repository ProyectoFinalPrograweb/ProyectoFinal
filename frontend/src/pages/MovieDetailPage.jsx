import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import StarRating from '../components/StarRating';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { apiRequest, getCurrentUser } from '../services/api';
import './MovieDetailPage.css';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pelicula, setPelicula] = useState(null);
  const [enLista, setEnLista] = useState(false);
  const [miCalif, setMiCalif] = useState(0);
  const [comentario, setComentario] = useState('');
  const [tab, setTab] = useState('resenas');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const user = getCurrentUser();

  const loadPelicula = () => {
    setLoading(true);
    apiRequest(`/peliculas/${id}`)
      .then(response => {
        setPelicula(response.data);
        setEnLista(false);
      })
      .catch(() => setMessage({ type: 'error', text: 'No se pudo cargar la pelicula.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPelicula();
  }, [id]);

  const handleToggleFavorito = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/peliculas/${id}/favorito`, {
        method: 'POST',
      });
      setEnLista(response.enMiLista);
      setMessage({ type: 'success', text: response.message });
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleSubmitResena = async e => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await apiRequest(`/peliculas/${id}/resenas`, {
        method: 'POST',
        body: JSON.stringify({
          comentario,
          calificacion: miCalif,
        }),
      });
      setComentario('');
      setMiCalif(0);
      setMessage({ type: 'success', text: 'Resena guardada correctamente.' });
      loadPelicula();
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  if (loading) {
    return <div className="page-wrapper"><main className="detail-main container"><p>Cargando pelicula...</p></main></div>;
  }

  if (!pelicula) {
    return <div className="page-wrapper"><main className="detail-main container"><p>No se encontro la pelicula.</p></main></div>;
  }

  const peliculaResenas = pelicula.resenas || [];
  const relacionadas = pelicula.relacionadas || [];

  return (
    <div className="page-wrapper">
      <div className="detail-hero">
        <img src={pelicula.imagen} alt={pelicula.titulo} className="detail-hero-img" onError={e => { e.target.src = '/hero_banner.png'; }} />
        <div className="detail-hero-overlay" />
      </div>

      <main className="detail-main container">
        <div className="detail-breadcrumb animate-fade-in">
          <Link to="/">Inicio</Link>
          <span>/</span>
          <Link to="/explorar">Explorar</Link>
          <span>/</span>
          <span>{pelicula.titulo}</span>
        </div>

        {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

        <div className="detail-layout">
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

            <div className="detail-actions">
              <button className={`btn ${enLista ? 'btn-outline in-list' : 'btn-outline'} detail-action-btn`} onClick={handleToggleFavorito}>
                {enLista ? 'En Mi Lista' : '+ Mi Lista'}
              </button>
              <button className="btn btn-ghost detail-share-btn">Compartir</button>
            </div>

            <div className="detail-mini-stats">
              <div className="mini-stat">
                <span className="mini-stat-label">Calificacion</span>
                <span className="mini-stat-value rating-badge">{pelicula.calificacion_promedio}</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Guardadas</span>
                <span className="mini-stat-value">{pelicula.vistas}</span>
              </div>
              <div className="mini-stat">
                <span className="mini-stat-label">Resenas</span>
                <span className="mini-stat-value">{peliculaResenas.length}</span>
              </div>
            </div>
          </aside>

          <div className="detail-info animate-fade-right">
            <div className="detail-tags">
              {pelicula.tags?.map(tag => <span key={tag} className="badge badge-dark">{tag}</span>)}
              {pelicula.genero && <span className="badge badge-primary">{pelicula.genero}</span>}
            </div>
            <h1 className="detail-title">{pelicula.titulo}</h1>

            <div className="detail-meta">
              <span>{pelicula.anio}</span>
              <span className="meta-dot">-</span>
              <span>{pelicula.duracion}</span>
              <span className="meta-dot">-</span>
              <span>Dir. {pelicula.director}</span>
            </div>

            <StarRating rating={pelicula.calificacion_promedio / 2} max={5} size="lg" />
            <p className="detail-sinopsis">{pelicula.sinopsis}</p>

            <div className="detail-tabs">
              <button className={`detail-tab ${tab === 'resenas' ? 'active' : ''}`} onClick={() => setTab('resenas')}>
                Resenas ({peliculaResenas.length})
              </button>
              <button className={`detail-tab ${tab === 'detalles' ? 'active' : ''}`} onClick={() => setTab('detalles')}>
                Detalles
              </button>
            </div>

            {tab === 'resenas' && (
              <div className="detail-resenas animate-fade-in">
                <form className="resena-form" onSubmit={handleSubmitResena}>
                  <h4>Escribe tu resena</h4>
                  <StarRating rating={miCalif} max={5} size="lg" interactive onChange={setMiCalif} />
                  <textarea
                    className="form-input resena-textarea"
                    placeholder="Que te parecio esta pelicula?"
                    value={comentario}
                    onChange={e => setComentario(e.target.value)}
                    rows={3}
                    required
                  />
                  <button type="submit" className="btn btn-primary resena-submit-btn">
                    Publicar Resena
                  </button>
                </form>

                <div className="divider" />

                {peliculaResenas.length === 0 ? (
                  <p className="no-resenas">Se el primero en escribir una resena.</p>
                ) : (
                  peliculaResenas.map(r => (
                    <div key={r.id} className="resena-card">
                      <div className="resena-header">
                        <div className="resena-avatar">
                          {r.usuario.avatar ? <img src={r.usuario.avatar} alt={r.usuario.nombre} /> : r.usuario.iniciales}
                        </div>
                        <div>
                          <span className="resena-nombre">{r.usuario.nombre}</span>
                          <span className="resena-fecha">{r.fecha}</span>
                        </div>
                        <StarRating rating={r.calificacion} max={5} size="sm" />
                      </div>
                      <p className="resena-comentario">{r.comentario}</p>
                    </div>
                  ))
                )}
              </div>
            )}

            {tab === 'detalles' && (
              <div className="detail-tecnicos animate-fade-in">
                <div className="tecnico-row"><span className="tecnico-label">Director</span><span className="tecnico-value">{pelicula.director}</span></div>
                <div className="tecnico-row"><span className="tecnico-label">Anio</span><span className="tecnico-value">{pelicula.anio}</span></div>
                <div className="tecnico-row"><span className="tecnico-label">Duracion</span><span className="tecnico-value">{pelicula.duracion}</span></div>
                <div className="tecnico-row"><span className="tecnico-label">Genero</span><span className="tecnico-value">{pelicula.genero}</span></div>
                <div className="tecnico-row"><span className="tecnico-label">Pais</span><span className="tecnico-value">Mexico</span></div>
              </div>
            )}
          </div>
        </div>

        {relacionadas.length > 0 && (
          <section className="detail-relacionadas animate-fade-in">
            <div className="section-header"><h2>Peliculas relacionadas</h2></div>
            <div className="scroll-row">
              {relacionadas.map(p => <MovieCard key={p.id} pelicula={p} />)}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
