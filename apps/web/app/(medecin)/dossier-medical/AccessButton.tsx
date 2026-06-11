/**
 * 🛰️ Fichier : /apps/web/app/(medecin)/dossier-medical/AccessButton.tsx
 * 🎯 Objectif : Sécuriser l'accès aux dossiers médicaux individuels (Confidentialité d'Assurance)
 * Enforce : Bloque l'accès DME si pas de consentement actif (Norme ARCA-RDC / RGPD)
 * RBAC : Sécurité 'dossier_medical.access' via usePermission()
 */

import React, { useState, useEffect } from "react";
import { Eye, Lock, EyeOff, Loader2, ShieldCheck, Siren, FileCheck, Check } from "lucide-react";
import { usePermission, PERMISSIONS } from "../../../../lib/permissions";

interface AccessButtonProps {
  patientId: string;
  patientName: string;
  onAccessGranted?: () => void;
}

interface ConsentLogEntry {
  id: string;
  assure_id: string;
  medecin_id: string;
  type_consent: string;
  granted_at: string;
  ip: string;
}

export const AccessButton: React.FC<AccessButtonProps> = ({
  patientId,
  patientName,
  onAccessGranted,
}) => {
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const canAccessMedicalRecord = usePermission(PERMISSIONS.MEDECIN_RECORD_ACCESS);

  // Charger les consentements stockés localement
  const [consentList, setConsentList] = useState<ConsentLogEntry[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("assur_consent_logs");
    if (saved) {
      try {
        setConsentList(JSON.parse(saved));
      } catch (e) {
        console.error("Erreur de parsing des consentements", e);
      }
    }
  }, []);

  const hasActiveConsent = consentList.some(
    (c) => c.assure_id === patientId && c.type_consent === "DME_ACCESS"
  );

  const requestAccess = async () => {
    if (!canAccessMedicalRecord) return;
    if (!hasActiveConsent) return; // Bloquer l'accès DME si aucun consentement n'est actif

    setLoading(true);
    // Simuler l'échange de clés de déchiffrement pour lever l'anonymat de santé
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setHasAccess(true);
    if (onAccessGranted) onAccessGranted();
  };

  const grantConsentDirectly = () => {
    const newConsent: ConsentLogEntry = {
      id: `CONSENT-${Math.floor(1000 + Math.random() * 9000)}`,
      assure_id: patientId,
      medecin_id: "medecin-sarah",
      type_consent: "DME_ACCESS",
      granted_at: new Date().toISOString(),
      ip: "192.168.15.22" // Simulation d'une IP d'un terminal d'accès de clinique rattachée
    };

    const updated = [...consentList, newConsent];
    setConsentList(updated);
    localStorage.setItem("assur_consent_logs", JSON.stringify(updated));

    // Consigner l'action dans les journaux d'audit locaux
    const currentLogs = localStorage.getItem("assur_audit_logs");
    const logs = currentLogs ? JSON.parse(currentLogs) : [];
    logs.unshift({
      id: `SBOX-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      userId: "medecin-sarah",
      userName: "Dr. Sarah LOKO",
      userRole: "MEDECIN",
      action: "GRANT_PATIENT_CONSENT_DME",
      details: `Consentement d'accès DME accordé et signé numériquement par l'assuré ID "${patientId}". IP d'enregistrement: 192.168.15.22.`,
      ipAddress: "192.168.15.22",
      status: "INFO"
    });
    localStorage.setItem("assur_audit_logs", JSON.stringify(logs));
  };

  if (!canAccessMedicalRecord) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 text-left">
        <div className="p-2 bg-rose-100 rounded-lg text-rose-700 shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-black text-rose-950 uppercase">Accès Refusé</h4>
          <p className="text-[10px] text-rose-700 font-bold mt-1 leading-relaxed">
            Seuls les médecins agréés ou les conseils-santé possèdent la clé de déchiffrement 'dossier_medical.access'.
          </p>
        </div>
      </div>
    );
  }

  // Si pas de consentement actif : Bloquer l'accès et proposer l'interrupteur à l'écran
  if (!hasActiveConsent) {
    return (
      <div className="p-4 bg-amber-50 border border-amber-200/60 rounded-2xl flex flex-col gap-3 text-left">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-100 rounded-lg text-amber-700 shrink-0">
            <Lock className="w-4 h-4 text-amber-800" />
          </div>
          <div>
            <h4 className="text-xs font-black text-amber-950 uppercase">Accès DME Bloqué - Consentement Requis</h4>
            <p className="text-[10px] text-amber-800 font-bold mt-1 leading-relaxed">
              La réglementation ARCA-RDC impose un consentement numérique actif pour l&apos;accès au DME du patient. Aucun accord enregistré pour l&apos;affilié {patientName}.
            </p>
          </div>
        </div>
        <button
          onClick={grantConsentDirectly}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all shadow cursor-pointer self-start"
          id={`grant-consent-to-${patientId}-btn`}
        >
          <Check className="w-3.5 h-3.5 text-white" />
          Signer le Consentement DME en direct
        </button>
      </div>
    );
  }

  if (hasAccess) {
    return (
      <div 
        className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-3 text-left"
        id={`medical-record-access-${patientId}-active`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700 shrink-0">
            <ShieldCheck className="w-4 h-4 animate-bounce text-emerald-700" />
          </div>
          <div>
            <h4 className="text-xs font-black text-emerald-950 uppercase">Session Sécurisée Active</h4>
            <p className="text-[10px] text-emerald-700 font-bold mt-1 leading-relaxed">
              Vous consultez l&apos;historique clinique de {patientName}. Accès tracé dans la table d&apos;audit.
            </p>
          </div>
        </div>
        {/* Affichage des détails médicaux déverrouillés si l'autorisation est levée */}
        <div className="bg-white border border-slate-100 p-3.5 rounded-xl space-y-2 mt-1">
          <span className="text-[9px] font-extrabold text-indigo-600 uppercase tracking-widest block">📋 ANTÉCÉDENTS ET DIAGNOSTICS :</span>
          <p className="text-xs text-slate-800 font-black">● Diabète de type II insulinodépendant | Hypertension artérielle modérée</p>
          <span className="text-[9px] font-extrabold text-rose-600 uppercase tracking-widest block pt-2">💊 ALLERGIES ET CONTRE-INDICATIONS :</span>
          <p className="text-xs text-rose-700 font-black">● Pénicilline G (Choc anaphylactique relevé en milieu clinique)</p>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={requestAccess}
      className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 border border-white/10 text-white hover:bg-slate-800 rounded-xl text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all cursor-pointer"
      id={`request-medical-record-${patientId}-btn`}
    >
      {loading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
          Déchiffrement cryptographique...
        </>
      ) : (
        <>
          <Eye className="w-3.5 h-3.5" />
          Ouvrir le Dossier Patient (Consentement OK)
        </>
      )}
    </button>
  );
};
export default AccessButton;
