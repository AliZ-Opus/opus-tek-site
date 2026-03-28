export const motherPhrase =
  "OPUS intervient quand un sujet important avance encore, mais ne tient plus assez proprement pour être arbitré, gouverné et exécuté sans dérive.";

export const signature = [
  "OPUS n'est ni un cabinet générique, ni un intégrateur de plus, ni une couche d'accélération abstraite.",
  "OPUS intervient lorsque la trajectoire existe déjà, mais que son socle, ses arbitrages, ses responsabilités ou son ordre d'exécution ne sont plus assez nets pour tenir durablement.",
];

export const signatureActs = [
  "clarifier",
  "arbitrer",
  "rendre gouvernable",
  "rendre exécutable",
];

export interface SupportItem {
  slug: string;
  label: string;
  title: string;
  summary: string;
  cta: string;
}

export const supportHierarchy: SupportItem[] = [
  {
    slug: "executive-one-pager",
    label: "CAPTURE IMMÉDIATE",
    title: "One Pager",
    summary:
      "Faire comprendre en quelques secondes ce que traite OPUS, à quel moment il devient utile et pourquoi sa valeur n'est pas interchangeable.",
    cta: "Ouvrir le one-pager",
  },
  {
    slug: "support-rdv-client",
    label: "OUVERTURE DE CONVERSATION",
    title: "Support RDV client",
    summary:
      "Installer le bon niveau de gravité, faire sentir le vrai problème et rendre la suite naturelle sans transformer l'échange en brochure.",
    cta: "Ouvrir le support RDV",
  },
  {
    slug: "par",
    label: "RÉDUCTION D'AMBIGUÏTÉ",
    title: "PAR",
    summary:
      "Clarifier le vrai sujet, distinguer les priorités, rendre visibles les dépendances et préparer une trajectoire plus tenable avant engagement.",
    cta: "Passer au PAR",
  },
  {
    slug: "capability-pack",
    label: "CONSIDÉRATION SÉRIEUSE",
    title: "Capability Pack",
    summary:
      "Faire passer OPUS de crédible à sérieusement considérable avec une lecture plus dense, plus boardroom et plus défendable.",
    cta: "Recevoir le capability pack",
  },
];
