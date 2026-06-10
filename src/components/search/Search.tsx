import { css, cx, sva } from "@/styled/css";
import { MagnifyingGlass } from "phosphor-react";
import type { InputHTMLAttributes } from "react";

/**
 * Search — AymurAI UI Library "search" family node 1992:28026.
 *
 * Figma variants: Status = Default | Focus | Field | Suggestion
 *
 * Tokens used:
 *   bg.secondary           = #FFFFFF  (input background)
 *   border/primary         = 1px solid #BCBAB8  (Default border)
 *   text.lighter           = #625C68  (placeholder)
 *   text.default           = #110041  (typed text / suggestion text)
 *   bg.primary-alternative = #E5E8FF  (suggestion highlight)
 *   rounded full           (pill shape, 24px radius via full token)
 *
 * The Search component is a controlled-friendly input.
 * `suggestion` prop shows autocomplete ghost text next to cursor text.
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
      gap: "2", // 8px
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
        borderColor: "action.alt-default",
        boxShadow: "[0px 2px 1px rgba(0,0,0,0.16)]",
        outline: "none",
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
}

export function Search({
  suggestion,
  value,
  placeholder = "Buscar",
  className,
  ...props
}: SearchProps) {
  const classes = searchInput();

  return (
    <div className={cx(classes.root, className)}>
      <div className={classes.inputWrap}>
        <span className={classes.icon}>
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
            )}
          />
          {suggestion && (
            <>
              <span
                className={css({
                  color: "text.default",
                  textStyle: "label.md.default",
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
      </div>
    </div>
  );
}

export default Search;
