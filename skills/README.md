# Skill: using-aymurai-ui

An installable agent skill for **AymurAI web UI projects that consume
`@aymurai/ui`** (e.g. `desktop-app`, `defensoria`). Its job is to **enforce
using the shared `ui-components` library** — so coding agents import primitives
from `@aymurai/ui` instead of hand-building or restyling them.

Install it into a consumer project with the
[`skills`](https://github.com/mattpocock/skills) CLI:

```sh
npx skills@latest add AymurAI/ui-components
```

Pair it with the always-on guardrail in
`../docs/agent-integration/AGENTS.snippet.md` (paste into the consumer's
`AGENTS.md` / `CLAUDE.md`) — that's the layer that actually forces the behavior
every session; the skill carries the catalog/props on demand.

> Authoring this library (adding/editing components) is a separate concern and
> is **not** part of this installable set — that lives in this repo's
> `.claude/skills/authoring-aymurai-ui` and `docs/component-authoring.md`.
