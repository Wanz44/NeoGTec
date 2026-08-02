import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { getDb } from '../lib/firebase';

export interface PoliceInsurance {
  id: string;
  numeroPolice: string;
  entrepriseNom: string;
  formule: string;
  primeMensuelle: number;
  statut: 'Actif' | 'En attente' | 'Suspendu';
  nbAssures: number;
  dateDebut: string;
  dateFin: string;
}

export interface AssureMember {
  id: string;
  matricule: string;
  nom: string;
  email: string;
  numeroCarte: string;
  entrepriseNom: string;
  formule: string;
  statut: 'Actif' | 'Inactif';
  soldePlafond: number;
  ayantsDroit: { id: string; nom: string; lien: string }[];
}

export interface PrestataireHealth {
  id: string;
  codePrestataire: string;
  nom: string;
  type: 'Hôpital' | 'Clinique' | 'Pharmacie' | 'Laboratoire';
  ville: string;
  telephone: string;
  statutConvention: 'Conventionné' | 'En cours' | 'Suspendu';
}

export interface SoinClaim {
  id: string;
  codePriseEnCharge: string;
  assureMatricule: string;
  assureNom: string;
  prestataireNom: string;
  acte: string;
  montantTotal: number;
  partAssureur: number;
  partPatient: number;
  statut: 'Accordé' | 'Refusé' | 'En attente';
  createdAt: string;
}

export interface DerogationRequest {
  id: string;
  codeDerogation: string;
  demandeurType: 'Entreprise' | 'Prestataire' | 'Assuré';
  demandeurNom: string;
  patientNom: string;
  montant: number;
  motif: string;
  statut: 'En attente' | 'Validée' | 'Rejetée';
  validePar?: string;
  createdAt: string;
}

export interface FactureBilling {
  id: string;
  reference: string;
  entite: string;
  type: 'Cotisation RH' | 'Bordereau Soins' | 'Paiement Prestataire';
  montant: number;
  statutPaiement: 'Payé' | 'En attente' | 'En retard';
  dateEcheance: string;
}

// Initial Seed Data for local fallback & Firestore bootstrap
export const INITIAL_SEED_DATA = {
  polices: [
    { id: 'pol-1', numeroPolice: 'POL-2026-9901', entrepriseNom: 'Rawbank RDC', formule: 'Neo-Sante Gold Plus', primeMensuelle: 12500, statut: 'Actif', nbAssures: 450, dateDebut: '01/01/2026', dateFin: '31/12/2026' },
    { id: 'pol-2', numeroPolice: 'POL-2026-8842', entrepriseNom: 'Vodacom Congo', formule: 'Neo-Sante Executive', primeMensuelle: 28400, statut: 'Actif', nbAssures: 1200, dateDebut: '15/01/2026', dateFin: '14/01/2027' },
  ] as PoliceInsurance[],
  assures: [
    { id: 'ass-1', matricule: 'EMP-9021', nom: 'NGALULA Grâce', email: 'g.ngalula@rawbank.cd', numeroCarte: 'NC-8820-9021', entrepriseNom: 'Rawbank RDC', formule: 'Neo-Sante Gold Plus', statut: 'Actif', soldePlafond: 3500000, ayantsDroit: [{ id: 'ay-1', nom: 'MUKENDI Jean', lien: 'Enfant' }] },
    { id: 'ass-2', matricule: 'EMP-4410', nom: 'KABANGU Patrick', email: 'p.kabangu@vodacom.cd', numeroCarte: 'NC-4410-1099', entrepriseNom: 'Vodacom Congo', formule: 'Neo-Sante Executive', statut: 'Actif', soldePlafond: 5000000, ayantsDroit: [] },
  ] as AssureMember[],
  prestataires: [
    { id: 'prest-1', codePrestataire: 'PR-KIN-001', nom: 'Hôpital du Cinquantenaire', type: 'Hôpital', ville: 'Kinshasa', telephone: '+243 81 000 1122', statutConvention: 'Conventionné' },
    { id: 'prest-2', codePrestataire: 'PR-KIN-042', nom: 'Centre Médical de la Gombe', type: 'Clinique', ville: 'Kinshasa', telephone: '+243 99 888 3344', statutConvention: 'Conventionné' },
  ] as PrestataireHealth[],
  soins: [
    { id: 'soin-1', codePriseEnCharge: 'PEC-2026-001', assureMatricule: 'EMP-9021', assureNom: 'NGALULA Grâce', prestataireNom: 'Centre Médical de la Gombe', acte: 'Consultation Spécialisée + Bilan', montantTotal: 120000, partAssureur: 96000, partPatient: 24000, statut: 'Accordé', createdAt: new Date().toISOString() },
  ] as SoinClaim[],
  derogations: [
    { id: 'derog-1', codeDerogation: 'DER-2026-104', demandeurType: 'Prestataire', demandeurNom: 'Hôpital du Cinquantenaire', patientNom: 'NGALULA Grâce', montant: 85000, motif: 'Dépassement de plafond examen scanner Y-2', statut: 'En attente', createdAt: new Date().toISOString() },
  ] as DerogationRequest[],
  factures: [
    { id: 'fac-1', reference: 'FAC-2026-0089', entite: 'Rawbank RDC', type: 'Cotisation RH', montant: 12500000, statutPaiement: 'Payé', dateEcheance: '05/02/2026' },
  ] as FactureBilling[],
};

