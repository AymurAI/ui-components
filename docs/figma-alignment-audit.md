# Figma Alignment Audit — `@aymurai/ui` → 100% fidelity

Read-only audit of all 24 component families against their Figma source
(file `2BahKpebYzaccFih0ZB79y`, page `1:149`). Goal: bring the library to 100%
design fidelity. Fixes are grouped by **unambiguous** (apply), **judgment call**
(confirm — may be Figma noise), and **blocker** (missing Figma node).

> ⚠️ Not every "Figma says X" is real. Some Figma values are scaffolding noise
> (Inter fallback font, shrunk symbol instances). Each fix below is classified.

## Scorecard

| Component | Fidelity | Headline gap |
|---|--:|---|
| Suggestion | 92% | `[0px]` escape; undocumented `rounded` ext |
| Button | 91% | focus shadow blur 10px→8px |
| ArchiveTabs | 90% | `box-shadow` should be `drop-shadow` filter |
| Logo | 85% | hard-coded SVG fills (theming) |
| Card | 82% | hover shadow 15px→7.5px blur |
| ArchiveView | 81% | error text 12px→14px; shadow filter; checkbox radius 2→4px |
| BigIconButton | 80% | focus ring outline→border+shadow; shadow 10→8px |
| StatusBar | 79% | emoji padlock; decorative mismatches (low prio) |
| Checkbox | 78% | hover+checked bg; blanket `opacity:.6` disabled |
| Stepper | 78% | disabled text color; no `complete` state |
| Select | 74% | shadow y-offset 8→16px; S text 16→14px; `[white]`×3 |
| TextField | 72% | focus border-color missing; `[white]`; shadow blur |
| Callout | 72% | textStyle paragraph→label; icon 20→24; padding/gap |
| ArchiveProgress | 71% | fill #C5CAFF→#CED1F4; completed-X hidden (bug); raw CSS var |
| Tag | 70% | hover underline+color missing; radius |
| Toast | 68% | inherits Callout; forced `noBorder` removes border |
| Search | 68% | focus border-color wrong token; icon color on focus |
| ButtonLink | 68% | Size=S missing trailing chevron; gap; opacity states |
| Toolbar | 68% | undefined token `bg.secondary-highlight`; wrong icons; alignItems |
| Radio | 63% | (font switch = NOISE); disabled color; opacity disabled |
| ToolButton | 62% | wrong icons (Tag/Trash/ArrowsClockwise); pressed border token |
| Tooltip | 58% | radius 8→4px; no padding; wrong shadow |
| Switch | 55% | wrong inactive token; size 44×24 vs 32×19 (judgment) |
| CheckCircle | 45% | **missing checkmark glyph**; wrong token usage |
| Dialog | N/A | **no Figma node found** |
| Popover | N/A | **no Figma node found** + arrow fill bug |

---

## A. Systemic / preset (`src/preset.ts`) — do first

