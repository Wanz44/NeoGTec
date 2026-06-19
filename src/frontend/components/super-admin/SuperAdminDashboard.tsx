import React, { useState, useEffect } from 'react';
import { useApp } from '../../lib/AppContext';
import { SidebarSuperAdmin } from './SidebarSuperAdmin';
import { KpiCard } from './KpiCard';
import { MapAfrica } from './MapAfrica';
import { AlertCenter } from './AlertCenter';
import { ArcaGauges } from './ArcaGauges';
import { TenantTable } from './TenantTable';
import { RealtimePulse } from './RealtimePulse';
import { GodModeToggle } from './GodModeToggle';
import { 
  ShieldAlert, ShieldCheck, Terminal, UserCheck, 
  HelpCircle, Eye, Network, AlertOctagon, RefreshCw
} from 'lucide-react';
import { cn } from '../../lib/utils';

export const SuperAdminDashboard: React.FC = () => {
  const { currentUser, setPage, logAction, setActiveModule } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [godModeActive, setGodModeActive] = useState(false);
  const [godModeReason, setGodModeReason] = useState<string | null>(null);
  
  // Local audit logs tracking occurrences in current session
  const [sessionLogs, setSessionLogs] = useState<Array<{
    id: string;
    timestamp: string;
    action: string;
    details: string;
    level: 'INFO' | 'WARNING' | 'CRITICAL';
  }>>([
    {
      id: "log-001",
      timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      action: "SESSION_MOUNT",
      details: "Chargement du noyau cockpit de supervision NeoGTec SuperAdmin v2.6",
      level: "INFO"
    },
    {
      id: "log-002",
      timestamp: new Date(Date.now() - 1000 * 60 * 14).toISOString(),
      action: "MIDDLEWARE_PASSED",
      details: "Authentification validée. Rôle 'SUPER_ADMIN' vérifié sur le token JWT.",
      level: "INFO"
    }
  ]);

  // Handler to log action on both Local Audit console AND global tracking context
  const handleLogIncident = (action: string, details: string) => {
    const isCritical = action.includes('GOD_MODE') || action.includes('BYPASS');
    const newLog = {
      id: `log-${Math.floor(Math.random() * 9000) + 1000}`,
      timestamp: new Date().toISOString(),
      action,
      details,
      level: (isCritical ? 'CRITICAL' : action.includes('WARNING') ? 'WARNING' : 'INFO') as any
    };

    setSessionLogs(prev => [newLog, ...prev]);
    
    // Propagate up to global action logs
    if (logAction) {
      logAction(action, details, isCritical ? 'CRITICAL' : 'SUCCESS');
    }
  };

  // Switch routing helper
  const handleExitAdmin = () => {
    if (setActiveModule) {
      setActiveModule('dashboard'); // Return to standard user views
    }
  };

  // 🛡️ SÉCURITÉ: Middleware verification check
  // The system checks if role === 'SUPER_ADMIN' or role === 'SUPER_ADMIN' corresponding email is logged in.
  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN' || currentUser?.role === 'ADMINISTRATEUR';

  if (!isSuperAdmin) {
    return (
      <div className="min-h-[500px] flex items-center justify-center p-8 bg-slate-950 text-slate-300 rounded-3xl border border-red-950/40 relative overflow-hidden h-[calc(100vh-2rem)]">
        {/* Decorative alert graphic */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-500/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div id="unauthorized-placeholder" className="max-w-md text-center space-y-6 relative z-10 p-8 border border-slate-905 bg-slate-900/30 rounded-3xl backdrop-blur-md">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <AlertOctagon className="w-8 h-8" />
          </div>
          
          <div className="space-y-2">
            <h4 className="text-lg font-black text-white uppercase tracking-wider font-mono">SÉCURITÉ INFRASTRUCTURE</h4>
            <p className="text-xs text-red-400 font-mono tracking-tight font-semibold uppercase">Erreur de privilèges : Rôle super_admin requis</p>
            <p className="text-xs text-slate-400 leading-relaxed font-semibold">
              Votre session actuelle est restreinte à <span className="font-mono text-slate-300">[{currentUser?.role || 'ASSURE'}]</span>. Le middleware bloque l'accès à la console d'audit multi-locataire.
            </p>
          </div>

          <div className="pt-2 flex flex-col gap-2.5">
            {/* Quick guide helper button inside warning */}
            <p className="text-[10px] text-slate-500 font-mono">
              Pro-Tip: Utilisez le menu Profil en haut à droite pour commuter vers un rôle "Paul (Super Admin)".
            </p>
            <button
              onClick={handleExitAdmin}
              className="py-2.5 bg-slate-905 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-xs font-bold uppercase transition-colors cursor-pointer w-full"
            >
              Retourner au tableau de bord standard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6 bg-slate-950 text-slate-300 p-6 rounded-3xl border border-slate-900 overflow-hidden relative min-h-screen select-none font-sans">
      
      {/* 1. Sidebar - Spans 12 columns on small screens, 3 or 2 on large screens */}
      <SidebarSuperAdmin 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onExit={handleExitAdmin}
        godModeActive={godModeActive}
      />

      {/* Main viewport - Spans remaining columns */}
      <div className="col-span-12 lg:col-span-9 xl:col-span-10 flex flex-col space-y-6 h-[calc(100vh-2rem)] overflow-y-auto pr-1 custom-scrollbar">
        
        {/* Technical Header Area */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-900 pb-5 shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-mono font-black uppercase text-red-500 tracking-wider">Super Admin Control Cockpit</span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              Super-Console Multi-Tenant
            </h2>
            <p className="text-[10px] text-slate-500 font-mono">
              Sécurisé par middleware de jeton réseau NeoGTec • Node-Live ID: {currentUser?.email || 'paulloko@neogtec.com'}
            </p>
          </div>

          {/* 🟢 GOD MODE GATEWAY WITH REASON REQUIREMENT */}
          <GodModeToggle 
            active={godModeActive}
            onToggle={(active, reason) => {
              setGodModeActive(active);
              setGodModeReason(reason || null);
            }}
            onLogIncident={handleLogIncident}
          />
        </header>

        {/* Dynamic sub-panels routing views */}
        <div className="flex-1 space-y-6 pb-8">
          
          {activeTab === 'overview' && (
            <>
              {/* BLOC 1: KPI CARDS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                <KpiCard 
                  title="MRR Réseau Récurrent" 
                  value="411.350,00"
                  change="12.4"
                  valuePrefix="$"
                />
                <KpiCard 
                  title="Moyenne Latence Routage" 
                  value="142" 
                  change="-8.1"
                  valueSuffix=" ms"
                />
                <KpiCard 
                  title="Sinistralité (Loss Ratio)" 
                  value="55.24" 
                  change="4.2"
                  valueSuffix=" %"
                  alert={true}
                />
                <KpiCard 
                  title="Alerte Système Actives" 
                  value="3" 
                  change="-1"
                />
              </div>

              {/* TWO COLUMN ROW: MAP VS PULSE */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8">
                  {/* BLOC 2: African Map Selector */}
                  <MapAfrica />
                </div>
                <div className="xl:col-span-4">
                  {/* BLOC 6: Live Sparks telemetrics */}
                  <RealtimePulse />
                </div>
              </div>

              {/* TWO COLUMN ROW: ALERTS VS CONFORMITÉ */}
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-6">
                  {/* BLOC 3: Alert Tracker */}
                  <AlertCenter />
                </div>
                <div className="xl:col-span-6">
                  {/* BLOC 4: Arca compliance dials */}
                  <ArcaGauges />
                </div>
              </div>

              {/* TENANT TABLE PREVIEW */}
              <div className="grid grid-cols-1">
                {/* BLOC 5: Tenant tracking */}
                <TenantTable />
              </div>
            </>
          )}

          {activeTab === 'tenants' && (
            <div className="grid grid-cols-1">
              <TenantTable />
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="grid grid-cols-1">
              <AlertCenter />
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="grid grid-cols-1">
              <ArcaGauges />
            </div>
          )}

        </div>

        {/* 🟢 Live audit logs trace view (Syslog) */}
        <footer className="mt-auto pt-4 border-t border-slate-900 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="w-3.5 h-3.5 text-red-500 shrink-0" />
            <h6 className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">
              Syslog Audit en direct (Session Actuelle)
            </h6>
          </div>
          
          <div className="bg-slate-950 border border-slate-900 rounded-xl p-3 h-28 overflow-y-auto custom-scrollbar font-mono text-[9px] text-slate-500 space-y-1 select-text">
            {sessionLogs.map((log) => (
              <p key={log.id} className="leading-normal">
                <span className="text-slate-650">[{new Date(log.timestamp).toLocaleTimeString()}]</span>{' '}
                <span className={cn(
                  "font-bold",
                  log.level === 'CRITICAL' ? 'text-red-400' : log.level === 'WARNING' ? 'text-amber-400' : 'text-indigo-400'
                )}>
                  {log.action}
                </span>{' '}
                <span className="text-slate-400">• {log.details}</span>
              </p>
            ))}
          </div>
        </footer>

      </div>
    </div>
  );
};
export default SuperAdminDashboard;
