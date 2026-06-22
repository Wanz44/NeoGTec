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
  Info, ChevronDown, CheckCircle, RefreshCw, X, FolderCheck, TrendingUp, AlertTriangle, Play
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { 
  getActiveAssuresCount, getSinistraliteGlobale, getPecTraiteesCount,
  getTenantsList, TenantDetails 
} from '../../lib/supabase/admin-queries';
import {
  assuresData, pecData, siniData, connexionsData, pecTypeData,
  npsData, sourcesData, funnelData, coutPecData, ltvData, assuresMensuel
} from '@/src/data/mockAdmin';

export const SuperAdminDashboard: React.FC = () => {
  const { currentUser, setActiveModule } = useApp();
  
  // 1. Navigation layout active tab status
  const [activeTab, setActiveTab] = useState('maison');
  const [searchQuery, setSearchQuery] = useState('');
  
  // CMD+K global Search dialog status
  const [openSearchModal, setOpenSearchModal] = useState(false);
  
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

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMINISTRATEUR';

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
              {activeTab === 'maison' ? 'Maison' : activeTab}
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
            <button className="relative p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-[#00A86B] rounded-lg transition-all cursor-pointer shadow-sm active:scale-95">
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
          
          {activeTab === 'maison' && (
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

                    {/* CARD 6: COMPOSANT DASHED ACCORDION / AJOUT KPI */}
                    <div 
                      onClick={() => alert("Interface d'orchestration : ajouter un widget de performance à la console d'accueil.")}
                      className="border-2 border-dashed border-slate-300 hover:border-[#00A86B]/50 hover:bg-[#00A86B]/5 rounded-2xl p-5 flex flex-col justify-center items-center text-center cursor-pointer transition-all duration-300 h-full min-h-[175px]"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-white mb-2">
                        <Sparkles className="w-5 h-5 text-[#00A86B] animate-pulse" />
                      </div>
                      <span className="text-xs font-bold text-slate-600 uppercase tracking-widest max-w-[150px]">
                        + Ajouter un nouvel indicateur KPI
                      </span>
                    </div>

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
                      data={sourcesData} 
                      category="total" 
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

          {/* ACTIVE ANALYTICAL SECOND TAB */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                  <FolderCheck className="w-5 h-5 text-[#00A86B]" />
                  <Title className="text-slate-850">Analytique Opérationnelle &amp; Taux de Fraude</Title>
                </div>
                <Text className="text-slate-500 font-medium leading-relaxed">
                  Cette console permet d'étudier l'efficacité opérationnelle des flux de remboursement, de tracer la latence des services de routage d'ordonnances vers les assurances nationales, et de limiter le taux de fraude constaté sur les feuilles de soins.
                </Text>
                
                <div className="relative w-full h-80 bg-slate-50 border border-slate-200 border-dashed rounded-2xl flex items-center justify-center mt-6">
                  <div className="text-center space-y-3 max-w-sm">
                    <TrendingUp className="w-12 h-12 text-[#00A86B] mx-auto animate-bounce" />
                    <h5 className="text-xs font-black uppercase text-slate-850 font-mono tracking-widest">Télémétrie en cours d'écoute...</h5>
                    <p className="text-xs text-slate-400 leading-normal">
                      Connectez de nouveaux capteurs ou inspectez les variables d'environnement pour capter de nouveaux signaux instantanément.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ACTIVE THIRD TAB CLIENTS LOCATAIRES */}
          {activeTab === 'tenants' && (
            <div className="space-y-6">
              <Card>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div>
                    <Title>Base Multi-Locataires Régionale (SaaS)</Title>
                    <Subtitle className="mt-1">Synchronisation des bases fédérées par rapport aux certificats nationaux ARCA</Subtitle>
                  </div>
                  <span className="text-[9px] bg-emerald-50 text-[#00A86B] font-bold px-3 py-1 rounded-full border border-emerald-100 uppercase font-mono">
                    Supabase Realtime Stable
                  </span>
                </div>
                
                <table className="w-full font-mono text-xs text-slate-600 border-collapse">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase tracking-widest text-left border-b border-slate-200 font-black">
                      <th className="pb-3 pl-2">Id Registre</th>
                      <th className="pb-3 font-sans">Sigle Commercial</th>
                      <th className="pb-3 text-right">Hébergement Cluster</th>
                      <th className="pb-3 text-right">Utilisateurs</th>
                      <th className="pb-3 text-center">Status Connexion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-3 pl-2 font-bold text-slate-800">#044-KND</td>
                      <td className="py-3 font-sans font-bold text-slate-700">Rawbank Corp RDC</td>
                      <td className="py-3 text-right text-slate-500">aws.af-south-1.kinshasa</td>
                      <td className="py-3 text-right text-[#00A86B] font-bold font-mono">84 000</td>
                      <td className="py-3 text-center">
                        <span className="text-[9px] text-[#00A86B] font-black uppercase flex items-center justify-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#00A86B] rounded-full animate-ping" /> Stable
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-3 pl-2 font-bold text-slate-800">#098-LUA</td>
                      <td className="py-3 font-sans font-bold text-slate-700">Angola Oil Corp</td>
                      <td className="py-3 text-right text-slate-500">gcp.africa-south2.luanda</td>
                      <td className="py-3 text-right text-[#00A86B] font-bold font-mono">62 000</td>
                      <td className="py-3 text-center">
                        <span className="text-[9px] text-[#00A86B] font-black uppercase flex items-center justify-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#00A86B] rounded-full animate-ping" /> Stable
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </Card>
            </div>
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

    </div>
  );
};

export default SuperAdminDashboard;
