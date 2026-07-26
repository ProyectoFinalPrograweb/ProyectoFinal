import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/',          label: 'Inicio' },
  { path: '/explorar',  label: 'Explorar' },
  { path: '/cartelera', label: 'Cartelera' },
  { path: '/mi-lista',  label: 'Mi Lista' },
];

export default function Navbar() {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🎬</span>
          <span className="logo-text">Cinema <span className="logo-accent">ITO</span></span>
        </Link>

        {/* Links desktop */}
        <ul className="navbar-links">
          {NAV_LINKS.map(link => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Acciones */}
        <div className="navbar-actions">
          {/* Búsqueda */}
          <div className={`search-wrapper ${searchOpen ? 'open' : ''}`}>
            {searchOpen && (
              <input
                className="search-input"
                type="text"
                placeholder="Buscar película..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
              />
            )}
            <button
              className="icon-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              title="Buscar"
            >
              🔍
            </button>
          </div>

          {/* Notificaciones */}
          <button className="icon-btn" title="Notificaciones">
            🔔
          </button>

          {/* Avatar / Perfil */}
          <Link to="/perfil" className="navbar-avatar" title="Mi Perfil">
            AG
          </Link>

          {/* Login (si no hay sesión) */}
          <Link to="/login" className="btn btn-primary navbar-login-btn">
            Iniciar Sesión
          </Link>

          {/* Hamburguesa móvil */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            <span className={menuOpen ? 'bar open' : 'bar'} />
            <span className={menuOpen ? 'bar open' : 'bar'} />
            <span className={menuOpen ? 'bar open' : 'bar'} />
          </button>
        </div>
      </div>

      {/* Menú móvil */}
      {menuOpen && (
        <div className="mobile-menu animate-fade-in">
          {NAV_LINKS.map(link => (
            <Link
              key={link.path}
              to={link.path}
              className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mobile-menu-divider" />
          <Link to="/login" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
            Iniciar Sesión
          </Link>
        </div>
      )}
    </nav>
  );
}
