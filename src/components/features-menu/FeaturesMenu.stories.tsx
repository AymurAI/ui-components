import {
  Article,
  Database,
  Detective,
  FileAudio,
  Gear,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { FeaturesMenu } from "./FeaturesMenu";
import { FeaturesMenuItem } from "./FeaturesMenuItem";

const meta = {
  title: "Components/FeaturesMenu",
  component: FeaturesMenu,
  tags: ["autodocs"],
  parameters: { layout: "padded" },
} satisfies Meta<typeof FeaturesMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

/** The three real pipelines, plus the "Resumen" placeholder — not yet released. */
export const Default: Story = {
  render: () => (
    <FeaturesMenu>
      <FeaturesMenuItem icon={<Database size={24} />} label="Set de Datos" />
      <FeaturesMenuItem icon={<Detective size={24} />} label="Anonimizador" />
      <FeaturesMenuItem icon={<FileAudio size={24} />} label="Voz a Texto" />
      <FeaturesMenuItem icon={<Article size={24} />} label="Resumen" disabled />
    </FeaturesMenu>
  ),
};

/**
 * The real header dropdown: three pipelines + "Configuración" (no Figma
 * reference for this row — desktop-app-only, kept because it's needed).
 */
export const WithSettings: Story = {
  render: () => (
    <FeaturesMenu>
      <FeaturesMenuItem icon={<Database size={24} />} label="Set de Datos" />
      <FeaturesMenuItem icon={<Detective size={24} />} label="Anonimizador" />
      <FeaturesMenuItem icon={<FileAudio size={24} />} label="Voz a Texto" />
      <FeaturesMenuItem
        icon={<Gear size={24} />}
        label="Configuración"
        fullWidth
      />
    </FeaturesMenu>
  ),
};

/** Anchored inside a real Popover — overrides Popover's own bg/radius/shadow/padding so the two don't double up. */
export const InsidePopover: Story = {
  render: () => (
    <Popover defaultOpen>
      <PopoverTrigger asChild>
        <button type="button">Abrir aplicaciones</button>
      </PopoverTrigger>
      <PopoverContent
        style={{
          background: "transparent",
          borderRadius: 0,
          boxShadow: "none",
        }}
      >
        <FeaturesMenu>
          <FeaturesMenuItem
            icon={<Database size={24} />}
            label="Set de Datos"
          />
          <FeaturesMenuItem
            icon={<Detective size={24} />}
            label="Anonimizador"
          />
          <FeaturesMenuItem
            icon={<FileAudio size={24} />}
            label="Voz a Texto"
          />
          <FeaturesMenuItem
            icon={<Gear size={24} />}
            label="Configuración"
            fullWidth
          />
        </FeaturesMenu>
      </PopoverContent>
    </Popover>
  ),
};
