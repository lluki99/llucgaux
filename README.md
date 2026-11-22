# Llucgaux Portfolio

Static portfolio built with React and Vite. Project content is stored locally
under `public/projects`, so the site does not need a backend or runtime API.

## Development

```bash
npm install
npm run dev
```

## Static export

```bash
npm run build
```

The deployable site is written to `dist/`. Open `dist/index.html` directly or
upload the complete `dist/` folder to a static host. The build embeds the
application code, styles and project data in the HTML while keeping media beside
it.

## GitHub Pages

The repository includes `.github/workflows/deploy-pages.yml`. Set the Pages
source to **GitHub Actions** in the repository settings. Every push to `main`
or `master` builds and publishes `dist/` automatically.
