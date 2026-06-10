import { resolve } from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

/** Bare imports that must stay external (provided by the consumer's deps). */
const EXTERNAL = [
  /^react($|\/)/,
  /^react-dom($|\/)/,
  /^@radix-ui\//,
  "phosphor-react",
  "react-hot-toast",
];

export default defineConfig({
  resolve: {
    alias: { "@": resolve(__dirname, "src") },
  },
  plugins: [
    react(),
    dts({
      entryRoot: "src",
      include: ["src"],
      exclude: ["src/**/*.stories.tsx", "src/styled/**"],
      tsconfigPath: "tsconfig.build.json",
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        preset: resolve(__dirname, "src/preset.ts"),
      },
      formats: ["es", "cjs"],
    },
    rollupOptions: {
      external: EXTERNAL,
    },
    sourcemap: true,
    emptyOutDir: true,
  },
});
