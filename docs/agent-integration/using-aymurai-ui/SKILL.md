---
name: using-aymurai-ui
description: Use BEFORE building any UI primitive (button, input, dialog, tooltip, toast, tag, spinner, checkbox, radio, select, stepper, toolbar, etc.) in an AymurAI app. The shared @aymurai/ui library already implements the Figma UI Library — import from it instead of reinventing. Covers install, the component catalog, and props.
---

# Using @aymurai/ui

AymurAI's UI primitives live in the shared **`@aymurai/ui`** package (extracted
from the Figma UI Library, authored in Panda CSS, shipped as compiled JS + one
stylesheet). **Before building any button, input, dialog, etc., import it from
`@aymurai/ui` — do not re-implement it.** Build something new only if the
catalog below genuinely lacks it; then prefer adding it to `@aymurai/ui`.

## Setup (once per app)

Install the pinned release tarball (public repo, no token needed):

```sh
pnpm add https://github.com/AymurAI/ui/releases/download/v0.1.0/aymurai-ui-0.1.0.tgz
```

Import the stylesheet once at the app root (works in any React app — Vite,
Electron, or Next.js; the CSS is self-contained and has no global reset):

```ts
import "@aymurai/ui/styles.css";
import "@aymurai/ui/fonts.css"; // optional: loads Archivo
```

In Next.js, put these imports in the root layout. The components are client
components (interactivity), so use them under a `"use client"` boundary.

## Catalog (import { X } from "@aymurai/ui")

**Buttons** — `Button` (`variant` primary|secondary|tertiary|none, `size`
md|sm|icon-md|icon-sm, `isLoading`) · `ButtonLink` (`type` Default|Alternative,
`href`, `iconLeft/iconRight`) · `BigIconButton` (`variant`, `size` big|small,
children=icon, `isLoading`) · `ToolButton` (`action`
reemplazar|reemplazar-todo|eliminar|eliminar-todo|agregar-etiqueta|agregar-todas).

**Inputs** — `TextField` (`label`, `value`, `onChange`, `error`, `suggestion`,
`prefix/suffix`, `size`) · `Search` (`value`, `suggestion`, `onChange`) ·
`Select` (`options: {id,text}[]`, `value`, `onChange`, `label`) · `Checkbox`
(`checked`, `onChange(boolean)`) · `Radio` (`checked`, `onChange`, `name`,
`value`) · `Switch` (Radix props) · `Suggestion` (styled mark) · `Tag` (`variant`
Persona|CUIJ|Num_Expediente|Num_Actuacion|Fecha, `value`).

**Feedback** — `Callout` (`variant` info|success|warning|error, `message`,
`onDismiss`) · `Toast` (use with `react-hot-toast`: `toast.custom(t => <Toast
t={t} variant=… message=… />)`) · `Tooltip` + `TooltipTrigger` +
`TooltipContent` + `TooltipProvider` (Radix) · `Spinner` (`size`) · `CheckCircle`
(`size`) · `Stepper` (`steps: {label}[]`, `current`).

**Surfaces** — `Card` (`size` lg|sm, `clickable`, `disabled`) · `Dialog` +
`DialogTrigger`/`DialogContent`/`DialogHeader`/`DialogTitle`/`DialogFooter`/
`DialogClose` (Radix) · `Popover` + `PopoverTrigger`/`PopoverContent` (Radix).

**Chrome** — `Toolbar` (`context` anonimizador|set-de-datos|search-switch,
`rightSlot`, `toolButtons`) · `StatusBar` (`variant` full|tabs|address) · `Logo`
(`variant` logo|logo-feature|iso, `featureName`).

**Archives** — `ArchiveProgress` (`fileName`, `progress`, `status`
default|stopped|replace|error|completed) · `ArchiveTabs` (`label`, `status`
selected|completed|unselected) · `ArchiveView` (`fileName`, `type`
preview|preview-error|document-ok|document-error).

All components are fully typed — let editor autocomplete confirm exact props.
Browse every variant in the library's Storybook (`pnpm storybook` in the
`@aymurai/ui` repo → "Overview / Showcase").

## Optional: share the design tokens (Panda apps only)

A Panda-based app can reuse the AymurAI tokens in its own styles:

```ts
import aymuraiPreset from "@aymurai/ui/preset";
export default defineConfig({ presets: ["@pandacss/preset-panda", aymuraiPreset] });
```

Not required to use the components — only for authoring app-local styles with
the same tokens. (A Tailwind app like defensoria ignores this and just uses the
components + `styles.css`.)
