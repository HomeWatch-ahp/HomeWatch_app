import ThemeToggle from './ThemeToggle';
import { Film } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 py-3 px-4 flex items-center justify-center relative">
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-md bg-primary/20 flex items-center justify-center">
          <Film size={16} className="text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground tracking-tight">HomeWatch</h1>
      </div>
      <div className="absolute right-4">
        <ThemeToggle />
      </div>
    </header>
  );
}
