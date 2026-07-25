// Post-merge tripwire: did this merge actually reach the live site?
//
// Exists because the GitHub→Cloudflare Pages trigger died SILENTLY around
// 2026-07-19 and nothing noticed for 4 days — crisis-content fixes sat merged
// but unpublished while everyone believed "publishing = merge to main"
// (docs/INCIDENT_RESPONSE.md assumes it; this makes it enforceable). A dead
// deploy hook must be a red X on the merge, not a discovery weeks later.
//
// Probe: the OTA manifest the site build emits (/ota/manifest.json) carries the
// git SHA it was built from, and its ed25519 signature proves the deploy came
// from a signing-capable build. PASS when, within the window:
//   - live gitSha == the SHA this run is verifying, OR a NEWER deploy landed
//     (manifest built after this run started — rapid merges supersede each
//     other; publishing itself is proven either way), AND
//   - the manifest signature verifies against the app's pinned public key
//     (catches "deployed but unsigned": OTA_SIGNING_KEY missing from the
//     Pages build environment would strand installed apps on old content), AND
//   - a sample of crisis pages actually downloads from the blob store with
//     bytes matching their signed hashes. A green signature is not a working
//     channel: for two days this probe passed while no installed app could
//     apply an update, because the edge rewrites html (see app/README.md).
//
// Usage: node check-live-deploy.mjs [expected-sha]   (defaults to git HEAD)
//        node check-live-deploy.mjs --channel-only    (no polling, no SHA match:
//          just "can an installed app apply an update from here, right now?" —
//          the health check to run when someone reports stale in-app content)
//   env: LIVE_URL (default https://disabilitywiki.org), TIMEOUT_MIN (default 8)
import { execSync } from 'node:child_process';
import { createPublicKey, verify, createHash } from 'node:crypto';

const LIVE = process.env.LIVE_URL || 'https://disabilitywiki.org';
const TIMEOUT_MIN = Number(process.env.TIMEOUT_MIN || 8);
const expected =
  process.argv[2] || execSync('git rev-parse HEAD').toString().trim();

// Same raw ed25519 public key that is compiled into the iOS app (OTAUpdater.swift).
const PUB_B64 = 'FJ3cdXKy8s/zSH83UtiEkF/Us5UYyiLN0rGhqngepGw=';
const spki = Buffer.concat([
  Buffer.from('302a300506032b6570032100', 'hex'),
  Buffer.from(PUB_B64, 'base64'),
]);
const pubKey = createPublicKey({ key: spki, format: 'der', type: 'spki' });

const started = Date.now();
const deadline = started + TIMEOUT_MIN * 60_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Fetch a sample of files the way the iOS client does — from the content-addressed
 * blob store — and confirm each one's bytes hash to the name it was fetched under.
 * Returns a failure string, or null when the channel is sound.
 *
 * Crisis pages are html, which is exactly what the edge rewrites, so they are the
 * sample that matters; `_headers` is included because it 404s at its site path and
 * is only reachable as a blob.
 */
async function checkBlobStore(manifest) {
  if (manifest.schema !== 2 || !manifest.blobPath) {
    return `manifest is schema ${manifest.schema} with no blobPath (publish side is stale)`;
  }
  const crisis = Object.keys(manifest.files)
    .filter((p) => p.startsWith('/crisis/') && p.endsWith('/index.html'))
    .sort()
    .slice(0, 3);
  const sample = [...crisis, '/_headers', '/index.html'].filter((p) => manifest.files[p]);
  if (!crisis.length) return 'manifest lists no crisis pages';

  for (const path of sample) {
    const { sha256 } = manifest.files[path];
    const url = `${LIVE}${manifest.blobPath}/${sha256.slice(0, 2)}/${sha256}`;
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) return `blob for ${path} returned HTTP ${res.status} (${url})`;
    const got = createHash('sha256').update(Buffer.from(await res.arrayBuffer())).digest('hex');
    if (got !== sha256) {
      return (
        `blob for ${path} does not match its signed hash — something between the ` +
        `build and the edge is altering bytes (${got.slice(0, 12)}… vs ${sha256.slice(0, 12)}…)`
      );
    }
  }
  return null;
}

