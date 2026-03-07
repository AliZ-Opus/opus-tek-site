# OPUS MASTER ELITE V9.0.0 FINAL

## Lancer le projet en localhost

1. Installer les dépendances
```bash
npm install
```

2. Démarrer le serveur de développement
```bash
npm run dev
```

3. Ouvrir le site dans le navigateur

Astro affichera l'URL locale dans le terminal, généralement :
```bash
http://localhost:4321
```

## Build de production

```bash
npm run build
```

## Structure importante

- `src/assets/` : assets optimisés pour `astro:assets`
- `src/components/` : composants UI Elite
- `src/layouts/BaseLayout.astro` : header/footer global
- `src/pages/` : pages du site
