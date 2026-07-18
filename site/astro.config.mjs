// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sidebar from './src/sidebar.json' with { type: 'json' };
import { remarkStripLeadingH1 } from './src/remark-strip-h1.mjs';

export default defineConfig({
  markdown: { remarkPlugins: [remarkStripLeadingH1] },
  site: 'https://disabilitywiki.org',
  redirects: {
    '/home': '/',
    '/es': '/es/home',
    // Wiki.js-era stub pages, now true redirects (drafts on the wiki side)
    '/accessibility-statement': '/start/accessibility-statement',
    '/foundations/how-to-use-this-wiki': '/start/how-to-use',
    '/start/disability-models': '/foundations/disability-models',
    '/start/for-allies': '/foundations/for-allies',
    '/start/what-is-disability': '/foundations/what-is-disability',
    '/es/start/disability-models': '/es/foundations/disability-models',
    '/es/start/for-allies': '/es/foundations/for-allies',
    '/es/start/what-is-disability': '/es/foundations/what-is-disability',
  },
  integrations: [
    starlight({
      title: 'Disability Wiki',
      description:
        'A public, community-driven knowledge base on disability, chronic illness, accessibility, and care—centered on lived experience, plain language, and practical resources.',
      logo: { src: './src/assets/logo.png', alt: '' },
      favicon: '/favicon.png',
      customCss: ['./src/styles/custom.css'],
      // Site-wide announcement bar. The override still renders per-page `banner`
      // frontmatter, so nothing else changes.
      components: { Banner: './src/components/AppBanner.astro' },
      head: [
        // PWA: installable + offline (crisis pages precached; see tools/gen-sw.mjs)
        { tag: 'link', attrs: { rel: 'manifest', href: '/manifest.webmanifest' } },
        { tag: 'link', attrs: { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' } },
        { tag: 'meta', attrs: { name: 'theme-color', content: '#1d5ca8' } },
        {
          tag: 'script',
          content:
            "if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js');",
        },
      ],
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        es: { label: 'Español', lang: 'es' },
      },
      sidebar,
      lastUpdated: true,
      pagination: false,
      social: [
        {
          icon: 'github',
          label: 'GitHub',
          href: 'https://github.com/Beaudoin0zach/disability-wiki',
        },
      ],
    }),
  ],
});
