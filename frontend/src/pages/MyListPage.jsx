import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { peliculas, generos } from '../data/mockData';
import './MyListPage.css';

const FILTERS = ['Todos', 'Vistas', 'Por Ver'];

export default function MyListPage() {
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('Todos');
  const [genero, setGenero]   = useState(0);
  const [view, setView]       = useState('grid'); // 'grid' | 'list'

  const miLista = peliculas.filter(p => p.enMiLista);

  const filtered = miLista.filter(p => {
    const matchSearch = p.titulo.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 'Todos'   ? true :
      filter === 'Vistas'  ? p.vista :
      filter === 'Por Ver' ? !p.vista : true;
    const matchGenero = genero === 0 ? true : p.genero_id === genero;
    return matchSearch && matchFilter && matchGenero;
  });

  return (
    <div className="page-wrapper">
      <main className="mylist-page container">

        {/* Header */}
        <div className="mylist-header animate-fade-in">
          <div>
            <h1 className="mylist-title">Mi Cinematográfica</h1>
            <p>Gestiona tu colección de cine mexicano. Agrega, reseña y rastrea las películas que te mueven.</p>
          </div>
          <Link to="/explorar" className="btn btn-primary">
            + Agregar Película
          </Link>
        </div>

        {/* Stats rápidas */}
        <div className="mylist-stats animate-fade-in delay-100">
          <div className="mylist-stat">
            <span className="mylist-stat-num">{miLista.length}</span>
            <span className="mylist-stat-label">En lista</span>
          </div>
          <div className="mylist-stat">
            <span className="mylist-stat-num">{miLista.filter(p=>p.vista).length}</span>
            <span className="mylist-stat-label">Vistas</span>
          </div>
          <div className="mylist-stat">
            <span className="mylist-stat-num">{miLista.filter(p=>!p.vista).length}</span>
            <span className="mylist-stat-label">Por ver</span>
          </div>
        </div>

        {/* Controles */}
        <div className="mylist-controls animate-fade-in delay-200">
          {/* Búsqueda */}
          <div className="mylist-search input-icon-wrap">
            <span className="icon">🔍</span>
            <input
              id="mylist-search"
              type="text"
              className="form-input"
              placeholder="Buscar en mi lista..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          {/* Filtros */}
          <div className="mylist-filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Género */}
          <select
            className="form-input genre-select"
            value={genero}
            onChange={e => setGenero(Number(e.target.value))}
          >
            <option value={0}>Todos los géneros</option>
            {generos.map(g => (
              <option key={g.id} value={g.id}>{g.nombre}</option>
            ))}
          </select>

          {/* Vista */}
          <div className="view-toggle">
            <button
              className={`view-btn ${view === 'grid' ? 'active' : ''}`}
              onClick={() => setView('grid')}
              title="Vista en cuadrícula"
            >⊞</button>
            <button
              className={`view-btn ${view === 'list' ? 'active' : ''}`}
              onClick={() => setView('list')}
              title="Vista en lista"
            >☰</button>
          </div>
        </div>

        {/* Resultados */}
        {filtered.length === 0 ? (
          <div className="mylist-empty animate-fade-in">
            <div className="empty-icon">🎬</div>
            <h3>No hay películas aquí</h3>
            <p>
              {search
                ? `No encontramos "${search}" en tu lista.`
                : 'Tu lista está vacía. ¡Explora y agrega películas!'}
            </p>
            <Link to="/explorar" className="btn btn-primary">Explorar Películas</Link>
          </div>
        ) : view === 'grid' ? (
          <div className="mylist-grid animate-fade-in">
            {filtered.map(p => (
              <MovieCard key={p.id} pelicula={p} />
            ))}
            {/* Tarjeta "agregar" */}
            <Link to="/explorar" className="add-card">
              <span className="add-card-icon">+</span>
              <span>Agregar Nueva</span>
            </Link>
          </div>
        ) : (
          <div className="mylist-list-view animate-fade-in">
            {filtered.map(p => (
              <MovieCard key={p.id} pelicula={p} variant="list" />
            ))}
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}
