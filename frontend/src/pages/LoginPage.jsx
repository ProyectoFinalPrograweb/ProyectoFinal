import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { API_URL, saveSession } from '../services/api';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formMessage, setFormMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [regData, setRegData] = useState({ nombre: '', email: '', password: '' });
  const [forgotData, setForgotData] = useState({ email: '' });

  const passwordRules = [
    { label: 'Minimo 8 caracteres', valid: regData.password.length >= 8 },
    { label: 'Una mayuscula', valid: /[A-Z]/.test(regData.password) },
    { label: 'Un numero', valid: /\d/.test(regData.password) },
    { label: 'Un caracter especial', valid: /[^A-Za-z0-9]/.test(regData.password) },
  ];

  const firstError = name => fieldErrors[name]?.[0];

  const requestJson = async (path, body) => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      const error = new Error(data.message || 'No se pudo completar la solicitud.');
      error.errors = data.errors || {};
      throw error;
    }

    return data;
  };

  const handleLogin = async e => {
    e.preventDefault();
    setLoading(true);
    setFormMessage(null);
    setFieldErrors({});

    try {
      const data = await requestJson('/login', loginData);
      saveSession(data.user, data.token);
      setFormMessage({ type: 'success', text: data.message });
      navigate('/');
    } catch (error) {
      setFieldErrors(error.errors || {});
      setFormMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async e => {
    e.preventDefault();
    setLoading(true);
    setFormMessage(null);
    setFieldErrors({});

    try {
      const data = await requestJson('/register', {
        name: regData.nombre,
        email: regData.email,
        password: regData.password,
      });
      saveSession(data.user, data.token);
      setFormMessage({ type: 'success', text: data.message });
      navigate('/');
    } catch (error) {
      setFieldErrors(error.errors || {});
      setFormMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async e => {
    e.preventDefault();
    setLoading(true);
    setFormMessage(null);
    setFieldErrors({});

    try {
      const data = await requestJson('/forgot-password', forgotData);
      setFormMessage({ type: 'success', text: data.message });
    } catch (error) {
      setFieldErrors(error.errors || {});
      setFormMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const switchTab = nextTab => {
    setTab(nextTab);
    setFormMessage(null);
    setFieldErrors({});
  };

  return (
    <div className="login-page">
      <div className="login-visual">
        <img src="/hero_banner.png" alt="Cinema ITO" className="login-bg-img" />
        <div className="login-visual-overlay" />

        <div className="login-visual-content">
          <Link to="/" className="login-logo">
            Cinema <span>ITO</span>
          </Link>
          <div className="login-tagline">
            <h1>Celebrando el Cine Mexicano</h1>
            <p>Descubre, celebra y comparte la magia del cine mexicano. Tu comunidad universitaria cinefila.</p>
          </div>

          <div className="login-genre-pills">
            {['Drama', 'Thriller', 'Comedia', 'Terror', 'Documental', 'Animacion'].map((g, i) => (
              <span key={g} className="genre-pill" style={{ animationDelay: `${i * 0.1}s` }}>
                {g}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-container animate-scale-in">
          <div className="login-tabs">
            <button
              type="button"
              className={`login-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Iniciar Sesion
            </button>
            <button
              type="button"
              className={`login-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Crear Cuenta
            </button>
          </div>

          {tab === 'login' && (
            <form className="login-form animate-fade-in" onSubmit={handleLogin}>
              <div className="login-greeting">
                <h2>Bienvenido de vuelta</h2>
                <p>Accede a tu cuenta y sigue explorando el cine mexicano.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Correo electronico</label>
                <div className="input-icon-wrap">
                  <span className="icon">@</span>
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
                {firstError('email') && <p className="field-error">{firstError('email')}</p>}
              </div>

              <div className="form-group">
                <div className="form-label-row">
                  <label className="form-label">Contrasena</label>
                  <button type="button" className="forgot-link" onClick={() => switchTab('forgot')}>Olvidaste tu contrasena?</button>
                </div>
                <div className="input-icon-wrap">
                  <span className="icon">*</span>
                  <input
                    id="login-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Minimo 8 caracteres"
                    value={loginData.password}
                    onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
                {firstError('password') && <p className="field-error">{firstError('password')}</p>}
              </div>

              {formMessage && <p className={`form-message ${formMessage.type}`}>{formMessage.text}</p>}

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
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

          {tab === 'forgot' && (
            <form className="login-form animate-fade-in" onSubmit={handleForgotPassword}>
              <div className="login-greeting">
                <h2>Recuperar contrasena</h2>
                <p>Escribe tu correo y te enviaremos un enlace de recuperacion.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Correo electronico</label>
                <div className="input-icon-wrap">
                  <span className="icon">@</span>
                  <input
                    id="forgot-email"
                    type="email"
                    className="form-input"
                    placeholder="tu@correo.com"
                    value={forgotData.email}
                    onChange={e => setForgotData({ email: e.target.value })}
                    required
                  />
                </div>
                {firstError('email') && <p className="field-error">{firstError('email')}</p>}
              </div>

              {formMessage && <p className={`form-message ${formMessage.type}`}>{formMessage.text}</p>}

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
                {loading ? 'Enviando...' : 'Enviar enlace'}
              </button>

              <button type="button" className="btn btn-outline login-submit-btn" onClick={() => switchTab('login')}>
                Volver al login
              </button>
            </form>
          )}

          {tab === 'register' && (
            <form className="login-form animate-fade-in" onSubmit={handleRegister}>
              <div className="login-greeting">
                <h2>Unete a Cinema ITO</h2>
                <p>Crea tu cuenta y forma parte de la comunidad cinefila universitaria.</p>
              </div>

              <div className="form-group">
                <label className="form-label">Nombre completo</label>
                <div className="input-icon-wrap">
                  <span className="icon">U</span>
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
                {firstError('name') && <p className="field-error">{firstError('name')}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Correo electronico</label>
                <div className="input-icon-wrap">
                  <span className="icon">@</span>
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
                {firstError('email') && <p className="field-error">{firstError('email')}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Contrasena</label>
                <div className="input-icon-wrap">
                  <span className="icon">*</span>
                  <input
                    id="reg-password"
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Minimo 8 caracteres"
                    value={regData.password}
                    onChange={e => setRegData({ ...regData, password: e.target.value })}
                    required
                  />
                  <button type="button" className="show-pass-btn" onClick={() => setShowPass(!showPass)}>
                    {showPass ? 'Ocultar' : 'Ver'}
                  </button>
                </div>
                <div className="password-rules">
                  {passwordRules.map(rule => (
                    <span key={rule.label} className={rule.valid ? 'valid' : ''}>
                      {rule.label}
                    </span>
                  ))}
                </div>
                {firstError('password') && <p className="field-error">{firstError('password')}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de cuenta</label>
                <select id="reg-rol" className="form-input" value="cinefilo" disabled>
                  <option value="cinefilo">Cinefilo</option>
                </select>
              </div>

              {formMessage && <p className={`form-message ${formMessage.type}`}>{formMessage.text}</p>}

              <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading}>
                {loading ? 'Creando...' : 'Crear Cuenta'}
              </button>

              <p className="login-terms">
                Al registrarte aceptas nuestros <a href="#">Terminos de Uso</a> y{' '}
                <a href="#">Politica de Privacidad</a>.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
