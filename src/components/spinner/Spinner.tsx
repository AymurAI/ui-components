import { css, cx } from "@/styled/css";
import { useId } from "react";

/**
 * Spinner — AymurAI UI Library.
 *
 * Figma family: 1994:29039, inner frame: 1568:25587
 * 48×48px animated arc spinner.
 * Track: #E6E8FF (no token — distinct from bg.primary-alternative #E5E8FF;
 *   use escape-hatch [#E6E8FF] if ever needed in a css() call)
 * Arc: gradient #3F479D → transparent (#3F479D = action.alt-default)
 *   Gradient coords match Figma asset exactly: x1=42 y1=20.5 x2=22 y2=42
 * Uses the `spin` animation token (1s linear infinite).
 */

const spinnerStyle = css({
  animation: "spin",
  display: "inline-block",
  flexShrink: "0",
});

export type SpinnerProps = {
  /** Size in px — defaults to 48 (Figma native). */
  size?: number;
  className?: string;
};

export function Spinner({ size = 48, className }: SpinnerProps) {
  // Use unique gradient ID per instance to avoid SVG collision when multiple
  // spinners are on the page simultaneously.
  const gradId = useId();

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Loading"
      role="status"
      className={cx(spinnerStyle, className)}
    >
      {/* Track ring — full circle, light colour */}
      <path
        d="M24 42C33.9411 42 42 33.9411 42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42Z"
        stroke="#E6E8FF"
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arc — fading gradient */}
      <path
        d="M42 24C42 14.0589 33.9411 6 24 6C14.0589 6 6 14.0589 6 24C6 33.9411 14.0589 42 24 42"
        stroke={`url(#${gradId})`}
        strokeWidth={3.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <defs>
        <linearGradient
          id={gradId}
          x1={42}
          y1={20.5}
          x2={22}
          y2={42}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#3F479D" />
          <stop offset={1} stopColor="#3F479D" stopOpacity={0} />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default Spinner;
