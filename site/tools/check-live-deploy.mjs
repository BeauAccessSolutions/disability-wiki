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
//     Pages build environment would strand installed apps on old content).
//
// Usage: node check-live-deploy.mjs [expected-sha]   (defaults to git HEAD)
//   env: LIVE_URL (default https://disabilitywiki.org), TIMEOUT_MIN (default 8)
import { execSync } from 'node:child_process';
import { createPublicKey, verify } from 'node:crypto';

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
        console.log(
          `✓ live site serves ${isExpected ? 'this commit' : 'a newer deploy'} ` +
            `(${lastSeen}) with a valid OTA signature.`
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
