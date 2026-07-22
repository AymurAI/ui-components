import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeft } from "phosphor-react";
import { css } from "@/styled/css";
import { AppFooter } from "../app-footer";
import { AppHeader } from "../app-header";
import { Button } from "../button";
import { Card } from "../card";
import { WorkflowStepLayout } from "./WorkflowStepLayout";

const meta = {
  title: "Components/WorkflowStepLayout",
  component: WorkflowStepLayout,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof WorkflowStepLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

const header = (
  <AppHeader
    featureName="Anonimizador"
    steps={["Selección", "Extracción", "Validación", "Finalización"]}
    current={0}
  />
);

const footer = (
  <AppFooter
    leading={<span>Plataforma hecha por DataGénero</span>}
    actions={<Button>Seleccionar archivo</Button>}
  />
);

const backButton = (
  <Button variant="tertiary" size="icon-sm" aria-label="Volver">
    <ArrowLeft size={32} />
  </Button>
);

export const Default: Story = {
  args: {
    header,
    title: "1. Selección de archivo",
    leading: backButton,
    footer,
    children: (
      <Card>
        Seleccioná el archivo que querés procesar o arrastralo y soltalo acá.
      </Card>
    ),
  },
};

export const LongContent: Story = {
  args: {
    ...Default.args,
    children: (
      <div
        className={css({
          display: "flex",
          flexDir: "column",
          gap: "4",
        })}
      >
        {Array.from({ length: 12 }, (_, index) => (
          <Card key={index}>Bloque de contenido {index + 1}</Card>
        ))}
      </div>
    ),
  },
};

export const FullBleed: Story = {
  args: {
    header,
    footer: <AppFooter actions={<Button>Finalizar</Button>} />,
    fullBleed: true,
    children: (
      <div
        className={css({
          display: "grid",
          gridTemplateColumns: { base: "1fr", lg: "2fr 1fr" },
          minH: "full",
        })}
      >
        <div className={css({ p: "8", bg: "bg.secondary" })}>Editor</div>
        <div className={css({ p: "8", borderLeft: "primary" })}>
          Panel lateral
        </div>
      </div>
    ),
  },
};

export const NarrowViewport: Story = {
  args: {
    ...Default.args,
    title: "Revisá la información extraída del documento",
  },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};
