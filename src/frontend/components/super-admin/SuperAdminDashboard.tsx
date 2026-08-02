import React, { useState } from 'react';
import { Building2, Stethoscope, Users, ShieldCheck, LogOut, ChevronDown } from 'lucide-react';
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
  const [showSpaceMenu, setShowSpaceMenu] = useState(false);

  const spaces = [
    { id: 'entreprise', label: 'Espace Entreprise', description: 'Gestion RH, cotisations, dérogations, flotte employés', icon: Building2 },
    { id: 'prestataire', label: 'Espace Prestataire', description: 'Hôpitaux/Cliniques, vérification de droits, prise en charge', icon: Stethoscope },
    { id: 'assure', label: 'Espace Assuré', description: 'Carte numérique, consommations, ayants droit, télémédecine', icon: Users },
    { id: 'assureur', label: 'Espace Back-Office Assureur', description: 'Validation, comptabilité globale, gestion des polices', icon: ShieldCheck },
  ] as const;

  const currentSpace = spaces.find(s => s.id === activeSpace)!;

  return (
    <div className="flex flex-col h-screen w-full bg-[#0D2818] overflow-hidden text-stone-100 font-sans">
      {/* Super Admin Top Banner & Navigator */}
      <header className="h-14 bg-[#0A1F13] border-b border-[#1B4A34] px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C6992E]/20 border border-[#C6992E] flex items-center justify-center font-bold text-[#C6992E] text-xs">
              NG
            </div>
            <span className="font-serif text-sm font-bold tracking-wider text-white">NEOGTEC HEALTHCARE</span>
          </div>

          <div className="h-5 w-[1px] bg-[#1B4A34]" />

          {/* Quick Space Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowSpaceMenu(prev => !prev)}
              className="flex items-center gap-2.5 px-3 py-1.5 bg-[#1B4A34]/60 hover:bg-[#1B4A34] border border-[#2F8A5B]/40 rounded-xl text-xs font-bold text-[#EFDFB8] transition-all cursor-pointer"
            >
              <currentSpace.icon className="w-4 h-4 text-[#C6992E]" />
              <span>{currentSpace.label}</span>
              <ChevronDown className="w-3.5 h-3.5 opacity-80" />
            </button>

            {showSpaceMenu && (
              <div className="absolute top-11 left-0 w-80 bg-[#0A1F13] border border-[#2F8A5B]/40 text-white rounded-2xl p-2 shadow-2xl z-[100] space-y-1">
                <div className="px-3 py-2 border-b border-white/10">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#C6992E]">Sélectionner un Espace</p>
                </div>
                {spaces.map(s => {
                  const Icon = s.icon;
                  const isActive = s.id === activeSpace;
                  return (
                    <button
                      key={s.id}
                      onClick={() => {
                        setActiveSpace(s.id);
                        setShowSpaceMenu(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs transition-all cursor-pointer ${
                        isActive ? 'bg-[#1B4A34] text-[#EFDFB8] font-bold' : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#C6992E] shrink-0" />
                      <div>
                        <p className="font-bold">{s.label}</p>
                        <p className="text-[10px] text-stone-400">{s.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Space Navigation Tabs */}
        <div className="hidden md:flex items-center gap-1 bg-[#061A10] p-1 rounded-xl border border-[#1B4A34]">
          {spaces.map(s => {
            const Icon = s.icon;
            const isActive = s.id === activeSpace;
            return (
              <button
                key={s.id}
                onClick={() => setActiveSpace(s.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#1B4A34] text-[#EFDFB8] font-bold shadow-sm'
                    : 'text-stone-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#C6992E]' : 'text-stone-400'}`} />
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Logout Button */}
        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        )}
      </header>

      {/* Main Space Content Container */}
      <main className="flex-1 overflow-hidden relative">
        {activeSpace === 'entreprise' && <NeoGTecHealthCare_Entreprise />}
        {activeSpace === 'prestataire' && <NeoGTecHealthCare_Prestataire />}
        {activeSpace === 'assure' && <NeoGTecHealthCareApp1 />}
        {activeSpace === 'assureur' && <NeoGTecHealthCare_Assureur />}
      </main>
    </div>
  );
}

export default SuperAdminDashboard;
