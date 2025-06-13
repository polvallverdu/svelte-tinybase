import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { sitemapWrapAdapter } from "sveltekit-static-sitemap";

const config = {
  preprocess: [vitePreprocess(), mdsvex()],
  kit: {
    adapter: sitemapWrapAdapter(
      adapter({
        fallback: "404.html",
      }),
      {
        sitemapFile: "sitemap-index.xml",
      },
    ),
    prerender: {
      origin: "https://svelte-tinybase.polv.dev",
    },
  },
  extensions: [".svelte", ".svx"],
};

export default config;
