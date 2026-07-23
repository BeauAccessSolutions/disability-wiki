#!/usr/bin/env bash
# Xcode "Verify bundle" Run Script build phase — defense in depth. build-release.sh
# is the sanctioned path, but an archive can also be started straight from the
# Xcode GUI, bypassing it. This phase re-runs verify-bundle so a GUI archive still
# can't package a stale or orphaned crisis bundle. Enforced on Release/Archive
# only (debug/simulator runs skip it, so day-to-day dev isn't slowed).
#
# One-time setup (see app/README.md): in the App target → Build Phases → New Run
# Script Phase, set the script to:  "${SRCROOT}/../../tools/xcode-verify-phase.sh"
# and move it AFTER "Copy Bundle Resources". Xcode runs it with SRCROOT set to
# app/ios/App.
set -euo pipefail

# Enforce only where a real bundle ships.
if [ "${CONFIGURATION:-Release}" != "Release" ]; then
  echo "verify-bundle: skipping for ${CONFIGURATION:-?} (enforced on Release/Archive only)."
  exit 0
fi

# app/ios/App → repo root.
cd "${SRCROOT:-$(cd "$(dirname "$0")/../ios/App" && pwd)}/../../.."

# Xcode's PATH usually lacks node (nvm/homebrew). Try the obvious locations.
NODE=""
for c in "$(command -v node 2>/dev/null || true)" \
         /opt/homebrew/bin/node /usr/local/bin/node "$HOME/.nvm/versions/node"/*/bin/node; do
  [ -n "$c" ] && [ -x "$c" ] && { NODE="$c"; break; }
done
if [ -z "$NODE" ]; then
  echo "error: node not found on Xcode's PATH — cannot verify the crisis bundle." >&2
  echo "       Set the path in app/tools/xcode-verify-phase.sh or your build settings." >&2
  exit 1   # a life-safety gate fails loud, never skips silently
fi

exec "$NODE" app/tools/verify-bundle.mjs
