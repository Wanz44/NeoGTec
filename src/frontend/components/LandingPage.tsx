import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldCheck, 
  Activity, 
  Server, 
  Lock, 
  Clock, 
  Key, 
  AlertOctagon, 
  Cpu, 
  Hospital, 
  CheckCircle, 
  FileText, 
  Download, 
  Check, 
  Loader2, 
  Heart, 
  Video, 
  BarChart3, 
  FolderSync, 
  QrCode, 
  MapPin, 
  FileSignature, 
  Smartphone, 
  Star, 
  Quote, 
  HelpCircle, 
  ChevronUp, 
  ChevronDown, 
  Mail, 
  ExternalLink,
  Users,
  Layers,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Sparkles,
  Globe,
  Plus,
  Minus,
  Search,
  Menu,
  X,
  Play
} from 'lucide-react';
import { cn } from '../lib/utils';
import { 
  COUNTRIES, 
  risksList, 
  solutionsList, 
  modulesList, 
  plansList, 
  faqItemsList,
  CountryConfig,
  ModuleItem
} from './landingData';
import { ComplianceBanner } from './public/ComplianceBanner';
import { CountrySelector, AFRICAN_COUNTRIES } from './public/CountrySelector';
import { YoutubeDialog } from './ui/youtube-dialog';
import { getWording } from '../lib/wording';
import { HeaderAir } from './public/HeaderAir';
import { ContractConfig } from './contracts/ContractConfig';
import { PolicePrintVierge } from './contracts/PoliceForm';
import { InteractiveMap } from './InteractiveMap';

type Route = '/' | '/risques' | '/solutions' | '/modules' | '/tarifs' | '/faq' | '/affiliation' | '/confidentialite' | '/cgu' | '/arca-rdc' | '/merci' | '/contrat/print-vierge';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

// Custom Framer Motion Confetti for our /merci success screen
const DynamicConfetti = () => {
  const particles = Array.from({ length: 40 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-50">
      {particles.map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 2.5 + Math.random() * 2;
        const size = 6 + Math.random() * 6;
        const color = ['bg-[#00A86B]', 'bg-amber-400', 'bg-emerald-400', 'bg-teal-500', 'bg-green-400'][i % 5];
        return (
          <motion.div
            key={i}
            className={cn("absolute rounded-full", color)}
            style={{ width: size, height: size }}
            initial={{ top: -20, left: `${x}%`, opacity: 1, rotate: 0 }}
            animate={{ 
              top: '105%', 
              left: `${x + (Math.random() * 24 - 12)}%`, 
              opacity: 0,
              rotate: 360 
            }}
            transition={{ duration, ease: 'linear', delay, repeat: Infinity }}
          />
        );
      })}
    </div>
  );
};

