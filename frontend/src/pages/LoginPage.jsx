import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

export default function LoginPage() {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [showPass, setShowPass] = useState(false);

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ nombre: '', email: '', password: '', rol: 'cinefilo' });

  const handleLogin = e => {
    e.preventDefault();
    alert('Login conectado al backend próximamente 🎬');
  };

  const handleRegister = e => {
    e.preventDefault();
    alert('Registro conectado al backend próximamente 🎬');
  };

  return (
    <div className="login-page">
      {/* Panel izquierdo — visual */}
      <div className="login-visual">
        <img
          src="/hero_banner.png"
          alt="Cinema ITO"
          className="login-bg-img"
        />
        <div className="login-visual-overlay" />

        <div className="login-visual-content">
          <Link to="/" className="login-logo">
            🎬 Cinema <span>ITO</span>
          </Link>
          <div className="login-tagline">
            <h1>Celebrando el Cine Mexicano</h1>
            <p>Descubre, celebra y comparte la magia del cine mexicano. Tu comunidad universitaria cinéfila.</p>
          </div>

          {/* Géneros flotantes */}
          <div className="login-genre-pills">
            {['Drama', 'Thriller', 'Comedia', 'Terror', 'Documental', 'Animación'].map((g, i) => (
              <span key={g} className="genre-pill" style={{ animationDelay: `${i * 0.1}s` }}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div className="login-form-panel">
        <div className="login-form-container animate-scale-in">

          {/* Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => setTab('login')}
            >
              Iniciar Sesión
            </button>
            <button
              className={`login-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => setTab('register')}
            >
              Crear Cuenta
            </button>
          </div>

          {/* ---- LOGIN ---- */}
          {tab === 'login' && (
            <form className="login-form animate-fade-in" onSubmit={handleLogin}>
              <div className="login-greeting">
                <h2>Bienvenido de vuelta</h2>
                <p>Accede a tu cuenta y sigue explorando el cine mexicano.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <div className="input-icon-wrap">
                  <span className="icon">✉</span>
                  <input
                    id="login-email"
                    type="email"
                    className="form-input"
                    placeholder="tu@correo.com"
                    value={loginData.email}
                    onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Contraseña</label>
                  <a href="#" className="forgot-link">¿Olvidaste tu contraseña?</a>
                </div>
                <div className="input-icon-wrap">
                  <span className="icon">🔒</span>
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="········"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="show-pass-btn"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn">
                Entrar
              </button>

              <div className="login-divider">
                <span>O continuar con</span>
              </div>

              <div className="login-social">
                <button type="button" className="btn btn-outline social-btn">
                  <span>G</span> Google
                </button>
                <button type="button" className="btn btn-outline social-btn">
                  <span>f</span> Facebook
                </button>
              </div>
            </form>
          )}

          {/* ---- REGISTRO ---- */}
          {tab === 'register' && (
            <form className="login-form animate-fade-in" onSubmit={handleRegister}>
              <div className="login-greeting">
                <h2>Únete a Cinema ITO</h2>
                <p>Crea tu cuenta y forma parte de la comunidad cinéfila universitaria.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <div className="input-icon-wrap">
                  <span className="icon">👤</span>
                  <input
                    id="reg-nombre"
                    type="text"
                    className="form-input"
                    placeholder="Tu nombre"
                    value={regData.nombre}
                    onChange={e => setRegData({ ...regData, nombre: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Correo Electrónico</label>
                <div className="input-icon-wrap">
                  <span className="icon">✉</span>
                  <input
                    id="reg-email"
                    type="email"
                    className="form-input"
                    placeholder="tu@ito.mx"
                    value={regData.email}
                    onChange={e => setRegData({ ...regData, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <div className="input-icon-wrap">
                  <span className="icon">🔒</span>
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Mínimo 8 caracteres"
                    value={regData.password}
                    onChange={e => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    className="show-pass-btn"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de cuenta</label>
                <select
                  id="reg-rol"
                  className="form-input"
                  value={regData.rol}
                  onChange={e => setRegData({ ...regData, rol: e.target.value })}
                >
                  <option value="cinefilo">🎬 Cinéfilo</option>
                  <option value="productor">🎥 Productor / Estudio</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary login-submit-btn">
                Crear Cuenta
              </button>

              <p className="login-terms">
                Al registrarte aceptas nuestros{' '}
                <a href="#">Términos de Uso</a> y{' '}
                <a href="#">Política de Privacidad</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
