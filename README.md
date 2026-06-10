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

This package is **not published to a registry** — it is distributed as a
prebuilt tarball attached to each [GitHub Release](https://github.com/AymurAI/ui-components/releases).
Install a pinned version straight from the release asset:

```sh
pnpm add https://github.com/AymurAI/ui-components/releases/download/v0.1.0/aymurai-ui-0.1.0.tgz
```

…or pin it in `package.json` and run `pnpm install`:

```jsonc
{
  "dependencies": {
    "@aymurai/ui": "https://github.com/AymurAI/ui-components/releases/download/v0.1.0/aymurai-ui-0.1.0.tgz"
  }
}
```

The repo is public, so no auth token is needed. Peer dependencies (provided by
your app): `react`, `react-dom` (v18 or v19).

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
Agents working in this repo also get the `authoring-aymurai-ui` skill
(`.claude/skills/`).

### Helping agents in consumer repos use this library

Coding agents in the consumer repos (`desktop-app`, `defensoria`) should import
from `@aymurai/ui` instead of reinventing components. Install the skill that
teaches them how, straight from this repo's top-level `skills/` folder:

```sh
npx skills@latest add AymurAI/ui-components
```

Plus paste the always-on guardrail from
[`docs/agent-integration/AGENTS.snippet.md`](docs/agent-integration/AGENTS.snippet.md)
into the consumer's `AGENTS.md` / `CLAUDE.md`. Full details and the
AGENTS.md-vs-skill rationale are in
**[docs/agent-integration/](docs/agent-integration/)**.

## Releasing

Releases are GitHub Releases with the prebuilt tarball attached. Bump the
version, tag it, and push — the `release.yml` workflow builds, packs and
publishes the Release:

```sh
npm version 0.2.0 --no-git-tag-version   # bump package.json
git commit -am "Release v0.2.0"
git tag v0.2.0
git push && git push --tags              # → CI builds + attaches aymurai-ui-0.2.0.tgz
```

To produce the tarball locally (e.g. to test consumption): `pnpm release`.
