import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import MyListPage from './pages/MyListPage'
import MovieDetailPage from './pages/MovieDetailPage'
import ExplorarPage from './pages/ExplorarPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'
import ModeratorPage from './pages/ModeratorPage'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      {/* Navbar aparece en todas las páginas excepto Login */}
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <Routes>
                <Route path="/"           element={<HomePage />} />
                <Route path="/explorar"   element={<ExplorarPage />} />
                <Route path="/mi-lista"   element={<ProtectedRoute><MyListPage /></ProtectedRoute>} />
                <Route path="/pelicula/:id" element={<MovieDetailPage />} />
                <Route path="/perfil"     element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                <Route path="/moderador"  element={<ProtectedRoute roles={['Administrador', 'Moderador']}><ModeratorPage /></ProtectedRoute>} />
                <Route path="/admin"      element={<ProtectedRoute roles={['Administrador']}><AdminPage /></ProtectedRoute>} />
                <Route path="*"           element={<Navigate to="/" replace />} />
              </Routes>
            </>
          }
        />
      </Routes>
    </>
  )
}