export function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [selectedCountryCode, setSelectedCountryCode] = useState<string>('CD');
  const [isYoutubeOpen, setIsYoutubeOpen] = useState(false);

  // Bridge with existing selectedCountry structure
  const selectedCountry = React.useMemo(() => {
    const matched = AFRICAN_COUNTRIES.find(c => c.code === selectedCountryCode) || AFRICAN_COUNTRIES.find(c => c.code === 'CD')!;
    return {
      code: matched.code === 'CD' ? 'RDC' : matched.code,
      name: matched.name,
      currency: (matched.currency === 'EUR' || matched.currency === 'USD' ? 'USD' : matched.currency) as any,
      rate: matched.rate,
      symbol: matched.symbol
    };
  }, [selectedCountryCode]);

  // Backward-compatible setter for countries
  const setSelectedCountry = (config: CountryConfig) => {
    const matched = AFRICAN_COUNTRIES.find(c => c.code === (config.code === 'RDC' ? 'CD' : config.code));
    if (matched) {
      setSelectedCountryCode(matched.code);
    }
  };

  const [cart, setCart] = useState<string[]>([]);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);
  const [searchFAQ, setSearchFAQ] = useState('');
  const [activeModuleModal, setActiveModuleModal] = useState<ModuleItem | null>(null);
  const [roiEmployees, setRoiEmployees] = useState(150);
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [routeHistory, setRouteHistory] = useState<Route[]>([]);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  
  // Custom states matching the accordion section layouts
  const [activeOffice, setActiveOffice] = useState<string>('rdc');
  const [activePartnerSlide, setActivePartnerSlide] = useState(0);

  // Sync route stack and route history
  useEffect(() => {
    const handleLocationChange = () => {
      let hash = window.location.hash.replace('#', '') as Route;
      if (!hash) hash = '/';
      setCurrentRoute(hash);
      setHamburgerOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    window.addEventListener('hashchange', handleLocationChange);
    handleLocationChange();
    return () => window.removeEventListener('hashchange', handleLocationChange);
  }, []);

  const navigateTo = (route: Route) => {
    setRouteHistory(prev => [...prev, currentRoute]);
    window.location.hash = route;
  };

  const navigateBack = () => {
    if (routeHistory.length > 0) {
      const prev = routeHistory[routeHistory.length - 1];
      setRouteHistory(prevStack => prevStack.slice(0, -1));
      window.location.hash = prev;
    } else {
      window.location.hash = '/';
    }
  };

  const formatPrice = (baseUsd: number, cycle: string = "mois") => {
    const localVal = baseUsd * selectedCountry.rate;
    const formattedUsd = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 2
    }).format(baseUsd);

    if (selectedCountry.currency === 'USD') {
      return `${formattedUsd} / ${cycle}`;
    }

    const formattedLocal = new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: selectedCountry.currency,
      maximumFractionDigits: 0
    }).format(localVal);

    return `${formattedUsd} / ${cycle} (~${formattedLocal})`;
  };

  const [formStep, setFormStep] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [formServerError, setFormServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      raison_sociale: '',
      nb_employes: '150',
      assureur_actuel: '',
      contrat_plan: 'Gold',
      nom: '',
      email_pro: '',
      phone: '',
      message: '',
      website_url_field: '' // Honeypot
    }
  });

  const employeesVolume = watch('nb_employes');
  const selectedPlan = watch('contrat_plan');

  const onLeadFormSubmit = async (data: any) => {
    if (data.website_url_field) {
      setFormServerError("Spam Bot Detecté !");
      return;
    }
    if (!captchaChecked) {
      setFormServerError("Veuillez cocher la case hCaptcha pour continuer.");
      return;
    }
    setIsSubmittingForm(true);
    setFormServerError(null);

    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          besoins: cart.length > 0 ? cart : ['B2B_Standard'],
          nb_employes: parseInt(data.nb_employes) || 150
        })
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Une erreur est survenue.");
      }
      navigateTo('/merci');
    } catch (err: any) {
      setFormServerError(err.message || "Impossible de soumettre la demande d'affiliation.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleNextFormStep = async () => {
    setFormServerError(null);
    if (formStep === 1) {
      const ok = await trigger(['raison_sociale', 'nb_employes', 'assureur_actuel']);
      if (ok) setFormStep(2);
    } else if (formStep === 2) {
      const ok = await trigger(['nom', 'email_pro', 'phone']);
      if (ok) setFormStep(3);
    }
  };

  const toggleCartModule = (name: string) => {
    setCart(prev => {
      const exist = prev.includes(name);
      return exist ? prev.filter(m => m !== name) : [...prev, name];
    });
  };

  const filteredFaqs = faqItemsList.filter(item => 
    item.q.toLowerCase().includes(searchFAQ.toLowerCase()) || 
    item.a.toLowerCase().includes(searchFAQ.toLowerCase())
  );

  if (currentRoute === '/contrat/print-vierge') {
    return <PolicePrintVierge />;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#00A86B] selection:text-white relative">
      

      {/* 🟢 NAVIGATION NAV - BLENDED AND TRANSPARENT OVER STARLIGHT HERO (OR WHITE ON SUBPAGES) */}
      <HeaderAir 
        onNavigateTo={navigateTo}
        onNavigateToLogin={onNavigateToLogin}
        currentRoute={currentRoute}
      />

      {/* 🗺️ BREADCRUMBS & RETOUR BLOCK (For all secondary routes) */}
      {currentRoute !== '/' && (
        <div className="bg-white border-b border-slate-200 py-3.5 px-6 md:px-12 select-none">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium">
              <button onClick={() => navigateTo('/')} className="text-slate-400 hover:text-[#00A86B] font-bold cursor-pointer">Accueil</button>
              <span className="text-slate-300">/</span>
              <span className="text-slate-900 font-extrabold uppercase tracking-wider text-[11px]">
                {currentRoute === '/risques' && 'Risques Financiers'}
                {currentRoute === '/solutions' && 'Nos Solutions'}
                {currentRoute === '/modules' && 'Catalogue de Modules'}
                {currentRoute === '/tarifs' && 'Tarification'}
                {currentRoute === '/faq' && 'Assistance FAQ'}
                {currentRoute === '/affiliation' && 'Tunnel d’affiliation'}
                {currentRoute === '/confidentialite' && 'Confidentialité Santé RDC'}
                {currentRoute === '/cgu' && 'Conditions Générales d’usage'}
                {currentRoute === '/arca-rdc' && 'Dossier de régulation ARCA'}
                {currentRoute === '/merci' && 'Félicitations'}
              </span>
            </div>

            <button 
              onClick={navigateBack}
              className="inline-flex h-7 items-center gap-1 border border-slate-200 bg-slate-50 hover:bg-slate-100 rounded-[5px] px-2.5 text-slate-600 hover:text-slate-900 text-[10px] font-bold uppercase transition-all cursor-pointer font-mono"
            >
              ← Retour
            </button>
          </div>
        </div>
      )}

      {/* 🚀 MAIN SWITCH CHASSIS */}
      <main className="min-h-[calc(100vh-20rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25 }}
          >
            {/* 1. HOME ACCUEIL VIEW */}
            {currentRoute === '/' && (
              <div className="pb-24">
                
                {/* 3. HeroSection */}
                <section className="relative min-h-screen flex items-center pt-36 pb-24 overflow-hidden bg-[#f8f9ff]">
                  {/* Emerald Background Simulation */}
                  <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute right-[-10%] top-[-20%] w-[80%] h-[140%] opacity-20 bg-gradient-to-l from-[#006948]/30 via-transparent to-transparent rotate-[-15deg]"></div>
                    <div className="absolute left-1/2 bottom-0 w-[1px] h-[80%] bg-gradient-to-t from-[#006948]/30 to-transparent"></div>
                    <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, rgba(0, 105, 72, 0.03) 0%, transparent 70%)" }}></div>
                  </div>
                  <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10 text-left">
                      <div className="inline-flex items-center gap-3 bg-[#006c4a]/10 text-[#006c4a] px-5 py-2 rounded-full border border-[#006c4a]/20">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#006c4a] animate-pulse"></span>
                        <span className="font-semibold text-xs uppercase tracking-widest font-sans">Solution Certifiée ARCA</span>
                      </div>
                      <h1 className="font-sans text-[36px] sm:text-[42px] md:text-[52px] leading-tight font-extrabold text-[#0b1c30]">
                        L’assurance santé qui fait gagner <br/><span className="text-[#006c4a] relative inline-block"><span className="relative z-10">70% de temps</span><span className="absolute bottom-1 left-0 w-full h-3 bg-[#68dba9]/30 -z-10 rounded-full"></span></span> à vos RH
                      </h1>
                      <p className="font-sans text-lg text-[#3d4a42] max-w-xl leading-relaxed text-[20px]">
                        Zéro papier. 100% traçable ARCA-RDC. Paiement hôpitaux en 24h. La souveraineté numérique au service de votre capital humain.
                      </p>
                      <div className="flex flex-wrap items-center gap-6 pt-4">
                        <button 
                          onClick={() => navigateTo('/affiliation')}
                          className="bg-[#006c4a] text-white font-sans text-sm font-semibold px-10 py-5 rounded-2xl hover:brightness-110 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 shadow-xl shadow-[#006c4a]/20 cursor-pointer"
                        >
                          Démarrer l'Audit Gratuit
                        </button>
                        <button 
                          onClick={() => navigateTo('/tarifs')}
                          className="bg-white border-2 border-slate-200 text-[#0b1c30] font-sans text-sm font-semibold px-10 py-5 rounded-2xl hover:border-[#006c4a] hover:bg-slate-50 transition-all duration-300 cursor-pointer"
                        >
                          Consulter les Plans
                        </button>
                      </div>
                      <div className="pt-16">
                        <p className="text-xs text-[#6d7a72] mb-8 uppercase tracking-[0.2em] font-semibold">Ils nous font confiance pour leur conformité</p>
                        <div className="flex flex-wrap items-center gap-16 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                          <img className="h-10 object-contain" alt="Bralima S.A." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAKjy-_ArQZGaQOtKvEmQNZBYvr9ESqDpaDnckUOP1CjY0F0XIQYXv_fFfBpezvF3flfBgTLRnF8_uoLIXH07_wKT_gbWpiMo_cVwjx0BYsyqYCovmxRdpvxf5b_cycMZr8RW69BhLVd1CP2JVlj2QqeCc9M90rYybUkLUYiZUrH2Lnmfq5Vm8kMPCw5kx3WfCTSjqX1LYmfMq_wPnyYyDcq55x1qOAe199Ciyi4hxQK_V2NBeMmUjpRA"/>
                          <img className="h-10 object-contain" alt="Tenke Fungurume Mining" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuujPICbQkmPGbFv640sFMgCJtGfTN9dcPegsX_5NQqP1dWgjOZBAnhZ2IuNaHMKs0QK8Z3zSuoHoRE7Vp-FbGQIXge9HXQGvg_qg7qFcOaZhTg6le_rz6O_iEjaPgXTBJ4HoOsCc9fm2V6IbNce2pRgEKHF_woOaYjAgpKuKISt7c0bjUipFsQxHgc95ZhOoZDP1ZHUV2iWPvScQClXVKpvvwZiXdNPzKDwKnIHr4_PuEa1tVLrRv4A"/>
                          <img className="h-10 object-contain" alt="Rawbank" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxOMGA55xdVGzrvvQzv4qvSWgvtCT1Rzd0p9abggXNWp8X_ff39LcguBG47-vPoeLieCv_XfnvSDT12N9J5o4FxkJkCGGVqZ3nIEtTDKJHaD0MQKA_zC8366NRKQTbu9WHyHh4iHFWxidCTDz2489sbD-nFpQw_cpCFtIw5EDhmXPcaHiquhboWLeqkkIoApLwCa5rGrmPzJwBXDrnGipXl4hH3aQptu5FJhnybUswypwVAOachGgR2A"/>
                        </div>
                      </div>
                    </div>
                    <div className="relative group lg:pl-12">
                      <div className="absolute -inset-4 bg-gradient-to-tr from-[#006c4a]/10 via-[#006c4a]/5 to-transparent rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
                      <div className="relative bg-white border border-slate-100 rounded-[2.5rem] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] h-[600px] flex items-center justify-center overflow-hidden">
                        <div className="w-full h-full bg-[#eff4ff] rounded-[2rem] border border-[#bccac0]/30 flex flex-col items-center justify-center p-6 relative">
                          <div className="absolute top-4 left-6 right-6 flex items-center justify-between border-b border-slate-200/50 pb-3">
                            <span className="text-[11px] font-mono font-bold text-[#006c4a]">TIERS-PAYANT EN DIRECT</span>
                            <span className="px-2 py-0.5 bg-[#68dba9]/20 text-[#005137] rounded-sm text-[9px] font-mono font-bold">STABLE 99.9%</span>
                          </div>
                          
                          <svg className="w-full max-w-[340px] mt-6" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M120,240 Q160,200 220,180" stroke="#006c4a" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                            <path d="M120,240 Q100,160 110,120" stroke="#006c4a" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                            <path d="M220,180 Q270,190 320,230" stroke="#006c4a" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                            <path d="M110,120 Q160,150 220,180" stroke="#006c4a" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />

                            <circle cx="220" cy="180" r="14" fill="#006c4a" fillOpacity="0.15" />
                            <circle cx="220" cy="180" r="6" fill="#006c4a" />
                            <text x="210" y="205" fill="#0b1c30" fontSize="10" fontWeight="bold" fontFamily="monospace">Kinshasa (HQ)</text>

                            <circle cx="110" cy="120" r="12" fill="#006c4a" fillOpacity="0.15" />
                            <circle cx="110" cy="120" r="5" fill="#006c4a" />
                            <text x="80" y="105" fill="#3f465c" fontSize="9" fontWeight="bold" fontFamily="monospace">Abidjan</text>

                            <circle cx="320" cy="230" r="12" fill="#006c4a" fillOpacity="0.15" />
                            <circle cx="320" cy="230" r="5" fill="#006c4a" />
                            <text x="310" y="250" fill="#3f465c" fontSize="9" fontWeight="bold" fontFamily="monospace">Nairobi</text>

                            <circle cx="120" cy="240" r="12" fill="#006c4a" fillOpacity="0.15" />
                            <circle cx="120" cy="240" r="5" fill="#006c4a" />
                            <text x="90" y="260" fill="#3f465c" fontSize="9" fontWeight="bold" fontFamily="monospace">Lagos</text>
                          </svg>

                          <div className="absolute bottom-6 left-6 right-6 bg-[#0b1c30] text-white rounded-lg p-3 text-left font-mono text-[10px] flex items-center justify-between border border-white/10 shadow-lg">
                            <span className="text-[#68dba9]">✓ TRANSITE_SERVEUR : ACTIF</span>
                            <span className="text-[#68dba9]">24h/24</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 4. Configuration des Garanties */}
                <section className="py-40 bg-white relative overflow-hidden" id="tarifs">
                  <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                    <div className="text-center mb-24 space-y-6">
                      <h2 className="text-3xl md:text-[36px] text-[#0b1c30] font-extrabold tracking-tight uppercase">Configuration des Garanties &amp; Tarifs</h2>
                      <p className="text-[#3d4a42] text-lg max-w-2xl mx-auto leading-relaxed">
                        Personnalisez vos limites de couverture pour répondre aux exigences de votre secteur d'activité, avec l'assurance d'une conformité totale.
                      </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto mb-20 text-left">
                      {/* Silver */}
                      <div className="border border-slate-200 rounded-[2rem] p-10 hover:border-[#006c4a]/50 hover:shadow-xl transition-all flex flex-col group h-full bg-white">
                        <span className="text-[#6d7a72] text-xs font-semibold mb-4 tracking-wider uppercase">PME &amp; Startups</span>
                        <h3 className="text-[32px] font-bold text-[#0b1c30] mb-8">Standard</h3>
                        <div className="space-y-6 mb-12 flex-grow">
                          <div className="flex items-start gap-4">
                            <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-5 h-5" />
                            <span className="text-sm text-[#3d4a42]">Plafond annuel: 5.000$ / pers.</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-5 h-5" />
                            <span className="text-sm text-[#3d4a42]">Soins ambulatoires 80%</span>
                          </div>
                          <div className="flex items-start gap-4 opacity-50">
                            <AlertTriangle className="text-[#6d7a72] mt-1 shrink-0 w-5 h-5" />
                            <span className="text-sm text-[#6d7a72]">Évacuation internationale</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigateTo('/affiliation')}
                          className="w-full py-5 border-2 border-slate-200 rounded-xl font-semibold text-sm text-[#0b1c30] group-hover:border-[#006c4a] group-hover:text-[#006c4a] transition-all cursor-pointer"
                        >
                          Choisir Silver
                        </button>
                      </div>
                      
                      {/* Gold (Featured) */}
                      <div className="relative z-10 flex flex-col h-full rounded-[2.5rem] p-[3px] bg-gradient-to-b from-[#006c4a] via-[#006c4a]/60 to-[#006c4a]/10 shadow-[0_32px_64px_-16px_rgba(0,105,72,0.25)] md:-mt-8 md:mb-8">
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#006c4a] text-white px-6 py-2 rounded-full text-[10px] font-bold shadow-lg border border-[#85f8c4]/20 tracking-widest uppercase">RECOMMANDÉ</div>
                        <div className="bg-white rounded-[2.3rem] p-12 flex flex-col h-full">
                          <span className="text-[#006c4a] text-xs font-bold mb-4 tracking-wider uppercase">Corporate &amp; Industrie</span>
                          <h3 className="text-[40px] font-bold text-[#0b1c30] mb-8">Classique</h3>
                          <div className="space-y-6 mb-12 flex-grow">
                            <div className="flex items-start gap-4">
                              <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-6 h-6" />
                              <span className="text-base text-[#0b1c30] font-medium">Plafond annuel: 25.000$ / pers.</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-6 h-6" />
                              <span className="text-base text-[#3d4a42]">Dentaire &amp; Optique inclus</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-6 h-6" />
                              <span className="text-base text-[#3d4a42]">Évacuation Afrique Australe</span>
                            </div>
                            <div className="flex items-start gap-4">
                              <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-6 h-6" />
                              <span className="text-base text-[#3d4a42]">Réseau Top 50 Hôpitaux</span>
                            </div>
                          </div>
                          <button 
                            onClick={() => navigateTo('/affiliation')}
                            className="w-full py-5 bg-[#006c4a] text-white rounded-xl font-bold text-sm shadow-xl shadow-[#006c4a]/30 hover:brightness-110 hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                          >
                            Configurer Gold
                          </button>
                        </div>
                      </div>
                      
                      {/* Platinum */}
                      <div className="border border-slate-200 rounded-[2rem] p-10 hover:border-[#006c4a]/50 hover:shadow-xl transition-all flex flex-col group h-full bg-white">
                        <span className="text-[#6d7a72] text-xs font-semibold mb-4 tracking-wider uppercase">Exécutif &amp; Mining</span>
                        <h3 className="text-[32px] font-bold text-[#0b1c30] mb-8">Privilege</h3>
                        <div className="space-y-6 mb-12 flex-grow">
                          <div className="flex items-start gap-4">
                            <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-5 h-5" />
                            <span className="text-sm text-[#3d4a42]">Plafond illimité certifié</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-5 h-5" />
                            <span className="text-sm text-[#3d4a42]">Evacuation Monde (Europe/US)</span>
                          </div>
                          <div className="flex items-start gap-4">
                            <CheckCircle className="text-[#006c4a] mt-1 shrink-0 w-5 h-5" />
                            <span className="text-sm text-[#3d4a42]">Médecin dédié 24h/24</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => navigateTo('/affiliation')}
                          className="w-full py-5 border-2 border-slate-200 rounded-xl font-semibold text-sm text-[#0b1c30] group-hover:border-[#006c4a] group-hover:text-[#006c4a] transition-all cursor-pointer"
                        >
                          Accès Platinum
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 5. Stats Column */}
                <section className="bg-[#006948] py-32 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 50% 50%, #ffffff 0%, transparent 60%)" }}></div>
                  <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 grid md:grid-cols-3 gap-16 text-center">
                    <div className="space-y-4">
                      <p className="font-sans text-[64px] md:text-[80px] text-white font-bold tracking-tighter">200,000+</p>
                      <p className="text-[#68dba9] font-sans text-sm md:text-[16px] tracking-[0.2em] uppercase font-medium">Assurés Actifs</p>
                    </div>
                    <div className="space-y-4 md:border-x border-white/10">
                      <p className="font-sans text-[64px] md:text-[80px] text-[#85f8c4] font-bold tracking-tighter">-70%</p>
                      <p className="text-[#68dba9] font-sans text-sm md:text-[16px] tracking-[0.2em] uppercase font-medium">Réduction Coûts Gestion</p>
                    </div>
                    <div className="space-y-4">
                      <p className="font-sans text-[64px] md:text-[80px] text-white font-bold tracking-tighter">50+</p>
                      <p className="text-[#68dba9] font-sans text-sm md:text-[16px] tracking-[0.2em] uppercase font-medium">Hôpitaux Partenaires</p>
                    </div>
                  </div>
                </section>

                {/* 6. Nos Services (Bento Style) */}
                <section className="py-40 bg-slate-50" id="solutions">
                  <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                    <h2 className="text-3xl md:text-[36px] text-[#0b1c30] mb-20 text-center font-bold tracking-tight uppercase">Services de Surveillance Digitale</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 text-left">
                      
                      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:border-[#006c4a]/40 hover:shadow-2xl transition-all duration-500 shadow-sm flex flex-col h-full group">
                        <div className="w-full aspect-square mb-10 rounded-[1.5rem] overflow-hidden border border-slate-100 group-hover:scale-[1.02] transition-transform duration-500">
                          <img alt="Direct Medical Care Validation" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAvjifwEaGtz2wENY-CxsBx9nmMH9jzef_fzSLK7OikUFxWL3kgAoLnmyD_knSkQd1lUhMLmPl0nv-wt3966Tl4f1sY5z3YxA-0IbtXRb-HNzD96XVySRGyj1R4AJyiuZr-IWcxV54NOFB354YT39w8pPKpgdIdG-6TlmboESG7SitdFShWIq2EnolER0wtiPbBK-pACd2WeAl140w-js0WQb38t1Cgyy17_3DSkDv6YedXbA-j8mQSHw"/>
                        </div>
                        <h4 className="text-[20px] mb-4 text-[#0b1c30] font-bold">Validation Directe</h4>
                        <p className="text-[#3d4a42] text-sm leading-relaxed flex-grow">Admission en clinique par simple scan. Suppression totale des formulaires d'admission papier.</p>
                      </div>

                      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:border-[#006c4a]/40 hover:shadow-2xl transition-all duration-500 shadow-sm flex flex-col h-full group">
                        <div className="w-full aspect-square mb-10 rounded-[1.5rem] overflow-hidden border border-slate-100 group-hover:scale-[1.02] transition-transform duration-500">
                          <img alt="Anti-fraud QR Code System" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBics-s5Gm-c-OQh35pF4sEPHjU50Tr3VqqLF1YJY8698NXMNdRXnABuTFLFyQ_FIgRVSmuH5-qN3Wdqm1BZ4bbhbL4l5h9oYzcgLMkUT_l9JzXcwqAmEvHBYU_OEhI0e3eb68WhFD120t17TZ1ut5Bcua9l2gvxF-6CKyNtg9TM6d5Pg3pXiaCMdpaeGaoiQ3eNZKzkqQoiJR-hEFfHWYm4xyCub3dmYMFJZfCRzCJbyWLVaDjN_nyjg"/>
                        </div>
                        <h4 className="text-[20px] mb-4 text-[#0b1c30] font-bold">Barrage Anti-usurpation</h4>
                        <p className="text-[#3d4a42] text-sm leading-relaxed flex-grow">Contrôle biométrique et QR Code dynamique pour éradiquer la fraude documentaire sur les soins.</p>
                      </div>

                      <div className="bg-[#00855d] text-white p-10 rounded-[2rem] border border-[#006c4a]/20 hover:shadow-[0_32px_64px_-16px_rgba(0,105,72,0.4)] transition-all duration-500 shadow-xl flex flex-col h-full group relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none"></div>
                        <div className="relative z-10 w-full aspect-square mb-10 rounded-[1.5rem] overflow-hidden border border-white/20 group-hover:scale-[1.02] transition-transform duration-500">
                          <img alt="Data Sovereignty" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCVO9zypU3B_xyJ61dUdh2pUJYX-sCHxaW_jUMXeKV4M12RAdbdPGL3_UQdEQk3OLzMmmwSSIlK8qX6R-5VahkPg7nVijne62CIW4P5kMe49m96rJlxdBV7dBB50sJBRTgx9bQSn3dVffYXH_UJszIOHJe5jIwpcKnAIEubqgEUowZ-Kzj_0R6QBQ61HYEmNd6EZQdzVzYTgZCTz5Y-aoTN3zPtTamwgYE1-1cMnTn9Tg7pTVqbqrC9Gg"/>
                        </div>
                        <h4 className="relative z-10 text-[20px] mb-4 font-bold">Conformité Loi n°18/035</h4>
                        <p className="relative z-10 text-white/90 text-sm leading-relaxed flex-grow">Chiffrement AES-256 de bout en bout conforme au code des télécommunications de la RDC.</p>
                      </div>

                      <div className="bg-white p-10 rounded-[2rem] border border-slate-200 hover:border-[#006c4a]/40 hover:shadow-2xl transition-all duration-500 shadow-sm flex flex-col h-full group">
                        <div className="w-full aspect-square mb-10 rounded-[1.5rem] overflow-hidden border border-slate-100 group-hover:scale-[1.02] transition-transform duration-500">
                          <img alt="Accelerated Claim Settlement" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxp3Ps0Zsxll8co_AYjbe6Si5Go3dnUsGQ7p3AuTmlkPRTv4xbzeQ-C3kOD1yReV9Rc2WKHGSmm-L7X3ND_L1pkbGYho5LWPdl7UA4sqwHkAMOlVZjIlxI-np55ep8Cf12dy5f9D7Qn6-EDXQ10vVsJ7LG32RXrLm-QbUt1Qd3OzdnESn5tt2-dR1Sx2pvi2vBSlJccGWU2fej7DOGraJ-ZMqV_Y0m5GGmqQmt8WN2F_OaEwuLVWqUBQ"/>
                        </div>
                        <h4 className="text-[20px] mb-4 text-[#0b1c30] font-bold">Clôture Sinistre Accélérée</h4>
                        <p className="text-[#3d4a42] text-sm leading-relaxed flex-grow">Rapprochement bancaire automatisé et liquidation des sinistres en moins de 48 heures.</p>
                      </div>

                    </div>
                  </div>
                </section>

                {/* 7. Espace Décideurs */}
                <section className="py-40 bg-[#e5eeff] text-left">
                  <div className="max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center gap-20 lg:gap-32">
                    <div className="md:w-1/2 relative">
                      <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border-[12px] border-white/50 bg-[#eff4ff]">
                        <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: "url('/src/assets/images/neo_lighthouse_1781554684215.jpg')" }} />
                      </div>
                    </div>
                    <div className="md:w-1/2 space-y-12">
                      <h2 className="text-4xl md:text-[56px] text-[#0b1c30] leading-[1.1] font-bold">Souveraineté Numérique Totale</h2>
                      <p className="text-lg text-[#3d4a42] leading-relaxed text-[20px]">
                        Pour la première fois, vos données de santé d'entreprise restent en RDC. Notre infrastructure hybride garantit que <span className="font-bold text-[#006c4a]">aucun cloud étranger n'héberge vos bases médicales salariés</span>.
                      </p>
                      <div className="space-y-8 pt-4">
                        <div className="flex items-start gap-8">
                          <div className="w-16 h-16 rounded-[1.25rem] bg-white flex items-center justify-center shrink-0 shadow-lg border border-slate-100">
                            <Server className="text-[#006c4a] w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-[22px] font-bold text-[#0b1c30] mb-2">Hébergement Local Certifié</p>
                            <p className="text-sm text-[#3d4a42] leading-relaxed">Data Centers conformes aux exigences du Ministère du Numérique RDC.</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-8">
                          <div className="w-16 h-16 rounded-[1.25rem] bg-white flex items-center justify-center shrink-0 shadow-lg border border-slate-100">
                            <ShieldCheck className="text-[#006c4a] w-8 h-8" />
                          </div>
                          <div>
                            <p className="text-[22px] font-bold text-[#0b1c30] mb-2">Optimisation de Trésorerie</p>
                            <p className="text-sm text-[#3d4a42] leading-relaxed">Primes d'assurance lissées et transparentes via l'ARCA-RDC.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 8. Communiqué de Presse */}
                <div className="bg-[#00855d] py-20 relative overflow-hidden text-left">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjEpIi8+PC9zdmc+')] opacity-50"></div>
                  <div className="relative z-10 max-w-[1440px] mx-auto px-6 md:px-10 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="flex items-center gap-8">
                      <div className="bg-[#006947] p-5 rounded-[1.25rem] shadow-xl border border-white/10 text-white">
                        <Activity className="w-8 h-8" />
                      </div>
                      <div>
                        <h3 className="text-white text-[28px] font-bold mb-2">Expansion Nationale : Phase 2</h3>
                        <p className="text-white/80 text-lg">Lancement de nos Hubs de services au Katanga et au Nord-Kivu.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => navigateTo('/arca-rdc')}
                      className="text-white border-b-2 border-white/50 hover:border-white font-semibold pb-1 flex items-center gap-3 group transition-colors cursor-pointer text-sm bg-transparent"
                    >
                      <span>Lire le communiqué complet</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                    </button>
                  </div>
                </div>

                {/* 9. Témoignages & Actualités */}
                <section className="py-40 bg-white overflow-hidden text-left">
                  <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                    <div className="grid md:grid-cols-2 gap-20 lg:gap-32 mb-24">
                      <div className="space-y-12">
                        <h2 className="text-3xl md:text-[32px] text-[#0b1c30] font-bold tracking-tight">La voix de nos partenaires</h2>
                        <div className="bg-white p-12 rounded-[2.5rem] border border-slate-200 relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] mt-8">
                          <Quote className="absolute -top-8 -left-8 text-[120px] text-[#006947]/10 leading-none w-24 h-24" />
                          <p className="relative z-10 text-xl font-medium text-[#3d4a42] italic leading-relaxed text-[22px]">
                            "NeoGTec a transformé notre gestion santé. La réduction des fraudes et la rapidité de prise en charge hospitalière pour nos agents est sans precedent dans l'histoire de la Bralima S.A."
                          </p>
                          <div className="mt-12 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full bg-[#eff4ff] overflow-hidden shadow-sm border-2 border-white">
                              <img className="w-full h-full object-cover" alt="Direction RH, Bralima S.A." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbdy0gXiJERPYeRRdWWjkN9h4JNlTi2C2h_CxFBiGOrvDt2v_VH9aWi01GT20r9U-G9qwvKatr4tMSkRwxlRo42KFXQqTtQrzdv8sSNm_XEE18XXMTp-rd5xhCHjnEWoN80KCPral8jhK1RvOcDYj9TM-wX1wDXa2VJrIaPfRdmCf9oNWzrCDlqJvvxRFLOwqqJnH5MA6TEFISzWvj2FFy4h5OUNCVkTZpJvwHeJ6yk9ulbRQdjKFAEg"/>
                            </div>
                            <div>
                              <p className="text-lg font-bold text-[#0b1c30]">Direction RH, Bralima S.A.</p>
                              <p className="text-xs text-[#6d7a72] mt-1 font-medium">Kinshasa, RDC</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 gap-10">
                        <h3 className="text-xs text-[#6d7a72] uppercase tracking-[0.3em] font-semibold mb-2">Dernières Actualités</h3>
                        
                        <div onClick={() => navigateTo('/modules')} className="flex gap-8 items-center group cursor-pointer border-b border-slate-100 pb-8 hover:bg-[#eff4ff]/50 p-4 -ml-4 rounded-2xl transition-colors">
                          <div className="w-32 h-32 rounded-[1.25rem] overflow-hidden shrink-0 shadow-sm border border-slate-100">
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Medical tablet" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAY-Kb0_ok9dEbRY-Yv3jtlpE65jPrAiEEvx_dN4tgmzFfcUJhLZNl0849-KvNcgq4alLZs94sy7RikIW7zVm8wm0yneKHSX-S4XKktcFV-RmkV7Dn_tTsJJeJkpMHcDR3GhudxwMzMBAl9Sk2QtBd037J2gEXfdL6YDF40JwmAkokyMOQiTRuQj9PYGoC4A29f3Og_-hFQW7aD39LzIGPy1vMkgZrEQJKP5R6sDU-kc74JtNCVUNN6Sg"/>
                          </div>
                          <div>
                            <p className="text-xs text-[#006c4a] font-bold mb-3 uppercase tracking-wider">Digitalisation</p>
                            <h4 className="text-[22px] font-bold text-[#0b1c30] group-hover:text-[#006c4a] transition-colors leading-tight">NeoGTec déploie la télémédecine dans le Lualaba</h4>
                          </div>
                        </div>

                        <div onClick={() => navigateTo('/arca-rdc')} className="flex gap-8 items-center group cursor-pointer border-b border-slate-100 pb-8 hover:bg-[#eff4ff]/50 p-4 -ml-4 rounded-2xl transition-colors">
                          <div className="w-32 h-32 rounded-[1.25rem] overflow-hidden shrink-0 shadow-sm border border-slate-100">
                            <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Official seal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAGzauIw3F1uRcAJUQUegLdjb3jX6o2ZB-3ownMCVH1kYZZr6Kpcjl-iFp-tO-AJg30hP_WHYlfp0Tk5Cw00S-DpvZcWo6aEbJGmFzVWh3uA9g8vh12dJme6u60SJ17BiPOVWO2_oZ1SM0x5i8YSP_StxwgTYJZarrxImjq8AvClFcthAZURs5oNqtAh2y5MlZCGAhG44DfUbeK3Hxl5r2-kpNFCafpwDyAhySPQiCBwngXbqtyNW5iBg"/>
                          </div>
                          <div>
                            <p className="text-xs text-[#006c4a] font-bold mb-3 uppercase tracking-wider">Conformité</p>
                            <h4 className="text-[22px] font-bold text-[#0b1c30] group-hover:text-[#006c4a] transition-colors leading-tight">Renouvellement de l'agrément ARCA pour 2026</h4>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 10. Accréditations */}
                <section className="bg-white py-24 border-y border-slate-100">
                  <div className="max-w-[1440px] mx-auto px-6 md:px-10">
                    <p className="text-center text-[#6d7a72] text-[13px] font-semibold uppercase tracking-[0.25em] mb-16">Accréditations &amp; Certifications Internationales</p>
                    <div className="flex flex-wrap justify-center items-center gap-24 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                      <img className="h-16 object-contain mix-blend-multiply" alt="ARCA-RDC seal" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB0sh-AUarMdA9CXoNwjh452qPTov8H-K_-PKUvWBSl1y4BXZMC1CGsN_-ObAIgIhlsXgaApcSWodSqM7g-iAptAftVa9W8_2fLtpiFgUT1hPtGLUbq0PmgqsINjtGzLZqZFAez5yhYRj3H3R294_vB7ySzPAmuAagEy23kfjJiRu6OXw1S02vcVi2FXGZ3J7EEYfpC5VaAOBlqNp-C-DHNC9DSB9TnhE9Zfuzca-YbC-PIrnw6S2scyA"/>
                      <img className="h-16 object-contain mix-blend-multiply" alt="ISO 27001" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBkEiGKRKczGVqjmn9mcZKYV77ky3NeQ-cDahdPCzzVIU0sBjhiQhh3-JIbvDGfV98ezpTj_Y7cZRBcRBf19Ip0dKD2J8DpJ6g-09kz1WvKMyOR45mJiy9o0rHw_oycrK6vUhU5TT7aD_4Jpkuhcb5a_EM5j-QlBtA1na3tVn0PQswfB6YgCr9VL8IQ70X3uduzzU06seIW7GaJFgdbWuT_fWhzdjaAzNoKrRouXcI6WBrwrWk-lqeN1g"/>
                      <img className="h-16 object-contain mix-blend-multiply" alt="Ministère de la Santé RDC" src="https://lh3.googleusercontent.com/aida-public/AB6AXuChFZa_qTVSFBd-01Vjfsuri02wOZveqd5FJfwN0Pc19ppDJ0gTC9jfCX-rIxPEnk2FOZbxyDn_4tM66uphcVUlYAkUOKhBX0HhReWWlW_bQmjAYiW1FNY8n3sb23A82c45Rs1GeP9YSn98aGrUO80WxpFmUNBfmHc5fmplY7JLV11UtNa7hgKEX_bI8w4J2WIxr84NvNWZppZDpLrf-2MTFj49ssnIgYo5k0jxVsFW-GChl-YyT1BOVQ"/>
                      <img className="h-16 object-contain mix-blend-multiply" alt="WHO Africa" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA6vcfh12SDFTkUm3Iel-QYgDuPkiTiBFrDP43BQ25USN0mejiKSw5k-vxjc-oW0cf-oUEqz8rzD3NJRuTR2sqjSIIAI8L8EQi8HZyGlekYEFfQAlCTaK3miyEHbpbr95ZU8PS0-S2whEhZcHIswFErNmSCtzOegWd0hswqVaukgQSm05_kfYpWDcNLGU3rJJUAS2nDNfjDaZUIqT5YJtzRp9PXQpop2VSYSafzT6BI1bPxt-_Dzkq1uw"/>
                    </div>
                  </div>
                </section>

                {/* 11. Carte des Hubs */}
                <section className="py-40 bg-slate-50 relative overflow-hidden text-left">
                  <div className="max-w-[1440px] mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-20 lg:gap-32 items-center">
                    <div className="space-y-12">
                      <h2 className="text-4xl md:text-[48px] font-bold text-[#0b1c30] leading-tight">Un Réseau Panafricain</h2>
                      <p className="text-lg text-[#3d4a42] leading-relaxed text-[20px]">Nos centres de contrôle et de support technique sont stratégiquement répartis pour garantir une latence minimale et une conformité régionale totale.</p>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="p-10 bg-white rounded-[2rem] border border-slate-200 hover:border-[#006c4a]/50 hover:shadow-xl transition-all shadow-sm">
                          <p className="text-[24px] font-bold text-[#0b1c30] mb-3">Kinshasa</p>
                          <p className="text-sm text-[#6d7a72]">Siège Social &amp; Data Center</p>
                        </div>
                        <div className="p-10 bg-white rounded-[2rem] border border-slate-200 hover:border-[#006c4a]/50 hover:shadow-xl transition-all shadow-sm">
                          <p className="text-[24px] font-bold text-[#0b1c30] mb-3">Lubumbashi</p>
                          <p className="text-sm text-[#6d7a72]">Innovation &amp; AI Lab</p>
                        </div>
                        <div className="p-10 bg-white rounded-[2rem] border border-slate-200 hover:border-[#006c4a]/50 hover:shadow-xl transition-all shadow-sm">
                          <p className="text-[24px] font-bold text-[#0b1c30] mb-3">Abidjan</p>
                          <p className="text-sm text-[#6d7a72]">Support Afrique de l'Ouest</p>
                        </div>
                        <div className="p-10 bg-white rounded-[2rem] border border-slate-200 hover:border-[#006c4a]/50 hover:shadow-xl transition-all shadow-sm">
                          <p className="text-[24px] font-bold text-[#0b1c30] mb-3">Lagos</p>
                          <p className="text-sm text-[#6d7a72]">Ops. &amp; Logistique</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-full h-[500px]">
                      <InteractiveMap />
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* 2. RISQUES VIEW */}
            {currentRoute === '/risques' && (
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24">
                <div className="text-center max-w-2xl mx-auto space-y-4 select-none">
                  <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-[10px] font-mono font-black text-red-650 uppercase">
                    🚨 Fuite de Trésorerie
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none">
                    5 risques financiers majeurs pour vos RH
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold mb-6">
                    L&apos;activation des accords de santé manuels par fiches d&apos;admissions collectives détruit vos finances.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                  {risksList.map((rk) => (
                    <div 
                      key={rk.id}
                      className="border border-slate-205 bg-white p-6 rounded-md hover:border-red-500/30 transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-9 h-9 bg-red-50 rounded-[4px] flex items-center justify-center text-red-600">
                          <AlertTriangle className="w-5 h-5" />
                        </div>
                        <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight font-mono">{rk.title}</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">{rk.description}</p>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-mono font-bold text-red-600 uppercase">
                        ★ {rk.impact}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 border border-[#00A86B]/25 rounded-[8px] p-8 text-center max-w-4xl mx-auto space-y-5 select-none">
                  <h3 className="text-lg font-black uppercase text-slate-900">
                    Vous souhaitez éradiquer definitivement ces pertes d&apos;assurances ?
                  </h3>
                  <p className="text-xs text-slate-600 font-bold max-w-lg mx-auto leading-relaxed">
                    Découvrez comment nous raccordons les admissions en ligne de nos cliniques éligibles et transformons les flux.
                  </p>
                  <div className="flex flex-col sm:flex-row justify-center gap-3">
                    <button 
                      onClick={() => navigateTo('/solutions')}
                      className="h-10 px-5 bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-[11px] uppercase rounded-[8px] cursor-pointer"
                    >
                      Voir nos 5 Solutions Anti-fraude
                    </button>
                    <button 
                      onClick={() => navigateTo('/affiliation')}
                      className="h-10 px-5 bg-white border text-slate-900 hover:bg-slate-50 font-black text-[11px] uppercase rounded-[8px] cursor-pointer"
                    >
                      Démarrer mon affiliation rapide
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SOLUTIONS VIEW */}
            {currentRoute === '/solutions' && (
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24 text-left">
                <div className="text-center max-w-2xl mx-auto space-y-4 select-none">
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    🛡️ Technologie Souveraine
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none text-center">
                    Comment NeoGTec supprime ces 5 risques
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold text-center leading-relaxed">
                    Nos briques SaaS panafricaines sécurisent les prises en charge et fluidifient l&apos;accès clinique sous 48h.
                  </p>
                </div>

                <div className="space-y-6 max-w-4xl mx-auto">
                  {solutionsList.map((sol) => (
                    <div 
                      key={sol.id}
                      className="bg-white border rounded-md p-6 md:p-8 hover:border-[#00A86B]/20 transition-all shadow-sm flex flex-col md:flex-row gap-6 items-start"
                    >
                      <div className="w-10 h-10 rounded-[4px] bg-green-55/10 border border-[#00A86B]/10 flex items-center justify-center shrink-0 text-[#00A86B]">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight font-mono">{sol.title}</h3>
                          <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 rounded-[4px] px-2 py-0.5">⚙️ VALIDATION EXPRESS</span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">{sol.desc}</p>
                        <div className="bg-red-50 border border-red-100 rounded-[4px] p-3 text-[10px] font-mono font-black uppercase text-red-700">
                          ✓ CONFLIT ÉCARTE : {sol.risk}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-green-50 border border-[#00A86B]/20 rounded-[8px] p-8 text-center max-w-3xl mx-auto space-y-5 select-none">
                  <h3 className="text-lg font-black uppercase text-slate-900">Configurez votre package technologique</h3>
                  <p className="text-xs text-slate-600 font-bold max-w-sm mx-auto leading-relaxed">
                    Parcourez la grille complète de nos 16 modules. Choisissez vos options sans surcoût.
                  </p>
                  <div>
                    <button 
                      onClick={() => navigateTo('/modules')}
                      className="h-10 px-6 bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-[11px] uppercase rounded-[8px] cursor-pointer"
                    >
                      Explorer les 16 modules à la carte
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 4. MODULES VIEW */}
            {currentRoute === '/modules' && (
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24 text-left">
                <div className="text-center max-w-2xl mx-auto space-y-4 select-none">
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    📦 Catalogue Modulaire
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none text-center">
                    16 modules à la carte
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold text-center leading-relaxed">
                    Ne payez aucun abonnement d&apos;infrastructure imposé. Ajoutez les modules à votre simulation pour calculer le coût.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {modulesList.map((m) => {
                    const isAddon = m.type === "Add-on";
                    const isSelected = cart.includes(m.name);
                    return (
                      <div 
                        key={m.id}
                        className={cn(
                          "bg-white border rounded-md p-5 hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer relative",
                          isSelected ? "border-[#00A86B] ring-2 ring-[#00A86B]/15" : "border-slate-200"
                        )}
                        onClick={() => setActiveModuleModal(m)}
                      >
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="w-8 h-8 bg-slate-50 border rounded-[4px] flex items-center justify-center shrink-0 text-[#00A86B]">
                              <Activity className="w-4 h-4" />
                            </div>
                            <span className={cn(
                              "text-[8.5px] font-mono font-black uppercase rounded-[4px] px-2 py-0.5 border",
                              isAddon ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-green-50 border-green-100 text-[#00A86B]"
                            )}>
                              {isAddon ? `+${m.price}$/m` : "Inclus"}
                            </span>
                          </div>

                          <h3 className="text-xs font-black uppercase text-slate-900 tracking-tight font-mono leading-none">{m.name}</h3>
                          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{m.benefit}</p>
                        </div>

                        <div className="mt-6 pt-3.5 border-t border-slate-50 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => toggleCartModule(m.name)}
                            className={cn(
                              "h-7 w-full text-[9px] font-black uppercase tracking-wider rounded-[4px] border cursor-pointer flex items-center justify-center gap-1 transition-all select-none",
                              isSelected 
                                ? "bg-[#00A86B] text-white border-[#00A86B]" 
                                : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200"
                            )}
                          >
                            {isSelected ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{isSelected ? "Dans mon devis" : "Ajouter"}</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {cart.length > 0 && (
                  <div className="bg-[#0b1320] text-white rounded-[8px] p-6 text-left max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-white/5 font-mono select-none">
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-slate-400">Simulation de Devis de souscription de Tiers Payant</p>
                      <h4 className="text-sm font-extrabold text-[#00A86B]">
                        {cart.length} Module{cart.length > 1 ? 's' : ''} sélectionné{cart.length > 1 ? 's' : ''} pour votre entreprise
                      </h4>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => setCart([])}
                        className="h-10 px-4 rounded-[8px] hover:bg-white/10 text-slate-300 font-bold text-[11px] uppercase cursor-pointer"
                      >
                        Vider
                      </button>
                      <button 
                        onClick={() => navigateTo('/affiliation')}
                        className="h-10 px-6 rounded-[8px] bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-[11px] uppercase tracking-wider cursor-pointer"
                      >
                        Soumettre mon adhésion
                      </button>
                    </div>
                  </div>
                )}

                {/* detailed module modal popup */}
                {activeModuleModal && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-1000 flex items-center justify-center p-4">
                    <div className="bg-white border rounded-[8px] w-full max-w-md p-6 space-y-6 text-left">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-green-50 rounded-[4px] flex items-center justify-center text-[#00A86B]">
                            <Activity className="w-4.5 h-4.5" />
                          </div>
                          <div>
                            <h3 className="text-xs font-black uppercase text-slate-900 font-mono leading-none">{activeModuleModal.name}</h3>
                            <span className="text-[8px] font-mono text-slate-400 uppercase font-bold">{activeModuleModal.type} module</span>
                          </div>
                        </div>
                        <button onClick={() => setActiveModuleModal(null)} className="text-xs text-slate-400 hover:text-slate-900 cursor-pointer">✕</button>
                      </div>

                      <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                        {activeModuleModal.desc}
                      </p>

                      <div className="bg-green-50 border border-[#00A86B]/15 rounded-[4px] p-3 text-xs text-[#00A86B] font-bold font-mono">
                        ✓ Avantage clé : {activeModuleModal.benefit}
                      </div>

                      <div className="border-t pt-5 mt-6 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400">Tarif optionnel : {activeModuleModal.price > 0 ? `+${activeModuleModal.price}$ /m` : "Inclus"}</span>
                        <button 
                          onClick={() => {
                            toggleCartModule(activeModuleModal.name);
                            setActiveModuleModal(null);
                          }}
                          className="h-9 px-4 rounded-[6px] bg-[#00A86B] text-white hover:bg-[#008d59] text-xs font-black uppercase cursor-pointer"
                        >
                          {cart.includes(activeModuleModal.name) ? "Retirer du devis" : "Ajouter au devis"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. TARIFS VIEW */}
            {currentRoute === '/tarifs' && (
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24 text-left">
                <div className="text-center max-w-2xl mx-auto space-y-4 select-none animate-fadeIn">
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    💰 Abonnements Annuels
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none text-center">
                    Grille tarifaire par salarié
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold text-center leading-relaxed">
                    S&apos;adapte parfaitement au volume de collaborateurs exclusifs de votre structure d&apos;assurance B2B.
                  </p>
                </div>

                <div className="bg-slate-100 border border-slate-200 p-4 rounded-md max-w-2xl mx-auto text-center text-xs text-slate-650 font-bold select-none flex items-center justify-center gap-1.5 font-mono">
                  <Coins className="w-4 h-4 text-[#00A86B]" />
                  <span>Devise appliquée conversion : <strong className="text-slate-900">{selectedCountry.currency} ({selectedCountry.symbol})</strong>. Modifiez en haut à droite.</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {plansList.map((pl) => {
                    const isRec = pl.recommended;
                    return (
                      <div 
                        key={pl.name}
                        className={cn(
                          "bg-white border rounded-md p-6 lg:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-lg transition-all",
                          isRec ? "border-[#00A86B] ring-2 ring-[#00A86B]/15 scale-[1.01]" : "border-slate-200"
                        )}
                      >
                        {isRec && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00A86B] text-white border border-[#00A86B] font-mono font-black uppercase text-[8.5px] px-3.5 py-1 rounded-full tracking-wider">
                            ★ RECOMMANDÉ COORGANISATION
                          </span>
                        )}

                        <div className="space-y-6">
                          <div>
                            <span className="text-[10px] font-mono font-black text-[#00A86B] uppercase tracking-widest block">{pl.motto}</span>
                            <h3 className="text-lg font-black uppercase text-slate-900 font-mono tracking-tight leading-none pt-1">{pl.name}</h3>
                          </div>

                          <div className="border-y border-slate-100 py-4">
                            <span className="text-3xl font-mono font-black text-slate-900 block leading-tight">
                              {formatPrice(pl.basePriceUsd, "collaborateur / m")}
                            </span>
                          </div>

                          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{pl.desc}</p>

                          <ul className="space-y-2.5 text-xs font-semibold text-slate-600 border-t pt-4">
                            {pl.features.map((ft, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-1.5">
                                <Check className="w-4 h-4 text-[#00A86B] shrink-0 mt-0.5" />
                                <span>{ft}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-8 border-t pt-5">
                          <button 
                            onClick={() => {
                              setValue('contrat_plan', pl.name);
                              navigateTo('/affiliation');
                            }}
                            className={cn(
                              "w-full h-10 text-xs font-black uppercase tracking-wider rounded-[6px] cursor-pointer transition-all",
                              isRec 
                                ? "bg-[#00A86B] text-white hover:bg-[#008d59]" 
                                : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                            )}
                          >
                            Activer le plan {pl.name}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ROI employee volume calculator */}
                <div className="bg-[#0b1320] text-white rounded-[8px] border border-white/5 p-6 md:p-10 text-left max-w-4xl mx-auto space-y-6 shadow-2xl relative overflow-hidden select-none">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono font-black text-[#00A86B] uppercase tracking-widest block">Simulateur d&apos;Économies de Mutuelle</span>
                    <h3 className="text-xl font-extrabold uppercase font-sans">Simulez votre Retour sur Investissement (ROI) NeoGTec</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center font-mono">
                    <div className="md:col-span-6 space-y-4">
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
                        <span>Volume salariés</span>
                        <strong className="text-white text-sm font-black">{roiEmployees} salariés</strong>
                      </div>
                      <input 
                        type="range"
                        min={10}
                        max={3000}
                        step={10}
                        value={roiEmployees}
                        onChange={(e) => setRoiEmployees(parseInt(e.target.value) || 120)}
                        className="w-full accent-[#00A86B]"
                      />
                      <div className="flex justify-between text-[10px] text-slate-500 font-bold">
                        <span>10 salariés</span>
                        <span>3000 salariés</span>
                      </div>
                    </div>

                    <div className="md:col-span-6 bg-white/5 border border-white/10 rounded-md p-5 space-y-3.5">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-300">Coût Moyen Perdues Fraude Papier (15%)</span>
                        <strong className="text-red-500">~ {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(roiEmployees * 2 * 12 * 0.15)} / an</strong>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2.5 text-xs text-[#00A86B]">
                        <span className="font-bold">Gain anti-fraude garanti via QR Code</span>
                        <strong className="font-black uppercase">Sécurisé !</strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 6. FAQ VIEW */}
            {currentRoute === '/faq' && (
              <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 space-y-12 pb-24 text-left">
                <div className="text-center max-w-2xl mx-auto space-y-4 select-none">
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    💬 FAQ &amp; Centre d’Assistance
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none text-center">
                    Questions fréquentes des DRH
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold text-center leading-relaxed">
                    Saisissez un mot-clé ci-dessous pour filtrer en direct nos réponses réglementaires ARCA.
                  </p>
                </div>

                <div className="max-w-xl mx-auto relative select-none">
                  <input 
                    type="text"
                    value={searchFAQ}
                    onChange={(e) => setSearchFAQ(e.target.value)}
                    placeholder="Filtrer questions (ex: arca, données, internet, congés)..."
                    className="w-full h-11 px-4 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-[#00A86B]/15 focus:border-[#00A86B] font-mono"
                  />
                  {searchFAQ && (
                    <button onClick={() => setSearchFAQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 text-xs font-mono font-bold">Effacer</button>
                  )}
                </div>

                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, i) => {
                      const isO = openFAQIndex === i;
                      return (
                        <div 
                          key={faq.q}
                          className="border border-slate-200 rounded-md overflow-hidden bg-white hover:bg-slate-50 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFAQIndex(isO ? null : i)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                          >
                            <span className="flex items-center gap-2.5 text-xs font-black uppercase text-slate-900 font-mono tracking-tight leading-tight">
                              <HelpCircle className="w-4.5 h-4.5 text-[#00A86B] shrink-0" />
                              {faq.q}
                            </span>
                            {isO ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </button>
                          {isO && (
                            <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-500 font-semibold border-t border-slate-100 leading-relaxed font-sans">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-md p-10 text-center select-none font-mono text-slate-450 font-bold">
                       Aucun résultat pour cette recherche.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 7. TUNNEL AFFILIATION VIEW */}
            {currentRoute === '/affiliation' && (
              <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 space-y-12 pb-24 text-left">
                <div className="text-center max-w-xl mx-auto space-y-4 select-none">
                  <span className="inline-flex items-center gap-1 bg-green-50 border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    ⚡ Devis d’affiliation instantané
                  </span>
                  <h1 className="text-3xl font-extrabold uppercase text-slate-900 tracking-tight leading-none text-center">
                    Affiliez votre entreprise en 5 min
                  </h1>
                </div>

                <div className="bg-white border rounded-[8px] p-6 md:p-10 shadow-sm relative">
                  
                  {/* Stepper Status layout */}
                  <div className="flex items-center justify-between border-b pb-6 mb-8 text-[11px] font-mono font-black text-slate-400 select-none">
                    <span className={cn(formStep >= 1 ? "text-[#00A86B]" : "text-slate-400")}>1. Raison Sociale</span>
                    <span className="text-slate-300">/</span>
                    <span className={cn(formStep >= 2 ? "text-[#00A86B]" : "text-slate-400")}>2. Signature DRH</span>
                    <span className="text-slate-300">/</span>
                    <span className={cn(formStep >= 3 ? "text-[#00A86B]" : "text-slate-400")}>3. Configuration</span>
                  </div>

                  {formServerError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-850 text-xs font-bold font-mono">
                      ⚠️ {formServerError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onLeadFormSubmit)} className="space-y-6">
                    {/* Bot honeypot */}
                    <input type="text" {...register('website_url_field')} className="hidden animate-none" />

                    {/* Step 1: Company */}
                    {formStep === 1 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4 font-sans text-xs">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Raison Sociale (Numéro National / RCCM)</label>
                          <input 
                            type="text"
                            {...register('raison_sociale', { required: "Raison sociale obligatoire." })}
                            placeholder="Ex: ACME CONGO SARL"
                            className="w-full h-11 px-4 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none"
                          />
                          {errors.raison_sociale && <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.raison_sociale.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Nombre de salariés à couvrir</label>
                            <input 
                              type="number"
                              {...register('nb_employes', { required: "Veuillez dresser l'effectif.", min: { value: 10, message: "10 salariés minimum." } })}
                              placeholder="Ex: 150"
                              className="w-full h-11 px-4 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none font-mono"
                            />
                            {errors.nb_employes && <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.nb_employes.message}</span>}
                          </div>

                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Assureur ou Mutuelle actuelle</label>
                            <input 
                              type="text"
                              {...register('assureur_actuel', { required: "Champ obligatoire ou 'Aucun'." })}
                              placeholder="Ex: AXA, Sunu ou Aucun"
                              className="w-full h-11 px-4 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none"
                            />
                            {errors.assureur_actuel && <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.assureur_actuel.message}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Contact */}
                    {formStep === 2 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4 font-sans text-xs">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Nom complet du signataire mandataire</label>
                          <input 
                            type="text"
                            {...register('nom', { required: "Nom mandataire obligatoire." })}
                            placeholder="Ex: Paul MUKENDI"
                            className="w-full h-11 px-4 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none"
                          />
                          {errors.nom && <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.nom.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">E-mail Professionnel</label>
                            <input 
                              type="email"
                              {...register('email_pro', { required: "E-mail obligatoire." })}
                              placeholder="Ex: p.mukendi@acme-congo.cd"
                              className="w-full h-11 px-4 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none font-mono"
                            />
                            {errors.email_pro && <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.email_pro.message}</span>}
                          </div>

                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Téléphone RDC (+243...)</label>
                            <input 
                              type="text"
                              {...register('phone', { required: "Téléphone obligatoire (ex: +243...)" })}
                              placeholder="Ex: +243 812 345 678"
                              className="w-full h-11 px-4 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none font-mono"
                            />
                            {errors.phone && <span className="text-[10px] text-red-650 font-bold block mt-1">{errors.phone.message}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Confirmation */}
                    {formStep === 3 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6 font-sans text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Formule d&apos;adhésion</label>
                            <select 
                              {...register('contrat_plan')}
                              className="w-full h-11 px-3 border border-slate-205 rounded-[6px] text-xs font-bold bg-white focus:outline-none"
                            >
                              <option value="Silver">Silver Formula</option>
                              <option value="Gold">Gold Formula Pro</option>
                              <option value="Platinum">Platinum Ultimate</option>
                            </select>
                          </div>

                          <div className="bg-slate-100 p-3 rounded-md border flex flex-col justify-center">
                            <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase">Abonnement unifié estimé</span>
                            <strong className="text-slate-900 text-xs font-mono font-black pt-0.5">
                              {selectedPlan === 'Silver' && formatPrice(2, "salarié")}
                              {selectedPlan === 'Gold' && formatPrice(5, "salarié")}
                              {selectedPlan === 'Platinum' && formatPrice(8, "salarié")}
                            </strong>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Messages et requêtes RH</label>
                          <textarea 
                            rows={3}
                            {...register('message')}
                            placeholder="Détaillez vos pathologies à exclure, vos succursales géographiques..."
                            className="w-full p-3 border border-slate-205 rounded-[6px] text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-[#00A86B]/15"
                          />
                        </div>

                        {/* Interactive Captcha Security Box */}
                        <div className="bg-slate-50 border border-slate-200 p-4 rounded-md max-w-sm flex items-center justify-between gap-4 select-none">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              id="custom-hcaptcha-field"
                              checked={captchaChecked}
                              onChange={(e) => setCaptchaChecked(e.target.checked)}
                              className="w-[18px] h-[18px] accent-[#00A86B] cursor-pointer"
                            />
                            <label htmlFor="custom-hcaptcha-field" className="text-[11px] font-black text-slate-700 cursor-pointer">
                              Je ne suis pas un robot (hCaptcha)
                            </label>
                          </div>
                          <div className="w-[30px] animate-pulse shrink-0">
                            <ShieldCheck className="w-6.5 h-6.5 text-[#00A86B]" />
                          </div>
                        </div>

                        <div className="text-[9.5px] font-semibold text-slate-400">
                          Saisie cryptée confidentielle en conformité avec l&apos;accord ARCA RDC.
                        </div>
                      </motion.div>
                    )}

                    {/* Navigation actions of step form */}
                    <div className="border-t pt-6 mt-8 flex items-center justify-between select-none">
                      {formStep > 1 ? (
                        <button 
                          type="button" 
                          onClick={() => setFormStep(prev => prev - 1)}
                          className="h-10 px-4 rounded-[6px] border text-slate-705 font-extrabold uppercase text-xs cursor-pointer bg-white"
                        >
                          Précédent
                        </button>
                      ) : <div />}

                      {formStep < 3 ? (
                        <button 
                          type="button" 
                          onClick={handleNextFormStep}
                          className="h-10 px-5 rounded-[6px] bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-xs uppercase cursor-pointer"
                        >
                          Suivant
                        </button>
                      ) : (
                        <button 
                          type="submit" 
                          disabled={isSubmittingForm}
                          className="h-10 px-6 rounded-[6px] bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-xs uppercase cursor-pointer disabled:opacity-50 min-w-[10rem]"
                        >
                          {isSubmittingForm ? <Loader2 className="w-4 h-4 animate-spin block mx-auto" /> : "Créer mon Affiliation"}
                        </button>
                      )}
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* 8. CONFIDENTIALITE CARD */}
            {currentRoute === '/confidentialite' && (
              <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 space-y-8 pb-24 text-left font-sans text-slate-800">
                <div className="border-b pb-4">
                  <h1 className="text-3xl font-extrabold uppercase text-slate-900 tracking-tight">Politique de confidentialité NeoGTec</h1>
                  <p className="text-xs text-[#00A86B] font-mono font-bold uppercase mt-1">Conformité Loi n°18/035 & Régulation ARCA-RDC</p>
                </div>

                <div className="space-y-6 text-sm leading-relaxed font-semibold">
                  <section className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900">1. Hébergement des données</h2>
                    <p className="text-slate-650">
                      Toutes les données de santé de nos assurés et entreprises partenaires sont stockées souverainement au sein de notre infrastructure physique à Kinshasa, Gombe (Serveur principal IP: <code className="font-mono bg-slate-100 text-[#00A86B] px-1.5 py-0.5 rounded">41.243.12.8</code>). Ce centre d&apos;hébergement est certifié aux standards de sécurité ISO 27001.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900">2. DPO Contact</h2>
                    <p className="text-slate-650">
                      Notre délégué à la protection des données (DPO) veille à la parfaite application de la régulation de confidentialité. Vous pouvez le contacter à l&apos;adresse email dédiée : <a href="mailto:dpo@neogtec.cd" className="text-[#00A86B] underline h-12 inline-flex items-center">dpo@neogtec.cd</a>.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900">3. Vos droits Loi 18/035</h2>
                    <p className="text-slate-650">
                      Conformément aux dispositions de la Loi n°18/035, chaque collaborateur d&apos;entreprise rattaché dispose d&apos;un droit d&apos;accès, de rectification et d&apos;opposition. Vous pouvez soumettre une demande de suppression définitive de vos logs de consommation et documents médicaux via l&apos;onglet <strong className="text-slate-900">Profil &gt; Confidentialité</strong> de votre espace client.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900">4. Gestion des cookies</h2>
                    <p className="text-slate-650">
                      NeoGTec n&apos;utilise que des traceurs d&apos;authentification et de routage technique strictement indispensables au bon fonctionnement de l&apos;espace de courtage B2B de santé. Aucun traceur publicitaire ou commercial externe n&apos;est toléré.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h2 className="text-lg font-bold text-slate-900">5. ARCA-RDC</h2>
                    <p className="text-slate-650">
                      En qualité de courtier d&apos;assurance technologique agréé sous la licence nationale officielle n°ARCA/2025/0127, NeoGTec transmet des audits trimestriels sécurisés de Tiers-Payant directement à l&apos;autorité de tutelle ARCA-RDC dans un canal de cryptage de bout en bout.
                    </p>
                  </section>
                </div>

                <div className="pt-6 border-t flex gap-4">
                  <button onClick={() => navigateTo('/')} className="h-12 min-w-12 px-5 bg-[#00A86B] hover:bg-[#007D4C] text-white text-xs font-black uppercase rounded-[6px] transition-colors cursor-pointer select-none">
                    Retourner à l&apos;accueil
                  </button>
                </div>
              </div>
            )}

            {/* 9. CGU CARD */}
            {currentRoute === '/cgu' && (
              <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 space-y-8 pb-24 text-left font-sans">
                <h1 className="text-3xl font-extrabold uppercase text-slate-900 tracking-tight">Conditions Générales d&apos;Utilisation de NeoGTec SaaS</h1>
                <p className="text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                  L&apos;usage de nos modules d&apos;éligibilité et du clearing de soins implique l&apos;acceptation contractuelle inconditionnelle des présentes conditions.
                </p>
                <button onClick={() => navigateTo('/')} className="h-10 px-5 bg-[#00A86B] text-white hover:bg-[#008d59] text-xs font-black uppercase rounded-[6px]">Retour</button>
              </div>
            )}

            {/* 10. ARCA RDC CARD */}
            {currentRoute === '/arca-rdc' && (
              <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 space-y-8 pb-24 text-left font-sans">
                <h1 className="text-3xl font-extrabold uppercase text-slate-900 tracking-tight">Agrément National ARCA-RDC</h1>
                <p className="text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                  NeoGTec opère en qualité de courtier technologique officiel immatriculé sous la décision réglementaire CD-41098.
                </p>
                <button onClick={() => navigateTo('/')} className="h-10 px-5 bg-[#00A86B] text-white hover:bg-[#008d59] text-xs font-black uppercase rounded-[6px]">Retour</button>
              </div>
            )}

            {/* 11. MERCI SUCCESS VIEW WITH CONFETTI */}
            {currentRoute === '/merci' && (
              <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8 space-y-8 pb-24 text-center relative">
                <DynamicConfetti />
                
                <div className="w-16 h-16 bg-green-50 text-[#00A86B] rounded-full flex items-center justify-center mx-auto border border-green-200">
                  <CheckCircle2 className="w-10 h-10 animate-bounce" />
                </div>

                <div className="space-y-4 font-sans">
                  <h1 className="text-3xl font-extrabold uppercase text-slate-900 tracking-tight leading-none">
                    Dossier d&apos;affiliation envoyé !
                  </h1>
                  <p className="text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed max-w-md mx-auto">
                    Merci. Notre conseiller technique <strong className="text-[#00A86B]">Paul</strong> a reçu vos effectifs et vos modules requis. Paul vous contactera sous 24h ouvrées.
                  </p>
                </div>

                <div className="bg-slate-900 text-white rounded-md p-6 max-w-md mx-auto border border-white/5 space-y-4 font-mono select-none">
                  <span className="text-[10px] text-[#00A86B] font-black uppercase tracking-wider block">🔒 PRIORITÉ DIRECTE CALENDLY</span>
                  <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                     Planifiez une consultation directe sur Calendly pour une démo en direct de notre scanner QR Code.
                  </p>
                  <button 
                    onClick={() => window.open('https://calendly.com/', '_blank')}
                    className="h-10 px-5 bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-[11px] uppercase rounded-[6px] cursor-pointer w-full"
                  >
                    Réserver mon rendez-vous
                  </button>
                </div>

                <div>
                  <button onClick={() => navigateTo('/')} className="h-10 px-5 bg-white border text-slate-700 hover:bg-slate-50 font-black text-xs uppercase rounded-[6px] cursor-pointer">
                    Retourner à la page d&apos;accueil
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 🔴 FOOTER DEEP SLATE BLOCK (Exact Match Screenshot 6) */}
      <footer className="bg-[#090D14] text-white border-t border-white/5 py-16 text-left select-none relative z-10 font-sans">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 leading-snug">
            
            <div className="md:col-span-4 space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
                <div className="w-7 h-7 bg-[#00A86B] text-white rounded-[5px] flex items-center justify-center font-black">N</div>
                <strong className="text-white font-extrabold uppercase text-xs tracking-wider">NeoGTec SaaS</strong>
              </div>
              <p className="text-[11.5px] text-slate-400 leading-relaxed max-w-sm">
                Agrégateur technique B2B d&apos;assurance santé agréé par l&apos;ARCA-RDC. Nous supprimons la paperasse et combattons la fraude médicale d&apos;identité par le QR code dynamique en République Démocratique du Congo.
              </p>
              <div className="text-[9px] font-mono text-slate-500 font-black space-y-0.5 uppercase tracking-wide">
                <p>👤 ENREGISTREMENT REGAL : NeoGTec SARL</p>
                <p>📂 RCCM : CD/KIN/RCCM/24-B-08310</p>
                <p>📃 AGRÉMENT DE TUTELLE : CD-41098 • DECISION ARCA 2026</p>
              </div>
            </div>

            <div className="md:col-span-3 space-y-3">
              <span className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider block">Bureaux Nationaux</span>
              <p className="text-[11.5px] text-slate-400 font-semibold leading-relaxed">
                RDC (Kinshasa, Gombe), Côte d&apos;Ivoire (Abidjan, Plateau), Kenya (Nairobi), Nigeria (Lagos).
              </p>
              <div className="pt-2">
                <span className="inline-block border border-white/10 bg-white/5 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-slate-400 font-bold uppercase tracking-wider">
                  Hébergement RDC Local
                </span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-3">
              <span className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider block">Sitemap</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li><button onClick={() => navigateTo('/risques')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">5 Risques RH</button></li>
                <li><button onClick={() => navigateTo('/solutions')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">Nos Solutions</button></li>
                <li><button onClick={() => navigateTo('/modules')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">16 Modules</button></li>
                <li><button onClick={() => navigateTo('/tarifs')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">Nos Tarifs</button></li>
                <li><button onClick={() => navigateTo('/faq')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">FAQ Assistance</button></li>
              </ul>
            </div>

            <div className="md:col-span-3 space-y-3">
              <span className="text-[10px] font-mono font-black uppercase text-slate-500 tracking-wider block">Régulations &amp; Contacts</span>
              <ul className="space-y-2 text-xs font-bold text-slate-300">
                <li><button onClick={() => navigateTo('/confidentialite')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">Politique Loi n°18/035</button></li>
                <li><button onClick={() => navigateTo('/cgu')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">Conditions d&apos;usage</button></li>
                <li><button onClick={() => navigateTo('/arca-rdc')} className="hover:text-[#00A86B] cursor-pointer text-left block w-full">Agrément ARCA-RDC</button></li>
                <li className="pt-3 text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">📞 SUPPORT: contact@neogtec.cd</li>
                <li className="text-[10px] font-mono text-slate-500 uppercase tracking-widest leading-none">📍 ADRESSE: Crisco Duo, Gombe, Kinshasa</li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-8 text-center text-[10px] font-mono text-slate-500 font-bold flex flex-wrap justify-between items-center gap-4">
            <p>© {new Date().getFullYear()} NeoGTec SARL. Tous droits réservés. Agréé ARCA-RDC CD-41098. Données sauvegardées en Kinshasa.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer" onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}>🌍 {language === 'fr' ? 'FR' : 'EN'}</span>
            </div>
          </div>
        </div>
      </footer>

      <YoutubeDialog isOpen={isYoutubeOpen} onClose={() => setIsYoutubeOpen(false)} />

    </div>
  );
}
