import type { Meta, StoryObj } from "@storybook/react";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "../dialog";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { AppHeader } from "./AppHeader";

const STEPS = [
  "Previsualización",
  "Transcripción",
  "Validación",
  "Finalización",
];

const meta = {
  title: "Components/AppHeader",
  component: AppHeader,
  parameters: {
    layout: "fullscreen",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=173:16655",
    },
  },
} satisfies Meta<typeof AppHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Figma library symbol: bare iso mark, only the active step shows a label. */
export const Default: Story = { args: { steps: STEPS, current: 0 } };

/** Real Voz a Texto screens (e.g. Editor) show the full logo + feature name. */
export const WithFeatureName: Story = {
  args: { featureName: "Voz a Texto", steps: STEPS, current: 0 },
};

export const FirstStep: Story = {
  args: { featureName: "Voz a Texto", steps: STEPS, current: 0 },
};

export const LastStep: Story = {
  args: { featureName: "Voz a Texto", steps: STEPS, current: 3 },
};

/** Screens outside a multi-step flow can omit both progress props. */
export const WithoutProgress: Story = {
  args: { featureName: "Anonimizador" },
};

/**
 * Slots wrap the defaults without rebuilding their styles: an anchor for the
 * logo, a Radix PopoverTrigger for help, and a DialogTrigger for apps.
 */
export const WithWrappers: Story = {
  args: { featureName: "Voz a Texto", steps: STEPS, current: 1 },
  render: (args) => (
    <Dialog>
      <Popover>
        <AppHeader
          {...args}
          slots={{
            logo: (defaultLogo) => (
              <a
                href="#storybook-root"
                aria-label="Ir al inicio"
                style={{ display: "inline-flex" }}
              >
                {defaultLogo}
              </a>
            ),
            help: (defaultHelp) => (
              <PopoverTrigger asChild>{defaultHelp}</PopoverTrigger>
            ),
            apps: (defaultApps) => (
              <DialogTrigger asChild>{defaultApps}</DialogTrigger>
            ),
          }}
        />
        <PopoverContent style={{ padding: 16 }} showArrow>
          Ayuda contextual
        </PopoverContent>
        <DialogContent>
          <DialogTitle>Aplicaciones</DialogTitle>
          Selector de aplicaciones
        </DialogContent>
      </Popover>
    </Dialog>
  ),
};
