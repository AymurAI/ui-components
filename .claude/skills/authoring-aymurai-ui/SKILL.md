---
name: authoring-aymurai-ui
description: Use when adding or editing a component in the @aymurai/ui library (this repo) — extracting a component from the Figma UI Library, translating it to a Panda CSS recipe, or fixing tokens/strictTokens issues. Triggers on "add a component", "build X from Figma", "new recipe", "update tokens" within this repo.
---

# Authoring @aymurai/ui components

This repo is the `@aymurai/ui` component library: **authored in Panda CSS**,
**distributed as compiled JS + one self-contained `dist/styles.css`** so a Panda
app (desktop-app) and a Tailwind app (defensoria) consume it identically.

**Read `docs/component-authoring.md` first** — it is the source of truth for
conventions, the token reference, the Figma extraction workflow, and the Figma
node-ID map. This skill is the quick index; that doc has the detail.

## The loop for a new component

1. **Extract from Figma — don't guess measurements.** File key
   `2BahKpebYzaccFih0ZB79y`. Use `get_metadata` on the family node to find
   variant node IDs, then `get_design_context` on a *single* variant symbol for
   exact px/colors and the token-name mapping it prints. `download_assets`
   (svg) for vector glyphs → `src/assets/`.
2. **Mirror the template.** Copy the shape of `src/components/button/Button.tsx`:
   `cva` for one-element recipes, `sva` for multi-slot, `styled()` for one-offs,
   `cx()` to merge `className`. Folder = `src/components/<name>/` with
   `<Name>.tsx`, `index.ts` (named + default + props type), `<Name>.stories.tsx`
   (one story per Figma variant).
3. **Token-only styling (`strictTokens`).** Semantic tokens only
   (`bg: "action.default"`, `textStyle: "cta.md.strong"`, `rounded: "sm"`).
   Non-token literals MUST use the escape hatch: `bg: "[transparent]"`,
   `boxShadow: "[0 0 10px rgba(...)]"`. Never `border: "none"` — use
   `borderWidth: "0"`. Use `:focus-visible`. React 19 ref-as-prop (no
   `forwardRef`). Icons from `phosphor-react`.
4. **Wire the barrel.** Add `export * from "./components/<name>";` to
   `src/index.ts` (export `*` avoids default-export collisions).
5. **Verify** (call bins directly — `pnpm exec` trips a deps check here):
   ```sh
   export PATH="$PWD/node_modules/.bin:$PATH"
   panda codegen
   tsc -p tsconfig.build.json --noEmit
   vite build && panda cssgen --silent --outfile dist/styles.css
   ```
   And `pnpm storybook` for a visual check against the Figma screenshot.

## Tokens live in `src/preset.ts`

If a value recurs and has no token, add it to `src/preset.ts` (re-run
`panda codegen`) rather than escape-hatching it everywhere. Known gaps worth
promoting: `text.onbutton-alt` (#576171), a 6px radius for big-icon-button.

## Don't

- Don't add a runtime dependency on a router or app-specific code (keep
  components portable across desktop-app and defensoria).
- Don't enable `preflight` — the shipped CSS must not reset the consumer's page.
- Don't commit `dist/` or `src/styled/` (generated; gitignored).
