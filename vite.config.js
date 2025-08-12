import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteGhPages } from "vite-plugin-gh-pages";

export default defineConfig({
  plugins: [react(), viteGhPages()],
  base: "/search-pokemon/", // ganti dengan nama repo GitHub Anda
});
