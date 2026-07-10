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
