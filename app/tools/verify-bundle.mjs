// Gate between a built site and an iOS archive — the tripwire that makes the app
// bundle impossible to ship stale.
//
// The bundle (app/ios/App/App/public) is a git-IGNORED copy of site/dist that
// `cap copy` makes. Nothing else guarantees it matches the current build: a
// content merge landed AFTER the last manual sync silently diverges it. That is
// not hypothetical — it is exactly how the abuse hub once shipped in the bundle
// with ZERO hotline numbers while the live page carried nine (the deleted
// abuse-resources orphan survived only in the stale bundle).
//
// Every check hard-fails (exit 1). Run it after `cap copy ios` and before any
// archive; the Xcode "Verify bundle" build phase runs it too, because CI can't
// see a git-ignored bundle that only exists on the build machine.
//
// Usage:
//   node app/tools/verify-bundle.mjs
//   node app/tools/verify-bundle.mjs --dist <path> --bundle <path>   (CI self-test)
//   node app/tools/verify-bundle.mjs --no-stamp                      (skip freshness)

import { readdirSync, statSync, readFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { execSync } from 'node:child_process';

const here = new URL('.', import.meta.url).pathname;
const arg = (name, def) => {
  const i = process.argv.indexOf(name);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : def;
};
const DIST = arg('--dist', join(here, '..', '..', 'site', 'dist'));
const BUNDLE = arg('--bundle', join(here, '..', 'ios', 'App', 'App', 'public'));
const CHECK_STAMP = !process.argv.includes('--no-stamp');

// The subtrees whose integrity is life-safety-critical. Crisis pages are the
// reason the app exists; a stale number here is the failure mode we are guarding.
const CRITICAL = ['crisis', join('es', 'crisis')];

const problems = [];
const fail = (msg) => problems.push(msg);

// ---- Walk a subtree into { relativePath -> sha256 } ------------------------
function hashTree(root, sub) {
  const base = join(root, sub);
  const out = new Map();
  if (!existsSync(base)) return out; // absence is caught by the parity check
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else out.set(relative(base, p), createHash('sha256').update(readFileSync(p)).digest('hex'));
    }
  };
  walk(base);
  return out;
}

// ---- 1. Freshness: the stamp's gitSha must equal HEAD ----------------------
if (CHECK_STAMP) {
  const stampPath = join(BUNDLE, 'app-build.json');
  if (!existsSync(stampPath)) {
    fail(`freshness: no app-build.json in the bundle — it was never stamped by build-release.sh.`);
  } else {
    let head = null;
    try {
      head = execSync('git rev-parse HEAD', { cwd: here }).toString().trim();
    } catch {
      /* not a git checkout (shouldn't happen in the release flow) */
    }
    const stamp = JSON.parse(readFileSync(stampPath, 'utf8'));
    if (head && stamp.gitSha !== head) {
      fail(
        `freshness: bundle was synced at ${stamp.gitSha?.slice(0, 8)} but HEAD is ` +
          `${head.slice(0, 8)}. Re-run the sync — the bundle predates the current content.`
      );
    }
  }
}

// ---- 2. Crisis parity: dist ⊆ bundle, byte-identical, no orphans -----------
for (const sub of CRITICAL) {
  const dist = hashTree(DIST, sub);
  const bundle = hashTree(BUNDLE, sub);
  if (dist.size === 0) {
    fail(`parity: no ${sub}/ in the built site (${DIST}) — build the site first.`);
    continue;
  }
  for (const [rel, hash] of dist) {
    if (!bundle.has(rel)) fail(`parity: ${sub}/${rel} is in the build but MISSING from the bundle.`);
    else if (bundle.get(rel) !== hash) fail(`parity: ${sub}/${rel} differs — bundle is a stale copy.`);
  }
  for (const rel of bundle.keys()) {
    if (!dist.has(rel)) fail(`orphan: ${sub}/${rel} is in the bundle but no longer in the build (delete + re-sync).`);
  }
}

// ---- 3. Phone census: a human-readable backstop that names the page --------
// Parity(hash) already covers this, but when it trips this says WHICH numbers
// went missing from WHICH page — the message a life-safety reviewer needs.
// Must be text-aware, not tel:-only: the abuse hub (the canonical failure) renders
// its hotline numbers as plain text, so a tel:-href census would miss it entirely.
const digits = (s) => s.replace(/\D/g, '');
const PHONE_RE =
  /href="tel:([^"]+)"|(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}|\b(?:988|911|711|741741|88788|233733|686868)\b/g;
function dialable(file) {
  if (!existsSync(file)) return [];
  const nums = new Set();
  for (const m of readFileSync(file, 'utf8').matchAll(PHONE_RE)) nums.add(digits(m[1] ?? m[0]));
  return [...nums].filter(Boolean).sort();
}

function crisisPages(root, sub) {
  const base = join(root, sub);
  const pages = [];
  if (!existsSync(base)) return pages;
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      if (name === 'index') continue; // gen-index-redirects alias stubs
      const p = join(dir, name);
      if (statSync(p).isDirectory()) walk(p);
      else if (name === 'index.html') pages.push(relative(base, dir) || '.');
    }
  };
  walk(base);
  return pages;
}

for (const sub of CRITICAL) {
  for (const page of crisisPages(DIST, sub)) {
    const distTel = dialable(join(DIST, sub, page, 'index.html'));
    const bundleTel = dialable(join(BUNDLE, sub, page, 'index.html'));
    if (distTel.join('|') !== bundleTel.join('|')) {
      const gone = distTel.filter((n) => !bundleTel.includes(n));
      fail(
        `census: ${sub}/${page} — dialable numbers differ` +
          (gone.length ? ` (bundle is MISSING ${gone.join(', ')})` : '') +
          `.\n        build : [${distTel.join(', ') || 'none'}]\n` +
          `        bundle: [${bundleTel.join(', ') || 'none'}]`
      );
    }
  }
}

// ---- 4. Contribute safety: no in-app form that dead-ends -------------------
// The web form POSTs to a relative /api/contributions Pages Function. In the app
// that resolves to capacitor://localhost/api/contributions, which the router
// 404s — a full navigation that eats the user's draft. build-release.sh rewrites
// the bundled page into a hand-off to the live site; this asserts it stuck.
const contribute = join(BUNDLE, 'contribute', 'index.html');
if (existsSync(contribute)) {
  const html = readFileSync(contribute, 'utf8');
  if (/action="\/api\//.test(html)) {
    fail(`contribute: bundled /contribute still POSTs to a relative /api/ endpoint — it will 404 in-app and lose the draft.`);
  }
}

// ---- Report ----------------------------------------------------------------
if (problems.length) {
  console.error(`\n✗ verify-bundle: ${problems.length} problem(s) — this bundle is NOT safe to archive.\n`);
  for (const p of problems) console.error('  • ' + p);
  console.error('\nFix: run app/tools/build-release.sh, which builds → syncs → stamps → re-verifies.\n');
  process.exit(1);
}
console.log('✓ verify-bundle: crisis parity, phone census, freshness, and contribute-safety all pass.');
