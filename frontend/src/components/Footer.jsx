import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            🎬 Cinema <span>ITO</span>
          </Link>
          <p className="footer-desc">
            La plataforma universitaria para descubrir, celebrar y compartir el cine mexicano.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" title="Twitter">𝕏</a>
            <a href="#" className="social-link" title="Instagram">📷</a>
            <a href="#" className="social-link" title="YouTube">▶</a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Explorar</h4>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/explorar">Explorar</Link></li>
            <li><Link to="/cartelera">Cartelera</Link></li>
            <li><Link to="/mi-lista">Mi Lista</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>Cuenta</h4>
          <ul>
            <li><Link to="/login">Iniciar Sesión</Link></li>
            <li><Link to="/login">Crear Cuenta</Link></li>
            <li><Link to="/perfil">Mi Perfil</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>ITO</h4>
          <ul>
            <li><a href="#">Acerca del Proyecto</a></li>
            <li><a href="#">Políticas de Privacidad</a></li>
            <li><a href="#">Términos de Uso</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>© 2024 Cinema ITO · Proyecto Universitario · Instituto Tecnológico de Oaxaca</p>
          <p>Hecho con ❤️ para el cine mexicano</p>
        </div>
      </div>
    </footer>
  );
}
