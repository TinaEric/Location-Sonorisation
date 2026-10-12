import mockMaterielsDisponibles from '../data/mockMaterielsDisponibles.js';

// Adresse de l'API : à définir dans un fichier .env (voir .env.example)
const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');
const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true';

const wait = (ms, signal) =>
  new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener('abort', () => {
      clearTimeout(timer);
      reject(new DOMException('Aborted', 'AbortError'));
    });
  });

/**
 * Matériel disponible entre deux dates, groupé par catégorie.
 * GET /reservations/materiels-disponibles?dateDebut=AAAA-MM-JJ&dateFin=AAAA-MM-JJ
 */
export async function fetchMaterielsDisponibles({ dateDebut, dateFin }, signal) {
  if (USE_MOCK) {
    await wait(500, signal);
    return structuredClone(mockMaterielsDisponibles);
  }

  const params = new URLSearchParams({ dateDebut, dateFin });
  let response;
  try {
    response = await fetch(`${API_URL}/reservations/materiels-disponibles?${params}`, {
      signal,
      headers: { Accept: 'application/json' },
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Le serveur ne répond pas'); // API arrêtée, mauvaise adresse ou CORS non autorisé
  }

  if (!response.ok) {
    // NestJS renvoie { message, error, statusCode } : on affiche son message s'il existe
    const body = await response.json().catch(() => null);
    const message = Array.isArray(body?.message) ? body.message.join(', ') : body?.message;
    throw new Error(message || `Erreur ${response.status} du serveur`);
  }
  return response.json();
}
