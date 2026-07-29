import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyListPage from './pages/MyListPage'
import MovieDetailPage from './pages/MovieDetailPage'
import ExplorarPage from './pages/ExplorarPage'
import ProfilePage from './pages/ProfilePage'
import PublicProfilePage from './pages/PublicProfilePage'
import AdminPage from './pages/AdminPage'
import ModeratorPage from './pages/ModeratorPage'
import ProtectedRoute from './components/ProtectedRoute'
import ResetPassword from './pages/ResetPassword';

export default function App() {
  return (
    <>
      <Routes>
        {/* RUTAS SIN NAVBAR (Flujo de autenticación) */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* RUTAS CON NAVBAR */}
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/explorar" element={<ExplorarPage />} />
                <Route path="/mi-lista" element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
                <Route path="/pelicula/:id" element={<MovieDetailPage />} />
                <Route path="/perfil" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/usuarios/:id" element={<PublicProfilePage />} />
                <Route path="/moderador" element={<ProtectedRoute roles={['Administrador', 'Moderador']}><ModeratorPage /></ProtectedRoute>} />
                <Route path="/admin" element={<ProtectedRoute roles={['Administrador']}><AdminPage /></ProtectedRoute>} />

                {/* El comodín '*' SIEMPRE debe ser la última ruta */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  )
}
