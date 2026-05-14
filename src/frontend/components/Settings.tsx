/**
 * 📄 Fichier : /src/frontend/components/Settings.tsx
 */
import React from 'react';

interface SettingsProps {
  onModuleChange: (id: string) => void;
}

export const Settings: React.FC<SettingsProps> = ({ onModuleChange }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-orange-50/20 rounded-fluent border border-dashed border-orange-200">
      <h3 className="text-xl font-bold text-orange-950 mb-2">Paramètres Système</h3>
      <p className="text-orange-950/50 max-w-sm">Ce module est actuellement vide.</p>
      <div className="mt-8 grid grid-cols-2 gap-4">
         {['governance', 'security', 'audit', 'alerts', 'bi', 'admin', 'users-mgmt', 'privileges'].map(id => (
           <button 
            key={id} 
            onClick={() => onModuleChange(id)}
            className="px-4 py-2 bg-white border border-orange-100 rounded-lg text-xs font-bold text-orange-600 hover:bg-orange-50"
           >
             {id}
           </button>
         ))}
      </div>
    </div>
  );
};
