import { FileAudioIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { FileDropZone } from "./FileDropZone";

const meta = {
  title: "Components/FileDropZone",
  component: FileDropZone,
  args: {
    icon: <FileAudioIcon size={42} />,
    title: "Selecciona o arrastra el archivo para\ntranscribir",
    description: "Formatos válidos: .mp3, .wav, .m4a, .webm, .ogg o .flac",
  },
  parameters: { layout: "padded" },
} satisfies Meta<typeof FileDropZone>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Dragging: Story = { args: { dragging: true } };

export const Disabled: Story = { args: { disabled: true } };

/** Single-line copy — e.g. Dataset/Anonimizador, which don't need a line break. */
export const OneLineCopy: Story = {
  args: {
    title: "Selecciona o arrastra el archivo para agregar al set de datos",
    description: "Formatos válidos: .docx, .pdf",
  },
};

/** Narrow viewport — padding/gap shrink, the surface stays full-width. */
export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 360 }}>
        <Story />
      </div>
    ),
  ],
};
