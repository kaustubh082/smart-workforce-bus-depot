const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export async function api(path, { token, ...options } = {}) {
  const sessionToken = token || localStorage.getItem('depot_token');
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}), ...options.headers },
    ...options,
  });
  const body = await response.json().catch(() => ({ success: false, message: 'The server returned an invalid response.' }));
  if (!response.ok) { const error = new Error(body.message || 'Request failed.'); error.status = response.status; throw error; }
  return body.data;
}
