import { FileIcon, PlayIcon, TrashIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { css } from "@/styled/css";
import { Button } from "../button";
import { ArchiveRow } from "./ArchiveRow";
import { ArchiveView } from "./ArchiveView";

const meta = {
  title: "Components/Archives/ArchiveRow",
  component: ArchiveRow,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof ArchiveRow>;

export default meta;
type Story = StoryObj<typeof meta>;

function TrashButton() {
  return (
    <Button
      variant="tertiary"
      size="icon-sm"
      aria-label="Eliminar archivo"
      style={{ padding: 4 }}
    >
      <TrashIcon size={24} />
    </Button>
  );
}

/** Single-document preview file row (Figma node 40002579:88220) — no leading action. */
export const Default: Story = {
  args: {
    icon: <FileIcon size={24} />,
    title: "Archivonombrelargolarguisimo.doc",
    description: "11 pag. - 21.5 mb",
    trailingAction: <TrashButton />,
  },
  render: (args) => (
    <div style={{ maxWidth: 366 }}>
      <ArchiveRow {...args} />
    </div>
  ),
};

/** Voz a Texto file list — leading play button + trailing delete. */
export const WithLeadingAction: Story = {
  args: {
    variant: "outlined",
    title: "audiencia.wav",
    description: "11 seg. · 344 kb",
    leadingAction: (
      <Button
        variant="tertiary"
        size="icon-sm"
        aria-label="Reproducir"
        style={{ padding: 4 }}
      >
        <PlayIcon size={24} />
      </Button>
    ),
    trailingAction: <TrashButton />,
  },
  render: (args) => (
    <div style={{ maxWidth: 420 }}>
      <ArchiveRow {...args} />
    </div>
  ),
};

/** Long filenames ellipsize instead of pushing the trailing action out. */
export const LongTitle: Story = {
  args: {
    icon: <FileIcon size={24} />,
    title: "Un-nombre-de-archivo-extremadamente-largo-que-no-entra.docx",
    description: "34 pag. - 8.1 mb",
    trailingAction: <TrashButton />,
  },
  render: (args) => (
    <div style={{ maxWidth: 366 }}>
      <ArchiveRow {...args} />
    </div>
  ),
};

/**
 * Full single-document preview composition: `ArchiveView size="lg"` stacked
 * above `ArchiveRow` — the outer card/title chrome stays in desktop-app.
 */
export const DocumentPreviewComposition: Story = {
  render: () => (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        alignItems: "center",
        gap: "6", // Figma: 23px, closest token
        w: "[366px]",
      })}
    >
      <ArchiveView type="preview" size="lg" selectable={false} />
      <ArchiveRow
        icon={<FileIcon size={24} />}
        title="Archivonombrelargolarguisimo.doc"
        description="11 pag. - 21.5 mb"
        trailingAction={<TrashButton />}
      />
    </div>
  ),
};
