# @aymurai/ui

AymurAI's shared React component library, extracted from the
[Figma UI Library](https://www.figma.com/design/2BahKpebYzaccFih0ZB79y/UI-AymurAI)
and authored with [Panda CSS](https://panda-css.com/).

It is **authored in Panda** but **distributed as compiled JS + a single
self-contained stylesheet**, so it works the same in a Panda app (the Electron
`desktop-app`) and a Tailwind app (the Next.js `defensoria` frontend). The
shipped CSS has **no global reset** (`preflight: false`) and all classes are
prefixed `aym-`, so it never clobbers a consumer's own styles.

## Install

```sh
pnpm add @aymurai/ui
```

Peer dependencies (provided by your app): `react`, `react-dom` (v18 or v19).

## Usage

```tsx
import { Button, TextField, Toast } from "@aymurai/ui";
import "@aymurai/ui/styles.css";   // once, at your app root
import "@aymurai/ui/fonts.css";     // optional: loads Archivo from Google Fonts

export function Example() {
  return <Button variant="primary">Anonimizar</Button>;
}
```

The library uses the **Archivo** font. Either import `@aymurai/ui/fonts.css` or
self-host Archivo (weights 400/600/700).

## Components

Buttons & actions: `Button`, `ButtonLink`, `BigIconButton`, `ToolButton` ·
Inputs: `TextField`, `Search`, `Select`, `Checkbox`, `Radio`, `Switch`,
`Suggestion` · Feedback: `Callout`, `Toast`, `Tooltip`, `Spinner`,
`CheckCircle`, `Stepper` · Surfaces: `Card`, `Dialog`, `Popover` · Chrome:
`Toolbar`, `StatusBar`, `Tag`, `Logo` · Archives: `ArchiveProgress`,
`ArchiveTabs`, `ArchiveView`.

Browse every component and variant in Storybook (`pnpm storybook`).

## Sharing tokens with a Panda app (optional)

A Panda app can extend its config with the AymurAI token preset to author its
own styles with the same tokens:

```ts
// panda.config.ts (in a consumer)
import { defineConfig } from "@pandacss/dev";
import aymuraiPreset from "@aymurai/ui/preset";

export default defineConfig({
  presets: ["@pandacss/preset-panda", aymuraiPreset],
});
```

This is **not required** to use the components — it only matters if you want
your own app styles to reuse the AymurAI tokens/textStyles.

## Development

This repo uses **pnpm**, **Panda CSS**, **Vite** (library mode), **biome** and
**Storybook**.

```sh
pnpm install
pnpm storybook        # dev + visual review against Figma
pnpm validate         # biome + tsc
pnpm build            # panda codegen + tsc + vite build + panda cssgen → dist/
```

> Note: this repo's pnpm setup trips a pre-run deps check on `pnpm exec`. When
> scripting directly, call binaries from `./node_modules/.bin` (see
> `docs/component-authoring.md`).

### Adding / editing components

See **[docs/component-authoring.md](docs/component-authoring.md)** — conventions,
the token reference, the Figma extraction workflow, and the Figma node-ID map.

## Releasing

Versioning is managed with [changesets](https://github.com/changesets/changesets):

```sh
pnpm changeset        # describe the change + bump
pnpm release          # build + publish (CI runs this on merge)
```
