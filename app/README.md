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

## Shipping a build — `bundle exec fastlane beta`

One command replaces the whole manual archive/export/upload dance:

```bash
cd app
bundle install                    # one-time
bundle exec fastlane beta         # bump → build → verify → archive → upload
bundle exec fastlane verify       # dry run: pipeline + archive, no bump, no upload
```

`beta` requires a clean tree on `main`. It bumps `CURRENT_PROJECT_VERSION`,
**commits and pushes that bump** (the bundle is stamped with git HEAD and
`verify-bundle` asserts stamp == HEAD, so an uncommitted bump would ship an
archive whose build number exists nowhere in git), runs the content pipeline
below, archives, asserts the archive's stamp still matches HEAD, exports with
cloud-managed distribution signing, uploads, and then **re-reads the archive to
confirm App Store Connect actually accepted it** — `xcodebuild` can exit 0 having
recorded a failed delivery.

Two things the lane encodes that are easy to get wrong (details in
[`fastlane/Fastfile`](fastlane/Fastfile)):

- The archive is built **unsigned** (`CODE_SIGNING_ALLOWED=NO`). This machine has
  only an Apple *Development* certificate; forcing `Apple Distribution` breaks
  every CocoaPods target with "conflicting provisioning settings", and plain
  automatic signing tries to mint a *development* profile and dies on "your team
  has no devices". Distribution signing happens at **export**, cloud-managed.
- `DEVELOPER_DIR` is pointed at the full Xcode when present, because
  `xcode-select` may point at the bare Command Line Tools, which cannot archive.

`fastlane` warns about a non-UTF-8 locale at startup; it's cosmetic (the lane
sets `LANG` for the child processes that actually care, i.e. CocoaPods). To
silence it, `export LANG=en_US.UTF-8` in your shell profile.

## The content pipeline — `tools/build-release.sh`

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

## OTA content updates (Phase 1B — built 2026-07-23)

A merged crisis-number fix reaches installed apps **without an App Store release**,
and nothing unsigned can ever be installed. How it works:

- **Publish side** ([`site/tools/gen-ota-manifest.mjs`](../site/tools/gen-ota-manifest.mjs),
  runs in `npm run build`): emits `dist/ota/manifest.json` — sha256 of every content
  file — and `manifest.sig`, an ed25519 signature over the manifest's exact bytes.
  The private key comes from the `OTA_SIGNING_KEY` env var; without it the manifest
  is written unsigned and **clients refuse it** (local builds are unsigned on purpose).
  It also republishes every file under the hash of its own bytes as a **blob store**
  at `dist/ota/blobs/<first2>/<sha256>` — see "Why blobs" below; that is where the
  app downloads from. Blobs are hard links, so the second copy costs no disk, and
  `build-release.sh` strips them from the app bundle after `cap copy`.
- **App side** ([`ios/App/App/OTAUpdater.swift`](ios/App/App/OTAUpdater.swift)): on
  launch, fetch manifest+sig from disabilitywiki.org, verify against the public key
  compiled into the binary, delta-download the changed files from the blob store
  (each verified against its sha256 from the *signed* manifest), stage a complete
  root (unchanged files hard-linked), and activate **on the next launch** — never
  mid-session. The previous root is kept for rollback; a root that fails launch-time
  validation falls back previous → bundle. A new binary always discards older OTA state.
- **Freshness banner**: the OTA root carries its own `app-build.json`, so the
  crisis-page banner automatically shows the OTA date once an update lands.
- **CI**: `tools/ota-sign.selftest.sh` proves sign→verify round-trips, tampering is
  rejected, and every manifest entry has a fetchable blob — every PR.

### Why blobs, and the test trap that hid a dead channel for two days

Until 2026-07-25 the app downloaded each changed file from its real site URL. Through
Cloudflare that can never work. The edge **rewrites html responses**: Email
Obfuscation turns `mailto:` into `/cdn-cgi/l/email-protection`, and Bot Management
injects a `__CF$cv$params` challenge script. So the bytes the app received never
matched the sha256 in the signed manifest, every update aborted on its first html
file, and — since a crisis-number fix *is* an html change — the channel had never
once delivered the thing it exists to deliver. Two files, `_headers` and `_redirects`,
were also unfetchable: Pages consumes them as config and 404s them.

The blob store fixes all of it at once. Blobs have no extension and are pinned to
`Content-Type: application/octet-stream` by [`site/public/_headers`](../site/public/_headers),
which keeps them outside every html transform, present and future. Content-addressing
also makes them immutable (a changed file is a different URL), so they cache forever
and Pages re-uploads only the delta. Integrity is unchanged — the sha256 still comes
from the signed manifest.

