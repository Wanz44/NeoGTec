/**
 * 📄 Fichier : /src/App.tsx
 * 🎯 Objectif : Point d'entrée orchestrateur de la plateforme AssurAdvancé.
 * 🔗 Liens : Gère l'état global des modules, la navigation et le rendu des composants Dashboard, Sidebar, Operational.
 * 📅 Version : 1.1.0 | Interface Windows 11 Orange
 */

import React from 'react'; // Bibliothèque cœur de l'UI | 🔗 Fichier lié: package.json
import { motion, AnimatePresence } from 'motion/react'; // Gestion des animations fluides et transitions de routes | 🔗 Fichier lié: package.json
import { 
  Search, // Icône pour la recherche globale | 🔗 Module: lucide-react
  Bell, // Icône pour le centre de notifications | 🔗 Module: lucide-react
  HelpCircle, // Icône pour l'accès FAQ | 🔗 Module: lucide-react
  Info, // Icône d'information système | 🔗 Module: lucide-react
  ChevronDown, // Indication visuelle de déploiement | 🔗 Module: lucide-react
  ExternalLink, // Lien vers documentation externe | 🔗 Module: lucide-react
  Globe, // Icône pour le sélecteur de langue | 🔗 Module: lucide-react
  X,
} from 'lucide-react'; // Pack d'icônes standardisé | 🔗 Fichier lié: constants.ts
import { cn } from './lib/utils'; // Utilitaire de concaténation de classes Tailwind | 🔗 Fichier lié: /src/lib/utils.ts
import { Sidebar } from './components/Sidebar'; // Composant de navigation latérale | 🔗 Fichier lié: /src/components/Sidebar.tsx
import { Dashboard } from './components/Dashboard'; // Vue principale des métriques | 🔗 Fichier lié: /src/components/Dashboard.tsx
import { Governance } from './components/Governance'; // Module SaaS & Multi-tenancy | 🔗 Fichier lié: /src/components/Governance.tsx
import { Alerts } from './components/Alerts';
import { Claims } from './components/Claims';
import { Consumptions } from './components/Consumptions';
import { Analytics } from './components/Analytics';
import { Reclamation } from './components/Reclamation';
import { Payment } from './components/Payment';
import { CRM } from './components/CRM';
import { Telemedicine } from './components/Telemedicine';
import { BI } from './components/BI';
import { Integrations } from './components/Integrations';
import { Admin } from './components/Admin';
import { UsersView } from './components/Users';
import { Contracts } from './components/Contracts';
import { Partners } from './components/Partners';
import { Settings } from './components/Settings';
import { SystemConfig } from './components/SystemConfig';
import { SaasTenants } from './components/SaaSTenants';
import { TeamPermissions } from './components/TeamPermissions';
import { useLanguage } from './lib/LanguageContext';
import { Login } from './components/Login';
import { UserProfilePanel } from './components/users/UserProfilePanel';
import { HelpSystem } from './components/HelpSystem';
import { NotificationCenter } from './components/NotificationCenter';
import { Sparkles, ArrowRight, Check } from 'lucide-react';

import { useApp } from './lib/AppContext';

// Sous-composant pour la section d'aide dynamique (FAQ)
const FAQSection = () => {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-green-50/20 rounded-fluent border border-dashed border-green-200">
      <h3 className="text-xl font-bold text-green-950 mb-2">{t('app.help')} &amp; FAQ</h3>
      <p className="text-green-950/50 max-w-sm">{t('app.no_notifications', 'Le centre d\'aide est actuellement vide.')}</p>
    </div>
  );
};

// Sous-composant SearchInput : Recherche avancée polices et dossiers
const SearchInput = () => {
  const { t } = useLanguage();
  return (
    <div className="relative group flex-1 max-w-xl">
      <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-green-600 group-focus-within:text-green-700 transition-colors stroke-[2.5px]" />
      <input 
        type="text" 
        placeholder={t('app.search_placeholder')} 
        className="w-full pl-12 pr-4 py-3 bg-white/40 backdrop-blur-sm border border-green-200/30 rounded-sm focus:ring-4 focus:ring-green-500/10 focus:border-green-500 outline-none transition-all placeholder:text-green-950/20 text-green-950 font-medium"
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
        <span className="px-1.5 py-0.5 rounded border border-green-200 text-[10px] font-bold text-green-500 bg-white/80">⌘</span>
        <span className="px-1.5 py-0.5 rounded border border-green-200 text-[10px] font-bold text-green-500 bg-white/80">K</span>
      </div>
    </div>
  );
};

