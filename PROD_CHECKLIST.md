# OPUS — Checklist Production (V1)

## Identité & coordonnées (site)
- [ ] Email affiché : contact@opus-tek.ca
- [ ] Téléphones : +1 418 717 9653 / +216 98 519 880
- [ ] Adresse affichée : Pôle de Compétitivité de Sousse — Novation City (Tunisie)
- [ ] Zones desservies : Québec / Canada / International
- [ ] Nom légal : OPUS Technologies Inc

## Domaine & DNS
- [ ] Domaine final : opus-tek.ca
- [ ] DNS A/AAAA/CNAME corrects vers l’hébergeur
- [ ] SSL actif
- [ ] Redirection www → apex (ou inverse)
- [ ] Email routing OK (MX + SPF + DKIM + DMARC)

## Contact (prod)
- [ ] Décider : mailto seulement ou formulaire (traçable)
- [ ] Si formulaire : destination email(s) + anti-spam (Turnstile + honeypot)
- [ ] Tests : mobile + desktop + envoi réel

## SEO minimum
- [ ] Title + meta description corrects sur chaque page
- [ ] favicon.svg OK + og image
- [ ] robots.txt
- [ ] sitemap.xml
- [ ] OpenGraph (og:title, og:description, og:image)

## Légal / conformité
- [ ] Mentions légales
- [ ] Politique de confidentialité
- [ ] Cookies ? (si tracking)
- [ ] Analytics : aucun (pour V1) -> confirmer

## Qualité
- [ ] Lighthouse perf/accessibility OK
- [ ] Liens internes OK
- [ ] Page 404 (option V1)
- [ ] Mobile nav validée (menu, close, scroll lock)

## Déploiement
- [ ] Repo GitHub
- [ ] Build + deploy auto sur main
- [ ] Preview deployments activés (PR)
