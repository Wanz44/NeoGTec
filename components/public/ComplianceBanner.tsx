import React from 'react';
import { ShieldCheck } from 'lucide-react';

export function ComplianceBanner() {
  return (
    <div className="bg-[#064E3B] h-8 text-white text-xs flex items-center justify-center px-4 font-mono font-bold tracking-wide select-none z-[110] relative whitespace-nowrap overflow-x-auto overflow-y-hidden custom-scrollbar">
      <div className="flex items-center gap-2 max-w-7xl mx-auto">
        <ShieldCheck className="w-3.5 h-3.5 text-[#00A86B] shrink-0 animate-pulse" />
        <span>NeoGTec | Agréé ARCA-RDC n°ARCA/2025/0127 | Données hébergées Kinshasa | Loi n°18/035 | DPO: dpo@neogtec.cd</span>
      </div>
    </div>
  );
}
