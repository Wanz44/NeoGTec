/**
 * 🎨 Fichier : /src/frontend/components/super-admin/SuperAdminDashboard.tsx
 * 🛠️ Stack : React 19, Recharts, Lucide Icons, Tailwind CSS, NeoGTec Design System
 * 📋 Description : Tableau de bord Super Admin d'administration de santé à haute fidélité.
 *                 Fidèle à l'image fournie (Blanc cassé #F8FAFC, vert émeraude #00A86B, anthracite #0F172A).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../lib/AppContext';
import { SidebarSuperAdmin } from './SidebarSuperAdmin';
import { 
  Card, Text, Metric, Title, Subtitle, Grid, 
  BadgeDelta, AreaChart, BarChart, DonutChart, LineChart, BarList 
} from './TremorComponents';
import { 
  Search, Calendar, Bell, Moon, Sparkles, ArrowRight,
  FolderOpen, Folder, ChevronRight, Check, CheckSquare, Square,
  Info, ChevronDown, CheckCircle, RefreshCw, X, FolderCheck, TrendingUp, AlertTriangle, Play,
  Shield, Lock, Network, Cpu, Sliders, Server, Database, Eye, Trash2
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Governance } from '../Governance';
import { Alerts } from '../Alerts';
import { Claims } from '../Claims';
import { Consumptions } from '../Consumptions';
import { Analytics } from '../Analytics';
import { Reclamation } from '../Reclamation';
import { Payment } from '../Payment';
import { CRM } from '../CRM';
import { Telemedicine } from '../Telemedicine';
import { BI } from '../BI';
import { Integrations } from '../Integrations';
import { Admin } from '../Admin';
import { UsersView } from '../Users';
import { Contracts } from '../Contracts';
import { Partners } from '../Partners';
import { Settings } from '../Settings';
import { SystemConfig } from '../SystemConfig';
import { Dashboard } from '../Dashboard';
import { NotificationCenter } from '../NotificationCenter';
import { 
  getActiveAssuresCount, getSinistraliteGlobale, getPecTraiteesCount,
  getTenantsList, TenantDetails 
} from '../../lib/supabase/admin-queries';
import {
  assuresData, pecData, siniData, connexionsData, pecTypeData,
  npsData, sourcesData, funnelData, coutPecData, ltvData, assuresMensuel
} from '@/src/data/mockAdmin';

const MOCK_ACTIVE_INSUREDS = [
  { name: 'Adonai Lutonadio', matricule: 'CD-NG-0001-S', email: 'adonailutonadio70@gmail.com', age: 28, plan: 'Gold Plus', company: 'NeoGTec SA', status: 'Actif', phone: '+243 812 345 678' },
  { name: 'Sabrina Wanzambi', matricule: 'CD-NG-9820-A', email: 'sabrina.w@acme.cd', age: 29, plan: 'Premium Policy', company: 'Acme Congo', status: 'Actif', phone: '+243 999 123 456' },
  { name: 'Jean-Pierre Patient', matricule: 'CD-NG-1029-C', email: 'jean.pierre@biac.cd', age: 34, plan: 'Standard Policy', company: 'BIAC RDC', status: 'Actif', phone: '+243 824 555 111' },
  { name: 'Sarah Mbongo', matricule: 'CD-NG-1122-M', email: 'sarah.mbongo@kpmg.cd', age: 31, plan: 'Base Care', company: 'KPMG RDC', status: 'Actif', phone: '+243 903 888 222' },
  { name: 'Glodi Mulamba', matricule: 'CD-NG-4029-M', email: 'glodi.m@rawbank.cd', age: 30, plan: 'Gold Plus', company: 'Rawbank', status: 'Actif', phone: '+243 813 000 999' },
  { name: 'Hortense Kasinga', matricule: 'CD-NG-8821-K', email: 'hortense.k@vodacom.cd', age: 25, plan: 'Base Care', company: 'Vodacom RDC', status: 'Actif', phone: '+243 811 777 555' },
  { name: 'Jean-Pierre Bemba', matricule: 'CD-NG-5522-P', email: 'jp.bemba@gouv.cd', age: 55, plan: 'VIP Platinum', company: 'Gouvernement RDC', status: 'Actif', phone: '+243 815 333 444' },
  { name: 'Chantal Lwamba', matricule: 'CD-NG-3120-L', email: 'chantal.l@sctp.cd', age: 42, plan: 'Premium Policy', company: 'SCTP SA', status: 'Actif', phone: '+243 821 444 666' },
  { name: 'Hugues Makanda', matricule: 'CD-NG-2294-M', email: 'hugues.m@bcdc.cd', age: 37, plan: 'Standard Policy', company: 'BCDC Equity', status: 'Actif', phone: '+243 998 555 333' }
];

interface SuperAdminDashboardProps {
  onLogout?: () => void;
}

export const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ onLogout }) => {
  const { currentUser, setActiveModule, logAction } = useApp();
  
  // 1. Navigation layout active tab status
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [godModeActive, setGodModeActive] = useState(true);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  
  // CMD+K global Search dialog status
  const [openSearchModal, setOpenSearchModal] = useState(false);
  
  // States for active insured files modal (Nombre des fiches d'assurés actifs)
  const [isActiveInsuredsModalOpen, setIsActiveInsuredsModalOpen] = useState(false);
  const [insuredSearch, setInsuredSearch] = useState('');
  const [insuredFilterPlan, setInsuredFilterPlan] = useState('ALL');

  const filteredInsureds = useMemo(() => {
    return MOCK_ACTIVE_INSUREDS.filter(ins => {
      const q = insuredSearch.toLowerCase();
      const matchQuery = ins.name.toLowerCase().includes(q) || 
                          ins.matricule.toLowerCase().includes(q) ||
                          ins.company.toLowerCase().includes(q) ||
                          ins.email.toLowerCase().includes(q);
      const matchPlan = insuredFilterPlan === 'ALL' || ins.plan === insuredFilterPlan;
      return matchQuery && matchPlan;
    });
  }, [insuredSearch, insuredFilterPlan]);
  
  // Dynamic metrics state with default high-fidelity standards
  const [activeAssures, setActiveAssures] = useState(201450);
  const [sinistralite, setSinistralite] = useState(68);
  const [pecTraitees, setPecTraitees] = useState(8450);
  const [tenants, setTenants] = useState<TenantDetails[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Table selections, filter toggles, page indicators
  const [selectedTenantIds, setSelectedTenantIds] = useState<Set<string>>(new Set());
  const [tableFilterStatus, setTableFilterStatus] = useState<string>('ALL');
  const [tablePage, setTablePage] = useState(1);
  const rowsPerPage = 5;

  // Selected Product nodes status
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'web': true,
    'portal': false,
    'apis': false
  });

  // Hot Reload live stats simulation
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const dbAssures = await getActiveAssuresCount();
      const dbSin = await getSinistraliteGlobale();
      const dbPec = await getPecTraiteesCount();
      const dbTenantList = await getTenantsList();

      setActiveAssures(dbAssures);
      setSinistralite(dbSin);
      setPecTraitees(dbPec);
      setTenants(dbTenantList);
    } catch (err) {
      console.error('Failed querying live db inputs, returning fallback records:', err);
    } finally {
      // Small simulated buffer to show refresh spinner
      setTimeout(() => {
        setIsLoading(false);
      }, 350);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Keyboard shortcut cmd+k
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpenSearchModal(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleExitAdmin = () => {
    if (setActiveModule) {
      setActiveModule('dashboard'); 
    }
  };

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || (currentUser?.role as any) === 'ADMINISTRATEUR';

  const toggleNode = (id: string) => {
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAll = () => {
    if (selectedTenantIds.size === filteredTenants.length) {
      setSelectedTenantIds(new Set());
    } else {
      setSelectedTenantIds(new Set(filteredTenants.map(t => t.id)));
    }
  };

  const toggleSelectRow = (id: string) => {
    const next = new Set(selectedTenantIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedTenantIds(next);
  };

  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.pays.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            t.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (tableFilterStatus === 'ACTIF') {
        return matchesSearch && t.status === 'ACTIF';
      }
      if (tableFilterStatus === 'SUSPENDU') {
        return matchesSearch && t.status === 'SUSPENDU';
      }
      return matchesSearch;
    });
  }, [tenants, searchQuery, tableFilterStatus]);

  const paginatedTenants = useMemo(() => {
    const start = (tablePage - 1) * rowsPerPage;
    return filteredTenants.slice(start, start + rowsPerPage);
  }, [filteredTenants, tablePage]);

  // Mini-sparkline renderer for table
  const renderSparkline = (points: number[]) => {
    if (!points || points.length === 0) return null;
    const maxVal = Math.max(...points, 1);
    const minVal = Math.min(...points);
    const spread = maxVal - minVal || 1;
    const width = 80;
    const height = 24;
    const coords = points.map((p, idx) => {
      const x = (idx / (points.length - 1)) * width;
      const y = height - 2 - ((p - minVal) / spread) * (height - 4);
      return `${x},${y}`;
    });
    return (
      <svg className="w-20 h-6 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
        <path 
          d={`M ${coords.join(' L ')}`} 
          fill="none" 
          stroke={points[points.length - 1] > 60 ? '#EF4444' : '#00A86B'} 
          strokeWidth="2" 
          strokeLinecap="round"
        />
      </svg>
    );
  };

  if (!isSuperAdmin) {
    return (
      <div className="fixed inset-0 bg-[#F8FAFC] z-50 flex items-center justify-center p-8 text-slate-800 font-sans">
        <div className="max-w-md text-center space-y-6 p-8 border border-slate-200 bg-white rounded-2xl relative shadow-lg">
          <div className="w-16 h-16 bg-red-55/10 border border-red-200 text-red-650 rounded-full flex items-center justify-center mx-auto mb-4 scale-105 animate-pulse">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider font-mono">Module Sécurité NeoGTec</h4>
            <p className="text-xs text-red-655 font-mono mt-1">SÉCURITÉ REQUISE : SUPER_ADMIN</p>
            <p className="text-xs text-slate-500 leading-relaxed mt-3">
              Votre rôle actuel <span className="font-mono text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">[{currentUser?.role || 'ASSURE'}]</span> n'autorise pas l'accès au routeur d'administration réseau.
            </p>
          </div>
          <div>
            <button
              onClick={handleExitAdmin}
              className="px-6 py-2.5 bg-[#00A86B] hover:bg-[#007D4C] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer w-full shadow-sm shadow-[#00A86B]/20"
            >
              Retourner à l'Espace Utilisateur
            </button>
            <p className="text-[10px] text-slate-400 font-mono mt-3">
              Indice : Changez votre profil vers (Paul Loko SuperAdmin) dans le sélecteur d'en haut.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-[#F8FAFC] text-slate-800 z-[100] flex font-sans select-none overflow-hidden">
      
      {/* 1. SIDEBAR NAVIGATION */}
      <SidebarSuperAdmin 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onExit={handleExitAdmin} 
        onLogout={onLogout}
        godModeActive={godModeActive}
      />

      {/* 2. DYNAMIC CONTENT WORKSPACE */}
      <div className="flex-1 ml-60 flex flex-col h-screen overflow-hidden bg-[#F8FAFC]">
        
        {/* HEADER TOOLBAR */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0 relative z-30 shadow-sm">
          
          {/* Breadcrumb path */}
          <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
            <span>Tableau de bord</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#00A86B] font-extrabold capitalize">
              {activeTab === 'dashboard' ? 'Général' : activeTab}
            </span>
          </div>

          {/* Right Header Toolbar controls */}
          <div className="flex items-center gap-3">
            
            {/* Search Input box */}
            <div 
              onClick={() => setOpenSearchModal(true)}
              className="relative w-64 bg-slate-50 border border-slate-200 hover:border-[#00A86B]/50 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs text-slate-400 cursor-pointer transition-all duration-200"
              title="Cliquez ou appuyez sur cmd+k pour démarrer une recherche"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-4 h-4 text-slate-400" />
                <span className="font-semibold">Rechercher...</span>
              </div>
              <span className="text-[9px] font-mono font-bold bg-white border border-slate-200 px-1.5 py-0.2 rounded text-slate-500 shadow-sm">
                ⌘K
              </span>
            </div>

            {/* DatePicker range mimicking screen widget par défaut */}
            <button className="flex items-center gap-2 px-3.5 py-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 rounded-lg text-xs font-bold text-slate-700 transition-colors cursor-pointer shadow-sm">
              <Calendar className="w-4 h-4 text-[#00A86B]" />
              <span>13 Jun, 26 - 20 Jun, 26</span>
            </button>

            {/* Notification trigger with Badge */}
            <button 
              onClick={() => setIsNotifOpen(true)}
              className="relative p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#00A86B] rounded-lg transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-red-500 text-white font-black text-[9px] rounded-full flex items-center justify-center border-2 border-white">
                3
              </span>
            </button>

            {/* Force theme indicator (Moon badge) */}
            <button className="p-2 border border-slate-200 bg-slate-50 text-[#00A86B] rounded-lg shadow-sm">
              <Moon className="w-4 h-4 fill-[#00A86B]/10" />
            </button>

            {/* Refresh live metrics */}
            <button 
              onClick={fetchDashboardData}
              className="p-2 border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-lg transition-colors cursor-pointer shadow-sm"
              title="Rafraîchir les statistiques live"
            >
              <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin")} />
            </button>

          </div>
        </header>

        {/* PRIMARY SCROLLABLE FRAMEWORK */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative p-6 space-y-6">
          
          {activeTab === 'dashboard' && (
            <>
              {/* CAPTAIN GREETINGS AND PILL BAR */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-black text-slate-900 tracking-tight">Bonsoir, Capitaine !</h1>
                  <p className="text-xs text-slate-450 font-bold uppercase tracking-wider">Voyez ce qui se passe en temps réel sur la plateforme de soins.</p>
                </div>

                {/* Micro KPI Pill Banner from screenshot */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00A86B] animate-pulse" />
                    <span className="font-bold text-slate-900">310</span>
                    <span className="text-slate-450 text-[11px]">accords créés</span>
                    <BadgeDelta deltaType="increase" className="text-[9px] px-1 bg-emerald-50 text-[#00A86B] ml-1">+4,3%</BadgeDelta>
                  </div>

                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-semibold text-slate-700 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span className="font-bold text-slate-900">26</span>
                    <span className="text-slate-450 text-[11px]">transactions conclues</span>
                    <BadgeDelta deltaType="decrease" className="text-[9px] px-1 bg-red-50 text-red-600 ml-1">-1,9%</BadgeDelta>
                  </div>
                </div>
              </div>

              {/* BENTO GRID: 6 KPI CARDS (LEFT BLOCK) VS TALL GRAPH BAR (RIGHT BLOCK) */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
                
                {/* 6 KPI COLUMNS (LEFT LAYOUT BLOCK SPANNED 8 OUT OF 12) */}
                <div className="xl:col-span-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    
                    {/* CARD 1: ASSURÉS ACTIFS */}
                    <Card className="hover:border-[#00A86B]/50 transition-all duration-300">
                      <Text className="font-bold uppercase tracking-wider text-[10px] text-slate-450">Assurés Actifs</Text>
                      <Metric>{(activeAssures / 1000).toFixed(0)}k</Metric>
                      <div className="flex items-center gap-1.5 mt-2">
                        <BadgeDelta deltaType="increase" className="bg-emerald-50 text-[#00A86B]">+2.5%</BadgeDelta>
                        <Text className="text-[10px] text-slate-400 font-bold uppercase">Connexions quotidiennes moyennes</Text>
                      </div>
                      <AreaChart 
                        data={assuresData} 
                        categories={["total"]} 
                        colors={["emerald"]} 
                        showYAxis={false} 
                        className="h-16 mt-4 opacity-90"
                      />
                    </Card>

                    {/* CARD 2: NOUVELLES PEC */}
                    <Card className="hover:border-[#00A86B]/50 transition-all duration-300">
                      <Text className="font-bold uppercase tracking-wider text-[10px] text-slate-450">Nouvelles PEC</Text>
                      <Metric>{pecTraitees.toLocaleString('fr-FR')}</Metric>
                      <div className="flex items-center gap-1.5 mt-2">
                        <BadgeDelta deltaType="increase" className="bg-emerald-50 text-[#00A86B]">+15%</BadgeDelta>
                        <Text className="text-[10px] text-slate-400 font-bold uppercase">Comptes ouverts ce mois-ci</Text>
                      </div>
                      <AreaChart 
                        data={pecData} 
                        categories={["total"]} 
                        colors={["teal"]} 
                        showYAxis={false} 
                        className="h-16 mt-4 opacity-90"
                      />
                    </Card>

                    {/* CARD 3: SINISTRALITÉ / TAUX DE RENOUVELLEMENT */}
                    <Card className="hover:border-[#00A86B]/50 transition-all duration-300">
                      <Text className="font-bold uppercase tracking-wider text-[10px] text-slate-450">Sinistralité</Text>
                      <Metric>{sinistralite}%</Metric>
                      <div className="flex items-center gap-1.5 mt-2">
                        <BadgeDelta deltaType="decrease" className="bg-red-50 text-red-600">-2%</BadgeDelta>
                        <Text className="text-[10px] text-slate-400 font-bold uppercase">Comptes Premium rattachés</Text>
                      </div>
                      <AreaChart 
                        data={siniData} 
                        categories={["total"]} 
                        colors={["red"]} 
                        showYAxis={false} 
                        className="h-16 mt-4 opacity-90"
                      />
                    </Card>

                    {/* CARD 4: INVENTAIRE */}
                    <Card className="hover:border-[#00A86B]/50 transition-all duration-300">
                      <Text className="font-bold uppercase tracking-wider text-[10px] text-slate-450">Inventaire hospitalier</Text>
                      <Metric>13 200</Metric>
                      <div className="flex items-center gap-1.5 mt-2">
                        <BadgeDelta deltaType="increase" className="bg-emerald-50 text-[#00A86B]">+35%</BadgeDelta>
                        <Text className="text-[10px] text-slate-400 font-bold uppercase">Unités médicales en stock</Text>
                      </div>
                      <AreaChart 
                        data={[
                          { date: "1", total: 10000 },
                          { date: "2", total: 11200 },
                          { date: "3", total: 12500 },
                          { date: "4", total: 13200 }
                        ]} 
                        categories={["total"]} 
                        colors={["emerald"]} 
                        showYAxis={false} 
                        className="h-16 mt-4"
                      />
                    </Card>

                    {/* CARD 5: LIVRÉ PEC */}
                    <Card className="hover:border-[#00A86B]/50 transition-all duration-300">
                      <Text className="font-bold uppercase tracking-wider text-[10px] text-slate-450">PEC payées &amp; livrées</Text>
                      <Metric>1 920</Metric>
                      <div className="flex items-center gap-1.5 mt-2">
                        <BadgeDelta deltaType="decrease" className="bg-red-50 text-red-600">-8%</BadgeDelta>
                        <Text className="text-[10px] text-slate-400 font-bold uppercase">Produits unitaires validés</Text>
                      </div>
                      <AreaChart 
                        data={[
                          { date: "1", total: 2400 },
                          { date: "2", total: 2100 },
                          { date: "3", total: 2000 },
                          { date: "4", total: 1920 }
                        ]} 
                        categories={["total"]} 
                        colors={["slate"]} 
                        showYAxis={false} 
                        className="h-16 mt-4"
                      />
                    </Card>

                    {/* CARD 6: ASSURÉS ACTIFS */}
                    <Card 
                      onClick={() => setIsActiveInsuredsModalOpen(true)}
                      className="hover:border-[#00A86B]/50 hover:shadow-md transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <Text className="font-bold uppercase tracking-wider text-[10px] text-slate-450">Fiches Assurés Actifs</Text>
                        <Metric className="text-[#00A86B] font-extrabold">201 450</Metric>
                      </div>
                      <div className="flex items-center gap-1.5 mt-2">
                        <BadgeDelta deltaType="moderateIncrease" className="bg-[#00A86B]/10 text-[#00A86B] font-bold">+14.2%</BadgeDelta>
                        <Text className="text-[10px] text-slate-400 font-bold uppercase">fiches actives sur le réseau</Text>
                      </div>
                      <div className="text-[10.5px] text-[#00A86B] font-bold mt-4 flex items-center gap-1">
                        <span>Voir la liste complète</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </Card>

                  </div>
                </div>

                {/* REVENUS GÉNÉRÉS / RECETTES COLLATÉRALES (RIGHT BLOCK SPANNED 4 OUT OF 12) */}
                <div className="xl:col-span-4 flex flex-col">
                  <Card className="flex-1 flex flex-col justify-between p-5">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-2">
                      <div>
                        <Title>Revenus &amp; Recettes</Title>
                        <Subtitle className="mt-0.5">Montant des recettes de ce mois-ci</Subtitle>
                      </div>
                      <span className="text-[9px] font-mono text-[#00A86B] bg-[#00A86B]/15 px-2 py-0.5 rounded-full font-bold uppercase">Live</span>
                    </div>

                    {/* Grouped Bar Chart of health receipts */}
                    <BarChart 
                      data={pecTypeData} 
                      categories={["Hôpital", "Pharmacie", "Labo"]} 
                      colors={["emerald", "teal", "slate"]} 
                      stack={true}
                      className="h-44 mt-4"
                    />

                    {/* Custom legends displaying specific billing ratios */}
                    <div className="flex items-center justify-around text-[10px] font-bold text-slate-500 pt-3 border-t border-slate-100 mt-2">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#00A86B]" />
                        <span>Hôpital (25e)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#14B8A6]" />
                        <span>Pharmacie (50e)</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#64748B]" />
                        <span>Labo (75e)</span>
                      </div>
                    </div>
                  </Card>
                </div>

              </div>

              {/* SECTION TIERS (3 COLUMNS SECONDARY ROW) */}
              <Grid numItemsLg={3} className="gap-5">
                
                {/* 1. COMMENTAIRES CLIENTS / NPS SATISFACTION */}
                <Card className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <Title>Commentaires des clients</Title>
                        <Subtitle className="mt-0.5">Nombre de clients ayant répondu</Subtitle>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 uppercase tracking-widest font-black">NPS Index</span>
                    </div>
                    {/* Recharts Custom NPS Representation showing trend lines */}
                    <div className="h-40 mt-4">
                      <BarList data={npsData} color="emerald" />
                    </div>
                  </div>
                  <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-450 font-bold uppercase">
                    <span>91,4% NPS Positif</span>
                    <span>2 545 Avis cumulés</span>
                  </div>
                </Card>

                {/* 2. SOURCES DE PROSPECTS / SOURCES PEC (Donut centered `'2 847'`) */}
                <Card className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between border-b border-slate-100 pb-2 mb-2">
                      <div>
                        <Title>Sources PEC</Title>
                        <Subtitle className="mt-0.5">Ratio de prospects générés</Subtitle>
                      </div>
                      <span className="text-[8px] font-mono text-[#00A86B] bg-[#00A86B]/10 py-0.5 px-2 rounded-full uppercase font-black">2026</span>
                    </div>

                    <DonutChart 
                      data={sourcesData.map(item => ({ name: item.name, value: item.total }))} 
                      category="value" 
                      index="name" 
                      colors={["emerald", "teal", "slate", "red"]} 
                      label="2 847" // Hardcoded display value from specification
                    />
                  </div>

                  {/* Legends for sources */}
                  <div className="grid grid-cols-2 gap-2 text-[10px] mt-4 pt-3 border-t border-slate-100 font-bold text-slate-500">
                    {sourcesData.map((item, idx) => {
                      const colorsOption = ["bg-[#00A86B]", "bg-[#14B8A6]", "bg-[#64748B]", "bg-[#EF4444]"];
                      return (
                        <div key={item.name} className="flex items-center gap-1.5">
                          <span className={cn("w-2 h-2 rounded-full", colorsOption[idx])} />
                          <span className="truncate">{item.name} ({Math.round(item.total / 28.47)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </Card>

                {/* 3. ENTONNOIR DE VENTALISATION / SOINS EN COURS */}
                <Card className="flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <Title>Entonnoir de Soins</Title>
                        <Subtitle className="mt-0.5">Crée et arbitré en un mois</Subtitle>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 uppercase">Conversion</span>
                    </div>

                    {/* Horizontal Visual metrics */}
                    <div className="space-y-2.5 mt-4">
                      {funnelData.map((stage) => {
                        const styleWidth = `${stage.value}%`;
                        return (
                          <div key={stage.name} className="space-y-1">
                            <div className="flex justify-between text-[10px] font-bold text-slate-650">
                              <span>{stage.name}</span>
                              <span>{stage.value}%</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-[#00A86B] to-[#14B8A6] rounded-full" 
                                style={{ width: styleWidth }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Table detail segment for Funnel from image specification */}
                  <div className="mt-4 pt-4 border-t border-slate-100">
                    <table className="w-full text-[9.5px] text-slate-550 font-bold border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider text-left">
                          <th className="pb-1">Étape (Scene)</th>
                          <th className="pb-1 text-center">Taux Perte</th>
                          <th className="pb-1 text-right">Ce mois-co</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        <tr>
                          <td className="py-1.5 font-bold text-slate-700">QR Scanné</td>
                          <td className="py-1.5 text-center font-mono">0,0%</td>
                          <td className="py-1.5 text-right font-mono text-[#00A86B]">+6,01%</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-slate-700">PEC Créée</td>
                          <td className="py-1.5 text-center font-mono">20,2%</td>
                          <td className="py-1.5 text-right font-mono text-[#00A86B]">+4,12%</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-slate-700">Validée</td>
                          <td className="py-1.5 text-center font-mono">15,1%</td>
                          <td className="py-1.5 text-right font-mono text-red-500">-3,91%</td>
                        </tr>
                        <tr>
                          <td className="py-1.5 font-bold text-slate-700">Payée J+1</td>
                          <td className="py-1.5 text-center font-mono">17,2%</td>
                          <td className="py-1.5 text-right font-mono text-red-550">-0,01%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>

              </Grid>

              {/* SECTION DOUBLE CHARTS: COÛT MOYEN PEC + ATTRIBUÉ/RÉEL (ROW 3) */}
              <Card>
                <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-2">
                  <div>
                    <Title>Évolution du Coût Moyen des PEC</Title>
                    <Subtitle className="mt-0.5">CAC présent par rapport à la semaine dernière (Attribué vs Consommé Réel)</Subtitle>
                  </div>
                  <div className="flex items-center gap-4 text-[10px] font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1.5 bg-[#00A86B] rounded" />
                      <span>Attribué ($)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3 h-1.5 bg-[#14B8A6] rounded" />
                      <span>Réel Consommé ($)</span>
                    </div>
                  </div>
                </div>

                <LineChart 
                  data={coutPecData} 
                  categories={["Attribué", "Réel"]} 
                  colors={["emerald", "teal"]} 
                  index="jour"
                  className="h-56 mt-4"
                />
              </Card>

              {/* COMBINED ROW 4: LTV TENANTS (2/3 WIDTH) VS MONTHLY PATIENTS FLUX (1/3 WIDTH) */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                
                {/* LTV TENANTS */}
                <div className="lg:col-span-2">
                  <Card className="h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-2">
                      <div>
                        <Title>Valeur stratégique cumulative (LTV du Tenant)</Title>
                        <Subtitle className="mt-0.5">Comparatif MRR, Churn et Taux de Sinistralité Historique</Subtitle>
                      </div>
                      <span className="text-[9px] font-mono text-[#00A86B] bg-[#00A86B]/10 px-2.5 py-1 rounded-full font-black uppercase">Consolidé</span>
                    </div>

                    <AreaChart 
                      data={ltvData} 
                      categories={["MRR", "Sinistralité"]} 
                      colors={["emerald", "red"]} 
                      index="mois"
                      showYAxis={true}
                      className="h-52 mt-4"
                    />
                  </Card>
                </div>

                {/* MONTHLY PATIENT ACTIVE FLUX */}
                <div>
                  <Card className="h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-2">
                      <div>
                        <Title>Utilisateurs Actifs Mensuels</Title>
                        <Subtitle className="mt-0.5">Catégories de produits et connexions</Subtitle>
                      </div>
                      <span className="text-[8px] font-mono text-slate-400 font-bold uppercase">Live index</span>
                    </div>

                    {/* Custom bar list metrics display */}
                    <BarChart 
                      data={assuresMensuel} 
                      categories={["RDC"]} 
                      colors={["teal"]} 
                      index="date" 
                      className="h-52 mt-4"
                    />

                    <span className="text-[9.5px] font-bold text-slate-450 uppercase text-center mt-3 block">
                      Reflète les 15 derniers jalons d'analyse
                    </span>
                  </Card>
                </div>

              </div>

              {/* DETAILED SPLIT ROW PANEL: TENANTS TABLE VS MODULES DIRECTORY TREE */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 pt-3">
                
                {/* 1. TABLE DETAILS (SPANNED 8 OUT OF 12) */}
                <div className="xl:col-span-8 flex flex-col">
                  <Card className="flex-1 flex flex-col p-5">
                    
                    {/* Header of table search and selector */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <Title>Détail des Clients / Régies</Title>
                        <Subtitle className="mt-0.5">Liaisons et ratios de conformité en temps réel des sous-traitements</Subtitle>
                      </div>
                      
                      {/* Interactive toggle switch status */}
                      <div className="flex items-center gap-1 p-1 bg-slate-50 border border-slate-200 rounded-lg">
                        <button 
                          onClick={() => { setTableFilterStatus('ALL'); setTablePage(1); }}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all duration-150 cursor-pointer",
                            tableFilterStatus === 'ALL' ? "bg-[#00A86B] text-white shadow" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          Tous
                        </button>
                        <button 
                          onClick={() => { setTableFilterStatus('ACTIF'); setTablePage(1); }}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all duration-150 cursor-pointer",
                            tableFilterStatus === 'ACTIF' ? "bg-emerald-50 text-[#00A86B] font-black" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          Actifs
                        </button>
                        <button 
                          onClick={() => { setTableFilterStatus('SUSPENDU'); setTablePage(1); }}
                          className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-black uppercase transition-all duration-150 cursor-pointer",
                            tableFilterStatus === 'SUSPENDU' ? "bg-red-50 text-red-655 font-black" : "text-slate-500 hover:text-slate-700"
                          )}
                        >
                          Suspendus
                        </button>
                      </div>
                    </div>

                    {/* Table Viewport */}
                    <div className="flex-1 overflow-x-auto custom-scrollbar">
                      <table className="w-full divide-y divide-slate-100 text-left text-xs text-slate-600 border-collapse">
                        <thead>
                          <tr className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-black">
                            <th className="pb-3 pl-3 w-8">
                              <button 
                                onClick={toggleSelectAll}
                                className="text-slate-400 hover:text-[#00A86B] transition-colors cursor-pointer"
                              >
                                {selectedTenantIds.size === filteredTenants.length && filteredTenants.length > 0 ? (
                                  <CheckSquare className="w-4.5 h-4.5 text-[#00A86B]" />
                                ) : (
                                  <Square className="w-4.5 h-4.5" />
                                )}
                              </button>
                            </th>
                            <th className="pb-3">Titre / Code</th>
                            <th className="pb-3 text-center">Statut</th>
                            <th className="pb-3 text-right">Assurés</th>
                            <th className="pb-3 text-right">Nb PEC</th>
                            <th className="pb-3 text-right">Coût Moyen</th>
                            <th className="pb-3 text-right">Délai Paiement</th>
                            <th className="pb-3 pr-3 text-center">Sinistralité</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {paginatedTenants.length === 0 ? (
                            <tr>
                              <td colSpan={8} className="py-8 text-center text-slate-400 font-mono font-bold text-xs">
                                Aucun locataire trouvé pour les filtres choisis.
                              </td>
                            </tr>
                          ) : (
                            paginatedTenants.map((item) => {
                              const isSelected = selectedTenantIds.has(item.id);
                              return (
                                <tr 
                                  key={item.id} 
                                  className={cn(
                                    "hover:bg-slate-50/75 transition-all duration-150 relative",
                                    isSelected && "bg-[#00A86B]/5"
                                  )}
                                >
                                  {/* Row Checkbox Select */}
                                  <td className="py-3 pl-3">
                                    <button 
                                      onClick={() => toggleSelectRow(item.id)}
                                      className="text-slate-400 hover:text-[#00A86B] cursor-pointer"
                                    >
                                      {isSelected ? (
                                        <CheckSquare className="w-4.5 h-4.5 text-[#00A86B]" />
                                      ) : (
                                        <Square className="w-4.5 h-4.5 text-slate-350" />
                                      )}
                                    </button>
                                  </td>
                                  
                                  {/* Title & metadata info */}
                                  <td className="py-3 font-sans">
                                    <div className="font-extrabold text-slate-800">{item.name}</div>
                                    <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5">
                                      <span className="bg-slate-100 px-1 rounded border border-slate-200 font-bold">
                                        {item.id}
                                      </span>
                                      <span>•</span>
                                      <span className="uppercase tracking-widest font-black">{item.pays}</span>
                                    </div>
                                  </td>

                                  {/* Live connection status indicator */}
                                  <td className="py-3 text-center">
                                    <span className={cn(
                                      "inline-flex items-center gap-1 text-[9px] font-black uppercase px-2 py-0.5 rounded-full border shadow-sm",
                                      item.status === 'ACTIF' 
                                        ? 'text-[#00A86B] bg-[#00A86B]/10 border-[#00A86B]/15' 
                                        : 'text-slate-500 bg-slate-100 border-slate-200'
                                    )}>
                                      <span className={cn("w-1.5 h-1.5 rounded-full", item.status === 'ACTIF' ? 'bg-[#00A86B] animate-pulse' : 'bg-slate-400')} />
                                      <span>{item.status === 'ACTIF' ? 'Actif' : 'Suspendu'}</span>
                                    </span>
                                  </td>

                                  {/* Table Metrics */}
                                  <td className="py-3 text-right font-bold font-mono text-slate-700">
                                    {item.assures.toLocaleString('fr-FR')}
                                  </td>
                                  <td className="py-3 text-right font-bold font-mono text-slate-700">
                                    {item.nbPec.toLocaleString('fr-FR')}
                                  </td>
                                  <td className="py-3 text-right font-bold font-mono text-slate-700">
                                    {item.coutMoyen} $
                                  </td>
                                  <td className="py-3 text-right font-bold font-mono text-[#00A86B]">
                                    {item.delaiPaiement} j
                                  </td>

                                  {/* Svg dynamic sparkline index spark area */}
                                  <td className="py-3 pr-3 text-center">
                                    <div className="flex flex-col items-center gap-0.5">
                                      {renderSparkline(item.sinistraliteSparkline)}
                                      <span className="text-[9px] font-mono font-black text-slate-500 mt-0.5">
                                        {item.sinistraliteSparkline ? `${item.sinistraliteSparkline[item.sinistraliteSparkline.length - 1]}%` : ''}
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>

                    {/* Table Footer with custom pagination indicator page control */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono font-bold uppercase">
                      <span>Affichage de {paginatedTenants.length} sur {filteredTenants.length} clients</span>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          disabled={tablePage === 1}
                          onClick={() => setTablePage(p => Math.max(1, p - 1))}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded shadow-sm text-slate-650 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          Précédent
                        </button>
                        <span>Page {tablePage} sur {Math.ceil(filteredTenants.length / rowsPerPage) || 1}</span>
                        <button 
                          disabled={tablePage >= Math.ceil(filteredTenants.length / rowsPerPage)}
                          onClick={() => setTablePage(p => p + 1)}
                          className="px-2.5 py-1 bg-white border border-slate-200 hover:bg-slate-50 rounded shadow-sm text-slate-650 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
                        >
                          Suivant
                        </button>
                      </div>
                    </div>

                  </Card>
                </div>

                {/* 2. DIRECTORIES MODULES INTERACTIVE ARCADIA TREE (SPANNED 4 OUT OF 12) */}
                <div className="xl:col-span-4 flex flex-col">
                  <Card className="h-full flex flex-col justify-between p-5">
                    <div>
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                        <FolderOpen className="w-4.5 h-4.5 text-[#00A86B]" />
                        <Title>Arbre de modules interactifs</Title>
                      </div>

                      <div className="space-y-2 font-mono text-xs">
                        
                        {/* Node segment 1: Portal Web */}
                        <div className="border border-slate-250/70 bg-slate-50/50 rounded-xl p-3">
                          <button 
                            onClick={() => toggleNode('web')}
                            className="w-full flex items-center justify-between font-bold text-slate-800 outline-none"
                          >
                            <div className="flex items-center gap-2">
                              <Folder className={cn("w-4.5 h-4.5 transition-colors", expandedNodes['web'] ? "text-[#00A86B]" : "text-slate-400")} />
                              <span>Site Public Web</span>
                            </div>
                            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", expandedNodes['web'] && "rotate-180")} />
                          </button>
                          
                          {expandedNodes['web'] && (
                            <div className="ml-4 mt-2.5 pl-2 border-l-2 border-slate-200/60 space-y-2 pt-1">
                              <div className="flex items-center justify-between text-slate-550 hover:text-slate-800 transition-colors">
                                <span>Maison (Dashboard)</span>
                                <span className="text-[8px] bg-emerald-50 text-[#00A86B] py-0.5 px-1.5 rounded border border-emerald-100 uppercase font-black">Actif</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-550 hover:text-slate-800 transition-colors">
                                <span>Plans Tarifs</span>
                                <span className="text-[8px] bg-emerald-50 text-[#00A86B] py-0.5 px-1.5 rounded border border-emerald-100 uppercase font-black">Actif</span>
                              </div>
                              <div className="flex items-center justify-between text-slate-550 hover:text-slate-800 transition-colors">
                                <span>Publications Blog</span>
                                <span className="text-[8px] bg-slate-100 text-slate-500 border border-slate-200 py-0.5 px-1.5 rounded uppercase font-black">Staging</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Node segment 2: Portals Area */}
                        <div className="border border-slate-250/70 bg-slate-50/50 rounded-xl p-3">
                          <button 
                            onClick={() => toggleNode('portal')}
                            className="w-full flex items-center justify-between font-bold text-slate-800 outline-none"
                          >
                            <div className="flex items-center gap-2">
                              <Folder className={cn("w-4.5 h-4.5 transition-colors", expandedNodes['portal'] ? "text-[#00A86B]" : "text-slate-400")} />
                              <span>Systèmes Portails</span>
                            </div>
                            <ChevronDown className={cn("w-3.5 h-3.5 text-slate-400 transition-transform duration-200", expandedNodes['portal'] && "rotate-180")} />
                          </button>
                          
                          {expandedNodes['portal'] && (
                            <div className="ml-4 mt-2.5 pl-2 border-l-2 border-slate-200/60 space-y-2 pt-1 text-slate-550">
                              <div className="flex justify-between items-center text-slate-550 hover:text-slate-800">
                                <span>Portail Prestataires</span>
                                <span className="text-[8px] bg-emerald-50 text-[#00A86B] py-0.5 px-1.5 rounded border border-emerald-100 uppercase font-black">Live</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-550 hover:text-slate-800">
                                <span>Portail Assurés</span>
                                <span className="text-[8px] bg-emerald-50 text-[#00A86B] py-0.5 px-1.5 rounded border border-emerald-100 uppercase font-black">Live</span>
                              </div>
                              <div className="flex justify-between items-center text-slate-550 hover:text-slate-800">
                                <span>Console RH Tenant</span>
                                <span className="text-[8px] bg-amber-50 text-amber-600 border border-amber-100 py-0.5 px-1.5 rounded uppercase font-black">Beta</span>
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-slate-100 mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center">
                      🔐 Accès restreint au cluster de secours
                    </div>
                  </Card>
                </div>

              </div>
            </>
          )}

          {/* ACTIVE FOURTH TAB CRON TASKS */}
          {activeTab === 'taches' && (
            <div className="space-y-6">
              <Card>
                <Title className="text-slate-850">Planificateur de tâches d'alignement</Title>
                <Text className="mt-1 font-medium text-slate-450">
                  Reconstitution, purges et audits de réparation des anomalies de sinistralité.
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  
                  <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-black uppercase text-slate-800">Purge caches Redis</h5>
                      <p className="text-[11px] text-slate-455 mt-1 leading-relaxed font-semibold">
                        Éliminer les feuilles de soins périmées du CDN régional de Kinshasa.
                      </p>
                    </div>
                    <button className="mt-4 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer">
                      Lancer (Tâche cron)
                    </button>
                  </div>

                  <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-black uppercase text-slate-800">Recalculer sinistralité</h5>
                      <p className="text-[11px] text-slate-455 mt-1 leading-relaxed font-semibold">
                        Réévaluation globale de l'index de sinistralité par rapport aux nouveaux remboursements collectés.
                      </p>
                    </div>
                    <button className="mt-4 px-3.5 py-2 bg-[#00A86B] hover:bg-[#007D4C] text-white rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer shadow-sm">
                      Exécuter maintenant
                    </button>
                  </div>

                  <div className="border border-slate-200 bg-slate-50/50 rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-black uppercase text-slate-800">Vérifier API passerelle ARCA</h5>
                      <p className="text-[11px] text-slate-455 mt-1 leading-relaxed font-semibold">
                        Contrôler la connectivité avec le serveur de l'autorité de régulation des assurances (ARCA).
                      </p>
                    </div>
                    <button className="mt-4 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 rounded-lg text-[10px] font-black uppercase transition-all cursor-pointer">
                      Tester ping
                    </button>
                  </div>

                </div>
              </Card>
            </div>
          )}

          {/* ACTIVE GOVERNANCE TAB */}
          {activeTab === 'governance' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-2.5 border-b border-slate-150 pb-4 mb-4">
                  <Shield className="w-5 h-5 text-[#00A86B]" />
                  <div>
                    <Title>Gouvernance &amp; Structures d'Entité</Title>
                    <Subtitle className="mt-0.5">Configuration légale multi-pays et plafonds d'assurance</Subtitle>
                  </div>
                </div>
                
                <Text className="text-slate-500 font-medium leading-relaxed">
                  Pilotez les règles de gouvernance globale du réseau, configurez les filiales géographiques (RDC, Congo-Brazzaville, Gabon) et établissez les limites budgétaires régulières par police d'assurance.
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                  <Card className="p-4 border border-slate-200">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">RDCongo (ARCA RDC)</Text>
                    <Metric className="mt-1">Stable</Metric>
                    <Text className="text-[11px] text-slate-500 font-medium mt-1">Conformité aux règles CNAM 2026. Audit de sinistralité ok.</Text>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[9px] bg-emerald-50 text-[#00A86B] font-bold px-2 py-0.5 rounded border border-emerald-100 uppercase">99.8% Compliant</span>
                    </div>
                  </Card>

                  <Card className="p-4 border border-slate-200">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">Congo-Brazzaville</Text>
                    <Metric className="mt-1">Vigilance</Metric>
                    <Text className="text-[11px] text-slate-500 font-medium mt-1">Nouveaux formulaires pré-autorisés en attente de visa ministériel.</Text>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[9px] bg-amber-50 text-amber-600 font-bold px-2 py-0.5 rounded border border-amber-100 uppercase">Visa en cours</span>
                    </div>
                  </Card>

                  <Card className="p-4 border border-slate-200">
                    <Text className="text-xs font-bold uppercase tracking-wider text-slate-400">Gabon (CIGS)</Text>
                    <Metric className="mt-1">Inactif</Metric>
                    <Text className="text-[11px] text-slate-500 font-medium mt-1">Extension prévue pour Q4 2026. Configuration DNS pilote.</Text>
                    <div className="mt-3 flex gap-2">
                      <span className="text-[9px] bg-slate-100 text-slate-500 font-bold px-2 py-0.5 rounded border border-slate-200 uppercase">Planifié</span>
                    </div>
                  </Card>
                </div>

                <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  <div className="p-4 border-b border-slate-200 bg-slate-55 text-xs font-bold uppercase text-slate-550 tracking-wider">
                    Registres de Politiques d'Entités Fédérées
                  </div>
                  <div className="divide-y divide-slate-150">
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Avenant 12B - Taux de remboursement majoré</div>
                        <div className="text-[11px] text-slate-450 font-semibold">S'applique par défaut aux agents Sodexo et Rawbank sur les urgences hospitalières.</div>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-[#00A86B] border border-emerald-100 font-bold px-2.5 py-1 rounded uppercase">Actif</span>
                    </div>
                    <div className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors">
                      <div>
                        <div className="font-bold text-slate-800 text-xs">Plafond Anti-Abus - Pharmacie Ambulatoire</div>
                        <div className="text-[11px] text-slate-450 font-semibold">Restreint les bons de délivrance de plus de 350 USD sans approbation préalable du médecin référent.</div>
                      </div>
                      <span className="text-[9px] bg-emerald-50 text-[#00A86B] border border-emerald-100 font-bold px-2.5 py-1 rounded uppercase">Actif</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ACTIVE INTEROPERABILITY TAB */}
          {activeTab === 'interop' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-2.5 border-b border-slate-150 pb-4 mb-4">
                  <Network className="w-5 h-5 text-[#00A86B]" />
                  <div>
                    <Title>Interopérabilité &amp; APIs Globales</Title>
                    <Subtitle className="mt-0.5">Surveillance des API de routage, SNIS &amp; Systèmes Partenaires</Subtitle>
                  </div>
                </div>

                <Text className="text-slate-500 font-medium leading-relaxed">
                  Vérifiez le trafic transactionnel en temps réel des passerelles d'intégration. Suivez les appels de l'API SNIS nationale et pilotez les Webhooks d'institutions privées.
                </Text>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                  <Card className="p-4 border border-slate-200">
                    <Text className="text-[10px] font-bold uppercase text-slate-450">Total API Calls</Text>
                    <Metric className="mt-1 font-mono">1.24M</Metric>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-1">99.99% Succès</span>
                  </Card>
                  
                  <Card className="p-4 border border-slate-200">
                    <Text className="text-[10px] font-bold uppercase text-slate-455">Latence Passerelle</Text>
                    <Metric className="mt-1 font-mono">124 ms</Metric>
                    <span className="text-[9px] text-[#00A86B] font-bold block mt-1">Nominal (Interne)</span>
                  </Card>

                  <Card className="p-4 border border-slate-200">
                    <Text className="text-[10px] font-bold uppercase text-slate-455">Webhooks Envoyés</Text>
                    <Metric className="mt-1 font-mono">312 K</Metric>
                    <span className="text-[9px] text-emerald-600 font-bold block mt-1">0 Erreurs de dispatch</span>
                  </Card>

                  <Card className="p-4 border border-slate-200">
                    <Text className="text-[10px] font-bold uppercase text-slate-455">Clés API Actives</Text>
                    <Metric className="mt-1 font-mono">24</Metric>
                    <span className="text-[9px] text-amber-500 font-bold block mt-1">2 en récurrence d'expiration</span>
                  </Card>
                </div>

                <div className="mt-6 border border-slate-200 rounded-xl bg-white p-5 space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Orchestrateur de Points de Terminaison API</h4>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 border border-slate-150 rounded-xl bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-[#00A86B]/15 text-[#00A86B] border border-[#00A86B]/30 rounded font-bold font-mono text-[9px] uppercase">GET</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 font-mono">/api/v1/coverage/verify</p>
                          <p className="text-[10px] text-slate-450 font-semibold font-sans mt-0.5">Vérification instantanée de la couverture d'un affilié par scanner QR Code.</p>
                        </div>
                      </div>
                      <button onClick={() => alert("Exécution du diagnostic GET : /verify - Status 200 nominal (0.01s)")} className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 text-[10px] font-bold rounded-lg uppercase transition-all cursor-pointer">
                        Simuler appel
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 border border-slate-150 rounded-xl bg-slate-50/50">
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-150 rounded font-bold font-mono text-[9px] uppercase">POST</span>
                        <div>
                          <p className="text-xs font-bold text-slate-800 font-mono">/api/v1/pec/initiate-token</p>
                          <p className="text-[10px] text-slate-450 font-semibold font-sans mt-0.5">Demander un ticket cryptographique de prise en charge (PEC) temporaire.</p>
                        </div>
                      </div>
                      <button onClick={() => alert("Exécution du diagnostic POST : /initiate-token - Status 201 créé. Token dispatché.")} className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-250 text-slate-700 text-[10px] font-bold rounded-lg uppercase transition-all cursor-pointer">
                        Simuler appel
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ACTIVE SECURITY AND AUDITING TAB */}
          {activeTab === 'securite' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-2.5 border-b border-slate-150 pb-4 mb-4">
                  <Lock className="w-5 h-5 text-[#00A86B]" />
                  <div>
                    <Title>Sécurité &amp; Journaux d'Audit (Identity Access)</Title>
                    <Subtitle className="mt-0.5">Supervision des jetons MFA, sessions actives et RLS database bypass</Subtitle>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">Contrôle RLS &amp; Bypass Administratif</h4>
                      <p className="text-[11px] text-slate-450 mt-1 leading-relaxed font-semibold">
                        L'activation du Bypass RLS permet aux super-administrateurs d'outrepasser les cloisons de sécurité régionales en cas de crise sanitaire majeure.
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">Statut du Bypass RLS :</span>
                      <button 
                        onClick={() => {
                          setGodModeActive(!godModeActive);
                          alert(`Bypass RLS d'administration générale réglé sur : ${!godModeActive ? 'ACTIVER (Risque critique d\'audit)' : 'DÉSACTIVER (Contrôles sélectifs standard)'}`);
                        }}
                        className={cn(
                          "px-4 py-2 text-[10px] font-black uppercase rounded-lg transition-all cursor-pointer",
                          godModeActive ? "bg-rose-600 text-white" : "bg-slate-100 text-slate-600 border border-slate-250"
                        )}
                      >
                        {godModeActive ? "BYPASS RLS ACTIF" : "RLS ACTIF PAR DEFAUT"}
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-2xl p-5 bg-white flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-black uppercase text-slate-800">Forcer le protocole MFA</h4>
                      <p className="text-[11px] text-slate-450 mt-1 leading-relaxed font-semibold">
                        Empêcher la connexion de l'équipe RH ou des prestataires hospitaliers s'ils n'ont pas validé l'authentification double-facteur (SMS Relais ou Google Authenticator).
                      </p>
                    </div>
                    <div className="mt-4 flex gap-4">
                      <button onClick={() => alert("Protocole double-facteur imposé avec succès à toutes les nouvelles sessions partenaires.")} className="px-4 py-2 bg-[#00A86B] hover:bg-[#007D4C] text-white text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all shadow-sm">
                        Forcer MFA pour tous
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-6 border border-slate-200 rounded-xl bg-white overflow-hidden">
                  <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <span>Journal d'Audit Central (Derniers Logs Réseau)</span>
                    <span className="text-[9px] font-mono text-[#00A86B] lowercase">24h active logs feed</span>
                  </div>
                  
                  <div className="divide-y divide-slate-150 font-mono text-xs">
                    <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded text-[10px]">SUCCESS</span>
                        <span className="text-slate-800 font-bold">AUTH_LOGIN</span>
                        <span className="text-slate-400 font-semibold">ADMIN Paul Loko (IP: 197.242.0.18, Gombe)</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">Il y a 2 min</span>
                    </div>

                    <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded text-[10px]">WARN</span>
                        <span className="text-slate-800 font-bold">ROLE_OVERRIDE</span>
                        <span className="text-slate-400 font-semibold">Rôle temporaire activé : MEDECIN pour Sarah (Gombe Hospital)</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">Il y a 14 min</span>
                    </div>

                    <div className="p-3.5 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-red-650 bg-red-50 font-bold px-1.5 py-0.5 rounded text-[10px]">DANGER</span>
                        <span className="text-slate-800 font-bold">API_RATE_LIMIT</span>
                        <span className="text-slate-400 font-semibold">Brute force suspecté de l'IP 103.45.21.90 sur /verify</span>
                      </div>
                      <span className="text-slate-400 text-[10px]">Il y a 1h 20m</span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ACTIVE DISASTER RECOVERY & ALERTS TAB */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between border-b border-slate-150 pb-4 mb-4">
                  <div className="flex items-center gap-2.5">
                    <AlertTriangle className="w-5 h-5 text-amber-505 animate-bounce" />
                    <div>
                      <Title>Surveillance Active &amp; Alertes Critiques</Title>
                      <Subtitle className="mt-0.5">Alerte préventive des goulets d'étranglement réseau et instabilité d'API</Subtitle>
                    </div>
                  </div>
                  
                  <button onClick={() => alert("Toutes les anomalies d'aujourd'hui ont été inspectées et marquées comme résolues par l'administrateur.")} className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-250 text-slate-700 text-[10px] font-black uppercase rounded-lg cursor-pointer transition-all">
                    Acquitter toutes les alertes
                  </button>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="p-4 border-l-4 border-amber-500 bg-amber-55/10 rounded-r-xl flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-black text-amber-850 uppercase">Latence excessive Passerelle Vodacom (M-Pesa)</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">Le démon d'écoute transactionnel M-Pesa de Kinshasa accuse un délai de routage de 2400ms (Fréquence d'erreur 2.5%).</p>
                    </div>
                    <span className="text-[8px] bg-amber-50 border border-amber-100 text-amber-600 font-black px-1.5 py-0.5 rounded uppercase">Moyen</span>
                  </div>

                  <div className="p-4 border-l-4 border-red-500 bg-red-55/10 rounded-r-xl flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-black text-red-850 uppercase">Dépassement de plafond de sinistralité mensuel - Sodexo</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">Les factures cumulées d'assurance de l'entité Sodexo ont dépassé de 12% les barèmes théoriques autorisés par ARCA.</p>
                    </div>
                    <span className="text-[8px] bg-red-50 border border-red-100 text-red-600 font-black px-1.5 py-0.5 rounded uppercase">Urgent</span>
                  </div>

                  <div className="p-4 border-l-4 border-emerald-500 bg-emerald-55/10 rounded-r-xl flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-black text-emerald-850 uppercase">Certificat de sécurité SSL principal renouvelé - DNS stable</h4>
                      <p className="text-[11px] text-slate-500 font-medium mt-1">Le DNS gpon.neogtec.cd a validé le renouvellement annuel automatique Let's Encrypt du certificat d'administration.</p>
                    </div>
                    <span className="text-[8px] bg-emerald-50 border border-emerald-100 text-emerald-600 font-black px-1.5 py-0.5 rounded uppercase">Infos</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ACTIVE SYSTEM PREFERENCES SETTINGS TAB */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-2.5 border-b border-slate-150 pb-4 mb-4">
                  <Sliders className="w-5 h-5 text-[#00A86B]" />
                  <div>
                    <Title>Paramètres d'Infrastructure NeoGTec</Title>
                    <Subtitle className="mt-0.5">Configuration système globale, caches CDN locaux, passerelles de messagerie</Subtitle>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-1 border-l-2 border-[#00A86B]">Base de Données &amp; Caching</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Délai persistance cache Redis (Maison &amp; Analytics)</label>
                        <select className="w-full text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none cursor-pointer">
                          <option value="300">5 Minutes (Standard requis)</option>
                          <option value="600">10 Minutes (Trafic modéré)</option>
                          <option value="1800">30 Minutes (Optimal)</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Rétention des logs transactionnels</label>
                        <select className="w-full text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none cursor-pointer">
                          <option value="30">30 Jours (Conforme RGPD / RDC)</option>
                          <option value="90">90 Jours</option>
                          <option value="365">1 An (Archivage long-terme)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 border border-slate-200 rounded-2xl bg-white space-y-3">
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest pl-1 border-l-2 border-[#00A86B]">Passerelle de Notification (SMS &amp; Email)</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Fournisseur SMS principal</label>
                        <select className="w-full text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg p-2.5 outline-none cursor-pointer">
                          <option value="orange">Orange RDC Gateway (Recommandé)</option>
                          <option value="vodacom">Vodacom SMS Server</option>
                          <option value="twilio">Twilio Cloud EMEA</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Mode Simulation (Sandbox de développement)</label>
                        <div className="flex items-center justify-between p-2 border border-slate-200 bg-slate-50 rounded-lg">
                          <span className="text-xs font-bold text-slate-500">Empêcher l'envoi de réels SMS :</span>
                          <button onClick={() => alert("Sandbox de test configurée : les alertes physiques ne factureront pas de crédits SMS.")} className="px-2.5 py-1.5 bg-[#00A86B]/10 border border-[#00A86B]/30 hover:bg-[#00A86B]/15 text-[#00A86B] text-[10px] font-bold rounded uppercase cursor-pointer">
                            Activée par défaut
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button onClick={() => alert("Tous les paramètres système du Super Admin ont été enregistrés et propagés aux micro-services de secours.")} className="px-6 py-3 bg-[#00A86B] hover:bg-[#007D4C] text-white rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md transition-all">
                      Sauvegarder les modifications système
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* 1. Tableau de bord */}

          {/* 2. Gestion Polices & Contrats */}
          {['contracts', 'contracts-config', 'contracts-offers', 'contracts-list', 'consumption-list', 'managers-list'].includes(activeTab) && (
            <Contracts subModule={activeTab} />
          )}

          {/* 3. Module Réclamation */}
          {['reclamation', 'reclamation-submit', 'reclamation-followup', 'reclamation-dashboard', 'reclamation-trace'].includes(activeTab) && (
            <Reclamation subModule={activeTab} />
          )}

          {/* 4. Gestion Financière & Facturation */}
          {['payment', 'billing-contributions', 'billing-mobile-money', 'billing-reconciliation', 'billing-tax'].includes(activeTab) && (
            <Payment subModule={activeTab} />
          )}

          {/* 5. CRM & Commercial */}
          {['crm', 'crm-marketing', 'crm-performance', 'crm-faq', 'crm-global-perf', 'crm-leads'].includes(activeTab) && (
            <CRM subModule={activeTab} />
          )}

          {/* 6. Téléconsultation */}
          {['telemedicine', 'tele-consultation', 'tele-medical-records', 'tele-prescription', 'tele-history'].includes(activeTab) && (
            <Telemedicine subModule={activeTab} />
          )}

          {/* 7. Sinistres & Contentieux */}
          {['claims', 'claims-declaration', 'claims-litigation', 'claims-workflow', 'claims-expertise', 'claims-preauth', 'claims-list'].includes(activeTab) && (
            <Claims subModule={activeTab} />
          )}

          {/* 8. Partenaires de Soins */}
          {['partners', 'partners-directory', 'partners-contracting', 'partners-portal', 'partners-quality', 'partners-tariffs'].includes(activeTab) && (
            <Partners subModule={activeTab} />
          )}

          {/* 9. Interopérabilité APIs & Intégrations */}
          {activeTab === 'integrations' && <Integrations />}

          {/* 10. Business Intelligence & BI */}
          {['bi', 'bi-global', 'bi-fraud', 'bi-performance', 'bi-forecasting'].includes(activeTab) && (
            <BI subModule={activeTab} />
          )}

          {/* 11. Paramètres Système */}
          {activeTab === 'system-config' && <SystemConfig />}

          {/* 12. Gouvernance Multi-Entités */}
          {activeTab === 'governance' && <Governance />}

          {/* 13. Alertes & Comm-Hub */}
          {activeTab === 'alerts' && <Alerts />}

          {/* 14. Administration Système */}
          {activeTab === 'admin' && <Admin />}

          {/* 15. Utilisateurs & Rôles */}
          {['users-mgmt', 'users-list', 'users-security', 'users-logs', 'users-digital', 'users-selfcare', 'users-card', 'users-beneficiaries'].includes(activeTab) && (
            <UsersView subModule={activeTab} />
          )}

        </div>

      </div>

      {/* 🔴 CMD+K SEARCH DIALOG MODAL (AESTHETIC LIGHT PORT) */}
      {openSearchModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white border border-slate-300 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative font-sans animate-in fade-in-50 zoom-in-95Duration-150">
            
            {/* Header of Search dialog */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-500 w-full">
                <Search className="w-5 h-5 text-[#00A86B] shrink-0" />
                <input 
                  type="text" 
                  autoFocus
                  placeholder="Saisir recherche (ex: Rawbank, Angola, Congo-Brazzaville, RDC, Sonangol etc.)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm font-bold text-slate-800 border-none outline-none focus:ring-0 w-full placeholder:text-slate-400"
                />
              </div>
              <button 
                onClick={() => setOpenSearchModal(false)}
                className="text-slate-400 hover:text-slate-700 shrink-0 p-1 bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results list */}
            <div className="p-2 max-h-68 overflow-y-auto custom-scrollbar font-mono text-xs">
              
              <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-[#00A86B] font-bold">
                Résultats Disponibles ({filteredTenants.length})
              </div>

              {filteredTenants.slice(0, 5).map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    setOpenSearchModal(false);
                    setSearchQuery(t.name);
                  }}
                  className="w-full flex items-center justify-between p-3 rounded-lg text-left text-slate-650 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-4 h-4 text-[#00A86B]/60" />
                    <div>
                      <div className="font-sans font-bold text-slate-850">{t.name}</div>
                      <div className="text-[9.5px] text-slate-400">{t.id} • {t.pays}</div>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[8.5px] px-2 py-0.5 rounded-full font-black border uppercase shadow-sm",
                    t.status === 'ACTIF' 
                      ? 'text-[#00A86B] bg-emerald-50 border-emerald-100' 
                      : 'text-slate-500 bg-slate-100 border-slate-200'
                  )}>
                    {t.status}
                  </span>
                </button>
              ))}

              {filteredTenants.length === 0 && (
                <div className="p-4 text-center text-slate-450 italic font-medium font-sans">
                  Aucun résultat ne répond au filtre actuel.
                </div>
              )}

            </div>

            {/* CMD+K Footer instructions guidelines */}
            <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-450 font-mono font-bold">
              <span>Appuyez sur <kbd className="bg-white border border-slate-200 px-1 py-0.2 rounded text-slate-500 shadow-sm">Échap</kbd> pour fermer</span>
              <span>Recherche globale NeoGTec SuperAdmin</span>
            </div>

          </div>
        </div>
      )}

      {/* Synchronized Live Notification Center Drawer */}
      <NotificationCenter 
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        onModuleChange={(mod) => {
          setActiveTab(mod);
          setIsNotifOpen(false);
          logAction('REDIRECTION_MODULE_NOTIF_ADMIN', `Navigation vers le module ${mod} depuis le centre d'alertes Super Admin.`, 'SUCCESS');
        }}
        logAction={logAction}
      />

      {/* Modal Active Insureds - Nombre des fiches d'assurés actifs */}
      {isActiveInsuredsModalOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-fade-in p-4">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-slate-100 relative">
            
            {/* Header section of the modal */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#00A86B]/15 text-[#00A86B] flex items-center justify-center font-black">
                  CIMA
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Registre des Fiches Assurés Actifs</h3>
                  <p className="text-xs text-slate-500">
                    Consultation temps réel des fiches assurées actives validées au standard CIMA / ARCA
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsActiveInsuredsModalOpen(false)}
                className="p-2 hover:bg-slate-200/50 rounded-full transition-all text-slate-450 hover:text-slate-800 outline-none cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters and search box */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-white text-xs">
              
              {/* Search input field */}
              <div className="relative w-full md:w-96">
                <span className="absolute left-3.5 top-2.5 text-slate-400">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  placeholder="Rechercher par nom, matricule, entreprise..."
                  value={insuredSearch}
                  onChange={(e) => setInsuredSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 focus:border-[#00A86B] focus:bg-white rounded-xl outline-none transition-all placeholder:text-slate-400 text-slate-800 font-medium"
                />
                {insuredSearch && (
                  <button 
                    onClick={() => setInsuredSearch('')}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 outline-none"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Select filters for premium plan styles */}
              <div className="flex items-center gap-2 w-full md:w-auto self-end md:self-auto justify-end">
                <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Filtrer Plan:</span>
                <select
                  value={insuredFilterPlan}
                  onChange={(e) => setInsuredFilterPlan(e.target.value)}
                  className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 focus:border-[#00A86B] rounded-xl outline-none font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <option value="ALL">Tous les plans tarifaires</option>
                  <option value="Gold Plus">Gold Plus</option>
                  <option value="Premium Policy">Premium Policy</option>
                  <option value="Standard Policy">Standard Policy</option>
                  <option value="Base Care">Base Care</option>
                  <option value="VIP Platinum">VIP Platinum</option>
                </select>
              </div>

            </div>

            {/* List of active insureds */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="overflow-hidden border border-slate-150 rounded-2xl">
                <table className="w-full text-left border-collapse bg-white">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-150 text-[10.5px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="px-5 py-3">Assuré / bénéficiaire</th>
                      <th className="px-5 py-3 font-mono">Matricule CIMA</th>
                      <th className="px-5 py-3">Société souscriptrice</th>
                      <th className="px-5 py-3">Plan tarifaire</th>
                      <th className="px-5 py-3">Statut</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredInsureds.map((ins, index) => (
                      <tr 
                        key={ins.matricule} 
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="font-bold text-slate-800">{ins.name}</div>
                          <div className="text-[10px] text-slate-450 font-medium">{ins.email} • {ins.phone}</div>
                        </td>
                        <td className="px-5 py-4 font-mono font-bold text-slate-600 text-[11px] uppercase">
                          {ins.matricule}
                        </td>
                        <td className="px-5 py-4 font-semibold text-slate-600">
                          {ins.company}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 text-slate-750 rounded-full font-bold text-[10px] uppercase border border-slate-200">
                            {ins.plan}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-150 rounded-full font-black text-[9px] uppercase">
                            <span className="w-1.5 h-1.5 bg-[#00A86B] rounded-full animate-pulse" />
                            {ins.status}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              alert(`Ouverture de la fiche médicale cryptée AES-256 de ${ins.name} au standard CIMA / ARCA.`);
                              logAction('AUDIT_FICHE_MEDICALE', `Fiche médicale consultée par le Super Admin pour l'assuré : ${ins.name} (${ins.matricule})`, 'WARNING');
                            }}
                            className="px-3 py-1.5 bg-[#00A86B]/10 hover:bg-[#00A86B] text-[#00A86B] hover:text-white rounded-lg transition-all font-bold text-[10.5px] cursor-pointer outline-none"
                          >
                            Dossier
                          </button>
                        </td>
                      </tr>
                    ))}

                    {filteredInsureds.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-5 py-10 text-center text-slate-400 italic">
                          Aucun assuré ne correspond à votre recherche ou plan sélectionné.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Footer containing record stats */}
            <div className="px-6 py-4.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <span>Affichage de {filteredInsureds.length} sur {MOCK_ACTIVE_INSUREDS.length} fiches synchronisées</span>
              <span className="text-[9.5px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                Synchronisé Blockchain &amp; Cloud RDC
              </span>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default SuperAdminDashboard;
