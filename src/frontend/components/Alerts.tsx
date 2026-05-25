/**
 * 📄 Fichier : /src/frontend/components/Alerts.tsx
 * 🎯 Objectif : Hub de communication, engagement collaborateurs, notifications et flash infos (H1, H2).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, Mail, MessageSquare, Phone, Send, 
  Clock, CheckCircle2, AlertCircle, History as HistoryIcon,
  Search, Filter, ChevronRight, Settings,
  Zap, Calendar, RefreshCcw, CreditCard, X, Check, Eye
} from 'lucide-react';
import { cn } from '../lib/utils';

export type NotificationChannel = 'Email' | 'SMS' | 'Push';
export type NotificationStatus = 'Envoyé' | 'Délivré' | 'Echec' | 'En attente';

export interface Communication {
  id: string;
  recipient: string;
  type: string;
  channel: NotificationChannel;
  content: string;
  timestamp: string;
  status: NotificationStatus;
}

const INITIAL_COMMUNICATIONS: Communication[] = [
  {
    id: 'COM-9801',
    recipient: 'Adonaï Wanzambi',
    type: 'Renouvellement',
    channel: 'Email',
    content: 'Cher adhérent, votre contrat "Adonaï NeoGold" arrive à terme sous 30 jours. Renouvelez en ligne.',
    timestamp: '24/05/2026 10:00',
    status: 'Délivré'
  },
  {
    id: 'COM-9802',
    recipient: 'Marie-Claire Mpunga',
    type: 'Vœux Anniversaire',
    channel: 'SMS',
    content: 'Toute l&apos;équipe d&apos;Adonaï vous souhaite un Joyeux Anniversaire! Profitez de -10% sur votre prochain acte de checkup clinique.',
    timestamp: '23/05/2026 14:30',
    status: 'Envoyé'
  },
  {
    id: 'COM-9803',
    recipient: 'Samba Ndongo',
    type: 'Rappel Cotisation',
    channel: 'Push',
    content: 'Alerte: Votre cotisation de mai de KMS est en attente. Votre couverture reste active pour les prochaines 48h.',
    timestamp: '22/05/2026 09:15',
    status: 'Délivré'
  }
];

export const Alerts: React.FC = () => {
  const [comms, setComms] = useState<Communication[]>(INITIAL_COMMUNICATIONS);
  const [filterChannel, setFilterChannel] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Interactive configurations (H2 toggles)
  const [rules, setRules] = useState([
    { id: 'r1', label: 'Relance Renouvellement', active: true, desc: 'J-30, J-15, J-1', icon: RefreshCcw },
    { id: 'r2', label: 'Impayés Critiques', active: true, desc: 'Alerte immédiate SMS', icon: CreditCard },
    { id: 'r3', label: 'Anniversaire Adhérent (Vœux)', active: false, desc: 'Email ou SMS de courtoisie', icon: Calendar }
  ]);

  // Flash publisher state (H1)
  const [broadcastTitle, setBroadcastTitle] = useState('Campagne Dépistage Paludisme active');
  const [broadcastMsg, setBroadcastMsg] = useState('Dépistage gratuit du paludisme et distribution de moustiquaires à la Clinique Ngaliema ce vendredi.');
  const [broadcastChannel, setBroadcastChannel] = useState<NotificationChannel>('SMS');

  // Personalized notifier state
  const [directRecipient, setDirectRecipient] = useState('Thomas Edison');
  const [directContent, setDirectContent] = useState('Votre bilan annuel est approuvé. Contactez HJ Hospitals pour planifier.');
  const [directChannel, setDirectChannel] = useState<NotificationChannel>('SMS');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastMessage(text);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => {
      if (r.id === ruleId) {
        const nextState = !r.active;
        showToast(`Règle "${r.label}" de communication est désormais ${nextState ? 'ACTIVÉE' : 'DÉSACTIVÉE'}.`);
        return { ...r, active: nextState };
      }
      return r;
    }));
  };

  // H1 publish flash broadcast 
  const handlePublishBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastMsg.trim()) return;

    const newComm: Communication = {
      id: `COM-F-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: 'TOUS LES ASSURÉS (BROADCAST)',
      type: 'Flash Infos / Alerte',
      channel: broadcastChannel,
      content: `${broadcastTitle}: ${broadcastMsg}`,
      timestamp: new Date().toLocaleString(),
      status: 'Envoyé'
    };

    setComms([newComm, ...comms]);
    showToast(`MESSAGE DE COMPAGNE FLASH info envoyé à l&apos;ensemble de la flotte.`);
    setBroadcastTitle('');
    setBroadcastMsg('');
  };

  // H2 send custom direct message
  const handleSendDirect = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directContent.trim() || !directRecipient.trim()) return;

    const newComm: Communication = {
      id: `COM-D-${Math.floor(1000 + Math.random() * 9000)}`,
      recipient: directRecipient,
      type: 'Notification Rappel',
      channel: directChannel,
      content: directContent,
      timestamp: new Date().toLocaleString(),
      status: 'Délivré'
    };

    setComms([newComm, ...comms]);
    showToast(`Rappel envoyé avec succès à ${directRecipient} par ${directChannel}.`);
    setDirectContent('');
  };

  const filteredComms = comms.filter(c => 
    (filterChannel === 'All' || c.channel === filterChannel) &&
    (c.recipient.toLowerCase().includes(searchQuery.toLowerCase()) || c.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">

      {/* Action Toast Feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-400">Rappeur &amp; Relances</p>
              <p className="text-xs text-slate-350 font-bold mt-1 leading-relaxed">{toastMessage}</p>
            </div>
            <button onClick={() => setToastMessage(null)} className="text-slate-500 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. Flash Actus & Instant Nofitication Publisher Left (H1, H2 forms) */}
        <div className="space-y-6">
          
          {/* H1 Publication d' actualite flash */}
          <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-rose-600 animate-pulse" />
              <h4 className="text-xs font-black text-slate-900 uppercase italic">H1. Publier un Flash Infos</h4>
            </div>

            <form onSubmit={handlePublishBroadcast} className="space-y-3 text-xs font-bold text-slate-700">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Thème de l&apos;Alerte / Titre</label>
                <input 
                  type="text"
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  placeholder="Ex: Maintenance serveur ou ajout clinique"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold font-bold">Message d&apos;information</label>
                <textarea 
                  rows={2}
                  value={broadcastMsg}
                  onChange={(e) => setBroadcastMsg(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Canal</label>
                  <select 
                    value={broadcastChannel}
                    onChange={(e) => setBroadcastChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold"
                  >
                    <option value="SMS">SMS broadcast</option>
                    <option value="Email">Email ciblé</option>
                    <option value="Push">Push In-App</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-lg text-[9.5px] font-black uppercase tracking-widest transition-transform cursor-pointer"
                  >
                    Diffuser Alerte
                  </button>
                </div>
              </div>
            </form>
          </div>

          {/* H2 Manual notifier simulation */}
          <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Send className="w-5 h-5 text-indigo-600" />
              <h4 className="text-xs font-black text-slate-900 uppercase italic">H2. Rappel / Voeux d&apos;Anniversaire</h4>
            </div>

            <form onSubmit={handleSendDirect} className="space-y-3 text-xs font-bold text-slate-700">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Destinataire</label>
                <input 
                  type="text"
                  value={directRecipient}
                  onChange={(e) => setDirectRecipient(e.target.value)}
                  placeholder="Nom de l&apos;adhérent..."
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Corps du rappel</label>
                <textarea 
                  rows={2}
                  value={directContent}
                  onChange={(e) => setDirectContent(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none font-medium text-xs text-slate-800"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Canal</label>
                  <select 
                    value={directChannel}
                    onChange={(e) => setDirectChannel(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-extrabold"
                  >
                    <option value="SMS">SMS Direct</option>
                    <option value="Email">Email direct</option>
                    <option value="Push">Push Privé</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <button 
                    type="submit"
                    className="w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg text-[9.5px] font-black uppercase tracking-widest transition-transform cursor-pointer"
                  >
                    Envoyer Rappel
                  </button>
                </div>
              </div>
            </form>
          </div>

        </div>

        {/* 2. Middle lists and details of previously logs history */}
        <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4 lg:col-span-2">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-50">
            <div>
              <span className="text-xs font-black text-slate-900 uppercase">Registre de transmission d&apos;Alertes</span>
              <p className="text-[8.5px] font-bold text-slate-400 uppercase">Suivi en temps réel de la délivrabilité</p>
            </div>

            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                placeholder="Recherche destinataire..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredComms.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-150 rounded-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center font-black",
                    item.channel === 'Email' ? "bg-indigo-100 text-indigo-700" : "bg-rose-100 text-rose-700"
                  )}>
                    {item.channel === 'Email' ? '@' : '💬'}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-slate-900 uppercase">{item.recipient}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-bold italic">{item.type} • {item.content}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-600">
                    {item.status}
                  </span>
                  <p className="text-[8.5px] font-mono text-slate-400 block mt-1 font-bold">{item.timestamp}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive automated rules list (H2 UI) */}
          <div className="pt-4 border-t border-slate-100 space-y-4">
            <span className="text-xs font-black text-slate-900 uppercase block">Règles d&apos;engagement automatisées (H2)</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {rules.map((rule) => (
                <div 
                  key={rule.id}
                  onClick={() => handleToggleRule(rule.id)}
                  className={cn(
                    "p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between h-28",
                    rule.active ? "bg-indigo-50 border-indigo-200" : "bg-white border-slate-150"
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2 py-0.5 bg-white border border-slate-200 rounded text-[7.5px] font-black text-slate-400 font-mono uppercase">
                      Rule
                    </span>
                    <div className={cn(
                      "w-2 h-2 rounded-full",
                      rule.active ? "bg-emerald-500 animate-pulse" : "bg-slate-300"
                    )} />
                  </div>

                  <div>
                    <h6 className="text-[11px] font-black text-slate-900 uppercase">{rule.label}</h6>
                    <p className="text-[9px] text-slate-400 font-bold">{rule.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
