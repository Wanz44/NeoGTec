/**
 * 📄 Fichier : /src/frontend/components/Settings.tsx
 */
import React from 'react';

interface SettingsProps {
  onModuleChange: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onModuleChange }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-green-50/20 rounded-fluent border border-dashed border-green-200">
      <h3 className="text-xl font-bold text-green-950 mb-2">Paramètres Système</h3>
      <p className="text-green-950/50 max-w-sm">Ce module est actuellement vide.</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
         {['governance', 'bi', 'admin', 'users-list', 'system-config', 'alerts'].map(id => (
           <button 
            key={id} 
            onClick={() => onModuleChange(id)}
            className="px-4 py-2 bg-white border border-green-100 rounded-lg text-xs font-bold text-green-600 hover:bg-green-50"
           >
             {id}
           </button>
         ))}
      </div>
    </div>
  );
};
