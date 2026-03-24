const TMDB_BASE = 'https://api.themoviedb.org/3';
const TMDB_KEY = '2dca580c2a14b55200e784d157207b4d';
const IMG_BASE = 'https://image.tmdb.org/t/p';

export const posterUrl = (path: string | null, size = 'w342') =>
  path ? `${IMG_BASE}/${size}${path}` : null;

export async function searchMulti(query: string): Promise<any[]> {
  if (!query.trim()) return [];
  const res = await fetch(
    `${TMDB_BASE}/search/multi?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&language=fr-FR`
  );
  const data = await res.json();
  return (data.results || []).filter(
    (r: any) => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path
  );
}

export async function getTrending(type: 'movie' | 'tv'): Promise<any[]> {
  const res = await fetch(
    `${TMDB_BASE}/trending/${type}/week?api_key=${TMDB_KEY}&language=fr-FR`
  );
  const data = await res.json();
  return data.results || [];
}
