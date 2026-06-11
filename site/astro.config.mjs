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
  },
  integrations: [
    starlight({
      title: 'Disability Wiki',
      description:
        'A public, community-driven knowledge base on disability, chronic illness, accessibility, and care—centered on lived experience, plain language, and practical resources.',
      logo: { src: './src/assets/logo.png', alt: '' },
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
