// Generate dist/ota/manifest.json (+ manifest.sig) after the build — the publish
// side of the app's signed content-update channel (Phase 1B of
// docs/app-remediation-plan.md).
//
// The manifest lists every content file in dist with its sha256. The installed
// app fetches it (with its detached ed25519 signature), verifies the signature
// against the public key compiled into the binary, diffs against its local
// content, downloads only the changed files FROM THE SITE ITSELF (a static host:
// every listed path is a real URL), verifies each file's sha256 against the
// signed manifest, and atomically swaps its content root. So: a crisis-number
// fix merged to main reaches installed apps on their next check, no App Store
// release, and nothing unsigned can ever be installed.
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
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join, relative } from 'node:path';
import { createHash, createPrivateKey, sign } from 'node:crypto';
import { execSync } from 'node:child_process';

const DIST = new URL('../dist', import.meta.url).pathname;
const OUT = join(DIST, 'ota');

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

const files = {};
for (const p of walk(DIST)) {
  const rel = relative(DIST, p).split('\\').join('/');
  if (rel.startsWith('ota/')) continue; // never self-referential
  const buf = readFileSync(p);
  files['/' + rel] = { sha256: createHash('sha256').update(buf).digest('hex'), size: buf.length };
}

let gitSha = null;
try {
  gitSha = execSync('git rev-parse HEAD', { cwd: DIST }).toString().trim();
} catch {
  /* shallow or exported checkout — the stamp is advisory; hashes are the contract */
}

const manifest = {
  schema: 1,
  gitSha,
  builtAt: new Date().toISOString(),
  fileCount: Object.keys(files).length,
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
  console.log(`ota: manifest ${manifest.fileCount} files, SIGNED (${sig.length}-byte ed25519)`);
} else {
  console.log(`ota: manifest ${manifest.fileCount} files, UNSIGNED (no OTA_SIGNING_KEY — clients will refuse)`);
}
