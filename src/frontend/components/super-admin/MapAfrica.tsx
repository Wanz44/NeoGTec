import React, { useState } from 'react';
import { 
  X, MapPin, Radio, Activity, 
  TrendingUp, ShieldCheck, AlertCircle, Building, 
  Map as MapIcon, ChevronRight
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface CountryDetail {
  code: string;
  name: string;
  capital: string;
  status: 'operational' | 'attention' | 'audit' | 'critical';
  tenantsCount: number;
  mrr: string;
  lossRatio: number;
  complianceScore: number;
  recentIncidents: string[];
}

export const MapAfrica: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<CountryDetail | null>(null);

  const countries: CountryDetail[] = [
    {
      code: 'RDC',
      name: 'République Démocratique du Congo',
      capital: 'Kinshasa',
      status: 'operational',
      tenantsCount: 14,
      mrr: '143 500 $',
      lossRatio: 42.5,
      complianceScore: 100,
      recentIncidents: ['Aucun incident critique', 'Contrôles réglementaires ARCA validés']
    },
    {
      code: 'AOL',
      name: 'Angola',
      capital: 'Luanda',
      status: 'attention',
      tenantsCount: 7,
      mrr: '84 200 $',
      lossRatio: 68.1,
      complianceScore: 85,
      recentIncidents: ['Surcharge temporaire sur le réseau tpa-mobile', 'Niveau ARIST-AO en cours de mise à niveau']
    },
    {
      code: 'COG',
      name: 'Congo-Brazzaville',
      capital: 'Brazzaville',
      status: 'operational',
      tenantsCount: 6,
      mrr: '41 900 $',
      lossRatio: 35.2,
      complianceScore: 100,
      recentIncidents: ['Aucun incident signalé', 'Temps de réponse de la passerelle MT-Brazza régularisé']
    },
    {
      code: 'CIV',
      name: 'Côte d\'Ivoire',
      capital: 'Abidjan',
      status: 'audit',
      tenantsCount: 9,
      mrr: '112 000 $',
      lossRatio: 51.0,
      complianceScore: 45,
      recentIncidents: ['Audit de certification ASCOMA requis', 'Différé de paiement mobile money en cours d\'intégration']
    },
    {
      code: 'SEN',
      name: 'Sénégal',
      capital: 'Dakar',
      status: 'critical',
      tenantsCount: 4,
      mrr: '29 800 $',
      lossRatio: 78.4,
      complianceScore: 60,
      recentIncidents: ['Incident de latence critique (API GIMAC)', '3 alertes de non-conformité réglementaire détectées']
    }
  ];

  // Visual coordinates for SVG layout simulating Africa's geographic center lines.
  // These represent the positions on our beautiful high-tech grid.
  const nodes = [
    { code: 'SEN', x: '18%', y: '30%', label: 'Sénégal' },
    { code: 'CIV', x: '35%', y: '45%', label: 'Côte d\'Ivoire' },
    { code: 'COG', x: '58%', y: '68%', label: 'Congo-Brazza' },
    { code: 'RDC', x: '68%', y: '72%', label: 'RDC (Kinshasa)' },
    { code: 'AOL', x: '63%', y: '84%', label: 'Angola' },
  ];

  const getStatusColor = (status: CountryDetail['status']) => {
    switch (status) {
      case 'operational': return 'bg-emerald-500 shadow-emerald-500/50 text-emerald-400 border-emerald-500/30';
      case 'attention': return 'bg-amber-500 shadow-amber-500/50 text-amber-400 border-amber-500/30';
      case 'audit': return 'bg-indigo-500 shadow-indigo-500/50 text-indigo-400 border-indigo-500/30';
      case 'critical': return 'bg-rose-500 shadow-rose-500/50 text-rose-500 border-rose-500/30';
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col min-h-[500px]">
      <div className="flex items-center justify-between mb-6 border-b border-slate-800 pb-4">
        <div>
          <h4 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
            <MapIcon className="w-4 h-4 text-red-500" /> Cartographie Réseau NeoGTec Africa
          </h4>
          <p className="text-[10px] text-slate-500 font-mono mt-1">
            Visualisation géolocalisée multi-filiales &amp; taux d'activité par pays
          </p>
        </div>
        <div className="flex gap-2 text-[8px] font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Opérationnel
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> Attention
          </span>
          <span className="flex items-center gap-1 text-indigo-400">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Audit
          </span>
        </div>
      </div>

      {/* Main Map Visual Box */}
      <div className="flex-1 relative bg-slate-950/40 border border-slate-800/60 rounded-2xl overflow-hidden min-h-[350px]">
        {/* Geometric High-Tech Grid Backing */}
        <div className="absolute inset-0 bg-radial-grid opacity-20" />
        
        {/* Simplified Futuristic Contour of Africa (Embedded high fidelity SVG geometry representation) */}
        <div className="absolute inset-x-8 inset-y-4 flex items-center justify-center opacity-30 select-none pointer-events-none">
          <svg className="w-full h-full max-w-sm max-h-[300px]" viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M 23 15 Q 12 30 14 42 T 26 55 T 45 62 Q 55 70 56 82 T 58 110 T 63 118 T 68 110 Q 75 92 78 85 T 85 62 T 80 48 T 68 38 T 58 28 T 42 12 T 23 15" 
              stroke="rgba(99, 102, 241, 0.4)" 
              strokeWidth="1.5" 
              strokeDasharray="4 3"
              fill="rgba(99, 102, 241, 0.03)" 
            />
          </svg>
        </div>

        {/* Dynamic Nodes Grid Overlay */}
        {nodes.map((node) => {
          const detail = countries.find(c => c.code === node.code);
          if (!detail) return null;
          
          const statusColor = getStatusColor(detail.status);
          
          return (
            <div 
              key={node.code}
              style={{ left: node.x, top: node.y }} 
              className="absolute -translate-x-1/2 -translate-y-1/2 group"
            >
              {/* Pulse effect wrapper */}
              <div className="relative">
                <span className={cn(
                  "absolute inset-0 w-8 h-8 -left-2 -top-2 rounded-full opacity-35 animate-ping",
                  detail.status === 'operational' ? 'bg-emerald-500' : 
                  detail.status === 'attention' ? 'bg-amber-500' :
                  detail.status === 'audit' ? 'bg-indigo-500' : 'bg-rose-500'
                )} />
                
                <button
                  onClick={() => setSelectedCountry(detail)}
                  className={cn(
                    "relative w-4 h-4 rounded-full border-2 border-slate-900 cursor-pointer flex items-center justify-center shadow-lg transition-transform hover:scale-125 hover:ring-4 hover:ring-indigo-500/20 active:scale-90",
                    detail.status === 'operational' ? 'bg-emerald-500' : 
                    detail.status === 'attention' ? 'bg-amber-500' :
                    detail.status === 'audit' ? 'bg-indigo-500' : 'bg-rose-500'
                  )}
                  title={`Voir l'entité ${node.label}`}
                />
              </div>

              {/* Tag tooltip label */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-slate-950 text-white border border-slate-800 rounded-lg px-2 py-0.5 text-[8px] font-black uppercase whitespace-nowrap scale-90 opacity-60 group-hover:scale-100 group-hover:opacity-100 pointer-events-none transition-all">
                {node.label}
              </div>
            </div>
          );
        })}

        {/* Visual Map HUD info overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-950/80 border border-slate-800/80 rounded-xl p-3 text-[9px] font-mono text-slate-400 space-y-1">
          <p className="text-white font-black uppercase text-[10px]">Statut Backbone</p>
          <div className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>5 Nœuds Nationaux actifs</span>
          </div>
          <p className="opacity-65">MRR Réseau : 411 300 $</p>
        </div>
      </div>

      {/* 🟢 SLIDING OVERLAY SHEET FOR DETAILED METRICS BY COUNTRY */}
      <AnimatePresence>
        {selectedCountry && (
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="absolute right-0 top-0 bottom-0 w-80 bg-slate-950/95 backdrop-blur-md border-l border-slate-800 p-6 z-[100] flex flex-col text-slate-300 shadow-2xl h-full"
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-5">
              <div>
                <span className="text-[9px] font-bold text-red-500 font-mono tracking-widest uppercase">Inspecter la filiale</span>
                <h5 className="text-base font-black text-white uppercase leading-tight mt-1">{selectedCountry.name}</h5>
                <span className="text-[10px] font-mono text-slate-500 italic">Chef-lieu: {selectedCountry.capital}</span>
              </div>
              <button 
                onClick={() => setSelectedCountry(null)}
                className="p-1 px-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto custom-scrollbar pr-1 pb-6">
              
              {/* Regional status block */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <span className={cn(
                  "w-3 h-3 rounded-full animate-ping shrink-0",
                  selectedCountry.status === 'operational' ? 'bg-emerald-500' :
                  selectedCountry.status === 'attention' ? 'bg-amber-500' :
                  selectedCountry.status === 'audit' ? 'bg-indigo-500' : 'bg-rose-500'
                )} />
                <div>
                  <span className="text-[8px] font-black uppercase text-slate-500 font-mono block">Statut Actuel</span>
                  <span className="text-xs font-black uppercase text-white tracking-widest">
                    {selectedCountry.status}
                  </span>
                </div>
              </div>

              {/* Data points bento */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                  <span className="text-[8px] text-slate-500 font-mono uppercase block">Adhérents Locaux</span>
                  <span className="text-sm font-extrabold text-white font-mono">{selectedCountry.tenantsCount} Locataires</span>
                </div>
                <div className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/40">
                  <span className="text-[8px] text-slate-500 font-mono uppercase block">MRR Régional</span>
                  <span className="text-sm font-extrabold text-emerald-400 font-mono">{selectedCountry.mrr}</span>
                </div>
              </div>

              {/* Loss ratio gauge line */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                  <span>Sinistralité (Loss Ratio)</span>
                  <span className={cn(
                    "font-bold",
                    selectedCountry.lossRatio > 65 ? "text-red-400" : "text-emerald-400"
                  )}>{selectedCountry.lossRatio}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${selectedCountry.lossRatio}%` }} 
                    className={cn(
                      "h-full rounded-full",
                      selectedCountry.lossRatio > 65 ? "bg-red-500" : "bg-emerald-500"
                    )}
                  />
                </div>
              </div>

              {/* Compliance score value */}
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800/40 space-y-2">
                <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                  <span>Conformité Régulateur</span>
                  <span className="font-bold text-indigo-400">{selectedCountry.complianceScore}%</span>
                </div>
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div 
                    style={{ width: `${selectedCountry.complianceScore}%` }} 
                    className="h-full bg-indigo-500 rounded-full"
                  />
                </div>
              </div>

              {/* Incidents logs */}
              <div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest font-mono block mb-2">Piste d'audit filiale</span>
                <div className="space-y-1.5">
                  {selectedCountry.recentIncidents.map((inc, index) => (
                    <div key={index} className="flex gap-2 p-2.5 bg-slate-900 rounded-xl border border-slate-850 text-[10px] items-start">
                      <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span className="font-medium text-slate-350 leading-tight">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-slate-900">
              <button 
                onClick={() => alert(`Navigation approfondie vers la console de l'entité ${selectedCountry.code}`)}
                className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow"
              >
                <span>Accéder au routage de la filiale</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
