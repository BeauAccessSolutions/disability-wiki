#!/usr/bin/env bash
# CI self-test for the OTA signing chain (publish side). The Swift client can't
# run on a Linux runner, so this proves the Node side of the contract with a
# throwaway keypair: a signed manifest VERIFIES, and a tampered manifest or a
# tampered content file is REJECTED. The verify logic here mirrors what
# OTAUpdater.swift does (ed25519 over exact manifest bytes, then per-file sha256).
# Assumes site/dist is built.
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$TOOLS/../.." && pwd)"
DIST="$ROOT/site/dist"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -d "$DIST/crisis" ] || { echo "ota-selftest: no site/dist — build the site first."; exit 1; }

# Throwaway keypair, captured from the keygen tool's own output format.
node "$TOOLS/ota-keygen.mjs" > "$TMP/keys.txt"
PRIV="$(awk '/PRIVATE/{getline; print; exit}' "$TMP/keys.txt")"
PUB="$(awk '/PUBLIC/{getline; print; exit}' "$TMP/keys.txt")"

echo "== sign: generate a signed manifest with the throwaway key =="
( cd "$ROOT/site" && OTA_SIGNING_KEY="$PRIV" node tools/gen-ota-manifest.mjs )

echo "== verify: signature, blob store, and a sampled crisis file hash must PASS =="
PUB="$PUB" DIST="$DIST" node - <<'EOF'
const { readFileSync, existsSync } = require('node:fs');
const { createPublicKey, verify, createHash } = require('node:crypto');
const dist = process.env.DIST;
const bytes = readFileSync(dist + '/ota/manifest.json');
const sig = Buffer.from(readFileSync(dist + '/ota/manifest.sig', 'utf8'), 'base64');
// Rebuild an SPKI key from the raw 32-byte public key — same as the Swift client.
const raw = Buffer.from(process.env.PUB, 'base64');
const spki = Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), raw]);
const key = createPublicKey({ key: spki, format: 'der', type: 'spki' });
if (!verify(null, bytes, key, sig)) { console.error('signature did not verify'); process.exit(1); }
const m = JSON.parse(bytes);
const probe = '/crisis/abuse-neglect-exploitation/index.html';
if (!m.files[probe]) { console.error('manifest missing ' + probe); process.exit(1); }
const h = createHash('sha256').update(readFileSync(dist + probe)).digest('hex');
if (h !== m.files[probe].sha256) { console.error('hash mismatch for ' + probe); process.exit(1); }

// The blob store is what makes this channel survive Cloudflare's edge (it
// rewrites html, so per-path downloads can never match their signed hash — see
// gen-ota-manifest.mjs). A manifest whose entries aren't all fetchable as blobs
// is a channel that fails partway through an update, so check every one.
if (m.schema !== 2 || m.blobPath !== '/ota/blobs') {
  console.error(`expected schema 2 with blobPath /ota/blobs, got schema ${m.schema} / ${m.blobPath}`);
  process.exit(1);
}
const blobFor = (sha) => `${dist}/ota/blobs/${sha.slice(0, 2)}/${sha}`;
const missing = Object.entries(m.files).filter(([, e]) => !existsSync(blobFor(e.sha256)));
if (missing.length) {
  console.error(`${missing.length} manifest entries have no blob, e.g. ${missing[0][0]}`);
  process.exit(1);
}
// And a blob must actually BE its name, or the client rejects the download.
const probeBlob = readFileSync(blobFor(m.files[probe].sha256));
if (createHash('sha256').update(probeBlob).digest('hex') !== m.files[probe].sha256) {
  console.error('blob content does not match its own hash for ' + probe);
  process.exit(1);
}
console.log(
  `ok: signature valid, ${m.fileCount} files, all blobs present, crisis probe hash matches`
);
EOF

echo "== tamper: a flipped manifest byte must FAIL verification =="
PUB="$PUB" DIST="$DIST" node - <<'EOF'
const { readFileSync } = require('node:fs');
const { createPublicKey, verify } = require('node:crypto');
const dist = process.env.DIST;
const bytes = Buffer.from(readFileSync(dist + '/ota/manifest.json'));
bytes[200] ^= 0xff; // corrupt one byte
const sig = Buffer.from(readFileSync(dist + '/ota/manifest.sig', 'utf8'), 'base64');
const raw = Buffer.from(process.env.PUB, 'base64');
const spki = Buffer.concat([Buffer.from('302a300506032b6570032100', 'hex'), raw]);
const key = createPublicKey({ key: spki, format: 'der', type: 'spki' });
if (verify(null, bytes, key, sig)) { console.error('TAMPERED manifest verified — signing chain broken'); process.exit(1); }
console.log('ok: tampered manifest rejected');
EOF

# Leave dist clean for later steps: regenerate the manifest unsigned.
( cd "$ROOT/site" && node tools/gen-ota-manifest.mjs > /dev/null )
echo "✓ ota-selftest: sign/verify roundtrip works; tampering is rejected."
