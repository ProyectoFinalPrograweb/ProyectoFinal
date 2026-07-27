import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import { apiRequest, clearSession, getCurrentUser } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);
  const user = getCurrentUser();
  const initials = user?.name?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  useEffect(() => {
    if (!user) return;
    apiRequest('/favoritos').then(response => setPeliculas(response.data || []));
  }, []);

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  if (!user) {
    return (
      <div className="page-wrapper">
        <main className="profile-main container">
          <div className="mylist-empty">
            <h3>Inicia sesion</h3>
            <p>Necesitas iniciar sesion para ver tu perfil.</p>
            <Link to="/login" className="btn btn-primary">Iniciar Sesion</Link>
          </div>
        </main>
      </div>
    );
  }

  const promedio = peliculas.length
    ? (peliculas.reduce((total, p) => total + Number(p.calificacion_promedio || 0), 0) / peliculas.length).toFixed(1)
    : '0.0';

  return (
    <div className="page-wrapper">
      <div className="profile-banner">
        <img src="/hero_banner.png" alt="banner" className="profile-banner-img" />
        <div className="profile-banner-overlay" />
      </div>

      <main className="profile-main container">
        <div className="profile-header animate-fade-in">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">{initials}</div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-rol"><span className="badge badge-primary">{user.role}</span></p>
            <p className="profile-bio">Usuario activo de Cinema ITO conectado con datos reales del backend.</p>
            <div className="profile-social-stats">
              <div className="social-stat"><span className="social-stat-num">{peliculas.length}</span><span className="social-stat-label">Favoritas</span></div>
              <div className="social-stat"><span className="social-stat-num">{user.id}</span><span className="social-stat-label">ID Usuario</span></div>
              <div className="social-stat"><span className="social-stat-num">1</span><span className="social-stat-label">Lista</span></div>
            </div>
          </div>
          <div className="profile-actions">
            <button className="btn btn-primary" disabled>Editar Perfil</button>
            <button className="btn btn-outline" disabled>Compartir</button>
          </div>
        </div>

        <section className="profile-stats animate-fade-in delay-100">
          <h2>Mis Estadisticas</h2>
          <div className="stats-grid">
            <div className="stat-card"><span className="stat-icon">P</span><span className="stat-card-num">{peliculas.length}</span><span className="stat-card-label">Peliculas guardadas</span></div>
            <div className="stat-card"><span className="stat-icon">H</span><span className="stat-card-num">{peliculas.length * 2}h</span><span className="stat-card-label">Horas estimadas</span></div>
            <div className="stat-card"><span className="stat-icon">*</span><span className="stat-card-num">{promedio}</span><span className="stat-card-label">Calificacion promedio</span></div>
            <div className="stat-card"><span className="stat-icon">R</span><span className="stat-card-num">{user.role}</span><span className="stat-card-label">Rol</span></div>
          </div>
        </section>

        <section className="profile-peliculas animate-fade-in delay-200">
          <div className="section-header">
            <h2>Actividad reciente</h2>
            <Link to="/mi-lista" className="ver-todas">Ver mi lista completa</Link>
          </div>
          <div className="profile-peliculas-grid">
            {peliculas.slice(0, 6).map(p => (
              <Link key={p.id} to={`/pelicula/${p.id}`} className="profile-movie-item">
                <div className="profile-movie-img-wrap">
                  <img src={p.imagen} alt={p.titulo} onError={e => { e.target.src = '/movie_posters.png'; }} />
                  <span className="rating-badge profile-rating">{p.calificacion_promedio}</span>
                </div>
                <p className="profile-movie-title">{p.titulo}</p>
                <StarRating rating={p.calificacion_promedio / 2} max={5} size="sm" />
              </Link>
            ))}
          </div>
        </section>

        <section className="profile-settings animate-fade-in delay-300">
          <h2>Configuracion</h2>
          <div className="settings-list">
            <div className="setting-item"><div><h4>Correo electronico</h4><p>{user.email}</p></div><button className="btn btn-outline" disabled>Cambiar</button></div>
            <div className="setting-item"><div><h4>Contrasena</h4><p>Protegida con hash en la base de datos</p></div><button className="btn btn-outline" disabled>Cambiar</button></div>
            <div className="setting-item setting-danger"><div><h4>Cerrar sesion</h4><p>Cerrar sesion en este dispositivo</p></div><button type="button" className="btn btn-outline danger-btn" onClick={logout}>Salir</button></div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
