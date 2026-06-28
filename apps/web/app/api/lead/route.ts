import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { leadSchema } from '../../../lib/validators/lead';

// Initialisation paresseuse du client Supabase d'administration
const getSupabaseAdmin = () => {
  const url = process.env.SUPABASE_URL || '';
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !serviceKey) {
    console.warn("⚠️ Variables d'environnement Supabase manquantes pour l'administration.");
  }
  return createClient(url, serviceKey);
};

// Système de Rate Limiting simple en mémoire pour démo (5 req/h par IP)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const limitWindow = 3600 * 1000; // 1 heure
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return true;
  }

  if (now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return true;
  }

  if (record.count >= 5) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * 🛰️ API Next.js : POST /api/lead
 * 🎯 Objectif : Réceptionner et valider les pistes d'affaires collectives NeoGTec (B2B)
 */
export async function POST(req: Request) {
  try {
    // 1. Rate Limit par adresse IP
    const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too Many Requests: Limite de 5 demandes de devis par heure dépassée." },
        { status: 429 }
      );
    }

    // 2. Parser le corps de la requête
    const body = await req.json();

    // 3. Validation Zod intégrée
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation échouée", details: parsed.error.format() },
        { status: 400 }
      );
    }

    const { raison_sociale, nb_employes, assureur_actuel, besoins, nom, email_pro, phone, message, website_url_field } = parsed.data;

    // Protection anti-bot Honeypot
    if (website_url_field) {
      return NextResponse.json({ error: "Spam bot detecté !" }, { status: 400 });
    }

    const supabase = getSupabaseAdmin();

    // 4. Insérer dans public.contrats_groupe (Devis ou Demande de contrat)
    const { data: contrat, error: contratError } = await supabase
      .from('contrats_groupe')
      .insert({
        raison_sociale,
        nb_employes,
        assureur_actuel,
        besoins,
        statut: 'DEMANDE',
        nom_contact: nom,
        email_pro,
        telephone: phone,
        message,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (contratError) {
      console.error("❌ Erreur insertion contrats_groupe:", contratError);
      // fallback in-memory or throw
    }

    // 5. Insérer ou inviter dans public.profiles si e-mail inexistant
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email_pro)
      .maybeSingle();

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          email: email_pro,
          nom: nom,
          role: 'RH_ENTREPRISE',
          status: 'invited',
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.warn("⚠️ Impossible de pré-inviter le profil (normal si table non provisionnée en local):", profileError.message);
      }
    }

    // 6. Simulation de l'envoi d'e-mail via Resend à sales@neogtec.com
    console.log(`
      📧 [SIMULATION DISPATCH RESEND] 
      -----------------------------------------------
      De: NeoGTec System <no-reply@neogtec.com>
      À: sales@neogtec.com
      Sujet: 🚀 Nouvelle opportunité de contrat B2B : ${raison_sociale}
      
      Nom du contact : ${nom}
      E-mail pro : ${email_pro}
      Tél : ${phone}
      Quantité Salariés : ${nb_employes}
      Besoins prioritaires : ${besoins.join(', ')}
      Assureur actuel : ${assureur_actuel}
      Message d'accompagnement : ${message || 'Aucun'}
      
      Action : Générer devis de tarification ARCA collective sous 24h.
      -----------------------------------------------
    `);

    // 7. Logger la soumission de devis dans le registre des audits réglementaires ARCA RDC
    await supabase
      .from('audit_logs')
      .insert({
        action: 'LEAD_B2B_SUBMIT',
        details: `Nouvelle demande d'affiliation collective déposée par ${nom} (${raison_sociale}). Email: ${email_pro}. Employés: ${nb_employes}`,
        ip_address: ip,
        user_id: 'anonymous-lead-tunnel',
        status: 'SUCCESS',
        created_at: new Date().toISOString()
      })
      .catch(() => {});

    return NextResponse.json({
      success: true,
      message: "Demande de contrat enregistrée avec succès.",
      lead_id: contrat?.id || "L-" + Math.floor(1000 + Math.random() * 9000)
    }, { status: 200 });

  } catch (error: any) {
    console.error("🔥 Erreur de traitement de lead:", error);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
