import React, { useState } from 'react';
import { Camera } from 'lucide-react';

interface CropModalProps {
  isOpen: boolean;
  previewUrl: string | null;
  onClose: () => void;
  onApply: (croppedUrl: string) => void;
}

export const CropModal: React.FC<CropModalProps> = ({ isOpen, previewUrl, onClose, onApply }) => {
  const [zoom, setZoom] = useState(1);

  if (!isOpen || !previewUrl) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl w-full max-w-md border overflow-hidden shadow-2xl p-6 space-y-4 text-slate-900">
        <div className="border-b pb-3">
          <h3 className="text-sm font-black uppercase tracking-wider text-green-600 flex items-center gap-1">
            <Camera className="w-4 h-4 text-green-600" /> Ajustement du Sceau (Crop 1:1)
          </h3>
          <p className="text-[10.5px] text-slate-450 font-semibold">Centrez et cadrez l'image pour le format circulaire standard hôpital.</p>
        </div>

        <div className="space-y-4 flex flex-col items-center">
          <div className="relative w-48 h-48 border border-dashed border-green-400 bg-slate-900 rounded-2xl overflow-hidden flex items-center justify-center">
            <img
              src={previewUrl}
              style={{ transform: `scale(${zoom})` }}
              className="w-full h-full object-contain transition-transform"
              alt="Photo preview"
            />
            {/* Circular bounding box guide */}
            <div className="absolute inset-0 pointer-events-none border-[12px] border-slate-950/70" />
            <div className="absolute inset-3 pointer-events-none border-2 border-white rounded-full opacity-60" />
          </div>

          <div className="w-full space-y-1">
            <div className="flex justify-between text-[10px] font-black text-slate-400">
              <span>ZOOM</span>
              <span>{Math.round(zoom * 100)}%</span>
            </div>
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoom}
              onChange={(e) => setZoom(parseFloat(e.target.value))}
              className="w-full accent-green-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none"
            />
          </div>
        </div>

        <div className="flex gap-2 border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 rounded-xl text-xs font-bold uppercase transition cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={() => onApply(previewUrl)}
            className="flex-1 py-2.5 bg-[#059669] hover:bg-[#047857] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition shadow cursor-pointer"
          >
            Cadrer &amp; Valider 1:1
          </button>
        </div>
      </div>
    </div>
  );
};
