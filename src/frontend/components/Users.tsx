/**
 * 📄 Fichier : /src/frontend/components/Users.tsx
 * 🎯 Objectif : Hub de gestion des accès (Utilisateurs, Rôles, Sécurité, Audit).
 */
import React, { useState, useEffect } from 'react';
import { UsersList } from './UsersList';
import { UsersSecurity } from './UsersSecurity';
import { UsersLogs } from './UsersLogs';
import { Privileges } from './Privileges';
import { 
  Users, Shield, Lock, History, 
  Settings, UserCheck, Key
} from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface UsersViewProps {
  subModule?: string;
}

export const UsersView: React.FC<UsersViewProps> = ({ subModule }) => {
  const [activeTab, setActiveTab] = useState<'list' | 'roles' | 'security' | 'logs'>('list');

  useEffect(() => {
    if (subModule === 'users-list') setActiveTab('list');
    else if (subModule === 'privileges') setActiveTab('roles');
    else if (subModule === 'users-security' || subModule === 'security') setActiveTab('security');
    else if (subModule === 'users-logs') setActiveTab('logs');
  }, [subModule]);

  const tabs = [
    { id: 'list', label: 'Utilisateurs', icon: Users },
    { id: 'roles', label: 'Rôles & Droits', icon: Shield },
    { id: 'security', label: 'Sécurité MFA', icon: Lock },
    { id: 'logs', label: 'Journal d\'Audit', icon: History },
  ] as const;

  const renderContent = () => {
    switch (activeTab) {
      case 'list': return <UsersList />;
      case 'roles': return <Privileges />;
      case 'security': return <UsersSecurity />;
      case 'logs': return <UsersLogs />;
      default: return <UsersList />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Module Navigation */}
      <div className="flex bg-white p-1.5 rounded-2xl border border-green-100 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
         {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap",
                activeTab === tab.id ? "bg-green-600 text-white shadow-lg shadow-green-600/20" : "text-slate-400 hover:text-green-600"
              )}
            >
               <tab.icon className="w-4 h-4" />
               {tab.label}
            </button>
         ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 10 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -10 }}
           transition={{ duration: 0.2 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
