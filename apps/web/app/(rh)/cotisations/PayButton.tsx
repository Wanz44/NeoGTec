/**
 * 🛰️ Fichier : /apps/web/app/(rh)/cotisations/PayButton.tsx
 * 🎯 Objectif : Paiement sécurisé des cotisations mensuelles d'entreprise rattachées (ACME, etc.)
 * RBAC : Sécurité 'finance.pay' via hook usePermission()
 */

import React, { useState } from "react";
import { CreditCard, Lock, Loader2, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { usePermission, PERMISSIONS } from "../../../lib/permissions";

interface PayButtonProps {
  amount: number;
  enterpriseName: string;
  onPaymentSuccess?: () => void;
}

export const PayButton: React.FC<PayButtonProps> = ({ amount, enterpriseName, onPaymentSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const hasPayPermission = usePermission(PERMISSIONS.FINANCE_PAY);

  const executePayment = async () => {
    if (!hasPayPermission) return;
    
    setLoading(true);
    // Simuler le virement interbancaire sécurisé multi-tenant
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setLoading(false);
    setSuccess(true);
    if (onPaymentSuccess) onPaymentSuccess();
  };

  if (!hasPayPermission) {
    return (
      <button
        disabled
        className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-400 border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-wider cursor-not-allowed opacity-75"
        title="Droits de Trésorier ou Gestionnaire Financier requis"
        id="pay-cotisations-locked"
      >
        <Lock className="w-4 h-4" />
        Paiement Bloqué (Droit finance.pay absent)
      </button>
    );
  }

  if (success) {
    return (
      <motion.div
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-md border border-emerald-400"
        id="pay-cotisations-success"
      >
        <CheckCircle className="w-4 h-4 text-white" />
        Virement Executé ({amount.toLocaleString()} USD)
      </motion.div>
    );
  }

  return (
    <button
      onClick={executePayment}
      disabled={loading}
      className="flex items-center gap-2 px-6 py-3 bg-indigo-650 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl hover:translate-y-[-1px] active:translate-y-0 transition-all disabled:opacity-50"
      id="pay-cotisations-btn"
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Pre-transfert sécurisé...
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          Régler {amount.toLocaleString()} USD
        </>
      )}
    </button>
  );
};
export default PayButton;
