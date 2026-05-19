/**
 * 📄 Fichier : /src/frontend/components/integrations/RDCConnect.tsx
 * 🎯 Objectif : Hub d'interopérabilité (SNIS-RDC, DHIS2, État Civil).
 */
import React from 'react';
import { 
  Globe, Share2, Database, ShieldCheck, 
  RefreshCcw, AlertCircle, Info, Landmark,
  Zap, ArrowRight, CheckCircle2, Server,
  Lock, Activity, Users
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

export const RDCConnect: React.FC = () => {
  return (
    <div className="space-y-10 max-w-7xl mx-auto">
       {/* Connectivity Banner */}
       <div className="p-12 bg-slate-950 rounded-[64px] text-white shadow-2xl relative overflow-hidden group border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-1000" />
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          
          <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
             <div className="w-28 h-28 bg-white/5 rounded-[40px] border border-white/10 flex items-center justify-center ring-[24px] ring-white/5 shadow-2xl shrink-0 group-hover:rotate-6 transition-transform">
                <Globe className="w-14 h-14 text-white" />
             </div>
             <div className="flex-1 space-y-4 text-center md:text-left">
                <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">Hub National d'Interopérabilité</h2>
                <p className="text-sm font-bold text-white/50 italic leading-relaxed max-w-2xl">
                   Connectez AfreakCare au Système National d'Information Sanitaire (SNIS-RDC) et aux registres d'État Civil pour une authentification et une transmission de données instantanée.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 pt-2">
                   <div className="flex items-center gap-3 py-1.5 px-4 bg-emerald-500/10 rounded-full border border-emerald-500/20">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-emerald-400">Nodes RDC Online</span>
                   </div>
                   <div className="flex items-center gap-3 py-1.5 px-4 bg-indigo-500/10 rounded-full border border-indigo-500/20">
                      <Zap className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-400">API Latence : 42ms</span>
                   </div>
                </div>
             </div>
             <button className="px-10 py-5 bg-white text-slate-950 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl hover:scale-105 transition-all shrink-0">
                Audit de Connexion
             </button>
          </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Connector Cards */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
             {[
               { id: 'SNIS', name: 'SNIS-RDC', desc: 'Transmission automatisée des indicateurs sanitaires nationaux.', icon: Landmark, status: 'Connecté' },
               { id: 'DHIS2', name: 'DHIS2 Integration', desc: 'Synchronisation des données épidémiologiques et statistiques.', icon: Database, status: 'Connecté' },
               { id: 'CIVIL', name: 'État Civil RDC', desc: 'Vérification en temps réel de l\'identité et des liens familiaux.', icon: Users, status: 'Maintenance' },
               { id: 'ARCA', name: 'Régulation ARCA', desc: 'Exports réglementaires et rapports de solvabilité obligatoires.', icon: ShieldCheck, status: 'Connecté' },
             ].map((node, i) => (
                <div key={i} className="group bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all flex flex-col justify-between">
                   <div className="space-y-6">
                      <div className="flex justify-between items-start">
                         <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center border border-slate-100 group-hover:bg-indigo-50 transition-all">
                            <node.icon className="w-8 h-8 text-slate-300 group-hover:text-indigo-600 transition-all" />
                         </div>
                         <span className={cn(
                           "text-[8px] font-black uppercase italic tracking-[0.2em] px-3 py-1 rounded-full",
                           node.status === 'Connecté' ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                         )}>
                            {node.status}
                         </span>
                      </div>
                      <div>
                         <h4 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase">{node.name}</h4>
                         <p className="text-[11px] font-bold text-slate-400 mt-2 leading-relaxed italic">{node.desc}</p>
                      </div>
                   </div>
                   <div className="mt-8 pt-8 border-t border-slate-50 flex items-center justify-between">
                      <button className="flex items-center gap-2 text-indigo-600 text-[10px] font-black uppercase tracking-widest italic group-hover:underline">
                         Configurer <ArrowRight className="w-4 h-4" />
                      </button>
                      <RefreshCcw className="w-4 h-4 text-slate-200 group-hover:rotate-180 transition-transform duration-700" />
                   </div>
                </div>
             ))}
          </div>

          {/* Infrastructure Health */}
          <div className="space-y-8">
             <div className="p-10 bg-indigo-600 rounded-[56px] text-white shadow-2xl space-y-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:rotate-12 transition-transform duration-1000">
                   <Server className="w-32 h-32" />
                </div>
                <h4 className="text-[11px] font-black text-indigo-200 uppercase tracking-[0.3em] italic relative z-10">System Infrastructure</h4>
                <div className="space-y-8 relative z-10">
                   <div className="space-y-3">
                      <div className="flex justify-between items-end">
                         <p className="text-[9px] font-black uppercase italic">Uptime Serveur Gateway</p>
                         <p className="text-xl font-black italic">99.99%</p>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="w-[99.99%] h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      </div>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between items-end">
                         <p className="text-[9px] font-black uppercase italic">Intégrité Blockchain Ledger</p>
                         <p className="text-xl font-black italic">Vérifié</p>
                      </div>
                      <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                         <div className="w-full h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                      </div>
                   </div>
                </div>
                <button className="w-full py-5 bg-white text-indigo-600 rounded-[2rem] font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all relative z-10">
                   Journal d'Authentification
                </button>
             </div>

             <div className="p-10 bg-white border border-slate-100 rounded-[56px] shadow-sm flex flex-col items-center text-center gap-6 group">
                <div className="w-16 h-16 bg-slate-50 rounded-[28px] flex items-center justify-center border border-slate-100 group-hover:scale-110 transition-transform">
                   <Lock className="w-8 h-8 text-indigo-600" />
                </div>
                <div className="space-y-2">
                   <h4 className="text-xs font-black text-slate-900 uppercase italic">Protocoles Sécurisés</h4>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-relaxed">
                      Utilise OAuth 2.0 & JWT avec<br/>
                      <span className="text-slate-900 font-black">Mutual TLS (mTLS)</span>
                   </p>
                </div>
             </div>
          </div>
       </div>
    </div>
  );
};
