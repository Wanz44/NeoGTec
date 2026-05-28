# Architecture & DDL PostgreSQL - NeoGTec Core

Ce dossier contient le code source de script de base de données PostgreSQL destiné à l'environnement de production de **NeoGTec**. La structure respecte la séparation stricte des privilèges de conformité **ISO/IEC 27001:2026** et la **réglementation ARCA / CNIL**.

## Classe & Tables Clés

Le fichier `/database/schema.sql` initialise la base de données relationnelle hautement sécurisée :

### 1. Sécurité & Identification des Opérateurs (`core.users`)
* Comprend le statut de chiffrement de mot de passe, l'activation forte de l'authentification **MFA** et l'isolation pays/devises (CDF, USD, EUR).

### 2. Le Registre WORM d'Audit Continu (`core.audit_logs_worm`)
* **Critère ISO-27001 :** Il est interdit de détruire ou de modifier un historique de sécurité.
* Un **Trigger PL/pgSQL** nommé `trigger_protect_audit_trail` intercepte toute requête d'écriture `UPDATE` ou `DELETE` pour lever une exception fatale :
  ```sql
  RAISE EXPLICIT_ERROR 'CRITICAL: Security Breach Incident. Audit logs are strictly WORM (Write Once Read Many).';
  ```
* Chaque enregistrement calcule un sceau cryptographique digest unique de validation chiffrée reposant sur l'ensemble de ses lignes de données.

### 3. Le Processus Financier Critique "4-Eyes Rule" (`core.transactions_4eyes`)
* Pour éviter la fraude interne ou le détournement de paiement, tout virement doit être co-signé.
* Une contrainte de table Postgres vérifie l'absence de collusion à l'écriture :
  ```sql
  ALTER TABLE transactions_4eyes 
  ADD CONSTRAINT enforce_different_operators 
  CHECK (admin_a_initiator_id <> admin_b_approver_id OR admin_b_approver_id IS NULL);
  ```
  *L'initiateur (Administrateur A) ne peut pas approuver sa propre transaction financière.*

### 4. Filtre d'Élimination Douce "Soft Delete" (`core.establishments`)
* Les cliniques partenaires et les records d'assurés sensibles ne sont jamais détruits physiquement. La colonne `deleted_at TIMESTAMP` stocke le hachage d'annulation et des index partiels sont automatiquement déployés :
  ```sql
  CREATE INDEX idx_establishments_active ON establishments(id) WHERE deleted_at IS NULL;
  ```

---

## Guide de Déploiement

Connectez-vous à votre service PostgreSQL Cloud SQL ou conteneurisé, puis exécutez le script d'initialisation :

```bash
psql -h <HOST_PORT> -U postgres -d neogtec_prod -f database/schema.sql
```
