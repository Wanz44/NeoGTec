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
      
      {/* 🔴 BRAND BANNER EXACTLY AS CRAYON WARNING/ALERT BLOCK */}
      <ComplianceBanner />

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
                
                 {/* 🌌 HERO SECTION WITH HIGH-PERFORMANCE AMBIENT BG VIDEO */}
                 <section className="relative pt-36 pb-32 md:pt-44 md:pb-40 overflow-hidden select-none bg-slate-950">
                   {/* High performance video with poster placeholder for tight 3G budgets */}
                   <video 
                     poster="/src/assets/images/phare_poster_1781707154568.jpg" 
                     autoPlay 
                     muted 
                     loop 
                     playsInline 
                     preload="none" 
                     className="absolute inset-0 w-full h-full object-cover opacity-45 select-none pointer-events-none" 
                   />
                   
                   {/* Clean mathematical overlay gradient */}
                   <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-slate-900/30 pointer-events-none" />

                   <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-left">
                     <div className="max-w-3xl space-y-6">
                       <div className="inline-flex items-center gap-2 rounded-full border border-[#00A86B]/40 bg-[#00A86B]/10 px-3.5 py-1 text-[10px] font-black tracking-wider text-green-300 uppercase font-mono">
                         <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B] shrink-0" />
                         <span>Agrément ARCA-RDC n°ARCA/2025/0127 | Conforme v2.1</span>
                       </div>
                       
                       {/* H1 48px: Action-oriented, 11 words */}
                       <h1 className="text-4xl sm:text-5xl lg:text-[48px] font-black uppercase text-white leading-[1.05] tracking-tight">
                         L’assurance santé qui fait gagner <span className="text-[#00A86B]">70% de temps</span> à vos RH
                       </h1>
                       
                       {/* H2 20px: zero jargon */}
                       <h2 className="text-lg sm:text-[20px] font-bold text-slate-350 leading-relaxed max-w-2xl">
                         Zéro papier. 100% traçable ARCA-RDC. Paiement hôpitaux en 24h.
                       </h2>

                       {/* Double CTA */}
                       <div className="flex flex-wrap gap-4 pt-2">
                         <button 
                           onClick={() => {
                             console.log('GTM event: click_cta_demo');
                             if (typeof window !== 'undefined' && (window as any).dataLayer) {
                               (window as any).dataLayer.push({ event: 'click_cta_demo' });
                             }
                             navigateTo('/affiliation');
                           }}
                           className="h-12 px-6 rounded-full bg-[#00A86B] text-white hover:bg-[#007D4C] font-black text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer transition-colors duration-150"
                         >
                           <span>Demander une démo</span>
                           <ArrowRight className="w-4 h-4" />
                         </button>
                         <button 
                           onClick={() => setIsYoutubeOpen(true)}
                           className="h-12 px-6 rounded-full border border-white/30 hover:border-white text-white hover:bg-white/5 font-extrabold text-xs uppercase tracking-wider cursor-pointer flex items-center gap-2 transition-colors duration-150"
                         >
                           <Play className="w-4 h-4 fill-current text-white shrink-0" />
                           <span>Voir la vidéo 2min</span>
                         </button>
                       </div>

                       {/* Social Proof: Bralima, TFM, Rawbank with N&B logos */}
                       <div className="pt-6 space-y-2 select-none">
                         <p className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-widest block">Utilisé par Bralima, TFM, Rawbank</p>
                         <div className="flex items-center gap-6 opacity-70 grayscale">
                           {/* Custom elegant vector inline monochrome representations */}
                           <div className="text-white text-xs font-mono font-black border border-white/20 px-2 py-0.5 tracking-tighter rounded">BRALIMA S.A.</div>
                           <div className="text-white text-xs font-mono font-black border border-white/20 px-2 py-0.5 tracking-tighter rounded">TENKE FUNGURUME</div>
                           <div className="text-white text-xs font-mono font-black border border-white/20 px-2 py-0.5 tracking-tighter rounded">RAWBANK RDC</div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </section>

                {/* 🏷️ OFFRE ET BAREMES SECTION (Point 1.2) */}
                <div data-testid="section-offre-bareme" className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
                  <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl">
                    <div className="text-center max-w-2xl mx-auto mb-8">
                      <span className="text-[10px] font-mono font-black text-[#00A86B] uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">Transparence Actuarielle</span>
                      <h3 className="text-2xl font-black text-slate-950 uppercase italic tracking-tight mt-3">Nos Offres &amp; Barèmes</h3>
                      <p className="text-xs text-slate-500 mt-2">Découvrez en toute transparence les tarifs harmonisés, les taux de remboursement et plafonds par acte médical.</p>
                    </div>
                    <ContractConfig />
                  </div>
                </div>

                {/* 📊 OVERLAPPING THREE STATS COLUMNS PANEL */}
                <section className="relative -mt-10 mx-auto max-w-7xl px-6 lg:px-8 z-20">
                  <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200 shadow-2xl rounded-[8px] overflow-hidden divide-y md:divide-y-0 md:divide-x select-none">
                    <div className="p-8 md:p-10 space-y-3 hover:bg-slate-50 transition-colors">
                      <span className="text-4xl font-black text-slate-900 block font-sans tracking-tight">200 000+</span>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">assurés comptent d&apos;ores et déjà sur NeoGTec</p>
                      <button onClick={() => navigateTo('/modules')} className="text-xs text-[#00A86B] font-black hover:underline cursor-pointer block border-b border-transparent hover:border-[#00386B] pt-1">Découvrez les témoignages de nos clients</button>
                    </div>

                    <div className="p-8 md:p-10 space-y-3 hover:bg-slate-50 transition-colors">
                      <span className="text-4xl font-black text-slate-900 block font-sans tracking-tight">70%</span>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">de baisse de coût de gestion des sinistres</p>
                      <button onClick={() => navigateTo('/risques')} className="text-xs text-[#00A86B] font-black hover:underline cursor-pointer block border-b border-transparent hover:border-[#00386B] pt-1">Découvrez comment réduire vos coûts</button>
                    </div>

                    <div className="p-8 md:p-10 space-y-3 hover:bg-slate-50 transition-colors">
                      <span className="text-4xl font-black text-slate-900 block font-sans tracking-tight">50+</span>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider leading-relaxed">hôpitaux raccordés en direct en Afrique</p>
                      <button onClick={() => navigateTo('/affiliation')} className="text-xs text-[#00A86B] font-black hover:underline cursor-pointer block border-b border-transparent hover:border-[#00386B] pt-1">Devenez partenaire</button>
                    </div>
                  </div>
                </section>

                {/* 🛠️ NOS SERVICES SECTION (Exact Screenshot 2 Match) */}
                <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24 text-left">
                  <div className="space-y-4 mb-16">
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                      Nos Services<span className="text-[#00A86B] font-extrabold">.</span>
                    </h2>
                    <p className="text-[11px] font-mono font-black text-[#00A86B]/90 tracking-widest uppercase">
                      ARCHITECTES DE VOTRE TRANSFORMATION DIGITALE, DE LA STRATÉGIE À L&apos;EXÉCUTION.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    {/* Left grids: 4 services */}
                    <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8 gap-y-12">
                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-black text-[#00A86B]/90 block">RACCORDEMENT CLINIQUE</span>
                        <div className="w-10 h-10 bg-green-50 border border-green-150 rounded-[4px] flex items-center justify-center text-[#00A86B]">
                          <Hospital className="w-6 h-6" />
                        </div>
                        <h3 className="text-[16px] font-black text-slate-900 uppercase">Validation de soins en direct</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">Solutions intelligentes pour valider l&apos;accord de soins en guichet de clinique sans formulaires papier physiques.</p>
                        <button onClick={() => navigateTo('/solutions')} className="text-xs text-[#00A86B] font-bold hover:underline cursor-pointer">En savoir plus</button>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-black text-[#00A86B]/90 block">DÉTECTION DE FRAUDE</span>
                        <div className="w-10 h-10 bg-green-50 border border-green-150 rounded-[4px] flex items-center justify-center text-[#00A86B]">
                          <QrCode className="w-6 h-6 animate-pulse" />
                        </div>
                        <h3 className="text-[16px] font-black text-slate-900 uppercase">Barrage anti-usurpation</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">Le QR Code dynamique se régénère toutes les 24h pour détruire le rachat de cartes et l&apos;emprunt de mutuelle.</p>
                        <button onClick={() => navigateTo('/risques')} className="text-xs text-[#00A86B] font-bold hover:underline cursor-pointer">En savoir plus</button>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-black text-[#00A86B]/90 block">TIERS-PAYANT SOUVERAIN</span>
                        <div className="w-10 h-10 bg-green-50 border border-green-150 rounded-[4px] flex items-center justify-center text-[#00A86B]">
                          <ShieldCheck className="w-6 h-6" />
                        </div>
                        <h3 className="text-[16px] font-black text-slate-900 uppercase">Conformité Loi n°18/035</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">Cryptage des secrets médicaux et hébergement souverain de l&apos;historique clinique sur serveurs nationaux à Kinshasa.</p>
                        <button onClick={() => navigateTo('/solutions')} className="text-xs text-[#00A86B] font-bold hover:underline cursor-pointer">En savoir plus</button>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[10px] font-mono font-black text-[#00A86B]/90 block">CLEARING AUTOMATISÉ</span>
                        <div className="w-10 h-10 bg-green-50 border border-green-150 rounded-[4px] flex items-center justify-center text-[#00A86B]">
                          <Server className="w-6 h-6" />
                        </div>
                        <h3 className="text-[16px] font-black text-slate-900 uppercase">Clôture sinisre accélérée</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">Factures validées et créditées sans retards ni audits laborieux. Clearing transparent des cotisations.</p>
                        <button onClick={() => navigateTo('/solutions')} className="text-xs text-[#00A86B] font-bold hover:underline cursor-pointer">En savoir plus</button>
                      </div>
                    </div>

                    {/* Right column sidebar divider */}
                    <div className="lg:col-span-4 border-l border-slate-200 pl-8 space-y-12">
                      <div className="space-y-4">
                        <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-wide block">Nos Plateformes</span>
                        <ul className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                          {['Portail RH National', 'Portail Médecins raccordés', 'Portail Clinique Admission', 'Portail Inspecteur ARCA'].map((pName, sIdx) => (
                            <li key={sIdx} onClick={() => navigateTo('/modules')} className="py-3 flex items-center justify-between hover:text-[#00A86B] transition-colors cursor-pointer group">
                              <span>{pName}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-4">
                        <span className="text-[11px] font-mono font-black text-slate-400 uppercase tracking-wide block">Notre Excellence Intégrée</span>
                        <ul className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                          {['Sécurité d’audit ISO 27001', 'Autorisation officielle ARCA-RDC CD-41098', 'Réseau de 50 hôpitaux nationaux'].map((pName, sIdx) => (
                            <li key={sIdx} onClick={() => navigateTo('/arca-rdc')} className="py-3 flex items-center justify-between hover:text-[#00A86B] transition-colors cursor-pointer group">
                              <span>{pName}</span>
                              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-1 transition-transform" />
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 📄 COULOMBS COMPLIMENTARY REPORT & EXPANSION BANNER (Exact Screenshot 3 Match) */}
                <section className="bg-white border-y border-slate-200 py-20 text-left select-none">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 items-stretch">
                      
                      {/* Left: IDC Analayst BRIEF equivalent */}
                      <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="text-[10.5px] font-mono font-black text-[#00A86B] uppercase block">DÉCIDEURS RH & FINANCE</span>
                          <h3 className="text-2xl font-black text-slate-900 leading-tight">Prêt pour une meilleure gestion de votre budget santé ?</h3>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            Avoir conscience du climat social de vos collaborateurs n&apos;a jamais été aussi stratégique au Congo. L&apos;optimisation du Tiers Payant numérique de NeoGTec supprime le gaspillage de devises.
                          </p>
                        </div>
                        <button onClick={() => navigateTo('/risques')} className="text-xs text-[#00A86B] font-black hover:underline cursor-pointer block border-b border-transparent w-max">En savoir plus</button>
                      </div>

                      {/* Middle: Complimentary Gartner Report */}
                      <div className="lg:col-span-4 space-y-4 border-l border-slate-200 pl-4 md:pl-8 flex flex-col justify-between">
                        <div className="space-y-3">
                          <span className="text-[10.5px] font-mono font-black text-[#00A86B] uppercase block">RAPPORT EXCLUSIF ARCA RDC</span>
                          <h3 className="text-2xl font-black text-slate-900 leading-tight">Prévisions stratégiques et conformités d&apos;assurances en Afrique 2026</h3>
                          <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                            Découvrez comment la lutte contre la fraude réglementaire et la dématérialisation des fiches d&apos;admissions re-conçoivent les marges financières de vos RH.
                          </p>
                        </div>
                        <button onClick={() => navigateTo('/tarifs')} className="text-xs text-[#00A86B] font-black hover:underline cursor-pointer block border-b border-transparent w-max">Accédez au rapport →</button>
                      </div>

                      {/* Right: High fidelity mountain graphic equivalent container placeholder in brand green theme */}
                      <div className="lg:col-span-4 relative rounded-md overflow-hidden bg-[#090D14] flex items-center justify-center text-center p-8 border border-slate-800">
                        <div className="absolute inset-0 bg-cover bg-center opacity-40 filter grayscale" style={{ backgroundImage: "url('/src/assets/images/neo_lighthouse_1781554684215.jpg')" }} />
                        <div className="relative z-10 space-y-3">
                          <div className="w-12 h-12 rounded-full bg-[#00A86B] text-white flex items-center justify-center mx-auto text-lg font-black shrink-0">✓</div>
                          <h4 className="text-xs font-mono font-black uppercase text-white tracking-widest block">Audit Souverain RDC</h4>
                          <span className="text-[10px] text-slate-400 block font-semibold leading-tight">Aucun cloud étranger n&apos;héberge vos bases médicales salariés.</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </section>

                {/* 🤝 INTERMEDIATE EXECUTIVE PRESS BANNER (Exact Screenshot 3 Match) */}
                <section className="bg-[#0b1320] text-white py-16 text-left select-none">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                      {/* Executives photo silhouette panel */}
                      <div className="lg:col-span-5 relative h-64 rounded-md overflow-hidden bg-cover bg-center border border-white/5" style={{ backgroundImage: "url('/src/assets/images/neo_lighthouse_1781554684215.jpg')" }}>
                        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                        <div className="absolute bottom-4 left-4 font-mono text-[9px] text-green-400 font-black tracking-widest">
                          ★ PARTENAIRES SIGNATURE MOBILISÉE
                        </div>
                      </div>

                      {/* Description column */}
                      <div className="lg:col-span-7 space-y-4">
                        <span className="text-[10px] font-mono text-green-400 font-black uppercase">COMMUNIQUÉ DE PRESSE</span>
                        <h2 className="text-3xl font-black uppercase leading-tight tracking-tight">
                          NeoGTec concrétise son expansion nationale auprès des plus grands groupes industriels et industriels miniers du pays.
                        </h2>
                        <button onClick={() => navigateTo('/cgu')} className="text-xs text-[#00A86B] font-extrabold hover:underline block pt-2">En savoir plus →</button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 🌸 TESTIMONIAL BLOCK & NEWS CARDS (Exact Screenshot 4 Match) */}
                <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24 text-left select-none">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start mb-16">
                    <div className="lg:col-span-5 space-y-5">
                      <span className="text-[11px] font-mono font-black text-[#00A86B] block">TÉMOIGNAGES CLIENTS</span>
                      <h2 className="text-4xl md:text-5xl font-black text-slate-900">
                        Ils nous font confiance<span className="text-[#00A86B] font-extrabold">.</span>
                      </h2>
                      <button 
                        onClick={() => navigateTo('/affiliation')}
                        className="h-11 px-5 rounded-full bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-[11px] uppercase tracking-wider block cursor-pointer transition-all active:scale-[0.98]"
                      >
                        Voir tous les témoignages clients
                      </button>
                    </div>

                    {/* Right text quotes */}
                    <div className="lg:col-span-7 space-y-8">
                      <div className="space-y-2 border-b pb-6 border-slate-100">
                        <h4 className="text-lg font-black text-slate-900 font-mono">Bralima RDC</h4>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed font-sans">
                          &ldquo;Comment la centralisation sur NeoGTec a éliminé les fiches d&apos;admissions papier et sécurisé le climat social de 4000 collaborateurs. Plus de rachat de cartes possibles des cliniques.&rdquo;
                        </p>
                        <button onClick={() => navigateTo('/modules')} className="text-xs text-[#00A86B] font-black hover:underline block pt-1">En savoir plus</button>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-black text-slate-900 font-mono">Tenke Fungurume Mining</h4>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed font-sans">
                          &ldquo;Le choix de NeoGTec s&apos;est imposé comme une évidence pour notre conformité ARCA et la protection de la vie privée Loi 18/035. Fraude d&apos;identité médicale éradiquée en moins d&apos;un trimestre.&rdquo;
                        </p>
                        <button onClick={() => navigateTo('/modules')} className="text-xs text-[#00A86B] font-black hover:underline block pt-1">En savoir plus</button>
                      </div>
                    </div>
                  </div>

                  {/* News 4 Cards Grid - Screenshot 4 lower */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                      { cat: 'NEWS', title: "NeoGTec annonce une réduction moyenne de 70% sur le délai de validation des prises en charge cliniques." },
                      { cat: 'CONFERENCE', title: "Sommet ARCA-RDC : Promouvoir la transparence grâce à la dématérialisation et sécuriser les primes." },
                      { cat: 'INSIGHTS', title: "Intelligence Artificielle : Notre clearing algorithmique identifie les rachets d'assurés en 2 secondes." },
                      { cat: 'RECHERCHE', title: "Optimisation fiscale de l'assurance d'entreprise collective : Éliminer la paperasse au Congo." }
                    ].map((ns, idx) => (
                      <div key={idx} className="bg-white border rounded-md p-6 hover:shadow-lg transition-all flex flex-col justify-between hover:border-[#00A86B]/20">
                        <div className="space-y-3">
                          <span className="text-[9.5px] font-mono font-black text-[#00A86B] uppercase block">★ {ns.cat}</span>
                          <h4 className="text-xs font-black text-slate-900 uppercase font-sans tracking-tight leading-snug">{ns.title}</h4>
                        </div>
                        <button onClick={() => navigateTo('/modules')} className="text-[11px] text-slate-400 hover:text-[#00A86B] font-bold text-left pt-6 block font-mono cursor-pointer transition-colors">En savoir plus</button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* 🤝 PARTNER LOGOS BAR WITH SLIDER SIMULATION (Exact Screenshot 5 Match) */}
                <section className="bg-slate-100 py-16 text-left select-none border-t border-slate-200">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                      <div className="lg:col-span-5 space-y-4">
                        <span className="text-[10px] font-mono text-[#00A86B] font-black uppercase">NOS ACCRÉDITATIONS</span>
                        <h3 className="text-2xl font-black text-slate-900 leading-tight">Nous sommes agréés et raccordés avec les plus grandes institutions sanitaires nationales.</h3>
                        <button onClick={() => navigateTo('/arca-rdc')} className="text-xs text-[#00A86B] font-extrabold hover:underline">En savoir plus</button>
                      </div>

                      {/* Logos boxes cards */}
                      <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {['ARCA Agrément CD-41098', 'ISO 27001 Certified', 'Ministère de la Santé RDC', 'OMS Afrique'].map((pName, sIdx) => (
                          <div key={sIdx} className="bg-white border border-slate-200/60 p-4 rounded-md text-center text-[10px] font-mono font-black text-slate-600 uppercase tracking-wider flex items-center justify-center min-h-[5rem]">
                            <span>{pName}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                {/* 🗺️ GLOBAL OFFICES & CONNECTION MAP (Exact Screenshot 5 bottom Match) */}
                <section className="mx-auto max-w-7xl px-6 lg:px-8 py-24 text-left select-none">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    {/* Left: Office listing directories */}
                    <div className="lg:col-span-4 space-y-6">
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono font-black text-[#00A86B] uppercase block">DÉPLOIEMENT PANAFRICAIN</span>
                        <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase">Les experts NeoGTec au plus proche de vous<span className="text-[#00A86B]">.</span></h2>
                      </div>

                      <div className="space-y-2.5">
                        {[
                          { id: 'rdc', label: 'Kinshasa (Gombe) • Siège national' },
                          { id: 'ci', label: 'Abidjan (Plateau) • Hub Ouest' },
                          { id: 'ke', label: 'Nairobi (Kilimani) • Hub Est' },
                          { id: 'ng', label: 'Lagos (Ikeja) • Bureau d’affaires' }
                        ].map(of => (
                          <button
                            key={of.id}
                            onClick={() => setActiveOffice(of.id)}
                            className={cn(
                              "w-full text-left px-4 py-3.5 border rounded-md text-xs font-bold transition-all flex justify-between select-none cursor-pointer outline-none",
                              activeOffice === of.id ? "bg-white border-[#00A86B] text-[#00A86B] shadow-sm" : "border-slate-205 text-slate-700 hover:bg-white"
                            )}
                          >
                            <span>{of.label}</span>
                            <ArrowRight className="w-4 h-4 opacity-70" />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right: Beautiful Connection Map in Green Theme */}
                    <div className="lg:col-span-8 bg-white border border-slate-200 shadow-md p-6 rounded-md relative flex items-center justify-center min-h-[400px]">
                      <svg className="w-full h-full max-w-[500px]" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Map nodes connection lines paths in NeoGTec green */}
                        <path d="M120,240 Q160,200 220,180" stroke="#00A86B" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                        <path d="M120,240 Q100,160 110,120" stroke="#00A86B" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                        <path d="M220,180 Q270,190 320,230" stroke="#00A86B" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />
                        <path d="M110,120 Q160,150 220,180" stroke="#00A86B" strokeWidth="2" strokeDasharray="4 4" fill="none" opacity="0.6" />

                        {/* Node: Kinshasa */}
                        <circle cx="220" cy="180" r="14" fill="#00A86B" fillOpacity="0.15" className="animate-pulse" />
                        <circle cx="220" cy="180" r="6" fill="#00A86B" />
                        <text x="210" y="205" fill="#1e293b" fontSize="10" fontWeight="bold" fontFamily="monospace">Kinshasa (HQ)</text>

                        {/* Node: Abidjan */}
                        <circle cx="110" cy="120" r="12" fill="#00A86B" fillOpacity="0.15" />
                        <circle cx="110" cy="120" r="5" fill="#00A86B" />
                        <text x="80" y="105" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">Abidjan</text>

                        {/* Node: Nairobi */}
                        <circle cx="320" cy="230" r="12" fill="#00A86B" fillOpacity="0.15" />
                        <circle cx="320" cy="230" r="5" fill="#00A86B" />
                        <text x="310" y="250" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">Nairobi</text>

                        {/* Node: Lagos */}
                        <circle cx="120" cy="240" r="12" fill="#00A86B" fillOpacity="0.15" />
                        <circle cx="120" cy="240" r="5" fill="#00A86B" />
                        <text x="90" y="260" fill="#64748b" fontSize="9" fontWeight="bold" fontFamily="monospace">Lagos</text>
                      </svg>
                      <div className="absolute bottom-4 right-4 bg-slate-900 text-white rounded-[4px] px-3 py-1.5 font-mono text-[9px] uppercase border border-white/5 font-black tracking-widest leading-none">
                        ✓ TRANSITE_SERVEUR : ACTIF
                      </div>
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
