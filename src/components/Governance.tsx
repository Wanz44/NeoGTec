/**
 * 📄 Fichier : /src/components/Governance.tsx
 * 🎯 Objectif : Gestion de l'architecture SaaS, isolation des tenants et règles de gouvernance.
 * 🔗 Liens : Module N°1 du cœur métier AssurAdvancé. Utilisé par /src/App.tsx
 */

import React from 'react'; // Bibliothèque UI
import { 
  Building2, // Icône pour la gestion des entreprises (Tenants)
  Users, // Icône pour la gestion des rôles
  ShieldAlert, // Icône pour les politiques de sécurité
  Layers, // Icône pour l'isolation des couches applicatives
  Zap, // Icône pour la performance et le status "Live"
  Globe, // Icône pour les accès API globaux
  Lock // Icône pour le verrouillage de la configuration
} from 'lucide-react'; // Pack d'icônes standardisé
import { motion } from 'motion/react'; // Animations de composants | 🔗 Fichier lié: package.json

export const Governance: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-3xl font-bold text-orange-950 tracking-tight">Gouvernance & SaaS</h2>
        <p className="text-slate-500 font-medium text-sm">Configuration Multi-Tenancy et Isolation Systémique.</p>
      </header>

      {/* Grille des outils de configuration de la gouvernance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CONFIG_CARDS.map((card, idx) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="fluent-card p-6 cursor-pointer group relative overflow-hidden"
          >
            <div className="w-10 h-10 bg-orange-50 rounded-[10px] flex items-center justify-center text-orange-500 mb-6 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
              <card.icon className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-orange-950 mb-2 uppercase tracking-wide">{card.title}</h3>
            <p className="text-[12px] text-slate-500/80 mb-6 leading-relaxed font-medium">{card.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-black/[0.03]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contrôle Alpha</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-100/50">
                <Zap className="w-2.5 h-2.5" /> Actif
              </span>
            </div>
            {/* Hover Glow */}
            <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-orange-500/5 blur-xl rounded-full group-hover:scale-150 transition-transform" />
          </motion.div>
        ))}
      </div>

      {/* Section Alerting / Focus Audit SAAS */}
      <div className="material-mica rounded-fluent p-8 overflow-hidden relative border border-orange-100/30 shadow-inner">
        <div className="relative z-10 lg:w-2/3">
          <div className="flex items-center gap-2 mb-4 text-orange-600">
             <ShieldAlert className="w-5 h-5" />
             <h3 className="text-xl font-bold text-orange-950 tracking-tight">Cadre d'Isolation Multi-Client</h3>
          </div>
          <p className="text-slate-600 mb-8 font-medium leading-relaxed">
            L'architecture AssurAdvancé garantit que vos données sont physiquement isolées au sein du cluster de santé. 
            Toute modification du cadre de gouvernance impacte l'ensemble des modules opérationnels.
          </p>
          <div className="flex flex-wrap gap-3">
            <button className="bg-orange-500 text-white px-6 py-2.5 rounded-[8px] font-bold hover:bg-orange-600 transition-all shadow-lg shadow-orange-500/20 active:scale-95 text-sm outline-none">
              Auditer des Clients
            </button>
            <button className="bg-white px-6 py-2.5 rounded-[8px] font-bold text-orange-950 border border-black/5 hover:bg-slate-50 transition-all active:scale-95 text-sm outline-none">
              Logs d'Isolation
            </button>
          </div>
        </div>
        {/* Background Decorative Element */}
        <div className="absolute top-1/2 -right-10 -translate-y-1/2 opacity-20 blur-3xl w-64 h-64 bg-orange-500 rounded-full select-none pointer-events-none" />
      </div>
    </div>
  );
};

// Constante de données pour les cartes du module (Simulation de structure DB)
const CONFIG_CARDS = [
  { title: "Isolation Multi-Tenancy", icon: Building2, description: "Segmentation logique des bases de données et contrôle des accès par instance client isolée." },
  { title: "Hiérarchie des Rôles", icon: Users, description: "Configuration des privilèges : Super-Admin, Admin Tenant, Gestionnaire, Auditeur Externe." },
  { title: "Politique de Sécurité", icon: ShieldAlert, description: "Application des protocoles de cryptage AES-256 au repos et TLS 1.3 pour tous les flux." },
  { title: "Paramètres Globaux", icon: Layers, description: "Règles générales d'hébergement santé (HDS) et configurations régionales par défaut." },
  { title: "API Gateway SaaS", icon: Globe, description: "Pont de communication sécurisé gérant les throttling et authentifications partenaires." },
  { title: "Verrouillage État", icon: Lock, description: "Mécanisme anti-corruption empêchant les modifications de configuration critiques en production." },
];
