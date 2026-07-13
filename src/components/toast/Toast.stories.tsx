import type { Meta, StoryObj } from "@storybook/react";
import { CheckCircle, Info, Warning, WarningCircle } from "phosphor-react";
import { toast as hotToast, Toaster } from "react-hot-toast";
import { Toast } from "./Toast";

const meta = {
  title: "Components/Toast",
  component: Toast,
  decorators: [
    (Story) => (
      <>
        <Toaster />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Toasts are rendered by react-hot-toast into a portal. These stories
 * show the Callout visual directly so the appearance is visible in Storybook
 * without needing to trigger an actual toast notification.
 */
export const InfoVariant: Story = {
  render: () => (
    <div style={{ maxWidth: "75%", width: "100%" }}>
      <button
        type="button"
        onClick={() =>
          hotToast.custom((t) => (
            <Toast
              t={t}
              message="This is an informational message."
              variant="info"
              icon={Info}
            />
          ))
        }
      >
        Show info toast
      </button>
    </div>
  ),
};

export const SuccessVariant: Story = {
  render: () => (
    <div style={{ maxWidth: "75%", width: "100%" }}>
      <button
        type="button"
        onClick={() =>
          hotToast.custom((t) => (
            <Toast
              t={t}
              message="Operation completed successfully."
              variant="success"
              icon={CheckCircle}
            />
          ))
        }
      >
        Show success toast
      </button>
    </div>
  ),
};

export const WarningVariant: Story = {
  render: () => (
    <div style={{ maxWidth: "75%", width: "100%" }}>
      <button
        type="button"
        onClick={() =>
          hotToast.custom((t) => (
            <Toast
              t={t}
              message="Please review before continuing."
              variant="warning"
              icon={Warning}
            />
          ))
        }
      >
        Show warning toast
      </button>
    </div>
  ),
};

export const ErrorVariant: Story = {
  render: () => (
    <div style={{ maxWidth: "75%", width: "100%" }}>
      <button
        type="button"
        onClick={() =>
          hotToast.custom((t) => (
            <Toast
              t={t}
              message="An error occurred. Please try again."
              variant="error"
              icon={WarningCircle}
            />
          ))
        }
      >
        Show error toast
      </button>
    </div>
  ),
};
