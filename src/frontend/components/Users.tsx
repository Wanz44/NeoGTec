/**
 * 📄 Fichier : /src/frontend/components/Users.tsx
 */
import React from 'react';
import { UsersList } from './UsersList';
import { UsersSecurity } from './UsersSecurity';
import { UsersLogs } from './UsersLogs';

interface UsersViewProps {
  subModule?: string;
}

export const UsersView: React.FC<UsersViewProps> = ({ subModule }) => {
  const renderSubContent = () => {
    switch (subModule) {
      case 'users-list': return <UsersList />;
      case 'users-security': return <UsersSecurity />;
      case 'users-logs': return <UsersLogs />;
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 bg-orange-50/20 rounded-fluent border border-dashed border-orange-200">
            <h3 className="text-xl font-bold text-orange-950 mb-2">Gestion Utilisateurs</h3>
            <p className="text-orange-950/50 max-w-sm">Veuillez sélectionner un sous-module.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-bold text-orange-950">Utilisateurs</h2>
        <p className="text-orange-950/40 font-medium tracking-tight">Administration des comptes et droits d'accès.</p>
      </div>
      {renderSubContent()}
    </div>
  );
};
