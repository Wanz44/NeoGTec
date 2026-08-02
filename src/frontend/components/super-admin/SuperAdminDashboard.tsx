import React, { useState } from 'react';
import { LogOut } from 'lucide-react';
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
  const [activeSpace] = useState<'entreprise' | 'prestataire' | 'assure' | 'assureur'>('entreprise');

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

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-900/30 rounded-xl transition-all cursor-pointer border border-rose-800/30"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Déconnexion</span>
          </button>
        )}
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
