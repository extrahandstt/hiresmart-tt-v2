import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
  registerType: "autoUpdate",

  manifest: {
    name: "HireSmart TT",
    short_name: "HireSmart",
    description:
      "Find workers, post jobs and connect across Trinidad & Tobago",

    theme_color: "#000000",
    background_color: "#ffffff",

    display: "standalone",
    start_url: "/",

    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  },

  // 👇 ADD THIS RIGHT HERE (same level as manifest)
  workbox: {
    clientsClaim: true,
    skipWaiting: true,
    cleanupOutdatedCaches: true,
    maximumFileSizeToCacheInBytes: 5000000
  }
})
  ]
});