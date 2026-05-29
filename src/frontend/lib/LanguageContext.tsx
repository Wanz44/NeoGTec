import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'fr' | 'en' | 'pt';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, overrideDefault?: string) => string;
}

const TRANSLATIONS: Record<Language, Record<string, string>> = {
  fr: {
    // Global App Words
    'app.name': 'AssurAdvance',
    'app.tagline': 'Plateforme d\'Assurance Santé & Tiers Payant',
    'app.search_placeholder': 'Rechercher une police, un prestataire ou un dossier...',
    'app.help': 'Aide',
    'app.notifications': 'Alertes Récentes',
    'app.no_notifications': 'Aucune alerte récente',
    'app.user_profile': 'Profil Utilisateur',
    'app.language': 'Langue',
    'app.system_notification': 'Notification Système',

    // Primary Sidebar Menu Sections
    'modules.dashboard': 'Tableau de Bord',
    'modules.contracts': 'Gestion Polices & Sinistres',
    'modules.reclamation': 'Module Réclamations',
    'modules.payment': 'Gestion Financière',
    'modules.crm': 'CRM & Commercial',
    'modules.telemedicine': 'Module Télémédecine',
    'modules.claims': 'Sinistres & Contentieux',
    'modules.partners': 'Partenaires Hospitaliers',
    'modules.integrations': 'Interopérabilité',
    'modules.bi': 'Business Intelligence',
    'modules.system-config': 'Système',
    'modules.governance': 'Gouvernance & Multi-Entités',
    'modules.alerts': 'Alertes Critiques',
    'modules.admin': 'Administration Système',
    'modules.settings': 'Module Système',

    // Sidebar Sub-modules
    'submodules.contracts-config': 'Offres & Barèmes',
    'submodules.consumption-list': 'Consommations',
    'submodules.managers-list': 'Gestionnaires',
    'submodules.reclamation-submit': 'Soumission',
    'submodules.reclamation-followup': 'Suivie',
    'submodules.reclamation-dashboard': 'Tableau de bord',
    'submodules.crm-marketing': 'Marketing & PUB',
    'submodules.crm-performance': 'Gestion des performances',
    'submodules.crm-faq': 'FAQ Client',
    'submodules.crm-global-perf': 'Performance',
    'submodules.tele-consultation': 'Consultation',
    'submodules.tele-medical-records': 'Dossiers Patients',
    'submodules.tele-prescription': 'Ordonnances',
    'submodules.tele-history': 'Tableau de bord',
    'submodules.bi-global': 'Activité Globale',
    'submodules.bi-fraud': 'Détection Fraude',
    'submodules.bi-performance': 'Perf. Partenaires',
    'submodules.bi-forecasting': 'Prévisions Coûts',
    'submodules.billing-contributions': 'Suivi Cotisations',
    'submodules.billing-mobile-money': 'Mobile Money',
    'submodules.billing-reconciliation': 'Réconciliation',
    'submodules.billing-tax': 'Rapports Fiscaux',
    'submodules.claims-declaration': 'Déclaration',
    'submodules.claims-workflow': 'Suivi Dossier',
    'submodules.claims-expertise': 'Expertise Médicale',
    'submodules.claims-litigation': 'Contentieux',
    'submodules.partners-directory': 'Référentiel',
    'submodules.partners-contracting': 'Conventionnement',
    'submodules.partners-portal': 'Portail Prestataire',
    'submodules.partners-quality': 'Contrôle Qualité',
    'submodules.partners-tariffs': 'Gestion des Tarifs',

    'submodules.governance': 'Paramétrage & Governance',
    'submodules.saas-tenants': 'Module K.12 (SaaS / Locataires)',
    'submodules.team-permissions': 'Module K.13 (Équipe & Permissions)',
    'submodules.users-list': 'Utilisateurs & Rôles',
    'submodules.users-digital': 'Inscription Digitale',
    'submodules.users-selfcare': 'Portail Self-Care',
    'submodules.users-card': 'Cartes Virtuelles',
    'submodules.users-beneficiaries': 'Ayants-Droit',
    'submodules.users-security': 'Sécurité & MFA',
    'submodules.users-logs': 'Logs & Audits',
    'submodules.system-config': 'Monitoring & Système',
    'submodules.alerts': 'Surveillance & Alertes',
    'submodules.admin': 'Privilèges & Accès',

    // Specific messages / dialogs
    'common.cancel': 'Annuler',
    'common.confirm': 'Confirmer',
    'common.create': 'Créer',
    'common.delete': 'Supprimer',
    'common.save': 'Enregistrer',
    'common.edit': 'Modifier',
    'common.active': 'Active',
    'common.status': 'Statut',
    'common.archived': 'Archivée',
    'common.active-subtitle': 'Active & Publiée',
    'common.success': 'Succès',
    'common.error': 'Erreur',

    // Contracts UI Section
    'contracts.new_offer': 'Créer une Nouvelle Offre',
    'contracts.new_offer_desc': 'Nouvelle Offre de Contrat',
    'contracts.editing_rates': 'Édition des Plafonds & Tarifs',
    'contracts.offer_name': 'Nom de l\'Offre / Formule',
    'contracts.placeholder_offer': 'ex: Platinum Indestructible, Standard Santé',
    'contracts.annual_ceiling': 'Plafond Annuel ($)',
    'contracts.monthly_premium': 'Prime Mensuelle ($)',
    'contracts.copay': 'Ticket Modérateur',
    'contracts.fixed_deductible': 'Franchise Fixe ($)',
    'contracts.visual_tag': 'Couleur de Tag Visuel',
    'contracts.create_btn': 'Créer le Contrat',
    'contracts.success_toast': 'L\'offre a été créée avec succès et déployée au niveau mondial.',
    'contracts.archive_toast': 'L\'offre a été archivée avec succès.',
    'contracts.edit_rules': 'Éditer les Règles',
    'contracts.no_offers': 'Aucune Offre Disponible',
    'contracts.no_offers_subtitle': 'Veuillez cliquer sur "Créer une Nouvelle Offre" pour configurer un barème de contrat.',
    'contracts.dynamic_ceilings': 'Plafonds Dynamiques',
    'contracts.dynamic_ceilings_desc': 'Configurez des règles de plafonnement par spécialité médicale, type d\'acte ou période de carence. Les changements s\'appliquent instantanément aux nouvelles polices.',
    'contracts.manage_tariffs': 'Gérer les Barèmes ACT',
    'contracts.audit_history': 'Audit Historique',
    'contracts.calc_algorithm': 'Algorithme de Calcul',
    'contracts.calc_algorithm_desc': 'Notre moteur IA analyse le risque historique pour suggérer les meilleurs plafonds par segment démographique.',
    'contracts.risk_report': 'Rapport de Risque',
    'contracts.certification': 'Certification Actuarielle 2024',
  },
  en: {
    // Global App Words
    'app.name': 'AssurAdvance',
    'app.tagline': 'Health Insurance & Third-Party Payer Platform',
    'app.search_placeholder': 'Search for a policy, provider or claim...',
    'app.help': 'Help',
    'app.notifications': 'Recent Alerts',
    'app.no_notifications': 'No recent alerts',
    'app.user_profile': 'User Profile',
    'app.language': 'Language',
    'app.system_notification': 'System Notification',

    // Primary Sidebar Menu Sections
    'modules.dashboard': 'Dashboard',
    'modules.contracts': 'Policy & Claim Management',
    'modules.reclamation': 'Complaints Module',
    'modules.payment': 'Financial Management',
    'modules.crm': 'CRM & Sales',
    'modules.telemedicine': 'Telemedicine Module',
    'modules.claims': 'Claims & Litigation',
    'modules.partners': 'Healthcare Partners',
    'modules.integrations': 'Interoperability',
    'modules.bi': 'Business Intelligence',
    'modules.system-config': 'System',
    'modules.governance': 'Governance & Multi-Tenancy',
    'modules.alerts': 'Critical Alerts',
    'modules.admin': 'System Administration',
    'modules.settings': 'System Module',

    // Sidebar Sub-modules
    'submodules.contracts-config': 'Offers & Schedules',
    'submodules.consumption-list': 'Consumptions',
    'submodules.managers-list': 'Managers',
    'submodules.reclamation-submit': 'Submission',
    'submodules.reclamation-followup': 'Follow-up',
    'submodules.reclamation-dashboard': 'Dashboard',
    'submodules.crm-marketing': 'Marketing & Ads',
    'submodules.crm-performance': 'Performance Management',
    'submodules.crm-faq': 'Customer FAQ',
    'submodules.crm-global-perf': 'Performance',
    'submodules.tele-consultation': 'Consultation',
    'submodules.tele-medical-records': 'Patient Records',
    'submodules.tele-prescription': 'Prescriptions',
    'submodules.tele-history': 'Dashboard',
    'submodules.bi-global': 'Global Activity',
    'submodules.bi-fraud': 'Fraud Detection',
    'submodules.bi-performance': 'Partner Perf.',
    'submodules.bi-forecasting': 'Cost Forecasting',
    'submodules.billing-contributions': 'Premium Tracking',
    'submodules.billing-mobile-money': 'Mobile Money',
    'submodules.billing-reconciliation': 'Reconciliation',
    'submodules.billing-tax': 'Tax Reports',
    'submodules.claims-declaration': 'Declaration',
    'submodules.claims-workflow': 'Claim Tracking',
    'submodules.claims-expertise': 'Medical Expertise',
    'submodules.claims-litigation': 'Litigation',
    'submodules.partners-directory': 'Directory',
    'submodules.partners-contracting': 'Contracting',
    'submodules.partners-portal': 'Provider Portal',
    'submodules.partners-quality': 'Quality Control',
    'submodules.partners-tariffs': 'Tariff Management',

    'submodules.governance': 'Configuration & Governance',
    'submodules.saas-tenants': 'Module K.12 (SaaS / Tenants)',
    'submodules.team-permissions': 'Module K.13 (Team & Permissions)',
    'submodules.users-list': 'Users & Roles',
    'submodules.users-digital': 'Digital Registration',
    'submodules.users-selfcare': 'Self-Care Portal',
    'submodules.users-card': 'Virtual Cards',
    'submodules.users-beneficiaries': 'Beneficiaries',
    'submodules.users-security': 'Security & MFA',
    'submodules.users-logs': 'Logs & Audits',
    'submodules.system-config': 'Monitoring & System',
    'submodules.alerts': 'Monitoring & Alerts',
    'submodules.admin': 'Privileges & Access',

    // Specific messages / dialogs
    'common.cancel': 'Cancel',
    'common.confirm': 'Confirm',
    'common.create': 'Create',
    'common.delete': 'Delete',
    'common.save': 'Save',
    'common.edit': 'Edit',
    'common.active': 'Active',
    'common.status': 'Status',
    'common.archived': 'Archived',
    'common.active-subtitle': 'Active & Published',
    'common.success': 'Success',
    'common.error': 'Error',

    // Contracts UI Section
    'contracts.new_offer': 'Create a New Offer',
    'contracts.new_offer_desc': 'New Contract Offer',
    'contracts.editing_rates': 'Edit Ceilings & Premium Rates',
    'contracts.offer_name': 'Offer Name / Plan',
    'contracts.placeholder_offer': 'e.g. Platinum Indestructible, Standard Health',
    'contracts.annual_ceiling': 'Annual Ceiling ($)',
    'contracts.monthly_premium': 'Monthly Premium ($)',
    'contracts.copay': 'Co-payment / Out of Pocket',
    'contracts.fixed_deductible': 'Fixed Deductible ($)',
    'contracts.visual_tag': 'Visual Tag Color',
    'contracts.create_btn': 'Create Contract',
    'contracts.success_toast': 'The offer has been successfully created and deployed globally.',
    'contracts.archive_toast': 'The offer has been archived successfully.',
    'contracts.edit_rules': 'Edit Rules',
    'contracts.no_offers': 'No Offers Available',
    'contracts.no_offers_subtitle': 'Please click "Create a New Offer" to configure a contract tier.',
    'contracts.dynamic_ceilings': 'Dynamic Ceilings',
    'contracts.dynamic_ceilings_desc': 'Configure ceiling rules by medical specialty, treatment type, or waiting period. Changes apply instantly to new policies.',
    'contracts.manage_tariffs': 'Manage ACT Tariffs',
    'contracts.audit_history': 'Historical Audit',
    'contracts.calc_algorithm': 'Calculative Algorithm',
    'contracts.calc_algorithm_desc': 'Our AI engine analyzes historical risk factors to suggest the best ceilings by demographic segment.',
    'contracts.risk_report': 'Risk Report',
    'contracts.certification': 'Actuarial Certification 2024',
  },
  pt: {
    // Global App Words
    'app.name': 'AssurAdvance',
    'app.tagline': 'Plataforma de Seguro de Saúde e Terceiros de Pagamento',
    'app.search_placeholder': 'Buscar por apólice, prestador ou reclamação...',
    'app.help': 'Ajuda',
    'app.notifications': 'Alertas Recentes',
    'app.no_notifications': 'Sem alertas recentes',
    'app.user_profile': 'Perfil do Usuário',
    'app.language': 'Idioma',
    'app.system_notification': 'Notificação do Sistema',

    // Primary Sidebar Menu Sections
    'modules.dashboard': 'Painel de Controle',
    'modules.contracts': 'Apólices e Sinistros',
    'modules.reclamation': 'Módulo de Reclamações',
    'modules.payment': 'Gestão Financeira',
    'modules.crm': 'CRM & Vendas',
    'modules.telemedicine': 'Módulo de Telemedicina',
    'modules.claims': 'Sinistros e Contencioso',
    'modules.partners': 'Parceiros Hospitalares',
    'modules.integrations': 'Interoperabilidade',
    'modules.bi': 'Business Intelligence',
    'modules.system-config': 'Sistema',
    'modules.governance': 'Governança & Multi-SaaS',
    'modules.alerts': 'Alertas Críticos',
    'modules.admin': 'Administração do Sistema',
    'modules.settings': 'Módulo do Sistema',

    // Sidebar Sub-modules
    'submodules.contracts-config': 'Ofertas e Tarifas',
    'submodules.consumption-list': 'Consumos',
    'submodules.managers-list': 'Gerentes',
    'submodules.reclamation-submit': 'Submissão',
    'submodules.reclamation-followup': 'Acompanhamento',
    'submodules.reclamation-dashboard': 'Painel de Controle',
    'submodules.crm-marketing': 'Marketing & Publicidade',
    'submodules.crm-performance': 'Gestão de Desempenho',
    'submodules.crm-faq': 'FAQ de Clientes',
    'submodules.crm-global-perf': 'Desempenho',
    'submodules.tele-consultation': 'Consulta',
    'submodules.tele-medical-records': 'Prontuários de Pacientes',
    'submodules.tele-prescription': 'Receitas Médicas',
    'submodules.tele-history': 'Painel de Controle',
    'submodules.bi-global': 'Atividade Global',
    'submodules.bi-fraud': 'Detecção de Fraude',
    'submodules.bi-performance': 'Desempenho de Parceiros',
    'submodules.bi-forecasting': 'Previsão de Custos',
    'submodules.billing-contributions': 'Rastreio de Contribuições',
    'submodules.billing-mobile-money': 'Dinheiro Móvel',
    'submodules.billing-reconciliation': 'Reconciliação',
    'submodules.billing-tax': 'Relatórios Fiscais',
    'submodules.claims-declaration': 'Declaração',
    'submodules.claims-workflow': 'Fluxo do Processo',
    'submodules.claims-expertise': 'Perícia Médica',
    'submodules.claims-litigation': 'Contencioso',
    'submodules.partners-directory': 'Registo',
    'submodules.partners-contracting': 'Parcerias',
    'submodules.partners-portal': 'Portal de Prestadores',
    'submodules.partners-quality': 'Controlo de Qualidade',
    'submodules.partners-tariffs': 'Gestão de Tarifas',

    'submodules.governance': 'Configuração e Governança',
    'submodules.saas-tenants': 'Módulo K.12 (SaaS / Locatários)',
    'submodules.team-permissions': 'Módulo K.13 (Equipe & Permissões)',
    'submodules.users-list': 'Usuários & Funções',
    'submodules.users-digital': 'Registo Digital',
    'submodules.users-selfcare': 'Portal Self-Care',
    'submodules.users-card': 'Cartões Virtuais',
    'submodules.users-beneficiaries': 'Beneficiários',
    'submodules.users-security': 'Segurança & MFA',
    'submodules.users-logs': 'Logs e Auditorias',
    'submodules.system-config': 'Monitoramento e Sistema',
    'submodules.alerts': 'Monitoramento & Alertas',
    'submodules.admin': 'Privilégios & Acessos',

    // Specific messages / dialogs
    'common.cancel': 'Cancelar',
    'common.confirm': 'Confirmar',
    'common.create': 'Criar',
    'common.delete': 'Excluir',
    'common.save': 'Salvar',
    'common.edit': 'Editar',
    'common.active': 'Ativo',
    'common.status': 'Status',
    'common.archived': 'Arquivado',
    'common.active-subtitle': 'Ativo e Publicado',
    'common.success': 'Sucesso',
    'common.error': 'Erro',

    // Contracts UI Section
    'contracts.new_offer': 'Criar Nova Oferta',
    'contracts.new_offer_desc': 'Nova Oferta de Contrato',
    'contracts.editing_rates': 'Edição de Tetos e Prêmios',
    'contracts.offer_name': 'Nome da Oferta / Plano',
    'contracts.placeholder_offer': 'ex: Platinum Inquebrável, Saúde Padrão',
    'contracts.annual_ceiling': 'Teto Anual ($)',
    'contracts.monthly_premium': 'Prêmio Mensal ($)',
    'contracts.copay': 'Co-pagamento',
    'contracts.fixed_deductible': 'Franquia Fixa ($)',
    'contracts.visual_tag': 'Cor do Marcador Visual',
    'contracts.create_btn': 'Criar Contrato',
    'contracts.success_toast': 'A oferta foi criada com sucesso e implantada globalmente.',
    'contracts.archive_toast': 'A oferta foi arquivada com sucesso.',
    'contracts.edit_rules': 'Editar Regras',
    'contracts.no_offers': 'Nenhuma Oferta Disponível',
    'contracts.no_offers_subtitle': 'Por favor clique em "Criar Nova Oferta" para configurar limites e custos.',
    'contracts.dynamic_ceilings': 'Tetos Dinâmicos',
    'contracts.dynamic_ceilings_desc': 'Configure regras de limitação por especialidade médica, tipo de procedimento ou carência. Alterações são aplicadas instantaneamente.',
    'contracts.manage_tariffs': 'Gerenciar Tarifas ACT',
    'contracts.audit_history': 'Auditoria Histórica',
    'contracts.calc_algorithm': 'Algoritmo de Cálculo',
    'contracts.calc_algorithm_desc': 'Nosso motor IA analisa o risco com base no histórico para sugerir os melhores tetos por segmento demográfico.',
    'contracts.risk_report': 'Relatório de Risco',
    'contracts.certification': 'Certificação Atuarial 2024',
  }
};

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('assur_advance_lang');
    if (saved === 'fr' || saved === 'en' || saved === 'pt') {
      return saved;
    }
    return 'fr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('assur_advance_lang', lang);
  };

  const t = (key: string, overrideDefault?: string): string => {
    const translationSet = TRANSLATIONS[language];
    if (translationSet && translationSet[key]) {
      return translationSet[key];
    }
    
    // Check French as fallback
    const fallbackSet = TRANSLATIONS['fr'];
    if (fallbackSet && fallbackSet[key]) {
      return fallbackSet[key];
    }

    return overrideDefault || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
