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
      "Un objet institutionnellement sensible a ete repris a sa base pour devenir plus clair, plus coherent et plus tenable sur une fondation de services principalement portee par ServiceNow.",
    resourcesSummary:
      "Pour voir comment OPUS reprend un sujet encore trop ambigu pour supporter des arbitrages durables et le transforme en fondation de services plus nette et plus tenable.",
    pageTitle:
      "Fonder une plateforme de services dans un contexte public complexe - OPUS Technology",
    pageDescription:
      "Comment OPUS a fonde une plateforme de services dans un contexte public complexe en recentrant le sujet, en clarifiant les choix structurants et en tenant la logique de service sur ServiceNow.",
    intro:
      "Le sujet n'etait pas de produire une plateforme de plus. Le sujet etait de rendre un objet institutionnellement sensible plus clair, plus coherent et plus tenable, sur une fondation reposant principalement sur ServiceNow et sur un nombre limite de processus structurants clairement assumes.",
    sections: [
      {
        title: "1. Situation de depart",
        body: "La necessite de mieux organiser les services faisait peu debat. En revanche, la maniere de le faire tenait encore sur des bases trop instables pour supporter durablement les arbitrages a venir. La plateforme etait attendue a la fois comme cadre de structuration, comme levier de simplification, comme support de coordination et comme socle d'evolution.",
      },
      {
        title: "2. Tension institutionnelle",
        body: "Le probleme n'etait pas un manque d'activite. Le probleme etait un objet encore trop ambigu pour devenir une base fiable de decision. Selon les lectures, le sujet ne portait ni tout a fait sur les memes services, ni sur le meme niveau de fondation, ni sur le meme partage de responsabilites.",
      },
      {
        title: "3. Ce qu'OPUS a recadre",
        body: "Le travail n'a pas consiste a ajouter une couche de structuration sur un sujet encore instable. Il a consiste a reprendre le sujet a sa base. La question devenait : quelle plateforme est reellement en train d'etre fondee, a quel niveau, dans quel perimetre, avec quelles responsabilites explicites et sur quelles bases d'arbitrage.",
      },
      {
        title: "4. Socle technologique et logique de service",
        body: "Le choix de fondation s'est etabli autour d'une logique simple : la plateforme repose principalement sur ServiceNow, non comme simple outil de tickets, mais comme socle de structuration, d'orchestration et de tenue du modele de services. Sa valeur vient de sa capacite a soutenir un cadre coherent de demandes, d'approbations, de traitement, de tracabilite et d'evolution.",
      },
      {
        title: "5. Choix structurants et effet obtenu",
        body: "Le travail a ensuite porte sur les choix structurants sans lesquels la plateforme serait restee exposee aux derives de perimetre, aux ambiguities de responsabilite et aux lectures incompatibles de son role. Le resultat central n'est pas un effet d'annonce : la plateforme devient plus lisible, plus robuste et plus tenable dans l'arbitrage.",
      },
    ],
  },
  {
    slug: "fondation-client-360-multi-plateforme",
    title: "Fondation d'une plateforme Client 360 multi-plateforme en contexte public complexe",
    eyebrow: "PREUVE PRINCIPALE 2",
    homeSummary:
      "Un dispositif client deja engage a ete repris pour redevenir une fondation plus lisible, plus coherente et plus gouvernable autour de Dynamics 365 et Power Platform.",
    resourcesSummary:
      "Pour voir comment OPUS reprend une fondation Client 360 encore trop ambigue et clarifie les roles entre plateformes, donnees, acces et execution.",
    pageTitle:
      "Fondation d'une plateforme Client 360 multi-plateforme en contexte public complexe - OPUS Technology",
    pageDescription:
      "Comment OPUS a fonde une plateforme Client 360 multi-plateforme en clarifiant les roles entre Dynamics 365, Power Platform, donnees, parcours et execution.",
    intro:
      "Le sujet n'etait pas d'ajouter une couche CRM de plus. Le sujet etait de rendre un dispositif client plus lisible, plus coherent et plus gouvernable, sur une fondation reposant principalement sur Dynamics 365 Customer Service / Customer 360 et Power Platform.",
    sections: [
      {
        title: "1. Situation de depart",
        body: "Le besoin de mieux structurer la relation client faisait peu debat. En revanche, la maniere de le faire tenait encore sur des bases trop instables pour supporter durablement les arbitrages a venir. Le sujet portait a la fois sur la connaissance client, les parcours de service, la coordination entre plateformes, la qualite des donnees et les responsabilites de traitement.",
      },
      {
        title: "2. Tension de depart",
        body: "L'ambition d'un Client 360 repondait a une attente forte, mais restait vulnerable dans sa definition. Selon les lectures, le sujet portait tantot sur la centralisation de l'information client, tantot sur le support operationnel aux equipes, tantot sur l'orchestration des demandes ou l'automatisation. Le vrai risque etait de consolider un dispositif encore trop incertain pour rester tenable dans l'arbitrage.",
      },
      {
        title: "3. Ce qu'OPUS a recadre",
        body: "Le travail n'a pas consiste a ajouter une couche de structuration sur un sujet encore instable. Il a consiste a reprendre le sujet a sa base : quelle plateforme Client 360 est reellement en train d'etre fondee, a quel niveau, dans quel perimetre, avec quelles responsabilites explicites, avec quels roles de donnees et sur quelles bases d'arbitrage.",
      },
      {
        title: "4. Socle technologique et roles entre plateformes",
        body: "Le choix de fondation s'est etabli autour d'une logique simple : Dynamics 365 porte le socle de structuration de la relation et du portrait client, tandis que Power Platform sert de levier d'automatisation, d'extension controlee et de circulation utile de l'information. Le point decisif etait de rendre explicites les lignes de decision entre plateforme centrale, extensions, acces et usages.",
      },
      {
        title: "5. Donnees, parcours et effet obtenu",
        body: "La fondation ne repose pas sur un empilement de fonctionnalites. Elle tient sur quelques dimensions structurantes : un portrait client plus lisible, des parcours mieux structures, une meilleure continuite entre donnees, decision et execution, et une capacite d'automatisation mieux encadree. Le dispositif devient plus robuste et plus tenable dans l'arbitrage.",
      },
    ],
  },
  {
    slug: "clarifier-prioriser-sequencer-recadrer-une-transformation",
    title: "Clarifier, prioriser, sequencer : recadrer une transformation avant execution",
    eyebrow: "PREUVE PRINCIPALE 3",
    homeSummary:
      "Une transformation encore trop diffuse a ete reprise pour redevenir plus lisible, plus arbitrable et plus tenable avant toute relance de l'execution.",
    resourcesSummary:
      "Pour voir comment OPUS reprend une trajectoire encombrante, distingue les vrais prealables et remet les priorites dans un ordre defendable.",
    pageTitle:
      "Clarifier, prioriser, sequencer : recadrer une transformation avant execution - OPUS Technology",
    pageDescription:
      "Comment OPUS a recadre une transformation encore trop diffuse en priorites plus explicites, dependances visibles et trajectoire plus tenable avant execution.",
    intro:
      "Le sujet n'etait pas d'accelerer une transformation de plus. Le sujet etait de rendre une trajectoire encore trop diffuse plus lisible, plus arbitrable et plus tenable avant de relancer l'execution.",
    sections: [
      {
        title: "1. Situation de depart",
        body: "Le besoin de transformation etait reel. Les attentes etaient nombreuses, les pressions d'avancement visibles, et plusieurs chantiers semblaient deja suffisamment avances pour justifier une mise en mouvement rapide. En realite, le sujet restait trop instable pour supporter durablement une execution coherente.",
      },
      {
        title: "2. Tension de depart",
        body: "Plusieurs sujets importants coexistaient : fondations technologiques, gouvernance, processus, roles, dependances, priorites metier et conditions d'execution. Chacun portait sa propre legitimite. Mais l'ensemble n'etait pas suffisamment ordonne pour permettre une lecture commune du vrai point de depart.",
      },
      {
        title: "3. Ce qu'OPUS a recadre",
        body: "Le travail n'a pas consiste a produire un plan de plus. Il a consiste a reprendre la transformation comme un objet a clarifier avant de pouvoir la sequencer proprement. La question devenait : qu'est-ce qui doit reellement etre traite en premier, dans quel ordre, a partir de quels prealables et selon quelle logique de tenue globale.",
      },
      {
        title: "4. Clarification des priorites",
        body: "Le point decisif n'etait pas de lister tous les travaux possibles. Il etait de distinguer ce qui relevait d'un prealable, d'un chantier structurant, d'un chantier dependant, d'un sujet a differer et d'un sujet encore insuffisamment mur pour etre engage proprement. Une transformation devient credible quand ses priorites cessent d'etre implicites.",
      },
      {
        title: "5. Sequencement et effet obtenu",
        body: "Le point important n'etait pas de produire un calendrier seduisant. Il etait de rendre explicite la logique dans laquelle un sujet peut etre engage sans fragiliser l'ensemble. Le resultat central n'est pas une demonstration d'intensite : la transformation devient plus lisible, plus claire dans ses priorites et plus tenable dans l'arbitrage.",
      },
    ],
  },
];
