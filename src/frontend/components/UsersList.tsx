/**
 * 📄 Fichier : /src/frontend/components/UsersList.tsx
 * 🎯 Objectif : Tableau de bord d'orchestration pour le module Utilisateurs (Création Admin & Consultation).
 */
import React, { useState } from 'react';
import { UserPlus, Search, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { AdminCreateForm } from './users/AdminCreateForm';
import { UsersConsultation } from './users/UsersConsultation';

export const UsersList: React.FC = () => {
  // Navigation tabs for sub-modules
  const [activeSubTab, setActiveSubTab] = useState<'create-admin' | 'consultation'>('create-admin');

  // Unified notice toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const triggerToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notice Container */}
      {toast && (
        <div className="fixed top-24 right-8 z-[999] flex items-center gap-3 bg-slate-900 border text-white rounded-2xl p-4 shadow-2xl animate-bounce max-w-sm">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <span className="text-xs font-bold leading-relaxed">{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-slate-400 hover:text-white transition p-0.5">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Embedded Sub-navigation Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl w-fit border shadow-2xs">
        <button
          onClick={() => setActiveSubTab('create-admin')}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none",
            activeSubTab === 'create-admin'
              ? "bg-white text-slate-900 shadow"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <UserPlus className="w-4 h-4 shrink-0" /> Créer des Utilisateurs Admin
        </button>
        <button
          onClick={() => setActiveSubTab('consultation')}
          className={cn(
            "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer outline-none",
            activeSubTab === 'consultation'
              ? "bg-white text-slate-900 shadow"
              : "text-slate-500 hover:text-slate-900"
          )}
        >
          <Search className="w-4 h-4 shrink-0" /> Consultation
        </button>
      </div>

      {/* Conditionally render modularized sub-sections */}
      <div className="mt-4">
        {activeSubTab === 'create-admin' ? (
          <AdminCreateForm triggerToast={triggerToast} />
        ) : (
          <UsersConsultation triggerToast={triggerToast} />
        )}
      </div>

    </div>
  );
};
export default UsersList;
