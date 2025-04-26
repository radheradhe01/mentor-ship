import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      '/login': 'http://localhost:8004',
      '/users': 'http://localhost:8004',
      '/recommendations': 'http://localhost:8004',
      '/mentors': 'http://localhost:8004',
      '/mentees': 'http://localhost:8004',
    }
  }
});
