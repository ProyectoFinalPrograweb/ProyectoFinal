import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import { apiRequest, getCurrentUser } from '../services/api';
import './ProfilePage.css';

export default function PublicProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const viewer = getCurrentUser();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadProfile = () => {
    setLoading(true);
    apiRequest(`/usuarios/${id}`)
      .then(response => setProfile(response.data))
      .catch(error => setMessage(error.message || 'No se pudo cargar este perfil.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadProfile();
  }, [id]);

  const toggleFollow = async () => {
    if (!viewer) {
      navigate('/login');
      return;
    }

    try {
      const response = await apiRequest(`/usuarios/${id}/seguir`, { method: 'POST' });
      setProfile(current => ({
        ...current,
        siguiendo: response.siguiendo,
        seguidores_count: response.seguidores_count,
      }));
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    }
  };

  if (loading) {
    return <div className="page-wrapper"><main className="profile-main container"><p>Cargando perfil...</p></main></div>;
  }

  if (!profile) {
    return <div className="page-wrapper"><main className="profile-main container"><p>{message || 'No se encontro este perfil.'}</p></main></div>;
  }

  return (
    <div className="page-wrapper">
      <div className="profile-banner">
        <img src="/hero_banner.png" alt="banner" className="profile-banner-img" />
        <div className="profile-banner-overlay" />
      </div>

      <main className="profile-main container">
        <div className="profile-header animate-fade-in">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              {profile.avatar ? <img src={profile.avatar} alt={profile.name} /> : profile.iniciales}
            </div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{profile.name}</h1>
            <p className="profile-rol"><span className="badge badge-primary">{profile.role}</span></p>
            <p className="profile-bio">Perfil publico con sus resenas y actividad dentro de Cinema ITO.</p>
            <div className="profile-social-stats">
              <div className="social-stat"><span className="social-stat-num">{profile.seguidores_count}</span><span className="social-stat-label">Seguidores</span></div>
              <div className="social-stat"><span className="social-stat-num">{profile.seguidos_count}</span><span className="social-stat-label">Siguiendo</span></div>
              <div className="social-stat"><span className="social-stat-num">{profile.resenas_count}</span><span className="social-stat-label">Resenas</span></div>
            </div>
          </div>
          <div className="profile-actions">
            {profile.es_mi_perfil ? (
              <Link className="btn btn-outline" to="/perfil">Editar mi perfil</Link>
            ) : (
              <button type="button" className={profile.siguiendo ? 'btn btn-outline' : 'btn btn-primary'} onClick={toggleFollow}>
                {profile.siguiendo ? 'Siguiendo' : 'Seguir'}
              </button>
            )}
          </div>
        </div>

        {message && <div className="profile-message">{message}</div>}

        <section className="profile-reviews animate-fade-in delay-100">
          <div className="section-header">
            <h2>Resenas de {profile.name}</h2>
          </div>

          {profile.resenas.length === 0 ? (
            <p className="no-resenas">Este usuario todavia no ha publicado resenas.</p>
          ) : (
            <div className="public-review-list">
              {profile.resenas.map(resena => (
                <article key={resena.id} className="public-review-card">
                  <div>
                    <Link to={`/pelicula/${resena.pelicula_id}`} className="public-review-title">
                      {resena.pelicula_titulo}
                    </Link>
                    <span className="resena-fecha">{resena.fecha}</span>
                  </div>
                  <StarRating rating={resena.calificacion} max={5} size="sm" />
                  <p>{resena.comentario}</p>
                  <div className="public-review-meta">
                    <span>{resena.likes} likes</span>
                    <span>{resena.dislikes} dislikes</span>
                    <span>{resena.respuestas?.length || 0} respuestas</span>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
