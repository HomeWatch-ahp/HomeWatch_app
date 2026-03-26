import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { searchMulti, getTrending } from '@/lib/tmdb';
import { addToGallery, isInGallery, type MediaItem } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import MediaCard from '@/components/MediaCard';
import { useToast } from '@/hooks/use-toast';

export default function SearchPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [trendingFilter, setTrendingFilter] = useState<'movie' | 'tv'>('movie');
  const [loading, setLoading] = useState(false);
  // On garde la liste locale pour isInGallery sans re-fetch Firestore à chaque action
  const [galleryIds, setGalleryIds] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    setLoading(true);
    getTrending(trendingFilter).then((r) => {
      setTrending(r.slice(0, 20));
      setLoading(false);
    });
  }, [trendingFilter]);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const res = await searchMulti(q);
    setResults(res);
    setLoading(false);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => doSearch(query), 400);
    return () => clearTimeout(timer);
  }, [query, doSearch]);

  const toMediaItem = (r: any): MediaItem => ({
    id: r.id,
    title: r.title || r.name,
    posterPath: r.poster_path,
    year: (r.release_date || r.first_air_date || '').slice(0, 4),
    type: r.media_type === 'movie' ? 'movie' : 'tv',
    overview: r.overview,
  });

  const handleAdd = async (r: any) => {
    if (!user) return;
    const item = toMediaItem(r);
    const key = `${item.type}-${item.id}`;
    try {
      await addToGallery(user.uid, item);
      setGalleryIds((prev) => new Set(prev).add(key));
      toast({
        title: 'Ajouté !',
        description: `${item.title} a été ajouté à votre galerie.`,
      });
    } catch {
      toast({
        title: 'Erreur',
        description: "Impossible d'ajouter ce titre.",
        variant: 'destructive',
      });
    }
  };

  const checkInGallery = (r: any): boolean => {
    const type = r.media_type === 'movie' ? 'movie' : 'tv';
    return galleryIds.has(`${type}-${r.id}`);
  };

  const displayItems = query.trim() ? results : trending;

  return (
    <div className="px-4 pb-28 pt-2">
      {/* Search bar */}
      <div className="relative mb-6">
        <div className="glass rounded-lg flex items-center px-4 py-3 gap-3">
          <Search size={20} className="text-muted-foreground shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un film ou une série..."
            className="bg-transparent flex-1 text-foreground placeholder:text-muted-foreground outline-none text-sm"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-muted-foreground hover:text-foreground">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {!query.trim() && (
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Tendances
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setTrendingFilter('movie')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                trendingFilter === 'movie'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass text-muted-foreground hover:text-foreground'
              }`}
            >
              Films
            </button>
            <button
              onClick={() => setTrendingFilter('tv')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                trendingFilter === 'tv'
                  ? 'bg-primary text-primary-foreground'
                  : 'glass text-muted-foreground hover:text-foreground'
              }`}
            >
              Séries
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl aspect-[2/3] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {displayItems.map((r, i) => {
            const item = toMediaItem(r);
            const added = checkInGallery(r);
            return (
              <MediaCard
                key={`${r.id}-${r.media_type || item.type}`}
                item={item}
                inGallery={added}
                onAdd={() => handleAdd(r)}
                index={i}
              />
            );
          })}
        </motion.div>
      )}

      {query.trim() && results.length === 0 && !loading && (
        <p className="text-center text-muted-foreground py-12 text-sm">
          Aucun résultat pour « {query} »
        </p>
      )}
    </div>
  );
}
