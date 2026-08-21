const apiUrl = import.meta.env.VITE_API_URL || '';

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(payload?.error || 'Something went wrong.');
  }

  return payload;
}

export function createAuthHeaders(session) {
  return session?.access_token
    ? { Authorization: `Bearer ${session.access_token}` }
    : {};
}

export function getProfile(session) {
  return apiRequest('/api/profile', { headers: createAuthHeaders(session) });
}
