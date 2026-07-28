import type { Meta, StoryObj } from "@storybook/react";
import { css } from "@/styled/css";
import { Button } from "../button";
import { AppFooter } from "./AppFooter";

const meta = {
  title: "Components/AppFooter",
  component: AppFooter,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof AppFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Stand-in for desktop-app's own `BuiltBy` — DataGénero branding stays there. */
function BuiltByPlaceholder() {
  return (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        gap: "1",
      })}
    >
      <span
        className={css({
          textStyle: "label.sm.default",
          color: "text.lighter",
        })}
      >
        Plataforma hecha por
      </span>
      <span className={css({ textStyle: "subtitle.md.strong" })}>
        datagénero
      </span>
    </div>
  );
}

export const Default: Story = {
  args: {
    leading: <BuiltByPlaceholder />,
    actions: <Button>Continuar</Button>,
  },
};

export const TwoActions: Story = {
  args: {
    leading: <BuiltByPlaceholder />,
    actions: (
      <>
        <Button variant="secondary">Volver</Button>
        <Button>Siguiente</Button>
      </>
    ),
  },
};

export const NoLeading: Story = {
  args: { actions: <Button>Continuar</Button> },
};

/** Narrow viewport — actions wrap onto their own line, still right-aligned. */
export const NarrowViewport: Story = {
  args: {
    leading: <BuiltByPlaceholder />,
    actions: (
      <>
        <Button variant="secondary">Volver</Button>
        <Button>Siguiente</Button>
      </>
    ),
  },
  parameters: { viewport: { defaultViewport: "mobile1" } },
};

/** Sticky-footer pattern: last child of a flex column page wrapper. */
export const StickyToBottom: Story = {
  render: (args) => (
    <div
      className={css({
        display: "flex",
        flexDir: "column",
        minH: "[100vh]",
      })}
    >
      <div className={css({ p: "6" })}>Contenido de la página (corto).</div>
      <AppFooter {...args} />
    </div>
  ),
  args: {
    leading: <BuiltByPlaceholder />,
    actions: <Button>Continuar</Button>,
  },
};
