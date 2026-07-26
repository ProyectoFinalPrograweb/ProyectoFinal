import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

export default function HeroSection({ pelicula }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  if (!pelicula) return null;

  return (
    <section className="hero">
      {/* Imagen de fondo */}
      <div className="hero-bg">
        <img
          src={pelicula.imagen}
          alt={pelicula.titulo}
          className="hero-bg-img"
          onError={e => { e.target.src = '/hero_banner.png'; }}
        />
        <div className="hero-bg-overlay" />
      </div>

      {/* Contenido */}
      <div className={`hero-content container ${loaded ? 'hero-loaded' : ''}`}>
        {/* Badges */}
        <div className="hero-badges">
          {pelicula.estreno && <span className="badge badge-primary">{pelicula.estreno}</span>}
          {pelicula.tags?.map(tag => (
            <span key={tag} className="badge badge-dark">{tag}</span>
          ))}
        </div>

        {/* Título */}
        <h1 className="hero-title">{pelicula.titulo}</h1>

        {/* Info rápida */}
        <div className="hero-meta">
          <span className="rating-badge hero-rating">⭐ {pelicula.calificacion_promedio}</span>
          <span className="hero-meta-item">{pelicula.anio}</span>
          <span className="hero-meta-dot">·</span>
          <span className="hero-meta-item">{pelicula.duracion}</span>
          <span className="hero-meta-dot">·</span>
          <span className="hero-meta-item">{pelicula.director}</span>
        </div>

        {/* Sinopsis */}
        <p className="hero-sinopsis">{pelicula.sinopsis}</p>

        {/* Botones */}
        <div className="hero-actions">
          <Link to={`/pelicula/${pelicula.id}`} className="btn btn-primary hero-btn-play">
            ▶ Reproducir
          </Link>
          <button className="btn btn-outline hero-btn-list">
            + Mi Lista
          </button>
        </div>
      </div>

      {/* Gradiente inferior */}
      <div className="hero-bottom-fade" />
    </section>
  );
}
