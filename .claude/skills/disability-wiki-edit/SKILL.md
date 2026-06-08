---
name: disability-wiki-edit
description: >-
  Read, edit, create, unpublish, or publish pages on the disability-wiki Wiki.js
  site (disabilitywiki.org). Use this whenever the user wants to change live wiki
  content — fix a page, bulk-edit, create, move, unpublish, or delete a page, run
  the GraphQL API, or push changes live. Also when a force-sync fails/conflicts and
  the server git needs recovery. Covers the Wiki.js API recipes, the pull-mode
  edit→commit→sync workflow, the WAF/User-Agent gotcha, the full-field update
  mutation, the never-`git rm`-in-pull-mode rule, SSH sync recovery, Cloudflare-cache
  verification, token handling, and per-page backups. Trigger even if the user
  doesn't say "Wiki.js" — any "fix/edit/update/publish the wiki" request in this
  repo applies.
---

# Disability-Wiki Editing (Operations)

How to change content on **disabilitywiki.org** (Wiki.js 2.5.x). The repo at
`~/projects/disability-wiki` mirrors the wiki; markdown files map to page paths
(`benefits/us/ssi.md` → `/en/benefits/us/ssi`).

## The golden rule: the site is in PULL mode

Wiki.js Git storage is configured **pull**: the markdown in `main` is the source
of truth. Wiki.js pulls `main` every 5 minutes and imports changes. So the normal
way to edit is:

1. Edit the `.md` file in the repo (keep its frontmatter intact).
2. `git add` + commit + `git push origin main` (or via a branch + PR, then merge).
3. **Force-sync** to publish immediately instead of waiting ~5 min (see below).

> Do NOT rely on editing only via the API — in pull mode an API edit can be
> overwritten by the next pull from the repo. The repo is canonical. (Historically
> the site was in *push* mode and Wiki.js force-pushed `main`, clobbering doc
> commits — if you see that again, the fix is to set Git storage to pull.)

## The GraphQL API (for reads, force-sync, and quick targeted edits)

Endpoint: `POST https://disabilitywiki.org/graphql`
Auth: `Authorization: Bearer $WIKIJS_TOKEN`

**Token handling (security):** the token is a long-lived, full-content credential.
Keep it in an env var or a temp file (e.g. `/tmp/wjs.txt`) and **never commit it**
(the project's SECURITY.md is explicit about this). Ask the user for the current
token; it may be rotated. Delete the temp copy when done.

**⚠️ WAF gotcha:** the site's WAF/Cloudflare blocks default script/`curl`/urllib
User-Agents with **HTTP 403**. Always send a normal browser User-Agent header, e.g.
`Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36`.

### List pages (path ↔ id)
```graphql
{ pages { list(orderBy: PATH) { id path title isPublished locale } } }
```

### Read one page
```graphql
query($id:Int!){ pages { single(id:$id){
  path title description content editor isPublished isPrivate locale
  tags{tag} scriptCss scriptJs createdAt updatedAt } } }
```

### Update a page — ⚠️ must resend ALL fields or they get cleared
```graphql
mutation($id:Int!,$content:String!,$description:String!,$editor:String!,
  $isPublished:Boolean!,$isPrivate:Boolean!,$locale:String!,$path:String!,
  $tags:[String]!,$title:String!,$scriptCss:String,$scriptJs:String){
  pages{ update(id:$id,content:$content,description:$description,editor:$editor,
    isPublished:$isPublished,isPrivate:$isPrivate,locale:$locale,path:$path,
    tags:$tags,title:$title,scriptCss:$scriptCss,scriptJs:$scriptJs){
    responseResult{ succeeded errorCode message } }}}
```
Fetch the page first, then re-send every field with only `content` (or `isPublished`,
etc.) changed. Omitting `description`/`tags`/`editor` blanks them.

### Unpublish (e.g. accidentally-public internal pages)
Same `update` mutation with `isPublished: false`.

### Move/rename a page
```graphql
mutation($id:Int!,$path:String!,$locale:String!){
  pages{ move(id:$id,destinationPath:$path,destinationLocale:$locale){
    responseResult{ succeeded message } }}}
```
Moving leaves the old path 404 — check for inbound links first.

### Delete a page — ⚠️ use the API, NEVER `git rm` in pull mode
```graphql
mutation($id:Int!){ pages { delete(id:$id){ responseResult{ succeeded errorCode message } } } }
```
**Do NOT remove a live page by deleting its `.md` and pushing.** In pull mode Wiki.js
re-writes and *locally commits* each page's `.md` on every API edit ("Administrator"
commits). A `git rm` on GitHub then collides with those local modify commits →
**modify/delete rebase conflict** that wedges the server's clone and breaks the whole
sync pipeline (see recovery below). To remove a page:
- **Unpublish** (hide, reversible): the `update` mutation with `isPublished:false`. A
  *modify*, so its write-back rebases cleanly — always safe.
