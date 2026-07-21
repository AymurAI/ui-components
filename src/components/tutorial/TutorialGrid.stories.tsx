import type { Meta, StoryObj } from "@storybook/react";
import { TutorialGrid } from "./TutorialGrid";

function placeholder(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="130">
    <rect width="200" height="130" fill="#E5E8FF" />
    <text x="50%" y="50%" font-size="16" text-anchor="middle" dominant-baseline="middle" fill="#3F479D">${label}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

const STEPS = [
  {
    image: placeholder("Paso 1"),
    imageAlt: "Selecciona un archivo",
    title: "Selecciona un archivo",
    description: "Elegí el documento que querés procesar desde tu equipo.",
  },
  {
    image: placeholder("Paso 2"),
    imageAlt: "Revisá la vista previa",
    title: "Revisá la vista previa",
    description: "Confirmá que el contenido se haya cargado correctamente.",
  },
  {
    image: placeholder("Paso 3"),
    imageAlt: "Procesá el documento",
    title: "Procesá el documento",
    description: "AymurAI analiza el archivo y prepara los resultados.",
  },
  {
    image: placeholder("Paso 4"),
    imageAlt: "Descargá el resultado",
    title: "Descargá el resultado",
    description: "Guardá el archivo final en tu equipo.",
  },
];

const meta = {
  title: "Components/Tutorial/TutorialGrid",
  component: TutorialGrid,
  tags: ["autodocs"],
  args: { steps: STEPS },
  parameters: { layout: "padded" },
} satisfies Meta<typeof TutorialGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TwoSteps: Story = { args: { steps: STEPS.slice(0, 2) } };

/** Narrow viewport — collapses to a single column (media-query driven, resize to see it). */
export const NarrowViewport: Story = {
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
