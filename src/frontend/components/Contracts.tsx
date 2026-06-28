/**
 * 📄 Fichier : /src/frontend/components/Contracts.tsx
 * 🎯 Objectif : Module complet de gestion des contrats et offres d'assurance.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Users, Lock, BarChart3, FileText, Plus, BellRing, Search, Filter, Eye, ArrowLeft, Upload, Trash2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { CimaContractWizard } from './contracts/CimaContractWizard';
import { useApp } from '../lib/AppContext';

interface ContractItem {
  id: string;
  company: string;
  type: 'Individuel' | 'Groupe' | 'PMI' | 'État';
  status: 'Actif' | 'Devis' | 'Résilié';
  monthlyPremium: number;
}

const INITIAL_CONTRACTS: ContractItem[] = [
  { id: 'POL-CIMA-882103', company: 'Rawbank SARL', type: 'Groupe', status: 'Actif', monthlyPremium: 12450 },
  { id: 'POL-CIMA-402120', company: 'Vodacom RDC', type: 'PMI', status: 'Devis', monthlyPremium: 35000 },
  { id: 'POL-CIMA-909543', company: 'Bralima SARL', type: 'État', status: 'Actif', monthlyPremium: 8200 },
  { id: 'POL-CIMA-303102', company: 'Sarl Omega Kinshasa', type: 'Individuel', status: 'Résilié', monthlyPremium: 4120 },
];

export const Contracts: React.FC<{ subModule?: string }> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'offers' | 'detail'>('list');
  const [contracts, setContracts] = useState<ContractItem[]>(INITIAL_CONTRACTS);
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);
  const { logAction } = useApp();

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Tous' | 'Individuel' | 'Groupe' | 'PMI' | 'État'>('Tous');

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

  // Filtered contracts
  const filteredContracts = contracts.filter(c => {
    const matchesSearch = c.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.status.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'Tous' || c.type === typeFilter;
    return matchesSearch && matchesType;
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
                <h1 className="text-2xl font-black text-slate-950 uppercase italic tracking-tighter">Gestion des Contrats</h1>
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
               onClick={() => { setActiveTab('offers'); setSelectedContract(null); }}
               className={cn(
                 "px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer outline-none",
                 activeTab === 'offers' ? "bg-white text-[#00A86B] shadow-md" : "text-slate-400 hover:text-slate-600"
               )}
             >
                Contrat CIMA (7 étapes)
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
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Avenants en cours</span>
                    <span className="text-2xl font-black text-amber-500 block mt-2">3</span>
                  </div>
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
              <CimaContractWizard 
                onBackToOffers={handleBackToList} 
                logAction={(act, dt, st) => logAction && logAction(act, dt, st)} 
              />
            )}

            {activeTab === 'detail' && selectedContract && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <button 
                    onClick={handleBackToList}
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" /> Retour à la liste
                  </button>

                  <span className="text-xs font-mono font-bold text-slate-400">Ref: {selectedContract.id}</span>
                </div>

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
              </div>
            )}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
