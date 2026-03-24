import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [light, setLight] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('light', light);
  }, [light]);

  return (
    <button
      onClick={() => setLight(!light)}
      className="glass rounded-full p-2 transition-transform hover:scale-105 active:scale-95"
      aria-label="Toggle theme"
    >
      {light ? (
        <Moon size={18} className="text-foreground" />
      ) : (
        <Sun size={18} className="text-secondary" />
      )}
    </button>
  );
}
