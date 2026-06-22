---
title: Incident Response Runbook
description: Internal — what to do when the site is down, serving wrong life-safety info, or shipped bad content. Not for publication.
published: false
tags:
editor: markdown
---

# Incident Response Runbook

What to do when disabilitywiki.org breaks. The site is a **static Astro Starlight
build on Cloudflare Pages** (project `disability-wiki`, root `site/`, auto-deploys
on merge to `main`). **Publishing = merge to main** — there is no human review
gate beyond [CI](../.github/workflows/ci.yml), so a bad merge reaches the live
site within a Pages build cycle.

This is a **life-safety reference**: it carries crisis hotline numbers, benefits
dollar figures, and legal deadlines people act on. A wrong number is an incident,
not a typo. Treat content correctness with the same urgency as uptime.

Adapted from the `benefits-navigator` incident runbook for a static content site.

## Table of contents

1. [Severity levels](#severity-levels)
2. [Rollback paths (and the 2026-07-10 deadline)](#rollback-paths)
3. [Runbooks](#runbooks)
4. [Post-incident](#post-incident)
5. [Contacts and access](#contacts-and-access)

---

## Severity levels

| Severity | Description | Response | Examples |
|----------|-------------|----------|----------|
| **SEV1 — Critical** | Site down, **or** live content that can cause physical harm | Immediate | All-pages 5xx/DNS failure; a crisis/suicide hotline number that is wrong, dead, or misrouted; a benefits rule that would make someone lose eligibility |
| **SEV2 — High** | Major section broken or broadly-wrong content deployed; TLS/security failure | < 4 hours | A bad merge rewrote many pages; cert expired; whole section 404s; defacement |
| **SEV3 — Medium** | Single page broken, broken internal links, stale-but-not-dangerous facts | Next day | One page won't render; dead links; an outdated (not harmful) figure |
| **SEV4 — Low** | Cosmetic | Backlog | Emoji/heading style, minor layout |

**The SEV1 content test:** *would someone be physically or financially harmed by
acting on what the page says right now?* Crisis numbers, "call this in an
emergency" instructions, and eligibility-destroying benefits advice are SEV1. When
unsure, treat as SEV1 and verify.

---

## Rollback paths

There are **two** rollback paths, and one of them expires.

1. **Content rollback (preferred, always available): `git revert` + redeploy.**
   Bad content or a broken build that merged to `main` — revert the merge commit
   on `main`; Cloudflare Pages rebuilds and redeploys the corrected `main`
   automatically. This is the right path for *almost every* incident, because the
   droplet's content is **stale** (it stopped being the source of truth at the
   2026-06-12 cutover).

   ```bash
   git revert -m 1 <bad-merge-sha>   # -m 1 for a merge commit; drop it for a plain commit
   git push origin main              # Pages redeploys main
   ```

   You can also **roll back to a previous deployment** in the Cloudflare Pages
   dashboard (Deployments → pick last-good → "Rollback to this deployment") for an
   instant revert without waiting for a rebuild. Still land the `git revert` so
   `main` and the live deploy agree.

2. **Platform rollback (DNS → droplet): restore the A records to `167.71.97.167`.**
   Use **only** if Cloudflare Pages itself is down/unservable and the droplet is
   still running Wiki.js. This points the domain back at the old Wiki.js server.

   > ⚠️ **EXPIRES 2026-07-10.** The droplet is scheduled for decommission on
   > **2026-07-10** (Claude task `droplet-decommission-day`; see
   > `migration/MIGRATION_PLAN.md` Phase 5). After that date this path **does not
   > exist** — there is no server to point at. Post-decommission, a platform
   > outage is handled by Cloudflare Pages deployment rollback (path 1's dashboard
   > option) and, if Pages is truly down, by Cloudflare support. **When you
   > decommission the droplet, delete path 2 from this runbook.**

**Decision rule:** content/build problem → **path 1** (revert). Cloudflare Pages
platform outage, before 2026-07-10 → **path 2** (A records to droplet). After
2026-07-10 → path 1 dashboard rollback / Cloudflare support only.

---

## Runbooks

### A crisis or hotline number is wrong, dead, or misrouted (SEV1)

This is the highest-stakes incident class — the fabricated-hotline pattern is a
known, recurring failure (the AI invented "Lifeline {Country}" orgs with plausible
numbers; a Vietnamese bank's customer line was listed as a mental-health hotline).
See the fact-check error heatmap in project memory.

1. **Confirm** the number is wrong by checking **two independent primary sources**
   (the operating org's official site + a government/health-ministry listing). Do
   not "fix" a correct number on one report.
2. **Fix English + Spanish together.** The `es/` page is a separate file with the
   same number; correct both (use the `disability-wiki-accuracy` and
   `spanish-wiki-translation` skills).
3. **Grep the wrong number sitewide before declaring it fixed.** Fabricated
   numbers propagate across overview + country pages + footers. The old SSI "car
   value" error had silently copied into `benefits/index.md`.
   ```bash
   grep -rn "<the wrong number>" . --include=*.md
   ```
4. **Merge to main**, let Pages deploy, then **verify the live page actually
   shows the fix** (see the Cloudflare-cache runbook — a `?v=` param does *not*
   bust the cache).
5. If the page can't be fixed within the SEV1 window, **unpublish or hedge** the
   specific number rather than leave a harmful one live.

### The site is down (all/most pages failing) (SEV1)

1. **Isolate the layer:**
   - `curl -sI https://disabilitywiki.org` — TLS + status. 5xx vs no-response.
   - Check **Cloudflare Pages dashboard** → project `disability-wiki` →
     Deployments: did the last deploy fail or succeed?
   - Check **Cloudflare DNS** for the zone: are the records still pointing at
     Pages (CNAME/Pages), or were they changed?
   - Check [cloudflarestatus.com](https://www.cloudflarestatus.com/).
2. **If the last deploy failed/shipped a bad build** → **path 1**: revert the
   merge or roll back the deployment in the dashboard.
3. **If Cloudflare Pages itself is down** and it's **before 2026-07-10** →
   **path 2**: restore A records to `167.71.97.167`. After that date → wait on
   Cloudflare / open a support ticket; there is no fallback origin.
4. Communicate status (even to yourself: log start time, suspected cause).

### A bad merge shipped broadly-wrong content or defacement (SEV2)

1. **Revert first, diagnose second** (path 1): `git revert -m 1 <sha>` && push, or
   dashboard deployment-rollback for immediate effect.
2. Do **not** use the droplet to "restore" content — its content is frozen at the
   cutover and would itself be stale/wrong.
3. Once reverted, open the offending diff in a branch, fix properly, re-merge
   through CI.

### Cloudflare is serving a stale page after a fix

The DB/repo/build can be correct while the edge still serves the old HTML.

1. Verify the **origin** is correct first: check the built page or the source on
   `main`, not just `curl` of the public URL.
2. **Purge** in the Cloudflare dashboard (Caching → Purge → purge the specific
   URL, or Purge Everything if widespread).
3. A `?v=` / cache-buster query param **does not** bust Cloudflare's cache — don't
   rely on it to "prove" a fix.

### Cloudflare Pages build is failing

1. Read the **build log** in the Pages dashboard. Most failures are an Astro/
   Starlight content error (bad frontmatter YAML, a broken content reference).
2. Reproduce locally: `cd site && npm ci && npm run build`.
3. CI ([.github/workflows/ci.yml](../.github/workflows/ci.yml)) runs this same
   build on every PR — a red CI check is the early warning. If a build broke on
   `main`, CI on the PR should have caught it; if it didn't, the gap is a
   follow-up.

---

## Post-incident

For any SEV1 or SEV2, write a short post-mortem (blameless — focus on the system,
not the person):

```
## Post-mortem: <title> (<date>)
- Severity: SEV<N>
- Duration: <detected> → <resolved>
- User impact: <who saw what, and the harm risk>
- Root cause: <what actually broke>
- Resolution: <what fixed it>
- Detection gap: <why we didn't catch it sooner — and the guardrail that closes it>
- Follow-ups: <issues/PRs>
```

**If the lesson transfers to other projects** (a Cloudflare-cache gotcha, a
deploy-gate gap, a content-verification miss), capture it with **`/lesson`** so it
lands in `~/.claude/shared/LESSONS.md` and reaches crip-chronicle and the other
sites. Project-specific facts stay in this repo's memory.

---

## Contacts and access

| What | Where |
|------|-------|
| Hosting | Cloudflare Pages → project `disability-wiki` (auto-deploys `main`, root `site/`) |
| Preview build | https://disability-wiki.pages.dev |
| DNS / cache / TLS | Cloudflare dashboard, zone `disabilitywiki.org` |
| Source / merge gate | GitHub `Beaudoin0zach/disability-wiki`, CI `.github/workflows/ci.yml` |
| Rollback origin (until **2026-07-10**) | Droplet `167.71.97.167`, SSH alias `cripchronicle`, containers `wiki_wiki_1` / `wiki_db_1` |
| Maintainer | Zach Beaudoin (@Beaudoin0zach) |

Related: `migration/MIGRATION_PLAN.md` (cutover + decommission), project memory
(`wikijs-ops-gotchas`, `fact-check-error-heatmap`), the `disability-wiki-accuracy`
and `disability-wiki-edit` skills.
