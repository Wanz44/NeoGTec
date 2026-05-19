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
  Download, // Action d'export
  Activity
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
  { name: 'Lun', value: 420 },
  { name: 'Mar', value: 380 },
  { name: 'Mer', value: 510 },
  { name: 'Jeu', value: 440 },
  { name: 'Ven', value: 590 },
  { name: 'Sam', value: 210 },
  { name: 'Dim', value: 180 },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Section En-tête du Dashboard */}
      <header className="flex items-center justify-between">
        <div>
           <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
              Tableau de Bord <Activity className="w-8 h-8 text-green-500 fill-green-500/10" />
           </h2>
          <p className="text-green-950/40 font-medium tracking-tight uppercase tracking-tight italic underline decoration-green-200 underline-offset-4 decoration-2">Bienvenue sur votre espace de pilotage AssurAdvancé.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-sm border border-green-200 text-green-900 text-sm font-black uppercase tracking-widest hover:bg-green-50 transition-all">
            <Filter className="w-4 h-4" />
            Filtrer
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 rounded-lg shadow-lg shadow-green-600/30 text-white text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all outline-none border border-green-700">
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
            className="fluent-card p-5 group cursor-default rounded-lg border border-green-200 bg-white shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest underline decoration-slate-200 decoration-2 underline-offset-4">{metric.label}</span>
              <div className={cn(
                "p-2 rounded-md flex items-center gap-1 transition-colors border",
                metric.trend === 'up' ? "bg-emerald-50 text-emerald-600 border-emerald-200" : "bg-rose-50 text-rose-600 border-rose-200"
              )}>
                {metric.trend === 'up' ? <ArrowUpRight className="w-3.5 h-3.5 shadow-sm" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
              </div>
            </div>
            <div className="flex items-end gap-3">
              <h4 className="text-2xl font-black text-green-950 tracking-tighter group-hover:text-green-600 transition-colors">{metric.value}</h4>
              <span className={cn(
                "text-[10px] font-black mb-1 px-1.5 py-0.5 rounded-full border uppercase italic tracking-tighter",
                metric.trend === 'up' ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-rose-600 bg-rose-50 border-rose-100"
              )}>
                {metric.trend === 'up' ? '+' : ''}{metric.change}%
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Graphique : Activité des Réclamations */}
        <div className="lg:col-span-2 material-mica p-6 rounded-lg border border-green-200 shadow-sm bg-white">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center gap-2">
                <div className="w-1.5 h-5 bg-green-600 rounded-full shadow-[0_0_8px_rgba(22,163,74,0.3)]" />
                <h3 className="text-[10px] font-black text-green-950 uppercase tracking-widest italic">Activité des Réclamations</h3>
             </div>
            <select className="bg-green-50/50 border border-green-300 text-[10px] font-black text-green-950/60 rounded-md px-3 py-1.5 outline-none focus:ring-2 focus:ring-green-200 shadow-sm uppercase tracking-widest transition-all">
              <option>7 derniers jours</option>
              <option>30 derniers jours</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ba32c" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#4ba32c" stopOpacity={0}/>
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
                <Area type="monotone" dataKey="value" stroke="#4ba32c" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" dot={{ r: 4, fill: '#4ba32c', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Section Actions Rapides / List Refined */}
        <div className="flex flex-col gap-4">
          <div className="material-mica p-6 rounded-lg border border-green-200 flex-1 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-[12px] font-black text-green-950/40 uppercase tracking-[0.15em] italic">Derniers Sinistres</h3>
              <MoreHorizontal className="w-4 h-4 text-green-300 cursor-pointer" />
            </div>
            <div className="space-y-3">
              {MOCK_CLAIMS.map((claim) => (
                <div key={claim.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-green-50/50 transition-all cursor-pointer border border-transparent hover:border-green-200 group">
                  <div className={cn(
                    "w-1.5 h-4 rounded-full shadow-sm",
                    claim.status === 'Approuvé' ? "bg-emerald-400" : 
                    claim.status === 'En attente' ? "bg-green-400" :
                    claim.status === 'Payé' ? "bg-green-600" : "bg-rose-400"
                  )} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-black text-green-950 truncate leading-tight mb-0.5 uppercase">{claim.user}</p>
                    <p className="text-[9px] font-black text-green-700/50 truncate uppercase tracking-tighter italic">#{claim.id} • {claim.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] font-black text-green-950 leading-tight mb-0.5">{claim.amount}</p>
                    <span className={cn(
                      "text-[8px] font-black px-1.5 py-0.5 rounded-full border uppercase tracking-tighter italic",
                      claim.status === 'Approuvé' ? "text-emerald-600 bg-emerald-50 border-emerald-100" : 
                      claim.status === 'En attente' ? "text-green-600 bg-green-50 border-green-100" :
                      claim.status === 'Payé' ? "text-green-700 bg-green-50 border-green-200" : "text-rose-600 bg-rose-50 border-rose-100"
                    )}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-6 w-full py-2.5 text-[10px] font-black text-green-600 bg-green-50/50 rounded-md hover:bg-green-100 transition-all border border-green-300 uppercase tracking-widest italic shadow-sm">
              Explorer tout l'historique
            </button>
          </div>

          <div className="material-mica p-6 rounded-lg border border-green-200 overflow-hidden relative shadow-sm bg-white">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-green-950/40 uppercase mb-3 tracking-widest italic text-center">Quota Cloud System</p>
              <div className="flex justify-between items-end mb-2">
                <p className="text-lg font-black text-green-950 leading-none">64% <span className="text-[10px] font-black text-slate-400 italic">utilisé</span></p>
                <p className="text-[9px] font-black text-green-600 uppercase tracking-widest cursor-pointer hover:underline">Détails →</p>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '64%' }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-green-400 to-green-600 shadow-[0_0_8px_rgba(22,163,74,0.3)]"
                />
              </div>
            </div>
            <div className="absolute top-[-10%] right-[-10%] w-20 h-20 bg-green-500/5 blur-xl rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};
