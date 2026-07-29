import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';
import StarRating from '../components/StarRating';
import { apiRequest, clearSession, getAuthToken, getCurrentUser, saveSession } from '../services/api';
import './ProfilePage.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [peliculas, setPeliculas] = useState([]);
  const [socialProfile, setSocialProfile] = useState(null);
  const [user, setUser] = useState(getCurrentUser());
  const [profileOpen, setProfileOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
  });
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  const initials = user?.name?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'U';

  useEffect(() => {
    if (!user) return;
    apiRequest('/favoritos').then(response => setPeliculas(response.data || []));
    apiRequest(`/usuarios/${user.id}`).then(response => setSocialProfile(response.data));
  }, [user]);

  useEffect(() => {
    setProfileForm({
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.avatar || '',
    });
  }, [user]);

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  const readAvatar = event => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrors({ avatar: ['Selecciona una imagen valida.'] });
      return;
    }

    if (file.size > 450 * 1024) {
      setErrors({ avatar: ['La imagen debe pesar menos de 450 KB para guardarla en la base de datos local.'] });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setProfileForm(current => ({ ...current, avatar: reader.result }));
      setErrors({});
    };
    reader.readAsDataURL(file);
  };

  const saveProfile = async event => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage('');

    try {
      const response = await apiRequest('/profile', {
        method: 'PUT',
        body: JSON.stringify(profileForm),
      });
      saveSession(response.user, getAuthToken());
      setUser(response.user);
      setProfileOpen(false);
      setMessage(response.message);
    } catch (error) {
      setErrors(error.errors || {});
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const savePassword = async event => {
    event.preventDefault();
    setSaving(true);
    setErrors({});
    setMessage('');

    try {
      const response = await apiRequest('/profile/password', {
        method: 'PUT',
        body: JSON.stringify(passwordForm),
      });
      setPasswordForm({ current_password: '', password: '', password_confirmation: '' });
      setPasswordOpen(false);
      setMessage(response.message);
    } catch (error) {
      setErrors(error.errors || {});
      setMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const shareProfile = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setMessage('Enlace del perfil copiado al portapapeles.');
    } catch {
      setMessage('No se pudo copiar el enlace automaticamente.');
    }
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
            <div className="profile-avatar">
              {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials}
            </div>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{user.name}</h1>
            <p className="profile-rol"><span className="badge badge-primary">{user.role}</span></p>
            <p className="profile-bio">Usuario activo de Cinema ITO conectado con datos reales del backend.</p>
            <div className="profile-social-stats">
              <div className="social-stat"><span className="social-stat-num">{peliculas.length}</span><span className="social-stat-label">Favoritas</span></div>
              <div className="social-stat"><span className="social-stat-num">{socialProfile?.seguidores_count || 0}</span><span className="social-stat-label">Seguidores</span></div>
              <div className="social-stat"><span className="social-stat-num">{socialProfile?.seguidos_count || 0}</span><span className="social-stat-label">Siguiendo</span></div>
              <div className="social-stat"><span className="social-stat-num">{socialProfile?.resenas_count || 0}</span><span className="social-stat-label">Resenas</span></div>
            </div>
          </div>
          <div className="profile-actions">
            <button type="button" className="btn btn-primary" onClick={() => setProfileOpen(true)}>Editar Perfil</button>
            <button type="button" className="btn btn-outline" onClick={shareProfile}>Compartir</button>
          </div>
        </div>

        {message && <div className="profile-message">{message}</div>}

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

        <section className="profile-reviews animate-fade-in delay-200">
          <div className="section-header">
            <h2>Mis resenas</h2>
          </div>
          {!socialProfile?.resenas?.length ? (
            <p className="no-resenas">Todavia no has escrito resenas.</p>
          ) : (
            <div className="public-review-list">
              {socialProfile.resenas.slice(0, 6).map(resena => (
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

        <section className="profile-settings animate-fade-in delay-300">
          <h2>Configuracion</h2>
          <div className="settings-list">
            <div className="setting-item"><div><h4>Correo electronico</h4><p>{user.email}</p></div><button type="button" className="btn btn-outline" onClick={() => setProfileOpen(true)}>Cambiar</button></div>
            <div className="setting-item"><div><h4>Contrasena</h4><p>Protegida con hash en la base de datos</p></div><button type="button" className="btn btn-outline" onClick={() => setPasswordOpen(true)}>Cambiar</button></div>
            <div className="setting-item setting-danger"><div><h4>Cerrar sesion</h4><p>Cerrar sesion en este dispositivo</p></div><button type="button" className="btn btn-outline danger-btn" onClick={logout}>Salir</button></div>
          </div>
        </section>
      </main>

      {profileOpen && (
        <div className="profile-modal-backdrop">
          <form className="profile-modal" onSubmit={saveProfile}>
            <div className="profile-modal-header">
              <h3>Editar perfil</h3>
              <button type="button" className="profile-modal-close" onClick={() => setProfileOpen(false)}>x</button>
            </div>

            <label className="form-label" htmlFor="profile-name">Nombre completo</label>
            <input
              id="profile-name"
              className="form-input"
              value={profileForm.name}
              onChange={event => setProfileForm(current => ({ ...current, name: event.target.value }))}
            />
            {errors.name && <p className="form-error">{errors.name[0]}</p>}

            <label className="form-label" htmlFor="profile-email">Correo electronico</label>
            <input
              id="profile-email"
              type="email"
              className="form-input"
              value={profileForm.email}
              onChange={event => setProfileForm(current => ({ ...current, email: event.target.value }))}
            />
            {errors.email && <p className="form-error">{errors.email[0]}</p>}

            <label className="form-label" htmlFor="profile-avatar">Foto de perfil</label>
            <div className="avatar-preview-row">
              <div className="avatar-preview">
                {profileForm.avatar ? <img src={profileForm.avatar} alt="Vista previa" /> : initials}
              </div>
              <input id="profile-avatar" type="file" accept="image/*" onChange={readAvatar} />
            </div>
            {errors.avatar && <p className="form-error">{errors.avatar[0]}</p>}

            <div className="profile-modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setProfileOpen(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
            </div>
          </form>
        </div>
      )}

      {passwordOpen && (
        <div className="profile-modal-backdrop">
          <form className="profile-modal" onSubmit={savePassword}>
            <div className="profile-modal-header">
              <h3>Cambiar contrasena</h3>
              <button type="button" className="profile-modal-close" onClick={() => setPasswordOpen(false)}>x</button>
            </div>

            <label className="form-label" htmlFor="current-password">Contrasena actual</label>
            <input
              id="current-password"
              type="password"
              className="form-input"
              value={passwordForm.current_password}
              onChange={event => setPasswordForm(current => ({ ...current, current_password: event.target.value }))}
            />
            {errors.current_password && <p className="form-error">{errors.current_password[0]}</p>}

            <label className="form-label" htmlFor="new-password">Nueva contrasena</label>
            <input
              id="new-password"
              type="password"
              className="form-input"
              value={passwordForm.password}
              onChange={event => setPasswordForm(current => ({ ...current, password: event.target.value }))}
            />
            <p className="password-hint">Minimo 8 caracteres, una mayuscula, un numero y un caracter especial.</p>
            {errors.password && <p className="form-error">{errors.password[0]}</p>}

            <label className="form-label" htmlFor="confirm-password">Confirmar contrasena</label>
            <input
              id="confirm-password"
              type="password"
              className="form-input"
              value={passwordForm.password_confirmation}
              onChange={event => setPasswordForm(current => ({ ...current, password_confirmation: event.target.value }))}
            />

            <div className="profile-modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setPasswordOpen(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving ? 'Guardando...' : 'Actualizar'}</button>
            </div>
          </form>
        </div>
      )}

      <Footer />
    </div>
  );
}
