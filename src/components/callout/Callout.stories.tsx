import type { Meta, StoryObj } from "@storybook/react";
import {
  CheckCircle,
  WarningCircle,
  Warning as WarningIcon,
} from "phosphor-react";
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
    icon: CheckCircle,
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
    icon: WarningCircle,
    message: "An error occurred.",
  },
};
export const Dismissable: Story = {
  args: { variant: "info", onDismiss: () => alert("dismissed") },
};
export const NoBorder: Story = {
  args: { variant: "success", noBorder: true },
};

/** Full variant matrix */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 16, maxWidth: 500 }}>
      <Callout variant="info" message="Info: review your settings." />
      <Callout
        variant="success"
        icon={CheckCircle}
        message="Success: changes saved."
      />
      <Callout
        variant="warning"
        icon={WarningIcon}
        message="Warning: this action is irreversible."
      />
      <Callout
        variant="error"
        icon={WarningCircle}
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
