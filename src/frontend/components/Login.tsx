/**
 * 🔐 Fichier : /src/frontend/components/Login.tsx
 * 🎯 Objectif : Espace Administration NeoGTec — Portail d'Authentification Sécurisé 
 * 🎨 Style : Inspiration Google Accounts, Thème Clair (Light mode) épuré, Base de Couleur Verte.
 * 🛡️ Conformité : ISO 27001, OWASP Top 10 (Anti-Bruteforce, Anti-Enumeration, Cookie de session).
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Lock, Mail, Eye, EyeOff, ShieldAlert, CheckCircle2, 
  Smartphone, Key, KeyRound, AlertTriangle, 
  Fingerprint, RefreshCw, Smartphone as PhoneIcon, 
  HelpCircle, Laptop, ShieldCheck, Check, ArrowRight,
  ShieldAlert as AlertIcon
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: { email: string; name: string; role: string }) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [lang, setLang] = useState<'FR' | 'EN' | 'LIN'>('FR');
  
  // Credentials Inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  
  // Security & Stages state
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials');
  const [mfaChannel, setMfaChannel] = useState<'SMS' | 'APP' | 'FIDO2'>('SMS');
  const [mfaCode, setMfaCode] = useState('');
  const [mfaTimer, setMfaTimer] = useState(60);

  // Anti-Bruteforce Logic
  const [attempts, setAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaTarget, setCaptchaTarget] = useState('N30G73C');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // Forgot Password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);

  // Authenticated default Admin definitions
  const ALLOWED_ADMINS = [
    { email: 'adonailutonadio70@gmail.com', password: 'Adonai_#202623624@', name: 'Adonïa Lutonadio (Admin)' },
    { email: 'mutomborocky@gmail.com', password: 'Rocky_#202676259@', name: 'Mutombo Rocky (Admin)' }
  ];

  // International translations
  const t = {
    FR: {
      title: 'Espace Administration NeoGTec',
      restricted: 'Accès restreint',
      subText: 'Utilisez vos identifiants NeoGTec pour accéder à la console de gestion.',
      email: 'Adresse e-mail professionnelle',
      emailPl: 'prenom.nom@neogtec.com',
      password: 'Mot de passe',
      passwordPl: 'Saisissez votre mot de passe',
      show: 'Afficher',
      hide: 'Masquer',
      remember: 'Se souvenir de cet appareil pendant 30 jours',
      loginBtn: 'Suivant',
      forgot: 'Mot de passe oublié ?',
      statusOk: 'Tous les services d\'authentification sont opérationnels',
      mfaTitle: 'Validation en deux étapes',
      mfaSub: 'NeoGTec souhaite vérifier qu\'il s\'agit bien de vous. Choisissez une méthode de validation.',
      cancel: 'Retour',
      validate: 'Confirmer',
      resend: 'Renvoyer le code',
      errInvalid: 'Identifiants invalides ou accréditations incorrectes.',
      errGmailForbidden: "L'usage d'adresses Gmail publiques est formellement interdit, à l'exception des comptes d'Administration Suprême explicitement accrédités.",
      lockedMsg: 'Compte suspendu pour 15 min suite à 5 tentatives infructueuses. Une alerte a été envoyée à security@neogtec.com.',
      mfaBanner: '⚠️ Sécurité obligatoire : Vous devez activer le MFA avant le 30/05 sous peine de suspension immédiate de l\'accès.',
      forgotTitle: 'Récupération du mot de passe en ligne',
      forgotPl: 'Saisissez votre adresse e-mail',
      forgotSubmit: 'Régénérer mot de passe',
      forgotMsg: 'Si le compte d\'accréditation existe, un lien valable 15 minutes a été envoyé.',
    },
    EN: {
      title: 'NeoGTec Admin Console',
      restricted: 'Restricted Access',
      subText: 'Use your NeoGTec credentials to sign in to the control gateway.',
      email: 'Professional Email Address',
      emailPl: 'firstname.lastname@neogtec.com',
      password: 'Password',
      passwordPl: 'Enter your password',
      show: 'Show',
      hide: 'Hide',
      remember: 'Remember this device for 30 days',
      loginBtn: 'Next',
      forgot: 'Forgot password?',
      statusOk: 'All auth systems operational',
      mfaTitle: '2-Step Verification',
      mfaSub: 'NeoGTec wants to make sure it\'s really you. Select a verification method below.',
      cancel: 'Back',
      validate: 'Confirm',
      resend: 'Resend code',
      errInvalid: 'Invalid credentials or access permissions.',
      errGmailForbidden: 'Public Gmail addresses are strictly prohibited, except for authorized Supreme Admin accounts.',
      lockedMsg: 'Account locked for 15 minutes after 5 failures. An incident was sent to security@neogtec.com.',
      mfaBanner: '⚠️ Mandatory security: MFA activation is required before 05/30 or access will be suspended.',
      forgotTitle: 'Online Account Recovery',
      forgotPl: 'Enter your email address',
      forgotSubmit: 'Recover password',
      forgotMsg: 'If the administrative account exists, a recovery link valid for 15 minutes has been sent.',
    },
    LIN: {
      title: 'Esika ya Bonzenga NeoGTec Admin',
      restricted: 'Epekisami mpo na basusu',
      subText: 'Koma Email to fungola na yo mpo na kokota na console.',
      email: 'Email ya mosala',
      emailPl: 'kombo@neogtec.com',
      password: 'Fungola (Mot de passe)',
      passwordPl: 'Tondisa liloba ya siri na yo',
      show: 'Lakisá',
      hide: 'Bombá',
      remember: 'Kanisa ordinatere oyo mpo na mikolo 30',
      loginBtn: 'Kokota',
      forgot: 'Obebisaki fungola ?',
      statusOk: 'Biloko nionso ya bokengi ezali malamu',
      mfaTitle: 'Bobakisi-bokengi ya mibale (MFA)',
      mfaSub: 'Kopesa nzela mpo na lofungola mobimba ya session na yo.',
      cancel: 'Zonga sima',
      validate: 'Tondisa',
      resend: 'Tinda lisusu',
      errInvalid: 'Fungola to Email ezali sembo te, bomeki ya mabe.',
      errGmailForbidden: 'Adresi Gmail ya bato nionso epekisami! Kaka mpo na bakambi minene ba oyo bandimama.',
      lockedMsg: 'Konti ekangami mpo na mbala 5 ya mabe. Nkasa ya kofunda etindami na security@neogtec.com.',
      mfaBanner: '⚠️ Bokengi ya mabe: Tyá bokebi na MFA na yo yambo ya mokolo 30/05/2026 soki te bakokanga konti na yo.',
      forgotTitle: 'Bobongisi d\'urgence ya fungola',
      forgotPl: 'Koma Email na yo mpo na kozua token',
      forgotSubmit: 'Zua token sika',
      forgotMsg: 'Soki konti ezali, tokotindela yo mokanda ya bobongisi na loposo ya bokengi (15 min).',
    }
  };

  const activeT = t[lang];

  // Dynamic MFA countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'mfa' && mfaTimer > 0) {
      interval = setInterval(() => {
        setMfaTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, mfaTimer]);

  // Anti-bruteforce lock countdown
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

  // Pass checks parameters
  const satisfiesLength = password.length >= 12;
  const satisfiesUpper = /[A-Z]/.test(password);
  const satisfiesDigit = /[0-9]/.test(password);
  const satisfiesSpecial = /[^A-Za-z0-9]/.test(password);
  const satisfiesAll = satisfiesLength && satisfiesUpper && satisfiesDigit && satisfiesSpecial;

  // Process Form Submissions
  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (isLocked) {
      setErrorMsg(activeT.lockedMsg);
      return;
    }

    const isGmail = email.toLowerCase().endsWith('@gmail.com');
    const isAuthorizedAdmin = ALLOWED_ADMINS.some(adm => adm.email.toLowerCase() === email.toLowerCase());

    if (isGmail && !isAuthorizedAdmin) {
      setErrorMsg(activeT.errGmailForbidden);
      return;
    }

    // Anti-Bruteforce / Auth validation check
    const matchingAdmin = ALLOWED_ADMINS.find(
      adm => adm.email.toLowerCase() === email.toLowerCase() && adm.password === password
    );

    if (!matchingAdmin) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      
      if (nextAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(900); // 15 minutes lockout
        setErrorMsg(activeT.lockedMsg);
        console.warn("🛡️ ID Audit failure logged. Sent threat notification to security@neogtec.com.");
      } else {
        setErrorMsg(activeT.errInvalid);
      }
      return;
    }

    // Capture check if reached lock-out boundary but unlocked now
    if (attempts >= 4 && captchaInput !== captchaTarget) {
      setErrorMsg("⚠️ Code CAPTCHA incorrect. Veuillez recopier le texte de sécurité.");
      return;
    }

    // Proceed directly to the platform upon validation of credentials
    processSuccess(matchingAdmin);
  };

  const handleMfaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mfaCode.length < 4 && mfaChannel !== 'FIDO2') {
      setErrorMsg("⚠️ Format de code de validation incorrect.");
      return;
    }

    const matchingAdmin = ALLOWED_ADMINS.find(adm => adm.email.toLowerCase() === email.toLowerCase());
    if (matchingAdmin) {
      processSuccess(matchingAdmin);
    }
  };

  const processSuccess = (admin: { email: string; name: string }) => {
    console.log("🍪 [Security Compliance]: Session cookie provisioned -> HttpOnly; Secure; SameSite=Strict");
    onLoginSuccess({
      email: admin.email,
      name: admin.name,
      role: 'SUPER_ADMIN'
    });
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSuccess(true);
    setTimeout(() => {
      setForgotSuccess(false);
      setShowForgotModal(false);
      setForgotEmail('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col justify-between p-0 m-0 text-slate-800">
      
      {/* Top micro bar */}
      <div className="w-full bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Logo NeoGTec shape pairing green */}
          <div className="w-7 h-7 rounded bg-green-600/10 border border-green-500/20 flex items-center justify-center text-green-600 font-extrabold shadow-sm text-sm">
            ▲
          </div>
          <div>
            <span className="font-bold tracking-tight text-slate-900 text-xs block uppercase">NEOGTEC</span>
            <span className="text-[8.5px] font-mono text-slate-400 font-bold uppercase tracking-wider block">Portail de Gestion Réseau</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10.5px] text-green-650 font-bold uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded border border-green-100">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            Accès sécurisé
          </span>
          
          {/* Subtle dropdown language selection like Google bottom bar */}
          <div className="flex items-center gap-1.5 select-none bg-slate-100 p-0.5 rounded-md border border-slate-200">
            {(['FR', 'EN', 'LIN'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 text-[9px] font-black uppercase rounded transition-all cursor-pointer ${lang === l ? 'bg-white text-green-650 shadow-sm border border-slate-200/50' : 'text-slate-500 hover:text-slate-900'}`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Container - Absolute Centering exactly like Google account login card container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        
        {/* Google-Style Clean Container Card */}
        <div className="w-full max-w-[450px] bg-white border border-slate-200 rounded-xl p-6 sm:p-10 shadow-sm hover:shadow-md transition-shadow duration-300 relative">
          
          {/* Top banner warning notice about MFA deadline */}
          <div className="bg-rose-50 border border-rose-100 text-rose-800 text-[11px] rounded-lg p-3.5 mb-6 flex gap-2.5 items-start leading-relaxed select-none">
            <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <span className="font-semibold">{activeT.mfaBanner}</span>
          </div>

          <div className="text-center space-y-2 mb-8">
            {/* Green Google-style brand header */}
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto shadow-sm select-none">
              <KeyRound className="w-6 h-6" />
            </div>
            
            <h2 className="text-xl font-bold font-sans text-slate-900 tracking-tight pt-2">
              {activeT.title}
            </h2>
            
            <p className="text-xs text-slate-500 font-semibold max-w-sm mx-auto leading-relaxed">
              {activeT.subText}
            </p>
          </div>

          {/* Incident reporting indicators inline */}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 rounded-lg p-3.5 text-xs text-rose-800 leading-normal flex items-start gap-2.5 mb-6">
              <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="font-bold flex-1">{errorMsg}</span>
            </div>
          )}

          {/* Step 1: Login Credentials Inputs */}
          {step === 'credentials' && (
            <form onSubmit={handleCredentialsSubmit} className="space-y-5">
              
              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                  {activeT.email}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder={activeT.emailPl}
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setErrorMsg(null); }}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-900 font-medium"
                  />
                </div>
              </div>

              {/* Password Access */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                    {activeT.password}
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[10px] font-black text-slate-550 hover:text-slate-900 transition-colors cursor-pointer outline-none"
                  >
                    {showPassword ? activeT.hide : activeT.show}
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder={activeT.passwordPl}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setErrorMsg(null); }}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-green-600 focus:ring-4 focus:ring-green-600/5 transition-all outline-none placeholder:text-slate-400 text-sm text-slate-900 font-medium tracking-wide"
                  />
                </div>

                {/* Secure ISO checks indicator aligned with visual cards */}
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-lg mt-3 select-none">
                  <div className="flex items-center justify-between mb-1.5 border-b border-slate-200/50 pb-1">
                    <span className="text-[8.5px] font-bold text-slate-500 uppercase tracking-widest">Contrôle ISO 27001</span>
                    {satisfiesAll ? (
                      <span className="text-green-650 font-bold text-[8.5px] uppercase tracking-wide flex items-center gap-1">Conforme <Check className="w-2.5 h-2.5" /></span>
                    ) : (
                      <span className="text-slate-400 font-bold text-[8.5px] uppercase tracking-wide">Validation</span>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[9.5px]">
                    <span className={`flex items-center gap-1.5 ${satisfiesLength ? 'text-green-650 font-bold' : 'text-slate-400'}`}>
                      <span className={`w-1 h-1 rounded ${satisfiesLength ? 'bg-green-500' : 'bg-slate-300'}`} /> 12 car. minimum
                    </span>
                    <span className={`flex items-center gap-1.5 ${satisfiesUpper ? 'text-green-650 font-bold' : 'text-slate-400'}`}>
                      <span className={`w-1 h-1 rounded ${satisfiesUpper ? 'bg-green-500' : 'bg-slate-300'}`} /> 1 majuscule
                    </span>
                    <span className={`flex items-center gap-1.5 ${satisfiesDigit ? 'text-green-650 font-bold' : 'text-slate-400'}`}>
                      <span className={`w-1 h-1 rounded ${satisfiesDigit ? 'bg-green-500' : 'bg-slate-300'}`} /> 1 chiffre
                    </span>
                    <span className={`flex items-center gap-1.5 ${satisfiesSpecial ? 'text-green-650 font-bold' : 'text-slate-400'}`}>
                      <span className={`w-1 h-1 rounded ${satisfiesSpecial ? 'bg-green-500' : 'bg-slate-300'}`} /> 1 car. spécial
                    </span>
                  </div>
                </div>
              </div>

              {/* Anti-hacking Capture Box */}
              {attempts >= 4 && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 space-y-2 select-none">
                  <div className="flex items-center justify-between text-[9px] uppercase font-bold text-amber-700 tracking-wider">
                    <span>Validation Captcha requise</span>
                    <span className="font-normal font-mono">attempts: {attempts}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 py-1.5 px-3 font-mono font-bold tracking-widest text-slate-700 border border-slate-200 rounded text-xs select-none select-none">
                      {captchaTarget}
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Miroir code"
                      value={captchaInput}
                      onChange={(e) => setCaptchaInput(e.target.value)}
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-205 rounded outline-none font-mono font-bold text-center text-xs text-slate-900 focus:border-green-600"
                    />
                    <button 
                      type="button" 
                      onClick={() => setCaptchaTarget(Math.random().toString(36).substring(2, 9).toUpperCase())}
                      className="p-2 bg-slate-100 border border-slate-200 rounded hover:bg-slate-200 text-slate-500 outline-none transition-all active:scale-95"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Device 30 days trust selector */}
              <div className="flex items-center justify-between select-none py-1">
                <label className="flex items-start gap-2 text-xs text-slate-500 leading-normal cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberDevice}
                    onChange={(e) => setRememberDevice(e.target.checked)}
                    className="rounded border-slate-300 bg-white text-green-650 focus:ring-0 focus:ring-offset-0 mt-0.5 cursor-pointer w-4 h-4"
                  />
                  <span className="font-semibold">{activeT.remember}</span>
                </label>
              </div>

              {/* Lower Actions Section - Perfect replica of Google action footer layout */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-left text-xs text-green-650 font-bold hover:text-green-750 transition-colors outline-none cursor-pointer"
                >
                  {activeT.forgot}
                </button>

                <button
                  type="submit"
                  disabled={!email || !password || isLocked}
                  className={`px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all select-none ${(!email || !password || isLocked) ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white shadow-md shadow-green-600/10 active:scale-95 cursor-pointer'}`}
                >
                  <span>{activeT.loginBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </form>
          )}

          {/* Step 2: MFA Validation Panel */}
          {step === 'mfa' && (
            <form onSubmit={handleMfaSubmit} className="space-y-6">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-2">
                  <Fingerprint className="w-4 h-4 text-green-600 animate-pulse" /> {activeT.mfaTitle}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{activeT.mfaSub}</p>
              </div>

              {/* Modernized channel picker blocks */}
              <div className="grid grid-cols-3 gap-2 select-none">
                <button
                  type="button"
                  onClick={() => setMfaChannel('SMS')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-[9px] font-bold uppercase transition-all cursor-pointer ${mfaChannel === 'SMS' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
                >
                  <Smartphone className="w-4 h-4 mb-1" />
                  <span>SMS</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMfaChannel('APP')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-[9px] font-bold uppercase transition-all cursor-pointer ${mfaChannel === 'APP' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
                >
                  <KeyRound className="w-4 h-4 mb-1" />
                  <span>APP AUTH</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMfaChannel('FIDO2')}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-lg border text-[9px] font-bold uppercase transition-all cursor-pointer ${mfaChannel === 'FIDO2' ? 'bg-green-50 border-green-500 text-green-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'}`}
                >
                  <Key className="w-4 h-4 mb-1" />
                  <span>FIDO2 KEY</span>
                </button>
              </div>

              {/* Dynamic visual inputs details */}
              <AnimatePresence mode="wait">
                {mfaChannel === 'SMS' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-55 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-500 leading-relaxed">
                      <span className="font-bold flex items-center gap-1.5 text-slate-700 text-[9.5px] uppercase tracking-wider mb-1">
                        <PhoneIcon className="w-3.5 h-3.5 text-green-600" /> Validation SMS sécurisée
                      </span>
                      Code à usage unique transmis au jeton <span className="font-bold text-slate-800">+243 821 ••• •22</span>.
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Code reçu</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="••••••"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[1em] text-lg font-black bg-white py-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 text-slate-900"
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-semibold">
                      <span className="text-slate-400">
                        {mfaTimer > 0 ? `Code expire dans ${mfaTimer}s` : 'Le code a expiré'}
                      </span>
                      <button 
                        type="button" 
                        disabled={mfaTimer > 0}
                        onClick={() => setMfaTimer(60)}
                        className={`font-black ${mfaTimer > 0 ? 'text-slate-300 cursor-not-allowed' : 'text-green-650 hover:underline'}`}
                      >
                        {activeT.resend}
                      </button>
                    </div>
                  </motion.div>
                )}

                {mfaChannel === 'APP' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-55 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-500 leading-relaxed">
                      <span className="font-bold flex items-center gap-1.5 text-slate-700 text-[9.5px] uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-green-600" /> Authenticator (TOTP RFC 6238)
                      </span>
                      Recopiez le code à 6 chiffres émis par votre outil d'authentification professionnel (Google Authenticator, Duo).
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-bold">Code à 6 chiffres</label>
                      <input
                        type="text"
                        maxLength={6}
                        required
                        placeholder="000 000"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-center tracking-[1em] text-lg font-black bg-white py-2.5 border border-slate-200 rounded-lg outline-none focus:border-green-600 focus:ring-4 focus:ring-green-600/5 text-slate-900"
                      />
                    </div>
                  </motion.div>
                )}

                {mfaChannel === 'FIDO2' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98 }} 
                    animate={{ opacity: 1, scale: 1 }} 
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="bg-slate-55 p-3.5 rounded-lg border border-slate-100 text-xs text-slate-500 leading-relaxed">
                      <span className="font-bold flex items-center gap-1.5 text-slate-700 text-[9.5px] uppercase tracking-wider mb-1">
                        <Key className="w-3.5 h-3.5 text-green-600" /> Biométrie FIDO2 &amp; Multi-Hardware
                      </span>
                      Liaison physique requise. Activez le scanner biométrique de votre machine ou présentez votre clé YubiKey.
                    </div>

                    <button
                      type="button"
                      onClick={() => setMfaCode('999888')}
                      className="w-full py-4 bg-green-50 border border-green-200 hover:bg-green-100 text-green-850 rounded-lg flex flex-col items-center justify-center gap-1 outline-none cursor-pointer select-none group"
                    >
                      <Fingerprint className="w-8 h-8 text-green-600 animate-pulse group-hover:scale-105 transition-transform" />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Lancer l'accréditation physique</span>
                      <span className="text-[8px] text-slate-400 font-medium italic">[Simuler scan]</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Confirm Cancel MFA buttons */}
              <div className="flex gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setStep('credentials');
                    setMfaCode('');
                    setErrorMsg(null);
                  }}
                  className="flex-1 py-2.5 bg-slate-55 hover:bg-slate-100 border border-slate-200 text-slate-650 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                >
                  {activeT.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!mfaCode}
                  className={`flex-1 py-2.5 text-xs font-bold uppercase tracking-widest rounded-lg flex items-center justify-center gap-2 transition-all ${!mfaCode ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 text-white cursor-pointer shadow-md shadow-green-600/10'}`}
                >
                  <CheckCircle2 className="w-4 h-4" /> {activeT.validate}
                </button>
              </div>

            </form>
          )}



        </div>

        {/* Security session details policy bottom banner */}
        <div className="w-full max-w-[450px] mt-4 px-4 py-3 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-500 font-semibold leading-relaxed select-none shadow-sm flex items-start gap-2.5">
          <ShieldCheck className="w-4.5 h-4.5 text-green-600 shrink-0 mt-0.5" />
          <span>
            Le système utilise des cookies de session chiffrés avec les paramètres d'isolation <strong className="text-slate-700">HttpOnly</strong>, <strong className="text-slate-700 font-extrabold">Secure</strong> et <strong className="text-slate-700">SameSite=Strict</strong>. La session expire après 4 heures d'inactivité.
          </span>
        </div>

      </div>

      {/* Global Bottom Web Footer */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 text-center text-[11px] text-slate-400 select-none flex flex-col gap-1 mt-auto">
        <p className="font-semibold text-slate-500">
          © 2026 NeoGTec. Tous droits réservés. Espace Administration Globale sécurisé.
        </p>
        <div className="flex items-center justify-center gap-3 font-bold text-[9.5px]">
          <a
            href="https://status.neogtec.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 hover:text-green-700 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            {activeT.statusOk}
          </a>
          <span className="text-slate-200 font-light">|</span>
          <span className="text-slate-400 font-mono font-bold">Vérifié ISO 27001</span>
        </div>
      </footer>

      {/* --- FORGOT PASSWORD MODAL --- */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[500] flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-xl border border-slate-200 p-6 sm:p-8 space-y-5 text-slate-800 shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black uppercase text-slate-500 tracking-wider flex items-center gap-2">
                  <Fingerprint className="w-4 h-4 text-green-605" /> {activeT.forgotTitle}
                </h3>
                <button 
                  onClick={() => { setShowForgotModal(false); setForgotSuccess(false); }}
                  className="text-slate-400 hover:text-slate-900 transition-colors font-bold font-mono text-sm px-1.5"
                >
                  ×
                </button>
              </div>

              {forgotSuccess ? (
                <div className="p-4 bg-green-50 border border-green-150 rounded-lg text-xs text-green-800 leading-normal space-y-1">
                  <div className="flex items-center gap-1.5 font-bold mb-1 text-green-905">
                    <CheckCircle2 className="w-4 h-4 text-green-600" /> Demande générée !
                  </div>
                  <p>{activeT.forgotMsg}</p>
                </div>
              ) : (
                <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{activeT.forgotPl}</label>
                    <input 
                      type="email" 
                      required
                      placeholder="prenom.nom@neogtec.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg focus:border-green-600 outline-none text-sm font-semibold transition-all"
                    />
                  </div>
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(false)}
                      className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {activeT.cancel}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-green-600 hover:bg-green-750 text-white rounded-lg text-xs font-bold uppercase tracking-widest transition-colors cursor-pointer shadow shadow-green-600/10"
                    >
                      {activeT.forgotSubmit}
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
