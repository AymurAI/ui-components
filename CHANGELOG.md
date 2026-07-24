# Changelog

## 1.0.0

### BREAKING CHANGES

- `RichTextEditor`'s `document`/`onChange` props changed from the custom `RichTextDocument` model to Tiptap's `JSONContent` shape. The editing engine is now Tiptap (ProseMirror) instead of a from-scratch contentEditable implementation.
- Removed from the public API: `toggleMark`, `getActiveHighlightColor`, `parseListMarker`, `sameMark`, `splitRunsAtOffsets`, `mergeAdjacentRuns`, `createParagraph`, `paragraphPlainText`, `ListMarkerInfo`, `MarkType`, `RichTextParagraph`, `TextRun`, `TextMark`, `RichTextDocument`. Consumers using these directly (verified: none in `desktop-app` as of this release) must migrate to Tiptap's own `JSONContent`/`Editor` APIs.
- `serializeToPlainText` renamed to `serializeDocumentToPlainText`, now taking `JSONContent` instead of `RichTextDocument`.
- `documentFromMarkdown` now returns real `heading`/`bulletList`/`orderedList` nodes instead of flattened bold-paragraph/marker-prefixed-paragraph text — list numbering is now preserved on import (previously lost).
- `documentFromPlainText` now returns `JSONContent` instead of `RichTextDocument`.

### Added

- Real undo/redo, native keyboard shortcuts (Cmd/Ctrl+B/I/U), and native paste handling — none of these existed in the previous from-scratch implementation.
