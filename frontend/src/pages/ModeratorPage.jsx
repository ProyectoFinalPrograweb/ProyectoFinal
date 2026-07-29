import { useEffect, useState } from 'react';
import { MessageSquare, Film, Grid, Shield, Search } from 'lucide-react';
import Footer from '../components/Footer';
import { apiRequest, getCurrentUser } from '../services/api';
import './AdminPage.css';

const TABS = ['Resenas', 'Peliculas', 'Generos'];

export default function ModeratorPage() {
  const [tab, setTab] = useState('Resenas');
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ peliculas: [], resenas: [], generos: [] });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const user = getCurrentUser();

  const loadData = () => {
    setLoading(true);
    apiRequest('/moderador/resumen')
      .then(response => setData(response.data || data))
      .catch(error => setMessage({ type: 'error', text: error.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const deleteReview = async () => {
    const response = await apiRequest(`/moderador/resenas/${deleteTarget.id}`, { method: 'DELETE' });
    setMessage({ type: 'success', text: response.message });
    setDeleteTarget(null);
    loadData();
  };

  const filteredResenas = data.resenas.filter(r =>
    `${r.comentario} ${r.usuario?.nombre || ''} ${r.pelicula_titulo || ''}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredPeliculas = data.peliculas.filter(p =>
    `${p.titulo} ${p.director} ${p.genero || ''}`.toLowerCase().includes(search.toLowerCase())
  );
  const filteredGeneros = data.generos.filter(g => g.nombre.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page-wrapper">
      <main className="admin-page container">
        <div className="admin-header animate-fade-in">
          <div>
            <h1>Panel de Moderacion</h1>
            <p>Revision de contenido y reseñas. Acceso limitado para Moderador.</p>
          </div>
          <div className="admin-user-badge">
            <div className="admin-avatar">{(user?.name || 'MO').slice(0, 2).toUpperCase()}</div>
            <div>
              <span className="admin-name">{user?.name || 'Moderador'}</span>
              <span className="admin-role badge badge-primary">{user?.role || 'Moderador'}</span>
            </div>
          </div>
        </div>

        {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

        <div className="admin-stats animate-fade-in delay-100">
          <div className="admin-stat-card"><span className="admin-stat-icon"><MessageSquare size={24} /></span><div><span className="admin-stat-num">{data.resenas.length}</span><span className="admin-stat-label">Resenas</span></div></div>
          <div className="admin-stat-card"><span className="admin-stat-icon"><Film size={24} /></span><div><span className="admin-stat-num">{data.peliculas.length}</span><span className="admin-stat-label">Peliculas</span></div></div>
          <div className="admin-stat-card"><span className="admin-stat-icon"><Grid size={24} /></span><div><span className="admin-stat-num">{data.generos.length}</span><span className="admin-stat-label">Generos</span></div></div>
          <div className="admin-stat-card"><span className="admin-stat-icon"><Shield size={24} /></span><div><span className="admin-stat-num">Limitado</span><span className="admin-stat-label">Permisos</span></div></div>
        </div>

        <div className="admin-tabs animate-fade-in delay-200">
          {TABS.map(t => <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
        </div>

        <div className="admin-toolbar animate-fade-in delay-300">
          <div className="admin-search input-icon-wrap">
            <span className="icon" style={{display:'flex',alignItems:'center'}}><Search size={18} color="#888" /></span>
            <input type="text" className="form-input" placeholder={`Buscar en ${tab.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>

        {loading && <p>Cargando contenido para moderar...</p>}

        {!loading && tab === 'Resenas' && (
          <div className="admin-resenas animate-fade-in">
            {filteredResenas.map(r => (
              <div key={r.id} className="admin-resena-card">
                <div className="admin-resena-header">
                  <div className="admin-resena-user">
                    <div className="admin-user-avatar sm">
                      {r.usuario.avatar ? <img src={r.usuario.avatar} alt={r.usuario.nombre} /> : r.usuario.iniciales}
                    </div>
                    <div>
                      <span className="admin-movie-title">{r.usuario.nombre}</span>
                      <span className="table-text"> en {r.pelicula_titulo} - {r.fecha}</span>
                    </div>
                  </div>
                  <div className="admin-actions">
                    <button className="admin-action-btn delete" onClick={() => setDeleteTarget(r)}>Eliminar resena</button>
                  </div>
                </div>
                <p className="admin-resena-texto">{r.comentario}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'Peliculas' && (
          <div className="admin-table-wrap animate-fade-in">
            <table className="admin-table">
              <thead><tr><th>Pelicula</th><th>Director</th><th>Anio</th><th>Genero</th><th>Resenas</th></tr></thead>
              <tbody>
                {filteredPeliculas.map(p => (
                  <tr key={p.id}>
                    <td><div className="admin-movie-cell"><img src={p.imagen} alt={p.titulo} className="admin-movie-thumb" onError={e => { e.target.src = '/movie_posters.png'; }} /><span className="admin-movie-title">{p.titulo}</span></div></td>
                    <td><span className="table-text">{p.director}</span></td>
                    <td><span className="table-text">{p.anio}</span></td>
                    <td><span className="badge badge-dark">{p.genero}</span></td>
                    <td><span className="table-text">{p.resenas_count}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === 'Generos' && (
          <div className="admin-generos animate-fade-in">
            {filteredGeneros.map(g => (
              <div key={g.id} className="admin-genero-card">
                <div><h4>{g.nombre}</h4><p>{g.peliculas_count} peliculas relacionadas</p></div>
                <span className="badge badge-dark">Solo lectura</span>
              </div>
            ))}
          </div>
        )}
      </main>

      {deleteTarget && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            <div className="admin-modal-form">
              <h3>Eliminar resena</h3>
              <p>Esta accion elimina la resena seleccionada. El moderador no puede editar peliculas ni usuarios.</p>
              <div className="admin-modal-actions">
                <button type="button" className="btn btn-outline" onClick={() => setDeleteTarget(null)}>Cancelar</button>
                <button type="button" className="btn btn-primary" onClick={deleteReview}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
