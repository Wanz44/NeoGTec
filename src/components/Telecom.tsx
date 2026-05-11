import React from 'react';
import { motion } from 'motion/react';
import { PhoneCall, Mail, MessageSquare, Send, Globe, Zap } from 'lucide-react';

export const Telecom: React.FC = () => {
  const channels = [
    { name: 'SMTP Cloud', type: 'Email', status: 'Optimal', load: '0%', color: 'bg-blue-500' },
    { name: 'Twilio SMS', type: 'SMS', status: 'Optimal', load: '0%', color: 'bg-emerald-500' },
    { name: 'WhatsApp API', type: 'Instant', status: 'Optimal', load: '0%', color: 'bg-rose-500' }
  ];

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Com & Télécom</h2>
        <p className="text-slate-500 font-medium text-sm">Gestion des passerelles de communication client et alertes omnicanales.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {channels.map((chan, idx) => (
          <motion.div
            key={chan.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="fluent-card p-6"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-slate-50 rounded-[10px] flex items-center justify-center text-slate-400">
                {chan.type === 'Email' ? <Mail className="w-5 h-5" /> : chan.type === 'SMS' ? <MessageSquare className="w-5 h-5" /> : <PhoneCall className="w-5 h-5" />}
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full text-white ${chan.color}`}>
                {chan.status}
              </span>
            </div>
            <h3 className="text-[14px] font-bold text-orange-950 mb-1">{chan.name}</h3>
            <p className="text-[11px] font-medium text-slate-400 mb-6">{chan.type}</p>
            <div className="space-y-2">
               <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                  <span>Charge Canal</span>
                  <span>{chan.load}</span>
               </div>
               <div className="w-full h-1 bg-black/5 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: chan.load }} className={`h-full ${chan.color}`} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="material-mica p-6 rounded-fluent">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                 <Globe className="w-4 h-4 text-orange-600" />
              </div>
              <h3 className="text-sm font-bold text-orange-950 uppercase tracking-widest">Flux Sortants Temps-Réel</h3>
           </div>
           <div className="space-y-4">
              {[
                { to: '---', subject: 'En attente', time: '---' },
                { to: '---', subject: 'En attente', time: '---' },
                { to: '---', subject: 'En attente', time: '---' }
              ].map((msg, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/40 border border-black/5 rounded-[10px] group hover:border-orange-200 transition-all">
                   <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                      <div>
                         <p className="text-[11px] font-bold text-orange-950">{msg.to}</p>
                         <p className="text-[10px] font-medium text-slate-400">{msg.subject}</p>
                      </div>
                   </div>
                   <span className="text-[10px] font-bold text-slate-300">{msg.time} ago</span>
                </div>
              ))}
           </div>
        </div>

        <div className="material-mica p-8 rounded-fluent flex flex-col justify-center items-center text-center bg-orange-500/5">
           <Zap className="w-12 h-12 text-orange-500 mb-4 animate-pulse" />
           <h3 className="text-lg font-bold text-orange-950 mb-2">Centre de Diffusion Massive</h3>
           <p className="text-slate-500 text-sm font-medium mb-6 max-w-xs">
              Envoyez des notifications critiques à l'ensemble de vos adhérents en un clic (Updates CGU, Alertes Sécurité).
           </p>
           <button className="flex items-center gap-2 px-8 py-3 bg-orange-500 text-white rounded-[10px] font-bold text-sm shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all active:scale-95">
              <Send className="w-4 h-4" />
              Démarrer Campagne
           </button>
        </div>
      </div>
    </div>
  );
};
