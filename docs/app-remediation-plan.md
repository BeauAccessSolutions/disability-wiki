# Native App Remediation Plan

**Goal:** take the Capacitor iOS app from "compiles and launches" to the best, safest,
most functional and accessible release we can ship — with life-safety content that is
never silently stale.

**Status ledger** (from the 2026-07-23 review, every finding independently verified
against the code):

| # | Sev | Finding | Verdict |
|---|-----|---------|---------|
| 1 | P0 | iOS bundle ships stale crisis content (abuse hub: 0 numbers bundled vs 8–9 live) | Confirmed |
| 2 | P1 | Contribution form POSTs to `/api/contributions` → 404 in-app, draft lost | Confirmed |
| 3 | P1 | No content-update mechanism after install | Confirmed (known gap, `app/README.md`) |
| 4 | P1 | Capacitor 6 support ended 2026-01-20; v8 current | Confirmed (6.2.1 installed) |
| 5 | P2 | `iosScheme: "https"` is invalid config, silently ignored | Confirmed |
| 6 | P2 | App Store Guideline 4.2 minimum-functionality risk | Plausible (site-in-WebView + router) |

Ordering principle: **safety before features, freshness before polish.** A crisis app
whose numbers can go stale is worse than no app — nothing in Phases 2–4 ships until
Phase 0 and Phase 1 hold.

---

## Phase 0 — Stop the bleeding (release blockers, do first)

### 0.1 Atomic build pipeline (fixes #1, the P0)

The root cause is a *manual, unverified* sync: `App/public` is a git-ignored snapshot
of whatever `site/dist` held at the last `cap sync`. Any content merge after that
silently diverges the bundle.

- Add `app/tools/build-release.sh` as the **only** sanctioned path to an archive:
  1. `npm --prefix ../site run build` (fresh `site/dist`)
  2. `npx cap sync ios`
  3. `node app/tools/verify-bundle.mjs` (below) — hard-fail on any mismatch
  4. `xcodebuild archive` (or hand off to Xcode only after 1–3 pass)
- `app/tools/verify-bundle.mjs` — the tripwire:
  - Hash-compare **every** file under `site/dist/crisis/` + `site/dist/es/crisis/`
    against `app/ios/App/App/public/…` (walk `dist`, never a hand-list — same rule
    as `gen-sw.mjs`).
  - **Orphan check:** any file in the bundle's `crisis/` trees that no longer exists
    in `dist` is a failure (this is exactly how the deleted `abuse-resources` page
    survived in the bundle).
  - **Phone-number census:** extract tel-pattern counts per crisis page from both
    trees; any delta is a failure with a page-level diff in the output.
- **Xcode Run Script build phase** that runs the verify script (fast, read-only) so
  even an archive started from the Xcode GUI cannot package a stale or orphaned
  bundle. This is the enforcement point CI can't reach (the bundle is git-ignored
  and only exists on the build machine).
- **Freshness stamp:** the sync step writes `public/app-build.json`
  (`{builtAt, gitSha}`); the verify script asserts `gitSha == HEAD`. This stamp is
  also what Phase 1's UI surfaces.
- **CI job** (`.github/workflows/ci.yml`, advisory→blocking once stable): on PRs
  touching `app/` or `crisis/`, run the site build + a dry-run of `verify-bundle.mjs`
  in self-test mode (sync to a temp dir, verify against dist) so the script itself
  can't rot.

**Acceptance:** deleting a crisis page or editing a hotline number, then archiving
without a fresh sync, fails the build with a named-page diff. A clean checkout
produces a correct bundle from one command.

### 0.2 Capacitor 6 → 8 upgrade (fixes #4)

Do this *before* building new native features on a dead major.

- `npm i @capacitor/core@8 @capacitor/ios@8 @capacitor/app@8 @capacitor/cli@8`
  (+ `@capacitor/android@8` to keep the deferred Android platform consistent).
- Follow the official 6→7 and 7→8 upgrade guides (Xcode/iOS minimums move).
- **Regression checklist after upgrade** (the custom router is the risk surface):
  - `WikiRouter` still conforms to the `Router` protocol (verify API didn't change
    across majors); deep paths (`/crisis/abuse/what-is-it/`) resolve, unknown paths
    hit the built 404, not home.
  - External `https://` links open in Safari, `tel:` links produce the dial prompt
    (device test — simulators can't place calls, per `app/README.md`).
  - Spanish routes (`/es/crisis/…`) resolve identically.

### 0.3 Fix invalid `iosScheme` (fixes #5)

- Remove `"iosScheme": "https"` from `app/capacitor.config.json` (default
  `capacitor` is what actually runs today, so behavior is unchanged — this makes
  config match reality).
- Grep the site for any code that assumes an `https` origin in-app (service worker
  registration is the known one: the SW is a web-platform feature and must be
  treated as **inert inside the app**; offline in-app comes from the bundle, not
  the SW).

### 0.4 Contribution flow: never dead-end (fixes #2)

Decision: **don't** try to make the in-app form POST cross-origin (CORS +
`capacitor://` origin + the deferred identity build = a large surface for a
deferred feature). Instead:

