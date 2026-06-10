import { cx } from "@/styled/css";

/**
 * CheckCircle — AymurAI UI Library.
 *
 * Figma family: 1568:25593 (success/complete state icon).
 * 48×48px. Full circle stroke in brand/secondary (#C5CAFF) + gradient overlay
 * from action/alt-default (#3F479D) → transparent.
 * This represents a completed/success state (not an animated spinner).
 */

export type CheckCircleProps = {
  /** Size in px — defaults to 48 (Figma native). */
  size?: number;
  className?: string;
  "aria-label"?: string;
};

export function CheckCircle({
  size = 48,
  className,
  "aria-label": ariaLabel = "Success",
}: CheckCircleProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label={ariaLabel}
      role="img"
      className={cx(className)}
    >
      {/* Base circle — brand/secondary */}
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        stroke="#C5CAFF"
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Gradient overlay circle — action/alt-default fade */}
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        stroke="url(#check-circle-grad)"
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id="check-circle-grad"
          x1={20}
          y1={6}
          x2={36}
          y2={40}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3F479D" />
          <stop offset={1} stopColor="#3F479D" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default CheckCircle;
