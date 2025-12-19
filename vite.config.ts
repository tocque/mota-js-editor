import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";
import motaServerPlugin from "./vite-plugin-mota-server";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
    nodePolyfills({
      include: ['events']
    }),
    motaServerPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  publicDir: "public",
  server: {
    port: 1055,
    host: "127.0.0.1",
  },
  build: {
    outDir: "dist",
    assetsDir: "assets",
    // 确保所有资源都被正确复制
    copyPublicDir: true,
  },
});
