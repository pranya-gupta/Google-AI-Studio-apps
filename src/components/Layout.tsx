import { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="pt-12 pb-8 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 mb-2"
        >
          <Sparkles className="w-5 h-5 text-[#c5a059]" />
          <span className="text-xs uppercase tracking-[0.3em] font-semibold text-[#c5a059]">Supernatural Style</span>
        </motion.div>
        <h1 className="serif text-6xl md:text-8xl font-light tracking-tight mb-4">grimoire</h1>
        <p className="text-muted max-w-md mx-auto text-sm md:text-base">
          Unlock your mystical aesthetic with fashion curated from the archives of Mystic Falls.
        </p>
      </header>

      <main className="max-w-4xl mx-auto px-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="mt-20 py-12 border-t border-black/5 text-center">
        <p className="serif text-2xl font-light mb-2">grimoire</p>
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted">Mystic Falls Archive © 2026</p>
      </footer>
    </div>
  );
}
