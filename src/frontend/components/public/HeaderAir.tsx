import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, Globe, Lock, Menu, X, ChevronDown, Sparkles, HelpCircle, 
  MapPin, Check, Lightbulb, Hospital, FileText, AlertTriangle, Play,
  Compass, BarChart3, AppWindow, ShieldAlert, Cpu, Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AFRICAN_COUNTRIES } from './CountrySelector';

interface HeaderAirProps {
  onNavigateTo: (route: string) => void;
  onNavigateToLogin: () => void;
  currentRoute: string;
}

const TOP_COUNTRIES = [
  { code: 'CD', name: 'RDC', currency: 'USD', flag: '🇨🇩' },
  { code: 'CI', name: 'Côte d’Ivoire', currency: 'XOF', flag: '🇨🇮' },
  { code: 'KE', name: 'Kenya', currency: 'KES', flag: '🇰🇪' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', flag: '🇳🇬' },
  { code: 'SN', name: 'Sénégal', currency: 'XOF', flag: '🇸🇳' },
  { code: 'CM', name: 'Cameroun', currency: 'XAF', flag: '🇨🇲' },
];

const SOLUTIONS_LINKS = [
  { name: 'Pour DRH', route: '/modules', desc: 'Gestion des bons soins, Plafonds auto.' },
  { name: 'Pour DAF', route: '/solutions', desc: 'Clearing 24h, Algorithme anti-fraude.' },
  { name: 'Pour Hôpitaux', route: '/solutions', desc: 'Paiement garanti chaque jeudi.' },
  { name: 'Pour Assurés', route: '/modules', desc: 'Application mobile, QR code sécurisé.' }
];

const RESSOURCES_LINKS = [
  { name: 'Questions / FAQ', route: '/faq', desc: 'Toutes les réponses en 2 minutes.' },
  { name: 'Blog Vision Santé', route: '/risques', desc: 'Nouvelles régulations nationales.' },
  { name: 'Documentation API', route: '/modules', desc: 'Intégrations techniques ERP.' },
  { name: 'Politique ARCA', route: '/confidentialite', desc: 'Vigilance légale et audits.' }
];

export function HeaderAir({ onNavigateTo, onNavigateToLogin, currentRoute }: HeaderAirProps) {
  const [scrollY, setScrollY] = useState(0);
  const [activeDropdown, setActiveDropdown] = useState<'solutions' | 'ressources' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Combine Country & Language State
  const [selectedCountryCode, setSelectedCountryCode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('ng_country') || 'CD';
    }
    return 'CD';
  });
  const [language, setLanguage] = useState<'FR' | 'EN'>('FR');
  const [isPreferencesOpen, setIsPreferencesOpen] = useState(false);
  
  // 3G detection
  const [isSlow3G, setIsSlow3G] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (typeof navigator !== 'undefined' && (navigator as any).connection) {
      const conn = (navigator as any).connection;
      if (conn.effectiveType === '2g' || conn.effectiveType === '3g' || conn.saveData) {
        setIsSlow3G(true);
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

  // CMD+K keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        triggerGTM('open_search', { method: 'shortcut_cmdk' });
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
    triggerGTM('change_country', { country: code });
  };

  const handleLangChange = (lang: 'FR' | 'EN') => {
    setLanguage(lang);
    triggerGTM('change_lang', { lang });
  };

  // Safe navigation wrapper to reset states
  const navigateTo = (route: string) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsPreferencesOpen(false);
    onNavigateTo(route);
  };

  // Pre-compiled search targets for CMD+K
  const searchResults = useMemo(() => {
    if (!searchText) return [];
    const query = searchText.toLowerCase();
    const matches: Array<{ title: string; category: string; route: string; desc: string }> = [];

    const targets = [
      { title: "Anti-fraude par Intelligence Artificielle", category: "Sécurité", route: "/risques", desc: "Bloquez 99% des abus de soins en direct" },
      { title: "Agrément Constitutionnel ARCA-RDC", category: "Régulation", route: "/arca-rdc", desc: "Courtage agréé et validé licence n°0127" },
      { title: "Règlement des Factures en 24h", category: "Finance B2B", route: "/solutions", desc: "Paiement direct de chaque hôpital le jeudi" },
      { title: "Catalogue de 16 Modules Portatifs", category: "Services DRH", route: "/modules", desc: "Modules sur-mesure d'assurance santé" },
      { title: "Données de santé souveraines à Gombe", category: "Souveraineté", route: "/confidentialite", desc: "Hébergement physique crypté à Kinshasa" },
      { title: "Tarifs et plans de souscription", category: "Tarifs", route: "/tarifs", desc: "À partir de 15 USD / mois par assuré" }
    ];

    targets.forEach(t => {
      if (t.title.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query)) {
        matches.push(t);
      }
    });

    return matches;
  }, [searchText]);

  const currentCountry = TOP_COUNTRIES.find(c => c.code === selectedCountryCode) || TOP_COUNTRIES[0];

  const handleMouseEnter = (menu: 'solutions' | 'ressources') => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  return (
    <>
      {/* Premium Floating Apple Navbar layout */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={`fixed left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-6xl transition-all duration-300 ${
          scrollY > 40 ? 'top-2' : 'top-4'
        }`}
        role="banner"
      >
        <div className="h-16 px-6 bg-white/95 backdrop-blur-xl border border-slate-200/50 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex items-center justify-between select-none">
          
          {/* GROUPE 1: IDENTITÉ */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={() => navigateTo('/')}
              className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-[#00A86B]/60 rounded-lg p-0.5"
              aria-label="NeoGTec - Retour à l'accueil"
            >
              <svg className="w-8 h-8 text-[#00A86B]" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 45C38.2843 45 45 38.2843 45 30C45 21.7157 38.2843 15 30 15C21.7157 15 15 21.7157 15 30C15 38.2843 21.7157 45 30 45Z" stroke="currentColor" strokeWidth="9" fill="none" />
                <path d="M70 45C78.2843 45 85 38.2843 85 30C85 21.7157 78.2843 15 70 15C61.7157 15 55 21.7157 55 30C55 38.2843 61.7157 45 70 45Z" stroke="currentColor" strokeWidth="9" fill="none" />
                <circle cx="50" cy="30" r="4.5" fill="currentColor" />
              </svg>
              <span className="font-bold tracking-tight text-slate-900 text-[15px] hidden md:block">NeoGTec</span>
            </button>
          </div>

          {/* GROUPE 2: NAVIGATION ULTRA-LIGHT (Max 6 visible items, remaining goes into CMD-K) */}
          {currentRoute !== '/affiliation' ? (
            <nav className="hidden lg:flex items-center gap-6" aria-label="Navigation principale NeoGTec">
              
              {/* Dropdown 1: Solutions */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('solutions')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`h-11 text-[13px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    activeDropdown === 'solutions' ? 'text-[#00A86B]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-expanded={activeDropdown === 'solutions'}
                >
                  Solutions
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'solutions' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 w-[260px] bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-150 text-left"
                    >
                      {SOLUTIONS_LINKS.map(link => (
                        <button
                          key={link.name}
                          onClick={() => {
                            triggerGTM('click_nav_solutions', { term: link.name });
                            navigateTo(link.route);
                          }}
                          className="w-full text-left p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group block"
                        >
                          <span className="text-xs font-bold text-slate-800 block group-hover:text-[#00A86B]">{link.name}</span>
                          {!isSlow3G && <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{link.desc}</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Direct Clik 2: Tarifs */}
              <button
                onClick={() => navigateTo('/tarifs')}
                className={`h-11 text-[13px] font-semibold cursor-pointer transition-colors ${
                  currentRoute === '/tarifs' ? 'text-[#00A86B] font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tarifs
              </button>

              {/* Dropdown 3: Ressources */}
              <div 
                className="relative"
                onMouseEnter={() => handleMouseEnter('ressources')}
                onMouseLeave={handleMouseLeave}
              >
                <button 
                  className={`h-11 text-[13px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                    activeDropdown === 'ressources' ? 'text-[#00A86B]' : 'text-slate-600 hover:text-slate-900'
                  }`}
                  aria-expanded={activeDropdown === 'ressources'}
                >
                  Ressources
                  <ChevronDown className="w-3 h-3 opacity-60" />
                </button>
                <AnimatePresence>
                  {activeDropdown === 'ressources' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="absolute left-0 top-full mt-1 w-[260px] bg-white border border-slate-200 shadow-xl rounded-xl p-3 z-150 text-left"
                    >
                      {RESSOURCES_LINKS.map(link => (
                        <button
                          key={link.name}
                          onClick={() => navigateTo(link.route)}
                          className="w-full text-left p-2 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer group block"
                        >
                          <span className="text-xs font-bold text-slate-800 block group-hover:text-[#00A86B]">{link.name}</span>
                          {!isSlow3G && <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">{link.desc}</span>}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </nav>
          ) : (
            <div className="hidden lg:flex items-center gap-2 text-xs font-medium text-slate-600">
              Étape d&apos;affiliation assistée • Besoin d&apos;aide ? <span className="text-[#00A86B] font-bold">+243 812 000 127</span>
            </div>
          )}

          {/* GROUPE 3: OUTILS & GROUPE 4: ACTIONS */}
          <div className="flex items-center gap-3 shrink-0">
            
            {/* Search Tool Button - Desktop Only */}
            <button
              onClick={() => {
                setIsSearchOpen(true);
                triggerGTM('open_search', { method: 'click_navbar_air' });
              }}
              className="hidden lg:flex items-center gap-2 text-slate-500 hover:text-slate-900 text-xs font-semibold px-2.5 py-1.5 hover:bg-slate-100 rounded-lg transition-all cursor-pointer outline-none border-0"
              aria-label="Rechercher des informations"
            >
              <Search className="w-3.5 h-3.5 opacity-70" />
              <span>Rechercher</span>
              <kbd className="h-5 px-1.5 bg-slate-100 text-[10px] border border-slate-200 rounded text-slate-500 font-mono flex items-center leading-none">⌘K</kbd>
            </button>

            {/* Combined Preferred Country/Lang select trigger dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsPreferencesOpen(!isPreferencesOpen)}
                className="h-9 px-2.5 border border-slate-200/60 hover:bg-slate-50 rounded-lg text-xs font-bold tracking-wide flex items-center gap-1.5 cursor-pointer outline-none transition-all text-slate-700"
                aria-label="Sélecteur de préférences Pays et Langue"
              >
                <span>{currentCountry.flag}</span>
                <span className="hidden sm:inline-block font-sans font-extrabold">{currentCountry.name}</span>
                <span className="text-[10px] text-slate-400">| {language}</span>
                <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
              </button>

              <AnimatePresence>
                {isPreferencesOpen && (
                  <>
                    <div className="fixed inset-0 z-140" onClick={() => setIsPreferencesOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 6 }}
                      transition={{ duration: 0.12 }}
                      className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-xl p-3.5 shadow-2xl border border-slate-200 text-left z-200 text-slate-800 space-y-3"
                    >
                      {/* Section 1: Top Countries */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider select-none">PAYS & DEVISE</span>
                        <div className="space-y-0.5">
                          {TOP_COUNTRIES.map(ct => (
                            <button
                              key={ct.code}
                              onClick={() => handleCountryChange(ct.code)}
                              className={`w-full text-left px-2 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer outline-none ${
                                selectedCountryCode === ct.code ? 'bg-slate-50 text-[#00A86B]' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                <span>{ct.flag}</span>
                                <span>{ct.name}</span>
                              </span>
                              <span className="font-mono text-[9px] text-slate-400 italic">({ct.currency})</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-slate-150" />

                      {/* Section 2: Preferred Language */}
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono font-black text-slate-400 block uppercase tracking-wider select-none">LANGUES DISPONIBLES</span>
                        <div className="grid grid-cols-2 gap-1 bg-slate-50 p-1 rounded-lg">
                          {[
                            { code: 'FR', label: 'FR' },
                            { code: 'EN', label: 'EN' }
                          ].map(l => (
                            <button
                              key={l.code}
                              onClick={() => handleLangChange(l.code as any)}
                              className={`py-1 text-center rounded text-xs font-bold transition-colors cursor-pointer outline-none ${
                                language === l.code ? 'bg-[#00A86B] text-white' : 'text-slate-600 hover:text-slate-900'
                              }`}
                            >
                              {l.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Login button - desktop only */}
            <button
              onClick={onNavigateToLogin}
              className="hidden lg:flex h-9 px-3 rounded-lg text-xs font-bold uppercase text-slate-700 hover:text-slate-900 hover:bg-slate-100 items-center gap-1.5 cursor-pointer outline-none transition-all"
            >
              <Lock className="w-3.5 h-3.5 opacity-70" />
              <span>Login</span>
            </button>

            {/* CTA Close on registration route or Affilier on normal routes */}
            {currentRoute === '/affiliation' ? (
              <button
                onClick={() => navigateTo('/')}
                className="h-9 px-3.5 rounded-lg border border-slate-200/80 hover:bg-slate-50 text-slate-705 text-xs font-bold uppercase cursor-pointer"
              >
                Quitter
              </button>
            ) : (
              <button
                onClick={() => {
                  triggerGTM('click_affilier_header');
                  navigateTo('/affiliation');
                }}
                className={`h-9 px-4 rounded-lg bg-[#00A86B] text-white hover:bg-[#007D4C] text-xs font-bold tracking-wide select-none cursor-pointer outline-none transition-transform font-bold ${
                  scrollY > 600 ? 'animate-bounce' : ''
                }`}
              >
                S’affilier
              </button>
            )}

            {/* Hamburger mobile toggle icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden h-9 w-9 border border-slate-200 rounded-lg flex items-center justify-center text-slate-600 active:bg-slate-50 cursor-pointer outline-none shrink-0"
              aria-label="Afficher le menu mobile"
            >
              <Menu className="w-4 h-4" />
            </button>

          </div>

        </div>
      </motion.header>

      {/* Elegant search results dialogue overlay CMD+K */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[500] flex items-start justify-center pt-24 p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="fixed inset-0 cursor-pointer" onClick={() => setIsSearchOpen(false)} />
            
            <motion.div 
              initial={{ opacity: 0, y: -20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col z-10"
            >
              <div className="flex items-center gap-3 px-4 py-3 border-b bg-slate-50">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher des modules, l'agrément ARCA, cliniques..."
                  className="w-full text-xs text-slate-800 bg-transparent border-0 outline-none placeholder-slate-400 py-1.5 font-sans"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  autoFocus
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="h-6 w-6 rounded-full bg-slate-200/60 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Suggestions results body */}
              <div className="p-3 max-h-96 min-h-[260px] overflow-y-auto custom-scrollbar text-left">
                {searchText ? (
                  searchResults.length > 0 ? (
                    <div className="space-y-3 py-1 text-slate-955">
                      <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest px-2 block select-none">Résultats B2B ({searchResults.length})</span>
                      <div className="space-y-0.5">
                        {searchResults.map(r => (
                          <button
                            key={r.title}
                            onClick={() => navigateTo(r.route)}
                            className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 hover:text-[#00A86B] transition-colors block cursor-pointer"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-[12px] font-bold text-slate-800 block">{r.title}</span>
                              <span className="text-[9px] font-mono text-slate-400 uppercase border px-1 rounded font-bold shrink-0">{r.category}</span>
                            </div>
                            <span className="text-[10.5px] text-slate-500 block font-medium mt-0.5 leading-tight">{r.desc}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-8 text-center text-slate-500 flex flex-col items-center justify-center gap-2">
                      <AlertTriangle className="w-6 h-6 text-yellow-500 animate-bounce" />
                      <div>
                        <p className="text-[11px] font-bold font-mono text-slate-700">Aucun résultat pour &quot;{searchText}&quot;</p>
                        <p className="text-[10px] text-slate-400 mt-1">Saisissez &quot;arca&quot;, &quot;fraude&quot;, &quot;souveraineté&quot; ou &quot;clearing&quot;.</p>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="space-y-3 py-2 text-slate-900">
                    <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest px-2 block select-none">Raccourcis rapides d&apos;aide</span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {[
                        { title: "Législation ARCA RDC", desc: "Agrément courtage n°0127", href: "/arca-rdc", icon: ShieldAlert },
                        { title: "Données de santé Loi 18/035", desc: "Souveraineté des dossiers à Gombe", href: "/confidentialite", icon: Lock },
                        { title: "Prévenir la fraude par IA", desc: "Stopper les usurpations d'identité", href: "/risques", icon: AlertTriangle },
                        { title: "Comment s'affilier", desc: "Formulaire simple d'entrée pour DRH", href: "/affiliation", icon: MapPin }
                      ].map(item => (
                        <button
                          key={item.title}
                          onClick={() => navigateTo(item.href)}
                          className="w-full text-left p-3 border rounded-xl hover:border-[#00A86B] hover:bg-slate-50 transition-colors flex gap-2.5 items-start cursor-pointer group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-slate-150 group-hover:bg-[#00A86B]/10 flex items-center justify-center shrink-0">
                            <item.icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-[#00A86B]" />
                          </div>
                          <div className="leading-tight">
                            <span className="text-[12.5px] font-bold text-slate-800 tracking-wide block">{item.title}</span>
                            <span className="text-[10px] text-slate-450 block font-semibold mt-0.5">{item.desc}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-slate-50 px-4 py-2 border-t text-[10px] font-mono text-slate-500 select-none flex justify-between">
                <span>Touchez Echap pour fermer.</span>
                <span className="text-[#00A86B] font-bold font-sans">100% conforme ARCA-RDC</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Sheet mobile side drawer - optimized lightweight */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[550] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm cursor-pointer"
            />
            
            <motion.div 
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="relative w-80 max-w-full h-full bg-white text-slate-800 flex flex-col justify-between p-6 shadow-2xl z-10 border-l border-slate-200"
            >
              {/* Header inside menu */}
              <div className="flex items-center justify-between border-b pb-4">
                <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest block">Navigation NeoGTec</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 cursor-pointer outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation items List */}
              <div className="flex-1 py-6 overflow-y-auto custom-scrollbar space-y-6 text-left">
                
                {/* Search in Drawer */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Recherche rapide..."
                    className="w-full bg-slate-50 font-sans text-xs border border-slate-200/80 rounded-lg pl-9 pr-3 py-2 outline-none text-slate-800 focus:border-[#00A86B]"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      setIsSearchOpen(true);
                    }}
                    readOnly
                  />
                </div>

                {/* Categories accordion mock */}
                <div className="space-y-1.5">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block select-none">ACCÈS EN UN CLIC</span>
                  <div className="space-y-0.5">
                    {[
                      { name: "Accueil", href: "/" },
                      { name: "5 Risques RH d'Assurance", href: "/risques" },
                      { name: "Nos Solutions B2B", href: "/solutions" },
                      { name: "Catalogue 16 Modules", href: "/modules" },
                      { name: "Grille Tarifaire et Devis", href: "/tarifs" },
                      { name: "Questions / FAQ", href: "/faq" }
                    ].map(link => (
                      <button
                        key={link.name}
                        onClick={() => navigateTo(link.href)}
                        className={`w-full text-left py-2.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                          currentRoute === link.href ? 'bg-[#00A86B]/10 text-[#00A86B]' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <span>{link.name}</span>
                        <span className="text-[10.5px] opacity-40">→</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider block select-none">ASSISTANCE DIRECTE ET LOCALE</span>
                  <div className="bg-slate-50 border border-slate-150 rounded-lg p-3 text-[11px] leading-relaxed text-slate-600 font-medium">
                    📍 Gombe, Kinshasa, RDC <br />
                    📞 Support B2B : +243 812 000 127
                  </div>
                </div>

              </div>

              {/* Bottom drawer elements */}
              <div className="border-t pt-4 space-y-3">
                <button
                  onClick={onNavigateToLogin}
                  className="w-full h-11 border border-slate-200 hover:bg-slate-50 rounded-lg text-xs font-bold uppercase tracking-wide flex items-center justify-center gap-1.5 text-slate-700 cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5 opacity-75" />
                  <span>Se connecter</span>
                </button>

                <button
                  onClick={() => {
                    triggerGTM('click_affilier_mobile');
                    navigateTo('/affiliation');
                  }}
                  className="w-full h-11 bg-[#00A86B] hover:bg-[#007D4C] text-white rounded-lg text-xs font-bold uppercase tracking-wider shadow-sm cursor-pointer select-none"
                >
                  S’affilier
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
