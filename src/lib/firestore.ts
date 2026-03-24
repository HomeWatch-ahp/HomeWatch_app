import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

export interface MediaItem {
  id: number;
  title: string;
  posterPath: string | null;
  year: string;
  type: 'movie' | 'tv';
  overview?: string;
}

interface FirestoreMediaItem extends MediaItem {
  addedAt: Timestamp | null;
}

// Collection reference pour un utilisateur donné
const galleryRef = (userId: string) =>
  collection(db, 'users', userId, 'gallery');

// Clé unique pour un item (évite les doublons movie/tv avec le même id TMDB)
const itemDocId = (item: MediaItem) => `${item.type}-${item.id}`;

// Récupérer toute la galerie d'un utilisateur
export async function getGallery(userId: string): Promise<MediaItem[]> {
  try {
    const q = query(galleryRef(userId), orderBy('addedAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as FirestoreMediaItem;
      return {
        id: data.id,
        title: data.title,
        posterPath: data.posterPath,
        year: data.year,
        type: data.type,
        overview: data.overview,
      };
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de la galerie:', error);
    return [];
  }
}

// Ajouter un item à la galerie
export async function addToGallery(userId: string, item: MediaItem): Promise<void> {
  try {
    const docRef = doc(galleryRef(userId), itemDocId(item));
    await setDoc(docRef, {
      ...item,
      addedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Erreur lors de l'ajout à la galerie:", error);
    throw error;
  }
}

// Supprimer un item de la galerie
export async function removeFromGallery(
  userId: string,
  id: number,
  type: 'movie' | 'tv'
): Promise<void> {
  try {
    const docRef = doc(galleryRef(userId), `${type}-${id}`);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Erreur lors de la suppression de la galerie:', error);
    throw error;
  }
}

// Vérifier si un item est dans la galerie (côté client, depuis la liste déjà chargée)
export function isInGallery(
  gallery: MediaItem[],
  id: number,
  type: 'movie' | 'tv'
): boolean {
  return gallery.some((g) => g.id === id && g.type === type);
}
