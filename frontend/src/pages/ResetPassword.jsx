import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../services/api';
import './LoginPage.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const passwordRules = [
    { label: 'Minimo 8 caracteres', valid: password.length >= 8 },
    { label: 'Una mayuscula', valid: /[A-Z]/.test(password) },
    { label: 'Un numero', valid: /\d/.test(password) },
    { label: 'Un caracter especial', valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const firstError = name => fieldErrors[name]?.[0];

  const handleSubmit = async event => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setFieldErrors({});

    if (password !== passwordConfirmation) {
      setFieldErrors({ password_confirmation: ['Las contrasenas no coinciden.'] });
      setLoading(false);
      return;
    }

    try {
      const response = await apiRequest('/reset-password', {
        method: 'POST',
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      setMessage({ type: 'success', text: response.message || 'Contrasena restablecida correctamente.' });
      setTimeout(() => navigate('/login'), 1800);
    } catch (error) {
      setFieldErrors(error.errors || {});
      setMessage({ type: 'error', text: error.message || 'Hubo un error al restablecer la contrasena.' });
    } finally {
      setLoading(false);
    }
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
            <h1>Restablecer Acceso</h1>
            <p>Actualiza tu contrasena y vuelve a tu lista de peliculas.</p>
          </div>
        </div>
      </div>

      <div className="login-form-panel">
        <div className="login-form-container animate-scale-in">
          <form className="login-form animate-fade-in" onSubmit={handleSubmit}>
            <div className="login-greeting">
              <h2>Crear nueva contrasena</h2>
              <p>{email ? `Cuenta: ${email}` : 'El enlace no incluye correo. Solicita uno nuevo.'}</p>
            </div>

            <div className="form-group">
              <label className="form-label">Nueva contrasena</label>
              <div className="input-icon-wrap">
                <span className="icon">*</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Minimo 8 caracteres"
                  value={password}
                  onChange={event => setPassword(event.target.value)}
                  required
                />
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
              <label className="form-label">Confirmar contrasena</label>
              <div className="input-icon-wrap">
                <span className="icon">*</span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="Repite la nueva contrasena"
                  value={passwordConfirmation}
                  onChange={event => setPasswordConfirmation(event.target.value)}
                  required
                />
              </div>
              {firstError('password_confirmation') && <p className="field-error">{firstError('password_confirmation')}</p>}
            </div>

            {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

            <button type="submit" className="btn btn-primary login-submit-btn" disabled={loading || !token || !email}>
              {loading ? 'Guardando...' : 'Restablecer contrasena'}
            </button>

            <button type="button" className="btn btn-outline login-submit-btn" onClick={() => navigate('/login')}>
              Volver al login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
