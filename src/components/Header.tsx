import { Film, LogOut } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  return (
    <>
      <header className="sticky top-0 z-40 py-3 px-4 flex items-center justify-center relative">
        <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
          <Film size={18} className="text-primary" />
        </div>

        <div className="absolute right-4 flex items-center gap-2">
          <ThemeToggle />
          {user && (
            <button
              onClick={logout}
              className="glass rounded-full p-2 transition-transform hover:scale-105 active:scale-95 text-muted-foreground hover:text-foreground"
              aria-label="Se déconnecter"
              title="Se déconnecter"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </header>
      <div className="h-px bg-border mx-4" />
    </>
  );
}
