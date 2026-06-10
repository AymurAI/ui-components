# Agent integration kit

Drop-in artifacts so coding agents (Claude Code) in the **consumer** repos
(`desktop-app`, `defensoria`) reliably reach for `@aymurai/ui` instead of
re-implementing UI primitives.

Two layers, by design:

- **`AGENTS.snippet.md` — the always-on guardrail.** Paste it into each consumer
  repo's `AGENTS.md` / `CLAUDE.md`. It is loaded every session, so it's the only
  reliable way to enforce "use the library, don't reinvent." A skill can't
  guarantee this (skills are activated by description-matching).
- **`using-aymurai-ui/` — the on-demand skill.** Copy the folder into each
  consumer repo's `.claude/skills/`. It carries the bulky knowledge (install,
  full component catalog, props) via progressive disclosure, so it doesn't bloat
  every session.

## Wiring a consumer repo

```sh
# from the consumer repo root, e.g. ../desktop-app
mkdir -p .claude/skills
cp -R ../ui-assets/docs/agent-integration/using-aymurai-ui .claude/skills/
cat ../ui-assets/docs/agent-integration/AGENTS.snippet.md >> AGENTS.md   # or CLAUDE.md
```

Then install the library (see the root README) and verify an agent picks it up
by asking it to "add a primary button" — it should import `Button` from
`@aymurai/ui`.

> When the library's component set or version changes, re-copy
> `using-aymurai-ui/SKILL.md` (it pins the install version and lists the
> catalog). Consider a small CI step in consumers that re-syncs it from the
> published release to avoid drift.

## Authoring (this repo)

Agents working **in** the `@aymurai/ui` repo get the `authoring-aymurai-ui`
skill (`.claude/skills/authoring-aymurai-ui/`), which drives the Figma→Panda
component workflow. See also `docs/component-authoring.md`.
