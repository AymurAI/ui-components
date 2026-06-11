import { definePreset } from "@pandacss/dev";

/**
 * Typography scale helper. Mirrors the AymurAI text styles defined in the
 * Figma UI Library and the desktop-app Panda config.
 */
const text = (size: number, weight: number, lineHeight: string) => ({
  value: { fontSize: `${size}px`, fontWeight: weight, lineHeight },
});

const color = (hex: string) => ({ value: hex });

/**
 * The `@aymurai/ui` Panda preset. Holds the AymurAI design tokens, text styles,
 * keyframes and animations. Exported so Panda-based consumers (e.g. desktop-app)
 * can share the exact same token set:
 *
 *   import aymuraiPreset from "@aymurai/ui/preset";
 *   export default defineConfig({ presets: [aymuraiPreset] });
 */
export const aymuraiPreset = definePreset({
  name: "aymurai",
  theme: {
    extend: {
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        fadeOut: { from: { opacity: "1" }, to: { opacity: "0" } },
        spin: { to: { transform: "rotate(360deg)" } },
      },
      tokens: {
        animations: {
          fadeIn: { value: "fadeIn 0.15s ease-out" },
          fadeOut: { value: "fadeOut 0.1s ease-in" },
          spin: { value: "spin 1s linear infinite" },
        },
        durations: {
          fast: { value: "150ms" },
          normal: { value: "250ms" },
          slow: { value: "300ms" },
        },
        easings: {
          default: { value: "cubic-bezier(0.4, 0, 0.2, 1)" },
        },
        // AymurAI radius scale (matches Figma corner radii to the pixel).
        radii: {
          xs: { value: "2px" },
          sm: { value: "4px" },
          md: { value: "8px" },
          lg: { value: "16px" },
          xl: { value: "24px" },
          full: { value: "9999px" },
        },
        fonts: {
          primary: {
            value:
              '"Archivo", -apple-system, "Helvetica Neue", Helvetica, Roboto, sans-serif',
          },
          file: { value: '"Times New Roman", Times, serif' },
        },
        // Shadow scale — values taken pixel-exact from the Figma UI Library.
        shadows: {
          focus: { value: "0px 0px 8px rgba(17, 0, 65, 0.2)" },
          "input-focus": { value: "0px 2px 1px rgba(0, 0, 0, 0.16)" },
          dropdown: { value: "0px 16px 16px rgba(0, 0, 0, 0.08)" },
          "card-hover": { value: "0px 0px 7.5px rgba(63, 71, 157, 0.4)" },
          tooltip: { value: "0px 4px 8px rgba(0, 0, 0, 0.1)" },
          // Dialog/Popover have no Figma node yet — tokenised at current values.
          dialog: { value: "0px 4px 8px rgba(0, 0, 0, 0.1)" },
          popover: { value: "0px 0px 15px 0px #00000026" },
        },
      },
      textStyles: {
        title: {
          md: { strong: text(32, 700, "120%"), default: text(32, 400, "120%") },
        },
        subtitle: {
          md: { strong: text(20, 600, "120%"), default: text(20, 400, "120%") },
          sm: { strong: text(14, 600, "120%"), default: text(14, 400, "120%") },
        },
        paragraph: {
          md: { strong: text(18, 600, "150%"), default: text(18, 400, "150%") },
          sm: { strong: text(16, 600, "140%"), default: text(16, 400, "140%") },
          xsm: {
            strong: text(10, 600, "140%"),
            default: text(10, 400, "140%"),
          },
        },
        cta: {
          md: { strong: text(16, 600, "100%"), default: text(16, 400, "100%") },
          sm: { strong: text(16, 600, "115%"), default: text(16, 400, "115%") },
        },
        label: {
          md: { strong: text(16, 600, "120%"), default: text(16, 400, "120%") },
          sm: { strong: text(12, 600, "120%"), default: text(12, 400, "120%") },
        },
      },
      semanticTokens: {
        colors: {
          brand: {
            primary: color("#3F479D"),
            secondary: color("#C3CCD7"),
            tertiary: color("#4A5568"),
          },
          text: {
            default: color("#110041"),
            lighter: color("#625C68"),
            "onbutton-default": color("#110041"),
            "onbutton-alternative": color("#FFFFFF"),
            "onbutton-disabled": color("#2D3748"),
            // Figma text/text-onbutton-alt — used by ButtonLink (Type=Default).
            "onbutton-alt": color("#576171"),
            // Figma text/text-onbutton-disabled — disabled labels (Radio, etc.).
            disabled: color("#A9A9A9"),
          },
          action: {
            default: color("#C5CAFF"),
            disabled: color("#E0DDE2"),
            "alt-default": color("#3F479D"),
            hover: color("#110041"),
            pressed: color("#3F479D"),
            focus: color("#C5CAFF"),
            // Figma progress-fill tint (ArchiveProgress active bar).
            progress: color("#CED1F4"),
          },
          // Dialog/modal scrim.
          overlay: color("rgba(0, 0, 0, 0.5)"),
          bg: {
            primary: color("#F6F5F7"),
            secondary: color("#FFFFFF"),
            "primary-alternative": color("#E5E8FF"),
            "primary-highlight": color("#C5CAFF"),
            "secondary-highlight": color("#E0DDE2"),
          },
          system: {
            success: color("#1B834E"),
            "success-secondary": color("#E0FAED"),
            error: color("#DC582E"),
            "error-secondary": color("#FFECE5"),
            warning: color("#F2BA2C"),
            "warning-secondary": color("#FFF7DB"),
            info: color("#3F479D"),
            "info-secondary": color("#F6F5F7"),
          },
        },
        borders: {
          primary: { value: "1px solid #BCBAB8" },
          secondary: { value: "1px solid #EDF2F7" },
          "primary-alt": { value: "1px solid #110041" },
          error: { value: "1px solid {colors.system.error}" },
        },
        gradients: {
          primary: {
            value:
              "linear-gradient(249.5deg, #C5CAFF -33.26%, #8591E8 28.49%, #3F479D 82.99%)",
          },
        },
      },
    },
  },
});

export default aymuraiPreset;
