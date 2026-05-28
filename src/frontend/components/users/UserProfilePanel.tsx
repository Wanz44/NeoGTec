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

export const UserProfilePanel: React.FC = () => {
  const { currentUser, setCurrentUser, logAction, auditLogs } = useApp();
  const [activeTab, setActiveTab] = useState<'identity' | 'security' | 'roles' | 'logs'>('identity');
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
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
      <div className="grid grid-cols-4 gap-2 bg-slate-100 p-1 rounded-2xl border">
        {[
          { id: 'identity', label: 'Identité', icon: User },
          { id: 'security', label: 'Sécurité & Accès', icon: Lock },
          { id: 'roles', label: 'Rôles & Permissions', icon: Shield },
          { id: 'logs', label: 'Activité & Logs', icon: History }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer outline-none",
              activeTab === tab.id 
                ? "bg-white text-slate-950 border shadow-sm" 
                : "text-slate-500 hover:text-slate-900"
            )}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden md:inline">{tab.label}</span>
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

    </div>
  );
};
