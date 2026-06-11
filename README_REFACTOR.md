# 🛡️ Architecture de Sécurité Multi-Tenant & RBAC — NeoGTec

Ce document présente le rapport d'architecture de refactoring de sécurité mis en œuvre pour garantir l'étanchéité absolue des données assurés multi-tenant et le contrôle d'accès basé sur les rôles (RBAC) pour NeoGTec. 

Le système est conçu en conformité avec la réglementation **ARCA-RDC** (Autorité de Régulation et de Contrôle des Assurances en RDC).

---

## 🗺️ Cartographie des Fichiers de Sécurité Créés

Voici la description et la responsabilité de chacun des fichiers introduits :

### 1. `supabase/migrations/999_consolidate_rls.sql`
*   **Responsabilité :** Sécurité de la Base de Données (PostgreSQL) au repos et en transit.
*   **Détails :** 
    *   Active le **Row Level Security (RLS)** sur toutes les tables de données sensibles (`tenants`, `profiles`, `prises_en_charge`, `dossier_medical`).
    *   Crée la fonction `set_tenant_context(tenant_id, is_staff)` dotée du privilège `SECURITY DEFINER` de sorte que le Middleware ou les Edge Functions puissent injecter l'ID de locataire sans faille de permission.
    *   Garantit la politique restrictive clé : **Plus besoin d'indiquer explicitement `WHERE tenant_id = <val>` dans vos requêtes front-end**, Postgres applique l'isolation de locataire à la volée.
    *   Établit des règles granulaires métier (`medecin_own_pec`, `assure_own_data`, `auditeur_read_only`) interdisant l'écriture d'informations hors limite pour les différents profils.

### 2. `supabase/functions/_middleware.ts`
*   **Responsabilité :** Guardrail aux bornes Edge de Supabase (Deno Runtime).
*   **Détails :** 
    *   S'exécute en interception automatique sur l'ensemble des routes d'Edge Functions.
    *   Valide le JWT de l'utilisateur (`auth.uid()`) auprès de Supabase Auth.
    *   Bloque instantanément l'exécution si le profil est marqué `status="suspended"`, en extrayant et affichant le motif de suspension de l'administrateur.
    *   Bypass l'accès et force la redirection vers `/onboarding` si le flag légal de sécurité `must_change_password=true` est détecté.
    *   Applique de manière imperméable le contexte de locataire RLS en exécutant `set_tenant_context` avec le jeton sécurisé.

### 3. `apps/web/middleware.ts`
*   **Responsabilité :** Filtrage de Routage applicatif (Next.js 14 App Router Middleware).
*   **Détails :** 
    *   Protège de manière groupée les segments d'URL d'entreprise selon le modèle RBAC :
        *   `/saas/*` : Restreint aux comptes de l'équipe NeoGTec (`super_admin`, `support_neogtec`).
        *   `/hopital/*` : Restreint aux praticiens médicaux et direction d'établissement (`medecin`, `admin_prestataire`).
        *   `/finance/*` : Garantie l'obligation d'avoir la permission granulaire `'finance.pay'`.
    *   Génère de façon asynchrone une réponse de redirection `307` vers la page `/403` (Accès Refusé) en cas d'effraction suspectée.

### 4. `apps/web/lib/permissions.ts`
*   **Responsabilité :** Fichier de gouvernance centrale des droits utilisateur et Interface Hooks.
*   **Détails :**
    *   Spécifie l'objet congelé **`PERMISSIONS` regroupant exactement 50 codes métiers fins** (par ex : `pec.approve`, `finance.pay`, `SaaS.tenants.suspend`, `dossier_medical.access` etc.) garantissant l'absence de fausse saisie typographique.
    *   Implémente le React hook réactif `usePermission(code: PermissionCode)` qui interroge l'Edge RPC ou fallback en lecture sécurisée hors ligne du profil.
    *   Expose le hook `useRole()` utile pour s'adapter dynamiquement aux contextes de multi-permissions.

### 5. `supabase/functions/get_user_permissions/index.ts`
*   **Responsabilité :** Consolidation dynamique des permissions.
*   **Détails :**
    *   Résout la somme des permissions accordées : `Permissions du Rôle Principal` + `Surcharges d'Overrides Spécifiques` (Grants/Revocations).
    *   Utilise un stockage asynchrone d'Edge Caching avec un TTL de **60 secondes** pour éliminer les appels réseaux consécutifs, augmentant radicalement les performances des requêtes.

### 6. 🛠️ Composants Refactorisés (Plus de `if(role === 'admin')`)
Les boutons d'action d'échelle ont été entièrement réécrits pour utiliser la validation modulaire par permission :
1.  **`ApproveButton.tsx` (`(hopital)/pec/[id]`) :** Utilise la permission `'pec.approve'`. S'affiche en verrouillé sécurisé si manquant.
2.  **`PayButton.tsx` (`(rh)/cotisations`) :** Utilise `'finance.pay'`. Déclenche l'appel de virement sécurisé uniquement si autorisé.
3.  **`SuspendButton.tsx` (`(saas)/tenants`) :** Restreint l'interrupteur d'extinction de locataire à `'SaaS.tenants.suspend'`.
4.  **`Sidebar.tsx` (`components/`) :** Masque entièrement du menu vertical les modules SaaS, Finance, ou Hôpital si l'utilisateur n'en possède pas le droit partiel de lecture, évitant ainsi le "Button Visible Bypass".
5.  **`AccessButton.tsx` (`(medecin)/dossier-medical`) :** Chiffre/Déchiffre cryptographiquement l'historique de santé si la clé `'dossier_medical.access'` est confirmée.

---

## 🧪 Tests d'Intégration & Conformité (`tests/compliance.spec.ts`)

Pour assurer une de non-régression à l'échelle industrielle, les scénarios de test Playwright automatisés vérifient :
*   **Test de Paul :** Il possède les privilèges et voit la console SaaS.
*   **Test de Marie :** Authentifiée en RH, l'onglet SaaS n'existe pas en barre latérale et l'accès forcé par URL est bloqué en 403.
*   **Test de Jean :** Connecté en Support ou autre profil, l'approbation de PEC lui est refusée et s'affiche sous forme de badge scellé non interactif.
