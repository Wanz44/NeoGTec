/**
 * 🔐 Fichier : /src/frontend/components/Login.tsx
 * 🎯 Objectif : Espace Administration NeoGTec — Portail d'Authentification Centralisé (Style PDF Phoenix)
 * 🛡️ Conformité : ISO 27001, OWASP Top 10, redirection intelligente du tenant.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  Lock, Mail, Eye, EyeOff, ShieldAlert, CheckCircle2, 
  Smartphone, KeyRound, AlertTriangle, Fingerprint, RefreshCw, 
  HelpCircle, Check, ArrowRight, QrCode, FileText, Shield, ArrowLeft, Users,
  Building2, UserCheck, Stethoscope, ShieldCheck
} from 'lucide-react';

export const CONFIG_PORTAILS: Record<string, {
  title: string;
  sub: string;
  icon: React.ElementType;
  bg: string;
  checklist: string[];
  placeholderEmail: string;
}> = {
  entreprise: {
    title: "Espace Entreprise",
    sub: "RH & Contrats Collectifs",
    icon: Building2,
    bg: "#0D2818",
    checklist: [
      "Portail RH sécurisé",
      "Gestion 5000 employés",
      "Factures centralisées"
    ],
    placeholderEmail: "rh@entreprise.cd"
  },
  assure: {
    title: "Espace Assuré",
    sub: "Ma carte & mes soins",
    icon: UserCheck,
    bg: "#C6992E",
    checklist: [
      "QR Code dynamique",
      "Consultation des plafonds",
      "Suivi des remboursements"
    ],
    placeholderEmail: "assure@neogtec.cd"
  },
  prestataire: {
    title: "Espace Prestataire",
    sub: "Scanner & PEC",
    icon: Stethoscope,
    bg: "#1B4A34",
    checklist: [
      "Vérification des droits",
      "Émission instantanée PEC",
      "Bordereaux de facturation"
    ],
    placeholderEmail: "prestataire@clinique.cd"
  },
  assureur: {
    title: "Back-Office Assureur",
    sub: "Pilotage & Anti-Fraude",
    icon: ShieldCheck,
    bg: "#0F172A",
    checklist: [
      "KPI de sinistralité",
      "Dérogations & arbitrages",
      "Clearing & réassurance"
    ],
    placeholderEmail: "backoffice@assureur.cd"
  }
};

interface LoginProps {
  onLoginSuccess: (user: { 
    email: string; 
    name: string; 
    role: string; 
    tenantId: string | null; 
    status: string; 
    mfaEnabled: boolean;
    impersonatedBy?: string;
    portal?: string;
  }) => void;
}

// Preset simulator users for dynamic routing tests
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
    password: 'MarieKa!1234', 
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
  // Read portal context from URL params
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
  const rawPortal = searchParams.get('portal');
  const portal = (rawPortal && CONFIG_PORTAILS[rawPortal]) ? rawPortal : 'assure';
  const currentConfig = CONFIG_PORTAILS[portal];
  const PortalIcon = currentConfig.icon;

  const lastPortal = typeof window !== 'undefined' ? localStorage.getItem('neogtec_last_portal') : null;
  const showSwitchBanner = !!(lastPortal && lastPortal !== portal);

  // Credentials Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  
  // Security checks & flows states
  const [step, setStep] = useState<'credentials' | 'verifying' | 'mfa' | 'onboarding_welcome' | 'onboarding_mfa' | 'suspended_message'>('credentials');
  const [activeMfaUser, setActiveMfaUser] = useState<typeof SIMULATOR_USERS[0] | null>(null);
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);
  
  const [mfaCode, setMfaCode] = useState('');
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

  // Onboarding Flow Variables
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
    let interval: any;
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
    let interval: any;
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

  // Onboard Password ISO rules
  const oLengthValid = onboardNewPwd.length >= 12;
  const oUpperValid = /[A-Z]/.test(onboardNewPwd);
  const oDigitValid = /[0-9]/.test(onboardNewPwd);
  const oSpecialValid = /[^A-Za-z0-9]/.test(onboardNewPwd);
  const oAllValid = oLengthValid && oUpperValid && oDigitValid && oSpecialValid;
  const oMatchValid = onboardConfirmPwd !== '' && onboardConfirmPwd === onboardNewPwd;

  const selectUserPreset = (user: typeof SIMULATOR_USERS[0]) => {
    setEmail(user.email);
    setPassword(user.password);
    setErrorMsg(null);
  };

  const executeStep2Checks = (matchedUser: typeof SIMULATOR_USERS[0]) => {
    setStep('verifying');
    setVerificationLogs([]);

    const addLog = (msg: string, delay: number) => {
      setTimeout(() => {
        setVerificationLogs(prev => [...prev, msg]);
      }, delay);
    };

    addLog("✓ [1/5] Identifiants d'accès certifiés (Cryptographie BCrypt hashs match)", 50);
    addLog(
      rememberDevice 
        ? "✓ [2/5] Jeton MFA ignoré : Appareil de confiance enregistré 30 jours." 
        : "✓ [2/5] Vérification MFA requise pour cette adresse administrative.",
      120
    );
    addLog(`✓ [3/5] État du compte : ${matchedUser.status} de l'Établissement.`, 180);
    addLog("✓ [4/5] SQL: SELECT tenant_id, role, permissions, is_new_user FROM users WHERE email = ?", 240);
    addLog("✓ [5/5] Redirection vers le tableau de correspondances applicatif...", 299);

    setTimeout(() => {
      localStorage.setItem('neogtec_last_portal', portal);
      localStorage.setItem('neogtec_portal', portal);
      if (matchedUser.status === 'Suspendu') {
        setStep('suspended_message');
      } else if (matchedUser.mustChangePassword) {
        setStep('onboarding_welcome');
      } else if (!rememberDevice) {
        setActiveMfaUser(matchedUser);
        setStep('mfa');
      } else {
        onLoginSuccess({
          email: matchedUser.email,
          name: matchedUser.name,
          role: matchedUser.role,
          tenantId: matchedUser.tenantId,
          status: matchedUser.status,
          mfaEnabled: true,
          portal: portal
        });
        try {
          window.history.pushState({}, '', `/${portal}/dashboard`);
        } catch (e) {}
      }
    }, 1800);
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
        setLockTimer(15);
        setErrorMsg("Compte bloqué temporairement suite à 5 échecs consécutifs. Rapport envoyé aux cellules de sécurité.");
      } else {
        setErrorMsg("Identifiants de sécurité invalides. Accès interdit.");
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
      localStorage.setItem('neogtec_last_portal', portal);
      localStorage.setItem('neogtec_portal', portal);
      onLoginSuccess({
        email: activeMfaUser.email,
        name: activeMfaUser.name,
        role: activeMfaUser.role,
        tenantId: activeMfaUser.tenantId,
        status: activeMfaUser.status,
        mfaEnabled: true,
        portal: portal
      });
      try {
        window.history.pushState({}, '', `/${portal}/dashboard`);
      } catch (e) {}
    }
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Ticket d'erreur de saisie expédié à Marie KAPEND (Cellule RH) :\n"${ticketMsg}"`);
    setIsTicketOpen(false);
    setTicketMsg("");
  };

  const handleFinishOnboarding = () => {
    localStorage.setItem('neogtec_last_portal', portal);
    localStorage.setItem('neogtec_portal', portal);
    onLoginSuccess({
      email: 'nouveau@acme.cd',
      name: 'Nouveau Collaborateur',
      role: 'SUPPORT_CLIENT',
      tenantId: 'acme',
      status: 'Actif',
      mfaEnabled: true,
      portal: portal
    });
    try {
      window.history.pushState({}, '', `/${portal}/dashboard`);
    } catch (e) {}
  };

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 antialiased text-[#1e293b] bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuB-ED9EWyg2Bbqt_IxrQiqOpEDj66wV_8ttzZvS1CuLb4z6UfxDwh_8JX5Zpd0NbnN2M2imOSSK-uHLnrcsUL1PWlZ0k1EaZe0qVIvB6AbRdkTm2xBoJGq9siEuXzJh2AinnNpocThxDKn_BLt73LVxOCc8LPD38eg2BewgI-PmCNQoxUVYmu8Ef2mXacMZ2EqevIb_l_RZKqIBm3tHWDUvYlUpgo3CWNLg_kHbAD6gMEHtrwPrwsp3NCKElN-6nY1OJg')`,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Dimmer */}
      <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-xs z-0 pointer-events-none" />

      {/* Main Container */}
      <main className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row border border-slate-200 relative z-10">
        
        {/* Left Panel: Information & Authentification Details */}
        <section className="w-full md:w-5/12 p-10 flex flex-col justify-between hidden md:flex bg-gradient-to-b from-[#f1f5f9] to-[#e2e8f0] rounded-l-2xl m-2 border border-slate-200/55">
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-[#1e293b] tracking-tight leading-snug">
              Authentification {currentConfig.title}
            </h2>
            <p className="text-[#64748b] text-sm leading-relaxed">
              Bénéficiez d'un processus de connexion sécurisé, rapide et conforme aux normes d'audit ARCA-RDC les plus strictes.
            </p>
            
            <ul className="space-y-4">
              {currentConfig.checklist.map((item, idx) => (
                <li key={idx} className="flex items-center text-sm font-semibold text-[#1e293b]">
                  <div 
                    className="w-5 h-5 rounded-full flex items-center justify-center mr-3 text-white shrink-0"
                    style={{ backgroundColor: currentConfig.bg }}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Phoenix birds / House SVG layout with 2 dots of portal color */}
          <div className="mt-12 flex justify-center">
            <svg className="w-full max-w-[200px] h-auto text-slate-400/20" fill="currentColor" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 20L20 90h20v90h120V90h20L100 20zm-20 140H60v-40h20v40zm60 0h-20v-40h20v40z"></path>
              <circle cx="70" cy="100" fill={currentConfig.bg} opacity="0.9" r="15"></circle>
              <circle cx="130" cy="130" fill={currentConfig.bg} opacity="0.9" r="15"></circle>
            </svg>
          </div>
        </section>

        {/* Right Panel: Content Box */}
        <section className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center bg-white min-h-[560px]">
          
          <AnimatePresence mode="wait">
            {step === 'credentials' && (
              <motion.div
                key="credentials"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                      style={{ backgroundColor: currentConfig.bg }}
                    >
                      <PortalIcon className="w-6 h-6" />
                    </div>
                    <button
                      type="button"
                      data-testid="btn-retour-hub"
                      onClick={() => {
                        window.location.href = '/?hub=open';
                      }}
                      className="text-xs font-bold text-[#64748b] hover:text-[#0D2818] transition-colors flex items-center gap-1.5 cursor-pointer bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg"
                    >
                      ← Retour au choix du portail
                    </button>
                  </div>

                  {showSwitchBanner && (
                    <div 
                      data-testid="banner-switch-portal"
                      className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center justify-between"
                    >
                      <span>
                        Vous aviez une session <strong>{lastPortal}</strong>. Continuer vers <strong>{portal}</strong> ?
                      </span>
                      <button 
                        type="button" 
                        onClick={() => {
                          window.location.href = `/login?portal=${lastPortal}`;
                        }}
                        className="ml-2 text-amber-950 font-bold underline cursor-pointer hover:text-amber-800"
                      >
                        Changer
                      </button>
                    </div>
                  )}

                  <div>
                    <h1 data-testid="title-login-portal" className="text-2xl font-extrabold text-[#1e293b] tracking-tight">
                      Se connecter à {currentConfig.title}
                    </h1>
                    <p data-testid="subtitle-login-portal" className="text-[#64748b] text-sm mt-0.5">
                      Accédez à votre {currentConfig.sub}
                    </p>
                  </div>
                </div>

                {/* Google Login Block */}
                <div className="space-y-4">
                  <button 
                    type="button"
                    onClick={() => {
                      setEmail('paul@neogtec.com');
                      setPassword('Paul_#20269988@');
                      setErrorMsg(null);
                      alert("Compte de démonstration Super-Admin pré-rempli ! Cliquez sur Se Connecter.");
                    }}
                    className="w-full flex items-center justify-center py-2.5 px-4 border border-[#e2e8f0] rounded-xl bg-[#f8fafc] hover:bg-slate-100 transition-colors text-sm font-semibold text-[#1e293b] cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-3 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M21.35 11.1h-9.17v2.73h6.51c-.33 3.81-3.5 5.44-6.5 5.44C8.36 19.27 5 16.25 5 12c0-4.1 3.2-7.27 7.2-7.27 3.09 0 4.9 1.97 4.9 1.97L19 4.72S16.56 2 12.1 2C6.42 2 2 6.48 2 12c0 5.08 4.25 10 10.1 10 5.9 0 9.6-4.1 9.6-10 0-.69-.05-1.3-.35-1.9z"></path>
                    </svg>
                    Se connecter avec Google
                  </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center">
                  <div className="flex-grow border-t border-[#e2e8f0]"></div>
                  <span className="flex-shrink-0 mx-4 text-[#64748b] text-xs font-semibold uppercase tracking-wider">ou utilisez le courriel</span>
                  <div className="flex-grow border-t border-[#e2e8f0]"></div>
                </div>

                {errorMsg && (
                  <div className="bg-red-50 border border-red-150 rounded-xl p-3.5 flex gap-3 items-start text-xs text-red-800 font-semibold shadow-3xs">
                    <ShieldAlert className="w-4.5 h-4.5 text-red-600 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Main Login Form */}
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                  
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider" htmlFor="email">
                      Nom ou Adresse email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-[#64748b]" />
                      </div>
                      <input 
                        type="email"
                        id="email" 
                        name="email" 
                        required
                        placeholder={currentConfig.placeholderEmail}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 block w-full border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] text-sm py-2.5 bg-white text-[#1e293b]"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider" htmlFor="password">
                      Mot de passe
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Lock className="w-4 h-4 text-[#64748b]" />
                      </div>
                      <input 
                        type={showPassword ? 'text' : 'password'}
                        id="password" 
                        name="password" 
                        required
                        placeholder="Mot de passe"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10 block w-full border-[#e2e8f0] rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-[#3b82f6] text-sm py-2.5 bg-white text-[#1e293b] font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 outline-none"
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex items-center justify-between py-1 text-sm select-none">
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-2 text-[#005b0a] cursor-pointer" style={{ color: '#005b0a' }}>
                        <input 
                          type="checkbox"
                          id="remember-me" 
                          name="remember-me" 
                          checked={rememberDevice}
                          onChange={(e) => setRememberDevice(e.target.checked)}
                          className="h-4 w-4 text-[#005b0a] focus:ring-[#005b0a] border-[#e2e8f0] rounded cursor-pointer"
                        />
                        <span>Souviens-toi de moi</span>
                      </label>
                      <button type="button" className="hidden" style={{ color: '#005b0a' }} />
                    </div>
                    <div>
                      <button 
                        type="button"
                        onClick={() => setShowForgotModal(true)}
                        className="font-semibold text-[#005b0a] hover:text-[#003b06] outline-none"
                        style={{ color: '#005b0a' }}
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button 
                      type="submit"
                      data-testid={`btn-login-${portal}`}
                      disabled={isLocked || !email || !password}
                      style={{ backgroundColor: (email && password && !isLocked) ? currentConfig.bg : undefined }}
                      className={cn(
                        "w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white transition-all shadow-sm cursor-pointer",
                        (email && password && !isLocked)
                          ? "hover:opacity-90 active:scale-[0.99] shadow-md"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed opacity-60"
                      )}
                    >
                      Se connecter à l'Espace {portal}
                    </button>
                  </div>
                </form>

                {/* Interactive Simulation Accounts helper drawer */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowDemoAccounts(!showDemoAccounts)}
                    className="flex items-center justify-between w-full py-2.5 px-4 bg-amber-50/50 border border-amber-200 text-amber-800 rounded-xl text-xs font-semibold hover:bg-amber-50 transition-colors outline-none cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-700" />
                      <span>🔑 Comptes de test &amp; Simulation (Cliquez pour tester)</span>
                    </span>
                    <span className="text-[10px] font-bold">{showDemoAccounts ? "Masquer ▲" : "Afficher ▼"}</span>
                  </button>

                  <AnimatePresence>
                    {showDemoAccounts && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden mt-2 space-y-1 bg-slate-50 rounded-xl p-2 border border-slate-200 text-[11px]"
                      >
                        {SIMULATOR_USERS.map((user) => (
                          <button
                            key={user.email}
                            type="button"
                            onClick={() => selectUserPreset(user)}
                            className="flex items-center justify-between w-full p-2 rounded-lg hover:bg-white text-slate-700 border border-transparent hover:border-slate-200/60 text-left transition-all"
                          >
                            <span className="font-medium">
                              {user.name} <span className="text-[9px] text-[#64748b] font-bold">({user.role})</span>
                            </span>
                            <span className="font-mono text-[10px] text-[#3b82f6] underline">Sélect.</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* STAGE : 300ms intelligent backend verif loader */}
            {step === 'verifying' && (
              <motion.div
                key="verifying"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6 py-6"
              >
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 rounded-full border-2 border-dashed border-[#3b82f6] animate-spin flex items-center justify-center mx-auto" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-widest text-[#3b82f6]">Identification en cours</h3>
                    <p className="text-[11px] text-[#64748b] font-bold mt-1 uppercase tracking-wide">Analyse des credentials &amp; droits...</p>
                  </div>
                </div>

                <div className="p-4 bg-slate-900 rounded-xl font-mono text-[10px] text-[#00ff66] space-y-1.5 h-36 overflow-y-auto shadow-inner border border-slate-950">
                  {verificationLogs.map((log, index) => (
                    <div key={index} className="flex gap-1.5">
                      <span className="text-emerald-650 font-bold">#db</span>
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
                  <div className="w-12 h-12 bg-indigo-50 border border-indigo-200 text-[#3b82f6] rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <Fingerprint className="w-6 h-6 animate-pulse" />
                  </div>
                  <h3 className="text-lg font-bold text-[#1e293b] uppercase">Double Facteur Requis</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    Saisissez le code d'authentification expédié sur votre terminal mobile appairé pour valider l'entrée.
                  </p>
                </div>

                <form onSubmit={handleMfaSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase text-slate-400 font-mono tracking-widest block text-center">Insérer le code 6 chiffres</label>
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="Simulation : n'importe quel code"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value)}
                      className="w-full h-12 border border-[#e2e8f0] rounded-xl text-center text-lg font-bold font-mono tracking-[0.4em] focus:outline-none focus:ring-2 focus:ring-indigo-500/10 placeholder:text-slate-300 placeholder:text-xs placeholder:tracking-normal bg-[#f8fafc]"
                    />
                  </div>

                  <div className="flex gap-2 justify-between border-t pt-4">
                    <button
                      type="button"
                      onClick={() => setStep('credentials')}
                      className="py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-[#1e293b] font-semibold text-xs uppercase rounded-xl cursor-pointer"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="py-2.5 px-6 bg-[#3b82f6] hover:bg-blue-600 text-white font-semibold text-xs uppercase rounded-xl cursor-pointer"
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
                <div className="w-14 h-14 bg-red-50 border border-red-200 text-red-600 rounded-full flex items-center justify-center mx-auto animate-bounce shadow">
                  <ShieldAlert className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-base font-extrabold uppercase text-red-700 tracking-wide">Compte d'accès suspendu</h3>
                  <p className="text-xs text-red-950 bg-red-50 p-4 border border-red-100 rounded-xl leading-relaxed font-semibold">
                    Votre accès de sécurité client pour cet établissement locataire a été suspendu par l'administration globale. 
                    <strong className="text-red-900 block mt-2">Motif d'action : Facture SaaS J+15 Impayée.</strong>
                  </p>
                  <p className="text-[10px] text-[#64748b] font-bold uppercase tracking-wider">
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
                className="space-y-4"
              >
                <div className="text-center space-y-2 pb-2 border-b">
                  <span className="text-[9.5px] font-black text-red-600 uppercase tracking-widest font-mono">Parcours 1ère Connexion Obligatoire</span>
                  <h3 className="text-lg font-bold text-[#1e293b]">Bienvenue, Nouveau Collaborateur</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    Votre compte de gestionnaire a été configuré. Suivez ces étapes obligatoires pour activer votre espace de travail.
                  </p>
                </div>

                {/* Section 1 : Vos Coordonnées */}
                <div className="p-4 bg-slate-50 border rounded-xl space-y-2 text-xs">
                  <p className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Section 1 : Informations</p>
                  <div className="grid grid-cols-2 gap-2 text-slate-600">
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400">Nom complet</p>
                      <p className="text-[#1e293b] font-bold uppercase">Nouveau Collaborateur</p>
                    </div>
                    <div>
                      <p className="text-[8px] uppercase tracking-wider text-slate-400">E-mail rattaché</p>
                      <p className="text-[#1e293b] font-mono">nouveau@acme.cd</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setTicketMsg("Erreur dans les informations d'onboarding. Mon e-mail ou mon patronyme comporte un problème.");
                      setIsTicketOpen(true);
                    }}
                    className="mt-2 py-1 px-3 bg-white border border-amber-300 hover:bg-amber-100 text-amber-800 rounded-lg text-[9px] font-black uppercase tracking-wider cursor-pointer"
                  >
                    Signaler une erreur
                  </button>
                </div>

                {/* Section 2 : Secure Account */}
                <div className="space-y-4 pt-1">
                  <p className="text-[9.5px] font-black text-[#64748b] uppercase tracking-widest font-mono">Section 2 : Sécurisation</p>
                  
                  <div className="p-2 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg flex items-center justify-between text-xs font-semibold">
                    <span>Mot de passe d'activation reçu :</span>
                    <span className="font-mono bg-white border px-2 py-0.5 rounded font-black text-emerald-700">MarieKa!1234</span>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-mono uppercase font-black text-[#64748b]">
                      <span>Saisir le mot de passe reçu</span>
                      <span className="text-red-600 font-bold">Essais : {onboardPwdAttempts}/3</span>
                    </div>
                    {onboardLocked ? (
                      <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold font-mono">
                        Sécurité ISO : Compte bloqué temporairement... {onboardLockTimer}s
                      </div>
                    ) : (
                      <input
                        type="password"
                        placeholder="Tapez MarieKa!1234"
                        value={onboardDefaultPwd}
                        onChange={(e) => setOnboardDefaultPwd(e.target.value)}
                        className="w-full h-10 border border-[#e2e8f0] rounded-xl px-4 text-xs font-mono font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                      />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono uppercase font-black text-[#64748b]">Nouveau mot de passe fort</label>
                    <div className="relative">
                      <input
                        type={showOnboardNewPwd ? "text" : "password"}
                        placeholder="Créez votre mot de passe"
                        value={onboardNewPwd}
                        onChange={(e) => setOnboardNewPwd(e.target.value)}
                        className="w-full h-10 border border-[#e2e8f0] rounded-xl px-4 pr-10 text-xs font-mono font-bold focus:outline-none text-[#1e293b]"
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
                    <label className="text-[10px] font-mono uppercase font-black text-[#64748b]">Confirmer le mot de passe</label>
                    <div className="relative">
                      <input
                        type={showOnboardConfirmPwd ? "text" : "password"}
                        placeholder="Confirmer votre mot de passe"
                        value={onboardConfirmPwd}
                        onChange={(e) => setOnboardConfirmPwd(e.target.value)}
                        className="w-full h-10 border border-[#e2e8f0] rounded-xl px-4 pr-10 text-xs font-mono font-bold focus:outline-none text-[#1e293b]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowOnboardConfirmPwd(!showOnboardConfirmPwd)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                      >
                        {showOnboardConfirmPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
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
                    className="flex-1 py-3 text-[#64748b] hover:bg-slate-50 border rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer"
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
                          setOnboardLockTimer(15);
                          alert("Alerte de sécurité : Compte temporairement verrouillé pour 15s.");
                        } else {
                          alert("Mot de passe par défaut erroné. Veuillez taper 'MarieKa!1234' pour simuler.");
                        }
                        return;
                      }
                      setStep('onboarding_mfa');
                    }}
                    className={cn(
                      "flex-1 py-3 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer flex items-center justify-center gap-1 shadow-md",
                      (oAllValid && oMatchValid && onboardDefaultPwd && !onboardLocked) 
                        ? "bg-[#3b82f6] hover:bg-blue-600 shadow-blue-600/10" 
                        : "bg-slate-200 text-slate-400 cursor-not-allowed"
                    )}
                  >
                    Continuer <ArrowRight className="w-3.5 h-3.5" />
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
                  <span className="text-[9.5px] font-black text-red-600 uppercase tracking-widest font-mono">Dernière étape Onboarding</span>
                  <h3 className="text-base font-bold text-[#1e293b]">Enrôler le Double Facteur (MFA)</h3>
                  <p className="text-xs text-[#64748b] leading-relaxed">
                    Compte tenu des exigences de conformité réglementaire, l'enrôlement du double facteur est obligatoire.
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
                          onboardMfaMethod === 'APP' ? "bg-white text-indigo-600 shadow" : "text-[#64748b]"
                        )}
                      >
                        <QrCode className="w-4 h-4" /> Authenticator App
                      </button>
                      <button
                        type="button"
                        onClick={() => setOnboardMfaMethod('SMS')}
                        className={cn(
                          "flex-1 py-2 rounded-lg text-[10.5px] font-bold uppercase transition focus:outline-none flex items-center justify-center gap-1.5 cursor-pointer",
                          onboardMfaMethod === 'SMS' ? "bg-white text-indigo-600 shadow" : "text-[#64748b]"
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
                        <p className="text-[10px] text-[#64748b] font-bold text-center leading-normal">
                          Scannez ce QR Code avec Google Authenticator puis tapez le jeton généré.
                        </p>
                      </div>
                    ) : (
                      <div className="p-4 bg-indigo-50 border border-indigo-200 text-indigo-800 rounded-2xl space-y-1 text-center font-semibold text-xs animate-pulse">
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
                        className="w-full h-11 border border-slate-300 rounded-xl text-center text-lg font-bold font-mono tracking-widest focus:outline-none focus:ring-4 focus:ring-indigo-500/10 placeholder:text-slate-300 placeholder:text-xs placeholder:tracking-normal bg-[#f8fafc]"
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
                        <p className="font-extrabold uppercase">Double Facteur Appairé !</p>
                        <p>Vos accès de production sont validés à 100%.</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[10px] font-mono text-slate-450 uppercase font-black">
                        <span>Sauvegarder ces 10 codes de secours</span>
                        <span className="text-red-500">Privé / Unique</span>
                      </div>
                      <div className="bg-slate-900 border p-4 rounded-xl grid grid-cols-2 gap-2 text-xs font-mono font-bold text-[#33ff33] text-center select-all h-24 overflow-y-auto no-scrollbar shadow-inner">
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
                      <FileText className="w-4 h-4 text-emerald-600" /> Copier les codes de secours
                    </button>

                    <div className="flex gap-2 items-center justify-between border-t pt-4">
                      <span className="text-[10px] text-slate-450 font-extrabold leading-none">Vérifié ISO 27001</span>
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
                        Finaliser l'accès
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </section>

      </main>

      {/* Recoveries Password Simulated Modal dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-[999] flex items-center justify-center p-4">
          <div className="relative bg-white rounded-2xl w-full max-w-md border overflow-hidden shadow-2xl p-6 space-y-4 text-slate-800">
            <div className="border-b pb-3 text-sm font-black uppercase tracking-wider text-blue-600 flex items-center gap-1">
              Récupérer mot de passe
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Saisissez votre e-mail d'affectation pour recevoir le jeton d'accès temporaire d'urgence valable 15 minutes.
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
                className="py-2.5 px-6 bg-blue-600 hover:bg-blue-700 text-white text-xs uppercase tracking-wider rounded-xl cursor-pointer"
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
          <form onSubmit={handleSubmitTicket} className="bg-white rounded-2xl w-full max-w-sm border overflow-hidden shadow-2xl p-6 space-y-4 text-slate-800">
            <div className="border-b pb-3 text-sm font-black uppercase tracking-wider text-amber-700 flex items-center gap-1 font-mono">
              📨 Signalement d'erreur de saisie
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-500 font-bold leading-relaxed">
                Ce formulaire expédie directement un ticket d'aide prioritaire à Marie KAPEND d'ACME.
              </p>
              <div className="space-y-1.5">
                <label className="text-[9.5px] font-black text-slate-400 uppercase tracking-widest font-mono">Descriptif de l'alarme</label>
                <textarea
                  required
                  rows={4}
                  value={ticketMsg}
                  onChange={(e) => setTicketMsg(e.target.value)}
                  placeholder="Décrivez l'erreur détectée dans vos coordonnées..."
                  className="w-full border border-slate-300 rounded-xl p-3 text-xs focus:outline-none focus:ring-4 focus:ring-amber-500/10 font-medium"
                />
              </div>
            </div>
            <div className="flex gap-2 border-t pt-3 justify-end font-black text-[10px] uppercase tracking-wider">
              <button
                type="button"
                onClick={() => setIsTicketOpen(false)}
                className="py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-750 rounded-lg cursor-pointer"
              >
                Retour
              </button>
              <button
                type="submit"
                className="py-2 px-5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg cursor-pointer shadow shadow-amber-600/10"
              >
                Envoyer le Ticket
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default Login;
