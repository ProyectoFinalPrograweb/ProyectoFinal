import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Bell, User as UserIcon, Sun, Moon } from 'lucide-react';
import { apiRequest, clearSession, getAuthToken, getCurrentUser, saveSession } from '../services/api';
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
  const [user, setUser] = useState(getCurrentUser());
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');
  const initials = user?.name?.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || 'AG';

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return;

    apiRequest('/me')
      .then(response => {
        if (response.user) {
          saveSession(response.user, token);
          setUser(response.user);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (user) {
      apiRequest('/notifications')
        .then(response => {
          setNotifications(response.data || []);
          setUnreadCount(response.unread_count || 0);
        })
        .catch(() => {});
    }
  }, [user]);

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'POST' });
      setNotifications(notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch {}
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest('/notifications/read-all', { method: 'POST' });
      setNotifications(notifications.map(n => ({ ...n, read_at: new Date().toISOString() })));
      setUnreadCount(0);
    } catch {}
  };

  const logout = async () => {
    try {
      await apiRequest('/logout', { method: 'POST' });
    } catch {
      // Local cleanup still happens if the token is already expired.
    }
    clearSession();
    setUser(null);
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
              <Search size={20} />
            </button>
          </form>

          <button type="button" className="icon-btn theme-toggle-btn" onClick={toggleTheme} title="Cambiar tema">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <>
              <div className="notifications-wrapper">
                <button type="button" className="icon-btn notifications-btn" onClick={() => setNotificationsOpen(!notificationsOpen)} title="Notificaciones">
                  <Bell size={20} />
                  {unreadCount > 0 && <span className="notifications-badge">{unreadCount}</span>}
                </button>
                {notificationsOpen && (
                  <div className="notifications-dropdown animate-fade-in">
                    <div className="notifications-header">
                      <h4>Notificaciones</h4>
                      {unreadCount > 0 && (
                        <button type="button" className="mark-all-read" onClick={markAllAsRead}>Marcar todas como leídas</button>
                      )}
                    </div>
                    <div className="notifications-list">
                      {notifications.length === 0 ? (
                        <div className="no-notifications">No tienes notificaciones.</div>
                      ) : (
                        notifications.map(notification => (
                          <div key={notification.id} className={`notification-item ${!notification.read_at ? 'unread' : ''}`} onClick={() => !notification.read_at && markAsRead(notification.id)}>
                            <div className="notification-avatar">
                              {notification.data.follower_avatar || notification.data.liker_avatar || notification.data.replier_avatar ? (
                                <img src={notification.data.follower_avatar || notification.data.liker_avatar || notification.data.replier_avatar} alt="avatar" />
                              ) : <UserIcon size={24} color="#888" />}
                            </div>
                            <div className="notification-content">
                              <p>{notification.data.message}</p>
                              <span className="notification-time">{new Date(notification.created_at).toLocaleDateString()}</span>
                            </div>
                            {!notification.read_at && <div className="notification-dot" />}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
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
