import { ArrowsClockwise, CheckCircle, Stop, X } from "phosphor-react";
import { Button } from "@/components/button/Button";
import { css, cx } from "@/styled/css";

/**
 * ArchiveProgress — AymurAI UI Library "archives in progress" family node 173:24064.
 *
 * Figma states:
 *   Default 20%     — active progress bar at 20%, "Detener" (stop) button
 *   Default 50%     — active progress bar at 50%
 *   Stopped         — disabled bar (grey), disabled "Detener" button
 *   Replace archive — error state, "Reemplazar" button
 *   Error           — error text + error bar (system.error-secondary bg), "Reemplazar" button
 *   Completed       — full bar (action.alt-default), CheckCircle + "Carga finalizada 100%"
 *
 * Props:
 *   fileName   — file name string
 *   progress   — 0–100 number
 *   status     — one of the 6 states
 *   onStop     — called when "Detener" clicked
 *   onReplace  — called when "Reemplazar" clicked
 *   onDismiss  — called when X (dismiss) clicked
 *
 * Tokens:
 *   action.progress       = #CED1F4   (active progress fill, Figma-exact)
 *   bg.primary            = #F6F5F7   (progress track)
 *   action.disabled       = #E0DDE2   (stopped track + button border)
 *   action.alt-default    = #3F479D   (completed fill)
 *   system.error          = #DC582E   (error text + border)
 *   system.error-secondary= #FFECE5   (error track)
 *   text.default          = #110041
 *   text.onbutton-disabled= #2D3748   (stopped text)
 *
 * Note: The animated progress shimmer mask from Figma is omitted (complex
 * CSS mask animation not representable in Panda tokens); plain colour fill used.
 */

export type ArchiveProgressStatus =
  | "default"
  | "stopped"
  | "replace"
  | "error"
  | "completed";

export interface ArchiveProgressProps {
  fileName?: string;
  /** 0–100 */
  progress?: number;
  status?: ArchiveProgressStatus;
  onStop?: () => void;
  onReplace?: () => void;
  onDismiss?: () => void;
  className?: string;
}

// Same stripe geometry for every variant (2px stripe / 7px repeat, 45deg) —
// only the colour changes between "in progress" and "completed".
function diagonalStripe(color: string): string {
  return `repeating-linear-gradient(45deg, ${color} 0px, ${color} 2px, transparent 2px, transparent 7px)`;
}

// ── Progress bar sub-component ───────────────────────────────────────────────

function ProgressBar({
  progress,
  status,
}: {
  progress: number;
  status: ArchiveProgressStatus;
}) {
  const trackBg =
    status === "stopped"
      ? "action.disabled"
      : status === "error"
        ? "system.error-secondary"
        : "bg.primary";

  const fillBg =
    status === "completed"
      ? "action.alt-default"
      : status === "error"
        ? "system.error-secondary"
        : status === "stopped"
          ? "action.disabled"
          : "action.progress";

  const pct = Math.min(100, Math.max(0, progress));

  // Figma renders the active/completed fill with a 45° diagonal hatch texture
  // (a "barber-pole" loading pattern): periwinkle stripes over the light-blue
  // in-progress fill, white stripes over the navy completed fill. Applied as an
  // inline backgroundImage (gradients are not tokenizable).
  //
  // The angle and stripe geometry (2px stripe / 7px repeat) are shared between
  // both variants on purpose — Figma renders them identically, only the
  // stripe colour changes. Confirmed pixel-by-pixel against the Figma
  // reference (node 173:24064): the previous 135deg produced the mirrored
  // "/" diagonal instead of Figma's "\".
  const stripe =
    status === "completed"
      ? diagonalStripe("rgba(255,255,255,0.5)")
      : status === "default"
        ? diagonalStripe("rgba(63,71,157,0.35)")
        : undefined;

  return (
    <div
      className={css({
        position: "relative",
        h: "[16px]",
        w: "full",
        rounded: "xs",
        overflow: "hidden",
      })}
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {/* Track */}
      <div
        className={css({
          position: "absolute",
          inset: "0",
          rounded: "xs",
          bg: trackBg,
        })}
      />
      {/* Fill */}
      <div
        className={css({
          position: "absolute",
          top: "0",
          left: "0",
          h: "full",
          rounded: "xs",
          bg: fillBg,
          transitionProperty: "[width]",
          transitionDuration: "normal",
          transitionTimingFunction: "default",
        })}
        style={{ width: `${pct}%`, backgroundImage: stripe }}
      />
    </div>
  );
}

