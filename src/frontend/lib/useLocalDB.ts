import { useState, useEffect } from 'react';
import { LocalDB, DBCompte, DBDossierMedical, DBPermissionRole, DBNotification, DBContrat, DBPaiement, DBDerogation } from './localDatabase';

export function useLocalDB() {
  const [comptes, setComptes] = useState<DBCompte[]>(() => LocalDB.getComptes());
  const [dossiersMedicaux, setDossiersMedicaux] = useState<DBDossierMedical[]>(() => LocalDB.getDossiersMedicaux());
  const [permissions, setPermissions] = useState<DBPermissionRole[]>(() => LocalDB.getPermissions());
  const [notifications, setNotifications] = useState<DBNotification[]>(() => LocalDB.getNotifications());
  const [contrats, setContrats] = useState<DBContrat[]>(() => LocalDB.getContrats());
  const [paiements, setPaiements] = useState<DBPaiement[]>(() => LocalDB.getPaiements());
  const [derogations, setDerogations] = useState<DBDerogation[]>(() => LocalDB.getDerogations());

  const refresh = () => {
    setComptes(LocalDB.getComptes());
    setDossiersMedicaux(LocalDB.getDossiersMedicaux());
    setPermissions(LocalDB.getPermissions());
    setNotifications(LocalDB.getNotifications());
    setContrats(LocalDB.getContrats());
    setPaiements(LocalDB.getPaiements());
    setDerogations(LocalDB.getDerogations());
  };

  useEffect(() => {
    const unsubscribe = LocalDB.subscribe(refresh);
    return () => unsubscribe();
  }, []);

  return {
    comptes,
    dossiersMedicaux,
    permissions,
    notifications,
    contrats,
    paiements,
    derogations,
    refresh,
    // Méthodes directes
    creerCompte: LocalDB.creerCompte.bind(LocalDB),
    updateCompte: LocalDB.updateCompte.bind(LocalDB),
    creerDossierMedical: LocalDB.creerDossierMedical.bind(LocalDB),
    updatePermission: LocalDB.updatePermission.bind(LocalDB),
    ajouterNotification: LocalDB.ajouterNotification.bind(LocalDB),
    marquerNotifLue: LocalDB.marquerNotifLue.bind(LocalDB),
    creerContrat: LocalDB.creerContrat.bind(LocalDB),
    ajouterAyantDroit: LocalDB.ajouterAyantDroit.bind(LocalDB),
    enregistrerPaiement: LocalDB.enregistrerPaiement.bind(LocalDB),
    creerDerogation: LocalDB.creerDerogation.bind(LocalDB),
    traiterDerogation: LocalDB.traiterDerogation.bind(LocalDB)
  };
}
