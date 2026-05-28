import React, { useState, useEffect } from 'react';
import { 
  X, HelpCircle, Search, Play, Pause, ChevronRight, MessageSquare, 
  Send, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw, 
  BookOpen, Video, ArrowRight, CornerDownRight, Info, Check, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface HelpSystemProps {
  activeModule: string;
  onModuleChange: (module: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onStartTour: () => void;
  logAction: (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'CRITICAL') => void;
}

// Sub-component: Video Player Simulation
const MiniVideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 5;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-750 p-2.5 space-y-2">
      <div className="relative aspect-video bg-slate-950 rounded-xl flex flex-col justify-between p-3 overflow-hidden">
        {/* Mock Screen Content */}
        <div className="absolute inset-0 flex flex-col justify-between p-2.5 opacity-40 select-none pointer-events-none">
          <div className="flex justify-between items-center">
            <span className="text-[7px] font-mono text-emerald-400 font-bold">NeoGTec Stream v1.2</span>
            <span className="text-[6px] bg-red-600 text-white font-bold px-1 rounded animate-pulse">REC</span>
          </div>
          <div className="w-16 h-1 bg-indigo-500/50 rounded-full mx-auto" />
          <div className="flex justify-between text-[5px] font-semibold text-slate-500">
            <span>Module: claims</span>
            <span>Est. 2026-05-28</span>
          </div>
        </div>

        {/* Video Overlays */}
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 z-10">
          <button 
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-green-500 hover:bg-green-600 text-slate-950 flex items-center justify-center shadow-lg transform hover:scale-105 active:scale-95 transition-all outline-none cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
          </button>
        </div>

        {/* Info panel in player */}
        <div className="z-20 text-[8px] font-black text-white/90 bg-slate-900/80 backdrop-blur-md p-1.5 rounded-lg border border-white/10 flex justify-between items-center leading-none mt-auto">
          <span>{isPlaying ? "▶ Lecture de la micro-démo" : "⏸️ Tutoriel : Refuser un sinistre"}</span>
          <span className="font-mono text-[7px] text-orange-400">00:30</span>
        </div>
      </div>

      {/* Progress Bar of player */}
      <div className="space-y-1">
        <div className="h-1.5 w-full bg-slate-850 rounded-full overflow-hidden">
          <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex justify-between text-[8.5px] text-slate-400 font-mono">
          <span>{isPlaying ? `00:${Math.floor(progress * 0.3).toString().padStart(2, '0')}` : "00:07"}</span>
          <span>00:30</span>
        </div>
      </div>
    </div>
  );
};

// Help Knowledge Articles Template
const STATIC_ARTICLES = [
  {
    id: 'art-1',
    category: 'claims',
    title: 'Comment traiter ou refuser un Sinistre maladie ?',
    content: 'Dans le module Sinistres, sélectionnez la ligne concernée. Si la pre-autorisation est manquante ou si le barème ARCA dépasse le devis, utilisez le bouton "Rejeter" avec un code de motif CNIL standard pour éviter les litiges.',
    targetModule: 'claims',
    video: true
  },
  {
    id: 'art-2',
    category: 'partners',
    title: 'Suspendre temporairement un établissement partenaire',
    content: 'Utilisez le profil d\'établissement pour insérer une friction "Soft Delete". Tapez "SUSPENDRE" pour geler les droits Tiers Payant de clinique et notifier automatiquement les assurés par SMS/Push.',
    targetModule: 'partners'
  },
  {
    id: 'art-3',
    category: 'governance',
    title: 'Activer le double contrôle bancaire (4-Eyes Principal)',
    content: 'Chaque virement excédant 50,000 USD demande l\'empreinte d\'un deuxième collaborateur comptable. L\'initiateur génère le hash, le superviseur le scelle dans son coffre.',
    targetModule: 'governance'
  },
  {
    id: 'art-4',
    category: 'settings',
    title: 'Générer l\'export du rapport de conformité RGPD',
    content: 'La CNIL exige une réauthentification automatique même si vous possédez déjà une session valide. Entrez votre mot de passe pour sceller l\'export chiffré.',
    targetModule: 'profile'
  },
  {
    id: 'art-5',
    category: 'dashboard',
    title: 'Piloter les KPI d\'activité & Alertes de maintenance',
    content: 'Le point vert détermine l\'état opérationnel. En cas d\'incident critique sur la base de données ou les passerelles telecom, une alerte est émise vers les administrateurs de garde.',
    targetModule: 'dashboard'
  }
];

