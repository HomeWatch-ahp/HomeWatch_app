import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { searchMulti, getTrending } from '@/lib/tmdb';
import { addToGallery, isInGallery, type MediaItem } from '@/lib/storage';
import MediaCard from '@/components/MediaCard';
import { useToast } from '@/hooks/use-toast';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [trending, setTrending] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    getTrending('movie').then(r => setTrending(r.slice(0, 10)));
  }, []);

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

  const handleAdd = (r: any) => {
    const item: MediaItem = {
      id: r.id,
      title: r.title || r.name,
      posterPath: r.poster_path,
      year: (r.release_date || r.first_air_date || '').slice(0, 4),
      type: r.media_type === 'movie' ? 'movie' : 'tv',
      overview: r.overview,
    };
    addToGallery(item);
    toast({
      title: 'Ajouté !',
      description: `${item.title} a été ajouté à votre galerie.`,
    });
  };

  const toMediaItem = (r: any): MediaItem => ({
    id: r.id,
    title: r.title || r.name,
    posterPath: r.poster_path,
    year: (r.release_date || r.first_air_date || '').slice(0, 4),
    type: r.media_type === 'movie' ? 'movie' : (r.media_type || 'movie'),
    overview: r.overview,
  });

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
        <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
          Tendances de la semaine
        </h3>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl aspect-[2/3] animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3"
        >
          {displayItems.map((r, i) => {
            const item = toMediaItem(r);
            const added = isInGallery(item.id, item.type);
            return (
              <MediaCard
                key={`${r.id}-${r.media_type}`}
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
