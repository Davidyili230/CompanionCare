<<<<<<< Updated upstream
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
   plugins: [react(), tailwindcss()],

   server: {
      host: true,
      proxy: {
         "/api": {
            target: "http://localhost:8080",
            changeOrigin: true,
         },
         "/uploads": {
            target: "http://localhost:8080",
            changeOrigin: true,
         },
      },
   },
});
=======
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
>>>>>>> Stashed changes
