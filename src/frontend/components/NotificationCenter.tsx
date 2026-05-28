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
  const [showSettings, setShowSettings] = useState(false);

  // In-app notifications state
  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'notif-1',
      type: 'critical',
      message: '🚨 ALERTE SÉCURITÉ : Taux de charge CPU sur le serveur Firestore-RDC > 92% à Gombe.',
      module: 'system-config',
      timestamp: '2026-05-28 10:14:15',
      isRead: false,
      assignedToMe: false
    },
    {
      id: 'notif-2',
      type: 'action',
      message: '⚠️ ACTIONS REQUISES : 5 dossiers de Pré-autorisations de chirurgie dentaire lourde en attente de validation.',
      module: 'claims',
      timestamp: '2026-05-28 09:30:00',
      isRead: false,
      assignedToMe: true
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
      }
    },
    {
      id: 'notif-4',
      type: 'info',
      message: '✅ COMPLIANCE : Rapport d\'audit CNIL des accès hebdomadaires généré avec succès. 100% conforme.',
      module: 'governance',
      timestamp: '2026-05-27 18:40:00',
      isRead: true,
      assignedToMe: false
    },
    {
      id: 'notif-5',
      type: 'info',
      message: '📅 CONTRAT : Contrat de Tiers Payant renouvelé pour Hôpital Biamba Marie Mutombo.',
      module: 'contracts',
      timestamp: '2026-05-27 10:05:15',
      isRead: true,
      assignedToMe: false
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
                    <span className="text-[9px] text-indigo-300 font-mono tracking-widest uppercase block leading-none">Canaux synchronisés ARCA-RDC</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={cn(
                      "p-1.5 rounded-lg transition-colors cursor-pointer",
                      showSettings ? "bg-indigo-650 text-white" : "hover:bg-white/10 text-slate-300"
                    )}
                    title="Paramètres de diffusion"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
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

            {/* Selector Tabs (Not visible if setting matrix is open) */}
            {!showSettings && (
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
            )}

            {/* Scrollable middle container */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar text-slate-800">
              
              {showSettings ? (
                /* NOTIFICATIONS PREFERENCES PRESET PANEL (ISO 27001 requirements met) */
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="flex items-center gap-1.5 text-slate-800 font-black text-[10.5px] uppercase tracking-wider font-mono border-b pb-2">
                    <Sliders className="w-4 h-4 text-indigo-500" />
                    <span>Matrice de Diffusion (Événement vs Canal)</span>
                  </div>
                  <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                    Configurez où sont dirigées les alertes d'écriture en production. Les événements critiques exigent la messagerie d'urgence SMS.
                  </p>

                  <div className="space-y-4 divide-y divide-slate-150">
                    {notifSettings.map(set => (
                      <div key={set.id} className="pt-3.5 space-y-2">
                        <label className="text-[10.5px] font-bold text-slate-800 block uppercase tracking-tight">{set.event}</label>
                        <div className="grid grid-cols-4 gap-1.5 text-center">
                          {[
                            { id: 'email', label: 'Email', icon: Mail },
                            { id: 'sms', label: 'SMS', icon: MessageSquare },
                            { id: 'push', label: 'Push App', icon: Bell },
                            { id: 'slack', label: 'Slack', icon: BellRing }
                          ].map(cnl => (
                            <button
                              key={cnl.id}
                              type="button"
                              onClick={() => toggleSetting(set.id, cnl.id as any)}
                              className={cn(
                                "py-1.5 rounded-lg border text-[8.5px] font-black uppercase flex flex-col items-center justify-center gap-1 cursor-pointer transition-all",
                                set[cnl.id as 'email' | 'sms' | 'push' | 'slack']
                                  ? "bg-indigo-50 text-indigo-700 border-indigo-300 scale-105"
                                  : "bg-slate-50 text-slate-400 border-slate-200"
                              )}
                            >
                              <cnl.icon className="w-3.5 h-3.5" />
                              <span>{cnl.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setShowSettings(false)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer mt-4"
                  >
                    Retourner aux notifications
                  </button>
                </div>
              ) : (
                /* DEFAULT ALERT LISTINGS (with actions routes) */
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
              )}

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
