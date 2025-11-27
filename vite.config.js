import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/Chat_App/",   // <-- add this (exact repo name, including / at start & end)
});