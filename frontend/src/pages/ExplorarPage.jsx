import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { apiRequest, buildQuery, buscarPeliculasApi, importarYFavoritoApi, getCurrentUser } from '../services/api';
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

  // Modo de búsqueda: 'local' o 'api'
  const [modoBusqueda, setModoBusqueda] = useState('local');
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [addedIds, setAddedIds] = useState([]);

  const user = getCurrentUser();

  useEffect(() => {
    apiRequest('/generos').then(response => setGeneros(response.data || []));
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, generoId, orden]);

  useEffect(() => {
    if (modoBusqueda === 'local') {
      setLoading(true);
      setError('');
      apiRequest(`/peliculas${buildQuery({ search, genero_id: generoId, orden, page, per_page: 8 })}`)
        .then(response => {
          setPeliculas(response.data || []);
          setMeta(response.meta || { total: 0 });
        })
        .catch(() => setError('No se pudieron cargar los resultados.'))
        .finally(() => setLoading(false));
    }
  }, [search, generoId, orden, page, modoBusqueda]);

  const handleSearchApi = async (e) => {
    if (e) e.preventDefault();
    if (!search.trim()) return;
    setModoBusqueda('api');
    setApiLoading(true);
    setMessage(null);
    try {
      const res = await buscarPeliculasApi(search);
      setApiResults(res.data || []);
    } catch (err) {
      setError('No se pudo conectar con la API de películas.');
    } finally {
      setApiLoading(false);
    }
  };

  const handleAgregarAMiLista = async (movie, vista = false) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Debes iniciar sesión para agregar películas a tu lista.' });
      return;
    }

    try {
      const response = await importarYFavoritoApi({
        external_id: movie.external_id,
        titulo: movie.titulo,
        anio: movie.anio,
        sinopsis: movie.sinopsis,
        imagen: movie.imagen,
        vista: vista,
      });

      setAddedIds(prev => [...prev, movie.external_id]);
      setMessage({ type: 'success', text: response.message || `¡"${movie.titulo}" agregada a tu lista!` });
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Error al guardar la película.' });
    }
  };

  return (
    <div className="page-wrapper">
      <main className="explorar-page container">
        <div className="explorar-header animate-fade-in">
          <div>
            <h1>Explorar Peliculas</h1>
            <p>Busca en nuestro catálogo o descubre cualquier película en línea (API TMDB).</p>
          </div>

          {/* Pestañas para cambiar entre catálogo local y búsqueda online */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
            <button
              className={`btn ${modoBusqueda === 'local' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setModoBusqueda('local'); setMessage(null); }}
            >
              🍿 Catálogo Local
            </button>
            <button
              className={`btn ${modoBusqueda === 'api' ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => { setModoBusqueda('api'); handleSearchApi(); }}
            >
              🌐 Buscar Online (API TMDB)
            </button>
          </div>
        </div>

        {message && (
          <p className={`form-message ${message.type}`} style={{ marginTop: '15px' }}>
            {message.text}
          </p>
        )}

        <div className="explorar-controls animate-fade-in delay-200" style={{ marginTop: '20px' }}>
          <form className="explorar-search input-icon-wrap" onSubmit={modoBusqueda === 'api' ? handleSearchApi : e => e.preventDefault()}>
            <span className="icon">🔍</span>
            <input
              id="explorar-search"
              type="text"
              className="form-input"
              placeholder={modoBusqueda === 'api' ? "Escribe cualquier película (Ej. Spiderman, Titanic, Batman)..." : "Buscar por título, director..."}
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {modoBusqueda === 'api' && (
              <button type="submit" className="btn btn-primary" style={{ position: 'absolute', right: '4px', top: '4px', bottom: '4px', padding: '0 16px' }}>
                Buscar API
              </button>
            )}
          </form>

          {modoBusqueda === 'local' && (
            <>
              <select className="form-input explorar-select" value={generoId} onChange={e => setGeneroId(Number(e.target.value))}>
                <option value={0}>Todos los géneros</option>
                {generos.map(g => <option key={g.id} value={g.id}>{g.nombre}</option>)}
              </select>

              <select className="form-input explorar-select" value={orden} onChange={e => setOrden(e.target.value)}>
                <option value="calificacion">Mejor calificadas</option>
                <option value="vistas">Más guardadas</option>
                <option value="recientes">Más recientes</option>
              </select>
            </>
          )}
        </div>

        {/* Sección de resultados Locales */}
        {modoBusqueda === 'local' && (
          <div className="explorar-results animate-fade-in delay-300">
            {loading ? (
              <p className="results-count">Cargando películas...</p>
            ) : error ? (
              <p className="form-message error">{error}</p>
            ) : (
              <>
                <p className="results-count">{meta.total ?? peliculas.length} películas encontradas</p>
                {peliculas.length === 0 ? (
                  <div className="mylist-empty">
                    <div className="empty-icon">🎬</div>
                    <h3>Sin resultados locales</h3>
                    <p>No encontramos "{search}" en el catálogo local.</p>
                    {search.trim() && (
                      <button className="btn btn-primary" style={{ marginTop: '12px' }} onClick={handleSearchApi}>
                        🔍 Buscar "{search}" en la API de películas
                      </button>
                    )}
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
                        <span>Página {meta.current_page} de {meta.last_page}</span>
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
        )}

        {/* Sección de resultados API Online */}
        {modoBusqueda === 'api' && (
          <div className="explorar-results animate-fade-in delay-300">
            {apiLoading ? (
              <p className="results-count">Consultando API de películas...</p>
            ) : (
              <>
                <p className="results-count">{apiResults.length} resultados globales en la API de TMDB</p>
                {apiResults.length === 0 ? (
                  <div className="mylist-empty">
                    <div className="empty-icon">🔍</div>
                    <h3>No se encontraron resultados en la API</h3>
                    <p>Intenta buscando con otro título o palabra clave.</p>
                  </div>
                ) : (
                  <div className="explorar-grid">
                    {apiResults.map(movie => {
                      const isAdded = addedIds.includes(movie.external_id);
                      return (
                        <div key={movie.external_id} className="movie-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                          <div className="card-image-wrap">
                            <img
                              src={movie.imagen}
                              alt={movie.titulo}
                              className="card-image"
                              onError={e => { e.target.src = '/movie_posters.png'; }}
                            />
                            <div className="card-overlay">
                              <span className="rating-badge card-rating">⭐ {movie.calificacion_api}</span>
                            </div>
                          </div>

                          <div className="card-info" style={{ padding: '12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                            <div>
                              <h4 className="card-title" style={{ fontSize: '1rem', marginBottom: '4px' }}>{movie.titulo}</h4>
                              <p className="card-meta" style={{ fontSize: '0.8rem', color: '#888' }}>Año {movie.anio || 'N/A'}</p>
                              <p style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '6px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                {movie.sinopsis || 'Sin sinopsis disponible.'}
                              </p>
                            </div>

                            <div style={{ marginTop: '12px', display: 'flex', gap: '6px', flexDirection: 'column' }}>
                              <button
                                className={`btn ${isAdded ? 'btn-outline in-list' : 'btn-primary'}`}
                                style={{ width: '100%', fontSize: '0.85rem', padding: '6px 10px' }}
                                onClick={() => handleAgregarAMiLista(movie, false)}
                              >
                                {isAdded ? '✓ En Mi Lista' : '+ Agregar a Mi Lista'}
                              </button>
                              <button
                                className="btn btn-outline"
                                style={{ width: '100%', fontSize: '0.85rem', padding: '6px 10px' }}
                                onClick={() => handleAgregarAMiLista(movie, true)}
                              >
                                ✓ Marcar como Vista
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
