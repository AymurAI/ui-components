import { XIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { css } from "@/styled/css";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../dialog";
import { TutorialGrid, type TutorialStep } from "./TutorialGrid";

/**
 * TutorialDialog — "¿Cómo funciona?" modal, composed over
 * `DialogContent size="lg"` (see Dialog.tsx) so it inherits the
 * viewport-bound width that replaced desktop-app's `minWidth:900px` +
 * `maxW:5xl!` hack for this exact screen.
 *
 * Every pipeline (Dataset, Anonimizador, Voz a Texto) shares this same
 * dialog; only `title`, `steps` and `trigger` differ per consumer.
 */

const closeButton = css({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "text.lighter",
  borderWidth: "0",
  bg: "[transparent]",
  cursor: "pointer",
  "&:hover": { color: "text.default" },
});

const titleStyle = css({
  margin: "0",
  textStyle: "subtitle.md.strong",
});

export interface TutorialDialogProps {
  /** Element that opens the dialog when clicked (e.g. a Button or icon button). */
  trigger: ReactNode;
  title: string;
  steps: TutorialStep[];
  /** Accessible label for the close (X) button. */
  closeLabel?: string;
}

export function TutorialDialog({
  trigger,
  title,
  steps,
  closeLabel = "Cerrar",
}: TutorialDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent size="lg">
        <DialogHeader>
          <DialogTitle className={titleStyle}>{title}</DialogTitle>
          <DialogClose className={closeButton} aria-label={closeLabel}>
            <XIcon size={32} />
          </DialogClose>
        </DialogHeader>
        <TutorialGrid steps={steps} />
      </DialogContent>
    </Dialog>
  );
}

export default TutorialDialog;
