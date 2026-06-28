import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, Globe, Lock, Menu, X, ChevronDown, Sparkles, HelpCircle, 
  MapPin, Check, Lightbulb, Hospital, FileText, AlertTriangle, Play,
  Compass, BarChart3, AppWindow, ShieldAlert, Cpu, Award, BadgeAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getWording } from '../../lib/wording';
import { AFRICAN_COUNTRIES, useCurrency } from './CountrySelector';

interface HeaderProProps {
  onNavigateTo: (route: string) => void;
  onNavigateToLogin: () => void;
  currentRoute: string;
}

// typed data
const SOLUTIONS = {
  drh: {
    title: "Pour DRH",
    links: [
      { name: "Gestion des Bons (PEC)", desc: "Éligibilité digitale instantanée.", href: "/modules", icon: Compass },
      { name: "Plafond automatisé", desc: "Zéro risque de dépassements.", href: "/modules", icon: Cpu },
      { name: "App Employés", desc: "Zéro papier. Tout sur mobile.", href: "/modules", icon: AppWindow, tag: "Nouveau" },
      { name: "BI Sinistralité", desc: "Suivez chaque franc dépensé.", href: "/risques", icon: BarChart3 },
    ]
  },
  daf: {
    title: "Pour DAF",
    links: [
      { name: "Clearing sous 24h", desc: "On paie l'hôpital chaque jeudi.", href: "/solutions", icon: Hospital },
      { name: "Algorithme Anti-fraude", desc: "Bloquez 99% des abus.", href: "/risques", icon: ShieldAlert },
      { name: "Facturation Unifiée", desc: "Une seule facture consolidée.", href: "/tarifs", icon: FileText },
      { name: "ROI prouvé en 6 mois", desc: "Optimisation de votre trésorerie.", href: "/solutions", icon: Award },
    ]
  }
};

const MODULES_CORES = [
  { name: "Core Engine Tiers-Payant", desc: "Flux de courtage RDC.", tag: "Core" },
  { name: "Calculateur de Cotisations", desc: "Ajustements automatiques.", tag: "Core" },
  { name: "Éligibilité Portative", desc: "Vérification par QR code.", tag: "Nouveau" },
  { name: "Clearing h-24", desc: "Règlement direct des cliniques.", tag: "Core" },
  { name: "Contrôle d'Identité IA", desc: "Détection de fraude faciale.", tag: "Nouveau" },
  { name: "Rapport Réglementaire ARCA", desc: "Génération en un clic.", tag: "Core" }
];

const MODULES_ADD_ONS = [
  { name: "Module Télémédecine", desc: "Médecins congolais en ligne.", tag: "Add-on" },
  { name: "Portail Prestataires", desc: "Espace connecté des cliniques.", tag: "Add-on" },
  { name: "Éditeur de Formules B2B", desc: "Créez vos barèmes sur mesure.", tag: "Add-on" },
  { name: "Conciergerie Kinshasa", desc: "Assistance VIP 24h/24.", tag: "Add-on" },
  { name: "Rapatriement Sanitaire", desc: "Couverture aérienne d'urgence.", tag: "Add-on" },
  { name: "Audit Actuariel", desc: "Analyses de sinistres.", tag: "Add-on" }
];

const MODULES_BI = [
  { name: "Alertes Fraude", desc: "Notifications de suspicion.", tag: "BI" },
  { name: "Forecasting Modèles", desc: "Prévisions à 12 mois.", tag: "BI" },
  { name: "Performance Cliniques", desc: "Notation des prestataires.", tag: "BI" },
  { name: "Gouvernance Multi-filiales", desc: "Consolidation panafricaine.", tag: "BI" }
];

const RESSOURCES = [
  { name: "FAQ Clients & DRH", desc: "Toutes les réponses en 2 minutes.", icon: HelpCircle, href: "/faq" },
  { name: "Blog Vision Sante", desc: "Actualités sur la Loi n°18/035.", icon: Lightbulb, href: "/risques" },
  { name: "Rapports d'impact Gartner", desc: "Études sur la souveraineté RDC.", icon: FileText, href: "/solutions" },
  { name: "API Docs & Devs", desc: "Intégrez NeoGTec à votre ERP.", icon: Cpu, href: "/modules" },
  { name: "Centre d'Aide National", desc: "Ouvert du lundi au samedi à Gombe.", icon: MapPin, href: "/cgu" }
];

