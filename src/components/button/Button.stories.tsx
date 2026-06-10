import type { Meta, StoryObj } from "@storybook/react";
import { CaretDown } from "phosphor-react";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  args: { children: "Button" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary", "none"],
    },
    size: {
      control: "select",
      options: ["md", "sm", "icon-md", "icon-sm"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = { args: { variant: "primary" } };
export const Secondary: Story = { args: { variant: "secondary" } };
export const Tertiary: Story = { args: { variant: "tertiary" } };
export const Small: Story = { args: { variant: "primary", size: "sm" } };
export const Loading: Story = { args: { variant: "primary", isLoading: true } };
export const Disabled: Story = { args: { variant: "primary", disabled: true } };

/** Full Figma variant matrix: Type × Size × State. */
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "grid", gap: 24 }}>
      {(["primary", "secondary", "tertiary"] as const).map((variant) => (
        <div
          key={variant}
          style={{ display: "flex", gap: 12, alignItems: "center" }}
        >
          <Button variant={variant}>Big</Button>
          <Button variant={variant} size="sm">
            Small
          </Button>
          <Button variant={variant} isLoading>
            Loading
          </Button>
          <Button variant={variant} disabled>
            Disabled
          </Button>
          <Button variant={variant} size="icon-md">
            <CaretDown />
          </Button>
        </div>
      ))}
    </div>
  ),
};
