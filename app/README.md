# Disability Wiki — native app (Capacitor spike)

Phase 2 of the app plan: a **Capacitor** native shell (iOS + Android) around the
existing Astro static build. It reuses `site/dist` as-is — no second UI codebase —
so the wiki, its search, nav, i18n, and the PWA offline layer all come along.

> **Status: iOS platform added (2026-07-18).** `ios/` is generated, pods installed,
> and `cap sync` verified against a fresh `site/dist` build. Not yet on TestFlight —
> needs an App Store Connect app record, signing, icons/splash, and a first archive.
> Android has **not** been added (needs a JDK). CocoaPods on this machine needs
> `LANG=en_US.UTF-8`, and `xcodebuild` needs
> `DEVELOPER_DIR=/Applications/Xcode.app/Contents/Developer` (xcode-select points
> at the bare CLT).

## Architecture

- **`webDir: ../site/dist`** — `cap sync` bundles the whole built site into the app,
  so it launches **offline-first from first open** (no connectivity needed for the
  first load — a real gain over a mobile browser tab, and the core of the App Store
  §4.2 "minimum functionality" argument).
- The app is a thin shell; content stays single-sourced in the repo root and is
  published to the web exactly as today (`merge → Cloudflare Pages`). The app just
  re-bundles the same `dist`.

## Building a release — use `tools/build-release.sh`

**Never hand-sync a release.** The bundle (`ios/App/App/public`) is a git-ignored
copy of `site/dist`; syncing it by hand, whenever, is how it went stale and shipped
an abuse hub with **zero** hotline numbers while the live page had six. One script
now makes the bundle a deterministic function of the current commit and refuses to
proceed if it doesn't match:

```bash
app/tools/build-release.sh            # build → sync → hand-off → stamp → VERIFY
app/tools/build-release.sh --archive  # …and xcodebuild archive (signing-capable Mac)
```

It runs, in order: (1) `npm run build` the site, (2) `cap copy ios`, (3) rewrite the
in-app contribute form into a live hand-off (`tools/native-contribute.mjs`), (4)
stamp `public/app-build.json` with the git SHA, (5) **`tools/verify-bundle.mjs`** —
a hard gate that checks crisis parity (every `crisis/` + `es/crisis/` file byte-
identical to the build, no orphans), a phone-number census, freshness, and that no
dead-end `/api/` form survives. Steps 1–5 need only Node; `--archive` needs Xcode.

`npx cap doctor` diagnoses a broken toolchain. To develop against a simulator
without a full release, `cap copy ios && npx cap open ios` still works — just don't
archive that way.

### One-time: the "Verify bundle" Xcode build phase

Defense in depth so a GUI archive can't skip the gate. In the **App** target →
**Build Phases** → **+** → **New Run Script Phase**, set the script to:

```
"${SRCROOT}/../../tools/xcode-verify-phase.sh"
```

and drag it to run **after** "Copy Bundle Resources". It enforces on
Release/Archive only (Debug/simulator runs skip it). If Xcode can't find `node`,
set the path inside that script.

### CI

`.github/workflows/ci.yml` runs `tools/verify-bundle.selftest.sh` on every PR: it
proves the tripwire still passes a faithful sync and **rejects** a tampered crisis
page (the original P0). CI can't verify a real archive (the bundle is git-ignored),
but it guarantees the verifier itself hasn't rotted.

## Open questions I could NOT validate without a simulator

These are the real risks a first `cap run` will answer — flagged so they aren't
discovered as surprises:

1. **Does the existing service worker run inside iOS `WKWebView`?** SW support under
   Capacitor's local scheme is limited on iOS. **Mitigation already in place:** because
   the app *bundles* `dist`, offline works from the filesystem regardless of the SW —
   the SW is a web-only enhancement, not the app's offline mechanism. But the
   network-first *freshness* story (and future OTA content updates) needs its own
   native design; don't assume the web SW carries over.
2. ~~**Do `tel:` links dial from the WebView?**~~ ✅ **RESOLVED 2026-07-18 from Capacitor
   source.** `WebViewDelegationHandler.decidePolicyFor` finds no `host` on a `tel:` URL, so
   it falls through to the "not an application navigation" branch and calls
   `UIApplication.shared.open(navURL)` — iOS dials. No allowlist or plugin needed. The
   bundle carries 10 `tel:` links incl. `tel:988`. Worth one real-device confirmation
   before external release (simulators can't place calls), but this is no longer a risk.
3. **Binary size.** `site/dist` is ~87 MB (pagefind index + ~540 pages). Acceptable to
   ship, but phase-2 should trim: bundle only crisis + top pages, fetch the rest, and
   move to **OTA content** so life-safety fixes don't wait on App Store review.
4. **App Store §4.2 approvability** — bundled offline + native dialing is a solid case,
   but it's a judgment call by the reviewer.
5. ~~**The contribute form is bundled but its backend isn't.**~~ ✅ **RESOLVED
   2026-07-23.** `tools/native-contribute.mjs` (step 3 of the release script)
   replaces the two `/api/contributions` forms in the bundled `/contribute` page
   with a hand-off card that opens the live site — no in-app form, so nothing to
   dead-end and no draft to lose. `verify-bundle.mjs` asserts no `action="/api/"`
   form survives. Same treatment will be needed for `/api/auth/*` once sign-in
   links render.

## What's left for a real v1 (beyond this spike)

- Native crisis-dial affordance (persistent shortcut / bottom action).
- OTA content sync (so a merged crisis-number fix reaches the app without a store update).
- App icons + splash from `site/src/assets/logo.png` (reuse the PWA icon pipeline).
- Apple Developer account ($99/yr) + Google Play ($25 once); signing; store listings (EN/ES).
- Privacy nutrition labels (the app collects ~nothing — a strong position to state plainly).

## Notes

- **`iosScheme` removed (2026-07-23).** `capacitor.config.json` used to set
  `server.iosScheme: "https"`, which Capacitor rejects (WKWebView already handles
  http/https) and silently ignored — the app has always run on `capacitor://`.
  Removing it makes the config match reality. Do **not** rely on the web service
  worker inside iOS; offline comes from the bundle (see open question 1).
- **Capacitor 6 is end-of-support (since 2026-01-20); v8 is current.** Upgrading
  `@capacitor/*` to 8 is the next Phase-0 task — it must be done on a Mac with
  Xcode and re-tested against `WikiRouter` (deep paths, 404 fallback, `tel:` and
  external links) before release. See `docs/app-remediation-plan.md`.
- `npm install` reports 2 high-severity advisories in Capacitor's transitive **dev**
  deps (build tooling, not shipped in the app). Review before a production build.
- `ios/` is committed (the platform is real now, headed for TestFlight); its own
  `.gitignore` keeps Pods, build products, and the synced `App/public` copy out.
  `android/` and `www/` stay git-ignored until Android is actually added.
