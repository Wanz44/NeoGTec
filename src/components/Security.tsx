import React from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldAlert, Key, UserCheck, Eye, RefreshCw } from 'lucide-react';

export const Security: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Sécurité & Accès</h2>
        <p className="text-slate-500 font-medium text-sm">Gestion des rôles RBAC, clés API et journaux d'accès sensibles.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="material-mica p-6 rounded-fluent">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-rose-50 rounded-[12px] flex items-center justify-center text-rose-500">
                      <ShieldAlert className="w-5 h-5" />
                   </div>
                   <div>
                      <h3 className="text-sm font-bold text-orange-950 uppercase tracking-widest">Contrôle d'Accès Multi-Tenant</h3>
                      <p className="text-[11px] font-medium text-slate-400">Strict isolation active (EAL4+)</p>
                   </div>
                </div>
                <button className="p-2 border border-black/5 rounded-[8px] bg-white hover:bg-slate-50 transition-all text-slate-400">
                   <RefreshCw className="w-4 h-4" />
                </button>
             </div>

             <div className="space-y-3">
                {[
                  { role: 'Admin Système', users: 0, badge: 'bg-rose-500', permissions: 'Full Root' },
                  { role: 'Gestionnaire Sinistres', users: 0, badge: 'bg-orange-500', permissions: 'Read/Write' },
                  { role: 'Auditeur Externe', users: 0, badge: 'bg-blue-500', permissions: 'Read Only' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/50 border border-black/5 rounded-[12px] hover:border-orange-200 transition-colors cursor-pointer group">
                     <div className="flex items-center gap-4">
                        <div className={`w-1.5 h-8 rounded-full ${item.badge}`} />
                        <div>
                           <p className="text-[13px] font-bold text-orange-950">{item.role}</p>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.users} Utilisateurs • {item.permissions}</p>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors"><Eye className="w-4 h-4" /></button>
                        <button className="p-2 text-slate-400 hover:text-orange-500 transition-colors"><Lock className="w-4 h-4" /></button>
                     </div>
                  </div>
                ))}
             </div>
          </div>

          <div className="material-mica p-6 rounded-fluent">
             <h3 className="text-sm font-bold text-orange-950 mb-6 uppercase tracking-widest">Logs d'Authentification (Dernières 24h)</h3>
             <div className="space-y-1">
                {[
                  { user: '---', ip: '---', time: '--:--:--', action: 'En attente', danger: false },
                  { user: '---', ip: '---', time: '--:--:--', action: 'En attente', danger: false },
                  { user: '---', ip: '---', time: '--:--:--', action: 'En attente', danger: false }
                ].map((log, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-[8px] text-[11px] font-medium ${log.danger ? 'bg-rose-500/5 text-rose-600' : 'text-slate-500 hover:bg-black/[0.02]'}`}>
                     <div className="flex items-center gap-3">
                        <span className="w-12 font-bold opacity-40">{log.time}</span>
                        <span className="font-bold">{log.user}</span>
                        <span className="hidden md:inline opacity-60">({log.ip})</span>
                     </div>
                     <span className={`font-bold ${log.danger ? 'text-rose-600' : 'text-slate-400'}`}>{log.action}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        <div className="space-y-6">
           <div className="fluent-card p-6 border-rose-100 bg-rose-50/20">
              <Key className="w-8 h-8 text-rose-500 mb-6" />
              <h4 className="text-sm font-bold text-orange-950 mb-2">Clés API Secrètes</h4>
              <p className="text-[11px] font-medium text-slate-500 mb-6 leading-relaxed">
                 Générer des tokens de serveurs pour l'intégration de vos services tiers. 
                 <span className="font-bold text-rose-600"> Attention : ces clés ne doivent jamais être exposées côté client.</span>
              </p>
              <button className="w-full py-2.5 bg-rose-600 text-white rounded-[8px] font-bold text-[12px] shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all active:scale-95">
                 Générer Nouveau Token
              </button>
           </div>

           <div className="material-mica p-6 rounded-fluent">
              <div className="flex items-center gap-2 mb-4">
                 <UserCheck className="w-4 h-4 text-emerald-500" />
                 <h3 className="text-sm font-bold text-orange-950">Vérification 2FA</h3>
              </div>
              <div className="flex justify-between items-center bg-slate-50 p-3 rounded-[10px] border border-slate-100">
                 <p className="text-[11px] font-bold text-slate-400 uppercase">Statut Global</p>
                 <span className="text-[11px] font-black text-emerald-600">INACTIF (0%)</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
