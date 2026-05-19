/**
 * 📄 Fichier : /src/frontend/components/Consumptions.tsx
 * 🎯 Objectif : Suivi dynamique des consommations avec sous-modules spécialisés.
 */
import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Wallet, AlertTriangle, TrendingUp, TrendingDown,
  Info, Shield, Users, Search, Download, Filter, 
  ChevronRight, ArrowUpRight, BarChart3, BellRing, ShieldCheck, ClipboardCheck, History
} from 'lucide-react';
import { cn } from '../lib/utils';
import { EligibilityCheck } from './consumptions/EligibilityCheck';
import { ActsValidation } from './consumptions/ActsValidation';
import { ConsumptionHistory } from './consumptions/ConsumptionHistory';

// --- Types ---

export interface ConsumptionStats {
  totalUsed: number;
  totalLimit: number;
  remaining: number;
  percentUsed: number;
  lastClaimAmount: number;
  lastClaimDate: string;
}

export interface ConsumptionRecord {
  id: string;
  insuredName: string;
  policyNumber: string;
  totalCeiling: number;
  consumed: number;
  refunded: number;
  remaining: number;
  status: 'Normal' | 'Attention' | 'Critique';
  alerts: { type: 'Fraude' | 'UtilisationÉlevée' | 'Anomalie'; message: string; severity: 'basse' | 'moyenne' | 'haute' }[];
}

const MOCK_CONSUMPTION: ConsumptionRecord[] = [
  {
    id: '1',
    insuredName: 'Adonaï WANZAMBI',
    policyNumber: 'POL-123456',
    totalCeiling: 25000,
    consumed: 1250.00,
    refunded: 1100.00,
    remaining: 23750,
    status: 'Normal',
    alerts: []
  },
  {
    id: '2',
    insuredName: 'Marie Curie',
    policyNumber: 'POL-654321',
    totalCeiling: 5000,
    consumed: 4200.00,
    refunded: 3800.00,
    remaining: 800,
    status: 'Critique',
    alerts: [
      { type: 'UtilisationÉlevée', message: "84% du plafond consommé en 3 mois.", severity: 'haute' }
    ]
  },
  {
    id: '3',
    insuredName: 'Robert Oppenheimer',
    policyNumber: 'POL-445566',
    totalCeiling: 150000,
    consumed: 15000.00,
    refunded: 12000.00,
    remaining: 135000,
    status: 'Attention',
    alerts: [
      { type: 'Anomalie', message: "Multiplication anormale des actes de kinésithérapie (15 actes/mois).", severity: 'moyenne' },
      { type: 'Fraude', message: "Facture suspecte détectée via Analyse IA sur le dossier CL-900.", severity: 'haute' }
    ]
  }
];

