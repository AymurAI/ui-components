import { css, cx } from "@/styled/css";
import { Switch, type SwitchProps } from "../switch";

/**
 * CategoryItem — a labelled row with a trailing toggle, used to enable/disable
 * categories. AymurAI UI Library node 40001297:49803.
 *
 * Layout: bg.secondary (white), h 40px, px 16px / py 8px, rounded sm (4px),
 * label on the left (label.md.default) and a {@link Switch} on the right.
 */
const root = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "2",
  w: "full",
  h: "[40px]",
  px: "4", // 16px
  py: "2", // 8px
  rounded: "sm", // 4px
  bg: "bg.secondary",
  textStyle: "label.md.default",
  color: "text.default",
});

export type CategoryItemProps = {
  /** Row label */
  label: string;
  className?: string;
} & Pick<
  SwitchProps,
  "checked" | "defaultChecked" | "onCheckedChange" | "disabled" | "name"
>;

export function CategoryItem({
  label,
  className,
  checked,
  defaultChecked,
  onCheckedChange,
  disabled,
  name,
}: CategoryItemProps) {
  return (
    <div className={cx(root, className)}>
      <span>{label}</span>
      <Switch
        checked={checked}
        defaultChecked={defaultChecked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        name={name}
        aria-label={label}
      />
    </div>
  );
}

export default CategoryItem;
