import React, { useState, useEffect } from 'react';
import { 
  UserPlus, Phone, MapPin, Calendar, Lock, Eye, EyeOff, Save, Camera, 
  FileSpreadsheet, UserCheck, ShieldCheck, Mail, Briefcase
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useApp, UserProfile } from '../../lib/AppContext';
import { CropModal } from './CropModal';
import { CsvBulkModal } from './CsvBulkModal';

interface AdminCreateFormProps {
  triggerToast: (msg: string, type?: 'success' | 'error') => void;
}

const TENANTS = [
  { id: 'acme', name: 'ACME SARL', domain: 'acme.cd' },
  { id: 'sunu', name: 'Sunu Assurances', domain: 'sunu.cd' },
  { id: 'ngaliema', name: 'Hôpital Ngaliema', domain: 'ngaliema.cd' }
];

export const AdminCreateForm: React.FC<AdminCreateFormProps> = ({ triggerToast }) => {
  const { users, setUsers, logAction, currentUser } = useApp();
  const isSuperAdmin = currentUser.role === 'SUPER_ADMIN';

  const [formTenant, setFormTenant] = useState('acme');
  const [formNom, setFormNom] = useState('');
  const [formNomFamille, setFormNomFamille] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formPays, setFormPays] = useState('RDC');
  const [formVille, setFormVille] = useState('Kinshasa');
  const [formDob, setFormDob] = useState('');
  const [formSexe, setFormSexe] = useState('M');
  const [formNiveau, setFormNiveau] = useState('Employé');
  const [formPassword, setFormPassword] = useState('');
  const [formConfirmPassword, setFormConfirmPassword] = useState('');
  const [showFormPassword, setShowFormPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formPhoto, setFormPhoto] = useState<string | null>(null);

  // Crop modal states
  const [cropPreviewUrl, setCropPreviewUrl] = useState<string | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);

  // CSV modal state
  const [showCsvModal, setShowCsvModal] = useState(false);

  useEffect(() => {
    if (!isSuperAdmin) {
      setFormTenant('acme');
    }
  }, [isSuperAdmin]);

  useEffect(() => {
    if (formPays === 'RDC') {
      setFormVille('Kinshasa');
      if (!formPhone.startsWith('+243')) setFormPhone('+243 ');
    } else if (formPays === 'France') {
      setFormVille('Paris');
      if (!formPhone.startsWith('+33')) setFormPhone('+33 ');
    } else if (formPays === 'UAE') {
      setFormVille('Dubai');
      if (!formPhone.startsWith('+971')) setFormPhone('+971 ');
    }
  }, [formPays]);

  // ISO 27001 Live password checks
  const pLengthValid = formPassword.length >= 12;
  const pUpperValid = /[A-Z]/.test(formPassword);
  const pDigitValid = /[0-9]/.test(formPassword);
  const pSpecialValid = /[!@#$%^&*(),.?":{}|<>_#\-\/\\+\[\]]/.test(formPassword);
  const pAllValid = pLengthValid && pUpperValid && pDigitValid && pSpecialValid;

  const pMatchValid = formConfirmPassword !== '' && formConfirmPassword === formPassword;

  const nameOk = formNom.trim().length >= 2 && !/\d/.test(formNom);
  const lastNameOk = formNomFamille.trim().length >= 2;

  const getSelectedTenantDomain = () => {
    const t = TENANTS.find(x => x.id === formTenant);
    return t ? t.domain : 'acme.cd';
  };

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isCorrectEmailDomain = isSuperAdmin ? true : formEmail.endsWith(`@${getSelectedTenantDomain()}`);
  const emailOk = emailRegex.test(formEmail) && isCorrectEmailDomain;
  const isEmailUnique = !users.some(u => u.email.toLowerCase() === formEmail.toLowerCase());

  const getRequiredPhonePrefix = () => {
    if (formPays === 'RDC') return '+243';
    if (formPays === 'France') return '+33';
    return '+971';
  };
  const phonePrefixMatches = formPhone.trim().startsWith(getRequiredPhonePrefix());
  const phoneOk = formPays === 'RDC' 
    ? (formPhone.trim().length >= 10 && phonePrefixMatches) 
    : formPhone.trim().length >= 8;

  const isAgeValid = () => {
    if (!formDob) return false;
    const birthDate = new Date(formDob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18 && age <= 100;
  };

  const isFormValid = nameOk && lastNameOk && emailOk && isEmailUnique && phoneOk && isAgeValid() && pAllValid && pMatchValid;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        triggerToast("Le fichier dépasse la limite autorisée de 2Mo.", "error");
        return;
      }
      const url = URL.createObjectURL(file);
      setCropPreviewUrl(url);
      setShowCropModal(true);
    }
  };

  const handleApplyCrop = (croppedUrl: string) => {
    setFormPhoto(croppedUrl);
    triggerToast("Profil image rognée avec succès au format carré 1:1.");
    setShowCropModal(false);
  };

  const handleClearForm = () => {
    setFormNom('');
    setFormNomFamille('');
    setFormEmail('');
    setFormPhone(formPays === 'RDC' ? '+243 ' : '');
    setFormDob('');
    setFormPassword('');
    setFormConfirmPassword('');
    setFormPhoto(null);
    setFormNiveau('Employé');
    triggerToast("Formulaire de création nettoyé.");
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      triggerToast("Formulaire invalide. Veuillez vérifier les critères.", "error");
      return;
    }

    const newUserData: UserProfile = {
      id: `USR-${Math.floor(100 + Math.random() * 900)}`,
      name: `${formNom.trim()} ${formNomFamille.trim().toUpperCase()}`,
      email: formEmail.trim(),
      phone: formPhone.trim(),
      address: `${formVille}, ${formPays}`,
      role: formNiveau === 'Administrateur' ? 'SUPER_ADMIN' : 'RH_ENTREPRISE',
      status: 'En attente',
      photo: formPhoto || undefined,
      biometricsEnabled: false,
      biometricsLinked: false,
      mfaEnabled: false,
      deviceTrusted: false,
      cardCode: `POL-${Math.floor(100000 + Math.random() * 900000)}-SEC`,
      contractName: `Contrat NeoG-Tenant (${TENANTS.find(x => x.id === formTenant)?.name})`,
      creationDate: new Date().toLocaleDateString('fr'),
    };

    setUsers(prev => [...prev, newUserData]);
    logAction(
      'CREATE_USER_ADMIN',
      `Utilisateur Admin créé : ${newUserData.name} (${newUserData.email}) affecté à la flotte ${formTenant.toUpperCase()}.`,
      'SUCCESS'
    );

    triggerToast(`Utilisateur ${newUserData.name} créé avec succès ! Un e-mail d'activation a été envoyé.`);
    handleClearForm();
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleCreateUserSubmit} className="space-y-8">
        
        {/* Section 1 : Affectation */}
        <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 space-y-4 shadow-sm">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#059669] uppercase font-mono">Sous-Module 1 • Section 1</span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">Affectation de l'Établissement</h3>
            <p className="text-xs text-slate-400">Chaque gestionnaire d'accès doit être explicitement cloisonné à son tenant client.</p>
          </div>

          <div className="space-y-1.5 max-w-md">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10.5px]">
              Affecter à l'établissement / entreprise <span className="text-rose-500 font-bold">*</span>
            </label>
            <select
              disabled={!isSuperAdmin}
              value={formTenant}
              onChange={(e) => setFormTenant(e.target.value)}
              className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-bold text-slate-800 outline-none focus:ring-2 focus:ring-green-500/20"
            >
              {TENANTS.map(t => (
                <option key={t.id} value={t.id}>{t.name} (domain: {t.domain})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Section 2 : Identité & Coordonnées */}
        <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#059669] uppercase font-mono">Sous-Module 1 • Section 2</span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">Identité &amp; Sceau Numérique</h3>
            <p className="text-xs text-slate-400">Coordonnées de l'utilisateur conformes aux normes d'audit d'identité.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="space-y-4">
              <p className="text-xs font-extrabold text-slate-800 uppercase tracking-widest text-[9px] font-mono">Photo de profil (format d'identité)</p>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-full border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden group shadow-inner">
                  {formPhoto ? (
                    <img src={formPhoto} className="w-full h-full object-cover" alt="Sceau" />
                  ) : (
                    <Camera className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-850">Téléchargez une photo claire</p>
                  <p className="text-[10px] text-slate-400">Max 2Mo. Échelle automatique validée d'identité.</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Prénom <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="ex: Jean"
                  value={formNom}
                  onChange={(e) => setFormNom(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                />
                {formNom && !nameOk && <p className="text-[10px] text-rose-500 font-semibold">Le prénom n'autorise pas de chiffres et doit faire 2+ car.</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Nom de famille <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  placeholder="ex: MUKENDI"
                  value={formNomFamille}
                  onChange={(e) => setFormNomFamille(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                />
                {formNomFamille && !lastNameOk && <p className="text-[10px] text-rose-500 font-semibold">Doit faire au moins 2 caractères.</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">E-mail professionnel <span className="text-rose-500">*</span></label>
                <input
                  type="email"
                  placeholder={isSuperAdmin ? "jean.m@ex.cd" : `nom.prenom@${getSelectedTenantDomain()}`}
                  value={formEmail}
                  onChange={(e) => setFormEmail(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                />
                {formEmail && !emailOk && (
                  <p className="text-[10px] text-rose-500 font-semibold">
                    {isCorrectEmailDomain ? "Format d'adresse e-mail invalide." : `Erreurs d'audit : Le domaine doit impérativement finir par @${getSelectedTenantDomain()}`}
                  </p>
                )}
                {formEmail && emailOk && !isEmailUnique && <p className="text-[10px] text-amber-600 font-semibold">Cette adresse e-mail existe déjà chez un collaborateur.</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Numéro de téléphone portable <span className="text-rose-500">*</span></label>
                <input
                  type="tel"
                  placeholder="+243 ..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-semibold focus:outline-none"
                />
                {formPhone && !phoneOk && (
                  <p className="text-[10px] text-rose-500 font-semibold">
                    Le prefixe requis de cet établissement est {getRequiredPhonePrefix()}. Doit faire 8+ chiffres.
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Pays d'affectation</label>
                <select
                  value={formPays}
                  onChange={(e) => setFormPays(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs text-slate-800"
                >
                  <option value="RDC">République Démocratique du Congo (RDC)</option>
                  <option value="France">République Française</option>
                  <option value="UAE">Émirats Arabes Unis (UAE)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Ville principale</label>
                <input
                  type="text"
                  disabled
                  value={formVille}
                  className="w-full h-11 border bg-slate-50 border-slate-300 rounded-xl px-4 text-xs font-semibold focus:outline-none text-slate-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Date de naissance <span className="text-rose-500">*</span></label>
                <input
                  type="date"
                  value={formDob}
                  onChange={(e) => setFormDob(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs text-slate-800 focus:outline-none"
                />
                {formDob && !isAgeValid() && <p className="text-[10px] text-rose-500 font-semibold">Règle de conformité : L'âge requis doit être entre 18 et 100 ans.</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Genre biologique <span className="text-rose-500">*</span></label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="radio"
                      name="formSexe"
                      value="M"
                      checked={formSexe === 'M'}
                      onChange={() => setFormSexe('M')}
                    /> HOMME
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold">
                    <input
                      type="radio"
                      name="formSexe"
                      value="F"
                      checked={formSexe === 'F'}
                      onChange={() => setFormSexe('F')}
                    /> FEMME
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3 : RBAC & Mot de passe */}
        <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 space-y-6 shadow-sm">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#059669] uppercase font-mono">Sous-Module 1 • Section 3</span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">RBAC &amp; Clé d'Accès Provisoire</h3>
            <p className="text-xs text-slate-400">Configurez le niveau d'autorisation et le premier sésame de connexion obligatoire ISO/IEC 27001.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Niveau d'autorisation (RBAC)</label>
                <select
                  value={formNiveau}
                  onChange={(e) => setFormNiveau(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded-xl px-4 text-xs font-bold text-slate-800"
                >
                  <option value="Employé">Employé (Accès restreint au tenant de son entreprise)</option>
                  <option value="Administrateur">Administrateur (Gestionnaire complet de son établissement)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Mot de passe temporaire d'activation <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type={showFormPassword ? 'text' : 'password'}
                    placeholder="ex: MarieKa!1234"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    className="w-full h-11 border border-slate-300 rounded-xl pl-4 pr-10 text-xs font-mono font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowFormPassword(!showFormPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800"
                  >
                    {showFormPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide text-[10px]">Confirmer mot de passe temporaire <span className="text-rose-500">*</span></label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Même chose"
                    value={formConfirmPassword}
                    onChange={(e) => setFormConfirmPassword(e.target.value)}
                    className="w-full h-11 border border-slate-300 rounded-xl pl-4 pr-10 text-xs font-mono font-bold focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-800"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {formConfirmPassword && !pMatchValid && (
                  <p className="text-[10px] text-rose-500 font-semibold">Les mots de passe ne correspondent pas.</p>
                )}
              </div>
            </div>

            {/* Password security panel */}
            <div className="p-5 bg-slate-50 border rounded-2xl space-y-3 shadow-inner">
              <p className="text-[9.5px] font-black uppercase tracking-wider text-slate-400 font-mono">Contraintes de sécurité obligatoires (ISO 27001) :</p>
              <div className="space-y-2">
                {[
                  { label: "12 caractères minimum requis", valid: pLengthValid },
                  { label: "Contient au moins une lettre majuscule", valid: pUpperValid },
                  { label: "Contient au moins un chiffre", valid: pDigitValid },
                  { label: "Contient un caractère spécial (@, #, !, %...)", valid: pSpecialValid }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={cn("w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold", item.valid ? "bg-emerald-50 text-emerald-600 border border-emerald-250 animate-pulse" : "bg-rose-50 text-rose-600 border border-rose-205")}>
                      {item.valid ? "✓" : "×"}
                    </div>
                    <span className={cn("text-[11px] font-semibold", item.valid ? "text-slate-700" : "text-slate-400")}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleClearForm}
              className="py-3 px-6 border text-slate-500 hover:bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest transition cursor-pointer"
            >
              Nettoyer
            </button>
            <button
              type="button"
              onClick={() => setShowCsvModal(true)}
              className="py-3 px-5 bg-slate-50 border border-slate-200 hover:border-slate-350 text-slate-700 hover:bg-slate-100 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 transition cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4 text-[#217346]" /> Importer CSV Bulk
            </button>
          </div>

          <button
            type="submit"
            disabled={!isFormValid}
            className={cn(
              "py-3.5 px-8 text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-1.5 cursor-pointer",
              isFormValid 
                ? "bg-[#059669] hover:bg-[#047857] shadow-emerald-600/20 active:scale-[0.98] transition-all" 
                : "bg-slate-200 shadow-none cursor-not-allowed text-slate-450"
            )}
          >
            <Save className="w-4 h-4" /> Enregistrer &amp; Expédier Invitation
          </button>
        </div>
      </form>

      {/* Section 4 : Utilisateurs enregistrés du Tenant sélectionné */}
      <div className="bg-white rounded-3xl border border-slate-150 p-6 md:p-8 space-y-4 shadow-sm mt-8">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#059669] uppercase font-mono">Sous-Module 1 • Section 4</span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1">
            Utilisateurs Enregistrés : <span className="text-green-600 italic">"{TENANTS.find(x => x.id === formTenant)?.name}"</span>
          </h3>
          <p className="text-xs text-slate-400">Total : {users.filter(u => u.contractName.toLowerCase().includes(formTenant.toLowerCase())).length} collaborateur(s)</p>
        </div>

        <div className="overflow-x-auto border rounded-2xl bg-white max-h-80 overflow-y-auto no-scrollbar">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-50 sticky top-0 border-b z-10">
              <tr className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                <th className="p-4">Photo</th>
                <th className="p-4">Nom complet</th>
                <th className="p-4">E-mail</th>
                <th className="p-4">Niveau d'accès</th>
                <th className="p-4">Statut</th>
                <th className="p-4">Créé le</th>
              </tr>
            </thead>
            <tbody className="divide-y font-medium text-slate-700">
              {users.filter(u => u.contractName.toLowerCase().includes(formTenant.toLowerCase())).map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="w-8 h-8 rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-700 font-extrabold uppercase overflow-hidden text-[10px]">
                      {u.photo ? <img src={u.photo} className="w-full h-full object-cover" /> : u.name.charAt(0)}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-slate-900">{u.name.toUpperCase()}</td>
                  <td className="p-4 font-mono">{u.email}</td>
                  <td className="p-4">
                    <span className="text-[8px] font-black uppercase text-green-700 bg-green-50 px-2.5 py-0.5 rounded border border-green-150">
                      {u.role === 'SUPER_ADMIN' ? 'Admin' : 'Employé'}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[8px] font-black uppercase px-2 py-0.5 rounded",
                      u.status === 'Actif' ? "bg-emerald-50 text-emerald-600 border border-emerald-250 animate-pulse" : "bg-orange-50 text-orange-600 border border-orange-200"
                    )}>
                      {u.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-400 font-mono text-[10px]">{u.creationDate || "29/05/2026"}</td>
                </tr>
              ))}
              {users.filter(u => u.contractName.toLowerCase().includes(formTenant.toLowerCase())).length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Aucun collaborateur actif enregistré pour cet établissement.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Embedded Crop Modal & Csv Bulk dialog */}
      <CropModal
        isOpen={showCropModal}
        previewUrl={cropPreviewUrl}
        onClose={() => setShowCropModal(false)}
        onApply={handleApplyCrop}
      />

      <CsvBulkModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        formTenant={formTenant}
      />
    </div>
  );
};
