/**
 * 📄 Fichier : /src/frontend/components/SystemConfig.tsx
 * 🎯 Objectif : Monitoring système, Sauvegardes, Mises à jour & Accès Externes.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, Database, RefreshCw, Globe, Shield, 
  Cpu, Zap, HardDrive, Download, Upload,
  Terminal, AlertTriangle, CheckCircle2,
  Clock, Share2, Key, Server, Lock,
  FileJson, FileSpreadsheet, Eye, Trash2,
  Users, Settings
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer 
} from 'recharts';

type SystemTab = 'monitoring' | 'backups' | 'updates' | 'external' | 'io';

const MOCK_STATS = [
  { time: '10:00', cpu: 25, mem: 45, lag: 120 },
  { time: '10:05', cpu: 42, mem: 48, lag: 145 },
  { time: '10:10', cpu: 31, mem: 46, lag: 110 },
  { time: '10:15', cpu: 85, mem: 72, lag: 350 },
  { time: '10:20', cpu: 45, mem: 55, lag: 160 },
  { time: '10:25', cpu: 32, mem: 52, lag: 130 },
];

export const SystemConfig: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SystemTab>('monitoring');

  const renderMonitoring = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Utilisation CPU', val: '32%', icon: Cpu, color: 'text-green-600' },
            { label: 'Mémoire Vive', val: '5.2 GB', icon: HardDrive, color: 'text-indigo-600' },
            { label: 'Latence API', val: '124ms', icon: Activity, color: 'text-emerald-600' },
          ].map((stat, i) => (
             <div key={i} className="fluent-card p-6 flex items-center justify-between rounded-lg border border-green-200 bg-white shadow-sm">
                <div>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                   <p className={cn("text-2xl font-black", stat.color)}>{stat.val}</p>
                </div>
                <stat.icon className={cn("w-8 h-8 opacity-10 font-black", stat.color)} />
             </div>
          ))}
       </div>

       <div className="fluent-card p-8 rounded-lg border border-green-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-8">
             <h4 className="text-sm font-black text-green-950 uppercase tracking-tight flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" /> Performance en Temps Réel
             </h4>
             <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[9px] font-black uppercase italic rounded-lg">Système Stable</span>
             </div>
          </div>
          <div className="h-[250px] w-full">
             <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_STATS}>
                   <defs>
                      <linearGradient id="colorPerf" x1="0" y1="0" x2="0" y2="1">
                         <stop offset="5%" stopColor="#117F02" stopOpacity={0.2}/>
                         <stop offset="95%" stopColor="#117F02" stopOpacity={0}/>
                      </linearGradient>
                   </defs>
                   <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                   <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                   <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }} />
                   <Tooltip />
                   <Area type="monotone" dataKey="cpu" stroke="#117F02" strokeWidth={3} fillOpacity={1} fill="url(#colorPerf)" />
                </AreaChart>
             </ResponsiveContainer>
          </div>
       </div>

       <div className="fluent-card p-6 border border-rose-200 bg-rose-50/10 rounded-lg shadow-sm">
          <h4 className="text-sm font-black text-rose-600 uppercase mb-4 flex items-center gap-2">
             <AlertTriangle className="w-5 h-5" /> Alertes Critiques
          </h4>
          <div className="space-y-3">
             <div className="p-3 bg-white border border-rose-100 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <Zap className="w-4 h-4 text-rose-500" />
                   <p className="text-[11px] font-bold text-green-950 uppercase italic">Pic de latence inhabituel détecté</p>
                </div>
                <span className="text-[9px] font-black text-rose-400 italic">Il y a 5 min</span>
             </div>
          </div>
       </div>
    </div>
  );

  const renderBackups = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="fluent-card p-6 rounded-lg border border-green-200 bg-white shadow-sm">
             <h4 className="text-sm font-black text-green-950 uppercase mb-6 flex items-center gap-2 italic">
                <Database className="w-5 h-5 text-indigo-600" /> Sauvegardes Automatiques
             </h4>
             <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 shadow-inner">
                   <div className="flex items-center justify-between mb-2">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Fréquence</p>
                      <span className="text-xs font-black text-green-600">Quotidien (02:00)</span>
                   </div>
                   <div className="flex items-center justify-between">
                      <p className="text-[10px] font-black text-slate-500 uppercase">Destination</p>
                      <span className="text-xs font-black text-indigo-600">Google Cloud / S3</span>
                   </div>
                </div>
                <button className="w-full py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-600/30">Lancer une sauvegarde manuelle</button>
             </div>
          </div>

          <div className="fluent-card p-6 rounded-lg border border-green-200 bg-white shadow-sm">
             <h4 className="text-sm font-black text-green-950 uppercase mb-6 italic">Derniers Snapshots</h4>
             <div className="space-y-3">
                {[
                  { date: '15/05/2024 02:01', size: '1.2 GB', type: 'Full' },
                  { date: '14/05/2024 02:00', size: '1.1 GB', type: 'Full' },
                ].map((b, i) => (
                   <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                      <div>
                         <p className="text-[10px] font-black text-green-950">{b.date}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">{b.size} • {b.type}</p>
                      </div>
                      <div className="flex gap-2">
                         <button className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-emerald-600"><RefreshCw className="w-3.5 h-3.5" /></button>
                         <button className="p-2 bg-white border border-slate-100 rounded-lg text-slate-400 hover:text-green-600"><Download className="w-3.5 h-3.5" /></button>
                      </div>
                   </div>
                ))}
             </div>
          </div>
       </div>
    </div>
  );

  const renderUpdates = () => (
    <div className="space-y-6">
       <div className="p-8 bg-slate-900 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-8 border border-slate-700 shadow-2xl">
          <div className="max-w-md">
             <h4 className="text-xl font-black uppercase tracking-tight mb-2">Version Actuelle : v4.2.1-stable</h4>
             <p className="text-xs font-medium text-slate-400 italic">Dernier correctif de sécurité appliqué : Aujourd'hui à 11:30.</p>
          </div>
          <button className="px-6 py-3 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-emerald-600/30 border border-emerald-700">Vérifier les Mises à jour</button>
       </div>

       <div className="fluent-card p-6">
          <h4 className="text-sm font-black text-green-950 uppercase mb-6 flex items-center gap-2">
             <Terminal className="w-5 h-5 text-green-600" /> Historique des Déploiements
          </h4>
          <div className="space-y-4">
             {[
               { ver: 'v4.2.1', date: '15/05/2024', desc: 'Correctif faille injection SQL.', type: 'Security' },
               { ver: 'v4.2.0', date: '01/05/2024', desc: 'Nouveau module Télémédecine.', type: 'Feature' },
             ].map((u, i) => (
                <div key={i} className="flex gap-4 p-4 border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-all rounded-xl">
                   <div className="w-12 h-12 bg-white border border-slate-100 rounded-xl flex items-center justify-center text-[10px] font-black text-green-600 shadow-sm">{u.ver}</div>
                   <div>
                      <div className="flex items-center gap-2">
                         <p className="text-xs font-black text-green-950 uppercase">{u.desc}</p>
                         <span className={cn(
                           "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                           u.type === 'Security' ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                         )}>{u.type}</span>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 italic">{u.date}</p>
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderExternal = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { name: 'Intégration Oracle ERP', status: 'Connecté', icon: Server, health: '99.9%' },
            { name: 'Salesforce CRM', status: 'Erreur Sync', icon: Users, health: '45%' },
            { name: 'Gateway Mobile Money', status: 'Actif', icon: Shield, health: '100%' },
          ].map((api, i) => (
             <div key={i} className="fluent-card p-6 flex flex-col justify-between group rounded-lg border border-green-200 bg-white shadow-sm">
                <div>
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-slate-50 text-slate-400 group-hover:text-green-600 transition-colors rounded-xl border border-slate-100">
                         <api.icon className="w-6 h-6" />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-emerald-600">{api.health}</p>
                         <p className="text-[8px] font-black text-slate-300 uppercase">Uptime</p>
                      </div>
                   </div>
                   <h5 className="text-xs font-black text-green-950 uppercase mb-1">{api.name}</h5>
                   <span className={cn(
                     "text-[8px] font-black uppercase italic",
                     api.status === 'Connecté' || api.status === 'Actif' ? "text-emerald-500" : "text-rose-500"
                   )}>{api.status}</span>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                   <button className="text-[10px] font-black text-green-600 uppercase hover:underline">Logs API</button>
                   <Settings className="w-4 h-4 text-slate-200 hover:text-green-600 cursor-pointer" />
                </div>
             </div>
          ))}
          <button className="border-2 border-dashed border-green-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 hover:border-green-400 hover:bg-green-50/20 transition-all group bg-white shadow-sm italic">
             <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center border border-green-100 text-green-200 group-hover:text-green-600 group-hover:border-green-400 transition-all">
                <Share2 className="w-6 h-6" />
             </div>
             <p className="text-[10px] font-black text-green-200 uppercase tracking-[0.2em] group-hover:text-green-600 transition-all">Nouvelle Connexion</p>
          </button>
       </div>

       <div className="fluent-card p-6">
          <h4 className="text-sm font-black text-green-950 uppercase mb-6 flex items-center gap-2">
             <Key className="w-5 h-5 text-indigo-600" /> Gestion des Clés API
          </h4>
          <div className="space-y-4">
             {[
               { app: 'Module Mobile Patient', key: 'afk_live_4492...', state: 'Active' },
               { app: 'Dashboard Web Admin', key: 'afk_live_8820...', state: 'Active' },
             ].map((k, i) => (
                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-2 bg-white rounded-lg border border-slate-100"><Lock className="w-4 h-4 text-slate-400" /></div>
                      <div>
                         <p className="text-[10px] font-black text-green-950 uppercase">{k.app}</p>
                         <code className="text-[9px] font-mono text-slate-400">{k.key}</code>
                      </div>
                   </div>
                   <button className="text-[8px] font-black text-rose-500 uppercase px-3 py-1 border border-rose-100 rounded-lg hover:bg-rose-50">Révoquer</button>
                </div>
             ))}
          </div>
       </div>
    </div>
  );

  const renderIO = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="fluent-card p-8 text-center group cursor-pointer hover:border-emerald-400 transition-all rounded-lg border border-green-200 bg-white shadow-sm">
             <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-xl mx-auto flex items-center justify-center mb-6 border border-emerald-100 group-hover:scale-110 transition-transform">
                <Upload className="w-8 h-8" />
             </div>
             <h4 className="text-sm font-black text-green-950 uppercase mb-2 italic">Importation Massive</h4>
             <p className="text-[10px] font-medium text-slate-400 italic mb-6">Clients, Contrats, Prestataires (CSV, XLSX, JSON)</p>
             <button className="px-8 py-2.5 bg-emerald-600 text-white rounded-md text-[10px] font-black uppercase tracking-widest border border-emerald-700">Choisir un fichier</button>
          </div>

          <div className="fluent-card p-8 text-center group cursor-pointer hover:border-green-400 transition-all rounded-lg border border-green-200 bg-white shadow-sm">
             <div className="w-16 h-16 bg-green-50 text-green-600 rounded-xl mx-auto flex items-center justify-center mb-6 border border-green-100 group-hover:scale-110 transition-transform">
                <Download className="w-8 h-8" />
             </div>
             <h4 className="text-sm font-black text-green-950 uppercase mb-2 italic">Exportation de Données</h4>
             <p className="text-[10px] font-medium text-slate-400 italic mb-6">Extractions et Rapports bruts</p>
             <div className="flex gap-2 justify-center">
                <button className="p-3 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-green-600 transition-all shadow-sm"><FileSpreadsheet className="w-6 h-6" /></button>
                <button className="p-3 bg-white border border-slate-200 rounded-md text-slate-400 hover:text-green-600 transition-all shadow-sm"><FileJson className="w-6 h-6" /></button>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Système <Shield className="w-8 h-8 text-green-500" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase italic underline decoration-green-200 underline-offset-4 decoration-2">Monitoring, Flux API & Sécurité Infrastructure</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-2xl border border-green-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
              {['monitoring', 'backups', 'updates', 'external', 'io'].map((id) => {
                const tab = [
                  { id: 'monitoring', label: 'Monitor', icon: Activity },
                  { id: 'backups', label: 'Sauvegardes', icon: Database },
                  { id: 'updates', label: 'Updates', icon: RefreshCw },
                  { id: 'external', label: 'API Connect', icon: Globe },
                  { id: 'io', label: 'Import/Export', icon: Upload },
                ].find(t => t.id === id)!;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={cn(
                      "px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap border border-transparent shadow-sm",
                      activeTab === tab.id ? "bg-green-600 text-white shadow-lg shadow-green-600/20 border-green-700" : "text-slate-400 hover:text-green-600 hover:border-green-100 placeholder:italic"
                    )}
                  >
                     <tab.icon className="w-3.5 h-3.5" />
                     {tab.label}
                  </button>
                );
              })}
          </div>
       </div>

       <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
             {activeTab === 'monitoring' && renderMonitoring()}
             {activeTab === 'backups' && renderBackups()}
             {activeTab === 'updates' && renderUpdates()}
             {activeTab === 'external' && renderExternal()}
             {activeTab === 'io' && renderIO()}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
