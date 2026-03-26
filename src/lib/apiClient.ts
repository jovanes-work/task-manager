const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

// Realiza una petición HTTP al backend. Agrega Content-Type: application/json
// a todos los requests, lanza un Error con el status y cuerpo si la respuesta
// no es ok, y devuelve undefined en respuestas 204 (sin contenido).
async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`HTTP ${response.status}: ${endpoint} — ${errorBody}`);
  }

  if (response.status === 204) return undefined as unknown as T; // Safe: solo se alcanza en respuestas void (DELETE)
  return (await response.json()) as unknown as T; // Safe: el caller es responsable de que T coincida con el contrato del servidor
}

export const apiClient = {
  get: <T>(endpoint: string): Promise<T> => request<T>(endpoint),
  post: <T>(endpoint: string, body: unknown): Promise<T> =>
    request<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(endpoint: string, body: unknown): Promise<T> =>
    request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(endpoint: string): Promise<T> =>
    request<T>(endpoint, { method: 'DELETE' }),
};
