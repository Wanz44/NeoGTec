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
  const [activeSpace, setActiveSpace] = useState<'entreprise' | 'prestataire' | 'assure' | 'assureur'>('entreprise');
  const [showPortalModal, setShowPortalModal] = useState(false);

  const spaces = [
    { id: 'entreprise', label: 'Espace Entreprise', description: "Gestion RH, cotisations, dérogations, flotte d'employés", icon: Building2 },
    { id: 'prestataire', label: 'Espace Prestataire', description: 'Hôpitaux/Cliniques, vérification de droits, prise en charge', icon: Stethoscope },
    { id: 'assure', label: 'Espace Assuré', description: 'Carte numérique, consommations, ayants droit, télémédecine', icon: Users },
    { id: 'assureur', label: 'Espace Back-Office Assureur', description: 'Validation, comptabilité globale, gestion des polices', icon: ShieldCheck },
  ] as const;

  const currentSpace = spaces.find(s => s.id === activeSpace)!;

  return (
    <div className="flex flex-col h-screen w-full bg-[#0D2818] overflow-hidden text-stone-100 font-sans">
      {/* Super Admin Top Header */}
      <header className="h-14 bg-[#0A1F13] border-b border-[#1B4A34] px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center font-bold text-[#C6992E] text-xs">
            NG
          </div>
          <div>
            <span className="font-serif text-sm font-bold tracking-wider text-white">NEOGTEC HEALTHCARE</span>
            <p className="text-[10px] text-emerald-400/80 font-medium">Plateforme Globale d'Assurance Santé</p>
          </div>
        </div>

        {/* Center / Right: Espace Utilisateur Selector & Logout */}
        <div className="flex items-center gap-3">
          {/* Espace Utilisateur Button */}
          <div className="relative">
            <button
              onClick={() => setShowPortalModal(prev => !prev)}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-[#1B4A34]/80 hover:bg-[#1B4A34] border border-[#2F8A5B]/50 rounded-xl text-xs font-bold text-[#EFDFB8] shadow-sm transition-all cursor-pointer"
            >
              <UserCheck className="w-4 h-4 text-[#C6992E]" />
              <span>Espace Utilisateur : <span className="text-white font-extrabold">{currentSpace.label}</span></span>
              <ChevronDown className="w-3.5 h-3.5 text-[#C6992E] ml-1" />
            </button>

            {/* Dropdown Menu / Selection de portails */}
            {showPortalModal && (
              <>
                <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-xs" onClick={() => setShowPortalModal(false)} />
                <div className="absolute right-0 top-11 w-80 bg-[#0A1F13] border border-[#2F8A5B]/50 text-white rounded-2xl p-3 shadow-2xl z-50 space-y-2 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2 py-1.5 border-b border-white/10 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-[#C6992E] uppercase tracking-wider">Sélection de Portails</p>
                      <p className="text-[10px] text-stone-400">Changer l'espace utilisateur actif</p>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {spaces.map(s => {
                      const Icon = s.icon;
                      const isActive = s.id === activeSpace;
                      return (
                        <button
                          key={s.id}
                          onClick={() => {
                            setActiveSpace(s.id);
                            setShowPortalModal(false);
                          }}
                          className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'bg-[#1B4A34] text-[#EFDFB8] font-bold border-l-4 border-[#C6992E] shadow-sm'
                              : 'text-stone-300 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <div className={`p-1.5 rounded-lg mt-0.5 ${isActive ? 'bg-[#C6992E]/20 text-[#C6992E]' : 'bg-white/10 text-stone-400'}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold leading-tight">{s.label}</p>
                            <p className="text-[10px] text-stone-400 mt-0.5 leading-snug">{s.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </>
            )}
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer border border-rose-800/30"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Déconnexion</span>
            </button>
          )}
        </div>
      </header>

      {/* Content Display Area */}
      <main className="flex-1 overflow-auto bg-stone-100 relative">
        {activeSpace === 'entreprise' && <NeoGTecHealthCare_Entreprise />}
        {activeSpace === 'prestataire' && <NeoGTecHealthCare_Prestataire />}
        {activeSpace === 'assure' && <NeoGTecHealthCareApp1 />}
        {activeSpace === 'assureur' && <NeoGTecHealthCare_Assureur />}
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
