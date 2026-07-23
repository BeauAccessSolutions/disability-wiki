#!/usr/bin/env bash
# The ONLY sanctioned path from source to an iOS archive.
#
# The app bundle (app/ios/App/App/public) is a git-ignored copy of site/dist that
# `cap copy` makes. Doing that by hand, whenever, is how the bundle went stale and
# shipped an abuse hub with zero hotline numbers. This script makes the bundle a
# deterministic function of the current commit, and refuses to proceed if the
# result doesn't match the build:
#
#   1. build the site        → fresh site/dist
#   2. cap copy ios          → refresh the bundle from site/dist
#   3. native-contribute     → replace the in-app dead-end form with a hand-off
#   4. stamp                  → write app-build.json (git SHA + build time)
#   5. verify-bundle         → HARD GATE: crisis parity, phone census, freshness
#   6. archive               → only reached if 1–5 pass
#
# Run from anywhere: `app/tools/build-release.sh`. Pass --archive to also invoke
# xcodebuild (requires a Mac with Xcode + signing); without it, steps 1–5 run and
# you finish the archive in Xcode (the "Verify bundle" build phase re-runs step 5).
set -euo pipefail

TOOLS="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$(cd "$TOOLS/.." && pwd)"
ROOT="$(cd "$APP/.." && pwd)"

say() { printf '\n\033[1m▸ %s\033[0m\n' "$1"; }

say "1/5  Building the site (fresh site/dist)"
npm --prefix "$ROOT/site" run build

say "2/5  Syncing web assets into the iOS bundle (cap copy ios)"
( cd "$APP" && npx cap copy ios )

say "3/5  Rewriting the in-app contribute form into a live hand-off"
node "$TOOLS/native-contribute.mjs"

say "4/5  Stamping the bundle with the current commit"
STAMP="$APP/ios/App/App/public/app-build.json"
GIT_SHA="$(git -C "$ROOT" rev-parse HEAD)"
BUILT_AT="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
printf '{\n  "gitSha": "%s",\n  "builtAt": "%s"\n}\n' "$GIT_SHA" "$BUILT_AT" > "$STAMP"
echo "   stamped $GIT_SHA @ $BUILT_AT"

say "5/5  Verifying the bundle (hard gate)"
node "$TOOLS/verify-bundle.mjs"

if [[ "${1:-}" == "--archive" ]]; then
  say "Archiving (xcodebuild)"
  xcodebuild -workspace "$APP/ios/App/App.xcworkspace" -scheme App \
    -configuration Release -archivePath "$APP/ios/App/output/App.xcarchive" archive
  echo "   archive at $APP/ios/App/output/App.xcarchive"
else
  echo
  echo "✓ Bundle built, synced, and verified. Open the project in Xcode to archive"
  echo "  (or re-run with --archive on a signing-capable Mac). The Xcode 'Verify"
  echo "  bundle' build phase re-runs verify-bundle so a GUI archive can't skip it."
fi
