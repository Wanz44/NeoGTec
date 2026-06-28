/**
 * 🛰️ Fichier : /apps/web/app/(saas)/tenants/SuspendButton.tsx
 * 🎯 Objectif : Bloquer ou Suspendre un Tenant (Multi-locataires) en cas de défaut de paiement
 * RBAC : Sécurité 'SaaS.tenants.suspend' via hook usePermission()
 */

import React, { useState } from "react";
import { AlertTriangle, Lock, ShieldAlert, Loader2, Play } from "lucide-react";
import { usePermission, PERMISSIONS } from "../../../lib/permissions";

interface SuspendButtonProps {
  tenantId: string;
  tenantName: string;
  currentStatus: "active" | "suspended";
  onStatusChanged: (newStatus: "active" | "suspended") => void;
}

export const SuspendButton: React.FC<SuspendButtonProps> = ({
  tenantId,
  tenantName,
  currentStatus,
  onStatusChanged,
}) => {
  const [loading, setLoading] = useState(false);
  const hasSuspendPerm = usePermission(PERMISSIONS.SAAS_TENANTS_SUSPEND);

  const handleToggleSuspension = async () => {
    if (!hasSuspendPerm) return;

    const actionText = currentStatus === "active" ? "suspendre" : "réactiver";
    const confirmChoice = window.confirm(
      `Conformité ARCA RDC : Êtes-vous sûr de vouloir ${actionText} le locataire ${tenantName} ?`
    );
    if (!confirmChoice) return;

    setLoading(true);
    // Simuler le blocage des containers de virtualisation Kubernetes / Supabase tenant
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setLoading(false);

    const nextStatus = currentStatus === "active" ? "suspended" : "active";
    onStatusChanged(nextStatus);
  };

  if (!hasSuspendPerm) {
    return (
      <button
        disabled
        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-400 border border-slate-200 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-not-allowed opacity-75"
        title="Niveau Administrateur Global de Plateforme Requis"
        id="suspend-tenant-locked"
      >
        <Lock className="w-3 h-3" />
        SaaS Verrouillé
      </button>
    );
  }

  if (currentStatus === "suspended") {
    return (
      <button
        onClick={handleToggleSuspension}
        disabled={loading}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-650 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
        id={`reactivate-tenant-${tenantId}-btn`}
      >
        {loading ? (
          <Loader2 className="w-3 h-3 animate-spin" />
        ) : (
          <Play className="w-3 h-3" />
        )}
        Réactiver le Tenant
      </button>
    );
  }

  return (
    <button
      onClick={handleToggleSuspension}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-600 hover:text-white rounded-lg text-[10px] font-black uppercase tracking-wider transition-all disabled:opacity-50"
      id={`suspend-tenant-${tenantId}-btn`}
    >
      {loading ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <AlertTriangle className="w-3 h-3" />
      )}
      Suspendre le Tenant
    </button>
  );
};
export default SuspendButton;
