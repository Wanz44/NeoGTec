/**
 * 📄 Fichier : /src/frontend/components/CeilingConsumptionChart.tsx
 * 🎯 Objectif : Visualisation interactive en temps réel de la consommation des plafonds annuels des assurés.
 * 📊 Graphique : recharts de comparaison (Dépenses Réelles vs Limites Autorisées) avec simulateur d'actes temps réel.
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Cell
} from 'recharts';
import { 
  Users, AlertTriangle, TrendingUp, Filter, Search, PlusCircle, Sparkles, RefreshCw, DollarSign, CheckCircle2, ShieldAlert
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useLanguage } from '../lib/LanguageContext';

export interface InsuredCeilingData {
  id: string;
  name: string;
  company: string;
  consumed: number;
  authorizedLimit: number;
  department: string;
  city: string;
}

const INITIAL_CEILING_DATA: InsuredCeilingData[] = [
  { id: '1', name: 'Albert Tshimanga', company: 'Rawbank SARL', consumed: 4500, authorizedLimit: 10000, department: 'Finance', city: 'Kinshasa' },
  { id: '2', name: 'Marie Curie Mpunga', company: 'Vodacom RDC', consumed: 9200, authorizedLimit: 10000, department: 'Technique', city: 'Kinshasa' },
  { id: '3', name: 'Jean-Laurent Mukendi', company: 'Rawbank SARL', consumed: 10450, authorizedLimit: 10000, department: 'Ressources Humaines', city: 'Kinshasa' },
  { id: "4", name: 'Marie-Pauline Kabanga', company: 'Vodacom RDC', consumed: 7800, authorizedLimit: 10000, department: 'Marketing', city: 'Kinshasa' },
  { id: '5', name: 'Robert Oppenheimer Kalonji', company: 'Bralima SARL', consumed: 1250, authorizedLimit: 15000, department: 'Production', city: 'Lubumbashi' },
  { id: '6', name: 'Sarah Al-Mansoori', company: 'Individuel UAE', consumed: 14200, authorizedLimit: 15000, department: 'Consultant', city: 'Dubai' },
  { id: '7', name: 'Adonai Lutonadio', company: 'SNCF France', consumed: 2100, authorizedLimit: 5000, department: 'Exploitation', city: 'Paris' },
  { id: '8', name: 'Pierre-Sébastien Ndaye', company: 'Rawbank SARL', consumed: 1800, authorizedLimit: 10000, department: 'Juridique', city: 'Kinshasa' },
];

export const CeilingConsumptionChart: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<InsuredCeilingData[]>(INITIAL_CEILING_DATA);
  const [selectedCompany, setSelectedCompany] = useState<string>('Tous');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'exceeded' | 'warning' | 'normal'>('all');
  
  // Real-time animation simulator states
  const [selectedInsuredId, setSelectedInsuredId] = useState<string>('1');
  const [simulatedAmount, setSimulatedAmount] = useState<number>(350);
  const [category, setCategory] = useState<string>('Consultation');
  const [simulationAlert, setSimulationAlert] = useState<string | null>(null);

  // List of unique companies for the dropdown
  const companies = useMemo(() => {
    const list = Array.from(new Set(data.map(item => item.company)));
    return ['Tous', ...list];
  }, [data]);

  // Compute processed data based on filters
  const filteredData = useMemo(() => {
    return data.filter(item => {
      const matchesCompany = selectedCompany === 'Tous' || item.company === selectedCompany;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.id.includes(searchQuery) ||
                            item.city.toLowerCase().includes(searchQuery.toLowerCase());
      
      const pct = (item.consumed / item.authorizedLimit) * 100;
      let matchesStatus = true;
      if (statusFilter === 'exceeded') {
        matchesStatus = pct >= 100;
      } else if (statusFilter === 'warning') {
        matchesStatus = pct >= 85 && pct < 100;
      } else if (statusFilter === 'normal') {
        matchesStatus = pct < 85;
      }

      return matchesCompany && matchesSearch && matchesStatus;
    });
  }, [data, selectedCompany, searchQuery, statusFilter]);

  // Recharts representation data
  const chartData = useMemo(() => {
    return filteredData.map(item => ({
      name: item.name.split(' ')[0] || item.name, // Just the first name to keep things tidy on the X-axis
      fullName: item.name,
      'Dépenses Réelles': item.consumed,
      'Limite Autorisée': item.authorizedLimit,
      pourcentage: ((item.consumed / item.authorizedLimit) * 100).toFixed(1),
    }));
  }, [filteredData]);

  // Handle simulated medical expense ingestion (live update)
  const handleSimulateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInsuredId) return;

    let targetName = '';
    setData(prev => prev.map(item => {
      if (item.id === selectedInsuredId) {
        targetName = item.name;
        const newConsumed = item.consumed + simulatedAmount;
        const pct = (newConsumed / item.authorizedLimit) * 100;
        
        if (pct >= 100) {
          setSimulationAlert(`🚨 PAYS-BASQUE AUDIT CLINIQUE: L'assuré ${item.name} a dépassé son plafond annuel autorisé de ${item.authorizedLimit} $ ! Nouveau cumulé: ${newConsumed} $ (${pct.toFixed(0)}%).`);
        } else if (pct >= 85) {
          setSimulationAlert(`⚠️ SEUIL DE SÉCURITÉ : L'assuré ${item.name} approche du plafond annuel (Consommé : ${pct.toFixed(0)}%).`);
        } else {
          setSimulationAlert(`✅ TRANSACTION TEMPS RÉEL : Dépense de ${simulatedAmount} $ intégrée avec succès pour ${item.name}. Nouveau cumulé: ${newConsumed} $.`);
        }

        return {
          ...item,
          consumed: newConsumed
        };
      }
      return item;
    }));

    // Auto-clear alert after 5 seconds
    setTimeout(() => {
      setSimulationAlert(null);
    }, 5500);
  };

  const handleResetData = () => {
    setData(INITIAL_CEILING_DATA);
    setSimulationAlert("🔄 Réinitialisation complète des plafonds annuels effectuée.");
    setTimeout(() => setSimulationAlert(null), 3000);
  };

  // Compute key stats for dashboard integration
  const stats = useMemo(() => {
    const totalConsumed = data.reduce((sum, item) => sum + item.consumed, 0);
    const totalLimit = data.reduce((sum, item) => sum + item.authorizedLimit, 0);
    const avgPercentage = (totalConsumed / totalLimit) * 100;
    const activeExceedances = data.filter(item => item.consumed >= item.authorizedLimit).length;
    const warningCases = data.filter(item => {
      const p = (item.consumed / item.authorizedLimit) * 100;
      return p >= 85 && p < 100;
    }).length;

    return {
      totalConsumed,
      totalLimit,
      avgPercentage,
      activeExceedances,
      warningCases
    };
  }, [data]);

  // Custom tooltips for pristine presentation
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      const consumed = payload[0].value;
      const limit = payload[1].value;
      const pct = dataPoint.pourcentage;
      return (
        <div className="bg-slate-900 text-white p-4 rounded-xl border border-white/10 shadow-2xl space-y-1 text-xs">
          <p className="font-extrabold text-indigo-400">{dataPoint.fullName}</p>
          <div className="space-y-0.5 font-sans font-medium text-slate-350">
            <p className="flex justify-between gap-4">Dépenses Réelles: <span className="font-extrabold text-white">{consumed.toLocaleString()} $</span></p>
            <p className="flex justify-between gap-4">Plafond Autorisé: <span className="font-extrabold text-white">{limit.toLocaleString()} $</span></p>
            <div className="border-t border-white/10 pt-1 mt-1 flex justify-between gap-4">
              <span>Ratio Consommation:</span>
              <span className={cn(
                "font-black",
                parseFloat(pct) >= 100 ? "text-rose-400" : parseFloat(pct) >= 85 ? "text-amber-400" : "text-emerald-400"
              )}>
                {pct}%
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white border border-slate-100 rounded-[2.5rem] p-6 lg:p-8 shadow-sm space-y-6">
      
      {/* Visual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 pb-5">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center border border-orange-100">
             <TrendingUp className="w-5 h-5 text-orange-600" />
           </div>
           <div>
             <h3 className="text-lg font-black text-slate-1000 uppercase italic">
               {t('dashboard.ceiling_consumption', 'Consommation du Plafond Annuel')}
             </h3>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
               Analyse comparative des dépenses et contrôle des limites de soins par assuré
             </p>
           </div>
         </div>

         {/* Action controls */}
         <div className="flex flex-wrap items-center gap-2">
            <button 
              onClick={handleResetData}
              className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-1.5 border border-slate-200"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-calculer
            </button>
            <span className="h-4 w-px bg-slate-200 mx-1" />
            <span className="inline-flex items-center gap-1 text-[10px] font-black text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100 uppercase tracking-wide">
              ⚡ LIVE FEED SYNCHRONISÉ
            </span>
         </div>
      </div>

      {/* Real-time event notifications toast style */}
      <AnimatePresence>
        {simulationAlert && (
          <motion.div 
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            className={cn(
              "p-4 rounded-2xl text-xs font-semibold leading-relaxed border flex items-center gap-3 shadow-sm",
              simulationAlert.includes('🚨') ? "bg-rose-50 border-rose-200 text-rose-950" :
              simulationAlert.includes('⚠️') ? "bg-amber-50 border-amber-200 text-amber-950" : "bg-emerald-50 border-emerald-200 text-emerald-950"
            )}
          >
            {simulationAlert.includes('🚨') ? <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" /> :
             simulationAlert.includes('⚠️') ? <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
            <span className="flex-1">{simulationAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini-KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-5 rounded-[2rem] border border-slate-200/50">
        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Plafonds Consommés Globaux</p>
          <p className="text-xl font-black text-slate-900">{stats.totalConsumed.toLocaleString()} $ <span className="text-[10px] text-slate-400 font-bold">/ {stats.totalLimit.toLocaleString()} $</span></p>
          <div className="flex items-center gap-1.5">
            <div className="w-16 h-1 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: `${stats.avgPercentage}%` }} />
            </div>
            <span className="text-[10px] font-mono text-slate-500 font-bold">{stats.avgPercentage.toFixed(1)}%</span>
          </div>
        </div>

        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dépassements Constatés</p>
          <p className="text-xl font-black text-rose-600 flex items-center gap-1.5">
            {stats.activeExceedances} {stats.activeExceedances > 0 ? 'Cas' : 'Aucun'}
            {stats.activeExceedances > 0 && <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />}
          </p>
          <p className="text-[9px] text-slate-400 font-bold italic uppercase tracking-wider">Alerte Double-facteur déclenchée</p>
        </div>

        <div className="space-y-1">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">En zone de vigilance (&gt;85%)</p>
          <p className="text-xl font-black text-amber-500">{stats.warningCases} Assurés</p>
          <p className="text-[9px] text-slate-400 font-bold italic uppercase tracking-wider">Dossiers sous surveillance d&apos;actes</p>
        </div>
      </div>

      {/* Interactive Filters row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-1">
        <div className="flex flex-wrap items-center gap-2">
          {/* Custom Search field */}
          <div className="relative group">
            <Search className="w-4 h-4 text-slate-450 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-orange-500 transition-colors" />
            <input 
              type="text"
              placeholder="Rechercher un assuré, ville..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 focus:bg-white w-52 font-bold transition-all"
            />
          </div>

          {/* Company filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="bg-transparent text-xs font-bold outline-none text-slate-700"
            >
              {companies.map(c => (
                <option key={c} value={c}>{c === 'Tous' ? "Toutes Entreprises" : c}</option>
              ))}
            </select>
          </div>

          {/* Status filter tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 gap-0.5">
            {[
              { id: 'all', label: 'Tous' },
              { id: 'exceeded', label: 'Dépassements' },
              { id: 'warning', label: 'Alerte' },
              { id: 'normal', label: 'Sous limite' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id as any)}
                className={cn(
                  "px-3 py-1 text-[9px] font-black uppercase tracking-wider rounded-lg transition-all cursor-pointer",
                  statusFilter === f.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-800"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] text-slate-400 font-extrabold uppercase">
          Affichage de {filteredData.length} sur {data.length} dossiers
        </p>
      </div>

      {/* Grid: Graph and Real-Time Event Simulator */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Comparison Recharts bar chart */}
        <div className="xl:col-span-2 space-y-3">
          <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-slate-400">
            <span>Dépense réelles vs limitation par bénéficiaire</span>
            <div className="flex gap-4">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-orange-500 inline-block" /> Réel</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-200 inline-block" /> Limite</span>
            </div>
          </div>

          <div className="h-[320px] w-full border border-slate-100/70 p-4 rounded-3xl bg-slate-50/25">
            {chartData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 italic font-medium p-4 space-y-2">
                <Users className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                <p>Aucun assuré ne correspond aux critères de filtrages sélectionnés.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={20} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc', opacity: 0.7 }} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    height={36} 
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }} 
                  />
                  
                  {/* Real Expenses Bar (with custom color coloring depending on status) */}
                  <Bar dataKey="Dépenses Réelles" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => {
                      const pct = parseFloat(entry.pourcentage);
                      let fill = '#f97316'; // Orange primary
                      if (pct >= 100) fill = '#ef4444'; // Red exceedance
                      else if (pct >= 85) fill = '#f59e0b'; // Amber warning
                      return <Cell key={`cell-${index}`} fill={fill} />;
                    })}
                  </Bar>

                  {/* Limit bar (in a elegant grey tone) */}
                  <Bar dataKey="Limite Autorisée" fill="#e2e8f0" radius={[4, 4, 0, 0]} />

                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Real-time simulation Form Panel */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-[2rem] p-6 flex flex-col justify-between">
           <div className="space-y-4">
             <div className="flex items-center gap-2">
               <Sparkles className="w-5 h-5 text-orange-500" />
               <h4 className="text-xs font-black text-slate-1000 uppercase tracking-widest italic">
                 Simulateur de Dépenses Live
               </h4>
             </div>
             <p className="text-[11px] text-slate-450 leading-relaxed font-semibold italic">
               Simulez un nouvel acte médical pour observer la mise à jour instantanée de la courbe de consommation et le déclenchement des alertes.
             </p>

             <form onSubmit={handleSimulateExpense} className="space-y-4 pt-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Sélectionner l&apos;Assuré cible</label>
                  <select
                    value={selectedInsuredId}
                    onChange={(e) => setSelectedInsuredId(e.target.value)}
                    className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10"
                  >
                    {data.map(item => (
                      <option key={item.id} value={item.id}>
                        {item.name} ({item.company.split(' ')[0]}) - {item.consumed} $ Consommés
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Catégorie acte</label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs font-bold bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-slate-700 outline-none"
                    >
                      <option value="Consultation">Consultation</option>
                      <option value="Scanner / Imagerie">Scanner</option>
                      <option value="Optique">Soin Optique</option>
                      <option value="Dentaire">Soin Dentaire</option>
                      <option value="Hospitalisation">Hospitalisation</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Montant Acte ($)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-extrabold text-[11px]">$</span>
                      <input 
                        type="number"
                        min="50"
                        max="5000"
                        step="50"
                        value={simulatedAmount}
                        onChange={(e) => setSimulatedAmount(parseInt(e.target.value) || 0)}
                        className="pl-7 pr-3 py-2 w-full text-xs font-bold bg-white border border-slate-200 rounded-xl outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-slate-900 hover:bg-orange-600 hover:shadow-orange-500/20 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" /> Injecter la dépense
                </button>
             </form>
           </div>

           {/* Safety audit text */}
           <div className="border-t border-slate-205 py-3 mt-4 text-[9px] text-slate-400 leading-normal italic font-semibold space-y-1">
             <p className="flex justify-between"><span>Audit Synchro:</span> <span className="text-emerald-600 font-black flex items-center gap-1">● Actif 14ms</span></p>
             <p className="flex justify-between"><span>Flux de validation:</span> <span className="text-slate-600">SMART_ALERTS v1.9</span></p>
           </div>
        </div>

      </div>

    </div>
  );
};
