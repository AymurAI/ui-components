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
 *
 * Key Figma measurements (from get_design_context):
 *  - inputBox: h-[48px], p-[12px] all sides, rounded-[4px] (sm), bg white
 *  - Placeholder border: #BCBAB8 (border/primary)
 *  - Typed border: #9F99A5 (border/secondary) — darker when value present
 *  - Focus: border primary-alt (#110041) + drop-shadow(0 2 1 rgba(0,0,0,0.16))
 *  - Disabled: bg #F6F5F7 (bg.primary), border primary, text lighter
 *  - Error: border + label + input text all system.error (#DC582E)
 *  - Suggestion: border secondary + drop-shadow (same as focus shadow)
 *  - Label: 12px, text.lighter; turns text.default on focus
 *  - Prefix separator: border-right #C3CCD7 (brand.secondary), pr-[8px]
 */
const input = sva({
  slots: ["container", "inputBox", "input", "label", "errorMessage", "helper"],
  base: {
    container: stack.raw({ gap: "1", width: "full" }),
    inputBox: {
      ...hstack.raw({ alignItems: "center", gap: "2" }),

      // Figma: p-[12px] on the container box, h-[48px], rounded-[4px]
      p: "3",
      h: "12",
      rounded: "sm",
      border: "primary",
      bg: "bg.secondary",

      "&:focus-within": {
        outline: "none",
        // Figma Focus: border turns primary-alt (#110041) + drop-shadow
        border: "primary-alt",
        boxShadow: "input-focus",
      },
    },
    input: {
      textStyle: "label.md.default",
      // strictTokens: `border: "none"` is invalid — use borderWidth: "0"
      borderWidth: "0",
      outline: "none",
      flex: "[1]",
      minW: "0",
      bg: "[transparent]",
      // Figma: typed input text is text.default
      color: "text.default",

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
      // Figma M and S: both use h-[48px] + p-[12px] — no visual size difference in the spec
      md: {},
      sm: {},
    },
    disabled: {
      true: {
        inputBox: {
          bg: "bg.primary",
          border: "primary",
          cursor: "not-allowed",
        },
        input: {
          cursor: "not-allowed",
          color: "text.lighter",
        },
      },
      false: {},
    },
    error: {
      true: {
        inputBox: {
          border: "error",
        },
        // Figma Error: input text and label both turn system.error
        input: { color: "system.error" },
        label: { color: "system.error" },
      },
      false: {},
    },
    // Typed: Figma uses border/secondary (#9F99A5) when a value is present
    typed: {
      true: {
        inputBox: { border: "secondary" },
      },
      false: {},
    },
    // Suggestion: Figma shows secondary border + same drop-shadow as focus
    suggestion: {
      true: {
        inputBox: {
          border: "secondary",
          boxShadow: "input-focus",
        },
      },
      false: {},
    },
  },
  defaultVariants: {
    error: false,
    disabled: false,
    size: "md",
    typed: false,
    suggestion: false,
  },
});

// Prefix/suffix separator styling.
// Figma: prefix has a border-right divider in brand.secondary (#C3CCD7) with pr-[8px].
// Suffix mirrors with a border-left divider and pl-[8px].
const affix = cva({
  base: {
    ...hstack.raw({ alignItems: "center" }),
    flexShrink: "0",
    userSelect: "none",
    textStyle: "label.md.default",
    color: "text.lighter",
  },
  variants: {
    position: {
      prefix: {
        // Figma: right border separator, color brand.secondary (#C3CCD7), pr-[8px]
        borderRightWidth: "1",
        borderRightStyle: "solid",
        borderRightColor: "brand.secondary",
        pr: "2",
      },
      suffix: {
        // Mirror: left border separator
        borderLeftWidth: "1",
        borderLeftStyle: "solid",
        borderLeftColor: "brand.secondary",
        pl: "2",
      },
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

  // Derive typed state: value present + not disabled + not error
  const isTyped = !!value && !disabled && !error;
  const hasSuggestion = !!suggestion;

  const classes = input({
    disabled,
    error: !!error,
    size,
    typed: isTyped,
    suggestion: hasSuggestion,
  });

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
