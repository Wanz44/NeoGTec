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
  MapPin, Clock, ExternalLink, RefreshCw, ChevronRight, CreditCard,
  Plus, Trash2, Ban, UserCheck, Briefcase, TrendingUp, HelpCircle,
  UserPlus
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar } from 'recharts';
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

interface Employee {
  id: string;
  name: string;
  grade: 'Directeur' | 'Manager' | 'Opérateur' | 'Technicien';
  department: string;
  status: 'ACTIF' | 'SUSPENDU';
  joinedDate: string;
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

  // --- Enrollment Form State ---
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpGrade, setNewEmpGrade] = useState<'Directeur' | 'Manager' | 'Opérateur' | 'Technicien'>('Opérateur');
  const [newEmpDept, setNewEmpDept] = useState('Production');

  const [activeTab, setActiveTab] = useState<'kpis' | 'members' | 'alertes' | 'cotisations' | 'contract'>('kpis');

  // Initial State: Prompt 1 - Cotisations Marie KAPEND Table
  const [cotisations, setCotisations] = useState<CotisationRow[]>([
    { id: 'COT-001', assureName: 'Lucien BANZA', grade: 'Directeur', primeDue: 150, montantPaye: 150, retardJours: 0, statutPaiement: 'PAYE', statutQR: 'ACTIF' },
    { id: 'COT-002', assureName: 'Jean PATIENT MUKENDI', grade: 'Manager', primeDue: 120, montantPaye: 0, retardJours: 19, statutPaiement: 'IMPAYE', statutQR: 'SUSPENDU' }, // Retard J+15 and IMPAYE -> SUSPENDU
    { id: 'COT-003', assureName: 'Therese KABEDI', grade: 'Technicien', primeDue: 90, montantPaye: 45, retardJours: 8, statutPaiement: 'PARTIEL', statutQR: 'ACTIF' },
    { id: 'COT-004', assureName: 'Guy NKULU', grade: 'Opérateur', primeDue: 90, montantPaye: 0, retardJours: 18, statutPaiement: 'IMPAYE', statutQR: 'SUSPENDU' }, // Retard J+15 -> SUSPENDU
    { id: 'COT-005', assureName: 'Rebecca MONZANGO', grade: 'Manager', primeDue: 120, montantPaye: 120, retardJours: 0, statutPaiement: 'PAYE', statutQR: 'ACTIF' },
    { id: 'COT-006', assureName: 'Alain KANIKI', grade: 'Opérateur', primeDue: 95, montantPaye: 0, retardJours: 5, statutPaiement: 'IMPAYE', statutQR: 'ACTIF' },
  ]);

  // Employees List state (Effectifs)
  const [employees, setEmployees] = useState<Employee[]>([
    { id: 'EMP-001', name: 'Lucien BANZA', grade: 'Directeur', department: 'Direction', status: 'ACTIF', joinedDate: '2024-01-15' },
    { id: 'EMP-002', name: 'Jean PATIENT MUKENDI', grade: 'Manager', department: 'Operations', status: 'SUSPENDU', joinedDate: '2024-02-10' },
    { id: 'EMP-003', name: 'Therese KABEDI', grade: 'Technicien', department: 'Technique', status: 'ACTIF', joinedDate: '2024-03-01' },
    { id: 'EMP-004', name: 'Guy NKULU', grade: 'Opérateur', department: 'Production', status: 'SUSPENDU', joinedDate: '2024-01-20' },
    { id: 'EMP-005', name: 'Rebecca MONZANGO', grade: 'Manager', department: 'Ressources Humaines', status: 'ACTIF', joinedDate: '2024-02-18' },
    { id: 'EMP-006', name: 'Alain KANIKI', grade: 'Opérateur', department: 'Production', status: 'ACTIF', joinedDate: '2024-04-05' },
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
      slaMinutesLeft: 75
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
    
    setTimeout(() => {
      setIsProcessingMomo(false);
      setIsMomoModalOpen(false);

      // Status update for both cotisations and employees
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

      setEmployees(prev => prev.map(emp => {
        if (emp.name.toLowerCase() === selectedCotisation.assureName.toLowerCase()) {
          return {
            ...emp,
            status: 'ACTIF'
          };
        }
        return emp;
      }));

      logAction(
        'MOBILE_MONEY_COMPENSATION', 
        `Paiement compensé de ${selectedCotisation.primeDue - selectedCotisation.montantPaye} USD par Mobile Money (${momoOperator} : ${momoPhone}) pour l'affilié ${selectedCotisation.assureName}. Son QR Code a été réactivé immédiatement.`,
        'SUCCESS'
      );
      
      triggerToast(
        "Paiement Compensé !",
        `La couverture médicale de ${selectedCotisation.assureName} est rétablie. Le pass QR Code est repassé au vert immédiatement.`,
        "success"
      );
    }, 2000);
  };

  const handleApproveDerogation = (al: AlerteCritique) => {
    logAction('DEROGATION_APPROUVEE', `Marie KAPEND a signé l'accord de dérogation budgétaire de 650 USD pour ${al.employee} (SLA restante: ${al.slaMinutesLeft} min).`, 'SUCCESS');
    setAlertesFeed(prev => prev.filter(a => a.id !== al.id));
    triggerToast(
      "Dérogation Approuvée",
      `Accord financier transmis en direct à l'Hôpital Ngaliema. Le patient "${al.employee}" peut recevoir ses soins.`,
      "success"
    );
  };

  const handleEnrollEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName.trim()) return;

    const newEmpId = `EMP-00${employees.length + 1}`;
    const newEmployee: Employee = {
      id: newEmpId,
      name: newEmpName.trim(),
      grade: newEmpGrade,
      department: newEmpDept,
      status: 'ACTIF',
      joinedDate: new Date().toISOString().split('T')[0]
    };

    // Add to employees list
    setEmployees(prev => [newEmployee, ...prev]);

    // Add to cotisations list too
    const newCotisation: CotisationRow = {
      id: `COT-00${cotisations.length + 1}`,
      assureName: newEmpName.trim(),
      grade: newEmpGrade,
      primeDue: newEmpGrade === 'Directeur' ? 150 : newEmpGrade === 'Manager' ? 120 : 90,
      montantPaye: 0,
      retardJours: 0,
      statutPaiement: 'IMPAYE',
      statutQR: 'ACTIF'
    };
    setCotisations(prev => [newCotisation, ...prev]);

    logAction('INSCRIPTION_EMPLOYE_MUTUELLE', `Le collaborateur ${newEmpName} (${newEmpGrade} - ${newEmpDept}) a été inscrit avec succès à la couverture d'assurance médicale collective.`, 'SUCCESS');
    triggerToast(
      "Inscription Réussie",
      `Le collaborateur "${newEmpName}" est désormais affilié à la mutuelle de l'entreprise.`,
      "success"
    );

    // Reset inputs
    setNewEmpName('');
  };

  const handleRemoveEmployee = (id: string, name: string) => {
    if (confirm(`Êtes-vous sûr de vouloir désinscrire "${name}" de la couverture médicale ?`)) {
      setEmployees(prev => prev.filter(e => e.id !== id));
      setCotisations(prev => prev.filter(c => c.assureName.toLowerCase() !== name.toLowerCase()));

      logAction('RETRAIT_MUTUELLE_EMPLOYE', `Marie KAPEND a révoqué la couverture médicale collective de l'employé ${name}.`, 'WARNING');
      triggerToast(
        "Couverture médicale révoquée",
        `L'employé "${name}" a été retiré de la couverture médicale de l'entreprise.`,
        "warning"
      );
    }
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
    }, 30000);

    return () => clearInterval(handler);
  }, [logAction]);

  const unpaidCount = cotisations.filter(c => c.statutPaiement === 'IMPAYE').length;
  const totalArrears = cotisations.reduce((acc, c) => acc + (c.primeDue - c.montantPaye), 0);

  // Recharts mock consumption data
  const consumptionTrendData = [
    { month: 'Jan', budget: 3200, claims: 2100 },
    { month: 'Fév', budget: 4120, claims: 2850 },
    { month: 'Mar', budget: 4120, claims: 3400 },
    { month: 'Avr', budget: 4120, claims: 3950 },
    { month: 'Mai', budget: 4120, claims: 3200 },
  ];

  // Recharts claims by department data
  const claimsByDeptData = [
    { name: 'Operations', montant: 6800 },
    { name: 'Production', montant: 3900 },
    { name: 'Technique', montant: 3250 },
    { name: 'Direction', montant: 4500 },
  ];

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
            <div className={cn(
              "p-2 rounded-xl text-white shrink-0",
              toastMsg.type === 'success' ? "bg-green-500" : "bg-rose-500"
            )}>
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-green-400">{toastMsg.title}</p>
              <p className="text-xs text-slate-300 font-bold mt-1 leading-relaxed">{toastMsg.desc}</p>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-slate-550 hover:text-white transition-colors p-1">
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
            <h1 id="rh-dashboard-title" className="text-2xl font-black mt-2 tracking-tight">Espace Entreprise &amp; RH — Marie KAPEND</h1>
            <p className="text-xs text-emerald-100 mt-1 font-bold">Gérez la mutuelle de vos collaborateurs, validez les demandes dérogatoires et pilotez les budgets médicaux.</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setActiveTab('cotisations')} 
              className="px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 text-[10px] font-black uppercase rounded-xl transition-all shadow-md outline-none"
            >
              Régler cotisations
            </button>
            <button 
              onClick={() => setActiveTab('alertes')} 
              className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-400 text-[10px] font-black uppercase rounded-xl transition-all shadow-md flex items-center gap-1 outline-none"
            >
              <Siren className="w-3.5 h-3.5" /> {alertesFeed.length} Alertes
            </button>
          </div>
        </div>
      </div>

      {/* Mini Tabs Bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
        {[
          { id: 'kpis', label: '📊 Tableau de Bord', count: null },
          { id: 'members', label: '👥 Effectifs & Membres', count: employees.length },
          { id: 'alertes', label: '🚨 Dérogations & Urgences', count: alertesFeed.length },
          { id: 'cotisations', label: '💰 Facturation & Paiements', count: unpaidCount },
          { id: 'contract', label: '🛡️ Suivi du Contrat', count: null }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as any)}
            className={cn(
              "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl transition-all flex items-center gap-2 outline-none",
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
            
            {/* Widget of unpaid */}
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

            <div 
              onClick={() => setActiveTab('members')}
              className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between hover:scale-[1.02] cursor-pointer transition-all group"
            >
              <div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase rounded-lg">Effectif de couverture</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">COLLABORATEURS ACME</p>
                <h4 className="text-xl font-black text-slate-900">{employees.length} Affiliés Actifs</h4>
              </div>
              <p className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest mt-6 group-hover:underline flex items-center gap-1.5">
                Gérer les membres <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('alertes')}
              className="p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm flex flex-col justify-between hover:scale-[1.02] cursor-pointer transition-all group"
            >
              <div>
                <span className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[8px] font-black uppercase rounded-lg">PEC Sollicitées</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">DÉROGATIONS EN COURS</p>
                <h4 className="text-xl font-black text-slate-900">{alertesFeed.filter(a => a.type === 'DEROGATION_ATTENTE').length} En attente</h4>
              </div>
              <p className="text-[9px] font-extrabold text-amber-600 uppercase tracking-widest mt-6 group-hover:underline flex items-center gap-1.5">
                Prendre une décision <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('contract')}
              className="p-6 bg-teal-50 border border-teal-100 rounded-[2rem] shadow-sm flex flex-col justify-between hover:scale-[1.02] cursor-pointer transition-all group"
            >
              <div>
                <span className="px-2.5 py-1 bg-teal-100 text-teal-700 text-[8px] font-black uppercase rounded-lg">Coût Mensuel Global</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-4">MOYENNE COTISATION</p>
                <h4 className="text-xl font-black text-teal-800">4,120 USD / mois</h4>
              </div>
              <p className="text-[9px] font-extrabold text-teal-600 uppercase tracking-widest mt-6 group-hover:underline flex items-center gap-1.5">
                Suivre la consommation <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Quick alert feed summaries for Marie */}
            <div className="lg:col-span-2 p-6 bg-white border border-slate-100 rounded-[2rem] shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Alertes Opérationnelles Récentes</h3>
                  <p className="text-[9px] font-black text-slate-400 uppercase italic">Fil d&apos;activité urgent ACME</p>
                </div>
                <button 
                  onClick={() => setActiveTab('alertes')}
                  className="text-[10px] font-black text-emerald-600 hover:underline uppercase flex items-center gap-1 outline-none"
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
                          al.type === 'DEROGATION_ATTENTE' ? "bg-amber-50 text-amber-600 border-amber-200 animate-pulse" : "bg-sky-50 text-sky-600 border-sky-200"
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
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9px] rounded-lg tracking-widest uppercase outline-none"
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
              <h3 className="text-sm font-black uppercase tracking-wide">Sécurité &amp; Audits Actifs</h3>
              <p className="text-xs text-slate-300 leading-relaxed font-bold">
                Conforme aux directives d&apos;assurance de la CNAM et de l&apos;ARCA RDC. Chaque relance, enrôlement et versement est numériquement certifié.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Chiffrement AES-256 actif
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Double Validation MFA exigée
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" /> Logs d&apos;audit RGPD immuables
                </div>
              </div>
            </div>

          </div>

          {/* Graphical Trends */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 border border-slate-100 rounded-[2rem] shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">Évolution des Cotisations vs Remboursements</h3>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={consumptionTrendData}>
                    <defs>
                      <linearGradient id="budgetGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="claimsGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} />
                    <Area type="monotone" name="Primes Versées" dataKey="budget" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#budgetGrad)" />
                    <Area type="monotone" name="Soins Consommés" dataKey="claims" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#claimsGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white p-6 border border-slate-100 rounded-[2rem] shadow-sm space-y-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-black text-slate-900 uppercase">Sinistralité par Département (USD)</h3>
              </div>
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={claimsByDeptData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                    <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.6 }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} />
                    <Bar dataKey="montant" name="Remboursements" fill="#059669" radius={[6, 6, 0, 0]} maxBarSize={32} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* EFFECTIFS & MEMBRES TAB (User management) */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Enrollment Form */}
            <div className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-[2rem] shadow-sm space-y-4 h-fit">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Enrôler un nouveau collaborateur</h3>
                <p className="text-xs text-slate-500 font-bold mt-1 leading-relaxed">
                  Ajoutez un nouvel employé au registre de l&apos;assurance médicale. Son affiliation sera immédiatement active.
                </p>
              </div>

              <form onSubmit={handleEnrollEmployee} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block font-bold">Nom Complet</label>
                  <input 
                    type="text" 
                    value={newEmpName}
                    onChange={(e) => setNewEmpName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    placeholder="Ex: Patient MUKENDI"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block font-bold">Catégorie / Grade</label>
                  <select 
                    value={newEmpGrade}
                    onChange={(e) => setNewEmpGrade(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="Directeur">Directeur</option>
                    <option value="Manager">Manager</option>
                    <option value="Technicien">Technicien</option>
                    <option value="Opérateur">Opérateur</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block font-bold">Département</label>
                  <select 
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold outline-none focus:border-emerald-600 cursor-pointer"
                  >
                    <option value="Direction">Direction</option>
                    <option value="Operations">Operations</option>
                    <option value="Technique">Technique</option>
                    <option value="Production">Production</option>
                    <option value="Ressources Humaines">Ressources Humaines</option>
                  </select>
                </div>

                <button 
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-md flex items-center justify-center gap-2 outline-none"
                >
                  <UserPlus className="w-4 h-4" /> Inscrire le collaborateur
                </button>
              </form>
            </div>

            {/* Employees List */}
            <div className="lg:col-span-2 p-6 bg-white border border-slate-150 rounded-[2rem] shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase">Registre des Collaborateurs affiliés</h3>
                <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
                  Liste exhaustive des membres d&apos;ACME couverts par la mutuelle de santé.
                </p>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left font-sans col-auto">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[9px] font-black uppercase tracking-widest text-slate-400">
                      <th className="py-4 px-6">Collaborateur</th>
                      <th className="py-4 px-6">Département</th>
                      <th className="py-4 px-6">Grade / Catégorie</th>
                      <th className="py-4 px-6 text-center">Date d&apos;entrée</th>
                      <th className="py-4 px-6 text-center">Statut</th>
                      <th className="py-4 px-6 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {employees.map((emp) => (
                      <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors font-bold text-slate-700">
                        <td className="py-4 px-6 text-slate-900 uppercase font-black flex items-center gap-2">
                          <div className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            emp.status === 'ACTIF' ? "bg-emerald-500" : "bg-rose-500"
                          )} />
                          {emp.name}
                        </td>
                        <td className="py-4 px-6 text-[11px] text-slate-500 font-bold">
                          {emp.department}
                        </td>
                        <td className="py-4 px-6 text-[11px] text-slate-500 font-bold">
                          {emp.grade}
                        </td>
                        <td className="py-4 px-6 text-center font-mono">
                          {emp.joinedDate}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={cn(
                            "px-2.5 py-1 text-[8.5px] font-black uppercase tracking-widest rounded-lg border",
                            emp.status === 'ACTIF' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-rose-600 text-white border-transparent"
                          )}>
                            {emp.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button 
                            onClick={() => handleRemoveEmployee(emp.id, emp.name)}
                            className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg transition-colors cursor-pointer outline-none"
                            title="Révoquer l'affiliation"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* SYSTEME DE DEROGATIONS TAB */}
      {activeTab === 'alertes' && (
        <div className="space-y-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase">Flux de Télémétrie &amp; Dérogations en Temps Réel</h3>
            <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
              Outil de surveillance des demandes d&apos;accord dérogatoire formulées par les cliniques conventionnées du réseau de soins tiers payant. Les dérogations sollicitées par les hôpitaux ont un SLA réglementaire d&apos;approbation de 2heures après quoi une remontée hiérarchique SMS s&apos;active.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pb-2">
            {[
              { label: 'Tous les flux', count: alertesFeed.length, active: true },
              { label: 'Plafonds Critiques', count: alertesFeed.filter(a => a.type === 'PLAFOND_CRITIQUE').length, active: false },
              { label: 'Hospitalisations', count: alertesFeed.filter(a => a.type === 'HOSPITALISATION').length, active: false },
              { label: 'Dérogations en attente', count: alertesFeed.filter(a => a.type === 'DEROGATION_ATTENTE').length, active: false }
            ].map((f, idx) => (
              <button key={idx} className={cn(
                "p-3 rounded-2xl border text-center font-black text-[11px] uppercase transition-all outline-none cursor-pointer",
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
                          className="px-3.5 py-2 hover:bg-rose-600 hover:text-white text-rose-600 bg-rose-50 font-black text-[10px] rounded-xl tracking-wider uppercase transition-colors outline-none cursor-pointer"
                        >
                          Refuser
                        </button>
                        <button 
                          onClick={() => handleApproveDerogation(al)}
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[10px] rounded-xl tracking-wider uppercase transition-all shadow-md outline-none cursor-pointer"
                        >
                          Approuver Accord (SLA {al.slaMinutesLeft}m)
                        </button>
                      </>
                    ) : al.type === 'HOSPITALISATION' ? (
                      <button 
                        onClick={() => {
                          logAction('CONTACT_CLINIQUE', `Marie KAPEND a émis un appel d'urgence au médecin conseil d'HJ Hospitals concernant Guy NKULU.`, 'SUCCESS');
                          triggerToast("Appel d'urgence initialisé", "Liaison sécurisée Voix/IP avec le secrétariat administratif d'HJ Hospitals...", "success");
                        }}
                        className="px-3.5 py-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-white font-black text-[10px] rounded-xl tracking-wider uppercase flex items-center gap-1.5 outline-none cursor-pointer"
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

      {/* COTISATIONS & FACTURATION TAB */}
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
                                className="px-2.5 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm outline-none"
                              >
                                <Mail className="w-3.5 h-3.5" /> Relancer
                              </button>
                              <button 
                                onClick={() => openPayForHim(row)}
                                className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm outline-none"
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

      {/* SUIVI DU CONTRAT TAB */}
      {activeTab === 'contract' && (
        <div className="space-y-6">
          
          <div className="p-6 bg-white border border-slate-150 rounded-[2rem] shadow-sm space-y-6">
            <div>
              <h3 className="text-sm font-black text-slate-900 uppercase">Tableau de consommation de la Police Collective</h3>
              <p className="text-xs text-slate-400 font-bold mt-1 leading-relaxed">
                Visualisez la répartition de la consommation budgétaire globale allouée par l&apos;entreprise pour l&apos;année contractuelle en cours.
              </p>
            </div>

            {/* Overall consumption gauge */}
            <div className="p-6 bg-slate-50 border border-slate-200 rounded-3xl space-y-3">
              <div className="flex items-center justify-between text-xs font-black uppercase">
                <span className="text-slate-500">Consommation Globale du Contrat</span>
                <span className="text-emerald-600">18,450 USD / 50,000 USD (36.9%)</span>
              </div>
              <div className="w-full h-4 bg-slate-200 rounded-full overflow-hidden">
                <div className="w-[36.9%] h-full bg-emerald-600" />
              </div>
              <p className="text-[10px] text-slate-450 font-bold italic">
                Période de validité : Du 01-01-2024 au 31-12-2024. Prochain renouvellement automatique le 01-01-2025.
              </p>
            </div>

            {/* Department Breakdown */}
            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Consommation par Département</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                <div className="p-4 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-850 uppercase">Operations</span>
                    <span className="text-slate-900 font-black">6,800 USD / 15,000 USD</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[45.3%] h-full bg-emerald-600" />
                  </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-850 uppercase">Direction</span>
                    <span className="text-slate-900 font-black">4,500 USD / 10,000 USD</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[45.0%] h-full bg-emerald-600" />
                  </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-850 uppercase">Production</span>
                    <span className="text-slate-900 font-black">3,900 USD / 15,000 USD</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[26.0%] h-full bg-emerald-600" />
                  </div>
                </div>

                <div className="p-4 border border-slate-100 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-slate-850 uppercase">Technique</span>
                    <span className="text-slate-900 font-black">3,250 USD / 10,000 USD</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="w-[32.5%] h-full bg-emerald-600" />
                  </div>
                </div>

              </div>
            </div>

            {/* Policy specifications list */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-black text-slate-900 uppercase tracking-wide">Clauses Contractuelles clés de la mutuelle</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <p className="font-black text-slate-900 uppercase text-[10px]">🏢 Taux de Couverture</p>
                  <p className="text-slate-500 font-bold leading-normal">Prise en charge directe par l&apos;assureur à hauteur de 80% sur l&apos;ensemble des actes prescrits.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <p className="font-black text-slate-900 uppercase text-[10px]">🏥 Réseau Conventionné</p>
                  <p className="text-slate-500 font-bold leading-normal">Accès direct sans avance de frais auprès de plus de 150 hôpitaux et cliniques partenaires de premier plan.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl space-y-1">
                  <p className="font-black text-slate-900 uppercase text-[10px]">🛡️ Plafond Individuel</p>
                  <p className="text-slate-500 font-bold leading-normal">Plafond annuel individuel fixé à 1,000 USD par affilié (extensible à 1,500 USD sur demande motivée).</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}


      {/* MOBILE MONEY DIRECT PAY MODAL */}
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
                <button onClick={() => setIsMomoModalOpen(false)} className="p-1 hover:bg-slate-100 rounded-lg cursor-pointer outline-none">
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
                          "py-2 py-1.5 border rounded-xl text-[10px] font-black uppercase transition-all outline-none cursor-pointer",
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
                    className="flex-1 py-3 text-slate-450 hover:bg-slate-50 rounded-xl font-bold text-[10px] uppercase tracking-wider text-center cursor-pointer border border-transparent outline-none"
                    disabled={isProcessingMomo}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[10px] uppercase tracking-wider text-center rounded-xl cursor-pointer shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5 outline-none"
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
