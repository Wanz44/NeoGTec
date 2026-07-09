/**
 * 📄 Fichier : /src/frontend/components/Contracts.tsx
 * 🎯 Objectif : Module complet de gestion des contrats et offres d'assurance
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Users, Lock, BarChart3, FileText, Plus, BellRing, Search, Filter, Eye, ArrowLeft, Upload, Trash2, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CimaContractWizard } from './contracts/CimaContractWizard';
import { ContractPDFViewer } from './contracts/ContractPDFViewer';
import { useApp } from '../lib/AppContext';

interface ContractItem {
  id: string;
  company: string;
  type: 'Particulier' | 'Famille' | 'Groupe' | 'Individuel' | 'PMI' | 'État';
  status: 'Actif' | 'Devis' | 'Résilié';
  monthlyPremium: number;
}

const INITIAL_CONTRACTS: ContractItem[] = [
  { id: 'SP-KIN-000482', company: 'MININGCO SARL (MUKENDI)', type: 'Famille', status: 'Actif', monthlyPremium: 270833 },
  { id: 'POL-CIMA-882103', company: 'Rawbank SARL', type: 'Groupe', status: 'Actif', monthlyPremium: 12450 },
  { id: 'POL-CIMA-402120', company: 'Famille Kabange', type: 'Famille', status: 'Devis', monthlyPremium: 1500 },
  { id: 'POL-CIMA-909543', company: 'Bralima SARL', type: 'Groupe', status: 'Actif', monthlyPremium: 8200 },
  { id: 'POL-CIMA-303102', company: 'Jean Mukendi', type: 'Particulier', status: 'Résilié', monthlyPremium: 450 },
];

export const Contracts: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'offers' | 'detail'>('list');
  const [detailSubTab, setDetailSubTab] = useState<'official' | 'admin'>('official');
  const [contracts, setContracts] = useState<ContractItem[]>(INITIAL_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);
  const { logAction } = useApp();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Tous' | 'Particulier' | 'Famille' | 'Groupe' | 'Individuel' | 'PMI' | 'État'>('Tous');

  // List Type filter state for two types of contract list (Particulier/Famille vs Groupe)
  const [activeListType, setActiveListType] = useState<'particulier-famille' | 'groupe'>('particulier-famille');

  // Policy Dashboard states
  const [showWizard, setShowWizard] = useState(false);
  const [showPolicyDetails, setShowPolicyDetails] = useState(false);
  const [selectedPolicyDetails, setSelectedPolicyDetails] = useState<ContractItem | null>(null);
  const [dashboardTypeFilter, setDashboardTypeFilter] = useState<'Tous' | 'Particulier' | 'Famille' | 'Groupe'>('Tous');

  // Detail consumption filters
  const [companyFilter, setCompanyFilter] = useState('Tous');
  const [partnerFilter, setPartnerFilter] = useState('Tous');

  React.useEffect(() => {
    if (!subModule) return;
    if (subModule === 'contracts-offers') {
      setActiveTab('offers');
    } else {
      setActiveTab('list');
    }
  }, [subModule]);

  // Filtered contracts for the main contract list
  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.status.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check main list type (Particulier & Famille vs Groupe)
    const matchesListType = activeListType === 'particulier-famille'
      ? (c.type === 'Particulier' || c.type === 'Individuel' || c.type === 'Famille')
      : (c.type === 'Groupe' || c.type === 'PMI' || c.type === 'État');

    const matchesType = typeFilter === 'Tous' || c.type === typeFilter;
    return matchesSearch && matchesListType && matchesType;
  });

  // KPIs
  const activeContractsCount = contracts.filter(c => c.status === 'Actif').length;
  const totalMonthlyPremium = contracts.reduce((acc, c) => acc + c.monthlyPremium, 0);

  const handleBackToList = () => {
    setSelectedContract(null);
    setActiveTab('list');
  };

  const handleShowDetail = (contract: ContractItem) => {
    setSelectedContract(contract);
    setDetailSubTab(contract.id === 'SP-KIN-000482' ? 'official' : 'admin');
    setActiveTab('detail');
  };

  const handleDeleteEligibility = () => {
    alert("Éligibilité supprimée avec succès pour ce contrat.");
    if (logAction) {
      logAction('SUPPRESSION_ELIGIBILITE', `Éligibilité supprimée pour le contrat ${selectedContract?.id}`, 'WARNING');
    }
  };

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between px-2 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-[#00A86B] rounded-2xl flex items-center justify-center shadow-xl shadow-[#00A86B]/20">
                <Shield className="w-6 h-6 text-white" />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-950 uppercase tracking-tighter">Gestion des Contrats</h1>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">Offres, Plafonds &amp; Barèmes</p>
             </div>
          </div>

          <div className="flex bg-slate-50 p-1 rounded-xl">
             <button
               onClick={() => { setActiveTab('list'); setSelectedContract(null); }}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer outline-none",
                 activeTab === 'list' ? "bg-white text-slate-800 shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Liste des Contrats
             </button>
             <button
               onClick={() => { setActiveTab('offers'); setSelectedContract(null); setShowWizard(false); }}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer outline-none",
                 activeTab === 'offers' ? "bg-white text-[#00A86B] shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Nouveau police
             </button>
          </div>
       </div>

       <AnimatePresence mode="wait">
          <motion.div
             key={activeTab}
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             transition={{ duration: 0.2 }}
          >
            {activeTab === 'list' && (
              <div className="space-y-6">
                {/* Tableau de bord dédié aux contrats avec 4 KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contrats actifs</span>
                    <span className="text-2xl font-black text-slate-900 block mt-2">{activeContractsCount}</span>
                  </div>
                  <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Prime mensuelle totale</span>
                    <span className="text-2xl font-black text-[#00A86B] block mt-2">{totalMonthlyPremium.toLocaleString()} $</span>
                  </div>
                  <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">S/P moyen</span>
                    <span className="text-2xl font-black text-slate-900 block mt-2">64 %</span>
                  </div>
                  <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Contrant encours</span>
                    <span className="text-2xl font-black text-amber-500 block mt-2">3</span>
                  </div>
                </div>

                {/* Switcher pour les deux types de liste de contrats */}
                <div className="flex bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60 max-w-md">
                  <button
                    onClick={() => setActiveListType('particulier-famille')}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[10.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer outline-none text-center",
                      activeListType === 'particulier-famille' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    👤 Particulier &amp; Famille
                  </button>
                  <button
                    onClick={() => setActiveListType('groupe')}
                    className={cn(
                      "flex-1 py-2 rounded-xl text-[10.5px] font-extrabold uppercase tracking-wider transition-all cursor-pointer outline-none text-center",
                      activeListType === 'groupe' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                    )}
                  >
                    👥 Groupe &amp; Entreprises
                  </button>
                </div>

                {/* Filters Row */}
                <div className="p-4 bg-white border border-slate-150 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    {/* Search Bar */}
                    <div className="relative w-full sm:w-64">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text" 
                        placeholder="Rechercher police, entreprise, statut..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-[#00A86B]"
                      />
                    </div>

                    {/* Type Filter Select */}
                    <div className="flex items-center gap-2">
                      <Filter className="w-3.5 h-3.5 text-slate-400" />
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value as any)}
                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 cursor-pointer outline-none focus:border-[#00A86B]"
                      >
                        {['Tous','Individuel','Groupe','PMI','État'].map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Create New Contract Button */}
                  <button 
                    onClick={() => setActiveTab('offers')}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#00A86B] hover:bg-[#00905a] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-[#00A86B]/20 cursor-pointer outline-none"
                  >
                    <Plus className="w-4 h-4" /> Créer offre par nouvelle police
                  </button>
                </div>

                {/* Table list of contracts */}
                <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                          <th className="py-4 px-6">N° Police</th>
                          <th className="py-4 px-6">Entreprise / Client</th>
                          <th className="py-4 px-6">Type de contrat</th>
                          <th className="py-4 px-6 text-right">Prime mensuelle</th>
                          <th className="py-4 px-6 text-center">Statut</th>
                          <th className="py-4 px-6 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-xs">
                        {filteredContracts.map(c => (
                          <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4 px-6 font-mono font-bold text-slate-900">{c.id}</td>
                            <td className="py-4 px-6 font-extrabold text-slate-800 uppercase">{c.company}</td>
                            <td className="py-4 px-6">
                              <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                {c.type}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-right font-black text-slate-900">{c.monthlyPremium.toLocaleString()} $</td>
                            <td className="py-4 px-6 text-center">
                              <span className={cn(
                                "px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border",
                                c.status === 'Actif' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                c.status === 'Devis' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                "bg-rose-50 text-rose-600 border-rose-100"
                              )}>
                                {c.status}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-center">
                              <button 
                                onClick={() => handleShowDetail(c)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg uppercase tracking-wider transition-colors cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" /> Voir
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'offers' && (
              <div className="space-y-6">
                {!showWizard ? (
                  <div className="space-y-6">
                    {/* Header of the Policy Dashboard */}
                    <div className="bg-slate-50 border border-slate-200/80 p-6 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-slate-900">Tableau de Bord de Gestion de Polices</h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Suivi en temps réel des polices d'assurance par type et accès direct aux fiches de souscription individuelles, familiales ou de groupe.
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => setShowWizard(true)}
                        className="px-5 py-2.5 bg-[#00A86B] hover:bg-[#00905a] text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-[#00A86B]/20 outline-none"
                      >
                        <Plus className="w-4 h-4" />
                        Créer une offre par nouvelle police / Contrat
                      </button>
                    </div>

                    {/* Counts by Type (Particulier, Famille, Groupe) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Polices Particulier</span>
                          <span className="text-2xl font-black text-slate-900 block mt-2">
                            {contracts.filter(c => c.type === 'Particulier' || c.type === 'Individuel').length} polices
                          </span>
                        </div>
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Polices Famille</span>
                          <span className="text-2xl font-black text-slate-900 block mt-2">
                            {contracts.filter(c => c.type === 'Famille').length} polices
                          </span>
                        </div>
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
                          <Users className="w-5 h-5" />
                        </div>
                      </div>

                      <div className="p-5 bg-white border border-slate-150 rounded-2xl shadow-sm flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Polices de Groupe</span>
                          <span className="text-2xl font-black text-slate-900 block mt-2">
                            {contracts.filter(c => c.type === 'Groupe' || c.type === 'PMI' || c.type === 'État').length} polices
                          </span>
                        </div>
                        <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                          <Shield className="w-5 h-5" />
                        </div>
                      </div>
                    </div>

                    {/* Filter for types on the dashboard */}
                    <div className="flex items-center gap-3 bg-white p-3 border border-slate-150 rounded-2xl">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Filtrer par type de contrat :</span>
                      <div className="flex gap-2">
                        {(['Tous', 'Particulier', 'Famille', 'Groupe'] as const).map(t => (
                          <button
                            key={t}
                            onClick={() => setDashboardTypeFilter(t)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer outline-none",
                              dashboardTypeFilter === t
                                ? "bg-slate-900 text-white"
                                : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                            )}
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table on the Dashboard */}
                    <div className="bg-white border border-slate-150 rounded-2xl overflow-hidden shadow-sm">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 border-b border-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-400">
                              <th className="py-4 px-6">N° Police</th>
                              <th className="py-4 px-6">Client / Famille / Entreprise</th>
                              <th className="py-4 px-6">Type de contrat</th>
                              <th className="py-4 px-6 text-right">Prime mensuelle</th>
                              <th className="py-4 px-6 text-center">Statut</th>
                              <th className="py-4 px-6 text-center">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs">
                            {contracts
                              .filter(c => {
                                if (dashboardTypeFilter === 'Tous') return true;
                                if (dashboardTypeFilter === 'Particulier') return c.type === 'Particulier' || c.type === 'Individuel';
                                if (dashboardTypeFilter === 'Famille') return c.type === 'Famille';
                                if (dashboardTypeFilter === 'Groupe') return c.type === 'Groupe' || c.type === 'PMI' || c.type === 'État';
                                return true;
                              })
                              .map(c => (
                                <tr key={c.id} className="hover:bg-slate-50/40 transition-colors">
                                  <td className="py-4 px-6 font-mono font-bold text-slate-900">{c.id}</td>
                                  <td className="py-4 px-6 font-extrabold text-slate-800 uppercase">{c.company}</td>
                                  <td className="py-4 px-6">
                                    <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                                      {c.type}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6 text-right font-black text-slate-900">{c.monthlyPremium.toLocaleString()} $</td>
                                  <td className="py-4 px-6 text-center">
                                    <span className={cn(
                                      "px-2.5 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border",
                                      c.status === 'Actif' ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                      c.status === 'Devis' ? "bg-amber-50 text-amber-600 border-amber-100" :
                                      "bg-rose-50 text-rose-600 border-rose-100"
                                    )}>
                                      {c.status}
                                    </span>
                                  </td>
                                  <td className="py-4 px-6 text-center">
                                    <button 
                                      onClick={() => {
                                        setSelectedPolicyDetails(c);
                                        setShowPolicyDetails(true);
                                      }}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[10px] rounded-lg uppercase tracking-wider transition-colors cursor-pointer outline-none"
                                    >
                                      <Eye className="w-3.5 h-3.5" /> Voir les Détails Remplis
                                    </button>
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Custom Modal for detailed filled policy details */}
                    {showPolicyDetails && selectedPolicyDetails && (
                      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
                          <div className="bg-slate-900 text-white p-6 flex justify-between items-center">
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-widest text-[#00A86B]">Fiche détaillée du contrat</span>
                              <h3 className="text-lg font-black uppercase tracking-tight mt-1">{selectedPolicyDetails.company}</h3>
                            </div>
                            <button 
                              onClick={() => {
                                setShowPolicyDetails(false);
                                setSelectedPolicyDetails(null);
                              }}
                              className="w-8 h-8 bg-white/10 hover:bg-white/20 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer outline-none"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Numéro de Police</span>
                                <span className="text-slate-800 font-mono font-bold block mt-1">{selectedPolicyDetails.id}</span>
                              </div>
                              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Type d'Offre / Contrat</span>
                                <span className="text-[#00A86B] font-extrabold block mt-1 uppercase">{selectedPolicyDetails.type}</span>
                              </div>
                              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Prime Mensuelle Actuarielle</span>
                                <span className="text-slate-800 font-black block mt-1">{selectedPolicyDetails.monthlyPremium.toLocaleString()} $ / mois</span>
                              </div>
                              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-150">
                                <span className="text-slate-400 font-bold block uppercase tracking-wider text-[9px]">Statut Actuel</span>
                                <span className="text-slate-800 font-extrabold block mt-1 uppercase">{selectedPolicyDetails.status}</span>
                              </div>
                            </div>

                            {/* Conditional detailed views for filled details based on contract type */}
                            {(selectedPolicyDetails.type === 'Particulier' || selectedPolicyDetails.type === 'Individuel') && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Informations du Souscripteur Particulier</h4>
                                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 space-y-2 text-xs text-slate-700 leading-relaxed">
                                  <p><strong>Assuré Unique :</strong> {selectedPolicyDetails.company}</p>
                                  <p><strong>Garanties d'assurance :</strong> Hospitalisation (80% de couverture), Pharmacie (70% de couverture), Consultations externes de soins primaires.</p>
                                  <p><strong>Lieu de résidence :</strong> Avenue de l'Équateur, Kinshasa Gombe, RDC</p>
                                  <p><strong>Contact :</strong> +243 81 234 56 78 • jean.mukendi@gmail.com</p>
                                </div>
                              </div>
                            )}

                            {selectedPolicyDetails.type === 'Famille' && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Membres de la Famille Bénéficiaires</h4>
                                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 space-y-3 text-xs text-slate-700">
                                  <p><strong>Chef de famille (Souscripteur) :</strong> {selectedPolicyDetails.company}</p>
                                  <div className="border-t border-slate-200 pt-2.5 space-y-1.5">
                                    <span className="block text-[10px] font-black uppercase text-slate-400">Liste des bénéficiaires rattachés</span>
                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 font-medium">
                                      <span>Mireille Goma (Conjointe)</span>
                                      <span className="text-slate-400">34 ans</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 font-medium">
                                      <span>Sarah Goma (Enfant)</span>
                                      <span className="text-slate-400">12 ans</span>
                                    </div>
                                    <div className="flex items-center justify-between bg-white px-3 py-2 rounded-lg border border-slate-100 font-medium">
                                      <span>Kévin Goma (Enfant)</span>
                                      <span className="text-slate-400">8 ans</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}

                            {(selectedPolicyDetails.type === 'Groupe' || selectedPolicyDetails.type === 'PMI' || selectedPolicyDetails.type === 'État') && (
                              <div className="space-y-3">
                                <h4 className="text-xs font-black uppercase text-slate-800 tracking-wider">Fiche d'Évaluation Mutuelle de Groupe</h4>
                                <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-150 space-y-2 text-xs text-slate-700 leading-relaxed">
                                  <p><strong>Raison Sociale :</strong> {selectedPolicyDetails.company}</p>
                                  <p><strong>RCCM :</strong> CD/KIN/RCCM/2026/B/0412</p>
                                  <p><strong>ID National :</strong> 6-99-N88120L</p>
                                  <p><strong>Effectif Total :</strong> 5,000 salariés assurés</p>
                                  <p><strong>DRH Responsable :</strong> Albertine Tshilomba (albertine.t@corporation.com)</p>
                                  <p><strong>Mode de paiement :</strong> Prélèvement mensuel CIMA standard</p>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end">
                            <button 
                              onClick={() => {
                                setShowPolicyDetails(false);
                                setSelectedPolicyDetails(null);
                              }}
                              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer outline-none"
                            >
                              Fermer la fiche
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <CimaContractWizard 
                    onBackToOffers={() => setShowWizard(false)} 
                    logAction={(act, dt, st) => logAction && logAction(act, dt, st)} 
                    onContractCreated={(newC) => {
                      // Register the newly created contract
                      const formatted: ContractItem = {
                        id: newC.id,
                        company: newC.raisonSociale || 'Souscription Individuelle',
                        type: newC.type === 'groupe' ? 'Groupe' : newC.type === 'famille' ? 'Famille' : 'Particulier',
                        status: 'Actif',
                        monthlyPremium: newC.monthlyPremium || 120
                      };
                      setContracts(prev => [formatted, ...prev]);
                      setShowWizard(false);
                    }}
                  />
                )}
              </div>
            )}

            {activeTab === 'detail' && selectedContract && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white/80 backdrop-blur-md p-4 rounded-3xl border border-slate-150">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={handleBackToList}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" /> Retour
                    </button>
                    <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-lg">Ref: {selectedContract.id}</span>
                  </div>

                  <div className="inline-flex bg-slate-100 p-1 rounded-2xl self-start md:self-auto">
                    <button
                      onClick={() => setDetailSubTab('official')}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                        detailSubTab === 'official'
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      📜 Contrat & Police (Fidélité PDF)
                    </button>
                    <button
                      onClick={() => setDetailSubTab('admin')}
                      className={cn(
                        "px-4 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap",
                        detailSubTab === 'admin'
                          ? "bg-slate-900 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-900"
                      )}
                    >
                      📊 Suivi Administratif
                    </button>
                  </div>
                </div>

                {detailSubTab === 'official' ? (
                  <ContractPDFViewer contract={selectedContract} />
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left part: General information */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="p-6 bg-slate-900 text-white rounded-3xl relative overflow-hidden">
                        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[#00A86B]/10 blur-[80px] pointer-events-none" />
                        <span className="px-2.5 py-0.5 bg-[#00A86B] text-white font-black text-[9px] uppercase rounded-full">POLICE ACTIVE</span>
                        <h3 className="text-xl font-black mt-3 uppercase italic tracking-tighter">{selectedContract.company}</h3>
                        <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">Type de contrat : {selectedContract.type} • ID : {selectedContract.id}</p>
                      </div>

                      {/* File import block (1.9 requirement) */}
                      <div className="p-6 bg-white border border-slate-150 rounded-3xl space-y-4">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Importation de documents (.xlsx, .pdf)</h4>
                        <p className="text-xs text-slate-500">Ajoutez des avenants, listes d'affiliés ou rapports d'évaluation liés à cette police d'assurance.</p>
                        <div className="p-8 border-2 border-dashed border-slate-200 hover:border-[#00A86B] bg-slate-50 hover:bg-green-50/20 rounded-2xl transition-all text-center group">
                          <Upload className="w-8 h-8 text-slate-400 group-hover:text-[#00A86B] mx-auto mb-3 transition-colors" />
                          <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Glissez-déposez un fichier .xlsx ou .pdf</span>
                          <span className="block text-[10px] text-slate-400 mt-1">Taille maximale : 10 Mo</span>
                          <input type="file" accept=".xlsx,.pdf" className="hidden" id="detail-file-upload" onChange={() => alert("Fichier importé avec succès dans le portefeuille documentaire du contrat.")} />
                          <label htmlFor="detail-file-upload" className="mt-4 inline-block px-4 py-2 bg-slate-900 hover:bg-[#00A86B] text-white font-black text-[10px] uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                            Parcourir les fichiers
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Right part: Consommation tab/section (1.11 requirement) */}
                    <div className="p-6 bg-white border border-slate-150 rounded-3xl space-y-6">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-wide">Onglet Consommation</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Aperçu budgétaire et éligibilité</p>
                      </div>

                      <div className="space-y-4">
                        <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase block">Montant Mensuel</span>
                            <span className="text-lg font-black text-slate-800">{selectedContract.monthlyPremium.toLocaleString()} $</span>
                          </div>
                          <div>
                            <span className="text-[10px] font-black text-slate-400 uppercase block">Montant Annuel</span>
                            <span className="text-lg font-black text-slate-800">{(selectedContract.monthlyPremium * 12).toLocaleString()} $</span>
                          </div>
                        </div>

                        {/* Filters par entreprise et partenaire */}
                        <div className="space-y-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Filtre par entreprise</label>
                            <select 
                              value={companyFilter}
                              onChange={(e) => setCompanyFilter(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-750"
                            >
                              <option value="Tous">Toutes les filiales</option>
                              <option value="Rawbank SARL">Rawbank SARL</option>
                              <option value="Vodacom RDC">Vodacom RDC</option>
                              <option value="Bralima SARL">Bralima SARL</option>
                            </select>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Filtre par partenaire de soins</label>
                            <select 
                              value={partnerFilter}
                              onChange={(e) => setPartnerFilter(e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-750"
                            >
                              <option value="Tous">Tous les hôpitaux</option>
                              <option value="HJ Hospitals">HJ Hospitals Kinshasa</option>
                              <option value="Clinique Ngaliema">Clinique Ngaliema</option>
                              <option value="Hôpital Biamba Marie Mutombo">Biamba Marie Mutombo</option>
                            </select>
                          </div>
                        </div>

                        {/* Supprimer Eligibilité Button */}
                        <button 
                          onClick={handleDeleteEligibility}
                          className="w-full py-3 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer outline-none"
                        >
                          <Trash2 className="w-4 h-4" /> Supprimer Éligibilité
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
