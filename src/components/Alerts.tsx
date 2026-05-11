import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, Bell, Zap, Clock, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { cn } from '../lib/utils';

export const Alerts: React.FC = () => {
  const alerts = [
    { id: 'AL-000', level: 'Info', title: 'Système en attente de données', time: '---', type: 'Infrastructure' }
  ];

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Alertes Critiques</h2>
          <p className="text-slate-500 font-medium text-sm">Gestion des notifications système haute-priorité.</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 bg-orange-500 text-white rounded-[8px] font-bold text-xs shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95">
              Marquer tout comme lu
           </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
           <AnimatePresence>
              {alerts.map((alert, idx) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: idx * 0.1 }}
                  className={cn(
                    "material-mica p-5 rounded-fluent flex items-start gap-5 border shadow-sm group cursor-pointer hover:shadow-md transition-all",
                    alert.level === 'Critique' ? "border-rose-200/50 bg-rose-500/[0.02]" : "border-white/20"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0",
                    alert.level === 'Critique' ? "bg-rose-100 text-rose-500" : 
                    alert.level === 'Warning' ? "bg-orange-100 text-orange-500" : "bg-blue-100 text-blue-500"
                  )}>
                    {alert.level === 'Critique' ? <ShieldAlert className="w-6 h-6" /> : <Bell className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                     <div className="flex justify-between items-start mb-1">
                        <span className={cn(
                          "text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-full",
                          alert.level === 'Critique' ? "text-rose-600 border border-rose-100 bg-rose-50" : 
                          alert.level === 'Warning' ? "text-orange-600 border border-orange-100 bg-orange-50" : "text-blue-600 border border-blue-100 bg-blue-50"
                        )}>
                           {alert.level}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                           <Clock className="w-3 h-3" /> {alert.time}
                        </span>
                     </div>
                     <h3 className="text-[14px] font-bold text-orange-950 mb-1">{alert.title}</h3>
                     <p className="text-[11px] font-medium text-slate-500 uppercase tracking-tighter">ID: {alert.id} • Catégorie: {alert.type}</p>
                  </div>
                  <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button className="p-2 bg-white rounded-[8px] border border-black/5 hover:bg-slate-50 transition-all text-emerald-500">
                        <CheckCircle2 className="w-4 h-4" />
                     </button>
                     <button className="p-2 bg-white rounded-[8px] border border-black/5 hover:bg-slate-50 transition-all text-slate-400">
                        <MoreHorizontal className="w-4 h-4" />
                     </button>
                  </div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>

        <div className="space-y-6">
           <div className="fluent-card p-6 bg-orange-950 text-white border-none shadow-2xl relative overflow-hidden">
              <Zap className="w-12 h-12 text-orange-500 absolute -bottom-4 -right-4 opacity-20 rotate-12" />
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 opacity-60">Status de l'infrastructure</h3>
              <div className="space-y-6">
                 {[
                   { label: 'Latency', value: '0ms', status: 'Optimal' },
                   { label: 'Error Rate', value: '0.00%', status: 'Optimal' },
                   { label: 'Throughput', value: '0 rps', status: 'Optimal' }
                 ].map(metric => (
                   <div key={metric.label}>
                      <div className="flex justify-between items-end mb-1">
                         <span className="text-[11px] font-bold opacity-50 uppercase">{metric.label}</span>
                         <span className="text-[11px] font-black text-orange-400">{metric.status}</span>
                      </div>
                      <p className="text-2xl font-black">{metric.value}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="material-mica p-6 rounded-fluent border border-orange-100/30">
              <h4 className="text-[11px] font-bold text-orange-950 uppercase tracking-widest mb-4">Alerte Push (Mobile)</h4>
              <div className="flex items-center gap-4">
                 <div className="flex-1">
                    <p className="text-[12px] font-bold text-slate-700">Activé pour 8/10 admins</p>
                    <p className="text-[10px] font-medium text-slate-400">Redirection SMS active si Offline</p>
                 </div>
                 <div className="w-10 h-5 bg-orange-500 rounded-full relative p-1 flex items-center justify-end">
                    <div className="w-3 h-3 bg-white rounded-full shadow-sm" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};
