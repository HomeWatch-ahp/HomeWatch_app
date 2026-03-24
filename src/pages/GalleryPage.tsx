import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGallery, removeFromGallery, type MediaItem } from '@/lib/firestore';
import { useAuth } from '@/contexts/AuthContext';
import MediaCard from '@/components/MediaCard';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  type: 'movie' | 'tv';
  title: string;
}

export default function GalleryPage({ type, title }: Props) {
  const { user } = useAuth();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    getGallery(user.uid).then((all) => {
      setItems(all.filter((i) => i.type === type));
      setLoading(false);
    });
  }, [user, type]);

  const handleRemove = async (id: number) => {
    if (!user) return;
    await removeFromGallery(user.uid, id, type);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <div className="px-4 pb-28 pt-2">
        <div className="mb-6">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass rounded-xl aspect-[2/3] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pb-28 pt-2">
      <div className="mb-6">
        <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</h2>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="glass rounded-2xl p-8 text-center space-y-3">
            <p className="text-muted-foreground text-sm">Votre cinéma est vide</p>
            <button
              onClick={() => navigate('/search')}
              className="inline-flex items-center gap-2 text-primary text-sm font-medium hover:underline"
            >
              <Search size={16} />
              Rechercher des titres
            </button>
          </div>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {items.map((item, i) => (
            <MediaCard
              key={`${item.type}-${item.id}`}
              item={item}
              inGallery
              onRemove={() => handleRemove(item.id)}
              index={i}
            />
          ))}
        </div>
      )}
    </div>
  );
}
