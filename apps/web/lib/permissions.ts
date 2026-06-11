/**
 * 🛰️ Fichier : /apps/web/lib/permissions.ts
 * 🎯 Objectif : Sécurité RBAC & Liste des 50 permissions fondamentales de NeoGTec
 * CONFORMITÉ : ARCA-RDC Regulation, usePermission() client-side hook & useRole() hook
 */

import { useState, useEffect } from "react";

// 1. Liste stricte de 50 codes de permissions de l'architecture NeoGTec
export const PERMISSIONS = {
  // Prises En Charge (PEC)
  PEC_CREATE: "pec.create",
  PEC_APPROVE: "pec.approve",
  PEC_REJECT: "pec.reject",
  PEC_VIEW: "pec.view",
  PEC_UPDATE: "pec.update",
  PEC_DELETE: "pec.delete",

  // Services Financiers & Cotisations
  FINANCE_PAY: "finance.pay",
  FINANCE_RECONCILE: "finance.reconcile",
  FINANCE_AUDIT: "finance.audit",
  FINANCE_EXPORT: "finance.export",
  FINANCE_VALIDATE: "finance.validate",

  // SaaS Administration & Multi-Tenancy (NeoGTec)
  SAAS_TENANTS_SUSPEND: "SaaS.tenants.suspend",
  SAAS_CONTRACTS_MANAGE: "SaaS.contracts.manage",
  SAAS_TENANTS_VIEW: "SaaS.tenants.view",
  SAAS_TENANTS_CREATE: "SaaS.tenants.create",
  SAAS_TENANTS_EDIT: "SaaS.tenants.edit",
  SAAS_ADDONS_TOGGLE: "SaaS.addons.toggle",
  SAAS_BILLING_INSPECT: "SaaS.billing.inspect",

  // Gestion des Utilisateurs & Profils
  USER_CREATE: "user.create",
  USER_DELETE: "user.delete",
  USER_EDIT: "user.edit",
  USER_VIEW_LOGS: "user.view_logs",
  USER_MFA_MANAGE: "user.mfa.manage",

  // Dossier Médical & Praticiens
  MEDECIN_DIAGNOSE: "medecin.diagnose",
  MEDECIN_PRESCRIBE: "medecin.prescribe",
  MEDECIN_VIEW_PATIENT: "medecin.view_patient",
  MEDECIN_RECORD_ACCESS: "dossier_medical.access",

  // Actions Assurés
  ASSURE_VIEW_CARD: "assure.view_card",
  ASSURE_ADD_BENEFICIARY: "assure.add_beneficiary",
  ASSURE_DELETE_BENEFICIARY: "assure.delete_beneficiary",
  ASSURE_UPDATE_PROFILE: "assure.update_profile",

  // Comptabilité Pharmacie
  PHARMACIE_DISPENSE: "pharmacie.dispense",
  PHARMACIE_VIEW_STOCK: "pharmacie.view_stock",
  PHARMACIE_INVENTORY_UPDATE: "pharmacie.inventory_update",

  // Audits & Régulation nationale ARCA
  AUDITEUR_READ_ALL: "auditeur.read_all",
  AUDITEUR_EXPORT_PDF: "auditeur.export_pdf",
  AUDITEUR_AUDIT_EXECUTE: "auditeur.audit",
  ARCA_SIGNATURE_VALIDATE: "arca.signature.validate",

  // Gouvernance du Système
  GOVERNANCE_VIEW: "governance.view",
  GOVERNANCE_EDIT: "governance.edit",
  SYSTEM_CONFIG_VIEW: "system_config.view",
  SYSTEM_CONFIG_EDIT: "system_config.edit",
  INTEGRATIONS_MANAGE: "integrations.manage",

  // Business Intelligence & Décisionnel
  BI_VIEW: "bi.view",
  BI_ANONYMIZE_TOGGLE: "bi.anonymize_toggle",

  // Support Client & Tickets Réclamations
  SUPPORT_VIEW_TICKETS: "support.view_tickets",
  SUPPORT_REPLY: "support.reply",
  RECLAMATION_FILE: "reclamation.file",
  RECLAMATION_RESOLVE: "reclamation.resolve",

  // Télémédecine & Addons
  TELECONSULTATION_START: "teleconsultation.start",
  TELECONSULTATION_JOIN: "teleconsultation.join",
  SNIS_INTEROPERABILITY_SYNC: "snis.interoperability.sync",

  // Onboarding
  ONBOARDING_SUBMIT: "onboarding.submit",
  SECURITY_POLICY_UPDATE: "security.policy.update",
  AUDIT_LOGS_EXPORT: "audit_logs.export",
} as const;

