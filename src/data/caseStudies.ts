export interface StrategicCaseStudy {
  slug: string;
  title: string;
  eyebrow: string;
  homeSummary: string;
  resourcesSummary: string;
  pageTitle: string;
  pageDescription: string;
  intro: string;
  sections: { title: string; body: string }[];
}

export const strategicCaseStudies: StrategicCaseStudy[] = [
  {
    slug: "fonder-une-plateforme-de-services",
    title: "Fonder une plateforme de services dans un contexte public complexe",
    eyebrow: "PREUVE PRINCIPALE 1",
    homeSummary:
      "Un objet institutionnellement sensible a été repris à sa base pour devenir plus clair, plus cohérent et plus tenable sur une fondation de services principalement portée par ServiceNow.",
    resourcesSummary:
      "Pour voir comment OPUS reprend un sujet encore trop ambigu pour supporter des arbitrages durables et le transforme en fondation de services plus nette et plus tenable.",
    pageTitle:
      "Fonder une plateforme de services dans un contexte public complexe - OPUS Technology",
    pageDescription:
      "Comment OPUS a fondé une plateforme de services dans un contexte public complexe en recentrant le sujet, en clarifiant les choix structurants et en tenant la logique de service sur ServiceNow.",
    intro:
      "Le sujet n'était pas de produire une plateforme de plus. Le sujet était de rendre un objet institutionnellement sensible plus clair, plus cohérent et plus tenable, sur une fondation reposant principalement sur ServiceNow et sur un nombre limité de processus structurants clairement assumés.",
    sections: [
      {
        title: "1. Situation de départ",
        body: "La nécessité de mieux organiser les services faisait peu débat. En revanche, la manière de le faire tenait encore sur des bases trop instables pour supporter durablement les arbitrages à venir. La plateforme était attendue à la fois comme cadre de structuration, comme levier de simplification, comme support de coordination et comme socle d'évolution.",
      },
      {
        title: "2. Tension institutionnelle",
        body: "Le problème n'était pas un manque d'activité. Le problème était un objet encore trop ambigu pour devenir une base fiable de décision. Selon les lectures, le sujet ne portait ni tout à fait sur les mêmes services, ni sur le même niveau de fondation, ni sur le même partage de responsabilités.",
      },
      {
        title: "3. Ce qu'OPUS a recadré",
        body: "Le travail n'a pas consisté à ajouter une couche de structuration sur un sujet encore instable. Il a consisté à reprendre le sujet à sa base. La question devenait : quelle plateforme est réellement en train d'être fondée, à quel niveau, dans quel périmètre, avec quelles responsabilités explicites et sur quelles bases d'arbitrage.",
      },
      {
        title: "4. Socle technologique et logique de service",
        body: "Le choix de fondation s'est établi autour d'une logique simple : la plateforme repose principalement sur ServiceNow, non comme simple outil de tickets, mais comme socle de structuration, d'orchestration et de tenue du modèle de services. Sa valeur vient de sa capacité à soutenir un cadre cohérent de demandes, d'approbations, de traitement, de traçabilité et d'évolution.",
      },
      {
        title: "5. Choix structurants et effet obtenu",
        body: "Le travail a ensuite porté sur les choix structurants sans lesquels la plateforme serait restée exposée aux dérives de périmètre, aux ambiguïtés de responsabilité et aux lectures incompatibles de son rôle. Le résultat central n'est pas un effet d'annonce : la plateforme devient plus lisible, plus robuste et plus tenable dans l'arbitrage.",
      },
    ],
  },
  {
    slug: "fondation-client-360-multi-plateforme",
    title: "Fondation d'une plateforme Client 360 multi-plateforme en contexte public complexe",
    eyebrow: "PREUVE PRINCIPALE 2",
    homeSummary:
      "Un dispositif client déjà engagé a été repris pour redevenir une fondation plus lisible, plus cohérente et plus gouvernable autour de Dynamics 365 et Power Platform.",
    resourcesSummary:
      "Pour voir comment OPUS reprend une fondation Client 360 encore trop ambiguë et clarifie les rôles entre plateformes, données, accès et exécution.",
    pageTitle:
      "Fondation d'une plateforme Client 360 multi-plateforme en contexte public complexe - OPUS Technology",
    pageDescription:
      "Comment OPUS a fondé une plateforme Client 360 multi-plateforme en clarifiant les rôles entre Dynamics 365, Power Platform, données, parcours et exécution.",
    intro:
      "Le sujet n'était pas d'ajouter une couche CRM de plus. Le sujet était de rendre un dispositif client plus lisible, plus cohérent et plus gouvernable, sur une fondation reposant principalement sur Dynamics 365 Customer Service / Customer 360 et Power Platform.",
    sections: [
      {
        title: "1. Situation de départ",
        body: "Le besoin de mieux structurer la relation client faisait peu débat. En revanche, la manière de le faire tenait encore sur des bases trop instables pour supporter durablement les arbitrages à venir. Le sujet portait à la fois sur la connaissance client, les parcours de service, la coordination entre plateformes, la qualité des données et les responsabilités de traitement.",
      },
      {
        title: "2. Tension de départ",
        body: "L'ambition d'un Client 360 répondait à une attente forte, mais restait vulnérable dans sa définition. Selon les lectures, le sujet portait tantôt sur la centralisation de l'information client, tantôt sur le support opérationnel aux équipes, tantôt sur l'orchestration des demandes ou l'automatisation. Le vrai risque était de consolider un dispositif encore trop incertain pour rester tenable dans l'arbitrage.",
      },
      {
        title: "3. Ce qu'OPUS a recadré",
        body: "Le travail n'a pas consisté à ajouter une couche de structuration sur un sujet encore instable. Il a consisté à reprendre le sujet à sa base : quelle plateforme Client 360 est réellement en train d'être fondée, à quel niveau, dans quel périmètre, avec quelles responsabilités explicites, avec quels rôles de données et sur quelles bases d'arbitrage.",
      },
      {
        title: "4. Socle technologique et rôles entre plateformes",
        body: "Le choix de fondation s'est établi autour d'une logique simple : Dynamics 365 porte le socle de structuration de la relation et du portrait client, tandis que Power Platform sert de levier d'automatisation, d'extension contrôlée et de circulation utile de l'information. Le point décisif était de rendre explicites les lignes de décision entre plateforme centrale, extensions, accès et usages.",
      },
      {
        title: "5. Données, parcours et effet obtenu",
        body: "La fondation ne repose pas sur un empilement de fonctionnalités. Elle tient sur quelques dimensions structurantes : un portrait client plus lisible, des parcours mieux structurés, une meilleure continuité entre données, décision et exécution, et une capacité d'automatisation mieux encadrée. Le dispositif devient plus robuste et plus tenable dans l'arbitrage.",
      },
    ],
  },
  {
    slug: "clarifier-prioriser-sequencer-recadrer-une-transformation",
    title: "Clarifier, prioriser, séquencer : recadrer une transformation avant exécution",
    eyebrow: "PREUVE PRINCIPALE 3",
    homeSummary:
      "Une transformation encore trop diffuse a été reprise pour redevenir plus lisible, plus arbitrable et plus tenable avant toute relance de l'exécution.",
    resourcesSummary:
      "Pour voir comment OPUS reprend une trajectoire encombrante, distingue les vrais préalables et remet les priorités dans un ordre défendable.",
    pageTitle:
      "Clarifier, prioriser, séquencer : recadrer une transformation avant exécution - OPUS Technology",
    pageDescription:
      "Comment OPUS a recadré une transformation encore trop diffuse en priorités plus explicites, dépendances visibles et trajectoire plus tenable avant exécution.",
    intro:
      "Le sujet n'était pas d'accélérer une transformation de plus. Le sujet était de rendre une trajectoire encore trop diffuse plus lisible, plus arbitrable et plus tenable avant de relancer l'exécution.",
    sections: [
      {
        title: "1. Situation de départ",
        body: "Le besoin de transformation était réel. Les attentes étaient nombreuses, les pressions d'avancement visibles, et plusieurs chantiers semblaient déjà suffisamment avancés pour justifier une mise en mouvement rapide. En réalité, le sujet restait trop instable pour supporter durablement une exécution cohérente.",
      },
      {
        title: "2. Tension de départ",
        body: "Plusieurs sujets importants coexistaient : fondations technologiques, gouvernance, processus, rôles, dépendances, priorités métier et conditions d'exécution. Chacun portait sa propre légitimité. Mais l'ensemble n'était pas suffisamment ordonné pour permettre une lecture commune du vrai point de départ.",
      },
      {
        title: "3. Ce qu'OPUS a recadré",
        body: "Le travail n'a pas consisté à produire un plan de plus. Il a consisté à reprendre la transformation comme un objet à clarifier avant de pouvoir la séquencer proprement. La question devenait : qu'est-ce qui doit réellement être traité en premier, dans quel ordre, à partir de quels préalables et selon quelle logique de tenue globale.",
      },
      {
        title: "4. Clarification des priorités",
        body: "Le point décisif n'était pas de lister tous les travaux possibles. Il était de distinguer ce qui relevait d'un préalable, d'un chantier structurant, d'un chantier dépendant, d'un sujet à différer et d'un sujet encore insuffisamment mûr pour être engagé proprement. Une transformation devient crédible quand ses priorités cessent d'être implicites.",
      },
      {
        title: "5. Séquencement et effet obtenu",
        body: "Le point important n'était pas de produire un calendrier séduisant. Il était de rendre explicite la logique dans laquelle un sujet peut être engagé sans fragiliser l'ensemble. Le résultat central n'est pas une démonstration d'intensité : la transformation devient plus lisible, plus claire dans ses priorités et plus tenable dans l'arbitrage.",
      },
    ],
  },
];