// Composant racine de l'application
export default function App() {
  const { language, setLanguage, t } = useLanguage();
  const { 
    currentUser, 
    setCurrentUser, 
    activeModule, 
    setActiveModule, 
    countryEntity, 
    setCountryEntity, 
    quickSwitchRole,
    logAction
  } = useApp();

  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [showFAQ, setShowFAQ] = React.useState(false); // Hook d'état : Affichage FAQ | 🔗 Déclencheur: Header Button
  const [globalToast, setGlobalToast] = React.useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  
  // Advanced support systems and active notification router states
  const [showHelpPanel, setShowHelpPanel] = React.useState(false);
  const [showNotificationsPanel, setShowNotificationsPanel] = React.useState(false);
  const [guidedTourStep, setGuidedTourStep] = React.useState<number | null>(null);

  const TOUR_STEPS = [
    {
      id: "tour-1",
      title: "🧭 Menu Réseau (Sidebar)",
      description: "Explorez les modules opérationnels de NeoGTec : Administration, Sinistres, Contrats, Comptabilité, Tiers Payant, Télémédecine et Analytics."
    },
    {
      id: "tour-2",
      title: "🌍 Sélecteur National Multi-dévises",
      description: "Commutez le flux de travail vers un autre pays (RDC, France, Angola) pour appliquer instantanément les devises et taux d'échange régionaux (CDF, EUR, AOA)."
    },
    {
      id: "tour-3",
      title: "🔔 Piste d'Alertes et Notifications",
      description: "Consultez la santé générale de la base de données CPU, validez les pré-autorisations financières urgentes ou examinez les audits."
    },
    {
      id: "tour-4",
      title: "🕹️ Assistance Active Google Support",
      description: "Cliquez sur l'option d'Aide à tout moment pour lire les bases de connaissances interactives, simuler un bot WhatsApp, ou créer un ticket."
    }
  ];

  if (!isLoggedIn) {
    return (
      <Login 
        onLoginSuccess={(user) => {
          setIsLoggedIn(true);
          setCurrentUser({
            ...currentUser,
            email: user.email,
            name: user.name,
            role: user.role as any
          });
          logAction('CONNEXION_ESPACE_ADMIN', `Administrateur ${user.name} connecté via le portail d'authentification double-facteur.`);
        }} 
      />
    );
  }

  const handleSwitchEntity = (entity: string, currency: string) => {
    let rate = '1 USD = 2800 CDF';
    if (entity === 'FR') rate = '1 USD = 0.92 EUR';
    else if (entity === 'COG') rate = '1 USD = 605 XAF';
    else if (entity === 'AOL') rate = '1 USD = 830 AOA';

    setCountryEntity(entity);
    setGlobalToast(`Filiale ${entity} activée. Taux de change de référence appliqué : ${rate}`);
    logAction('CHANGEMENT_FILIALE', `Commutation de filiale vers l'entité ${entity}. Taux de change de référence appliqué : ${rate}`);
    setTimeout(() => {
      setGlobalToast(null);
    }, 4500);
  };

  // Logique de routage interne simplifiée pour le rendu des modules
  const renderContent = () => {
    if (showFAQ) return <FAQSection />; // Priorité d'affichage à la FAQ si activée
    
    switch (activeModule) {
      case 'dashboard': return <Dashboard />; // Vue par défaut | 🔗 Fichier lié: Dashboard.tsx
      case 'users-mgmt':
      case 'users-list':
      case 'users-security':
      case 'users-logs':
      case 'users-digital':
      case 'users-selfcare':
      case 'users-card':
      case 'users-beneficiaries':
        return <UsersView subModule={activeModule} />;
      case 'governance': return <Governance />; // Module 1 | 🔗 Fichier lié: Governance.tsx
      case 'saas-tenants': return <SaasTenants />;
      case 'team-permissions': return <TeamPermissions />;
      case 'alerts': return <Alerts />;
      case 'contracts':
      case 'contracts-config':
      case 'contracts-offers':
      case 'contracts-list':
        return <Contracts subModule={activeModule} />;
      case 'claims':
      case 'claims-declaration':
      case 'claims-litigation':
      case 'claims-workflow':
      case 'claims-expertise':
      case 'claims-preauth':
      case 'claims-list':
        return <Claims subModule={activeModule} />;
      case 'consumption-list':
        return <Consumptions />;
      case 'managers-list':
        return <Analytics />;
      case 'reclamation':
      case 'reclamation-submit':
      case 'reclamation-followup':
      case 'reclamation-dashboard':
      case 'reclamation-trace':
        return <Reclamation subModule={activeModule} />;
      case 'payment': 
      case 'billing-contributions':
      case 'billing-mobile-money':
      case 'billing-reconciliation':
      case 'billing-tax':
        return <Payment subModule={activeModule} />;
      case 'crm':
      case 'crm-marketing':
      case 'crm-performance':
      case 'crm-faq':
      case 'crm-global-perf':
      case 'crm-leads':
        return <CRM subModule={activeModule} />;
      case 'telemedicine':
      case 'tele-consultation':
      case 'tele-medical-records':
      case 'tele-prescription':
      case 'tele-history':
        return <Telemedicine subModule={activeModule} />;
      case 'bi':
      case 'bi-global':
      case 'bi-fraud':
      case 'bi-performance':
      case 'bi-forecasting':
        return <BI subModule={activeModule} />;
      case 'integrations':
        return <Integrations />;
      case 'partners':
      case 'partners-directory':
      case 'partners-contracting':
      case 'partners-portal':
      case 'partners-quality':
      case 'partners-tariffs':
        return <Partners subModule={activeModule} />;
      case 'admin': return <Admin />;
      case 'system-config': return <SystemConfig />;
      case 'profile': return <UserProfilePanel />;
      case 'settings':
        return <Settings onModuleChange={setActiveModule} />;
      default: return ( // Fallback pour les modules non encore implémentés (Placeholders)
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
            <Info className="w-10 h-10 text-green-500/40" />
          </div>
          <h3 className="text-xl font-bold text-green-950 mb-2">Module en Développement</h3>
          <p className="text-green-950/50 max-w-sm">
            Le module <span className="font-bold text-green-600">"{activeModule}"</span> est en cours de déploiement sécurisé sur l'architecture multi-tenancy.
          </p>
          <button className="mt-8 flex items-center gap-2 text-sm font-bold text-green-600 hover:underline">
            Voir la documentation technique <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen bg-brand-beige text-slate-900 font-sans selection:bg-green-500 selection:text-white overflow-hidden relative p-4 gap-4">
      {/* Floating country change notification toast */}
      <AnimatePresence>
        {globalToast && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-6 right-6 z-[250] max-w-sm bg-slate-950 text-white rounded-2xl p-4 shadow-2xl border border-white/10 flex items-start gap-3"
          >
            <div className="p-2 bg-indigo-500 rounded-xl text-white shrink-0">
              <Globe className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-indigo-300">Entité Nationale &amp; Devises</p>
              <p className="text-xs text-slate-350 font-bold mt-1 leading-relaxed">{globalToast}</p>
            </div>
            <button onClick={() => setGlobalToast(null)} className="text-slate-550 hover:text-white transition-colors p-1">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic background accents for Fluent Design 2 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-green-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] right-[-10%] w-[40%] h-[40%] bg-white/40 blur-[100px] rounded-full" />
      </div>

      <Sidebar activeModule={activeModule} onModuleChange={(id) => { setActiveModule(id); setShowFAQ(false); }} />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10 rounded-2xl bg-white border border-white/40 shadow-xl">
        {/* Fluent Header (Acrylic) */}
        <header className="h-16 px-8 flex items-center justify-between bg-white/90 backdrop-blur-md border-b border-green-100/50 sticky top-0 z-50">
          <SearchInput />
          
          <div className="flex items-center gap-3">
            {/* Elegant Country Subsidiary Selector & Currency Converter (I1, I2) */}
            <div className="relative group z-50">
              <button className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 border border-slate-900 text-white rounded-sm text-xs font-black uppercase tracking-wider transition-all active:scale-95 outline-none cursor-pointer">
                <span>🌍 {countryEntity === 'RDC' ? '🇨🇩 RDC (CDF/USD)' : countryEntity === 'FR' ? '🇫🇷 France (EUR)' : countryEntity === 'AOL' ? '🇦🇴 Angola (AOA)' : '🇨🇬 Congo (XAF)'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-white/50" />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-56 bg-white rounded-md p-1.5 shadow-2xl opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 z-[100] border border-slate-150 flex flex-col gap-1 text-slate-700">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block px-2 py-1 border-b">Filiales &amp; Multi-devises (I1, I2)</span>
                
                <button 
                  onClick={() => handleSwitchEntity('RDC', 'CDF/USD')}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none",
                    countryEntity === 'RDC' ? "bg-indigo-600 text-white" : "hover:bg-slate-50"
                  )}
                >
                  <span>🇨🇩 Congo-Kinshasa (RDC)</span>
                  <span className="text-[8px] font-mono opacity-85">1 USD = 2800 CDF</span>
                </button>
                
                <button 
                  onClick={() => handleSwitchEntity('FR', 'EUR')}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none",
                    countryEntity === 'FR' ? "bg-indigo-600 text-white" : "hover:bg-slate-50"
                  )}
                >
                  <span>🇫🇷 France (EUR)</span>
                  <span className="text-[8px] font-mono opacity-85">1 USD = 0.92 EUR</span>
                </button>

                <button 
                  onClick={() => handleSwitchEntity('COG', 'XAF')}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none",
                    countryEntity === 'COG' ? "bg-indigo-600 text-white" : "hover:bg-slate-50"
                  )}
                >
                  <span>🇨🇬 Congo-Brazzaville</span>
                  <span className="text-[8px] font-mono opacity-85">1 USD = 605 XAF</span>
                </button>

                <button 
                  onClick={() => handleSwitchEntity('AOL', 'AOA')}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none",
                    countryEntity === 'AOL' ? "bg-indigo-600 text-white" : "hover:bg-slate-50"
                  )}
                >
                  <span>🇦🇴 Angola (AOA)</span>
                  <span className="text-[8px] font-mono opacity-85">1 USD = 830 AOA</span>
                </button>
              </div>
            </div>

            {/* Elegant Language Selector */}
            <div className="relative group z-50">
              <button className="flex items-center gap-2 px-3 py-2 bg-white/50 rounded-sm border border-white/20 text-green-900 hover:bg-white/85 transition-all font-bold text-xs cursor-pointer outline-none active:scale-95">
                <Globe className="w-4 h-4 text-green-600 shrink-0" />
                <span className="hidden sm:inline">
                  {language === 'fr' ? '🇫🇷 FR' : language === 'en' ? '🇬🇧 EN' : '🇵🇹 PT'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-180 transition-transform duration-300" />
              </button>
              
              {/* Dropdown Items */}
              <div className="absolute top-full right-0 mt-2 w-36 bg-white rounded-md p-1.5 shadow-2xl opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 z-50 border border-slate-100 flex flex-col gap-1">
                <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-2 py-1 border-b border-slate-50 mb-1">
                  {t('app.language', 'Langue')}
                </h4>
                <button 
                  onClick={() => setLanguage('fr')}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer outline-none",
                    language === 'fr' ? "bg-green-600 text-white" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span>🇫🇷</span> Français
                </button>
                <button 
                  onClick={() => setLanguage('en')}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer outline-none",
                    language === 'en' ? "bg-green-600 text-white" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span>🇬🇧</span> English
                </button>
                <button 
                  onClick={() => setLanguage('pt')}
                  className={cn(
                    "w-full text-left px-2 py-1.5 rounded-sm text-xs font-bold transition-all flex items-center gap-2 cursor-pointer outline-none",
                    language === 'pt' ? "bg-green-600 text-white" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span>🇵🇹</span> Português
                </button>
              </div>
            </div>

            <button 
              onClick={() => {
                setShowHelpPanel(true);
                logAction('OUVERTURE_PANNEAU_AIDE', 'Ouverture du support client intégré niveau Google depuis le header.', 'SUCCESS');
              }}
              className="p-2 rounded-sm transition-all border outline-none font-medium text-sm flex items-center gap-2 bg-white/50 text-green-950 hover:bg-white/80 active:scale-95 cursor-pointer border-white/20 relative"
            >
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">{t('app.help')}</span>
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 border border-white rounded-full animate-bounce" />
            </button>

            <button 
              onClick={() => {
                setShowNotificationsPanel(true);
                logAction('OUVERTURE_CENTRE_NOTIFICATIONS', 'Accès des alertes réseau NeoGTec.', 'SUCCESS');
              }}
              className="p-2 bg-white/50 rounded-sm border border-white/20 text-green-900/60 hover:bg-white/80 transition-all relative outline-none active:scale-95 cursor-pointer"
            >
              <Bell className="w-4 h-4 text-indigo-600" />
              <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-red-600 text-[8px] font-black text-white border border-white shadow-md">
                3
              </span>
            </button>

            <div className="w-px h-6 bg-green-200/20 mx-1" />

            {/* Profile Dropdown with Session Controls */}
            <div className="relative group z-50">
              <button 
                onClick={() => {
                  setShowProfileModal(true);
                  logAction('ACCES_PROFIL_UTILISATEUR', 'Ouverture du panneau centralisé du profil utilisateur (RGPD / CNIL).', 'SUCCESS');
                }}
                className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-full border border-slate-200/60 transition-all cursor-pointer outline-none md:pr-2.5"
              >
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black bg-gradient-to-tr from-green-500 to-emerald-500 text-white shadow-md uppercase">
                  {currentUser?.name.substring(0, 2)}
                </div>
                <div className="hidden xl:flex flex-col text-left">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-800 leading-tight">{currentUser?.name}</span>
                  <span className="text-[8.5px] font-mono text-slate-400 leading-none">{currentUser?.role}</span>
                </div>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-md p-2 shadow-2xl opacity-0 scale-95 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:translate-y-0 transition-all duration-200 z-[100] border border-slate-150 flex flex-col gap-1">
                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block px-2 py-1 border-b">Session Active &amp; Métier</span>
                
                <div className="px-2 py-2 text-slate-700">
                  <p className="text-xs font-black text-slate-900">{currentUser?.name}</p>
                  <p className="text-[9.5px] text-slate-400 truncate mt-0.5">{currentUser?.email}</p>
                  <span className="mt-1.5 inline-block px-1.5 py-0.5 rounded bg-green-500/10 border border-green-500/20 text-[8px] font-black uppercase text-green-700">
                    {currentUser?.role}
                  </span>
                </div>
                
                <button 
                  onClick={() => {
                    setShowProfileModal(true);
                  }}
                  className="mx-1 px-2 py-1.5 rounded-lg text-xs font-black text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200/65 transition-all flex items-center justify-between cursor-pointer outline-none"
                >
                  <span>👤 Mon profil</span>
                  <span className="text-[8.5px] font-mono text-indigo-500 font-bold">CNIL-RGPD</span>
                </button>
                
                <div className="border-t border-slate-100 my-1"></div>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider block px-2">Tester un autre Rôle :</span>
                
                <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto px-1 py-1 bg-slate-50 rounded">
                  {[
                    { id: 'SUPER_ADMIN', label: '👑 Super Admin' },
                    { id: 'GESTIONNAIRE_SINISTRES', label: '🩺 Médecin Conseil' },
                    { id: 'GESTIONNAIRE_FINANCE', label: '📊 Comptable / Finance' },
                    { id: 'AUDITEUR_EXTERNE', label: '🔎 Auditeur Externe' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => quickSwitchRole(r.id as any)}
                      className={cn(
                        "w-full text-left px-2 py-1 text-[10px] font-bold rounded transition-all cursor-pointer outline-none",
                        currentUser?.role === r.id ? "bg-green-600 text-white" : "text-slate-600 hover:bg-slate-100"
                      )}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 my-1"></div>
                
                <button 
                  onClick={() => {
                    setIsLoggedIn(false);
                    setActiveModule('dashboard');
                  }}
                  className="w-full text-left px-2 py-1.5 rounded text-xs font-black text-rose-600 hover:bg-rose-50 transition-all flex items-center justify-between cursor-pointer outline-none"
                >
                  <span>🚪 Se déconnecter</span>
                  <span className="text-[8.1px] font-mono text-rose-400 uppercase tracking-wider">Cookie Clear</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-8 custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={showFAQ ? 'faq' : activeModule}
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.02, y: -10 }}
              transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Profile Compliance Overlay Window */}
      <AnimatePresence>
        {showProfileModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-[1000] flex items-center justify-center p-4">
            {/* Click blocking overlay: Clicking here will NOT close the window */}
            <div className="absolute inset-0 cursor-default" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative bg-slate-50 w-full max-w-6xl rounded-[2rem] shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] z-10"
            >
              <div className="bg-white border-b border-slate-150 px-8 py-4 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase text-indigo-600 tracking-wider font-mono">Coffre-fort d'audit RGPD activé</span>
                </div>
                
                <button 
                  id="profile-modal-close-btn"
                  onClick={() => {
                    setShowProfileModal(false);
                    logAction('FERMETURE_PROFIL_ADMIN', 'Fermeture manuelle sécurisée du profil admin.');
                  }}
                  className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black uppercase transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <X className="w-4 h-4" /> Fermer
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                <UserProfilePanel onClose={() => {
                  setShowProfileModal(false);
                  logAction('FERMETURE_PROFIL_ADMIN', 'Fermeture manuelle sécurisée du profil admin.');
                }} />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Help Badge Intercom-like Widget at the bottom-right of all page views */}
      <div className="fixed bottom-6 right-6 z-[180]">
        <button
          onClick={() => {
            setShowHelpPanel(true);
            logAction('CLIC_WIDGET_FLOAT_AIDE', 'Clic sur le Widget flottant d\'assistance en bas à droite.', 'SUCCESS');
          }}
          className="w-14 h-14 bg-gradient-to-tr from-green-600 to-emerald-700 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all duration-200 outline-none cursor-pointer group border-2 border-white/25 relative"
          title="Besoin d'aide ? (Google Support)"
        >
          <HelpCircle className="w-6 h-6 shrink-0 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-600 text-[9px] font-black text-white border border-white animate-bounce shadow">
            !
          </span>
        </button>
      </div>

      {/* Embedded Help system right drawers (Intercom style) */}
      <HelpSystem 
        activeModule={activeModule}
        onModuleChange={(mod) => {
          setActiveModule(mod);
          logAction('REDIRECTION_MODULE_AIDE', `Navigation vers le module ${mod} depuis le centre d'assistance.`, 'SUCCESS');
        }}
        isOpen={showHelpPanel}
        onClose={() => setShowHelpPanel(false)}
        onStartTour={() => setGuidedTourStep(0)}
        logAction={logAction}
      />

      {/* Embedded active Notification router right drawers (NeoGTec nerve style) */}
      <NotificationCenter 
        isOpen={showNotificationsPanel}
        onClose={() => setShowNotificationsPanel(false)}
        onModuleChange={(mod) => {
          setActiveModule(mod);
          logAction('REDIRECTION_MODULE_NOTIF', `Navigation vers le module ${mod} depuis les alertes réseau.`, 'SUCCESS');
        }}
        logAction={logAction}
      />

      {/* ======================================= */}
      {/* GUIDED ONBOARDING TOUR OVERLAY WINDOW    */}
      {/* ======================================= */}
      <AnimatePresence>
        {guidedTourStep !== null && (
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-[2000] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white rounded-3xl w-full max-w-sm p-6 space-y-4 text-slate-850 shadow-2xl border border-indigo-200"
            >
              <div className="flex justify-between items-center border-b pb-3 text-slate-950 font-black uppercase text-xs font-mono">
                <span className="flex items-center gap-1.5 text-indigo-600">
                  <Sparkles className="w-4 h-4 text-indigo-500" /> Onboarding Assisté (Pas à Pas)
                </span>
                <span className="text-slate-400">Étape {guidedTourStep + 1} de {TOUR_STEPS.length}</span>
              </div>

              <div className="space-y-2">
                <h5 className="text-sm font-extrabold text-slate-900 leading-tight">{TOUR_STEPS[guidedTourStep].title}</h5>
                <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                  {TOUR_STEPS[guidedTourStep].description}
                </p>
              </div>

              {/* Action buttons of user guide overlay */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setGuidedTourStep(null);
                    logAction('TOUR_GUIDE_SKIP', "L'utilisateur a quitté la visite guidée d'onboarding.", 'WARNING');
                  }}
                  className="py-2 px-3 hover:bg-slate-100 text-slate-400 hover:text-slate-705 text-[10px] font-black uppercase tracking-wider rounded-lg outline-none cursor-pointer"
                >
                  Passer
                </button>

                <div className="flex gap-2">
                  {guidedTourStep > 0 && (
                    <button
                      type="button"
                      onClick={() => setGuidedTourStep(prev => prev !== null ? prev - 1 : null)}
                      className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-650 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer border"
                    >
                      Précédent
                    </button>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (guidedTourStep < TOUR_STEPS.length - 1) {
                        setGuidedTourStep(prev => prev !== null ? prev + 1 : null);
                      } else {
                        setGuidedTourStep(null);
                        logAction('TOUR_GUIDE_COMPLETE', "L'utilisateur a complété la visite guidée d'onboarding.", 'SUCCESS');
                      }
                    }}
                    className="py-2 px-4 bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer shadow-md"
                  >
                    {guidedTourStep === TOUR_STEPS.length - 1 ? "Terminer" : "Suivant"}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