export type PermissionCode = typeof PERMISSIONS[keyof typeof PERMISSIONS];

/**
 * Hook usePermission :
 * Query alternative réactive appelant l'Edge Function de permissions
 * et gérant le cache interne ou les variables d'environnement de session locale.
 */
export function usePermission(code: PermissionCode): boolean {
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  useEffect(() => {
    let active = true;

    async function fetchPermissions() {
      try {
        // En Next.js réel, on charge depuis le cache de l'user ou l'endpoint RPC sécurisé
        const response = await fetch("/api/rpc/get_user_permissions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ code })
        });

        if (!response.ok) {
          // Si hors-ligne ou fallback démo, on utilise le rôle détecté via cookie/localStorage
          fallbackOfflinePermissions();
          return;
        }

        const data = await response.json();
        if (active) {
          setHasPermission(data.permissions?.includes(code) || false);
        }
      } catch {
        fallbackOfflinePermissions();
      }
    }

    function fallbackOfflinePermissions() {
      // Robust client fallback pour la démo interactive ou les environnements de test :
      const savedUserStr = localStorage.getItem("assur_current_user");
      if (savedUserStr) {
        try {
          const user = JSON.parse(savedUserStr);
          const role = user.role;
          
          // Vérification simple basée sur le profil du rôle
          if (role === "SUPER_ADMIN") {
            setHasPermission(true); // Super Admin a tous les droits
            return;
          }

          // Cartographie simplifiée pour le offline-first
          const rules: Record<string, string[]> = {
            SUPER_ADMIN: [PERMISSIONS.SAAS_TENANTS_SUSPEND, PERMISSIONS.SAAS_CONTRACTS_MANAGE, PERMISSIONS.ARCA_SIGNATURE_VALIDATE],
            MEDECIN: [PERMISSIONS.PEC_APPROVE, PERMISSIONS.PEC_VIEW, PERMISSIONS.MEDECIN_RECORD_ACCESS, PERMISSIONS.MEDECIN_PRESCRIBE, PERMISSIONS.MEDECIN_DIAGNOSE],
            ADMIN_PRESTATAIRE: [PERMISSIONS.PEC_APPROVE, PERMISSIONS.PEC_VIEW],
            RH_ENTREPRISE: [PERMISSIONS.FINANCE_PAY],
            FINANCE_MANAGER: [PERMISSIONS.FINANCE_PAY, PERMISSIONS.FINANCE_AUDIT, PERMISSIONS.FINANCE_RECONCILE],
            AUDITEUR_EXTERNE: [PERMISSIONS.AUDITEUR_READ_ALL, PERMISSIONS.AUDITEUR_AUDIT_EXECUTE],
            ASSURE: [PERMISSIONS.ASSURE_VIEW_CARD, PERMISSIONS.ASSURE_ADD_BENEFICIARY],
            PHARMACIEN: [PERMISSIONS.PHARMACIE_DISPENSE, PERMISSIONS.PHARMACIE_VIEW_STOCK],
            SUPPORT_NEOGTEC: [PERMISSIONS.SAAS_TENANTS_VIEW, PERMISSIONS.SUPPORT_VIEW_TICKETS, PERMISSIONS.SUPPORT_REPLY]
          };

          const userPerms = rules[role] || [];
          setHasPermission(userPerms.includes(code));
        } catch {
          setHasPermission(false);
        }
      } else {
        setHasPermission(false);
      }
    }

    fetchPermissions();

    return () => {
      active = false;
    };
  }, [code]);

  return hasPermission;
}

/**
 * Hook useRole :
 * Retourne la liste des rôles de l'utilisateur ou le rôle courant
 * pour gérer les perspectives du Selecteur de Démo ou d'affichage.
 */
export function useRole(): string[] {
  const [roles, setRoles] = useState<string[]>(["assure"]);

  useEffect(() => {
    const savedUserStr = localStorage.getItem("assur_current_user");
    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        // Le rôle de l'utilisateur NeoGTec et rôles supplémentaires d'interopérabilité hôpitaux
        const mainRole = user.role?.toLowerCase() || "assure";
        
        if (mainRole === "medecin") {
          setRoles(["medecin", "partner_hopital"]);
        } else if (mainRole === "admin_prestataire") {
          setRoles(["admin_prestataire", "partner_hopital"]);
        } else {
          setRoles([mainRole]);
        }
      } catch {
        setRoles(["assure"]);
      }
    }
  }, []);

  return roles;
}
