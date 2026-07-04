import React, { useState } from 'react';
import { 
  Bell, X, Check, Info, AlertTriangle, ShieldCheck, Settings, 
  Trash2, Mail, MessageSquare, BellRing, Eye, EyeOff, CheckSquare, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

// Core Type Definitions for notifications
export interface AppNotification {
  id: string;
  type: 'critical' | 'action' | 'info';
  message: string;
  module: string;
  timestamp: string;
  isRead: boolean;
  assignedToMe: boolean;
  actionable?: {
    approvedText: string;
    rejectedText: string;
    actionType: 'approve_virement' | 'sign_contract';
    details: string;
  };
  sender?: {
    name: string;
    email: string;
    phone: string;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onModuleChange: (moduleName: string) => void;
  logAction: (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'CRITICAL') => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  onModuleChange,
  logAction
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'critical' | 'assigned'>('all');
  const [selectedSenderId, setSelectedSenderId] = useState<string | null>(null);

  // In-app notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'critical',
      message: '🚨 ALERTE SÉCURITÉ : Taux de charge CPU sur le serveur Firestore-RDC > 92% à Gombe.',
      module: 'system-config',
      timestamp: '2026-05-28 10:14:15',
      isRead: false,
      assignedToMe: false,
      sender: {
        name: 'Support Technique Gombe',
        email: 'support.gombe@neogtec.cd',
        phone: '+243 812 345 678'
      }
    },
    {
      id: 'notif-2',
      type: 'action',
      message: '⚠️ ACTIONS REQUISES : 5 dossiers de Pré-autorisations de chirurgie dentaire lourde en attente de validation.',
      module: 'claims',
      timestamp: '2026-05-28 09:30:00',
      isRead: false,
      assignedToMe: true,
      sender: {
        name: 'Dr. Sarah Mbongo (Dentiste-Conseil)',
        email: 'sarah.mbongo@neogtec.cd',
        phone: '+243 903 888 222'
      }
    },
    {
      id: 'notif-3',
      type: 'action',
      message: '🔐 ACTION FINANCIÈRE : Virement urgent de $84,500 USD vers Hôpital du Cinquantenaire en attente de double signature (4-eyes).',
      module: 'payment',
      timestamp: '2026-05-28 08:15:22',
      isRead: false,
      assignedToMe: true,
      actionable: {
        approvedText: "Virement débloqué par double signature !",
        rejectedText: "Virement rejeté et consigné pour enquête.",
        actionType: 'approve_virement',
        details: 'Acompte Clinique Ngaliema - 84,500 USD'
      },
      sender: {
        name: 'Directeur Financier ARCA',
        email: 'finance.dir@arca.gouv.cd',
        phone: '+243 899 777 555'
      }
    },
    {
      id: 'notif-4',
      type: 'info',
      message: '✅ COMPLIANCE : Rapport d\'audit CNIL des accès hebdomadaires généré avec succès. 100% conforme.',
      module: 'governance',
      timestamp: '2026-05-27 18:40:00',
      isRead: true,
      assignedToMe: false,
      sender: {
        name: 'Bureau Conformité RGPD/CNIL',
        email: 'compliance@neogtec.cd',
        phone: '+243 822 444 666'
      }
    },
    {
      id: 'notif-5',
      type: 'info',
      message: '📅 CONTRAT : Contrat de Tiers Payant renouvelé pour Hôpital Biamba Marie Mutombo.',
      module: 'contracts',
      timestamp: '2026-05-27 10:05:15',
      isRead: true,
      assignedToMe: false,
      sender: {
        name: 'Resp. Relations Prestataires',
        email: 'relations.prestataires@neogtec.cd',
        phone: '+243 811 999 000'
      }
    }
  ]);

  // Settings channels matrices state
  const [notifSettings, setNotifSettings] = useState([
    { id: 'set-1', event: 'Virements lourds (>50k USD)', email: true, sms: true, push: true, slack: true },
    { id: 'set-2', event: 'Suspension d\'un Établissement', email: true, sms: true, push: true, slack: false },
    { id: 'set-3', event: 'Accès CNIL / Export de dossiers', email: true, sms: false, push: true, slack: false },
    { id: 'set-4', event: 'Demande de pré-autorisation', email: false, sms: false, push: true, slack: true },
    { id: 'set-5', event: 'Rapports hebdomadaires', email: true, sms: false, push: false, slack: false }
  ]);

  const toggleSetting = (settingId: string, channel: 'email' | 'sms' | 'push' | 'slack') => {
    setNotifSettings(prev => prev.map(set => {
      if (set.id === settingId) {
        const newVal = !set[channel];
        logAction('MODIF_CONFIG_NOTIF', `Changement canal notifications: ${set.event} -> ${channel.toUpperCase()} : ${newVal ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`, 'SUCCESS');
        return { ...set, [channel]: newVal };
      }
      return set;
    }));
  };

  // Filter alerts
  const displayedNotifications = notifications.filter(notif => {
    if (activeTab === 'critical') return notif.type === 'critical';
    if (activeTab === 'assigned') return notif.assignedToMe;
    return true; // value 'all'
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    logAction('NOTIF_MARK_READ', `Notification ${id} marquée comme lue.`, 'SUCCESS');
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    logAction('NOTIF_MARK_ALL_READ', `Toutes les notifications ont été marquées comme lues.`, 'SUCCESS');
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    logAction('NOTIF_DELETE', `Notification ${id} supprimée du tableau de bord.`, 'WARNING');
  };

  const handleActionClick = (id: string, actionResult: 'approved' | 'rejected') => {
    setNotifications(prev => prev.map(n => {
      if (n.id === id && n.actionable) {
        const text = actionResult === 'approved' ? n.actionable.approvedText : n.actionable.rejectedText;
        logAction(
          actionResult === 'approved' ? 'NOTIF_ACTION_APPROBATION' : 'NOTIF_ACTION_REFUS',
          `Action rapide depuis alerte - ${n.actionable.details} : ${actionResult.toUpperCase()}`,
          actionResult === 'approved' ? 'SUCCESS' : 'CRITICAL'
        );
        return {
          ...n,
          isRead: true,
          message: `✅ ACTIONS ENREGISTRÉES : ${text} (${n.actionable.details})`,
          actionable: undefined // disabled since clicked
        };
      }
      return n;
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent click overlay to catch window closing cleanly */}
          <div className="fixed inset-0 z-[190] bg-slate-900/30 backdrop-blur-xs cursor-pointer" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 380 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl z-[200] flex flex-col justify-between overflow-hidden"
          >
            {/* Header section with notification counts */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-indigo-950 text-white shrink-0">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                    <Bell className="w-4 h-4 text-orange-400 shrink-0" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black uppercase tracking-wider">Centre d'Alertes</h4>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={onClose}
                    className="p-1 rounded-lg hover:bg-white/10 text-white/80 transition-colors cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Summary line */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-[10px] font-mono uppercase bg-indigo-950 px-2 py-0.5 rounded text-indigo-300 font-black border border-indigo-800">
                  {unreadCount} NON LUES
                </span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllAsRead}
                    className="text-[9.5px] font-black uppercase tracking-wider text-green-400 hover:text-green-300 flex items-center gap-1 cursor-pointer"
                  >
                    <CheckSquare className="w-3.5 h-3.5" /> Tout marquer lu
                  </button>
                )}
              </div>
            </div>

            {/* Selector Tabs */}
            <div className="grid grid-cols-3 bg-slate-100 p-1 border-b shrink-0">
              {[
                { id: 'all', label: 'Toutes' },
                { id: 'critical', label: '🔴 Critiques' },
                { id: 'assigned', label: '👤 Assignées' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "py-2 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none text-center",
                    activeTab === tab.id 
                      ? "bg-white text-slate-900 shadow-xs border font-black" 
                      : "text-slate-500 hover:text-slate-800"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Scrollable middle container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-slate-800">
              
              {/* DEFAULT ALERT LISTINGS (with actions routes) */}
              <div className="space-y-3.5 animate-in fade-in duration-150">
                {displayedNotifications.length > 0 ? (
                  displayedNotifications.map(notif => (
                    <div 
                      key={notif.id}
                      className={cn(
                        "p-4 rounded-2xl border text-xs space-y-2.5 relative group hover:shadow-md transition-all",
                        notif.isRead ? "bg-slate-50/75 border-slate-200" : "bg-white shadow-xs border-slate-250",
                        notif.type === 'critical' ? "border-l-4 border-l-rose-500" : notif.type === 'action' ? "border-l-4 border-l-orange-500" : "border-l-4 border-l-sky-500"
                      )}
                    >
                      {/* Circle dot and Date */}
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                        <span className="font-bold">{notif.timestamp}</span>
                        <div className="flex items-center gap-1">
                          {!notif.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 inline-block animate-ping" />
                          )}
                          <span className={cn(
                            "px-1.5 py-0.2 rounded font-black text-[8px] uppercase",
                            notif.type === 'critical' ? "bg-rose-50 text-rose-600" : notif.type === 'action' ? "bg-orange-50 text-orange-600" : "bg-sky-50 text-sky-600"
                          )}>
                            {notif.type}
                          </span>
                        </div>
                      </div>

                      {/* Title details */}
                      <p className={cn(
                        "text-[11.5px] leading-relaxed font-semibold",
                        notif.isRead ? "text-slate-500 line-through" : "text-slate-800"
                      )}>
                        {notif.message}
                      </p>

                      {/* Sender Details with interactive toggle */}
                      {notif.sender && (
                        <div className="pt-0.5 pb-0.5">
                          <button
                            onClick={() => setSelectedSenderId(selectedSenderId === notif.id ? null : notif.id)}
                            className="text-[10px] text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition-all cursor-pointer inline-flex items-center gap-1 font-sans"
                          >
                            <span>Expéditeur : {notif.sender.name}</span>
                          </button>
                          
                          {selectedSenderId === notif.id && (
                            <div className="mt-1.5 p-2 bg-slate-50 border border-slate-200/60 rounded-xl space-y-0.5 text-[9.5px] text-slate-600 font-mono animate-in fade-in duration-100">
                              <div className="font-bold text-slate-700 uppercase tracking-wide text-[8px] mb-0.5">Coordonnées de contact :</div>
                              <div>Email : <span className="font-semibold text-indigo-700">{notif.sender.email}</span></div>
                              <div>Tél : <span className="font-semibold text-indigo-700">{notif.sender.phone}</span></div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Embedded 1-Click Action items if available! */}
                      {notif.actionable && (
                        <div className="p-3 bg-slate-50 border border-indigo-150 rounded-xl space-y-2.5">
                          <span className="text-[9px] font-black uppercase tracking-wider text-indigo-700 block font-mono">⚡ double-visibilité 4-eyes requise :</span>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => handleActionClick(notif.id, 'approved')}
                              className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase tracking-wide cursor-pointer text-center"
                            >
                              Co-signer (Approuver)
                            </button>
                            <button
                              onClick={() => handleActionClick(notif.id, 'rejected')}
                              className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-[9px] font-black uppercase tracking-wide border border-rose-200 cursor-pointer text-center"
                            >
                              Rejeter Virement
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Bottom action toolbar of card */}
                      <div className="flex justify-between items-center pt-1.5 border-t border-slate-100">
                        <button
                          onClick={() => {
                            onModuleChange(notif.module);
                            onClose();
                            markAsRead(notif.id);
                            logAction('NOTIF_ACTION_OUVRIR_MOD', `Ouverture de module ${notif.module} depuis le routeur de notifications.`, 'SUCCESS');
                          }}
                          className="text-[9.5px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" /> Ouvrir le dossier lié
                        </button>

                        <div className="flex items-center gap-2">
                          {!notif.isRead && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                              title="Marquer lu"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button 
                            onClick={() => handleDelete(notif.id)}
                            className="p-1 hover:bg-rose-50 rounded text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Détruire"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))
                ) : (
                  <div className="p-6 bg-slate-50 border border-dashed rounded-2xl text-center text-xs text-slate-400">
                    Vous n'avez aucune alerte active dans cette catégorie. Zenitude absolue.
                  </div>
                )}
              </div>

            </div>

            {/* Bottom help banner for notifications center */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 text-[9px] text-slate-400 font-semibold leading-normal font-mono uppercase tracking-wide text-center shrink-0">
              <span>Réseau d'Acheminement Sécurisé NeoGTec. Tous les événements d'écriture sont signés RFC-7519.</span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
