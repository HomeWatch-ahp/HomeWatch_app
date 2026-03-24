import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGallery, removeFromGallery, type MediaItem } from '@/lib/storage';
import MediaCard from '@/components/MediaCard';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  type: 'movie' | 'tv';
  title: string;
}

export default function GalleryPage({ type, title }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setItems(getGallery().filter(i => i.type === type));
  }, [type]);

  const handleRemove = (id: number) => {
    const updated = removeFromGallery(id, type);
    setItems(updated.filter(i => i.type === type));
  };

  return (
    <div className="px-4 pb-28 pt-2">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground text-balance">{title}</h2>
        <span className="text-sm text-muted-foreground font-medium">
          {items.length} titre{items.length !== 1 ? 's' : ''}
        </span>
      </div>

      {items.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 gap-4"
        >
          <div className="glass rounded-2xl p-8 text-center space-y-3">
            <p className="text-muted-foreground text-sm">
              Votre cinéma est vide
            </p>
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
