'use client';

/**
 * 🛰️ Fichier : /apps/web/app/(rh)/contrats/page.tsx
 * 🎯 Objectif : Interface RH d'Adhésion de Groupe et Création de Contrat
 * CONFORMITÉ : ARCA-RDC Multi-Tenant, Zero-Leak, Guardrail de permissions <Guard>
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Users, 
  Upload, 
  PenTool, 
  CheckCircle, 
  Building, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  FileCheck, 
  AlertTriangle 
} from 'lucide-react';
import { Guard } from '../../../components/Guard';
import { PERMISSIONS } from '../../../lib/permissions';

interface EmployeeRecord {
  nom: string;
  prenoms: string;
  date_naissance: string;
  emploi: string;
}

export default function ContractsRHPage() {
  const [step, setStep] = useState(1);
  const [companyInfo, setCompanyInfo] = useState({
    name: 'ACME Corp RDC',
    rccm: 'CD/KIN/RCCM/26-B-0412',
    address: '12 Boulevard du 30 Juin, Gombe, Kinshasa',
    contactName: 'Marie KAPEND',
    email: 'm.kapend@acmecorp.cd',
    phone: '+243 812 345 678',
  });

  const [employees, setEmployees] = useState<EmployeeRecord[]>([
    { nom: 'MUKENDI', prenoms: 'Jean PATIENT', date_naissance: '1988-04-12', emploi: 'Directeur Technique' },
    { nom: 'KABANGE', prenoms: 'Marie-Louise', date_naissance: '1992-09-24', emploi: 'Développeur Senior' },
  ]);

  const [newEmp, setNewEmp] = useState<EmployeeRecord>({
    nom: '',
    prenoms: '',
    date_naissance: '',
    emploi: '',
  });

  const [csvContent, setCsvContent] = useState('');
  const [isDocusignSigned, setIsDocusignSigned] = useState(false);
  const [contractId, setContractId] = useState('');
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const savedLogs = localStorage.getItem('assur_audit_logs');
    if (savedLogs) {
      setLogs(JSON.parse(savedLogs));
    }
  }, []);

  const triggerAuditLog = (action: string, details: string, status: string = 'INFO') => {
    const timestamp = new Date().toISOString();
    const newLog = {
      id: `SBOX-RH-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp,
      userId: 'user-marie-rh',
      userName: 'Marie KAPEND',
      userRole: 'RH_ENTREPRISE',
      action,
      details,
      ipAddress: '192.168.1.45',
      status,
    };
    const updated = [newLog, ...logs];
    setLogs(updated);
    localStorage.setItem('assur_audit_logs', JSON.stringify(updated));
  };

  const handleAddEmployee = () => {
    if (!newEmp.nom || !newEmp.prenoms || !newEmp.date_naissance || !newEmp.emploi) {
      alert('Veuillez remplir tous les champs de l\'employé.');
      return;
    }
    setEmployees([...employees, newEmp]);
    setNewEmp({ nom: '', prenoms: '', date_naissance: '', emploi: '' });
  };

  const handleCSVParse = () => {
    if (!csvContent.trim()) {
      alert('Veuillez coller du contenu CSV ou texte.');
      return;
    }

    try {
      // Parse CSV simple : nom,prenoms,date_naissance,emploi
      const lines = csvContent.split('\n');
      const parsed: EmployeeRecord[] = [];
      lines.forEach((line) => {
        const parts = line.split(',');
        if (parts.length >= 4 && parts[0].trim() && parts[1].trim()) {
          parsed.push({
            nom: parts[0].trim().toUpperCase(),
            prenoms: parts[1].trim(),
            date_naissance: parts[2].trim(),
            emploi: parts[3].trim(),
          });
        }
      });

      if (parsed.length === 0) {
        alert('Format CSV invalide ou vide. Utilisez le format: NOM,PRENOMS,YYYY-MM-DD,POSTE');
        return;
      }

      setEmployees([...employees, ...parsed]);
      setCsvContent('');
      triggerAuditLog(
        'CONTRACT_EMPLOYEES_IMPORT_EXCEL',
        `Importation réussie de ${parsed.length} employés depuis le gabarit standard d'adhésion d'entreprise.`
      );
    } catch (err) {
      alert('Erreur lors du traitement du fichier.');
    }
  };

  const handleRemoveEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  const createBulletinsDraft = () => {
    // Simuler la création de N bulletins d'adhésion au statut BROUILLON dans la base de données
    const savedBulletins = localStorage.getItem('assur_bulletins_adhesion') 
      ? JSON.parse(localStorage.getItem('assur_bulletins_adhesion')!) 
      : [];
    
    const newBulletins = employees.map(emp => ({
      id: `BULLETIN-${Math.floor(100000 + Math.random() * 900000)}`,
      tenant_id: 'tenant-acme',
      nom: emp.nom,
      prenom: emp.prenoms,
      date_naissance: emp.date_naissance,
      emploi: emp.emploi,
      status: 'BROUILLON',
      created_at: new Date().toISOString(),
      token: `token-${emp.nom.toLowerCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
    }));

    localStorage.setItem('assur_bulletins_adhesion', JSON.stringify([...savedBulletins, ...newBulletins]));
    
    // Enregistrement dans les logs d'un événement de conformité
    triggerAuditLog(
      'BULLETINS_ADHESION_DRAFT_CREATED',
      `Génération sécurisée de ${newBulletins.length} bulletins d'adhésion au statut 'BROUILLON' pour ACME Corp. Des invitations d'onboarding individuelles ont été planifiées.`
    );
  };

  const handleDocuSignSignature = () => {
    setIsDocusignSigned(true);
    const genId = `CNTR-GR-${Math.floor(1000 + Math.random() * 9000)}`;
    setContractId(genId);

    // Mettre à jour l'état du contrat groupe dans le localStorage pour simulation d'affaires courantes
    const savedContracts = localStorage.getItem('assur_contrats_groupe')
      ? JSON.parse(localStorage.getItem('assur_contrats_groupe')!)
      : [];

    const newContract = {
      id: genId,
      company: companyInfo.name,
      rccm: companyInfo.rccm,
      employeesCount: employees.length,
      statut: 'ACTIF',
      signedAt: new Date().toISOString(),
      signedBy: companyInfo.contactName,
      docusignEnvelope: 'env-99f2e34-a12b-449e-b7d6-33ab8711ef8d'
    };

    localStorage.setItem('assur_contrats_groupe', JSON.stringify([...savedContracts, newContract]));
    
    // Générer les bulletins d'adhésion individuels d'onboarding
    createBulletinsDraft();

    triggerAuditLog(
      'CONTRACT_GROUPE_DOCUSIGN_SIGNED',
      `Signature électronique du contrat-cadre d'assurance santé ACME Corp via DocuSign (Enveloppe: env-99f2e34-a12b-449e-b7d6-33ab8711ef8d). Le contrat de groupe ID ${genId} est desormais actif.`
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-white/10 text-white p-6 rounded-2xl shadow-xl">
        <div>
          <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest block font-mono">Module Gestion RH Client</span>
          <h1 className="text-2xl font-black uppercase mt-1">Création de Contrat Collectif & Onboarding</h1>
          <p className="text-xs text-slate-300 max-w-2xl mt-1 leading-relaxed">
            Configurez un contrat de santé entreprise d&apos;assurance collective et intégrez vos salariés via le gabarit de bulletin individuel d&apos;adhésion numérique exigé par la ARCA-RDC.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-xl text-xs font-mono select-none">
          <Building className="w-4 h-4 text-amber-500" />
          <span>ACME Corp (Tenant)</span>
        </div>
      </div>

      {/* RLS Guardrail Check */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between border-b pb-4 mb-6">
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">Souscription d&apos;Affiliated Group Contracts</h2>
          <Guard permission={PERMISSIONS.CONTRAT_GROUPE_CREATE}>
            <span className="px-3 py-1 bg-emerald-550/10 border border-emerald-550/20 text-emerald-700 text-[10px] font-black uppercase rounded-lg font-mono">
              ✓ Autorisation Création Active
            </span>
          </Guard>
        </div>

        {/* Stepper progress indicator */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { n: 1, label: 'Contractant', icon: Building },
            { n: 2, label: 'Salariés', icon: Users },
            { n: 3, label: 'Aperçu & Bulletins', icon: FileText },
            { n: 4, label: 'DocuSign', icon: PenTool },
          ].map((s) => (
            <div 
              key={s.n} 
              className={`flex flex-col md:flex-row items-center gap-3 p-3 rounded-xl border transition-all ${
                step === s.n 
                  ? 'bg-slate-900 border-slate-900 text-white shadow-md' 
                  : 'bg-slate-50 border-slate-200 text-slate-500'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                step === s.n ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-700'
              }`}>
                {s.n}
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black uppercase tracking-wider leading-none">{s.label}</p>
                <span className="text-[9px] font-medium hidden md:inline opacity-80">Étape {s.n}/4</span>
              </div>
            </div>
          ))}
        </div>

        {/* STEP 1: COMPAGNIE */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">1. Renseignements Généraux de l&apos;Établissement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Raison Sociale</label>
                <input 
                  type="text" 
                  value={companyInfo.name} 
                  onChange={e => setCompanyInfo({...companyInfo, name: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Numéro d&apos;Enregistrement RCCM CD</label>
                <input 
                  type="text" 
                  value={companyInfo.rccm} 
                  onChange={e => setCompanyInfo({...companyInfo, rccm: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Adresse Physico-Administrative</label>
                <input 
                  type="text" 
                  value={companyInfo.address} 
                  onChange={e => setCompanyInfo({...companyInfo, address: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom du Responsable RH</label>
                <input 
                  type="text" 
                  value={companyInfo.contactName} 
                  onChange={e => setCompanyInfo({...companyInfo, contactName: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Adresse Électronique Professionnelle</label>
                <input 
                  type="email" 
                  value={companyInfo.email} 
                  onChange={e => setCompanyInfo({...companyInfo, email: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              {/* Ensure standard action restricted via Guard */}
              <Guard permission={PERMISSIONS.CONTRAT_GROUPE_CREATE} fallback={
                <div className="text-xs text-rose-650 font-bold bg-rose-50 border border-rose-100 p-3 rounded-xl flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Vous ne disposez pas de l&apos;autorisation requise (contrat_groupe.create) pour engager cette étape.</span>
                </div>
              }>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Suivant <ArrowRight className="w-4 h-4" />
                </button>
              </Guard>
            </div>
          </div>
        )}

        {/* STEP 2: EMPLOYES / IMPORT EXCEL */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">2. Liste des Salariés à Assujettir</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                La ARCA-RDC impose que chaque salarié ait un dossier individuel. Importez la feuille excel ou renseignez-les manuellement.
              </p>
            </div>

            {/* Simulation d'Import Excel */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 block">✦ Interface d&apos;Importation CSV/Gabarit</span>
                <p className="text-[10.5px] text-slate-500 leading-normal font-semibold">
                  Collez vos colonnes d&apos;employés au format standardisé suivant : <span className="font-bold underline block mt-1">NOM, Prénoms, Date de Naissance (YYYY-MM-DD), Emploi</span>
                </p>
                <textarea
                  rows={4}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder="KASONGO,Martin,1985-11-22,Directeur Commercial&#10;LUMUMBA,Patrice,1990-07-02,Responsable des Opérations"
                  className="w-full bg-white border border-slate-200.80 rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <button
                  type="button"
                  onClick={handleCSVParse}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  <Upload className="w-4 h-4" /> Traiter le Gabarit
                </button>
              </div>

              {/* Formulaire manuel */}
              <div className="lg:col-span-2 bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-4">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">✚ Saisie Manuelle d&apos;Employé</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-0.5">Nom d&apos;usage</label>
                    <input 
                      type="text" 
                      value={newEmp.nom}
                      onChange={e => setNewEmp({...newEmp, nom: e.target.value})}
                      placeholder="MUKENDI"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-0.5">Prénoms</label>
                    <input 
                      type="text" 
                      value={newEmp.prenoms}
                      onChange={e => setNewEmp({...newEmp, prenoms: e.target.value})}
                      placeholder="Jean Patient"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-0.5">Date de naissance</label>
                    <input 
                      type="date" 
                      value={newEmp.date_naissance}
                      onChange={e => setNewEmp({...newEmp, date_naissance: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9.5px] font-bold text-slate-400 uppercase mb-0.5">Poste / Emploi d&apos;exercice</label>
                    <input 
                      type="text" 
                      value={newEmp.emploi}
                      onChange={e => setNewEmp({...newEmp, emploi: e.target.value})}
                      placeholder="Technicien Supérieur"
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddEmployee}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-slate-950 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Ajouter à l&apos;effectif
                  </button>
                </div>
              </div>
            </div>

            {/* List */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden mt-4">
              <div className="p-3 bg-slate-100 border-b border-rose-100 flex items-center justify-between text-slate-800 font-black uppercase text-[10px]">
                <span>Effectif Importé ({employees.length} affiliés)</span>
              </div>
              <div className="max-h-56 overflow-y-auto divide-y divide-slate-100">
                {employees.map((emp, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 transition-all">
                    <div>
                      <span className="font-extrabold text-slate-900">{emp.nom} {emp.prenoms}</span>
                      <p className="text-[10px] text-slate-400 font-semibold block mt-0.5">Poste : {emp.emploi} | Né le {emp.date_naissance}</p>
                    </div>
                    <button 
                      onClick={() => handleRemoveEmployee(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Précédent
              </button>
              <button
                type="button"
                disabled={employees.length === 0}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 disabled:opacity-50 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Suivant <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PREVIEW AND BULLETIN CREATION */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">3. Synoptique des Bulletins Individuels d&apos;Adhésion (BIA)</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                En poursuivant, le système générera automatiquement des fiches BIA réglementaires numériques pré-remplies au statut <span className="font-bold text-amber-600">BROUILLON</span> pour chaque salarié d&apos;ACME Corp. Les salariés recevront un jeton d&apos;onboarding sécurisé pour finaliser leurs questionnaires médicaux.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-4 text-[11px] leading-relaxed font-bold flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="font-extrabold uppercase block text-[9px] tracking-widest text-amber-700">⚠️ Avertissement Sécurité ARCA - Article 15</span>
                <p>La validation administrative de ces bulletins implique la signature d&apos;un engagement de tiers-payant de l&apos;entreprise contractante.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Entreprise Souscriptrice</span>
                <p className="text-lg font-black text-slate-900">{companyInfo.name}</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Employés Invités</span>
                <p className="text-lg font-black text-slate-900">{employees.length} Salariés</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Génération Fiches</span>
                <p className="text-lg font-black text-emerald-700">BIA Brouillons Autorisés</p>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-300 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Précédent
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
              >
                Étape Signature DocuSign <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: DOCUSIGN INTEGRATION & ACTIVER */}
        {step === 4 && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">4. Finalisation &amp; Signature Électronique Réglementaire</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed mt-1">
                Le contrat de groupe doit être validé via l&apos;enveloppe sécurisée DocuSign connectée à la plateforme NeoGTec.
              </p>
            </div>

            {isDocusignSigned ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black uppercase tracking-wider text-emerald-900">CONTRAT DE GROUPE ACTIF VIA INTEGRATED DOCUSIGN</h4>
                  <p className="text-xs text-emerald-700 max-w-md mx-auto font-bold leading-normal">
                    Id de Transaction : {contractId} | Statut : ACTIF. Les bulletins individuels d&apos;onboarding (BIA) sont maintenant accessibles pour les employés d&apos;ACME Corp.
                  </p>
                </div>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setIsDocusignSigned(false);
                      setEmployees([]);
                    }}
                    className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-colors cursor-pointer"
                  >
                    Nouveau contrat de groupe
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-6 text-center space-y-4 max-w-xl mx-auto">
                <PenTool className="w-12 h-12 text-indigo-650 mx-auto animate-bounce" />
                <div className="space-y-1.5">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-800">Prêt pour Signature Électronique Certifiée</h4>
                  <p className="text-[11px] text-slate-500 max-w-sm mx-auto font-bold leading-normal">
                    En cliquant, vous ouvrez le cadre d&apos;habilitation DocuSign de NeoGTec pour valider la prise en charge santé entreprise contractante.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDocuSignSignature}
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:scale-102 cursor-pointer flex items-center justify-center gap-2 mx-auto"
                >
                  <PenTool className="w-4 h-4" /> Signer avec DocuSign &amp; Générer les Invitations BIA
                </button>
              </div>
            )}

            <div className="pt-6 flex justify-between">
              <button
                type="button"
                disabled={isDocusignSigned}
                onClick={() => setStep(3)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 border border-slate-300 disabled:opacity-50 text-slate-700 font-black text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Précédent
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
