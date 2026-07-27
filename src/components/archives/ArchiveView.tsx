import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { css, cva, cx } from "@/styled/css";
import { Spinner } from "../spinner";

/**
 * ArchiveView — AymurAI UI Library "archive-view" family node 222:21065.
 *
 * Figma types:
 *   Previsualitation        — thumbnail image preview, filename below,
 *                             checkbox overlay (top-right corner)
 *   Previsualitation Error  — same thumbnail but error border (#DC582E) + pink tint,
 *                             "Error de carga." italic message below filename
 *   Document OK             — grey placeholder box + CheckCircle icon (48px),
 *                             filename below
 *   Document Error          — error coloured placeholder + XCircle icon (48px),
 *                             "Error de guardado." italic message below filename
 *
 * `size="lg"` (367×426px) has no dedicated Figma type — it formalizes the
 * single-document preview from the "Anonimizador - Preview" screen (node
 * 40002579:88220), shared by every flow that reads one docx/pdf at a time
 * (Dataset, Anonimizador). That screen pairs the thumbnail with a separate
 * {@link ArchiveRow} for the filename/size/delete action, so `size="lg"`
 * never renders its own caption — only `size="sm"` (default, 157×192px,
 * the original grid thumbnail) does.
 *
 * `type="preview-loading"` also has no Figma type — it formalizes
 * desktop-app's own ad-hoc `loadingPreview` spinner box, shown while a
 * dropped file is still being parsed.
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
  | "preview-loading"
  | "preview-error"
  | "document-ok"
  | "document-error";

export type ArchiveViewSize = "sm" | "lg";

export interface ArchiveViewProps {
  fileName?: string;
  type?: ArchiveViewType;
  size?: ArchiveViewSize;
  /** Optional thumbnail image URL (used for preview variants) */
  src?: string;
  /** Whether the selection checkbox renders at all (preview variants only). */
  selectable?: boolean;
  /** Whether file is selected (shows checked checkbox overlay) */
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
  className?: string;
}

const frame = cva({
  base: {
    position: "relative",
    rounded: "md",
    borderWidth: "[4px]",
    borderStyle: "solid",
    flexShrink: "0",
  },
  variants: {
    size: {
      sm: { w: "[157px]", h: "[192px]" },
      lg: { w: "[367px]", h: "[426px]" },
    },
    type: {
      preview: {
        overflow: "hidden",
        borderColor: "[#BCBAB8]",
        boxShadow: "[0px_0px_4px_rgba(0,0,0,0.1)]",
        bg: "bg.secondary",
      },
      "preview-loading": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "[#BCBAB8]",
        boxShadow: "[0px_0px_4px_rgba(0,0,0,0.1)]",
        bg: "bg.secondary",
      },
      "preview-error": {
        overflow: "hidden",
        borderColor: "system.error",
        boxShadow: "[0px_0px_4px_rgba(0,0,0,0.1)]",
        bg: "bg.secondary",
      },
      "document-ok": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "[#BCBAB8]",
        filter: "[drop-shadow(0px_0px_2px_rgba(0,0,0,0.1))]",
        bg: "bg.primary",
      },
      "document-error": {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "system.error",
        filter: "[drop-shadow(0px_0px_2px_rgba(0,0,0,0.1))]",
        bg: "system.error-secondary",
      },
    },
  },
  defaultVariants: { size: "sm", type: "preview" },
});

export function ArchiveView({
  fileName = "Archivo 1.doc",
  type = "preview",
  size = "sm",
  src,
  selectable = true,
  selected = false,
  onSelect,
  className,
}: ArchiveViewProps) {
  const isPreview = type === "preview" || type === "preview-error";
  const isError = type === "preview-error" || type === "document-error";
  const isLoading = type === "preview-loading";
  const showCaption = size !== "lg";

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
      <div className={frame({ size, type })}>
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
        {isLoading && <Spinner />}
        {!isPreview && !isLoading && (
          <div
            className={css({
              w: "12", // 48px
              h: "12",
              color: isError ? "system.error" : "brand.primary",
            })}
          >
            {isError ? (
              <XCircleIcon size={48} weight="fill" />
            ) : (
              <CheckCircleIcon size={48} weight="fill" />
            )}
          </div>
        )}

        {/* Selection checkbox (preview variants only) */}
        {isPreview && selectable && (
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

      {/* Filename — size="lg" pairs with a separate ArchiveRow instead. */}
      {showCaption && (
        <p
          className={css({
            margin: "0", // no preflight — <p> keeps the UA default margin otherwise
            textStyle: "label.md.default",
            color: "text.default",
            textAlign: "center",
            w: "[109px]",
          })}
        >
          {fileName}
        </p>
      )}

      {/* Error message — Figma: 14px italic, two lines, constrained to card width. */}
      {showCaption && isError && (
        <p
          className={css({
            margin: "0",
            textStyle: "subtitle.sm.default",
            color: "system.error",
            fontStyle: "italic",
            textAlign: "center",
            w: "[157px]",
          })}
        >
          {type === "preview-error" ? (
            <>
              <span className={css({ display: "block" })}>Error de carga.</span>
              <span className={css({ display: "block" })}>
                Volvelo a intentar.
              </span>
            </>
          ) : (
            <>
              <span className={css({ display: "block" })}>
                Error de guardado.
              </span>
              <span className={css({ display: "block" })}>
                Volver a cargar archivo.
              </span>
            </>
          )}
        </p>
      )}
    </div>
  );
}

export default ArchiveView;
