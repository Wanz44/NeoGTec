/**
 * 🛰️ Fichier : /supabase/functions/user-permissions/index.ts
 * 🎯 Objectif : Supabase Edge Function pour le calcul de permissions consolidées
 * Rôle : Résoudre la somme des permissions pour le jeton de sécurité d'un utilisateur de manière autoritaire.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.8";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

serve(async (req) => {
  // Gérer la prélégitimation CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
      }
    });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Autorisation requise" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    const token = authHeader.split(" ")[1];
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // 1. Récupérer l'ID utilisateur à partir de Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Session expirée" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }

    // 2. Interroger la vue consolidée via RPC has_permission
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError || !profile) {
      return new Response(JSON.stringify({ permissions: [] }), {
        status: 200,
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }

    // Interroger et consolider
    const { data: permissionsData, error: permError } = await supabase
      .from("role_permissions")
      .select("permission_code")
      .eq("role", profile.role);

    const list = permissionsData ? permissionsData.map((p) => p.permission_code) : [];

    return new Response(JSON.stringify({ permissions: list }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });

  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Interne" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
});