const LOCAL_STORAGE_KEY = 'neogtec_platform_db_v1';

export class NeoGTecDatabaseService {
  private isOnline = true;

  constructor() {
    this.initLocalStorage();
  }

  private initLocalStorage() {
    if (typeof window === 'undefined') return;
    const existing = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_SEED_DATA));
    }
  }

  public getLocalData() {
    if (typeof window === 'undefined') return INITIAL_SEED_DATA;
    try {
      const data = localStorage.getItem(LOCAL_STORAGE_KEY);
      return data ? JSON.parse(data) : INITIAL_SEED_DATA;
    } catch {
      return INITIAL_SEED_DATA;
    }
  }

  public setLocalData(data: typeof INITIAL_SEED_DATA) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('neogtec_eco_sync', { detail: data }));
  }

  // Cloud Firestore CRUD Operations
  public async syncCollectionToCloud<T extends { id: string }>(colName: string, items: T[]) {
    try {
      const db = getDb();
      for (const item of items) {
        await setDoc(doc(db, colName, item.id), {
          ...item,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (err) {
      console.warn(`[Firestore Sync] Unable to sync ${colName} to cloud:`, err);
    }
  }

  public async addCloudRecord<T extends { id: string }>(colName: keyof typeof INITIAL_SEED_DATA, record: T) {
    // Local immediate update
    const current = this.getLocalData();
    const list = current[colName] || [];
    const updatedList = [record, ...list.filter((i: any) => i.id !== record.id)];
    current[colName] = updatedList as any;
    this.setLocalData(current);

    // Cloud background sync
    try {
      const db = getDb();
      await setDoc(doc(db, colName, record.id), {
        ...record,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn(`[Firestore Write] Saved locally. Cloud write delayed:`, err);
    }
  }

  public async updateCloudRecord<T extends { id: string }>(colName: keyof typeof INITIAL_SEED_DATA, id: string, patch: Partial<T>) {
    const current = this.getLocalData();
    const list = current[colName] || [];
    const updatedList = list.map((item: any) => item.id === id ? { ...item, ...patch } : item);
    current[colName] = updatedList as any;
    this.setLocalData(current);

    try {
      const db = getDb();
      await updateDoc(doc(db, colName, id), {
        ...patch,
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      console.warn(`[Firestore Update] Updated locally. Cloud sync delayed:`, err);
    }
  }

  public subscribeCloudCollection(colName: string, callback: (docs: any[]) => void) {
    try {
      const db = getDb();
      return onSnapshot(collection(db, colName), (snapshot) => {
        const items: any[] = [];
        snapshot.forEach((docSnap) => items.push({ id: docSnap.id, ...docSnap.data() }));
        if (items.length > 0) {
          callback(items);
        }
      }, (error) => {
        console.warn(`[Firestore Subscription] Fallback to local for ${colName}:`, error);
      });
    } catch {
      return () => {};
    }
  }
}

export const neoGTecDb = new NeoGTecDatabaseService();