export const Consumptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'validation' | 'history'>('overview');
  const [data] = useState<ConsumptionRecord[]>(MOCK_CONSUMPTION);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredData = data.filter(r => 
    r.insuredName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.policyNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'eligibility': return <EligibilityCheck />;
      case 'validation': return <ActsValidation />;
      case 'history': return <ConsumptionHistory />;
      default: return (
        <div className="space-y-6">
          {/* Global Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <div className="p-6 bg-white border border-green-100 rounded-[32px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform">
                   <TrendingUp className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                   <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center border border-green-200">
                      <Activity className="w-6 h-6 text-green-600" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-green-950/30 uppercase tracking-[0.2em] mb-1">Taux de Sinistralité GLOBAL</p>
                      <p className="text-3xl font-black text-green-950">42.5% <span className="text-xs font-bold text-rose-500 italic">+2.1%</span></p>
                   </div>
                   <div className="w-full h-1 bg-green-100 rounded-full overflow-hidden">
                      <div className="w-[42.5%] h-full bg-green-600 rounded-full" />
                   </div>
                </div>
             </div>

             <div className="p-6 bg-green-950 rounded-[32px] text-white shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                   <Wallet className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                   <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                      <Wallet className="w-6 h-6 text-green-400" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Total Remboursements (Mois)</p>
                      <p className="text-3xl font-black text-white">2.4M <span className="text-xs font-bold text-emerald-400 italic">$</span></p>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-white/40 italic">
                      <BarChart3 className="w-3 h-3" /> Basé sur 1,240 dossiers validés
                   </div>
                </div>
             </div>

             <div className="p-6 bg-white border border-green-100 rounded-[32px] shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5">
                   <AlertTriangle className="w-24 h-24" />
                </div>
                <div className="relative z-10 flex flex-col gap-4">
                   <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center border border-rose-200">
                      <Shield className="w-6 h-6 text-rose-600" />
                   </div>
                   <div>
                      <p className="text-[10px] font-black text-green-950/30 uppercase tracking-[0.2em] mb-1">Économies (Fraudes évitées)</p>
                      <p className="text-3xl font-black text-rose-600">85K <span className="text-xs font-bold text-slate-400 italic">$</span></p>
                   </div>
                   <div className="flex items-center gap-2 text-[10px] font-black text-green-950/40 italic">
                      <Info className="w-3 h-3" /> Système Neural Detection actif
                   </div>
                </div>
             </div>
          </div>

          {/* Consumption Table */}
          <div className="fluent-card overflow-hidden">
             <div className="p-4 bg-green-50/20 border-b border-green-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                      <input 
                         type="text" 
                         placeholder="Rechercher un client ou une police..." 
                         value={searchQuery}
                         onChange={(e) => setSearchQuery(e.target.value)}
                         className="pl-9 pr-4 py-1.5 text-xs bg-white border border-green-100 rounded-lg outline-none w-64 focus:ring-2 focus:ring-green-500/20"
                      />
                   </div>
                   <button className="flex items-center gap-2 text-xs font-bold text-green-600 px-3 py-1.5 hover:bg-green-100 rounded-lg transition-colors">
                      <Filter className="w-3.5 h-3.5" /> Filtres
                   </button>
                </div>
                <div className="text-[10px] font-black text-green-950/30 uppercase italic">
                   Monitorage en temps réel
                </div>
             </div>

             <div className="divide-y divide-green-50">
                {filteredData.map(record => (
                  <div key={record.id} className="p-6 flex flex-col md:flex-row md:items-center justify-between hover:bg-green-50/30 transition-all group gap-6">
                     <div className="flex items-center gap-4 flex-1">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center font-black",
                          record.status === 'Critique' ? "bg-rose-100 text-rose-600 ring-4 ring-rose-50" :
                          record.status === 'Attention' ? "bg-amber-100 text-amber-600 ring-4 ring-amber-50" : "bg-emerald-100 text-emerald-600 ring-4 ring-emerald-50"
                        )}>
                          {record.status === 'Critique' ? '!' : record.status === 'Attention' ? '?' : '✓'}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <h4 className="text-sm font-black text-green-950">{record.insuredName}</h4>
                              <span className="text-[9px] font-mono font-bold text-slate-400 px-1.5 py-0.5 rounded bg-slate-100 uppercase">{record.policyNumber}</span>
                           </div>
                           <p className="text-[11px] font-bold text-green-900/40 mt-0.5">Plafond: {record.totalCeiling.toLocaleString()} $</p>
                        </div>
                     </div>

                     <div className="flex-1 max-w-sm">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-[11px] font-black text-green-950/60 tracking-tight">Utilisation effective</p>
                           <p className={cn(
                             "text-[11px] font-black",
                             record.status === 'Critique' ? "text-rose-600" : "text-green-950"
                           )}>
                             {((record.consumed / record.totalCeiling) * 100).toFixed(1)}%
                           </p>
                        </div>
                        <div className="h-2 bg-green-100 rounded-full overflow-hidden">
                           <motion.div 
                             initial={{ width: 0 }}
                             animate={{ width: `${(record.consumed / record.totalCeiling) * 100}%` }}
                             className={cn(
                               "h-full rounded-full transition-all duration-1000",
                               record.status === 'Critique' ? "bg-rose-500" : 
                               record.status === 'Attention' ? "bg-amber-500" : "bg-emerald-500"
                             )}
                           />
                        </div>
                        <div className="flex justify-between mt-2">
                           <p className="text-[10px] font-bold text-slate-400">Restant: {record.remaining.toLocaleString()} $</p>
                           <p className="text-[10px] font-black text-emerald-600 italic">Remboursé: {record.refunded.toLocaleString()} $</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-4">
                        {record.alerts.length > 0 ? (
                          <div className="flex -space-x-2">
                            {record.alerts.map((alert, i) => (
                              <div 
                                key={i} 
                                className={cn(
                                  "w-8 h-8 rounded-full flex items-center justify-center border-2 border-white text-[10px] font-black shadow-sm",
                                  alert.severity === 'haute' ? "bg-rose-600 text-white" : "bg-amber-500 text-white"
                                )}
                                title={alert.message}
                              >
                                {alert.type === 'Fraude' ? 'F' : alert.type === 'Anomalie' ? 'A' : 'U'}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest italic bg-emerald-50 px-2 py-1 rounded">Sans Anomalie</span>
                        )}
                        <button className="p-2 rounded-xl bg-slate-50 text-slate-400 opacity-0 group-hover:opacity-100 group-hover:text-green-600 transition-all hover:bg-green-50">
                           <ChevronRight className="w-5 h-5" />
                        </button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div className="fluent-card p-6">
                <h4 className="text-sm font-black text-green-950 mb-6 flex items-center gap-2">
                   <TrendingDown className="w-5 h-5 text-emerald-600" /> TOP 5 Économies du mois
                </h4>
                <div className="space-y-4">
                   {[
                     { client: 'Clinique ProSanté', saving: '12,400 $', reason: 'Négociation tarifs actes' },
                     { client: 'Labo Bio-X', saving: '8,150 $', reason: 'Audit factures doubles' },
                     { client: 'Pharmacie Centrale', saving: '5,500 $', reason: 'Substitution génériques' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-green-50/20 rounded-xl border border-green-50">
                        <div className="flex items-center gap-3">
                           <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 font-black text-[10px]">#{i+1}</div>
                           <div>
                              <p className="text-xs font-black text-green-950">{item.client}</p>
                              <p className="text-[10px] font-bold text-slate-400 italic font-medium italic">{item.reason}</p>
                           </div>
                        </div>
                        <p className="text-sm font-black text-emerald-600">+{item.saving}</p>
                     </div>
                   ))}
                </div>
             </div>

             <div className="fluent-card p-6 border-rose-100 bg-rose-50/10">
                <h4 className="text-sm font-black text-rose-950 mb-6 flex items-center gap-2">
                   <AlertTriangle className="w-5 h-5 text-rose-600" /> Alertes Risques / Anomalies
                </h4>
                <div className="space-y-3">
                   {[
                     { user: 'Benoit Lucas', alert: 'Usage intensif hors-zone', priority: 'haute' },
                     { user: 'Sarl Omega', alert: 'Pics de consommation nocturnes', priority: 'moyenne' },
                     { user: 'Adonaï WANZAMBI', alert: 'Consommation pluriannuelle dépassée', priority: 'basse' }
                   ].map((item, i) => (
                     <div key={i} className="flex items-center justify-between p-3 bg-white rounded-xl border border-rose-100 shadow-sm">
                        <div className="flex items-center gap-3">
                           <div className={cn(
                             "w-2 h-2 rounded-full",
                             item.priority === 'haute' ? "bg-rose-600" : item.priority === 'moyenne' ? "bg-amber-500" : "bg-yellow-400"
                           )} />
                           <div>
                              <p className="text-xs font-black text-rose-950">{item.user}</p>
                              <p className="text-[10px] font-bold text-rose-900/40 italic font-medium italic">{item.alert}</p>
                           </div>
                        </div>
                        <button className="text-[10px] font-black text-rose-600 uppercase italic hover:underline">Investiger</button>
                     </div>
                   ))}
                </div>
                <button className="w-full mt-6 py-2 border border-rose-200 text-rose-600 text-[10px] font-black rounded-xl hover:bg-rose-50 transition-all uppercase tracking-widest italic">
                   Archiver toutes les alertes traitées
                </button>
             </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-950 rounded-2xl shadow-xl shadow-green-900/20">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-green-950 italic">Suivi des Consommations</h1>
            <p className="text-xs font-bold text-green-600 uppercase tracking-widest leading-none">Calcul dynamique des plafonds</p>
          </div>
        </div>
        
        <div className="flex p-1 bg-slate-100 rounded-2xl border border-slate-200">
          <button 
            onClick={() => setActiveTab('overview')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'overview' ? "bg-white text-green-950 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Aperçu
          </button>
          <button 
            onClick={() => setActiveTab('eligibility')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'eligibility' ? "bg-white text-green-950 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ShieldCheck className="w-4 h-4 text-green-600" /> Éligibilité
          </button>
          <button 
            onClick={() => setActiveTab('validation')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'validation' ? "bg-white text-green-950 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <ClipboardCheck className="w-4 h-4 text-indigo-600" /> Validation
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all italic flex items-center gap-2",
              activeTab === 'history' ? "bg-white text-green-950 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <History className="w-4 h-4 text-slate-900" /> Historique
          </button>
        </div>
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {renderContent()}
      </motion.div>
    </div>
  );
};
