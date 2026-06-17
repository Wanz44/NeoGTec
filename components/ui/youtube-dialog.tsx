import React, { useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';

interface YoutubeDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function YoutubeDialog({ isOpen, onClose }: YoutubeDialogProps) {
  useEffect(() => {
    if (isOpen) {
      console.log('GTM event: click_video');
      if (typeof window !== 'undefined' && (window as any).dataLayer) {
        (window as any).dataLayer.push({ event: 'click_video' });
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-200 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl z-210">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800">
          <span className="text-white font-extrabold uppercase text-xs tracking-wider">NeoGTec : Démo Produit 2min</span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
          <Loader2 className="absolute w-8 h-8 text-[#00A86B] animate-spin z-0" />
          {/* Compliant YouTube Embed using GDPR-friendly youtube-nocookie.com domain */}
          <iframe
            src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
            title="NeoGTec Product Demo"
            className="absolute inset-0 w-full h-full border-0 z-10"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
