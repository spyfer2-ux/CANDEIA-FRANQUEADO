import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ATENÇÃO: troque "candeia-franqueado" pelo nome exato do seu repositório no GitHub
export default defineConfig({
  plugins: [react()],
  base: "/CANDEIA-FRANQUEADO/",
});
