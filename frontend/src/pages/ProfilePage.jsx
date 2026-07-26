import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import { usuarioActual, estadisticas, peliculas } from '../data/mockData';
import './ProfilePage.css';

const misPeliculas = peliculas.filter(p => p.enMiLista || p.vista).slice(0, 6);

export default function ProfilePage() {
  return (
    <div className="page-wrapper">
      {/* Banner de perfil */}
      <div className="profile-banner">
        <img src="/hero_banner.png" alt="banner" className="profile-banner-img" />
        <div className="profile-banner-overlay" />
      </div>

      <main className="profile-main container">
        {/* Cabecera del perfil */}
        <div className="profile-header animate-fade-in">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{usuarioActual.avatar}</div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{usuarioActual.nombre}</h1>
            <p className="profile-rol">
              <span className="badge badge-primary">{usuarioActual.rol}</span>
            </p>
            <p className="profile-bio">{usuarioActual.bio}</p>
            <div className="profile-social-stats">
              <div className="social-stat">
                <span className="social-stat-num">{usuarioActual.seguidores}</span>
                <span className="social-stat-label">Seguidores</span>
              </div>
              <div className="social-stat">
                <span className="social-stat-num">{usuarioActual.siguiendo}</span>
                <span className="social-stat-label">Siguiendo</span>
              </div>
              <div className="social-stat">
                <span className="social-stat-num">{usuarioActual.listas}</span>
                <span className="social-stat-label">Listas</span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary">Editar Perfil</button>
            <button className="btn btn-outline">Compartir</button>
          </div>
        </div>

        {/* Estadísticas de cine */}
        <section className="profile-stats animate-fade-in delay-100">
          <h2>Mis Estadísticas</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-icon">🎬</span>
              <span className="stat-card-num">{estadisticas.peliculas_vistas}</span>
              <span className="stat-card-label">Películas vistas</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⏱</span>
              <span className="stat-card-num">{estadisticas.horas_de_cine}h</span>
              <span className="stat-card-label">Horas de cine</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">⭐</span>
              <span className="stat-card-num">{estadisticas.calificacion_promedio}</span>
              <span className="stat-card-label">Calificación promedio</span>
            </div>
            <div className="stat-card">
              <span className="stat-icon">🎭</span>
              <span className="stat-card-num">{estadisticas.genero_favorito}</span>
              <span className="stat-card-label">Género favorito</span>
            </div>
          </div>
        </section>

        {/* Películas recientes */}
        <section className="profile-peliculas animate-fade-in delay-200">
          <div className="section-header">
            <h2>Actividad reciente</h2>
            <Link to="/mi-lista" className="ver-todas">Ver mi lista completa →</Link>
          </div>
          <div className="profile-peliculas-grid">
            {misPeliculas.map(p => (
              <Link key={p.id} to={`/pelicula/${p.id}`} className="profile-movie-item">
                <div className="profile-movie-img-wrap">
                  <img
                    src={p.imagen}
                    alt={p.titulo}
                    onError={e => { e.target.src = '/movie_posters.png'; }}
                  />
                  {p.vista && <span className="profile-vista-badge">✓</span>}
                  <span className="rating-badge profile-rating">{p.calificacion_promedio}</span>
                </div>
                <p className="profile-movie-title">{p.titulo}</p>
                <StarRating rating={p.calificacion_promedio / 2} max={5} size="sm" />
              </Link>
            ))}
          </div>
        </section>

        {/* Configuración de cuenta */}
        <section className="profile-settings animate-fade-in delay-300">
          <h2>Configuración</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div>
                <h4>Correo electrónico</h4>
                <p>{usuarioActual.email}</p>
              </div>
              <button className="btn btn-outline">Cambiar</button>
            </div>
            <div className="setting-item">
              <div>
                <h4>Contraseña</h4>
                <p>Última actualización hace 30 días</p>
              </div>
              <button className="btn btn-outline">Cambiar</button>
            </div>
            <div className="setting-item setting-danger">
              <div>
                <h4>Cerrar sesión</h4>
                <p>Cerrar sesión en este dispositivo</p>
              </div>
              <Link to="/login" className="btn btn-outline danger-btn">Salir</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