const ENTREPRISE = [
  { name: "À propos de NeoGTec", desc: "Nos valeurs et notre équipe." },
  { name: "Bureaux (12 Pays)", desc: "Présence active en Afrique." },
  { name: "Carrières (Kinshasa)", desc: "Rejoignez le leader de l'InsurTech." },
  { name: "Agrément ARCA-RDC", desc: "Licence officielle et audits." },
  { name: "Contactez Gombe", desc: "Assistance B2B dédiée." }
];

export function HeaderPro({ onNavigateTo, onNavigateToLogin, currentRoute }: HeaderProProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ng_country') || 'CD';
    }
    return 'CD';
  });
  const [language, setLanguage] = useState<'FR' | 'EN' | 'SW'>('FR');
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // 3G detection
  const [isSlowConnection, setIsSlowConnection] = useState(false);

  // Search Results keyboard navigation indexes
  const [searchKeyboardIdx, setSearchKeyboardIdx] = useState(0);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).connection) {
      const conn = (navigator as any).connection;
      if (conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.saveData) {
        setIsSlowConnection(true);
      }
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // CMD+K event listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        // Analytics
        triggerGTM('open_search', { method: 'shortcut' });
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerGTM = (eventName: string, params: Record<string, any> = {}) => {
    console.log(`GTM event: ${eventName}`, params);
    if (typeof window !== 'undefined' && (window as any).dataLayer) {
      (window as any).dataLayer.push({ event: eventName, ...params });
    }
  };

  const handleCountryChange = (code: string) => {
    setSelectedCountryCode(code);
    localStorage.setItem('ng_country', code);
    setIsCountryOpen(false);
    triggerGTM('change_country', { country: code });
  };

  const handleLangChange = (lang: 'FR' | 'EN' | 'SW') => {
    setLanguage(lang);
    setIsLangOpen(false);
    triggerGTM('change_lang', { lang });
  };

  // Safe navigation wrapper to close everything
  const navigateTo = (route: string) => {
    setActiveMenu(null);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    onNavigateTo(route);
  };

  // Filter search results
  const searchResults = useMemo(() => {
    if (!searchText) return [];
    const query = searchText.toLowerCase();
    const matches: Array<{ title: string; category: string; route: string; desc: string }> = [];

    // Search targets
    const targets = [
      { title: "Lutte anti-fraude par IA", category: "Sécurité", route: "/risques", desc: "Stopper 99% des abus de soins" },
      { title: "Climat de confiance de l'ARCA", category: "Régulation", route: "/arca-rdc", desc: "Agrément officiel ARCA n°0127" },
      { title: "Clearing h-24 en RDC", category: "Finance", route: "/solutions", desc: "Comment nous payons les cliniques le jeudi" },
      { name: "Modules Cores de Assurance Collective", category: "Produit", route: "/modules", desc: "16 modules configurables pour les DRH" },
      { title: "Données de santé souveraines Gombe", category: "Sécurité", route: "/confidentialite", desc: "Hébergement physique à Kinshasa" },
      { title: "Conditions Générales d'Usage CGU", category: "Informations", route: "/cgu", desc: "Règlement et obligations réciproques" },
      { title: "Demande d'Affiliation B2B", category: "Affiliation", route: "/affiliation", desc: "Dossier d'agrément rapide pour les DRH" }
    ];

    targets.forEach(t => {
      const parentVal = t.title || (t as any).name || "";
      if (parentVal.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query)) {
        matches.push({ title: parentVal, category: t.category, route: t.route, desc: t.desc });
      }
    });

    return matches.slice(0, 8);
  }, [searchText]);

  const currentCountry = AFRICAN_COUNTRIES.find(c => c.code === selectedCountryCode) || AFRICAN_COUNTRIES[0];

  // Pulse animation trigger on scroll index
  const shouldPulseCTA = scrollY > 600;

  // Skip link
  const skipToContent = (e: React.MouseEvent) => {
    e.preventDefault();
    const main = document.getElementById('main-content');
    if (main) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <a 
        href="#main-content" 
        onClick={skipToContent}
        className="sr-only focus:not-sr-only focus:absolute focus:top-12 focus:left-4 focus:z-[9999] bg-[#00A86B] text-white px-4 py-2 rounded font-bold text-xs"
      >
        Aller au contenu principal
      </a>

      {/* Modern sticky glassmorphism header */}
      <header 
        className={`sticky top-0 z-50 w-full select-none transition-all duration-350 border-b flex items-center justify-center ${
          scrollY > 20 
            ? 'h-16 bg-white/95 backdrop-blur-md shadow-md border-slate-200' 
            : 'h-20 bg-[#0b1320]/60 backdrop-blur-md border-white/5 text-white'
        }`}
        role="banner"
      >
        <div className="w-full max-w-7xl px-6 flex items-center justify-between h-full">
          
          {/* Logo & compliance label */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('/')} 
              className="flex items-center gap-2.5 text-left cursor-pointer pointer-events-auto shrink-0 transition-transform active:scale-95"
              aria-label="NeoGTec - Retour à l'accueil"
            >
              <svg className="w-8 h-8 text-[#00A86B] shrink-0" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 45C38.2843 45 45 38.2843 45 30C45 21.7157 38.2843 15 30 15C21.7157 15 15 21.7157 15 30C15 38.2843 21.7157 45 30 45Z" stroke="currentColor" strokeWidth="9" fill="none" />
                <path d="M70 45C78.2843 45 85 38.2843 85 30C85 21.7157 78.2843 15 70 15C61.7157 15 55 21.7157 55 30C55 38.2843 61.7157 45 70 45Z" stroke="currentColor" strokeWidth="9" fill="none" />
                <circle cx="50" cy="30" r="4.5" fill="currentColor" />
              </svg>
              <div className="leading-none select-none">
                <span className={`font-black uppercase text-sm tracking-wider block ${scrollY > 20 ? 'text-slate-900' : 'text-white'}`}>NeoGTec</span>
                <span className="text-[7.5px] font-mono text-slate-400 font-bold block mt-0.5 uppercase">A SoftwareOne Allied</span>
              </div>
            </button>
            
            <span className={`hidden xl:inline-flex items-center text-[9.5px] font-mono font-bold border rounded px-2 py-0.5 tracking-wide leading-none select-none ${
              scrollY > 20 ? 'border-[#00A86B]/30 text-[#00A86B] bg-[#00A86B]/5' : 'border-white/20 text-green-300 bg-white/5'
            }`}>
              ARCA AGRÉÉ N°0127
            </span>
          </div>

          {/* SaaS interactive center mega-menu */}
          {currentRoute !== '/affiliation' ? (
            <nav className="hidden lg:flex items-center gap-1.5" aria-label="Navigation principale">
              
              {/* Dropdown 1: Solutions */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveMenu('solutions')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  className={`h-11 px-3.5 rounded-md text-[12.5px] font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors ${
                    scrollY > 20 
                      ? 'text-slate-705 hover:bg-slate-100 hover:text-slate-900' 
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-expanded={activeMenu === 'solutions'}
                >
                  Solutions
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                <AnimatePresence>
                  {activeMenu === 'solutions' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full w-[560px] bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-xl p-6 grid grid-cols-2 gap-6 z-150"
                    >
                      <div>
                        <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-3 select-none">
                          {SOLUTIONS.drh.title}
                        </h4>
                        <div className="space-y-3.5">
                          {SOLUTIONS.drh.links.map(link => (
                            <button
                              key={link.name}
                              onClick={() => navigateTo(link.href)}
                              className="w-full text-left group flex gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-[#00A86B]/10 flex items-center justify-center shrink-0">
                                <link.icon className="w-4 h-4 text-slate-500 group-hover:text-[#00A86B]" />
                              </div>
                              <div className="leading-tight">
                                <span className="text-[12px] font-bold text-slate-800 tracking-wide block flex items-center gap-1.5">
                                  {link.name}
                                  {link.tag && <span className="bg-[#00A86B]/15 text-[#00A86B] text-[8px] font-mono px-1 rounded uppercase tracking-widest font-black leading-none">{link.tag}</span>}
                                </span>
                                <span className="text-[10.5px] text-slate-450 mt-0.5 block font-semibold">{link.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b pb-2 mb-3 select-none">
                          {SOLUTIONS.daf.title}
                        </h4>
                        <div className="space-y-3.5">
                          {SOLUTIONS.daf.links.map(link => (
                            <button
                              key={link.name}
                              onClick={() => navigateTo(link.href)}
                              className="w-full text-left group flex gap-3 p-1.5 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                            >
                              <div className="w-8 h-8 rounded-md bg-slate-100 group-hover:bg-[#00A86B]/10 flex items-center justify-center shrink-0">
                                <link.icon className="w-4 h-4 text-slate-500 group-hover:text-[#00A86B]" />
                              </div>
                              <div className="leading-tight">
                                <span className="text-[12px] font-bold text-slate-800 tracking-wide block">{link.name}</span>
                                <span className="text-[10.5px] text-slate-450 mt-0.5 block font-semibold">{link.desc}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="col-span-2 pt-4 border-t flex justify-between items-center bg-slate-50 -mx-6 -mb-6 p-4 rounded-b-xl select-none">
                        <span className="text-[11px] text-slate-500 font-semibold italic">Agréé conformément au Code des Assurances RDC.</span>
                        <button 
                          onClick={() => navigateTo('/solutions')}
                          className="text-[11px] font-bold text-[#00A86B] hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Voir toutes les solutions →
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 2: Modules */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveMenu('modules')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  className={`h-11 px-3.5 rounded-md text-[12.5px] font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors ${
                    scrollY > 20 
                      ? 'text-slate-705 hover:bg-slate-100 hover:text-slate-900' 
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-expanded={activeMenu === 'modules'}
                >
                  Modules
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                <AnimatePresence>
                  {activeMenu === 'modules' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full w-[720px] bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-xl p-6 grid grid-cols-3 gap-6 z-150"
                    >
                      {/* Core Modules */}
                      <div>
                        <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b pb-1.5 mb-2.5">
                          Coeur Système ({MODULES_CORES.length})
                        </h4>
                        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                          {MODULES_CORES.map(m => (
                            <button 
                              key={m.name}
                              onClick={() => navigateTo('/modules')}
                              className="w-full text-left p-1.5 hover:bg-slate-50 rounded transition-colors block cursor-pointer"
                            >
                              <span className="text-[11.5px] font-bold text-slate-800 tracking-wide block flex items-center gap-1.5">
                                {m.name}
                                {m.tag === 'Nouveau' && <span className="bg-[#00A86B]/15 text-[#00A86B] text-[7.5px] font-mono font-black px-1 rounded uppercase tracking-widest">NEW</span>}
                              </span>
                              {!isSlowConnection && <span className="text-[10px] text-slate-450 mt-0.5 block leading-none font-semibold">{m.desc}</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Add-ons */}
                      <div>
                        <h4 className="text-[10px] font-mono font-black text-[#00A86B] uppercase tracking-widest border-b pb-1.5 mb-2.5">
                          Extensions ({MODULES_ADD_ONS.length})
                        </h4>
                        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                          {MODULES_ADD_ONS.map(m => (
                            <button 
                              key={m.name}
                              onClick={() => navigateTo('/modules')}
                              className="w-full text-left p-1.5 hover:bg-slate-50 rounded transition-colors block cursor-pointer"
                            >
                              <span className="text-[11.5px] font-bold text-slate-800 tracking-wide block flex items-center gap-1.5">{m.name}</span>
                              {!isSlowConnection && <span className="text-[10px] text-slate-450 mt-0.5 block leading-none font-semibold">{m.desc}</span>}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* BI modules */}
                      <div>
                        <h4 className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest border-b pb-1.5 mb-2.5">
                          Analytiques ({MODULES_BI.length})
                        </h4>
                        <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1">
                          {MODULES_BI.map(m => (
                            <button 
                              key={m.name}
                              onClick={() => navigateTo('/modules')}
                              className="w-full text-left p-1.5 hover:bg-slate-50 rounded transition-colors block cursor-pointer"
                            >
                              <span className="text-[11.5px] font-bold text-slate-800 tracking-wide block flex items-center gap-1.5">{m.name}</span>
                              {!isSlowConnection && <span className="text-[10px] text-slate-450 mt-0.5 block leading-none font-semibold">{m.desc}</span>}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Dropdown 3: Ressources */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveMenu('ressources')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  className={`h-11 px-3.5 rounded-md text-[12.5px] font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors ${
                    scrollY > 20 
                      ? 'text-slate-705 hover:bg-slate-100 hover:text-slate-900' 
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-expanded={activeMenu === 'ressources'}
                >
                  Ressources
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                <AnimatePresence>
                  {activeMenu === 'ressources' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-1/2 -translate-x-1/2 top-full w-72 bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-xl p-4 z-150"
                    >
                      <div className="space-y-2">
                        {RESSOURCES.map(res => (
                          <button
                            key={res.name}
                            onClick={() => navigateTo(res.href)}
                            className="w-full text-left group flex gap-3 p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <res.icon className="w-4 h-4 text-slate-400 group-hover:text-[#00A86B] shrink-0 mt-0.5" />
                            <div>
                              <span className="text-xs font-bold text-slate-800 block group-hover:text-slate-900">{res.name}</span>
                              <span className="text-[10px] text-slate-450 block leading-tight font-semibold">{res.desc}</span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Link 4: Tarifs */}
              <button 
                onClick={() => navigateTo('/tarifs')}
                className={`h-11 px-3.5 rounded-md text-[12.5px] font-bold tracking-wide transition-colors cursor-pointer outline-none ${
                  currentRoute === '/tarifs' 
                    ? 'border-b-2 border-[#00A86B] text-[#00A86B]' 
                    : scrollY > 20 
                      ? 'text-slate-705 hover:bg-slate-100 hover:text-slate-900 shadow-none' 
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                }`}
              >
                Tarifs
              </button>

              {/* Dropdown 5: Entreprise */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveMenu('entreprise')}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button 
                  className={`h-11 px-3.5 rounded-md text-[12.5px] font-bold tracking-wide flex items-center gap-1 cursor-pointer transition-colors ${
                    scrollY > 20 
                      ? 'text-slate-705 hover:bg-slate-100 hover:text-slate-900' 
                      : 'text-slate-200 hover:bg-white/5 hover:text-white'
                  }`}
                  aria-expanded={activeMenu === 'entreprise'}
                >
                  Entreprise
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                <AnimatePresence>
                  {activeMenu === 'entreprise' && (
                    <motion.div 
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full w-[260px] bg-white text-slate-900 border border-slate-200 shadow-2xl rounded-xl p-3 z-150"
                    >
                      {ENTREPRISE.map(item => (
                        <button
                          key={item.name}
                          onClick={() => {
                            if (item.name.includes("Données") || item.name.includes("Confidentialité") || item.name.includes("ARCA")) {
                              navigateTo('/confidentialite');
                            } else {
                              navigateTo('/solutions');
                            }
                          }}
                          className="w-full text-left p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer block"
                        >
                          <span className="text-xs font-bold text-slate-800 block">{item.name}</span>
                          <span className="text-[10px] text-slate-400 block leading-none font-semibold mt-0.5">{item.desc}</span>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-1 text-[11px] font-mono text-slate-400">
              📞 Service client dédié : <strong className="ml-1 text-[#00A86B]">+243 812 000 127</strong>
            </div>
          )}

          {/* Right Context Actions */}
          <div className="flex items-center gap-2">

            {/* A. Search button (CMD+K style trigger) */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                triggerGTM('open_search', { method: 'click_header' });
              }}
              className={`h-10 px-3 border border-dashed rounded-[6px] text-xs font-semibold uppercase flex items-center justify-between transition-all select-none cursor-pointer outline-none ${
                currentRoute === '/' && scrollY <= 20
                  ? 'border-white/20 hover:border-white hover:bg-white/5 text-white/80 w-52 hidden md:flex'
                  : 'border-slate-300 hover:border-slate-500 hover:bg-slate-50 text-slate-600 w-52 hidden md:flex'
              }`}
            >
              <span className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 opacity-70" />
                <span>Rechercher...</span>
              </span>
              <kbd className={`text-[9px] font-mono border rounded px-1 min-w-4 flex items-center justify-center ${
                currentRoute === '/' && scrollY <= 20 ? 'bg-white/10 border-white/20' : 'bg-slate-100 border-slate-200'
              }`}>⌘K</kbd>
            </button>

            {/* Mobile query triggers only icon */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                triggerGTM('open_search', { method: 'click_header_mobile' });
              }}
              className={`h-10 w-10 border border-dashed rounded-[6px] flex items-center justify-center transition-all select-none cursor-pointer outline-none md:hidden ${
                currentRoute === '/' && scrollY <= 20
                  ? 'border-white/20 hover:border-white hover:bg-white/5 text-white/80'
                  : 'border-slate-300 hover:border-slate-500 hover:bg-slate-50 text-slate-600'
              }`}
              aria-label="Rechercher"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* B. Selecteur de pays */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setIsLangOpen(false);
                }}
                className={`h-9 px-2.5 border rounded-[6px] text-[11px] font-mono font-bold uppercase flex items-center gap-1 cursor-pointer transition-colors ${
                  scrollY > 20 
                    ? 'border-slate-205 bg-slate-50 text-slate-705 hover:bg-slate-100' 
                    : 'border-white/10 bg-white/5 text-slate-105 hover:bg-white/10'
                }`}
                title="Sélecteur national d'affiliation"
              >
                <span>{currentCountry.flag}</span>
                <span className="hidden sm:inline-block font-sans font-extrabold tracking-wide">{currentCountry.name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>
              
              {currentCountry.code !== 'CD' && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2 rounded-full bg-[#00A86B] animate-pulse" />
              )}

              <AnimatePresence>
                {isCountryOpen && (
                  <>
                    <div className="fixed inset-0 z-140" onClick={() => setIsCountryOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1.5 w-60 max-h-80 overflow-y-auto bg-white rounded-lg p-2 shadow-2xl border border-slate-20& text-left z-200 text-slate-800 custom-scrollbar"
                    >
                      <div className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block px-2.5 py-1.5 border-b mb-1 select-none flex justify-between">
                        <span>PAYS D&apos;AFFILIATION</span>
                        <span className="text-[#00A86B] font-bold">54 PAYS</span>
                      </div>
                      
                      {AFRICAN_COUNTRIES.map(ct => (
                        <button
                          key={ct.code}
                          onClick={() => handleCountryChange(ct.code)}
                          className={`w-full text-left px-2.5 py-1.5 rounded-md text-[11px] font-bold transition-all mt-0.5 flex justify-between items-center select-none cursor-pointer outline-none hover:bg-slate-100 ${
                            selectedCountryCode === ct.code ? 'bg-slate-50 text-[#00A86B]' : 'text-slate-700'
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span>{ct.flag}</span>
                            <span className="truncate max-w-[130px]">{ct.name}</span>
                          </span>
                          <span className="font-mono text-[9px] text-slate-400 shrink-0">({ct.symbol})</span>
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* C. Selecteur de langue */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsLangOpen(!isLangOpen);
                  setIsCountryOpen(false);
                }}
                className={`h-9 w-11 border rounded-[6px] text-[11px] font-mono font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                  scrollY > 20 
                    ? 'border-slate-205 bg-slate-50 text-slate-705 hover:bg-slate-100' 
                    : 'border-white/10 bg-white/5 text-slate-105 hover:bg-white/10'
                }`}
                aria-label="Sélecteur de langue"
              >
                <span>{language}</span>
                <ChevronDown className="w-3 h-3 opacity-60" />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <>
                    <div className="fixed inset-0 z-140" onClick={() => setIsLangOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1.5 w-32 bg-white rounded-lg p-1.5 shadow-2xl border border-slate-150 text-left z-200 text-slate-800"
                    >
                      {[
                        { code: 'FR', label: 'Français' },
                        { code: 'EN', label: 'English' },
                        { code: 'SW', label: 'Kiswahili 🇨🇩' }
                      ].map(l => (
                        <button
                          key={l.code}
                          onClick={() => handleLangChange(l.code as any)}
                          className={`w-full text-left px-2.5 py-1.5 rounded text-[11px] font-bold transition-all mt-0.5 flex justify-between items-center cursor-pointer outline-none hover:bg-slate-50 ${
                            language === l.code ? 'text-[#00A86B] font-extrabold bg-slate-50' : 'text-slate-705'
                          }`}
                        >
                          <span>{l.label}</span>
                          {language === l.code && <Check className="w-3.5 h-3.5 text-[#00A86B]" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* D. Se Connecter */}
            <button
              onClick={onNavigateToLogin}
              className={`h-10 px-3.5 rounded-[6px] hidden md:flex items-center gap-1.5 transition-all text-[11.5px] uppercase tracking-wide font-black cursor-pointer bg-transparent border-0 outline-none ${
                scrollY > 20 
                  ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-100' 
                  : 'text-slate-200 hover:text-white hover:bg-white/5'
              }`}
            >
              <Lock className="w-3.5 h-3.5 opacity-70" />
              <span>Se connecter</span>
            </button>

            {/* E. CTA S'affilier */}
            <button
              onClick={() => {
                triggerGTM('click_affilier_header');
                navigateTo('/affiliation');
              }}
              className={`h-10 px-4 rounded-[6px] bg-[#00A86B] text-white hover:bg-[#007D4C] flex items-center gap-1.5 transition-all text-[11px] uppercase tracking-wider font-sans font-black select-none cursor-pointer outline-none ${
                shouldPulseCTA ? 'animate-pulse' : ''
              }`}
            >
              <span>S’affilier</span>
            </button>

            {/* F. Hamburger Menu Mobile Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="h-10 w-10 border rounded-[6px] flex items-center justify-center transition-all select-none cursor-pointer outline-none lg:hidden"
              aria-label="Toggle menu"
            >
              <Menu className="w-4 h-4" />
            </button>

          </div>

        </div>
      </header>

      {/* Full-screen simulated Search Dialogue CMD+K */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[500] flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
            <div className="fixed inset-0 cursor-pointer" onClick={() => setIsSearchOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.97 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center gap-3 px-4 py-3.5 border-b bg-slate-50">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Chercher modules, hôpitaux, législations ou documentation..."
                  className="w-full text-sm text-slate-800 bg-transparent border-0 outline-none placeholder-slate-400 py-1"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="h-7 w-7 rounded-full bg-slate-200/50 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Suggestions results body */}
              <div className="p-2 max-h-96 min-h-[300px] overflow-y-auto custom-scrollbar text-left text-slate-900">
                {searchText ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-4 py-2">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest px-3 block">Résultats trouvés ({searchResults.length})</span>
                      <div className="space-y-1">
                        {searchResults.map((r, i) => (
                          <button
                            key={r.title}
                            onClick={() => navigateTo(r.route)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-[#00A86B]/10 hover:text-[#00A86B] transition-colors block cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold leading-none">{r.title}</span>
                              <span className="text-[9px] font-mono text-slate-400 font-extrabold uppercase border px-1.5 py-0.5 rounded leading-none shrink-0">{r.category}</span>
                            </div>
                            <span className="text-[10.5px] text-slate-450 block mt-1 font-semibold leading-none">{r.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                      <AlertTriangle className="w-8 h-8 text-yellow-500 animate-bounce" />
                      <div>
                        <p className="text-xs font-bold font-mono">Aucun résultat trouvé pour &quot;{searchText}&quot;</p>
                        <p className="text-[10px] text-slate-400 mt-1">Essayez recherchant : &quot;fraude&quot;, &quot;arca&quot;, &quot;données&quot;, ou &quot;clearing&quot;.</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-4 py-3">
                    <span className="text-[10.5px] font-mono font-black text-slate-400 uppercase tracking-widest px-3 block">Raccourcis rapides recommandés B2B</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-1">
                      {[
                        { title: "Régulations ARCA-RDC", desc: "Agrément n°0127 d'assurances", route: "/arca-rdc", icon: ShieldAlert },
                        { title: "Lutte anti-fraude active", desc: "Bloquer 99% des sinistres abusifs", route: "/risques", icon: AlertTriangle },
                        { title: "Politique de confidentialité", desc: "Souveraineté des données à Kinshasa", route: "/confidentialite", icon: Lock },
                        { title: "S'affilier au Tiers-Payant", desc: "Fiche d'enregistrement rapide DRH", route: "/affiliation", icon: MapPin }
                      ].map(item => (
                        <button
                          key={item.title}
                          onClick={() => navigateTo(item.route)}
                          className="w-full text-left p-3 border rounded-xl hover:border-[#00A86B] hover:bg-slate-50 transition-colors flex gap-2.5 items-start cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-[#00A86B]/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-4 h-4 text-slate-500 group-hover:text-[#00A86B]" />
                          </div>
                          <div className="leading-tight">
                            <span className="text-[11.5px] font-bold text-slate-800 tracking-wide block">{item.title}</span>
                            <span className="text-[10px] text-slate-450 font-semibold block mt-0.5">{item.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-4 py-2 border-t text-[10.5px] font-mono text-slate-450 select-none flex justify-between items-center">
                <span>Touchez Esc pour fermer. Navigation sécurisée NeoGTec.</span>
                <span className="text-[#00A86B] font-bold font-sans">100% conforme ARCA-RDC</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Responsive mobile side drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[550] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-80 max-w-full h-full bg-slate-900 text-white flex flex-col justify-between p-6 shadow-2xl z-10 border-l border-white/10"
            >
              {/* Header inside drawer */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#00A86B] animate-ping" />
                  <span className="text-xs font-mono font-black uppercase text-slate-400 tracking-widest">NEOGTEC MENU SAAS</span>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation accordion-style list */}
              <div className="flex-1 py-6 overflow-y-auto custom-scrollbar space-y-6 text-left">
                
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block leading-none">Sections</span>
                  <div className="space-y-1">
                    {[
                      { name: "Accueil Assurance", route: "/" },
                      { name: "Études de Risques RH", route: "/risques" },
                      { name: "Nos Solutions Tiers-Payant", route: "/solutions" },
                      { name: "Catalogue 16 Modules", route: "/modules" },
                      { name: "Grille Tarifaire B2B", route: "/tarifs" },
                      { name: "FAQ & Centre d'aide", route: "/faq" }
                    ].map(link => (
                      <button
                        key={link.name}
                        onClick={() => navigateTo(link.route)}
                        className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          currentRoute === link.route ? 'bg-[#00A86B]/20 text-green-300' : 'hover:bg-white/5 text-slate-300'
                        }`}
                      >
                        <span>{link.name}</span>
                        <span className="text-[9px] font-mono text-slate-500">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-black block leading-none">Régulations & Souveraineté</span>
                  <div className="p-3.5 bg-slate-950/60 border border-white/10 rounded-xl space-y-2 text-[10.5px]">
                    <div className="flex gap-2 text-slate-300 leading-snug">
                      <Check className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                      <span>Licence ARCA RDC n°ARCA/2025/0127</span>
                    </div>
                    <div className="flex gap-2 text-slate-300 leading-snug">
                      <Check className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                      <span>Souveraineté des données Loi n°18/035</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer sticky actions */}
              <div className="border-t border-white/10 pt-4 space-y-4">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400">
                  <span>Adresse : Gombe, Kinshasa</span>
                  <span className="text-[#00A86B]">Soutien 24/7/365</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onNavigateToLogin();
                    }}
                    className="h-11 border border-white/20 hover:border-white text-white rounded-lg text-xs font-bold uppercase transition-colors tracking-wide cursor-pointer flex items-center justify-center gap-1 bg-transparent"
                  >
                    <Lock className="w-3.5 h-3.5 opacity-70" />
                    <span>Se connecter</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      navigateTo('/affiliation');
                    }}
                    className="h-11 bg-[#00A86B] hover:bg-[#007D4C] text-white rounded-lg text-xs font-black uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center"
                  >
                    S&apos;affilier
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
