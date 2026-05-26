/**
 * 📄 Fichier : /src/frontend/components/integrations/WebhookAndHRHub.tsx
 * 🎯 Objectif : Portail API avec Scopes (I1), Convertisseur HL7 / FHIR (I2) et Simulateur/Renvoyeur Webhooks (I3).
 */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, Link2, ShieldCheck, Play, Send, Check, AlertCircle, Terminal, 
  Globe, Database, ArrowRight, RefreshCw, Layers, Key, ShieldAlert, Code, 
  Copy, Cpu, ArrowLeftRight
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface WebhookLog {
  id: string;
  event: string;
  targetUrl: string;
  lastAttempt: string;
  status: '200 OK' | '500 Error';
  attempts: number;
}

const INITIAL_WEBHOOKS: WebhookLog[] = [
  { id: 'WH-401', event: 'sinistre.paye', targetUrl: 'https://webhook.katangamining.cd/claims-sync', lastAttempt: '2026-05-25 15:02', status: '200 OK', attempts: 1 },
  { id: 'WH-402', event: 'adherent.suspendu', targetUrl: 'https://api.directassurance.cd/v1/sync', lastAttempt: '2026-05-25 12:30', status: '500 Error', attempts: 3 }
];

export const WebhookAndHRHub: React.FC = () => {
  const [activeSegment, setActiveSegment] = useState<'api' | 'fhir' | 'webhook'>('api');

  // I1. API Keys states
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [apiScopes, setApiScopes] = useState({
    claimsWrite: true,
    claimsRead: true,
    patientRead: true,
    fhirIngest: false
  });
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  // I2. Converter FHIR / HL7 states
  const [jsonInput, setJsonInput] = useState(`{
  "id": "PAT-4560",
  "patientName": "Marie-Claire Mbika",
  "treatment": "Prothèse Dentaire C01",
  "dentistCostUSD": 120.00
}`);
  const [hl7Output, setHl7Output] = useState('');
  const [isConverting, setIsConverting] = useState(false);

  // I3. Webhook simulation states
  const [webhooks, setWebhooks] = useState<WebhookLog[]>(INITIAL_WEBHOOKS);
  const [resendTarget, setResendTarget] = useState<string | null>(null);
  const [isResending, setIsResending] = useState(false);
  const [resendResultMsg, setResendResultMsg] = useState<string | null>(null);

  // API key generator
  const handleGenerateApiKey = (e: React.FormEvent) => {
    e.preventDefault();
    const scopesList = Object.entries(apiScopes)
      .filter(([_, active]) => active)
      .map(([name]) => name.replace(/[A-Z]/g, letter => `:${letter.toLowerCase()}`))
      .join(',');
    
    // Create random token
    const randomHex = Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    const token = `sk_live_neo_${randomHex.substring(0, 24)}_${btoa(scopesList).substring(0, 10)}`;
    setGeneratedKey(token);
  };

  const handleCopyKey = () => {
    if (generatedKey) {
      navigator.clipboard.writeText(generatedKey);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 3000);
    }
  };

  // HL7 Converter calculation
  const handleHl7Conversion = () => {
    setIsConverting(true);
    setHl7Output('');

    setTimeout(() => {
      try {
        const obj = JSON.parse(jsonInput);
        const namePart = obj.patientName ? obj.patientName.split(' ') : ['PATIENT', 'NAME'];
        const firstName = namePart[0] || '';
        const lastName = namePart[1] || '';
        const id = obj.id || 'PAT-TEMP';
        const cost = obj.dentistCostUSD || 0;
        const treat = obj.treatment || 'SOIN';

        const customHl7 = `MSH|^~\\&|NEOGTEC|SYS-CORE|HJ_HOSPITAL|GIN-SYSTEM|202605251600||ADT^A08^ADT_A08|MSG-${Math.floor(Math.random()*80000)+10000}|P|2.5\n` +
                          `EVN||202605251600|||||MSH\n` +
                          `PID|||${id}||${lastName}^${firstName}||19881112|F\n` +
                          `PV1||I|VIP||||||||||||||||||||||||||||||||||||||\n` +
                          `FT1|1|||202605251500||${treat}^CCAM|||||${cost}|USD`;
        
        setHl7Output(customHl7);
      } catch (err) {
        setHl7Output('Erreur : Saisie JSON non conforme ou mal formulée pour le parser HL7 RDC.');
      }
      setIsConverting(false);
    }, 1200);
  };

  // Re-send webhook simulator
  const handleResendWebhook = (wh: WebhookLog) => {
    setResendTarget(wh.id);
    setIsResending(true);
    setResendResultMsg(null);

    setTimeout(() => {
      setIsResending(false);
      // Simulates successful delivery of webhook retry
      setResendResultMsg(`[Succès] Webhook ${wh.id} ré-expédié à ${wh.targetUrl}. Code de réponse HTTP: 200 OK.`);
      
      // Update local log
      setWebhooks(prev => prev.map(w => w.id === wh.id ? { ...w, status: '200 OK', attempts: w.attempts + 1, lastAttempt: new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString().substring(0, 5) } : w));
      
      setTimeout(() => setResendResultMsg(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">

      {/* Interop Segment Navigation tabs */}
      <div className="flex bg-slate-100 p-1 rounded-2xl gap-2 w-fit">
        {[
          { id: 'api', label: 'I1. Portail Clés API & Scopes', icon: Key },
          { id: 'fhir', label: 'I2. Convertisseur JSON ↔ HL7 / FHIR', icon: ArrowLeftRight },
          { id: 'webhook', label: 'I3. Simulateur & Renvoyeur Webhooks', icon: Link2 }
        ].map((seg) => (
          <button 
            key={seg.id}
            onClick={() => setActiveSegment(seg.id as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer",
              activeSegment === seg.id ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900"
            )}
          >
            <seg.icon className="w-3.5 h-3.5" />
            {seg.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >

          {/* SECTION 1: API KEYS & SCOPES CREATOR (I1) */}
          {activeSegment === 'api' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4">
                <div className="pb-2 border-b">
                  <span className="text-xs font-black text-slate-900 uppercase">I1. Création de jeton d&apos;accès</span>
                </div>

                <form onSubmit={handleGenerateApiKey} className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block font-bold">Sélectionner les scopes de restriction</span>

                  <div className="space-y-2 text-[11px] font-bold text-slate-700">
                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded accent-indigo-650"
                        checked={apiScopes.claimsWrite}
                        onChange={(e) => setApiScopes(prev => ({ ...prev, claimsWrite: e.target.checked }))}
                      />
                      <span>claims:write (Soumettre des feuilles de soins)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded accent-indigo-650"
                        checked={apiScopes.claimsRead}
                        onChange={(e) => setApiScopes(prev => ({ ...prev, claimsRead: e.target.checked }))}
                      />
                      <span>claims:read (Consulter l&apos;historique de remboursement)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded accent-indigo-650"
                        checked={apiScopes.patientRead}
                        onChange={(e) => setApiScopes(prev => ({ ...prev, patientRead: e.target.checked }))}
                      />
                      <span>patient:read (Vérifier d&apos;éligibilité adhérents)</span>
                    </label>

                    <label className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        className="rounded accent-indigo-650"
                        checked={apiScopes.fhirIngest}
                        onChange={(e) => setApiScopes(prev => ({ ...prev, fhirIngest: e.target.checked }))}
                      />
                      <span>fhir:ingest (Flux HL7 / FHIR structuré)</span>
                    </label>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[9.5px] font-black uppercase tracking-widest text-center cursor-pointer font-black"
                  >
                    Générer Jeton Certifié
                  </button>
                </form>
              </div>

              {/* Generated Jeton Token Output */}
              <div className="lg:col-span-2">
                {generatedKey ? (
                  <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-[2.5rem] shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-xs font-black text-white uppercase tracking-widest font-mono">Clé d&apos;accès NeoGTec active</span>
                      <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase rounded">
                        ✓ Live Secure Mode
                      </span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[8.5px] font-black text-slate-400 uppercase font-mono block">Clé API à intégrer</span>
                      <div className="p-4 bg-slate-950 text-indigo-300 rounded-xl font-mono text-xs flex justify-between items-center overflow-x-auto whitespace-pre">
                        <span>{generatedKey}</span>
                        <button 
                          onClick={handleCopyKey}
                          className="p-2 ml-4 bg-slate-900 hover:bg-slate-850 text-white rounded-lg flex items-center gap-1 text-[9px] font-bold uppercase cursor-pointer shrink-0"
                        >
                          {copiedKey ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" /> Copié
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copier
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-800 border border-slate-755 rounded-2xl flex items-start gap-2 text-xs font-semibold text-slate-300 text-justify">
                      <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
                      <p className="leading-relaxed">
                        Cette clé API est cryptographique. Ne la divulguez jamais sur des forums ou dans votre code client. Elle intègre directement les règles de re-calculs et de ticket modérateur définis par votre convention.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <Key className="w-10 h-10 text-slate-350" />
                    <div>
                      <h4 className="text-xs font-black text-slate-400 uppercase">Aucun jeton actif</h4>
                      <p className="text-[10.5px] text-slate-400 max-w-xs font-semibold mt-1">Configurez les scopes à gauche puis cliquez sur Générer pour obtenir votre jeton d&apos;authentification de test.</p>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* SECTION 2: HL7 / FHIR CONVERTER (I2) */}
          {activeSegment === 'fhir' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Patient JSON input */}
              <div className="bg-white border border-slate-150 p-6 rounded-[2.5rem] shadow-sm space-y-4 font-sans">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-xs font-black text-slate-900 uppercase">Input Payload d&apos;Assuré JSON</span>
                  <Code className="w-4 h-4 text-indigo-600 animate-pulse" />
                </div>

                <div className="space-y-3">
                  <textarea 
                    rows={8}
                    className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-[11px] text-indigo-900 outline-none focus:ring-2 focus:ring-indigo-150"
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                  />

                  <button 
                    type="button"
                    onClick={handleHl7Conversion}
                    disabled={isConverting}
                    className="w-full py-4 bg-slate-950 hover:bg-slate-850 text-white font-black text-[10px] uppercase tracking-widest rounded-xl flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isConverting ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Normalisation FHIR / HL7 RDC...
                      </>
                    ) : (
                      <>
                        <ArrowRight className="w-4 h-4 text-emerald-400" /> Convertir en Message HL7
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* HL7 standard layout result */}
              <div className="bg-slate-900 border border-slate-800 text-white p-6 rounded-[2.5rem] shadow-sm flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                    <span className="text-xs font-black text-white uppercase tracking-widest font-mono">Output Message HL7 v2.5 standardisé</span>
                    <Cpu className="w-4 h-4 text-indigo-400" />
                  </div>

                  {hl7Output ? (
                    <pre className="p-4 bg-slate-950 text-emerald-400 rounded-2xl font-mono text-[10px] leading-relaxed overflow-x-auto whitespace-pre">
                      {hl7Output}
                    </pre>
                  ) : (
                    <div className="text-center py-12 italic text-slate-500 font-mono text-[11px]">
                      // En attente de conversion...
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-800/60 border border-slate-755 rounded-xl text-[10.5px] leading-relaxed text-slate-300 italic font-mono mt-4">
                  * Note: Le connecteur convertit les balises JSON d&apos;Adonaï en segments standards MSH, EVN, PID et FT1 requis pour l&apos;interfaçage d&apos;urgence SNIS d&apos;Afrique Centrale.
                </div>
              </div>

            </div>
          )}

          {/* SECTION 3: WEBHOOK RESEND RETRY ENGINES (I3) */}
          {activeSegment === 'webhook' && (
            <div className="space-y-6">
              
              {resendResultMsg && (
                <div className="p-3.5 bg-indigo-600 text-white text-center font-black text-xs uppercase rounded-xl animate-pulse">
                  {resendResultMsg}
                </div>
              )}

              <div className="bg-white border border-slate-150 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-5 bg-slate-50 border-b flex justify-between items-center">
                  <span className="text-xs font-black text-slate-1000 uppercase">I3. Suivi des transmissions Webhooks d&apos;événements</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left font-sans text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-[9.5px] font-black uppercase text-slate-400 bg-slate-50/50">
                        <th className="p-4">Identifiant / Événement</th>
                        <th className="p-4">URL Cible Mandataire</th>
                        <th className="p-4">Dernière Tentative</th>
                        <th className="p-4">Statut Traspase</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {webhooks.map((w) => (
                        <tr key={w.id} className="hover:bg-slate-50/50">
                          <td className="p-4">
                            <span className="font-mono text-slate-400 block font-bold text-[9.5px]">{w.id}</span>
                            <span className="font-black text-slate-800 uppercase block mt-0.5 text-[11px]">{w.event}</span>
                          </td>
                          <td className="p-4 font-mono text-[10.5px] text-indigo-705 text-indigo-700">{w.targetUrl}</td>
                          <td className="p-4 text-slate-400 font-semibold">{w.lastAttempt}</td>
                          <td className="p-4">
                            <span className={cn(
                              "px-2 py-0.5 rounded text-[8.5px] font-black uppercase tracking-wider",
                              w.status === '200 OK' ? "bg-emerald-50 text-emerald-700 font-mono" : "bg-rose-50 text-rose-700 font-mono"
                            )}>
                              {w.status}
                            </span>
                            <span className="text-[9px] font-bold text-slate-400 block mt-1 font-mono">Essais: {w.attempts}</span>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => handleResendWebhook(w)}
                              disabled={isResending && resendTarget === w.id}
                              className="px-4 py-2 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 float-right"
                            >
                              {isResending && resendTarget === w.id ? (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Traitement...
                                </>
                              ) : (
                                <>
                                  <RefreshCw className="w-3.5 h-3.5" /> Renvoyer Webhook
                                </>
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
