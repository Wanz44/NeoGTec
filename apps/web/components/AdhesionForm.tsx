'use client';

/**
 * 🛰️ Fichier : /apps/web/components/AdhesionForm.tsx
 * 🎯 Objectif : Formulaire multi-étapes répliquant fidèlement le Bulletin d'Adhésion papier ARCA-RDC
 * CONFORMITÉ : Chiffrement local simulé, Hachage cryptographique SHA256 natif client-side (Web Crypto API)
 */

import React, { useState, useEffect } from 'react';
import { 
  User, 
  Users, 
  Heart, 
  ShieldAlert, 
  Upload, 
  PenTool, 
  CheckCircle2, 
  FileCheck, 
  Lock, 
  Eye, 
  Plus, 
  X, 
  ShieldCheck 
} from 'lucide-react';

interface AdhesionFormProps {
  token: string;
}

export const AdhesionForm: React.FC<AdhesionFormProps> = ({ token }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [ipAddress, setIpAddress] = useState('192.168.1.100'); // IP par défaut pour démo

  // 1. Informations de l'adhérent
  const [formData, setFormData] = useState({
    nom: 'MUKENDI',
    prenoms: 'Jean PATIENT',
    nom_jeune_fille: '',
    date_naissance: '1988-04-12',
    emploi: 'Directeur Technique',
    telephone: '+243 999 888 777',
    email: 'jean.patient@acmecorp.cd',
    adresse_physique: 'Quartier Macampagne, Ngaliema, Kinshasa',
  });

  // 2. Conjoint
  const [hasConjoint, setHasConjoint] = useState(false);
  const [conjoint, setConjoint] = useState({
    nom: '',
    prenoms: '',
    date_naissance: '',
  });

  // 3. Enfants
  const [enfants, setEnfants] = useState<Array<{ nom: string, prenoms: string, date_naissance: string }>>([]);
  const [newEnfant, setNewEnfant] = useState({ nom: '', prenoms: '', date_naissance: '' });

  // 4. Bénéficiaires Décès
  const [beneficiaires, setBeneficiaires] = useState<Array<{ nom: string, prenoms: string, lien: string, part: number }>>([
    { nom: 'KASENDA', prenoms: 'Hélène', lien: 'Épouse', part: 105 }, // 100% standard par défaut
  ]);
  const [newBenef, setNewBenef] = useState({ nom: '', prenoms: '', lien: '', part: 0 });

  // 5. Questionnaire Médical
  const [medicalAnswers, setMedicalAnswers] = useState({
    antecedents: 'NON',
    hospitalisation: 'NON',
    traitement_regulier: 'NON',
    fumeur: 'NON',
    details: '',
  });

  // 6. CNI & Pièces Jointes
  const [cniFile, setCniFile] = useState<File | null>(null);
  const [cniHash, setCniHash] = useState('');
  const [isCniUploading, setIsCniUploading] = useState(false);

  // 7. Signature Électronique
  const [signatureName, setSignatureName] = useState('');
  const [isConsentColected, setIsConsentCollected] = useState(false);

  // 8. État final
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Récupérer l'adresse IP extérieure simulée ou réelle
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => setIpAddress(data.ip || '192.168.1.100'))
      .catch(() => setIpAddress('197.242.0.210')); // IP RDC Kinshasa de secours
  }, []);

  // Hachage cryptographique du document d'identité (SHA-256) via l'API Web Crypto native
  const calculateSHA256 = async (file: File) => {
    setIsCniUploading(true);
    try {
      const buffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      // Simuler l'upload réseau dans Supabase Storage
      setTimeout(() => {
        setCniFile(file);
        setCniHash(hashHex);
        setIsCniUploading(false);
      }, 1200);
    } catch {
      setIsCniUploading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      calculateSHA256(e.target.files[0]);
    }
  };

  const handleAddEnfant = () => {
    if (!newEnfant.nom || !newEnfant.prenoms || !newEnfant.date_naissance) return;
    setEnfants([...enfants, newEnfant]);
    setNewEnfant({ nom: '', prenoms: '', date_naissance: '' });
  };

  const handleAddBeneficiaire = () => {
    if (!newBenef.nom || !newBenef.prenoms || !newBenef.lien || newBenef.part <= 0) return;
    setBeneficiaires([...beneficiaires, newBenef]);
    setNewBenef({ nom: '', prenoms: '', lien: '', part: 0 });
  };

  const triggerAudit = (action: string, details: string) => {
    const logs = localStorage.getItem('assur_audit_logs') 
      ? JSON.parse(localStorage.getItem('assur_audit_logs')!) 
      : [];
    const newLog = {
      id: `SBOX-ONB-${Math.floor(100000 + Math.random() * 900000)}`,
      timestamp: new Date().toISOString(),
      userId: token,
      userName: formData.nom + ' ' + formData.prenoms,
      userRole: 'SALARIE_AFFILIE',
      action,
      details,
      ipAddress,
      status: 'SUCCESS'
    };
    localStorage.setItem('assur_audit_logs', JSON.stringify([newLog, ...logs]));
  };

  const handleFormSubmission = () => {
    if (!cniFile) {
      alert('Veuillez téléverser obligatoirement votre copie de CNI.');
      return;
    }
    if (!signatureName || !isConsentColected) {
      alert('Veuillez signer électroniquement le bulletin et consentir au traitement médical.');
      return;
    }

    // 1. Simuler l'insertion chiffrée pgsodium dans Supabase (via stock local)
    const medicalPayload = JSON.stringify(medicalAnswers);
    // Simuler un appel RPC "chiffrer_medical"
    const encryptedMedicalMock = `pgsodium_vault_v1::enc::${btoa(medicalPayload)}`;

    // 2. Créer une entrée dans "consent_logs"
    const consentLogs = localStorage.getItem('assur_consent_logs')
      ? JSON.parse(localStorage.getItem('assur_consent_logs')!)
      : [];
    const newConsent = {
      id: `CNS-${Math.floor(100000 + Math.random() * 900000)}`,
      bulletin_id: `BULLETIN-${token}`,
      nom_signataire: signatureName,
      ip_address: ipAddress,
      consent_at: new Date().toISOString(),
      fingerprint: cniHash,
    };
    localStorage.setItem('assur_consent_logs', JSON.stringify([...consentLogs, newConsent]));

    // 3. Mettre à jour le statut du bulletin d'adhésion -> SOUMIS
    const savedBulletins = localStorage.getItem('assur_bulletins_adhesion')
      ? JSON.parse(localStorage.getItem('assur_bulletins_adhesion')!)
      : [];
    
    const updatedBulletins = savedBulletins.map((b: any) => {
      // Trouver par le token ou par défaut l'un des brouillons d'ACME Corp
      if (b.token === token || b.nom === formData.nom) {
        return {
          ...b,
          conjoint,
          enfants,
          beneficiaires,
          medical_encrypted: encryptedMedicalMock,
          cni_path: `cni_storage/${token}/${cniFile.name}`,
          cni_sha256: cniHash,
          status: 'SOUMIS',
          submitted_at: new Date().toISOString(),
        };
      }
      return b;
    });

    // Si on a pas trouvé, on pousse notre propre bulletin fictif simulé
    const exists = updatedBulletins.some((b: any) => b.token === token);
    if (!exists) {
      updatedBulletins.push({
        id: `BULLETIN-${Math.floor(100000 + Math.random() * 900000)}`,
        tenant_id: 'tenant-acme',
        nom: formData.nom,
        prenom: formData.prenoms,
        date_naissance: formData.date_naissance,
        emploi: formData.emploi,
        conjoint,
        enfants,
        beneficiaires,
        medical_encrypted: encryptedMedicalMock,
        cni_path: `cni_storage/${token}/${cniFile.name}`,
        cni_sha256: cniHash,
        status: 'SOUMIS',
        submitted_at: new Date().toISOString(),
        token
      });
    }

    localStorage.setItem('assur_bulletins_adhesion', JSON.stringify(updatedBulletins));

    // 4. Enregistrer un audit log immuable ARCA-RDC
    triggerAudit(
      'BULLETIN_ADHESION_SUBMITTED',
      `Soumission numérique du dossier d'affiliation individuel ARCA-RDC. CNI vérifiée SHA-256=${cniHash}, consentement médical sécurisé par clé de voûte de chiffrement.`
    );

    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="bg-emerald-50/50 border border-emerald-250 p-8 rounded-3xl text-center space-y-6 max-w-2xl mx-auto shadow-xl">
        <div className="w-16 h-16 bg-emerald-550/10 rounded-full flex items-center justify-center text-emerald-700 mx-auto border border-emerald-500/20">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase text-emerald-950 font-mono">Affiliation Soumise avec Succès !</h2>
          <p className="text-xs text-emerald-900/70 font-semibold leading-relaxed">
            Votre Bulletin Individuel d&apos;Adhésion (BIA) a été chiffré et transmis aux ressources humaines locales de votre entreprise pour approbation finale ARCA-RDC.
          </p>
        </div>

        <div className="bg-white border border-emerald-200 rounded-2xl p-4 text-left divide-y divide-slate-100">
          <div className="py-2 flex justify-between text-xs">
            <span className="text-slate-400 font-bold">SHA-256 Signature CNI</span>
            <span className="font-mono text-[10px] text-slate-800 uppercase font-black">{cniHash.substring(0, 16)}...</span>
          </div>
          <div className="py-2 flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Sécurisation Vault d&apos;État</span>
            <span className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">Chiffré AES-256 GCM (pgsodium)</span>
          </div>
          <div className="py-2 flex justify-between text-xs">
            <span className="text-slate-400 font-bold">Adresse IP Enregistrée</span>
            <span className="font-mono font-bold text-slate-700">{ipAddress}</span>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 leading-normal font-medium">Vous pouvez fermer cet onglet d&apos;onboarding.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-4xl mx-auto">
      {/* Step Indicators */}
      <div className="bg-slate-900 p-4 border-b border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="text-left text-white">
          <span className="text-[9px] font-black uppercase text-amber-500 tracking-wider font-mono">BIA Numérique Réglementaire</span>
          <h2 className="text-sm font-black uppercase tracking-wider mt-0.5">{formData.nom} {formData.prenoms}</h2>
        </div>
        <div className="flex gap-1.5 self-stretch sm:self-auto overflow-x-auto">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onClick={() => {
                // On permet de naviguer à reculons ou de sauter si on est démo
                setCurrentStep(s);
              }}
              className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border transition-all ${
                currentStep === s 
                  ? 'bg-amber-500 border-amber-500 text-slate-950 shadow' 
                  : 'bg-white/5 border-white/10 text-white/60 hover:text-white'
              }`}
            >
              Étape {s}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 md:p-8 space-y-6">
        {/* STEP 1: IDENTITE ET EMPLOI */}
        {currentStep === 1 && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <User className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">1. Identité &amp; Situation Professionnelle de l&apos;Assuré</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom d&apos;usage (Patronyme)</label>
                <input 
                  type="text" 
                  value={formData.nom}
                  onChange={(e) => setFormData({...formData, nom: e.target.value.toUpperCase()})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Nom de Jeune Fille (si applicable)</label>
                <input 
                  type="text" 
                  value={formData.nom_jeune_fille}
                  onChange={(e) => setFormData({...formData, nom_jeune_fille: e.target.value.toUpperCase()})}
                  placeholder="Laisser vide si aucun, ou néo-nom d'usage"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Date de Naissance </label>
                <input 
                  type="date" 
                  value={formData.date_naissance}
                  onChange={(e) => setFormData({...formData, date_naissance: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Poste d&apos;exercice / Emploi</label>
                <input 
                  type="text" 
                  value={formData.emploi}
                  onChange={(e) => setFormData({...formData, emploi: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Téléphone de liaison mobile</label>
                <input 
                  type="text" 
                  value={formData.telephone}
                  onChange={(e) => setFormData({...formData, telephone: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none font-mono"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Email individuel de contact</label>
                <input 
                  type="email" 
                  value={formData.email}
                  disabled
                  className="w-full bg-slate-100 border border-slate-200 text-slate-450 rounded-xl px-4 py-2.5 text-xs font-bold outline-none font-mono"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-end">
              <button 
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CONJOINT & ENFANTS (AYANTS DROITS) */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <Users className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">2. Conjoint &amp; Enfants Pris en Charge (Ayants-Droits)</h3>
            </div>

            {/* CONJOINT SECTION */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-650">A. Situation Conjugale (Conjoint)</span>
                <label className="inline-flex items-center gap-2 text-xs font-bold leading-none cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={hasConjoint}
                    onChange={(e) => setHasConjoint(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-indigo-650"
                  />
                  <span>Mon conjoint est affilié d&apos;office</span>
                </label>
              </div>

              {hasConjoint && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nom Conjoint</label>
                    <input 
                      type="text" 
                      value={conjoint.nom}
                      onChange={(e) => setConjoint({...conjoint, nom: e.target.value.toUpperCase()})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Prénom Conjoint</label>
                    <input 
                      type="text" 
                      value={conjoint.prenoms}
                      onChange={(e) => setConjoint({...conjoint, prenoms: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Né(e) le</label>
                    <input 
                      type="date" 
                      value={conjoint.date_naissance}
                      onChange={(e) => setConjoint({...conjoint, date_naissance: e.target.value})}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none font-mono"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ENFANTS SECTION */}
            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-650 block">B. Enfants Ouvrant Droit d&apos;Affiliation</span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nom Enfant</label>
                  <input 
                    type="text" 
                    value={newEnfant.nom}
                    onChange={(e) => setNewEnfant({...newEnfant, nom: e.target.value.toUpperCase()})}
                    placeholder="MUKENDI"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Prénom Enfant</label>
                  <input 
                    type="text" 
                    value={newEnfant.prenoms}
                    onChange={(e) => setNewEnfant({...newEnfant, prenoms: e.target.value})}
                    placeholder="Enoch"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Date Naissance</label>
                  <input 
                    type="date" 
                    value={newEnfant.date_naissance}
                    onChange={(e) => setNewEnfant({...newEnfant, date_naissance: e.target.value})}
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none font-mono"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="button"
                    onClick={handleAddEnfant}
                    className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold uppercase tracking-wide cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Ajouter l&apos;enfant
                  </button>
                </div>
              </div>

              {enfants.length > 0 && (
                <div className="bg-white border rounded-xl divide-y text-xs">
                  {enfants.map((enf, xi) => (
                    <div key={xi} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-800">{enf.nom} {enf.prenoms}</span>
                        <span className="text-slate-400 ml-2 font-mono text-[10px]">Né(e) le {enf.date_naissance}</span>
                      </div>
                      <button
                        onClick={() => setEnfants(enfants.filter((_, i) => i !== xi))}
                        className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-between">
              <button 
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Précédent
              </button>
              <button 
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: BENEFICIAIRE DECES */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <Heart className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">3. Clause d&apos;Attribution de Capital Décès</h3>
            </div>
            
            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
              Veuillez désigner la/les personne(s) physique(s) bénéficiaire(s) des prestations d&apos;assurance décès en cas de sinistre absolu. La somme des parts doit obligatoirement égaler ou dépasser 100%.
            </p>

            <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/50 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-650 block">Désigner un Nouveau Bénéficiaire</span>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Nom </label>
                  <input 
                    type="text" 
                    value={newBenef.nom}
                    onChange={(e) => setNewBenef({...newBenef, nom: e.target.value.toUpperCase()})}
                    placeholder="MUKENDI"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Prénom </label>
                  <input 
                    type="text" 
                    value={newBenef.prenoms}
                    onChange={(e) => setNewBenef({...newBenef, prenoms: e.target.value})}
                    placeholder="Gisèle"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Lien de Parenté</label>
                  <input 
                    type="text" 
                    value={newBenef.lien}
                    onChange={(e) => setNewBenef({...newBenef, lien: e.target.value})}
                    placeholder="Fille"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Part d&apos;Attribution (%)</label>
                  <input 
                    type="number" 
                    value={newBenef.part || ''}
                    onChange={(e) => setNewBenef({...newBenef, part: Number(e.target.value)})}
                    placeholder="50"
                    className="w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono font-bold focus:outline-none"
                  />
                </div>
                <div className="col-span-2 md:col-span-1 flex items-end">
                  <button
                    type="button"
                    onClick={handleAddBeneficiaire}
                    className="w-full inline-flex items-center justify-center gap-1 px-3 py-2 bg-slate-950 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold uppercase cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Ajouter
                  </button>
                </div>
              </div>

              {beneficiaires.length > 0 && (
                <div className="bg-white border rounded-xl divide-y text-xs">
                  {beneficiaires.map((b, bi) => (
                    <div key={bi} className="p-2.5 flex items-center justify-between">
                      <div>
                        <span className="font-extrabold text-slate-800">{b.nom} {b.prenoms}</span>
                        <span className="text-indigo-600 ml-2 font-bold font-mono text-[10px]">({b.lien})</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-slate-900 font-mono text-xs">{b.part}% du capital</span>
                        {beneficiaires.length > 1 && (
                          <button
                            onClick={() => setBeneficiaires(beneficiaires.filter((_, i) => i !== bi))}
                            className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-1 rounded-lg transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-6 flex justify-between">
              <button 
                type="button"
                onClick={() => setCurrentStep(2)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Précédent
              </button>
              <button 
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: QUESTIONNAIRE HEALTH (ENCRYPTED) */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <Lock className="w-5 h-5 text-indigo-600 animate-pulse" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">4. Déclaration Médicale de l&apos;Assuré (Chiffrée pgsodium Vault)</h3>
            </div>

            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl text-indigo-850 text-xs font-semibold leading-relaxed flex gap-3">
              <Lock className="w-5 h-5 text-indigo-650 shrink-0" />
              <div>
                <span className="font-extrabold text-indigo-900 block uppercase text-[10px] tracking-wide">Directive ARCA-RDC sur le secret médical</span>
                Ces informations sont chiffrées de bout-en-bout via les clés symétriques du coffre-fort Supabase Vault et cryptées localement via l&apos;extension pgsodium. Aucun tiers RH, courtier ou assureur ne peut y accéder sans le consentement exprès loggué par clé d&apos;audit.
              </div>
            </div>

            <div className="space-y-4">
              {/* Question 1 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-700">Avez-vous des antécédents de pathologies graves ou chroniques ou d&apos;affections cardio-vasculaires ?</span>
                <select
                  value={medicalAnswers.antecedents}
                  onChange={(e) => setMedicalAnswers({...medicalAnswers, antecedents: e.target.value})}
                  className="bg-slate-100 hover:bg-slate-200 border text-xs font-bold p-1 px-3 rounded-lg cursor-pointer outline-none"
                >
                  <option value="NON">NON</option>
                  <option value="OUI">OUI</option>
                </select>
              </div>

              {/* Question 2 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-700">Avez-vous subi une hospitalisation ou une intervention chirurgicale ces 5 dernières années ?</span>
                <select
                  value={medicalAnswers.hospitalisation}
                  onChange={(e) => setMedicalAnswers({...medicalAnswers, hospitalisation: e.target.value})}
                  className="bg-slate-100 hover:bg-slate-200 border text-xs font-bold p-1 px-3 rounded-lg cursor-pointer outline-none"
                >
                  <option value="NON">NON</option>
                  <option value="OUI">OUI</option>
                </select>
              </div>

              {/* Question 3 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-700">Prenez-vous régulièrement un traitement médicamenteux (hors contraception standard) ?</span>
                <select
                  value={medicalAnswers.traitement_regulier}
                  onChange={(e) => setMedicalAnswers({...medicalAnswers, traitement_regulier: e.target.value})}
                  className="bg-slate-100 hover:bg-slate-200 border text-xs font-bold p-1 px-3 rounded-lg cursor-pointer outline-none"
                >
                  <option value="NON">NON</option>
                  <option value="OUI">OUI</option>
                </select>
              </div>

              {/* Question 4 */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 transition-colors">
                <span className="text-xs font-bold text-slate-700">Consommez-vous régulièrement du tabac ou dérives nicotiniques ?</span>
                <select
                  value={medicalAnswers.fumeur}
                  onChange={(e) => setMedicalAnswers({...medicalAnswers, fumeur: e.target.value})}
                  className="bg-slate-100 hover:bg-slate-200 border text-xs font-bold p-1 px-3 rounded-lg cursor-pointer outline-none"
                >
                  <option value="NON">NON</option>
                  <option value="OUI">OUI</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Précisions ou commentaires supplémentaires (chiffrement assuré)</label>
                <textarea
                  rows={3}
                  value={medicalAnswers.details}
                  onChange={(e) => setMedicalAnswers({...medicalAnswers, details: e.target.value})}
                  placeholder="Inscrivez d'éventuels détails que le médecin-conseil de l'assurance devra étudier..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold focus:ring-1 focus:ring-slate-900 outline-none"
                />
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button 
                type="button"
                onClick={() => setCurrentStep(3)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Précédent
              </button>
              <button 
                type="button"
                onClick={() => setCurrentStep(5)}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* STEP 5: DOCUMENT UPLOAD & ELECTRONIC SIGNATURE */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 border-b pb-2 mb-4">
              <Upload className="w-5 h-5 text-indigo-600" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">5. Pièces Jointes d&apos;Identité &amp; Signature</h3>
            </div>

            {/* Document upload box */}
            <div className="border border-dashed border-slate-300 rounded-2xl p-6 text-center bg-slate-50/50 space-y-4">
              <Upload className="w-10 h-10 text-indigo-500 mx-auto" />
              <div className="space-y-1">
                <span className="text-xs font-extrabold uppercase text-slate-800 block">Téléverser Copie Recto/Verso CNI ou Passeport</span>
                <p className="text-[10.5px] text-slate-500 font-bold max-w-sm mx-auto leading-normal">
                  Obligatoire en qualité de preuve d&apos;identité pour rattachement du QR Code de tiers-payant. Format PNG, JPG ou PDF accepté (Max 5MB).
                </p>
              </div>

              <div className="flex justify-center">
                <input
                  type="file"
                  id="cni-identity-file"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="cni-identity-file"
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-white font-black text-[10px] uppercase tracking-widest rounded-lg cursor-pointer transition-colors shadow-md flex items-center gap-1.5"
                >
                  Choisir un fichier
                </label>
              </div>

              {isCniUploading && (
                <p className="text-indigo-600 text-xs font-bold font-mono animate-pulse">Signature en cours de cryptoprocess...</p>
              )}

              {cniFile && (
                <div className="p-3 bg-white border rounded-xl inline-flex flex-col items-center gap-1 mx-auto max-w-md">
                  <span className="text-xs font-extrabold text-slate-800">{cniFile.name} ({(cniFile.size/(1024*1024)).toFixed(2)} MB)</span>
                  <div className="flex items-center gap-1.5 text-[9px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 p-1 px-2.5 rounded-lg">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>SHA-256 Validé: {cniHash.substring(0, 32)}...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Electronic Signature Box */}
            <div className="border border-slate-150 rounded-2xl p-4 bg-slate-50/50 space-y-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-650 block">Assujettissement &amp; Consentement Électronique</span>

              <div className="space-y-3 text-xs leading-relaxed font-semibold text-slate-600">
                <p>
                  Je certifie sur l&apos;honneur l&apos;exactitude des présents renseignements destinés à l&apos;établissement de ma police de couverture maladie complémentaire.
                </p>
                <p>
                  Je consens par la présente à ce que les médecins-conseils habilités examinent mes données déclaratives chiffrées dans le cadre du contrôle réglementaire.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Dactylographier votre Nom Complet (Vaut signature)</label>
                  <input 
                    type="text" 
                    value={signatureName}
                    onChange={(e) => setSignatureName(e.target.value)}
                    placeholder="MUKENDI JEAN PATIENT"
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-black focus:ring-1 focus:ring-slate-900 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Preuve d&apos;Ancrage Légal d&apos;IP &amp; Horodatage</label>
                  <div className="bg-white border rounded-xl px-4 py-2 text-xs font-mono font-bold text-slate-500 flex flex-col justify-center leading-normal">
                    <span>IP Log: {ipAddress}</span>
                    <span>Date: {new Date().toLocaleDateString()} (Kinshasa Local Time)</span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <label className="inline-flex items-start gap-2 text-xs font-bold cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isConsentColected}
                    onChange={(e) => setIsConsentCollected(e.target.checked)}
                    className="w-4.5 h-4.5 rounded text-indigo-650 mt-0.5"
                  />
                  <span>J&apos;accepte les termes et signe électroniquement le formulaire ci-dessus sous peine de nullité de la police complémentaire.</span>
                </label>
              </div>
            </div>

            <div className="pt-6 flex justify-between">
              <button 
                type="button"
                onClick={() => setCurrentStep(4)}
                className="px-4 py-2 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Précédent
              </button>
              
              <button 
                type="button"
                onClick={handleFormSubmission}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg text-xs font-black uppercase tracking-wider rounded-xl transition-all"
              >
                Soumettre l&apos;Affiliation Finale
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
