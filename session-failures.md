# Session Failure Log

Searchable history of failures worth remembering, so cross-session patterns surface.

## Session: 2026-07-24

**Project:** disability-wiki (native iOS app remediation → App Store prep)

### Failures
- **iOS release signing**: `xcodebuild archive` with automatic signing tried to mint a *development* profile and died on "your team has no devices"; forcing `CODE_SIGN_IDENTITY="Apple Distribution"` then failed every CocoaPods target with "conflicting provisioning settings". → Resolved by archiving **unsigned** (`CODE_SIGNING_ALLOWED=NO`) and letting distribution signing happen **cloud-managed at export** (`-exportArchive` + `ExportOptions.plist` + `-allowProvisioningUpdates`). Now encoded in `app/fastlane/Fastfile` so it can't be re-derived.
- **VoiceOver-in-simulator**: tried to enable VoiceOver via `xcrun simctl spawn <udid> notifyutil -p/-s com.apple.Accessibility.VoiceOverTouchEnabled` — hung the simulator daemon, two 3-minute timeouts, left the sim wedged. → Abandoned that path; verified the VoiceOver-relevant a11y via the real accessibility tree in the browser preview (content) + code review of native labels. Don't use `notifyutil` to toggle VoiceOver in the sim.
- **simctl can't reach app sandbox prefs**: `xcrun simctl spawn <udid> defaults read/delete <bundleid> <key>` silently reads/writes the wrong domain (not the app's sandboxed prefs), so a "0"/"unset" result was misleading. → Read `<container>/Library/Preferences/<bundleid>.plist` directly (`get_app_container … data`).
- **`strings` on the app binary** returned 0 for Swift string literals (accessibility labels) — not evidence they're missing; Swift stores them differently. → Verified labels from source instead, which is authoritative.
- **Shared-file commit hazard**: `git add TRACKER.md` in the bas-platform hub swept in a *peer session's* uncommitted header + Benefits-Navigator edits. → Caught by the repo's pre-commit "N independent regions" hook; recovered via the wrap-up shared-file procedure (reset to HEAD, re-apply only my rows, commit, restore peer's work as uncommitted with my note stripped).
- **GitHub push 500** (`remote: Internal Server Error`) on push to main — transient; a retry succeeded. (Happened twice across the session; retry-with-backoff each time.)
- **Cloudflare Pages deploy hook silently dead** (the session's biggest find, not a tool error): the GitHub→Pages trigger died ~2026-07-19 when the repo transferred orgs; merges sat unpublished for 4 days. → Reconnected the GitHub App + Git integration; added a `verify-live-deploy` CI tripwire so it can't recur unseen.

---
