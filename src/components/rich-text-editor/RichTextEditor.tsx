import {
  Copy as CopyIcon,
  Highlighter,
  PencilSimpleLine,
  TextB,
  TextItalic,
  TextUnderline,
} from "@phosphor-icons/react";
import {
  Component,
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/popover";
import { css, cx } from "@/styled/css";
import { HStack, Stack } from "@/styled/jsx";
import {
  createParagraph,
  getActiveHighlightColor,
  mergeAdjacentRuns,
  paragraphPlainText,
  parseListMarker,
  serializeToPlainText,
  splitRunsAtOffsets,
  toggleMark,
} from "@/utils/rich-text/model";
import { reconcileParagraphText } from "@/utils/rich-text/reconcile";
import { getRangeOffsets, setCaretOffset } from "@/utils/rich-text/selection";
import type {
  RichTextDocument,
  RichTextParagraph,
  TextMark,
  TextRun,
} from "@/utils/rich-text/types";

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

// Unique-enough id generator for paragraphs created at runtime (Enter split,
// typing into an empty document). Runs in real browsers only, so Date.now +
// a monotonic counter is sufficient and collision-free within a session.
let paragraphIdCounter = 0;
function nextParagraphId(): string {
  paragraphIdCounter += 1;
  return `rte-p-${Date.now().toString(36)}-${paragraphIdCounter}`;
}

function elementOf(node: Node | null): Element | null {
  if (!node) return null;
  return node instanceof Element ? node : node.parentElement;
}

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

function markClassName(mark: TextMark): string | undefined {
  if (mark.type === "highlight") {
    return css({ bg: (mark.color ?? "category.yellow-light") as never });
  }
  return undefined;
}

function RunView({ run }: { run: TextRun }) {
  let node: React.ReactNode = run.text;

  for (const mark of run.marks) {
    if (mark.type === "bold") node = <strong>{node}</strong>;
    else if (mark.type === "italic") node = <em>{node}</em>;
    else if (mark.type === "underline") node = <u>{node}</u>;
    else if (mark.type === "highlight")
      node = <mark className={markClassName(mark)}>{node}</mark>;
  }

  return <Fragment>{node}</Fragment>;
}

function ParagraphView({ paragraph }: { paragraph: RichTextParagraph }) {
  return (
    <p data-paragraph-id={paragraph.id}>
      {paragraph.runs.length === 0 ? (
        // A paragraph with no runs (list-exit, or all text deleted) renders
        // with zero children and thus zero height without this fallback —
        // contentEditable can't host a caret in an empty block, which
        // misroutes native typing to the previous paragraph.
        <br />
      ) : (
        paragraph.runs.map((run, index) => (
          // Runs are recreated on every edit — index is the only
          // stable-enough key available (no persistent run ids in the
          // model).
          <RunView key={index} run={run} />
        ))
      )}
    </p>
  );
}

export interface RichTextEditorProps {
  document: RichTextDocument;
  onChange?: (next: RichTextDocument) => void;
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

interface ActiveSelection {
  paragraphId: string;
  start: number;
  end: number;
}

function findParagraph(
  doc: RichTextDocument,
  paragraphId: string,
): RichTextParagraph | undefined {
  return doc.paragraphs.find((p) => p.id === paragraphId);
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

function splitParagraphRuns(
  paragraph: RichTextParagraph,
  offset: number,
): { before: TextRun[]; after: TextRun[] } {
  const splitRuns = splitRunsAtOffsets(paragraph.runs, [offset]);
  const before: TextRun[] = [];
  const after: TextRun[] = [];
  let pos = 0;
  for (const run of splitRuns) {
    if (pos < offset) before.push(run);
    else after.push(run);
    pos += run.text.length;
  }
  return { before, after };
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
  const bodyRef = useRef<HTMLDivElement>(null);
  const activeSelectionRef = useRef<ActiveSelection | null>(null);
  const pendingCaretRef = useRef<{
    paragraphId: string;
    offset: number;
  } | null>(null);
  const [activeHighlightColor, setActiveHighlightColor] = useState<
    string | null
  >(null);

  const commitTitle = () => {
    setEditingTitle(false);
    if (draftTitle !== title) onTitleChange?.(draftTitle);
  };

  const captureSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const startParagraphEl = elementOf(range.startContainer)?.closest(
      "[data-paragraph-id]",
    );
    if (!startParagraphEl) return;

    const paragraphId = startParagraphEl.getAttribute("data-paragraph-id");
    if (!paragraphId) return;

    const { start, end } = getRangeOffsets(
      startParagraphEl as HTMLElement,
      range,
    );

    const endParagraphEl = elementOf(range.endContainer)?.closest(
      "[data-paragraph-id]",
    );
    // Cross-paragraph selection: this editor's mark model is paragraph-scoped
    // (`toggleMark` operates on a single paragraph), and `getRangeOffsets`
    // would compute the end offset against the wrong container. Clamp the
    // selection to the end of the start paragraph — the simplest safe default.
    const clampedEnd =
      endParagraphEl === startParagraphEl
        ? end
        : (startParagraphEl.textContent?.length ?? start);

    activeSelectionRef.current = { paragraphId, start, end: clampedEnd };

    const paragraph = findParagraph(doc, paragraphId);
    setActiveHighlightColor(
      paragraph
        ? (getActiveHighlightColor(paragraph, start, clampedEnd) ?? null)
        : null,
    );
  }, [doc]);

  // Selection tracking is wired via native listeners rather than React's
  // `onSelect` prop: React only synthesizes `onSelect` from a fixed list of
  // native events (mouseup/keydown/keyup/focusin/focusout/contextmenu/
  // dragend/selectionchange) gated on `document.activeElement`, which never
  // fires for a contentEditable region that hasn't been focused
  // programmatically — the exact case exercised in tests. Listening
  // natively for both `select` (bubbles from the paragraph itself) and
  // `selectionchange` (fires in real browsers whenever the caret/selection
  // moves) covers both real usage and test simulation.
  useEffect(() => {
    const root = bodyRef.current;
    if (!root || readOnly) return;

    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || !root.contains(selection.anchorNode)) return;
      captureSelection();
    };

    root.addEventListener("select", handleSelectionChange);
    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      root.removeEventListener("select", handleSelectionChange);
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [readOnly, captureSelection]);

  // After a structural edit (Enter split, Backspace merge) swaps the
  // paragraph subtree for a new one, the browser's own caret tracking is
  // lost — the old Range's anchor/focus nodes no longer exist. Once the DOM
  // has been updated to reflect the new `doc`, explicitly restore the caret
  // to wherever handleKeyDown recorded as the expected landing spot.
  // biome-ignore lint/correctness/useExhaustiveDependencies: doc isn't read in the body, but re-running after each doc update is the signal the DOM has repainted
  useLayoutEffect(() => {
    const pending = pendingCaretRef.current;
    const root = bodyRef.current;
    if (!pending || !root) return;
    const paragraphEl = root.querySelector(
      `[data-paragraph-id="${pending.paragraphId}"]`,
    );
    if (paragraphEl instanceof HTMLElement) {
      root.focus();
      setCaretOffset(paragraphEl, pending.offset);
    }
    pendingCaretRef.current = null;
  }, [doc]);

  const applyMark = (mark: TextMark) => {
    const selection = activeSelectionRef.current;
    if (!selection) return;
    const paragraph = findParagraph(doc, selection.paragraphId);
    if (!paragraph) return;

    const nextParagraph = toggleMark(
      paragraph,
      selection.start,
      selection.end,
      mark,
    );
    onChange?.({
      paragraphs: doc.paragraphs.map((p) =>
        p.id === paragraph.id ? nextParagraph : p,
      ),
    });
  };

  const handleInput = () => {
    const root = bodyRef.current;
    if (!root) return;

    // Empty document: there is no paragraph element to reconcile against, so
    // typed text lands directly in the contentEditable body. Seed a first
    // paragraph from it.
    if (doc.paragraphs.length === 0) {
      const text = root.textContent ?? "";
      if (text.length === 0) return;
      onChange?.({ paragraphs: [createParagraph(nextParagraphId(), text)] });
      return;
    }

    const LIST_TRIGGER_RE = /^[-*] /;
    const nextParagraphs = doc.paragraphs.map((paragraph) => {
      const el = root.querySelector(`[data-paragraph-id="${paragraph.id}"]`);
      if (!el) return paragraph;
      let text = el.textContent ?? "";
      if (LIST_TRIGGER_RE.test(text) && !text.startsWith("• ")) {
        text = `• ${text.slice(2)}`;
      }
      return reconcileParagraphText(paragraph, text);
    });
    onChange?.({ paragraphs: nextParagraphs });
  };

  // Structural edits contentEditable can't express through plain-text
  // reconciliation: Enter splits a paragraph, Backspace-at-start merges into
  // the previous one. Each branch records where the caret should land after
  // the resulting re-render in `pendingCaretRef`, which the `useLayoutEffect`
  // above applies once the new `doc` has been painted.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (readOnly) return;

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const paragraphEl = elementOf(range.startContainer)?.closest(
      "[data-paragraph-id]",
    );
    if (!paragraphEl) return;
    const paragraphId = paragraphEl.getAttribute("data-paragraph-id");
    if (!paragraphId) return;
    const index = doc.paragraphs.findIndex((p) => p.id === paragraphId);
    if (index === -1) return;
    const paragraph = doc.paragraphs[index];
    const { start, end } = getRangeOffsets(paragraphEl as HTMLElement, range);

    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      const fullText = paragraphPlainText(paragraph);
      const listInfo = parseListMarker(fullText);

      if (listInfo && start >= listInfo.marker.length) {
        const contentAfterMarker = fullText.slice(listInfo.marker.length);
        if (contentAfterMarker.trim().length === 0) {
          // Empty list item — exit the list rather than continuing it.
          const emptyParagraph: RichTextParagraph = { ...paragraph, runs: [] };
          const nextParagraphs = [...doc.paragraphs];
          nextParagraphs.splice(index, 1, emptyParagraph);
          pendingCaretRef.current = { paragraphId: paragraph.id, offset: 0 };
          onChange?.({ paragraphs: nextParagraphs });
          return;
        }

        const { before, after } = splitParagraphRuns(paragraph, start);
        const nextMarker = listInfo.ordered
          ? `${(listInfo.number ?? 0) + 1}${
              listInfo.marker.trimEnd().endsWith(")") ? ")" : "."
            } `
          : listInfo.marker;
        const first: RichTextParagraph = {
          ...paragraph,
          runs: mergeAdjacentRuns(before),
        };
        const second: RichTextParagraph = {
          id: nextParagraphId(),
          runs: mergeAdjacentRuns([{ text: nextMarker, marks: [] }, ...after]),
        };
        const nextParagraphs = [...doc.paragraphs];
        nextParagraphs.splice(index, 1, first, second);
        pendingCaretRef.current = {
          paragraphId: second.id,
          offset: nextMarker.length,
        };
        onChange?.({ paragraphs: nextParagraphs });
        return;
      }

      const { before, after } = splitParagraphRuns(paragraph, start);
      const first: RichTextParagraph = {
        ...paragraph,
        runs: mergeAdjacentRuns(before),
      };
      const second: RichTextParagraph = {
        id: nextParagraphId(),
        runs: mergeAdjacentRuns(after),
      };
      const nextParagraphs = [...doc.paragraphs];
      nextParagraphs.splice(index, 1, first, second);
      pendingCaretRef.current = { paragraphId: second.id, offset: 0 };
      onChange?.({ paragraphs: nextParagraphs });
      return;
    }

    if (
      event.key === "Backspace" &&
      selection.isCollapsed &&
      start === 0 &&
      end === 0 &&
      index > 0
    ) {
      event.preventDefault();
      const prev = doc.paragraphs[index - 1];
      const merged: RichTextParagraph = {
        ...prev,
        runs: mergeAdjacentRuns([...prev.runs, ...paragraph.runs]),
      };
      const nextParagraphs = [...doc.paragraphs];
      nextParagraphs.splice(index - 1, 2, merged);
      pendingCaretRef.current = {
        paragraphId: prev.id,
        offset: paragraphPlainText(prev).length,
      };
      onChange?.({ paragraphs: nextParagraphs });
    }
  };

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
                onClick={() => applyMark({ type: "bold" })}
              >
                <TextB size={20} />
              </Button>
              <Button
                variant="none"
                size="icon-sm"
                className={formatButton}
                aria-label="Cursiva"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyMark({ type: "italic" })}
              >
                <TextItalic size={20} />
              </Button>
              <Button
                variant="none"
                size="icon-sm"
                className={formatButton}
                aria-label="Subrayado"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyMark({ type: "underline" })}
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
                        className={swatch(
                          color,
                          color === activeHighlightColor,
                        )}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                          if (!activeSelectionRef.current) return;
                          applyMark({ type: "highlight", color });
                          setActiveHighlightColor((prev) =>
                            prev === color ? null : color,
                          );
                        }}
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
            onClick={() => {
              navigator.clipboard
                ?.writeText(serializeToPlainText(doc))
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
          <div
            data-testid="rich-text-editor-card"
            ref={bodyRef}
            role="textbox"
            aria-label={ariaLabel ?? "Resumen"}
            aria-multiline="true"
            contentEditable={!readOnly}
            suppressContentEditableWarning
            className={cx(body, card)}
            style={{ maxHeight: maxBodyHeight }}
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          >
            {doc.paragraphs.map((paragraph) => (
              <ParagraphView key={paragraph.id} paragraph={paragraph} />
            ))}
          </div>
        </EditableRecoveryBoundary>
      </Stack>
    </div>
  );
}

// Exported so tests/consumers can compute a paragraph's plain text without a
// second import path.
export { paragraphPlainText };

export default RichTextEditor;
