// @ts-check
import mdx from "@astrojs/mdx";
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";

import { SITE_URL } from "./src/consts";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  integrations: [mdx(), sitemap(), tailwind(), react()],
  markdown: {
    shikiConfig: {
      themes: {
        light: "catppuccin-latte",
        dark: "catppuccin-mocha",
      },
    },
  },
});
