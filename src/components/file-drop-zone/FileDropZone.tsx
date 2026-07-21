import type { DragEvent, ReactNode } from "react";
import { useRef, useState } from "react";
import { css, cva, cx } from "@/styled/css";
import { stack } from "@/styled/patterns";

/**
 * FileDropZone — file-selection surface shared by Dataset, Anonimizador and
 * Voz a Texto onboarding. No Figma frame documents this component; it
 * formalizes desktop-app's own `DropArea` (already byte-identical across
 * the three flows) instead — including its two real gaps: no `disabled`
 * state existed before (styled from scratch, following the codebase's
 * `opacity: 0.5` disabled convention, e.g. `Search`'s prev/next buttons),
 * and no `:focus-visible` styling existed before (added here, matching
 * `Button`'s outline + shadow treatment).
 *
 * Purely presentational: it never inspects file names or extensions.
 * `onDrop` hands the consumer the raw dropped `File[]`; filtering by
 * extension, single/multiple selection, and the hidden `<input type="file">`
 * all stay in desktop-app.
 *
 * `dragging` is self-managed by default (native dragenter/dragleave with a
 * counter, ported from `DropArea`, so nested children don't cause flicker)
 * but accepts a controlled override — mainly so Storybook can force the
 * state without simulating a real OS drag gesture.
 */

const zone = cva({
  base: {
    display: "flex",
    flexDir: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: { base: "6", sm: "8" },
    w: "full",
    minH: "[335px]",
    p: { base: "4", sm: "8" },
    rounded: "sm",
    border: "primary",
    bg: "[#F3F4FF]", // token gap: idle drop-zone tint, distinct from bg.primary-alternative (#E5E8FF)
    boxShadow: "[0px_4px_20px_rgba(0,0,0,0.05)]",
    cursor: "pointer",
    transitionProperty: "[border-color, background-color, box-shadow]",
    transitionDuration: "normal",
    transitionTimingFunction: "default",

    "&:focus-visible:enabled": {
      outline: "primary-alt",
      outlineWidth: "[2px]",
      boxShadow: "focus",
    },
    "&:disabled": {
      cursor: "not-allowed",
      opacity: "0.5",
    },
  },
  variants: {
    dragging: {
      true: {
        borderColor: "brand.primary",
        bg: "bg.primary-alternative",
        boxShadow: "[0px_0px_15px_0px_#3F479D66]",
      },
      false: {},
    },
  },
  defaultVariants: { dragging: false },
});

const iconContainer = cva({
  base: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    w: "[70px]",
    h: "[70px]",
    p: "[14px]",
    rounded: "[14px]",
    flexShrink: "0",
    bg: "bg.primary-alternative",
    color: "text.lighter",
    "& svg": { w: "full", h: "full" },
  },
});

const titleStyle = css({
  textStyle: "subtitle.md.default",
  color: "text.default",
  textAlign: "center",
  whiteSpace: "pre-line", // titles carry real line breaks, e.g. "...para\ntranscribir"
  maxW: "[361px]",
});

const descriptionStyle = css({
  textStyle: "subtitle.sm.default",
  color: "text.lighter",
  textAlign: "center",
});

export interface FileDropZoneProps {
  icon: ReactNode;
  title: string;
  description: string;
  /** Forces the dragging visual; omit to let the component track real drag events. */
  dragging?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  /** Receives the raw dropped files — extension/type filtering stays in the consumer. */
  onDrop?: (files: File[]) => void;
  className?: string;
}

export function FileDropZone({
  icon,
  title,
  description,
  dragging,
  disabled = false,
  onClick,
  onDrop,
  className,
}: FileDropZoneProps) {
  const [internalDragging, setInternalDragging] = useState(false);
  const dragCounter = useRef(0);
  const isDragging = dragging ?? internalDragging;

  function handleDragEnter(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    dragCounter.current += 1;
    setInternalDragging(true);
  }

  function handleDragLeave(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (disabled) return;
    dragCounter.current = Math.max(0, dragCounter.current - 1);
    if (dragCounter.current === 0) setInternalDragging(false);
  }

  function handleDragOver(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleDrop(event: DragEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    dragCounter.current = 0;
    setInternalDragging(false);
    if (disabled) return;
    if (event.dataTransfer.files.length > 0) {
      onDrop?.(Array.from(event.dataTransfer.files));
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={cx(zone({ dragging: isDragging }), className)}
    >
      <span className={iconContainer()}>{icon}</span>
      <div
        className={css({ ...stack.raw({ gap: "1" }), alignItems: "center" })}
      >
        <p className={titleStyle}>{title}</p>
        <p className={descriptionStyle}>{description}</p>
      </div>
    </button>
  );
}

export default FileDropZone;
