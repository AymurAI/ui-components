# Authoring `@aymurai/ui` components

This library is **authored in Panda CSS** and **distributed as compiled JS + a
single `dist/styles.css`** so it can be consumed by a Panda app (desktop-app)
and a Tailwind app (defensoria) identically.

## Folder convention

One folder per component:

```
src/components/<name>/
  <Name>.tsx            # implementation (named export + default export)
  <Name>.stories.tsx    # one story per Figma variant + a Matrix story
  index.ts              # re-exports: export { X, type XProps } from "./X"
```

Then add the component to `src/index.ts` (the public barrel).

## Styling rules (Panda, strictTokens: true)

Import from the generated styled-system:

```ts
import { css, cva, cx, sva, type RecipeVariantProps } from "@/styled/css";
import { styled } from "@/styled/jsx";
import { hstack, stack } from "@/styled/patterns";
```

- `cva()` for single-element recipes, `sva()` for multi-slot components,
  `styled("tag", {...})` for one-off styled elements, `cx()` to merge a passed
  `className`.
- **Semantic tokens only** — `bg: "action.default"`, `color: "text.default"`,
  `textStyle: "cta.md.strong"`, `border: "primary"`, `rounded: "sm"`. Never raw
  hex.
- `strictTokens` is on. Any non-token value MUST use the escape hatch:
  `bg: "[transparent]"`, `boxShadow: "[0px 0px 10px rgba(...)]"`,
  `outlineWidth: "[2px]"`.
- **Do NOT** use `border: "none"` (not a token) — use `borderWidth: "0"`.
- Use `:focus-visible` (not `:focus`) for keyboard focus rings.
- React 19 ref-as-prop — **no `forwardRef`**. Accept `ref` as a normal prop.
- Icons: `phosphor-react` (named imports, `<Icon size={n} weight="..." />`).
- Interactive primitives: `@radix-ui/react-*` headless components.

## Token reference (see `preset.ts`)

- colors: `brand.*`, `text.{default,lighter,onbutton-default,onbutton-alternative,onbutton-disabled}`,
  `action.{default,disabled,alt-default,hover,pressed,focus}`,
  `bg.{primary,secondary,primary-alternative,primary-highlight,secondary-highlight}`,
  `category.{violet,green,red,yellow,pink,orange,green-light}` (speaker palette),
  `system.{success,error,warning,info}` (+ `-secondary`).
- radii (px-accurate to Figma): `xs`=2, `sm`=4, `md`=8, `lg`=16, `xl`=24, `full`.
- textStyles: `title.md`, `subtitle.{md,sm}`, `paragraph.{md,sm,xsm}`,
  `cta.{md,sm}`, `label.{md,sm}` each with `.strong` / `.default`.
- durations: `fast`/`normal`/`slow` (300ms); easings: `default`.
- spacing/sizes = Panda default numeric scale (`4`=16px, `8`=32px, `12`=48px…).

## Figma extraction workflow (don't guess measurements)

Figma file key: `2BahKpebYzaccFih0ZB79y`, UI Library page `1:149`.

1. `get_metadata` on the family node → child variant node IDs.
2. `get_design_context` on a base/variant node → exact px sizes, colors,
   typography, and the **token name mapping** printed at the end of the
   response. Translate the React+Tailwind output to a Panda recipe — map each
   Tailwind arbitrary value to the matching semantic token.
3. `get_screenshot` on the family node → visual reference for the story.
4. `download_assets` (defaultFormat: svg) for vector glyphs (logo, iso,
   checkcircle, spinner, etc.) → save under `src/assets/`.

`get_design_context` returns code too large for big component sets — call it on
a single variant symbol id, not the whole family frame.

## Node-ID map (UI Library family → node id)

| Component | Family node | Base/notes |
|---|---|---|
| Button ✅ | `21:4636` | done (template) |
| Button-link | `21:5346` | Size M/S × Default/Alternative |
| Big icon button | `21:5117` | |
| TextField | `1:296` | sva slots; M/S; Placeholder/Focus/Typed/Disabled/Error/Suggestion |
| Dropdown | `1:637` | base option `1:619` |
| Checkbox | `25:12490` | base `25:12527` |
| Radio | `1:4612` | base `1:4649` |
| Stepper | `173:16557` | symbol; Default/Disabled/Focus + bar |
| Tooltip | `187:18217` | |
| StatusBar | `40000455:30893` | top/bottom bar, button+logo, player |
| Toolbar | `40001298:54861` | + Tool Button `40000041:10526` |
| Toast | `1994:30384` | Error/Warning/Success/Info |
| Search | `1992:28026` | Field / Suggestion |
| Archives (progress) | `173:24064` | 20%/50%/Stopped/Replace/Error/Completed |
| Archive tabs | `186:18202` | Selected/Unselected |
| Archive view | `222:21065` | Previsualitation/Error/Document OK/Error |
| Spinner | `1994:29039` | |
| CheckCircle | `1568:25593` | |
| Logo | `40000499:40071` | Logo / Logo+Feature / Iso |
| Tag | `40000041:10589` | Persona/CUIJ/Num_Expediente/Num_Actuacion/Fecha |
| AvatarPill ✅ | `40002313:53080` | Default/Selected; reuses Avatar + name |
| Option ✅ | `40001295:56887` | menu/list row: label + X; selected bg |
| Category Item ✅ | `40001297:49803` | label + Switch row |
| TranscriptBlock ✅ | `40002318:32859` | Voz a texto turn: Default/Select/Select+Hover/Typed |
| Side Panel (Voz a texto) ✅ | `40002322:53113` | composite: turno + personas sugeridas + marca de tiempo + acciones |

## Verify

From the repo root, call binaries directly (avoid `pnpm exec`, which trips a
deps-status check in this pnpm setup):

```sh
export PATH="$PWD/node_modules/.bin:$PATH"
panda codegen            # after adding tokens
tsc -p tsconfig.build.json --noEmit
vite build && panda cssgen --silent --outfile dist/styles.css
storybook dev -p 6006    # visual check vs Figma screenshots
```
