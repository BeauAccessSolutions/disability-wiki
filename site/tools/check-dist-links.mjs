/*
 * Validate internal links in the BUILT site (dist/), not the markdown.
 *
 * Why this exists: scripts/validate_wiki_links.py reads the source markdown and
 * resolves `/housing/housing-rights.md` to the file, so it passed 764 links that
 * Astro rendered verbatim as `href="/housing/housing-rights.md#…"` — a 404 on the
 * live site (2026-09-23). Only the rendered href is what a reader clicks, so this
 * checks the rendered href:
 *
 *   1. No internal href whose path ends in `.md`.
 *   2. Every internal href lands on a built page (or a `_redirects` / Astro
 *      redirect source).
 *   3. Every `#fragment` on an internal href matches an `id` on the target page
 *      (same-page `#x` included). A dead fragment on a benefits page drops the
 *      reader at the top of a long page instead of the section they need.
 *
 * Run: node tools/check-dist-links.mjs   (after npm run build)
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;
if (!existsSync(join(DIST, 'index.html'))) {
  console.error(`dist/ missing — run \`npm run build\` first (${DIST})`);
  process.exit(2);
}
const ORIGIN = 'https://disabilitywiki.org';

// Routes known to be missing, tracked for a separate fix. Keep this short and
// dated: an entry here is a live 404 someone can click.
const KNOWN_MISSING = new Set();

function* htmlFiles(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === '_astro' || name === 'pagefind') continue;
      yield* htmlFiles(p);
    } else if (name.endsWith('.html')) yield p;
  }
}

// dist/a/b/index.html -> /a/b/ ; dist/404.html -> /404
function pageUrl(file) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel.replace(/\.html$/, '');
}

const decodeEntities = (s) =>
  s.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const safeDecode = (s) => { try { return decodeURIComponent(s); } catch { return s; } };

// Redirect sources: Cloudflare _redirects (exact + trailing /* splats). Astro
// config redirects are emitted as dist pages, so they resolve as pages.
const redirectExact = new Set();
const redirectPrefixes = [];
for (const line of readFileSync(join(DIST, '_redirects'), 'utf8').split('\n')) {
  const src = line.trim().split(/\s+/)[0];
  if (!src || src.startsWith('#')) continue;
  if (src.endsWith('/*')) redirectPrefixes.push(src.slice(0, -1));
  else redirectExact.add(src.replace(/\/$/, '') || '/');
}

// Index every built page: canonical path (no trailing slash) -> Set(ids)
const pages = new Map();
const hrefsByPage = new Map();
for (const file of htmlFiles(DIST)) {
  const html = readFileSync(file, 'utf8');
  const url = pageUrl(file);
  const ids = new Set();
  for (const m of html.matchAll(/\sid="([^"]*)"/g)) ids.add(decodeEntities(m[1]));
  pages.set(url.replace(/\/$/, '') || '/', ids);
  hrefsByPage.set(url, [...html.matchAll(/<a\s[^>]*?href="([^"]*)"/g)].map((m) => decodeEntities(m[1])));
}

const problems = { md: [], missing: [], fragment: [] };
let checked = 0;
for (const [url, hrefs] of hrefsByPage) {
  for (const href of hrefs) {
    if (!href || /^[a-z][a-z0-9+.-]*:/i.test(href) || href.startsWith('//')) continue;
    const resolved = new URL(href, ORIGIN + url);
    if (resolved.origin !== ORIGIN) continue;
    const path = safeDecode(resolved.pathname);
    if (/\.[a-z0-9]+$/i.test(path) && !path.endsWith('.md')) continue; // asset
    checked++;
    const where = `${url} -> ${href}`;
    if (path.endsWith('.md')) { problems.md.push(where); continue; }
    const key = path.replace(/\/$/, '') || '/';
    const ids = pages.get(key);
    if (!ids) {
      if (KNOWN_MISSING.has(key)) continue;
      if (!redirectExact.has(key) && !redirectPrefixes.some((p) => path.startsWith(p))) {
        problems.missing.push(where);
      }
      continue;
    }
    const frag = safeDecode(resolved.hash.slice(1));
    // `#` alone and `#_top` (Starlight's "back to top") are not section anchors.
    if (frag && frag !== '_top' && !ids.has(frag)) problems.fragment.push(where);
  }
}

const labels = {
  md: "internal href ending in '.md' (404 on the live site — drop '.md' in the source link)",
  missing: 'internal href to a route with no built page or redirect',
  fragment: '#fragment with no matching id on the target page',
};
let failed = 0;
for (const [kind, list] of Object.entries(problems)) {
  if (!list.length) { console.log(`  ok   - no ${labels[kind]}`); continue; }
  failed += list.length;
  console.error(`  FAIL - ${list.length} × ${labels[kind]}`);
  for (const w of list.slice(0, 40)) console.error(`         ${w}`);
  if (list.length > 40) console.error(`         … and ${list.length - 40} more`);
}
for (const key of KNOWN_MISSING) {
  if (pages.has(key)) console.log(`  note - ${key} now exists; remove it from KNOWN_MISSING`);
}
console.log(`\n${checked} internal hrefs checked across ${hrefsByPage.size} pages.`);
process.exit(failed ? 1 : 0);
