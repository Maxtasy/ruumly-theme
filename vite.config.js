import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src",
  build: {
    outDir: "../assets",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "src/main.js"),
      },
      output: {
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
      },
    },
    target: "es2018",
  },
  server: {
    watch: {
      usePolling: true,
    },
  },
});
