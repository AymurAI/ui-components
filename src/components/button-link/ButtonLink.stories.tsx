import type { Meta, StoryObj } from "@storybook/react";
import { ArrowLeft, CaretDown } from "phosphor-react";
import { ButtonLink } from "./ButtonLink";

const meta = {
  title: "Components/ButtonLink",
  component: ButtonLink,
  parameters: {
    layout: "centered",
    figma: {
      url: "https://www.figma.com/design/2BahKpebYzaccFih0ZB79y?node-id=21:5346",
    },
  },
  argTypes: {
    type: { control: "select", options: ["Default", "Alternative"] },
    size: { control: "select", options: ["M", "S"] },
    children: { control: "text" },
  },
} satisfies Meta<typeof ButtonLink>;

export default meta;
type Story = StoryObj<typeof meta>;

// Figma: Size=M, Type=Default (21:5347)
export const SizeMDefault: Story = {
  args: {
    size: "M",
    type: "Default",
    children: "call to action",
    iconLeft: <ArrowLeft size={16} />,
    iconRight: <CaretDown size={16} />,
  },
};

// Figma: Size=M, Type=Alternative (21:5351)
export const SizeMAlternative: Story = {
  args: {
    size: "M",
    type: "Alternative",
    children: "call to action",
    iconLeft: <ArrowLeft size={16} />,
    iconRight: <CaretDown size={16} />,
  },
  parameters: { backgrounds: { default: "dark" } },
};

// Figma: Size=S, Type=Default (21:5355)
export const SizeSDefault: Story = {
  args: {
    size: "S",
    type: "Default",
    children: "call to action",
    iconLeft: <ArrowLeft size={16} />,
    iconRight: <CaretDown size={16} />,
  },
};

// Figma: Size=S, Type=Alternative (21:5359)
export const SizeSAlternative: Story = {
  args: {
    size: "S",
    type: "Alternative",
    children: "call to action",
    iconLeft: <ArrowLeft size={16} />,
    iconRight: <CaretDown size={16} />,
  },
  parameters: { backgrounds: { default: "dark" } },
};

export const NoIcons: Story = {
  args: {
    size: "M",
    type: "Default",
    children: "call to action",
  },
};

// Matrix — all 4 Figma variants
export const Matrix: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <ButtonLink
        size="M"
        type="Default"
        iconLeft={<ArrowLeft size={16} />}
        iconRight={<CaretDown size={16} />}
      >
        Size M / Default
      </ButtonLink>
      <div
        style={{ background: "#110041", padding: "8px", borderRadius: "4px" }}
      >
        <ButtonLink
          size="M"
          type="Alternative"
          iconLeft={<ArrowLeft size={16} />}
          iconRight={<CaretDown size={16} />}
        >
          Size M / Alternative
        </ButtonLink>
      </div>
      <ButtonLink
        size="S"
        type="Default"
        iconLeft={<ArrowLeft size={16} />}
        iconRight={<CaretDown size={16} />}
      >
        Size S / Default
      </ButtonLink>
      <div
        style={{ background: "#110041", padding: "8px", borderRadius: "4px" }}
      >
        <ButtonLink
          size="S"
          type="Alternative"
          iconLeft={<ArrowLeft size={16} />}
          iconRight={<CaretDown size={16} />}
        >
          Size S / Alternative
        </ButtonLink>
      </div>
    </div>
  ),
};
