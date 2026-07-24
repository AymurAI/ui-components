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
  "& p": { margin: "0" },
  "& p + p": { marginTop: "4" },
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
export const RICH_TEXT_HIGHLIGHT_COLORS = [
  "category.blue-light",
  "category.blue",
  "category.green-light",
  "category.green",
  "category.orange-light",
  "category.orange",
  "category.pink-light",
  "category.pink",
  "category.red-light",
  "category.red",
  "category.yellow-light",
  "category.yellow",
];

// Human-readable Spanish names for the highlight swatches, so screen readers
// announce "Azul claro" instead of reading the raw token path "category dot
// blue dash light".
const HIGHLIGHT_COLOR_LABELS: Record<string, string> = {
  "category.blue-light": "Azul claro",
  "category.blue": "Azul",
  "category.green-light": "Verde claro",
  "category.green": "Verde",
  "category.orange-light": "Naranja claro",
  "category.orange": "Naranja",
  "category.pink-light": "Rosa claro",
  "category.pink": "Rosa",
  "category.red-light": "Rojo claro",
  "category.red": "Rojo",
  "category.yellow-light": "Amarillo claro",
  "category.yellow": "Amarillo",
};

const swatch = (color: string, active: boolean) =>
  css({
    w: "6",
    h: "6",
    rounded: "full",
    bg: color as never,
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
}: RichTextEditorProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title ?? "");
  const [bodyEpoch, setBodyEpoch] = useState(0);

  const commitTitle = () => {
    setEditingTitle(false);
    if (draftTitle !== title) onTitleChange?.(draftTitle);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ link: false }),
      Highlight.configure({ multicolor: true }),
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
  // user's in-progress typing on every render.
  useEffect(() => {
    if (!editor) return;
    const current = JSON.stringify(editor.getJSON());
    const next = JSON.stringify(doc);
    if (current !== next) {
      editor.commands.setContent(doc);
    }
  }, [editor, doc]);

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
                onMouseDown={(e) => e.preventDefault()}
                // TODO(Task 4): wire to editor?.chain().focus().toggleBold().run()
                onClick={() => {}}
              >
                <TextB size={20} />
              </Button>
              <Button
                variant="none"
                size="icon-sm"
                className={formatButton}
                aria-label="Cursiva"
                onMouseDown={(e) => e.preventDefault()}
                // TODO(Task 4): wire to editor?.chain().focus().toggleItalic().run()
                onClick={() => {}}
              >
                <TextItalic size={20} />
              </Button>
              <Button
                variant="none"
                size="icon-sm"
                className={formatButton}
                aria-label="Subrayado"
                onMouseDown={(e) => e.preventDefault()}
                // TODO(Task 4): wire to editor?.chain().focus().toggleUnderline().run()
                onClick={() => {}}
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
                    {highlightColors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        aria-label={HIGHLIGHT_COLOR_LABELS[color] ?? color}
                        className={swatch(color, false)}
                        onMouseDown={(e) => e.preventDefault()}
                        // TODO(Task 5): wire to editor?.chain().focus().toggleHighlight({ color }).run()
                        onClick={() => {}}
                      />
                    ))}
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
            // TODO(Task 6): wire to serializeDocumentToPlainText(editor?.getJSON())
            onClick={() => {}}
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
