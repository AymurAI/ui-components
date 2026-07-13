import type { HTMLAttributes } from "react";
import { css, cva, cx } from "@/styled/css";

/**
 * Stepper — AymurAI UI Library "stepper" family node 173:16557.
 *
 * Figma variants:
 *   Step states: default (disabled/bg action.disabled), focus (active/bg action.default + border).
 *
 * Layout: horizontal row of step+text cells. A thin connecting bar between
 * steps is rendered as a flex spacer line (not in Figma as a distinct element
 * but implied by the horizontal layout; omitted as assumption — steps are
 * inline with padding).
 *
 * Tokens:
 *   action.default  = #C5CAFF  (Focus/active indicator)
 *   action.disabled = #E0DDE2  (Disabled/inactive)
 *   text.default    = #110041
 *   border/primary-alt = 1px solid #110041
 */

// ── Step indicator pill ──────────────────────────────────────────────────────

const stepIndicator = cva({
  base: {
    display: "flex",
    flexDir: "column",
    alignItems: "center",
    justifyContent: "center",
    h: "[36px]",
    w: "[36px]",
    p: "[10px]",
    rounded: "full",
    flexShrink: "0",
    textStyle: "cta.md.strong",
    color: "text.default",
    transitionProperty: "[background-color, border-color]",
    transitionDuration: "normal",
    transitionTimingFunction: "default",
  },
  variants: {
    state: {
      // Completed step (Figma Editor: filled action.alt-default, white number).
      complete: {
        bg: "action.alt-default",
        color: "text.onbutton-alternative",
        borderWidth: "0",
      },
      focus: {
        bg: "action.default",
        border: "primary-alt",
      },
      disabled: {
        bg: "action.disabled",
        borderWidth: "0",
        // Figma: the step number stays text.default in the pending state.
        color: "text.default",
      },
    },
  },
  defaultVariants: { state: "disabled" },
});

type StepState = "complete" | "focus" | "disabled";

// ── Single step+text cell ────────────────────────────────────────────────────

interface StepCellProps {
  index: number;
  label: string;
  state: StepState;
}

function StepCell({ index, label, state }: StepCellProps) {
  return (
    <div
      className={css({
        display: "flex",
        alignItems: "center",
        gap: "2", // 8px
        p: "2", // 8px
        flexShrink: "0",
      })}
    >
      <div className={stepIndicator({ state })}>
        <span
          className={css({
            textStyle: "cta.md.strong",
            lineHeight: "none",
            w: "[16px]",
            textAlign: "center",
          })}
        >
          {index + 1}
        </span>
      </div>
      {label && (
        <span
          className={css({
            textStyle: "label.md.default",
            color: "text.default",
            whiteSpace: "nowrap",
          })}
        >
          {label}
        </span>
      )}
    </div>
  );
}

// ── Connector bar between steps ──────────────────────────────────────────────

function StepConnector({ active }: { active: boolean }) {
  return (
    <div
      className={css({
        flex: "1",
        h: "[2px]",
        bg: active ? "action.alt-default" : "action.disabled",
        minW: "[16px]",
        alignSelf: "center",
        transitionProperty: "[background-color]",
        transitionDuration: "normal",
        transitionTimingFunction: "default",
      })}
    />
  );
}

// ── Public API ───────────────────────────────────────────────────────────────

export interface StepDef {
  label: string;
}

export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Step definitions — label for each step */
  steps: StepDef[];
  /** 0-based index of the currently active step */
  current: number;
}

export function Stepper({ steps, current, className, ...props }: StepperProps) {
  return (
    <div
      {...props}
      className={cx(
        css({
          display: "flex",
          alignItems: "center",
          w: "full",
        }),
        className,
      )}
      role="list"
      aria-label="Progress"
    >
      {steps.map((step, i) => {
        const state: StepState =
          i < current ? "complete" : i === current ? "focus" : "disabled";
        return (
          <div
            key={i}
            className={css({
              display: "flex",
              alignItems: "center",
              flex: i < steps.length - 1 ? "1" : undefined,
            })}
            role="listitem"
            aria-current={i === current ? "step" : undefined}
          >
            <StepCell index={i} label={step.label} state={state} />
            {i < steps.length - 1 && <StepConnector active={i < current} />}
          </div>
        );
      })}
    </div>
  );
}

export default Stepper;
