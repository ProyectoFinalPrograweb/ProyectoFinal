import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import { apiRequest, getCurrentUser, buscarPeliculasApi, obtenerDetalleApi, sincronizarPostersApi } from '../services/api';
import './AdminPage.css';

const TABS = ['Peliculas', 'Usuarios', 'Resenas', 'Generos'];
const emptyMovie = { titulo: '', director: '', anio: new Date().getFullYear(), sinopsis: '', imagen: '', genero_id: '' };
const emptyGenre = { nombre: '', descripcion: '' };

export default function AdminPage() {
  const [tab, setTab] = useState('Peliculas');
  const [search, setSearch] = useState('');
  const [data, setData] = useState({ peliculas: [], usuarios: [], resenas: [], generos: [], roles: [] });
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [message, setMessage] = useState(null);
  const [apiSearchQuery, setApiSearchQuery] = useState('');
  const [apiSearchResults, setApiSearchResults] = useState([]);
  const [apiSearchLoading, setApiSearchLoading] = useState(false);
  const user = getCurrentUser();

  const loadData = () => {
    setLoading(true);
    apiRequest('/admin/resumen')
      .then(response => setData(response.data || data))
      .catch(error => setMessage({ type: 'error', text: error.message }))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openMovieModal = pelicula => {
    setApiSearchQuery('');
    setApiSearchResults([]);
    setModal({ type: 'movie', item: pelicula ? { ...pelicula } : { ...emptyMovie } });
  };
  const openGenreModal = genero => setModal({ type: 'genre', item: genero ? { ...genero } : { ...emptyGenre } });
  const openRoleModal = usuario => setModal({ type: 'role', item: { ...usuario, role_id: usuario.role_id || '' } });
  const openDeleteModal = (entity, item) => setModal({ type: 'delete', entity, item });

  const closeModal = () => {
    setApiSearchQuery('');
    setApiSearchResults([]);
    setModal(null);
  };

  const handleBuscarApi = async (e) => {
    e.preventDefault();
    if (!apiSearchQuery.trim()) return;
    setApiSearchLoading(true);
    try {
      const response = await buscarPeliculasApi(apiSearchQuery);
      setApiSearchResults(response.data || []);
    } catch (err) {
      setMessage({ type: 'error', text: 'No se pudo consultar la API de peliculas.' });
    } finally {
      setApiSearchLoading(false);
    }
  };

  const handleSelectApiMovie = async (item) => {
    let director = 'Desconocido';
    let sinopsis = item.sinopsis;
    let anio = item.anio || new Date().getFullYear();
    let imagen = item.imagen;

    if (item.external_id) {
      try {
        const details = await obtenerDetalleApi(item.external_id);
        if (details?.data) {
          director = details.data.director || director;
          sinopsis = details.data.sinopsis || sinopsis;
          anio = details.data.anio || anio;
          imagen = details.data.imagen || imagen;
        }
      } catch (e) {
        // Fallback a los datos básicos
      }
    }

    setModal(current => ({
      ...current,
      item: {
        ...current.item,
        titulo: item.titulo,
        director: director,
        anio: anio,
        sinopsis: sinopsis || 'Sin sinopsis disponible.',
        imagen: imagen,
      }
    }));
    setApiSearchResults([]);
  };

  const handleSincronizarPosters = async () => {
    setLoading(true);
    try {
      const response = await sincronizarPostersApi();
      setMessage({ type: 'success', text: response.message });
      loadData();
    } catch (err) {
      setMessage({ type: 'error', text: 'Error al sincronizar los posters.' });
      setLoading(false);
    }
  };


  const submitMovie = async e => {
    e.preventDefault();
    const isEdit = Boolean(modal.item.id);
    const body = {
      titulo: modal.item.titulo,
      director: modal.item.director,
      anio: Number(modal.item.anio),
      sinopsis: modal.item.sinopsis,
      imagen: modal.item.imagen || null,
      genero_id: Number(modal.item.genero_id),
    };

    const response = await apiRequest(isEdit ? `/admin/peliculas/${modal.item.id}` : '/admin/peliculas', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify(body),
    });
    setMessage({ type: 'success', text: response.message });
    closeModal();
    loadData();
  };

  const submitGenre = async e => {
    e.preventDefault();
    const isEdit = Boolean(modal.item.id);
    const response = await apiRequest(isEdit ? `/admin/generos/${modal.item.id}` : '/admin/generos', {
      method: isEdit ? 'PUT' : 'POST',
      body: JSON.stringify({
        nombre: modal.item.nombre,
        descripcion: modal.item.descripcion || null,
      }),
    });
    setMessage({ type: 'success', text: response.message });
    closeModal();
    loadData();
  };

  const submitRole = async e => {
    e.preventDefault();
    const response = await apiRequest(`/admin/users/${modal.item.id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role_id: Number(modal.item.role_id) }),
    });
    setMessage({ type: 'success', text: response.message });
    closeModal();
    loadData();
  };

  const confirmDelete = async () => {
    const paths = {
      pelicula: `/admin/peliculas/${modal.item.id}`,
      genero: `/admin/generos/${modal.item.id}`,
      resena: `/admin/resenas/${modal.item.id}`,
    };
    const response = await apiRequest(paths[modal.entity], { method: 'DELETE' });
    setMessage({ type: 'success', text: response.message });
    closeModal();
    loadData();
  };

  const filteredPeliculas = data.peliculas.filter(p => p.titulo.toLowerCase().includes(search.toLowerCase()));
  const filteredUsuarios = data.usuarios.filter(u => u.nombre.toLowerCase().includes(search.toLowerCase()));
  const filteredResenas = data.resenas.filter(r => r.comentario.toLowerCase().includes(search.toLowerCase()));
  const filteredGeneros = data.generos.filter(g => g.nombre.toLowerCase().includes(search.toLowerCase()));

  const updateModalItem = changes => setModal(current => ({ ...current, item: { ...current.item, ...changes } }));

  return (
    <div className="page-wrapper">
      <main className="admin-page container">
        <div className="admin-header animate-fade-in">
          <div>
            <h1>Panel de Administracion</h1>
            <p>CRUD real protegido por rol Administrador.</p>
          </div>
          <div className="admin-user-badge">
            <div className="admin-avatar">{(user?.name || 'AD').slice(0, 2).toUpperCase()}</div>
            <div>
              <span className="admin-name">{user?.name || 'Administrador'}</span>
              <span className="admin-role badge badge-primary">{user?.role || 'Administrador'}</span>
            </div>
          </div>
        </div>

        {message && <p className={`form-message ${message.type}`}>{message.text}</p>}

        <div className="admin-stats animate-fade-in delay-100">
          <div className="admin-stat-card"><span className="admin-stat-icon">P</span><div><span className="admin-stat-num">{data.peliculas.length}</span><span className="admin-stat-label">Peliculas</span></div></div>
          <div className="admin-stat-card"><span className="admin-stat-icon">U</span><div><span className="admin-stat-num">{data.usuarios.length}</span><span className="admin-stat-label">Usuarios</span></div></div>
          <div className="admin-stat-card"><span className="admin-stat-icon">R</span><div><span className="admin-stat-num">{data.resenas.length}</span><span className="admin-stat-label">Resenas</span></div></div>
          <div className="admin-stat-card"><span className="admin-stat-icon">G</span><div><span className="admin-stat-num">{data.generos.length}</span><span className="admin-stat-label">Generos</span></div></div>
        </div>

        <div className="admin-tabs animate-fade-in delay-200">
          {TABS.map(t => <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
        </div>

        <div className="admin-toolbar animate-fade-in delay-300">
          <div className="admin-search input-icon-wrap">
            <span className="icon">@</span>
            <input type="text" className="form-input" placeholder={`Buscar en ${tab.toLowerCase()}...`} value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          {tab === 'Peliculas' && (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline" onClick={handleSincronizarPosters} title="Obtener posters reales para todas las peliculas mediante la API de TMDB">
                🔄 Sincronizar Posters (API)
              </button>
              <button className="btn btn-primary" onClick={() => openMovieModal()}>
                + Agregar Pelicula
              </button>
            </div>
          )}
          {tab === 'Generos' && <button className="btn btn-primary" onClick={() => openGenreModal()}>+ Agregar Genero</button>}
        </div>

        {loading && <p>Cargando datos administrativos...</p>}

        {!loading && tab === 'Peliculas' && (
          <div className="admin-table-wrap animate-fade-in">
            <table className="admin-table">
              <thead><tr><th>Pelicula</th><th>Director</th><th>Anio</th><th>Genero</th><th>Calificacion</th><th>Acciones</th></tr></thead>
              <tbody>
                {filteredPeliculas.map(p => (
                  <tr key={p.id}>
                    <td><div className="admin-movie-cell"><img src={p.imagen} alt={p.titulo} className="admin-movie-thumb" onError={e => { e.target.src = '/movie_posters.png'; }} /><span className="admin-movie-title">{p.titulo}</span></div></td>
                    <td><span className="table-text">{p.director}</span></td>
                    <td><span className="table-text">{p.anio}</span></td>
                    <td><span className="badge badge-dark">{p.genero}</span></td>
                    <td><span className="rating-badge">{p.calificacion_promedio}</span></td>
                    <td><div className="admin-actions"><button className="admin-action-btn edit" onClick={() => openMovieModal(p)}>Editar</button><button className="admin-action-btn delete" onClick={() => openDeleteModal('pelicula', p)}>Eliminar</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === 'Usuarios' && (
          <div className="admin-table-wrap animate-fade-in">
            <table className="admin-table">
              <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Peliculas</th><th>Estado</th><th>Acciones</th></tr></thead>
              <tbody>
                {filteredUsuarios.map(u => (
                  <tr key={u.id}>
                    <td><div className="admin-user-cell"><div className="admin-user-avatar">{u.nombre.slice(0, 2).toUpperCase()}</div><span className="admin-movie-title">{u.nombre}</span></div></td>
                    <td><span className="table-text">{u.email}</span></td>
                    <td><span className="badge badge-primary">{u.rol}</span></td>
                    <td><span className="table-text">{u.peliculas}</span></td>
                    <td><span className="estado-badge activo">Activo</span></td>
                    <td><div className="admin-actions"><button className="admin-action-btn edit" onClick={() => openRoleModal(u)}>Cambiar rol</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && tab === 'Resenas' && (
          <div className="admin-resenas animate-fade-in">
            {filteredResenas.map(r => (
              <div key={r.id} className="admin-resena-card">
                <div className="admin-resena-header">
                  <div className="admin-resena-user">
                    <div className="admin-user-avatar sm">
                      {r.usuario.avatar ? <img src={r.usuario.avatar} alt={r.usuario.nombre} /> : r.usuario.iniciales}
                    </div>
                    <div><span className="admin-movie-title">{r.usuario.nombre}</span><span className="table-text"> en {r.pelicula_titulo} - {r.fecha}</span></div>
                  </div>
                  <div className="admin-actions"><button className="admin-action-btn delete" onClick={() => openDeleteModal('resena', r)}>Eliminar</button></div>
                </div>
                <p className="admin-resena-texto">{r.comentario}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && tab === 'Generos' && (
          <div className="admin-generos animate-fade-in">
            {filteredGeneros.map(g => (
              <div key={g.id} className="admin-genero-card">
                <div><h4>{g.nombre}</h4><p>{g.peliculas_count} peliculas</p></div>
                <div className="admin-actions"><button className="admin-action-btn edit" onClick={() => openGenreModal(g)}>Editar</button><button className="admin-action-btn delete" onClick={() => openDeleteModal('genero', g)}>Eliminar</button></div>
              </div>
            ))}
          </div>
        )}
      </main>

      {modal && (
        <div className="admin-modal-backdrop">
          <div className="admin-modal">
            {modal.type === 'movie' && (
              <form onSubmit={submitMovie} className="admin-modal-form">
                <h3>{modal.item.id ? 'Editar pelicula' : 'Agregar pelicula'}</h3>

                {/* Sección para buscar datos e imagen desde la API externa */}
                <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '8px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <label style={{ fontSize: '0.85rem', color: '#aaa', display: 'block', marginBottom: '6px' }}>
                    🔍 Auto-llenar desde API (TMDB):
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      className="form-input"
                      style={{ marginBottom: 0 }}
                      placeholder="Ej. Amores Perros, Roma, Titanic..."
                      value={apiSearchQuery}
                      onChange={e => setApiSearchQuery(e.target.value)}
                    />
                    <button type="button" className="btn btn-outline" onClick={handleBuscarApi} disabled={apiSearchLoading}>
                      {apiSearchLoading ? '...' : 'Buscar API'}
                    </button>
                  </div>

                  {apiSearchResults.length > 0 && (
                    <div style={{ marginTop: '10px', maxHeight: '160px', overflowY: 'auto', background: '#18181c', border: '1px solid #333', borderRadius: '6px' }}>
                      {apiSearchResults.map(res => (
                        <div
                          key={res.external_id}
                          onClick={() => handleSelectApiMovie(res)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            padding: '8px',
                            cursor: 'pointer',
                            borderBottom: '1px solid #28282e',
                          }}
                        >
                          <img src={res.imagen} alt={res.titulo} style={{ width: '32px', height: '48px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div style={{ flex: 1, fontSize: '0.85rem' }}>
                            <strong style={{ display: 'block', color: '#fff' }}>{res.titulo} ({res.anio || 'N/A'})</strong>
                            <span style={{ color: '#888', fontSize: '0.75rem' }}>⭐ {res.calificacion_api}</span>
                          </div>
                          <span style={{ color: '#e50914', fontSize: '0.8rem' }}>Usar datos</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input className="form-input" placeholder="Titulo" value={modal.item.titulo} onChange={e => updateModalItem({ titulo: e.target.value })} required />
                <input className="form-input" placeholder="Director" value={modal.item.director} onChange={e => updateModalItem({ director: e.target.value })} required />
                <input className="form-input" type="number" placeholder="Anio" value={modal.item.anio} onChange={e => updateModalItem({ anio: e.target.value })} required />
                <select className="form-input" value={modal.item.genero_id} onChange={e => updateModalItem({ genero_id: e.target.value })} required>
                  <option value="">Selecciona genero</option>
                  {data.generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
                </select>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input className="form-input" style={{ flex: 1 }} placeholder="URL de imagen poster (http://...)" value={modal.item.imagen || ''} onChange={e => updateModalItem({ imagen: e.target.value })} />
                  {modal.item.imagen && (
                    <img src={modal.item.imagen} alt="Preview" style={{ width: '36px', height: '48px', objectFit: 'cover', borderRadius: '4px', border: '1px solid #444' }} />
                  )}
                </div>
                <textarea className="form-input" placeholder="Sinopsis" value={modal.item.sinopsis} onChange={e => updateModalItem({ sinopsis: e.target.value })} rows={4} required />
                <div className="admin-modal-actions"><button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" type="submit">Guardar</button></div>
              </form>
            )}

            {modal.type === 'genre' && (
              <form onSubmit={submitGenre} className="admin-modal-form">
                <h3>{modal.item.id ? 'Editar genero' : 'Agregar genero'}</h3>
                <input className="form-input" placeholder="Nombre" value={modal.item.nombre} onChange={e => updateModalItem({ nombre: e.target.value })} required />
                <input className="form-input" placeholder="Descripcion" value={modal.item.descripcion || ''} onChange={e => updateModalItem({ descripcion: e.target.value })} />
                <div className="admin-modal-actions"><button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" type="submit">Guardar</button></div>
              </form>
            )}

            {modal.type === 'role' && (
              <form onSubmit={submitRole} className="admin-modal-form">
                <h3>Cambiar rol de {modal.item.nombre}</h3>
                <select className="form-input" value={modal.item.role_id} onChange={e => updateModalItem({ role_id: e.target.value })} required>
                  <option value="">Selecciona rol</option>
                  {data.roles.map(role => <option key={role.id} value={role.id}>{role.nombre}</option>)}
                </select>
                <div className="admin-modal-actions"><button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button><button className="btn btn-primary" type="submit">Guardar</button></div>
              </form>
            )}

            {modal.type === 'delete' && (
              <div className="admin-modal-form">
                <h3>Confirmar eliminacion</h3>
                <p>Esta accion eliminara el registro seleccionado. No se usa confirm nativo.</p>
                <div className="admin-modal-actions"><button type="button" className="btn btn-outline" onClick={closeModal}>Cancelar</button><button type="button" className="btn btn-primary" onClick={confirmDelete}>Eliminar</button></div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
