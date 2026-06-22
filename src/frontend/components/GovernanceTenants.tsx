/**
 * 📄 Fichier : /src/frontend/components/GovernanceTenants.tsx
 * 🎯 Objectif : Gestion des établissements (SaaS Multi-tenancy)
 */
import React, { useState } from 'react';
import { 
  Hospital, Database, HardDrive, Activity, 
  Search, Plus, Building2, Globe, Settings, Server 
} from 'lucide-react';
import { cn } from '../lib/utils';
import { AnimatePresence } from 'motion/react';
import { EstablishmentCreateForm } from './EstablishmentCreateForm';

interface HospitalTenant {
  id: string;
  name: string;
  location: string;
  patients: number;
  records: string;
  status: 'active' | 'maintenance' | 'suspended';
  uptime: string;
  lastSync: string;
}

const HOSPITAL_TENANTS: HospitalTenant[] = [
  { id: 'HOSP-01', name: 'Centre Hospitalier Universitaire', location: 'Lomé, Togo', patients: 14500, records: '42.5 GB', status: 'active', uptime: '99.98%', lastSync: 'Il y a 2m' },
  { id: 'HOSP-02', name: 'Clinique Pro-Santé', location: 'Cotonou, Bénin', patients: 3200, records: '12.1 GB', status: 'active', uptime: '99.95%', lastSync: 'Il y a 15m' },
  { id: 'HOSP-03', name: 'Hôpital Militaire', location: 'Lomé, Togo', patients: 8900, records: '28.4 GB', status: 'maintenance', uptime: '100%', lastSync: 'En cours' },
  { id: 'HOSP-04', name: 'Saint-Luc Records', location: 'Kara, Togo', patients: 1200, records: '4.8 GB', status: 'suspended', uptime: '0%', lastSync: '24h+' },
];

export const GovernanceTenants: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  return (
    <div className="space-y-6">
       {/* SaaS Global Metrics */}
       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { label: 'Hôpitaux Actifs', val: '24', icon: Hospital, color: 'text-green-600' },
            { label: 'Dossiers Médicaux Total', val: '1.4M', icon: Database, color: 'text-green-600' },
            { label: 'Espace Utilise', val: '1.24 TB', icon: HardDrive, color: 'text-emerald-600' },
            { label: 'Status Global', val: 'Operational', icon: Activity, color: 'text-green-500' },
          ].map((stat, i) => (
             <div key={i} className="fluent-card p-6 bg-white border-b-4 border-b-green-500/20 rounded-lg border border-green-200 shadow-sm transition-all hover:scale-105">
                <div className="flex items-center justify-between mb-4">
                   <div className="p-2.5 bg-green-50 text-green-600 rounded-md border border-green-100 shadow-inner">
                      <stat.icon className="w-5 h-5" />
                   </div>
                </div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <p className="text-2xl font-black text-green-950 mt-1 italic tracking-tighter">{stat.val}</p>
             </div>
          ))}
       </div>

       {/* Establishments List */}
       <div className="fluent-card p-8 rounded-lg border border-green-200 bg-white shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
             <div>
                <h3 className="text-xl font-black text-green-950 uppercase italic underline decoration-green-100 underline-offset-8">Multi-Tenancy SAAS</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic font-medium">Gestion des établissements et hôpitaux partenaires</p>
             </div>
             <div className="flex gap-2">
                <div className="relative">
                   <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                   <input type="text" placeholder="Rechercher hopital..." className="pl-10 pr-4 py-3 bg-white border border-green-200 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm transition-all" />
                </div>
                <button 
                  onClick={() => setShowAddModal(true)}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-green-700 border border-green-700 transition-all shadow-xl shadow-green-600/30"
                >
                   <Plus className="w-4 h-4" /> Ajouter Établissement
                </button>
             </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {HOSPITAL_TENANTS.map((tenant) => (
               <div key={tenant.id} className="p-6 bg-white border border-green-100 rounded-lg hover:border-green-500 group transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-lg">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Hospital className="w-20 h-20" />
                  </div>
                  <div className="flex items-center gap-4 mb-6">
                     <div className="w-12 h-12 bg-green-50 rounded-lg border border-green-200 flex items-center justify-center text-green-600 shadow-inner">
                        <Building2 className="w-6 h-6" />
                     </div>
                     <div>
                        <h4 className="text-sm font-black text-green-950 uppercase italic">{tenant.name}</h4>
                        <p className="text-[10px] font-bold text-slate-400 italic flex items-center gap-1">
                           <Globe className="w-3 h-3" /> {tenant.location}
                        </p>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 shadow-inner">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Patients & Dossiers</p>
                        <p className="text-xs font-black text-green-950">{tenant.patients.toLocaleString()} <span className="text-[9px] text-slate-400 font-medium italic">({tenant.records})</span></p>
                     </div>
                     <div className="p-3 bg-slate-50/50 rounded-lg border border-slate-100 shadow-inner">
                        <p className="text-[9px] font-black text-slate-400 uppercase">Disponibilité</p>
                        <p className="text-xs font-black text-green-600 italic">{tenant.uptime}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                     <div className="flex items-center gap-2">
                        <div className={cn(
                           "w-2 h-2 rounded-full animate-pulse",
                           tenant.status === 'active' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : tenant.status === 'maintenance' ? "bg-amber-500" : "bg-rose-500"
                        )} />
                        <span className="text-[10px] font-black uppercase text-slate-400 italic">{tenant.status}</span>
                     </div>
                     <div className="flex gap-2">
                        <button className="p-2.5 border border-green-200 rounded-md hover:bg-green-50 transition-all shadow-sm"><Settings className="w-4 h-4 text-green-400" /></button>
                        <button className="p-2.5 border border-green-200 rounded-md hover:bg-green-50 transition-all shadow-sm"><Server className="w-4 h-4 text-green-400" /></button>
                     </div>
                  </div>
               </div>
             ))}
          </div>
       </div>

       {/* Create Establishment Modal */}
       <AnimatePresence>
         {showAddModal && <EstablishmentCreateForm onClose={() => setShowAddModal(false)} />}
       </AnimatePresence>
    </div>
  );
};
