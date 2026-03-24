import ThemeToggle from './ThemeToggle';
import { Film } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-40 py-3 px-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
          <Film size={18} className="text-primary" />
        </div>
        <h1 className="text-lg font-bold text-foreground tracking-tight">HomeWatch</h1>
      </div>
      <ThemeToggle />
    </header>
  );
}
