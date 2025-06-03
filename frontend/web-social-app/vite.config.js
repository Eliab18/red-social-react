import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: "jsx", // Habilita JSX en archivos .js
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx", // Trata archivos .js como JSX
      },
    },
  },
});