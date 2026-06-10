import type { StorybookConfig } from "@storybook/react-vite";

const config: StorybookConfig = {
  stories: ["../src/**/*.stories.@(ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    defaultName: "Docs",
  },
  // Storybook reuses the project vite.config.ts, but the library build settings
  // (build.lib, externalized react/radix, vite-plugin-dts) break the Storybook
  // app build. Strip them here so Storybook builds as a normal app.
  viteFinal: async (cfg) => {
    if (cfg.build) {
      cfg.build.lib = false as never;
      if (cfg.build.rollupOptions) cfg.build.rollupOptions.external = [];
    }
    cfg.plugins = (cfg.plugins ?? []).filter((p) => {
      const name = (p as { name?: string } | null)?.name ?? "";
      return !name.includes("dts");
    });
    return cfg;
  },
};

export default config;
