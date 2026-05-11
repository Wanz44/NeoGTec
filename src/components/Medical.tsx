import React from 'react';
import { motion } from 'motion/react';
import { Users, UserPlus, Search, MoreHorizontal, FileText, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export const Medical: React.FC = () => {
  const users = [
    { name: 'N/A', age: 0, id: 'USER-001', status: 'Inactif', risk: 'Faible' },
    { name: 'N/A', age: 0, id: 'USER-002', status: 'Inactif', risk: 'Faible' },
    { name: 'N/A', age: 0, id: 'USER-003', status: 'Inactif', risk: 'Faible' }
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Assurés & Médical</h2>
          <p className="text-slate-500 font-medium text-sm">Base de données des dossiers médicaux et gestion des adhérents.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 text-white rounded-[10px] font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95">
          <UserPlus className="w-4 h-4" />
          Nouvel Adhérent
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="material-mica p-4 flex items-center gap-3 rounded-[12px] border border-white/20">
            <Search className="w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Rechercher un dossier par nom, numéro de sécurité sociale..." 
              className="flex-1 bg-transparent border-none outline-none text-sm font-medium text-orange-950 placeholder:text-slate-400"
            />
          </div>

          <div className="material-mica rounded-fluent border border-white/20 overflow-hidden shadow-inner">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-black/[0.01] text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-black/[0.03]">
                  <th className="px-6 py-4">Adhérent</th>
                  <th className="px-6 py-4">ID / Âge</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Risque</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.02]">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-white/40 transition-colors cursor-pointer group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-[10px]">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <p className="text-[12px] font-bold text-orange-950">{user.name}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[11px] font-bold text-slate-500">{user.id}</p>
                      <p className="text-[10px] font-medium text-slate-400">{user.age} ans</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[9px] font-bold px-2 py-0.5 rounded-full border",
                        user.status === 'Actif' ? "text-emerald-600 bg-emerald-50 border-emerald-100" : "text-slate-400 bg-slate-50 border-slate-100"
                      )}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          user.risk === 'Faible' ? "bg-emerald-500" : user.risk === 'Modéré' ? "bg-orange-400" : "bg-rose-500"
                        )} />
                        <span className="text-[10px] font-bold text-slate-600 uppercase">{user.risk}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <MoreHorizontal className="w-4 h-4 text-slate-300 ml-auto" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="fluent-card p-6">
            <h3 className="text-sm font-bold text-orange-950 uppercase tracking-widest mb-6 flex items-center gap-2">
              <Activity className="w-4 h-4 text-orange-500" />
              Indicateurs Santé
            </h3>
            <div className="space-y-6">
              {[
                { label: 'Taux de Couverture', value: '0%', change: '0%' },
                { label: 'Indice de Risque Global', value: '0.0', change: '0.0' },
                { label: 'Fréquentation Réseau', value: '0%', change: '0%' }
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between items-end mb-2">
                    <p className="text-[11px] font-bold text-slate-400 uppercase">{stat.label}</p>
                    <p className="text-[11px] font-bold text-orange-600">{stat.change}</p>
                  </div>
                  <p className="text-2xl font-black text-orange-950 leading-none">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="material-mica p-6 rounded-fluent border border-orange-100/20">
            <h3 className="text-sm font-bold text-orange-950 mb-4">Dernières Analyses AI</h3>
            <div className="space-y-3">
              {[
                'Aucune analyse en cours',
                'Système en attente de données',
                'Audit prêt pour nouveau cycle'
              ].map((note, i) => (
                <div key={i} className="flex gap-3 p-3 bg-white/40 rounded-[8px] border border-black/5">
                  <FileText className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-medium text-slate-600 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
