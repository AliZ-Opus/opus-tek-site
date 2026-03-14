export type OfferStep = { title: string; text: string; proof: string };
export type OfferProof = { label: string; value: string; note: string };
export type OfferTrust = { title: string; text: string };
export type OfferData = {
  slug: string;
  domain: 'Architecture' | 'Ingénierie' | 'Intelligence';
  title: string;
  tagline: string;
  overview: string[];
  pains: string[];
  deliverables: string[];
  method: OfferStep[];
  proof: OfferProof[];
  trust: OfferTrust[];
  ctaLabel?: string;
};

export const offers: OfferData[] = [
  {
    slug: 'delivery-ti-integration',
    domain: 'Architecture',
    title: 'Delivery TI & Intégration',
    tagline:
      'Structurer et sécuriser les trajectoires d’intégration pour livrer sans zones grises.',
    overview: [
      'Cette offre cible les contextes où les dépendances techniques, la sécurité et les contraintes d’exploitation rendent le delivery fragile.',
      'OPUS intervient en mode Architecture First : cadrage des interfaces, contrats, environnements et séquencement d’exécution avant accélération du développement.',
    ],
    pains: [
      'Dépendances inter-équipes mal séquencées',
      'Interfaces/API peu tracées ou instables',
      'Environnements non prêts au bon moment',
    ],
    deliverables: [
      'Blueprint d’intégration',
      'Trajectoire par incréments',
      'Backlog technique priorisé',
      'Matrice dépendances / risques',
      'Plan environnements & readiness',
      'Points de contrôle sécurité',
      'Handover exploitable',
    ],
    method: [
      { title: 'Overview', text: 'Cadrage du contexte, contraintes, acteurs, interfaces et critères de succès.', proof: 'Scope clarifié + risques visibles' },
      { title: 'Method', text: 'Découpage du delivery en lots, contrats et gates de validation pour éviter les blocages tardifs.', proof: 'Séquencement + responsabilités explicites' },
      { title: 'Proof', text: 'Suivi de preuves dans le flux : décisions, validations, readiness et incidents évités.', proof: 'Preuves intégrées au delivery' },
      { title: 'Trust', text: 'Contrôles qualité, sécurité et traçabilité alignés au contexte client.', proof: 'Contrôles documentés et auditables' },
    ],
    proof: [
      { label: 'Blueprint', value: '1', note: 'architecture & intégration centralisées' },
      { label: 'Piliers', value: '6', note: 'capabilités de delivery orchestrées' },
      { label: 'Preuves', value: '9', note: 'points de contrôle / livrables tracés' },
    ],
    trust: [
      { title: 'Sécurité intégrée', text: 'Contrôles intégrés au cycle de livraison, pas ajoutés en fin de projet.' },
      { title: 'Traçabilité', text: 'Décisions, preuves et validations conservées dans les livrables.' },
      { title: 'Qualité de delivery', text: 'Gates pragmatiques et priorisation explicite des risques.' },
      { title: 'Transfert', text: 'Documentation exploitable par les équipes internes et partenaires.' },
    ],
  },
  {
    slug: 'renfort-strategique-equipes-flexibles',
    domain: 'Ingénierie',
    title: 'Renfort stratégique & Équipes flexibles',
    tagline:
      'Renforcer vos équipes avec une gouvernance de delivery claire, sans perdre la maîtrise.',
    overview: [
      'Cette offre combine expertise senior, renfort ciblé et cadence de livraison, avec un cadre de responsabilité explicite.',
      'Objectif : accélérer la capacité d’exécution sans multiplier les zones de friction entre équipes, fournisseurs et gouvernance.',
    ],
    pains: [
      'Capacité insuffisante sur les rôles critiques',
      'Responsabilités floues entre équipes et fournisseurs',
      'Priorisation instable et faible visibilité delivery',
    ],
    deliverables: [
      'Structure équipe / rôles',
      'Cadence de delivery',
      'Backlog / priorisation',
      'Rituels de décision',
      'Gates de qualité',
      'Tableau de preuves',
      'Plan de continuité',
    ],
    method: [
      { title: 'Overview', text: 'Clarification des rôles, objectifs, contraintes et indicateurs de pilotage.', proof: 'RACI + attentes alignées' },
      { title: 'Method', text: 'Mise en place d’une cadence courte avec priorisation et arbitrages explicites.', proof: 'Backlog vivant + ownership clair' },
      { title: 'Proof', text: 'Métriques de capacité, qualité et stabilité suivies dans les rituels.', proof: 'KPIs vérifiés et actionnables' },
      { title: 'Trust', text: 'Cadre opérationnel transparent pour éviter les dépendances implicites.', proof: 'Gouvernance simple, auditable' },
    ],
    proof: [
      { label: 'Domaines', value: '3', note: 'architecture, ingénierie, intelligence' },
      { label: 'Piliers', value: '6', note: 'capacité, qualité, sécurité, delivery...' },
      { label: 'Preuves', value: '9', note: 'indicateurs et livrables de pilotage' },
    ],
    trust: [
      { title: 'Pilotage lisible', text: 'Une cadence et des rôles qui évitent la dépendance à une seule personne.' },
      { title: 'Qualité pragmatique', text: 'Contrôles utiles sans ralentir inutilement le delivery.' },
      { title: 'Escalade claire', text: 'Mécanismes de décision et arbitrage définis à l’avance.' },
      { title: 'Intégration équipe', text: 'Renfort aligné sur les pratiques et contraintes du client.' },
    ],
  },
  {
    slug: 'acceleration-ia-automatisation',
    domain: 'Intelligence',
    title: 'Accélération IA & Automatisation',
    tagline:
      'Mettre en production des cas d’usage IA utiles, mesurables et gouvernés.',
    overview: [
      'L’IA n’est pas traitée comme une vitrine : nous priorisons les cas d’usage intégrables aux processus et plateformes existants.',
      'OPUS cadre les données, la gouvernance, les points de contrôle et l’exploitation pour une valeur observable.',
    ],
    pains: [
      'POCs IA non industrialisés',
      'Données/qualité non prêtes pour l’exploitation',
      'Absence de garde-fous et de supervision',
    ],
    deliverables: [
      'Cas d’usage priorisés',
      'Schéma de flux IA',
      'Règles de supervision',
      'Backlog d’industrialisation',
      'Garde-fous conformité',
      'Métriques de valeur',
      'Plan d’exploitation',
    ],
    method: [
      { title: 'Overview', text: 'Sélection des cas d’usage selon valeur, faisabilité et risques.', proof: 'Priorisation défendable' },
      { title: 'Method', text: 'Conception des flux IA, intégration aux systèmes et garde-fous d’exploitation.', proof: 'Architecture + supervision définies' },
      { title: 'Proof', text: 'Mesures de performance, qualité de sortie et adoption suivies par itération.', proof: 'Résultats vérifiés, pas supposés' },
      { title: 'Trust', text: 'Traçabilité des décisions et contrôles pour rassurer les parties prenantes.', proof: 'Cadre de confiance documenté' },
    ],
    proof: [
      { label: 'Cas', value: '3', note: 'priorisés pour valeur / faisabilité' },
      { label: 'Piliers', value: '6', note: 'data, sécurité, UX, exploitation...' },
      { label: 'Preuves', value: '9', note: 'mesures et livrables opérationnels' },
    ],
    trust: [
      { title: 'Conformité', text: 'Garde-fous de traitement, journalisation et responsabilités explicites.' },
      { title: 'Qualité de sortie', text: 'Métriques et critères d’acceptation pour éviter l’effet démo.' },
      { title: 'Exploitation', text: 'Supervision, incidents et support intégrés au dispositif.' },
      { title: 'Évolutivité', text: 'Backlog d’industrialisation et trajectoire incrémentale.' },
    ],
  },
];

export const offersBySlug = Object.fromEntries(offers.map((o) => [o.slug, o]));
