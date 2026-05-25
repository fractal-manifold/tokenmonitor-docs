import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://fractal-manifold.github.io',
  base: '/c-wall-monitor-docs',
  trailingSlash: 'ignore',
  compressHTML: true,
  integrations: [
    starlight({
      title: 'Claude Wall Monitor',
      description: 'Manual de usuario del panel de pared para Claude, Codex y Gemini.',
      defaultLocale: 'root',
      locales: {
        root: { label: 'Español', lang: 'es' },
      },
      logo: {
        src: './src/assets/logo.svg',
        replacesTitle: false,
      },
      social: {
        github: 'https://github.com/fractal-manifold/c-wall-monitor-docs',
      },
      customCss: ['./src/styles/theme.css'],
      sidebar: [
        {
          label: 'Introducción',
          items: [
            { label: 'Qué es', link: '/' },
            { label: 'En la caja', slug: 'introduccion/en-la-caja' },
          ],
        },
        {
          label: 'Puesta en marcha',
          items: [
            { label: 'Primer arranque', slug: 'puesta-en-marcha/primer-arranque' },
            { label: 'Portal cautivo', slug: 'puesta-en-marcha/portal-cautivo' },
            { label: 'Emparejar con Claude Code', slug: 'puesta-en-marcha/claude-code' },
          ],
        },
        {
          label: 'Uso diario',
          items: [
            { label: 'Pantalla principal', slug: 'uso/dashboard' },
            { label: 'Ajustes', slug: 'uso/ajustes' },
            { label: 'Alertas', slug: 'uso/alertas' },
            { label: 'Temas y modo día/noche', slug: 'uso/temas' },
          ],
        },
        {
          label: 'Solución de problemas',
          items: [
            { label: 'Problemas comunes', slug: 'troubleshooting/comunes' },
            { label: 'Preguntas frecuentes', slug: 'troubleshooting/faq' },
          ],
        },
      ],
    }),
  ],
});
