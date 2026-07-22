import { PencilSimpleLine } from "phosphor-react";
import { Fragment, useState } from "react";
import { Button } from "@/components/button";
import { css, cx } from "@/styled/css";
import { Stack } from "@/styled/jsx";
import { paragraphPlainText } from "@/utils/rich-text/model";
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

export function RichTextEditor({
  document: doc,
  readOnly = false,
  title,
  onTitleChange,
  "aria-label": ariaLabel,
}: RichTextEditorProps) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title ?? "");

  const commitTitle = () => {
    setEditingTitle(false);
    if (draftTitle !== title) onTitleChange?.(draftTitle);
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

      <div
        role="textbox"
        aria-label={ariaLabel ?? "Resumen"}
        aria-multiline="true"
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className={cx(body)}
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
