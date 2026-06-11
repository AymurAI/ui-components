import { type RecipeVariantProps, cva, cx } from "@/styled/css";
import type { HTMLAttributes } from "react";

/**
 * Tag (Etiqueta) — AymurAI UI Library.
 *
 * Figma family: 40000041:10589, label: 40000041:10494
 * Variants: Persona / CUIJ / Num_Expediente / Num_Actuacion / Fecha
 *
 * Layout: bg.primary-alternative pill, gap 10px, padding 4px, rounded md (8px)
 * - Value text: font/file (Times New Roman), 16px, regular, black
 * - Label badge (for non-Persona): Archivo Bold 16px, black
 * - Persona shows abbreviated "PER" badge
 *
 * Token gap: "bg/etiqueta" (#E5E8FF) = bg.primary-alternative (#E5E8FF) ✓ exact match.
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
    bg: "bg.primary-alternative", // #E5E8FF — matches Figma "bg/etiqueta"
    cursor: "default",
    userSelect: "none",
  },
  variants: {
    status: {
      Default: {},
      Hover: {
        bg: "bg.primary-highlight",
        // Figma Hover: the label badge turns action.alt-default + underline.
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
    fontFamily: "file", // Times New Roman
    fontSize: "[16px]",
    fontWeight: "[400]",
    lineHeight: "[normal]",
    color: "text.default",
    whiteSpace: "nowrap",
    flexShrink: "0",
  },
});

const tagLabel = cva({
  base: {
    fontFamily: "primary", // Archivo
    fontSize: "[16px]",
    fontWeight: "[700]", // Bold
    lineHeight: "[normal]",
    color: "text.default",
    whiteSpace: "nowrap",
    flexShrink: "0",
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
