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

## Build & run (on a Mac with Xcode)

```bash
# 1. Build the web content the app bundles
npm --prefix ../site run build      # → site/dist  (or: npm run build:web from here)

# 2. Install app deps (already done if node_modules/ exists)
npm install

# 3. Add the native platform(s) — one-time
npx cap add ios
npx cap add android                 # needs a JDK + Android Studio

# 4. Copy the web build into the native project(s)
npx cap sync

# 5. Open in the native IDE and run on a simulator/device
npx cap open ios                    # → Xcode → pick a simulator → Run
npx cap open android                # → Android Studio
```

`npx cap doctor` diagnoses a broken toolchain.

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
5. **The contribute form is bundled but its backend isn't.** `dist` now includes
   `/contribute` (landed after this spike), whose form posts to the *relative*
   `/api/contributions` — a Cloudflare Pages function that doesn't exist inside the
   app bundle, so an in-app submit dead-ends. Before v1 either rewrite those posts
   to the absolute live origin for the app build, or hide the contribute entry
   points in-app. Same applies to `/api/auth/*` once sign-in links render.

## What's left for a real v1 (beyond this spike)

- Native crisis-dial affordance (persistent shortcut / bottom action).
- OTA content sync (so a merged crisis-number fix reaches the app without a store update).
- App icons + splash from `site/src/assets/logo.png` (reuse the PWA icon pipeline).
- Apple Developer account ($99/yr) + Google Play ($25 once); signing; store listings (EN/ES).
- Privacy nutrition labels (the app collects ~nothing — a strong position to state plainly).

## Notes

- `npm install` reports 2 high-severity advisories in Capacitor's transitive **dev**
  deps (build tooling, not shipped in the app). Review before a production build.
- `ios/` is committed (the platform is real now, headed for TestFlight); its own
  `.gitignore` keeps Pods, build products, and the synced `App/public` copy out.
  `android/` and `www/` stay git-ignored until Android is actually added.
