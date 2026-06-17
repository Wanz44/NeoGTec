import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, ShieldAlert } from 'lucide-react';

interface YoutubeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function YoutubeDialog({ isOpen, onClose }: YoutubeDialogProps) {
  // We use GTM event tracking on interaction
  React.useEffect(() => {
    if (isOpen) {
      // Trigger GTM simulation or analytic logs
      console.log('GTM event: click_video');
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'click_video' });
      }
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[550] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/85 backdrop-blur-md cursor-pointer"
          />

          {/* Dialog Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="relative bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Play className="w-5 h-5 text-[#00A86B] fill-current animate-pulse" />
                <span className="text-xs font-mono font-black text-white uppercase tracking-wider">NeoGTec • Présentation Démo (2 min)</span>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer outline-none"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Wrapper */}
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <iframe
                title="NeoGTec B2B presentation video"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ"
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Footer */}
            <div className="bg-slate-950/60 px-6 py-3 border-t border-slate-850 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5 text-green-400">
                <ShieldAlert className="w-3.5 h-3.5" />
                Enregistrements de démonstration hébergés en RDC
              </span>
              <span>Rapport de sinistralité résolu - NeoGTec 2026</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
