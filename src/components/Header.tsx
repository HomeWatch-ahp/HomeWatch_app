import ThemeToggle from './ThemeToggle';
import { Film } from 'lucide-react';

export default function Header() {
  return (
    <>
      <header className="sticky top-0 z-40 py-3 px-4 flex items-center justify-center relative">
        <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center">
          <Film size={18} className="text-primary" />
        </div>
        <div className="absolute right-4">
          <ThemeToggle />
        </div>
      </header>
      <div className="h-px bg-border mx-4" />
    </>
  );
}