**The trap, for whoever tests this next.** Three surfaces all serve this site, and
only one of them rewrites html — measured 2026-07-25 on the same commit:

| Surface | Injects `__CF$cv$params` into html? |
|---|---|
| `wrangler pages dev` / `python3 -m http.server` | no |
| `https://<branch>.disability-wiki.pages.dev` (PR preview) | **no** |
| `https://disabilitywiki.org` (the zone) | **yes** |

The zone settings that do the rewriting are attached to the custom domain, not to
`*.pages.dev`, so **the PR preview is as misleading as a local server**. That is
exactly why the 2026-07-23 E2E test passed on a channel that was already dead.
Before believing OTA works, compare a real html page from the **production** origin
against the manifest — that one command is the whole test:

```bash
node site/tools/check-live-deploy.mjs --channel-only
```

That fetches the live manifest and pulls a sample of crisis pages through the blob
store exactly as the app does, failing if any byte differs from its signed hash. It
is the first thing to run when someone reports stale content inside the app, and the
same check now runs post-merge in `verify-live-deploy` — a green signature is not a
working channel, and for two days that distinction was the whole bug.

If the edge ever starts rewriting non-html too, this is the symptom to expect and
`Content-Type` is the lever. The zone-settings alternative (turning Email
Obfuscation and Bot Fight Mode off) was rejected deliberately: it puts a
life-safety update path at the mercy of a dashboard toggle nobody would connect to
a stale crisis number months later.

**Key ceremony (one-time, required before OTA goes live):** run
`node app/tools/ota-keygen.mjs`; add the printed PRIVATE key as a Cloudflare Pages
**secret** named `OTA_SIGNING_KEY` (project `disability-wiki` → Settings →
Environment variables, production); the PUBLIC key is compiled into
`OTAUpdater.swift` (`publicKeyB64`). Rotating = new pair, new Swift constant, ship a
binary update. The current pair was generated 2026-07-23; the private key is in
`backups/ota-signing-key-2026-07-23.txt` (git-ignored, local-only) until installed
as the Pages secret.

E2E verified in the simulator (2026-07-23): signed update served from a local
wrangler `pages dev` → fetched, verified, staged, activated on relaunch, content
change visible in-app with the banner showing the new date; an **unsigned** manifest
was refused (pointer unchanged); a **corrupted** active root was detected at launch
and rolled back to the bundle.

Re-verified after the blob-store fix (2026-07-25, iPhone 17 Pro simulator, content
signed with the production key so the pinned `publicKeyB64` was the one under test):

| Scenario | Result |
|---|---|
| Live `https://disabilitywiki.org` (still schema 1) | refused, `manifestInvalid` — *"server manifest has no blob store"* |
| Signed schema-2 update, one changed file | one blob fetched, `staged`, pointer moved, `OTAPendingVersion` set |
| Relaunch | activated; Source flipped to *"downloaded, signature-verified update"*; the new content **rendered** in the webview (it exists in no bundle) |
| Second relaunch | `upToDate`; pending flag cleared |
| Server down (dead port) | `serverUnavailable` — *"Could not connect to the server."* |
| Tampered `manifest.sig` | `signatureRejected` — *"manifest signature invalid or missing"* |
| Blob corrupted by one byte (what the edge was doing) | `contentRejected` — *"hash mismatch for /crisis/index.html"*, nothing staged, previous root still serving |

And against a real Cloudflare deploy of this branch: every sampled blob returned 200
as `application/octet-stream` and hashed to its own name, **including `_headers` and
`_redirects`**, which 404 at their site paths. The blob store is therefore the only
route by which the full manifest is fetchable at all.

Debug builds print the status sheet's exact text to stdout at launch and after each
check, so `xcrun simctl launch --console-pty <udid> org.disabilitywiki.app` is a
complete diagnostic loop. Note `CAPLog.print` is block-buffered on a plain pipe —
use `--console-pty`, not `--console`, or you will see nothing and conclude wrongly.

## Native affordances (Phase 2 — built 2026-07-23)

The §4.2 "more than a wrapped website" layer, all crisis-first
([`ios/App/App/NativeAffordances.swift`](ios/App/App/NativeAffordances.swift)):

- **Home-screen quick actions** (dynamic, so titles follow device language EN/ES):
  Crisis help now / Crisis hotlines / Abuse support → deep-link straight into the
  bundled pages (two taps, zero network), plus Content status. Cold-launch shortcuts
  are held pending and delivered once the webview is up.
