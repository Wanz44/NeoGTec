/**
 * 📄 Fichier : /src/components/Dashboard.tsx
 * 🎯 Objectif : Visualisation synthétique des performances et activités de l'assurance.
 * 🔗 Liens : Injecté dans /src/App.tsx, consomme les constantes de /src/constants.ts
 */

import React from 'react'; // Bibliothèque UI
import { motion } from 'motion/react'; // Animations de composants | 🔗 Fichier lié: package.json
import { MOCK_METRICS, MOCK_CLAIMS } from '../constants'; // Données simulées | 🔗 Fichier lié: /src/constants.ts
import { cn } from '../lib/utils';
import { 
  ArrowUpRight, // Indicateur de tendance positive
  ArrowDownRight, // Indicateur de tendance negative
  MoreHorizontal, // Menu d'actions secondaires
  Plus, // Action d'ajout
  Filter, // Action de filtrage
  Download // Action d'export
} from 'lucide-react'; // Bibliothèque d'icônes
import { 
  AreaChart, // Graphique d'aire pour l'activité | 🔗 Module: recharts
  Area, // Définition de la couche de données du graphique
  XAxis, // Axe horizontal
  YAxis, // Axe vertical
  CartesianGrid, // Grille de fond
  Tooltip, // Affichage d'informations au survol
  ResponsiveContainer // Adaptabilité automatique à la largeur du parent
} from 'recharts'; // Bibliothèque de data-viz | 🔗 Fichier lié: package.json

// Données temporelles pour le graphique d'activité (Simulation)
const data = [
  { name: 'Lun', value: 0 },
  { name: 'Mar', value: 0 },
  { name: 'Mer', value: 0 },
  { name: 'Jeu', value: 0 },
  { name: 'Ven', value: 0 },
  { name: 'Sam', value: 0 },
  { name: 'Dim', value: 0 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Section En-tête du Dashboard */}
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-orange-950">Tableau de Bord</h2>
          <p className="text-orange-950/40 font-medium">Bienvenue sur votre espace de pilotage AssurAdvancé.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-orange-100 text-orange-900 text-sm font-semibold hover:bg-orange-50 transition-colors">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-orange-500 rounded-lg shadow-lg shadow-orange-200 text-white text-sm font-bold hover:bg-orange-600 transition-colors">
            <Plus className="w-4 h-4" />
            Nouveau Dossier
          </button>
        </div>
      </header>

      {/* Grille des indicateurs clés (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {MOCK_METRICS.map((metric, idx) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="fluent-card p-5 group cursor-default"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{metric.label}</span>
              <div className={cn(
                "p-2 rounded-sm flex items-center gap-1 transition-colors",
                metric.trend === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
              )}>
                {metric.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              </div>
            </div>
            <div className="flex items-end gap-3">
              <h4 className="text-2xl font-bold text-orange-950 tracking-tight group-hover:text-orange-600 transition-colors">{metric.value}</h4>
              <span className={cn(
                "text-[11px] font-bold mb-1 px-1.5 py-0.5 rounded-md",
                metric.trend === 'up' ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
              )}>
                {metric.trend === 'up' ? '+' : ''}{metric.change}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Graphique : Activité des Réclamations */}
        <div className="lg:col-span-2 material-mica p-6 rounded-fluent">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-orange-500 rounded-full" />
                <h3 className="text-sm font-bold text-orange-950 uppercase tracking-widest">Activité des Réclamations</h3>
             </div>
            <select className="bg-white/50 border border-black/5 text-[11px] font-bold text-orange-950/60 rounded-xs px-2 py-1 outline-none focus:ring-2 focus:ring-orange-200">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ff9800" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#ff9800" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#00000005" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 600}}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(0,0,0,0.05)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                    backdropFilter: 'blur(12px)',
                    fontSize: '11px',
                    fontWeight: 700
                  }} 
                />
                <Area type="monotone" dataKey="value" stroke="#ff9800" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 4, fill: '#ff9800', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Actions Rapides / List Refined */}
        <div className="flex flex-col gap-4">
          <div className="material-mica p-6 rounded-fluent border border-white/20 flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[12px] font-bold text-orange-950/40 uppercase tracking-[0.15em]">Derniers Sinistres</h3>
              <MoreHorizontal className="w-4 h-4 text-orange-300 cursor-pointer" />
            </div>
            <div className="space-y-3">
              {MOCK_CLAIMS.map((claim) => (
                <div key={claim.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-white/60 transition-all cursor-pointer border border-transparent hover:border-orange-100 group">
                  <div className={cn(
                    "w-1 h-3 rounded-full",
                    claim.status === 'Approuvé' ? "bg-emerald-400" : 
                    claim.status === 'En attente' ? "bg-orange-400" :
                    claim.status === 'Payé' ? "bg-blue-400" : "bg-rose-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-orange-950 truncate leading-tight mb-0.5">{claim.user}</p>
                    <p className="text-[9px] font-medium text-orange-700/50 truncate uppercase tracking-tighter">{claim.id} • {claim.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-orange-950 leading-tight mb-0.5">{claim.amount}</p>
                    <span className={cn(
                      "text-[8px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-tighter",
                      claim.status === 'Approuvé' ? "text-emerald-600 bg-emerald-50 border-emerald-100/50" : 
                      claim.status === 'En attente' ? "text-orange-600 bg-orange-50 border-orange-100/50" :
                      claim.status === 'Payé' ? "text-blue-600 bg-blue-50 border-blue-100/50" : "text-rose-600 bg-rose-50 border-rose-100/50"
                    )}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2.5 text-[11px] font-bold text-orange-600 bg-orange-50/50 rounded-sm hover:bg-orange-50 transition-all border border-orange-100/30">
              Explorer tout l'historique
            </button>
          </div>

          <div className="material-mica p-6 rounded-fluent border border-orange-100/20 overflow-hidden relative shadow-inner">
            <div className="relative z-10">
              <p className="text-[10px] font-bold text-orange-950/40 uppercase mb-3">Quota Cloud System</p>
              <div className="flex justify-between items-end mb-2">
                <p className="text-lg font-bold text-orange-950 leading-none">0% <span className="text-[11px] font-medium text-slate-400">utilisé</span></p>
                <p className="text-[10px] font-medium text-orange-600">Upgrade →</p>
              </div>
              <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '0%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-orange-400 to-orange-600 shadow-[0_0_8px_rgba(249,115,22,0.3)]"
                />
              </div>
            </div>
            <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-orange-500/5 blur-xl rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
