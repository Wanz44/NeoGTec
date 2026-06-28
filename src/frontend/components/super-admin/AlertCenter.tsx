import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  BellRing, ShieldAlert, CheckCircle, 
  Trash2, Radio, Info, Eye
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AlerteCritique {
  id: string;
  source: string;
  message: string;
  severity: 'Critique' | 'Warning' | 'Info';
  timestamp: string;
  status: 'active' | 'resolved';
}

export const AlertCenter: React.FC = () => {
  const [alerts, setAlerts] = useState<AlerteCritique[]>([
    {
      id: 'alt-5001',
      source: 'ARCA_SYNC',
      message: 'Rejet du lot de compliance #842 - Écart de MRR détecté',
      severity: 'Critique',
      timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString(),
      status: 'active',
    },
    {
      id: 'alt-5002',
      source: 'M-PESA GWAY',
      message: 'Temps de latence supérieur à 4200ms sur l\'API Kinshasa Mobile Cash',
      severity: 'Warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      status: 'active',
    },
    {
      id: 'alt-5003',
      source: 'SEC_KILLED',
      message: 'Requête non-autorisée interceptée sur la base de données tenant [LOKO-RDC]',
      severity: 'Critique',
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      status: 'active',
    },
    {
      id: 'alt-5004',
      source: 'CPU_SYS_HEAL',
      message: 'Consommation mémoire à 89% sur le serveur principal Europe-West2',
      severity: 'Warning',
      timestamp: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
      status: 'resolved',
    }
  ]);

  const [realtimeConnected, setRealtimeConnected] = useState(false);

  useEffect(() => {
    // 🔔 Realtime listener for table 'alertes_critiques' on Supabase
    const alertSubscription = supabase
      .channel('public:alertes_critiques')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alertes_critiques' },
        (payload: any) => {
          console.log('Realtime public.alertes_critiques tick payload:', payload);
          if (payload.eventType === 'INSERT') {
            const newAlert: AlerteCritique = {
              id: payload.new.id || `alt-${Math.random().toString(36).substr(2, 4)}`,
              source: payload.new.source || 'EXTERNAL_TRIGGER',
              message: payload.new.message || 'Nouvel évènement d\'alerte capturé',
              severity: payload.new.severity || 'Warning',
              timestamp: payload.new.timestamp || new Date().toISOString(),
              status: payload.new.status || 'active',
            };
            setAlerts(prev => [newAlert, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => prev.map(a => a.id === payload.new.id ? { ...a, ...payload.new } : a));
          } else if (payload.eventType === 'DELETE') {
            setAlerts(prev => prev.filter(a => a.id !== payload.old.id));
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setRealtimeConnected(true);
        }
      });

    // Simulate occasional incoming critical notifications for a hyper-realistic preview
    const interval = setInterval(() => {
      const mockSorces = ['REGULATOR_ARCA', 'API_GIMAC', 'M-PESA GWAY', 'SYS_DB', 'SAAS_K12'];
      const mockMsgs = [
        'Dépassement de plafond de pré-autorisation détecté sur la clinique Ngaliema',
        'Contrat suspendu temporairement : défaut d\'approvisionnement du compte séquestre',
        'Pic de requêtes suspectes sur la route d\'authentification /api/v1/auth',
        'Mise à jour réglementaire ARCA validée pour la filiale Congo-Kinshasa',
        'Niveau d\'occupation disque supérieur à 94% sur le cluster de stockage'
      ];
      const selectedSource = mockSorces[Math.floor(Math.random() * mockSorces.length)];
      const selectedMsg = mockMsgs[Math.floor(Math.random() * mockMsgs.length)];
      const isCrit = Math.random() > 0.4 ? 'Warning' : 'Critique';

      const simulatedAlert: AlerteCritique = {
        id: `alt-${Math.floor(Math.random() * 9000) + 1000}`,
        source: selectedSource,
        message: selectedMsg,
        severity: isCrit as any,
        timestamp: new Date().toISOString(),
        status: 'active'
      };

      // Add to list simulation unless list is bloated
      setAlerts(prev => {
        const list = [simulatedAlert, ...prev];
        return list.slice(0, 8);
      });
    }, 18000);

    return () => {
      supabase.removeChannel(alertSubscription);
      clearInterval(interval);
    };
  }, []);

  const handleResolve = (id: string) => {
    // Optimistic state change
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status: 'resolved' as const } : a));
  };

  const handleClear = (id: string) => {
    // Delete target
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col h-full">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
            <BellRing className="w-4 h-4 animate-bounce" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white uppercase tracking-wider">Centre d'Alertes Unifiés</h4>
            <span className="text-[9px] font-mono text-slate-500 block">Table: alertes_critiques</span>
          </div>
        </div>

        {/* Realtime listener badge status */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 rounded-xl border border-slate-850">
          <span className={cn(
            "w-1.5 h-1.5 rounded-full",
            realtimeConnected ? "bg-emerald-500 animate-pulse" : "bg-slate-500"
          )} />
          <span className="text-[8px] font-mono font-bold text-slate-400 tracking-wider">
            {realtimeConnected ? "REALTIME ON" : "CONNECTING..."}
          </span>
        </div>
      </div>

      {/* Alert items logs list box */}
      <div className="flex-1 overflow-y-auto space-y-3 max-h-[350px] pr-1 custom-scrollbar">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 opacity-40">
            <CheckCircle className="w-10 h-10 text-emerald-400 mb-2" />
            <span className="text-xs font-bold text-slate-350 font-mono uppercase">Aucun incident détecté</span>
          </div>
        ) : (
          alerts.map((alert) => (
            <div 
              key={alert.id}
              className={cn(
                "p-4 rounded-2xl border transition-all relative flex flex-col md:flex-row md:items-center justify-between gap-4",
                alert.status === 'resolved' 
                  ? "bg-slate-950/20 border-slate-850 opacity-55 hover:opacity-100" 
                  : alert.severity === 'Critique'
                    ? "bg-rose-950/20 border-rose-900/30 hover:border-rose-500/50"
                    : "bg-amber-950/20 border-amber-900/30 hover:border-amber-500/50"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "p-2.5 rounded-xl shrink-0 mt-0.5",
                  alert.status === 'resolved'
                    ? "bg-slate-800 text-slate-500"
                    : alert.severity === 'Critique'
                      ? "bg-rose-500/10 text-rose-400"
                      : "bg-amber-500/10 text-amber-400"
                )}>
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-200">
                      {alert.source}
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-500">
                      ID: {alert.id}
                    </span>
                    <span className="text-[8.5px] font-mono text-slate-500">
                      {new Date(alert.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  <p className="text-xs font-semibold text-slate-350 leading-relaxed max-w-lg">
                    {alert.message}
                  </p>

                  <div className="flex gap-1.5 pt-0.5">
                    {alert.severity === 'Critique' ? (
                      <span className="text-[7.5px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">
                        Critique
                      </span>
                    ) : (
                      <span className="text-[7.5px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        Warning
                      </span>
                    )}
                    {alert.status === 'resolved' && (
                      <span className="text-[7.5px] font-mono font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Résolu
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons wrapper */}
              <div className="flex items-center gap-2 shrink-0 md:self-center self-end">
                {alert.status === 'active' && (
                  <button 
                    onClick={() => handleResolve(alert.id)}
                    className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-650/80 border border-indigo-500/30 text-indigo-200 rounded-lg text-[9px] font-black uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    Marquer résolu
                  </button>
                )}
                <button 
                  onClick={() => handleClear(alert.id)}
                  className="p-2 bg-slate-900 hover:bg-red-500/10 text-slate-500 hover:text-red-400 border border-slate-800 rounded-lg transition-all cursor-pointer"
                  title="Supprimer la ligne d'alerte"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
