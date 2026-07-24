import { Editor, type JSONContent } from "@tiptap/core";
import Highlight from "@tiptap/extension-highlight";
import { Markdown } from "@tiptap/markdown";
import StarterKit from "@tiptap/starter-kit";

/**
 * Converts raw Markdown (as delivered by the LLM) into the same JSONContent
 * shape RichTextEditor renders, using a headless (unmounted, no DOM) editor
 * instance so parsing goes through the identical schema — this guarantees
 * heading levels, list nodes, and marks come out shaped exactly as
 * RichTextEditor itself would produce them via direct user editing.
 *
 * The extension list here (StarterKit with link disabled, multicolor
 * Highlight, plus the Markdown extension) intentionally mirrors
 * RichTextEditor's own `useEditor` config so the schema — and therefore the
 * shape of the resulting document — is identical between parsing and live
 * editing.
 */
export function documentFromMarkdown(markdown: string): JSONContent {
  const editor = new Editor({
    extensions: [
      StarterKit.configure({ link: false }),
      Highlight.configure({ multicolor: true }),
      Markdown,
    ],
    content: markdown,
    contentType: "markdown",
  });
  const json = editor.getJSON();
  editor.destroy();
  return json;
}
