import { Button } from "@/components/button/Button";
import { css, cx } from "@/styled/css";
import { ArrowsClockwise, CheckCircle, Stop, X } from "phosphor-react";

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
 *   action.default        = #C5CAFF   (active progress fill — approximate, Figma shows #CED1F4)
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
          : "action.default";

  const pct = Math.min(100, Math.max(0, progress));

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
        style={{ width: `${pct}%` }}
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
        })}
      >
        <CheckCircle size={19} color="var(--colors-brand-primary)" />
        <span
          className={css({
            textStyle: "label.md.default",
            color: "brand.primary",
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
          color: "system.error",
          fontStyle: "italic",
          whiteSpace: "nowrap",
        })}
      >
        Error de carga de archivo. Volvelo a intentar
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
      : status === "stopped"
        ? "text.onbutton-disabled"
        : "text.default";

  const showStopButton = status === "default" || status === "stopped";
  const showReplaceButton = status === "replace" || status === "error";
  const showDismiss = status !== "completed";

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
              className={css({
                h: "[41px]",
                px: "4",
                py: "2",
                gap: "1",
                w: "[141px]",
              })}
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
              className={css({
                h: "[41px]",
                px: "4",
                py: "2",
                gap: "1",
              })}
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
