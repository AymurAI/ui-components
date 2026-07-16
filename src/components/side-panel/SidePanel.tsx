import { Plus, Trash } from "phosphor-react";
import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { css } from "@/styled/css";
import { stack } from "@/styled/patterns";
import { isValidTimestamp } from "@/utils/timestamp";
import type { AvatarColor } from "../avatar";
import { Avatar } from "../avatar";
import { AvatarPill } from "../avatar-pill";
import { Button } from "../button";
import { Dialog, DialogContent, DialogTitle } from "../dialog";
import { TextField } from "../text-field";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import { ArrowsMerge } from "./ArrowsMergeIcon";

/**
 * SidePanel — "Side Panel Voz a texto" (speech-to-text turn editor).
 * AymurAI UI Library node 40002322:53113.
 *
 * Composite assembled from {@link AvatarPill}, {@link TextField},
 * {@link Button}, {@link Dialog} and {@link Tooltip}. Sections: selected
 * turn card, suggested people, timestamp, and turn actions (merge
 * previous/next, add below, delete).
 *
 * Merge actions use the Phosphor "ArrowsMerge" glyph (vendored in
 * ./ArrowsMergeIcon as phosphor-react@1.4.1 predates it): base points down
 * ("siguiente"), rotated 180° points up ("anterior").
 *
 * Consumers need a `TooltipProvider` somewhere up the tree for the Acciones
 * tooltips (see Tooltip.tsx / this component's story).
 *
 * Merging two turns whose speakers differ shows a confirm modal (Figma
 * "Conflicto Nombre etiqueta", node 40002384:38487) before firing
 * `onMergePrevious`/`onMergeNext` — pass `previousTurnName`/`nextTurnName` to
 * enable it; without them, merge fires immediately (previous behaviour).
 *
 * Speaker pills opt into rename with `renamable: true`. Supplying both
 * `onRenamePerson` and `onMergePeople` enables the pencil/input flow; a name
 * collision with another editable person asks for confirmation before the
 * source and target identities are reported to the consumer for merging.
 */
export type SidePanelPerson = {
  /** Stable consumer identity, used as the React key when available. */
  id?: string;
  initials: string;
  name: string;
  color?: AvatarColor;
  /** Enables the AvatarPill rename affordance when rename callbacks are set. */
  renamable?: boolean;
};

type ConfirmState = {
  title: string;
  description: string;
  onConfirm: () => void;
};

type RenameConflictState = {
  sourceIndex: number;
  targetIndex: number;
};

export type SidePanelProps = {
  /** The currently selected transcript turn */
  turn: { initials: string; name: string; time: string; color?: AvatarColor };
  /** Suggested speakers shown as pills */
  people: SidePanelPerson[];
  /** Index of the selected pill in `people` */
  selectedIndex?: number;
  onSelectPerson?: (index: number) => void;
  onNewPerson?: () => void;
  /** Persists a non-conflicting speaker rename. Set with `onMergePeople` to enable editing. */
  onRenamePerson?: (index: number, nextName: string) => void;
  /** Merges the edited source identity into the existing target identity. Set with `onRenamePerson`. */
  onMergePeople?: (sourceIndex: number, targetIndex: number) => void;
  /** Timestamp field value (e.g. "01:15") — `MM:SS` or `H+:MM:SS` */
  timestamp: string;
  onTimestampChange?: (value: string) => void;
  onMergePrevious?: () => void;
  onMergeNext?: () => void;
  /** Speaker name of the previous turn — enables the merge confirm modal */
  previousTurnName?: string;
  /** Speaker name of the next turn — enables the merge confirm modal */
  nextTurnName?: string;
  onAddBelow?: () => void;
  onDelete?: () => void;
  className?: string;
};

const root = css({
  display: "flex",
  flexDirection: "column",
  gap: "6", // 24px
  pt: "[42px]",
  px: "8", // 32px
  pb: "8",
  bg: "bg.primary",
  w: "full",
});

const card = css({
  ...stack.raw({ gap: "1" }), // 4px
  bg: "bg.secondary",
  rounded: "md", // 8px
  px: "4", // 16px
  py: "3", // 12px
  w: "full",
});

const cardTitle = css({
  textStyle: "subtitle.sm.default",
  color: "text.default",
});
const turnRow = css({ display: "flex", alignItems: "center", gap: "2" });
const turnName = css({
  textStyle: "label.md.strong",
  color: "text.lighter",
  whiteSpace: "nowrap",
});
const turnTime = css({
  textStyle: "label.md.default",
  color: "text.lighter",
  whiteSpace: "nowrap",
});

