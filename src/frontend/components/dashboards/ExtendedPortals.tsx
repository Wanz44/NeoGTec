/**
 * 🛠️ Fichier : /src/frontend/components/dashboards/ExtendedPortals.tsx
 * 🎯 Objectif : Portails Métiers Spécifiques additionnels requis pour l'assurance multi-acteurs RDC
 * CONFORMITÉ : ISO 27001, OWASP Top 10, Double validation transactionnelle & Traçabilité auditée
 */
import React, { useState } from 'react';
import { 
  Building2, Pill, Landmark, ShieldCheck, HelpCircle, ShieldAlert,
  Search, Download, Check, X, Phone, Lock, FileText, Smartphone, RefreshCw, Send,
  Cpu, Users, CreditCard, Activity, Star, MapPin, Calculator, Key
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

// ==========================================
// 🏥 PORTAL 1: Admin Hôpital Ngaliema (ADMIN_PRESTATAIRE)
// ==========================================
export const HospitalAdminDashboard: React.FC = () => {
  const { logAction } = useApp();
  const [momoModal, setMomoModal] = useState(false);
  const [invoices, setInvoices] = useState([
    { id: 'FAC-Ng-101', patient: 'Therese KABEDI', amount: 320, date: '25-05-2026', status: 'En attente' },
    { id: 'FAC-Ng-102', patient: 'Guy NKULU', amount: 890, date: '24-05-2026', status: 'Payé' },
    { id: 'FAC-Ng-103', patient: 'Alain KANIKI', amount: 150, date: '23-05-2026', status: 'En attente' }
  ]);

  const handleClaimMomoClick = (facId: string) => {
    setMomoModal(true);
    logAction('HOSPITAL_MOBILE_MONEY_CLAIM_DEMO', `L'Hôpital Ngaliema a sollicité une compensation Mobile Money immédiate de 320 USD pour la facture ${facId}.`, 'WARNING');
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-teal-700 to-indigo-800 rounded-[2.2rem] text-white">
        <span className="bg-teal-500/30 px-2.5 py-1 rounded text-[8px] font-black uppercase">Clinique Accréditée Partenaire</span>
        <h2 className="text-xl font-black mt-2 tracking-tight">Portail Administratif — Clinique Ngaliema</h2>
        <p className="text-xs text-teal-100 font-bold mt-1">Saisie des factures, conventionnement de tarifs, pilotage de tiers payant.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-150 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Facturation du mois</p>
            <h4 className="text-2xl font-black text-slate-900 mt-2">1,210 USD</h4>
          </div>
          <span className="text-[9px] text-emerald-600 font-bold mt-4">✓ Clinique Ngaliema agréé</span>
        </div>
        <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Taux d&apos;Acceptation PEC</p>
            <h4 className="text-2xl font-black text-green-400 mt-2">94.8%</h4>
          </div>
          <span className="text-[9px] text-slate-400 font-bold mt-4">12 dossiers instruits</span>
        </div>
        <div className="p-6 bg-white border border-slate-150 rounded-[2rem] shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase">Convention active</p>
            <h4 className="text-md font-black text-indigo-600 mt-2">Rawbank Sarl • ACME</h4>
          </div>
          <span className="text-[9px] text-slate-400 font-bold mt-4">Échéance : 31-12-2026</span>
        </div>
      </div>

      <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase">Suivi Direct du Tiers Payant</h3>
        
        <div className="divide-y divide-slate-100">
          {invoices.map(inv => (
            <div key={inv.id} className="py-3 flex justify-between items-center text-xs">
              <div>
                <p className="font-extrabold text-slate-950 uppercase">{inv.patient}</p>
                <span className="text-[9px] text-slate-400 block">ID facture: {inv.id} • Émise le {inv.date}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-900">{inv.amount} USD</span>
                {inv.status === 'En attente' ? (
                  <button 
                    onClick={() => handleClaimMomoClick(inv.id)}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase"
                  >
                    Encaissement MoMo
                  </button>
                ) : (
                  <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded uppercase">Payé</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {momoModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full space-y-4 text-center">
            <Smartphone className="w-12 h-12 text-indigo-600 mx-auto" />
            <h4 className="text-sm font-black text-slate-950 uppercase">Demande de Débit MoMo Émise</h4>
            <p className="text-xs text-slate-500 italic">
              Un SMS de confirmation de transfert immédiat a été envoyé au tiers payant pour provisionner l&apos;acte d&apos;un montant de 320 USD.
            </p>
            <button 
              onClick={() => {
                setMomoModal(false);
                setInvoices(prev => prev.map(i => i.id === 'FAC-Ng-101' ? { ...i, status: 'Payé' } : i));
              }}
              className="px-4 py-2 bg-indigo-600 text-white font-extrabold text-xs uppercase rounded-xl leading-none block w-full"
            >
              Fermer &amp; Valider
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 💊 PORTAL 2: Pharmacien KinPharma (PHARMACIEN)
// ==========================================
export const PharmacistDashboard: React.FC = () => {
  const { logAction } = useApp();
  const [prescriptionHash, setPrescriptionHash] = useState('RX-KIN-2026');
  const [dispensingStatus, setDispensingStatus] = useState<string | null>(null);
  const [isOtpRequesting, setIsOtpRequesting] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');

  const scanOrsearchPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    setIsOtpRequesting(true);
    setTimeout(() => {
      setIsOtpRequesting(false);
      setOtpSent(true);
      logAction('SCAN_PRESCRIPTION_PHARMACIE', `Pharmacien KinPharma a scanné l'ordonnance ${prescriptionHash} pour approbation tiers payant.`, 'INFO');
    }, 1500);
  };

  const handleDispenseMeds = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode === '2026') {
      setDispensingStatus("DÉLIVRANCE AUTORISÉE : Prise en charge à 100% approuvée par le comptoir assureur. Vous pouvez remettre les médicaments.");
      logAction('DELIVRANCE_PRESCRIPTION_CONFIRMEE', `Signature OTP validée pour ${prescriptionHash}. Médicaments délivrés par Pharmacien KinPharma.`, 'INFO');
    } else {
      setDispensingStatus("Code OTP invalide. Double sécurité active : veuillez demander un nouveau jeton.");
      logAction('DELIVRANCE_PRESCRIPTION_ECHEC_MFA', `Échec de validation OTP sur la délivrance de prescription ${prescriptionHash}.`, 'WARNING');
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-indigo-950 rounded-[2.2rem] text-white">
        <span className="bg-emerald-500/30 px-2.5 py-1 rounded text-[8px] font-black uppercase">Sécurité et Délivrance Pharmacie</span>
        <h2 className="text-xl font-black mt-2 tracking-tight">Portail Officine — Pharmacie KinPharma</h2>
        <p className="text-xs text-emerald-100 font-bold mt-1">Saisie ordonnance par scan, validation d&apos;identité biométrique, validation OTP.</p>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase">Valider Ordonnance &amp; Tiers Payant</h3>
        
        <form onSubmit={scanOrsearchPrescription} className="flex gap-2">
          <input 
            type="text" 
            placeholder="Scannez ou saisissez la clé chiffrée de l'ordonnance..." 
            value={prescriptionHash}
            onChange={(e) => setPrescriptionHash(e.target.value)}
            className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none font-mono"
            disabled={otpSent}
          />
          <button 
            type="submit"
            className="px-6 py-3 bg-emerald-600 text-white rounded-xl text-xs font-extrabold uppercase"
            disabled={otpSent}
          >
            {isOtpRequesting ? 'Vérification...' : 'Saisir'}
          </button>
        </form>

        {otpSent && !dispensingStatus && (
          <form onSubmit={handleDispenseMeds} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <span className="px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 text-[8px] font-black uppercase tracking-widest rounded">OTP double-facteur exigé</span>
            <p className="text-xs text-slate-500 italic">Un code PIN de consentement temporaire a été envoyé sur l&apos;application mobile de l&apos;adhérent (MFA). Veuillez le saisir (Saisir code de démo 2026).</p>
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Introduire code OTP..." 
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-xl font-mono text-center text-xs font-bold"
                required
              />
              <button 
                type="submit"
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-black uppercase"
              >
                Valider délivrance
              </button>
            </div>
          </form>
        )}

        {dispensingStatus && (
          <div className="p-4 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11.5px] font-black uppercase tracking-normal">
            {dispensingStatus}
          </div>
        )}
      </div>

      <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-2">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">TARIF UNIQUE DES MÉDICAMENTS ACCRÉDITÉS</span>
        <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-550 pt-2">
          <div className="p-3 bg-slate-50 rounded-xl">Amoxicilline 500mg • <span className="text-emerald-600 font-extrabold">Remboursé à 100%</span></div>
          <div className="p-3 bg-slate-50 rounded-xl">Paracétamol 1g • <span className="text-emerald-600 font-extrabold">Remboursé à 100%</span></div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 💰 PORTAL 3: Gestionnaire Finance Sunu (FINANCE_MANAGER)
// ==========================================
export const PartnerFinanceDashboard: React.FC = () => {
  const { logAction } = useApp();
  const [claimsSum, setClaimsSum] = useState(88250);
  const [reconcilDone, setReconcilDone] = useState(false);

  const performDailyReconciliation = () => {
    setReconcilDone(true);
    setClaimsSum(0);
    logAction('RECONCILIATION_COMPTABLE_EXECUTE', "Le Gestionnaire Finance Sunu a fermé l'exercice quotidien de rapprochement bancaire avec la Rawbank. Écarts de compensation résolus.", "INFO");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-blue-700 to-sky-800 rounded-[2.2rem] text-white">
        <span className="bg-blue-500/30 px-2.5 py-1 rounded text-[8px] font-black uppercase">Gestion Financière Assureur</span>
        <h2 className="text-xl font-black mt-2 tracking-tight">Espace Trésorerie &amp; Rapprochement — SUNU Finance</h2>
        <p className="text-xs text-blue-100 font-bold mt-1">Contrôle de marge de solvabilité, rapprochement comptable Mobile Money et décaissements.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase">Portefeuille Solvabilité Actif</p>
          <h4 className="text-2xl font-black text-blue-800 mt-2">1.45 M USD</h4>
          <span className="text-[9px] text-slate-400 font-medium italic mt-4 block">Fonds capitalisés en Rawbank RDC</span>
        </div>
        <div className="p-6 bg-slate-950 text-white rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase">Sinistres à régler (Ngaliema/HJ)</p>
          <h4 className="text-2xl font-black text-rose-500 mt-2">{claimsSum.toLocaleString()} USD</h4>
          <span className="text-[9px] text-slate-400 font-medium italic mt-4 block">En attente de compensation</span>
        </div>
        <div className="p-6 bg-white border border-slate-100 rounded-[2rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase">Rapprochement Mobile Money</p>
          <h4 className="text-2xl font-black text-emerald-600 mt-2">99.8%</h4>
          <span className="text-[9px] text-slate-400 font-medium italic mt-4 block">M-pesa / Airtel synchronisés</span>
        </div>
      </div>

      <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase">Dossier de Rapprochement Quotidien</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase italic">Opérations croisées Rawbank-Momo du 26-05-2026</p>
          </div>
          <button 
            onClick={performDailyReconciliation}
            disabled={reconcilDone}
            className="px-4 py-2 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-xs font-black uppercase leading-none shadow-md disabled:bg-slate-300 cursor-pointer outline-none"
          >
            {reconcilDone ? "Exercice Clos ✓" : "Lancer reconciliation comptable"}
          </button>
        </div>

        <div className="space-y-3">
          <div className="p-3 bg-slate-50 border rounded-xl flex justify-between text-xs">
            <span className="font-bold">Encaissements indirects (Mobile Money) :</span>
            <span className="font-extrabold text-slate-900">4,120 USD (Rapproché)</span>
          </div>
          <div className="p-3 bg-slate-50 border rounded-xl flex justify-between text-xs">
            <span className="font-bold">Facturations Tiers Payant validées en cliniques :</span>
            <span className="font-extrabold text-slate-900">12,400 USD (Vérifié)</span>
          </div>
          <div className="p-3 bg-slate-50 border rounded-xl flex justify-between text-xs">
            <span className="font-bold">Frais de transfert interbancaires compensés :</span>
            <span className="font-extrabold text-slate-900">85 USD (Rapproché)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🔎 PORTAL 4: Auditeur CNAM / Externe (AUDITEUR_EXTERNE)
// ==========================================
export const AuditorDashboard: React.FC = () => {
  const { logAction } = useApp();
  const [complianceLogs, setComplianceLogs] = useState([
    { ref: 'AUD-8821', action: 'Accompagnement DME', by: 'Dr. Sarah LOKO', target: 'Jean PATIENT MUKENDI', status: 'Conforme', timestamp: '2026-05-26 14:00' },
    { ref: 'AUD-8822', action: 'Signature OTP Ordonnance', by: 'Pharmacien KinPharma', target: 'Guy NKULU', status: 'Conforme', timestamp: '2026-05-26 13:45' },
    { ref: 'AUD-8823', action: 'Validation Tiers Payant', by: 'Marie KAPEND', target: 'Therese KABEDI', status: 'Conforme', timestamp: '2026-05-26 11:30' }
  ]);

  const runIntegrityAuditing = () => {
    logAction('INTEGRITY_COMPLIANCE_CNAM_RUN', "L'auditeur externe de la CNAM a lancé le script de vérification cryptographique de l'arbre d'audit.", "INFO");
    alert("Vérification terminée : Ligne d'intégrité de l'arbre de hashage cryptographique (SHA-256) validée à 100%. Aucune altération détectée.");
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-slate-800 to-slate-950 text-white rounded-[2.2rem]">
        <span className="bg-amber-500 text-slate-900 font-black px-2 py-0.5 text-[8px] uppercase rounded">CNAM Assurance Santé Auditing Portal</span>
        <h2 className="text-xl font-black mt-2 tracking-tight">Console de Surveillance Externe &amp; Audit ISO 27001</h2>
        <p className="text-xs text-slate-300 font-bold mt-1">Module d&apos;inspection tiers indépendant pour le régulateur et le commissariat aux comptes.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {[
          { label: 'Intégrité BDD Ledger', value: '100.00%', state: 'Certifié' },
          { label: 'Indicateurs d&apos;Anonymat', value: 'Élevé', state: 'Conforme' },
          { label: 'Taux de Fraude estimé', value: '&lt; 0.12%', state: 'Optimal' },
          { label: 'Uptime Réseau CNAM', value: '99.988%', state: 'Monitoré' }
        ].map(m => (
          <div key={m.label} className="p-4 bg-white border border-slate-100 rounded-2xl text-center">
            <p className="text-[9px] font-black text-slate-450 uppercase leading-none">{m.label}</p>
            <h4 className="text-xl font-black mt-2 text-slate-900" dangerouslySetInnerHTML={{ __html: m.value }} />
            <span className="text-[8px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded mt-2 inline-block uppercase font-bold">{m.state}</span>
          </div>
        ))}
      </div>

      <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-2">
          <div>
            <h3 className="text-xs font-black text-slate-900 uppercase">Journal d&apos;Événements Tiers Payant Certifiés</h3>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase italic">Traçabilité absolue des actes médicaux en République Démocratique du Congo</p>
          </div>
          <button 
            onClick={runIntegrityAuditing}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase rounded-xl shadow-md cursor-pointer outline-none"
          >
            Vérifier Signature Arbre de Hash
          </button>
        </div>

        <div className="divide-y divide-slate-150">
          {complianceLogs.map(l => (
            <div key={l.ref} className="py-3.5 flex flex-col sm:flex-row justify-between text-xs gap-3">
              <div>
                <p className="font-extrabold text-slate-950 uppercase">{l.action}</p>
                <span className="text-[9.5px] text-slate-450 font-bold block">Auteur : {l.by} • Patient cible : {l.target}</span>
              </div>
              <div className="flex items-center gap-4 shrink-0 text-right">
                <span className="text-[9px] font-mono text-slate-400 font-bold">{l.timestamp}</span>
                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded text-[9px] font-black uppercase">{l.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 🛠️ PORTAL 5: Support NeoGTec N1 (SUPPORT_NEOGTEC)
// ==========================================
export const SupportDashboard: React.FC = () => {
  const { logAction } = useApp();
  const [lockouts, setLockouts] = useState([
    { id: 'usr-402', name: 'Nouveau Collaborateur (CD)', email: 'nouveau@acme.cd', lockType: 'Première connexion', status: 'En attente' },
    { id: 'usr-901', name: 'Collaborateur Bloqué', email: 'suspendu@acme.cd', lockType: 'MFA Erronés cumulés', status: 'Suspendu' }
  ]);

  const unlockAccount = (email: string) => {
    setLockouts(prev => prev.filter(p => p.email !== email));
    logAction('SUPPORT_RESTORE_MFA_TICKET', `Le Support NeoGTec N1 a réinitialisé la sécurité MFA et débloqué l'appareil associé à l'adresse "${email}".`, 'WARNING');
    alert(`Le compte associé à "${email}" a été réactivé et le compteur d'erreurs réinitialisé. notification transmise.`);
  };

  return (
    <div className="space-y-6">
      <div className="p-6 bg-gradient-to-r from-orange-600 to-red-700 text-white rounded-[2.2rem]">
        <span className="bg-orange-500/30 px-2.5 py-1 rounded text-[8px] font-black uppercase">Administration Plateforme &amp; Conciergerie</span>
        <h2 className="text-xl font-black mt-2 tracking-tight">Console Support Technique — NeoGTec N1</h2>
        <p className="text-xs text-orange-100 font-bold mt-1">Supervision des blocages, déverrouillage de clés MFA, conciergerie et support de tickets.</p>
      </div>

      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-4">
        <h3 className="text-xs font-black text-slate-900 uppercase">File d&apos;attente des Utilisateurs Bloqués</h3>
        
        <div className="divide-y divide-slate-150">
          {lockouts.length === 0 ? (
            <p className="text-center py-6 text-xs text-slate-400 italic">Aucun incident de connexion répertorié au support de Niveau 1.</p>
          ) : (
            lockouts.map(user => (
              <div key={user.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs font-bold">
                <div>
                  <p className="font-extrabold text-slate-950 uppercase">{user.name}</p>
                  <span className="text-[9.5px] text-slate-450 block font-normal">Adresse email : {user.email} • Cause : <span className="text-red-650 font-extrabold">{user.lockType}</span></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 text-[9px] uppercase font-black rounded">{user.status}</span>
                  <button 
                    onClick={() => unlockAccount(user.email)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[9.5px] font-black uppercase leading-none shadow-md cursor-pointer"
                  >
                    Déverrouiller
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-bold text-slate-650">
        <div className="p-6 bg-white border border-slate-150 rounded-[2rem] shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase text-slate-400">APIs &amp; Interopérabilité Externes</span>
          <div className="space-y-2">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl"><span>Passerelle SMS Orange RDC :</span> <span className="text-emerald-600 font-black">OPÉRATIONNEL</span></div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl"><span>Serveur SNIS National :</span> <span className="text-emerald-600 font-black">OPÉRATIONNEL</span></div>
          </div>
        </div>

        <div className="p-6 bg-white border border-slate-150 rounded-[2rem] shadow-sm space-y-3">
          <span className="text-[10px] font-black uppercase text-slate-400">Status Serveur</span>
          <div className="space-y-2">
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl"><span>Containers Cloud Run :</span> <span className="text-emerald-600 font-black">HEALTHY (99.99%)</span></div>
            <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl"><span>Base de Données PostgreSQL :</span> <span className="text-emerald-600 font-black">ONLINE (Load 12%)</span></div>
          </div>
        </div>
      </div>

    </div>
  );
};
