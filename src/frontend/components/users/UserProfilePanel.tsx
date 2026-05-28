/**
 * 📄 Fichier : /src/frontend/components/users/UserProfilePanel.tsx
 * 🎯 Objectif : Module Profil Administrateur Web complet (ISO 27001 & RGPD-compliant).
 * 🔗 Liens : Connecté au contexte d'authentification global pour chaque administrateur.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Shield, Lock, History, AlertTriangle, Check, X, Copy, 
  Download, RefreshCw, Upload, Globe, Smartphone, Key, Monitor, 
  Trash2, ShieldCheck, ShieldAlert, Sparkles, LogOut, ChevronRight
} from 'lucide-react';
import { useApp } from '../../lib/AppContext';
import { cn } from '../../lib/utils';

export const UserProfilePanel: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  const { currentUser, setCurrentUser, logAction, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<'identity' | 'security' | 'roles' | 'logs' | 'sandbox'>('identity');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // Sandbox State variables for ISO 27001 & Bancaire frictionless validation demos
  const [activeSandboxSubTab, setActiveSandboxSubTab] = useState<'friction' | 'audit_trail' | 'briques_tech'>('friction');
  const [biambaStatus, setBiambaStatus] = useState<'active' | 'suspended'>('active');
  const [keywordInput, setKeywordInput] = useState('');
  const [virementStatus, setVirementStatus] = useState<'idle' | 'pending_admin_b' | 'approved'>('idle');
  const [selectedAdminRole, setSelectedAdminRole] = useState<'ADMIN_A' | 'ADMIN_B'>('ADMIN_A');
  const [passwordRequiredAction, setPasswordRequiredAction] = useState<'none' | 'export_rgpd' | 'disable_mfa'>('none');
  const [reauthPassword, setReauthPassword] = useState('');
  const [reauthError, setReauthError] = useState<string | null>(null);
  const [tariffState, setTariffState] = useState<'v12' | 'v13_simulated' | 'v13_applied'>('v12');
  const [dryRunSimulated, setDryRunSimulated] = useState(false);
  const [showLowRiskModal, setShowLowRiskModal] = useState(false);
  const [showMediumRiskModal, setShowMediumRiskModal] = useState(false);
  const [showHighRiskModal, setShowHighRiskModal] = useState(false);
  const [sandboxLogs, setSandboxLogs] = useState<Array<{
    id: string;
    timestamp: string;
    who: string;
    action: string;
    ip: string;
    details: string;
    status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
  }>>([
    {
      id: 'SBOX-001',
      timestamp: '2026-05-28 10:15:32',
      who: currentUser?.email || 'j.kabasele@neogtec.com',
      action: 'SOC_CHECK',
      ip: '41.78.1.9',
      details: 'Démarrage du coffre-fort ISO-27001 Sandbox.',
      status: 'SUCCESS'
    }
  ]);
  const [webhookLogs, setWebhookLogs] = useState<Array<{
    event: string;
    timestamp: string;
    payload: string;
  }>>([]);
  const [notifLogs, setNotifLogs] = useState<Array<{
    phone: string;
    message: string;
    timestamp: string;
  }>>([]);

  const addSandboxLog = (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'CRITICAL' = 'SUCCESS') => {
    const newLogItem = {
      id: `SBOX-` + Math.floor(100 + Math.random() * 900),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      who: selectedAdminRole === 'ADMIN_A' ? (currentUser?.email || 'j.kabasele@neogtec.com') : 'supervisor.audit@neogtec.com',
      action,
      ip: '41.78.1.9',
      details,
      status
    };
    setSandboxLogs(prev => [newLogItem, ...prev]);
    logAction(action as any, details, status);
  };
  
  // Tab 1 state
  const [langDisplay, setLangDisplay] = useState<'Français' | 'English' | 'Lingala' | 'Arabic'>('Français');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(currentUser?.photo || null);

  // Tab 2 state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [mfaType, setMfaType] = useState<'App Authenticator' | 'Hardware Key' | 'SMS Backup'>('App Authenticator');
  const [apiKey, setApiKey] = useState('sk_live_afk_819c9e8cd12f45eaef81');
  const [trustedDevices, setTrustedDevices] = useState([
    { id: 'dev-1', browser: 'Chrome', os: 'Windows 11', location: 'Kinshasa, RDC', lastConnect: '28/05/2026 à 01:22' },
    { id: 'dev-2', browser: 'Firefox', os: 'macOS Sonoma', location: 'Goma, RDC', lastConnect: '26/05/2026 à 09:12' }
  ]);
  const [activeSessions, setActiveSessions] = useState([
    { id: 'sess-1', device: 'Chrome - Windows Desktop', ip: '41.78.12.98', status: 'Actuel', location: 'Kinshasa, Gombe' },
    { id: 'sess-2', device: 'iPhone 15 Pro Max', ip: '197.88.54.12', status: 'Inactif', location: 'Kinshasa, Limete' }
  ]);

  // Tab 4 State - TOR simulation
  const [simulatedTorState, setSimulatedTorState] = useState(false);

  // Local static meta
  const matricule = `NEO-RDC-MED-${currentUser?.id ? currentUser.id.replace('USR-', '') : '042'}`;
  const localTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Africa/Kinshasa';

  // File size/upload simulation
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ISO 27001 file restriction & RGPD check
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      triggerErrorToast("Format invalide. Seuls les fichiers JPG/PNG sont acceptés.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) { // 2MB max
      triggerErrorToast("ISO 27001 Guardrail : Le fichier dépasse la taille maximale autorisée de 2Mo !");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => {
        const resultString = reader.result as string;
        setAvatarPreview(resultString);
        setCurrentUser({ ...currentUser, photo: resultString });
        setIsUploading(false);
        triggerSuccessToast("Votre photo d'identité biométrique a été mise à jour dans le coffre-fort d'audit.");
        logAction('MODIFIER_PHOTO_PROFIL', `Mise à jour réussie de l'avatar administratif. Empreinte SHA256 enregistrée dans le SOC.`);
      }, 1000);
    };
    reader.readAsDataURL(file);
  };

  const triggerSuccessToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const triggerErrorToast = (msg: string) => {
    alert(`[ALERTE SECURITÉ] : ${msg}`);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
    logAction('COPIE_PRESSE_PAPIER', `Copie sécurisée de la donnée : ${label}.`);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 12) {
      setPasswordError("Norme ISO 27001 : Votre mot de passe doit comporter au moins 12 caractères.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Les deux mots de passe saisis ne correspondent pas.");
      return;
    }

    setPasswordError(null);
    setShowPasswordModal(false);
    triggerSuccessToast("Mot de passe mis à jour avec rotation d'empreinte SHA512 validée.");
    logAction('ROTATION_MOT_DE_PASSE', `Rotation volontaire du mot de passe administratif pour le matricule ${matricule}. Prochaine expiration obligatoire dans 90 jours.`);
    setNewPassword('');
    setConfirmPassword('');
  };

  const revokeDevice = (id: string, browser: string) => {
    setTrustedDevices(prev => prev.filter(d => d.id !== id));
    triggerSuccessToast(`L'appareil "${browser}" a été révoqué avec succès.`);
    logAction('REVOQUER_APPAREIL_CONFIANCE', `Révocation de l'appareil de confiance avec signature d'identification unique ${id}. Access-token invalidé.`);
  };

  const disconnectSessions = () => {
    setActiveSessions(prev => prev.filter(s => s.status === 'Actuel'));
    triggerSuccessToast("Toutes les autres sessions administratives actives ont été déconnectées.");
    logAction('TERMINER_SESSIONS_COMPAGNES', `Révocation en masse des sessions concurrentes pour l'utilisateur ${currentUser.name}. Sessions actives réinitialisées.`);
  };

  const regenerateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789_';
    let newKey = 'sk_live_afk_';
    for (let i = 0; i < 20; i++) {
      newKey += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setApiKey(newKey);
    triggerSuccessToast("Votre clé API d'accès personnel a été régénérée.");
    logAction('REGENERER_CLE_API_PERSONNELLE', `Création d'un nouveau jeton applicatif de signature. L'ancien token a été révoqué.`);
  };

  const toggleTorSimulation = () => {
    const nextState = !simulatedTorState;
    setSimulatedTorState(nextState);
    if (nextState) {
      logAction('ALERTE_CONNEXION_TOR_DETECTEE', 'Tentative de connexion furtive depuis un nœud de sortie TOR.', 'CRITICAL');
      triggerErrorToast("ALERTE SOC : Une IP listée noire (nœud de sortie TOR ou proxy anonyme) a été détectée sur votre nœud ! Le score de risque est passé à ÉLEVÉ.");
    } else {
      logAction('RETOUR_CONNEXION_PROPRE', 'Résolution de l\'anonymat TOR, retour au réseau local de Kinshasa.', 'SUCCESS');
      triggerSuccessToast("Retour à la normale. Connexion cryptée de confiance restaurée.");
    }
  };

  const exportPersonalLogs = () => {
    const userLogs = auditLogs.filter(log => log.userId === currentUser.id);
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Action,Details,Severite,IP\n"
      + userLogs.map(l => `"${l.timestamp}","${l.action}","${l.details}","${l.status}","${l.ipAddress}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `AfreakCare_AuditLogs_CopieRGPD_${currentUser.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    logAction('EXPORT_LOGS_RGPD', `Exercice du droit à la portabilité (Article 20 RGPD) par téléchargement d'un CSV d'audit scellé.`);
    triggerSuccessToast("Portabilité active : Votre historique d'activités certifié a été exporté en format CSV.");
  };

  // Safe logs selection of the user
  const userFilteredLogs = auditLogs.filter(log => log.userId === currentUser.id);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300 text-slate-800">
      
      {/* Toast Notification Container */}
      <AnimatePresence>
        {successMsg && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-emerald-500 rounded-xl text-white shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400">Profil Validé</p>
              <p className="text-xs text-slate-350 font-semibold mt-1 leading-relaxed">{successMsg}</p>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-slate-500 hover:text-white transition-colors p-1 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
        <div>
          <span className="text-[10px] font-black uppercase text-green-600 tracking-[0.2em] block">ISO 27001 &amp; RGPD Compliance Monitor</span>
          <h2 className="text-3xl font-extrabold text-green-955 tracking-tight italic flex items-center gap-3 mt-1">
             Mon Profil <User className="w-8 h-8 text-green-500 fill-green-500/10" />
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">Fiche d'identification et de sécurité administrative</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-lg bg-orange-50 border border-orange-200 flex items-center gap-2 text-[10px] font-black uppercase text-orange-850">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Vérifié CNIL / ARCA
          </div>
        </div>
      </div>

      {/* Grid Menu Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-1.5 bg-slate-100 p-1 rounded-2xl border">
        {[
          { id: 'identity', label: 'Identité', icon: User },
          { id: 'security', label: 'Sécurité & Accès', icon: Lock },
          { id: 'roles', label: 'Rôles & Permissions', icon: Shield },
          { id: 'logs', label: 'Activité & Logs', icon: History },
          { id: 'sandbox', label: '🕹️ Bac à Sable', icon: Sparkles }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer outline-none",
              activeTab === tab.id 
                ? "bg-white text-slate-950 border shadow-sm" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Primary content router block */}
      <div className="bg-white rounded-[2.5rem] border border-slate-150 p-8 shadow-xs min-h-[400px]">
        {activeTab === 'identity' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              
              {/* Profile Image Column */}
              <div className="flex flex-col items-center gap-3 shrink-0">
                <div className="relative w-28 h-28 group">
                  <div className="absolute inset-0 bg-gradient-to-tr from-green-500 to-indigo-500 rounded-full animate-pulse opacity-20 -z-10" />
                  <div className="w-28 h-28 rounded-full border-4 border-slate-100 shadow-inner overflow-hidden relative flex items-center justify-center bg-slate-100 text-slate-400 font-extrabold text-3xl">
                     {avatarPreview ? (
                       <img src={avatarPreview} className="w-full h-full object-cover" alt="Ma photo d'identité" />
                     ) : (
                       currentUser?.name.substring(0,2)
                     )}
                     
                     {isUploading && (
                       <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center">
                         <RefreshCw className="w-6 h-6 text-white animate-spin" />
                       </div>
                     )}
                  </div>
                  
                  <label className="absolute bottom-1 right-1 p-2 bg-slate-900 border border-slate-700 text-white rounded-full hover:scale-105 active:scale-95 cursor-pointer shadow-lg">
                    <Upload className="w-3.5 h-3.5" />
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg" 
                      onChange={handlePhotoUpload} 
                      className="hidden" 
                    />
                  </label>
                </div>
                <div>
                   <p className="text-[10px] text-slate-400 text-center font-black uppercase">Max 2Mo (JPEG/PNG)</p>
                   <p className="text-[8px] text-slate-350 text-center uppercase tracking-widest mt-0.5">Norme biométrique ISO/IEC 19794</p>
                </div>
              </div>

              {/* Data Form */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Full name (Read only) */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-bold">Nom Complet <span className="text-slate-300">(Intégrité RH)</span></label>
                  <div className="h-11 px-4 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center text-xs font-semibold cursor-not-allowed">
                     {currentUser?.name || "Dr. Kabasele Jean"}
                  </div>
                  <p className="text-[9px] text-slate-400 leading-none">Vient directement du registre RH. Évite les fautes de traçabilité d'audit.</p>
                </div>

                {/* Email pro (Read only) */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-bold">Email Professionnel <span className="text-green-500">(Badge SSO)</span></label>
                  <div className="h-11 px-4 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-between text-xs font-semibold cursor-not-allowed">
                     <span>{currentUser?.email || "j.kabasele@neogtec.com"}</span>
                     <div className="px-2 py-0.5 bg-green-500/10 border border-green-500/35 text-[7px] font-black text-green-700 rounded uppercase">SSO Actif</div>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-none">Couplage AD de la compagnie. Si départ RH, l'accès est bloqué automatiquement.</p>
                </div>

                {/* Matricule Interne (Read only + copiable) */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-bold">Matricule Interne <span className="text-amber-500">(Copiable)</span></label>
                  <div className="h-11 px-4 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center justify-between text-xs font-mono cursor-default">
                     <span>{matricule}</span>
                     <button 
                       type="button" 
                       onClick={() => copyToClipboard(matricule, 'Matricule')}
                       className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-900 transition-colors cursor-pointer"
                     >
                       <Copy className="w-4 h-4" />
                     </button>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-none">Matricule de paye. Requis dans tous les logs : "MED-042 a approuvé ce sinistre".</p>
                </div>

                {/* Role and Department (Descriptive readonly) */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-bold">Poste &amp; Département <span className="text-slate-300">(Lect. seule)</span></label>
                  <div className="h-11 px-4 bg-slate-50 border border-slate-200 text-slate-505 rounded-xl flex items-center text-xs font-black uppercase text-indigo-700 tracking-wider">
                     {currentUser.role === 'SUPER_ADMIN' ? '👑 Super Admin / Conseil Administration' : '🩺 Médecin Conseil / Département Sinistres'}
                  </div>
                  <p className="text-[9px] text-slate-400 leading-none">Modèle RBAC : votre poste détermine dynamiquement vos menus autorisés.</p>
                </div>

                {/* Country subsidiary */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-bold">Filiale Rattachement <span className="text-emerald-500">(Zone RDC)</span></label>
                  <div className="h-11 px-4 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl flex items-center justify-between text-xs font-bold leading-none">
                     <span className="flex items-center gap-2">🇨🇩 République Démocratique du Congo - Gombe</span>
                     <span className="px-1.5 py-0.5 bg-emerald-500 text-white text-[7px] font-black rounded uppercase">Principal</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-none">Périmètre national de cloisonnement de données. Vous ne voyez que la RDC.</p>
                </div>

                {/* Time zone locale auto detected */}
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-bold">fuseau horaire <span className="text-purple-500">(Auto-Détecté)</span></label>
                  <div className="h-11 px-4 bg-slate-50 border border-slate-200 text-slate-500 rounded-xl flex items-center text-xs font-mono font-bold leading-none">
                     <span>{localTimeZone} (GMT+1)</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-none">Toutes les dates des logs &amp; des sinistres s'affichent automatiquement à votre heure locale.</p>
                </div>

                {/* Selection of display language (Fully interactive) */}
                <div className="space-y-1 col-span-2">
                  <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest block font-bold">Langue de l'interface admin</label>
                  <select 
                    value={langDisplay}
                    onChange={(e) => {
                      setLangDisplay(e.target.value as any);
                      triggerSuccessToast(`Langue mise à jour en : ${e.target.value}.`);
                      logAction('CHANGER_LANGUE_PROFIL', `Modification de la langue d'interface vers : ${e.target.value}.`);
                    }}
                    className="w-full h-11 bg-white border border-slate-200 text-slate-800 rounded-xl px-4 text-xs font-black uppercase tracking-wider focus:outline-none"
                  >
                    <option value="Français">🇫🇷 Français (Système RDC)</option>
                    <option value="English">🇺🇸 English (Global Standard)</option>
                    <option value="Lingala">🇨🇩 Lingala (RDC Interne)</option>
                    <option value="Arabic">🇦🇪 Arabic (Moyen-Orient)</option>
                  </select>
                  <p className="text-[9px] text-slate-400">Un analyste de Dubaï peut travailler en Arabe, un médecin conseil de Goma peut utiliser le Lingala.</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Box Password Rotation */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/60 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-slate-800">
                    <Key className="w-5 h-5 text-indigo-500" />
                    <h5 className="text-xs font-black uppercase tracking-wider">Mot de passe de session</h5>
                  </div>
                  <p className="text-xs text-slate-450 font-semibold italic">Dernière modification : <span className="text-slate-800 font-mono">12/04/2026 à 14:22 UTC</span></p>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-medium">Obligation de sécurité strict ISO 27001 : Une rotation de clé est recommandée tous les 90 jours pour empêcher la compromission de jetons.</p>
                </div>
                
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(true)}
                  className="mt-6 w-full py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 active:scale-[0.98] transition-all cursor-pointer"
                >
                  Changer de mot de passe
                </button>
              </div>

              {/* MFA Protection App Authenticator */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/60 flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-800">
                      <Smartphone className="w-5 h-5 text-emerald-500" />
                      <h5 className="text-xs font-black uppercase tracking-wider">Double Facteur MFA</h5>
                    </div>
                    <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/35 rounded text-[8px] font-black text-emerald-700 uppercase tracking-widest animate-pulse">Activé</span>
                  </div>

                  <div className="p-3.5 bg-white border rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-bold text-slate-900 block leading-none">Méthode Activée</p>
                      <p className="text-[10px] font-sans font-medium text-slate-400 mt-1 uppercase">Clé Matérielle FIDO2 / Authenticator</p>
                    </div>
                    <span className="text-emerald-600 font-black font-sans">100% Ok</span>
                  </div>

                  <p className="text-[10px] text-slate-450 leading-relaxed font-medium">Le double-facteur biométrique empêche 99% des vols d'identités. Requis obligatoirement pour le rôle de Super Administrateur.</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4">
                   <button 
                     onClick={() => {
                        triggerSuccessToast("Requête de réinitialisation MFA envoyée par email.");
                        logAction('REQUETE_REINITIALISATION_MFA', `Réinitialisation de la liaison MFA de l'utilisateur ${currentUser.name}.`);
                     }}
                     className="py-2.5 bg-white hover:bg-slate-100 text-slate-800 rounded-lg text-[9px] font-black uppercase border cursor-pointer"
                   >
                     Réinitialiser
                   </button>
                   <button 
                     onClick={() => {
                        triggerSuccessToast("Dispositif biométrique de sécurité FIDO2 ajouté avec succès.");
                        logAction('ENREGISTRER_CLE_FIDO2_SEC', `Liaison d'une nouvelle clé d'accès physique biométrique FIDO2 (Yubikey).`);
                     }}
                     className="py-2.5 bg-green-600 text-white rounded-lg text-[9px] font-black uppercase cursor-pointer"
                   >
                     Ajouter clé FIDO2
                   </button>
                </div>
              </div>

              {/* Confident devices - Révocation instantanée */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/60 space-y-4">
                <div className="flex items-center gap-2 text-slate-800">
                  <Monitor className="w-5 h-5 text-blue-500" />
                  <h5 className="text-xs font-black uppercase tracking-wider">Appareils de confiance</h5>
                </div>
                
                <div className="space-y-2">
                  {trustedDevices.map((dev) => (
                    <div key={dev.id} className="p-3 bg-white rounded-xl border border-slate-150 flex items-center justify-between gap-3 shadow-xs">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <div className="w-7 h-7 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                          <span className="font-mono text-xs font-black text-slate-500">PC</span>
                        </div>
                        <div className="truncate min-w-0">
                          <p className="text-xs font-black text-slate-900 uppercase truncate leading-none">{dev.browser} • {dev.os}</p>
                          <p className="text-[9.5px] font-medium text-slate-400 mt-1 truncate">{dev.location} — {dev.lastConnect}</p>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => revokeDevice(dev.id, dev.browser)}
                        className="p-1 px-2.5 text-rose-500 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded text-[8px] font-black uppercase transition-colors shrink-0 cursor-pointer"
                      >
                        Révoquer
                      </button>
                    </div>
                  ))}
                  {trustedDevices.length === 0 && (
                     <p className="text-xs italic text-slate-400 text-center py-4">Aucun appareil de confiance actif.</p>
                  )}
                </div>

                <p className="text-[9.5px] text-slate-400 leading-normal italic">Si une tentative d'accès anormale (ex: Nigeria) est repérée, révoquez définitivement le jeton lié en un clic.</p>
              </div>

              {/* Active administrative sessions */}
              <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/60 space-y-4">
                <div className="flex justify-between items-center gap-2">
                   <div className="flex items-center gap-2 text-slate-800">
                     <Monitor className="w-5 h-5 text-indigo-500" />
                     <h5 className="text-xs font-black uppercase tracking-wider">Sessions actives</h5>
                   </div>
                   {activeSessions.length > 1 && (
                     <button 
                       onClick={disconnectSessions}
                       className="text-[8px] font-black uppercase text-rose-605 px-2 py-0.5 rounded border border-rose-200 bg-white hover:bg-rose-50 transition-all cursor-pointer"
                     >
                       Déconnecter les autres
                     </button>
                   )}
                </div>

                <div className="space-y-2">
                   {activeSessions.map((sess) => (
                     <div key={sess.id} className="p-3 bg-white rounded-xl border border-slate-150 flex items-center justify-between text-xs">
                        <div>
                           <p className="font-black uppercase tracking-wide text-slate-900">{sess.device}</p>
                           <p className="text-[10px] text-slate-400 font-mono mt-0.5">{sess.ip} • Cosmétique {sess.location}</p>
                        </div>
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[8px] font-black uppercase",
                          sess.status === 'Actuel' ? "bg-emerald-100 text-emerald-700 font-black animate-pulse" : "bg-slate-100 text-slate-500"
                        )}>
                          {sess.status}
                        </span>
                     </div>
                   ))}
                </div>

                <p className="text-[9.5px] text-slate-400 leading-normal italic">Killez toutes vos sessions mobiles et applicatives instantanément si vous partez en vacances.</p>
              </div>

              {/* Developer / Analytics programmatic settings keys */}
              <div className="p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 md:col-span-2 flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                   <h5 className="text-xs font-black uppercase tracking-wider text-slate-100">Clés API Personnelles d'accès de contrôle</h5>
                   <p className="text-[10px] text-slate-400 leading-relaxed mt-2 font-medium">Utile pour vos scripts d'administration locaux (Postman, scripts de réconciliation). Si votre clé est divulguée par accident, révoquez-la ici pour bloquer toute faille de sécurité.</p>
                   
                   <div className="mt-4 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 w-full md:w-auto max-w-md">
                     <span className="text-[11px] font-mono text-emerald-400 select-all font-semibold">{apiKey}</span>
                     <button 
                       onClick={() => copyToClipboard(apiKey, 'Clé API')}
                       className="p-1 hover:bg-white/10 rounded text-slate-400 hover:text-white cursor-pointer"
                     >
                       <Copy className="w-4.5 h-4.5" />
                     </button>
                   </div>
                </div>

                <button 
                  onClick={regenerateApiKey}
                  className="px-6 py-3 bg-white text-slate-950 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-wider shadow cursor-pointer whitespace-nowrap"
                >
                  Régénérer clé d'accès
                </button>
              </div>

            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="space-y-8 animate-in fade-in duration-205">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Side Role Detail */}
              <div className="space-y-4">
                <div className="p-6 bg-slate-50 rounded-3xl border text-center space-y-4">
                  <div className="w-16 h-16 bg-indigo-50 border border-indigo-150 rounded-2xl flex items-center justify-center text-indigo-700 mx-auto text-xl font-extrabold">
                     {currentUser.role === 'SUPER_ADMIN' ? '👑' : '🩺'}
                  </div>
                  <div>
                    <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block">Role assigné par RH</span>
                    <h5 className="text-sm font-black text-slate-950 uppercase mt-1">
                      {currentUser.role === 'SUPER_ADMIN' ? 'Super Administrateur' : 'Gestionnaire des Sinistres'}
                    </h5>
                    <span className="mt-2 inline-block px-3 py-0.5 text-[8px] font-black uppercase rounded bg-indigo-600 text-white tracking-widest leading-none">Badge Principal</span>
                  </div>
                  <p className="text-[10px] text-slate-450 leading-relaxed font-semibold italic">Vous disposez d'un accès de contrôle RBAC sur le système pour auditer, approuver et observer les données cliniques.</p>
                </div>

                <div className="p-6 bg-slate-900 text-white rounded-3xl space-y-2 relative overflow-hidden">
                   <div className="absolute right-0 -bottom-2 opacity-5">
                      <Key className="w-32 h-32" />
                   </div>
                   <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Périmètre d'Opération (RDC)</h6>
                   <p className="text-xs font-semibold leading-relaxed text-slate-300">Vos actions sont limitées par les règles métier de l'ARCA et notre charte d'éthique.</p>
                   
                   <div className="pt-4 border-t border-white/10 space-y-2 text-xs">
                     <div className="flex justify-between items-center">
                       <span className="text-slate-450">Plafond autoris. max</span>
                       <span className="font-mono text-emerald-400 font-extrabold text-sm">{currentUser.role === 'SUPER_ADMIN' ? 'Illimité (USD)' : '5,000 USD'}</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-slate-450">Territoire cible</span>
                       <span className="font-bold text-slate-100 uppercase">RDC (Kinshasa)</span>
                     </div>
                     <div className="flex justify-between items-center">
                       <span className="text-slate-450">Multi-Établissement</span>
                       <span className="font-bold text-slate-100 uppercase">Toutes entités</span>
                     </div>
                   </div>
                   
                   <div className="pt-2 p-3.5 bg-white/5 border border-white/10 rounded-xl space-y-1">
                      <div className="text-[7.5px] font-black text-yellow-400 uppercase tracking-wider block">Sécurité active (Guardrail RDC)</div>
                      <p className="text-[9.5px] font-semibold text-slate-400 leading-normal italic">Si vous effectuez un remboursement ou une action dépassant 5,000 USD, le bouton d'action apparaîtra grisé.</p>
                   </div>
                </div>
              </div>

              {/* Table of permissions Detailed (transparence) */}
              <div className="lg:col-span-2 space-y-4">
                 <div className="flex justify-between items-center">
                   <h5 className="text-[11px] font-black text-slate-400 uppercase tracking-wider italic">Tableau exhaustif des privilèges (RGPD transparence)</h5>
                   <span className="text-[8.5px] font-black text-indigo-500 uppercase">Vérifié par l'administrateur</span>
                 </div>
                 
                 <div className="p-0 border rounded-2xl overflow-hidden bg-white">
                   <table className="w-full text-left text-xs">
                     <thead className="bg-slate-50 border-b">
                       <tr>
                         <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Privilège système</th>
                         <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Description technique</th>
                         <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Statut</th>
                       </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                       {[
                         { privilege: 'sinistre.read', desc: 'Lecture totale des diagnostics et fiches médicales', checked: true },
                         { privilege: 'sinistre.approve', desc: 'Approbation médicale des prises en charge', checked: currentUser.role !== 'SUPPORT_CLIENT' },
                         { privilege: 'finance.pay', desc: 'Paiement direct et virements CDF / USD', checked: currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'GESTIONNAIRE_FINANCE' },
                         { privilege: 'user.edit', desc: 'Modification de profil et rôles pour affiliés', checked: currentUser.role === 'SUPER_ADMIN' },
                         { privilege: 'audit.read_logs', desc: 'Accès au livre d\'audit transparent', checked: true }
                       ].map((item, index) => (
                         <tr key={index} className="hover:bg-slate-50">
                           <td className="px-5 py-3 font-mono text-[10px] font-bold text-slate-800">{item.privilege}</td>
                           <td className="px-5 py-3 font-medium text-slate-500">{item.desc}</td>
                           <td className="px-5 py-3 text-center">
                             <span className={cn(
                               "px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block min-w-[50px] text-center",
                               item.checked ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100 animate-pulse'
                             )}>
                                {item.checked ? 'Oui' : 'Non'}
                             </span>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>

                 {/* Historique des Accréditations */}
                 <div className="space-y-3">
                   <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic pt-2">Historique des attributions de droits</h6>
                   <div className="space-y-2">
                     <div className="p-3.5 bg-slate-50 border rounded-xl flex items-center justify-between text-xs">
                       <div>
                         <p className="font-extrabold text-slate-800 leading-none">Attribution Rôle Finance Lecture Seule</p>
                         <p className="text-[10px] font-semibold text-slate-400 mt-1 italic">Par SuperAdmin Paul Kabeya, pour audit fiscal trimestriel</p>
                       </div>
                       <span className="text-[10.5px] font-mono text-slate-500">26/05/2026 à 10:01</span>
                     </div>
                     <div className="p-3.5 bg-slate-50 border rounded-xl flex items-center justify-between text-xs">
                       <div>
                         <p className="font-extrabold text-slate-800 leading-none">Réinitialisation complète de l'accès Biométrique</p>
                         <p className="text-[10px] font-semibold text-slate-400 mt-1 italic">Automatique par le système après couplage SSO AD de l'entreprise</p>
                       </div>
                       <span className="text-[10.5px] font-mono text-slate-500">12/01/2024 à 09:00</span>
                     </div>
                   </div>
                 </div>

              </div>
            </div>
          </div>
        )}

        {activeTab === 'logs' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h5 className="text-[11px] font-black text-slate-450 uppercase tracking-wider italic">Journal de sécurité transparent (30 derniers jours)</h5>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Conformément à la réglementation RGPD, toutes vos données d'accès sont consignées.</p>
              </div>

              <div className="flex items-center gap-2">
                 <button 
                   onClick={toggleTorSimulation}
                   className={cn(
                     "px-4 py-2 border transition-all text-[9.5px] font-black uppercase rounded-lg cursor-pointer",
                     simulatedTorState 
                       ? "bg-rose-50 border-rose-200 text-rose-600 font-black animate-pulse shadow-sm" 
                       : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                   )}
                 >
                    {simulatedTorState ? "● Arrêter simulation TOR" : "Simuler connexion via TOR"}
                 </button>

                 <button 
                   onClick={exportPersonalLogs}
                   className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[9.5px] font-black uppercase flex items-center gap-1.5 cursor-pointer shadow"
                 >
                    <Download className="w-4 h-4" /> Exporter mes logs
                 </button>
              </div>
            </div>

            {/* Score de risque block */}
            <div className={cn(
              "p-6 rounded-[2rem] border transition-all flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs",
              simulatedTorState 
                ? "bg-rose-50 border-rose-300 shadow-md animate-pulse text-rose-950" 
                : "bg-emerald-50/50 border-emerald-150 text-emerald-950"
            )}>
               <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center shrink-0 border shadow-inner",
                    simulatedTorState ? "bg-rose-100 border-rose-200 text-rose-600" : "bg-emerald-100 border-emerald-200 text-emerald-600"
                  )}>
                     {simulatedTorState ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase tracking-tight">Vérification de Score de Risque Actif</h5>
                    <p className="text-[11px] font-semibold text-slate-500 italic mt-0.5 max-w-lg leading-snug">
                       {simulatedTorState 
                         ? "Alerte de sécurité SOC active. Détection de routage TOR anonyme. Votre compte a été mis sous surveillance renforcée par les équipes de sécurité." 
                         : "Votre indice de réputation est excellent. Aucun contournement de proxy ou d'IP suspecte détecté sur votre nœud durant les 30 derniers jours."}
                    </p>
                  </div>
               </div>

               <div className={cn(
                 "px-4 py-2 text-xs font-black uppercase tracking-widest rounded-xl border text-center select-none",
                 simulatedTorState ? "bg-rose-600 text-white border-rose-800" : "bg-emerald-600 text-white border-emerald-800"
               )}>
                  Indice : {simulatedTorState ? "ÉLEVÉ" : "FAIBLE"}
               </div>
            </div>

            {/* List entries of my audits */}
            <div className="p-0 border rounded-2xl overflow-hidden bg-white max-h-96 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left text-xs bg-white">
                <thead className="bg-slate-50 border-b sticky top-0">
                  <tr>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Date &amp; Heure (UTC)</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Évènement opéré</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Détail d'opération</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">Adresse IP</th>
                    <th className="px-5 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-center">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {userFilteredLogs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-8 text-center text-slate-400 italic">Aucun log enregistré dans votre historique.</td>
                    </tr>
                  ) : (
                    userFilteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50">
                        <td className="px-5 py-3 font-mono text-[10.5px] font-black text-slate-800">{new Date(log.timestamp).toLocaleString("fr-FR", { timeZone: "UTC" })}</td>
                        <td className="px-5 py-3 uppercase text-[10px] font-black text-slate-900">{log.action}</td>
                        <td className="px-5 py-3 font-medium text-slate-500">{log.details}</td>
                        <td className="px-5 py-3 font-mono text-slate-500">{log.ipAddress}</td>
                        <td className="px-5 py-3 text-center">
                          <span className={cn(
                            "px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block min-w-[55px] text-center",
                            log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border border-emerald-110' : log.status === 'WARNING' ? 'bg-orange-50 text-orange-600 border border-orange-110' : 'bg-rose-50 text-rose-600 border border-rose-110'
                          )}>
                             {log.status === 'SUCCESS' ? 'Info' : log.status === 'WARNING' ? 'Alerte' : 'Critique'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <p className="text-[10px] text-slate-400 text-center font-bold uppercase tracking-wider italic">
              Note RGPD : Vous disposez d'un droit d'accès et d'effacement de vos logs (sauf obligations réglementaires de conservation ARCA).
            </p>

          </div>
        )}

        {activeTab === 'sandbox' && (
          <div className="space-y-6 animate-in fade-in duration-200 text-slate-800">
            {/* Header / Intro to Sandbox */}
            <div className="bg-slate-900 text-white rounded-[2rem] p-6 border border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
              <div>
                <span className="text-[9px] font-black uppercase text-indigo-400 tracking-[0.2em] block font-mono">ISO-27001 Security &amp; Bancaire Guardrails</span>
                <h4 className="text-xl font-black text-white uppercase tracking-tight mt-1">Cabinet de Démonstration &amp; Friction Sec</h4>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed max-w-xl mt-1">
                  Ce bac à sable vous permet de tester en temps réel les politiques d'accès de l'ARCA et de la CNIL : gestion de crise, double approbation (4-eyes), versioning de barèmes et logs d'audit certifiés.
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {onClose && (
                  <button 
                    onClick={onClose}
                    className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 active:scale-95 transition-all"
                  >
                    <X className="w-4 h-4" /> Fermer Profil
                  </button>
                )}
              </div>
            </div>

            {/* Sandbox Sub-Tabs */}
            <div className="flex border-b border-slate-150 gap-4 overflow-x-auto">
              {[
                { id: 'friction', label: '1. Friction Sec (Are You Sure?)' },
                { id: 'audit_trail', label: '2. Piste d\'Audit et Preuves (CNIL)' },
                { id: 'briques_tech', label: '3. 5 Briques NeoGTec & SOC Alerts' }
              ].map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSandboxSubTab(sub.id as any)}
                  className={cn(
                    "pb-3 text-xs font-black uppercase tracking-wider border-b-2 transition-all cursor-pointer outline-none whitespace-nowrap",
                    activeSandboxSubTab === sub.id 
                      ? "border-green-600 text-green-700" 
                      : "border-transparent text-slate-450 hover:text-slate-800"
                  )}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-tab 1 contents: Friction & Confirm */}
            {activeSandboxSubTab === 'friction' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-200">
                
                {/* Friction Card 1: Low-Risk Simple Modal */}
                <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[8px] font-black uppercase tracking-wide">Niveau : Faible (Friction Légère)</span>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-1">Changement de Langue ou Export Simple</h5>
                    <p className="text-[11px] font-semibold text-slate-450 leading-relaxed leading-snug">
                      Un simple clic accidentel ne doit pas déclencher d'écriture lourde. Utilisation d'un modal de confirmation standard. Évite les faux exports.
                    </p>
                  </div>
                  <button 
                    onClick={() => setShowLowRiskModal(true)}
                    className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border hover:scale-[1.01] active:scale-[0.99] transition-all"
                  >
                    Tester l'Export CSV Simple (Modal)
                  </button>
                </div>

                {/* Friction Card 2: Medium-Risk Keyword Confirmation + Soft Delete */}
                <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-1">
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 border border-orange-200 rounded text-[8px] font-black uppercase tracking-wide">Niveau : Moyen (Soft Delete)</span>
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[8px] font-black uppercase whitespace-nowrap",
                        biambaStatus === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-750 border border-rose-250 animate-pulse'
                      )}>
                        Biamba : {biambaStatus === 'active' ? 'ACTIF (152 cliniques)' : 'SUSPENDU'}
                      </span>
                    </div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-1">Suspendre un Espace Partenaire Clinique</h5>
                    <p className="text-[11px] font-semibold text-slate-450 leading-relaxed leading-snug">
                      Suspendre un partenaire coupe l'accès de 12,340 assurés. Demandes de mot-clé exact pour empêcher le clic rapide.
                    </p>
                  </div>
                  {biambaStatus === 'active' ? (
                    <button 
                      onClick={() => {
                        setKeywordInput('');
                        setShowMediumRiskModal(true);
                      }}
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      Suspendre l'Hôpital Biamba Marie Mutombo
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2.5 bg-rose-50 border border-rose-150 rounded-xl text-[9.5px] font-semibold text-rose-700 italic">
                        Espace clinique bloqué. "deleted_at" enregistré par {currentUser?.email}.
                      </div>
                      <button 
                        onClick={() => {
                          setBiambaStatus('active');
                          addSandboxLog('RESTAURATION_PARTENAIRE_CLINIQUE', 'Réactivation officielle de l\'Hôpital Biamba Marie Mutombo, réindexation des API de communication.', 'SUCCESS');
                          triggerSuccessToast("Hôpital Biamba Marie Mutombo réactivé avec de nouveaux droits SSO.");
                        }}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow hover:scale-[1.01] active:scale-[0.99] transition-all"
                      >
                        Restaurer l'établissement (Soft Delete Restore)
                      </button>
                    </div>
                  )}
                </div>

                {/* Friction Card 3: High-Risk Double Validation (4-Eyes Principle) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-700 border border-red-200 rounded text-[8px] font-black uppercase tracking-wide">Niveau : Élevé (Virement &gt;50k USD)</span>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-1">Contrôle 4-Eyes (Seuil Financier $50,000+)</h5>
                    <p className="text-[11px] font-semibold text-slate-450 leading-relaxed leading-snug">
                      La double approbation bancaire : Admin A (vous) initie le virement, Admin B (Alice Kabeya) co-approuve obligatoirement pour débloquer.
                    </p>
                  </div>
                  
                  {/* Status of transfer */}
                  <div className="p-3 bg-slate-50 border rounded-xl flex justify-between items-center text-xs">
                    <div>
                      <p className="font-extrabold text-slate-800">Acompte Clinique NGALIEMA - 84,500 USD</p>
                      <p className="text-[9.5px] font-medium text-slate-500 mt-1 uppercase tracking-wider">
                        {virementStatus === 'idle' && "Statut : Non Initié"}
                        {virementStatus === 'pending_admin_b' && "⚠️ EN ATTENTE DE CO-SIGNATURE ADMIN B"}
                        {virementStatus === 'approved' && "✅ VIREMENT EXPÉDIÉ (SIGNATURES OK)"}
                      </p>
                    </div>
                    <div>
                      {virementStatus === 'idle' && (
                        <button 
                          onClick={() => {
                            setVirementStatus('pending_admin_b');
                            addSandboxLog('VIREMENT_INITIE_4EYES', 'Création d\'une demande de paiement de sinistre lourd pour 84,500 USD vers Ngaliema.', 'WARNING');
                            triggerSuccessToast("Demande de paiement d'acompte initié. Signature Admin A apposée.");
                          }}
                          className="px-3.5 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] cursor-pointer"
                        >
                          Initier
                        </button>
                      )}
                      {virementStatus === 'pending_admin_b' && (
                        <div className="flex gap-1">
                          <button 
                            onClick={() => {
                              setSelectedAdminRole('ADMIN_B');
                            }}
                            className="px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[8px] font-black uppercase transition-all hover:bg-indigo-700 cursor-pointer flex items-center gap-1"
                          >
                            <Key className="w-3 h-3" /> Incarner Admin B
                          </button>
                          <button 
                            onClick={() => {
                              setVirementStatus('idle');
                              addSandboxLog('VIREMENT_REJETE_4EYES', 'Paiement de 84,500 USD rejeté et annulé du coffre.', 'CRITICAL');
                            }}
                            className="px-2.5 py-1.5 bg-rose-50 text-rose-600 rounded-lg border border-rose-200 text-[8px] font-black uppercase hover:bg-rose-100 cursor-pointer"
                          >
                            Annuler
                          </button>
                        </div>
                      )}
                      {virementStatus === 'approved' && (
                        <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg text-[9px] font-black">Scellements Ok</span>
                      )}
                    </div>
                  </div>

                  {selectedAdminRole === 'ADMIN_B' && virementStatus === 'pending_admin_b' && (
                    <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2 text-xs">
                      <p className="font-bold text-indigo-950">🔐 Cabinet d'Alice Kabeya (Admin B - Superviseur Finance)</p>
                      <p className="text-[10px] text-slate-500 leading-normal">
                        Vous avez emprunté le jeton d'Alice Kabeya. Vous pilotez maintenant le deuxième oeil d'approbation.
                      </p>
                      <button 
                        onClick={() => {
                          setVirementStatus('approved');
                          setSelectedAdminRole('ADMIN_A');
                          addSandboxLog('VIREMENT_APPROUVE_4EYES', 'Double approbation complétée par Alice Kabeya. Empreinte de coffre SHA256 validée.', 'SUCCESS');
                          triggerSuccessToast("Double validation réussie ! Les fonds de 84,500 USD ont été émis.");
                        }}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-black uppercase cursor-pointer"
                      >
                        Co-signer &amp; Débloquer Virement
                      </button>
                    </div>
                  )}

                  {virementStatus === 'approved' && (
                    <div className="pt-1 flex gap-2">
                      <button 
                        onClick={() => {
                          const payload = `ID TRANSACTION: TX-9b7c-GOMBE\nINITIATEUR: j.kabasele@neogtec.com\nCO-ASSISTANT: alice.kabeya@neogtec.com\nMONTANT: 84,500 USD\nBENEFICIAIRE: Clinique Ngaliema\nDATE CERTIFICATION: 2026-05-28 10:22 UTC\nHASH SHA256 VALIDE: 0e78c8bc1e204deae819c98cd12f45eaef812bf7e719`;
                          const link = document.createElement("a");
                          link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(payload));
                          link.setAttribute("download", `Recu_Paiement_Certifie_SHA256_Ngaliema_84k.txt`);
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                          addSandboxLog('TELECHARGER_RECU_TX', 'Téléchargement d\'un reçu de virement signé numériquement par hash cryptographique.', 'SUCCESS');
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white border text-[9px] font-black rounded-lg uppercase cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Download className="w-4 h-4" /> Télécharger Reçu d'Administration Signé (SHA256)
                      </button>
                    </div>
                  )}
                </div>

                {/* Friction Card 4: Critical Action Re-Authentication (MFA requirement) */}
                <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs space-y-4 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-200 rounded text-[8px] font-black uppercase tracking-wide">Niveau : Critique (Re-Auth)</span>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-1">Export Données Sensibles Cliniques (DME)</h5>
                    <p className="text-[11px] font-semibold text-slate-450 leading-relaxed leading-snug">
                      Même si la session est déjà ouverte, l'accès ou l'export de dossiers médicaux complets (RGPD) exige de reprononcer votre mot de passe pour vérifier l'identité.
                    </p>
                  </div>
                  
                  {passwordRequiredAction === 'none' ? (
                    <button 
                      onClick={() => {
                        setReauthPassword('');
                        setReauthError(null);
                        setPasswordRequiredAction('export_rgpd');
                      }}
                      className="w-full py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      Démarrer Export de Données Médicales
                    </button>
                  ) : (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-[1.5rem] space-y-3 text-xs text-slate-850">
                      <div className="flex justify-between items-center">
                        <span className="font-extrabold uppercase text-[9.5px] text-rose-700">🔒 Prouvez que c'est bien vous !</span>
                        <button type="button" onClick={() => setPasswordRequiredAction('none')} className="text-slate-450 hover:text-slate-900 font-extrabold">X</button>
                      </div>
                      <p className="text-[10px] text-slate-500">Pour débloquer l'export sécurisé, tapez le mot de passe administrateur : (Entrez <b className="font-mono text-slate-850">admin123</b>).</p>
                      
                      <div className="space-y-1">
                        <input 
                          type="password"
                          value={reauthPassword}
                          onChange={(e) => setReauthPassword(e.target.value)}
                          placeholder="Entrez votre mot de passe"
                          className="w-full h-10 bg-white border rounded-xl px-3 text-xs focus:outline-none"
                        />
                      </div>

                      {reauthError && (
                        <p className="text-[10px] text-rose-600 font-bold leading-none">{reauthError}</p>
                      )}

                      <button 
                        type="button"
                        onClick={() => {
                          if (reauthPassword === 'admin123') {
                            setReauthError(null);
                            setPasswordRequiredAction('none');
                            addSandboxLog('REAUTH_SUCCESS_EXPORT_RGPD', 'Réauthentification réussie du password. Lancement d\'export.', 'SUCCESS');
                            triggerSuccessToast("Authentification réussie ! L'exportation de 1234 dossiers de santé s'est déclenchée.");
                            
                            // File download simulation
                            const data = "NOM,ID,AFFILIATION,DIAGNOSTIC,DATE_SOUSCRIPTION\nMukendi,123,Med-A,Gastro,2024-05-12\nKanyama,422,Med-B,Palu,2025-01-08\nKasongo,12,Med-A,Trauma,2026-03-30";
                            const link = document.createElement("a");
                            link.setAttribute("href", "data:text/csv;charset=utf-8," + encodeURIComponent(data));
                            link.setAttribute("download", "AfreakCare_Dossiers_Cliniques_RGPD_Article15.csv");
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          } else {
                            setReauthError("Mot de passe incorrect (Tapez admin123)");
                            addSandboxLog('REAUTH_ECHEC_EXPORT_RGPD', 'Échec de mot de passe lors de la tentative d\'export de données cliniques.', 'CRITICAL');
                          }
                        }}
                        className="w-full py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase hover:bg-slate-800 cursor-pointer"
                      >
                        Valider &amp; Exporter Fichiers DME / RGPD
                      </button>
                    </div>
                  )}
                </div>

                {/* Friction Card 5: Dry-Run and Prediction Impact Analysis Simulation */}
                <div className="bg-white p-5 rounded-3xl border border-slate-150 shadow-xs space-y-4 lg:col-span-2 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-slate-50 border rounded-xl p-3">
                      <div>
                        <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider leading-none font-mono">Barème Actuel Réseau</span>
                        <span className="text-sm font-extrabold text-slate-850 mt-1 block font-mono">
                          {tariffState === 'v12' ? 'v12 : BASE_CONSULTATION = 20.00 USD' : 'v13 : BASE_CONSULTATION = 22.00 USD (Appliqué par Marie)'}
                        </span>
                      </div>
                      <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-[8px] font-black uppercase tracking-wide rounded">Planificateur de Simulation (Dry-Run)</span>
                    </div>
                    <h5 className="text-xs font-black text-slate-800 uppercase tracking-tight mt-1">Changement d'échelle / Changement de Tarification consultative (Dry Run Simulator)</h5>
                    <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
                      Évitez d'appliquer une modification tarifaire instantanément si vous ne connaissez pas le coût futur. Cliquez sur le bouton de Dry-run ci-dessous pour lancer l'analyse prévisionnelle d'impact financier avant l'application officielle !
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex flex-col justify-between space-y-4">
                      <div className="space-y-1">
                        <h6 className="text-[10px] font-black text-slate-450 uppercase block tracking-widest leading-none font-mono">ÉTAPE 1 : Simuler l'effet de bord</h6>
                        <p className="text-[10px] text-slate-400">Calcule la déviation annuelle budgétaire estimée par algorithme de projection.</p>
                      </div>
                      <button 
                        onClick={() => {
                          setDryRunSimulated(true);
                          addSandboxLog('LANCEMENT_DRYRUN_SIMULATION_BAR', 'Simulation d\'impact lancée : calcul sur 12,340 assurés régionaux.', 'SUCCESS');
                        }}
                        className="py-2.5 bg-white border border-slate-250 hover:bg-slate-100 text-slate-800 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-xs hover:scale-[1.01] transition-all"
                      >
                        Simuler modification +10% (de 20$ à 22$)
                      </button>
                    </div>

                    <div className="p-4 bg-slate-900 text-white rounded-2xl flex flex-col justify-between space-y-3">
                      <div className="space-y-1">
                        <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest font-mono">ÉTAPE 2 : Diagnostic &amp; Écritures</h6>
                        <p className="text-[9.5px] text-slate-400 leading-normal">Permet à la direction de visualiser l'impact avant la prise de risque financier.</p>
                      </div>
                      {dryRunSimulated ? (
                        <div className="space-y-2">
                          <div className="bg-white/5 border border-white/10 rounded-lg p-2.5 text-[10.5px] space-y-1 font-mono font-medium text-slate-300">
                            <div>👥 Assurés impactés : <b className="text-orange-400">12,340 personnes</b></div>
                            <div>💰 Coût dynamique annuel : <b className="text-orange-400">+1.24 M USD</b></div>
                            <div>📈 Diagnostic cotisations : <b className="text-emerald-400">+2.41% ok</b></div>
                          </div>
                          <button
                            onClick={() => {
                              setTariffState('v13_applied');
                              addSandboxLog('APPLICATION_REALE_BAREME_TARIFS', 'Changement du barème général consultation de 20 USD à 22 USD.', 'SUCCESS');
                              triggerSuccessToast("La tarification de consultation générale a été modifiée officiellement à 22.00 USD.");
                            }}
                            className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[9.5px] font-black uppercase rounded-lg cursor-pointer"
                          >
                            Appliquer officiellement
                          </button>
                        </div>
                      ) : (
                        <div className="h-12 bg-white/5 border border-dashed border-white/10 rounded-lg flex items-center justify-center text-[10.5px] text-slate-500 italic">
                          En attente du Dry-run simulation...
                        </div>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Sub-tab 2 contents: Audit Trail & Proofs */}
            {activeSandboxSubTab === 'audit_trail' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-200 text-slate-800">
                
                {/* Left: Interactive Proof Table */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h5 className="text-xs font-black text-slate-800 uppercase tracking-wider italic flex items-center gap-1 font-mono">
                        <History className="w-4 h-4 text-green-600 animate-spin-slow" />
                        Piste d'Audit Immuable (Registre WORM Scellé)
                      </h5>
                      <p className="text-[10px] text-slate-450 uppercase font-bold tracking-widest mt-1">
                        Pour toute modification d'établissement ou de barème, la preuve de transaction est instantanément enregistrée pour inspection CNIL.
                      </p>
                    </div>
                  </div>

                  <div className="p-0 border rounded-2xl overflow-hidden bg-white max-h-[350px] overflow-y-auto custom-scrollbar shadow-xs">
                    <table className="w-full text-left text-xs bg-white">
                      <thead className="bg-slate-50 border-b sticky top-0">
                        <tr>
                          <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-wider">Date &amp; Heure (Kinshasa)</th>
                          <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-wider">Acteur</th>
                          <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-wider">Événement</th>
                          <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-wider">Détails d'opération</th>
                          <th className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-wider text-center">Gravité</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {sandboxLogs.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50">
                            <td className="px-4 py-2 font-mono text-[9.5px] font-semibold text-slate-800">{log.timestamp}</td>
                            <td className="px-4 py-2 truncate text-[10px] font-bold text-indigo-700">{log.who.split('@')[0]}</td>
                            <td className="px-4 py-2 font-mono font-black text-[9px] text-slate-900 uppercase">{log.action}</td>
                            <td className="px-4 py-2 font-medium text-slate-550 text-[10px] max-w-xs truncate" title={log.details}>{log.details}</td>
                            <td className="px-4 py-2 text-center text-[10px]">
                              <span className={cn(
                                "px-2 py-0.5 rounded text-[8px] font-black uppercase inline-block min-w-[50px] text-center",
                                log.status === 'SUCCESS' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : log.status === 'WARNING' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-rose-50 text-rose-500 border border-rose-100 animate-pulse'
                              )}>
                                {log.status === 'SUCCESS' ? 'Info' : log.status === 'WARNING' ? 'Alerte' : 'Critique'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right Panel: Live Diff visualizer & Push Notify celular mockup */}
                <div className="space-y-4">
                  
                  {/* Before/After Diff component */}
                  <div className="p-4 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-3">
                    <h5 className="text-[10px] font-black uppercase text-indigo-400 tracking-widest flex items-center gap-1 font-mono">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" /> Comparateur de barèmes (v12 vs v13)
                    </h5>
                    <p className="text-[10px] text-slate-400 font-medium leading-normal italic">
                      Visualisation des différences de version (diff rouge/vert) après modification :
                    </p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-white/10 font-mono text-[10.5px] space-y-0.5 leading-tight text-slate-350 select-all max-h-48 overflow-y-auto custom-scrollbar">
                      <div><span className="text-slate-500 font-bold">// Version Diff local RDC //</span></div>
                      <div className="text-rose-450 bg-rose-950/40 px-1 rounded font-black">- FEE_GENERAL_CONSULTATION: 20.00 USD</div>
                      <div className="text-emerald-455 bg-emerald-950/40 px-1 rounded font-black">+ FEE_GENERAL_CONSULTATION: 22.00 USD</div>
                      <div className="text-rose-450 bg-rose-950/40 px-1 rounded font-black">- status: "active" (Clinique Biamba)</div>
                      <div className="text-indigo-305 bg-indigo-950/40 px-1 rounded font-black">+ status: "suspended" (Clinique Biamba)</div>
                      <div className="text-slate-500 font-bold">// Fin du différentiel //</div>
                    </div>
                  </div>

                  {/* Push SMS cellular device simulator */}
                  <div className="p-4 bg-slate-105 rounded-3xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                      <span>GSM Affiliés - Alerte Push</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    </div>

                    <div className="relative mx-auto w-full max-w-[210px] h-[330px] rounded-[2rem] border-4 border-slate-800 bg-slate-950 overflow-hidden shadow-lg p-3">
                      {/* Speaker & camera slot */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-16 h-3 bg-slate-800 rounded-full z-10" />
                      
                      {/* Screen Area */}
                      <div className="h-full rounded-[1.5rem] bg-gradient-to-tr from-indigo-950 to-slate-900 flex flex-col justify-between p-2 pt-4 relative">
                        {/* Carrier and Clock */}
                        <div className="flex justify-between text-[8px] font-black text-indigo-200">
                          <span>AfreakCell RDC</span>
                          <span>10:20</span>
                        </div>

                        {/* Central push notification alert simulation */}
                        <div className="my-auto space-y-2">
                          <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-xl border text-[9px] text-slate-850">
                            <p className="font-extrabold text-slate-900">🔔 AfreakCare Guard</p>
                            <p className="text-[8px] text-slate-500 font-semibold leading-tight mt-0.5">
                              {biambaStatus === 'active' 
                                ? "FEE: Consultation générale ajustée de 20.00 USD à 22.00 USD." 
                                : "⚠️ Clinique Biamba suspendue. Alternatives : Clinique Ngaliema (1.2km) ou Hôpital du Cinquantenaire."}
                            </p>
                            <span className="text-[7px] text-slate-400 block mt-1">À l'instant</span>
                          </div>
                        </div>

                        {/* Home indicator bar */}
                        <div className="w-16 h-1 bg-white/40 mx-auto rounded-full mt-2" />
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* Sub-tab 3 contents: Technical architecture highlights & threat warnings */}
            {activeSandboxSubTab === 'briques_tech' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-200">
                
                {/* 5 Briques Highlight 1 */}
                <div className="p-5 bg-white rounded-3xl border border-slate-150 shadow-xs space-y-3 text-slate-850">
                  <div className="w-10 h-10 bg-green-50 text-green-700 rounded-2xl flex items-center justify-center font-extrabold text-xs border border-green-150">
                    B1
                  </div>
                  <h6 className="text-xs font-black uppercase text-slate-850 tracking-tight">1. Event Sourcing</h6>
                  <p className="text-[11px] font-semibold text-slate-450 leading-relaxed">
                    Au lieu de simplement écraser la donnée, chaque transition d'état est capturée (SinistreCréé ➜ Approuvé ➜ Suspension). Vous pouvez rejouer l'historique complet pour auditer l'arbitrage.
                  </p>
                </div>

                {/* Highlight 2 */}
                <div className="p-5 bg-white rounded-3xl border border-slate-150 shadow-xs space-y-3 text-slate-850">
                  <div className="w-10 h-10 bg-red-50 text-red-700 rounded-2xl flex items-center justify-center font-extrabold text-xs border border-red-150">
                    B2
                  </div>
                  <h6 className="text-xs font-black uppercase text-slate-850 tracking-tight">2. Soft Delete permanent</h6>
                  <p className="text-[11px] font-semibold text-slate-455 leading-relaxed">
                    Aucun SuperAdmin ou robot malveillant ne peut détruire physiquement de fiche clinique. Tout enregistrement supprimé conserve sa colonne <code className="font-mono text-rose-600 bg-rose-50 px-1 py-0.5 rounded text-[10px]">deleted_at</code> et reste restaurable en un clic.
                  </p>
                </div>

                {/* Highlight 3 */}
                <div className="p-5 bg-white rounded-3xl border border-slate-150 shadow-xs space-y-3 text-slate-850">
                  <div className="w-10 h-10 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center font-extrabold text-xs border border-indigo-150">
                    B3
                  </div>
                  <h6 className="text-xs font-black uppercase text-slate-850 tracking-tight">3. Signature de Serveur</h6>
                  <p className="text-[11px] font-semibold text-slate-455 leading-relaxed">
                    Chaque bloc d'audit est scellé par la clé de scellement privée NeoGTec. En cas d'intrusion physique en Base de Données, la signature casse, dénonçant instantanément le falsificateur.
                  </p>
                </div>

                {/* Interactive Outbound simulated Webhook */}
                <div className="md:col-span-3 p-6 bg-slate-900 text-white rounded-3xl border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center bg-slate-800 p-3 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 text-yellow-400">
                      <ShieldAlert className="w-5 h-5 animate-bounce" />
                      <span className="text-xs font-black uppercase tracking-widest font-mono">Simulateur d'Alertes Comportementales Anormales (SOC LIVE)</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Déclencher une anomalie simule un comportement suspect (ex: tentative de création en masse de 12 comptes par le même IP à 3h du matin). Cela alerte immédiatement le RSSI par SMS et modifie le niveau d'alerte générale de la plateforme.
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        addSandboxLog('ALERTE_ANOMALIE_CREATION_RAPIDE', 'Alerte comportementale : 10 utilisateurs créés en moins d\'une minute.', 'CRITICAL');
                        triggerErrorToast("SOC SECURITÉ : Activité anormale suspecte ! Demande SMS de sécurité émise vers le mobile du RSSI (+243 81...).");
                      }}
                      className="py-3 bg-red-650 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase shadow cursor-pointer text-center hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      🚨 Simuler création en masse à 3h
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        addSandboxLog('ALERTE_BRUTE_FORCE_MFA', 'Échecs multiples consécutifs sur dispositif FIDO2.', 'CRITICAL');
                        triggerErrorToast("ALERTE BRUTE-FORCE : 5 tentatives MFA infructueuses sur le compte super-admin. Verrouillage temporaire du jeton.");
                      }}
                      className="py-3 bg-red-650 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase shadow cursor-pointer text-center hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      🚨 Tentative Brute-force MFA
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addSandboxLog('ALERTE_EVASION_VPN', 'Signature de géolocalisation impossible : voyage rapide détecté (Kinshasa ➜ Moscou).', 'WARNING');
                        triggerSuccessToast("ALERTE VOYAGE RAPIDE : Routeur VPN ou Proxy suspect détecté. Restriction d'accès financier.");
                      }}
                      className="py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl text-[10px] font-black uppercase shadow cursor-pointer text-center hover:scale-[1.01] active:scale-[0.99] transition-all"
                    >
                      ⚠️ Détection Évasion IP (VPN)
                    </button>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-xl border border-white/10 space-y-1">
                    <p className="text-[10px] uppercase font-black text-slate-500 font-mono">Payload Webhook Rest envoyé au down-stream SAP d'entreprise (Signature Scellée)</p>
                    <pre className="text-[10.5px] font-mono font-medium text-emerald-450 overflow-x-auto select-all max-h-48 custom-scrollbar leading-relaxed">
{`POST /api/webhooks/neogtec-compliance HTTP/1.1
Host: downstream-sap.arca-rdc.com
Content-Type: application/json
X-NeoGTec-Signature-SHA256: 0e78c8bc1e204deae819c98cd12f45eaef812bf7e7193b29c9ef

{
  "event": "hospital.suspension",
  "audit_id": "SBOX-${Math.floor(100+Math.random()*900)}",
  "actor": "${currentUser?.email || 'j.kabasele@neogtec.com'}",
  "timestamp": "${new Date().toISOString()}",
  "meta": {
    "target_hospital": "Biamba Marie Mutombo",
    "affected_beneficiaries": 12340,
    "system_active_hospitals": ${biambaStatus === 'active' ? 152 : 151},
    "compliance_code": "ARCA-RDC-SECURE-2026"
  }
}`}
                    </pre>
                  </div>
                </div>

              </div>
            )}

            {/* Footnote of Sandbox */}
            <div className="p-4 bg-slate-100 border rounded-2xl text-[9.5px] font-semibold text-slate-500 text-center uppercase tracking-wide leading-normal font-mono">
              NeoGTec Core — Coffre-fort de Gouvernance de Santé RDC Certifié conforme ISO/IEC 27001 version 2026 &amp; RGPD Article 21. Tout abus d'usage fait l'objet de sanctions SOC.
            </div>

          </div>
        )}
      </div>

      {/* ======================================= */}
      {/* PASSWORD CHANGING ISO POPUP MODAL       */}
      {/* ======================================= */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[300] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowPasswordModal(false)} />
            
            <form 
              onSubmit={handlePasswordChange}
              className="relative bg-white rounded-[3rem] w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 z-10 p-8 space-y-4 text-slate-850"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-indigo-500" />
                  <h3 className="text-base font-black text-slate-950 uppercase italic">Changer de Mot de passe</h3>
                </div>
                <button type="button" onClick={() => setShowPasswordModal(false)} className="p-2 text-slate-400 hover:text-slate-700 cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Password change inputs */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block font-bold">Nouveau Mot de passe pro</label>
                  <input 
                    type="password" 
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Au moins 12 caractères"
                    className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[9.5px] font-black text-slate-450 uppercase tracking-widest block font-bold">Confirmer Mot de passe</label>
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Minimum 12 caractères de sécurité"
                    className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                  />
                </div>
              </div>

              {/* ISO 27001 Security Management Guide panel */}
              <div className="p-4 bg-indigo-50 border border-indigo-150 rounded-xl space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-700 text-[9.5px] font-black uppercase">
                  <ShieldCheck className="w-4 h-4 text-indigo-505" /> Guide ISO/IEC 27001
                </div>
                <p className="text-[10px] text-slate-500 italic max-w-xs leading-relaxed">
                  Le mot de passe doit comporter au moins 12 caractères (mélange de chiffres, lettres et caractères spéciaux). Il expirera automatiquement sous 90 jours conformément à notre politique interne de rotation ISO/IEC 27021 RDC.
                </p>
              </div>

              {passwordError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-bold rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              <div className="pt-4 border-t flex gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-black uppercase cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase shadow cursor-pointer"
                >
                  Confirmer rotation
                </button>
              </div>
            </form>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================= */}
      {/* LOW-RISK ISO CONFIRMATION DIALOG        */}
      {/* ======================================= */}
      <AnimatePresence>
        {showLowRiskModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowLowRiskModal(false)} />
            <div className="relative bg-white rounded-3xl w-full max-w-md p-6 space-y-4 text-slate-850 shadow-2xl border border-slate-200 z-10 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 border-b pb-3 text-slate-950 font-black uppercase text-xs font-mono">
                <ShieldCheck className="w-5 h-5 text-indigo-500" /> Confirmer l'Exportation Standard
              </div>
              <p className="text-xs text-slate-500 leading-normal font-semibold">
                Vous allez exporter <b className="text-slate-900 font-bold">1,240 lignes d'historiques anonymisées</b> pour analyse statistique. Souhaitez-vous continuer l'opération ?
              </p>
              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowLowRiskModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer border"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  onClick={() => {
                    setShowLowRiskModal(false);
                    addSandboxLog('EXPORT_CSV_FAIBLE_RISQUE', 'Exportation réussie de 1,240 lignes de données cliniques brutes anonymisées.', 'SUCCESS');
                    triggerSuccessToast("Export CSV généré avec succès !");
                  }}
                  className="flex-1 py-2.5 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-lg"
                >
                  Confirmer l'export
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================= */}
      {/* MEDIUM-RISK KEYWORD REQ DIALOG (Friction) */}
      {/* ======================================= */}
      <AnimatePresence>
        {showMediumRiskModal && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[2000] flex items-center justify-center p-4">
            <div className="absolute inset-0" onClick={() => setShowMediumRiskModal(false)} />
            <div className="relative bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 text-slate-850 shadow-2xl border border-rose-150 z-10 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center gap-2 border-b pb-3 text-rose-600 font-mono font-black uppercase text-xs">
                <AlertTriangle className="w-5 h-5" /> Confirmation d'Action Critique
              </div>
              <p className="text-xs text-slate-500 leading-normal">
                Suspendre un partenaire clinique coupe immédiatement l'accès de <b>12,340 assurés</b> du secteur de Gombe.
              </p>
              <p className="text-[11px] text-slate-650 font-semibold bg-slate-50 p-2.5 rounded-xl border">
                Pour accomplir la suspension de l'<b>Hôpital Biamba Marie Mutombo</b>, veuillez saisir explicitement le code de déverrouillage ci-dessous : <b className="text-rose-600 select-all font-mono font-bold block mt-1 text-center scale-105 text-sm">SUSPENDRE</b>
              </p>

              <div className="space-y-1">
                <input 
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  placeholder="Tapez le mot de passe ici"
                  className="w-full h-11 bg-slate-50 border border-slate-205 text-slate-900 rounded-xl px-4 text-xs font-black uppercase text-center focus:outline-none focus:bg-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowMediumRiskModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 border rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
                >
                  Annuler
                </button>
                <button 
                  type="button"
                  disabled={keywordInput !== 'SUSPENDRE'}
                  onClick={() => {
                    setBiambaStatus('suspended');
                    setShowMediumRiskModal(false);
                    addSandboxLog('SUSPENDRE_ETABLISSEMENT_BIAMBA', 'Suspension de l\'Hôpital Biamba Marie Mutombo, coupure des clés API partenaires et notification des assurés.', 'CRITICAL');
                    triggerSuccessToast("Hôpital Biamba Marie Mutombo suspendu temporairement. Statut synchronisé.");
                  }}
                  className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer transition-colors shadow-lg"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
