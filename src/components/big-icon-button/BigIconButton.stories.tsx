import type { Meta, StoryObj } from "@storybook/react";
import { MagnifyingGlass, Pencil, PlusCircle } from "phosphor-react";
import { BigIconButton } from "./BigIconButton";

const meta = {
  title: "Components/BigIconButton",
  component: BigIconButton,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=21:5117",
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "tertiary"],
    },
    size: { control: "select", options: ["big", "small"] },
    isLoading: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof BigIconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma: Type=Primary, State=Default, Size=Big (21:5118)
export const PrimaryBig: Story = {
  args: {
    variant: "primary",
    size: "big",
    children: <PlusCircle size={24} />,
  },
};

// Figma: Type=Primary, State=Default, Size=Small (21:5132)
export const PrimarySmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    children: <PlusCircle size={20} />,
  },
};

// Figma: Type=Secondary, State=Default, Size=Big (21:5146)
export const SecondaryBig: Story = {
  args: {
    variant: "secondary",
    size: "big",
    children: <Pencil size={24} />,
  },
};

// Figma: Type=Secondary, State=Default, Size=Small (21:5160)
export const SecondarySmall: Story = {
  args: {
    variant: "secondary",
    size: "small",
    children: <Pencil size={20} />,
  },
};

// Figma: Type=Tertiary, State=Default, Size=Big (21:5174)
export const TertiaryBig: Story = {
  args: {
    variant: "tertiary",
    size: "big",
    children: <MagnifyingGlass size={24} />,
  },
};

// Figma: Type=Tertiary, State=Default, Size=Small (21:5188)
export const TertiarySmall: Story = {
  args: {
    variant: "tertiary",
    size: "small",
    children: <MagnifyingGlass size={20} />,
  },
};

// Figma: Loading state (21:5124 / 21:5138)
export const LoadingBig: Story = {
  args: {
    variant: "primary",
    size: "big",
    isLoading: true,
  },
};

export const LoadingSmall: Story = {
  args: {
    variant: "primary",
    size: "small",
    isLoading: true,
  },
};

// Disabled (21:5310)
export const DisabledBig: Story = {
  args: {
    variant: "primary",
    size: "big",
    disabled: true,
    children: <PlusCircle size={24} />,
  },
};

// Matrix — 3 types × 2 sizes
export const Matrix: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, auto)",
        gap: "16px",
        alignItems: "center",
      }}
    >
      <BigIconButton variant="primary" size="big">
        <PlusCircle size={24} />
      </BigIconButton>
      <BigIconButton variant="secondary" size="big">
        <Pencil size={24} />
      </BigIconButton>
      <BigIconButton variant="tertiary" size="big">
        <MagnifyingGlass size={24} />
      </BigIconButton>
      <BigIconButton variant="primary" size="small">
        <PlusCircle size={20} />
      </BigIconButton>
      <BigIconButton variant="secondary" size="small">
        <Pencil size={20} />
      </BigIconButton>
      <BigIconButton variant="tertiary" size="small">
        <MagnifyingGlass size={20} />
      </BigIconButton>
      <BigIconButton variant="primary" size="big" isLoading />
      <BigIconButton variant="secondary" size="big" isLoading />
      <BigIconButton variant="tertiary" size="big" isLoading />
      <BigIconButton variant="primary" size="big" disabled>
        <PlusCircle size={24} />
      </BigIconButton>
      <BigIconButton variant="secondary" size="big" disabled>
        <Pencil size={24} />
      </BigIconButton>
      <BigIconButton variant="tertiary" size="big" disabled>
        <MagnifyingGlass size={24} />
      </BigIconButton>
    </div>
  ),
};
