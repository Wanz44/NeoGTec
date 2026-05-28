/**
 * 📄 Fichier : /src/frontend/components/Governance.tsx
 * 🎯 Objectif : Gestion de la configuration générale, des formulaires et des documents.
 */
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GovernanceTenants } from './GovernanceTenants';
import { 
  Settings, FileText, Layout, Globe, Bell, 
  Clock, Shield, Save, Plus, Trash2, 
  Image as ImageIcon, Type, CheckSquare, 
  ChevronRight, Languages, Mail, Phone,
  Eye, Download, Share2, Printer, Hospital,
  Database, Activity, CheckCircle, RefreshCcw
} from 'lucide-react';
import { cn } from '../lib/utils';
import { verifySupabaseConnection } from '../lib/supabase';

type GovernanceTab = 'general' | 'forms' | 'documents' | 'tenants' | 'database';

export const Governance: React.FC = () => {
  const [activeTab, setActiveTab] = useState<GovernanceTab>('database'); // Set default to database to show connection directly
  const [dbStatus, setDbStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [dbMessage, setDbMessage] = useState<string>('En attente de connexion...');
  const [testingConnection, setTestingConnection] = useState(false);

  const checkConnection = async () => {
    setTestingConnection(true);
    setDbStatus('checking');
    try {
      const res = await verifySupabaseConnection();
      if (res.success) {
        setDbStatus('connected');
        setDbMessage(res.message);
      } else {
        setDbStatus('error');
        setDbMessage(res.message);
      }
    } catch (e: any) {
      setDbStatus('error');
      setDbMessage(e?.message || 'Erreur lors de la vérification.');
    } finally {
      setTestingConnection(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const renderGeneral = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* System Identity */}
          <div className="fluent-card p-6 rounded-lg border border-green-200 bg-white shadow-sm">
             <h4 className="text-[12px] font-black text-green-950 uppercase mb-6 flex items-center gap-2 italic">
                <Settings className="w-5 h-5 text-green-600" /> Identité du Système
             </h4>
             <div className="space-y-4">
                <div className="space-y-1.5">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom de la Plateforme</label>
                   <input type="text" defaultValue="Afreak-Care Pro" className="w-full px-4 py-2 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fuseau Horaire</label>
                      <select className="w-full px-4 py-2 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm">
                         <option>UTC+01:00 Lagos/Kinshasa</option>
                         <option>UTC+00:00 Abidjan/Dakar</option>
                      </select>
                   </div>
                   <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Langue par Défaut</label>
                      <select className="w-full px-4 py-2 bg-slate-50 border border-green-300 rounded-md text-xs font-bold outline-none focus:ring-2 focus:ring-green-500/20 shadow-sm">
                         <option>Français</option>
                         <option>English</option>
                         <option>Português</option>
                      </select>
                   </div>
                </div>
                <div className="pt-4 flex items-center gap-4">
                   <div className="w-16 h-16 bg-green-50 border-2 border-dashed border-green-200 rounded-lg flex flex-col items-center justify-center text-green-400 cursor-pointer hover:bg-green-100 transition-all">
                      <ImageIcon className="w-6 h-6" />
                      <span className="text-[8px] font-black uppercase mt-1">Logo</span>
                   </div>
                   <p className="text-[10px] font-medium text-slate-400 leading-relaxed italic">Téléchargez le logo de votre organisation pour personnaliser les interfaces et documents.</p>
                </div>
             </div>
          </div>

          {/* Performance & Limits */}
          <div className="fluent-card p-6 rounded-lg border border-green-200 bg-white shadow-sm">
             <h4 className="text-[12px] font-black text-green-950 uppercase mb-6 flex items-center gap-2 italic">
                <Shield className="w-5 h-5 text-indigo-600" /> Seuils & Limites
             </h4>
             <div className="space-y-4">
                {[
                  { label: "Délai de traitement max (Sinistres)", val: "48", unit: "Heures" },
                  { label: "Plafond auto-approbation", val: "500,000", unit: "FCFA" },
                  { label: "Durée session inactive", val: "15", unit: "Minutes" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-md border border-green-200 shadow-sm">
                     <span className="text-[10px] font-bold text-slate-600 uppercase">{s.label}</span>
                     <div className="flex items-center gap-2">
                        <input type="text" defaultValue={s.val} className="w-20 px-2 py-1 bg-white border border-green-300 rounded-sm text-xs font-black text-right shadow-sm focus:border-green-500 outline-none" />
                        <span className="text-[9px] font-black text-slate-300 uppercase">{s.unit}</span>
                     </div>
                  </div>
                ))}
             </div>
          </div>
       </div>

       {/* Notifications Setup */}
       <div className="fluent-card p-6 rounded-xl border border-green-200 bg-white shadow-sm">
          <h4 className="text-[12px] font-black text-green-950 uppercase mb-6 flex items-center gap-2 italic">
             <Bell className="w-5 h-5 text-green-500" /> Canaux de Communication
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {[
                { icon: Mail, label: 'Email SMTP', status: 'Actif', desc: 'Alertes systèmes et rapports.' },
                { icon: Phone, label: 'SMS Gateway', status: 'Inactif', desc: 'Codes MFA et rappels.' },
                { icon: Globe, label: 'Webhooks', status: 'Configuré', desc: 'Sync avec ERP/CRM tiers.' }
             ].map((n, i) => (
                <div key={i} className="p-4 rounded-xl border border-green-100 group hover:border-green-400 transition-all cursor-pointer bg-white">
                   <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-slate-50 text-slate-400 group-hover:text-green-600 transition-colors rounded-lg border border-transparent group-hover:border-green-100">
                         <n.icon className="w-5 h-5" />
                      </div>
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-0.5 rounded-full",
                        n.status === 'Actif' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-400"
                      )}>{n.status}</span>
                   </div>
                   <h5 className="text-[11px] font-black text-green-950 uppercase">{n.label}</h5>
                   <p className="text-[10px] font-medium text-slate-400 mt-1 italic leading-tight">{n.desc}</p>
                </div>
             ))}
          </div>
       </div>

       <div className="flex justify-end pt-4">
          <button className="flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-green-600/30 hover:bg-green-700 transition-all border border-green-700">
             <Save className="w-4 h-4" /> Sauvegarder les Paramètres
          </button>
       </div>
    </div>
  );

  const renderForms = () => (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
          <h4 className="text-sm font-black text-green-950 uppercase">Éditeur de Formulaires Métier</h4>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-green-700 transition-all border border-green-700">
             <Plus className="w-4 h-4" /> Nouveau Formulaire
          </button>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
             {['Déclaration Sinistre', 'Souscription Contrat', 'Demande Prestation', 'Fiche Patient'].map((f, i) => (
                <div key={i} className="p-4 bg-white border border-green-100 rounded-xl flex items-center justify-between group hover:border-green-400 transition-all cursor-pointer shadow-sm">
                   <div className="flex items-center gap-3">
                      <Layout className="w-4 h-4 text-green-600" />
                      <span className="text-[11px] font-black text-green-950 uppercase">{f}</span>
                   </div>
                   <div className="text-right">
                      <span className="text-[8px] font-black text-slate-300 uppercase block">v{2.1 + i/10}</span>
                      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-green-400" />
                   </div>
                </div>
             ))}
          </div>

          <div className="lg:col-span-2 fluent-card p-6 rounded-xl border border-green-200">
             <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-green-100 rounded-lg border border-green-200 flex items-center justify-center text-green-600"><Layout className="w-5 h-5" /></div>
                   <h5 className="text-xs font-black text-green-950 uppercase">Édition : Déclaration Sinistre</h5>
                </div>
                <div className="flex gap-2">
                   <button className="p-2 border border-slate-100 rounded-lg text-slate-400 hover:text-green-600 transition-all"><Eye className="w-4 h-4" /></button>
                   <button className="p-2 border border-slate-100 rounded-lg text-slate-400 hover:text-rose-600 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
             </div>

             <div className="space-y-4">
                {[
                  { label: "Date de l'incident", type: "Date", req: true },
                  { label: "Type de Dommage", type: "Select", req: true },
                  { label: "Montant Estimé", type: "Currency", req: false },
                  { label: "Description détaillée", type: "LongText", req: true },
                ].map((field, i) => (
                  <div key={i} className="p-4 bg-slate-50 border border-dashed border-green-300 rounded-md flex items-center justify-between group bg-white shadow-sm">
                     <div className="flex items-center gap-4">
                        <div className="cursor-move text-slate-300"><Type className="w-4 h-4" /></div>
                        <div>
                           <p className="text-[11px] font-black text-green-950 uppercase">{field.label}</p>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{field.type} • {field.req ? 'Requis' : 'Optionnel'}</p>
                        </div>
                     </div>
                     <Settings className="w-4 h-4 text-slate-200 group-hover:text-green-600 cursor-pointer" />
                  </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-green-200 rounded-md text-[10px] font-black text-green-300 uppercase tracking-widest hover:border-green-400 hover:text-green-600 transition-all shadow-sm">
                   + Ajouter un champ spécifique
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  const renderDocuments = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Facture Client', icon: FileText, color: 'text-green-600' },
          { title: 'Contrat Individuel', icon: Shield, color: 'text-green-600' },
          { title: 'Devis Santé', icon: Clock, color: 'text-emerald-600' },
          { title: 'Reçu de Paiement', icon: CheckSquare, color: 'text-rose-600' }
        ].map((doc, i) => (
          <div key={i} className="fluent-card p-6 flex flex-col items-center justify-center text-center group cursor-pointer hover:border-green-400 transition-all rounded-lg border border-green-200 bg-white shadow-sm">
            <div className={cn("w-12 h-12 rounded-lg border border-green-200 group-hover:border-current bg-opacity-10 mb-4 flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm", doc.color.replace('text-', 'bg-'))}>
              <doc.icon className={cn("w-6 h-6", doc.color)} />
            </div>
            <h5 className="text-[10px] font-black text-green-950 uppercase tracking-tight">{doc.title}</h5>
            <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic">Modifier le modèle</p>
          </div>
        ))}
      </div>

      <div className="fluent-card p-0 overflow-hidden rounded-lg border border-green-200 mt-6">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white">
          <h5 className="text-xs font-black text-green-950 uppercase flex items-center gap-2">
            <Languages className="w-4 h-4 text-green-600" /> Support Multilingue & Traductions
          </h5>
          <button className="px-4 py-2 border border-green-300 rounded-md text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">Gérer les Lexiques</button>
        </div>
        <div className="divide-y divide-slate-50 bg-white">
          {[
            { key: 'invoice_title', fr: 'Facture Numérique', en: 'Digital Invoice' },
            { key: 'premium_total', fr: 'Total Cotisation', en: 'Total Premium' },
            { key: 'treatment_date', fr: 'Date des soins', en: 'Treatment Date' }
          ].map((term) => (
            <div key={term.key} className="grid grid-cols-3 p-4 items-center">
              <code className="text-[10px] font-mono text-green-600">{term.key}</code>
              <input type="text" defaultValue={term.fr} className="bg-transparent border-none text-[11px] font-bold text-slate-700 outline-none p-1 focus:bg-green-50 rounded" />
              <input type="text" defaultValue={term.en} className="bg-transparent border-none text-[11px] font-bold text-slate-400 italic outline-none p-1 focus:bg-green-50 rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );

  const renderDatabase = () => (
    <div className="space-y-6">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Status Panel */}
          <div className="lg:col-span-1 p-6 rounded-lg border border-green-200 bg-white shadow-sm flex flex-col justify-between">
             <div>
                <h4 className="text-[12px] font-black text-green-950 uppercase mb-4 flex items-center gap-2 italic">
                   <Database className="w-5 h-5 text-emerald-650" /> Liaison Supabase Cluster
                </h4>
                <div className="p-4 bg-slate-50 border border-green-100 rounded-lg space-y-3">
                   <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Endpoint API</span>
                      <code className="text-[10px] font-bold text-green-700 font-mono select-all break-all block">
                         https://lbgwlghiwpamhthdgukw.supabase.co
                      </code>
                   </div>
                   <div className="space-y-1 pt-2 border-t border-slate-200/60">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Clé Publique (Anon)</span>
                      <code className="text-[10px] font-bold text-slate-600 font-mono select-all break-all block">
                         sb_publishable_PHF4KyIwnRBzWXE21_krug_2BZvMtG-
                      </code>
                   </div>
                </div>
             </div>

             <div className="pt-6 space-y-3">
                <div className="flex items-center gap-3">
                   <div className={cn(
                      "w-3 h-3 rounded-full shrink-0",
                      dbStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : dbStatus === 'error' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500 animate-pulse'
                   )} />
                   <p className="text-[11px] font-extrabold text-slate-700">
                      Statut: {dbStatus === 'connected' ? 'Connecté à Supabase' : dbStatus === 'error' ? 'Erreur de liaison' : 'Vérification...'}
                   </p>
                </div>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed italic">
                   {dbMessage}
                </p>

                <button
                   onClick={checkConnection}
                   disabled={testingConnection}
                   className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-50 hover:bg-green-50 text-green-950 rounded-lg text-[10px] font-black uppercase tracking-wider hover:text-green-600 transition-all border border-slate-200 cursor-pointer"
                >
                   <RefreshCcw className={cn("w-3.5 h-3.5", testingConnection && "animate-spin")} />
                   Rafraîchir la Connexion
                </button>
             </div>
          </div>

          {/* Connected Capabilities */}
          <div className="lg:col-span-2 p-6 rounded-lg border border-green-200 bg-white shadow-sm">
             <h4 className="text-[12px] font-black text-green-950 uppercase mb-4 flex items-center gap-2 italic">
                <Activity className="w-5 h-5 text-emerald-650" /> Fonctionnalités Supabase Actives
             </h4>
             <p className="text-[11px] text-slate-500 font-semibold mb-6">
                Le SDK client Supabase centralsé est nativement couplé avec le moteur de synchronisation opérationnel du frontend de NeoGTec :
             </p>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                   { title: "WORM Audit Sync", desc: "Synchronisation automatique de la trace d'audits chiffrée de NeoGTec vers la table 'neogtec_audit_logs'.", tag: "PostgreSQL" },
                   { title: "Multi-Tenant Isolation", desc: "Séparation d'accès cliniques gérée directement par les stratégies de sécurité RLS (Row Level Security).", tag: "RLS Actif" },
                   { title: "Statut des Terminaux", desc: "Télémétrie en temps réel sur les tentatives d'authentification MFA et validations financières 4-Eyes.", tag: "Sécurisé" },
                   { title: "Bénéficiaires & Familles", desc: "Mise à jour à la volée des ayants-droits respectant le plafond légal d'affiliation de 25 ans.", tag: "Régulation ARCA" },
                ].map((item, idx) => (
                   <div key={idx} className="p-4 bg-slate-50 rounded-lg border border-slate-100 hover:border-emerald-250 transition-all">
                      <div className="flex justify-between items-center mb-2">
                         <h5 className="text-[11px] font-black text-green-950 uppercase">{item.title}</h5>
                         <span className="text-[8px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-750 rounded-sm uppercase">{item.tag}</span>
                      </div>
                      <p className="text-[10px] font-medium text-slate-400 leading-normal italic">{item.desc}</p>
                   </div>
                ))}
             </div>
          </div>
       </div>

       {/* DDL Schema Reference */}
       <div className="p-6 rounded-lg border border-green-200 bg-white shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
             <h4 className="text-[12px] font-black text-green-950 uppercase flex items-center gap-2 italic">
                <FileText className="w-5 h-5 text-indigo-505" /> Structure Relationnelle de la BDD Postgres (Supabase)
             </h4>
             <span className="text-[8px] font-black uppercase text-slate-400">Fichier de déploiement: database/schema.sql</span>
          </div>
          <p className="text-[11px] text-slate-500 font-semibold mb-4 leading-relaxed">
             Les tables suivantes doivent être configurées sur votre instance Supabase pour exploiter pleinement l'intelligence métier de la plateforme. Vous pouvez copier directement le script SQL ci-dessous dans votre éditeur SQL Supabase :
          </p>
          <div className="relative">
             <pre className="text-[10px] font-mono p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto max-h-[300px] leading-relaxed border border-slate-950 select-all">
{`-- SQL SCRIPTS FOR SUPABASE DATABASE (NEOGTEC CORE)
CREATE TABLE IF NOT EXISTS neogtec_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    id_log VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    user_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    user_role VARCHAR(100) NOT NULL,
    action_name VARCHAR(255) NOT NULL,
    payload_details TEXT,
    origin_ip VARCHAR(50),
    severity_status VARCHAR(50) NOT NULL
);

-- Créez un index d'optimisation sur les actions de gouvernance
CREATE INDEX IF NOT EXISTS idx_neogtec_actions ON neogtec_audit_logs(action_name);`}
             </pre>
          </div>
       </div>
    </div>
  );

  return (
    <div className="space-y-6">
       {/* Header */}
       <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
             <h2 className="text-3xl font-extrabold text-green-950 tracking-tight italic flex items-center gap-3">
                Gouvernance <Settings className="w-8 h-8 text-green-500 fill-green-500/10" />
             </h2>
             <p className="text-green-900/50 font-medium tracking-tight uppercase tracking-tight italic underline decoration-green-200 underline-offset-4 decoration-2">Paramétrage Général, Formulaires & Archivage</p>
          </div>
          <div className="flex bg-white p-1.5 rounded-lg border border-green-200 shadow-sm overflow-x-auto no-scrollbar scroll-smooth">
             {[
               { id: 'database', label: 'Base Supabase', icon: Database },
               { id: 'tenants', label: 'Etablissements', icon: Hospital },
               { id: 'general', label: 'Général', icon: Settings },
               { id: 'forms', label: 'Formulaires', icon: Layout },
               { id: 'documents', label: 'Documents', icon: FileText },
             ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-6 py-2.5 rounded-md text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 whitespace-nowrap border border-transparent shadow-sm",
                    activeTab === tab.id ? "bg-green-600 text-white shadow-lg shadow-green-600/20 border-green-700" : "text-slate-400 hover:text-green-600 hover:border-green-100"
                  )}
                >
                   <tab.icon className="w-3.5 h-3.5" />
                   {tab.label}
                </button>
             ))}
          </div>
       </div>

       <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
             {activeTab === 'database' && renderDatabase()}
             {activeTab === 'tenants' && <GovernanceTenants />}
             {activeTab === 'general' && renderGeneral()}
             {activeTab === 'forms' && renderForms()}
             {activeTab === 'documents' && renderDocuments()}
          </motion.div>
       </AnimatePresence>
    </div>
  );
};
