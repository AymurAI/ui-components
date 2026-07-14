import type { Preview } from "@storybook/react";
import "../src/styles/panda.css";
import "../src/styles/fonts.css";
import "./preview.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "app",
      values: [
        { name: "app", value: "#F6F5F7" },
        { name: "white", value: "#FFFFFF" },
      ],
    },
  },
};

export default preview;