export const HelpSystem: React.FC<HelpSystemProps> = ({ 
  activeModule, 
  onModuleChange, 
  isOpen, 
  onClose, 
  onStartTour,
  logAction
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'articles' | 'whatsapp' | 'ticket'>('articles');
  
  // WhatsApp Bot state
  const [whatsappMessages, setWhatsappMessages] = useState<Array<{
    id: string;
    sender: 'user' | 'bot';
    text: string;
    time: string;
  }>>([
    {
      id: 'w-1',
      sender: 'bot',
      text: "👋 Bonjour ! Je suis l'agent automatique d'assistance NeoGTec. Comment puis-je vous guider ? Choisissez une option ci-dessous :",
      time: '10:20'
    }
  ]);

  // Support Ticket Form State
  const [ticketCategory, setTicketCategory] = useState('Bug Technique');
  const [ticketSeverity, setTicketSeverity] = useState('P2 - Élevé');
  const [ticketDesc, setTicketDesc] = useState('');
  const [attachScreenshot, setAttachScreenshot] = useState(true);
  const [ticketSuccess, setTicketSuccess] = useState<string | null>(null);

  // System Incidents Simulator
  const [systemIncidentActive, setSystemIncidentActive] = useState(false);

  // Search Results
  const filteredArticles = STATIC_ARTICLES.filter(art => 
    art.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    art.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    art.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get active module specific articles
  const activeModuleArticles = STATIC_ARTICLES.filter(art => art.category === activeModule);

  const handleSendWhatsappOption = (optionNum: number, text: string) => {
    const userTime = new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    const userMsg = {
      id: `w-user-${Date.now()}`,
      sender: 'user' as const,
      text: `Option ${optionNum} : ${text}`,
      time: userTime
    };

    setWhatsappMessages(prev => [...prev, userMsg]);

    setTimeout(() => {
      let replyText = "";
      if (optionNum === 1) {
        replyText = "💰 [SOLDE & PLAFOND] Les cotisations sont calculées sur un taux de déviation de 2.41% d'intérêt. Le plafond général par défaut de Gombe est fixé à 5,000 USD par assuré.";
      } else if (optionNum === 2) {
        replyText = "🧾 [FACTURATION] Les paiements s'effectuent par Mobile Money (M-Pesa, Orange, Airtel) ou Ordre de Virement certifié SHA256 avec double validation N+1.";
      } else {
        replyText = "👮 [AGENT DE GARDE] Votre demande va être transmise au médecin-conseil de garde (+243 81 22... ). Patientez quelques instants.";
      }

      const botMsg = {
        id: `w-bot-${Date.now()}`,
        sender: 'bot' as const,
        text: replyText,
        time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setWhatsappMessages(prev => [...prev, botMsg]);
      logAction('INTEG_ASSISTANCE_WHATSAPP', `Simulation WhatsApp Bot - Option choisie : ${text}`, 'SUCCESS');
    }, 700);
  };

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketDesc.trim()) return;

    logAction('SOUMISSION_TICKET_ASSISTANCE', `Ticket support émis : Categorie: ${ticketCategory}, Sévérité: ${ticketSeverity}. Capture attachée: ${attachScreenshot}`, 'WARNING');
    setTicketSuccess(`Ticket #${Math.floor(1000 + Math.random() * 9000)} créé avec succès ! Sévérité : ${ticketSeverity}. Un ingénieur support de niveau 2 prend en charge votre demande. Temps moyen de réponse : 2 h.`);
    setTicketDesc('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Transparent Backdrop but clickable to close panel */}
          <div className="fixed inset-0 z-[190] bg-slate-900/30 backdrop-blur-xs cursor-pointer" onClick={onClose} />

          <motion.div
            initial={{ opacity: 0, x: 380 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 380 }}
            transition={{ type: 'spring', damping: 28, stiffness: 280 }}
            className="fixed top-0 right-0 h-screen w-full max-w-sm bg-white border-l border-slate-200 shadow-2xl z-[200] flex flex-col justify-between overflow-hidden"
          >
            {/* Header Area */}
            <div className="p-5 bg-gradient-to-r from-green-700 to-emerald-800 text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-emerald-300 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-sm font-black uppercase tracking-wider">Centre d'Aide</h4>
                  <span className="text-[9px] text-white/70 tracking-widest font-mono uppercase block leading-none">Support Interactif Google Nest</span>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Support Systems Mini Toolbar */}
            <div className="grid grid-cols-3 bg-slate-100 p-1 border-b border-slate-200 shrink-0">
              {[
                { id: 'articles', label: 'Docs Articles', icon: BookOpen },
                { id: 'whatsapp', label: 'WhatsApp Bot', icon: MessageSquare },
                { id: 'ticket', label: 'Saisir Ticket', icon: Send }
              ].map(tb => (
                <button
                  key={tb.id}
                  onClick={() => setActiveTab(tb.id as any)}
                  className={cn(
                    "py-2 flex flex-col items-center gap-0.5 rounded-lg text-[9.5px] font-black uppercase tracking-wider transition-all cursor-pointer outline-none",
                    activeTab === tb.id 
                      ? "bg-white text-emerald-800 shadow-xs border" 
                      : "text-slate-500 hover:text-slate-900"
                  )}
                >
                  <tb.icon className="w-3.5 h-3.5" />
                  <span>{tb.label}</span>
                </button>
              ))}
            </div>

            {/* Help Scrollable Contents */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar text-slate-800">
              
              {/* Contextual Active Module Info banner */}
              <div className="p-3 bg-indigo-50 border border-indigo-150 rounded-2xl space-y-1">
                <div className="flex items-center gap-1.5 text-indigo-800 font-black text-[10px] uppercase font-mono tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                  Guide de Module Actif
                </div>
                <p className="text-[10.5px] text-indigo-950/80 leading-relaxed font-semibold">
                  Vous êtes actuellement dans le Module : <span className="font-extrabold uppercase font-mono bg-indigo-100 px-1 rounded">{activeModule}</span>.
                </p>
                {activeModuleArticles.length > 0 ? (
                  <div className="pt-1.5 space-y-1.5">
                    <p className="text-[9px] text-indigo-400 font-extrabold uppercase tracking-widest">Articles suggérés pour ce module :</p>
                    {activeModuleArticles.map(art => (
                      <button
                        key={art.id}
                        onClick={() => {
                          setSearchQuery(art.title);
                          setActiveTab('articles');
                        }}
                        className="w-full text-left p-1.5 bg-white border border-indigo-150 rounded-lg hover:border-indigo-400 flex items-center justify-between text-[10px] font-bold text-slate-700 cursor-pointer"
                      >
                        <span className="truncate">{art.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-indigo-300" />
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-[9px] text-slate-450 italic mt-0.5">Aucun article particulier pour ce module. Utilisez la recherche globale ci-dessous.</p>
                )}
              </div>

              {/* TAB 1: ARTICLES AND RECHERCHE */}
              {activeTab === 'articles' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  
                  {/* Intelligent Search Input */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Recherche instantanée d'Articles :</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ex: refuser, suspendre, barème..."
                        className="w-full h-10 pl-9 pr-3 bg-slate-50 hover:bg-slate-100/50 border border-slate-205 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white"
                      />
                      {searchQuery && (
                        <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-450 hover:text-slate-900">Effacer</button>
                      )}
                    </div>
                  </div>

                  {/* Guided Tour Launcher (Visite Guidée) */}
                  <button
                    onClick={() => {
                      onClose();
                      onStartTour();
                    }}
                    className="w-full py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-150 rounded-2xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500 animate-spin-slow" />
                    🚀 Décharger la Visite Guidée (Tutoriel)
                  </button>

                  {/* List of articles */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider font-mono">
                      {searchQuery ? `Résultats (${filteredArticles.length})` : "Articles Populaires du Réseau (Base de Connaissances) :"}
                    </span>

                    {filteredArticles.length > 0 ? (
                      <div className="space-y-3">
                        {filteredArticles.map(art => (
                          <div key={art.id} className="bg-slate-50 border rounded-2xl p-3.5 space-y-2 hover:bg-slate-100/50 transition-colors">
                            <span className="px-1.5 py-0.5 bg-slate-200 text-slate-700 text-[8px] font-mono font-black uppercase rounded">
                              {art.category}
                            </span>
                            <h5 className="text-xs font-black text-slate-800 leading-snug">{art.title}</h5>
                            <p className="text-[10.5px] text-slate-500 leading-relaxed font-semibold">{art.content}</p>
                            
                            {art.video && (
                              <div className="pt-1.5">
                                <span className="text-[8.5px] font-black text-slate-400 uppercase tracking-widest block mb-1">Micro tutoriel vidéo :</span>
                                <MiniVideoPlayer />
                              </div>
                            )}

                            {art.targetModule && (
                              <button 
                                onClick={() => {
                                  onModuleChange(art.targetModule!);
                                  onClose();
                                  logAction('AIDE_REDIRECTION_MODULE', `L'utilisateur a suivi le tutoriel vers le module : ${art.targetModule}`, 'SUCCESS');
                                }}
                                className="mt-1 flex items-center gap-1.5 text-[9.5px] font-black text-emerald-600 hover:text-emerald-700"
                              >
                                <span>Ouvrir le module correspondant</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-50 text-slate-450 border border-dashed rounded-xl text-center text-xs">
                        Aucun article correspondant. Essayez un autre mot-clé (ex: "plafond" ou "sinistre").
                      </div>
                    )}
                  </div>

                </div>
              )}

              {/* TAB 2: WHATSAPP SIMULATED BOT */}
              {activeTab === 'whatsapp' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3 bg-emerald-50/70 border border-emerald-100 rounded-2xl flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <div>
                      <span className="text-[9.5px] font-black text-emerald-700 uppercase tracking-wider block font-mono">Option WhatsApp Express</span>
                      <span className="text-[10px] text-slate-500 leading-none">Messagerie sécurisée 24h/24 RDC</span>
                    </div>
                  </div>

                  {/* Chat mockup bubble container */}
                  <div className="h-64 bg-slate-950 rounded-2xl border border-slate-800 p-3 overflow-y-auto flex flex-col gap-2 custom-scrollbar">
                    {whatsappMessages.map(msg => (
                      <div 
                        key={msg.id} 
                        className={cn(
                          "max-w-[85%] rounded-xl p-2.5 text-[10.5px] leading-snug space-y-1 font-semibold",
                          msg.sender === 'user' 
                            ? "bg-emerald-600 text-white ml-auto" 
                            : "bg-slate-900 border border-slate-800 text-slate-350"
                        )}
                      >
                        <p>{msg.text}</p>
                        <span className="text-[8px] opacity-60 block text-right font-mono">{msg.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick WhatsApp Command selector */}
                  <div className="space-y-1.5">
                    <span className="text-[9px] font-black uppercase text-slate-400 block tracking-wider font-mono">Sélectionner une question tactile rapide :</span>
                    <div className="grid grid-cols-1 gap-1.5">
                      <button 
                        onClick={() => handleSendWhatsappOption(1, "Vérifier le solde de cotisation et les plafonds")}
                        className="text-left p-2.5 bg-slate-50 border hover:bg-slate-100 text-[10.5px] font-black rounded-lg text-slate-700 cursor-pointer flex items-center justify-between"
                      >
                        <span>1. Solde &amp; Plafonds de cotisation</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button 
                        onClick={() => handleSendWhatsappOption(2, "Quels sont les canaux autorisés pour la facturation ?")}
                        className="text-left p-2.5 bg-slate-50 border hover:bg-slate-100 text-[10.5px] font-black rounded-lg text-slate-700 cursor-pointer flex items-center justify-between"
                      >
                        <span>2. Facturation &amp; Tiers Payant</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button 
                        onClick={() => handleSendWhatsappOption(3, "Parler d'urgence au médecin conseil de garde")}
                        className="text-left p-2.5 bg-slate-50 border hover:bg-slate-100 text-[10.5px] font-black rounded-lg text-slate-700 cursor-pointer flex items-center justify-between"
                      >
                        <span>3. Joindre le médecin-conseil</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACTER LE SUPPORT */}
              {activeTab === 'ticket' && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div className="p-3.5 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-1">
                    <h5 className="text-[10px] font-black uppercase text-indigo-700 tracking-wider font-mono flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 text-indigo-500" />
                      Garantie de réponse 2h
                    </h5>
                    <p className="text-[10.5px] text-slate-500 font-semibold leading-relaxed">
                      Saisissez un ticket d'anomalie d'incident. L'identifiant réseau, le rôle métier courant, et les derniers logs seront chiffrés et transmis au support.
                    </p>
                  </div>

                  {ticketSuccess ? (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
                      <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                        <Check className="w-4 h-4" />
                      </div>
                      <p className="text-xs font-semibold text-slate-800 leading-normal">{ticketSuccess}</p>
                      <button
                        onClick={() => setTicketSuccess(null)}
                        className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase hover:bg-slate-800 cursor-pointer"
                      >
                        Créer un nouveau ticket
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitTicket} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Catégorie du Problème :</label>
                        <select 
                          value={ticketCategory}
                          onChange={(e) => setTicketCategory(e.target.value)}
                          className="w-full h-10 bg-slate-50 border border-slate-205 rounded-xl px-3 text-xs font-semibold focus:outline-none"
                        >
                          <option>Bug Technique / Formulaire Bloqué</option>
                          <option>Contrat / Signature Électronique</option>
                          <option>Assurance / Erreur Barème ARCA</option>
                          <option>Accès utilisateur / MFA</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Sévérité du Ticket :</label>
                        <select 
                          value={ticketSeverity}
                          onChange={(e) => setTicketSeverity(e.target.value)}
                          className="w-full h-10 bg-slate-50 border border-slate-205 rounded-xl px-3 text-xs font-semibold focus:outline-none"
                        >
                          <option>P1 - Critique Bloquant (Arrêt d'activité)</option>
                          <option>P2 - Élevé (Friction majeure)</option>
                          <option>P3 - Moyen (Question standard)</option>
                          <option>P4 - Faible (Suggestion esthétique)</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9.5px] font-black uppercase text-slate-400 tracking-wider">Description de l'incident :</label>
                        <textarea 
                          rows={3}
                          value={ticketDesc}
                          onChange={(e) => setTicketDesc(e.target.value)}
                          placeholder="Décrivez précisément l'action qui a déclenché l'anomalie..."
                          className="w-full bg-slate-50 border border-slate-205 rounded-xl p-3 text-xs font-semibold focus:outline-none focus:bg-white resize-none"
                          required
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input 
                          type="checkbox"
                          id="attachscreenshot"
                          checked={attachScreenshot}
                          onChange={(e) => setAttachScreenshot(e.target.checked)}
                          className="w-4 h-4 cursor-pointer accent-green-600"
                        />
                        <label htmlFor="attachscreenshot" className="text-[10.5px] text-slate-500 font-semibold cursor-pointer">
                          Joindre log d'audit environnemental automatique.
                        </label>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-indigo-650 hover:bg-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer shadow-md transform active:scale-95 transition-all text-center"
                      >
                        🚀 Envoyer au Support Sec
                      </button>
                    </form>
                  )}
                </div>
              )}

            </div>

            {/* Bottom Panel Component: System api status indicator */}
            <div className="p-4 bg-slate-50 border-t border-slate-150 shrink-0 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-400">
                <span>Santé du Système APIs</span>
                <span className={cn(
                  "px-1.5 py-0.5 rounded text-[8.5px]",
                  systemIncidentActive ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-800"
                )}>
                  {systemIncidentActive ? "En Panne Partielle" : "Toutes Opérationnelles"}
                </span>
              </div>

              {systemIncidentActive ? (
                <div className="p-2.5 bg-rose-50 border border-rose-150 rounded-xl space-y-1">
                  <div className="flex items-center gap-1 text-rose-700 font-extrabold text-[9.5px]">
                    <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                    Indisponibilité : Mobile Money RDC
                  </div>
                  <p className="text-[9px] text-slate-500 leading-normal">
                    Incident en cours sur les APIs passerelles Airtel &amp; M-Pesa. L'ARCA-RDC réachemine les sinistres sur la filiale de secours.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-1.5">
                  <div className="p-1.5 bg-slate-100/70 rounded-lg flex items-center gap-1 bg-white border">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[8.5px] text-slate-500 font-bold uppercase truncate">Core DB Firestore</span>
                  </div>
                  <div className="p-1.5 bg-slate-100/70 rounded-lg flex items-center gap-1 bg-white border">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[8.5px] text-slate-500 font-bold uppercase truncate">SSO Auth Server</span>
                  </div>
                  <div className="p-1.5 bg-slate-100/70 rounded-lg flex items-center gap-1 bg-white border">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[8.5px] text-slate-500 font-bold uppercase truncate">ARCA Réf-Barème</span>
                  </div>
                  <div className="p-1.5 bg-slate-100/70 rounded-lg flex items-center gap-1 bg-white border">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-[8.5px] text-slate-500 font-bold uppercase truncate">Orange/Airtel Pay</span>
                  </div>
                </div>
              )}

              <button 
                onClick={() => setSystemIncidentActive(!systemIncidentActive)}
                className="w-full py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-[8.5px] font-black uppercase tracking-wider cursor-pointer text-center outline-none"
              >
                Toggle Mode Incident Réseau
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
