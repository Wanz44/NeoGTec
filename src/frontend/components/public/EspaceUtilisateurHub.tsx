import React, { useState, useEffect } from 'react';
import { Building2, UserCheck, Stethoscope, ShieldCheck, X, ChevronRight, HelpCircle, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface EspaceUtilisateurHubProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToLogin?: (portal?: string) => void;
  onNavigateTo?: (route: string) => void;
}

const PORTALS = [
  {
    id: 'entreprise',
    title: 'Espace Entreprise',
    subtitle: 'RH & Contrats Collectifs',
    description: 'Gérez vos employés, plafonds, factures',
    badge: 'Contrat collectif',
    badgeBg: '#E7F3EC',
    badgeColor: '#2F8A5B',
    icon: Building2,
    iconBg: '#0D2818',
  },
  {
    id: 'assure',
    title: 'Espace Assuré',
    subtitle: 'Ma carte & mes soins',
    description: 'QR Code, plafonds, remboursements',
    badge: 'QR Code dynamique',
    badgeBg: '#EFDFB8',
    badgeColor: '#8B6914',
    icon: UserCheck,
    iconBg: '#C6992E',
  },
  {
    id: 'prestataire',
    title: 'Espace Prestataire',
    subtitle: 'Scanner & PEC',
    description: 'Vérifiez droits, émettez PEC, facturation',
    badge: 'Réseau conventionné',
    badgeBg: '#E7F3EC',
    badgeColor: '#2F8A5B',
    icon: Stethoscope,
    iconBg: '#1B4A34',
  },
  {
    id: 'assureur',
    title: 'Back-Office Assureur',
    subtitle: 'Pilotage & Anti-Fraude',
    description: 'KPI sinistralité, dérogations, clearing',
    badge: 'Accès sécurisé',
    badgeBg: '#F1F5F9',
    badgeColor: '#0F172A',
    icon: ShieldCheck,
    iconBg: '#0F172A',
  },
];

export function EspaceUtilisateurHub({
  isOpen,
  onClose,
  onNavigateToLogin,
  onNavigateTo,
}: EspaceUtilisateurHubProps) {
  const [lang, setLang] = useState<'FR' | 'EN'>('FR');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastPortal, setLastPortal] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleKeyDown);

      // Check auth & last portal
      const savedPortal = localStorage.getItem('neogtec_last_portal');
      setLastPortal(savedPortal);

      const userStored = localStorage.getItem('assur_current_user') || localStorage.getItem('neogtec_user');
      setIsAuthenticated(!!userStored);

      return () => {
        document.body.style.overflow = 'auto';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSelectPortal = (portalId: string) => {
    localStorage.setItem('neogtec_last_portal', portalId);
    try {
      window.history.pushState({}, '', `/login?portal=${portalId}`);
    } catch (e) {}

    if (onNavigateToLogin) {
      onNavigateToLogin(portalId);
    } else if (onNavigateTo) {
      onNavigateTo(`/login?portal=${portalId}`);
    } else {
      window.location.href = `/login?portal=${portalId}`;
    }
    onClose();
  };

  const handleAssistanceClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onClose();
    if (onNavigateTo) {
      onNavigateTo('/faq');
    } else {
      window.location.hash = '/faq';
    }
  };

  const getLastPortalTitle = () => {
    if (!lastPortal) return '';
    const found = PORTALS.find((p) => p.id === lastPortal);
    return found ? found.title : lastPortal;
  };

  return (
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-[8px] flex items-center justify-center p-4 max-md:p-0 max-md:items-end overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          data-testid="hub-portails-modal"
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-[720px] bg-white rounded-2xl shadow-2xl overflow-hidden max-md:max-h-[90vh] max-md:rounded-t-2xl max-md:rounded-b-none max-md:w-full flex flex-col my-auto max-md:my-0"
        >
          {/* Header Modal */}
          <div className="p-6 pb-2 flex items-start justify-between border-b border-[#E7E2D6]/60">
            <div>
              <h2 className="font-serif text-[22px] font-bold text-[#0D2818] tracking-tight leading-tight">
                Accédez à votre espace
              </h2>
              <p className="font-sans text-[13px] text-[#6B6F76] mt-1">
                Sélectionnez votre profil pour vous connecter
              </p>
            </div>
            <button
              data-testid="btn-close-hub"
              onClick={onClose}
              className="p-2 rounded-full text-[#6B6F76] hover:bg-slate-100 transition-colors cursor-pointer outline-none"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Connected User Quick Return */}
          {isAuthenticated && (
            <div className="px-6 pt-3 pb-1 bg-[#E7F3EC]/50 border-b border-[#E7E2D6]/50 flex items-center justify-between gap-3">
              <span className="font-sans text-[12px] text-[#2F8A5B] font-medium">
                Session active détectée
              </span>
              <button
                data-testid="btn-retour-espace"
                onClick={() => handleSelectPortal(lastPortal || 'assure')}
                className="px-3 py-1.5 bg-[#0D2818] text-white rounded-lg font-sans text-[12px] font-semibold flex items-center gap-1.5 hover:bg-[#1B4A34] transition-colors cursor-pointer"
              >
                <span>Retour à mon espace {getLastPortalTitle()}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Grid 2x2 Portails */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 overflow-y-auto max-h-[calc(90vh-160px)] md:max-h-none">
            {PORTALS.map((portal) => {
              const IconComp = portal.icon;
              return (
                <div
                  key={portal.id}
                  data-testid={`card-portal-${portal.id}`}
                  onClick={() => handleSelectPortal(portal.id)}
                  className="rounded-xl border border-[#E7E2D6] p-4 cursor-pointer transition-all duration-200 bg-white hover:border-[#0D2818] hover:shadow-md hover:-translate-y-0.5 group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2.5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 min-w-[40px] min-h-[40px] rounded-[12px] flex items-center justify-center text-white"
                          style={{ backgroundColor: portal.iconBg }}
                        >
                          <IconComp className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-sans font-bold text-[15px] text-[#0D2818] leading-tight group-hover:text-[#0D2818]">
                            {portal.title}
                          </h3>
                          <p className="font-sans text-[12px] font-medium text-[#6B6F76]">
                            {portal.subtitle}
                          </p>
                        </div>
                      </div>
                      <button
                        data-testid={`btn-acceder-${portal.id}`}
                        aria-label={`Accéder à ${portal.title}`}
                        className="text-[#6B6F76] group-hover:text-[#0D2818] transition-colors p-1"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="font-sans text-[12.5px] text-[#6B6F76] leading-snug mb-3">
                      {portal.description}
                    </p>
                  </div>
                  <div>
                    <span
                      className="inline-block px-2.5 py-1 rounded-md text-[11px] font-semibold"
                      style={{ backgroundColor: portal.badgeBg, color: portal.badgeColor }}
                    >
                      {portal.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Modal */}
          <div className="border-t border-[#E7E2D6] px-6 py-4 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] font-sans text-[#6B6F76]">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-[#6B6F76]" />
              <span>Besoin d'aide ?</span>
              <a
                data-testid="link-assistance"
                href="#/faq"
                onClick={handleAssistanceClick}
                className="text-[#0D2818] font-bold underline hover:text-[#1B4A34] transition-colors"
              >
                Contactez l'assistance
              </a>
            </div>

            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#6B6F76]" />
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as 'FR' | 'EN')}
                className="bg-transparent font-sans text-[12px] font-bold text-[#0D2818] focus:outline-none cursor-pointer border border-[#E7E2D6] rounded-md px-2 py-1"
              >
                <option value="FR">FR — Français</option>
                <option value="EN">EN — English</option>
              </select>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
