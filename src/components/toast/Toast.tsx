import type { Icon } from "phosphor-react";
import { type Toast as HotToast, toast } from "react-hot-toast";

import { Callout, type CalloutVariant } from "@/components/callout/Callout";

/**
 * Toast — wraps Callout with react-hot-toast integration.
 * Ported from desktop-app/src/renderer/src/components/ui/toast.tsx
 *
 * Figma: Toast family node 1994:30384 — Error / Warning / Success / Info.
 */
export type ToastVariant = CalloutVariant;

const ASSERTIVE_VARIANTS: ToastVariant[] = ["error", "warning"];

export interface ToastProps {
  t: HotToast;
  message: string;
  variant?: ToastVariant;
  icon?: Icon;
}

export function Toast({ t, message, variant = "info", icon }: ToastProps) {
  const isAssertive = ASSERTIVE_VARIANTS.includes(variant);

  return (
    <div style={{ maxWidth: "75%", width: "100%" }}>
      <Callout
        message={message}
        variant={variant}
        icon={icon}
        onDismiss={() => toast.remove(t.id)}
        role={isAssertive ? "alert" : "status"}
        aria-live={isAssertive ? "assertive" : "polite"}
        aria-atomic="true"
      />
    </div>
  );
}

export default Toast;
