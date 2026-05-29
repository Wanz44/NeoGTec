/**
 * 🔐 Fichier : /src/frontend/components/Login.tsx
 * 🎯 Objectif : Espace Administration NeoGTec — Portail d'Authentification Centralisé 
 * 🛡️ Conformité : ISO 27001, OWASP Top 10, redirection intelligente du tenant.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Lock, Mail, Eye, EyeOff, ShieldAlert, CheckCircle2, 
  Smartphone, KeyRound, AlertTriangle, Fingerprint, RefreshCw, 
  HelpCircle, Laptop, ShieldCheck, Check, ArrowRight, QrCode, FileText
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: { 
    email: string; 
    name: string; 
    role: string; 
    tenantId: string | null; 
    status: string; 
    mfaEnabled: boolean;
    impersonatedBy?: string;
  }) => void;
}

// Preset simulator users for dynamic routing tests (Step 2 checks)
const SIMULATOR_USERS = [
  { 
    email: 'paul@neogtec.com', 
    password: 'Paul_#20269988@', 
    name: 'Paul NEOGTEC', 
    role: 'SUPER_ADMIN', 
    tenantId: null, 
    status: 'Actif',
    mustChangePassword: false,
    lastLogin: '2026-05-28'
  },
  { 
    email: 'm.kapend@acme.cd', 
    password: 'Marie_#20261111@', 
    name: 'Marie KAPEND', 
    role: 'RH_ENTREPRISE', 
    tenantId: 'acme', 
    status: 'Actif',
    mustChangePassword: false,
    lastLogin: '2026-05-28'
  },
  { 
    email: 'jean.m@acme.cd', 
    password: 'Jean_#20262222@', 
    name: 'Jean MUKENDI', 
    role: 'SUPPORT_CLIENT', 
    tenantId: 'acme', 
    status: 'Actif',
    mustChangePassword: false,
    lastLogin: '2026-05-28'
  },
  { 
    email: 'nouveau@acme.cd', 
    password: 'MarieKa!1234', // default password
    name: 'Nouveau Collaborateur', 
    role: 'SUPPORT_CLIENT', 
    tenantId: 'acme', 
    status: 'En attente',
    mustChangePassword: true,
    lastLogin: null
  },
  { 
    email: 'suspendu@acme.cd', 
    password: 'Suspendu_#20260000@', 
    name: 'Collaborateur Bloqué', 
    role: 'SUPPORT_CLIENT', 
    tenantId: 'acme', 
    status: 'Suspendu',
    mustChangePassword: false,
    lastLogin: '2026-05-28'
  }
];

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  
  // Credentials Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  
  // Security checks & flows states
  const [step, setStep] = useState<'credentials' | 'verifying' | 'mfa' | 'onboarding_welcome' | 'onboarding_mfa' | 'suspended_message'>('credentials');
  const [activeMfaUser, setActiveMfaUser] = useState<typeof SIMULATOR_USERS[0] | null>(null);
  
  const [mfaCode, setMfaCode] = useState('');
  const [mfaTimer, setMfaTimer] = useState(60);
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Backends verification phases logs
  const [verificationLogs, setVerificationLogs] = useState<string[]>([]);

  // Forgot password mockup
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // --- Onboarding Flow Variables ---
  const [onboardDefaultPwd, setOnboardDefaultPwd] = useState('');
  const [onboardNewPwd, setOnboardNewPwd] = useState('');
  const [onboardConfirmPwd, setOnboardConfirmPwd] = useState('');
  const [onboardPwdAttempts, setOnboardPwdAttempts] = useState(0);
  const [onboardLocked, setOnboardLocked] = useState(false);
  const [onboardLockTimer, setOnboardLockTimer] = useState(0);
  const [showOnboardNewPwd, setShowOnboardNewPwd] = useState(false);
  const [showOnboardConfirmPwd, setShowOnboardConfirmPwd] = useState(false);

  // Ticket Modal inside first connection onboarding
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketMsg, setTicketMsg] = useState("");

  // Onboarding MFA Choice
  const [onboardMfaMethod, setOnboardMfaMethod] = useState<'APP' | 'SMS'>('APP');
  const [onboardMfaCode, setOnboardMfaCode] = useState('');
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [hasCopiedFiles, setHasCopiedFiles] = useState(false);

  // Mock backup codes array
  const mockBackupCodes = [
    'AE-3891-2309', 'LK-2901-1189', 'XW-2091-8891', 'PP-0092-2291', 'PO-9912-3490',
    'YY-8812-7492', 'RE-7712-4412', 'QW-2210-9081', 'CV-1123-6623', 'NM-7781-2294'
  ];

  // Lock timers countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLocked && lockTimer > 0) {
      interval = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isLocked, lockTimer]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (onboardLocked && onboardLockTimer > 0) {
      interval = setInterval(() => {
        setOnboardLockTimer(prev => {
          if (prev <= 1) {
            setOnboardLocked(false);
            setOnboardPwdAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [onboardLocked, onboardLockTimer]);

  // ISO robust parameters checks
  const satisfiesLength = password.length >= 12;
  const satisfiesUpper = /[A-Z]/.test(password);
  const satisfiesDigit = /[0-9]/.test(password);
  const satisfiesSpecial = /[^A-Za-z0-9]/.test(password);
  const satisfiesAll = satisfiesLength && satisfiesUpper && satisfiesDigit && satisfiesSpecial;

  // Onboard Password ISO rules
  const oLengthValid = onboardNewPwd.length >= 12;
  const oUpperValid = /[A-Z]/.test(onboardNewPwd);
  const oDigitValid = /[0-9]/.test(onboardNewPwd);
  const oSpecialValid = /[^A-Za-z0-9]/.test(onboardNewPwd);
  const oAllValid = oLengthValid && oUpperValid && oDigitValid && oSpecialValid;
  const oMatchValid = onboardConfirmPwd !== '' && onboardConfirmPwd === onboardNewPwd;

  // 300ms intelligent redirection simulation triggers
  const executeStep2Checks = (matchedUser: typeof SIMULATOR_USERS[0]) => {
    setStep('verifying');
    setVerificationLogs([]);

    const addLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setVerificationLogs(prev => [...prev, msg]);
      }, delay);
    };

    // 1. Identity verif check
    addLog("✓ [1/5] Identifiants d'accès certifiés (Cryptographie BCrypt hashs match)", 50);
    
    // 2. MFA status check
    addLog(
      rememberDevice 
        ? "✓ [2/5] Jeton MFA ignoré : Appareil de confiance enregistré 30 jours." 
        : "✓ [2/5] Vérification MFA requise pour cette adresse administrative.",
      120
    );

    // 3. User & Tenant status check
    addLog(`✓ [3/5] État du compte : ${matchedUser.status} de l'Établissement.`, 180);

    // 4. SQL Context retrieval
    addLog("✓ [4/5] SQL: SELECT tenant_id, role, permissions, is_new_user FROM users WHERE email = ?", 240);

    // 5. Final routing decision
    addLog("✓ [5/5] Redirection vers le tableau de correspondances applicatif...", 299);

    setTimeout(() => {
      if (matchedUser.status === 'Suspendu') {
        setStep('suspended_message');
      } else if (matchedUser.mustChangePassword) {
        setStep('onboarding_welcome');
      } else if (!rememberDevice) {
        setActiveMfaUser(matchedUser);
        setStep('mfa');
      } else {
        // Direct redirection with session
        onLoginSuccess({
          email: matchedUser.email,
          name: matchedUser.name,
          role: matchedUser.role,
          tenantId: matchedUser.tenantId,
          status: matchedUser.status,
          mfaEnabled: true
        });
      }
    }, 1800); // Allow visual render of backend simulation checks
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isLocked) {
      setErrorMsg("Mot de passe échoué. Le port de session est verrouillé pour 15 min.");
      return;
    }

    const matchedUser = SIMULATOR_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      const nextAtt = attempts + 1;
      setAttempts(nextAtt);
      if (nextAtt >= 5) {
        setIsLocked(true);
        setLockTimer(15); // visual 15 sec lock to stay responsive for demo
        setErrorMsg("Compte bloqué temporairement suite à 5 échecs consécutifs. Rapport envoyé aux cellules de sécurité.");
      } else {
        setErrorMsg("Identifiants de sécurité invalides. Bomeki ya d'accès interdits.");
      }
      return;
    }

    executeStep2Checks(matchedUser);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mfaCode.length < 4) {
      setErrorMsg("Format de code MFA incomplet.");
      return;
    }

    if (activeMfaUser) {
      onLoginSuccess({
        email: activeMfaUser.email,
        name: activeMfaUser.name,
        role: activeMfaUser.role,
        tenantId: activeMfaUser.tenantId,
        status: activeMfaUser.status,
        mfaEnabled: true
      });
    }
  };

  // Onboarding Action : Signaler une erreur (Created ticket to Marie)
  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Ticket d'erreur de saisie expédié à Marie KAPEND (Cellule RH) :\n"${ticketMsg}"`);
    setIsTicketOpen(false);
    setTicketMsg("");
  };

  // Finish Onboarding
  const handleFinishOnboarding = () => {
    onLoginSuccess({
      email: 'nouveau@acme.cd',
      name: 'Nouveau Collaborateur',
      role: 'SUPPORT_CLIENT',
      tenantId: 'acme',
      status: 'Actif',
      mfaEnabled: true
    });
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col justify-between p-0 m-0 text-slate-800 relative select-none">
      
      {/* Dynamic Background */}
      <div className="absolute inset-x-0 top-0 h-1 bg-green-500" />
      
      {/* Top micro bar like style of Google screen */}
      <div className="w-full bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-green-600/10 border border-green-500/20 flex items-center justify-center text-green-650 font-extrabold shadow-3xs text-sm">
            ▲
          </div>
          <div>
            <span className="font-bold tracking-tight text-slate-900 text-xs block uppercase">NEOGTEC</span>
            <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Portail de Redirection Intelligent</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-md border border-slate-200">
            {(['FR', 'EN'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 text-[9px] font-black uppercase rounded transition-all cursor-pointer ${lang === l ? 'bg-white text-green-650 shadow-sm' : 'text-slate-500'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form content widget */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-[460px] bg-white border border-slate-200 rounded-[1.5rem] p-6 sm:p-10 shadow-lg relative overflow-hidden">
          
          <AnimatePresence mode="wait">
            
            {/* STAGE : CREDENTIALS INPUTS Form */}
            {step === 'credentials' && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-green-50 border border-green-250 text-green-600 flex items-center justify-center mx-auto shadow-inner">
                    <KeyRound className="w-6 h-6 animate-pulse" />
                  </div>
                  <h2 className="text-lg font-black font-sans text-slate-900 uppercase">Espace Administration</h2>
                  <p className="text-xs text-slate-450 font-semibold max-w-sm mx-auto leading-normal">
                    Se connecter à l'infrastructure NeoGTec. Accès cloisonné aux tables clientèles autorisées.
                  </p>
                </div>

                {/* Simulation info notice */}
                <div className="p-3 bg-blue-50/50 border border-blue-200 text-blue-800 text-[10.5px] rounded-xl space-y-1">
                  <p className="font-extrabold uppercase">📊 Comptes de simulation (Test de Redirections) :</p>
                  <ul className="list-disc pl-4 space-y-1 text-[9.5px] text-blue-700 font-semibold">
                    <li><strong>paul@neogtec.com</strong> (Paul, pass: <code>Paul_#20269988@</code>) → Super Admin</li>
                    <li><strong>m.kapend@acme.cd</strong> (Marie, pass: <code>Marie_#20261111@</code>) → Admin ACME</li>
                    <li><strong>jean.m@acme.cd</strong> (Jean, pass: <code>Jean_#20262222@</code>) → Employé ACME</li>
                    <li><strong>nouveau@acme.cd</strong> (Nouveau, pass: <code>MarieKa!1234</code>) → 1ère Connexion Onboarding</li>
                    <li><strong>suspendu@acme.cd</strong> (Suspendu, pass: <code>Suspendu_#20260000@</code>) → Tenant Bloqué</li>
                  </ul>
                </div>

                {errorMsg && (
                  <div className="bg-rose-50 border border-rose-150 rounded-xl p-3 flex gap-2.5 items-start text-xs text-rose-800 font-semibold">
                    <ShieldAlert className="w-4.5 h-4.5 text-rose-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9.5px] font-black uppercase text-slate-400 font-mono">Adresse Email Professionnelle</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        placeholder="jean.m@acme.cd"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-green-500/10 font-medium"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-[9.5px] font-black uppercase text-slate-400 font-mono">Mot de passe secret</label>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-[9.5px] font-bold text-slate-450 hover:text-slate-800 outline-none"
                      >
                        {showPassword ? "Masquer" : "Afficher"}
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Saisir votre mot de passe d'accès"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-4 focus:ring-green-500/10 font-mono"
                      />
                    </div>
                  </div>

                  {/* Device 30 days trust selector */}
                  <div className="flex items-center justify-between py-1 select-none">
                    <label className="flex items-start gap-2 text-xs text-slate-500 leading-normal cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberDevice}
                        onChange={(e) => setRememberDevice(e.target.checked)}
                        className="rounded border-slate-300 text-green-650 focus:ring-0 cursor-pointer w-4 h-4"
                      />
                      <span className="font-semibold text-[10.5px]">Se souvenir de cet appareil pendant 30 jours (MFA off)</span>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-xs font-black text-green-600 hover:underline outline-none"
                    >
                      Mot de passe oublié ?
                    </button>
                    <button
                      type="submit"
                      disabled={isLocked || !email || !password}
                      className={cn(
                        "w-full sm:w-auto h-11 px-6 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md",
                        (email && password && !isLocked)
                          ? "bg-green-600 hover:bg-green-700 shadow-green-600/10 active:scale-[0.98] cursor-pointer"
                          : "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none"
                      )}
                    >
                      Se connecter <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STAGE : 300ms inteligente backend verif loader */}
            {step === 'verifying' && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 py-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-green-500 animate-spin flex items-center justify-center mx-auto" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#059669]">Identification en cours</h3>
                    <p className="text-[10.5px] text-slate-400 font-bold mt-1 uppercase tracking-wide">Analyse des credentials &amp; droits de locataire...</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-2xl font-mono text-[9px] text-[#00ff66] space-y-1.5 h-32 overflow-y-auto no-scrollbar shadow-inner border border-slate-950">
                  {verificationLogs.map((log, index) => (
                    <div key={index} className="flex gap-1.5">
                      <span className="text-[#059669]">neogtec_db#</span>
                      <span>{log}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* STAGE : MFA COMPLIANCE */}
            {step === 'mfa' && (
              <motion.div
                key="mfa"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Fingerprint className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-sm font-black text-slate-900 uppercase">Double Facteur requis</h3>
                  <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                    Saisissez le code d'authentification expédié sur votre terminal mobile appairé pour valider l'entrée.
                  </p>
                </div>

                <form onSubmit={handleMfaSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase text-slate-400 font-mono tracking-widest block text-center">Insérer le code 6 chiffres</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Simulation : n'importe quel code"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full h-12 border border-slate-300 rounded-xl text-center text-lg font-bold font-mono tracking-[0.4em] focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 placeholder:text-xs placeholder:tracking-normal"
                    />
                  </div>

                  <div className="flex gap-2 justify-between border-t pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-750 font-bold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      Confirmer l'accès
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* STAGE : SUSPENDED MESSAGE */}
            {step === 'suspended_message' && (
              <motion.div
                key="suspended"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6 text-center py-6"
              >
                <div className="w-14 h-14 bg-rose-50 border border-rose-200 text-rose-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-sm font-extrabold uppercase text-rose-700 tracking-wide">Compte d'accès clôturé ou Suspendu</h3>
                  <p className="text-xs text-rose-950 bg-rose-50 p-4 border border-rose-100 rounded-2xl leading-relaxed font-semibold">
                    Votre accès de sécurité client pour cet établissement locataire a été suspendu par l'administration globale. 
                    <br /><strong className="text-rose-900 block mt-2">Motif d'action : Facture SaaS J+15 Impayée.</strong>
                  </p>
                  <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">
                    Veuillez contacter Marie KAPEND (Agent RH ACME) pour tout recouvrement d'identité.
                  </p>
                </div>
                <button
                  onClick={() => setStep('credentials')}
                  className="w-full py-3 border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer"
                >
                  Retourner au login
                </button>
              </motion.div>
            )}

            {/* STAGE : ONBOARDING SCREEN 1 (Welcome & Password) */}
            {step === 'onboarding_welcome' && (
              <motion.div
                key="onboard_welcome"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 pb-2 border-b">
                  <span className="text-[9.5px] font-black text-rose-600 uppercase tracking-widest font-mono">Parcours 1ère Connexion Obligatoire</span>
                  <h3 className="text-base font-black uppercase text-slate-900">Bienvenue , Nouveau Collaborateur</h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                    Votre compte de gestionnaire a été configuré par l'Administrateur d'Établissement. Suivez ces 2 étapes de sécurité obligatoires.
                  </p>
                </div>

                {/* Section 1 : Vos Coordonnées */}
                <div className="p-4 bg-slate-50 border rounded-2xl space-y-2.5">
                  <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Section 1 : Vos Informations Professionnelles</p>
                  <div className="grid grid-cols-2 gap-3 text-[11px] font-bold text-slate-600">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400">Nom complet</p>
                      <p className="text-slate-900 uppercase">Nouveau Collaborateur</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400">E-mail rattaché</p>
                      <p className="text-slate-700 font-mono">nouveau@acme.cd</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400">Entreprise / Tenant</p>
                      <p className="text-slate-900">ACME SARL (Grise &amp; Bloisonné)</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400">Créateur de l'invitation</p>
                      <p className="text-slate-800 font-sans leading-tight">Marie KAPEND (Agent RH ACME)</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketMsg("Erreur dans les informations d'onboarding. Mon e-mail ou patronyme comporte un problème.");
                      setIsTicketOpen(true);
                    }}
                    className="mt-2 py-1 px-3 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Signaler une erreur
                  </button>
                </div>

                {/* Section 2 : Secure Account */}
                <div className="space-y-4 pt-1">
                  <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Section 2 : Sécurisation de l'Accès (ISO 27001)</p>
                  
                  {/* Password Communicated */}
                  <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-250 rounded-xl flex items-center justify-between text-[10.5px] font-semibold">
                    <span>Mot de passe d'activation reçu :</span>
                    <span className="font-mono bg-white border px-2 py-0.5 rounded font-black text-emerald-700">MarieKa!1234</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase font-black text-slate-400">
                      <span>Saisir le mot de passe reçu</span>
                      <span className="text-rose-600">Essais : {onboardPwdAttempts}/3</span>
                    </div>
                    {onboardLocked ? (
                      <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold font-mono">
                        Sécurité ISO : Compte bloqué temporairement... {onboardLockTimer}s
                      </div>
                    ) : (
                      <input
                        type="password"
                        placeholder="Tapez MarieKa!1234"
                        value={onboardDefaultPwd}
                        onChange={(e) => setOnboardDefaultPwd(e.target.value)}
                        className="w-full h-10 border border-slate-300 rounded-xl px-4 text-xs font-mono font-bold focus:outline-none"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-black text-slate-400">Nouveau mot de passe de production</label>
                    <div className="relative">
                      <input
                        type={showOnboardNewPwd ? "text" : "password"}
                        placeholder="Créer votre nouveau mot de passe fort"
                        value={onboardNewPwd}
                        onChange={(e) => setOnboardNewPwd(e.target.value)}
                        className="w-full h-10 border border-slate-300 rounded-xl px-4 pr-10 text-xs font-mono font-bold focus:outline-none text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOnboardNewPwd(!showOnboardNewPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showOnboardNewPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-black text-slate-400">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                      <input
                        type={showOnboardConfirmPwd ? "text" : "password"}
                        placeholder="Confirmer votre mot de passe"
                        value={onboardConfirmPwd}
                        onChange={(e) => setOnboardConfirmPwd(e.target.value)}
                        className="w-full h-10 border border-slate-300 rounded-xl px-4 pr-10 text-xs font-mono font-bold focus:outline-none text-slate-900"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOnboardConfirmPwd(!showOnboardConfirmPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showOnboardConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {onboardConfirmPwd && !oMatchValid && <span className="text-[10px] text-rose-500 font-bold">Les mots de passe ne correspondent pas.</span>}
                  </div>

                  {/* ISO 27001 Live indicator panel */}
                  <div className="p-4 bg-slate-50 border rounded-2xl space-y-1.5 select-none">
                    <p className="text-[8.5px] font-black uppercase text-slate-400 tracking-widest font-mono">Critères de Robustesse ISO 27001 (4/4 attendus) :</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[9.5px]">
                      <span className={`flex items-center gap-1.5 ${oLengthValid ? "text-emerald-650 font-black" : "text-slate-400"}`}>
                        <span className={`w-1 h-1 rounded ${oLengthValid ? "bg-emerald-500" : "bg-slate-300"}`} /> 12+ Caractères
                      </span>
                      <span className={`flex items-center gap-1.5 ${oUpperValid ? "text-emerald-650 font-black" : "text-slate-400"}`}>
                        <span className={`w-1 h-1 rounded ${oUpperValid ? "bg-emerald-500" : "bg-slate-300"}`} /> 1 Majuscule
                      </span>
                      <span className={`flex items-center gap-1.5 ${oDigitValid ? "text-emerald-650 font-black" : "text-slate-400"}`}>
                        <span className={`w-1 h-1 rounded ${oDigitValid ? "bg-emerald-500" : "bg-slate-300"}`} /> 1 Chiffre
                      </span>
                      <span className={`flex items-center gap-1.5 ${oSpecialValid ? "text-emerald-650 font-black" : "text-slate-400"}`}>
                        <span className={`w-1 h-1 rounded ${oSpecialValid ? "bg-emerald-500" : "bg-slate-300"}`} /> 1 Car. Spécial
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 3 : Buttons */}
                <div className="flex gap-2 border-t pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setOnboardDefaultPwd('');
                      setOnboardNewPwd('');
                      setOnboardConfirmPwd('');
                    }}
                    className="flex-1 py-3 text-slate-500 hover:bg-slate-50 border rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer"
                  >
                    Effacer
                  </button>
                  <button
                    type="button"
                    disabled={onboardLocked || !oAllValid || !oMatchValid || !onboardDefaultPwd}
                    onClick={() => {
                      if (onboardDefaultPwd !== 'MarieKa!1234') {
                        const nextAttempts = onboardPwdAttempts + 1;
                        setOnboardPwdAttempts(nextAttempts);
                        if (nextAttempts >= 3) {
                          setOnboardLocked(true);
                          setOnboardLockTimer(15); // demo lock
                          alert("Alerte de sécurité : Compte temporairement verrouillé pour 15s. Notification transmise à la cellule d'assistance RH d'ACME.");
                        } else {
                          alert("Mot de passe par défaut erroné. Veuillez corriger pour simuler.");
                        }
                        return;
                      }
                      setStep('onboarding_mfa');
                    }}
                    className={cn(
                      "flex-1 py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1 shadow-md",
                      (oAllValid && oMatchValid && onboardDefaultPwd && !onboardLocked) 
                        ? "bg-green-650 hover:bg-green-700 shadow-green-600/10" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    Confirmer &amp; Étape suivante <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STAGE : ONBOARDING SCREEN 2 (MFA SETUP AND BACKUP CODES) */}
            {step === 'onboarding_mfa' && (
              <motion.div
                key="onboard_mfa"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="text-center space-y-2 pb-2 border-b">
                  <span className="text-[9.5px] font-black text-rose-600 uppercase tracking-widest font-mono">Dernière étape Onboarding</span>
                  <h3 className="text-base font-black uppercase text-slate-900">Enrôler le Double Facteur (MFA)</h3>
                  <p className="text-xs text-slate-450 leading-relaxed font-semibold">
                    Compte tenu des exigences de conformité réglementaire, l'enrôlement du double facteur est obligatoire pour activer votre compte.
                  </p>
                </div>

                {!showBackupCodes ? (
                  <div className="space-y-6">
                    <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 select-none">
                      <button
                        type="button"
                        onClick={() => setOnboardMfaMethod('APP')}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-[10.5px] font-bold uppercase transition focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer",
                          onboardMfaMethod === 'APP' ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                        )}
                      >
                        <QrCode className="w-4 h-4" /> Authenticator App
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnboardMfaMethod('SMS')}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-[10.5px] font-bold uppercase transition focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer",
                          onboardMfaMethod === 'SMS' ? "bg-white text-indigo-600 shadow" : "text-slate-500"
                        )}
                      >
                        <Smartphone className="w-4 h-4" /> SMS (+243 81...)
                      </button>
                    </div>

                    {onboardMfaMethod === 'APP' ? (
                      <div className="space-y-4 flex flex-col items-center">
                        <div className="p-4 bg-slate-50 border-2 border-dashed border-indigo-200 rounded-3xl w-40 h-40 flex items-center justify-center relative shadow-inner">
                          <QrCode className="w-32 h-32 text-indigo-900" />
                        </div>
                        <p className="text-[10px] text-slate-450 font-bold text-center leading-normal">
                          Scannez ce QR Code avec votre application de sécurité (Google Authenticator, Microsoft Auth) puis tapez le jeton généré.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-2xl space-y-1 text-center font-semibold text-xs">
                        <p className="font-extrabold uppercase">📟 Code SMS expédié au :</p>
                        <p className="text-slate-700 block font-mono text-xs">+243 812 345 678</p>
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-slate-450 uppercase font-black text-center block">Saisir le code jeton de vérification</label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Simulation : Tapez 123456"
                        value={onboardMfaCode}
                        onChange={(e) => setOnboardMfaCode(e.target.value)}
                        className="w-full h-11 border border-slate-300 rounded-xl text-center text-lg font-bold font-mono tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 placeholder:text-xs placeholder:tracking-normal"
                      />
                    </div>

                    <button
                      type="button"
                      disabled={onboardMfaCode.length < 6}
                      onClick={() => setShowBackupCodes(true)}
                      className={cn(
                        "w-full py-3.5 text-white rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow shadow-md cursor-pointer",
                        onboardMfaCode.length >= 6 
                          ? "bg-indigo-650 hover:bg-indigo-700 shadow-indigo-600/10" 
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                      )}
                    >
                      Vérifier &amp; Continuer <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="space-y-5">
                    <div className="p-4 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded-2xl flex gap-3 text-[11px] leading-relaxed font-semibold items-start shadow-inner">
                      <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5 animate-pulse" />
                      <div className="space-y-1">
                        <p className="font-extrabold uppercase">Double Facteur Appairé avec succès !</p>
                        <p>Vos accès de production sont maintenant authentifiés à 100%.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 uppercase font-black">
                        <span>Sauvegarder ces 10 codes de secours</span>
                        <span className="text-rose-500">Privé / Unique</span>
                      </div>
                      <div className="bg-slate-900 border p-4 rounded-2xl grid grid-cols-2 gap-2 text-xs font-mono font-bold text-[#33ff33] text-center select-all h-36 overflow-y-auto no-scrollbar shadow-inner">
                        {mockBackupCodes.map((code, index) => (
                          <div key={index} className="bg-slate-950 p-1 rounded border border-slate-800">
                            {code}
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setHasCopiedFiles(true);
                        alert("Codes de secours copiés dans le presse-papier.");
                      }}
                      className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border text-slate-700 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-600" /> Copier / Imprimer les codes de secours
                    </button>

                    <div className="flex gap-2 items-center justify-between border-t pt-4">
                      <span className="text-[10px] text-slate-450 font-extrabold leading-none">Vérifié ISO/IEC 27001 Sec</span>
                      <button
                        type="button"
                        disabled={!hasCopiedFiles}
                        onClick={handleFinishOnboarding}
                        className={cn(
                          "py-3 px-6 text-white rounded-xl text-xs font-black uppercase tracking-wider cursor-pointer shadow-md transition-all",
                          hasCopiedFiles 
                            ? "bg-[#059669] hover:bg-[#047857] shadow-emerald-600/10" 
                            : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                        )}
                      >
                        Sauvegardé • Finaliser d'accès
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Footer copyright */}
      <div className="w-full text-center py-6 border-t bg-white text-[10.5px] text-slate-400 font-bold select-none uppercase tracking-wide">
        Copyright © 1999 - 2026 NeoGTec S.A. Tous droits de gouvernance d'accès réservés.
      </div>

      {/* Recoveries Password Simulated Modal dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-3xl w-full max-w-md border overflow-hidden shadow-2xl p-6 space-y-4 text-slate-800">
            <div className="border-b pb-3 text-sm font-black uppercase tracking-wider text-green-600 flex items-center gap-1">
              Récupérer mot de passe
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Insérer votre e-mail d'affectation pour recevoir le jeton d'accès temporaire d'urgence valable 15 minutes.
              </p>
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 font-mono tracking-widest uppercase">E-mail rattaché</label>
                <input
                  type="email"
                  placeholder="jean.m@acme.cd"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-mono font-bold"
                />
              </div>
              {forgotSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-xl flex gap-1 items-center">
                  <Check className="w-4 h-4" /> Token expédié. Vérifiez votre boîte mail administrative.
                </div>
              )}
            </div>
            <div className="flex gap-2 border-t pt-3 justify-end font-bold">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotSuccess(false);
                }}
                className="py-2.5 px-5 bg-slate-100 hover:bg-slate-200 text-slate-750 text-xs uppercase rounded-xl cursor-pointer"
              >
                Retour
              </button>
              <button
                type="button"
                onClick={() => {
                  setForgotSuccess(true);
                  setTimeout(() => {
                    setForgotSuccess(false);
                    setShowForgotModal(false);
                  }, 2500);
                }}
                className="py-2.5 px-6 bg-green-600 hover:bg-green-700 text-white text-xs uppercase tracking-wider rounded-xl cursor-pointer"
              >
                Régénérer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Modal overlay for Onboarding errors */}
      {isTicketOpen && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[1001] flex items-center justify-center p-4">
          <form onSubmit={handleSubmitTicket} className="bg-white rounded-3xl w-full max-w-sm border overflow-hidden shadow-2xl p-6 space-y-4 text-slate-800">
            <div className="border-b pb-3 text-sm font-black uppercase tracking-wider text-amber-700 flex items-center gap-1 font-mono">
              📨 Signalement d'alarme de saisie
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Ce formulaire expédie directement un ticket HR/Secops prioritaire à Marie KAPEND d'ACME pour forcer une ré-estimation d'identité.
              </p>
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Descriptif de l'alarme</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  placeholder="Décrivez l'erreur détectée de vos coordonnées (ex: Erreur d'orthographe dans mon nom de famille ou numéro de téléphone)..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-4 focus:ring-amber-500/10 font-medium"
                />
              </div>
            </div>
            <div className="flex gap-2 border-t pt-3 justify-end font-black text-[10px] uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setIsTicketOpen(false)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer"
              >
                Retour
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer shadow shadow-amber-600/10"
              >
                Tirer l'Alarme HR
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
export default Login;
