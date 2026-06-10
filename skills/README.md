# Skills

Installable agent skills for working with `@aymurai/ui`. Install them with the
[`skills`](https://github.com/mattpocock/skills) CLI:

```sh
npx skills@latest add AymurAI/ui-components
```

- **`using-aymurai-ui`** — for agents in **consumer** apps (`desktop-app`,
  `defensoria`): how to install the library and the full component + props
  catalog, so they import from `@aymurai/ui` instead of reinventing UI.
- **`authoring-aymurai-ui`** — for agents working **in this repo**: the
  Figma→Panda workflow for adding/editing components (also mirrored in
  `.claude/skills/` so it auto-loads here).

Pair the consumer skill with the always-on guardrail in
`docs/agent-integration/AGENTS.snippet.md`.
