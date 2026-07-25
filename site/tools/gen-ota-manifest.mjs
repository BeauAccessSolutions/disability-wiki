// Generate dist/ota/manifest.json (+ manifest.sig) after the build — the publish
// side of the app's signed content-update channel (Phase 1B of
// docs/app-remediation-plan.md).
//
// The manifest lists every content file in dist with its sha256. The installed
// app fetches it (with its detached ed25519 signature), verifies the signature
// against the public key compiled into the binary, diffs against its local
// content, downloads only the changed files, verifies each file's sha256 against
// the signed manifest, and atomically swaps its content root. So: a crisis-number
// fix merged to main reaches installed apps on their next check, no App Store
// release, and nothing unsigned can ever be installed.
//
// WHY THE BLOB STORE (schema 2, added 2026-07-25 — read before "simplifying" it):
// the app used to download each file from its real site URL. That cannot work
// through Cloudflare. The edge REWRITES html responses — Email Obfuscation turns
// `mailto:` into `/cdn-cgi/l/email-protection`, Bot Management injects the
// `__CF$cv$params` challenge script — so the bytes a client receives never match
// the sha256 of the file on disk, and EVERY update aborted on its first html
// file. A crisis-number fix is an html change, so the channel could never once
// have delivered the thing it exists to deliver. (It passed its 2026-07-23 E2E
// test because that ran against `wrangler pages dev`, which serves origin bytes
// with none of the edge features on.) Two site files, `_headers` and
// `_redirects`, are also unfetchable — Pages consumes them as config and 404s.
//
// So the payload is published a second time as a content-addressed blob store:
// `dist/ota/blobs/<first2>/<sha256>`, no extension, pinned by `site/public/_headers`
// to `Content-Type: application/octet-stream`. Cloudflare's rewriters are
// content-type-driven and leave non-html alone (the signed manifest.json itself
// is proof: it round-trips byte-exact today). Content-addressing also means an
// unchanged file keeps its URL forever, so blobs are immutable-cacheable and
// Pages re-uploads only the delta. On disk the blobs are hard links, so the
// duplicate tree costs no space; `build-release.sh` drops it from the app bundle,
// which downloads from it rather than shipping it.
//
// Signing: ed25519 over the exact bytes of manifest.json. The private key comes
// from the OTA_SIGNING_KEY env var (base64 PKCS8; a Cloudflare Pages secret in
// production — generate with app/tools/ota-keygen.mjs). When unset (local dev
// builds), the manifest is written WITHOUT a signature and the client will
// refuse it — the safe direction.
//
// Runs after gen-sw.mjs. Excludes dist/ota itself, the alias stubs' parent
// content is fine (they're real files), and nothing else: partial manifests are
// how a "complete" update quietly drops pages.
import {
  readdirSync, statSync, readFileSync, writeFileSync, mkdirSync, rmSync, linkSync, copyFileSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { createHash, createPrivateKey, sign } from 'node:crypto';
import { execSync } from 'node:child_process';

const DIST = new URL('../dist', import.meta.url).pathname;
const OUT = join(DIST, 'ota');
const BLOBS = join(OUT, 'blobs');
/** Where the app fetches blobs from; mirrored by the `/ota/blobs/*` rule in _headers. */
const BLOB_PATH = '/ota/blobs';

/** Walk dist, returning every file path relative to dist (posix separators). */
function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) files.push(...walk(p));
    else files.push(p);
  }
  return files;
}

// A stale blob tree from a previous build would be republished as dead weight,
// and (worse) could serve bytes no current manifest vouches for.
rmSync(BLOBS, { recursive: true, force: true });

const files = {};
const blobbed = new Set();
for (const p of walk(DIST)) {
  const rel = relative(DIST, p).split('\\').join('/');
  if (rel.startsWith('ota/')) continue; // never self-referential
  const buf = readFileSync(p);
  const sha256 = createHash('sha256').update(buf).digest('hex');
  files['/' + rel] = { sha256, size: buf.length };
  // Publish the bytes under their own hash. Identical files share one blob.
  if (!blobbed.has(sha256)) {
    blobbed.add(sha256);
    const dir = join(BLOBS, sha256.slice(0, 2));
    mkdirSync(dir, { recursive: true });
    const dest = join(dir, sha256);
    // Hard link so the second copy of an ~87 MB site costs no disk; Pages
    // uploads it as an ordinary file either way.
    try {
      linkSync(p, dest);
    } catch {
      copyFileSync(p, dest);
    }
  }
}

let gitSha = null;
try {
  gitSha = execSync('git rev-parse HEAD', { cwd: DIST }).toString().trim();
} catch {
  /* shallow or exported checkout — the stamp is advisory; hashes are the contract */
}

const manifest = {
  // 2 = content is fetched from `blobPath`, not from each file's site URL.
  // Clients that predate the blob store must refuse this manifest rather than
  // fall back to path fetches, which the edge silently corrupts.
  schema: 2,
  gitSha,
  builtAt: new Date().toISOString(),
  fileCount: Object.keys(files).length,
  blobPath: BLOB_PATH,
  files,
};

mkdirSync(OUT, { recursive: true });
const manifestBytes = Buffer.from(JSON.stringify(manifest));
writeFileSync(join(OUT, 'manifest.json'), manifestBytes);

const keyB64 = process.env.OTA_SIGNING_KEY;
if (keyB64) {
  const key = createPrivateKey({ key: Buffer.from(keyB64, 'base64'), format: 'der', type: 'pkcs8' });
  // ed25519 signs the raw bytes; the client verifies over the exact fetched
  // bytes BEFORE parsing, so no canonicalization is needed on either side.
  const sig = sign(null, manifestBytes, key);
  writeFileSync(join(OUT, 'manifest.sig'), sig.toString('base64'));
  console.log(`ota: manifest ${manifest.fileCount} files, ${blobbed.size} blobs, SIGNED (${sig.length}-byte ed25519)`);
} else {
  console.log(
    `ota: manifest ${manifest.fileCount} files, ${blobbed.size} blobs, ` +
      'UNSIGNED (no OTA_SIGNING_KEY — clients will refuse)'
  );
}