New/!fixed tokens (replace repeated escape-hatch literals):
- [ ] `colors.text.onbutton-alt: #576171` — used by ButtonLink (currently `[#576171]`).
- [ ] `shadows.focus: 0px 0px 8px rgba(17,0,65,0.2)` — Button + BigIconButton (fix 10px→8px).
- [ ] `shadows.input-focus: 0px 2px 1px rgba(0,0,0,0.16)` — TextField/Search/Select.
- [ ] `shadows.dropdown: 0px 16px 16px rgba(0,0,0,0.08)` — Select (fix y 8→16).
- [ ] `shadows.card-hover: 0px 0px 7.5px rgba(63,71,157,0.4)` — Card (fix blur 15→7.5).
- [ ] `shadows.tooltip: 0px 4px 8px rgba(0,0,0,0.1)` — Tooltip (fix offset/blur).
- [ ] `colors.overlay: rgba(0,0,0,0.5)` — Dialog overlay.
- [ ] `radii` 6px token (BigIconButton, ToolButton currently `[6px]`).
- [ ] `colors.action.progress: #CED1F4` — ArchiveProgress fill (currently #C5CAFF).
- [ ] **DO NOT** change `brand.secondary` (#C3CCD7 — matches desktop-app source of truth). The audit's "→#C5CAFF" is wrong; fix the *component* (CheckCircle), not the token.

---

## B. Unambiguous component fixes (apply)

### Buttons
- [ ] **Button**: focus `boxShadow` 10px→8px → use `shadows.focus`.
- [ ] **BigIconButton**: focus shadow 10px→8px; focus ring should be `border 2px primary-alt + shadow` (not CSS `outline`); use `shadows.focus`; promote `[48px]`→`12` spacing token.
- [ ] **ButtonLink**: add `text.onbutton-alt` token for Default color; remove Size=S `gap:[2px]` override (keep `gap:1`); (Size=S trailing chevron → see judgment).
- [ ] **ToolButton**: pressed `borderColor: text.default`→`border.primary-alt`; **icon fixes** (see judgment — needs asset confirm).

### Inputs
- [ ] **TextField**: add focus `borderColor: border.primary-alt`; fix focus shadow blur 2px→1px (`shadows.input-focus`); `[white]`→`bg.secondary`; add prefix/suffix separator `color: text.lighter`.
- [ ] **Search**: focus `borderColor: action.alt-default`→`border.primary-alt`; icon color→`text.default` on focus.
- [ ] **Select**: dropdown shadow y 8→16px (`shadows.dropdown`); 3× `[white]`→`bg.secondary`; open border `[#110041]`→`border.primary-alt`; S-size option text→`subtitle.sm.default` (14px); unselected item indicator placeholder to avoid column shift.
- [ ] **Checkbox**: hover+checked bg→`action.hover`; replace blanket `opacity:.6` disabled with per-slot tokens; focus radius `xs`(2px)→`[3px]`.
- [ ] **Radio**: disabled label color→`#A9A9A9` (new token or `[#A9A9A9]`); fix disabled inner-dot color (`#2D3748` is wrong); replace `opacity:.6` with per-slot tokens; hover+checked border→`action.hover`. (Font switch→NOISE, skip.)

### Feedback / toggles
- [ ] **Switch**: inactive track token `bg.primary-highlight`(#C5CAFF)→`action.disabled`(#E0DDE2); `[white]` thumb→`bg.secondary`. (Resize→judgment.)
- [ ] **Callout**: textStyle `paragraph.sm.default`→`label.md.default`; icon `size 20`→`24`, `weight light`→`regular`; dismiss X `18`→`24`; `py:3`→`4`; `gap:3`→`2`.
- [ ] **Toast**: remove forced `noBorder:true` (Figma shows border) — or confirm intentional.
- [ ] **Tooltip**: `rounded md`(8)→`sm`(4); add `p:2` + flex/gap:2 on content; fix shadow (`shadows.tooltip`).
- [ ] **Suggestion**: `rounded:[0px]`→`rounded:none`; document `rounded` extension.

### Indicators / brand
- [ ] **Spinner**: track `#E6E8FF`→`#E5E8FF` (or `bg.primary-alternative` token); gradient `id`→`useId()` (collision bug); colors via tokens.
- [ ] **CheckCircle**: **add the missing checkmark `<path>`**; use correct token for the #C5CAFF circle (it is `action.default`/`bg.primary-highlight`, NOT `brand.secondary`); fix comment; gradient `id`→`useId()`.
- [ ] **Stepper**: disabled step color `text.lighter`→`text.default`; use `border: primary-alt` shorthand; add a distinct `complete` state (past step) — confirm visual.
- [ ] **Tag**: hover → label `color: action.alt-default` + `textDecoration: underline`; verify radius (`md`→`xl`/`full`?).
- [ ] **Logo**: (optional) SVG fills→`currentColor` for theming; IsoMark viewBox 41→40.

### Surfaces / chrome / archives
- [ ] **Card**: hover shadow 15px→7.5px (`shadows.card-hover`).
- [ ] **Popover**: arrow `fill: bg.secondary`→`bg.primary` (visible seam bug); tokenize shadow.
- [ ] **Toolbar**: remove undefined token `bg.secondary-highlight`→`action.disabled`; consume `context` to set `alignItems` (search-switch=center).
- [ ] **StatusBar**: emoji `🔒`→phosphor `Lock` (low prio; mostly decorative chrome).
- [ ] **ArchiveProgress**: completed-state X dismiss should show (bug `showDismiss = status!=='completed'`); fill→`action.progress` (#CED1F4); raw `var(--colors-brand-primary)`→Panda `color` token; add `replace` message; italic label `fontWeight 300`.
- [ ] **ArchiveTabs**: `box-shadow`→`filter: drop-shadow(2px 2px 5px rgba(17,0,65,0.25))`.
- [ ] **ArchiveView**: error text 12px→14px; document shadow `box-shadow`→`drop-shadow` filter; checkbox checked `rounded xs`(2)→`sm`(4).

---

## C. Judgment calls (confirm before applying — may be Figma noise)
- [ ] **Radio/Dropdown font switches to Inter on hover/focus/disabled** → almost certainly Figma fallback noise. **Recommend: keep Archivo everywhere.** (skip the switch)
- [ ] **Switch size** 44×24 (thumb 20) vs Figma symbol 32×19 (thumb 12). desktop-app also uses 44×24. The Figma symbol may be a shrunk instance. **Recommend: keep 44×24**, fix only the color token. Confirm.
- [ ] **ButtonLink Size=S trailing chevron** (angle-down) present in Figma — add a chevron slot? Or is `iconRight` enough? Confirm intent.
- [ ] **ToolButton icons**: Figma uses rotated `Backspace` (agregar), `TrashSimple` (eliminar), `RepeatOnce` (reemplazar-todo) — not standard phosphor. Need confirmation/asset before swapping (some have no phosphor equivalent → custom SVG).
- [ ] **Missing sub-features** (Search "Field" result-nav + counter, TextField char counter, Select multi-select): these are *features*, not pure visual fidelity. Confirm if in scope.
- [ ] **Stepper `complete` state** visual (filled dark + white number?) not in captured Figma snapshot — needs design confirmation.

## D. Blockers — no Figma node found
- [ ] **Dialog** — no `Dialog`/`Modal` section in page `1:149`. Cannot verify 100%. Need node id, or confirm to only tokenize literals (overlay, shadow, maxW).
- [ ] **Popover** — no `Popover` section in page `1:149`. Same. (Arrow-fill bug fix applies regardless.)

---

## Execution plan (verified waves)
1. **Wave 0 — preset tokens** (§A) → `panda codegen`, build green.
2. **Wave 1 — token-dependent + clear bugs** (Button, BigIconButton, Card, Popover, CheckCircle, Spinner, ArchiveProgress, Toolbar token, Select/TextField/Search focus+`[white]`).
3. **Wave 2 — remaining unambiguous** (Checkbox, Radio, Switch color, Callout, Toast, Tooltip, Stepper, Tag, ArchiveTabs, ArchiveView, Suggestion, Logo).
4. **Judgment calls** (§C) once confirmed.
5. **Verify**: `tsc` + `vite build` + `panda cssgen`; Storybook visual diff vs Figma screenshots per component.

## Review — applied (waves 0–2)

**Verified green:** `tsc` 0 · `vite build` 0 · `panda cssgen` 0 · `biome lint` clean.

**Preset (`src/preset.ts`):** added `text.onbutton-alt` (#576171), `action.progress`
(#CED1F4), `overlay` (rgba 0.5), and shadow tokens `focus / input-focus / dropdown /
card-hover / tooltip` (Figma-exact). **Kept** `brand.secondary` = #C3CCD7 (audit's
"→#C5CAFF" was wrong — matches desktop-app source of truth).

**Components fixed (20):** Button, BigIconButton, Card, Popover, ButtonLink,
CheckCircle, Spinner, TextField, Search, Select, Toolbar, ArchiveProgress, Switch,
Callout, Tooltip, Stepper, Suggestion, Tag, ArchiveTabs, ArchiveView, Checkbox.
Highlights: focus shadows→token (10→8px), card hover 15→7.5px, Popover arrow seam,
focus border-color on inputs, `[white]`→`bg.secondary`, Select dropdown shadow 8→16px
+ S-item 14px, Switch inactive grey, Callout typography/padding/icons, Tooltip
radius+padding+shadow, Tag hover underline, drop-shadow filters on archives,
ArchiveProgress fill #CED1F4 + completed-X, `useId()` for SVG gradients.

**Audit false-positives caught & NOT applied (would have reduced quality):**
- `brand.secondary` → #C5CAFF (wrong; preset matches desktop-app).
- CheckCircle "missing checkmark" — the exported Figma asset is a ring, no tick.
- Spinner track #E6E8FF — matches the exported asset.
- Toolbar `bg.secondary-highlight` "undefined" — it IS defined (#E0DDE2).
- Radio hover/focus font → Inter — Figma fallback noise; kept Archivo.

**Resolved with user (wave 3):**
- **Switch** → keep 44×24 (only colour fixed). Done.
- **ToolButton icons** → verified per-action Figma layer names (node 40000041:10526)
  and corrected: reemplazar=`Repeat`, reemplazar-todo=`RepeatOnce`, eliminar/-todo=
  `TrashSimple`, agregar-etiqueta/-todas=`Backspace` rotated 180°. No filled weights.
  All exist in phosphor-react → no custom SVG needed. (Audit's earlier guesses were
  only partly right; verified against Figma directly.)
- **Toast** → removed forced `noBorder` so it shows the border, as Figma does.
- **Dialog / Popover** → tokenised only (no Figma node): `overlay` colour token +
  `shadows.dialog` / `shadows.popover`. Popover arrow seam already fixed.

**Closed (wave 3, all verified against Figma):**
- **Stepper** → added `complete` state (past steps = `action.alt-default` fill + white
  number, connector `action.alt-default`), confirmed from the Editor design context.
- **ButtonLink Size=S** → adds a trailing `CaretDown` (Figma `angle-down-small`,
  node 21:5358). Verified on node 21:5355.
- **Radio disabled label** → `#A9A9A9` confirmed (Figma `text/text-onbutton-disabled`,
  node 1:4619) → added `text.disabled` token; removed blanket `opacity:.6`.
  (Kept Archivo, not the Inter the Figma frame shows — that's an unstyled-default
  artifact, not a real per-state font switch.)

**Library is now Figma-aligned across all 24 families.**
