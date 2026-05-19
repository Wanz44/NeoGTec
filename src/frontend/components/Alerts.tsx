/**
 * 📄 Fichier : /src/frontend/components/Alerts.tsx
 * 🎯 Objectif : Gestion centralisée des notifications, rappels automatiques et historique des communications.
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Mail, MessageSquare, Phone, Send, 
  Clock, CheckCircle2, AlertCircle, History as HistoryIcon,
  Search, Filter, ChevronRight, Settings,
  Zap, Calendar, RefreshCcw, CreditCard
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- Types ---

export type NotificationChannel = 'Email' | 'SMS' | 'Push';
export type NotificationStatus = 'Envoyé' | 'Délivré' | 'Echec' | 'En attente';

export interface Communication {
  id: string;
  recipient: string;
  type: string; // ex: 'Renouvellement', 'Paiement en retard', 'Ajustement Prime'
  channel: NotificationChannel;
  content: string;
  timestamp: string;
  status: NotificationStatus;
}

const MOCK_COMMUNICATIONS: Communication[] = [
  {
    id: '1',
    recipient: 'Adonaï WANZAMBI',
    type: 'Renouvellement',
    channel: 'Email',
    content: 'Votre contrat arrive à échéance dans 30 jours. Cliquez ici pour renouveler.',
    timestamp: '2024-05-14T10:00:00Z',
    status: 'Délivré'
  },
  {
    id: '2',
    recipient: 'Marie Curie',
    type: 'Paiement en retard',
    channel: 'SMS',
    content: 'Rappel: Votre prime du mois de Mai est impayée. Merci de régulariser.',
    timestamp: '2024-05-14T14:30:00Z',
    status: 'Envoyé'
  },
  {
    id: '3',
    recipient: 'Robert Oppenheimer',
    type: 'Ajustement Prime',
    channel: 'Push',
    content: 'Mise à jour: Votre prime a été ajustée suite à votre changement de situation.',
    timestamp: '2024-05-13T09:15:00Z',
    status: 'Echec'
  }
];

export const Alerts: React.FC = () => {
  const [comms, setComms] = useState<Communication[]>(MOCK_COMMUNICATIONS);
  const [filterChannel, setFilterChannel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComms = comms.filter(c => 
    (filterChannel === 'All' || c.channel === filterChannel) &&
    (c.recipient.toLowerCase().includes(searchQuery.toLowerCase()) || c.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const stats = {
    total: comms.length,
    success: comms.filter(c => c.status === 'Délivré' || c.status === 'Envoyé').length,
    failed: comms.filter(c => c.status === 'Echec').length
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-green-950 tracking-tight">Rappels & Notifications</h2>
          <p className="text-green-900/50 font-medium">Automatisation multi-canal et historique de communication</p>
        </div>
        <div className="flex gap-3">
           <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-green-600/20 hover:scale-105 transition-all text-xs">
              <Zap className="w-4 h-4" /> Configurer l'Auto-Relance
           </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {[
           { label: 'Total Envoyés', value: stats.total, icon: Send, color: 'text-green-600', bg: 'bg-green-50' },
           { label: 'Taux de succès', value: `${Math.round((stats.success / stats.total) * 100)}%`, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
           { label: 'Echecs critiques', value: stats.failed, icon: AlertCircle, color: 'text-rose-600', bg: 'bg-rose-50' }
         ].map((stat, i) => (
           <div key={i} className={cn("p-4 rounded-2xl border border-black/5 flex items-center justify-between", stat.bg)}>
              <div>
                 <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">{stat.label}</p>
                 <p className={cn("text-2xl font-black", stat.color)}>{stat.value}</p>
              </div>
              <stat.icon className="w-8 h-8 opacity-10" />
           </div>
         ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Communication History */}
         <div className="lg:col-span-2 space-y-4">
            <div className="fluent-card">
               <div className="p-4 bg-green-50/20 border-b border-green-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-green-400" />
                        <input 
                           type="text" 
                           placeholder="Rechercher un destinataire..." 
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="pl-9 pr-4 py-1.5 text-xs bg-white border border-green-100 rounded-lg outline-none w-64"
                        />
                     </div>
                     <select 
                       value={filterChannel}
                       onChange={(e) => setFilterChannel(e.target.value)}
                       className="text-xs font-bold text-green-600 bg-transparent outline-none cursor-pointer"
                     >
                        <option value="All">Tous les canaux</option>
                        <option value="Email">Email</option>
                        <option value="SMS">SMS</option>
                        <option value="Push">Push</option>
                     </select>
                  </div>
                  <HistoryIcon className="w-4 h-4 text-green-200" />
               </div>

               <div className="divide-y divide-green-50">
                  {filteredComms.map(com => (
                    <div key={com.id} className="p-4 hover:bg-green-50/30 transition-all flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center",
                            com.channel === 'Email' ? "bg-blue-50 text-blue-600" :
                            com.channel === 'SMS' ? "bg-emerald-50 text-emerald-600" : "bg-green-50 text-green-600"
                          )}>
                             {com.channel === 'Email' ? <Mail className="w-5 h-5" /> : 
                              com.channel === 'SMS' ? <MessageSquare className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                          </div>
                          <div>
                             <div className="flex items-center gap-2">
                                <h4 className="text-sm font-black text-green-950">{com.recipient}</h4>
                                <span className="text-[9px] font-black bg-green-100 text-green-600 px-2 py-0.5 rounded uppercase italic">{com.type}</span>
                             </div>
                             <p className="text-[11px] text-slate-400 font-medium truncate max-w-md">{com.content}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <div className="text-right">
                             <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{new Date(com.timestamp).toLocaleDateString()}</p>
                             <p className={cn(
                               "text-[10px] font-black uppercase italic",
                                com.status === 'Délivré' ? "text-emerald-600" : 
                               com.status === 'Echec' ? "text-rose-600" : "text-amber-500"
                             )}>
                               {com.status}
                             </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-green-600" />
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Automation Rules & Config */}
         <div className="space-y-6">
            <div className="fluent-card p-6">
               <h4 className="text-sm font-black text-green-950 mb-6 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-green-600" /> Règles Automatiques
               </h4>
               <div className="space-y-4">
                  {[
                    { id: 'r1', label: 'Relance Renouvellement', active: true, desc: 'J-30, J-15, J-1', icon: RefreshCcw },
                    { id: 'r2', label: 'Impayés Critiques', active: true, desc: 'Alerte immédiate SMS', icon: CreditCard },
                    { id: 'r3', label: 'Anniversaire Adhérent', active: false, desc: 'Email de courtoisie', icon: Calendar }
                  ].map(rule => (
                    <div key={rule.id} className="p-4 rounded-2xl border border-green-50 bg-green-50/10 flex items-center justify-between group">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-green-100 text-green-600 shadow-sm">
                             <rule.icon className="w-4 h-4" />
                          </div>
                          <div>
                             <p className="text-xs font-black text-green-950">{rule.label}</p>
                             <p className="text-[10px] font-medium text-slate-400">{rule.desc}</p>
                          </div>
                       </div>
                       <div className={cn(
                         "w-10 h-6 rounded-full p-1 cursor-pointer transition-all border",
                         rule.active ? "bg-green-600 border-green-600" : "bg-slate-200 border-slate-300"
                       )}>
                          <div className={cn(
                            "w-4 h-4 rounded-full bg-white transition-all",
                            rule.active ? "translate-x-4" : "translate-x-0"
                          )} />
                       </div>
                    </div>
                  ))}
               </div>
               <button className="w-full mt-6 py-2.5 border-2 border-dashed border-green-200 text-green-400 text-[10px] font-black rounded-xl hover:border-green-500 hover:text-green-600 transition-all uppercase tracking-widest bg-white">
                  + Créer une nouvelle règle
               </button>
            </div>

            <div className="p-6 bg-white border border-green-200 rounded-lg text-slate-900 shadow-sm relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                  <Phone className="w-16 h-16 text-green-600" />
               </div>
               <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-4 text-slate-400">Urgence / BroadCast (RDC)</h4>
               <p className="text-xs font-medium mb-6 text-slate-500 opacity-80 italic leading-relaxed">Envoyer un message d'alerte critique à tous les assurés d'une zone géographique via SMS Broadcast.</p>
               <button className="w-full py-3 bg-green-600 text-white rounded-md font-black text-[11px] uppercase tracking-widest shadow-lg shadow-green-600/30 hover:scale-[1.02] transition-all border border-green-700">
                  Lancer l'Alerte Massive
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
