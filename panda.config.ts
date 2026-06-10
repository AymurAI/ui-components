import { defineConfig } from "@pandacss/dev";
import { aymuraiPreset } from "./preset";

export default defineConfig({
  // No CSS reset: the library ships a self-contained stylesheet that must NOT
  // clobber a consumer's own reset (desktop-app = Panda, defensoria = Tailwind).
  preflight: false,

  // Scan our component sources for style usage.
  include: ["./src/**/*.{ts,tsx}"],
  exclude: [],

  // preset-panda provides the default numeric spacing/sizes/colors scales,
  // durations, easings and keyframes (spin); aymuraiPreset overrides tokens.
  presets: ["@pandacss/preset-panda", aymuraiPreset],

  jsxFramework: "react",

  // Generated styled-system lives inside src (gitignored, regenerated on build).
  outdir: "src/styled",

  // Enforce token-only values; arbitrary values must use the `[...]` escape.
  strictTokens: true,

  // Prefix generated atomic classes so they never collide with a consumer's
  // own atomic CSS (e.g. desktop-app's own Panda output, or Tailwind).
  prefix: "aym",
});
