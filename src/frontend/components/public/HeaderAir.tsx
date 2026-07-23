import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EspaceUtilisateurHub } from './EspaceUtilisateurHub';

interface HeaderAirProps {
  onNavigateTo: (route: string) => void;
  onNavigateToLogin: (portal?: string) => void;
  currentRoute: string;
}

export function HeaderAir({ onNavigateTo, onNavigateToLogin, currentRoute }: HeaderAirProps) {
  const [scrollY, setScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showHub, setShowHub] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    if (typeof window !== 'undefined' && window.location.search.includes('hub=open')) {
      setShowHub(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigateTo = (route: string) => {
    setIsMobileMenuOpen(false);
    onNavigateTo(route);
  };

  return (
    <>
      {/* Header Container following PDF Design */}
      <header 
        className={`fixed left-0 w-full z-50 transition-all duration-300 px-4 md:px-10 ${
          scrollY > 50 ? 'top-4' : 'top-10'
        }`}
      >
        <nav className="max-w-[1440px] mx-auto h-20 flex items-center justify-between bg-[#f8f9ff]/85 backdrop-blur-md rounded-full border border-[#bccac0]/30 shadow-sm px-8">
          
          {/* Brand Logo - Agrandi deux fois (Enlarged twice) */}
          <div className="flex items-center gap-2 pt-1">
            <button 
              onClick={() => navigateTo('/')}
              className="flex items-center gap-3 cursor-pointer outline-none font-sans text-[30px] md:text-[36px] font-extrabold tracking-tight text-[#0b1c30] hover:opacity-90"
            >
              <svg className="w-10 h-10 text-[#006c4a]" viewBox="0 0 100 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M30 45C38.2843 45 45 38.2843 45 30C45 21.7157 38.2843 15 30 15C21.7157 15 15 21.7157 15 30C15 38.2843 21.7157 45 30 45Z" stroke="currentColor" strokeWidth="9" fill="none" />
                <path d="M70 45C78.2843 45 85 38.2843 85 30C85 21.7157 78.2843 15 70 15C61.7157 15 55 21.7157 55 30C55 38.2843 61.7157 45 70 45Z" stroke="currentColor" strokeWidth="9" fill="none" />
                <circle cx="50" cy="30" r="4.5" fill="currentColor" />
              </svg>
              <span>NeoGTec</span>
            </button>
          </div>

          {/* Navigation Links (PDF Menu Design) */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Risques', route: '/risques' },
              { label: 'Solutions', route: '/solutions' },
              { label: 'Catalogue', route: '/modules' },
              { label: 'Tarifs', route: '/tarifs' },
              { label: 'FAQ', route: '/faq' },
            ].map((link) => {
              const isActive = currentRoute === link.route;
              return (
                <button
                  key={link.label}
                  onClick={() => navigateTo(link.route)}
                  className={`font-sans text-[14px] font-medium transition-all duration-200 cursor-pointer ${
                    isActive 
                      ? 'text-[#006c4a] border-b-2 border-[#006c4a] pb-1' 
                      : 'text-[#3d4a42] hover:text-[#006c4a]'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </div>

          {/* Actions - PDF Style (Security Icon + Espace Utilisateur Button) */}
          <div className="flex items-center gap-6">
            <span className="hidden sm:flex text-[#006c4a] hover:bg-[#006c4a]/10 transition-all cursor-pointer rounded-full w-10 h-10 items-center justify-center border border-[#006c4a]/20">
              <ShieldCheck className="w-5 h-5" />
            </span>
            
            <button 
              data-testid="btn-espace-utilisateur"
              onClick={() => setShowHub(true)}
              className="bg-[#006c4a] text-white font-sans text-[14px] font-semibold px-8 py-3.5 rounded-full hover:shadow-lg hover:shadow-[#006c4a]/20 hover:-translate-y-0.5 active:scale-95 transition-all cursor-pointer"
            >
              Espace Utilisateur
            </button>

            {/* Hamburger mobile toggle icon */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden h-10 w-10 border border-slate-200 rounded-full flex items-center justify-center text-[#3d4a42] active:bg-slate-50 cursor-pointer outline-none"
              aria-label="Afficher le menu mobile"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

        </nav>
      </header>

      {/* Mobile Drawer */}
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
              exit={{ x: 0, opacity: 1 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-80 max-w-full h-full bg-[#f8f9ff] flex flex-col justify-between p-6 shadow-2xl z-10 border-l border-slate-200"
            >
              <div className="flex items-center justify-between border-b pb-4">
                <span className="font-sans text-xs font-bold text-[#0b1c30] uppercase tracking-widest">NeoGTec Navigation</span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-[#3d4a42] cursor-pointer outline-none"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Mobile Links */}
              <div className="flex-1 py-8 space-y-6 text-left overflow-y-auto">
                <div className="space-y-1">
                  {[
                    { label: 'Accueil', route: '/' },
                    { label: 'Risques', route: '/risques' },
                    { label: 'Solutions', route: '/solutions' },
                    { label: 'Catalogue', route: '/modules' },
                    { label: 'Tarifs', route: '/tarifs' },
                    { label: 'FAQ', route: '/faq' },
                  ].map((link) => (
                    <button
                      key={link.label}
                      onClick={() => navigateTo(link.route)}
                      className={`w-full text-left py-3 px-4 rounded-xl font-sans text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${
                        currentRoute === link.route 
                          ? 'bg-[#006c4a]/10 text-[#006c4a]' 
                          : 'hover:bg-slate-50 text-[#3d4a42]'
                      }`}
                    >
                      <span>{link.label}</span>
                      <ArrowRight className="w-4 h-4 opacity-40" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Action */}
              <div className="border-t pt-6">
                <button
                  data-testid="btn-espace-utilisateur"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    setShowHub(true);
                  }}
                  className="w-full py-4 bg-[#006c4a] text-white rounded-xl font-sans text-sm font-semibold shadow-md cursor-pointer"
                >
                  Espace Utilisateur
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4-Portal Hub Modal */}
      <EspaceUtilisateurHub 
        isOpen={showHub}
        onClose={() => setShowHub(false)}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateTo={onNavigateTo}
      />
    </>
  );
}
