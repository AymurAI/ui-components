import { css, cx } from "@/styled/css";
import { CheckCircle, XCircle } from "phosphor-react";

/**
 * ArchiveView — AymurAI UI Library "archive-view" family node 222:21065.
 *
 * Figma types:
 *   Previsualitation        — thumbnail image preview (157×192px), filename below,
 *                             checkbox overlay (top-right corner)
 *   Previsualitation Error  — same thumbnail but error border (#DC582E) + pink tint,
 *                             "Error de carga." italic message below filename
 *   Document OK             — grey placeholder box + CheckCircle icon (48px),
 *                             filename below
 *   Document Error          — error coloured placeholder + XCircle icon (48px),
 *                             "Error de guardado." italic message below filename
 *
 * Tokens:
 *   border/primary       = #BCBAB8  (preview border)
 *   bg/primary           = #F6F5F7  (document placeholder bg)
 *   system.error         = #DC582E  (error border + text)
 *   system.error-secondary= #FFECE5 (error placeholder bg)
 *   text.default         = #110041  (filename)
 *   action.alt-default   = #3F479D  (checkbox fill)
 *
 * Assumption: The thumbnail image is passed as `src`; when absent the
 * Previsualitation variants fall back to the Document OK/Error placeholder.
 */

export type ArchiveViewType =
  | "preview"
  | "preview-error"
  | "document-ok"
  | "document-error";

export interface ArchiveViewProps {
  fileName?: string;
  type?: ArchiveViewType;
  /** Optional thumbnail image URL (used for preview variants) */
  src?: string;
  /** Whether file is selected (shows checked checkbox overlay) */
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  className?: string;
}

// Thumbnail frame styles per type
const frameStyles: Record<ArchiveViewType, string> = {
  preview: css({
    position: "relative",
    w: "[157px]",
    h: "[192px]",
    rounded: "md",
    borderWidth: "[4px]",
    borderStyle: "solid",
    borderColor: "[#BCBAB8]",
    boxShadow: "[0px_0px_4px_rgba(0,0,0,0.1)]",
    overflow: "hidden",
    bg: "bg.secondary",
    flexShrink: "0",
  }),
  "preview-error": css({
    position: "relative",
    w: "[157px]",
    h: "[192px]",
    rounded: "md",
    borderWidth: "[4px]",
    borderStyle: "solid",
    borderColor: "system.error",
    boxShadow: "[0px_0px_4px_rgba(0,0,0,0.1)]",
    overflow: "hidden",
    bg: "bg.secondary",
    flexShrink: "0",
  }),
  "document-ok": css({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[157px]",
    h: "[192px]",
    rounded: "md",
    borderWidth: "[4px]",
    borderStyle: "solid",
    borderColor: "[#BCBAB8]",
    filter: "[drop-shadow(0px_0px_2px_rgba(0,0,0,0.1))]",
    bg: "bg.primary",
    flexShrink: "0",
  }),
  "document-error": css({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[157px]",
    h: "[192px]",
    rounded: "md",
    borderWidth: "[4px]",
    borderStyle: "solid",
    borderColor: "system.error",
    filter: "[drop-shadow(0px_0px_2px_rgba(0,0,0,0.1))]",
    bg: "system.error-secondary",
    flexShrink: "0",
  }),
};

export function ArchiveView({
  fileName = "Archivo 1.doc",
  type = "preview",
  src,
  selected = false,
  onSelect,
  className,
}: ArchiveViewProps) {
  const isPreview = type === "preview" || type === "preview-error";
  const isError = type === "preview-error" || type === "document-error";

  return (
    <div
      className={cx(
        css({
          display: "flex",
          flexDir: "column",
          alignItems: "center",
          gap: "2", // 8px
          position: "relative",
        }),
        className,
      )}
    >
      {/* Thumbnail / placeholder frame */}
      <div className={frameStyles[type]}>
        {isPreview && src && (
          <img
            src={src}
            alt={fileName}
            className={css({
              position: "absolute",
              inset: "0",
              w: "full",
              h: "full",
              objectFit: "cover",
              rounded: "[4px]",
            })}
          />
        )}
        {isPreview && type === "preview-error" && (
          <div
            className={css({
              position: "absolute",
              inset: "0",
              bg: "[rgba(255,173,173,0.15)]",
              rounded: "[4px]",
              pointerEvents: "none",
            })}
            aria-hidden
          />
        )}
        {!isPreview && (
          <div
            className={css({
              w: "12", // 48px
              h: "12",
              color: isError ? "system.error" : "brand.primary",
            })}
          >
            {isError ? (
              <XCircle size={48} weight="fill" />
            ) : (
              <CheckCircle size={48} weight="fill" />
            )}
          </div>
        )}

        {/* Selection checkbox (preview variants only) */}
        {isPreview && (
          <button
            type="button"
            role="checkbox"
            aria-checked={selected}
            onClick={() => onSelect?.(!selected)}
            className={css({
              position: "absolute",
              top: "0",
              right: "[0px]",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: "2",
              borderWidth: "0",
              bg: "[transparent]",
              cursor: "pointer",
            })}
            aria-label="Seleccionar archivo"
          >
            <div
              className={css({
                w: "[18px]",
                h: "[18px]",
                rounded: "sm",
                borderWidth: "[2px]",
                borderStyle: "solid",
                borderColor: selected
                  ? "action.alt-default"
                  : "brand.secondary",
                bg: selected ? "action.alt-default" : "[transparent]",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              })}
            >
              {selected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  aria-hidden
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </button>
        )}
      </div>

      {/* Filename */}
      <p
        className={css({
          textStyle: "label.md.default",
          color: "text.default",
          textAlign: "center",
          w: "[109px]",
        })}
      >
        {fileName}
      </p>

      {/* Error message */}
      {isError && (
        <p
          className={css({
            // Figma error message is 14px italic (subtitle.sm), not 12px.
            textStyle: "subtitle.sm.default",
            color: "system.error",
            fontStyle: "italic",
            textAlign: "center",
            minW: "full",
          })}
        >
          {type === "preview-error"
            ? "Error de carga.\nVolvelo a intentar."
            : "Error de guardado.\nVolver a cargar archivo."}
        </p>
      )}
    </div>
  );
}

export default ArchiveView;
