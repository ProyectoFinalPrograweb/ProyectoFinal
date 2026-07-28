import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { apiRequest, clearSession, getCurrentUser } from '../services/api';
import './Navbar.css';

const NAV_LINKS = [
  { path: '/', label: 'Inicio' },
  { path: '/explorar', label: 'Explorar' },
  { path: '/mi-lista', label: 'Mi Lista' },
];

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const user = getCurrentUser();
  const initials = user?.name?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'AG';

  const logout = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch {
      // Local cleanup still happens if the token is already expired.
    }
    clearSession();
    navigate('/login');
  };

  const submitSearch = e => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/explorar?search=${encodeURIComponent(searchValue.trim())}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <img src="/cinema-ito-logo-clean.png" alt="Cinema ITO" className="navbar-logo-img" />
        </Link>

        <ul className="navbar-links">
          {NAV_LINKS.map(link => (
            <li key={link.path}>
              <Link to={link.path} className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}>
                {link.label}
              </Link>
            </li>
          ))}
          {user?.role === 'Administrador' && (
            <li><Link to="/admin" className={`navbar-link ${location.pathname === '/admin' ? 'active' : ''}`}>Admin</Link></li>
          )}
          {['Administrador', 'Moderador'].includes(user?.role) && (
            <li><Link to="/moderador" className={`navbar-link ${location.pathname === '/moderador' ? 'active' : ''}`}>Moderacion</Link></li>
          )}
        </ul>

        <div className="navbar-actions">
          <form className={`search-wrapper ${searchOpen ? 'open' : ''}`} onSubmit={submitSearch}>
            {searchOpen && (
              <input
                className="search-input"
                type="text"
                placeholder="Buscar pelicula..."
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                autoFocus
              />
            )}
            <button className="icon-btn" type={searchOpen ? 'submit' : 'button'} onClick={() => !searchOpen && setSearchOpen(true)} title="Buscar">
              @
            </button>
          </form>

          {user ? (
            <>
              <Link to="/perfil" className="navbar-avatar" title={`${user.name} - ${user.email}`}>
                {user.avatar ? <img src={user.avatar} alt={user.name} /> : initials}
              </Link>
              <button type="button" className="btn btn-primary navbar-login-btn" onClick={logout}>
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="btn btn-primary navbar-login-btn">
              Iniciar Sesion
            </Link>
          )}

          <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={menuOpen ? 'bar open' : 'bar'} />
            <span className={menuOpen ? 'bar open' : 'bar'} />
            <span className={menuOpen ? 'bar open' : 'bar'} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="mobile-menu animate-fade-in">
          {NAV_LINKS.map(link => (
            <Link key={link.path} to={link.path} className={`mobile-link ${location.pathname === link.path ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
              {link.label}
            </Link>
          ))}
          {user?.role === 'Administrador' && <Link to="/admin" className="mobile-link" onClick={() => setMenuOpen(false)}>Admin</Link>}
          {['Administrador', 'Moderador'].includes(user?.role) && <Link to="/moderador" className="mobile-link" onClick={() => setMenuOpen(false)}>Moderacion</Link>}
          <div className="mobile-menu-divider" />
          {user ? (
            <button type="button" className="btn btn-primary" onClick={logout}>Cerrar Sesion</button>
          ) : (
            <Link to="/login" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Iniciar Sesion</Link>
          )}
        </div>
      )}
    </nav>
  );
}
