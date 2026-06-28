/**
 * 🏢 Fichier : /src/frontend/components/dashboards/EnterpriseRHDashboard.tsx
 * 🎯 Objectif : Espace RH Entreprise Marie KAPEND (ACME RDC) - ISO 27001 & RGPD
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, DollarSign, ShieldAlert, BellRing, PhoneCall, 
  Check, ArrowRight, Smartphone, AlertTriangle, Send, X,
  FileSpreadsheet, Sparkles, ShieldCheck, Mail, Siren, 
  MapPin, Clock, ExternalLink, RefreshCw, ChevronRight, CreditCard
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp } from '../../lib/AppContext';

interface CotisationRow {
  id: string;
  assureName: string;
  grade: 'Directeur' | 'Manager' | 'Opérateur' | 'Technicien';
  primeDue: number;
  montantPaye: number;
  retardJours: number;
  statutPaiement: 'IMPAYE' | 'PARTIEL' | 'PAYE';
  statutQR: 'ACTIF' | 'SUSPENDU';
}

interface AlerteCritique {
  id: string;
  type: 'PLAFOND_CRITIQUE' | 'DEROGATION_ATTENTE' | 'HOSPITALISATION' | 'QR_BLOQUE';
  employee: string;
  detail: string;
  timestamp: string;
  urgency: 'CRITIQUE' | 'MODERE' | 'INFO';
  assignedTo: string | null;
  slaMinutesLeft: number;
}

export const EnterpriseRHDashboard: React.FC<{ onNavigateToModule?: (id: string) => void }> = ({ onNavigateToModule }) => {
  const { logAction } = useApp();
  
  // Real-time notification toast
  const [toastMsg, setToastMsg] = useState<{ title: string; desc: string; type: 'success' | 'warning' } | null>(null);
  
  // --- Modals States ---
  const [isMomoModalOpen, setIsMomoModalOpen] = useState(false);
  const [selectedCotisation, setSelectedCotisation] = useState<CotisationRow | null>(null);
  const [momoOperator, setMomoOperator] = useState<'M-Pesa' | 'Airtel Money' | 'Orange Money'>('M-Pesa');
  const [momoPhone, setMomoPhone] = useState('081234567');
  const [isProcessingMomo, setIsProcessingMomo] = useState(false);

  const [activeTab, setActiveTab] = useState<'kpis' | 'cotisations' | 'alertes'>('kpis');

  // Initial State: Prompt 1 - Cotisations Marie KAPEND Table
  const [cotisations, setCotisations] = useState<CotisationRow[]>([
    { id: 'COT-001', assureName: 'Lucien BANZA', grade: 'Directeur', primeDue: 150, montantPaye: 150, retardJours: 0, statutPaiement: 'PAYE', statutQR: 'ACTIF' },
    { id: 'COT-002', assureName: 'Jean PATIENT MUKENDI', grade: 'Manager', primeDue: 120, montantPaye: 0, retardJours: 19, statutPaiement: 'IMPAYE', statutQR: 'SUSPENDU' }, // Retard J+15 and IMPAYE -> SUSPENDU
    { id: 'COT-003', assureName: 'Therese KABEDI', grade: 'Technicien', primeDue: 90, montantPaye: 45, retardJours: 8, statutPaiement: 'PARTIEL', statutQR: 'ACTIF' },
    { id: 'COT-004', assureName: 'Guy NKULU', grade: 'Opérateur', primeDue: 90, montantPaye: 0, retardJours: 18, statutPaiement: 'IMPAYE', statutQR: 'SUSPENDU' }, // Retard J+15 -> SUSPENDU
    { id: 'COT-005', assureName: 'Rebecca MONZANGO', grade: 'Manager', primeDue: 120, montantPaye: 120, retardJours: 0, statutPaiement: 'PAYE', statutQR: 'ACTIF' },
    { id: 'COT-006', assureName: 'Alain KANIKI', grade: 'Opérateur', primeDue: 95, montantPaye: 0, retardJours: 5, statutPaiement: 'IMPAYE', statutQR: 'ACTIF' },
  ]);

  // Initial State: Prompt 4 - Critical alert feed for Marie KAPEND
  const [alertesFeed, setAlertesFeed] = useState<AlerteCritique[]>([
    { 
      id: 'ALT-101', 
      type: 'PLAFOND_CRITIQUE', 
      employee: 'Jean PATIENT MUKENDI', 
      detail: 'A atteint 92% de son plafond annuel de couverture médicale (460 USD consommés sur 500 USD autorisés). Risque de blocage imminent.', 
      timestamp: 'Il y a 10 min', 
      urgency: 'CRITIQUE', 
      assignedTo: 'Marie KAPEND',
      slaMinutesLeft: 110
    },
    { 
      id: 'ALT-102', 
      type: 'DEROGATION_ATTENTE', 
      employee: 'Therese KABEDI', 
      detail: 'Clinique Ngaliema sollicite un accord dérogatoire de 650 USD pour imagerie médicale lourde. En attente de signature employeur.', 
      timestamp: 'Il y a 45 min', 
      urgency: 'CRITIQUE', 
      assignedTo: null,
      slaMinutesLeft: 75 // SLA of 2 hours. If 75m left, we track it
    },
    { 
      id: 'ALT-103', 
      type: 'HOSPITALISATION', 
      employee: 'Guy NKULU', 
      detail: 'Admis d\'urgence à l\'Hôpital HJ Hospitals (Trauma crânien léger, en observation service chirurgie). Fiche d\'admission validée.', 
      timestamp: 'Il y a 1 heure', 
      urgency: 'CRITIQUE', 
      assignedTo: null,
      slaMinutesLeft: 120
    },
    { 
      id: 'ALT-104', 
      type: 'QR_BLOQUE', 
      employee: 'Groupe Techniques', 
      detail: '2 collaborateurs ACME voient leur QR Card santé automatique suspendue pour cause d\'arriérés règlementaires supérieurs à J+15.', 
      timestamp: 'Ce matin', 
      urgency: 'MODERE', 
      assignedTo: 'Marie KAPEND',
      slaMinutesLeft: 1440
    }
  ]);

  const triggerToast = (title: string, desc: string, type: 'success' | 'warning' = 'success') => {
    setToastMsg({ title, desc, type });
    setTimeout(() => {
      setToastMsg(null);
    }, 4500);
  };

  // --- Actions triggers ---
  const handleRelancer = (row: CotisationRow) => {
    // Audit actions log double tracking
    logAction('RELANCE_COTISATION_EMPLOYE', `Relance émise pour ${row.assureName}. Envoi instantané d'une alerte multicanale (SMS au ${row.id}, Email, Notif Push mobile) pour un montant de ${row.primeDue - row.montantPaye} USD.`, 'WARNING');
    triggerToast(
      "Relance Multicanale Émise",
      `Email, SMS & Notification Push de mise en demeure transmis immédiatement avec succès au collaborateur "${row.assureName}".`,
      "success"
    );
  };

  const openPayForHim = (row: CotisationRow) => {
    setSelectedCotisation(row);
    setIsMomoModalOpen(true);
  };

  const handleMomoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCotisation) return;

    setIsProcessingMomo(true);
    
    // Simulate mobile money push request API
    setTimeout(() => {
      setIsProcessingMomo(false);
      setIsMomoModalOpen(false);

      // Status update
      setCotisations(prev => prev.map(c => {
        if (c.id === selectedCotisation.id) {
          return {
            ...c,
            montantPaye: c.primeDue,
            statutPaiement: 'PAYE',
            statutQR: 'ACTIF',
            retardJours: 0
          };
        }
        return c;
      }));

      logAction(
        'MOBILE_MONEY_COMPENSATION', 
        `Paiement compensé de ${selectedCotisation.primeDue - selectedCotisation.montantPaye} USD par Mobile Money (${momoOperator} : ${momoPhone}) pour l'affilié ${selectedCotisation.assureName}. Son QR Code a été réactivé immédiatement.`,
        'INFO'
      );
      
      triggerToast(
        "Paiement Compensé !",
        `La couverture médicale de ${selectedCotisation.assureName} est rétablie. Le pass QR Code est repassé au vert immédiatement.`,
        "success"
      );
    }, 2000);
  };

  const handleApproveDerogation = (al: AlerteCritique) => {
    logAction('DEROGATION_APPROUVEE', `Marie KAPEND a signé l'accord de dérogation budgétaire de 650 USD pour ${al.employee} (SLA restante: ${al.slaMinutesLeft} min).`, 'INFO');
    setAlertesFeed(prev => prev.filter(a => a.id !== al.id));
    triggerToast(
      "Dérogation Approuvée",
      `Accord financier transmis en direct à l'Hôpital Ngaliema. Le patient "${al.employee}" peut recevoir ses soins.`,
      "success"
    );
  };

  // SLA Timer update Simulation
  useEffect(() => {
    const handler = setInterval(() => {
      setAlertesFeed(prev => prev.map(a => {
        if (a.slaMinutesLeft > 0) {
          const newSla = a.slaMinutesLeft - 1;
          if (newSla === 0 && a.type === 'DEROGATION_ATTENTE') {
            logAction('SLA_ESCALATION_SMS', `SLA dépassée (2h) pour la dérogation de ${a.employee}. Alerte critique escaladée par SMS automatique vers la direction (N+2) et Marie KAPEND.`, 'WARNING');
          }
          return { ...a, slaMinutesLeft: newSla };
        }
        return a;
      }));
    }, 30000); // simulation 30 seconds

    return () => clearInterval(handler);
  }, []);

  // Compute stats of delayed
  const unpaidCount = cotisations.filter(c => c.statutPaiement === 'IMPAYE').length;
  const totalArrears = cotisations.reduce((acc, c) => acc + (c.primeDue - c.montantPaye), 0);

  return (
    <div className="space-y-6">
      
      {/* Toast Alert popup banner */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -25 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 border border-white/10 text-white rounded-2xl p-4 shadow-2xl flex items-start gap-4"
          >
            <div className="p-2 bg-green-500 rounded-xl text-white shrink-0">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-green-400">{toastMsg.title}</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toastMsg.desc}</p>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header and Corporate brand banner */}
      <div className="p-6 bg-gradient-to-r from-emerald-600 to-teal-700 rounded-[2rem] text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-15 pointer-events-none bg-[radial-gradient(circle_at_right,rgba(255,255,255,0.4),transparent)]" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <span className="bg-emerald-500/30 border border-emerald-400/50 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-emerald-100">
              Associe-Santé : ACME SARL RDC
            </span>
            <h1 id="rh-dashboard-title" className="text-2xl font-black mt-2 tracking-tight">Portail Manager RH — Marie KAPEND</h1>
            <p className="text-xs text-emerald-100 mt-1 font-bold">Gérez la couverture collective de vos affiliés, surveillez les plafonds &amp; réglez les cotisations.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('cotisations')} 
              className="px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 text-[10px] font-black uppercase rounded-xl transition-all shadow-md"
            >
              Régler cotisations
            </button>
            <button 
              onClick={() => setActiveTab('alertes')} 
              className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-400 text-[10px] font-black uppercase rounded-xl transition-all shadow-md flex items-center gap-1"
            >
              <Siren className="w-3.5 h-3.5" /> {alertesFeed.length} Alertes
            </button>
          </div>
        </div>
      </div>

      {/* Mini Tabs Bar */}
      <div className="flex gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'kpis', label: '📊 Tableau de Bord ACME', count: null },
          { id: 'cotisations', label: '💰 Cotisations & Factures', count: unpaidCount },
          { id: 'alertes', label: '🚨 Flux d\'Alertes Critiques', count: alertesFeed.length }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2",
              activeTab === t.id ? "bg-emerald-50 text-emerald-700 border border-emerald-100 font-extrabold" : "text-slate-400 hover:text-emerald-700"
            )}
          >
            {t.label}
            {t.count !== null && (
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[8px] font-black leading-none",
                activeTab === t.id ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-500"
              )}>
                {t.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Main tab switch content */}
      {activeTab === 'kpis' && (
        <div className="space-y-6">
          
          {/* Dashboard Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Widget of unpaid - From Prompt 1 Requirements */}
            <div 
              onClick={() => setActiveTab('cotisations')} 
              className="p-6 bg-rose-50 border border-rose-100 rounded-[2rem] shadow-sm flex flex-col justify-between hover:scale-[1.02] cursor-pointer transition-all group"
            >
              <div>
                <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[8px] font-black uppercase rounded-lg">Arriérés Exigibles</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">PRIME EN RETARD</p>
                <h4 className="text-xl font-black text-rose-600">{unpaidCount} ASSURÉS | {totalArrears} USD</h4>
              </div>
              <p className="text-[9px] font-extrabold text-rose-500 uppercase tracking-widest mt-6 group-hover:underline flex items-center gap-1.5">
                Voir et régulariser <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase rounded-lg">Effectif de couverture</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">COLLABORATEURS ACME</p>
                <h4 className="text-xl font-black text-slate-900">480 Actifs</h4>
              </div>
              <p className="text-[9px] text-slate-400 font-bold mt-6 italic">Géré avec succès</p>
            </div>

            <div className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[8px] font-black uppercase rounded-lg">PEC Sollicitées</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">SINISTRES CE MOIS</p>
                <h4 className="text-xl font-black text-slate-900">14 Demandes accordées</h4>
              </div>
              <p className="text-[9px] text-slate-400 font-bold mt-6 italic">Budget consommé à 32%</p>
            </div>

            <div className="p-6 bg-teal-50 border border-teal-100 rounded-[2rem] shadow-sm flex flex-col justify-between">
              <div>
                <span className="px-2.5 py-1 bg-teal-100 text-teal-700 text-[8px] font-black uppercase rounded-lg">Coût Mensuel Global</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">MOYENNE COTISATION</p>
                <h4 className="text-xl font-black text-teal-800">4,120 USD / mois</h4>
              </div>
              <p className="text-[9px] text-teal-500 font-bold mt-6 italic">Prochain encaissement autom. 01-06-2026</p>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick alert feed summaries for Marie (Prompt 4) */}
            <div className="lg:col-span-2 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Alertes Opérationnelles Récentes</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">Fil d&apos;activité urgent ACME</p>
                </div>
                <button 
                  onClick={() => setActiveTab('alertes')}
                  className="text-[10px] font-black text-emerald-600 hover:underline uppercase flex items-center gap-1"
                >
                  Tout voir ({alertesFeed.length}) <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {alertesFeed.slice(0, 2).map((al) => (
                  <div key={al.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 text-[8px] font-black uppercase rounded-lg border",
                          al.type === 'PLAFOND_CRITIQUE' ? "bg-rose-50 text-rose-600 border-rose-200" :
                          al.type === 'DEROGATION_ATTENTE' ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse" : "bg-sky-50 text-sky-600 border-sky-25"
                        )}>
                          {al.type}
                        </span>
                        <span className="text-[9px] text-slate-450 font-bold italic">{al.timestamp}</span>
                      </div>
                      <p className="text-xs font-black text-slate-900">{al.employee}</p>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed">{al.detail}</p>
                    </div>

                    <div className="flex flex-col justify-center items-end shrink-0 gap-2">
                      {al.type === 'DEROGATION_ATTENTE' ? (
                        <button 
                          onClick={() => handleApproveDerogation(al)} 
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] rounded-lg tracking-widest uppercase"
                        >
                          Approuver
                        </button>
                      ) : (
                        <span className="text-[9.5px] text-rose-500 font-black flex items-center gap-1">
                          <Clock className="w-3 h-3" /> SLA {al.slaMinutesLeft} min
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Compliance checklist */}
            <div className="p-6 bg-slate-900 text-white rounded-[2rem] shadow-xl space-y-4">
              <span className="px-2.5 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase rounded-lg">ISO 1709-1 Conformity</span>
              <h3 className="text-sm font-black uppercase tracking-wide">Tableau d&apos;Activité &amp; Audits</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-bold">
                AssurAdvancé enforce un audit strict conforme aux directives d&apos;assurance de la CNAM et de l&apos;ARCA RDC. Chaque relance et versement est certifié numériquement.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Chiffrement AES-256 actif
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Double Validation MFA exigée
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Sauvegarde chantiers ISO quotidienne
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* COTISATIONS TABS SCREEN: PROMPT 1 REQUIREMENTS */}
      {activeTab === 'cotisations' && (
        <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">Registre de Cotisation du Personnel d&apos;ACME</h3>
            <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
              Pour des raisons règlementaires, tout impayé supérieur à <span className="font-extrabold text-rose-600 underline">J+15</span> verra le Pass Virtuel QR Code de l&apos;adhérent <span className="font-extrabold text-rose-600 uppercase">suspendu</span> automatiquement. Les lignes en suspension obligatoire s&apos;affichent en rouge.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left font-sans col-auto">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <th className="py-4 px-6">Assuré</th>
                  <th className="py-4 px-6">Grade / Catégorie</th>
                  <th className="py-4 px-6 text-right">Prime Due</th>
                  <th className="py-4 px-6 text-right">Montant Réglé</th>
                  <th className="py-4 px-6 text-center">Jours de Retard</th>
                  <th className="py-4 px-6 text-center">Statut QR Code</th>
                  <th className="py-4 px-6 text-center">Règlement direct</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {cotisations.map((row) => {
                  const isRedLine = row.statutPaiement === 'IMPAYE' && row.retardJours >= 15;
                  
                  return (
                    <tr 
                      key={row.id} 
                      className={cn(
                        "hover:bg-slate-50/50 transition-colors font-bold text-slate-700",
                        isRedLine && "bg-rose-50/70 text-rose-900 "
                      )}
                    >
                      <td className="py-4 px-6 text-slate-900 uppercase font-black">
                        {row.assureName}
                      </td>
                      <td className="py-4 px-6 text-[11px] text-slate-500 font-bold">
                        {row.grade}
                      </td>
                      <td className="py-4 px-6 text-right text-slate-900 font-extrabold">
                        {row.primeDue} USD
                      </td>
                      <td className="py-4 px-6 text-right font-extrabold text-emerald-600">
                        {row.montantPaye} USD
                      </td>
                      <td className="py-4 px-6 text-center text-slate-400 font-mono">
                        {row.retardJours > 0 ? (
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[10px] font-extrabold",
                            isRedLine ? "bg-red-200 text-red-900" : "bg-amber-100 text-amber-800"
                          )}>
                            ⚠️ {row.retardJours} Jours
                          </span>
                        ) : (
                          <span className="text-emerald-600 font-bold">Payé à temps</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={cn(
                          "px-2.5 py-1 text-[8.5px] font-black uppercase tracking-widest rounded-lg border",
                          row.statutQR === 'ACTIF' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-600 text-white border-transparent"
                        )}>
                          {row.statutQR}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex gap-2 justify-center items-center">
                          {row.statutPaiement !== 'PAYE' ? (
                            <>
                              <button 
                                onClick={() => handleRelancer(row)}
                                className="px-2.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <Mail className="w-3.5 h-3.5" /> Relancer
                              </button>
                              <button 
                                onClick={() => openPayForHim(row)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
                              >
                                <CreditCard className="w-3.5 h-3.5" /> Payer pour lui
                              </button>
                            </>
                          ) : (
                            <span className="text-emerald-600 font-black text-[10px] uppercase flex items-center gap-1">
                              <ShieldCheck className="w-4 h-4" /> Compensé
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CRITICAL ALERTS TABS SCREEN: PROMPT 4 REQUIREMENTS */}
      {activeTab === 'alertes' && (
        <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">Flux de Télémétrie &amp; Alertes Critiques ACME</h3>
            <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
              Outil de surveillance en temps-réel (Simulé sous couverture ISO 27001). Les dérogations sollicitées par les hôpitaux ont un SLA réglementaire d&apos;approbation de 2heures après quoi une remontée hiérarchique SMS s&apos;active.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2">
            {[
              { label: 'Tous les flux', count: alertesFeed.length, active: true },
              { label: 'Finance Urgente', count: alertesFeed.filter(a => a.type === 'PLAFOND_CRITIQUE' || a.type === 'QR_BLOQUE').length, active: false },
              { label: 'Hospitalisations d\'urgence', count: alertesFeed.filter(a => a.type === 'HOSPITALISATION').length, active: false },
              { label: 'Dérogations en attente', count: alertesFeed.filter(a => a.type === 'DEROGATION_ATTENTE').length, active: false }
            ].map((f, idx) => (
              <button key={idx} className={cn(
                "p-3 rounded-2xl border text-center font-black text-[11px] uppercase transition-all",
                f.active ? "bg-emerald-600 text-white border-transparent" : "bg-slate-50 text-slate-500 border-slate-200"
              )}>
                {f.label} ({f.count})
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {alertesFeed.length === 0 ? (
              <div className="py-12 bg-slate-50 rounded-2xl text-center text-xs text-slate-400 font-bold italic">
                Félicitations, toutes les alertes critiques ont été réglées ou résolues.
              </div>
            ) : (
              alertesFeed.map((al) => (
                <div key={al.id} className="p-5 bg-slate-50 rounded-[2rem] border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2.5 py-0.5 text-[8.5px] font-black uppercase rounded-lg border",
                        al.urgency === 'CRITIQUE' ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse" : "bg-slate-100 text-slate-600 border-slate-200"
                      )}>
                        ⚠️ {al.urgency}
                      </span>
                      <span className="text-[10px] text-slate-450 font-extrabold uppercase italic">{al.timestamp}</span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900">{al.employee}</h4>
                    <p className="text-xs text-slate-500 font-bold leading-relaxed max-w-2xl">{al.detail}</p>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    {al.type === 'DEROGATION_ATTENTE' ? (
                      <>
                        <button 
                          onClick={() => {
                            logAction('DEROGATION_REFUSEE', `Dérogation budgétaire de ${al.employee} rejetée par Marie KAPEND.`, 'WARNING');
                            setAlertesFeed(prev => prev.filter(a => a.id !== al.id));
                            triggerToast("Dérogation Rejetée", "Le refus a été notifié à la clinique.", "warning");
                          }}
                          className="px-3.5 py-2 hover:bg-rose-600 hover:text-white text-rose-600 bg-rose-50 font-black text-[10px] rounded-xl tracking-wider uppercase transition-colors"
                        >
                          Refuser
                        </button>
                        <button 
                          onClick={() => handleApproveDerogation(al)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded-xl tracking-wider uppercase transition-all shadow-md"
                        >
                          Approuver Accord (SLA {al.slaMinutesLeft}m)
                        </button>
                      </>
                    ) : al.type === 'HOSPITALISATION' ? (
                      <button 
                        onClick={() => {
                          logAction('CONTACT_CLINIQUE', `Marie KAPEND a émis un appel d'urgence au médecin conseil d'HJ Hospitals concernant Guy NKULU.`, 'INFO');
                          triggerToast("Appel d'urgence initialisé", "Liaison sécurisée Voix/IP avec le secrétariat administratif d'HJ Hospitals...", "success");
                        }}
                        className="px-3.5 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-black text-[10px] rounded-xl tracking-wider uppercase flex items-center gap-1.5"
                      >
                        <PhoneCall className="w-3.5 h-3.5 font-black" /> Appeler Clinique
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 uppercase italic">Pris en charge</span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}


      {/* MOBILE MONEY DIRECT PAY MODAL (PROMPT 1 REQUIREMENTS) */}
      <AnimatePresence>
        {isMomoModalOpen && selectedCotisation && (
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMomoModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] border border-slate-100 w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-emerald-600 shrink-0" />
                  <h3 className="text-xs font-black text-slate-800 uppercase italic">Paiement Compensatoire Direct</h3>
                </div>
                <button onClick={() => setIsMomoModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer">
                  <X className="w-4 h-4 text-slate-450" />
                </button>
              </div>

              <form onSubmit={handleMomoSubmit} className="p-6 space-y-4">
                <p className="text-[11px] text-slate-400 italic">
                  Vous apurez la prime de <span className="font-extrabold text-slate-900">{selectedCotisation.primeDue} USD</span> pour l&apos;adhérent <span className="font-extrabold text-slate-900">{selectedCotisation.assureName}</span> via Mobile Money RDC. Son QR Code sera réactivé instantanément.
                </p>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Opérateur Mobile Money</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['M-Pesa', 'Airtel Money', 'Orange Money'].map((op) => (
                      <button
                        key={op}
                        type="button"
                        onClick={() => setMomoOperator(op as any)}
                        className={cn(
                          "py-2 py-1.5 border rounded-xl text-[10px] font-black uppercase transition-all",
                          momoOperator === op ? "bg-emerald-600 text-white border-transparent" : "bg-slate-50 text-slate-550 border-slate-200"
                        )}
                      >
                        {op}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Numéro de téléphone RDC (+243)</label>
                  <div className="flex relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+243</span>
                    <input 
                      type="text" 
                      value={momoPhone}
                      onChange={(e) => setMomoPhone(e.target.value)}
                      className="w-full pl-14 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold font-mono outline-none"
                      placeholder="812345678"
                      disabled={isProcessingMomo}
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-450 uppercase">Montant débité:</span>
                  <span className="text-emerald-600 font-extrabold">{selectedCotisation.primeDue} USD</span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <button 
                    type="button" 
                    onClick={() => setIsMomoModalOpen(false)}
                    className="flex-1 py-3 text-slate-450 hover:bg-slate-50 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center cursor-pointer border border-transparent"
                    disabled={isProcessingMomo}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider text-center rounded-xl cursor-pointer shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5"
                    disabled={isProcessingMomo}
                  >
                    {isProcessingMomo ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Push SMS...
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Confirmer Pay.
                      </>
                    )}
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
