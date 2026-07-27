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

  const data = await response.json();

  if (!response.ok) {
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
