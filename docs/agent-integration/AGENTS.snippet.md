<!-- Paste this block into the consumer repo's AGENTS.md / CLAUDE.md. It is the
     always-on guardrail; the `using-aymurai-ui` skill carries the full catalog. -->

## UI components: use @aymurai/ui

This app's UI primitives come from the shared **`@aymurai/ui`** library (the
AymurAI Figma UI Library, as React components). **Before building any button,
input, dialog, tooltip, toast, tag, spinner, checkbox, radio, select, stepper,
toolbar, status bar, logo, or archive view — import it from `@aymurai/ui`. Do
not re-implement these.** Reach for a custom component only when the library
genuinely lacks one; in that case, prefer adding it to `@aymurai/ui` over
forking a local copy.

```ts
import { Button, TextField, Toast } from "@aymurai/ui";
import "@aymurai/ui/styles.css"; // once, at the app root
```

For the full component catalog and props, invoke the **`using-aymurai-ui`**
skill. Components are fully typed — let autocomplete confirm props.
