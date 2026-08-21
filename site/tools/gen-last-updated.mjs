#!/usr/bin/env node
/**
 * Generate site/src/generated/last-updated.json: last git commit date per content page.
 *
 * WHY THIS EXISTS. Starlight's `lastUpdated: true` computes dates with ONE
 * `git log --name-status -- src/content/docs`. Our content lives behind
 * directory symlinks (src/content/docs/benefits -> ../../../../benefits), so
 * git never lists those files under that prefix: no date renders anywhere.
 * The few individually-symlinked root files get the SYMLINK's commit date.
 * Separately, Cloudflare Pages builds from a shallow clone, where every file's
 * "last commit" is HEAD, so every page would claim today's date on every deploy.
 *
 * This script fixes both: it resolves real paths and runs the git log against
 * them, and if the clone is shallow it tries to unshallow first. If history is
 * still unavailable it writes an EMPTY map and the LastUpdated component
 * renders nothing. A missing date is honest; a wrong date is not.
 *
 * Runs before `astro build` (see package.json). Output is gitignored.
 */
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const siteRoot = resolve(here, '..');
const docsDir = resolve(siteRoot, 'src/content/docs');
const outFile = resolve(siteRoot, 'src/generated/last-updated.json');

function git(args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf-8', maxBuffer: 64 * 1024 * 1024 });
  return r.status === 0 ? r.stdout : null;
}

const repoRootRaw = git(['rev-parse', '--show-toplevel'], siteRoot);
if (!repoRootRaw) {
  console.warn('last-updated: not a git checkout; writing empty map');
  writeOut({});
  process.exit(0);
}
const repoRoot = realpathSync(repoRootRaw.trim());

// Shallow clone? Try to unshallow (public repo: anonymous fetch works). Fail closed.
if ((git(['rev-parse', '--is-shallow-repository'], repoRoot) || '').trim() === 'true') {
  console.warn('last-updated: shallow clone detected, attempting `git fetch --unshallow`…');
  spawnSync('git', ['fetch', '--unshallow', '--quiet'], { cwd: repoRoot, encoding: 'utf-8', timeout: 120_000 });
  if ((git(['rev-parse', '--is-shallow-repository'], repoRoot) || '').trim() === 'true') {
    console.warn('last-updated: still shallow; writing empty map (no dates will render — never a wrong one)');
    writeOut({});
    process.exit(0);
  }
  console.warn('last-updated: unshallowed successfully');
}

// Resolve every entry under docs/ to its real path. Keys are paths RELATIVE TO
// docs/ (what Starlight's entry.filePath yields); values are real repo paths.
const roots = new Map(); // docsRelative -> repoRelative real path
for (const name of readdirSync(docsDir)) {
  const real = realpathSync(join(docsDir, name));
  roots.set(name, relative(repoRoot, real));
}

// One git log over all real roots, newest first; first sighting of a path wins.
const log = git(['log', '--format=t:%ct', '--name-status', '--', ...new Set(roots.values())], repoRoot) || '';
const byRealPath = new Map();
let stamp = null;
for (const line of log.split('\n')) {
  if (line.startsWith('t:')) { stamp = Number(line.slice(2)) * 1000; continue; }
  if (!line || stamp === null) continue;
  // "<status>\t<path>" or "R<n>\t<old>\t<new>": the LAST tab field is the current path
  const parts = line.split('\t');
  const p = parts[parts.length - 1];
  if (p && !byRealPath.has(p)) byRealPath.set(p, stamp);
}

// Re-key by docs-relative path so the component can look up entry.filePath.
const out = {};
for (const [docsName, repoRel] of roots) {
  for (const [realPath, ms] of byRealPath) {
    if (realPath === repoRel) { out[docsName] = ms; continue; }
    if (realPath.startsWith(repoRel + '/')) out[docsName + realPath.slice(repoRel.length)] = ms;
  }
}
writeOut(out);
console.log(`last-updated: ${Object.keys(out).length} pages dated from git history`);

function writeOut(map) {
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, JSON.stringify(map));
}
