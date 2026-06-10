# Agent integration kit

Drop-in artifacts so coding agents (Claude Code, Cursor, …) in the **consumer**
repos (`desktop-app`, `defensoria`) reliably reach for `@aymurai/ui` instead of
re-implementing UI primitives.

Two layers, by design:

- **`AGENTS.snippet.md` — the always-on guardrail.** Paste it into each consumer
  repo's `AGENTS.md` / `CLAUDE.md`. It is loaded every session, so it's the only
  reliable way to enforce "use the library, don't reinvent." A skill can't
  guarantee this (skills are activated by description-matching).
- **The `using-aymurai-ui` skill — the on-demand catalog.** Lives in this repo's
  top-level [`skills/`](../../skills) folder so it can be installed with the
  `skills` CLI. It carries the bulky knowledge (install, full component catalog,
  props) via progressive disclosure, so it doesn't bloat every session.

## Install the skill (recommended)

From a consumer repo, use the [`skills`](https://github.com/mattpocock/skills)
CLI — it reads the top-level `skills/` folder of this repo and lets you pick
which skills and which agents to install:

```sh
npx skills@latest add AymurAI/ui-components
# or with the full URL:
npx skills@latest add https://github.com/AymurAI/ui-components
```

Then add the always-on guardrail:

```sh
curl -fsSL https://raw.githubusercontent.com/AymurAI/ui-components/main/docs/agent-integration/AGENTS.snippet.md >> AGENTS.md
```

(or copy/paste `AGENTS.snippet.md` into your `AGENTS.md` / `CLAUDE.md`).

## Manual install (no CLI)

```sh
# from the consumer repo root, e.g. ../desktop-app
mkdir -p .claude/skills
cp -R ../ui-assets/skills/using-aymurai-ui .claude/skills/
cat ../ui-assets/docs/agent-integration/AGENTS.snippet.md >> AGENTS.md
```

Verify an agent picks it up by asking it to "add a primary button" — it should
import `Button` from `@aymurai/ui`.

> When the library's component set or version changes, re-run the `skills add`
> command (the skill pins the install version and lists the catalog) to avoid
> drift.

## Authoring (this repo)

Agents working **in** the `@aymurai/ui` repo get the `authoring-aymurai-ui`
skill (also in `skills/`, and mirrored in `.claude/skills/` so it auto-loads
here), which drives the Figma→Panda component workflow. See also
`docs/component-authoring.md`.
