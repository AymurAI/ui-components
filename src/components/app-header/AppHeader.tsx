import { DotsNine, Question } from "phosphor-react";
import type { ReactElement, ReactNode } from "react";
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
 * `steps` and `current` are supplied together for multi-step flows and may
 * both be omitted elsewhere. `slots` lets router and Radix consumers wrap the
 * default logo/buttons without recreating their styles or focus behaviour.
 *
 * The top-bar variant is 1440×96px with 48px horizontal padding. Its three
 * layout regions are 203px (logo), 332px (stepper), and 203px (actions), so
 * the stepper remains centered even when the logo content changes width.
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

const logoWrap = css({
  display: "flex",
  alignItems: "center",
  w: "[203px]",
  flexShrink: "0",
});

const stepperWrap = css({
  display: "flex",
  alignItems: "center",
  w: "[332px]",
  h: "[52px]",
  flexShrink: "0",
});

const actionsWrap = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  gap: "4", // 16px
  w: "[203px]",
  flexShrink: "0",
});

const helpIcon = css({ color: "text.lighter" });

export interface AppHeaderSlots {
  /** Wrap or replace the default Logo while preserving the header layout. */
  logo?: (defaultElement: ReactElement) => ReactNode;
  /** Wrap or replace the default help Button (for example with DialogTrigger). */
  help?: (defaultElement: ReactElement) => ReactNode;
  /** Wrap or replace the default apps button (for example with PopoverTrigger). */
  apps?: (defaultElement: ReactElement) => ReactNode;
}

interface AppHeaderBaseProps {
  /** Feature name shown next to the logo (e.g. "Voz a Texto"). Omit for the bare iso mark. */
  featureName?: string;
  onHelp?: () => void;
  onOpenApps?: () => void;
  helpLabel?: string;
  appsLabel?: string;
  /** Optional wrappers for the three interactive/visual header regions. */
  slots?: AppHeaderSlots;
  className?: string;
}

type AppHeaderProgressProps =
  | {
      /** Step labels — only the active step's label is shown, matching Figma. */
      steps: string[];
      /** 0-based index of the current step */
      current: number;
    }
  | {
      /** Omit both progress props on screens that do not have a step flow. */
      steps?: undefined;
      current?: undefined;
    };

export type AppHeaderProps = AppHeaderBaseProps & AppHeaderProgressProps;

export function AppHeader({
  featureName,
  steps,
  current,
  onHelp,
  onOpenApps,
  helpLabel = "Ayuda",
  appsLabel = "Aplicaciones",
  slots,
  className,
}: AppHeaderProps) {
  const hasProgress = steps !== undefined && current !== undefined;
  const stepperSteps = hasProgress
    ? steps.map((label, i) => ({ label: i === current ? label : "" }))
    : [];

  const defaultLogo = featureName ? (
    <Logo variant="logo-feature" featureName={featureName} />
  ) : (
    <Logo variant="iso" />
  );
  const defaultHelp = (
    <Button
      variant="tertiary"
      size="icon-sm"
      aria-label={helpLabel}
      onClick={onHelp}
      style={{ padding: 2, borderRadius: 4 }}
    >
      <Question size={32} className={helpIcon} />
    </Button>
  );
  const defaultApps = (
    <BigIconButton
      variant="primary"
      size="small"
      aria-label={appsLabel}
      onClick={onOpenApps}
      style={{ padding: 2, borderRadius: 4 }}
    >
      <DotsNine size={32} />
    </BigIconButton>
  );

  return (
    <div className={cx(root, className)}>
      <div className={logoWrap}>
        {slots?.logo ? slots.logo(defaultLogo) : defaultLogo}
      </div>

      {hasProgress && (
        <div className={stepperWrap}>
          <Stepper steps={stepperSteps} current={current} />
        </div>
      )}

      <div className={actionsWrap}>
        {slots?.help ? slots.help(defaultHelp) : defaultHelp}
        {slots?.apps ? slots.apps(defaultApps) : defaultApps}
      </div>
    </div>
  );
}

export default AppHeader;