- **Persistent crisis button** — native red capsule, bottom-trailing, one tap to
  `/crisis/` from any page; survives any web-layer failure. ≥44pt, VoiceOver label +
  hint, Dynamic Type (capped at AX2 so it can't swallow the screen), no animation.
- **Content-status sheet** (long-press the crisis button, or the quick action):
  content date, source (bundle vs verified OTA update), last update check + outcome,
  app version, and "Check for updates now". `UIAlertController`, so Dynamic Type,
  VoiceOver, and both themes come free.

Verified in the simulator: button renders and navigates; status sheet shows real
OTA state; sheet actions work. The springboard icon-menu can't be triggered by
synthetic touches in the sim — give the quick actions one real-device look before
TestFlight.

### Saved pages, share, and Spotlight

A neutral **"More"** button sits in the bottom-*leading* corner — deliberately the
opposite corner from the red Crisis button, which owns bottom-trailing and does
exactly one thing, because in a crisis nobody should have to read a menu. More
opens: Save this page / Saved pages… / Share this page / Content status
([`ios/App/App/PageActions.swift`](ios/App/App/PageActions.swift)).

- **Saved pages** are bookmarks, not downloads — the whole site is already
  bundled, so a saved page works offline the instant you save it and costs no
  storage. Stored in `UserDefaults`; the list is a plain table with swipe-to-delete
  and an empty state.
- **Share** sends the **public** `https://disabilitywiki.org` URL, not the in-app
  `capacitor://localhost` origin, which would be meaningless to whoever receives
  it. A caseworker gets a link they can open.
- **Spotlight** ([`ios/App/App/SpotlightIndexer.swift`](ios/App/App/SpotlightIndexer.swift))
  indexes the crisis tree (56 pages, EN + ES) into iOS Search, so pulling down on
  the home screen and typing "988" or "abuse" lands directly on the page — no app
  launch, no connection. Crisis-only on purpose: indexing all ~540 pages would bury
  the ones that matter. Re-indexed only when the content version changes (so OTA
  updates refresh it), and the domain is deleted first so an upstream-deleted page
  can't linger in Search.

⚠️ **CoreSpotlight is partly stubbed in the Simulator** — its completion callback
is unreliable there, so `dw-spotlight-item-count` (written before handing off) is
the signal that discovery/parsing worked. Confirm actual Search results on a real
device.

## What's left for a real v1 (beyond this spike)

- ~~Native crisis-dial affordance (persistent shortcut / bottom action)~~ ✅ built (above).
- ~~OTA content sync~~ ✅ built (above) — goes live once `OTA_SIGNING_KEY` is set on Pages.
- App icons + splash from `site/src/assets/logo.png` (reuse the PWA icon pipeline).
- Apple Developer account ($99/yr) + Google Play ($25 once); signing; store listings (EN/ES).
- Privacy nutrition labels (the app collects ~nothing — a strong position to state plainly).

## Notes

- **`iosScheme` removed (2026-07-23).** `capacitor.config.json` used to set
  `server.iosScheme: "https"`, which Capacitor rejects (WKWebView already handles
  http/https) and silently ignored — the app has always run on `capacitor://`.
  Removing it makes the config match reality. Do **not** rely on the web service
  worker inside iOS; offline comes from the bundle (see open question 1).
- **On Capacitor 8** (upgraded 2026-07-23 from 6, which was end-of-support). The
  upgrade was near-zero-source: this is a thin shell using none of the deprecated
  App-plugin types or CAP notifications v7/v8 changed, and Cap 8's `Router`
  protocol is byte-identical to what `WikiRouter` implements. Deployment target
  raised to **iOS 15.0** (Podfile + all pbxproj targets), as v8 requires. Verified:
  `pod install` clean, `xcodebuild` **BUILD SUCCEEDED** under Xcode 26.6, and the
  app launches + renders the bundled site in the simulator. Still worth an
  interactive pass for deep-path routing, the 404 fallback, and `tel:`/external
  links (best with a booted sim + tap) before external release.
- `npm install` reports 2 high-severity advisories in Capacitor's transitive **dev**
  deps (build tooling, not shipped in the app). Review before a production build.
- `ios/` is committed (the platform is real now, headed for TestFlight); its own
  `.gitignore` keeps Pods, build products, and the synced `App/public` copy out.
  `android/` and `www/` stay git-ignored until Android is actually added.
