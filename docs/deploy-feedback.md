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

```bash
npx wrangler d1 create disability-wiki-feedback
```

Note the returned `database_id`, then create the table:

```bash
npx wrangler d1 execute disability-wiki-feedback --remote --file=site/schema/page_feedback.sql
```

Then bind it in the Pages project — **Settings → Functions → D1 database bindings**,
for both Production and Preview:

| Variable name | Database |
|---|---|
| `PAGE_FEEDBACK` | `disability-wiki-feedback` |

The binding name is what `functions/api/feedback.ts` reads as `env.PAGE_FEEDBACK`.
Getting it wrong is not silent: the endpoint 503s.

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

## Turning it off

Remove the binding. The endpoint starts returning 503 and the widget says so.
Nothing else breaks, and no reader-facing page depends on it.
