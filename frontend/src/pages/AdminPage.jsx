import React, { useState } from 'react';
import Footer from '../components/Footer';
import { peliculas, resenas, usuarioActual, generos } from '../data/mockData';
import './AdminPage.css';

const TABS = ['Películas', 'Usuarios', 'Reseñas', 'Géneros'];

const usuariosDemo = [
  { id: 1, nombre: 'Angel Gabriel', email: 'angel@ito.mx', rol: 'Cinéfilo', peliculas: 47, activo: true },
  { id: 2, nombre: 'Valeria M.',    email: 'valeria@ito.mx', rol: 'Cinéfilo', peliculas: 23, activo: true },
  { id: 3, nombre: 'Carlos R.',    email: 'carlos@ito.mx', rol: 'Productor', peliculas: 5,  activo: false },
  { id: 4, nombre: 'Sofía L.',     email: 'sofia@ito.mx', rol: 'Cinéfilo', peliculas: 61, activo: true },
];

export default function AdminPage() {
  const [tab, setTab] = useState('Películas');
  const [search, setSearch] = useState('');

  return (
    <div className="page-wrapper">
      <main className="admin-page container">

        {/* Header */}
        <div className="admin-header animate-fade-in">
          <div>
            <h1>Panel de Administración</h1>
            <p>Gestiona el contenido y los usuarios de Cinema ITO.</p>
          </div>
          <div className="admin-user-badge">
            <div className="admin-avatar">{usuarioActual.avatar}</div>
            <div>
              <span className="admin-name">{usuarioActual.nombre}</span>
              <span className="admin-role badge badge-primary">Administrador</span>
            </div>
          </div>
        </div>

        {/* Stats globales */}
        <div className="admin-stats animate-fade-in delay-100">
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🎬</span>
            <div>
              <span className="admin-stat-num">{peliculas.length}</span>
              <span className="admin-stat-label">Películas</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">👤</span>
            <div>
              <span className="admin-stat-num">{usuariosDemo.length}</span>
              <span className="admin-stat-label">Usuarios</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">💬</span>
            <div>
              <span className="admin-stat-num">{resenas.length}</span>
              <span className="admin-stat-label">Reseñas</span>
            </div>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-icon">🎭</span>
            <div>
              <span className="admin-stat-num">{generos.length}</span>
              <span className="admin-stat-label">Géneros</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs animate-fade-in delay-200">
          {TABS.map(t => (
            <button
              key={t}
              className={`admin-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Búsqueda + Acción */}
        <div className="admin-toolbar animate-fade-in delay-300">
          <div className="admin-search input-icon-wrap">
            <span className="icon">🔍</span>
            <input
              type="text"
              className="form-input"
              placeholder={`Buscar en ${tab.toLowerCase()}...`}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">
            + Agregar {tab.slice(0, -1)}
          </button>
        </div>

        {/* ---- PELÍCULAS ---- */}
        {tab === 'Películas' && (
          <div className="admin-table-wrap animate-fade-in">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Película</th>
                  <th>Director</th>
                  <th>Año</th>
                  <th>Género</th>
                  <th>Calificación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {peliculas
                  .filter(p => p.titulo.toLowerCase().includes(search.toLowerCase()))
                  .map(p => {
                    const gen = generos.find(g => g.id === p.genero_id);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div className="admin-movie-cell">
                            <img
                              src={p.imagen}
                              alt={p.titulo}
                              className="admin-movie-thumb"
                              onError={e => { e.target.src = '/movie_posters.png'; }}
                            />
                            <span className="admin-movie-title">{p.titulo}</span>
                          </div>
                        </td>
                        <td><span className="table-text">{p.director}</span></td>
                        <td><span className="table-text">{p.anio}</span></td>
                        <td>{gen && <span className="badge badge-dark">{gen.nombre}</span>}</td>
                        <td><span className="rating-badge">{p.calificacion_promedio}</span></td>
                        <td>
                          <div className="admin-actions">
                            <button className="admin-action-btn edit">✏ Editar</button>
                            <button className="admin-action-btn delete">🗑 Eliminar</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {/* ---- USUARIOS ---- */}
        {tab === 'Usuarios' && (
          <div className="admin-table-wrap animate-fade-in">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Email</th>
                  <th>Rol</th>
                  <th>Películas</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {usuariosDemo
                  .filter(u => u.nombre.toLowerCase().includes(search.toLowerCase()))
                  .map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="admin-user-cell">
                          <div className="admin-user-avatar">{u.nombre.slice(0,2).toUpperCase()}</div>
                          <span className="admin-movie-title">{u.nombre}</span>
                        </div>
                      </td>
                      <td><span className="table-text">{u.email}</span></td>
                      <td><span className="badge badge-primary">{u.rol}</span></td>
                      <td><span className="table-text">{u.peliculas}</span></td>
                      <td>
                        <span className={`estado-badge ${u.activo ? 'activo' : 'inactivo'}`}>
                          {u.activo ? '● Activo' : '○ Inactivo'}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions">
                          <button className="admin-action-btn edit">✏ Editar</button>
                          <button className="admin-action-btn delete">🚫 Suspender</button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ---- RESEÑAS ---- */}
        {tab === 'Reseñas' && (
          <div className="admin-resenas animate-fade-in">
            {resenas.map(r => (
              <div key={r.id} className="admin-resena-card">
                <div className="admin-resena-header">
                  <div className="admin-resena-user">
                    <div className="admin-user-avatar sm">{r.usuario.avatar}</div>
                    <div>
                      <span className="admin-movie-title">{r.usuario.nombre}</span>
                      <span className="table-text"> en Cempasúchil · {r.fecha}</span>
                    </div>
                  </div>
                  <div className="admin-actions">
                    <button className="admin-action-btn delete">🗑 Eliminar</button>
                  </div>
                </div>
                <p className="admin-resena-texto">{r.comentario}</p>
              </div>
            ))}
          </div>
        )}

        {/* ---- GÉNEROS ---- */}
        {tab === 'Géneros' && (
          <div className="admin-generos animate-fade-in">
            {generos.map(g => (
              <div key={g.id} className="admin-genero-card">
                <div>
                  <h4>{g.nombre}</h4>
                  <p>{peliculas.filter(p => p.genero_id === g.id).length} películas</p>
                </div>
                <div className="admin-actions">
                  <button className="admin-action-btn edit">✏ Editar</button>
                  <button className="admin-action-btn delete">🗑 Eliminar</button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
