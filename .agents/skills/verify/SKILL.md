---
name: verify
description: Runtime verification recipe for the disability-wiki static site — how to build, serve, and drive the real surfaces (rendered pages, redirects, offline precache). Use when verifying a change to this repo actually works.
---

# Verifying disability-wiki changes

The site is a static Astro Starlight build served by Cloudflare Pages. There are
**two different runtimes**, and picking the wrong one silently skips whole classes
of behaviour.

## Do not hand-roll `curl | grep` checks — use `scripts/verify_page.py`

Ad-hoc greps produced **three false signals in one session**, and every time the
page was correct and the check was wrong:

| Wrong conclusion | Why the grep lied |
|---|---|
| "legal rights DROPPED" | Keyed on `restraining` / `know your rights`; the content had survived reworded as "protection order", "accessible shelter". A keyword miss got reported as content loss. |
| "accent border not live" | Polled a hashed CSS URL captured **once**. The deploy renamed the asset, so the poll re-fetched a stale file forever. |
| "ordering incorrect" | Searched whole-page HTML. Starlight's on-this-page nav repeats every heading, so heading positions came from the nav and the phone number from the body. |

Shared root cause: **grepping raw HTML with boolean pattern-matches** instead of
scoping to rendered content and comparing sets. Note the direction — all three
were false *negatives*. A check that lies the other way (passes on a broken
life-safety page) is the real hazard, so prefer set-difference assertions that
must be explicitly satisfied over `if X in html`.

```bash
# ordering, scoped to <main> (strips nav/sidebar/footer + "Section titled" labels)
python3 scripts/verify_page.py order URL "In immediate danger" "1-800-799-7233" "Warning signs"

# every phone number in these sources still reachable on the page (set difference)
python3 scripts/verify_page.py kept URL before1.md before2.md

# list numbers found, for diffing EN vs ES
python3 scripts/verify_page.py numbers URL

# wait for a deploy — re-resolves hashed assets each poll, cache-busts every fetch
python3 scripts/verify_page.py await-asset URL 'border-inline-start:3px' --timeout 600
```

All subcommands exit non-zero on failure, so they can gate a script. If you add a
check, **give it a negative control** — prove it fails when the thing really is
missing, or you have only shown that it returns zero.

Cloudflare 403s Python's default `urllib` user-agent; the script sends a browser
UA. That is why a bare `urllib.request.urlopen` against production fails while
`curl` works.

## Build

```bash
cd site && npm run build     # → site/dist
```

The tail of the build output is itself evidence — it prints
`index-alias redirects: N` and `sw.js: N precached URLs`. A change that moves
those counts and shouldn't is a finding. (Seen for real: a count drop that turned
out to be an unrelated commit from a concurrent session sitting on the branch.)

## Serving: pick the right runtime

| Surface | Server | Why |
|---|---|---|
| Rendered pages | `site-preview` (`astro preview`, :4321) | fine for content/CSS/JS |
| **Redirects** | `site-pages` (`wrangler pages dev`, :8788) | **`astro preview` does NOT honour `site/public/_redirects`** |
| Pages Functions / auth | `site-pages` | needs the workerd runtime |

`site-preview` is in `.claude/launch.json`; start it with `preview_start`.

**`.claude/launch.json` is gitignored** (`.gitignore` tracks only `.claude/skills/`
and `settings.json`), so a `site-pages` entry does not travel between machines.
Add it locally with this — or just run the command directly:

```bash
npx wrangler pages dev site/dist --port 8788 --compatibility-date=2026-06-01
```

**The explicit `--compatibility-date` is required.** `pages dev` does not read it
from the root `wrangler.jsonc`, and defaulting to today fails hard — `This Worker
requires compatibility date "<today>", but the newest date supported by this server
binary is "<older>"`, and the runtime never starts. Pin it to match
`wrangler.jsonc` (`2026-06-01`); bump both together after a wrangler upgrade.

**`_redirects` is Cloudflare-only.** Verifying a redirect against `astro preview`
proves nothing — it will 404 or fall through regardless of the rule.

Wrangler local dev warns `Maximum number of dynamic rules supported is 100.
Skipping remaining N lines`. That is a **local-dev artifact** — real Cloudflare
Pages allows 2,000 static rules and handles the full file. Confirm against
production before treating it as a defect.

## The trailing-slash trap (bit us on a life-safety page)

Canonical URLs on this site have a **trailing slash**. `/foo` 307/308s to `/foo/`,
and the sitemap indexes the `/foo/` form. So the URL people bookmark and Google
indexes is the trailing-slash one.

A `_redirects` line matches only the exact path written:

```
/crisis/abuse/abuse-resources /crisis/abuse-neglect-exploitation 301
```

covers `/crisis/abuse/abuse-resources` but leaves `/crisis/abuse/abuse-resources/`
— the real URL — returning **404**.

**When retiring a URL, write BOTH forms into `_redirects`, and point them at the
trailing-slash target:**

```
/old/path  /new/path/ 301
/old/path/ /new/path/ 301
```

That yields a true single-hop 301 for both. (Adding it to `astro.config.mjs`
`redirects` also covers the trailing-slash form — that is how
`/start/disability-models` works — but Astro emits an HTML page with a meta
refresh, so the browser sees 200 rather than a 301. Prefer `_redirects` for
retirements; use the Astro config only when you also want a real page there.)

Always test both forms:

```bash
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://localhost:8788/old/path
curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}\n' http://localhost:8788/old/path/
```

## Deleting or merging a page: checklist

1. Both URL forms redirect (above) — and check the **ES twin**.
2. Nothing was silently lost. Diff the extracted phone numbers / URLs between the
   pre-merge sources and the merged page rather than trusting the commit message:
   ```bash
   git show <sha>^:path/to/page.md > /tmp/before.md
   git show <sha>:path/to/page.md  > /tmp/after.md
   ```
3. EN and ES number sets are identical.
4. `dist/sw.js` precache: merged page present, deleted pages gone.
   Offline users had the old URL precached — if it is dropped *and* the network
   404s, they lose it with no fallback.
5. Drive a real inbound link end-to-end (click it, don't just grep the href) and
   confirm it lands somewhere with the numbers.

## Crisis pages specifically

The app announcement banner is suppressed on `crisis/` and `es/crisis/` — markup
and both inline scripts. `'dw-banner' not in html` should hold for any crisis page.

## Checking production

Cloudflare caches rendered HTML. `cf-cache-status: DYNAMIC` means the response
came from origin, so a stale-looking page is a build still in flight, not the edge
cache — do not go hunting for a cache-purge problem that isn't there.

Deploys land per-merge: two PRs merged seconds apart finish minutes apart, so
"my change isn't live" often just means the *other* build finished first. Wait on
the specific artefact with `verify_page.py await-asset` rather than a fixed sleep.
