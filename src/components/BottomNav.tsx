import { Tv, Search, Film } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { path: '/series', icon: Tv, label: 'Séries' },
  { path: '/search', icon: Search, label: 'Recherche' },
  { path: '/films', icon: Film, label: 'Films' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md">
      <div className="glass-nav rounded-xl flex items-center justify-around py-3 px-4">
        {tabs.map(({ path, icon: Icon, label }) => {
          const active = location.pathname === path || (path === '/films' && location.pathname === '/');
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className="relative flex flex-col items-center gap-1 px-4 py-1 transition-colors"
            >
              <Icon
                size={22}
                className={active ? 'text-primary' : 'text-muted-foreground'}
                strokeWidth={active ? 2.5 : 2}
              />
              <span className={`text-xs font-medium ${active ? 'text-primary' : 'text-muted-foreground'}`}>
                {label}
              </span>
              {active && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute -bottom-1 w-1 h-1 rounded-full bg-primary"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
