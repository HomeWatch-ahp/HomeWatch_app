export interface MediaItem {
  id: number;
  title: string;
  posterPath: string | null;
  year: string;
  type: 'movie' | 'tv';
  overview?: string;
}

const STORAGE_KEY = 'homewatch_gallery';

export function getGallery(): MediaItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addToGallery(item: MediaItem): MediaItem[] {
  const gallery = getGallery();
  if (gallery.some(g => g.id === item.id && g.type === item.type)) return gallery;
  const updated = [item, ...gallery];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function removeFromGallery(id: number, type: 'movie' | 'tv'): MediaItem[] {
  const gallery = getGallery().filter(g => !(g.id === id && g.type === type));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(gallery));
  return gallery;
}

export function reorderGallery(items: MediaItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function isInGallery(id: number, type: 'movie' | 'tv'): boolean {
  return getGallery().some(g => g.id === id && g.type === type);
}
