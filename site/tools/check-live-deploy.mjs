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

// Validate argv rather than treating whatever arrives as a commit SHA. An older
// copy of this script (or a typo'd flag) used to swallow `--channel-only` as the
// SHA to wait for, then poll for the full timeout and report "not --channe" —
// eight minutes to say "you are running the wrong file".
const CHANNEL_ONLY = '--channel-only';
const args = process.argv.slice(2);
const unknown = args.filter((a) => a !== CHANNEL_ONLY && !/^[0-9a-f]{7,40}$/i.test(a));
if (unknown.length) {
  console.error(
    `✗ unrecognized argument: ${unknown.join(' ')}\n` +
      `  usage: node check-live-deploy.mjs [full-commit-sha]   (poll until deployed)\n` +
      `         node check-live-deploy.mjs ${CHANNEL_ONLY}      (is the channel healthy now?)\n` +
      `  If you expected ${CHANNEL_ONLY} to work, this checkout predates it — it landed in PR #71.`
  );
  process.exit(2);
}
const expected =
  args.find((a) => a !== CHANNEL_ONLY) || execSync('git rev-parse HEAD').toString().trim();

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

// Say what we are doing before going quiet for up to TIMEOUT_MIN. Run interactively
// from a feature branch, the SHA being waited for is one production will never serve,
// and a silent 8-minute poll is indistinguishable from a hung process.
console.log(
  `Waiting up to ${TIMEOUT_MIN} min for ${LIVE} to serve ${expected.slice(0, 8)} ` +
    `(or any newer deploy). For "is the channel healthy right now?", use --channel-only.`
);

let lastSeen = 'nothing (manifest 404)';
let lastChannelFailure = null;
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
          // A new manifest does NOT mean the deployment finished propagating.
          // Pages serves a deployment's assets per-PoP, so for a short window the
          // manifest is live while a blob it references still 404s at the edge you
          // happen to hit — observed 2026-07-27, where the blob returned 200 moments
          // later and the channel was healthy. Failing on the first miss makes this
          // job flaky, and a blocking check that cries wolf trains people to ignore
          // it, which is the exact failure this job exists to prevent. So keep
          // retrying inside the budget and only report at the deadline.
          lastChannelFailure = failure;
          console.log(`  … deploy is live but ${failure} — retrying, may still be propagating`);
        } else {
          console.log(
            `✓ live site serves ${isExpected ? 'this commit' : 'a newer deploy'} ` +
              `(${lastSeen}) with a valid OTA signature and a fetchable blob store.`
          );
          process.exit(0);
        }
      }
    }
  } catch {
    /* transient network error — keep polling */
  }
  const left = Math.ceil((deadline - Date.now()) / 60_000);
  console.log(`  … still serving ${lastSeen} (${left} min left)`);
  await sleep(30_000);
}

if (lastChannelFailure) {
  console.error(
    `✗ the deploy published (${lastSeen}) but after ${TIMEOUT_MIN} min the OTA content channel\n` +
      `  still fails: ${lastChannelFailure}\n` +
      `  This is no longer propagation delay. Installed apps cannot apply updates — a\n` +
      `  crisis-number fix would not reach them. See "Why blobs" in app/README.md.`
  );
  process.exit(1);
}

console.error(
  `✗ after ${TIMEOUT_MIN} min the live site still serves ${lastSeen}, not ${expected.slice(0, 8)}.\n` +
    `  The merge did NOT publish. Check the Cloudflare Pages Git integration\n` +
    `  (dashboard → Pages → disability-wiki → Settings → Builds & deployments);\n` +
    `  a manual rescue deploy is: wrangler pages deploy site/dist --project-name disability-wiki --branch main\n` +
    `  (see docs/INCIDENT_RESPONSE.md).`
);
process.exit(1);
