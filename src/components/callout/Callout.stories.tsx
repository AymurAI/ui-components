import {
  CheckCircleIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react";
import { Callout } from "./Callout";

const meta = {
  title: "Components/Callout",
  component: Callout,
  args: { message: "This is a notification message." },
} satisfies Meta<typeof Callout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = { args: { variant: "info" } };
export const Success: Story = {
  args: {
    variant: "success",
    icon: CheckCircleIcon,
    message: "Operation completed successfully.",
  },
};
export const Warning: Story = {
  args: {
    variant: "warning",
    icon: WarningIcon,
    message: "Please review before continuing.",
  },
};
export const ErrorState: Story = {
  args: {
    variant: "error",
    icon: WarningCircleIcon,
    message: "An error occurred.",
  },
};
export const Dismissable: Story = {
  args: { variant: "info", onDismiss: () => alert("dismissed") },
};
export const NoBorder: Story = {
  args: { variant: "success", noBorder: true },
};

/** Voz a Texto processing notice — formalizes the local hand-rolled version. */
export const Compact: Story = {
  args: {
    size: "compact",
    variant: "info",
    icon: InfoIcon,
    noBorder: true,
    message: "Transcribiendo audio…",
  },
};

/** Full variant matrix */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 500 }}>
      <Callout variant="info" message="Info: review your settings." />
      <Callout
        variant="success"
        icon={CheckCircleIcon}
        message="Success: changes saved."
      />
      <Callout
        variant="warning"
        icon={WarningIcon}
        message="Warning: this action is irreversible."
      />
      <Callout
        variant="error"
        icon={WarningCircleIcon}
        message="Error: could not save changes."
      />
      <Callout
        variant="info"
        message="Dismissable notification."
        onDismiss={() => {}}
      />
      <Callout variant="info" noBorder message="No-border info." />
    </div>
  ),
};
