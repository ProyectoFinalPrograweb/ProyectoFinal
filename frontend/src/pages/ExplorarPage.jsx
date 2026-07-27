import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { apiRequest, buildQuery } from '../services/api';
import './ExplorarPage.css';

export default function ExplorarPage() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [generoId, setGeneroId] = useState(Number(searchParams.get('genero')) || 0);
  const [orden, setOrden] = useState('calificacion');
  const [page, setPage] = useState(1);
  const [peliculas, setPeliculas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [meta, setMeta] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiRequest('/generos').then(response => setGeneros(response.data || []));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, generoId, orden]);

  useEffect(() => {
    setLoading(true);
    setError('');
    apiRequest(`/peliculas${buildQuery({ search, genero_id: generoId, orden, page, per_page: 8 })}`)
      .then(response => {
        setPeliculas(response.data || []);
        setMeta(response.meta || { total: 0 });
      })
      .catch(() => setError('No se pudieron cargar los resultados.'))
      .finally(() => setLoading(false));
  }, [search, generoId, orden, page]);

  return (
    <div className="page-wrapper">
      <main className="explorar-page container">
        <div className="explorar-header animate-fade-in">
          <div>
            <h1>Explorar Peliculas</h1>
            <p>Catalogo cargado desde la API de Laravel.</p>
          </div>
        </div>

        <div className="explorar-controls animate-fade-in delay-200">
          <div className="explorar-search input-icon-wrap">
            <span className="icon">@</span>
            <input
              id="explorar-search"
              type="text"
              className="form-input"
              placeholder="Buscar por titulo, director..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <select className="form-input explorar-select" value={generoId} onChange={e => setGeneroId(Number(e.target.value))}>
            <option value={0}>Todos los generos</option>
            {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
          </select>

          <select className="form-input explorar-select" value={orden} onChange={e => setOrden(e.target.value)}>
            <option value="calificacion">Mejor calificadas</option>
            <option value="vistas">Mas guardadas</option>
            <option value="recientes">Mas recientes</option>
          </select>
        </div>

        <div className="explorar-results animate-fade-in delay-300">
          {loading ? (
            <p className="results-count">Cargando peliculas...</p>
          ) : error ? (
            <p className="form-message error">{error}</p>
          ) : (
            <>
              <p className="results-count">{meta.total ?? peliculas.length} peliculas encontradas</p>
              {peliculas.length === 0 ? (
                <div className="mylist-empty">
                  <div className="empty-icon">C</div>
                  <h3>Sin resultados</h3>
                  <p>No encontramos peliculas con esos filtros.</p>
                </div>
              ) : (
                <>
                  <div className="explorar-grid">
                    {peliculas.map(p => <MovieCard key={p.id} pelicula={p} />)}
                  </div>
                  {meta.last_page > 1 && (
                    <div className="pagination-controls">
                      <button className="btn btn-outline" disabled={page <= 1} onClick={() => setPage(current => current - 1)}>
                        Anterior
                      </button>
                      <span>Pagina {meta.current_page} de {meta.last_page}</span>
                      <button className="btn btn-outline" disabled={page >= meta.last_page} onClick={() => setPage(current => current + 1)}>
                        Siguiente
                      </button>
                    </div>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
