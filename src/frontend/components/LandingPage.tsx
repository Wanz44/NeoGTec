import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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
  AlertTriangle
} from 'lucide-react';
import { cn } from '../lib/utils';

interface LandingPageProps {
  onNavigateToLogin: () => void;
}

export function LandingPage({ onNavigateToLogin }: LandingPageProps) {
  // Solutions State
  const [activeTab, setActiveTab] = useState<'assureurs' | 'hopitaux' | 'entreprises'>('assureurs');

  // Compliance State
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // FAQ State
  const [openFAQIndex, setOpenFAQIndex] = useState<number | null>(0);

  // Form Tunnel State
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [submissionCompleted, setSubmissionCompleted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Configure react-hook-form
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
      nb_employes: '',
      assureur_actuel: '',
      besoins: [] as string[],
      nom: '',
      email_pro: '',
      phone: '',
      message: '',
      website_url_field: ''
    }
  });

  const selectedBesoins = watch('besoins') || [];

  const handleBesoinToggle = (besoinName: string) => {
    const fresh = [...selectedBesoins];
    const idx = fresh.indexOf(besoinName);
    if (idx > -1) {
      fresh.splice(idx, 1);
    } else {
      fresh.push(besoinName);
    }
    setValue('besoins', fresh);
    trigger('besoins');
  };

  const handleNextStep = async () => {
    setServerError(null);
    if (currentStep === 1) {
      const step1Valid = await trigger(['raison_sociale', 'nb_employes', 'assureur_actuel']);
      if (step1Valid) setCurrentStep(2);
    } else if (currentStep === 2) {
      const step2Valid = await trigger('besoins');
      if (step2Valid) {
        if (selectedBesoins.length === 0) {
          setServerError("Veuillez sélectionner au moins un besoin prioritaire.");
          return;
        }
        setCurrentStep(3);
      }
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloading(true);
    setTimeout(() => {
      setIsDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    }, 1205);
  };

  const handleLeadSubmit = async (data: any) => {
    setIsSubmittingForm(true);
    setServerError(null);
    try {
      const response = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || "Une erreur est survenue lors du traitement.");
      }
      setSubmissionCompleted(true);
    } catch (err: any) {
      setServerError(err.message || "Impossible d'enregistrer le devis pour le moment.");
    } finally {
      setIsSubmittingForm(false);
    }
  };

  const handleScrollToTunnel = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('demande-contrat-v');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAlertPrivacy = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Politique de Confidentialité Conforme Loi n°18/035 RDC : Toutes les données à caractère personnel collectées sont exclusivement traitées à des fins d'évaluation de sinistre d'assurance santé et ne font l'objet d'aucune revente commerciale.");
  };

  // Static Data
  const problems = [
    {
      icon: <Clock className="w-8 h-8 text-rose-600 animate-pulse" />,
      title: "30j de délai PEC",
      description: "Le délai moyen de traitement manuel des admissions et prises en charge (PEC) oscille entre 15 et 30 jours, paralysant l'accès aux soins des collaborateurs.",
      regulatoryImpact: "Conséquence : Retards critiques d'hospitalisation et d'insatisfaction sociale."
    },
    {
      icon: <Key className="w-8 h-8 text-rose-600" />,
      title: "Fichiers Excel = Fuite",
      description: "L'échange de données médicales et de listes de bénéficiaires par e-mails ou fichiers non sécurisés expose vos collaborateurs à des fuites massives de données.",
      regulatoryImpact: "Infraction légale : Risques majeurs de violation directe de la Loi n'18/035 protection vie privée."
    },
    {
      icon: <AlertOctagon className="w-8 h-8 text-rose-600" />,
      title: "Amende ARCA jusqu’à 50M FC",
      description: "L'absence de conformité administrative dans l'évaluation collective des risques d'assurance mène vers des amendes rudes imposées par l'ARCA-RDC.",
      regulatoryImpact: "Sanctions : Jusqu'à 50 millions de Francs Congolais d'amende civile."
    }
  ];

  const solutionsContent = {
    assureurs: {
      badge: "Infrastructures assureurs certifiés",
      title: "Pilotage de la solvabilité RDC et clearing de sinistres",
      pillars: [
        { title: "Clearing auto", desc: "Traitement algorithmique sécurisé de 92% des factures médicales en temps réel." },
        { title: "Détection fraude IA", desc: "Identification intelligente des rachet de soins, doublons de prescriptions et surfacturations." },
        { title: "Dashboard ARCA", desc: "Génération automatique d'extraits financiers fiables requis pour vos audits de régulation." }
      ]
    },
    hopitaux: {
      badge: "Réseau hospitalier interconnecté",
      title: "Expérience patient fluide et éradication des impayés",
      pillars: [
        { title: "QR Code Patient", desc: "Vérification en 2s de l'éligibilité au tiers-payant par code QR sécurisé." },
        { title: "Signature digitale", desc: "Consentements et accords de soins cryptés directement sur terminaux tactiles." },
        { title: "Téléconsultation intégrée", desc: "Interconnexion permanente entre cliniques de premier soin et hôpitaux spécialistes." }
      ]
    },
    entreprises: {
      badge: "Portail RH automatisé",
      title: "Zéro paperasse, synchronisation complète de vos affiliations",
      pillars: [
        { title: "Affiliations RH autonomes", desc: "Incorporez, suspendez ou modifiez les fiches d'adhesion de vos titulaires sans bordereaux papier." },
        { title: "Cotisations calculées", desc: "Calcul automatisé des quote-parts patronales mensuelles avec reports d&apos;activité." },
        { title: "Contournement des impayés", desc: "Alertes programmées de surconsommation budgétaire par division ou filiale." }
      ]
    }
  };

  const activeContent = solutionsContent[activeTab];

  const modules = [
    { icon: <Heart className="w-5 h-5 text-[#00A86B]" />, title: "Prise en Charge (PEC)", benefit: "Validation des Bons hôpitaux en moins de 48h.", lead: "Remplace 15 jours d'attente postale." },
    { icon: <Video className="w-5 h-5 text-[#00A86B]" />, title: "Téléconsultation", benefit: "Consultations de premier recours sécurisées.", lead: "Orientation pour les chantiers distants." },
    { icon: <BarChart3 className="w-5 h-5 text-[#00A86B]" />, title: "Business Intelligence", benefit: "Analyse proactive des coûts de santé par profil.", lead: "Arbitrage budgétaire autonome par les RH." },
    { icon: <FolderSync className="w-5 h-5 text-[#00A86B]" />, title: "Clearing médical", benefit: "Triage automatique de 92% des factures.", lead: "Réduit les fraudes et chevauchements de soins." },
    { icon: <QrCode className="w-5 h-5 text-[#00A86B]" />, title: "QR Code Patient", benefit: "Tiers-payant virtuel sécurisé à renouvellement cyclique.", lead: "Élimine totalement le rachat d'identités usurpées." },
    { icon: <MapPin className="w-5 h-5 text-[#00A86B]" />, title: "Géolocalisation GPS", benefit: "Cartographie en temps réel des centres éligibles.", lead: "Orientation instantanée de vos salariés." },
    { icon: <FileSignature className="w-5 h-5 text-[#00A86B]" />, title: "DocuSign (Contrats)", benefit: "Signature numérique légale d&apos;accords d&apos;assurance.", lead: "En conformité avec le code civil de la RDC." },
    { icon: <Smartphone className="w-5 h-5 text-[#00A86B]" />, title: "Application Mobile", benefit: "Canal collaboratif pour le suivi de plafonds par assuré.", lead: "Téléchargements de garanties en 2 clics." }
  ];

  const partners = [
    { name: "SUNU Assurances", label: "Agréé ARCA" },
    { name: "AXA Assurances RDC", label: "Partenaire Technologique" },
    { name: "Ngaliema Medical Center", label: "Établissement Conventionné" },
    { name: "KinPharma Network", label: "Pharmacie Agréée" }
  ];

  const faqItems = [
    { q: "Quel est le coût moyen de notre plateforme ?", a: "NeoGTec applique une tarification SaaS claire indexée sur le volume de salariés affiliés actifs. Pas de frais serveurs cachés." },
    { q: "Quel est le temps moyen pour finaliser l'onboarding ?", a: "Notre importateur de fichiers d&apos;adhesion synchronisés permet de finaliser le déploiement technique complet de votre entreprise en moins de 5 jours." },
    { q: "Est-ce conforme aux réglementations de l'ARCA ?", a: "Oui. NeoGTec est un outil d&apos;excellence technique agréé par l&apos;ARCA-RDC respectant rigoureusement le code des assurances national." },
    { q: "Où sont situées nos bases de données de santé ?", a: "Toutes les fiches d&apos;adhesion et informations cliniques cryptées sont stockées de façon sécurisée à Kinshasa, en RDC." },
    { q: "Est-ce qu'une assistance sur site est comprise ?", a: "Nos équipes locales se déplacent pour parfaire la formation théorique et technique de vos gestionnaires RH et agents d&apos;hospitalisation." },
    { q: "Comment le service client est-il dispensé ?", a: "Un support multicanal (E-mail, Téléphone, WhatsApp Business) est à votre service 24h/24 et 7j/7 pour un blocage immédiat de sinistres." }
  ];

  return (
    <div className="w-full bg-white text-[#0A0A0A] font-sans">
      
      {/* 🚀 NAVBAR HEADER */}
      <nav className="fixed top-0 inset-x-0 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16 z-[100] px-6 md:px-12 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#00A86B] text-white rounded-lg flex items-center justify-center font-black">N</div>
          <span className="font-extrabold uppercase text-sm tracking-widest text-[#0A0A0A]">NeoGTec SaaS</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 uppercase tracking-wider font-mono">
          <a href="#problems" className="hover:text-[#00A86B]">Risques</a>
          <a href="#solutions" className="hover:text-[#00A86B]">Solutions</a>
          <a href="#modules" className="hover:text-[#00A86B]">Modules</a>
          <a href="#faq" className="hover:text-[#00A86B]">FAQ</a>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onNavigateToLogin}
            className="h-9 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-black uppercase tracking-wide cursor-pointer transition-all"
          >
            Portail Administration
          </button>
          <a 
            href="#demande-contrat-v"
            onClick={handleScrollToTunnel}
            className="h-9 px-4 rounded-xl bg-[#00A86B] text-white hover:bg-[#008d59] text-[11px] font-black uppercase tracking-wide cursor-pointer flex items-center justify-center transition-all"
          >
            S&apos;affilier
          </a>
        </div>
      </nav>

      {/* 1. HERO SECTION */}
      <header className="relative pt-24 pb-20 md:pt-32 md:pb-28 border-b border-slate-100 overflow-hidden bg-white/50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-center">
            
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#00A86B]/25 bg-[#00A86B]/5 px-3 py-1 text-[9.5px] font-black text-[#00A86B] tracking-wider uppercase font-mono">
                <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
                <span>Agréateur Institutionnel : Agréé ARCA-RDC</span>
              </div>
              
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold uppercase text-slate-900 leading-[1.05] tracking-tight">
                NeoGTec : La plateforme SaaS qui divise par <span className="text-[#00A86B]">3</span> le délai des prises en charge santé en RDC
              </h1>
              
              <p className="text-slate-600 text-sm md:text-base leading-relaxed font-semibold max-w-xl">
                La solution d&apos;assurance santé connectée pour l&apos;Afrique de l&apos;Est. 
                <span className="text-slate-950 block font-bold mt-1.5">✓ Agréée ARCA-RDC • 100% traçable • Données souveraines en RDC • Chiffrement National AES-256.</span>
              </p>

              <div className="flex flex-wrap gap-3 font-mono text-[10px] text-slate-500 font-bold">
                <span className="bg-slate-50 border px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-[#00A86B]" /> Datacenter National (Kinshasa)
                </span>
                <span className="bg-slate-50 border px-2.5 py-1 rounded-lg flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-[#00A86B]" /> Cryptographie AES-256 pgsodium
                </span>
              </div>

              <div className="flex flex-wrap gap-4 pt-2">
                <a 
                  href="#demande-contrat-v" 
                  onClick={handleScrollToTunnel}
                  className="h-11 px-5 rounded-xl bg-[#00A86B] text-white hover:bg-[#008d59] font-black text-[11px] uppercase tracking-wider shadow-lg shadow-[#00A86B]/15 flex items-center"
                >
                  Démarrer ma demande de contrat
                </a>
                <button
                  onClick={onNavigateToLogin}
                  className="h-11 px-5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-[#0A0A0A] font-black text-[11px] uppercase tracking-wider"
                >
                  Accéder au Portail Client
                </button>
              </div>
            </div>

            {/* Simulated Desktop Mockup right */}
            <div className="lg:col-span-5">
              <div className="mx-auto w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-4 shadow-2xl relative">
                <div className="flex items-center gap-1 border-b border-slate-800 pb-2.5 mb-3 font-mono text-[9px] text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  <div className="w-2 rounded-full bg-amber-500 h-2" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="ml-1.5">statut_assurance_neogtec_rdc.sh</span>
                </div>
                
                <div className="space-y-3.5 text-left">
                  <div className="p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase font-mono">Délai Prise En Charge (PEC)</span>
                      <strong className="text-lg text-[#00A86B] block">48 heures <span className="text-[10px] text-slate-400 font-semibold">(au lieu de 15j)</span></strong>
                    </div>
                    <Activity className="w-6 h-6 text-[#00A86B] animate-pulse" />
                  </div>

                  <div className="p-3 bg-slate-950 rounded-xl border border-white/5 space-y-1.5 font-mono text-[9px] text-[#00ff66]">
                    <p>» SECURE CORE: active (CD-KIN Datacenter)</p>
                    <p>» CIPHER: AES-GCM-256 is ONLINE</p>
                    <p>» AUDIT STATUS: 200 COMMITTED OK</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-bold text-white font-mono">
                    <div className="p-2 bg-white/5 rounded-lg">
                      <p className="text-[7.5px] text-slate-405 mb-0.5">Clearing</p>
                      <p className="text-[#00A86B]">92% Auto</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <p className="text-[7.5px] text-slate-405 mb-0.5">Fraude</p>
                      <p className="text-amber-500">99% Bloqué</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded-lg">
                      <p className="text-[7.5px] text-slate-405 mb-0.5">Hébergé</p>
                      <p className="text-sky-400">100% RDC</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* 2. PROBLEMS SECTION */}
      <section id="problems" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-rose-600 tracking-widest font-mono block">Défis Nationaux RDC</span>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase text-slate-900">Le Statu Quo de la Gestion de Santé Papier</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {problems.map((prob, idx) => (
              <div key={idx} className="bg-white border rounded-2xl p-6 shadow-3xs hover:shadow-xl transition-all text-left flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-rose-50 border border-rose-100 rounded-xl flex items-center justify-center">
                    {prob.icon}
                  </div>
                  <h3 className="text-base font-black uppercase text-slate-900">{prob.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-semibold">{prob.description}</p>
                </div>
                <div className="border-t pt-4 mt-6">
                  <span className="text-[9.5px] font-mono text-rose-700 font-black uppercase block">★ {prob.regulatoryImpact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SOLUTIONS SECTION */}
      <section id="solutions" className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-10">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-[#00A86B] tracking-widest font-mono block">Plateforme Partagée</span>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase text-slate-900">La Réponse SaaS pour chaque Acteur</h2>
          </div>

          <div className="inline-flex h-11 items-center bg-slate-100 p-1 border rounded-2xl">
            <button 
              onClick={() => setActiveTab('assureurs')}
              className={cn("px-4 py-1.5 rounded-xl text-xs font-bold transition-all outline-none focus:ring-0 cursor-pointer uppercase", activeTab === 'assureurs' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800')}
            >
              DSI & Assureurs
            </button>
            <button 
              onClick={() => setActiveTab('hopitaux')}
              className={cn("px-4 py-1.5 rounded-xl text-xs font-bold transition-all outline-none focus:ring-0 cursor-pointer uppercase", activeTab === 'hopitaux' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800')}
            >
              Hôpitaux & Cliniques
            </button>
            <button 
              onClick={() => setActiveTab('entreprises')}
              className={cn("px-4 py-1.5 rounded-xl text-xs font-bold transition-all outline-none focus:ring-0 cursor-pointer uppercase", activeTab === 'entreprises' ? 'bg-white text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800')}
            >
              Espace RH
            </button>
          </div>

          <div className="w-full max-w-4xl mx-auto bg-slate-50 rounded-3xl border p-8 md:p-10 shadow-3xs">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-left">
              <div className="md:col-span-5 space-y-3">
                <span className="inline-block bg-[#00A86B]/10 border border-[#00A86B]/20 rounded-full px-2.5 py-0.5 text-[9px] font-mono font-black uppercase text-[#00A86B]">{activeContent.badge}</span>
                <h3 className="text-xl font-extrabold uppercase text-slate-900 leading-tight">{activeContent.title}</h3>
              </div>
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeContent.pillars.map((pil, idx) => (
                  <div key={idx} className="bg-white border rounded-xl p-4.5 space-y-1.5 hover:border-[#00a86b]/35 transition-colors shadow-3xs">
                    <span className="text-[10px] font-mono font-black uppercase text-[#00A86B] flex items-center gap-1">✓ {pil.title}</span>
                    <p className="text-[11px] text-slate-600 font-semibold leading-relaxed">{pil.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPLIANCE SECTION */}
      <section className="bg-slate-900 text-white py-16 relative overflow-hidden border-b border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-8 text-left space-y-5">
              <span className="inline-block border border-[#00A86B]/40 bg-[#00A86B]/15 text-[#00A86B] rounded-full px-3 py-0.5 text-[9.5px] font-mono font-black uppercase tracking-wider">★ Garantie Souveraine Juridique</span>
              <h2 className="text-2xl md:text-4xl font-extrabold uppercase font-sans">Sécurité Clinique et Conformité RGPD Loi n°18/035 RDC</h2>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed font-semibold max-w-2xl">
                Toutes les listes d&apos;adhérents et dossiers d&apos;audits d&apos;assurances sont encryptés de bout en bout et hébergés localement en RDC. Aucun rachat ou extraction d&apos;informations ne peut être opéré sans l&apos;empreinte cryptographique des consentements.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-semibold text-slate-400 font-sans">
                <p>• <strong className="text-white">Chiffrement AES-GCM-256</strong> et clés d&apos;audit logs immuables.</p>
                <p>• <strong className="text-white">Datacenter Souverain local</strong> situé à Kinshasa (Gombe).</p>
                <p>• <strong className="text-white">Autorisation n°CD/KIN/ARCA/2026</strong> en cours de validation.</p>
                <p>• <strong className="text-white">Conformité Loi N°18/035</strong> pour la vie privée.</p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-[10px] font-mono text-slate-500 font-bold select-none pt-4">
                <span className="border border-white/5 bg-white/2 px-3 py-1 rounded-lg">ARCA CERTIFIED</span>
                <span className="border border-white/5 bg-white/2 px-3 py-1 rounded-lg">CNAM COMPLIANT</span>
                <span className="border border-white/5 bg-white/2 px-3 py-1 rounded-lg">ISO 27001 METHODOLOGY</span>
              </div>
            </div>

            <div className="lg:col-span-4 bg-white/5 border border-white/10 rounded-2xl p-6 text-left space-y-4">
              <div className="w-10 h-10 bg-[#00A86B]/15 text-[#00A86B] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black uppercase text-white font-mono">Livre Blanc Sécurité</h4>
                <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">Téléchargez notre manifeste complet sur le stockage souverain des données en République Démocratique du Congo.</p>
              </div>
              <form onSubmit={handleDownload} className="space-y-2">
                <button 
                  type="submit" 
                  disabled={isDownloading || downloadSuccess}
                  className="w-full h-10 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-black text-[11px] uppercase cursor-pointer flex items-center justify-center gap-1.5 transition-all text-xs"
                >
                  {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : downloadSuccess ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                  {isDownloading ? "Préparation..." : downloadSuccess ? "Manifeste disponible !" : "Télécharger le PDF"}
                </button>
                {downloadSuccess && <p className="text-center text-[9.5px] font-mono text-[#00A86B] font-bold">✓ PDF ouvert dans votre navigateur.</p>}
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* 5. MODULES SECTION */}
      <section id="modules" className="py-16 bg-slate-50 border-b border-slate-100">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-[#00A86B] tracking-widest font-mono block">Catalogue de Modules</span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-slate-900">Un Écosystème SaaS Connecté 100% Modulaire</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {modules.map((mod, idx) => (
              <div key={idx} className="bg-white border rounded-2xl p-5 shadow-3xs flex flex-col justify-between text-left group">
                <div className="space-y-3">
                  <div className="w-9 h-9 bg-[#00A86B]/10 rounded-xl flex items-center justify-center text-[#00A86B] group-hover:bg-[#00A86B]/25 transition-colors">
                    {mod.icon}
                  </div>
                  <h4 className="text-[11.5px] font-black uppercase text-slate-950 tracking-wide font-mono">{mod.title}</h4>
                  <p className="text-[11px] font-bold text-slate-800 leading-relaxed">{mod.benefit}</p>
                </div>
                <p className="text-[10px] text-slate-400 mt-4 pt-3 border-t leading-normal">{mod.lead}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SOCIAL PROOF SECTION */}
      <section className="py-16 bg-white border-b border-slate-100 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest font-mono block">Crédibilité Établie</span>
            <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Ils nous font confiance</h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 select-none">
            {partners.map((p, idx) => (
              <div key={idx} className="bg-slate-50 border p-5 rounded-2xl flex flex-col items-center min-w-44">
                <span className="text-slate-900 font-extrabold text-xs uppercase tracking-wide">{p.name}</span>
                <span className="text-[8.5px] font-mono text-slate-400 uppercase font-bold mt-1">{p.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonial Quote */}
          <div className="max-w-2xl mx-auto bg-slate-50 border rounded-3xl p-8 relative">
            <Quote className="absolute -top-3 -left-3 w-12 h-12 text-slate-200" />
            <div className="space-y-4">
              <blockquote className="text-sm md:text-base font-serif italic text-slate-800 font-semibold leading-relaxed">
                &ldquo;NeoGTec a réduit nos délais de prise en charge d&apos;affiliation collective de 15 jours à moins de 48 heures au comptoir de l&apos;admission hôpital. Notre satisfaction interne RH n&apos;a jamais été aussi haute.&rdquo;
              </blockquote>
              <div>
                <span className="font-extrabold uppercase text-xs block text-slate-900">Marie KAPEND</span>
                <span className="text-[8.5px] font-mono text-slate-500 uppercase font-black">Directrice RH, ACME Corporation RDC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TUNNEL B2B (MANDATORY ID MATCH) */}
      <section id="demande-contrat-v" className="py-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center space-y-12 relative">
          
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-[#00A86B] tracking-widest font-mono block">Devis de Souscription Instantané</span>
            <h2 className="text-2xl md:text-4xl font-extrabold uppercase">Souscription d&apos;Affiliation Collective</h2>
          </div>

          <div className="bg-white text-slate-900 rounded-3xl border shadow-2xl p-6 md:p-10 text-left">
            
            {submissionCompleted ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 bg-emerald-50 text-[#00A86B] rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-black uppercase text-slate-950">Devis Enregistré avec Succès !</h3>
                <p className="text-xs text-slate-500 font-bold max-w-sm mx-auto">Votre dossier d&apos;évaluation de sinistre a été validé. <strong>Un conseiller NeoGTec expert vous appelle sous 24 heures pour finaliser la signature DocuSign.</strong></p>
              </div>
            ) : (
              <div className="space-y-6">
                
                {/* Steps banner */}
                <div className="flex items-center justify-between border-b pb-4 text-[9.5px] font-black font-mono text-slate-400">
                  <span className={currentStep === 1 ? 'text-[#00A86B]' : ''}>1. Établissement</span>
                  <span className={currentStep === 2 ? 'text-[#00A86B]' : ''}>2. Vos Besoins</span>
                  <span className={currentStep === 3 ? 'text-[#00A86B]' : ''}>3. Coordonnées</span>
                </div>

                {serverError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-[11px] font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{serverError}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit(handleLeadSubmit)} className="space-y-5">
                  <input type="text" {...register('website_url_field')} className="hidden" />

                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Raison Sociale de l&apos;Entreprise (RCCM RDC)</label>
                        <input 
                          type="text" 
                          {...register('raison_sociale', { required: "La raison sociale est requise." })}
                          placeholder="Ex: ACME CONGO SARL" 
                          className="w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none focus:border-[#00A86B]"
                        />
                        {errors.raison_sociale && <span className="text-[10px] text-rose-600 font-bold block mt-1">{errors.raison_sociale.message as string}</span>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Nombre d&apos;employés prévus</label>
                          <select 
                            {...register('nb_employes', { required: "L'effectif est requis." })}
                            className="w-full h-10 px-2.5 border rounded-xl text-xs font-bold bg-white focus:outline-none"
                          >
                            <option value="">Sélectionnez</option>
                            <option value="1-10">1-10 salariés</option>
                            <option value="11-50">11-50 salariés</option>
                            <option value="51-200">51-200 salariés</option>
                            <option value="250+">200+ salariés</option>
                          </select>
                          {errors.nb_employes && <span className="text-[10px] text-rose-600 font-bold block mt-1">{errors.nb_employes.message as string}</span>}
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Assureur Santé Actuel (Si existant)</label>
                          <input 
                            type="text" 
                            {...register('assureur_actuel', { required: "Veuillez spécifier votre couverture actuelle ou 'Aucune'." })}
                            placeholder="Ex: Sunu, AXA ou Aucune" 
                            className="w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none"
                          />
                          {errors.assureur_actuel && <span className="text-[10px] text-rose-600 font-bold block mt-1">{errors.assureur_actuel.message as string}</span>}
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="space-y-4 animate-fadeIn">
                      <label className="text-[10.5px] font-mono font-black uppercase text-slate-500 block mb-2">Sélectionnez les Services Prioritaires (Au moins un)</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {[
                          { val: 'PEC', lab: "Validation de Prises en Charge rapides (moins de 48h)" },
                          { val: 'QR', lab: "Système de Tiers-Payant Dématérialisé (QR Patient)" },
                          { val: 'BI', lab: "Outil de BI & Reporting d&apos;audit financier" },
                          { val: 'MOBILE', lab: "Application Mobiles pour nos Affiliés RDC" }
                        ].map((m) => {
                          const isSel = selectedBesoins.includes(m.val);
                          return (
                            <button
                              type="button"
                              key={m.val}
                              onClick={() => handleBesoinToggle(m.val)}
                              className={cn(
                                "p-3 border rounded-xl text-left bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer text-xs flex flex-col justify-between min-h-[5.5rem] font-bold",
                                isSel ? 'border-[#00a86b] bg-[#00A86B]/5 text-slate-900' : 'border-slate-205 text-slate-600'
                              )}
                            >
                              <span>{m.lab}</span>
                              <span className="text-[8px] font-mono text-slate-400 block mt-1">{isSel ? '✓ Sélectionné' : 'Cliquer pour cocher'}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="space-y-4 animate-fadeIn">
                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Nom complet du signataire mandataire</label>
                        <input 
                          type="text" 
                          {...register('nom', { required: "Votre nom est requis." })}
                          placeholder="Ex: Paul MUKENDI" 
                          className="w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none"
                        />
                        {errors.nom && <span className="text-[10px] text-rose-600 font-bold block mt-1">{errors.nom.message as string}</span>}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">E-mail Professionnel (Pas de Gmail)</label>
                          <input 
                            type="email" 
                            {...register('email_pro', { required: "E-mail professionnel obligatoire." })}
                            placeholder="Ex: p.mukendi@acme-congo.cd" 
                            className="w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none"
                          />
                          {errors.email_pro && <span className="text-[10px] text-rose-600 font-bold block mt-1">{errors.email_pro.message as string}</span>}
                        </div>

                        <div>
                          <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Téléphone RDC (+243 ou 08...)</label>
                          <input 
                            type="text" 
                            {...register('phone', { required: "Téléphone obligatoire de contact." })}
                            placeholder="Ex: +243 812 345 678" 
                            className="w-full h-10 px-3.5 border rounded-xl text-xs font-semibold focus:outline-none font-mono"
                          />
                          {errors.phone && <span className="text-[10px] text-rose-600 font-bold block mt-1">{errors.phone.message as string}</span>}
                        </div>
                      </div>

                      <div>
                        <label className="text-[10px] font-mono font-black uppercase text-slate-500 mb-1.5 block">Message / Observations optionnels d&apos;assistance</label>
                        <textarea 
                          rows={2} 
                          {...register('message')}
                          placeholder="Précisez tout raccordement obligatoire visé..." 
                          className="w-full p-3 border rounded-xl text-xs bg-slate-50 font-semibold focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Form actions bar */}
                  <div className="flex items-center justify-between border-t pt-5 mt-6">
                    {currentStep > 1 ? (
                      <button 
                        type="button" 
                        onClick={handlePrevStep}
                        className="h-10 px-4 rounded-xl border bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" /> Précédent
                      </button>
                    ) : <div />}

                    {currentStep < 3 ? (
                      <button 
                        type="button" 
                        onClick={handleNextStep}
                        className="h-10 px-5 rounded-xl bg-[#00A86B] text-white hover:bg-[#008d59] text-xs font-black uppercase transition-all cursor-pointer"
                      >
                        Suivant
                      </button>
                    ) : (
                      <button 
                        type="submit" 
                        disabled={isSubmittingForm}
                        className="h-10 px-6 rounded-xl bg-[#00A86B] text-white hover:bg-[#008d59] text-xs font-black uppercase transition-all cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingForm ? <Loader2 className="w-4 h-4 animate-spin inline-block mr-1" /> : "Soumettre la demande"}
                      </button>
                    )}
                  </div>

                </form>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* 8. FAQ & FOOTER */}
      <section id="faq" className="py-16 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-[10px] font-black uppercase text-[#00A86B] tracking-widest font-mono block">Questions Fréquentes</span>
            <h2 className="text-2xl md:text-3xl font-extrabold uppercase text-slate-900">Des Réponses Précises à Vos Questions</h2>
          </div>

          <div className="space-y-4 text-left">
            {faqItems.map((faq, idx) => {
              const isO = openFAQIndex === idx;
              return (
                <div key={idx} className="border rounded-2xl overflow-hidden bg-slate-50/40 hover:bg-slate-50 transition-colors">
                  <button
                    type="button"
                    onClick={() => setOpenFAQIndex(isO ? null : idx)}
                    className="w-full px-6 py-4 flex items-center justify-between text-xs font-black uppercase text-slate-900 font-mono text-left cursor-pointer"
                  >
                    <span className="flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#00A86B] shrink-0" />
                      {faq.q}
                    </span>
                    {isO ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isO && (
                    <div className="px-6 pb-5 text-slate-650 text-[12px] leading-relaxed font-semibold border-t border-slate-100/50 pt-2.5">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LEGALLY COMPLIANT RDC FOOTER */}
      <footer className="bg-slate-50 border-t py-12 text-[#0A0A0A] text-left">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            <div className="md:col-span-6 space-y-3">
              <div className="flex items-center gap-2 text-[#00A86B] font-extrabold text-base uppercase tracking-wider select-none">
                <div className="w-6 h-6 bg-[#00A86B] text-white rounded flex items-center justify-center font-bold text-xs">N</div>
                <span>NeoGTec SaaS</span>
              </div>
              <p className="text-[11px] text-slate-500 font-semibold max-w-sm">
                NeoGTec SARL est une plateforme d&apos;agrégation digitale de prestations d&apos;assurances santé en RDC, agréée par l&apos;ARCA RDC et œuvrant pour l&apos;accès simplifié au régime d&apos;assurance collective.
              </p>
              <div className="text-[9px] font-mono text-slate-400 font-bold space-y-0.5 leading-none">
                <p>👤 ENREGISTREMENT : NeoGTec SARL</p>
                <p>📂 RCCMCD : CD/KIN/RCCM/24-B-08310</p>
                <p>🛡️ IDENTIFICATION NATIONALE : ID. NAT. 01-18-N93011B</p>
                <p>📃 AUTORISATION ARCA : CD/KIN/ARCA/DECISION-2026-10492</p>
              </div>
            </div>

            <div className="md:col-span-3 space-y-2">
              <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider block">Siège Social RDC</span>
              <div className="flex items-start gap-1.5 text-xs text-slate-650 leading-relaxed font-semibold">
                <MapPin className="w-4 h-4 text-[#00A86B] mt-0.5 shrink-0" />
                <p>Immeuble BCC, 4ème Étage<br />Avenue du Port, Gombe<br />Kinshasa, République Démocratique du Congo</p>
              </div>
              <p className="text-xs font-mono font-bold text-slate-650 flex items-center select-none gap-1.5"><Mail className="w-3.5 h-3.5 text-[#00A86B]" /> contact@neogtec.com</p>
            </div>

            <div className="md:col-span-3 space-y-2">
              <span className="text-[9px] font-mono font-black uppercase text-slate-400 tracking-wider block">Mentions légales</span>
              <ul className="space-y-2 text-xs font-extrabold text-slate-650">
                <li><a href="#privacy" onClick={handleAlertPrivacy} className="hover:text-[#00A86B] flex items-center gap-1">Loi n°18/035 RDC <ExternalLink className="w-3 h-3 text-slate-400" /></a></li>
                <li><a href="#privacy-p" onClick={handleAlertPrivacy} className="hover:text-[#00A86B] flex items-center gap-1">Politique de Protection <ExternalLink className="w-3 h-3 text-slate-400" /></a></li>
                <li><button onClick={onNavigateToLogin} className="hover:text-[#00A86B] text-left cursor-pointer outline-none">Espace Administration Client</button></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-slate-205 mt-10 pt-5 text-center text-[10px] font-mono text-slate-400 font-bold">
            <p>© {new Date().getFullYear()} NeoGTec SARL. Tous droits réservés. Agréé ARCA-RDC CD-41098. Données hébergées en RDC.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
