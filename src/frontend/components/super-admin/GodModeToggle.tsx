import React, { useState } from 'react';
import { 
  ShieldAlert, ShieldCheck, X, Eye, 
  Terminal, ShieldCheck as ShieldOk
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface GodModeToggleProps {
  onToggle: (active: boolean, reason?: string) => void;
  active: boolean;
  onLogIncident: (action: string, details: string) => void;
}

export const GodModeToggle: React.FC<GodModeToggleProps> = ({
  onToggle,
  active,
  onLogIncident
}) => {
  const [showModal, setShowModal] = useState(false);
  const [reason, setReason] = useState('');
  const [errorText, setErrorText] = useState('');

  const handleToggleClick = () => {
    if (active) {
      // Safely toggle OFF immediately without query
      onToggle(false);
      onLogIncident('RLS_RESTORED', 'Rétablissement des politiques d\'accès standard RLS sur toutes les tables.');
    } else {
      // Request reason details first
      setReason('');
      setErrorText('');
      setShowModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 8) {
      setErrorText('Le motif doit comporter au moins 8 caractères pour l\'audit de conformité.');
      return;
    }

    // Toggle ON and pass back the reason
    onToggle(true, reason);
    onLogIncident('GOD_MODE_BYPASS_RLS', `Outrepassage de la sécurité RLS autorisé. Motif : "${reason}"`);
    setShowModal(false);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col text-right">
        <span className="text-[9px] font-black uppercase text-slate-500 font-mono">Bypass RLS</span>
        <span className={cn(
          "text-[10px] font-bold uppercase tracking-wider",
          active ? "text-red-400 animate-pulse" : "text-emerald-400"
        )}>
          {active ? "Bypass Actif (Unsafe)" : "RLS Restreint (Secured)"}
        </span>
      </div>

      {/* Actual button switch UI */}
      <button
        type="button"
        onClick={handleToggleClick}
        className={cn(
          "relative w-14 h-7 rounded-full p-1 transition-all duration-300 outline-none cursor-pointer focus:ring-4 focus:ring-red-500/15",
          active ? "bg-red-650" : "bg-slate-850 border border-slate-800"
        )}
      >
        <div className={cn(
          "w-5 h-5 rounded-full shadow-lg transition-transform duration-300 flex items-center justify-center text-[8px]",
          active 
            ? "translate-x-7 bg-white text-red-600" 
            : "bg-slate-600 text-slate-400"
        )}>
          {active ? "ON" : "OFF"}
        </div>
      </button>

      {/* Motif Request dialogue modal box */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-805 rounded-3xl p-6 max-w-md w-full relative overflow-hidden text-slate-300 shadow-2xl"
            >
              {/* Alert stripes */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-500 via-red-500 to-yellow-500" />

              <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2.5 text-red-400">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <span className="text-sm font-black uppercase tracking-wider">Audit de niveau critique requis</span>
                </div>
                <button 
                  onClick={() => setShowModal(false)}
                  className="p-1 text-slate-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <p className="text-xs text-slate-400 leading-relaxed font-semibold">
                  L'outrepassage de sécurité (<span className="text-red-400 font-bold font-mono">Bypass Row-Level Security</span>) permet de visualiser les données de tous les tenants sans restriction. Cette action est hautement critique et sera auditée sur la table système.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block font-bold">
                    Justifier le motif d'accès :
                  </label>
                  <textarea
                    required
                    placeholder="Saisir la justification technique (ex: Résolution d'urgence du ticket #8442 - Latence de base de données)..."
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                      setErrorText('');
                    }}
                    className="w-full h-20 bg-slate-950 border border-slate-800 rounded-2xl p-3 text-xs font-semibold text-slate-300 focus:outline-none focus:border-red-500 transition-colors outline-none placeholder:text-slate-700"
                  />
                  {errorText && (
                    <p className="text-[9.5px] font-bold text-red-400 font-mono">
                      {errorText}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-2.5 pt-2 border-t border-slate-850">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer font-bold"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-red-650 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Bypass RLS
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
