/**
 * 📄 Fichier : /src/frontend/components/integrations/WebhookAndHRHub.tsx
 * 🎯 Objectif : Gestion et diagnostic interactifs des webhooks et connexions SI RH (J1, J2).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, Link2, ShieldCheck, Play, Send, Check, AlertCircle, 
  Terminal, Globe, Database, ArrowRight, RefreshCw, Layers
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface SyncLog {
  id: string;
  source: 'Workday' | 'SAP HR' | 'SNIS';
  event: string;
  timestamp: string;
  status: 'Succès' | 'Echec';
}

const INITIAL_LOGS: SyncLog[] = [
  { id: 'LOG-882', source: 'Workday', event: 'Mise à jour effectif (12 recrues)', timestamp: '25/05/2026 14:02', status: 'Succès' },
  { id: 'LOG-881', source: 'SNIS', event: 'Synchro codes maladies ICD-11', timestamp: '25/05/2026 12:30', status: 'Succès' },
  { id: 'LOG-880', source: 'SAP HR', event: 'Suspension de 2 agents sortants', timestamp: '25/05/2026 09:15', status: 'Succès' },
];

export const WebhookAndHRHub: React.FC = () => {
  const [logs, setLogs] = useState<SyncLog[]>(INITIAL_LOGS);
  const [webhookUrl, setWebhookUrl] = useState('https://webhook.katangamining.cd/claims-sync');
  const [webhookEvent, setWebhookEvent] = useState('sinistre.approuve');
  const [isSyncingHR, setIsSyncingHR] = useState(false);

  // Webhook response diagnostic state
  const [testResult, setTestResult] = useState<{
    status: number;
    payload: string;
    headers: string;
    time: string;
  } | null>(null);
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);

  const triggerHRForceSync = () => {
    setIsSyncingHR(true);
    setTimeout(() => {
      const newLog: SyncLog = {
        id: `LOG-${Math.floor(800 + Math.random() * 200)}`,
        source: 'Workday',
        event: 'Forcer la synchronisation des effectifs entreprise',
        timestamp: new Date().toLocaleString(),
        status: 'Succès'
      };
      setLogs([newLog, ...logs]);
      setIsSyncingHR(false);
    }, 2000);
  };

  const handleTestWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!webhookUrl.trim()) return;

    setIsTestingWebhook(true);
    setTestResult(null);

    // Simulate real webhook target execution
    setTimeout(() => {
      const mockPayload = {
        event: webhookEvent,
        timestamp: new Date().toISOString(),
        environment: "production",
        data: {
          claim_id: "CL-8942",
          subscriber_reference: "ADNA-890124",
          treatment_benefit: "Consultation Spécialisée Pédiatrie",
          currency: "USD",
          adjudicated_amount: 145.00,
          clinic_recipient: "HJ Hospitals Kinshasa",
          signature_hash: "sha256_e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        }
      };

      setTestResult({
        status: 200,
        payload: JSON.stringify(mockPayload, null, 2),
        headers: `HTTP/1.1 200 OK\nContent-Type: application/json\nContent-Length: ${JSON.stringify(mockPayload).length}\nDate: ${new Date().toUTCString()}\nServer: Adonai-API-Gateway\nAccess-Control-Allow-Origin: *`,
        time: `${Math.floor(120 + Math.random() * 200)}ms`
      });
      setIsTestingWebhook(false);
    }, 1800);
  };

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* J1. Architectural interactive flowchart / sync metrics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-6">
            <div className="flex justify-between items-center pb-2">
              <div>
                <span className="text-xs font-black text-slate-1000 uppercase">Architecture de Flux & Connecteurs SI (J1)</span>
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-normal">Liaisons en temps réel avec les ERP de la flotte d&apos;assurés</p>
              </div>

              <button 
                onClick={triggerHRForceSync}
                disabled={isSyncingHR}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-1 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isSyncingHR && "animate-spin")} /> Forcer Synchro HR
              </button>
            </div>

            {/* Simulated Live visual interactive layout diagram flow */}
            <div className="grid grid-cols-3 gap-3 items-center bg-slate-50 border border-slate-200 p-6 rounded-2xl relative overflow-hidden">
              <div className="absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-dashed border-t border-slate-300 -translate-y-1/2 z-0" />
              
              {/* Box 1 */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm rounded-2xl flex flex-col items-center justify-center text-center z-10 relative">
                <Database className="w-6 h-6 text-indigo-600 mb-1" />
                <h5 className="text-[10px] font-black uppercase text-slate-800">ERP SI Client</h5>
                <span className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">SAP &amp; Workday</span>
              </div>

              {/* Central Engine Box 2 */}
              <div className="bg-slate-900 border border-slate-950 p-4 text-white rounded-3xl shadow-xl flex flex-col items-center justify-center text-center z-10 relative">
                <Server className="w-7 h-7 text-rose-400 animate-pulse mb-1" />
                <h5 className="text-[10.5px] font-black uppercase text-indigo-300">Hub Adonaï</h5>
                <span className="text-[8px] px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded-full font-mono mt-1">UPTIME 99.99%</span>
              </div>

              {/* Box 3 */}
              <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm rounded-2xl flex flex-col items-center justify-center text-center z-10 relative">
                <Globe className="w-6 h-6 text-emerald-600 mb-1" />
                <h5 className="text-[10px] font-black uppercase text-slate-800">SNIS National</h5>
                <span className="text-[8px] font-mono text-slate-400 uppercase mt-0.5">Etat Civil RDC</span>
              </div>
            </div>

            {/* Diagnostic Logs terminal block */}
            <div className="space-y-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Derniers Événements de synchronisation</span>
              
              <div className="space-y-2 bg-slate-950 rounded-2xl p-4 font-mono text-[11px] text-emerald-400 shadow-inner">
                {logs.map((log) => (
                  <div key={log.id} className="flex justify-between items-center">
                    <span>
                      <span className="text-rose-400">[{log.source}]</span> {log.event}
                    </span>
                    <span className="text-slate-500 text-[9px] font-sans font-bold">{log.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* J2. Webhooks Simulator block right */}
        <div className="bg-white border border-slate-150 rounded-[2.5rem] p-6 shadow-sm space-y-4 text-xs font-bold text-slate-700">
          <div className="flex items-center gap-2 pb-2">
            <Link2 className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-black text-slate-900 uppercase italic">J2. Enregistreur de Webhooks Test</span>
          </div>

          <form onSubmit={handleTestWebhook} className="space-y-3">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">URL Mandataire Webhook</label>
              <input 
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] font-semibold text-slate-800"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block font-bold">Événement Déclencheur</label>
              <select 
                value={webhookEvent}
                onChange={(e) => setWebhookEvent(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-extrabold text-slate-900"
              >
                <option value="sinistre.approuve">sinistre.approuve</option>
                <option value="cotisation.enregistree">cotisation.enregistree</option>
                <option value="adherent.suspendu">adherent.suspendu</option>
              </select>
            </div>

            <button 
              type="submit"
              disabled={isTestingWebhook}
              className="w-full py-4 bg-slate-1000 hover:bg-slate-850 text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isTestingWebhook ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Test en cours...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-emerald-400" /> Tester le Webhook
                </>
              )}
            </button>
          </form>

          {/* Diagnostic diagnostic payload output */}
          <AnimatePresence>
            {testResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 border-t border-slate-100 pt-3"
              >
                <div className="flex justify-between items-center text-[10px] font-mono">
                  <span className="font-extrabold text-emerald-600">Code: {testResult.status} OK</span>
                  <span className="text-slate-400">Latence: {testResult.time}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase block font-mono">Headers de réponse :</span>
                  <pre className="p-3 bg-slate-950 text-emerald-400 rounded-xl text-[9px] font-mono leading-relaxed overflow-x-auto whitespace-pre">
                    {testResult.headers}
                  </pre>
                </div>

                <div className="space-y-1">
                  <span className="text-[8px] font-black text-slate-400 uppercase block font-mono">Payload JSON fictif expédié :</span>
                  <pre className="p-3 bg-slate-950 text-indigo-300 rounded-xl text-[9px] font-mono leading-relaxed overflow-x-auto whitespace-pre">
                    {testResult.payload}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

    </div>
  );
};
