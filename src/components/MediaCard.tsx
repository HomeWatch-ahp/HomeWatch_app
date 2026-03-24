import { motion } from 'framer-motion';
import { Plus, Check, X } from 'lucide-react';
import { posterUrl } from '@/lib/tmdb';
import type { MediaItem } from '@/lib/storage';

interface Props {
  item: MediaItem;
  inGallery?: boolean;
  onAdd?: () => void;
  onRemove?: () => void;
  index?: number;
}

export default function MediaCard({ item, inGallery, onAdd, onRemove, index = 0 }: Props) {
  const poster = posterUrl(item.posterPath);

  return (
    <motion.div
      initial={{ opacity: 0, filter: 'blur(8px)' }}
      animate={{ opacity: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group relative rounded-xl overflow-hidden"
    >
      <div className="aspect-[2/3] relative">
        {poster ? (
          <img
            src={poster}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No poster</span>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-3">
          {onAdd && !inGallery && (
            <button
              onClick={onAdd}
              className="glass rounded-full p-2 text-primary hover:glow-cyan transition-all active:scale-90"
            >
              <Plus size={18} />
            </button>
          )}
          {inGallery && onRemove && (
            <button
              onClick={onRemove}
              className="glass rounded-full p-2 text-destructive hover:opacity-80 transition-all active:scale-90"
            >
              <X size={18} />
            </button>
          )}
          {inGallery && !onRemove && (
            <span className="glass rounded-full p-2 text-primary">
              <Check size={18} />
            </span>
          )}
        </div>
      </div>

      <div className="p-2 space-y-0.5">
        <p className="text-sm font-medium text-foreground truncate">{item.title}</p>
        <p className="text-xs text-muted-foreground">{item.year}</p>
      </div>
    </motion.div>
  );
}
