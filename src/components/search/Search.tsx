import { css, cx, sva } from "@/styled/css";
import { CaretDown, CaretUp, MagnifyingGlass, X } from "phosphor-react";
import type { InputHTMLAttributes } from "react";

/**
 * Search — AymurAI UI Library "search" family node 1992:28026.
 *
 * Figma variants: Status = Default | Focus | Field | Suggestion
 *
 * Tokens used:
 *   bg.secondary              = #FFFFFF  (input background)
 *   border/primary            = 1px solid #BCBAB8  (Default border)
 *   border/primary-alt        = 1px solid #110041  (Focus border)
 *   [1px_solid_#9F99A5]       = Field + Suggestion border (border/secondary in Figma;
 *                               promote to preset as `border.tertiary` or rename
 *                               existing `border.secondary` which is currently #EDF2F7)
 *   text.lighter              = #625C68  (placeholder, result counter)
 *   text.default              = #110041  (typed text / suggestion text)
 *   [#2D3748]                 = Suggestion typed+caret colour (promote as text.secondary)
 *   bg.primary-alternative    = #E5E8FF  (suggestion highlight)
 *   shadows/input-focus       = 0px 2px 1px rgba(0,0,0,0.16)  (Focus + Suggestion)
 *   rounded full              (pill shape, 24px radius via full token)
 *
 * Right-side controls (Field state):
 *   onClear?   — renders X icon
 *   resultCount? — renders "1 de 2" counter + CaretUp + CaretDown
 *   onPrev?    — CaretUp handler
 *   onNext?    — CaretDown handler
 */

const searchInput = sva({
  slots: ["root", "inputWrap", "icon", "input", "suggestion"],
  base: {
    root: {
      display: "flex",
      flexDir: "column",
      gap: "1",
      position: "relative",
      rounded: "md",
    },
    inputWrap: {
      display: "flex",
      alignItems: "center",
      gap: "2", // 8px — Default state
      h: "12", // 48px
      px: "3", // 12px
      bg: "bg.secondary",
      border: "primary",
      rounded: "full",
      cursor: "text",
      transitionProperty: "[border-color, box-shadow]",
      transitionDuration: "normal",
      transitionTimingFunction: "default",
      "&:focus-within": {
        // Focus state: border primary-alt (#110041), drop-shadow, icon darkens
        border: "primary-alt",
        boxShadow: "input-focus",
        outline: "none",
      },
      // Icon darkens to text.default when focus-within
      "&:focus-within > span": {
        color: "text.default",
      },
    },
    icon: {
      flexShrink: "0",
      color: "text.lighter",
    },
    input: {
      flex: "[1]",
      borderWidth: "0",
      outline: "none",
      bg: "[transparent]",
      textStyle: "label.md.default",
      color: "text.default",
      minW: "[0px]",
      "&::placeholder": {
        color: "text.lighter",
      },
    },
    suggestion: {
      display: "flex",
      alignItems: "center",
      gap: "[2px]",
      flexShrink: "0",
    },
  },
});

export interface SearchProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  /** Autocomplete ghost suggestion shown after the typed text */
  suggestion?: string;
  /** Typed value (the non-ghost part) */
  value?: string;
  /** Result count label, e.g. "1 de 2" — triggers right-side controls group */
  resultCount?: string;
  /** Called when the user clicks CaretUp (previous result) */
  onPrev?: () => void;
  /** Called when the user clicks CaretDown (next result) */
  onNext?: () => void;
  /** Called when the user clicks the Clear (X) button */
  onClear?: () => void;
}

