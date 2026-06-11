import React, { createContext, useContext, useState, useEffect } from 'react';
import { syncAuditLogToSupabase } from './supabase';

export type UserRole = 
  | 'SUPER_ADMIN' 
  | 'GESTIONNAIRE_SINISTRES' 
  | 'GESTIONNAIRE_FINANCE' 
  | 'AUDITEUR_EXTERNE'
  | 'SUPPORT_CLIENT'
  | 'RH_ENTREPRISE'
  | 'PARTENAIRE_HOPITAL'
  | 'AGENT_COMMERCIAL'
  | 'DATA_SCIENTIST'
  | 'MEDECIN'
  | 'ADMIN_PRESTATAIRE'
  | 'PHARMACIEN'
  | 'FINANCE_MANAGER'
  | 'ASSURE'
  | 'SUPPORT_NEOGTEC';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  status: 'Actif' | 'Suspendu' | 'En attente';
  photo?: string;
  biometricsEnabled: boolean;
  biometricsLinked: boolean;
  cardCode: string;
  mfaEnabled: boolean;
  deviceTrusted: boolean;
  contractName: string;
  creationDate: string;
  tenantId?: string | null;
}

export interface Beneficiary {
  id: string;
  name: string;
  relation: 'Conjoint' | 'Enfant' | 'Parent' | 'Autre';
  age: number;
  status: 'Actif' | 'En attente' | 'Suspendu';
  photo?: string;
  cardCode: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'CRITICAL';
}

