import {
  CaretDownIcon,
  CaretUpIcon,
  CheckIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import * as RadixSelect from "@radix-ui/react-select";
import {
  type Ref,
  useEffect,
  useId,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { Suggestion } from "@/components/suggestion/Suggestion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/tooltip/Tooltip";
import { css, sva } from "@/styled/css";
import { styled } from "@/styled/jsx";
import { stack } from "@/styled/patterns";

/**
 * Select — Radix UI select / Dropdown with AymurAI styling.
 * Ported from desktop-app/src/renderer/src/components/ui/select.tsx
 *
 * Figma: Dropdown family node 1:637.
 */
const Affix = styled("span", {
  base: {
    textStyle: "label.md.default",
    color: "text.lighter",
    flexShrink: "0",
  },
});

export type SelectOption = { id: string; text: string; description?: string };
export type SelectSuggestion = { id: string; text?: string };

export interface SelectProps {
  options: SelectOption[];
  label?: string;
  value?: string;
  onChange?: (value: SelectOption) => void;
  prefix?: string;
  suffix?: string;
  suggestion?: SelectSuggestion;
  priorityOrder?: string[];
  placeholder?: string;
  disabled?: boolean;
  size?: "md" | "sm";
  /** Show a clear (×) control once an option is selected. Default: true. */
  clearable?: boolean;
  ref?: Ref<{ value: string | undefined }>;
}

function orderByPriority(options: SelectOption[], priority: string[] = []) {
  const filtered = options.filter(({ id }) => !priority.includes(id));
  const preferred = priority
    .map((p) => options.find(({ id }) => p === id))
    .filter((o): o is SelectOption => !!o);
  return [...preferred, ...filtered];
}

// Matches Radix Tooltip's own default hover delay. Kept separate from focus:
// Radix opens a tooltip instantly on focus (correct for keyboard users), but
// Select auto-focuses the current value when the list opens, which would
// otherwise pop its tooltip immediately with no hover involved. Driving
// `open` ourselves from pointer events only (ignoring focus) avoids that.
const OPTION_TOOLTIP_DELAY_MS = 700;

function SelectItem({
  id,
  text,
  description,
  itemClassName,
  itemIndicatorClassName,
}: {
  id: string;
  text: string;
  description?: string;
  itemClassName?: string;
  itemIndicatorClassName?: string;
}) {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );

  const item = (
    <RadixSelect.Item
      value={id}
      className={itemClassName}
      onPointerEnter={
        description
          ? () => {
              timeoutRef.current = setTimeout(
                () => setTooltipOpen(true),
                OPTION_TOOLTIP_DELAY_MS,
              );
            }
          : undefined
      }
      onPointerLeave={
        description
          ? () => {
              clearTimeout(timeoutRef.current);
              setTooltipOpen(false);
            }
          : undefined
      }
    >
      <RadixSelect.ItemIndicator className={itemIndicatorClassName}>
        <CheckIcon size={14} weight="bold" />
      </RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{text}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );

  if (!description) return item;

  return (
    <Tooltip open={tooltipOpen} onOpenChange={() => {}}>
      <TooltipTrigger asChild>{item}</TooltipTrigger>
      <TooltipContent side="right">{description}</TooltipContent>
    </Tooltip>
  );
}

function secureSuggestion(
  suggestion: SelectSuggestion | undefined,
  options: SelectOption[],
): SelectOption | undefined {
  if (!suggestion) return undefined;
  if (suggestion.text) return { id: suggestion.id, text: suggestion.text };
  return options.find(({ id }) => id === suggestion.id);
}

const select = sva({
  slots: [
    "container",
    "trigger",
    "value",
    "caret",
    "content",
    "viewport",
    "item",
    "itemIndicator",
    "scrollButton",
  ],
  base: {
    container: { ...stack.raw({ gap: "1" }), width: "full" },
    trigger: {
      display: "flex",
      alignItems: "center",
      gap: "2",
      width: "full",
      bg: "bg.secondary",
      border: "primary",
      rounded: "sm",
      cursor: "pointer",
      textAlign: "left",
      appearance: "none",
      textStyle: "label.md.default",
      color: "text.default",

      "&[data-state='open']": {
        boxShadow: "[0px 2px 2px rgba(0, 0, 0, 0.16)]",
        borderColor: "text.default",
      },
      "&:focus-visible": {
        outlineColor: "brand.primary",
        outlineWidth: "[0.5px]",
        outlineStyle: "solid",
        outlineOffset: "[0.5px]",
      },
      "&[data-disabled]": {
        bg: "bg.primary",
        cursor: "not-allowed",
        color: "text.lighter",
      },
      "&[data-placeholder]": {
        color: "text.lighter",
      },
    },
    value: {
      flex: "[1]",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
    },
    caret: {
      flexShrink: "0",
      color: "text.default",
      transition: "[transform 0.15s ease]",

      "[data-state='open'] &": {
        transform: "[rotate(180deg)]",
      },
    },
    content: {
      bg: "bg.secondary",
      rounded: "sm",
      boxShadow: "dropdown",
      border: "secondary",
      overflow: "hidden",
      zIndex: "10",
      minWidth: "[var(--radix-select-trigger-width)]",
      // Figma dropdown panel: py-[8px] vertical inset around option list.
      py: "2",
    },
    viewport: {
      maxHeight: "[400px]",
      overflowY: "auto",
    },
    scrollButton: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      py: "1",
      color: "text.lighter",
      cursor: "default",
      bg: "bg.secondary",
    },
    item: {
      display: "flex",
      alignItems: "center",
      gap: "2",
      textStyle: "label.md.default",
      color: "text.default",
      cursor: "pointer",
      outline: "none",
      userSelect: "none",

      // Only the hovered/keyboard-focused option is highlighted — the
      // selected option is already marked by its check indicator, so it
      // doesn't need to stay highlighted too once the list is open.
      "&[data-highlighted]": {
        bg: "bg.primary-alternative",
      },
      "&[data-disabled]": {
        cursor: "not-allowed",
        color: "text.lighter",
      },
    },
    itemIndicator: {
      color: "brand.primary",
      display: "flex",
      alignItems: "center",
      flexShrink: "0",
    },
  },
  variants: {
    size: {
      md: {
        // Figma trigger / option row M: px=16px, py=12px → tokens 4/3.
        trigger: { px: "4", py: "3" },
        item: { px: "4", py: "3" },
      },
      sm: {
        // Figma trigger / option row S: px=16px, py=8px → tokens 4/2.
        trigger: { px: "4", py: "2" },
        // Figma S option: 14px text (subtitle.sm), 8px vertical padding (40px row).
        item: { px: "4", py: "2", textStyle: "subtitle.sm.default" },
      },
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export function Select({
  options,
  label,
  value,
  onChange,
  prefix,
  suffix,
  suggestion,
  priorityOrder = [],
  placeholder = "",
  disabled = false,
  size = "md",
  clearable = true,
  ref,
}: SelectProps) {
  const triggerId = useId();
  const classes = select({ size });

  const orderedOptions = orderByPriority(options, priorityOrder);
  const securedSuggestion = secureSuggestion(suggestion, options);

  // Self-managed selection. Works both ways:
  //  - Controlled: parent passes `value` + `onChange` and re-renders (e.g. the
  //    Voz a Texto export format select). The effect keeps us in sync.
  //  - Uncontrolled/ref: consumers that only read the selection back through
  //    `ref` and never re-render on change (the dataset validation forms'
  //    register/useForm pattern). Here `value` is just the initial seed, so the
  //    component must own the selection or picking an option would revert.
  // Seed with "" (never undefined) so Radix stays controlled throughout and
  // doesn't emit an uncontrolled→controlled warning on first selection.
  const [selectedValue, setSelectedValue] = useState(value ?? "");

  useEffect(() => {
    setSelectedValue(value ?? "");
  }, [value]);

  // Expose the live selection (not the initial `value`) so ref-based consumers
  // capture user changes — useImperativeHandle re-runs when it changes, which is
  // what re-fires the forms' registration callback ref.
  useImperativeHandle(ref, () => ({ value: selectedValue }), [selectedValue]);

  const handleChange = (id: string) => {
    setSelectedValue(id);
    const option = options.find((o) => o.id === id);
    if (option) onChange?.(option);
  };

  const handleSuggestionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (securedSuggestion) handleChange(securedSuggestion.id);
  };

  const handleSuggestionKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      if (securedSuggestion) handleChange(securedSuggestion.id);
    }
  };

  return (
    <div className={classes.container}>
      {label && (
        <styled.label
          textStyle="label.sm.default"
          color={selectedValue ? "text.default" : "text.lighter"}
          htmlFor={triggerId}
        >
          {label}
        </styled.label>
      )}

      <RadixSelect.Root
        value={selectedValue}
        onValueChange={handleChange}
        disabled={disabled}
      >
        <RadixSelect.Trigger id={triggerId} asChild>
          {/* biome-ignore lint/a11y/useAriaPropsForRole: Radix merges aria-expanded and aria-controls onto this div at runtime via asChild */}
          <div className={classes.trigger} role="combobox" tabIndex={0}>
            {prefix && <Affix aria-hidden="true">{prefix} |</Affix>}

            <span className={classes.value}>
              {!selectedValue && securedSuggestion ? (
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onKeyDown={handleSuggestionKeyDown}
                  onClick={handleSuggestionClick}
                >
                  <Suggestion clickable>{securedSuggestion.text}</Suggestion>
                </button>
              ) : (
                <RadixSelect.Value placeholder={placeholder} />
              )}
            </span>

            {suffix && <Affix aria-hidden="true">| {suffix}</Affix>}

            {/* Clear control — resets the selection back to empty. Reads back
                through `ref` as "" for the forms' register pattern. */}
            {clearable && selectedValue && !disabled && (
              <button
                type="button"
                aria-label="Limpiar selección"
                className={css({
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: "0",
                  p: "0",
                  borderWidth: "0",
                  bg: "[transparent]",
                  cursor: "pointer",
                  color: "text.lighter",
                  "&:hover": { color: "text.default" },
                })}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedValue("");
                }}
              >
                <XCircleIcon size={16} />
              </button>
            )}

            {/* Caret sits at the trailing edge — matches Figma layout */}
            <RadixSelect.Icon asChild>
              <CaretDownIcon
                size={16}
                className={classes.caret}
                aria-hidden="true"
              />
            </RadixSelect.Icon>
          </div>
        </RadixSelect.Trigger>

        <RadixSelect.Portal>
          <RadixSelect.Content
            className={classes.content}
            position="popper"
            sideOffset={4}
          >
            <RadixSelect.ScrollUpButton className={classes.scrollButton}>
              <CaretUpIcon size={12} />
            </RadixSelect.ScrollUpButton>
            <RadixSelect.Viewport className={classes.viewport}>
              {orderedOptions.map(({ id, text, description }) => (
                <SelectItem
                  key={id}
                  id={id}
                  text={text}
                  description={description}
                  itemClassName={classes.item}
                  itemIndicatorClassName={classes.itemIndicator}
                />
              ))}
            </RadixSelect.Viewport>
            <RadixSelect.ScrollDownButton className={classes.scrollButton}>
              <CaretDownIcon size={12} />
            </RadixSelect.ScrollDownButton>
          </RadixSelect.Content>
        </RadixSelect.Portal>
      </RadixSelect.Root>
    </div>
  );
}

export default Select;
