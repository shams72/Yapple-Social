import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy: {
      "/api/": {
        target: process.env.API_URL || "http://host.docker.internal:3000",
        changeOrigin: true,
      },
    },    
  },
});
