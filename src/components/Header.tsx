import { Film, Menu, X, LogOut, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import Logo from "@/assets/logo-header.svg";

export default function Header() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [light, setLight] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.classList.toggle('light', light);
  }, [light]);

  // Close sidebar on outside click
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <>
      <header className="py-3 px-4 flex items-center justify-center">
        {/* Logo */}
        <div className="w-10 h-10 flex items-center justify-center">
          <img src={Logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
      </header>

      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={() => setOpen((v) => !v)}
          className="glass rounded-full p-2 transition-transform hover:scale-105 active:scale-95 text-muted-foreground hover:text-foreground"
          aria-label="Menu"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="h-px bg-border mx-4" />

      {/* Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="sidebar"
            ref={sidebarRef}
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed top-0 right-0 h-full w-72 z-50 flex flex-col"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.03))",
              backdropFilter: "blur(32px) saturate(160%)",
              WebkitBackdropFilter: "blur(32px) saturate(160%)",
              borderLeft: "1px solid rgba(192,192,192,0.15)",
              boxShadow:
                "-8px 0 40px rgba(0,0,0,0.4), inset 1px 0 1px rgba(255,255,255,0.08)",
            }}
          >
            {/* Close button */}
            <div className="flex justify-end px-5 pt-5 pb-2">
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all"
                aria-label="Fermer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex flex-col gap-2 px-5 pb-8 flex-1">
              {/* User email */}
              {user?.email && (
                <div className=" mb-3 px-3 py-2.5 rounded-xl bg-white/5 border border-white/8">
                  <p className=" text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              )}

              {/* Logout */}
              <button
                onClick={() => {
                  logout();
                  setOpen(false);
                }}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-foreground hover:bg-white/6 hover:text-destructive transition-all group"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-destructive/15 transition-colors">
                  <LogOut
                    size={16}
                    className="text-muted-foreground group-hover:text-destructive transition-colors"
                  />
                </span>
                <span className="font-medium">Se déconnecter</span>
              </button>
              <div className="h-px bg-border mx-4" />
              {/* Theme toggle */}
              <button
                onClick={() => setLight(!light)}
                className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm text-foreground hover:bg-white/6 transition-all group"
              >
                <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/5 group-hover:bg-primary/15 transition-colors">
                  {light ? (
                    <Moon
                      size={16}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  ) : (
                    <Sun
                      size={16}
                      className="text-muted-foreground group-hover:text-primary transition-colors"
                    />
                  )}
                </span>
                <span className="font-medium">
                  {light ? "Passer au thème sombre" : "Passer au thème clair"}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
