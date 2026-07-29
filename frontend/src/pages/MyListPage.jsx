import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Search, Plus } from 'lucide-react';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { apiRequest, getCurrentUser } from '../services/api';
import './MyListPage.css';

const FILTERS = ['Todos', 'Vistas', 'Por Ver'];

export default function MyListPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todos');
  const [genero, setGenero] = useState(0);
  const [view, setView] = useState('grid');
  const [miLista, setMiLista] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingVista, setSavingVista] = useState(null);
  const [message, setMessage] = useState('');
  const user = getCurrentUser();

  useEffect(() => {
    apiRequest('/generos').then(response => setGeneros(response.data || []));

    if (!user) {
      setLoading(false);
      return;
    }

    apiRequest('/favoritos')
      .then(response => setMiLista(response.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = miLista.filter(p => {
    const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todos' ? true :
      filter === 'Vistas' ? p.vista :
      filter === 'Por Ver' ? !p.vista : true;
    const matchGenero = genero === 0 ? true : p.genero_id === genero;
    return matchSearch && matchFilter && matchGenero;
  });

  const toggleVista = async pelicula => {
    setSavingVista(pelicula.id);
    setMessage('');

    try {
      const response = await apiRequest(`/peliculas/${pelicula.id}/vista`, {
        method: 'PUT',
        body: JSON.stringify({ vista: !pelicula.vista }),
      });

      setMiLista(current => current.map(item => (
        item.id === pelicula.id ? { ...item, vista: response.vista } : item
      )));
      setMessage(response.message);
    } catch (error) {
      setMessage(error.message);
    } finally {
      setSavingVista(null);
    }
  };

  const renderMovieWithActions = pelicula => (
    <div key={pelicula.id} className="mylist-movie-shell">
      <MovieCard pelicula={pelicula} variant={view === 'list' ? 'list' : 'default'} />
      <button
        type="button"
        className={`watched-toggle ${pelicula.vista ? 'is-watched' : ''}`}
        onClick={() => toggleVista(pelicula)}
        disabled={savingVista === pelicula.id}
      >
        {savingVista === pelicula.id ? 'Guardando...' : pelicula.vista ? 'Vista' : 'Marcar como vista'}
      </button>
    </div>
  );

  return (
    <div className="page-wrapper">
      <main className="mylist-page container">
        <div className="mylist-header animate-fade-in">
          <div>
            <h1 className="mylist-title">Mi Cinematografica</h1>
            <p>Gestiona tu coleccion de cine mexicano usando favoritos reales de la base de datos.</p>
          </div>
          <Link to="/explorar" className="btn btn-primary">+ Agregar Pelicula</Link>
        </div>

        {!user && (
          <div className="mylist-empty animate-fade-in">
            <div className="empty-icon"><Bookmark size={48} /></div>
            <h3>Inicia sesion</h3>
            <p>Necesitas iniciar sesion para ver tu lista.</p>
            <Link to="/login" className="btn btn-primary">Iniciar Sesion</Link>
          </div>
        )}

        {user && (
          <>
            <div className="mylist-stats animate-fade-in delay-100">
              <div className="mylist-stat"><span className="mylist-stat-num">{miLista.length}</span><span className="mylist-stat-label">En lista</span></div>
              <div className="mylist-stat"><span className="mylist-stat-num">{miLista.filter(p => p.vista).length}</span><span className="mylist-stat-label">Vistas</span></div>
              <div className="mylist-stat"><span className="mylist-stat-num">{miLista.filter(p => !p.vista).length}</span><span className="mylist-stat-label">Por ver</span></div>
            </div>

            <div className="mylist-controls animate-fade-in delay-200">
              <div className="mylist-search input-icon-wrap">
                <span className="icon" style={{display:'flex',alignItems:'center'}}><Search size={18} color="#888" /></span>
                <input
                  id="mylist-search"
                  type="text"
                  className="form-input"
                  placeholder="Buscar en mi lista..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="mylist-filters">
                {FILTERS.map(f => (
                  <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                    {f}
                  </button>
                ))}
              </div>

              <select className="form-input genre-select" value={genero} onChange={e => setGenero(Number(e.target.value))}>
                <option value={0}>Todos los generos</option>
                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>

              <div className="view-toggle">
                <button className={`view-btn ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')} title="Vista en cuadricula">#</button>
                <button className={`view-btn ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')} title="Vista en lista">=</button>
              </div>
            </div>

            {message && <div className="mylist-message">{message}</div>}

            {loading ? (
              <p>Cargando lista...</p>
            ) : filtered.length === 0 ? (
              <div className="mylist-empty animate-fade-in">
                <div className="empty-icon"><Bookmark size={48} /></div>
                <h3>No hay peliculas aqui</h3>
                <p>{search ? `No encontramos "${search}" en tu lista.` : 'Tu lista esta vacia. Explora y agrega peliculas.'}</p>
                <Link to="/explorar" className="btn btn-primary">Explorar Peliculas</Link>
              </div>
            ) : view === 'grid' ? (
              <div className="mylist-grid animate-fade-in">
                {filtered.map(renderMovieWithActions)}
                <Link to="/explorar" className="add-card"><span className="add-card-icon" style={{display:'flex',alignItems:'center',justifyContent:'center'}}><Plus size={32} /></span><span>Agregar Nueva</span></Link>
              </div>
            ) : (
              <div className="mylist-list-view animate-fade-in">
                {filtered.map(renderMovieWithActions)}
              </div>
            )}
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
