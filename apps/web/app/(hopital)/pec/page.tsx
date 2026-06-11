/**
 * 🛰️ Fichier : /apps/web/app/(hopital)/pec/page.tsx
 * 🎯 Objectif : Page de gestion et validation de Prises En Charge (PEC) Hospitalières
 * CONFORMITÉ : ARCA-RDC Multi-Tenant, Zero-Leak, RBAC avec Guardrail <Guard>
 */

import React, { useState, useEffect } from "react";
import { 
  FileCheck, 
  Search, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  PlusCircle, 
  Clock, 
  Activity, 
  Lock, 
  Unlock 
} from "lucide-react";
import { Guard } from "../../../components/Guard";
import { PERMISSIONS } from "../../../lib/permissions";

interface PECRecord {
  id: string;
  patientName: string;
  establishment: string;
  treatmentType: string;
  amount: number;
  status: "DEMANDE" | "VALIDE" | "REFUSE";
  createdAt: string;
}

export default function PECListingPage() {
  const [pecs, setPecs] = useState<PECRecord[]>([
    {
      id: "PEC-001",
      patientName: "Jean PATIENT MUKENDI",
      establishment: "Clinique Ngaliema (Kinshasa)",
      treatmentType: "Opération chirurgicale - Appendicite aiguë",
      amount: 450,
      status: "DEMANDE",
      createdAt: "2026-06-10 14:32",
    },
    {
      id: "PEC-002",
      patientName: "Marie-Louise KABANGE",
      establishment: "Hôpital de Biamba Marie Mutola",
      treatmentType: "Accouchement gynécologique avec césarienne d'urgence",
      amount: 1200,
      status: "VALIDE",
      createdAt: "2026-06-09 10:15",
    },
    {
      id: "PEC-003",
      patientName: "Aimé KASENDE LUTETE",
      establishment: "Centre Médical de Kinshasa (CMK)",
      treatmentType: "Traitement antipaludique sévère & perfusion",
      amount: 210,
      status: "REFUSE",
      createdAt: "2026-06-08 17:40",
    },
    {
      id: "PEC-004",
      patientName: "Sarah KANGA BULA",
      establishment: "Clinique Ngaliema (Kinshasa)",
      treatmentType: "Examen cardiologique complet par IRM",
      amount: 380,
      status: "DEMANDE",
      createdAt: "2026-06-11 08:05",
    }
  ]);

  const [search, setSearch] = useState("");
  const [auditLogs, setAuditLogs] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("assur_audit_logs");
    if (saved) {
      setAuditLogs(JSON.parse(saved));
    }
  }, []);

  const handleApprove = (id: string, patientName: string) => {
    // Mettre à jour le statut en VALIDE
    setPecs(prev => prev.map(p => p.id === id ? { ...p, status: "VALIDE" } : p));
    
    // Consigner l'action sensible dans les journaux d'audit
    const timestamp = new Date().toISOString();
    const newLog = {
      id: `SBOX-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp,
      userId: "user-current",
      userName: "Dr. Sarah LOKO / Finance Manager",
      userRole: "MEDECIN",
      action: "SINISTRE_APPROVE",
      details: `Approbation formelle de la demande de Prise En Charge (PEC) ID "${id}" pour l'assuré ${patientName}. Montant engagé: $${pecs.find(p => p.id === id)?.amount}. Sceau d'approbation ARCA active.`,
      ipAddress: "192.168.1.12",
      status: "INFO"
    };

    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem("assur_audit_logs", JSON.stringify(updatedLogs));
  };

  const handleReject = (id: string, patientName: string) => {
    setPecs(prev => prev.map(p => p.id === id ? { ...p, status: "REFUSE" } : p));
    
    const timestamp = new Date().toISOString();
    const newLog = {
      id: `SBOX-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp,
      userId: "user-current",
      userName: "Dr. Sarah LOKO / Finance Manager",
      userRole: "MEDECIN",
      action: "SINISTRE_REJECT",
      details: `Rejet formel de la PEC ID "${id}" pour l'assuré ${patientName} en violation de plafonds ou défaut de consentement actif.`,
      ipAddress: "192.168.1.12",
      status: "WARNING"
    };

    const updatedLogs = [newLog, ...auditLogs];
    setAuditLogs(updatedLogs);
    localStorage.setItem("assur_audit_logs", JSON.stringify(updatedLogs));
  };

  const filteredPecs = pecs.filter(p => 
    p.patientName.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase()) ||
    p.treatmentType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-white/10 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase text-teal-400 tracking-widest block font-mono">Module National Cliniques & Assurances</span>
          <h1 className="text-2xl font-black uppercase mt-1">Validation Prises en Charge (PEC)</h1>
          <p className="text-xs text-slate-300 max-w-xl mt-1 leading-relaxed">
            Consultez les requêtes de garanties de tiers-payant de santé émises en direct par les prestataires de soins. Les approbations de sinistres supérieures à un seuil réglementaire sont scellées et historisées.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-xs font-mono select-none">
          <Activity className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Tenant Context: Sunu-Assur-CD</span>
        </div>
      </div>

      {/* Barre de recherche */}
      <div className="relative">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
          <Search className="w-4 h-4 text-slate-400" />
        </span>
        <input 
          type="text" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une PEC par identifiant, assuré ou clinique..." 
          className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl pl-10 pr-4 py-3 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all font-mono shadow-sm"
        />
      </div>

      {/* Liste des PEC */}
      <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200/60">
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 font-mono">ID PEC</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Affilié / Assuré</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400">Établissement & Prestation</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 font-mono text-right">Montant</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 text-center">Statut</th>
                <th className="p-4 text-[10px] font-black uppercase text-slate-400 text-right">Action Décisionnelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPecs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-xs text-slate-450 font-medium font-mono">
                    Aucune demande de tiers-payant ne correspond à cette recherche.
                  </td>
                </tr>
              ) : (
                filteredPecs.map((pec) => (
                  <tr key={pec.id} className="hover:bg-slate-50/50 transition-all">
                    <td className="p-4 font-bold text-slate-700 font-mono text-xs">{pec.id}</td>
                    <td className="p-4">
                      <div className="font-extrabold text-slate-900 text-xs">{pec.patientName}</div>
                      <span className="text-[10px] text-slate-400 font-bold block mt-0.5">Enregistré à {pec.createdAt}</span>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-xs">{pec.establishment}</div>
                      <span className="text-[10px] text-slate-500 font-medium block mt-0.5">{pec.treatmentType}</span>
                    </td>
                    <td className="p-4 font-black text-slate-900 font-mono text-xs text-right">${pec.amount}</td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-black uppercase font-mono border ${
                        pec.status === "VALIDE" 
                          ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                          : pec.status === "REFUSE" 
                          ? "bg-rose-50 border-rose-100 text-rose-700" 
                          : "bg-amber-50 border-amber-100 text-amber-700 animate-pulse"
                      }`}>
                        {pec.status === "VALIDE" && <CheckCircle2 className="w-3 h-3 text-emerald-700 shrink-0" />}
                        {pec.status === "REFUSE" && <XCircle className="w-3 h-3 text-rose-700 shrink-0" />}
                        {pec.status === "DEMANDE" && <Clock className="w-3 h-3 text-amber-700 shrink-0" />}
                        {pec.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {pec.status === "DEMANDE" ? (
                        <div className="inline-flex gap-2 justify-end items-center">
                          {/* Wrap standard Approve action within <Guard> to prevent privilege escalation */}
                          <Guard 
                            permission={PERMISSIONS.PEC_APPROVE} 
                            showLockedState={true}
                          >
                            <button
                              onClick={() => handleApprove(pec.id, pec.patientName)}
                              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                              id={`approve-pec-${pec.id}`}
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => handleReject(pec.id, pec.patientName)}
                              className="px-3.5 py-1.5 bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-[10px] font-black uppercase tracking-wider rounded-lg transition-colors cursor-pointer"
                              id={`reject-pec-${pec.id}`}
                            >
                              Rejeter
                            </button>
                          </Guard>
                        </div>
                      ) : (
                        <span className="text-[10px] font-black uppercase text-slate-400 font-mono block">Scellé le {pec.createdAt}</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
