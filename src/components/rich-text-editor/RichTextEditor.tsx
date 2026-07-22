import {
  PencilSimpleLine,
  TextBolder,
  TextItalic,
  TextUnderline,
} from "phosphor-react";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/button";
import { css, cx } from "@/styled/css";
import { HStack, Stack } from "@/styled/jsx";
import { paragraphPlainText, toggleMark } from "@/utils/rich-text/model";
import { reconcileParagraphText } from "@/utils/rich-text/reconcile";
import { getRangeOffsets } from "@/utils/rich-text/selection";
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

const toolbar = css({ borderBottom: "primary", pb: "3" });

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
      {paragraph.runs.map((run, index) => (
        // Runs are recreated on every edit — index is the only stable-enough
        // key available (no persistent run ids in the model).
        <RunView key={index} run={run} />
      ))}
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

export function RichTextEditor({
  document: doc,
  onChange,
  readOnly = false,
  title,
  onTitleChange,
  "aria-label": ariaLabel,
}: RichTextEditorProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title ?? "");
  const bodyRef = useRef<HTMLDivElement>(null);
  const activeSelectionRef = useRef<ActiveSelection | null>(null);

  const commitTitle = () => {
    setEditingTitle(false);
    if (draftTitle !== title) onTitleChange?.(draftTitle);
  };

  const captureSelection = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    const paragraphEl = (
      range.startContainer instanceof Element
        ? range.startContainer
        : range.startContainer.parentElement
    )?.closest("[data-paragraph-id]");
    if (!paragraphEl) return;

    const paragraphId = paragraphEl.getAttribute("data-paragraph-id");
    if (!paragraphId) return;

    const { start, end } = getRangeOffsets(paragraphEl as HTMLElement, range);
    activeSelectionRef.current = { paragraphId, start, end };
  }, []);

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
    const nextParagraphs = doc.paragraphs.map((paragraph) => {
      const el = root.querySelector(`[data-paragraph-id="${paragraph.id}"]`);
      if (!el) return paragraph;
      return reconcileParagraphText(paragraph, el.textContent ?? "");
    });
    onChange?.({ paragraphs: nextParagraphs });
  };

  return (
    <Stack gap="6">
      {title !== undefined && (
        <div className={titleRow}>
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

      {!readOnly && (
        <HStack gap="2" className={toolbar}>
          <Button
            variant="none"
            size="icon-sm"
            aria-label="Negrita"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyMark({ type: "bold" })}
          >
            <TextBolder size={20} />
          </Button>
          <Button
            variant="none"
            size="icon-sm"
            aria-label="Cursiva"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyMark({ type: "italic" })}
          >
            <TextItalic size={20} />
          </Button>
          <Button
            variant="none"
            size="icon-sm"
            aria-label="Subrayado"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => applyMark({ type: "underline" })}
          >
            <TextUnderline size={20} />
          </Button>
        </HStack>
      )}

      <div
        ref={bodyRef}
        role="textbox"
        aria-label={ariaLabel ?? "Resumen"}
        aria-multiline="true"
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className={cx(body)}
        onInput={handleInput}
      >
        {doc.paragraphs.map((paragraph) => (
          <ParagraphView key={paragraph.id} paragraph={paragraph} />
        ))}
      </div>
    </Stack>
  );
}

// Exported so tests/consumers can compute a paragraph's plain text without a
// second import path.
export { paragraphPlainText };

export default RichTextEditor;
