#!/usr/bin/env bash
# CI self-test for verify-bundle. The real bundle is git-ignored and only exists
# on a build machine, so CI can't verify an actual archive — but it CAN prove the
# tripwire still works: that it passes a faithful sync and REJECTS a tampered one.
# Without this, verify-bundle could rot (a broken regex, an always-pass bug) and
# no one would know until a stale bundle shipped. Assumes site/dist is built.
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$TOOLS/../.." && pwd)"
DIST="$ROOT/site/dist"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

[ -d "$DIST/crisis" ] || { echo "self-test: no site/dist/crisis — build the site first."; exit 1; }

# Faithful sync: mirror what build-release.sh does, into a temp dir. Since
# 2026-07-26 that is just a copy — the contribute page carries its own native gate
# instead of being rewritten after the copy, so the bundle is byte-identical to
# dist (which is what lets the OTA channel address it by hash).
sync_fresh() {
  rm -rf "$TMP/public"
  cp -R "$DIST" "$TMP/public"
  printf '{ "gitSha": "%s", "builtAt": "selftest" }\n' "$(git -C "$ROOT" rev-parse HEAD)" > "$TMP/public/app-build.json"
}
sync_fresh

echo "== positive: a faithful sync must PASS =="
node "$TOOLS/verify-bundle.mjs" --dist "$DIST" --bundle "$TMP/public"

echo "== negative: a tampered crisis page must FAIL (the P0 regression) =="
# Strip the abuse hub's numbers — exactly the failure that shipped a hotline-free
# abuse page. verify-bundle must exit non-zero.
perl -0pi -e 's/[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}//g' "$TMP/public/crisis/abuse-neglect-exploitation/index.html"
if node "$TOOLS/verify-bundle.mjs" --dist "$DIST" --bundle "$TMP/public" >/dev/null 2>&1; then
  echo "✗ self-test FAILED: verify-bundle passed a tampered bundle — the tripwire is broken."
  exit 1
fi

# The contribute assertion is only worth having if it actually fires. Both halves
# are checked separately because they fail differently in the app: a card with no
# gate is invisible, a gate with no card hides the forms and leaves nothing.
echo "== negative: a contribute page missing the hand-off card must FAIL =="
sync_fresh
perl -0pi -e 's/\bnative-contribute\b/removed-marker/g' "$TMP/public/contribute/index.html"
if node "$TOOLS/verify-bundle.mjs" --dist "$DIST" --bundle "$TMP/public" >/dev/null 2>&1; then
  echo "✗ self-test FAILED: verify-bundle passed a bundle whose /contribute has no hand-off."
  exit 1
fi

echo "== negative: a contribute page missing the native gate must FAIL =="
sync_fresh
perl -0pi -e 's/dataset\.dwNative/dataset.somethingElse/g; s/data-dw-native/data-nope/g' "$TMP/public/contribute/index.html"
if node "$TOOLS/verify-bundle.mjs" --dist "$DIST" --bundle "$TMP/public" >/dev/null 2>&1; then
  echo "✗ self-test FAILED: verify-bundle passed a bundle whose /contribute never reveals the hand-off."
  exit 1
fi

echo "✓ self-test: verify-bundle passes a faithful sync and rejects a tampered crisis page,"
echo "  a missing contribute hand-off, and a missing native gate."
