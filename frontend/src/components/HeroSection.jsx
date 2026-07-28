import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest, getCurrentUser } from '../services/api';
import './HeroSection.css';

export default function HeroSection({ pelicula, peliculas = [] }) {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const slides = useMemo(
    () => (peliculas.length ? peliculas : pelicula ? [pelicula] : []),
    [pelicula, peliculas]
  );
  const [activeIndex, setActiveIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [likedByMovie, setLikedByMovie] = useState({});
  const activeMovie = slides[activeIndex] || slides[0];
  const activeMovieLiked = Boolean(likedByMovie[activeMovie?.id] ?? activeMovie?.enMiLista);

  useEffect(() => {
    setLoaded(false);
    const timer = setTimeout(() => setLoaded(true), 90);
    return () => clearTimeout(timer);
  }, [activeIndex]);

  useEffect(() => {
    if (slides.length <= 1) return undefined;
    const interval = setInterval(() => {
      setActiveIndex(index => (index + 1) % slides.length);
    }, 6500);
    return () => clearInterval(interval);
  }, [slides.length]);

  useEffect(() => {
    if (activeIndex >= slides.length) setActiveIndex(0);
  }, [activeIndex, slides.length]);

  const goToPrevious = () => {
    setActiveIndex(index => (index - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex(index => (index + 1) % slides.length);
  };

  const toggleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/peliculas/${activeMovie.id}/favorito`, {
        method: 'POST',
      });
      setLikedByMovie(current => ({
        ...current,
        [activeMovie.id]: response.enMiLista,
      }));
    } catch {
      return;
    }
  };

  if (!activeMovie) return null;

  return (
    <section className="hero">
      <div className="hero-bg">
        <img
          key={activeMovie.id || activeMovie.titulo}
          src={activeMovie.imagen}
          alt={activeMovie.titulo}
          className="hero-bg-img"
          onError={e => { e.target.src = '/hero_banner.png'; }}
        />
        <div className="hero-bg-overlay" />
      </div>

      <div className={`hero-content container ${loaded ? 'hero-loaded' : ''}`}>
        <div className="hero-badges">
          {activeMovie.estreno && <span className="badge badge-primary">{activeMovie.estreno}</span>}
          {activeMovie.tags?.map(tag => (
            <span key={tag} className="badge badge-dark">{tag}</span>
          ))}
        </div>

        <h1 className="hero-title">{activeMovie.titulo}</h1>

        <div className="hero-meta">
          <span className="rating-badge hero-rating">* {activeMovie.calificacion_promedio}</span>
          <span className="hero-meta-item">{activeMovie.anio}</span>
          <span className="hero-meta-dot">-</span>
          <span className="hero-meta-item">{activeMovie.duracion}</span>
          <span className="hero-meta-dot">-</span>
          <span className="hero-meta-item">{activeMovie.director}</span>
        </div>

        <p className="hero-sinopsis">{activeMovie.sinopsis}</p>

        <div className="hero-actions">
          <button className={`btn btn-outline hero-btn-list ${activeMovieLiked ? 'in-list' : ''}`} onClick={toggleFavorite}>
            {activeMovieLiked ? 'En mi lista' : '+ Mi Lista'}
          </button>
          <Link to={`/pelicula/${activeMovie.id}`} className="btn btn-primary hero-btn-detail">
            Ver detalles
          </Link>
        </div>
      </div>

      {slides.length > 1 && (
        <div className="hero-carousel-controls" aria-label="Carrusel de peliculas destacadas">
          <button type="button" className="hero-arrow" onClick={goToPrevious} aria-label="Pelicula anterior">
            {'<'}
          </button>
          <div className="hero-dots">
            {slides.map((slide, index) => (
              <button
                key={slide.id || slide.titulo}
                type="button"
                className={`hero-dot ${index === activeIndex ? 'active' : ''}`}
                onClick={() => setActiveIndex(index)}
                aria-label={`Mostrar ${slide.titulo}`}
              />
            ))}
          </div>
          <button type="button" className="hero-arrow" onClick={goToNext} aria-label="Pelicula siguiente">
            {'>'}
          </button>
        </div>
      )}

      <div className="hero-bottom-fade" />
    </section>
  );
}
