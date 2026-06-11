# Agent integration kit (for consumer web UI projects)

Drop-in artifacts for the **AymurAI web UI projects that consume `@aymurai/ui`**
(`desktop-app`, `defensoria`). Their purpose is to **enforce that coding agents
use the shared `ui-components` library** instead of re-implementing UI
primitives. This is not about authoring the library — that lives in
`docs/component-authoring.md` and `.claude/skills/authoring-aymurai-ui`.

Two layers, by design:

- **`AGENTS.snippet.md` — the always-on guardrail.** Paste it into the consumer
  repo's `AGENTS.md` / `CLAUDE.md`. It is loaded every session, so it's the only
  reliable way to *enforce* "use `@aymurai/ui`, don't reinvent." A skill alone
  can't guarantee this (skills are activated by description-matching).
- **The `using-aymurai-ui` skill — the on-demand catalog.** Lives in this repo's
  top-level [`skills/`](../../skills) folder so it can be installed with the
  `skills` CLI. It carries the bulky knowledge (install, full component catalog,
  props) via progressive disclosure, so it doesn't bloat every session.

## Wire up a consumer project

From the consumer repo (e.g. `desktop-app`):

```sh
# 1. install the library
pnpm add https://github.com/AymurAI/ui-components/releases/download/v0.1.0/aymurai-ui-0.1.0.tgz

# 2. install the enforcement skill
npx skills@latest add AymurAI/ui-components

# 3. add the always-on guardrail
curl -fsSL https://raw.githubusercontent.com/AymurAI/ui-components/main/docs/agent-integration/AGENTS.snippet.md >> AGENTS.md
```

(No CLI? Copy `skills/using-aymurai-ui` into the consumer's `.claude/skills/`
and paste `AGENTS.snippet.md` into its `AGENTS.md`.)

Verify it took: ask an agent in that repo to "add a primary button" — it should
import `Button` from `@aymurai/ui` rather than writing one.

> Re-run `npx skills@latest add AymurAI/ui-components` when the library's
> component set or version changes (the skill pins the install version and lists
> the catalog) to avoid drift.
