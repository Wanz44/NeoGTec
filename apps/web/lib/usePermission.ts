/**
 * 🛰️ Fichier : /apps/web/lib/usePermission.ts
 * 🎯 Objectif : Hook client-side usePermission utilisant SWR pour l'edge caching
 * CONFORMITÉ : ARCA-RDC / ISO 27001, Cache TTL 60s
 */

import useSWR from "swr";
import { PermissionCode } from "./permissions";

// Fetcher standard sécurisé pour récupérer les permissions du connecté
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Impossible de récupérer les permissions utilisateur");
  }

  const data = await response.json();
  return data.permissions as string[];
};

export function usePermissionSWR(permission: PermissionCode): boolean {
  // Appeler l'API de permissions consolidées avec mise en cache SWR (revalidate-on-focus, dedup)
  const { data: permissions, error } = useSWR("/api/user-permissions", fetcher, {
    dedupingInterval: 60 * 1000, // Caching local client de 60 secondes cohérent avec l'Edge Function
    revalidateOnFocus: false, // Évite les appels intempestifs en arrière-plan
    fallbackData: [], // Valeurs par défaut vides (Zero-Trust)
  });

  if (error || !permissions) {
    // En cas de problème de réseau ou hors-ligne, fallback sécurisé temporaire via localStorage
    const savedUserStr = typeof window !== "undefined" ? localStorage.getItem("assur_current_user") : null;
    if (savedUserStr) {
      try {
        const user = JSON.parse(savedUserStr);
        if (user.role === "SUPER_ADMIN" || user.role === "super_admin") {
          return true; // Les super administrateurs conservent leur accès de sauvegarde d'urgence
        }
      } catch {
        return false;
      }
    }
    return false;
  }

  // Traiter le cas du Super Admin par défaut
  if (permissions.includes("super_admin") || permissions.includes("Staff.all")) {
    return true;
  }

  return permissions.includes(permission);
}

export default usePermissionSWR;
