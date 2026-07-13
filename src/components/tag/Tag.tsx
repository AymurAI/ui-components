import type { HTMLAttributes } from "react";
import { cva, cx, type RecipeVariantProps } from "@/styled/css";

/**
 * Tag (Etiqueta) — AymurAI UI Library.
 *
 * Figma family: 40000041:10589, label: 40000041:10494
 * Variants: Persona / CUIJ / Num_Expediente / Num_Actuacion / Fecha
 *
 * Layout: rgba(229,232,255,0.8) pill, gap 10px, padding 4px, rounded md (8px)
 * - Value text: font/file (Times New Roman), 16px, regular, #000000
 * - Label badge: Archivo Bold 16px, #000000, fontVariationSettings "wdth" 100
 * - Persona shows abbreviated "PER" badge
 * - Hover: label badge turns brand/primary (#3F479D) + underline; bg unchanged.
 *
 * Token gap: "bg/etiqueta" = rgba(229,232,255,0.8) — 80% opacity tint of #E5E8FF.
 * Candidate to promote: bg.etiqueta rgba(229,232,255,0.8) once confirmed with design.
 */

const TAG_LABELS: Record<TagVariant, string> = {
  Persona: "PER",
  CUIJ: "CUIJ",
  Num_Expediente: "NUM_EXPEDIENTE",
  Num_Actuacion: "NUM_ACTUACION",
  Fecha: "FECHA",
};

const TAG_PLACEHOLDERS: Record<TagVariant, string> = {
  Persona: "APELLIDO, NOMBRE",
  CUIJ: "IPP J-00-00000000-0/AAAA-0",
  Num_Expediente: "IPP 00000/AAAA-0",
  Num_Actuacion: "00000000/AAAA",
  Fecha: "DD/MM/AAAA",
};

export type TagVariant =
  | "Persona"
  | "CUIJ"
  | "Num_Expediente"
  | "Num_Actuacion"
  | "Fecha";

const tagRoot = cva({
  base: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "[10px]",
    px: "1", // 4px
    py: "1",
    rounded: "md", // 8px
    // Figma bg/etiqueta = rgba(229,232,255,0.8) — 80% opacity tint.
    // bg.primary-alternative is the solid #E5E8FF; apply opacity via escape hatch.
    bg: "[rgba(229,232,255,0.8)]",
    cursor: "default",
    userSelect: "none",
  },
  variants: {
    status: {
      Default: {},
      Hover: {
        // Figma Hover does NOT change the background — only the label badge
        // text turns brand/primary (#3F479D) with an underline.
        "& > span:last-child": {
          color: "action.alt-default",
          textDecoration: "underline",
        },
      },
    },
  },
  defaultVariants: {
    status: "Default",
  },
});

const tagValue = cva({
  base: {
    fontFamily: "file", // Times New Roman Regular
    fontSize: "[16px]",
    fontWeight: "[400]",
    lineHeight: "[normal]",
    // Figma: text-black (#000000) for the value text.
    color: "[#000000]",
    whiteSpace: "nowrap",
    flexShrink: "0",
  },
});

const tagLabel = cva({
  base: {
    fontFamily: "primary", // Archivo Bold
    fontSize: "[16px]",
    fontWeight: "[700]", // Bold
    lineHeight: "[normal]",
    // Figma: text-black (#000000) for the label badge (Default state).
    color: "[#000000]",
    whiteSpace: "nowrap",
    flexShrink: "0",
    // Figma specifies fontVariationSettings on Archivo Bold (variable font axis).
    fontVariationSettings: '["wdth" 100]',
  },
});

export type TagProps = RecipeVariantProps<typeof tagRoot> & {
  /** Which Figma variant to render */
  variant?: TagVariant;
  /** Display value (overrides the Figma placeholder text) */
  value?: string;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children">;

export function Tag({
  variant = "Persona",
  status,
  value,
  className,
  ...props
}: TagProps) {
  const label = TAG_LABELS[variant];
  const placeholder = TAG_PLACEHOLDERS[variant];
  const displayValue = value ?? placeholder;

  return (
    <span className={cx(tagRoot({ status }), className)} {...props}>
      {/* Value text (Times New Roman) */}
      <span className={tagValue()}>{displayValue}</span>
      {/* Label badge (Archivo Bold) */}
      <span className={tagLabel()}>{label}</span>
    </span>
  );
}

export default Tag;
