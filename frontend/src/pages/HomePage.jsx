import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { apiRequest } from '../services/api';
import './HomePage.css';

export default function HomePage() {
  const [peliculas, setPeliculas] = useState([]);
  const [generos, setGeneros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      apiRequest('/peliculas?per_page=20&orden=calificacion'),
      apiRequest('/generos'),
    ])
      .then(([peliculasResponse, generosResponse]) => {
        setPeliculas(peliculasResponse.data || []);
        setGeneros(generosResponse.data || []);
      })
      .catch(() => setError('No se pudieron cargar las peliculas desde el backend.'))
      .finally(() => setLoading(false));
  }, []);

  const heroMovie = peliculas[0];
  const masVistas = [...peliculas].sort((a, b) => b.vistas - a.vistas).slice(0, 8);
  const mejorCalif = [...peliculas].sort((a, b) => b.calificacion_promedio - a.calificacion_promedio).slice(0, 8);
  const recientes = peliculas.filter(p => p.anio >= 2021).slice(0, 8);

  if (loading) {
    return <div className="page-wrapper"><main className="home-main container"><p>Cargando peliculas...</p></main></div>;
  }

  return (
    <div className="page-wrapper">
      {heroMovie && <HeroSection pelicula={heroMovie} />}

      <main className="home-main container">
        {error && <p className="form-message error">{error}</p>}

        <section className="genres-bar animate-fade-in">
          <Link to="/explorar" className="genre-chip active">Todos</Link>
          {generos.map(g => (
            <Link key={g.id} to={`/explorar?genero=${g.id}`} className="genre-chip">
              {g.nombre}
            </Link>
          ))}
        </section>

        <section className="home-section animate-fade-in delay-100">
          <div className="section-header">
            <h2>Mas guardadas</h2>
            <Link to="/explorar" className="ver-todas">Ver todas</Link>
          </div>
          <div className="scroll-row">
            {masVistas.map(p => <MovieCard key={p.id} pelicula={p} />)}
          </div>
        </section>

        <section className="home-section animate-fade-in delay-200">
          <div className="section-header">
            <h2>Mejor calificadas</h2>
            <Link to="/explorar" className="ver-todas">Ver todas</Link>
          </div>
          <div className="scroll-row">
            {mejorCalif.map(p => <MovieCard key={p.id} pelicula={p} />)}
          </div>
        </section>

        {recientes.length > 0 && (
          <section className="home-section animate-fade-in delay-300">
            <div className="section-header">
              <h2>Recientes</h2>
              <Link to="/explorar" className="ver-todas">Ver catalogo</Link>
            </div>
            <div className="scroll-row">
              {recientes.map(p => <MovieCard key={p.id} pelicula={p} />)}
            </div>
          </section>
        )}

        <section className="home-cta animate-fade-in delay-400">
          <div className="home-cta-content">
            <h2>Listo para descubrir el cine mexicano?</h2>
            <p>Crea tu cuenta gratis y empieza a guardar tus peliculas favoritas, escribir resenas y conectar con otros cinefilos del ITO.</p>
            <div className="home-cta-actions">
              <Link to="/login" className="btn btn-primary">Crear Cuenta Gratis</Link>
              <Link to="/explorar" className="btn btn-outline">Explorar Peliculas</Link>
            </div>
          </div>
          <div className="home-cta-stats">
            <div className="stat-item">
              <span className="stat-num">{peliculas.length}</span>
              <span className="stat-label">Peliculas</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{peliculas.reduce((total, p) => total + (p.resenas_count || 0), 0)}</span>
              <span className="stat-label">Resenas</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">{generos.length}</span>
              <span className="stat-label">Generos</span>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
