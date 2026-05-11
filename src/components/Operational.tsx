/**
 * 📄 Fichier : /src/components/Operational.tsx
 * 🎯 Objectif : Gestion et suivi opérationnel des réclamations et sinistres santé.
 * 🔗 Liens : Module N°4. Interagit avec /src/constants.ts pour les données d'historique. 
 */

import React from 'react'; // Bibliothèque UI
import { motion } from 'motion/react'; // Bibliothèque d'animation | 🔗 Fichier lié: package.json
import { 
  FileText, // Icône pour les dossiers de sinistres
  CheckCircle2, // Icône pour les validations terminées
  AlertCircle, // Icône pour les dossiers en erreur ou suspicieux
  Clock, // Icône pour les délais de traitement
  ArrowRight, // Icône d'accès aux détails
  Search, // Icône pour le filtrage local
  Upload // Icône pour l'import groupé
} from 'lucide-react'; // Bibliothèque d'icônes
import { MOCK_CLAIMS } from '../constants'; // Données simulées | 🔗 Fichier lié: /src/constants.ts
import { cn } from '../lib/utils'; // Gestion conditionnelle des styles Tailwind | 🔗 Fichier lié: /src/lib/utils.ts

export const Operational: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* En-tête Module 4 */}
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Gestion Opérationnelle</h2>
          <p className="text-slate-500 font-medium text-sm">Traitement intelligent des sinistres et suivi des remboursements.</p>
        </div>
        <div className="flex gap-1 material-acrylic p-1 rounded-[10px] border border-black/[0.03]">
           <button className="px-4 py-1.5 bg-white shadow-sm text-[11px] font-bold text-orange-600 rounded-[8px] outline-none">Sinistres</button>
           <button className="px-4 py-1.5 text-[11px] font-bold text-slate-400 hover:text-orange-600 transition-colors outline-none">Tiers Payant</button>
        </div>
      </header>

      {/* Compteurs opérationnels rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {[
          { label: 'Nouveaux', count: 0, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'En Cours', count: 0, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Approuvés', count: 0, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'À Vérifier', count: 0, icon: AlertCircle, color: 'text-rose-500', bg: 'bg-rose-50' }
        ].map((stat) => (
          <div key={stat.label} className="fluent-card p-4 flex items-center gap-4 group cursor-default">
            <div className={cn("p-2.5 rounded-[10px] transition-transform group-hover:scale-110", stat.bg)}>
              <stat.icon className={cn("w-4 h-4", stat.color)} />
            </div>
            <div>
              <p className="text-xl font-bold text-orange-950 leading-none mb-1">{stat.count}</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tableau Principal des Réclamations */}
      <div className="material-mica rounded-fluent border border-white/20 overflow-hidden flex flex-col shadow-inner">
        <div className="px-6 py-4 border-b border-black/[0.03] flex items-center justify-between material-acrylic">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative flex-1 max-w-xs group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-orange-400 group-focus-within:text-orange-600 transition-colors" />
                <input 
                  placeholder="Filtrer n° sinistre..." 
                  className="w-full pl-9 pr-4 py-2 bg-white/40 border border-black/5 rounded-[8px] text-[12px] font-medium outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all placeholder:text-slate-400" 
                />
             </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-orange-600 hover:bg-orange-50 rounded-[8px] transition-all outline-none border border-transparent hover:border-orange-100">
            <Upload className="w-3.5 h-3.5" /> Import Batch
          </button>
        </div>
        
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-black/[0.01] text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] border-b border-black/[0.03]">
                <th className="px-6 py-4 font-bold">ID Dossier</th>
                <th className="px-6 py-4 font-bold">Bénéficiaire</th>
                <th className="px-6 py-4 font-bold">Worklow Status</th>
                <th className="px-6 py-4 font-bold">Sollicité</th>
                <th className="px-6 py-4 text-right font-bold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/[0.02]">
              {MOCK_CLAIMS.map((claim) => (
                <tr key={claim.id} className="hover:bg-white/40 transition-colors group cursor-pointer animate-in fade-in slide-in-from-left-2 duration-300">
                  <td className="px-6 py-4 text-[12px] font-bold text-orange-950/70">{claim.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-[12px] font-bold text-orange-950 leading-tight mb-0.5">{claim.user}</p>
                    <p className="text-[9px] font-medium text-orange-500/70 uppercase tracking-tight">Prestation Santé</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-full border shadow-sm",
                      claim.status === 'Approuvé' ? "text-emerald-600 bg-emerald-50 border-emerald-100" : 
                      claim.status === 'En attente' ? "text-orange-600 bg-orange-50 border-orange-100" :
                      claim.status === 'Payé' ? "text-blue-600 bg-blue-50 border-blue-100" : "text-rose-600 bg-rose-50 border-rose-100"
                    )}>
                      {claim.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-bold text-orange-950">{claim.amount}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-1.5 text-orange-400 hover:text-white hover:bg-orange-500 rounded-[6px] transition-all opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 outline-none shadow-orange-500/20 hover:shadow-lg">
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
