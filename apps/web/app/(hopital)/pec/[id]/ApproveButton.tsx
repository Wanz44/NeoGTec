/**
 * 🛰️ Fichier : /apps/web/app/(hopital)/pec/[id]/ApproveButton.tsx
 * 🎯 Objectif : Bouton sécurisé de validation de Prise En Charge (PEC) - Marie / Médecin / Admin Hôpital
 * RBAC : Sécurité 'pec.approve' via hacheur usePermission()
 */

import React, { useState } from "react";
import { Check, ShieldCheck, Lock, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { usePermission, PERMISSIONS } from "../../../../lib/permissions";

interface ApproveButtonProps {
  pecId: string;
  onSuccess?: () => void;
}

export const ApproveButton: React.FC<ApproveButtonProps> = ({ pecId, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const hasApprovePerm = usePermission(PERMISSIONS.PEC_APPROVE);

  const handleApprove = async () => {
    if (!hasApprovePerm) {
      return; 
    }
    
    setLoading(true);
    // Simuler le traitement cryptographique et l'enregistrement de l'approbation PEC
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setCompleted(true);
    if (onSuccess) onSuccess();
  };

  if (!hasApprovePerm) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed cursor-pointer opacity-70"
        title="Droits d'approbation d'urgence requis (Régulation ARCA)"
        id="approve-pec-locked"
      >
        <Lock className="w-3.5 h-3.5" />
        Approbation Verrouillée
      </button>
    );
  }

  if (completed) {
    return (
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md"
        id="approve-pec-success"
      >
        <ShieldCheck className="w-4 h-4 text-white" />
        Approuvé avec succès
      </motion.div>
    );
  }

  return (
    <button
      onClick={handleApprove}
      disabled={loading}
      className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
      id="approve-pec-btn"
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Validation ARCA v2...
        </>
      ) : (
        <>
          <Check className="w-3.5 h-3.5" />
          Approuver Prise en Charge
        </>
      )}
    </button>
  );
};
export default ApproveButton;
