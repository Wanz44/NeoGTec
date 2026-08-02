import React, { useState } from 'react';
import { Building2, Stethoscope, Users, ShieldCheck, LogOut, LayoutGrid } from 'lucide-react';
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

  const spaces = [
    { id: 'entreprise', label: 'Espace Entreprise', description: 'Gestion RH, cotisations, dérogations, flotte d\'employés', icon: Building2 },
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#1B4A34]/50 border border-[#2F8A5B]/30 rounded-lg text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-stone-300 font-medium">Espace Actif :</span>
            <span className="font-bold text-[#EFDFB8]">{currentSpace.label}</span>
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

      {/* Main Container with Left Sidebar & Active Space View */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <aside className="w-72 bg-[#0A1F13] border-r border-[#1B4A34] flex flex-col justify-between shrink-0 p-4">
          <div className="space-y-4">
            <div className="px-2 py-1">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#C6992E] flex items-center gap-1.5">
                <LayoutGrid className="w-3.5 h-3.5" />
                Portails NeoGTec
              </p>
              <p className="text-[11px] text-stone-400 mt-0.5">Sélecteur d'interface utilisateur</p>
            </div>

            <nav className="space-y-1.5">
              {spaces.map(s => {
                const Icon = s.icon;
                const isActive = s.id === activeSpace;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActiveSpace(s.id)}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all cursor-pointer relative ${
                      isActive
                        ? 'bg-[#1B4A34] text-[#EFDFB8] font-bold shadow-md border-l-4 border-[#C6992E]'
                        : 'text-stone-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`p-2 rounded-lg mt-0.5 ${isActive ? 'bg-[#C6992E]/20 text-[#C6992E]' : 'bg-white/5 text-stone-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold leading-tight">{s.label}</p>
                      <p className="text-[10px] text-stone-400 mt-1 leading-snug line-clamp-2">{s.description}</p>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-3 bg-[#1B4A34]/30 border border-[#2F8A5B]/20 rounded-xl text-center">
            <p className="text-[10px] text-stone-400 font-medium">Plateforme NeoGTec Multi-Espaces</p>
            <p className="text-[9px] text-emerald-400/70 mt-0.5">Synchronisation inter-apps active</p>
          </div>
        </aside>

        {/* Content Display Area */}
        <main className="flex-1 overflow-auto bg-stone-100 relative">
          {activeSpace === 'entreprise' && <NeoGTecHealthCare_Entreprise />}
          {activeSpace === 'prestataire' && <NeoGTecHealthCare_Prestataire />}
          {activeSpace === 'assure' && <NeoGTecHealthCareApp1 />}
          {activeSpace === 'assureur' && <NeoGTecHealthCare_Assureur />}
        </main>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
