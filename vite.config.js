import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import fs from 'node:fs'
import path from 'node:path'

const projectDataPlugin = {
  name: 'static-project-data',
  resolveId(id) {
    if (id === 'virtual:static-project-data') return '\0virtual:static-project-data'
  },
  load(id) {
    if (id !== '\0virtual:static-project-data') return

    const projectsDir = fileURLToPath(new URL('./public/projects', import.meta.url))
    const catalog = JSON.parse(fs.readFileSync(path.join(projectsDir, 'index.json'), 'utf8'))
    const projects = Object.fromEntries(catalog.map(({ slug }) => [
      slug,
      JSON.parse(fs.readFileSync(path.join(projectsDir, slug, 'project.json'), 'utf8')),
    ]))

    return `export const catalog = ${JSON.stringify(catalog)};\nexport const projects = ${JSON.stringify(projects)};`
  },
}

const inlineStaticAssetsPlugin = {
  name: 'inline-static-assets',
  apply: 'build',
  closeBundle() {
    const distDir = fileURLToPath(new URL('./dist', import.meta.url))
    const htmlPath = path.join(distDir, 'index.html')
    let html = fs.readFileSync(htmlPath, 'utf8')
    let inlineScript = ''
    const generatedAssets = []

    html = html.replace(/<script type="module" crossorigin src="([^"]+)"><\/script>/, (_tag, src) => {
      const assetPath = path.join(distDir, src.replace(/^\.\//, ''))
      const js = fs.readFileSync(assetPath, 'utf8')
      generatedAssets.push(assetPath)
      inlineScript = `<script>${js.replace(/<\/script/gi, '<\\/script')}</script>`
      return ''
    })
    html = html.replace(/<link rel="stylesheet" crossorigin href="([^"]+)">/, (_tag, href) => {
      const assetPath = path.join(distDir, href.replace(/^\.\//, ''))
      const css = fs.readFileSync(assetPath, 'utf8')
      generatedAssets.push(assetPath)
      return `<style>${css.replace(/<\/style/gi, '<\\/style')}</style>`
    })

    // The original Vite module script was deferred automatically. The inline
    // classic script must run after the root element has been parsed.
    const bodyEnd = html.lastIndexOf('</body>')
    if (bodyEnd === -1 || !inlineScript) {
      throw new Error('Could not inline the application script into the generated HTML')
    }
    html = `${html.slice(0, bodyEnd)}${inlineScript}\n  ${html.slice(bodyEnd)}`

    fs.writeFileSync(htmlPath, html)

    // These two Vite bundles now live in index.html; remove the duplicate files
    // so the static export contains only assets it actually references.
    for (const assetPath of generatedAssets) fs.unlinkSync(assetPath)
    const assetsDir = path.join(distDir, 'assets')
    if (fs.existsSync(assetsDir) && fs.readdirSync(assetsDir).length === 0) {
      fs.rmdirSync(assetsDir)
    }
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    projectDataPlugin,
    inlineStaticAssetsPlugin,
  ],
  // Relative asset paths make the production build work from any folder,
  // including when index.html is opened directly from disk.
  base: './',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
