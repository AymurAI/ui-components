import "@testing-library/jest-dom/vitest";

// jsdom has no real layout engine, so it doesn't implement the geometry APIs
// ProseMirror's EditorView uses to keep the caret in view / map a click's
// screen coordinates back to a document position (Range#getClientRects,
// Range#getBoundingClientRect, document.elementFromPoint all throw/are
// missing by default). Without these stubs, any `userEvent.type(...)` into a
// Tiptap-backed contentEditable throws inside `EditorView.dispatch` on every
// keystroke (see `scrollToSelection`/`posAtCoords`), silently corrupting the
// resulting document instead of failing the test outright — this is a test
// -environment gap, not related to the editor's real behavior in a browser.
if (typeof Range !== "undefined") {
  Range.prototype.getClientRects = () =>
    [] as unknown as ReturnType<Range["getClientRects"]>;
  Range.prototype.getBoundingClientRect = () => ({
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: 0,
    height: 0,
    x: 0,
    y: 0,
    toJSON() {
      return {};
    },
  });
}
if (typeof document !== "undefined" && !document.elementFromPoint) {
  document.elementFromPoint = () => null;
}
