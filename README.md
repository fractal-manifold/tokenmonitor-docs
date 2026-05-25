# Claude Wall Monitor — Docs

Manual de usuario del **Claude Wall Monitor**, el panel de pared (ESP32-S3) que
muestra el uso en tiempo real de Claude, Codex y Gemini.

🌐 **Sitio en vivo:** https://fractal-manifold.github.io/c-wall-monitor-docs/

El sitio es estático, generado con [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) y se publica automáticamente en GitHub Pages cada vez que se hace push a `main`.

## Desarrollo

```bash
npm install
npm run dev       # http://localhost:4321/c-wall-monitor-docs
npm run build     # genera dist/
npm run preview   # sirve dist/ localmente
```

## Estructura

```
src/
  assets/         # logo, imágenes referenciadas desde MDX
  content/docs/   # contenido del manual (Markdown / MDX)
    introduccion/
    puesta-en-marcha/
    uso/
    troubleshooting/
  styles/theme.css  # overrides de la paleta de Starlight
astro.config.mjs    # configuración del sitio (site, base, sidebar)
```

Para añadir una página nueva basta con crear un fichero `.md` o `.mdx` bajo
`src/content/docs/` y enlazarlo desde el `sidebar` en `astro.config.mjs`.

## Despliegue

Workflow en `.github/workflows/deploy.yml`. Source de GitHub Pages = **GitHub
Actions** (no la rama `gh-pages` clásica — Astro publica directamente el
artefacto).

## Relación con el firmware

Este repo es público y vive como submódulo dentro del repo privado del
firmware/proyecto (`fractal-manifold/claude-wall-monitor`) bajo `docs/`. El
firmware sigue siendo privado; solo el manual de usuario se publica aquí.

## Licencia

Documentación © Fractal Manifold S.L. — todos los derechos reservados.
