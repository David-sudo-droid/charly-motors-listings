import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk
          vendor: ['react', 'react-dom'],
          // UI library chunks
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-slot', 'class-variance-authority'],
          // Heavy dependencies
          query: ['@tanstack/react-query'],
          supabase: ['@supabase/supabase-js'],
          // Icons
          icons: ['lucide-react'],
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    target: 'es2015',
    cssCodeSplit: true,
    sourcemap: false, // Disable for production
    minify: 'esbuild',
  },
}));
