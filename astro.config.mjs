import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), react()],
  build: {
    // Example: Generate `page.html` instead of `page/index.html` during build.
    format: 'file'
  },
  output: "server",
  adapter: vercel()
});