interface AppContextProps {
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  beneficiaries: Beneficiary[];
  setBeneficiaries: React.Dispatch<React.SetStateAction<Beneficiary[]>>;
  auditLogs: AuditLog[];
  logAction: (action: string, details: string, status?: 'SUCCESS' | 'WARNING' | 'CRITICAL') => void;
  biAnonymize: boolean;
  setBiAnonymize: (val: boolean) => void;
  countryEntity: string;
  setCountryEntity: (entity: string) => void;
  activeModule: string;
  setActiveModule: (mod: string) => void;
  auditeurDays: number;
  setAuditeurDays: (days: number) => void;
  // Methods
  registerNewUser: (user: Partial<UserProfile>) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  addFamilyMember: (member: Omit<Beneficiary, 'id' | 'cardCode'>) => { success: boolean; error?: string };
  updateFamilyMember: (id: string, updates: Partial<Beneficiary>) => void;
  deleteFamilyMember: (id: string) => void;
  quickSwitchRole: (role: UserRole) => void;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

// Initial mock registered users (displayed in user-list and digital module)
const INITIAL_USERS: UserProfile[] = [
  {
    id: 'USR-001',
    name: 'Adonaï Lutonadio',
    email: 'adonailutonadio70@gmail.com',
    phone: '+243 821 555 422',
    address: 'Kinshasa, Gombe, Blvd du 30 Juin',
    role: 'SUPER_ADMIN',
    status: 'Actif',
    biometricsEnabled: true,
    biometricsLinked: true,
    cardCode: 'POL-123456-SEC',
    mfaEnabled: true,
    deviceTrusted: true,
    contractName: 'AfreakCare Platinum Plus',
    creationDate: '12/01/2024',
  },
  {
    id: 'USR-002',
    name: 'Dr. Kabasele Kabongo',
    email: 'dr.kabasele@neogtec.com',
    phone: '+243 897 122 344',
    address: 'Clinique HJ, Kinshasa Limete',
    role: 'GESTIONNAIRE_SINISTRES', // Médecin Conseil
    status: 'Actif',
    biometricsEnabled: true,
    biometricsLinked: true,
    cardCode: 'POL-MC-90812-MED',
    mfaEnabled: true,
    deviceTrusted: true,
    contractName: 'Convention Prestataire Clinique HJ',
    creationDate: '02/03/2024',
  },
  {
    id: 'USR-003',
    name: 'Marie Luvuezo',
    email: 'm.luvuezo@compta.com',
    phone: '+243 812 345 678',
    address: 'Gombe, Av. de la Banque',
    role: 'GESTIONNAIRE_FINANCE', // Comptable
    status: 'Actif',
    biometricsEnabled: false,
    biometricsLinked: false,
    cardCode: 'POL-FI-78255-FIN',
    mfaEnabled: true,
    deviceTrusted: false,
    contractName: 'Mandat Finance Corp RDC',
    creationDate: '15/04/2024',
  },
  {
    id: 'USR-004',
    name: 'Sarah Bernard',
    email: 'sarah.b@audit-kpmg.com',
    phone: '+33 6 1234 5678',
    address: 'KPMG Paris HQ, France',
    role: 'AUDITEUR_EXTERNE', // Commissaire aux comptes
    status: 'Actif',
    biometricsEnabled: false,
    biometricsLinked: false,
    cardCode: 'POL-AUD-00923-KPMG',
    mfaEnabled: true,
    deviceTrusted: true,
    contractName: 'Mandat Audit Annuel Externe 2026',
    creationDate: '20/05/2026',
  }
];

const INITIAL_BENEFICIARIES: Beneficiary[] = [
  { id: 'BEN-WAN-01', name: 'Sabrina Wanzambi', relation: 'Conjoint', age: 28, status: 'Actif', cardCode: 'ADNA-CRD-890214' },
  { id: 'BEN-WAN-02', name: 'Isaac Wanzambi', relation: 'Enfant', age: 6, status: 'Actif', cardCode: 'ADNA-CRD-890215' },
  { id: 'BEN-WAN-03', name: 'Léa Wanzambi', relation: 'Enfant', age: 3, status: 'En attente', cardCode: 'ADNA-CRD-890216' },
];

const INITIAL_LOGS: AuditLog[] = [
  {
    id: 'ADT-901',
    timestamp: '2026-05-28T00:10:15Z',
    userId: 'USR-001',
    userName: 'Adonaï Lutonadio',
    userRole: 'SUPER_ADMIN',
    action: 'CONNEXION_MFA',
    details: 'Authentification forte par SMS validée avec succès sur terminal IP 197.12.8.210',
    ipAddress: '197.12.8.210',
    status: 'SUCCESS'
  },
  {
    id: 'ADT-902',
    timestamp: '2026-05-28T00:14:02Z',
    userId: 'USR-001',
    userName: 'Adonaï Lutonadio',
    userRole: 'SUPER_ADMIN',
    action: 'VISUALISATION_BI_ANONYMISEE',
    details: 'Accès au dashboard analytique mondial avec filtre anonymisation activé par défaut',
    ipAddress: '197.12.8.210',
    status: 'SUCCESS'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('assur_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_USERS[0]; // Adonaï as Super Admin by default
  });

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('assur_users_list');
    let loadedUsers: UserProfile[] = INITIAL_USERS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) loadedUsers = parsed;
      } catch (e) {}
    }
    // Self-healing / Repairing non-unique IDs to prevent React children duplicate key warnings
    const seenIds = new Set<string>();
    return loadedUsers.map((user, index) => {
      let currentId = user.id;
      if (!currentId || seenIds.has(currentId)) {
        let counter = index + 1;
        let newId = `USR-${String(counter).padStart(3, '0')}`;
        while (seenIds.has(newId) || loadedUsers.some((u, i) => i !== index && u.id === newId)) {
          counter++;
          newId = `USR-${String(counter).padStart(3, '0')}`;
        }
        currentId = newId;
      }
      seenIds.add(currentId);
      return { ...user, id: currentId };
    });
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = localStorage.getItem('assur_beneficiaries_list');
    let loadedBeneficiaries: Beneficiary[] = INITIAL_BENEFICIARIES;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) loadedBeneficiaries = parsed;
      } catch (e) {}
    }
    const seenIds = new Set<string>();
    return loadedBeneficiaries.map((b, index) => {
      let currentId = b.id;
      if (!currentId || seenIds.has(currentId)) {
        let counter = index + 1;
        let newId = `BEN-WAN-${String(counter).padStart(2, '0')}`;
        while (seenIds.has(newId) || loadedBeneficiaries.some((item, i) => i !== index && item.id === newId)) {
          counter++;
          newId = `BEN-WAN-${String(counter).padStart(2, '0')}`;
        }
        currentId = newId;
      }
      seenIds.add(currentId);
      return { ...b, id: currentId };
    });
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('assur_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return INITIAL_LOGS;
  });

  const [biAnonymize, setBiAnonymizeState] = useState(true);
  const [countryEntity, setCountryEntity] = useState('RDC');
  const [activeModule, setActiveModule] = useState('dashboard');
  const [auditeurDays, setAuditeurDays] = useState(12);

  useEffect(() => {
    localStorage.setItem('assur_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('assur_users_list', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('assur_beneficiaries_list', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    localStorage.setItem('assur_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const setBiAnonymize = (val: boolean) => {
    setBiAnonymizeState(val);
    logAction('TOGGLE_ANONYMISATION_BI', `Anonymisation de la Business Intelligence modifiée : ${val ? 'ACTIVÉE' : 'DÉSACTIVÉE'}.`, val ? 'SUCCESS' : 'WARNING');
  };

  const logAction = (action: string, details: string, status: 'SUCCESS' | 'WARNING' | 'CRITICAL' = 'SUCCESS') => {
    let randId = Math.floor(100000 + Math.random() * 900000);
    let logId = `ADT-${randId}`;
    while (auditLogs.some(l => l.id === logId)) {
      randId = Math.floor(100000 + Math.random() * 900000);
      logId = `ADT-${randId}`;
    }

    const newLog: AuditLog = {
      id: logId,
      timestamp: new Date().toISOString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      details,
      ipAddress: '197.54.12.' + Math.floor(1 + Math.random() * 254),
      status
    };
    setAuditLogs(prev => [newLog, ...prev]);
    
    // Background async sync with Supabase PostgreSQL
    syncAuditLogToSupabase(newLog).catch(err => {
      console.warn('Silent Supabase log bypass:', err);
    });
  };

  const registerNewUser = (user: Partial<UserProfile>) => {
    let counter = users.length + 1;
    let newId = `USR-${String(counter).padStart(3, '0')}`;
    while (users.some(u => u.id === newId)) {
      counter++;
      newId = `USR-${String(counter).padStart(3, '0')}`;
    }

    const newUser: UserProfile = {
      id: newId,
      name: user.name || 'Adhérent Anonyme',
      email: user.email || `${newId.toLowerCase()}@afreakcare.com`,
      phone: user.phone || '+243 000 000 000',
      address: user.address || 'Non spécifiée',
      role: 'SUPPORT_CLIENT',
      status: 'Actif',
      biometricsEnabled: user.biometricsEnabled || false,
      biometricsLinked: user.biometricsLinked || false,
      cardCode: `POL-${Math.floor(100000 + Math.random() * 900000)}-SEC`,
      mfaEnabled: true,
      deviceTrusted: true,
      contractName: user.contractName || 'AfreakCare Standard Communautaire',
      creationDate: new Date().toLocaleDateString('fr'),
    };

    setUsers(prev => [...prev, newUser]);
    logAction('INSCRIPTION_DIGITALE_ASSURÉ', `Nouvel assuré enregistré avec succès : ${newUser.name} (#${newUser.id}). Contrat lié: ${newUser.contractName}`, 'SUCCESS');
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    // Updates both the current session user AND their entry inside the master list of users if they match
    setCurrentUserState(prev => {
      const merged = { ...prev, ...profile };
      return merged;
    });

    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        return { ...u, ...profile };
      }
      return u;
    }));

    logAction('MODIFICATION_PROFIL', `Mise à jour des informations de profil effectuées avec succès.`, 'SUCCESS');
  };

  const addFamilyMember = (member: Omit<Beneficiary, 'id' | 'cardCode'>): { success: boolean; error?: string } => {
    // Age Limit enforcement based on RDC Legislation (F1 constraint)
    if (member.relation === 'Enfant' && member.age > 25) {
      const errorStr = "La législation RDC impose un âge maximum de 25 ans pour l'éligibilité d'un enfant à charge.";
      logAction('REFUS_RATTACHEMENT_FAMILIAL', `Rattachement rejeté de l'enfant ${member.name} (Âge: ${member.age} ans > limite de 25 ans).`, 'CRITICAL');
      return { success: false, error: errorStr };
    }

    let counter = beneficiaries.length + 1;
    let newId = `BEN-WAN-${String(counter).padStart(2, '0')}`;
    while (beneficiaries.some(b => b.id === newId)) {
      counter++;
      newId = `BEN-WAN-${String(counter).padStart(2, '0')}`;
    }

    const newMember: Beneficiary = {
      ...member,
      id: newId,
      cardCode: `ADNA-CRD-${Math.floor(100000 + Math.random() * 900000)}`
    };

    setBeneficiaries(prev => [...prev, newMember]);
    logAction('AJOUT_BENEFICIAIRE', `Nouveau membre de couverture familiale ajouté : ${newMember.name} (Relation: ${newMember.relation})`, 'SUCCESS');
    return { success: true };
  };

  const updateFamilyMember = (id: string, updates: Partial<Beneficiary>) => {
    // Validation on modification
    const existing = beneficiaries.find(b => b.id === id);
    if (existing) {
      const relation = updates.relation || existing.relation;
      const age = updates.age !== undefined ? updates.age : existing.age;

      if (relation === 'Enfant' && age > 25) {
        logAction('REFUS_MODIFICATION_BENEFICIAIRE', `Tentative d'affecter un âge illégal à un enfant à charge (${updates.name || existing.name}, ${age} ans). Action bloquée.`, 'CRITICAL');
        return;
      }
      
      setBeneficiaries(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
      logAction('MODIFICATION_BENEFICIAIRE', `Informations de l'ayant-droit ${existing.name} modifiées avec succès.`, 'SUCCESS');
    }
  };

  const deleteFamilyMember = (id: string) => {
    const existing = beneficiaries.find(b => b.id === id);
    if (existing) {
      setBeneficiaries(prev => prev.filter(b => b.id !== id));
      logAction('SUPPRESSION_BENEFICIAIRE', `Retrait du bénéficiaire ${existing.name} de la police de couverture familiale.`, 'WARNING');
    }
  };

  const quickSwitchRole = (role: UserRole) => {
    // Generate role specific profiles
    let targetProfile: UserProfile = {
      id: `USR-${role.substring(0, 3)}-01`,
      name: role.split('_').map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(' '),
      email: `${role.toLowerCase()}@neogtec.com`,
      phone: '+243 812 345 678',
      address: 'Kinshasa, Gombe',
      role,
      status: 'Actif',
      biometricsEnabled: true,
      biometricsLinked: true,
      cardCode: `POL-${role.substring(0, 3)}-AUTO`,
      mfaEnabled: true,
      deviceTrusted: true,
      contractName: 'Contrat Assurance Standard',
      creationDate: '01/01/2026',
      tenantId: null
    };

    if (role === 'SUPER_ADMIN') {
      targetProfile.name = 'Paul NEOGTEC';
      targetProfile.email = 'paul@neogtec.com';
      targetProfile.tenantId = null;
    } else if (role === 'RH_ENTREPRISE') {
      targetProfile.name = 'Marie KAPEND';
      targetProfile.email = 'm.kapend@acme.cd';
      targetProfile.tenantId = 'acme';
    } else if (role === 'SUPPORT_CLIENT') {
      targetProfile.name = 'Jean MUKENDI';
      targetProfile.email = 'jean.m@acme.cd';
      targetProfile.tenantId = 'acme';
    } else if (role === 'MEDECIN') {
      targetProfile.name = 'Dr. Sarah LOKO';
      targetProfile.email = 'sarah.loko@ngaliema.cd';
      targetProfile.tenantId = 'ngaliema';
    } else if (role === 'ADMIN_PRESTATAIRE') {
      targetProfile.name = 'Admin Hôpital Ngaliema';
      targetProfile.email = 'admin@ngaliema.cd';
      targetProfile.tenantId = 'ngaliema';
    } else if (role === 'PHARMACIEN') {
      targetProfile.name = 'Pharmacien KinPharma';
      targetProfile.email = 'pharma@kinpharma.cd';
      targetProfile.tenantId = 'kinpharma';
    } else if (role === 'FINANCE_MANAGER') {
      targetProfile.name = 'Gestionnaire Finance Sunu';
      targetProfile.email = 'finance@sunu.cd';
      targetProfile.tenantId = 'sunu';
    } else if (role === 'AUDITEUR_EXTERNE') {
      targetProfile.name = 'Auditeur CNAM';
      targetProfile.email = 'auditeur@cnam.gov';
      targetProfile.tenantId = null;
    } else if (role === 'ASSURE') {
      targetProfile.name = 'Jean PATIENT (Assuré)';
      targetProfile.email = 'jean.patient@gmail.com';
      targetProfile.tenantId = 'acme';
    } else if (role === 'SUPPORT_NEOGTEC') {
      targetProfile.name = 'Support NeoGTec N1';
      targetProfile.email = 'support-n1@neogtec.com';
      targetProfile.tenantId = null;
    }

    setCurrentUserState(targetProfile);
    logAction('CHANGEMENT_DE_ROLE_DEMO', `Audit de changement d'accès : Session transférée vers l'identité de ${targetProfile.name} (Rôle professionnel : ${role}, Tenant : ${targetProfile.tenantId || 'SaaS Global'})`, 'WARNING');
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      setCurrentUser: setCurrentUserState as any,
      users,
      setUsers,
      beneficiaries,
      setBeneficiaries,
      auditLogs,
      logAction,
      biAnonymize,
      setBiAnonymize,
      countryEntity,
      setCountryEntity,
      activeModule,
      setActiveModule,
      auditeurDays,
      setAuditeurDays,
      registerNewUser,
      updateUserProfile,
      addFamilyMember,
      updateFamilyMember,
      deleteFamilyMember,
      quickSwitchRole
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
