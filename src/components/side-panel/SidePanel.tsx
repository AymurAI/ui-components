import { css } from "@/styled/css";
import { stack } from "@/styled/patterns";
import { Plus, Trash } from "phosphor-react";
import type { ReactNode } from "react";
import type { AvatarColor } from "../avatar";
import { Avatar } from "../avatar";
import { AvatarPill } from "../avatar-pill";
import { Button } from "../button";
import { TextField } from "../text-field";
import { ArrowsMerge } from "./ArrowsMergeIcon";

/**
 * SidePanel — "Side Panel Voz a texto" (speech-to-text turn editor).
 * AymurAI UI Library node 40002322:53113.
 *
 * Composite assembled from {@link AvatarPill}, {@link TextField} and
 * {@link Button}. Sections: selected turn card, suggested people, timestamp,
 * and turn actions (merge previous/next, add below, delete).
 *
 * Merge actions use the Phosphor "ArrowsMerge" glyph (vendored in
 * ./ArrowsMergeIcon as phosphor-react@1.4.1 predates it): base points down
 * ("siguiente"), rotated 180° points up ("anterior").
 */
export type SidePanelPerson = {
  initials: string;
  name: string;
  color?: AvatarColor;
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
  /** Timestamp field value (e.g. "01:15") */
  timestamp: string;
  onTimestampChange?: (value: string) => void;
  onMergePrevious?: () => void;
  onMergeNext?: () => void;
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

export function SidePanel({
  turn,
  people,
  selectedIndex,
  onSelectPerson,
  onNewPerson,
  timestamp,
  onTimestampChange,
  onMergePrevious,
  onMergeNext,
  onAddBelow,
  onDelete,
  className,
}: SidePanelProps) {
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
          {people.map((person, index) => (
            <AvatarPill
              key={`${person.initials}-${person.name}`}
              initials={person.initials}
              name={person.name}
              color={person.color}
              selected={index === selectedIndex}
              onClick={() => onSelectPerson?.(index)}
            />
          ))}
          <Button variant="tertiary" size="sm" onClick={onNewPerson}>
            <Plus size={16} />
            Nuevo
          </Button>
        </div>
      </Section>
      <div className={divider} />

      {/* Timestamp */}
      <Section heading="Marca de tiempo">
        <TextField
          value={timestamp}
          onChange={(e) => onTimestampChange?.(e.target.value)}
          aria-label="Marca de tiempo"
        />
      </Section>
      <div className={divider} />

      {/* Actions */}
      <Section heading="Acciones">
        <div className={actions}>
          <Button
            variant="secondary"
            size="sm"
            className={fullWidthButton}
            onClick={onMergePrevious}
          >
            <ArrowsMerge size={16} style={{ transform: "rotate(180deg)" }} />
            Unir con el anterior
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className={fullWidthButton}
            onClick={onMergeNext}
          >
            <ArrowsMerge size={16} />
            Unir con el siguiente
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className={fullWidthButton}
            onClick={onAddBelow}
          >
            <Plus size={16} />
            Agregar debajo
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className={fullWidthButton}
            onClick={onDelete}
          >
            <Trash size={16} />
            Eliminar
          </Button>
        </div>
      </Section>
    </div>
  );
}

export default SidePanel;
