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
  Building2, 
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
  CheckSquare,
  Contact,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Coins,
  Sparkles,
  Globe,
  Plus,
  Minus
} from 'lucide-react';
import { cn } from '../lib/utils';

// --- CONFIGURATION SOUVERAINE & DEVISES ---
type CurrencyCode = 'USD' | 'CDF' | 'KES' | 'NGN' | 'XOF';

interface CountryConfig {
  code: string;
  name: string;
  currency: CurrencyCode;
  rate: number; // 1 USD = rate
  symbol: string;
}

const COUNTRIES: CountryConfig[] = [
  { code: 'RDC', name: 'République Démocratique du Congo', currency: 'CDF', rate: 2800, symbol: 'FC' },
  { code: 'KE', name: 'Kenya', currency: 'KES', rate: 130, symbol: 'KSh' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN', rate: 1450, symbol: '₦' },
  { code: 'CI', name: 'Côte d’Ivoire', currency: 'XOF', rate: 605, symbol: 'FCFA' },
  { code: 'SN', name: 'Sénégal', currency: 'XOF', rate: 605, symbol: 'FCFA' },
  { code: 'US', name: 'International', currency: 'USD', rate: 1, symbol: '$' }
];

type Route = '/' | '/risques' | '/solutions' | '/modules' | '/tarifs' | '/faq' | '/affiliation' | '/confidentialite' | '/cgu' | '/arca-rdc' | '/merci';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

// Custom Framer Motion Confetti for our /merci success screen
const DynamicConfetti = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-50">
      {particles.map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 1.5;
        const duration = 2.5 + Math.random() * 2;
        const size = 6 + Math.random() * 6;
        const color = ['bg-[#00A86B]', 'bg-amber-500', 'bg-emerald-400', 'bg-indigo-500', 'bg-rose-500'][i % 5];
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
  // Locale state
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');
  const [selectedCountry, setSelectedCountry] = useState<CountryConfig>(COUNTRIES[0]);
  const [cart, setCart] = useState<string[]>([]);
  
  // Custom states
  const [activeTab, setActiveTab] = useState<'assureurs' | 'hopitaux' | 'entreprises'>('assureurs');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);
  const [searchFAQ, setSearchFAQ] = useState('');

  // Active module card modal
  const [activeModuleModal, setActiveModuleModal] = useState<any | null>(null);

  // ROI Calculator
  const [roiEmployees, setRoiEmployees] = useState(150);

  // Route state
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [routeHistory, setRouteHistory] = useState<Route[]>([]);

  // Hash changed router sync
  useEffect(() => {
    const handleLocationChange = () => {
      let hash = window.location.hash.replace('#', '') as Route;
      if (!hash) hash = '/';
      // Ensure exact route verification
      setCurrentRoute(hash);
      window.scrollTo({ top: 0, behavior: 'instant' });
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

  // Pricing helper formatting
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

  // Form Tunnel States
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
      website_url_field: '' // Honeypot Field
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
      setFormServerError("Veuillez cocher la case hCaptcha de sécurité.");
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
      setFormServerError(err.message || "Impossible d'envoyer la demande.");
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

  const handleDownloadManifesto = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
      window.open('https://neogtec.com/whitepaper-souverainete-rdc.pdf', '_blank');
    }, 1000);
  };

  // --- STATEMENTS & STATIC DATA ---
  const risksList = [
    {
      id: "f",
      title: "Fraude de Prise en Charge",
      description: "Des personnes utilisent les listes d'assurés collectives de vos collaborateurs absents.",
      impact: "15% de vos primes partent en faux soins. Soit ~30K$/an pour 500 employés.",
      icon: <Lock className="h-6 w-6 text-[#DC2626]" />
    },
    {
      id: "d",
      title: "Fuite de Secrets Médicaux",
      description: "Les informations cliniques de vos salariés voyagent sur des e-mails simples non sécurisés.",
      impact: "Condamnation sévère : La Loi n°18/035 interdit formellement de divulguer ces bases privées.",
      icon: <ShieldCheck className="h-6 w-6 text-[#DC2626]" />
    },
    {
      id: "l",
      title: "Lenteurs des validations (PEC)",
      description: "Les cliniques attendent vos décisions papier pendant des semaines pour opérer un mari malade.",
      impact: "Retard de 45 jours. Ce blocage nuit au bon climat social de vos équipes.",
      icon: <Clock className="h-6 w-6 text-[#DC2626] animate-pulse" />
    },
    {
      id: "p",
      title: "Plaintes administratives RH",
      description: "Vos collaborateurs se font refuser les d'admissions santé par manque d'accords clairs.",
      impact: "80% des appels au helpdesk RH concernent un blocage d'autorisation hôpital.",
      icon: <Activity className="h-6 w-6 text-[#DC2626]" />
    },
    {
      id: "a",
      title: "Audit de Régulation Infructueux",
      description: "Les fiches d'adhesion manquent de traçabilité lors des contrôles fiscaux d'assurances.",
      impact: "Erreur pénalisante : Vous risquez jusqu'à 50 millions de Francs Congolais d'amende ARCA.",
      icon: <AlertOctagon className="h-6 w-6 text-[#DC2626]" />
    }
  ];

  const solutionsList = [
    {
      id: 1,
      title: "QR Code intelligent dynamique",
      risk: "Fraude : 15% de vos primes partent en usurpation d'identité.",
      desc: "Chaque assuré possède un code QR unique sur son smartphone. L'admission le scanne instantanément. Le QR code change toutes les 24h, rendant toute copie impossible.",
      icon: <QrCode className="h-6 w-6 text-[#00A86B]" />
    },
    {
      id: 2,
      title: "Hébergement Clinique de Confiance",
      risk: "Fuite : Partager le secret médical désobéit à la loi n°18/035.",
      desc: "Vos données de santé restent hautement sécurisées à Kinshasa. Nous appliquons le chiffrement fort pgsodium et le contrôle RLS au niveau PostgreSQL pour l'intégrité.",
      icon: <Server className="h-6 w-6 text-[#00A86B]" />
    },
    {
      id: 3,
      title: "Tri de Sinistres Automatique",
      risk: "Lenteurs : Les délais de papier bloquent vos malades critiques.",
      desc: "NeoGTec clearing vérifie et consolide 92% des factures cliniques immédiatement en ligne. Les centres reçoivent l'argent sous 24 heures sans erreurs manuelles.",
      icon: <Activity className="h-6 w-6 text-[#00A86B] animate-pulse" />
    },
    {
      id: 4,
      title: "Dashboard d&apos;activité Salarié",
      risk: "Plaintes : Des familles rejetées aux soins dégradent le social.",
      desc: "L&apos;employé consulte son solde disponible directement sur l&apos;application. Plus d&apos;incertitude ou de mauvaise surprise aux guichets.",
      icon: <Smartphone className="h-6 w-6 text-[#00A86B]" />
    },
    {
      id: 5,
      title: "Registres d&apos;audits à la carte",
      risk: "Audits : Les calculs erronés mènent à l&apos;amende de l&apos;ARCA.",
      desc: "Les cotisations de Tiers Payant se calculent sans aucune intervention humaine. Générez des états fiables et structurés d&apos;un simple clic.",
      icon: <FileSignature className="h-6 w-6 text-[#00A86B]" />
    }
  ];

  const modulesList = [
    { id: 1, type: "Core", name: "Prise en Charge (PEC)", benefit: "Divise par 3 l'attente administrative d'accord.", price: 0, icon: <Heart className="h-5 w-5 text-[#00A86B]" />, desc: "Générez des accords de soins digitaux certifiés ARCA sans bordereaux papier physiques." },
    { id: 2, type: "Core", name: "QR Code Éligibilité", benefit: "Identifie instantanément le statut de l'assuré.", price: 0, icon: <QrCode className="h-5 w-5 text-[#00A86B]" />, desc: "Un passeport santé virtuel inviolable qui se renouvelle automatiquement pour barrer la fraude." },
    { id: 3, type: "Add-on", name: "Téléconsultation active", benefit: "Praticien qualifié disponible sur WhatsApp en 5min.", price: 200, icon: <Video className="h-5 w-5 text-indigo-600" />, desc: "Évitez les absences de collaborateurs pour des maux bénins grâce aux diagnostics à distance." },
    { id: 4, type: "Core", name: "Portail RH National", benefit: "Gérez vos effectifs d'assurance sans Excel.", price: 0, icon: <Users className="h-5 w-5 text-[#00A86B]" />, desc: "Incorporez, mutez ou suspendez les bénéficiaires de santé d'un simple clic." },
    { id: 5, type: "Core", name: "Saisie Médecin", benefit: "Ordonnances et bilans sécurisés en ligne.", price: 0, icon: <FileText className="h-5 w-5 text-[#00A86B]" />, desc: "Permet aux cliniques agréées d'inscrire les observations cliniques de façon structurée." },
    { id: 6, type: "Core", name: "Guichet Admission", benefit: "Éliminez définitivement les reçus perdus.", price: 0, icon: <Hospital className="h-5 w-5 text-[#00A86B]" />, desc: "Interface fluide pour les cliniquiens raccordés pour un clearing des coûts de soins." },
    { id: 7, type: "Add-on", name: "Système Multi-devises", benefit: "Intègre le dollar, franc, shillings et naira.", price: 150, icon: <Coins className="h-5 w-5 text-indigo-600" />, desc: "Assurez la liaison avec vos succursales étrangères sans conversions complexes." },
    { id: 8, type: "Core", name: "Calculateur Quote-part", benefit: "Calculateur pour salariés et cotisants.", price: 0, icon: <ShieldCheck className="h-5 w-5 text-[#00A86B]" />, desc: "Déduisez les charges d'entreprises selon les lois de cotisations de santé de l'employeur." },
    { id: 9, type: "Add-on", name: "Détecteur de Fraude", benefit: "Repère les ordonnances multiples falsifiées.", price: 250, icon: <AlertOctagon className="h-5 w-5 text-indigo-600" />, desc: "Module de contrôle par IA qui identifie les rachets d'assurés et de médicaments." },
    { id: 10, type: "Add-on", name: "Canal SMS Direct", benefit: "Notification instantanée sur mobile.", price: 100, icon: <Mail className="h-5 w-5 text-indigo-600" />, desc: "Envoyez des SMS automatiques lors de la validation des bons de soins de l'hôpital." },
    { id: 11, type: "Add-on", name: "Contrat DocuSign", benefit: "Adhésion digitale légale en RDC.", price: 300, icon: <FileSignature className="h-5 w-5 text-indigo-600" />, desc: "Signature en un clic de contrats certifiés en conformité avec le code civil panafricain." },
    { id: 12, type: "Core", name: "Stats Décideurs", benefit: "Consultez en direct les consommations.", price: 0, icon: <BarChart3 className="h-5 w-5 text-[#00A86B]" />, desc: "Optimisez vos arbitrages d'assurances grâce à l'analyse analytique de votre trésorerie." },
    { id: 13, type: "Core", name: "Importateur Excel", benefit: "Uploadez 500 employés en deux clics.", price: 0, icon: <Server className="h-5 w-5 text-[#00A86B]" />, desc: "Fini la saisie re-keying fastidieuse. Intégrez vos fichiers de primes instantanément." },
    { id: 14, type: "Core", name: "GPS des Hôpitaux", benefit: "Cartographie géolocalisée interactive.", price: 0, icon: <MapPin className="h-5 w-5 text-[#00A86B]" />, desc: "Orientez précisément les collaborateurs vers les cliniques éligibles régionales." },
    { id: 15, type: "Core", name: "Coffre Clinique RGPD", benefit: "Dossiers de soins cryptés.", price: 0, icon: <Lock className="h-5 w-5 text-[#00A86B]" />, desc: "Coffre-fort d'audit sécurisé pour préserver le secret vis-à-vis des tiers non autorisés." },
    { id: 16, type: "Core", name: "Clearing Algorithmique", benefit: "Traitement immuable des impayés.", price: 0, icon: <FolderSync className="h-5 w-5 text-[#00A86B]" />, desc: "Consolide les factures et réduit les impayés de prestations médicales." }
  ];

  const plansList = [
    {
      name: "Silver",
      motto: "Essentiel pour PME",
      desc: "Idéal pour numériser vos adhésions et supprimer totalement la fraude de carte.",
      basePriceUsd: 2,
      features: [
        "Prises en Charge (PEC) sous 48h",
        "Passeport QR Code Patient",
        "Espace de gestion RH National",
        "Importateur de listes Excel",
        "Chiffrement souverain des données",
        "Support client standard par e-mail"
      ]
    },
    {
      name: "Gold",
      motto: "Recommandé pour Entreprise",
      desc: "Le top de la synchronisation de soins avec alertes instantanées et détection fraude.",
      basePriceUsd: 5,
      features: [
        "Tout l'essentiel du niveau Silver",
        "Téléconsultation WhatsApp active",
        "Module de détection anti-fraude",
        "Notification par SMS et WhatsApp",
        "Prise en charge prioritaire helpdesk",
        "Conformité légale Loi n°18/035"
      ],
      recommended: true
    },
    {
      name: "Platinum",
      motto: "Performance et Corporates",
      desc: "Liaisons multi-devises nationales et rapports d'audits financiers automatiques.",
      basePriceUsd: 8,
      features: [
        "Accès à l'ensemble des 16 modules",
        "Support dédié d'un conseiller 24h/24",
        "Système Multi-devises (CDF, USD...)",
        "Signature DocuSign unifiée",
        "Statistiques avancées pour DAF",
        "Audit de régulation certifié ARCA"
      ]
    }
  ];

  const faqItemsList = [
    {
      q: "Est-ce agréé ARCA-RDC ?",
      a: "Oui. NeoGTec est certifié agréé ARCA-RDC n° 24/41098. Nous respectons scrupuleusement le code des assurances national de la République Démocratique du Congo."
    },
    {
      q: "Mes listes et données de santé dorment où ?",
      a: "Toutes les informations cliniques de vos salariés restent hébergées localement à Kinshasa en RDC. Cela assure votre entière conformité à la loi souveraine n°18/035."
    },
    {
      q: "Combien de jours prend le démarrage de notre affiliation ?",
      a: "Démarrage ultra-rapide sous 5 jours. Il vous suffit d'importer votre fichier d'employés et notre helpdesk s'occupe du reste."
    },
    {
      q: "Comment contrer le rachat de cartes ?",
      a: "Le scan dynamique de notre QR code patient change automatiquement toutes les 24 heures. Aucune photocopie papier ne peut être falsifiée."
    },
    {
      q: "Et si internet coupe dans une clinique reculée ?",
      a: "Aucune crainte. L'application mobile possède un mode hors-ligne crypté localement. Elle synchronise automatiquement dès le retour du réseau."
    },
    {
      q: "Comment fonctionne la téléconsultation ?",
      a: "L'employé est mis en relation avec un médecin agréé directement sur WhatsApp. Idéal pour diagnostiquer les maux légers en moins de 5 minutes."
    },
    {
      q: "Quelles devises puis-je utiliser pour régler nos factures ?",
      a: "Notre interface s'adapte instantanément à la monnaie locale (CDF en RDC, NGN au Nigeria, KES au Kenya, XOF en Côte d'Ivoire et Sénégal) ou en USD."
    },
    {
      q: "Est-ce possible de garder notre assureur santé habituel ?",
      a: "Oui de manière totale. NeoGTec est une plateforme d'agrégation d'assurances. Nous sécurisons le lien technique sans forcer le choix de tiers."
    },
    {
      q: "Comment le helpdesk se déplace-t-il pour la formation ?",
      a: "Nos formateurs locaux interviennent sur votre site pour former vos administrateurs RH et gestionnaires de cliniques éligibles."
    },
    {
      q: "Quelle est la durée minimale d'engagement ?",
      a: "Engagement de 12 mois. Vous payez en direct selon la consommation d'employés actifs, sans frais d'infrastructure cachés."
    },
    {
      q: "Existe-t-il un audit de conformité pour le climat social ?",
      a: "Oui. Votre dashboard vous sort des extraits de satisfaction et de consommation pour arbitrer les litiges ou contestations en 2 clics."
    },
    {
      q: "Comment résilier facilement et récupérer nos archives ?",
      a: "En cas de résiliation, vos listes et fichiers de fiches d'admissions restent téléchargeables en sécurité au format Excel sous 48 heures."
    }
  ];

  const filteredFaqs = faqItemsList.filter(item => 
    item.q.toLowerCase().includes(searchFAQ.toLowerCase()) || 
    item.a.toLowerCase().includes(searchFAQ.toLowerCase())
  );

  const toggleCartModule = (name: string) => {
    setCart(prev => {
      const exist = prev.includes(name);
      if (exist) {
        return prev.filter(m => m !== name);
      } else {
        return [...prev, name];
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#00A86B] selection:text-white relative">
      
      {/* 🟢 STICKY HEADER */}
      <nav id="public-header" className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-green-150/40 h-16 px-6 md:px-12 flex items-center justify-between z-100 select-none">
        <div onClick={() => navigateTo('/')} className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 bg-[#00A86B] text-white rounded-[8px] flex items-center justify-center font-black">N</div>
          <div>
            <span className="font-extrabold uppercase text-xs tracking-wider text-slate-900 block leading-none">NeoGTec</span>
            <span className="text-[8px] font-mono text-slate-400 font-bold block leading-none mt-1">Conforme ARCA-RDC</span>
          </div>
        </div>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8 text-xs font-bold text-slate-600 uppercase tracking-widest font-mono">
          <button onClick={() => navigateTo('/risques')} className={cn("hover:text-[#00A86B] cursor-pointer", currentRoute === '/risques' && 'text-[#00A86B]')}>Risques</button>
          <button onClick={() => navigateTo('/solutions')} className={cn("hover:text-[#00A86B] cursor-pointer", currentRoute === '/solutions' && 'text-[#00A86B]')}>Solutions</button>
          <button onClick={() => navigateTo('/modules')} className={cn("hover:text-[#00A86B] cursor-pointer", currentRoute === '/modules' && 'text-[#00A86B]')}>Modules</button>
          <button onClick={() => navigateTo('/tarifs')} className={cn("hover:text-[#00A86B] cursor-pointer", currentRoute === '/tarifs' && 'text-[#00A86B]')}>Tarifs</button>
          <button onClick={() => navigateTo('/faq')} className={cn("hover:text-[#00A86B] cursor-pointer", currentRoute === '/faq' && 'text-[#00A86B]')}>FAQ</button>
        </div>

        {/* Right menu actions */}
        <div className="flex items-center gap-2">
          {/* Country Switcher */}
          <div className="relative group">
            <button className="h-9 px-3 border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-black uppercase text-slate-700 rounded-[8px] flex items-center gap-1.5 cursor-pointer outline-none md:font-mono">
              <span>{selectedCountry.code} ({selectedCountry.symbol})</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <div className="absolute right-0 top-full mt-1.5 w-60 bg-white rounded-[8px] p-2 shadow-2xl border border-slate-100 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all text-left z-200">
              <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase tracking-widest block px-2.5 py-1.5 border-b mb-1">Localisation Devise</span>
              {COUNTRIES.map(ct => (
                <button
                  key={ct.code}
                  onClick={() => setSelectedCountry(ct)}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-[8px] text-[11px] font-bold transition-all mt-0.5 flex justify-between select-none cursor-pointer outline-none",
                    selectedCountry.code === ct.code ? "bg-[#F0FDF4] text-[#00A86B]" : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  <span>{ct.name}</span>
                  <span className="font-mono text-[9px] text-slate-400">({ct.symbol})</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={onNavigateToLogin}
            className="h-9 px-3 rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-[10px] font-black uppercase tracking-wider text-slate-600 cursor-pointer hidden sm:block"
          >
            Portail Admin
          </button>

          <button 
            onClick={() => navigateTo('/affiliation')}
            className="h-9 px-4.5 rounded-[8px] bg-[#00A86B] text-white hover:bg-[#008d59] text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-all active:scale-[0.98]"
          >
            S’affilier
            {cart.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-slate-900 text-[8px] flex items-center justify-center text-white shrink-0 font-mono animate-pulse">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* 🗺️ BREADCRUMBS & RETOUR BLOCK (All pages except /) */}
      {currentRoute !== '/' && (
        <div className="bg-slate-50 border-b border-slate-200/50 py-3.5 px-6 md:px-12">
          <div className="mx-auto max-w-7xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-xs select-none">
              <button onClick={() => navigateTo('/')} className="text-slate-400 hover:text-[#00A86B] font-bold cursor-pointer">Accueil</button>
              <span className="text-slate-350">/</span>
              <span className="text-slate-900 font-extrabold">
                {currentRoute === '/risques' && 'Risques Financiers'}
                {currentRoute === '/solutions' && 'Nos Solutions'}
                {currentRoute === '/modules' && 'Catalogue 16 Modules'}
                {currentRoute === '/tarifs' && 'Grille de Tarifs'}
                {currentRoute === '/faq' && 'Assistance FAQ'}
                {currentRoute === '/affiliation' && 'Tunnel d’affiliation'}
                {currentRoute === '/confidentialite' && 'Confidentialité RDC'}
                {currentRoute === '/cgu' && 'Conditions SaaS'}
                {currentRoute === '/arca-rdc' && 'Dossier ARCA'}
                {currentRoute === '/merci' && 'Félicitations'}
              </span>
            </div>

            <button 
              onClick={navigateBack}
              className="inline-flex h-7 items-center gap-1 hover:bg-slate-200 rounded-[6px] px-2.5 text-slate-600 hover:text-slate-900 text-[10px] font-bold uppercase transition-all cursor-pointer font-mono border"
            >
              ← Retour
            </button>
          </div>
        </div>
      )}

      {/* 🚀 MAIN CONTENT VIEWS WITH FRAMER MOTION ROUTING */}
      <main className="min-h-[calc(100vh-16rem)]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {/* 1. HOME ACCUEIL VIEW */}
            {currentRoute === '/' && (
              <div className="space-y-24 pb-24">
                
                {/* Hero section */}
                <section className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-white">
                  <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                      <div className="lg:col-span-7 space-y-6 text-left">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#00A86B]/25 bg-[#00A86B]/5 px-3.5 py-1 text-[10px] font-black text-[#00A86B] tracking-wider uppercase font-mono select-none">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Certifié ARCA-RDC v2.1 • Agréé n° 24/41098</span>
                        </div>
                        
                        <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold uppercase text-slate-900 leading-[1.05] tracking-tight">
                          La plateforme SaaS qui divise par <span className="text-[#00A86B]">3</span> le délai des prises en charge santé
                        </h1>
                        
                        <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold max-w-xl">
                          Protégez vos bénéficiaires en centralisant l&apos;admission hospitalière. Éliminez instantanément 15% de fraude de carte. 
                          <span className="text-slate-900 block font-bold mt-2">✓ 100% Souverain en RDC • Zéro dossier papier • Mode Offline actif.</span>
                        </p>

                        <div className="flex flex-wrap gap-4 pt-2">
                          <button 
                            onClick={() => navigateTo('/affiliation')}
                            className="h-11 px-5 rounded-[8px] bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-[11px] uppercase tracking-wider shadow-lg shadow-[#00A86B]/15 flex items-center gap-1.5 cursor-pointer"
                          >
                            Démarrer ma demande de contrat
                            <ArrowRight className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => navigateTo('/risques')}
                            className="h-11 px-5 rounded-[8px] border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 font-extrabold text-[11px] uppercase tracking-wider cursor-pointer"
                          >
                            Découvrir les 5 risques financiers
                          </button>
                        </div>
                      </div>

                      {/* Right mockup window panel */}
                      <div className="lg:col-span-5 relative">
                        <div className="w-full max-w-sm mx-auto bg-slate-950 rounded-[8px] border border-slate-800 p-4 shadow-2xl text-left">
                          <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5 mb-3.5 font-mono text-[9px] text-[#00A86B] font-bold">
                            <div className="w-2.5 h-2.5 rounded-full bg-[#00A86B]/50 animate-pulse" />
                            <span>SERVEUR_KIN_RUNNING.sh</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="p-3 bg-white/5 border border-white/10 rounded-[8px] flex items-center justify-between">
                              <div>
                                <span className="text-[9px] text-slate-400 font-mono font-black uppercase tracking-wider">Durée validation PEC</span>
                                <strong className="text-[#00A86B] text-lg block font-mono">48 Heures Max <span className="text-xs text-slate-400">(vs 15 jours)</span></strong>
                              </div>
                              <Activity className="w-5 h-5 text-[#00A86B] animate-pulse shrink-0" />
                            </div>

                            <div className="bg-black/40 rounded-[8px] p-3 border border-white/5 font-mono text-[9px] text-emerald-400/90 leading-tight space-y-1">
                              <p>✓ SECURE CORE: ACTIVE (Kinshasa Gombe)</p>
                              <p>✓ SECURITY POLICY CODE: CD_LOI_18_035</p>
                              <p>✓ ARCA AGREE: DECISION_2026_10492_OK</p>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono font-black text-white">
                              <div className="bg-white/5 border border-white/5 rounded-[6px] p-2">
                                <p className="text-[8px] text-slate-400 mb-0.5 uppercase">Usurpation</p>
                                <span className="text-[#00A86B]">0%</span>
                              </div>
                              <div className="bg-white/5 border border-white/5 rounded-[6px] p-2">
                                <p className="text-[8px] text-slate-400 mb-0.5 uppercase">Clearing</p>
                                <span className="text-[#00A86B]">92% Auto</span>
                              </div>
                              <div className="bg-white/5 border border-white/5 rounded-[6px] p-2">
                                <p className="text-[8px] text-slate-400 mb-0.5 uppercase">Support</p>
                                <span className="text-indigo-400">24h/24</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Key Numbers Grid panel */}
                <section className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-slate-900 text-white rounded-[8px] p-8 md:p-10 text-center relative overflow-hidden select-none border border-white/5 shadow-2xl">
                    <div className="space-y-1.5 z-10">
                      <span className="text-3xl md:text-4xl font-mono font-black text-[#00A86B]">92%</span>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Factures automatiques validées</p>
                    </div>
                    <div className="space-y-1.5 z-10">
                      <span className="text-3xl md:text-4xl font-mono font-black text-[#00A86B]">48h</span>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Délai d&apos;accord de soins</p>
                    </div>
                    <div className="space-y-1.5 z-10">
                      <span className="text-3xl md:text-4xl font-mono font-black text-[#00A86B]">100%</span>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Hébergement local Kinshasa</p>
                    </div>
                    <div className="space-y-1.5 z-10">
                      <span className="text-3xl md:text-4xl font-mono font-black text-[#00A86B]">0 Papier</span>
                      <p className="text-[10px] text-slate-400 font-extrabold uppercase font-mono">Archivage d&apos;adhesion digital</p>
                    </div>
                  </div>
                </section>

                {/* Trust credentials and logos */}
                <section className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-8">
                  <div className="space-y-2">
                    <span className="text-[9.5px] font-mono font-black text-slate-400 uppercase tracking-widest block">Crédibilité Nationale Établie</span>
                    <h2 className="text-base font-extrabold uppercase text-slate-700 tracking-wider">Ils sécurisent leurs frais avec NeoGTec</h2>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    {['SUNU Assurances RDC', 'AXA Assurances RDC', 'Ngaliema Medical Center', 'KinPharma Network'].map((name, i) => (
                      <div key={i} className="bg-white border border-slate-200/80 p-4 rounded-[8px] min-w-[13rem] shadow-sm flex flex-col justify-center">
                        <strong className="text-slate-800 text-xs font-black uppercase tracking-wide">{name}</strong>
                        <span className="text-[8.5px] font-mono text-slate-400 font-black uppercase mt-1">✓ PARTENAIRE AGRÉÉ RDC</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Testimonial Panel */}
                <section className="mx-auto max-w-4xl px-6 lg:px-8">
                  <div className="bg-slate-100/50 border border-slate-200 rounded-[8px] p-8 text-left relative overflow-hidden shadow-sm">
                    <Quote className="absolute -top-4 -left-4 w-16 h-16 text-slate-200/60 pointer-events-none" />
                    <blockquote className="text-xs sm:text-sm font-semibold text-slate-700 italic leading-relaxed z-10">
                      &ldquo;NeoGTec a simplifié la vie de nos salariés de manière incroyable. Le budget restant est visible en direct et les cartes QR interdisent totalement la fraude médicale d&apos;identité aux admissions. Nos coûts d&apos;assurance ont chuté de 15% dès le premier trimestre.&rdquo;
                    </blockquote>
                    <div className="mt-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-900 border text-white flex items-center justify-center text-[10px] font-black">MK</div>
                      <div>
                        <strong className="text-xs font-black uppercase text-slate-900 block font-mono">Marie KAPEND</strong>
                        <span className="text-[8.5px] font-mono text-slate-400 font-black uppercase block">Directrice des ressources humaines • ACME CONGO SARL</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Closing Hero Action card */}
                <section className="mx-auto max-w-4xl px-6 lg:px-8">
                  <div className="bg-[#F0FDF4] border border-[#00A86B]/25 rounded-[8px] p-8 md:p-12 text-center space-y-6">
                    <h3 className="text-xl md:text-2xl font-extrabold uppercase text-slate-900">
                      Arrêtez de gaspiller votre budget santé en papier
                    </h3>
                    <p className="text-xs font-bold text-slate-600 max-w-md mx-auto leading-relaxed">
                      Passez dès maintenant au Tiers Payant digital panafricain. Choisissez vos 16 modules à la carte.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => navigateTo('/affiliation')}
                        className="w-full sm:w-auto h-11 px-6 rounded-[8px] bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-xs uppercase cursor-pointer transition-all"
                      >
                        S&apos;affilier en 5 minutes
                      </button>
                      <button 
                        onClick={() => navigateTo('/risques')}
                        className="w-full sm:w-auto h-11 px-6 bg-white border rounded-[8px] text-slate-900 hover:bg-slate-50 font-black text-xs uppercase cursor-pointer transition-all"
                      >
                        Voir les 5 risques financiers
                      </button>
                    </div>
                  </div>
                </section>

              </div>
            )}

            {/* 2. RISQUES VIEW */}
            {currentRoute === '/risques' && (
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#DC2626] uppercase">
                    ⚠️ Gaspillage Trésorerie
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none">
                    5 risques financiers majeurs pour vos RH
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                    Le raccordement de santé manuel par papier détruit votre capital. Voici les fraudes et lenteurs constatées au Congo.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {risksList.map((rk, i) => (
                    <div 
                      key={rk.id}
                      className="border border-slate-200 bg-white p-6 rounded-[8px] hover:border-red-500/25 transition-all shadow-sm flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="w-10 h-10 bg-red-50 border border-red-100 rounded-[8px] flex items-center justify-center shrink-0">
                          {rk.icon}
                        </div>
                        <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">{rk.title}</h3>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">{rk.description}</p>
                      </div>

                      <div className="mt-6 border-t border-slate-100 pt-4 text-xs font-mono font-bold text-red-600 uppercase">
                        ★ {rk.impact}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#F0FDF4] border border-[#00A86B]/25 rounded-[8px] p-8 text-center max-w-4xl mx-auto space-y-5">
                  <h3 className="text-lg font-black uppercase text-slate-900">
                    Vous souhaitez éradiquer ces pertes financières ?
                  </h3>
                  <p className="text-xs text-slate-600 font-bold max-w-lg mx-auto leading-relaxed">
                    Visualisez comment nous raccordons les admissions en ligne de nos cliniques éligibles et transformons les flux.
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
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    🛡️ Solutions Souveraines
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none">
                    Comment NeoGTec supprime ces 5 risques
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                    Nos briques SaaS panafricaines sécurisent les prises en charge et fluidifient l&apos;accès clinique sous 48h.
                  </p>
                </div>

                <div className="space-y-8 max-w-4xl mx-auto">
                  {solutionsList.map((sol, index) => (
                    <div 
                      key={sol.id}
                      className="bg-white border rounded-[8px] p-6 md:p-8 hover:border-[#00A86B]/20 transition-all shadow-sm flex flex-col md:flex-row gap-6 items-start"
                    >
                      <div className="w-12 h-12 rounded-[8px] bg-[#F0FDF4] border border-[#00A86B]/10 flex items-center justify-center shrink-0">
                        {sol.icon}
                      </div>
                      <div className="flex-1 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2.5">
                          <h3 className="text-sm font-black uppercase text-slate-900 tracking-tight">{sol.title}</h3>
                          <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-500 rounded-[4px] px-2 py-0.5">⚙️ AUTOMATISÉ</span>
                        </div>
                        <p className="text-xs text-slate-500 font-semibold leading-relaxed">{sol.desc}</p>
                        <div className="bg-red-55/10 border border-red-500/10 rounded-[6px] p-3 text-[10px] font-mono font-black uppercase text-[#DC2626]">
                          ✓ DANGER ÉCARTÉ : {sol.risk}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[#F0FDF4] border border-[#00A86B]/20 rounded-[8px] p-8 text-center max-w-3xl mx-auto space-y-5">
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

            {/* 4. MODULES VIEW (Filtres, Modal de détail avec Devis) */}
            {currentRoute === '/modules' && (
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24 relative">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    📦 Catalogue modulaire
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none animate-fadeIn">
                    16 modules. Activez vos priorités.
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                    Ne payez aucun abonnement d&apos;infrastructure forcé. Ajoutez les modules à votre devis pour simuler votre coût global.
                  </p>
                </div>

                {/* Modules Grid list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {modulesList.map((m, i) => {
                    const isGold = m.type === "Add-on";
                    const isSelected = cart.includes(m.name);
                    return (
                      <div 
                        key={m.id}
                        className={cn(
                          "bg-white border rounded-[8px] p-5 hover:scale-[1.01] hover:shadow-lg transition-all flex flex-col justify-between group cursor-pointer relative",
                          isSelected ? "border-[#00A86B] ring-2 ring-[#00A86B]/15" : "border-slate-200"
                        )}
                        onClick={() => setActiveModuleModal(m)}
                      >
                        <div className="space-y-4 text-left">
                          <div className="flex items-center justify-between">
                            <div className="w-9 h-9 bg-slate-50 border rounded-[8px] flex items-center justify-center shrink-0">
                              {m.icon}
                            </div>
                            <span className={cn(
                              "text-[8.5px] font-mono font-black uppercase rounded-[4px] px-2 py-0.5 border",
                              isGold ? "bg-indigo-55/10 border-indigo-200 text-indigo-700" : "bg-[#F0FDF4] border-[#00A86B]/10 text-[#00A86B]"
                            )}>
                              {isGold ? `+${m.price}$/m` : "Inclus"}
                            </span>
                          </div>

                          <h3 className="text-xs font-black uppercase text-slate-900 tracking-tight font-mono">{m.name}</h3>
                          <p className="text-[11px] text-slate-500 font-semibold leading-relaxed">{m.benefit}</p>
                        </div>

                        <div className="mt-6 pt-3.5 border-t border-slate-50 flex items-center justify-between gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button 
                            onClick={() => toggleCartModule(m.name)}
                            className={cn(
                              "h-7 w-full text-[9px] font-black uppercase tracking-wider rounded-[6px] border cursor-pointer flex items-center justify-center gap-1 transition-all select-none",
                              isSelected 
                                ? "bg-[#00A86B] text-white border-[#00A86B]" 
                                : "bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border-slate-200"
                            )}
                          >
                            {isSelected ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-white" />
                                <span>Dans mon devis</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-slate-400" />
                                <span>Ajouter au devis</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Devis bar floating indicator */}
                {cart.length > 0 && (
                  <div className="bg-[#0F172A] text-white rounded-[8px] p-6 text-left max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl border border-white/5 font-mono select-none">
                    <div className="space-y-1">
                      <p className="text-xs font-black uppercase text-slate-400">Simulation de Devis de souscription</p>
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
                        Soumettre ma simulation
                      </button>
                    </div>
                  </div>
                )}

                {/* Detailed Module Modal overlay */}
                {activeModuleModal && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-1000 flex items-center justify-center p-4">
                    <div className="bg-white border rounded-[8px] w-full max-w-xl p-6 md:p-8 space-y-6 text-left">
                      <div className="flex items-center justify-between border-b pb-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 bg-[#F0FDF4] rounded-[8px] flex items-center justify-center">
                            {activeModuleModal.icon}
                          </div>
                          <div>
                            <h3 className="text-sm font-black uppercase text-slate-900 font-mono tracking-tight">{activeModuleModal.name}</h3>
                            <span className="text-[9px] font-mono text-slate-400 uppercase font-bold">{activeModuleModal.type} module</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setActiveModuleModal(null)} 
                          className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <div className="space-y-4">
                        <div className="aspect-video bg-slate-100 rounded-[8px] border flex flex-col items-center justify-center relative overflow-hidden select-none">
                          <Video className="w-8 h-8 text-slate-405 mb-2 animate-pulse" />
                          <span className="text-[10px] font-mono text-slate-400 uppercase font-black tracking-widest leading-none">DEMO_VIDEO_MOCKUP_30S.mp4</span>
                        </div>

                        <p className="text-xs text-slate-600 font-semibold leading-relaxed">
                          {activeModuleModal.desc}
                        </p>
                        
                        <div className="bg-[#F0FDF4] border border-[#00A86B]/15 rounded-[6px] p-3 text-xs text-[#00A86B] font-bold font-mono">
                          ✓ Avantage majeur : {activeModuleModal.benefit}
                        </div>
                      </div>

                      <div className="border-t pt-5 mt-6 flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400">TARIF: {activeModuleModal.price > 0 ? `+${activeModuleModal.price}$ / mois` : "Gratuit (Inclus dans Silver)"}</span>
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              toggleCartModule(activeModuleModal.name);
                              setActiveModuleModal(null);
                            }}
                            className={cn(
                              "h-9 px-4 text-xs font-black uppercase rounded-[6px] border cursor-pointer",
                              cart.includes(activeModuleModal.name)
                                ? "bg-[#DC2626] border-[#DC2626] text-white hover:bg-red-700"
                                : "bg-[#00A86B] border-[#00A86B] text-white hover:bg-[#008d59]"
                            )}
                          >
                            {cart.includes(activeModuleModal.name) ? "Retirer de la simulation" : "Ajouter à ma simulation"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 5. TARIFS VIEW (Pricing grids, multi currency converter, slider simulation) */}
            {currentRoute === '/tarifs' && (
              <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8 space-y-16 pb-24">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    💰 Abonnements Souverains
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none">
                    Grille tarifaire claire. Pas de surprises.
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                    Nos abonnements de Tiers Payant s&apos;adaptent parfaitement au volume de bénéficiaires de votre structure.
                  </p>
                </div>

                {/* Currencies switch selector notification banner */}
                <div className="bg-slate-100 border border-slate-200 p-4 rounded-[8px] max-w-2xl mx-auto text-center text-xs text-slate-650 font-bold select-none flex items-center justify-center gap-1.5 font-mono">
                  <Coins className="w-4 h-4 text-[#00A86B]" />
                  <span>Devise de référence activée : <strong className="text-slate-900">{selectedCountry.currency} ({selectedCountry.symbol})</strong>. Modifiez le pays en haut à droite pour convertir !</span>
                </div>

                {/* Plan Tables */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {plansList.map((pl, i) => {
                    const isRec = pl.recommended;
                    return (
                      <div 
                        key={pl.name}
                        className={cn(
                          "bg-white border rounded-[8px] p-6 lg:p-8 flex flex-col justify-between relative shadow-sm hover:shadow-lg transition-all",
                          isRec ? "border-[#00A86B] ring-2 ring-[#00A86B]/10 scale-[1.01]" : "border-slate-200"
                        )}
                      >
                        {isRec && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#00A86B] text-white border border-[#00A86B] font-mono font-black uppercase text-[8.5px] px-3.5 py-1 rounded-full tracking-wider">
                            ★ RECOMMANDÉ RH
                          </span>
                        )}

                        <div className="space-y-6 text-left">
                          <div>
                            <span className="text-[10px] font-mono font-black text-[#00A86B] uppercase tracking-widest block">{pl.motto}</span>
                            <h3 className="text-lg font-black uppercase text-slate-900 font-mono tracking-tight">{pl.name}</h3>
                          </div>

                          <div className="border-y border-slate-100 py-4">
                            <span className="text-3xl font-mono font-black text-slate-900 block leading-tight">
                              {formatPrice(pl.basePriceUsd, "salarié / m")}
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
                              "w-full h-10 text-xs font-black uppercase tracking-wider rounded-[8px] cursor-pointer transition-all",
                              isRec 
                                ? "bg-[#00A86B] text-white hover:bg-[#008d59]" 
                                : "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200"
                            )}
                          >
                            Activer le plan {pl.name}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* ROI Slider Simulator widget */}
                <div className="bg-slate-900 text-white rounded-[8px] border border-white/5 p-6 md:p-10 text-left max-w-4xl mx-auto space-y-6 shadow-2xl relative overflow-hidden select-none">
                  <div className="space-y-1">
                    <span className="text-[9.5px] font-mono font-black text-[#00A86B] uppercase tracking-widest block">Simulateur d&apos;Économies Finance</span>
                    <h3 className="text-xl font-extrabold uppercase font-sans">Simulez votre Retour sur Investissement (ROI)</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                    <div className="md:col-span-6 space-y-4">
                      <div className="flex justify-between items-center text-xs font-mono font-bold text-slate-400">
                        <span>Volume d&apos;employés</span>
                        <strong className="text-white text-sm font-black">{roiEmployees} salariés</strong>
                      </div>
                      <input 
                        type="range"
                        min={10}
                        max={3000}
                        step={10}
                        value={roiEmployees}
                        onChange={(e) => setRoiEmployees(parseInt(e.target.value) || 10)}
                        className="w-full accent-[#00A86B]"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-slate-500 font-bold">
                        <span>10 salariés</span>
                        <span>3000 salariés</span>
                      </div>
                    </div>

                    <div className="md:col-span-6 bg-white/5 border border-white/10 rounded-[8px] p-5 space-y-3.5">
                      <div className="flex justify-between">
                        <span className="text-[11px] text-slate-300">Coût Moyen Fraude de soins Papier (15%)</span>
                        <strong className="text-xs text-[#DC2626] font-mono">~ {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(roiEmployees * 2 * 12 * 0.15)} / an</strong>
                      </div>
                      <div className="flex justify-between border-t border-white/10 pt-2.5">
                        <span className="text-[11px] text-[#00A86B] font-bold">Économie Détecteur Anti-fraude NeoGTec</span>
                        <strong className="text-xs text-[#00A86B] font-mono font-black uppercase">✓ Sécurisé !</strong>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* 6. FAQ VIEW with Live Search filter */}
            {currentRoute === '/faq' && (
              <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 space-y-12 pb-24">
                <div className="text-center max-w-2xl mx-auto space-y-4">
                  <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    💬 Centre D&apos;aide Interactif
                  </span>
                  <h1 className="text-2xl sm:text-4xl font-extrabold uppercase text-slate-900 tracking-tight leading-none animate-fadeIn">
                    Questions fréquentes des DRH Afrique
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold">
                    Rentrez un mot-clé ci-dessous pour filtrer instantanément nos explications d&apos;audits d&apos;assurances.
                  </p>
                </div>

                {/* FAQ Live Search box */}
                <div className="max-w-xl mx-auto relative select-none">
                  <input 
                    type="text"
                    value={searchFAQ}
                    onChange={(e) => setSearchFAQ(e.target.value)}
                    placeholder="Tapez un terme (ex: arca, données, internet, congés)..."
                    className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none focus:ring-4 focus:ring-[#00A86B]/10 focus:border-[#00A86B] font-mono"
                  />
                  {searchFAQ && (
                    <button 
                      onClick={() => setSearchFAQ('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650 text-xs font-mono font-bold"
                    >
                      Effacer
                    </button>
                  )}
                </div>

                {/* FAQ Accordion list */}
                <div className="space-y-4">
                  {filteredFaqs.length > 0 ? (
                    filteredFaqs.map((faq, i) => {
                      const isO = openFAQIndex === i;
                      return (
                        <div 
                          key={faq.q}
                          className="border border-slate-200 rounded-[8px] overflow-hidden bg-white hover:bg-slate-50/50 transition-colors"
                        >
                          <button
                            type="button"
                            onClick={() => setOpenFAQIndex(isO ? null : i)}
                            className="w-full px-5 py-4 flex items-center justify-between text-left cursor-pointer focus:outline-none"
                          >
                            <span className="flex items-center gap-2.5 text-xs font-black uppercase text-slate-900 font-mono tracking-tight leading-snug">
                              <HelpCircle className="w-4 h-4 text-[#00A86B] shrink-0" />
                              {faq.q}
                            </span>
                            {isO ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                          </button>
                          {isO && (
                            <div className="px-5 pb-5 pt-1 text-xs md:text-sm text-slate-500 font-semibold border-t border-slate-100 leading-relaxed">
                              {faq.a}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="border border-dashed border-slate-200 rounded-[8px] p-10 text-center space-y-2 select-none">
                      <HelpCircle className="w-8 h-8 text-slate-300 mx-auto" />
                      <p className="text-xs text-slate-400 font-mono font-bold">Aucune question ne correspond à votre terme.</p>
                    </div>
                  )}
                </div>

                <div className="bg-[#F0FDF4] border border-[#00A86B]/20 rounded-[8px] p-8 text-center max-w-2xl mx-auto space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-900">Vous préférez un diagnostic sur-mesure ?</h3>
                  <button 
                    onClick={() => navigateTo('/affiliation')}
                    className="h-10 px-6 bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-xs uppercase rounded-[8px] cursor-pointer"
                  >
                    Démarrer ma demande d&apos;admission
                  </button>
                </div>
              </div>
            )}

            {/* 7. TUNNEL AFFILIATION VIEW (Multi-step lead form, Zod rules, Rate-limiting simulation, hCaptcha security box) */}
            {currentRoute === '/affiliation' && (
              <div className="mx-auto max-w-3xl px-6 py-12 lg:px-8 space-y-12 pb-24 relative">
                <div className="text-center max-w-xl mx-auto space-y-4 mb-4 select-none">
                  <span className="inline-flex items-center gap-1 bg-[#F0FDF4] border border-[#00A86B]/20 px-3 py-1 rounded-full text-[10px] font-mono font-black text-[#00A86B] uppercase">
                    ⚡ Devis de validation
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 tracking-tight leading-none animate-fadeIn">
                    Affiliez votre entreprise en 5 min
                  </h1>
                  <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                    Remplissez ce dossier de souscription et préparez vos fiches d&apos;admissions de santé collectives.
                  </p>
                </div>

                {/* Cart simulation banner warning if empty */}
                {cart.length === 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-4 text-left text-xs font-bold text-amber-700 flex items-start gap-2.5 max-w-xl mx-auto relative select-none">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <p>Simulation active : Vous n’avez pas encore ajouté de briques à la carte.</p>
                      <button onClick={() => navigateTo('/modules')} className="underline text-slate-950 font-black block mt-1">✓ Explorer les 16 modules</button>
                    </div>
                  </div>
                )}

                <div className="bg-white border rounded-[8px] p-6 md:p-10 shadow-sm relative">
                  
                  {/* Visual Step Stepper */}
                  <div className="flex items-center justify-between border-b pb-6 mb-8 text-[11px] font-mono font-black text-slate-400 select-none">
                    <span className={cn(formStep >= 1 ? "text-[#00A86B]" : "text-slate-400")}>1. Raison Sociale</span>
                    <span className="text-slate-205">/</span>
                    <span className={cn(formStep >= 2 ? "text-[#00A86B]" : "text-slate-400")}>2. Directeur RH</span>
                    <span className="text-slate-205">/</span>
                    <span className={cn(formStep >= 3 ? "text-[#00A86B]" : "text-slate-400")}>3. Configuration</span>
                  </div>

                  {formServerError && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] text-red-800 text-xs font-bold font-mono">
                      ⚠️ {formServerError}
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onLeadFormSubmit)} className="space-y-6">
                    {/* Bot honeypot */}
                    <input type="text" {...register('website_url_field')} className="hidden" />

                    {/* Step 1: Company */}
                    {formStep === 1 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4 text-left">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Raison Sociale (Numéro National / RCCM)</label>
                          <input 
                            type="text"
                            {...register('raison_sociale', { required: "Raison sociale obligatoire." })}
                            placeholder="Ex: ACME CONGO SARL"
                            className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none font-sans"
                          />
                          {errors.raison_sociale && <span className="text-[10px] text-[#DC2626] font-bold block mt-1">{errors.raison_sociale.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Effectif de collaborateurs exclusifs</label>
                            <input 
                              type="number"
                              {...register('nb_employes', { required: "Veuillez dresser l'effectif.", min: { value: 10, message: "10 salariés minimum." } })}
                              placeholder="Ex: 150"
                              className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none font-mono"
                            />
                            {errors.nb_employes && <span className="text-[10px] text-[#DC2626] font-bold block mt-1">{errors.nb_employes.message}</span>}
                          </div>

                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Couverture d&apos;assurance actuelle</label>
                            <input 
                              type="text"
                              {...register('assureur_actuel', { required: "Veuillez spécifier votre couverture actuelle ou 'Aucune'." })}
                              placeholder="Ex: AXA, Sunu ou Aucune"
                              className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none"
                            />
                            {errors.assureur_actuel && <span className="text-[10px] text-[#DC2626] font-bold block mt-1">{errors.assureur_actuel.message}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Contact */}
                    {formStep === 2 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-4 text-left">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Nom complet du signataire mandataire</label>
                          <input 
                            type="text"
                            {...register('nom', { required: "Nom mandataire obligatoire." })}
                            placeholder="Ex: Paul MUKENDI"
                            className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none"
                          />
                          {errors.nom && <span className="text-[10px] text-[#DC2626] font-bold block mt-1">{errors.nom.message}</span>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">E-mail Professionnel (Pas de webmails)</label>
                            <input 
                              type="email"
                              {...register('email_pro', { required: "E-mail obligatoire." })}
                              placeholder="Ex: p.mukendi@acme-congo.cd"
                              className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none"
                            />
                            {errors.email_pro && <span className="text-[10px] text-[#DC2626] font-bold block mt-1">{errors.email_pro.message}</span>}
                          </div>

                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Téléphone RDC (+243...)</label>
                            <input 
                              type="text"
                              {...register('phone', { required: "Téléphone obligatoire." })}
                              placeholder="Ex: +243 812 345 678"
                              className="w-full h-11 px-4 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none font-mono"
                            />
                            {errors.phone && <span className="text-[10px] text-[#DC2626] font-bold block mt-1">{errors.phone.message}</span>}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Package Config & Captcha */}
                    {formStep === 3 && (
                      <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} className="space-y-6 text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Plan d&apos;assurance souhaité</label>
                            <select 
                              {...register('contrat_plan')}
                              className="w-full h-11 px-3 border border-slate-200 rounded-[8px] text-xs font-bold bg-white focus:outline-none"
                            >
                              <option value="Silver">Silver Plan Essentials</option>
                              <option value="Gold">Gold Plan Pro</option>
                              <option value="Platinum">Platinum Plan Unlimited</option>
                            </select>
                          </div>

                          <div className="bg-slate-50 rounded-[8px] p-3 border border-slate-150 flex flex-col justify-center">
                            <span className="text-[8.5px] font-mono font-black text-slate-400 uppercase">Tarif mensuel estimé</span>
                            <strong className="text-slate-900 text-xs font-mono font-black">
                              {selectedPlan === 'Silver' && formatPrice(2, "salarié")}
                              {selectedPlan === 'Gold' && formatPrice(5, "salarié")}
                              {selectedPlan === 'Platinum' && formatPrice(8, "salarié")}
                            </strong>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Observations complémentaires</label>
                          <textarea 
                            rows={2} 
                            {...register('message')}
                            placeholder="Détaillez vos localisations de succursales ou demandes DAF..."
                            className="w-full p-3 border border-slate-200 rounded-[8px] text-xs font-semibold focus:outline-none font-sans"
                          />
                        </div>

                        {/* Interactive Captcha box */}
                        <div className="bg-slate-50 border border-slate-200 p-4.5 rounded-[8px] max-w-sm flex items-center justify-between gap-4 select-none">
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              id="bot-captcha-field"
                              checked={captchaChecked}
                              onChange={(e) => setCaptchaChecked(e.target.checked)}
                              className="w-[18px] h-[18px] accent-[#00A86B] cursor-pointer"
                            />
                            <label htmlFor="bot-captcha-field" className="text-[11px] font-bold text-slate-700 cursor-pointer">
                              Je ne suis pas un spam-bot (hCaptcha)
                            </label>
                          </div>
                          <div className="w-[32px] animate-pulse shrink-0">
                            <ShieldCheck className="w-7 h-7 text-[#00A86B]" />
                          </div>
                        </div>

                        <div className="text-[9px] font-semibold text-slate-400">
                          En cochant, j&apos;accepte la collecte de données conformes à la loi souveraine n°18/035 protection de la vie privée RDC.
                        </div>
                      </motion.div>
                    )}

                    {/* Actions footer */}
                    <div className="border-t border-slate-100 pt-6 mt-8 flex items-center justify-between select-none">
                      {formStep > 1 ? (
                        <button 
                          type="button"
                          onClick={() => setFormStep(prev => Math.max(1, prev - 1))}
                          className="h-10 px-4 rounded-[8px] border border-slate-200 bg-white text-slate-700 font-bold text-xs uppercase cursor-pointer"
                        >
                          Précédent
                        </button>
                      ) : <div />}

                      {formStep < 3 ? (
                        <button 
                          type="button"
                          onClick={handleNextFormStep}
                          className="h-10 px-5 rounded-[8px] bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-xs uppercase cursor-pointer"
                        >
                          Suivant
                        </button>
                      ) : (
                        <button 
                          type="submit"
                          disabled={isSubmittingForm}
                          className="h-10 px-6 rounded-[8px] bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-xs uppercase cursor-pointer disabled:opacity-50 min-w-[10rem]"
                        >
                          {isSubmittingForm ? <Loader2 className="w-4 h-4 animate-spin inline-block mr-1" /> : "Envoyer ma Demande"}
                        </button>
                      )}
                    </div>

                  </form>
                </div>
              </div>
            )}

            {/* 8. CONFIDENTIALITE LEGAL VIEW */}
            {currentRoute === '/confidentialite' && (
              <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 space-y-8 pb-24 text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 tracking-tight">
                  Politique de Confidentialité Conforme Loi n°18/035 RDC
                </h1>
                
                <div className="space-y-6 text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                  <p>
                    La société <strong className="text-slate-900">NeoGTec SARL</strong> est engagée dans la préservation souveraine du secret de traitement de données à caractère personnel de santé et médicales.
                  </p>
                  
                  <div className="p-4 bg-[#F0FDF4] border border-[#00A86B]/20 rounded-[8px] space-y-1 font-mono text-xs text-[#00A86B]">
                    <p>🗄️ LOCALISATION SERVEUR : Kinshasa, République Démocratique du Congo.</p>
                    <p>🛡️ CONFORMITÉ JURIDIQUE : Loi n°18/035 relative à la protection de la vie privée.</p>
                    <p>👤 RESPONSABLE DPO : dpo@neogtec.cd</p>
                  </div>

                  <p>
                    Toutes les demandes de fiches d&apos;admissions ou logs d&apos;audits d&apos;assurances font l&apos;objet d&apos;un chiffrement de bout en bout AES-GCM-256 et ne font l&apos;objet d&apos;aucune transaction de revente tiers.
                  </p>
                </div>

                <div>
                  <button onClick={() => navigateTo('/')} className="h-10 px-5 bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-xs uppercase rounded-[8px] cursor-pointer">
                    Retour à l&apos;accueil
                  </button>
                </div>
              </div>
            )}

            {/* 9. CGU VIEW */}
            {currentRoute === '/cgu' && (
              <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 space-y-8 pb-24 text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 tracking-tight">
                  Conditions Générales d&apos;Utilisation de NeoGTec SaaS
                </h1>
                
                <div className="space-y-6 text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                  <p>
                    L&apos;activation des fiches d&apos;admissions ou du clearing de sinistres numériques implique l&apos;acceptation inconditionnelle des présentes conditions collectives d&apos;utilisation.
                  </p>
                  <p>
                    NeoGTec s&apos;engage à délivrer une disponibilité technique minimale garantie de <strong className="text-slate-900">99,99%</strong> de ses bases d&apos;éligibilité hors coupures régionales d&apos;infrastructure électrique.
                  </p>
                </div>

                <div>
                  <button onClick={() => navigateTo('/')} className="h-10 px-5 bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-xs uppercase rounded-[8px] cursor-pointer">
                    Retour à l&apos;accueil
                  </button>
                </div>
              </div>
            )}

            {/* 10. ARCA RDC TECHNICAL VIEW */}
            {currentRoute === '/arca-rdc' && (
              <div className="mx-auto max-w-4xl px-6 py-12 lg:px-8 space-y-8 pb-24 text-left">
                <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 tracking-tight">
                  Status de Conformité Réglementaire ARCA-RDC
                </h1>
                
                <div className="space-y-6 text-slate-650 text-xs sm:text-sm font-semibold leading-relaxed">
                  <p>
                    NeoGTec opère en conformité technique totale sous l&apos;agrément d&apos;état <strong className="text-slate-900">n° 24/41098</strong> délivré par l&apos;organisme national de régulation des assurances ARCA-RDC.
                  </p>
                  <p>
                    Toutes nos fonctionnalités d&apos;admissions, quote-parts, et Tiers Payant se destinent à la valorisation d&apos;institutions assurant des prises en charge sur territoire congolais souverain.
                  </p>
                </div>

                <div>
                  <button onClick={() => navigateTo('/')} className="h-10 px-5 bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-xs uppercase rounded-[8px] cursor-pointer">
                    Retour à l&apos;accueil
                  </button>
                </div>
              </div>
            )}

            {/* 11. MERCI SUCCESS VIEW WITH CONFETTI & CALENDLY */}
            {currentRoute === '/merci' && (
              <div className="mx-auto max-w-2xl px-6 py-16 lg:px-8 space-y-8 pb-24 text-center relative">
                <DynamicConfetti />
                
                <div className="w-16 h-16 bg-emerald-50 text-[#00A86B] rounded-full flex items-center justify-center mx-auto border border-emerald-200 pb-0.5">
                  <CheckCircle2 className="w-10 h-10 animate-pulse" />
                </div>

                <div className="space-y-4">
                  <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-slate-900 tracking-tight">
                    Félicitations ! Dossier validé.
                  </h1>
                  <p className="text-slate-600 text-xs sm:text-sm font-semibold leading-relaxed max-w-md mx-auto">
                    Merci. Notre conseiller <strong className="text-[#00A86B]">Paul</strong> a reçu votre simulation d&apos;admissions. 
                    <span className="text-slate-900 block font-bold mt-1.5">Paul vous appelle sous 24h ou planifiez un rendez-vous direct ci-dessous !</span>
                  </p>
                </div>

                {/* Calendly simulator click CTA */}
                <div className="bg-slate-900 text-white rounded-[8px] p-6 max-w-md mx-auto border border-white/5 space-y-3.5 select-none font-mono">
                  <span className="text-[10px] text-[#00A86B] font-black uppercase tracking-wider block">🔒 RENDEZ-VOUS CALENDLY DIRECT</span>
                  <p className="text-[11px] text-slate-350 leading-relaxed font-bold">Sélectionnez le créneau de signature DocuSign sans plus attendre.</p>
                  <button 
                    onClick={() => window.open('https://calendly.com/neogtec-rdc/demo', '_blank')}
                    className="h-10 px-5 bg-[#00A86B] hover:bg-[#008d59] text-white font-black text-[11px] uppercase rounded-[8px] cursor-pointer w-full"
                  >
                    Choisir ma date sur Calendly
                  </button>
                </div>

                <div>
                  <button onClick={() => navigateTo('/')} className="h-10 px-5 bg-white border text-slate-700 hover:bg-slate-50 font-black text-xs uppercase rounded-[8px] cursor-pointer">
                    Retour à l&apos;accueil
                  </button>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 🔴 LEGALLY COMPLIANT RDC FOOTER */}
      <footer id="public-footer" className="bg-slate-900 text-white border-t border-white/5 py-16 text-left select-none z-10 relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 leading-snug">
            {/* Column 1: Bio & credentials */}
            <div className="md:col-span-4 space-y-4 text-xs">
              <div className="flex items-center gap-2 cursor-pointer z-10" onClick={() => navigateTo('/')}>
                <div className="w-7 h-7 bg-[#00A86B] text-white rounded-[6px] flex items-center justify-center font-black">N</div>
                <strong className="text-white font-extrabold uppercase text-xs tracking-wider">NeoGTec SaaS</strong>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed max-w-sm">
                Agrégateur B2B panafricain d&apos;assurance santé agréé par l&apos;ARCA-RDC. Nous simplifions le Tiers-Payant collectif et supprimons la fraude d&apos;admissions d&apos;identités en République Démocratique du Congo.
              </p>
              <div className="text-[9px] font-mono text-slate-500 font-bold space-y-0.5 leading-none">
                <p>👤 ENREGISTREMENT : NeoGTec SARL</p>
                <p>📂 RCCMCD : CD/KIN/RCCM/24-B-08310</p>
                <p>🛡️ IDENTIFICATION NATIONALE : ID. NAT. 01-18-N93011B</p>
                <p>📃 AUTORISATION ARCA : DECISION-2026-10492 • CD-41098</p>
              </div>
            </div>

            {/* Column 2: Deployed Countries indicator */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-[9.5px] font-mono font-black uppercase text-slate-400 tracking-wider block">Présent dans 12 pays</span>
              <p className="text-[11px] text-slate-400 font-semibold leading-relaxed">
                RDC, Congo-Brazzaville, Kenya, Nigeria, CIV, Sénégal, Cameroun, Gabon, Togo, Bénin, Guinée et Angola.
              </p>
              <div className="pt-2">
                <span className="inline-block border border-white/10 bg-white/2 px-2.5 py-0.5 rounded-full text-[9px] font-mono text-slate-500 font-bold uppercase tracking-wider select-none">
                  SaaS Multi-tenant 54 Pays
                </span>
              </div>
            </div>

            {/* Column 3: Navigation pages */}
            <div className="md:col-span-2 space-y-3">
              <span className="text-[9.5px] font-mono font-black uppercase text-slate-400 tracking-wider block">Sitemap</span>
              <ul className="space-y-2 text-xs font-bold text-slate-350">
                <li><button onClick={() => navigateTo('/risques')} className="hover:text-[#00A86B] cursor-pointer">5 Risques RH</button></li>
                <li><button onClick={() => navigateTo('/solutions')} className="hover:text-[#00A86B] cursor-pointer">Nos Solutions</button></li>
                <li><button onClick={() => navigateTo('/modules')} className="hover:text-[#00A86B] cursor-pointer">16 Modules</button></li>
                <li><button onClick={() => navigateTo('/tarifs')} className="hover:text-[#00A86B] cursor-pointer">Nos Tarifs</button></li>
                <li><button onClick={() => navigateTo('/faq')} className="hover:text-[#00A86B] cursor-pointer">FAQ Assistance</button></li>
              </ul>
            </div>

            {/* Column 4: Legals & Support */}
            <div className="md:col-span-3 space-y-3">
              <span className="text-[9.5px] font-mono font-black uppercase text-slate-400 tracking-wider block">Légal &amp; Contact</span>
              <ul className="space-y-2 text-xs font-bold text-slate-350">
                <li><button onClick={() => navigateTo('/confidentialite')} className="hover:text-[#00A86B] cursor-pointer">Politique Loi n°18/035</button></li>
                <li><button onClick={() => navigateTo('/cgu')} className="hover:text-[#00A86B] cursor-pointer">Conditions d&apos;usage</button></li>
                <li><button onClick={() => navigateTo('/arca-rdc')} className="hover:text-[#00A86B] cursor-pointer">Agrément ARCA RDC</button></li>
                <li className="pt-2 text-[10px] font-mono font-bold text-slate-500">📞 DPO : dpo@neogtec.cd</li>
                <li className="text-[10px] font-mono font-bold text-slate-500">📍 Avenue du Port, Gombe, Kinshasa</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/5 pt-8 text-center text-[10px] font-mono text-slate-500 font-bold flex flex-wrap justify-between items-center gap-4 select-none">
            <p>© {new Date().getFullYear()} NeoGTec SARL. Tous droits réservés. Agréé ARCA-RDC CD-41098. Données hébergées en RDC.</p>
            <div className="flex gap-4">
              <span className="hover:text-white cursor-pointer" onClick={() => setLanguage(language === 'fr' ? 'en' : 'fr')}>🌍 {language === 'fr' ? 'FR' : 'EN'}</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
