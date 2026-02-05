import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.js",
      name: "Medusae",
      fileName: "index",
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: ["react", "react-dom", "three", "@react-three/fiber"],
    },
  },
});
