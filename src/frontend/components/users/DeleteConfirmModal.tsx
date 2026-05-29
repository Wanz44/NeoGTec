import React from 'react';
import { ShieldAlert, X, Trash2 } from 'lucide-react';
import { UserProfile } from '../../lib/AppContext';

interface DeleteConfirmModalProps {
  user: UserProfile | null;
  isOpen: boolean;
  onClose: () => void;
  confirmEmailText: string;
  setConfirmEmailText: (text: string) => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  user, isOpen, onClose, confirmEmailText, setConfirmEmailText, onConfirm
}) => {
  if (!isOpen || !user) return null;

  const isMatched = confirmEmailText === user.email;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md border overflow-hidden shadow-2xl p-6 md:p-8 space-y-4 text-slate-800">
        <div className="border-b pb-3 flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5 font-mono">
            <ShieldAlert className="w-5 h-5 text-rose-600 animate-bounce" /> ACTION IRRÉVERSIBLE CONFORME RGPD
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
            Vous vous apprêtez à révoquer définitivement de la base de données le compte de :
          </p>
          <div className="p-3 bg-rose-50 border border-rose-150 rounded-xl">
            <p className="text-xs font-black text-rose-950 uppercase">{user.name}</p>
            <p className="text-[10.5px] text-rose-700 font-semibold font-mono mt-0.5">{user.email}</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest font-mono">
              Saisir l'e-mail exact pour valider le droit de suppression :
            </label>
            <input
              type="text"
              placeholder={user.email}
              value={confirmEmailText}
              onChange={(e) => setConfirmEmailText(e.target.value)}
              className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-mono font-bold focus:outline-none"
            />
          </div>

          <p className="text-[10px] text-slate-400 leading-none">
            Cette suppression purgera les logs actifs et désengagera ses clés API actives avec effet immédiat.
          </p>
        </div>

        <div className="flex gap-2 border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase rounded-xl cursor-pointer"
          >
            Conserver / Annuler
          </button>
          <button
            type="button"
            disabled={!isMatched}
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-all ${
              isMatched 
                ? "bg-rose-600 hover:bg-rose-700 shadow-lg shadow-rose-600/10" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Supprimer définitivement
          </button>
        </div>
      </div>
    </div>
  );
};