export function Search({
  suggestion,
  value,
  placeholder = "Buscar",
  className,
  resultCount,
  onPrev,
  onNext,
  onClear,
  ...props
}: SearchProps) {
  const classes = searchInput();

  // Field state: value is present (no suggestion). Border changes to #9F99A5,
  // gap shrinks to 6px, icon darkens to text.default.
  const hasValue = Boolean(value);
  const isSuggestion = Boolean(suggestion);
  const isField = hasValue && !isSuggestion;
  const hasRightControls = Boolean(resultCount || onClear);

  return (
    <div className={cx(classes.root, className)}>
      <div
        className={cx(
          classes.inputWrap,
          // Field + Suggestion: border/secondary in Figma (#9F99A5)
          (isField || isSuggestion) &&
            css({
              border: "[1px_solid_#9F99A5]",
            }),
          // Suggestion: also gets the drop-shadow (same as Focus)
          isSuggestion &&
            css({
              boxShadow: "input-focus",
            }),
          // Field + Suggestion + any value: gap shrinks to 6px
          (isField || isSuggestion) &&
            css({
              gap: "[6px]",
            }),
        )}
      >
        {/* Left: icon + text */}
        <span
          className={cx(
            classes.icon,
            // Icon darkens to text.default when a value is present (Field/Suggestion)
            hasValue && css({ color: "text.default" }),
          )}
        >
          <MagnifyingGlass size={24} />
        </span>

        <div
          className={css({
            display: "flex",
            alignItems: "center",
            flex: "1",
            gap: "[2px]",
            minW: "[0px]",
            overflow: "hidden",
          })}
        >
          <input
            {...props}
            type="search"
            value={value}
            placeholder={suggestion ? undefined : placeholder}
            className={cx(
              classes.input,
              css({ flex: suggestion ? "[0_0_auto]" : "1" }),
              // Suggestion typed text: Figma shows #2D3748, not text.default (#110041)
              isSuggestion &&
                css({
                  color: "[#2D3748]",
                }),
            )}
          />
          {suggestion && (
            <>
              {/* Caret "|": Inter Regular (paragraph.md.default) per Figma */}
              <span
                className={css({
                  // Inter Regular at 16px / 1.5 line-height
                  fontFamily: "[Inter,sans-serif]",
                  fontWeight: "[400]",
                  fontSize: "[16px]",
                  lineHeight: "[1.5]",
                  color: "[#2D3748]",
                  flexShrink: "0",
                })}
              >
                |
              </span>
              <span
                className={css({
                  bg: "bg.primary-alternative",
                  color: "text.default",
                  textStyle: "label.md.default",
                  px: "[2px]",
                  flexShrink: "0",
                })}
              >
                {suggestion}
              </span>
            </>
          )}
        </div>

        {/* Right-side controls (Field state): Clear + counter + prev/next */}
        {hasRightControls && (
          <div
            className={css({
              display: "flex",
              alignItems: "center",
              gap: "[2px]",
              flexShrink: "0",
            })}
          >
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                aria-label="Limpiar búsqueda"
                className={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  w: "[24px]",
                  h: "[24px]",
                  borderWidth: "0",
                  bg: "[transparent]",
                  color: "text.lighter",
                  cursor: "pointer",
                  flexShrink: "0",
                  p: "0",
                  "&:hover": { color: "text.default" },
                })}
              >
                <X size={24} />
              </button>
            )}
            {resultCount && (
              <div
                className={css({
                  display: "flex",
                  alignItems: "center",
                  gap: "[2px]",
                  flexShrink: "0",
                })}
              >
                <span
                  className={css({
                    textStyle: "label.md.default",
                    color: "text.lighter",
                    whiteSpace: "nowrap",
                    flexShrink: "0",
                  })}
                >
                  {resultCount}
                </span>
                <button
                  type="button"
                  onClick={onPrev}
                  aria-label="Resultado anterior"
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    w: "[24px]",
                    h: "[24px]",
                    borderWidth: "0",
                    bg: "[transparent]",
                    color: "text.lighter",
                    cursor: "pointer",
                    flexShrink: "0",
                    p: "0",
                    "&:hover": { color: "text.default" },
                  })}
                >
                  <CaretUp size={24} />
                </button>
                <button
                  type="button"
                  onClick={onNext}
                  aria-label="Resultado siguiente"
                  className={css({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    w: "[24px]",
                    h: "[24px]",
                    borderWidth: "0",
                    bg: "[transparent]",
                    color: "text.lighter",
                    cursor: "pointer",
                    flexShrink: "0",
                    p: "0",
                    "&:hover": { color: "text.default" },
                  })}
                >
                  <CaretDown size={24} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Search;
