import { DotsNine, Question } from "phosphor-react";
import { css, cx } from "@/styled/css";
import { BigIconButton } from "../big-icon-button";
import { Button } from "../button";
import { Logo } from "../logo";
import { Stepper } from "../stepper";

/**
 * AppHeader — top navigation bar shared across Voz a Texto, Anonimizador and
 * Set de Datos flows (logo + stepper + help + app switcher). AymurAI UI
 * Library "bar" master (node 186:18325), variant "Type=top bar" (symbol
 * 173:16655) — not registered in the previous Figma-alignment audit.
 *
 * Figma's library symbol shows just the iso mark (no feature name) with
 * every step's label hidden except the active one; the real Voz a Texto
 * screens (e.g. Editor, node 40002322:57366) show the full logo with a
 * feature name instead. `featureName` covers both: omit it for the bare
 * iso mark, pass it for "iso mark + divider + name".
 *
 * No Figma node documents the container's own spacing (only the 96px-tall
 * bar itself) — padding/height here follow Toolbar's conventions as a
 * best-effort match pending a dedicated node.
 */
const root = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "6", // 24px
  h: "[96px]",
  px: "12", // 48px
  bg: "bg.secondary",
  borderBottomWidth: "[1px]",
  borderBottomStyle: "solid",
  borderBottomColor: "[#BCBAB8]", // border.primary colour, no bare token
});

const stepperWrap = css({
  display: "flex",
  flex: "1",
  justifyContent: "center",
});

const actionsWrap = css({
  display: "flex",
  alignItems: "center",
  gap: "4", // 16px
  flexShrink: "0",
});

export interface AppHeaderProps {
  /** Feature name shown next to the logo (e.g. "Voz a Texto"). Omit for the bare iso mark. */
  featureName?: string;
  /** Step labels — only the active step's label is shown, matching Figma. */
  steps: string[];
  /** 0-based index of the current step */
  current: number;
  onHelp?: () => void;
  onOpenApps?: () => void;
  helpLabel?: string;
  appsLabel?: string;
  className?: string;
}

export function AppHeader({
  featureName,
  steps,
  current,
  onHelp,
  onOpenApps,
  helpLabel = "Ayuda",
  appsLabel = "Aplicaciones",
  className,
}: AppHeaderProps) {
  const stepperSteps = steps.map((label, i) => ({
    label: i === current ? label : "",
  }));

  return (
    <div className={cx(root, className)}>
      {featureName ? (
        <Logo variant="logo-feature" featureName={featureName} />
      ) : (
        <Logo variant="iso" />
      )}

      <div className={stepperWrap}>
        <Stepper steps={stepperSteps} current={current} />
      </div>

      <div className={actionsWrap}>
        <Button
          variant="tertiary"
          size="icon-md"
          aria-label={helpLabel}
          onClick={onHelp}
        >
          <Question size={20} />
        </Button>
        <BigIconButton
          variant="primary"
          size="small"
          aria-label={appsLabel}
          onClick={onOpenApps}
        >
          <DotsNine size={20} />
        </BigIconButton>
      </div>
    </div>
  );
}

export default AppHeader;