- **Delete** (purge from DB): `pages.delete(id)` — removes the DB row *first*, then
  `git rm`s the local file. If the file is already gone it returns a scary
  `fatal: pathspec … did not match` — **harmless; the DB row is already deleted.**
  Confirm with `pages{list}`.
- Frontmatter `published:false` in the repo does **NOT** propagate to the DB on pull
  (observed). Publish-state lives in the DB; change it via API.
- The whole repo syncs to the wiki, so non-content paths (`.claude/`, `docs/`,
  root `AUDIT_*`/`README`) get published as pages unless removed/unpublished.

### Force a Git pull (publish repo changes immediately)
```graphql
mutation { storage { executeAction(targetKey:"git", handler:"sync"){
  responseResult{ succeeded message } }}}
```
Run this right after `git push origin main` to publish in seconds. (Storage target
key is `git`; available actions are `sync` = Force Sync, `syncUntracked`, `importAll`.)

If a sync returns `succeeded:false` with a CONFLICT / `unresolved conflict` message,
the server's clone is wedged mid-rebase (almost always from a `git rm` colliding with
local write-back commits — see Delete above). The handlers can't fix it; recover over SSH.

### Recover a wedged server-side git sync (needs SSH)
SSH host alias **`cripchronicle`** → the DigitalOcean droplet (key in `~/.ssh`).
Containers `wiki_wiki_1` / `wiki_db_1`. The Wiki.js git clone is at
**`/wiki/wiki/data/repo`** inside the container (storage config `localRepoPath:
wiki/data/repo`, relative to workdir `/wiki`). Abort the rebase and realign with GitHub:
```bash
ssh cripchronicle 'docker exec wiki_wiki_1 sh -c \
  "cd /wiki/wiki/data/repo && git rebase --abort 2>/dev/null; \
   git fetch origin && git reset --hard origin/main"'
```
The discarded local "Administrator" commits are just Wiki.js write-backs already
reflected in the DB — nothing is lost. Then force-sync via the API to confirm green.

**⚠️ Cloudflare caches rendered HTML.** After a sync the DB/repo can be correct while
the live page still shows the old version — and a `?v=` query param does NOT bust
Cloudflare's cache. **Verify changes via the API** (`pages{single{content}}`), not a
`curl` of the page; the page catches up on cache-TTL expiry.

## Creating a new page

Write a new `.md` at the target path with frontmatter:
```yaml
---
title: Page Title
description: One-line meta description.
published: true
date: 2026-06-07T00:00:00.000Z
tags:
editor: markdown
dateCreated: 2026-06-07T00:00:00.000Z
---
```
Commit to `main` + force-sync. (Scripts can't call `Date.now()` here — hardcode the
date string.) For house style/structure of the body, use the
**disability-wiki-page** skill.

## Backups (do this before any bulk/risky edit)

Before editing pages via API, fetch and save each page's full JSON to
`backups/<batch-name>/` (gitignored). This lets you diff against originals and roll
back via `pages.update`. Name files by id+path, e.g. `CORR_429_foundations__disability-models.json`.

## Recovering a page missing from the repo

If a page exists in the Wiki.js DB but not as a repo file (e.g. a stub points to a
canonical page that isn't in `main`), export it from the DB: read it via the API,
rebuild the frontmatter + content, and write the `.md`. Then commit so repo and DB match.

## Multilingual

Spanish pages live under `es/` (e.g. `es/benefits/us/ssi.md`). **When you fix an
English page, its `es/` counterpart goes stale** — flag it or use the
**spanish-wiki-translation** skill to re-sync. Crisis-page `es/` versions are
life-safety priority.

## Quick checklist for any edit
- [ ] Browser User-Agent on every API call (avoid 403)
- [ ] Read the page first; preserve frontmatter; resend all fields on update
- [ ] Backup before bulk edits
- [ ] Verify internal links resolve (see disability-wiki-page)
- [ ] Commit to `main` (or branch+PR), then force-sync
- [ ] To remove a page: API `pages.delete`/unpublish — NEVER `git rm` (wedges the sync)
- [ ] Verify via API (`pages{single{content}}`), not curl — Cloudflare caches the HTML
- [ ] Token never committed; temp copy deleted after
- [ ] If you changed an English page, note the `es/` sync need
