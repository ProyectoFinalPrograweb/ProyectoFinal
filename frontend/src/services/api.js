export const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

export function getCurrentUser() {
  try {
    return JSON.parse(localStorage.getItem('cinema_ito_user'));
  } catch {
    return null;
  }
}

export function getAuthToken() {
  return localStorage.getItem('cinema_ito_token');
}

export function saveSession(user, token) {
  localStorage.setItem('cinema_ito_user', JSON.stringify(user));
  localStorage.setItem('cinema_ito_token', token);
}

export function clearSession() {
  localStorage.removeItem('cinema_ito_user');
  localStorage.removeItem('cinema_ito_token');
}

export async function apiRequest(path, options = {}) {
  const token = getAuthToken();

  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    if (response.status === 401) {
      clearSession();
      window.location.href = '/login';
      return;
    }
    const error = new Error(data.message || 'No se pudo completar la solicitud.');
    error.errors = data.errors || {};
    throw error;
  }

  return data;
}

export function buildQuery(params) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 0) {
      searchParams.set(key, value);
    }
  });

  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export async function buscarPeliculasApi(query) {
  if (!query) return { data: [] };
  return apiRequest(`/peliculas-api/buscar?query=${encodeURIComponent(query)}`);
}

export async function obtenerDetalleApi(externalId) {
  return apiRequest(`/peliculas-api/detalle/${externalId}`);
}

export async function sincronizarPostersApi() {
  return apiRequest('/admin/peliculas/sincronizar-posters', {
    method: 'POST',
  });
}

export async function importarYFavoritoApi(movieData) {
  return apiRequest('/peliculas/importar-favorito', {
    method: 'POST',
    body: JSON.stringify(movieData),
  });
}


