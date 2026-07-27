# Deploy the page-feedback tally (Cloudflare D1)

The "Was this page helpful?" widget POSTs to `/api/feedback`, a Pages Function that
increments two integers per page. Until the D1 binding below exists the endpoint
returns **503** and the widget tells the reader their answer did not record — it
never shows a thank-you for a vote that went nowhere, so an unprovisioned site is
honest rather than quietly lossy.

D1 rather than a new vendor: it is SQLite on the platform already hosting the site,
so there is no second service, no service-role secret, and nothing new in the
life-safety path.

## What is stored

```sql
CREATE TABLE IF NOT EXISTS page_feedback (
  page TEXT PRIMARY KEY,
  yes  INTEGER NOT NULL DEFAULT 0,
  no   INTEGER NOT NULL DEFAULT 0
);
```

That is the entire schema, and it is the point. There is **no** column for an IP, a
hash of an IP, a cookie, a session, a user agent, a referrer, a per-vote timestamp,
or free text. [`privacy.md`](../privacy.md) makes those promises in plain language;
adding any of them means changing that page first, in public.

**Consequence, stated honestly:** with no identifier there is no server-side
deduplication. One determined person can move a number. That is the accepted cost
of the promise — the widget keeps a `localStorage` marker so an ordinary reader is
not counted twice, but that is hygiene, not enforcement, and it never leaves the
browser.

## Provision

Requires Cloudflare credentials, so it cannot be done from a PR.

### 0. Get on the right account first — this is where it goes wrong

This machine has **two** Cloudflare accounts, and the site lives in only one:

| Account | ID | Holds the Pages project? |
|---|---|---|
| `Beaudoin0zach@aol.com` | `39d7ced651572ee48cca6a29e1feebe9` | **yes** |
| `Airboat-webcast.5u@icloud.com` | `3b752cee282808bcfcebc84aaea9a1c3` | no |

**D1 bindings are account-scoped.** A database created in the wrong account cannot
be bound to the Pages project at all — it will not appear in the dropdown, and no
amount of fixing the binding name will help. This has already happened once: the
first `d1 create` succeeded, looked completely normal, and produced an unusable
database (`f15076aa-…`, still orphaned in the iCloud account).

Two independent things have to be right, and they fail differently:

**(a) The token.** Switching accounts in the *dashboard does nothing* — wrangler
caches its own OAuth token in `~/.wrangler/config/default.toml`. There is no
"switch account" command; log out and back in:

```bash
npx wrangler logout && npx wrangler login --browser=false
```

`--browser=false` prints the URL instead of auto-opening. Use it: auto-open goes to
your *default* browser, and if that profile is signed into Cloudflare as the wrong
account you will silently re-authorise the wrong one. Paste the URL into a window
signed in as **beaudoin0zach@aol.com**.

**(b) The account ID.** Even with the right token, some wrangler subcommands
resolve a *stale* account ID and fail with `Authentication error [code: 10000]`
naming the old account — observed 2026-07-27, where `d1 create` used the correct
account while `d1 list` used the old one in the same session. It is not in any
config file (`wrangler.jsonc`, both `default.toml`s and the project `.wrangler/`
state dirs were all checked; only the logs mention it). Set it explicitly:

```bash
export CLOUDFLARE_ACCOUNT_ID=39d7ced651572ee48cca6a29e1feebe9
```

Worth putting in your shell profile — this is the same account-id gotcha the Pages
deploy work hit.

**Verify before creating anything.** If this prints the wrong ID, stop; otherwise
you make a second orphan:

```bash
npx wrangler whoami     # Account ID must be 39d7ced651572ee48cca6a29e1feebe9
```

### 1. Create the database and the table

```bash
npx wrangler d1 create disability-wiki-feedback
npx wrangler d1 execute disability-wiki-feedback --remote --file=site/schema/page_feedback.sql
```

Confirm the table is really there — `_cf_KV` is Cloudflare's own, `page_feedback` is ours:

```bash
npx wrangler d1 execute disability-wiki-feedback --remote \
  --command "SELECT name FROM sqlite_master WHERE type='table'"
```

### 2. Bind it

**Settings → Functions → D1 database bindings**, for **both** Production and Preview:

| Variable name | Database |
|---|---|
| `PAGE_FEEDBACK` | `disability-wiki-feedback` |

The binding name is what `functions/api/feedback.ts` reads as `env.PAGE_FEEDBACK`.
**Ignore the `"binding": "disability_wiki_feedback"` snippet `d1 create` prints** —
that is for a Worker config file this project does not use, and using it as the
variable name leaves the endpoint permanently 503ing.

### 3. Redeploy

Bindings apply to **new deployments only** — the currently-live one will keep
503ing until you redeploy (re-run the latest deployment from the Pages dashboard,
or merge anything).

### 4. Verify end to end

```bash
curl -s -X POST https://disabilitywiki.org/api/feedback \
  -d 'page=/reuse/&helpful=yes' | head -1          # expect {"ok":true}
curl -s -X POST https://disabilitywiki.org/api/feedback \
  -d 'page=/crisis/&helpful=yes' | head -1          # expect a 400 — crisis pages are never counted
npx wrangler d1 execute disability-wiki-feedback --remote \
  --command "SELECT * FROM page_feedback"
```

A 503 from the first call means the binding did not take — check the variable name
and that you redeployed.

## Read the results

```bash
npx wrangler d1 execute disability-wiki-feedback --remote \
  --command "SELECT page, yes, no, no - yes AS net_negative
             FROM page_feedback
             WHERE no > 0
             ORDER BY net_negative DESC, no DESC
             LIMIT 40"
```

Sort by net-negative, not by raw `no`: a popular page with 200 yes and 12 no is
working, and a quiet page with 3 no and 0 yes is the one to go and read.

**Treat this as a pointer, not a verdict.** A thumbs-down says the page failed
*that* person; it does not say why, and the counts carry no denominator (there is no
pageview number to compare against, by design). The action it should trigger is a
human reading the page against
[the accuracy discipline](../docs/CLAIMS.md) — not an edit driven by the number.

## Known state (2026-07-27)

- Database `disability-wiki-feedback` = `6cdba0c9-0f42-4da1-a991-f1520b9394ef`, in the
  **aol** account, table created and empty.
- An orphan `disability-wiki-feedback` (`f15076aa-…`) still exists in the **iCloud**
  account from the first, wrong-account attempt. Empty and harmless, but delete it
  while logged into that account if you want it gone —
  `npx wrangler d1 delete disability-wiki-feedback`. Note the names are identical, so
  check `whoami` before running that or you will delete the live one.

## Turning it off

Remove the binding. The endpoint starts returning 503 and the widget says so.
Nothing else breaks, and no reader-facing page depends on it.
