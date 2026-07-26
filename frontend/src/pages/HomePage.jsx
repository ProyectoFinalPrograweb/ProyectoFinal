import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import MovieCard from '../components/MovieCard';
import Footer from '../components/Footer';
import { peliculas, generos } from '../data/mockData';
import './HomePage.css';

const heroMovie = peliculas.find(p => p.esHero) || peliculas[0];
const masVistas  = [...peliculas].sort((a, b) => b.vistas - a.vistas).slice(0, 8);
const mejorCalif = [...peliculas].sort((a, b) => b.calificacion_promedio - a.calificacion_promedio).slice(0, 8);
const recientes  = peliculas.filter(p => p.anio >= 2024).slice(0, 8);

export default function HomePage() {
  return (
    <div className="page-wrapper">

      {/* Hero principal */}
      <HeroSection pelicula={heroMovie} />

      {/* ---- Carruseles ---- */}
      <main className="home-main container">

        {/* Géneros */}
        <section className="genres-bar animate-fade-in">
          <Link to="/explorar" className={`genre-chip active`}>Todos</Link>
          {generos.map(g => (
            <Link key={g.id} to={`/explorar?genero=${g.id}`} className="genre-chip">
              {g.nombre}
            </Link>
          ))}
        </section>

        {/* Más vistas */}
        <section className="home-section animate-fade-in delay-100">
          <div className="section-header">
            <h2>Últimas películas más vistas</h2>
            <Link to="/explorar" className="ver-todas">Ver todas →</Link>
          </div>
          <div className="scroll-row">
            {masVistas.map(p => (
              <MovieCard key={p.id} pelicula={p} />
            ))}
          </div>
        </section>

        {/* Mejor calificadas */}
        <section className="home-section animate-fade-in delay-200">
          <div className="section-header">
            <h2>Mejor calificadas</h2>
            <Link to="/explorar" className="ver-todas">Ver todas →</Link>
          </div>
          <div className="scroll-row">
            {mejorCalif.map(p => (
              <MovieCard key={p.id} pelicula={p} />
            ))}
          </div>
        </section>

        {/* Estrenos 2024 */}
        {recientes.length > 0 && (
          <section className="home-section animate-fade-in delay-300">
            <div className="section-header">
              <h2>Estrenos 2024</h2>
              <Link to="/cartelera" className="ver-todas">Ver cartelera →</Link>
            </div>
            <div className="scroll-row">
              {recientes.map(p => (
                <MovieCard key={p.id} pelicula={p} />
              ))}
            </div>
          </section>
        )}

        {/* Banner CTA */}
        <section className="home-cta animate-fade-in delay-400">
          <div className="home-cta-content">
            <h2>¿Listo para descubrir el cine mexicano?</h2>
            <p>Crea tu cuenta gratis y empieza a guardar tus películas favoritas, escribir reseñas y conectar con otros cinéfilos del ITO.</p>
            <div className="home-cta-actions">
              <Link to="/login" className="btn btn-primary">Crear Cuenta Gratis</Link>
              <Link to="/explorar" className="btn btn-outline">Explorar Películas</Link>
            </div>
          </div>
          <div className="home-cta-stats">
            <div className="stat-item">
              <span className="stat-num">+120</span>
              <span className="stat-label">Películas</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">+350</span>
              <span className="stat-label">Reseñas</span>
            </div>
            <div className="stat-item">
              <span className="stat-num">+80</span>
              <span className="stat-label">Usuarios</span>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
