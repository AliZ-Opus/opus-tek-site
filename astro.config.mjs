// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import vercel from "@astrojs/vercel";

const tailwindPlugin = /** @type {any} */ (tailwindcss());

export default defineConfig({
  site: "https://www.opus-tek.com",
  output: "server",
  adapter: vercel(),
  vite: {
    plugins: [tailwindPlugin],
  },
});