const sectionHeading = css({
  textStyle: "subtitle.md.strong", // Archivo SemiBold 20px
  color: "text.default",
});
const pills = css({
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: "2", // 8px
  w: "full",
});
const actions = css({ ...stack.raw({ gap: "4" }), w: "full" }); // 16px
const fullWidthButton = css({ w: "full" });
const divider = css({
  h: "[1px]",
  w: "full",
  bg: "[#BCBAB8]", // Figma divider line (border/primary colour)
});

// Confirm modal (Figma "Conflicto Nombre etiqueta", node 40002384:38487):
// title + description + Combinar/Cancelar, centered over a full-screen overlay.
const confirmTitle = css({
  textStyle: "subtitle.sm.strong",
  color: "text.default",
});
const confirmDescription = css({
  textStyle: "label.sm.default",
  color: "text.default",
});
const confirmButtons = css({
  display: "flex",
  alignItems: "center",
  gap: "3", // 12px
});

function Section({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
}) {
  return (
    <div className={css({ ...stack.raw({ gap: "4" }), w: "full" })}>
      <p className={sectionHeading}>{heading}</p>
      {children}
    </div>
  );
}

function ActionButton({
  tooltip,
  ...props
}: {
  tooltip: string;
} & ComponentProps<typeof Button>) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          size="sm"
          className={fullWidthButton}
          {...props}
        />
      </TooltipTrigger>
      <TooltipContent side="left">{tooltip}</TooltipContent>
    </Tooltip>
  );
}

const visuallyHidden = css({
  position: "absolute",
  w: "[1px]",
  h: "[1px]",
  p: "0",
  m: "[-1px]",
  overflow: "hidden",
  clip: "[rect(0,0,0,0)]",
  whiteSpace: "nowrap",
  borderWidth: "0",
});

