/**
 * 🛰️ Fichier : /apps/web/components/Guard.tsx
 * 🎯 Objectif : Guardrail de sécurité RBAC côté client
 * Rôle : Masquer ou désactiver les éléments d'interface utilisateur (comme le bouton d'approbation)
 *        si l'utilisateur ne possède pas la permission nécessaire.
 */

import React from "react";
import { usePermission, PermissionCode } from "../lib/permissions";
import { Lock } from "lucide-react";

interface GuardProps {
  permission: PermissionCode;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLockedState?: boolean;
}

export const Guard: React.FC<GuardProps> = ({
  permission,
  children,
  fallback,
  showLockedState = false,
}) => {
  const hasPermission = usePermission(permission);

  if (hasPermission) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (showLockedState) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-400 rounded-lg text-xs font-mono select-none cursor-not-allowed">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>Verrouillé (Clé &apos;{permission}&apos; requise)</span>
      </div>
    );
  }

  return null;
};

export default Guard;
