import { fileURLToPath, URL } from "node:url";
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
export default defineConfig({
  // Required for GitHub Pages to resolve assets correctly
  base: '/8730-project/', 
  plugins: [react()],
  resolve: {
    alias: {
      // This tells the builder that "@" means the "src" folder!
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});