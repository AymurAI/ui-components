import {
  Copy as CopyIcon,
  Highlighter,
  PencilSimpleLine,
  TextB,
  TextItalic,
  TextUnderline,
} from "@phosphor-icons/react";
import type { JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import { TableKit } from "@tiptap/extension-table";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Component, type ReactNode, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { css, cx } from "@/styled/css";
import { HStack, Stack } from "@/styled/jsx";

const titleRow = css({
  display: "flex",
  alignItems: "center",
  gap: "2",
});

const titleText = css({ textStyle: "title.md.strong", color: "text.default" });

const titleInput = css({
  textStyle: "title.md.strong",
  color: "text.default",
  border: "primary-alt",
  rounded: "sm",
  px: "2",
  py: "1",
  bg: "bg.secondary",
});

const body = css({
  textStyle: "paragraph.md.default",
  color: "text.default",
  outline: "none",
  // `EditorContent`'s own className only reaches the wrapper div it renders
  // — the actual contentEditable element is the nested `.ProseMirror` div
  // ProseMirror creates itself, which browsers give a default focus outline
  // (shows as a black ring while editing) unless targeted directly.
  "& .ProseMirror": { outline: "none" },
  "& p": { margin: "0" },
  // Panda's preflight resets every heading to `font-size/font-weight:
  // inherit` and every `ul`/`ol`/`menu` to `list-style: none` (so apps style
  // typography explicitly instead of relying on UA defaults) — without
  // overriding both here, markdown-parsed `# Heading`/`- item`/`1. item`
  // text rendered visually identical to a plain paragraph, with no numbers
  // or bullets at all. Sizes/markers are a reasonable default scale, not a
  // re-verified Figma measurement.
  "& h1, & h2, & h3, & h4, & h5, & h6": {
    fontWeight: "[700]",
    marginBottom: "2",
  },
  "& h1": { fontSize: "[28px]" },
  "& h2": { fontSize: "[24px]" },
  "& h3": { fontSize: "[20px]" },
  "& h4, & h5, & h6": { fontSize: "[16px]" },
  "& ul": { listStyle: "[disc]", paddingLeft: "[1.25rem]", margin: "0" },
  "& ol": { listStyle: "[decimal]", paddingLeft: "[1.25rem]", margin: "0" },
  "& li + li": { marginTop: "4" },
  // Nested lists (an `- item` under a `1. item`) sit inside a parent <li> —
  // the parent's own bottom margin (from the general sibling-spacing rule
  // below) already separates it from the next top-level block, so it
  // doesn't need one of its own before its first line of content.
  "& li > ul, & li > ol": { marginTop: "1" },
  // General breathing room between any two top-level blocks (paragraph,
  // heading, list, blockquote, table, hr) — not just "paragraph after
  // paragraph" — so a heading or `---` isn't flush against whatever
  // follows it. Headings get a bit more space above since they start a new
  // section; the first block never gets a leading gap.
  "& .ProseMirror > * + *": { marginTop: "4" },
  "& .ProseMirror > h1, & .ProseMirror > h2, & .ProseMirror > h3, & .ProseMirror > h4, & .ProseMirror > h5, & .ProseMirror > h6":
    { marginTop: "8" },
  "& .ProseMirror > :first-child": { marginTop: "[0px]" },
  "& blockquote": {
    borderLeft: "primary",
    paddingLeft: "4",
    color: "text.lighter",
    fontStyle: "italic",
  },
  "& hr": { marginY: "2" },
  "& table": {
    width: "full",
  },
  "& th, & td": {
    border: "primary",
    px: "3",
    py: "2",
    textAlign: "left",
  },
  "& th": {
    fontWeight: "[700]",
    bg: "bg.secondary",
  },
});

// Figma (node 40002572:59897, "Main-Content"): pt:42px, px:48px, pb:32px —
// asymmetric, not the uniform p:8 (32px) this used to be. The extra
// horizontal padding is what keeps the card from stretching edge-to-edge.
const panel = css({
  display: "flex",
  flexDirection: "column",
  gap: "10",
  bg: "bg.primary",
  pt: "[42px]",
  px: "12",
  pb: "8",
  height: "full",
  minHeight: "[0]",
  overflow: "hidden",
});

const card = css({
  bg: "bg.secondary",
  border: "card",
  rounded: "[12px]",
  boxShadow: "card",
  p: "8",
  overflowY: "auto",
  flex: "[1]",
  minHeight: "[0]",
});

const toolbar = css({ justifyContent: "flex-end", pb: "3" });

// `variant="embedded"` skips the panel/toolbar/title chrome above entirely —
// the consumer supplies its own frame (border, shadow, fixed height) and
// just wants the formatted content inside it, scrollable within whatever
// height that frame gives it. Padding lives here (not on the consumer's
// frame) so it scrolls along with the content, like margins on a page.
const embeddedBody = css({
  height: "full",
  overflowY: "auto",
  p: "6",
});

const divider = css({
  w: "[1px]",
  h: "6",
  bg: "[#BCBAB8]",
});

// Figma (node 40002573:72715): hover/active/pressed-open state for the
// format toggle buttons is a light-purple fill, not the default Button
// variants (which "none" deliberately opts out of) — bg.primary-alternative
// = #E5E8FF.
const formatButton = css({
  rounded: "[4px]",
  "&:hover:enabled": {
    bg: "bg.primary-alternative",
  },
  "&:active:enabled": {
    bg: "bg.primary-alternative",
  },
  "&[data-state='open']": {
    bg: "bg.primary-alternative",
  },
  "&[data-state='on']": {
    bg: "bg.primary-alternative",
  },
});

// Figma (node 40002573:62458): the title-edit pencil is action/alt-default
// (#3F479D), not the button's default onbutton-default color.
const editTitleButton = css({
  color: "action.alt-default",
});

// 6 hues x 2 shades (light + solid), matching Figma's swatch popover exactly
// (verified via get_variable_defs on the popover node — no violet, no
// single-shade-only hues). Order: light-then-solid per hue, hues in
// blue/green/orange/pink/red/yellow order — a stable default; the Figma
// screenshot's exact on-screen grid order could not be pixel-verified at the
// available render resolution.
// Real hex values, not `category.*` design-token paths — Tiptap's Highlight
// mark (multicolor mode) writes `attrs.color` straight into an inline
// `style="background-color: ..."` on the rendered `<mark>` (see
// @tiptap/extension-highlight's `renderHTML`), so it has to already be a
// value the browser can parse as a CSS color. A token path like
// "category.yellow-light" is invalid CSS — the browser silently drops it
// and every highlight fell back to the `<mark>` UA-stylesheet default
// (plain yellow) regardless of which swatch was picked. Values mirror
// `theme.semanticTokens.colors.category` in src/preset.ts.
export const RICH_TEXT_HIGHLIGHT_COLORS = [
  "#CBF1FF", // blue-light
  "#A2E2F9", // blue
  "#D1F4E2", // green-light
  "#94FFC8", // green
  "#FFE2C4", // orange-light
  "#F7C693", // orange
  "#FFD6FA", // pink-light
  "#F8AEEF", // pink
  "#FFE2D9", // red-light
  "#F69FA6", // red
  "#FFF2C6", // yellow-light
  "#FDE27B", // yellow
];

// Human-readable Spanish names for the highlight swatches, so screen readers
// announce "Azul claro" instead of reading a raw hex value.
const HIGHLIGHT_COLOR_LABELS: Record<string, string> = {
  "#CBF1FF": "Azul claro",
  "#A2E2F9": "Azul",
  "#D1F4E2": "Verde claro",
  "#94FFC8": "Verde",
  "#FFE2C4": "Naranja claro",
  "#F7C693": "Naranja",
  "#FFD6FA": "Rosa claro",
  "#F8AEEF": "Rosa",
  "#FFE2D9": "Rojo claro",
  "#F69FA6": "Rojo",
  "#FFF2C6": "Amarillo claro",
  "#FDE27B": "Amarillo",
};

// `bg` is deliberately not set via Panda's css() here: Panda's bracket
// escape (`[value]`) is resolved by static analysis at build time, so it
// can't express a value that's only known at runtime (one of 12 possible
// swatch colors, picked dynamically). The background is applied as a plain
// inline style instead — see the `style` prop where this is used.
const swatch = (active: boolean) =>
  css({
    w: "6",
    h: "6",
    rounded: "full",
    border: active ? "primary-alt" : "none",
    cursor: "pointer",
  });

const swatchGrid = css({
  display: "grid",
  gridTemplateColumns: "repeat(4, 1fr)",
  gap: "2",
  p: "3",
});

export interface RichTextEditorProps {
  document: JSONContent;
  onChange?: (next: JSONContent) => void;
  readOnly?: boolean;
  title?: string;
  onTitleChange?: (next: string) => void;
  highlightColors?: string[];
  "aria-label"?: string;
  /**
   * Maximum height of the scrollable body card, as a CSS length (e.g.
   * "532px") or Panda token. Defaults to Figma's static mockup dimension
   * ("532px") so existing behavior is unchanged unless a consumer opts into
   * a different value — e.g. a taller real layout that has more vertical
   * space available than the Figma mock did. Pass "none" to remove the cap
   * entirely and let the card fill its flex parent instead (it already
   * flex-grows and clips its own overflow) — the right choice whenever the
   * consumer's layout gives this editor a real, non-static height to fill.
   */
  maxBodyHeight?: string;
  /**
   * "panel" (default) — the full Validación screen chrome: toolbar
   * (formatting controls + copy), optional title row, and the
   * padded/bordered/shadowed card.
   *
   * "embedded" — just the formatted content, no toolbar, no title row, no
   * card border/shadow of its own. For consumers that already have their own
   * frame (e.g. the Resumen finish screen's preview panel) and only want the
   * document's real formatting (headings, bold, lists…) inside it, instead
   * of building a second, separate read-only renderer.
   */
  variant?: "panel" | "embedded";
}

interface EditableRecoveryBoundaryProps {
  onRecover: () => void;
  children: ReactNode;
}

/**
 * A native contentEditable edit (e.g. selecting all text and deleting it)
 * mutates the DOM directly — removing the exact <strong>/<mark>/text nodes
 * React's fiber still expects to be there. The next re-render then throws
 * "Failed to execute 'removeChild': the node to be removed is not a child of
 * this node" while trying to patch a subtree the browser already changed out
 * from under it. There's no partial patch once fiber and the live DOM have
 * drifted apart — only a full remount from the current `document` model
 * recovers cleanly, so this boundary catches the crash and asks the parent
 * to bump a `key` to force one.
 *
 * Empirically stress-tested against the Tiptap/ProseMirror-backed engine
 * (see the "EditableRecoveryBoundary stress test" describe block in
 * RichTextEditor.test.tsx, including a test that directly rips out DOM nodes
 * inside `.ProseMirror` the same way the original bug did) and found to no
 * longer be load-bearing: `@tiptap/react`'s `EditorContent` renders a bare
 * `<div>` with no `children` prop, so React's fiber for it has nothing of
 * the editor's internal DOM to reconcile — ProseMirror owns and re-diffs
 * that subtree itself, entirely outside React. This boundary is kept as a
 * low-probability defense-in-depth safety net, not because the new engine
 * requires it.
 */
class EditableRecoveryBoundary extends Component<
  EditableRecoveryBoundaryProps,
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch() {
    this.props.onRecover();
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

export function RichTextEditor({
  document: doc,
  onChange,
  readOnly = false,
  title,
  onTitleChange,
  highlightColors = RICH_TEXT_HIGHLIGHT_COLORS,
  "aria-label": ariaLabel,
  maxBodyHeight = "532px",
  variant = "panel",
}: RichTextEditorProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title ?? "");
  const [bodyEpoch, setBodyEpoch] = useState(0);
  const [, forceToolbarUpdate] = useState(0);

  const commitTitle = () => {
    setEditingTitle(false);
    if (draftTitle !== title) onTitleChange?.(draftTitle);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Highlight.configure({ multicolor: true }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: doc,
    editable: !readOnly,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        role: "textbox",
        "aria-label": ariaLabel ?? "Resumen",
        "aria-multiline": "true",
      },
    },
    onUpdate: ({ editor: updatedEditor }) => {
      onChange?.(updatedEditor.getJSON());
    },
  });

  // `editable` can change after mount (e.g. a consumer flips readOnly), so
  // it's kept in sync imperatively rather than only being read once at
  // construction time. Guarded by an equality check because
  // `Editor#setEditable` unconditionally emits a synthetic "update" event
  // (see @tiptap/core's `setEditable`) — calling it on every render (e.g.
  // the initial mount, where `editable` already matches `useEditor`'s
  // config) would fire a spurious `onChange` with unchanged content.
  useEffect(() => {
    if (!editor || editor.isEditable === !readOnly) return;
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  // The incoming `document` prop can also change from outside (e.g. loading
  // a different summary). Only push it into the editor when it actually
  // differs from the editor's own current content, so we don't clobber the
  // user's in-progress typing on every render. `emitUpdate: false` is
  // required here for the same reason the `editable`-sync effect above
  // guards its own call — without it, `setContent` fires a synthetic
  // "update" event and this externally-driven sync would immediately call
  // `onChange` back with the very content it was just given, which can loop
  // in a controlled-component usage (e.g. autosave wiring that writes
  // `document` on every `onChange`).
  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(doc);
    if (current !== next) {
      editor.commands.setContent(doc, { emitUpdate: false });
    }
  }, [editor, doc]);

  // `editor.isActive(...)` reflects live editor state but isn't itself
  // reactive React state, so the toolbar (which reads it during render via
  // `editor?.isActive("bold")` etc.) won't re-render on its own when the
  // selection moves into/out of a mark. Force a re-render on the events that
  // can change that state.
  useEffect(() => {
    if (!editor) return;
    const rerender = () => forceToolbarUpdate((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  if (variant === "embedded") {
    return (
      <EditableRecoveryBoundary
        key={bodyEpoch}
        onRecover={() => setBodyEpoch((epoch) => epoch + 1)}
      >
        <EditorContent
          editor={editor}
          data-testid="rich-text-editor-embedded"
          className={cx(body, embeddedBody)}
        />
      </EditableRecoveryBoundary>
    );
  }

  return (
    <div data-testid="rich-text-editor-panel" className={panel}>
      <Stack gap="6" flex="1" minHeight="0" overflow="hidden">
        {/* Copy stays available in both modes — the readOnly export preview
            (Finalización) treats copy-to-clipboard as a core action. The
            formatting controls below are editing affordances and stay hidden
            when readOnly. */}
        <HStack
          gap="2"
          className={toolbar}
          data-testid="rich-text-editor-toolbar"
        >
          {!readOnly && (
            <>
              <Button
                variant="none"
                size="icon-sm"
                className={formatButton}
                aria-label="Negrita"
                data-state={editor?.isActive("bold") ? "on" : "off"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleBold().run()}
              >
                <TextB size={20} />
              </Button>
              <Button
                variant="none"
                size="icon-sm"
                className={formatButton}
                aria-label="Cursiva"
                data-state={editor?.isActive("italic") ? "on" : "off"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleItalic().run()}
              >
                <TextItalic size={20} />
              </Button>
              <Button
                variant="none"
                size="icon-sm"
                className={formatButton}
                aria-label="Subrayado"
                data-state={editor?.isActive("underline") ? "on" : "off"}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
              >
                <TextUnderline size={20} />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="none"
                    size="icon-sm"
                    className={formatButton}
                    aria-label="Resaltar"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <Highlighter size={20} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent>
                  <div className={swatchGrid}>
                    {highlightColors.map((color) => {
                      const active =
                        editor?.isActive("highlight", { color }) ?? false;
                      return (
                        <button
                          key={color}
                          type="button"
                          aria-label={HIGHLIGHT_COLOR_LABELS[color] ?? color}
                          className={swatch(active)}
                          style={{ backgroundColor: color }}
                          onMouseDown={(e) => e.preventDefault()}
                          onClick={() => {
                            if (!editor || editor.state.selection.empty) return;
                            if (editor.isActive("highlight", { color })) {
                              editor.chain().focus().unsetHighlight().run();
                            } else {
                              editor
                                .chain()
                                .focus()
                                .setHighlight({ color })
                                .run();
                            }
                          }}
                        />
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
              <div
                data-testid="rich-text-editor-toolbar-divider"
                className={divider}
              />
            </>
          )}
          <Button
            variant="none"
            size="icon-sm"
            aria-label="Copiar"
            onClick={() => {
              if (!editor) return;
              navigator.clipboard
                ?.writeText(editor.getText({ blockSeparator: "\n\n" }))
                .catch(() => {});
            }}
          >
            <CopyIcon size={20} />
          </Button>
        </HStack>

        {title !== undefined && (
          <div data-testid="rich-text-editor-title-row" className={titleRow}>
            {editingTitle ? (
              <input
                className={titleInput}
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onBlur={commitTitle}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitTitle();
                }}
                // biome-ignore lint/a11y/noAutofocus: replaces an inline click-to-edit label, not a dialog
                autoFocus
              />
            ) : (
              <span className={titleText}>{title}</span>
            )}
            {!readOnly && !editingTitle && (
              <Button
                variant="none"
                size="icon-sm"
                className={editTitleButton}
                aria-label="Editar título"
                onClick={() => {
                  setDraftTitle(title ?? "");
                  setEditingTitle(true);
                }}
              >
                <PencilSimpleLine size={16} />
              </Button>
            )}
          </div>
        )}

        <EditableRecoveryBoundary
          key={bodyEpoch}
          onRecover={() => setBodyEpoch((epoch) => epoch + 1)}
        >
          <EditorContent
            editor={editor}
            data-testid="rich-text-editor-card"
            className={cx(body, card)}
            style={{ maxHeight: maxBodyHeight }}
          />
        </EditableRecoveryBoundary>
      </Stack>
    </div>
  );
}

export default RichTextEditor;
