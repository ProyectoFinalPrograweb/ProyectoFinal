import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest, getCurrentUser } from '../services/api';
import './MovieCard.css';

export default function MovieCard({ pelicula, variant = 'default' }) {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(pelicula?.enMiLista || false);
  const user = getCurrentUser();

  if (!pelicula) return null;

  const toggleFavorite = async event => {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      const response = await apiRequest(`/peliculas/${pelicula.id}/favorito`, {
        method: 'POST',
      });
      setLiked(response.enMiLista);
    } catch {
      return;
    }
  };

  if (variant === 'list') {
    return (
      <div className="movie-card-list animate-fade-in">
        <Link to={`/pelicula/${pelicula.id}`} className="card-list-image-wrap">
          <img
            src={pelicula.imagen}
            alt={pelicula.titulo}
            className="card-list-image"
            onError={e => { e.target.src = '/movie_posters.png'; }}
          />
          {pelicula.vista && <span className="card-list-vista-badge">✓ Vista</span>}
          <span className="rating-badge card-list-rating">{pelicula.calificacion_promedio}</span>
        </Link>

        <div className="card-list-info">
          <div className="card-list-header">
            <Link to={`/pelicula/${pelicula.id}`}>
              <h3 className="card-list-title">{pelicula.titulo}</h3>
            </Link>
            <button
              className={`card-list-heart ${liked ? 'active' : ''}`}
              onClick={toggleFavorite}
            >
              {liked ? '♥' : '♡'}
            </button>
          </div>
          <p className="card-list-meta">
            {pelicula.director} · {pelicula.anio} · {pelicula.duracion}
          </p>
          <p className="card-list-sinopsis">{pelicula.sinopsis}</p>
          <div className="card-list-tags">
            {pelicula.tags?.map(tag => (
              <span key={tag} className="badge badge-dark">{tag}</span>
            ))}
          </div>
          <div className="card-list-actions">
            <Link to={`/pelicula/${pelicula.id}`} className="btn btn-primary">
              ▶ Ver Detalles
            </Link>
            <button className={`btn btn-outline ${liked ? 'in-list' : ''}`} onClick={toggleFavorite}>
              {liked ? '✓ En Mi Lista' : '+ Mi Lista'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="movie-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/pelicula/${pelicula.id}`} className="card-image-wrap">
        <img
          src={pelicula.imagen}
          alt={pelicula.titulo}
          className="card-image"
          onError={e => { e.target.src = '/movie_posters.png'; }}
        />

        {/* Overlay con calificación */}
        <div className="card-overlay">
          {pelicula.calificacion_promedio && (
            <span className="rating-badge card-rating">{pelicula.calificacion_promedio}</span>
          )}
          {pelicula.estreno && (
            <span className="badge badge-primary card-estreno">{pelicula.estreno}</span>
          )}
        </div>

        {/* Hover overlay */}
        {hovered && (
          <div className="card-hover-overlay animate-fade-in">
            <div className="card-hover-tags">
              {pelicula.tags?.slice(0, 2).map(tag => (
                <span key={tag} className="badge badge-dark">{tag}</span>
              ))}
            </div>
            <p className="card-hover-sinopsis">{pelicula.sinopsis?.slice(0, 100)}...</p>
            <div className="card-hover-actions">
              <button className="card-play-btn">▶</button>
              <button
                className={`card-list-btn ${liked ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                {liked ? '✓' : '+'}
              </button>
            </div>
          </div>
        )}

        {/* Vista badge */}
        {pelicula.vista && <span className="card-vista-badge">✓</span>}
      </Link>

      <div className="card-info">
        <Link to={`/pelicula/${pelicula.id}`}>
          <h4 className="card-title">{pelicula.titulo}</h4>
        </Link>
        <p className="card-meta">{pelicula.anio} · {pelicula.duracion || 'N/A'}</p>
      </div>
    </div>
  );
}
