import React from 'react';
import { Ban, X } from 'lucide-react';
import { UserProfile } from '../../lib/AppContext';

interface SuspensionModalProps {
  user: UserProfile | null;
  bulk: boolean;
  selectedCount: number;
  isOpen: boolean;
  onClose: () => void;
  reason: string;
  setReason: (reason: string) => void;
  onConfirm: () => void;
}

export const SuspensionModal: React.FC<SuspensionModalProps> = ({
  user, bulk, selectedCount, isOpen, onClose, reason, setReason, onConfirm
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md border overflow-hidden shadow-2xl p-6 md:p-8 space-y-4 text-slate-800">
        <div className="border-b pb-3 flex justify-between items-center">
          <h3 className="text-sm font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5 font-mono">
            <Ban className="w-4 h-4 text-rose-600" /> Suspension Temporologique d'Accès
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
            {bulk ? (
              <span>Vous vous apprêtez à révoquer temporairement l'accès de <strong className="text-rose-600 italic font-black">{selectedCount} collaborateurs</strong> sélectionnés de manière groupée.</span>
            ) : (
              <span>Vous vous apprêtez à suspendre l'accès utilisateur de : <strong className="text-slate-900 font-extrabold uppercase">{user?.name}</strong>.</span>
            )}
          </p>

          <div className="space-y-1.5">
            <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Justification de Révocation / Motif</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-11 border rounded-xl px-3 text-xs font-bold text-slate-800 bg-white"
            >
              <option value="Départ de l'entreprise">Départ définitif de l'établissement client</option>
              <option value="Suspicion de piratage / Secops Alert">Suspicion d'intrusion et usurpation d'identité</option>
              <option value="Défaut de paiement de la souscription">SaaS SaaS Impayé de facturation à J+15</option>
              <option value="Maintenance d'infrastructure de données">Maintenance programmée de sécurité</option>
            </select>
          </div>

          <div className="bg-rose-50 border border-rose-150 p-4 rounded-2xl text-[10.5px] text-rose-700 leading-relaxed font-semibold">
            Cette action coupe immédiatement les flux d'accès, déconnectant toute session active courante sur les terminaux de l'usager.
          </div>
        </div>

        <div className="flex gap-2 border-t pt-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase rounded-xl cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-lg shadow-rose-600/10"
          >
            Confirmer la suspension
          </button>
        </div>
      </div>
    </div>
  );
};