const confirmTextBlock = css({
  ...stack.raw({ gap: "1" }), // 4px
});

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={css({
          ...stack.raw({ gap: "4" }), // 16px
          boxShadow: "[0px 2px 4px rgba(0,0,0,0.12)]",
        })}
      >
        <DialogTitle asChild>
          <span className={visuallyHidden}>{title}</span>
        </DialogTitle>
        <div className={confirmTextBlock}>
          <p className={confirmTitle}>{title}</p>
          <p className={confirmDescription}>{description}</p>
        </div>
        <div className={confirmButtons}>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Combinar
          </Button>
          <Button variant="tertiary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function SidePanel({
  turn,
  people,
  selectedIndex,
  onSelectPerson,
  onNewPerson,
  onRenamePerson,
  onMergePeople,
  timestamp,
  onTimestampChange,
  onMergePrevious,
  onMergeNext,
  previousTurnName,
  nextTurnName,
  onAddBelow,
  onDelete,
  className,
}: SidePanelProps) {
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [renameConflict, setRenameConflict] =
    useState<RenameConflictState | null>(null);

  const timestampError = isValidTimestamp(timestamp)
    ? null
    : "Formato inválido (MM:SS o H+:MM:SS)";

  function finishEditing() {
    setEditingIndex(null);
    setEditValue("");
    setRenameConflict(null);
  }

  function startEditing(index: number) {
    setEditingIndex(index);
    setEditValue(people[index]?.name ?? "");
    setRenameConflict(null);
  }

  function handleRenameCommit(index: number, nextName: string) {
    const person = people[index];
    const trimmedName = nextName.trim();
    if (!person || !trimmedName || trimmedName === person.name) {
      finishEditing();
      return;
    }

    const normalizedName = trimmedName.toLocaleLowerCase();
    const targetIndex = people.findIndex(
      (candidate, candidateIndex) =>
        candidateIndex !== index &&
        candidate.renamable &&
        candidate.name.trim().toLocaleLowerCase() === normalizedName,
    );

    if (targetIndex >= 0) {
      // Drop out of typing/input mode — the confirm dialog is the only
      // active affordance now.
      setEditingIndex(null);
      setEditValue("");
      setRenameConflict({
        sourceIndex: index,
        targetIndex,
      });
      return;
    }

    onRenamePerson?.(index, trimmedName);
    finishEditing();
  }

  function confirmPeopleMerge() {
    if (!renameConflict) return;
    onMergePeople?.(renameConflict.sourceIndex, renameConflict.targetIndex);
    finishEditing();
  }

  function handleMergePrevious() {
    if (previousTurnName && previousTurnName !== turn.name) {
      setConfirm({
        title: `Vas a unir este turno con el de "${previousTurnName}".`,
        description:
          "Los turnos se combinan en uno solo, con la persona del turno anterior.",
        onConfirm: () => {
          onMergePrevious?.();
          setConfirm(null);
        },
      });
    } else {
      onMergePrevious?.();
    }
  }

  function handleMergeNext() {
    if (nextTurnName && nextTurnName !== turn.name) {
      setConfirm({
        title: `Vas a unir este turno con el de "${nextTurnName}".`,
        description:
          "Los turnos se combinan en uno solo, con la persona del turno siguiente.",
        onConfirm: () => {
          onMergeNext?.();
          setConfirm(null);
        },
      });
    } else {
      onMergeNext?.();
    }
  }

  return (
    <div className={className ? `${root} ${className}` : root}>
      {/* Selected turn */}
      <div className={card}>
        <p className={cardTitle}>Turno seleccionado</p>
        <div className={turnRow}>
          <Avatar initials={turn.initials} size="sm" color={turn.color} />
          <span className={turnName}>{turn.name}</span>
          <span className={turnTime}>{turn.time}</span>
        </div>
      </div>

      {/* Suggested people */}
      <Section heading="Personas sugeridas">
        <div className={pills}>
          {people.map((person, index) => {
            const isEditing = editingIndex === index;
            const canRename =
              person.renamable && onRenamePerson && onMergePeople;

            return (
              <span
                key={person.id ?? `${person.initials}-${person.name}-${index}`}
                className={css({ display: "inline-flex" })}
              >
                <AvatarPill
                  initials={person.initials}
                  name={person.name}
                  color={person.color}
                  state={
                    isEditing
                      ? "typing"
                      : index === selectedIndex
                        ? "selected"
                        : "default"
                  }
                  onClick={() => onSelectPerson?.(index)}
                  onRename={canRename ? () => startEditing(index) : undefined}
                  editValue={isEditing ? editValue : undefined}
                  onEditValueChange={isEditing ? setEditValue : undefined}
                  onEditCommit={
                    isEditing
                      ? (value) => handleRenameCommit(index, value)
                      : undefined
                  }
                  onEditCancel={isEditing ? finishEditing : undefined}
                  renameInputLabel={`Editar nombre de ${person.name}`}
                />
              </span>
            );
          })}
          <Button variant="tertiary" size="sm" onClick={onNewPerson}>
            <Plus size={16} />
            Nuevo
          </Button>
        </div>
        <ConfirmDialog
          open={renameConflict !== null}
          onOpenChange={(open) => {
            if (!open) finishEditing();
          }}
          title={
            renameConflict
              ? `Ya existe "${people[renameConflict.targetIndex]?.name}".`
              : ""
          }
          description={
            renameConflict
              ? `Al combinar, los turnos de "${people[renameConflict.sourceIndex]?.name}" pasan a "${people[renameConflict.targetIndex]?.name}".`
              : ""
          }
          onConfirm={confirmPeopleMerge}
          onCancel={finishEditing}
        />
      </Section>
      <div className={divider} />

      {/* Timestamp */}
      <Section heading="Marca de tiempo">
        <TextField
          value={timestamp}
          onChange={(e) => onTimestampChange?.(e.target.value)}
          aria-label="Marca de tiempo"
          error={timestampError}
        />
      </Section>
      <div className={divider} />

      {/* Actions */}
      <Section heading="Acciones">
        <div className={actions}>
          <ActionButton
            tooltip="Combina este turno con el anterior"
            onClick={handleMergePrevious}
          >
            <ArrowsMerge size={16} style={{ transform: "rotate(180deg)" }} />
            Unir con el anterior
          </ActionButton>
          <ActionButton
            tooltip="Combina este turno con el siguiente"
            onClick={handleMergeNext}
          >
            <ArrowsMerge size={16} />
            Unir con el siguiente
          </ActionButton>
          <ActionButton
            tooltip="Agrega un turno nuevo debajo de este"
            onClick={onAddBelow}
          >
            <Plus size={16} />
            Agregar debajo
          </ActionButton>
          <ActionButton tooltip="Elimina este turno" onClick={onDelete}>
            <Trash size={16} />
            Eliminar
          </ActionButton>
        </div>
        <ConfirmDialog
          open={confirm !== null}
          onOpenChange={(open) => {
            if (!open) setConfirm(null);
          }}
          title={confirm?.title ?? ""}
          description={confirm?.description ?? ""}
          onConfirm={() => confirm?.onConfirm()}
          onCancel={() => setConfirm(null)}
        />
      </Section>
    </div>
  );
}

export default SidePanel;
