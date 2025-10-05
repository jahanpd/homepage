import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: 'file'
  },

  site: 'https://jcpd.xyz',

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [react()],
});