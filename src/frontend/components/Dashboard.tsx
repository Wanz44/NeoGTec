/**
 * 📄 Fichier : /src/frontend/components/Dashboard.tsx
 * 🎯 Objectif : Cockpit d'administration générale et pilotage pour la direction (AssurAdvance).
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../lib/AppContext';
import { EnterpriseRHDashboard } from './dashboards/EnterpriseRHDashboard';
import { DoctorDashboard } from './dashboards/DoctorDashboard';
import { MobileAssureApp } from './dashboards/MobileAssureApp';
import { HospitalAdminDashboard, PharmacistDashboard, PartnerFinanceDashboard, AuditorDashboard, SupportDashboard } from './dashboards/ExtendedPortals';
import { SaaSContractDashboard } from './dashboards/SaaSContractDashboard';
import { SuperAdminDashboard } from './super-admin/SuperAdminDashboard';
import { CeilingConsumptionChart } from './CeilingConsumptionChart';
import { 
  ArrowUpRight, ArrowDownRight, Activity, Filter, Plus, 
  MapPin, Clock, Calendar, CheckCircle2, AlertTriangle, 
  HelpCircle, RefreshCcw, BellRing, Users, Sparkles, Send, 
  X, Check, DollarSign, Wallet, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// Regional Data corresponding to filters
const REGIONAL_STATS: Record<string, {
  city: string;
  avgCost: string;
  hospitals: Array<{ name: string; avg: string; trend: string; status: 'up' | 'stable' | 'down' }>;
  alertDesc: string;
}> = {
  RDC: {
    city: 'Kinshasa',
    avgCost: '460 USD',
    hospitals: [
      { name: 'Clinique Ngaliema', avg: '320 USD', trend: '+12%', status: 'up' },
      { name: 'Hôpital HJ Hospitals', avg: '650 USD', trend: 'Stable', status: 'stable' },
      { name: 'Centre Médical de Kinshasa (CMK)', avg: '410 USD', trend: '-4%', status: 'down' },
    ],
    alertDesc: 'Alerte Paludisme saisonnier et hausse des actes de kinésithérapie non prescrits.',
  },
  France: {
    city: 'Paris',
    avgCost: '220 EUR',
    hospitals: [
      { name: 'Hôpital Américain de Paris', avg: '410 EUR', trend: '+5%', status: 'up' },
      { name: 'Pitié-Salpêtrière', avg: '180 EUR', trend: 'Stable', status: 'stable' },
      { name: 'Clinique Bizet', avg: '290 EUR', trend: '-2%', status: 'down' },
    ],
    alertDesc: 'Surveillance des téléconsultations excessives sur la région Île-de-France.',
  },
  UAE: {
    city: 'Dubai',
    avgCost: '850 AED',
    hospitals: [
      { name: 'Saudi German Hospital Dubai', avg: '1,200 AED', trend: '+14%', status: 'up' },
      { name: 'Medclinic City Hospital', avg: '950 AED', trend: 'Stable', status: 'stable' },
      { name: 'Aster Hospital Mankhool', avg: '680 AED', trend: '+1%', status: 'up' },
    ],
    alertDesc: 'Vérification de la facturation des clichés optiques et de la médecine alternative.',
  }
};

interface PreAuthRequest {
  id: string;
  patient: string;
  hospital: string;
  procedure: string;
  amount: string;
  urgency: 'critique' | 'normal' | 'modéré';
  remainingLimit: string;
}

export const Dashboard: React.FC = () => {
  const { currentUser } = useApp();

  // Route to the corresponding portal organically:
  if (currentUser?.role === 'RH_ENTREPRISE') {
    return <EnterpriseRHDashboard />;
  }
  if (currentUser?.role === 'MEDECIN') {
    return <DoctorDashboard />;
  }
  if (currentUser?.role === 'ASSURE') {
    return <MobileAssureApp />;
  }
  if (currentUser?.role === 'ADMIN_PRESTATAIRE') {
    return <HospitalAdminDashboard />;
  }
  if (currentUser?.role === 'PHARMACIEN') {
    return <PharmacistDashboard />;
  }
  if (currentUser?.role === 'FINANCE_MANAGER') {
    return <PartnerFinanceDashboard />;
  }
  if (currentUser?.role === 'AUDITEUR_EXTERNE') {
    return <AuditorDashboard />;
  }
  if (currentUser?.role === 'SUPPORT_NEOGTEC' || currentUser?.role === 'SUPPORT_CLIENT') {
    return <SupportDashboard />;
  }
  if (currentUser?.role === 'SUPER_ADMIN') {
    return <SuperAdminDashboard />;
  }

  // Safe Alert Helper to prevent iframe sandboxing errors on window.alert
  const safeAlert = (message: string) => {
    try {
      alert(message);
    } catch (e) {
      console.warn("[Alert Blocked by sandbox Context]:", message);
    }
  };

  // Global filters
  const [country, setCountry] = useState<'RDC' | 'France' | 'UAE'>('RDC');
  const [currency, setCurrency] = useState<'FC' | 'USD' | 'EUR' | 'AED'>('FC');
  const [period, setPeriod] = useState<'30j' | '90j' | '1an'>('30j');
  const [clientType, setClientType] = useState<'all' | 'enterprise' | 'individual'>('all');
  const [chartType, setChartType] = useState<'area' | 'bar' | 'line' | 'pie'>('area');

  // Modals & Sliders state
  const [activeMembersDrawerOpen, setActiveMembersDrawerOpen] = useState(false);
  const [relanceModalOpen, setRelanceModalOpen] = useState(false);
  const [preAuthModalOpen, setPreAuthModalOpen] = useState(false);
  const [regionalDrawerOpen, setRegionalDrawerOpen] = useState(false);
  const [conventionSuspended, setConventionSuspended] = useState(false);

  // Dynamic values depending on filters (example conversions for overdue metrics)
  const [overdueContribution, setOverdueContribution] = useState('42,300,000 FC');
  
  // Real-time toast state
  const [isToastVisible, setIsToastVisible] = useState(true);

  // Sync state on filters change for demonstration
  useEffect(() => {
    if (currency === 'FC') {
      setOverdueContribution('42,300,000 FC');
    } else if (currency === 'USD') {
      setOverdueContribution('16,920 USD');
    } else if (currency === 'EUR') {
      setOverdueContribution('15,400 EUR');
    } else {
      setOverdueContribution('62,100 AED');
    }
  }, [currency]);

  // Handle toast closure
  const handleCloseToast = () => setIsToastVisible(false);

  // Mock list of active insured members for Drawer A
  const mockInsuredMembers = [
    { name: 'Albert Tshimanga', company: 'Rawbank SARL', policy: 'POL-RDC-4421', dateIn: '25/05/2026', type: 'Conjoint', status: 'Actif' },
    { name: 'Marie-Pauline Kabanga', company: 'Vodacom RDC', policy: 'POL-RDC-9810', dateIn: '24/05/2026', type: 'Titulaire', status: 'Actif' },
    { name: 'Adonai Lutonadio', company: 'SNCF France', policy: 'POL-FR-3521', dateIn: '22/05/2026', type: 'Titulaire', status: 'Actif' },
    { name: 'Jean-Pierre Bemba', company: 'Bralima', policy: 'POL-RDC-1102', dateIn: '21/05/2026', type: 'Enfant', status: 'Actif' },
    { name: 'Sarah Al-Mansoori', company: 'Emirates Group', policy: 'POL-UAE-6720', dateIn: '20/05/2026', type: 'Titulaire', status: 'Actif' },
  ];

  // Mock list of pre-authorizations for pre-auth workflow
  const [preAuthList, setPreAuthList] = useState<PreAuthRequest[]>([
    { id: 'AUTH-2026-901', patient: 'Paul Kasenga', hospital: 'Clinique Ngaliema', procedure: 'IRM Cérébrale', amount: '1,200 USD', urgency: 'critique', remainingLimit: '8,800 USD / an' },
    { id: 'AUTH-2026-902', patient: 'Therese Mwamba', hospital: 'Hôpital HJ Hospitals', procedure: 'Accouchement Césarienne', amount: '2,500 USD', urgency: 'normal', remainingLimit: '3,100 USD / an' },
    { id: 'AUTH-2026-903', patient: 'Alain Ndongala', hospital: 'Centre Médical de Kinshasa', procedure: 'Chirurgie Orthopédique', amount: '4,100 USD', urgency: 'modéré', remainingLimit: '9,500 USD / an' },
    { id: 'AUTH-2026-904', patient: 'Chloe Dubois', hospital: 'Hôpital Américain', procedure: 'Prothèse Dentaire Complexe', amount: '1,800 EUR', urgency: 'normal', remainingLimit: '4,000 EUR / an' },
  ]);

  const handleApprovePreAuth = (id: string, name: string) => {
    setPreAuthList(prev => prev.filter(item => item.id !== id));
    safeAlert(`La demande de pré-autorisation pour ${name} a été approuvée avec succès. Notification débloquée au tiers payant.`);
  };

  const handleRejectPreAuth = (id: string, name: string) => {
    setPreAuthList(prev => prev.filter(item => item.id !== id));
    safeAlert(`La demande de pré-autorisation pour ${name} a été refusée. L'assuré et l'établissement ont été notifiés.`);
  };

  // Recharts activity graph data
  const activityData = [
    { name: 'Lun', consultations: country === 'RDC' ? 240 : 150, remboursements: 120 },
    { name: 'Mar', consultations: country === 'RDC' ? 380 : 210, remboursements: 180 },
    { name: 'Mer', consultations: country === 'RDC' ? 490 : 290, remboursements: 200 },
    { name: 'Jeu', consultations: country === 'RDC' ? 320 : 190, remboursements: 150 },
    { name: 'Ven', consultations: country === 'RDC' ? 510 : 310, remboursements: 280 },
    { name: 'Sam', consultations: country === 'RDC' ? 180 : 90, remboursements: 80 },
    { name: 'Dim', consultations: country === 'RDC' ? 120 : 60, remboursements: 50 },
  ];

  // Dynamic Pie Chart Data calculation
  const totalConsultations = activityData.reduce((sum, item) => sum + item.consultations, 0);
  const totalRemboursements = activityData.reduce((sum, item) => sum + item.remboursements, 0);
  const pieData = [
    { name: 'Consultations', value: totalConsultations, color: '#16a34a' },
    { name: 'Remboursements', value: totalRemboursements, color: '#818cf8' },
  ];

  return (
    <div className="space-y-8 relative text-slate-900 pb-16">
      
      {/* Synchronization Toast Message */}
      <AnimatePresence>
        {isToastVisible && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[200] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-emerald-500 rounded-xl text-white">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Canal Synchro Temps Réel</p>
              <p className="text-xs text-slate-300 font-medium mt-0.5">Données synchronisées à 08:45 GMT+1 • Latence système 14ms</p>
            </div>
            <button onClick={handleCloseToast} className="text-slate-400 hover:text-white transition-colors">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Section */}
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight italic flex items-center gap-3">
            Cockpit Direction Générale <Activity className="w-8 h-8 text-green-600 animate-pulse" />
          </h2>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mt-1">
            Indicateurs consolidés de santé de la plateforme et cost-control
          </p>
        </div>

        {/* Global interactive filters */}
        <div className="flex flex-wrap gap-2 items-center bg-slate-50 p-2 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            {/* Country Selector */}
            <select 
              value={country} 
              onChange={(e) => {
                const c = e.target.value as 'RDC' | 'France' | 'UAE';
                setCountry(c);
                if (c === 'RDC') setCurrency('FC');
                else if (c === 'France') setCurrency('EUR');
                else if (c === 'UAE') setCurrency('AED');
              }}
              className="bg-white border border-slate-200 text-xs font-black rounded-lg px-2.5 py-1.5 uppercase tracking-wider outline-none text-slate-800"
            >
              <option value="RDC">🇨🇩 RDC</option>
              <option value="France">🇫🇷 France</option>
              <option value="UAE">🇦🇪 UAE</option>
            </select>
          </div>

          {/* Currency Selector */}
          <select 
            value={currency} 
            onChange={(e) => setCurrency(e.target.value as any)}
            className="bg-white border border-slate-200 text-xs font-black rounded-lg px-2.5 py-1.5 uppercase tracking-wider outline-none text-slate-800"
          >
            <option value="FC">CDF (FC)</option>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="AED">AED (Dh)</option>
          </select>

          {/* Period Selector */}
          <select 
            value={period} 
            onChange={(e) => setPeriod(e.target.value as any)}
            className="bg-white border border-slate-200 text-xs font-black rounded-lg px-2.5 py-1.5 uppercase tracking-wider outline-none text-slate-800"
          >
            <option value="30j">30 Jours</option>
            <option value="90j">90 Jours</option>
            <option value="1an">1 An</option>
          </select>

          {/* Client Type Selector */}
          <select 
            value={clientType} 
            onChange={(e) => setClientType(e.target.value as any)}
            className="bg-white border border-slate-200 text-xs font-black rounded-lg px-2.5 py-1.5 uppercase tracking-wider outline-none text-slate-800"
          >
            <option value="all">Tous Clients</option>
            <option value="enterprise">Entreprises</option>
            <option value="individual">Individuel Libre</option>
          </select>
        </div>
      </header>

      {/* KPI Core Widgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1 - Assurés Actifs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assurés Actifs</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">152,340</h3>
              <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> +5.4%
              </span>
            </div>
            <p className="text-[10px] text-slate-400 italic">3,120 nouvelles polices cette semaine</p>
          </div>
          <button 
            onClick={() => setActiveMembersDrawerOpen(true)}
            className="mt-6 w-full py-2.5 bg-slate-50 hover:bg-slate-900 hover:text-white transition-all rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-800 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Users className="w-3.5 h-3.5" /> Voir détail
          </button>
        </motion.div>

        {/* KPI 2 - S/P Ratio (Loss/Premium Ratio) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="space-y-2 relative group">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ratio S/P Moyen</p>
              <div className="relative cursor-pointer">
                <HelpCircle className="w-4 h-4 text-slate-300 hover:text-slate-600 transition-colors" />
                <div className="absolute bottom-6 right-0 w-48 bg-slate-900 text-white text-[9px] font-bold p-2.5 rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity leading-relaxed shadow-xl z-50">
                  <span className="text-amber-400 font-extrabold uppercase">Alerte Seuil : &gt;85%</span>.<br />
                  Le ratio Sinistre/Cotisation mesure la rentabilité actuarielle globale.
                </div>
              </div>
            </div>
            
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">78%</h3>
              <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">Optimal</span>
            </div>

            {/* Color-coded visual threshold bar */}
            <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden flex">
              <div className="w-[70%] h-full bg-emerald-400" />
              <div className="w-[8%] h-full bg-amber-400" />
              <div className="w-[22%] h-full bg-slate-200" />
            </div>
            <p className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Seuil alerte: &gt;85%</p>
          </div>
          <div className="mt-4 pt-4 border-t border-slate-50 text-[10px] text-slate-400 italic font-medium flex items-center justify-between">
            <span>Trimestre en cours</span>
            <span className="text-emerald-600 font-black">Conforme (-2%)</span>
          </div>
        </motion.div>

        {/* KPI 3 - Cotisations en Retard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cotisations en Retard</p>
            <div className="flex items-baseline gap-1">
              <h3 className="text-2xl font-black text-rose-600 tracking-tight">{overdueContribution}</h3>
            </div>
            <p className="text-[10px] text-slate-400 italic">4 entreprises à relancer impérativement</p>
          </div>
          <button 
            onClick={() => setRelanceModalOpen(true)}
            className="mt-6 w-full py-2.5 bg-rose-50 hover:bg-rose-600 hover:text-white hover:border-transparent transition-all rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-600 border border-rose-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <BellRing className="w-3.5 h-3.5 animate-bounce" /> Lancer relances
          </button>
        </motion.div>

        {/* KPI 4 - Pré-autorisations */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white border border-slate-100 rounded-[2rem] p-6 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
        >
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pré-auto en Attente</p>
            <div className="flex items-baseline gap-2">
              <h3 className="text-3xl font-black text-amber-500 tracking-tight">89</h3>
              <span className="text-[9px] font-black bg-rose-50 text-rose-600 px-1.5 py-0.5 rounded-full uppercase">SLA critique</span>
            </div>
            <p className="text-[10px] text-slate-400 italic">Temps moyen de traitement: 18 min</p>
          </div>
          <button 
            onClick={() => setPreAuthModalOpen(true)}
            className="mt-6 w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white tracking-widest transition-all rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" /> Traiter les cas
          </button>
        </motion.div>

      </div>

      {/* Main Grid: Activity graph & Geographic hot zone */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Graph Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-2 bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm space-y-6"
        >
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-6 bg-green-600 rounded-full" />
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase italic">Activité d&apos;Hospitalisation &amp; Actes</h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Evolution hebdomadaire</p>
              </div>
            </div>

            {/* Interactive Switchers & Legends */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex bg-slate-150 p-1 rounded-xl border border-slate-200/60 gap-1 shrink-0">
                <button 
                  onClick={() => setChartType('area')}
                  className={`px-3 py-1.5 text-[9px] uppercase font-black tracking-widest transition-all rounded-lg cursor-pointer ${chartType === 'area' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  📈 Aire
                </button>
                <button 
                  onClick={() => setChartType('bar')}
                  className={`px-3 py-1.5 text-[9px] uppercase font-black tracking-widest transition-all rounded-lg cursor-pointer ${chartType === 'bar' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  📊 Barres
                </button>
                <button 
                  onClick={() => setChartType('line')}
                  className={`px-3 py-1.5 text-[9px] uppercase font-black tracking-widest transition-all rounded-lg cursor-pointer ${chartType === 'line' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  📉 Courbe
                </button>
                <button 
                  onClick={() => setChartType('pie')}
                  className={`px-3 py-1.5 text-[9px] uppercase font-black tracking-widest transition-all rounded-lg cursor-pointer ${chartType === 'pie' ? 'bg-white text-slate-950 shadow-sm font-black' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  🍕 Ratio
                </button>
              </div>

              <div className="hidden md:flex gap-4 text-[10px] font-black uppercase tracking-widest shrink-0">
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Consultations</span>
                <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-indigo-400" /> Remboursements</span>
              </div>
            </div>
          </div>

          <div className="h-[300px] w-full">
            {chartType === 'area' && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={activityData}>
                  <defs>
                    <linearGradient id="chartConsult" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="chartRemb" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} />
                  <Area type="monotone" name="Consultations" dataKey="consultations" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#chartConsult)" />
                  <Area type="monotone" name="Remboursements" dataKey="remboursements" stroke="#818cf8" strokeWidth={3} fillOpacity={1} fill="url(#chartRemb)" />
                </AreaChart>
              </ResponsiveContainer>
            )}

            {chartType === 'bar' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#f8fafc', opacity: 0.6 }} contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} />
                  <Bar dataKey="consultations" name="Consultations" fill="#16a34a" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="remboursements" name="Remboursements" fill="#818cf8" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}

            {chartType === 'line' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="consultations" name="Consultations" stroke="#16a34a" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 7 }} />
                  <Line type="monotone" dataKey="remboursements" name="Remboursements" stroke="#818cf8" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            )}

            {chartType === 'pie' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 'bold' }} />
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Heatmap Geographical Insights Card */}
        <div className="bg-white border border-slate-100 p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className="text-[12px] font-black text-slate-900 uppercase tracking-widest italic">Carte de Chaleur - Risques</h3>
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed italic">
              Indiquez et inspectez un hotspot de sinistralité pour identifier d&apos;éventuels pics épidémiques ou fraudes aux barèmes régionaux.
            </p>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                <span className="text-[11px] font-black uppercase text-slate-500">Ville active</span>
                <span className="text-xs font-black text-indigo-600 bg-white border border-slate-200 px-3 py-1 rounded-full">
                  {country === 'RDC' ? 'Kinshasa 🇨🇩' : country === 'France' ? 'Paris 🇫🇷' : 'Dubai 🇦🇪'}
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[11px] text-slate-600 font-bold">
                  <span>Densité sinistres</span>
                  <span className="text-rose-600">Forte</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className="w-[82%] h-full bg-rose-500 rounded-full" />
                </div>
              </div>

              <p className="text-[9px] font-bold text-slate-500 italic mt-2">
                💡 Clic ci-dessous sur l&apos;inspecteur régional pour analyser les cliniques conventionnées de la zone.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setRegionalDrawerOpen(true)}
            className="mt-6 w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-600/10"
          >
            Inspecter {country === 'RDC' ? 'Kinshasa' : country === 'France' ? 'Paris' : 'Dubai'}
          </button>
        </div>

      </div>

      {/* Real-time Ceiling Consumption Chart */}
      <CeilingConsumptionChart />

      {/* Critical Alert Feed */}
      <section className="bg-rose-50/40 border border-rose-100 p-8 rounded-[2.5rem] space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-600" />
            <div>
              <h4 className="text-base font-black text-rose-950 uppercase italic tracking-tight">Flux d&apos;alertes critiques consolidées</h4>
              <p className="text-[9px] font-bold text-rose-600 uppercase tracking-widest">Surveillance de fraude &amp; dépassements de plafonds en temps réel</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-rose-100 text-rose-700 text-[10px] font-black uppercase rounded-lg">1 ALERTE ACTIVE</span>
        </div>

        <div className="bg-white border border-rose-100 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
          <div className="space-y-1">
            <span className="px-2 py-0.5 bg-rose-50 text-rose-600 text-[8px] font-black uppercase rounded-full tracking-wider border border-rose-200">Pre-auth Violation</span>
            <p className="text-xs font-black text-rose-950 uppercase mt-1">Hôpital HJ Hospitals Kinshasa</p>
            <p className="text-xs text-slate-500 leading-relaxed italic">
              L&apos;établissement a dépassé le plafond mensuel de conventionnement autorisé de 50 000 USD (Consommé consolidé à ce jour: <span className="text-rose-600 font-bold">54,200 USD</span>).
            </p>
          </div>

          <div className="flex gap-2 shrink-0">
            {conventionSuspended ? (
              <span className="px-4 py-2.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-xl uppercase tracking-widest border border-amber-200">
                🔒 CONVENTION SUSPENDUE
              </span>
            ) : (
              <button 
                onClick={() => {
                  setConventionSuspended(true);
                  alert('La convention de l\'Hôpital HJ Hospitals a été suspendue temporairement de la plateforme de tiers payant.');
                }}
                className="px-4 py-2.5 bg-rose-600 text-white text-[10px] font-black rounded-xl uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/10 cursor-pointer"
              >
                Suspendre convention
              </button>
            )}
            <button 
              onClick={() => alert('Ignoré pour aujourd\'hui. L\'alerte de dépassement reste consignée pour le prochain audit tarifaire.')}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded-xl uppercase tracking-widest transition-colors cursor-pointer"
            >
              Ignorer j+1
            </button>
          </div>
        </div>
      </section>

      {/* DRAWERS & MODALS AT ROOT LEVEL */}

      {/* 1. MEMBERS DRAWER A */}
      <AnimatePresence>
        {activeMembersDrawerOpen && (
          <div className="fixed inset-0 z-[180] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveMembersDrawerOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Users className="w-6 h-6 text-indigo-600" />
                    <h3 className="text-lg font-black text-slate-900 uppercase italic">Fiche des Assurés Actifs</h3>
                  </div>
                  <button onClick={() => setActiveMembersDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-2">Dernières intégrations validées sur le réseau</p>
              </div>

              <div className="p-8 overflow-y-auto flex-1 space-y-4">
                {mockInsuredMembers.map((member) => (
                  <div key={member.name} className="p-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-2xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-black text-slate-950 leading-tight">{member.name}</p>
                        <p className="text-[9px] font-extrabold text-indigo-600 uppercase italic">{member.company}</p>
                      </div>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase rounded-full border border-emerald-100">
                        {member.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider border-t border-slate-200/50 pt-2">
                      <div>
                        <span>Type:</span> <span className="text-slate-800 font-black">{member.type}</span>
                      </div>
                      <div>
                        <span>Police:</span> <span className="text-slate-800 font-black">{member.policy}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setActiveMembersDrawerOpen(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Fermer l&apos;inspecteur
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. OVERDUE RECOVERY CONFIG MODAL B */}
      <AnimatePresence>
        {relanceModalOpen && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRelanceModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center border border-rose-100">
                    <BellRing className="w-5 h-5 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-rose-950 uppercase italic tracking-tight">Campagne de Relances Automatiques</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Suivi des cotisations impayées</p>
                  </div>
                </div>
                <button onClick={() => setRelanceModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed italic">
                  Vous êtes sur le point de lancer des rappels automatiques pour un montant global de <span className="font-bold text-rose-600">{overdueContribution}</span>.
                </p>

                <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Envoi instantané par Email &amp; SMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Configuration automatique de relance à J+5, J+15, J+30</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Application de la penalité de retard de <span className="text-rose-600">2.0%</span></span>
                  </div>
                </div>

                <div className="p-3 bg-rose-50 rounded-xl text-[10px] text-rose-900 border border-rose-100 italic">
                  🛡️ Cette étape est tracée selon les obligations légales régionales. Un rapport d&apos;envoi sera déposé dans le module Rapports Fiscaux.
                </div>
              </div>

              <div className="p-8 border-t border-slate-100 flex gap-3">
                <button 
                  onClick={() => setRelanceModalOpen(false)}
                  className="flex-1 py-4 border border-slate-200 text-slate-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    setRelanceModalOpen(false);
                    alert('La campagne de relances a été déclenchée. Les 4 entreprises ont été notifiées électroniquement.');
                  }}
                  className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-700 transition-colors shadow-lg cursor-pointer"
                >
                  Confirmer et Envoyer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. PRE-AUTHORIZATION QUEUE WORKFLOW MODAL C */}
      <AnimatePresence>
        {preAuthModalOpen && (
          <div className="fixed inset-0 z-[180] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPreAuthModalOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-white rounded-[2.5rem] w-full max-w-2xl overflow-hidden shadow-2xl border border-slate-100"
            >
              <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-200">
                    <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-1000 uppercase italic tracking-tight">File d&apos;attente de Pré-autorisation Médicale</h3>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-1">Cost-control avant saisie</p>
                  </div>
                </div>
                <button onClick={() => setPreAuthModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-8 max-h-[400px] overflow-y-auto space-y-4">
                {preAuthList.length === 0 ? (
                  <p className="text-center text-xs text-slate-400 italic py-10">Toutes les pré-autorisations ont été traitées ! Excellent travail de l&apos;équipe.</p>
                ) : (
                  preAuthList.map((req) => (
                    <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-black text-slate-900 leading-tight">{req.patient}</p>
                          <p className="text-[9px] font-extrabold text-slate-400 uppercase italic mt-0.5">{req.hospital}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-[8px] font-black uppercase rounded-full border ${
                          req.urgency === 'critique' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                          req.urgency === 'normal' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-slate-100 text-slate-600'
                        }`}>
                          🚨 {req.urgency}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-[9px] text-slate-500 font-bold uppercase tracking-wider border-t border-slate-200/50 pt-2.5">
                        <div>
                          <span>Acte / Traitement:</span> <p className="text-slate-900 font-extrabold text-xs tracking-tight">{req.procedure}</p>
                        </div>
                        <div className="text-right">
                          <span>Montant estimé:</span> <p className="text-indigo-600 font-black text-xs tracking-tight">{req.amount}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[9px] font-bold uppercase py-1.5 px-3 bg-slate-100/55 rounded-xl">
                        <span className="text-slate-400">Reste plafond annuel employeur:</span>
                        <span className="text-slate-800 font-black">{req.remainingLimit}</span>
                      </div>

                      <div className="flex gap-2 justify-end pt-2">
                        <button 
                          onClick={() => handleRejectPreAuth(req.id, req.patient)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer border border-rose-100"
                        >
                          Réfuser l&apos;Autorisation
                        </button>
                        <button 
                          onClick={() => handleApprovePreAuth(req.id, req.patient)}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                        >
                          Approuver IRM/Acte
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setPreAuthModalOpen(false)}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-colors cursor-pointer"
                >
                  Fermer la liste
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. REGIONAL INSIGHTS DRAWER D */}
      <AnimatePresence>
        {regionalDrawerOpen && (
          <div className="fixed inset-0 z-[180] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRegionalDrawerOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between"
            >
              <div className="p-8 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-6 h-6 text-indigo-600 animate-bounce" />
                    <h3 className="text-lg font-black text-slate-1000 uppercase italic">Inspecteur Régional: {REGIONAL_STATS[country]?.city}</h3>
                  </div>
                  <button onClick={() => setRegionalDrawerOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl cursor-pointer">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-2">Détail des coûts hospitaliers de la région sélectionnée</p>
              </div>

              <div className="p-8 overflow-y-auto flex-1 space-y-6">
                
                {/* Regional Costs summary */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl border border-white/5 space-y-1">
                  <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400">Coût moyen régional par consultation</span>
                  <p className="text-3xl font-black">{REGIONAL_STATS[country]?.avgCost}</p>
                  <p className="text-[9px] text-slate-400 italic">Comparé au budget moyen national prescrit (Conforme)</p>
                </div>

                {/* Top 3 clinics */}
                <div className="space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Top 3 établissements de soins de la région</p>
                  
                  {REGIONAL_STATS[country]?.hospitals.map((h, i) => (
                    <div key={h.name} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex justify-between items-center">
                      <div>
                        <p className="text-xs font-black text-slate-900 mb-0.5">{i+1}. {h.name}</p>
                        <span className="text-[9px] font-bold text-slate-400 uppercase block">Coût Moyen d&apos;entrée: {h.avg}</span>
                      </div>
                      <span className={`px-2 py-0.5 text-[8.5px] font-black uppercase tracking-tighter rounded-full ${
                        h.status === 'up' ? 'text-rose-600 bg-rose-50 border border-rose-200' :
                        h.status === 'down' ? 'text-emerald-600 bg-emerald-50 border border-emerald-200' : 'text-slate-600 bg-slate-100'
                      }`}>
                        {h.trend} {h.status === 'up' ? '↗' : h.status === 'down' ? '↘' : '→'}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Alerts / Risks */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Alerte Épidémique / Pratiques à risque</span>
                  </div>
                  <p className="text-xs text-amber-900/80 leading-relaxed italic font-medium">
                    {REGIONAL_STATS[country]?.alertDesc}
                  </p>
                </div>

              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-3">
                <button 
                  onClick={() => setRegionalDrawerOpen(false)}
                  className="w-full py-4 bg-slate-950 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 transition-colors cursor-pointer"
                >
                  Fermer l&apos;Inspecteur
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