if (process.argv.includes('--channel-only')) {
  const res = await fetch(`${LIVE}/ota/manifest.json`, { cache: 'no-store' });
  if (!res.ok) {
    console.error(`✗ ${LIVE}/ota/manifest.json returned HTTP ${res.status}.`);
    process.exit(1);
  }
  const manifest = JSON.parse(Buffer.from(await res.arrayBuffer()));
  const failure = await checkBlobStore(manifest);
  if (failure) {
    console.error(`✗ OTA content channel broken at ${LIVE}: ${failure}`);
    process.exit(1);
  }
  console.log(
    `✓ OTA content channel healthy at ${LIVE} — schema ${manifest.schema}, ` +
      `${manifest.fileCount} files, sampled blobs hash correctly ` +
      `(gitSha ${String(manifest.gitSha).slice(0, 8)}, built ${manifest.builtAt}).`
  );
  process.exit(0);
}

let lastSeen = 'nothing (manifest 404)';
while (Date.now() < deadline) {
  try {
    const res = await fetch(`${LIVE}/ota/manifest.json`, { cache: 'no-store' });
    if (res.ok) {
      const bytes = Buffer.from(await res.arrayBuffer());
      const manifest = JSON.parse(bytes);
      lastSeen = `gitSha ${String(manifest.gitSha).slice(0, 8)} built ${manifest.builtAt}`;

      const isExpected = manifest.gitSha === expected;
      const isNewer = new Date(manifest.builtAt).getTime() > started;
      if (isExpected || isNewer) {
        const sigRes = await fetch(`${LIVE}/ota/manifest.sig`, { cache: 'no-store' });
        const sig = sigRes.ok
          ? Buffer.from((await sigRes.text()).trim(), 'base64')
          : null;
        if (!sig || !verify(null, bytes, pubKey, sig)) {
          console.error(
            `✗ live deploy found (${lastSeen}) but the OTA manifest is UNSIGNED or the ` +
              `signature is invalid. Installed apps will refuse it. Check that ` +
              `OTA_SIGNING_KEY is set in the Cloudflare Pages build environment.`
          );
          process.exit(1);
        }
        // A signed manifest is not the same as a WORKING update channel. Until
        // 2026-07-25 this probe went green every deploy while installed apps
        // could not apply a single update: Cloudflare rewrites html at the edge,
        // so files fetched by their site path never matched the signed hash.
        // Prove the app's actual download path end to end, from production —
        // the only surface where the edge features are on (a *.pages.dev
        // preview and `wrangler pages dev` both serve unrewritten origin bytes).
        const failure = await checkBlobStore(manifest);
        if (failure) {
          console.error(
            `✗ live deploy found (${lastSeen}) with a valid signature, but the OTA\n` +
              `  content channel is broken: ${failure}\n` +
              `  Installed apps cannot apply updates — a crisis-number fix would not\n` +
              `  reach them. See "Why blobs" in app/README.md.`
          );
          process.exit(1);
        }
        console.log(
          `✓ live site serves ${isExpected ? 'this commit' : 'a newer deploy'} ` +
            `(${lastSeen}) with a valid OTA signature and a fetchable blob store.`
        );
        process.exit(0);
      }
    }
  } catch {
    /* transient network error — keep polling */
  }
  await sleep(30_000);
}

console.error(
  `✗ after ${TIMEOUT_MIN} min the live site still serves ${lastSeen}, not ${expected.slice(0, 8)}.\n` +
    `  The merge did NOT publish. Check the Cloudflare Pages Git integration\n` +
    `  (dashboard → Pages → disability-wiki → Settings → Builds & deployments);\n` +
    `  a manual rescue deploy is: wrangler pages deploy site/dist --project-name disability-wiki --branch main\n` +
    `  (see docs/INCIDENT_RESPONSE.md).`
);
process.exit(1);
