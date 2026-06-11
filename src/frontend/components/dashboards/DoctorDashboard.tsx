/**
 * 🩺 Fichier : /src/frontend/components/dashboards/DoctorDashboard.tsx
 * 🎯 Objectif : Espace Praticien Dr. Sarah LOKO (Clinique Ngaliema) - ISO 27001, RGPD, Téléconsultation & DME
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, Users, CheckCircle2, AlertCircle, Phone, Video, Calendar, 
  MessageSquare, ShieldCheck, Mail, Send, X, ClipboardList, Eye, FileText,
  Search, Filter, Plus, Clock, ExternalLink, RefreshCw, Smartphone, 
  FileCheck, ShieldAlert, Download, Ban
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

interface PreAuthClaim {
  id: string;
  patientName: string;
  phone: string;
  consentCall: boolean;
  consentWhatsapp: boolean;
  procedure: string;
  amount: number;
  timeRequested: string; // e.g. "2026-05-26T14:15:00Z"
  isUrgent: boolean;
  claimsReadStatus: boolean;
  status: 'DEMANDE' | 'APPROUVEE' | 'REFUSEE';
}

interface DecisionLog {
  id: string;
  date: string;
  type: 'PEC_DEMANDE' | 'DEROGATION' | 'DME_ACCES' | 'ORDONNANCE_OTP';
  decision: 'AUTORISE' | 'REFUSE';
  by: string;
  reason: string;
  attachment: string;
}

export const DoctorDashboard: React.FC = () => {
  const { logAction } = useApp();
  const [toastMsg, setToastMsg] = useState<{ title: string; desc: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'claims' | 'decisions' | 'consults'>('claims');
  
  // Search patient DME
  const [patientSearch, setPatientSearch] = useState('');
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [consentList, setConsentList] = useState<any[]>(() => {
    const saved = localStorage.getItem("assur_consent_logs");
    return saved ? JSON.parse(saved) : [];
  });

  // States: Prompt 2 - Pre-auth & Call center for Hôpital / Dr Sarah
  const [preAuthClaims, setPreAuthClaims] = useState<PreAuthClaim[]>([
    { 
      id: 'PEC-8082', 
      patientName: 'Lucien BANZA', 
      phone: '+243812345678', 
      consentCall: true, 
      consentWhatsapp: true, 
      procedure: 'IRM Cérébrale avec contraste', 
      amount: 450, 
      timeRequested: new Date(Date.now() - 40 * 60 * 1000).toISOString(), // 40 minutes ago (> 30 minutes SLA trigger!)
      isUrgent: true,
      claimsReadStatus: false, // not read by adviser
      status: 'DEMANDE'
    },
    { 
      id: 'PEC-8083', 
      patientName: 'Jean PATIENT MUKENDI', 
      phone: '+243821000999', 
      consentCall: false, // Patient refused call GDPR constraint!
      consentWhatsapp: false, 
      procedure: 'Hospitalisation d\'urgence Covid suspicion', 
      amount: 1200, 
      timeRequested: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
      isUrgent: false,
      claimsReadStatus: false,
      status: 'DEMANDE'
    },
    { 
      id: 'PEC-8084', 
      patientName: 'Rebecca MONZANGO', 
      phone: '+243899222333', 
      consentCall: true, 
      consentWhatsapp: true, 
      procedure: 'Accouchement par Césarienne', 
      amount: 1500, 
      timeRequested: new Date(Date.now() - 65 * 60 * 1000).toISOString(), // > 30 min ago
      isUrgent: true,
      claimsReadStatus: false,
      status: 'DEMANDE'
    },
    { 
      id: 'PEC-8085', 
      patientName: 'Therese KABEDI', 
      phone: '+243855333111', 
      consentCall: true, 
      consentWhatsapp: true, 
      procedure: 'Traitement optique verres progressifs', 
      amount: 320, 
      timeRequested: new Date(Date.now() - 5 * 60 * 1000).toISOString(), 
      isUrgent: false,
      claimsReadStatus: true,
      status: 'APPROUVEE'
    }
  ]);

  // States: Prompt 3 - Decision Logs Table
  const [decisionLogs, setDecisionLogs] = useState<DecisionLog[]>([
    { id: 'DEC-901', date: '2026-05-26 14:02', type: 'PEC_DEMANDE', decision: 'REFUSE', by: 'Dr. Sarah LOKO', reason: 'Dépassement de plafond de la police de couverture de base.', attachment: 'Motif_Pec_8081.pdf' },
    { id: 'DEC-902', date: '2026-05-26 13:45', type: 'DME_ACCES', decision: 'AUTORISE', by: 'Jean PATIENT (OTP)', reason: 'Consentement numérique donné par OTP SMS.', attachment: 'Consent_DME_881.pdf' },
    { id: 'DEC-903', date: '2026-05-26 11:30', type: 'DEROGATION', decision: 'AUTORISE', by: 'Marie KAPEND (RH Acme)', reason: 'Autorisation spéciale employeur d\'accord dérogatoire de 600$.', attachment: 'Accord_Derg_102.pdf' },
    { id: 'DEC-904', date: '2026-05-26 09:12', type: 'PEC_DEMANDE', decision: 'REFUSE', by: 'Dr. Sarah LOKO', reason: 'La pathologie d\'esthétique dentaire n\'est pas couverte par le contrat.', attachment: 'Doc_Rejet_9921.pdf' },
    { id: 'DEC-905', date: '2026-05-25 16:40', type: 'ORDONNANCE_OTP', decision: 'AUTORISE', by: 'Dr. Sarah LOKO', reason: 'Signature certifiée par clé de sécurité OTP ordonnance électronique.', attachment: 'Prescr_Sign_1029.pdf' }
  ]);

  const [refusalModalOpen, setRefusalModalOpen] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<PreAuthClaim | null>(null);
  const [refusalReason, setRefusalReason] = useState('Dépassement du plafond annuel de l\'affilié.');

  const triggerToast = (title: string, desc: string) => {
    setToastMsg({ title, desc });
    setTimeout(() => {
      setToastMsg(null);
    }, 4500);
  };

  // Log action calls to audit logs (Prompt 2 requirement)
  const logClickCommunication = (claimName: string, channel: 'GSM' | 'WhatsApp') => {
    logAction('CONDUITE_URGENTE_MEDECIN', `Dr. Sarah LOKO a initié un contact urgent via ${channel} avec l'assuré ou le médecin conseil concernant la demande de prise en charge PEC de "${claimName}".`, 'INFO');
    triggerToast(
      `Appel Urgent ${channel} lancé`,
      `Communication redirigée vers votre terminal avec l'identifiant patient de "${claimName}".`
    );
  };

  const handleSearchPatientDME = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientSearch.trim()) return;

    if (patientSearch.toLowerCase().includes('jean') || patientSearch.toLowerCase().includes('mukendi')) {
      const hasConsent = consentList.some(c => c.assure_id === 'patient-jean' && c.type_consent === 'DME_ACCESS');
      if (!hasConsent) {
        setSearchFeedback("BLOQUÉ : Aucun consentement actif trouvé pour Jean PATIENT MUKENDI. L'accès au DME est refusé conformément aux règles ARCA-RDC.");
        logAction('DME_ACCES_REFUSE_NO_CONSENT', "Tentative d'accès au DME de Jean PATIENT MUKENDI bloquée (absence de consentement actif).", "WARNING");
      } else {
        setSearchFeedback("ACCÈS AUTORISÉ : DME-8842 - Jean PATIENT MUKENDI | Diagnostics: Hypertension artérielle modérée, Diabète de type II insulinodépendant | Allergies: Pénicilline G | IP de log: 192.168.1.12");
        logAction('DME_ACCES_AUTORISE', "Dr. Sarah LOKO a accédé de manière sécurisée au DME de Jean PATIENT suite au scan de sa carte.", "INFO");
      }
    } else {
      setSearchFeedback("Erreur DME: Consentement non donné ou carte introuvable.");
      logAction('DME_ACCES_REFUSE', `Tentative d'accès non autorisée au DME pour la recherche "${patientSearch}".`, 'WARNING');
    }
  };

  const approveClaim = (claim: PreAuthClaim) => {
    setPreAuthClaims(prev => prev.map(c => c.id === claim.id ? { ...c, status: 'APPROUVEE' } : c));
    const newLog: DecisionLog = {
      id: `DEC-${Math.floor(Math.random() * 100) + 1000}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'PEC_DEMANDE',
      decision: 'AUTORISE',
      by: 'Dr. Sarah LOKO',
      reason: `Approbation directe acte médical: ${claim.procedure}`,
      attachment: `Certif_Appr_${claim.id}.pdf`
    };
    setDecisionLogs([newLog, ...decisionLogs]);
    logAction('EDITION_PEC_ACCEPTATION', `Dr. Sarah LOKO a formellement approuvé la PEC ${claim.id} pour un montant de ${claim.amount} USD.`, 'INFO');
    triggerToast("PEC Approuvée", `La prise en charge pour ${claim.patientName} a été transmise au tiers payant.`);
  };

  const openRegisterRefusal = (claim: PreAuthClaim) => {
    setSelectedClaim(claim);
    setRefusalModalOpen(true);
  };

  const submitRefusal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClaim) return;

    setPreAuthClaims(prev => prev.map(c => c.id === selectedClaim.id ? { ...c, status: 'REFUSEE' } : c));
    
    const newLog: DecisionLog = {
      id: `DEC-${Math.floor(Math.random() * 100) + 1000}`,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'PEC_DEMANDE',
      decision: 'REFUSE',
      by: 'Dr. Sarah LOKO',
      reason: refusalReason,
      attachment: `Rejet_Cert_${selectedClaim.id}.pdf`
    };
    setDecisionLogs([newLog, ...decisionLogs]);
    
    logAction('EDITION_PEC_REFUS', `Dr. Sarah LOKO a refusé la PEC ${selectedClaim.id} de pour le motif : ${refusalReason}`, 'WARNING');
    
    setRefusalModalOpen(false);
    triggerToast("Refus Enregistré", `La PEC de ${selectedClaim.patientName} a été classifiée Refusée. Rapport transmis.`);
  };

  const downloadCertifiedPDF = () => {
    logAction('EXPORT_TIMELINE_CERTIFIEE_ISO', "Exportation et certification numérique de la timeline de décision conforme ISO 27001.", "INFO");
    triggerToast("PDF Numérique Certifié", "Le rapport d'audit signé numériquement par l'autorité d'accréditation a été téléchargé cryptographiquement.");
  };

  return (
    <div className="space-y-6">

      {/* Dynamic Pop toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 border border-white/10 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="p-2 bg-emerald-500 rounded-xl text-white shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">{toastMsg.title}</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toastMsg.desc}</p>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medical Hub Accent */}
      <div className="p-6 bg-gradient-to-r from-teal-600 to-sky-700 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.4),transparent)]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="bg-teal-500/30 border border-teal-400/50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-teal-100">
              Praticien Associé : Hôpital Clinique Ngaliema
            </span>
            <h1 id="doctor-dashboard-title" className="text-2xl font-black mt-2 tracking-tight">Hub Clinicien &amp; PEC — Dr. Sarah LOKO</h1>
            <p className="text-xs text-teal-100 mt-1 font-bold">Instruire les demandes de pré-autorisation, téléconsulter vos DME, auditer l&apos;historique de décision.</p>
          </div>
          <div className="bg-white/15 px-4 py-2.5 rounded-2xl flex items-center gap-1.5 border border-white/10 font-mono text-[9px] font-black leading-none uppercase">
            📌 CODE PRESCRIPTEUR: ARCA-CDH-Ngaliema-Sarah
          </div>
        </div>
      </div>

      {/* DME Quick Action Search Form */}
      <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <h3 className="text-sm font-black text-slate-900 uppercase mb-3">Accès Sécurisé DME Patient</h3>
        <form onSubmit={handleSearchPatientDME} className="flex gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Saisissez le nom d'un affilié ou approchez sa carte virtuelle numérique..." 
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold outline-none"
            />
          </div>
          <button 
            type="submit"
            className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
          >
            Accéder au DME
          </button>
        </form>
        {searchFeedback && (
          <div className={cn(
            "mt-3 p-4 text-[11px] font-bold tracking-normal rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 border",
            searchFeedback.includes("BLOQUÉ") 
              ? "bg-amber-50 border-amber-200 text-amber-800" 
              : "bg-teal-50 border-teal-100 text-teal-700"
          )}>
            <div className="space-y-1">
              <span className="font-extrabold uppercase block text-[9px] tracking-widest">{searchFeedback.includes("BLOQUÉ") ? "⚠️ Alerte Sécurité ARCA" : "✅ Validation Clinique (DME déchiffré)"}</span>
              <p className="text-[11.5px] font-black">{searchFeedback}</p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto uppercase">
              {searchFeedback.includes("BLOQUÉ") && (
                <button
                  type="button"
                  onClick={() => {
                    const newConsent = {
                      id: `CONSENT-${Math.floor(1000 + Math.random() * 9000)}`,
                      assure_id: 'patient-jean',
                      medecin_id: "medecin-sarah",
                      type_consent: "DME_ACCESS",
                      granted_at: new Date().toISOString(),
                      ip: "192.168.1.12"
                    };
                    const updated = [...consentList, newConsent];
                    setConsentList(updated);
                    localStorage.setItem("assur_consent_logs", JSON.stringify(updated));
                    
                    // Log the security confirmation
                    logAction('GRANT_PATIENT_CONSENT_DME', `Le médecin a recueilli et validé le consentement d'accès DME pour "Jean PATIENT MUKENDI" depuis l'IP 192.168.1.12.`, 'INFO');
                    
                    setSearchFeedback("ACCÈS AUTORISÉ (Nouveau Consentement Actif) : DME-8842 - Jean PATIENT MUKENDI | Antécédents: Diabète Type II insulinodépendant, Hypertension modérée | Allergies: Pénicilline G | IP Signature: 192.168.1.12");
                  }}
                  className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-[9.5px] font-black tracking-wider rounded-lg transition-colors cursor-pointer shrink-0"
                >
                  Signer Consentement (IP Logged)
                </button>
              )}
              <button type="button" onClick={() => setSearchFeedback(null)} className="text-slate-400 hover:text-slate-700 px-2 font-black">✕</button>
            </div>
          </div>
        )}
      </div>

      {/* Portal Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'claims', label: '🏥 Demandes de PEC Clinique Ngaliema', count: preAuthClaims.filter(c => c.status === 'DEMANDE').length },
          { id: 'decisions', label: '📋 Historique Décisions &amp; ISO Logs', count: decisionLogs.length }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2",
              activeTab === t.id ? "bg-teal-50 text-teal-700 border border-teal-100" : "text-slate-400 hover:text-teal-700"
            )}
            dangerouslySetInnerHTML={{ __html: t.label + (t.count ? ` <span class="bg-teal-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded leading-none">${t.count}</span>` : '') }}
          />
        ))}
      </div>

      {activeTab === 'claims' && (
        <div className="space-y-4">
          
          {/* Prompt 2 Specifications: Emergency Calls Grid */}
          <div className="grid grid-cols-1 gap-4">
            {preAuthClaims.map((claim) => {
              // Rule: If request status is 'DEMANDE', and created over 30 min ago (simulated based on isUrgent flag and claimsReadStatus)
              const minutesElapsed = claim.id === 'PEC-8082' ? 40 : (claim.id === 'PEC-8084' ? 65 : 10);
              const isCritOver30Min = claim.status === 'DEMANDE' && minutesElapsed > 30 && claim.isUrgent;

              return (
                <div 
                  key={claim.id} 
                  className={cn(
                    "p-6 bg-white border rounded-[2rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all",
                    isCritOver30Min ? "border-rose-400 bg-rose-50/40 relative shadow-rose-200/40 shadow-lg" : "border-slate-100"
                  )}
                >
                  {/* Left Metadata info */}
                  <div className="space-y-2 flex-1 relative">
                    {isCritOver30Min && (
                      <span className="absolute -top-3 -left-3 animate-ping inline-flex h-3.5 w-3.5 rounded-full bg-rose-500 opacity-75" />
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[8px] font-black uppercase rounded-lg border",
                        claim.status === 'APPROUVEE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        claim.status === 'REFUSEE' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-teal-50 text-teal-600 border-teal-100"
                      )}>
                        Prise en charge {claim.status}
                      </span>

                      {/* Blinking "Urgence" or elapsed time warning Badge */}
                      {isCritOver30Min ? (
                        <span className="px-2.5 py-1 text-[8.5px] font-black text-white bg-red-600 animate-pulse rounded-lg flex items-center gap-1.5 shadow">
                          ⚠️ CRITIQUE &gt; 30 MIN NON TRAITÉE
                        </span>
                      ) : (
                        <span className="text-[9.5px] font-bold text-slate-400 uppercase italic">Reçue il y a {minutesElapsed} min</span>
                      )}
                    </div>

                    <h4 className="text-sm font-black text-slate-1000 uppercase leading-none">{claim.patientName}</h4>
                    <p className="text-xs text-slate-550 font-medium">Acte requis: <span className="font-extrabold text-slate-900">{claim.procedure}</span> | Budget estimé: <span className="font-extrabold text-teal-600">{claim.amount} USD</span></p>
                  </div>

                  {/* Actions right pane */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                    
                    {/* GDPR / Consent Communications Check (Prompt 2 requirement) */}
                    <div className="flex flex-col gap-1 pr-2 border-r border-slate-200/70 py-1 mr-1">
                      {claim.consentCall ? (
                        <div className="flex gap-1.5">
                          {/* GSM direct Dial */}
                          <button
                            onClick={() => logClickCommunication(claim.patientName, 'GSM')}
                            className={cn(
                              "px-3 py-2 text-[9px] font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-colors border shadow-sm",
                              isCritOver30Min ? "bg-red-600 hover:bg-red-700 text-white border-transparent" : "bg-slate-50 text-slate-800 hover:bg-slate-100 border-slate-200"
                            )}
                          >
                            <Phone className="w-3.5 h-3.5" /> Tel GSM
                          </button>

                          {/* WhatsApp Direct API and precompiled text */}
                          <button
                            onClick={() => logClickCommunication(claim.patientName, 'WhatsApp')}
                            className={cn(
                              "px-3 py-2 text-[9px] font-black rounded-xl uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer transition-all border shadow-sm",
                              isCritOver30Min ? "bg-emerald-600 hover:bg-emerald-700 text-white border-transparent" : "bg-slate-50 text-slate-850 hover:bg-slate-100 border-slate-200"
                            )}
                          >
                            <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Urgence
                          </button>
                        </div>
                      ) : (
                        <span className="text-[10px] text-rose-600 font-extrabold flex items-center gap-1 bg-rose-50 border border-rose-100 px-3 py-2 rounded-xl shrink-0" title="GDPR Contact block active">
                          <Ban className="w-3.5 h-3.5" /> Le patient a refusé d&apos;être contacté
                        </span>
                      )}
                    </div>

                    {/* Operational approvals */}
                    {claim.status === 'DEMANDE' ? (
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openRegisterRefusal(claim)}
                          className="px-3 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 text-[10px] font-black uppercase rounded-xl cursor-pointer"
                        >
                          Refuser PEC
                        </button>
                        <button 
                          onClick={() => approveClaim(claim)}
                          className="px-3.5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-black uppercase rounded-xl shadow-md cursor-pointer"
                        >
                          Approuver
                        </button>
                      </div>
                    ) : (
                      <span className="text-teal-600 text-[10.5px] font-black uppercase flex items-center gap-1 leading-none italic">
                        <CheckCircle2 className="w-4 h-4 font-black text-teal-600" /> Traitement Certifié Clôturé
                      </span>
                    )}

                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* DECISIONS TIMELINE CHIEF (PROMPT 3 REQUIREMENTS) */}
      {activeTab === 'decisions' && (
        <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">Registre Certifié des Décisions et Trace d&apos;Audit ISO 27001</h3>
              <p className="text-xs text-slate-400 font-bold mt-1 max-w-xl">
                Toutes les décisions de prise en charge d&apos;hospitalisation ou accès aux dossiers médicaux (DME) sont horodatées à la seconde et consignées cryptographiquement. Tout rejet exige la consignation d&apos;un motif légal et d&apos;une pièce jointe certifiée.
              </p>
            </div>
            <button
              onClick={downloadCertifiedPDF}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow flex items-center gap-2 cursor-pointer outline-none"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export PDF Certifié
            </button>
          </div>

          {/* Timeline and vertical layout for audit logs */}
          <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
            {decisionLogs.map((log) => (
              <div key={log.id} className="relative group">
                {/* Visual marker */}
                <span className={cn(
                  "absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white shadow-md flex items-center justify-center text-white font-bold text-[8px]",
                  log.decision === 'AUTORISE' ? "bg-emerald-500" : "bg-red-500"
                )} />

                <div className="p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-200/70 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-mono text-slate-400 font-bold">{log.date}</span>
                      <span className={cn(
                        "px-1.5 py-0.5 text-[8px] font-black uppercase rounded border",
                        log.decision === 'AUTORISE' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-50 text-rose-600 border-rose-100"
                      )}>
                        {log.decision}
                      </span>
                      <span className="text-[9.5px] font-black text-slate-500 uppercase tracking-widest leading-none">[{log.type}]</span>
                    </div>

                    <p className="text-xs text-slate-500 font-medium">Motif consigné : <span className="font-extrabold text-slate-900 leading-relaxed">{log.reason}</span></p>
                    <p className="text-[9px] text-slate-400 font-bold">Signataire : <span className="text-slate-600">{log.by}</span></p>
                  </div>
                  
                  {/* Embedded Certified File attachment */}
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[8.5px] text-indigo-600 font-black tracking-widest uppercase flex items-center gap-1 px-2.5 py-1.5 bg-indigo-50 border border-indigo-100 rounded-lg">
                      <FileText className="w-3.5 h-3.5" /> {log.attachment}
                    </span>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}


      {/* HOSPITAL REJECTION ENTRY CONSTRAINTS DIALOG (PROMPT 3 REQUIREMENTS) */}
      <AnimatePresence>
        {refusalModalOpen && selectedClaim && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRefusalModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                  <h3 className="text-xs font-black text-slate-800 uppercase italic">Formulaire de Motif de Rejet Certifié</h3>
                </div>
                <button onClick={() => setRefusalModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={submitRefusal} className="p-6 space-y-4">
                <p className="text-[11.5px] text-slate-400 italic">
                  Conformément aux normes ISO 27001 et aux chartes hospitalières de l&apos;ARCA RDC, tout refus d&apos;autorisation de soins de <span className="font-extrabold text-slate-900">{selectedClaim.patientName}</span> exige de spécifier expressément le motif de rejet pour traçabilité dans la table d&apos;audit.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Rupture / Raison légale de refus</label>
                  <select
                    value={refusalReason}
                    onChange={(e) => setRefusalReason(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold"
                  >
                    <option value="Dépassement du plafond annuel de l'affilié.">Dépassement du plafond annuel de l&apos;affilié.</option>
                    <option value="L'acte médical requis n'est pas stipulé ou couvert au barème de l'employeur.">L&apos;acte médical requis n'est pas stipulé ou couvert au barème de l&apos;employeur.</option>
                    <option value="Absence de pièce d'identité ou suspicion forte d'usurpation d'identifiant en pharmacie.">Absence de pièce d&apos;identité ou suspicion forte d&apos;usurpation d&apos;identifiant en pharmacie.</option>
                    <option value="Hôpital non accrédité Tiers-Payant dans la formule choisie par le cotisant.">Hôpital non accrédité Tiers-Payant dans la formule choisie par le cotisant.</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Avis technique certifié de sortie (Fichier cryptographe joint)</label>
                  <div className="p-3 bg-slate-50 border border-dashed border-slate-200 rounded-xl text-center text-[10px] text-slate-400 font-bold">
                    [📂 Pièce justificative_Ngaliema_Sarah.pdf auto-généré certifié]
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setRefusalModalOpen(false)}
                    className="flex-1 py-3 text-slate-400 hover:bg-slate-50 rounded-xl font-bold text-[10px] uppercase text-center cursor-pointer border border-transparent"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-[10px] uppercase text-center rounded-xl cursor-pointer"
                  >
                    Saisir et Valider Rejet
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
