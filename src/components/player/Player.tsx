import {
  ArrowClockwise,
  ArrowCounterClockwise,
  Pause,
  Play,
} from "phosphor-react";
import {
  type MouseEvent,
  type ReactNode,
  type Ref,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { BigIconButton } from "@/components/big-icon-button/BigIconButton";
import { css } from "@/styled/css";
import { formatTimestamp } from "@/utils/timestamp";

/**
 * Player — audio player bar. AymurAI UI Library "Player" (node 40001482:38874)
 * and the editor footer (node 40001486:41884).
 *
 * Transport controls (rewind 5s / play-pause / forward 5s / speed cycle),
 * a click-to-seek progress bar, an elapsed-time display, and an optional
 * `rightSlot` (used in the editor to inject the "Finalizar" button).
 *
 * The 4 transport controls are `BigIconButton` instances (Figma uses
 * "🟢big icon button🟢" for all four) — play/pause is `primary`, the rest
 * are `tertiary`. Speed stays a cycling button (confirmed with product: not
 * a 5-option picker — Figma's row of speeds documents each symbol
 * individually, it isn't a literal "all options visible" spec).
 *
 * Ported from desktop-app's voice-to-text/audio-player (i18n removed; aria
 * labels are props with Spanish defaults).
 */

const playerBar = css({
  display: "flex",
  flexDir: "row",
  alignItems: "center",
  justifyContent: "space-between",
  px: "12",
  py: "6",
  // Figma editor-footer bar: h-99px (24px top pad + 36px content + 24px bottom pad + 15px frame
  // rounding ≈ 99px). Use escape-hatch to match exactly.
  minHeight: "[99px]",
  bg: "bg.secondary",
  borderTopWidth: "[1px]",
  borderTopStyle: "solid",
  // #BCBAB8 is border.primary color but no bare color token exists; escape-hatch required.
  borderTopColor: "[#BCBAB8]",
  boxSizing: "border-box",
});

const controls = css({
  display: "flex",
  flexDir: "row",
  alignItems: "center",
  gap: "1",
  width: "[156px]",
  flexShrink: "0",
});

const skipLabel = css({
  fontSize: "[8px]",
  lineHeight: "[1]",
  position: "absolute",
  top: "[50%]",
  left: "[50%]",
  transform: "[translate(-50%, -50%)]",
  fontWeight: "[700]",
  color: "text.default",
  userSelect: "none",
  pointerEvents: "none",
});

const speedText = css({
  fontSize: "[11px]",
  fontWeight: "[600]",
  color: "text.default",
  whiteSpace: "nowrap",
  userSelect: "none",
});

// Figma: Controls + progress Container share a row with gap-[24px]; this inner
// wrapper holds them so rightSlot stays at the far edge via space-between.
const transportRow = css({
  display: "flex",
  flexDir: "row",
  alignItems: "center",
  gap: "6",
  flex: "[1]",
  minWidth: "0",
});

const progressSection = css({
  display: "flex",
  flexDir: "row",
  alignItems: "center",
  // Figma: progress track + timestamp gap is 16px (gap-[16px])
  gap: "4",
  flex: "[1]",
  minWidth: "0",
});

const progressBar = css({
  height: "2",
  bg: "bg.secondary-highlight",
  rounded: "full",
  flex: "[1]",
  cursor: "pointer",
  position: "relative",
  overflow: "hidden",
});

const progressFill = css({
  height: "[100%]",
  bg: "brand.primary",
  rounded: "full",
  position: "absolute",
  left: "[0]",
  top: "[0]",
});

const timeDisplay = css({
  textStyle: "label.sm.default",
  color: "text.lighter",
  whiteSpace: "nowrap",
  flexShrink: "0",
});

export interface PlayerHandle {
  play(): void;
  pause(): void;
  seekTo(ms: number): void;
  setPlaybackRate(rate: number): void;
}

export interface PlayerLabels {
  rewind5s?: string;
  forward5s?: string;
  play?: string;
  pause?: string;
  speed?: string;
}

export interface PlayerProps {
  /** Audio source URL */
  src: string;
  /** Total duration in milliseconds */
  durationMs: number;
  onTimeUpdate?: (currentMs: number) => void;
  onEnded?: () => void;
  /** Node rendered at the right edge (e.g. the editor "Finalizar" button) */
  rightSlot?: ReactNode;
  /** Speed cycle values — Figma offers 0.5×/1×/1.5×/2×/3× */
  playbackRates?: number[];
  /** Accessible labels (default Spanish) */
  labels?: PlayerLabels;
  /** Imperative handle (React 19 ref-as-prop) */
  ref?: Ref<PlayerHandle>;
}

const DEFAULT_RATES = [1, 1.5, 2, 3, 0.5];

const DEFAULT_LABELS: Required<PlayerLabels> = {
  rewind5s: "Retroceder 5 segundos",
  forward5s: "Adelantar 5 segundos",
  play: "Reproducir",
  pause: "Pausar",
  speed: "Velocidad de reproducción",
};

export function Player({
  src,
  durationMs,
  onTimeUpdate,
  onEnded,
  rightSlot,
  playbackRates = DEFAULT_RATES,
  labels,
  ref,
}: PlayerProps) {
  const t = { ...DEFAULT_LABELS, ...labels };
  const audioRef = useRef<HTMLAudioElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentMs, setCurrentMs] = useState(0);
  const [rateIndex, setRateIndex] = useState(0);

  useImperativeHandle(ref, () => ({
    play() {
      audioRef.current?.play();
    },
    pause() {
      audioRef.current?.pause();
    },
    seekTo(ms: number) {
      if (audioRef.current) audioRef.current.currentTime = ms / 1000;
    },
    setPlaybackRate(rate: number) {
      if (audioRef.current) audioRef.current.playbackRate = rate;
    },
  }));

  const handleTimeUpdate = useCallback(() => {
    if (!audioRef.current) return;
    const ms = audioRef.current.currentTime * 1000;
    setCurrentMs(ms);
    onTimeUpdate?.(ms);
  }, [onTimeUpdate]);

  const handleEnded = useCallback(() => {
    setIsPlaying(false);
    onEnded?.();
  }, [onEnded]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
      setIsPlaying(true);
    } else {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  }, []);

  const rewind5s = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.max(
      0,
      audioRef.current.currentTime - 5,
    );
  }, []);

  const forward5s = useCallback(() => {
    if (!audioRef.current) return;
    const duration = audioRef.current.duration || 0;
    audioRef.current.currentTime = Math.min(
      duration,
      audioRef.current.currentTime + 5,
    );
  }, []);

  const cycleSpeed = useCallback(() => {
    setRateIndex((prev) => {
      const nextIndex = (prev + 1) % playbackRates.length;
      if (audioRef.current) {
        audioRef.current.playbackRate = playbackRates[nextIndex];
      }
      return nextIndex;
    });
  }, [playbackRates]);

  const handleBarClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (!barRef.current) return;
      const rect = barRef.current.getBoundingClientRect();
      const ratio = Math.max(
        0,
        Math.min(1, (e.clientX - rect.left) / rect.width),
      );
      const seekMs = ratio * durationMs;
      if (audioRef.current) audioRef.current.currentTime = seekMs / 1000;
      setCurrentMs(seekMs);
      onTimeUpdate?.(seekMs);
    },
    [durationMs, onTimeUpdate],
  );

  const fillPercent = durationMs > 0 ? (currentMs / durationMs) * 100 : 0;

  return (
    <div className={playerBar}>
      {/* biome-ignore lint/a11y/useMediaCaption: programmatic audio, no captions */}
      <audio
        ref={audioRef}
        src={src}
        hidden
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* transportRow mirrors Figma's inner Container (gap-24px: Controls + progress) */}
      <div className={transportRow}>
        <div className={controls}>
          <BigIconButton
            variant="tertiary"
            size="small"
            aria-label={t.rewind5s}
            onClick={rewind5s}
          >
            <ArrowCounterClockwise size={20} />
            <span className={skipLabel}>5</span>
          </BigIconButton>

          <BigIconButton
            variant="primary"
            size="small"
            aria-label={isPlaying ? t.pause : t.play}
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </BigIconButton>

          <BigIconButton
            variant="tertiary"
            size="small"
            aria-label={t.forward5s}
            onClick={forward5s}
          >
            <ArrowClockwise size={20} />
            <span className={skipLabel}>5</span>
          </BigIconButton>

          <BigIconButton
            variant="tertiary"
            size="small"
            aria-label={t.speed}
            onClick={cycleSpeed}
          >
            <span className={speedText}>{playbackRates[rateIndex]}×</span>
          </BigIconButton>
        </div>

        <div className={progressSection}>
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: click-to-seek only, no keyboard support */}
          {/* biome-ignore lint/a11y/noStaticElementInteractions: click-to-seek only, no keyboard support */}
          <div ref={barRef} onClick={handleBarClick} className={progressBar}>
            <div
              className={progressFill}
              style={{ width: `${fillPercent}%` }}
            />
          </div>
          <span className={timeDisplay}>
            {formatTimestamp(currentMs)} / {formatTimestamp(durationMs)}
          </span>
        </div>
      </div>

      {rightSlot}
    </div>
  );
}

export default Player;