// ── Right-side label ──────────────────────────────────────────────────────────

function ProgressLabel({
  progress,
  status,
}: {
  progress: number;
  status: ArchiveProgressStatus;
}) {
  if (status === "completed") {
    return (
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          gap: "1",
          flexShrink: "0",
          // Icon + label both inherit currentColor (no raw CSS-var leak).
          color: "brand.primary",
        })}
      >
        <CheckCircle size={19} />
        <span
          className={css({
            textStyle: "label.md.default",
            whiteSpace: "nowrap",
          })}
        >
          Carga finalizada 100%
        </span>
      </div>
    );
  }

  if (status === "error") {
    return (
      <span
        className={css({
          textStyle: "label.md.default",
          fontWeight: "[300]",
          color: "system.error",
          fontStyle: "italic",
          whiteSpace: "nowrap",
        })}
      >
        Error de carga de archivo. Volvelo a intentar
      </span>
    );
  }

  // Figma: "Replace archive" shows a light-italic caption (text.lighter), not a %.
  if (status === "replace") {
    return (
      <span
        className={css({
          textStyle: "label.md.default",
          fontWeight: "[300]",
          color: "text.lighter",
          fontStyle: "italic",
          whiteSpace: "nowrap",
        })}
      >
        Detuviste el procesamiento de este archivo
      </span>
    );
  }

  return (
    <span
      className={css({
        textStyle: "label.md.default",
        color: status === "stopped" ? "text.onbutton-disabled" : "text.default",
        w: "[37px]",
        textAlign: "right",
        flexShrink: "0",
      })}
    >
      {progress}%
    </span>
  );
}

// ── Public component ──────────────────────────────────────────────────────────

export function ArchiveProgress({
  fileName = "Archivo 1.doc",
  progress = 0,
  status = "default",
  onStop,
  onReplace,
  onDismiss,
  className,
}: ArchiveProgressProps) {
  const nameColor =
    status === "error"
      ? "system.error"
      : status === "stopped" || status === "replace"
        ? "text.onbutton-disabled"
        : "text.default";

  const showStopButton = status === "default" || status === "stopped";
  const showReplaceButton = status === "replace" || status === "error";
  // Figma shows the dismiss X on every state, including completed.
  const showDismiss = true;

  return (
    <div
      className={cx(
        css({
          display: "flex",
          alignItems: "center",
          gap: "4", // 16px
          py: "2", // 8px
          w: "full",
        }),
        className,
      )}
    >
      {/* Text + bar */}
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          flex: "1",
          gap: "[5px]",
          justifyContent: "center",
          minW: "[0px]",
        })}
      >
        {/* Filename row */}
        <div
          className={css({
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            w: "full",
          })}
        >
          <span
            className={css({
              textStyle: "label.md.default",
              color: nameColor,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            })}
          >
            {fileName}
          </span>
          <ProgressLabel progress={progress} status={status} />
        </div>

        {/* Progress bar */}
        <ProgressBar
          progress={status === "completed" ? 100 : progress}
          status={status}
        />
      </div>

      {/* Action buttons */}
      {(showStopButton || showReplaceButton) && (
        <div
          className={css({
            display: "flex",
            alignItems: "center",
            gap: "4",
            flexShrink: "0",
          })}
        >
          {showStopButton && (
            <Button
              variant="secondary"
              size="sm"
              disabled={status === "stopped"}
              onClick={onStop}
              // Figma: 141×41px. `size="sm"` (32px tall) is the closest real
              // variant for padding/radius, but its own `h` recipe class
              // collides with — and, being an atomic class, unpredictably
              // wins or loses against — any `h` override passed via
              // className. `style` always wins over class-based CSS, so the
              // one-off 41px height/141px width live there instead.
              className={css({ px: "4", py: "2", gap: "1" })}
              style={{ height: 41, width: 141 }}
            >
              <Stop size={16} />
              Detener
            </Button>
          )}
          {showReplaceButton && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onReplace}
              className={css({ px: "4", py: "2", gap: "1" })}
              style={{ height: 41 }}
            >
              <ArrowsClockwise size={16} />
              Reemplazar
            </Button>
          )}
        </div>
      )}

      {/* Dismiss X */}
      {showDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Descartar"
          className={css({
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: "0",
            borderWidth: "0",
            bg: "[transparent]",
            cursor: "pointer",
            color: "text.default",
            "&:hover": { color: "action.hover" },
          })}
        >
          <X size={24} />
        </button>
      )}
    </div>
  );
}

export default ArchiveProgress;
