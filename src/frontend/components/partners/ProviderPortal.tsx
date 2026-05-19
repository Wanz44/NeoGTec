/**
 * 📄 Fichier : /src/frontend/components/partners/ProviderPortal.tsx
 * 🎯 Objectif : Interface dédiée pour les prestataires (Hôpitaux/Cliniques).
 */
import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  LayoutDashboard, FilePlus, CreditCard, MessageSquare, 
  History as HistoryIcon, AlertCircle, CheckCircle2, Clock, 
  Send, Search, Download, Filter, FileText,
  ArrowUpRight, PieChart as PieChartIcon
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';

const REVENUE_DATA = [
  { month: 'Jan', amount: 12500 },
  { month: 'Feb', amount: 18400 },
  { month: 'Mar', amount: 15200 },
  { month: 'Apr', amount: 22100 },
  { month: 'May', amount: 28500 },
];

export const ProviderPortal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'litigations'>('overview');

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Provider Context Header */}
      <div className="p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-green-950 rounded-[28px] flex items-center justify-center shadow-xl shadow-green-900/20">
               <span className="text-2xl font-black text-white italic">HJ</span>
            </div>
            <div>
               <h2 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Hôpital HJ Hospitals</h2>
               <div className="flex items-center gap-4 mt-1">
                  <div className="flex items-center gap-2">
                     <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Convention Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">ID: PREST-88902</span>
                  </div>
               </div>
            </div>
         </div>
         <div className="flex gap-4">
            <button className="px-8 py-3 bg-green-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-green-600/20 hover:scale-105 transition-all">
               Nouvelle Facture
            </button>
            <button className="px-8 py-3 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-slate-950/20 hover:scale-105 transition-all">
               Support Dédié
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Nav */}
         <div className="space-y-4">
            {[
               { id: 'overview', label: 'Vue d\'ensemble', icon: LayoutDashboard },
               { id: 'invoices', label: 'Factures & Flux', icon: FilePlus },
               { id: 'payments', label: 'Suivi Paiements', icon: CreditCard },
               { id: 'litigations', label: 'Gestion Litiges', icon: MessageSquare },
               { id: 'history', label: 'Historique Patient', icon: HistoryIcon },
            ].map((item) => (
               <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={cn(
                    "w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all",
                    activeTab === item.id ? "bg-green-600 text-white shadow-xl shadow-green-600/20" : "bg-white text-slate-400 hover:bg-slate-50 border border-slate-100"
                  )}
               >
                  <item.icon className="w-4 h-4" />
                  {item.label}
               </button>
            ))}
         </div>

         {/* Content Area */}
         <div className="lg:col-span-3 space-y-8">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {[
                     { label: 'Encours Facturation', value: '14,250 $', color: 'green', icon: FileText },
                     { label: 'Paiements Reçus (Mois)', value: '28,500 $', color: 'emerald', icon: ArrowUpRight },
                     { label: 'Factures Rejetées', value: '3', color: 'rose', icon: AlertCircle },
                   ].map((stat, i) => (
                     <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
                        <div className={cn("p-3 rounded-xl w-fit mb-4", `bg-${stat.color}-50`)}>
                           <stat.icon className={cn("w-5 h-5", `text-${stat.color}-600`)} />
                        </div>
                        <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-2xl font-black text-slate-900">{stat.value}</p>
                     </div>
                   ))}
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm min-h-[300px]">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                         <h4 className="text-sm font-black text-slate-900 uppercase italic">Evolution des Facturations</h4>
                         <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mt-1">Données consolidées sur 5 mois</p>
                      </div>
                      <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                         <Download className="w-4 h-4" />
                      </button>
                   </div>
                   <div className="h-[250px] w-full text-[10px] font-black">
                      <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={REVENUE_DATA}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
                            <Tooltip 
                               contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                            />
                            <Bar dataKey="amount" fill="#4ba32c" radius={[10, 10, 0, 0]} barSize={40} />
                         </BarChart>
                      </ResponsiveContainer>
                   </div>
                </div>
              </>
            )}

            {activeTab === 'invoices' && (
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
                 <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                    <h3 className="text-sm font-black text-slate-900 uppercase italic">Factures Récents</h3>
                    <div className="flex gap-2">
                       <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-300" />
                          <input type="text" placeholder="Rechercher ID..." className="pl-9 pr-4 py-2 bg-white border border-slate-100 rounded-xl text-[10px] font-bold outline-none" />
                       </div>
                    </div>
                 </div>
                 <div className="divide-y divide-slate-50">
                    {[
                      { id: 'INV-PX-001', date: '2024-05-18', amount: '1,250.00 $', status: 'Payé', patient: 'Adonaï WANZAMBI' },
                      { id: 'INV-PX-002', date: '2024-05-17', amount: '450.00 $', status: 'Sous Revue', patient: 'Marie Curie' },
                      { id: 'INV-PX-003', date: '2024-05-15', amount: '8,900.00 $', status: 'En attente', patient: 'Robert Oppenheimer' },
                    ].map((inv, i) => (
                      <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                         <div className="flex items-center gap-6">
                            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-green-50 group-hover:text-green-600 transition-all font-black text-[10px]">
                               DOC
                            </div>
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase italic">{inv.id}</p>
                               <p className="text-[10px] font-bold text-slate-400 mt-0.5">{inv.patient} • {inv.date}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-8">
                            <div className="text-right">
                               <p className="text-sm font-black text-slate-900">{inv.amount}</p>
                               <span className={cn(
                                 "text-[8px] font-black uppercase tracking-widest",
                                 inv.status === 'Payé' ? "text-emerald-500" : 
                                 inv.status === 'Sous Revue' ? "text-amber-500" : "text-slate-400"
                               )}>{inv.status}</span>
                            </div>
                            <button className="p-2.5 bg-slate-50 text-slate-300 rounded-xl hover:bg-slate-900 hover:text-white transition-all">
                               <Download className="w-4 h-4" />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
