import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Ini akan membuat Vite mendengarkan di 0.0.0.0 (semua interface)
                // Anda juga bisa spesifikkan '0.0.0.0'
    port: 5173, // Pastikan port ini sesuai dengan yang Anda coba akses
    // open: true // (Opsional) otomatis buka di browser saat server dimulai
  }
});
