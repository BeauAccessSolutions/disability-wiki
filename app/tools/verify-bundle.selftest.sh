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

# Faithful sync: mirror what build-release.sh does, into a temp dir.
cp -R "$DIST" "$TMP/public"
node "$TOOLS/native-contribute.mjs" "$TMP/public/contribute/index.html"
printf '{ "gitSha": "%s", "builtAt": "selftest" }\n' "$(git -C "$ROOT" rev-parse HEAD)" > "$TMP/public/app-build.json"

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
echo "✓ self-test: verify-bundle passes a faithful sync and rejects a tampered one."
