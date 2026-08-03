import React, { useState } from 'react';
import { Building2, Stethoscope, Users, ShieldCheck, LogOut, ChevronDown, UserCheck } from 'lucide-react';
// @ts-ignore
import NeoGTecHealthCare_Entreprise from './NeoGTecHealthCare_Entreprise';
// @ts-ignore
import NeoGTecHealthCare_Prestataire from './NeoGTecHealthCare_Prestataire';
// @ts-ignore
import NeoGTecHealthCare_Assureur from './NeoGTecHealthCare_Assureur';
// @ts-ignore
import NeoGTecHealthCareApp1 from './NeoGTecHealthCareApp (1)';

interface SuperAdminDashboardProps {
  onLogout?: () => void;
}

export function SuperAdminDashboard({ onLogout }: SuperAdminDashboardProps) {
  const [activeSpace, setActiveSpace] = useState<'entreprise' | 'prestataire' | 'assure' | 'assureur' | null>(() => {
    try {
      const saved = localStorage.getItem('neogtec_active_space');
      if (saved && ['entreprise', 'prestataire', 'assure', 'assureur'].includes(saved)) {
        return saved as any;
      }
    } catch (e) {}
    return null;
  });

  React.useEffect(() => {
    try {
      if (activeSpace) {
        localStorage.setItem('neogtec_active_space', activeSpace);
      } else {
        localStorage.removeItem('neogtec_active_space');
      }
    } catch (e) {}
  }, [activeSpace]);

  const spaces = [
    { id: 'entreprise', label: 'Espace Entreprise', subtitle: 'Portail Gestion RH & Flotte', description: "Gestion RH, cotisations, dérogations, flotte d'employés et bordereaux.", icon: Building2, color: 'border-emerald-500/30 hover:border-emerald-500' },
    { id: 'prestataire', label: 'Espace Prestataire', subtitle: 'Portail Hôpitaux & Cliniques', description: 'Vérification de droits en temps réel, prise en charge (PEC) et actes médicaux.', icon: Stethoscope, color: 'border-amber-500/30 hover:border-amber-500' },
    { id: 'assure', label: 'Espace Assuré', subtitle: 'Portail Adhérents & Famille', description: 'Carte numérique, suivi consommations, ayants droit et télémédecine.', icon: Users, color: 'border-blue-500/30 hover:border-blue-500' },
    { id: 'assureur', label: 'Espace Back-Office Assureur', subtitle: 'Portail Assureur & Gestion', description: 'Validation des dossiers, comptabilité globale, polices et dérogations.', icon: ShieldCheck, color: 'border-purple-500/30 hover:border-purple-500' },
  ] as const;

  // PORTAL LANDING SCREEN WHEN NO SPACE IS SELECTED
  if (!activeSpace) {
    return (
      <div className="min-h-screen w-full bg-[#0D2818] flex flex-col justify-between p-6 md:p-12 text-stone-100 font-sans relative overflow-x-hidden">
        {/* Background Decorative Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C6992E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#1B4A34]/40 rounded-full blur-3xl pointer-events-none" />

        {/* Portal Header */}
        <div className="w-full max-w-6xl mx-auto flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center font-bold text-[#C6992E] text-sm shadow-lg">
              NG
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-wider text-white">NeoGTec insur</span>
              <p className="text-xs text-emerald-400 font-medium">Plateforme Globale d'Assurance Santé</p>
            </div>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer border border-rose-800/30"
            >
              <LogOut className="w-4 h-4" />
              <span>Déconnexion</span>
            </button>
          )}
        </div>

        {/* Central Selection Section */}
        <div className="w-full max-w-6xl mx-auto my-auto py-8 z-10">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-[#C6992E]/20 text-[#EFDFB8] border border-[#C6992E]/40 shadow-sm inline-block">
              Portail d'Accès Multi-Espaces
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight font-serif">
              Sélectionnez votre Espace
            </h1>
            <p className="text-sm md:text-base text-stone-300 font-normal leading-relaxed">
              Bienvenue sur l'écosystème réuni NeoGTec. Choisissez votre environnement pour accéder à vos services dédiés.
            </p>
          </div>

          {/* Grid of 4 Space Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {spaces.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSpace(s.id)}
                  className={`group relative bg-[#0A1F13]/90 hover:bg-[#143621] border ${s.color} rounded-3xl p-6 md:p-8 text-left transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-15 transition-opacity pointer-events-none text-white">
                    <Icon className="w-32 h-32" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-[#1B4A34] group-hover:bg-[#C6992E] text-[#C6992E] group-hover:text-[#0D2818] border border-[#C6992E]/30 flex items-center justify-center transition-colors shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>

                    <div>
                      <span className="text-[11px] font-bold text-[#C6992E] uppercase tracking-wider">{s.subtitle}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#EFDFB8] transition-colors mt-0.5">
                        {s.label}
                      </h3>
                      <p className="text-xs md:text-sm text-stone-300 mt-2 leading-relaxed">
                        {s.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-white transition-colors relative z-10">
                    <span>Ouvrir cet espace</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="w-full max-w-6xl mx-auto text-center text-xs text-stone-400 z-10 pt-4 border-t border-white/10">
          NeoGTec insur Platform &copy; 2026. Tous droits réservés. Sécurité biométrique & synchro temps réel intégrées.
        </div>
      </div>
    );
  }

  // ACTIVE SPACE VIEW - WITH FLOATING SWITCHER BUTTON (NO TOP BAR)
  const currentSpace = spaces.find(s => s.id === activeSpace)!;

  return (
    <div className="flex flex-col h-screen w-full bg-stone-100 overflow-hidden relative">
      {/* Floating Switch Space Button */}
      <div className="fixed top-3 right-4 z-50">
        <button
          onClick={() => setActiveSpace(null)}
          className="flex items-center gap-2 px-3.5 py-2 bg-[#0A1F13]/90 hover:bg-[#0D2818] text-[#EFDFB8] border border-[#C6992E]/60 rounded-2xl text-xs font-bold shadow-xl backdrop-blur-md transition-all cursor-pointer hover:scale-105"
          title="Changer d'espace ou revenir au portail"
        >
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentSpace.label}</span>
          <span className="text-[#C6992E] font-black border-l border-white/20 pl-2">Portail 🔄</span>
        </button>
      </div>

      {/* Content Display Area */}
      <main className="flex-1 h-full w-full overflow-auto bg-stone-100 relative">
        {activeSpace === 'entreprise' && <NeoGTecHealthCare_Entreprise />}
        {activeSpace === 'prestataire' && <NeoGTecHealthCare_Prestataire />}
        {activeSpace === 'assure' && <NeoGTecHealthCareApp1 />}
        {activeSpace === 'assureur' && <NeoGTecHealthCare_Assureur />}
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
