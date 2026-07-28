import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo" aria-label="Cinema ITO">
            <img src="/cinema-ito-logo-clean.png" alt="Cinema ITO" className="footer-logo-img" />
          </Link>
          <p className="footer-desc">
            La plataforma universitaria para descubrir, celebrar y compartir el cine mexicano.
          </p>
          <div className="footer-social">
            <a href="#" className="social-link" title="Twitter">X</a>
            <a href="#" className="social-link" title="Instagram">IG</a>
            <a href="#" className="social-link" title="YouTube">YT</a>
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
            <li><Link to="/login">Iniciar Sesion</Link></li>
            <li><Link to="/login">Crear Cuenta</Link></li>
            <li><Link to="/perfil">Mi Perfil</Link></li>
          </ul>
        </div>

        <div className="footer-links-group">
          <h4>ITO</h4>
          <ul>
            <li><a href="#">Acerca del Proyecto</a></li>
            <li><a href="#">Politicas de Privacidad</a></li>
            <li><a href="#">Terminos de Uso</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <p>2024 Cinema ITO - Proyecto Universitario - Instituto Tecnologico de Oaxaca</p>
          <p>Hecho para el cine mexicano</p>
        </div>
      </div>
    </footer>
  );
}
