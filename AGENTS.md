# arsen-ai-web Codex Guide

## Role

`arsen-ai-web` is the public-facing static site repository for `arsen-ai.com`.

## Safety

- Assume public exposure.
- Do not include private IPs, tokens, API keys, emails, Cloudflare tunnel IDs, or internal machine names in public content.
- Do not publish, deploy, or push without explicit user approval.
- Legal/privacy stop gate:
  - Do not add public forms that collect name, phone, email, age, location, review content, or purchase intent without a visible privacy-policy link and an explicit purpose/retention/consent note.
  - Do not add marketing-message CTAs or newsletter flows without distinguishing service notices from advertising, and without a clear opt-in/opt-out path.
  - Do not add location-based features unless location-law reporting/consent/retention requirements are checked first.
  - Do not add resident registration number collection. Legal basis is required; consent alone is not enough.
  - Do not publish legal penalty numbers unless they are framed as statutory maxima and sourced from current law.

## Work Rules

- Keep this project separate from `ai-tools` POC work unless the user chooses a publishing step.
- Blog automation may produce local drafts in `ai-tools`; moving content here is a separate stop gate.
- Check git status and recent commits before any edit.
- At the start of substantial homepage work, explicitly choose `direct Codex`, `Orca delegation`, or `Work Bus delegation`.
- Use direct Codex for narrow static-site edits that can be implemented and verified immediately in the current session.
- Use Orca for parallel QA, copy/design review, research/audit, or delegated Claude/Antigravity work. Consumer Gemini-family work must use `agy`, not the legacy `gemini` CLI.
- Use Work Bus for Windows, scheduled, durable, headless, or cross-machine work that must survive the current session.
- Do not create Work Bus tasks just to create activity. Default to 0 new tasks; create at most 1-2 narrow tasks unless the user explicitly approves more.
- Every new Work Bus task must include purpose, target files/paths, whether mutation is allowed, external send/publish/deploy forbidden, expected `final_status_code`, verification method, and result storage location.
- Auto/refill mode stays off by default. Use `prepare` or a bounded short `auto --max-tasks` run only after explicit operator approval.
- After worker results return, Codex must classify them as applied/tested/proposal/stale/duplicate/blocked and decide whether they actually changed the usable public site.
