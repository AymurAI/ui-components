# Search+Switch Width & Conflict Modal Fix (ui-components) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix two visual regressions found while integrating this library into `desktop-app`'s Voz a Texto (VTT) screens: (1) `Toolbar`'s `search-switch` context stretches the search box edge-to-edge instead of the fixed width Figma specifies, and (2) `SidePanel`'s three "Combinar/Cancelar" confirmations (rename collision, merge-previous, merge-next) render as small anchored popovers instead of the centered modal-with-overlay the library's own code comments cite as their Figma reference.

**Architecture:** Two independent, surgical fixes to existing components — no new components, no API changes (both are pure internal-rendering fixes; every existing prop, callback, and Storybook story keeps working unchanged).

**Tech Stack:** React + TypeScript, Panda CSS (`@/styled/css`), Radix UI (`@radix-ui/react-dialog` via this repo's own `Dialog` wrapper), Storybook (this repo has no unit test suite — Storybook stories are the verification convention).

## Global Constraints

- Package manager is pnpm.
- Panda `strictTokens: true` (see `panda.config.ts`) — arbitrary pixel values must use the `[bracket]` escape syntax.
- This repo ships no unit tests anywhere (`find src -iname "*.test.tsx"` returns nothing) — verify each fix via its existing Storybook story (`pnpm storybook`), not new test files.
- Do not change any exported prop names/types on `ToolbarProps` or `SidePanelProps` — both fixes are internal-only.
- Both fixes are scoped to the `search-switch` Toolbar context and the SidePanel confirm dialogs respectively — do not touch the `anonimizador`/`set-de-datos` Toolbar layouts, which are correct as-is (verified against their own Figma frames).
- This work is deliberately kept on its own branch, separate from any desktop-app change — do not touch anything outside `src/components/toolbar/` and `src/components/side-panel/`.

---

## Task 1: Cap the search box width in the `search-switch` Toolbar context

**Files:**
- Modify: `src/components/toolbar/Toolbar.tsx:100-145`

**Interfaces:** None — `ToolbarProps` unchanged.

**Context:** Per Figma node `40001478:54722` ("Search+Switch" property of the `tool_bar` component) and the standalone `Search+Switch` instance embedded in node `40002383:72559`, the search box has a **fixed width of 711.5px** inside a 1440px-wide bar (with `justify-content: space-between` already pushing the switch to the far right — that part is already correct). The current code gives both the wrapper `div` and the `Search` component `flex: "1"`, so the search box always grows to fill all remaining space, crowding the switch. This must NOT change the `anonimizador` (846/1440px "Search (wide)") or `set-de-datos` contexts, which are correct as designed.

- [ ] **Step 1: Confirm today's broken behavior**

Run `pnpm storybook`, open `Components/Toolbar` → `SearchSwitch`. Resize the preview frame wide — confirm the search input stretches to fill almost the entire bar, leaving the "Modo Edición" switch crammed against it with no breathing room. This is the bug being fixed.

- [ ] **Step 2: Scope the fix to `search-switch` only**

In `src/components/toolbar/Toolbar.tsx`, add a second boolean next to the existing `isSetDeDatos`:

```ts
  const isSetDeDatos = context === "set-de-datos";
  const isSearchSwitch = context === "search-switch";
  const alignItems = isSearchSwitch ? "center" : "flex-end";
```

- [ ] **Step 3: Fix the search wrapper and `Search` width**

Replace the search-zone block (currently lines ~123-145):

```tsx
      {/* Search zone. Fills available space in anonimizador/set-de-datos;
          fixed at 711.5px in search-switch (Figma node 40001478:54722) so it
          doesn't crowd the Switch+label on the right. */}
      <div
        className={css({
          display: "flex",
          alignItems: "center",
          h: "12",
          flex: isSearchSwitch ? undefined : "1",
          minW: isSearchSwitch ? undefined : "[0px]",
          flexShrink: isSearchSwitch ? "0" : undefined,
        })}
      >
        <Search
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          aria-label={searchAriaLabel}
          labels={searchLabels}
          resultCount={searchResultCount}
          onPrev={onSearchPrev}
          onNext={onSearchNext}
          onClear={onSearchClear}
          className={css({
            flex: isSearchSwitch ? undefined : "1",
            w: isSearchSwitch ? "[711.5px]" : undefined,
          })}
        />
      </div>
```

- [ ] **Step 4: Verify in Storybook**

Run `pnpm storybook`, open `Components/Toolbar`:
- `SearchSwitch` and `SearchSwitchWithResults`: confirm the search box now stops at a fixed width with visible empty space before the switch, matching the Figma frame.
- `Anonimizador` and `SetDeDatos`: confirm both are pixel-identical to before (still stretch to fill).
- `Matrix`: confirm all three rows render correctly side by side.

- [ ] **Step 5: Typecheck and lint**

```bash
pnpm typecheck
pnpm biome check src/components/toolbar/Toolbar.tsx
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components/toolbar/Toolbar.tsx
git commit -m "fix(toolbar): cap search width at 711.5px in search-switch context"
```

---

## Task 2: Replace the anchored confirm popover with a centered modal in `SidePanel`

**Files:**
- Modify: `src/components/side-panel/SidePanel.tsx`

**Interfaces:** None — `SidePanelProps` unchanged; `onRenamePerson`/`onMergePeople`/`onMergePrevious`/`onMergeNext` keep the exact same call sites and semantics. Only the rendering primitive for the confirmation changes (`Popover` → `Dialog`).

**Context:** The component's own doc comment says both confirmations follow "Figma 'Conflicto Nombre etiqueta', node 40002384:38487" — but that Figma node (confirmed via `get_design_context`) is `left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2` with a full-screen `bg-[rgba(0,0,0,0.4)]` backdrop behind it: a **centered modal with overlay**, not something anchored to a specific pill or button. The current code renders it as a Radix `Popover` anchored via `PopoverAnchor`, which visually tethers it to whichever element triggered it — that's the actual bug, not just a styling gap. This repo already has a `Dialog` primitive (`src/components/dialog/Dialog.tsx`, itself ported from `desktop-app`'s own dialog) that renders exactly the centered-overlay pattern needed — reuse it instead of building anything new.

Both existing call sites (`renameConflict` from the pill-rename flow, `confirm` from the merge-previous/merge-next flow) render the same title+description+Combinar/Cancelar shape — this task extracts that shape into one small internal `ConfirmDialog` and backs both with `Dialog` instead of `Popover`.

- [ ] **Step 1: Confirm today's broken behavior**

Run `pnpm storybook`, open `Components/SidePanel` → `RenameAndCollision`. Click the pencil on "Persona 1", type "Fiscal", press Enter. Today this pops up right next to the pill, in a small anchored box. Compare against the Figma screenshot for node `40002384:38487` — same copy, but the real design is a centered card with a dark backdrop over the whole screen.

- [ ] **Step 2: Swap the import**

At the top of `src/components/side-panel/SidePanel.tsx`, replace:

```ts
import { Popover, PopoverAnchor, PopoverContent } from "../popover";
```

with:

```ts
import { Dialog, DialogContent } from "../dialog";
```

- [ ] **Step 3: Add a shared `ConfirmDialog` subcomponent**

Add this right after the `ActionButton` function (before `export function SidePanel`):

```tsx
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={confirmBox}>
        <p className={confirmTitle}>{title}</p>
        <p className={confirmDescription}>{description}</p>
        <div className={confirmButtons}>
          <Button variant="primary" size="sm" onClick={onConfirm}>
            Combinar
          </Button>
          <Button variant="tertiary" size="sm" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 4: Simplify the pill loop — drop the per-pill `Popover`/`PopoverAnchor`**

Replace the `people.map((person, index) => { ... })` body (currently wraps each `AvatarPill` in a `Popover`/`PopoverAnchor`/conditional `PopoverContent`) with a plain wrapper — the confirm dialog moves out of the loop entirely (Step 5):

```tsx
          {people.map((person, index) => {
            const isEditing = editingIndex === index;
            const canRename =
              person.renamable && onRenamePerson && onMergePeople;

            return (
              <span
                key={person.id ?? `${person.initials}-${person.name}-${index}`}
                className={css({ display: "inline-flex" })}
              >
                <AvatarPill
                  initials={person.initials}
                  name={person.name}
                  color={person.color}
                  state={
                    isEditing
                      ? "typing"
                      : index === selectedIndex
                        ? "selected"
                        : "default"
                  }
                  onClick={() => onSelectPerson?.(index)}
                  onRename={canRename ? () => startEditing(index) : undefined}
                  editValue={isEditing ? editValue : undefined}
                  onEditValueChange={isEditing ? setEditValue : undefined}
                  onEditCommit={
                    isEditing
                      ? (value) => handleRenameCommit(index, value)
                      : undefined
                  }
                  onEditCancel={isEditing ? finishEditing : undefined}
                  renameInputLabel={`Editar nombre de ${person.name}`}
                />
              </span>
            );
          })}
```

- [ ] **Step 5: Render the rename-collision `ConfirmDialog` once, outside the loop**

Immediately after the `pills` div's closing `</div>` (still inside the `Section heading="Personas sugeridas"`), add:

```tsx
        <ConfirmDialog
          open={renameConflict !== null}
          onOpenChange={(open) => {
            if (!open) finishEditing();
          }}
          title={`Ya existe una persona llamada "${
            renameConflict ? people[renameConflict.targetIndex]?.name : ""
          }".`}
          description="Si continuás, ambas identidades se combinarán en una sola."
          onConfirm={confirmPeopleMerge}
          onCancel={finishEditing}
        />
```

- [ ] **Step 6: Drop the `Popover`/`PopoverAnchor` wrapper around the Acciones buttons**

Replace the `Section heading="Acciones"` body — remove the `Popover`/`PopoverAnchor` wrapper, keep the plain `actions` div, and move its confirm out to a `ConfirmDialog`:

```tsx
      <Section heading="Acciones">
        <div className={actions}>
          <ActionButton
            tooltip="Combina este turno con el anterior"
            onClick={handleMergePrevious}
          >
            <ArrowsMerge size={16} style={{ transform: "rotate(180deg)" }} />
            Unir con el anterior
          </ActionButton>
          <ActionButton
            tooltip="Combina este turno con el siguiente"
            onClick={handleMergeNext}
          >
            <ArrowsMerge size={16} />
            Unir con el siguiente
          </ActionButton>
          <ActionButton tooltip="Agrega un turno nuevo debajo de este" onClick={onAddBelow}>
            <Plus size={16} />
            Agregar debajo
          </ActionButton>
          <ActionButton tooltip="Elimina este turno" onClick={onDelete}>
            <Trash size={16} />
            Eliminar
          </ActionButton>
        </div>
        <ConfirmDialog
          open={confirm !== null}
          onOpenChange={(open) => {
            if (!open) setConfirm(null);
          }}
          title={confirm?.title ?? ""}
          description={confirm?.description ?? ""}
          onConfirm={() => confirm?.onConfirm()}
          onCancel={() => setConfirm(null)}
        />
      </Section>
```

- [ ] **Step 7: Typecheck and lint**

```bash
pnpm typecheck
pnpm biome check src/components/side-panel/SidePanel.tsx
```

Expected: PASS. If `PopoverContent`'s `showArrow` prop or the `Popover`/`PopoverAnchor` imports are now unused anywhere else in the file, biome's `organizeImports` will flag/remove them — confirm the diff only removes what Step 2 intended.

- [ ] **Step 8: Verify in Storybook**

Run `pnpm storybook`, open `Components/SidePanel`:
- `RenameAndCollision`: repeat the Step 1 repro — confirm the confirmation now renders as a centered card with a dark backdrop over the whole story canvas, not anchored to the pill. Confirm "Combinar" calls `onMergePeople` (watch `lastAction` text update) and "Cancelar" (or clicking the backdrop) dismisses without changes.
- `MergeConfirmation`: click "Unir con el anterior" / "Unir con el siguiente" — confirm the same centered-modal treatment, correct copy per direction, and that dismissing via backdrop click behaves like Cancelar (no `onMergePrevious`/`onMergeNext` call).
- `Default`/`InvalidTimestamp`: confirm unaffected (no confirm dialogs involved).

- [ ] **Step 9: Commit**

```bash
git add src/components/side-panel/SidePanel.tsx
git commit -m "fix(side-panel): render merge/rename confirmations as a centered modal, not an anchored popover"
```

---

## Final Verification

- [ ] `pnpm typecheck` — PASS
- [ ] `pnpm biome check` (full repo) — PASS
- [ ] `pnpm build` — PASS (confirms the library still builds/exports cleanly for consumers pinned to a git tag)
- [ ] Manual Storybook pass over `Components/Toolbar` and `Components/SidePanel`, all stories, per Steps 4 and 8 above
- [ ] Push the branch and open a PR referencing the two upstream reports (search width in `search-switch`, and the rename/merge confirmation not matching Figma node `40002384:38487`) — do not merge without review, this library is consumed by a pinned tag (`v0.4.1`) from `desktop-app`