- Build-time transform in the sync pipeline (0.1): rewrite the bundled
  `/contribute` page's forms into a clear hand-off — "Contributing happens on the
  website" with a button that opens `https://disabilitywiki.org/contribute` in the
  system browser (`window.open` → Safari under Capacitor's default external-URL
  handling; verify in 0.2's checklist).
- The verify script asserts the bundled contribute page contains **no** relative
  `action="/api/…"` form (tripwire so a future site change can't reintroduce the
  dead-end).
- Revisit a native-safe in-app submission only when the platform contribution/
  identity build (currently deferred) actually lands.

**Acceptance:** in-app, tapping Contribute never shows a 404 and never loses typed
input, because there is no in-app form to lose.

---

## Phase 1 — Never stale (the life-safety architecture, fixes #3)

Two layers, shipped in order. Layer A is small and honest; Layer B makes the app
genuinely self-healing. **Layer A is the TestFlight floor** — do not ship even a
beta without it.

### 1A. Honest snapshot (ship with first TestFlight build)

- Surface the 0.1 freshness stamp: a persistent, dismissable-per-session banner on
  crisis pages — "Saved copy from {date}. If you're online, the newest numbers are
  at disabilitywiki.org" — with the link opening the live page in-app when online.
- **Online = live, offline = bundle** for crisis HTML: a small fetch-first check in
  the app shell (mirroring the PWA's network-first HTML rule, which exists for
  exactly this reason — "a stale crisis number is never served while online").
  When the origin is reachable, crisis pages render live content; the bundle is
  the offline fallback only.
- App Store metadata and the in-app About screen say plainly what the app is: an
  offline-capable snapshot with a freshness date.

### 1B. Signed content-update channel (the real fix)

Custom and small, because the content is static files — no Appflow dependency:

- **Publish side** (Pages build): emit `content-manifest.json` (per-file hashes,
  build date, git SHA) + a content tarball, both served from the site;
  sign the manifest with a **minisign/ed25519 key held offline** (public key
  compiled into the app). Key never lives in CI.
- **App side:** on launch + daily, fetch manifest over HTTPS with certificate
  pinning to the Cloudflare edge cert chain; verify signature; download changed
  files; atomically swap the content root (`Library/content-vN/`), pointing the
  Capacitor server `basePath` at it.
- **Last-known-good rollback:** keep the previous content root; if the new root
  fails a post-swap self-check (the phone-number census from 0.1, run on-device
  against the manifest), revert and report. The shipped bundle is the ultimate
  fallback and is never deleted.
- Update status (last check, last success, content date) is stored and surfaced by
  the Phase 2 status screen.

**Acceptance:** merge a crisis-number fix to `main` → within 24h an installed app
serves the new number **with no App Store release**; a corrupted or unsigned
update is rejected and the previous content keeps serving.

---

## Phase 2 — Genuinely functional (fixes #6, Guideline 4.2)

Native capabilities that are real features for the audience, not padding — each
also strengthens the App Review case:

1. **Crisis quick actions** — home-screen long-press shortcuts
   (`UIApplicationShortcutItems`): "Crisis hotlines", "988", "Abuse support" →
   deep-link straight into the bundled pages. Zero-network, two taps from
   home screen to a hotline number. *This is the app's reason to exist; build it
   first.*
2. **In-app crisis shortcut** — a persistent, high-contrast "Crisis help" button in
   the app shell (not the web content), always one tap away, ≥44pt target.
3. **Update-status surface** — native About/Status screen: content date, last
   update check, "check now", app version, and the 1A honesty language.
4. **Saved pages** — bookmark any page for offline reading (they're already
   bundled; this is a native list + persistence, high value for spoon-budgeted
   readers).
5. **System share sheet** — `@capacitor/share` on every page (share a benefits
   page with a caseworker).
6. **Spotlight indexing** (stretch) — index crisis + foundations pages via
   CoreSpotlight so "988" or "SSI" in iOS search lands in the app offline.

Also in this phase, the release logistics from `app/README.md`: App Store Connect
record, signing, splash screens, privacy nutrition labels (trivially clean — no
tracking, no accounts), export-compliance answer.

**Acceptance:** the App Review reviewer sees offline crisis access, quick actions,
saved pages, share, and an update surface — a tool, not a wrapped website.

---

## Phase 3 — Accessible (the bar is higher here than anywhere)

This is an accessibility organization's app; it should model access. Verified
starting position: viewport permits pinch-zoom (no `maximum-scale` clamp), site CSS
ships `prefers-color-scheme` + `prefers-reduced-motion`, font sizes are relative
(em/rem). Gaps are at the native/WebView seam:

1. **Dynamic Type** — WKWebView does **not** map iOS text-size settings onto
   rem/em content by default. Bridge it: read `UIApplication.preferredContentSizeCategory`
   (and its change notification), inject the equivalent root font-size scale into
   the WebView. Test at the largest accessibility sizes; crisis numbers must
   remain readable and un-clipped at AX5.
2. **VoiceOver pass, in-app** — the site is audited as a website; retest inside
   the WebView: focus lands sensibly after each `WikiRouter` navigation (focus
   reset to page top / main landmark, not lost), rotor navigation by headings
   works, `tel:` links announce as dialable, the 404 page announces itself.
3. **Native chrome a11y** — every Phase 2 native element (crisis button, quick
   actions, status screen) gets labels, Dynamic Type, ≥44pt targets, and full
   VoiceOver/Switch Control operability. Run the bas-design-review standard
   against each.
4. **Dark mode & contrast in-app** — verify `prefers-color-scheme` propagates into
   the WebView and the native chrome matches (no white flash on launch; launch
   screen respects appearance). Contrast-check the 1A freshness banner in both
   themes.
5. **Reduced motion** — verify `prefers-reduced-motion` propagates; no native
   transition animations that ignore it.
6. **Content fixes** — fix the 6 bare-URL link labels now (cheap, real
   screen-reader win). The 193 emoji-as-information findings are the documented
   intentional house style; note the decision in the audit output rather than
   churning content.
7. **Assistive-tech smoke matrix** before each release: VoiceOver, Dynamic Type
   AX-sizes, Switch Control basic pass, Smart Invert, Reduce Motion — scripted as
   a checklist in `app/README.md`.

**Acceptance:** a VoiceOver user can cold-launch the app offline and reach a
dialable crisis number without sighted help, at any text size.

---

## Phase 4 — Release engineering & guardrails

- **Fastlane (or scripted `xcodebuild`) lane** wrapping 0.1's pipeline →
  TestFlight upload; the lane is the only documented release path.
- **CI blocking additions:** bundle-verify self-test (0.1), contribute-form
  tripwire (0.4), content-manifest generation check (1B).
- **Update `docs/INCIDENT_RESPONSE.md`:** a wrong crisis number now has a third
  surface (web, PWA cache, native app) — add the app column: fix → merge → 1B
  channel propagates; App Store release only needed for shell bugs.
- **Android:** stays deferred (needs JDK); keep `@capacitor/android` versions in
  lockstep during the Phase 0 upgrade so it doesn't rot further.
- **Docs:** rewrite `app/README.md` around the new pipeline; record the 1B key
  ceremony (where the private key lives, who can sign).

---

## Sequencing at a glance

| Phase | Contents | Gate |
|-------|----------|------|
| 0 | Atomic pipeline + verify tripwire; Cap 8; config fix; contribute hand-off | Nothing else proceeds until green |
| 1A | Freshness banner + online-first crisis pages | TestFlight floor |
| 1B | Signed OTA content channel + rollback | Public-release floor |
| 2 | Quick actions, crisis button, status screen, saved pages, share | App Review readiness |
| 3 | Dynamic Type bridge, in-app VoiceOver pass, native-chrome a11y, AT matrix | Ship-quality bar |
| 4 | Fastlane lane, CI hardening, incident-runbook update | Operational close-out |

Estimated shape: Phase 0 is a few focused sessions; 1A rides along with it; 1B is
the largest single build (signing + swap + rollback deserves its own PR and
review); Phases 2–3 are parallelizable page-sized PRs; Phase 4 is glue.

**Two decisions to confirm before build starts:**
1. **1B approach** — custom signed channel (above, no vendor) vs. Capacitor/Appflow
   Live Updates (less code, adds a paid vendor into the life-safety path).
   Plan assumes custom.
2. **1A online-first scope** — crisis pages only (planned) vs. all HTML
   (simpler mentally, more data use for spoon/data-budgeted users).
