import { WarningCircle } from "phosphor-react";
import { useId } from "react";

import { Suggestion } from "@/components/suggestion/Suggestion";
import { cva, sva } from "@/styled/css";
import { hstack, stack } from "@/styled/patterns";

/**
 * TextField — form input with label, helper, error, prefix/suffix, and suggestion.
 * Ported from desktop-app/src/renderer/src/components/ui/input.tsx
 *
 * Figma: TextField family node 1:296 — sizes md/sm;
 * states: Placeholder / Focus / Typed / Disabled / Error / Suggestion.
 */
const input = sva({
  slots: ["container", "inputBox", "input", "label", "errorMessage", "helper"],
  base: {
    container: stack.raw({ gap: "1", width: "full" }),
    inputBox: {
      ...hstack.raw({ alignItems: "center", gap: "1" }),

      rounded: "sm",
      border: "primary",

      "&:focus-within": {
        outline: "none",
        boxShadow: "[0px 2px 2px rgba(0, 0, 0, 0.16)]",
      },
    },
    input: {
      textStyle: "label.md.default",
      // strictTokens: `border: "none"` is invalid — use borderWidth: "0"
      borderWidth: "0",
      outline: "none",
      flex: "[1]",
      bg: "[transparent]",

      "&::placeholder": {
        color: "text.lighter",
      },
    },
    label: { textStyle: "label.sm.default", color: "text.lighter" },
    errorMessage: {
      ...hstack.raw({ gap: "1" }),
      textStyle: "label.sm.default",
      color: "system.error",
    },
    helper: {
      textStyle: "label.sm.default",
      color: "text.lighter",
    },
  },
  variants: {
    size: {
      md: {
        input: { p: "3" },
      },
      sm: {
        input: { px: "3", py: "1" },
      },
    },
    disabled: {
      true: {
        inputBox: {
          bg: "bg.primary",
          border: "primary",
          color: "text.lighter",
          cursor: "not-allowed",
        },
        input: {
          cursor: "not-allowed",
        },
      },
      false: {
        inputBox: {
          // "white" is not a semantic token — use escape hatch
          bg: "[white]",
        },
      },
    },
    error: {
      true: {
        container: {
          color: "system.error",
        },
        inputBox: {
          border: "error",
        },
        input: {},
        label: { color: "system.error" },
      },
      false: {},
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
    size: "md",
  },
});

const affix = cva({
  base: {
    ...hstack.raw({ alignItems: "center", gap: "1" }),
    userSelect: "none",
    textStyle: "label.md.default",
  },
  variants: {
    position: {
      prefix: { pl: "3", mr: "-3" },
      suffix: { pr: "3", ml: "-3" },
    },
  },
});

export interface TextFieldProps
  extends Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "prefix" | "suffix" | "size"
    >,
    React.RefAttributes<HTMLInputElement> {
  /** Floating label above the input */
  label?: string;
  placeholder?: string;
  /** Text prefix shown before the input (e.g. currency symbol) */
  prefix?: string;
  /** Text suffix shown after the input (e.g. unit) */
  suffix?: string;
  /** Inline suggestion mark shown inside the input */
  suggestion?: string;
  /** Helper text shown below the input when there is no error */
  helper?: string;
  id?: string;
  value: string | undefined;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  disabled?: boolean;
  /** Error string — shown below the input with an icon; also sets aria-invalid */
  error?: string | null;
  type?: "text" | "number";
  size?: "md" | "sm";
}

export function TextField({
  // Rendering
  label,
  placeholder,
  prefix,
  suffix,
  suggestion,
  helper,
  // Control
  id,
  ref,
  value,
  onChange,
  disabled = false,
  error,
  type,
  size = "md",
  ...props
}: TextFieldProps) {
  const randomId = useId();
  const inputId = id ?? randomId;
  const errorMessageId = `${inputId}-error`;

  const classes = input({ disabled, error: !!error, size });

  return (
    <div className={classes.container}>
      {label && (
        <label className={classes.label} htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className={classes.inputBox}>
        {prefix && (
          <div className={affix({ position: "prefix" })}>
            <span>{prefix}</span>
            {/* Vertical separator — matches Figma design where this is rendered as text */}
            <span>|</span>
          </div>
        )}

        {suggestion && <Suggestion clickable>{suggestion}</Suggestion>}

        <input
          {...props}
          ref={ref}
          id={inputId}
          onChange={onChange}
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          className={classes.input}
          type={type ?? "text"}
          // Accessibility
          aria-describedby={errorMessageId}
          aria-invalid={!!error}
        />

        {suffix && (
          <div className={affix({ position: "suffix" })}>
            {/* Vertical separator — matches Figma design */}
            <span>|</span>
            <span>{suffix}</span>
          </div>
        )}
      </div>

      {helper && !error && <p className={classes.helper}>{helper}</p>}
      {error && (
        <p id={errorMessageId} role="alert" className={classes.errorMessage}>
          <WarningCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

export default TextField;
