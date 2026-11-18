import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Saat backend Express sudah jalan di port 5000, semua request /api diteruskan ke sana.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { "/api": "http://localhost:5000", "/uploads": "http://localhost:5000" },
  },
});
