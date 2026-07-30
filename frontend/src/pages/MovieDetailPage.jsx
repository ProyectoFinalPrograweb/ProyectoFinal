import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import StarRating from '../components/StarRating';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { apiRequest, getCurrentUser } from '../services/api';
import './MovieDetailPage.css';

export default function MovieDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [pelicula, setPelicula] = useState(null);
  const [enLista, setEnLista] = useState(false);
  const [miCalif, setMiCalif] = useState(0);
  const [comentario, setComentario] = useState('');
  const [replyForms, setReplyForms] = useState({});
  const [tab, setTab] = useState('resenas');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const user = getCurrentUser();

  const loadPelicula = () => {
    setLoading(true);
    apiRequest(`/peliculas/${id}`)
      .then(response => {
        setPelicula(response.data);
        setEnLista(Boolean(response.data?.enMiLista));
      })
      .catch(() => setMessage({ type: 'error', text: 'No se pudo cargar la pelicula.' }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadPelicula();
  }, [id]);

  useEffect(() => {
    if (loading || !pelicula || !location.hash.startsWith('#resena-')) return;

    setTab('resenas');

    window.requestAnimationFrame(() => {
      const target = document.querySelector(location.hash);
      target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }, [loading, pelicula, location.hash]);

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

  const handleShare = async () => {
    const url = window.location.href;

    try {
      await navigator.clipboard.writeText(url);
      setMessage({ type: 'success', text: 'Link copiado al portapapeles.' });
    } catch (error) {
      setMessage({ type: 'error', text: 'No se pudo copiar el link de la pelicula.' });
    }

    window.setTimeout(() => {
      setMessage(null);
    }, 2500);
  };

  const handleSubmitResena = async e => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    const comentarioLimpio = comentario.trim();

    if (miCalif < 1) {
      setMessage({ type: 'error', text: 'Selecciona una calificacion antes de publicar tu resena.' });
      return;
    }

    if (comentarioLimpio.length < 5) {
      setMessage({ type: 'error', text: 'Escribe al menos 5 caracteres en tu resena.' });
      return;
    }

    try {
      await apiRequest(`/peliculas/${id}/resenas`, {
        method: 'POST',
        body: JSON.stringify({
          comentario: comentarioLimpio,
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

  const handleReactResena = async (resenaId, tipo) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/resenas/${resenaId}/reaccion`, {
        method: 'POST',
        body: JSON.stringify({ tipo }),
      });

      setPelicula(current => ({
        ...current,
        resenas: (current.resenas || []).map(resena => (
          resena.id === resenaId
            ? { ...resena, likes: response.likes, dislikes: response.dislikes, mi_reaccion: response.mi_reaccion }
            : resena
        )),
      }));
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
  };

  const handleReplyChange = (resenaId, value) => {
    setReplyForms(current => ({ ...current, [resenaId]: value }));
  };

  const handleReplyResena = async (event, resenaId) => {
    event.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    const comentarioRespuesta = (replyForms[resenaId] || '').trim();
    if (!comentarioRespuesta) return;

    try {
      const response = await apiRequest(`/resenas/${resenaId}/respuestas`, {
        method: 'POST',
        body: JSON.stringify({ comentario: comentarioRespuesta }),
      });

      setPelicula(current => ({
        ...current,
        resenas: (current.resenas || []).map(resena => (
          resena.id === resenaId
            ? { ...resena, respuestas: [...(resena.respuestas || []), response.data] }
            : resena
        )),
      }));
      setReplyForms(current => ({ ...current, [resenaId]: '' }));
      setMessage({ type: 'success', text: response.message });
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
              <button type="button" className="btn btn-ghost detail-share-btn" onClick={handleShare}>Compartir</button>
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
                    <div key={r.id} id={`resena-${r.id}`} className="resena-card">
                      <div className="resena-header">
                        <Link to={`/usuarios/${r.usuario.id}`} className="resena-avatar">
                          {r.usuario.avatar ? <img src={r.usuario.avatar} alt={r.usuario.nombre} /> : r.usuario.iniciales}
                        </Link>
                        <div>
                          <Link to={`/usuarios/${r.usuario.id}`} className="resena-nombre">{r.usuario.nombre}</Link>
                          <span className="resena-fecha">{r.fecha}</span>
                        </div>
                        <StarRating rating={r.calificacion} max={5} size="sm" />
                      </div>
                      <p className="resena-comentario">{r.comentario}</p>
                      <div className="resena-actions-row">
                        <button
                          type="button"
                          className={`resena-reaction-btn ${r.mi_reaccion === 'like' ? 'active' : ''}`}
                          onClick={() => handleReactResena(r.id, 'like')}
                        >
                          Like {r.likes || 0}
                        </button>
                        <button
                          type="button"
                          className={`resena-reaction-btn ${r.mi_reaccion === 'dislike' ? 'active' : ''}`}
                          onClick={() => handleReactResena(r.id, 'dislike')}
                        >
                          Dislike {r.dislikes || 0}
                        </button>
                      </div>

                      {(r.respuestas || []).length > 0 && (
                        <div className="resena-respuestas">
                          {(r.respuestas || []).map(respuesta => (
                            <div key={respuesta.id} className="resena-respuesta">
                              <Link to={`/usuarios/${respuesta.usuario.id}`} className="resena-respuesta-avatar">
                                {respuesta.usuario.avatar ? <img src={respuesta.usuario.avatar} alt={respuesta.usuario.nombre} /> : respuesta.usuario.iniciales}
                              </Link>
                              <div>
                                <Link to={`/usuarios/${respuesta.usuario.id}`} className="resena-respuesta-nombre">{respuesta.usuario.nombre}</Link>
                                <span className="resena-fecha">{respuesta.fecha}</span>
                                <p>{respuesta.comentario}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      <form className="resena-reply-form" onSubmit={event => handleReplyResena(event, r.id)}>
                        <input
                          className="form-input"
                          value={replyForms[r.id] || ''}
                          onChange={event => handleReplyChange(r.id, event.target.value)}
                          placeholder={user ? 'Responder a esta resena...' : 'Inicia sesion para responder'}
                        />
                        <button type="submit" className="btn btn-outline">Responder</button>
                      </form>
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
