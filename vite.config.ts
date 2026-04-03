import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'three': ['three', '@react-three/fiber', '@react-three/drei', '@react-three/xr'],
          'ui-libs': ['lucide-react'],
          'router': ['react-router-dom'],
          // Page chunks (grouped to avoid circular dependencies)
          '3d-pages': ['./src/pages/Navigation3DPage.tsx', './src/pages/ARMapPage.tsx', './src/pages/Test3DPage.tsx'],
          'search-pages': ['./src/pages/CameraSearchPage.tsx', './src/pages/SearchResultsPage.tsx', './src/pages/NavigationPage.tsx'],
          'special-pages': ['./src/pages/QRScanPage.tsx', './src/pages/SettingsPage.tsx'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
