# Changelog

All notable changes to the Disability Wiki project are documented in this file.

---

## [Unreleased]

### Security
- **Merges that don't publish are now a red X, not a silent gap** (2026-07-23,
  [`site/tools/check-live-deploy.mjs`](site/tools/check-live-deploy.mjs),
  [`.github/workflows/ci.yml`](.github/workflows/ci.yml),
  [`docs/INCIDENT_RESPONSE.md`](docs/INCIDENT_RESPONSE.md)): the GitHub→Cloudflare
  Pages trigger died silently on ~2026-07-19 and nothing noticed — crisis-content
  sourcing fixes (#55/#56) and the app remediation stack sat merged-but-unpublished
  for 4 days while production served PR #54, with every existing check green.
  Recovery was a manual signed build + `wrangler pages deploy` (live again
  2026-07-23 14:24 UTC, verified: BJS figure, freshness banner, signed OTA
  manifest all serving). New `verify-live-deploy` CI job (blocking, post-merge):
  polls the live `/ota/manifest.json` until it serves the merged commit — or a
  newer deploy — with a valid ed25519 signature, so a dead deploy hook or a
  missing `OTA_SIGNING_KEY` fails the merge loudly within 10 minutes. Runbook for
  the stale-site case (detect → distinguish → rescue-deploy → root-cause) added to
  the incident response doc.

### Added
- **Dynamic Type in the app — web text now follows the system text size** (2026-07-23,
  [`app/ios/App/App/WikiRouter.swift`](app/ios/App/App/WikiRouter.swift),
  [`app/ios/App/App/NativeAffordances.swift`](app/ios/App/App/NativeAffordances.swift)):
  WKWebView does not map iOS's text-size setting onto web content, so a low-vision
  reader who enlarged text device-wide saw **no change** inside the app — the last real
  accessibility gap, and a glaring one on an accessibility organization's app. The app
  now scales the page's root font from the system's own Dynamic Type curve (capped at 2×
  so the largest accessibility sizes enlarge substantially without breaking a reflowing
  layout), re-applied as each document loads so every navigation and OTA-served page gets
  it, and updated live if the setting changes while the app is open. The header is pinned
  to a fixed size so the nav bar stays a nav bar — content scales, controls stay reachable.
  Also fixes two truncations this surfaced: the native Crisis button clipped to "Cri…" at
  large sizes (now wraps, bounded to the safe area) and the site wordmark clipped to
  "Disa…" (now wraps in full). Verified in the simulator at
  `accessibility-extra-large`. Phase 3 of
  [`docs/app-remediation-plan.md`](docs/app-remediation-plan.md).
- **Privacy Policy page** (2026-07-23, [`privacy.md`](privacy.md) → `/privacy`): a plain
  "we collect nothing" policy covering both the website and the native app — no accounts,
  no tracking, no ads, no permissions; explains the app's offline behavior and its signed
  content-update downloads. Serves as the privacy-policy URL for the App Store submission
  (build 4), and good to have regardless. New top-level page, symlinked into the build
  like `accessibility-statement.md`.
- **Native crisis affordances in the app** (2026-07-23,
  [`app/ios/App/App/NativeAffordances.swift`](app/ios/App/App/NativeAffordances.swift)):
  the app is now a tool, not a wrapped website — and every native piece is crisis-first.
  Home-screen **quick actions** (Crisis help now / Crisis hotlines / Abuse support /
  Content status; titles follow device language EN/ES) deep-link into the bundled pages,
  two taps and zero network from home screen to hotline numbers. A **persistent native
  crisis button** (red capsule, bottom-trailing) reaches `/crisis/` in one tap from any
  page and survives any web-layer failure. Long-press opens the **content-status sheet**:
  content date, source (bundle vs signature-verified update), last update check, app
  version, and a manual "Check for updates now". Accessibility bar throughout: ≥44pt
  targets, VoiceOver labels + hints, Dynamic Type (button capped at AX2), no animation,
  system semantic colors in both themes. Verified in the simulator (button navigation,
  status sheet with live OTA state); the springboard icon menu needs a real-device check
  before TestFlight. Phase 2 of
  [`docs/app-remediation-plan.md`](docs/app-remediation-plan.md) — addresses the review's
  finding #6 (App Store Guideline 4.2). Saved pages, share sheet, and Spotlight indexing
  remain as follow-ups.
- **Signed OTA content channel for the native app** (2026-07-23,
  [`site/tools/gen-ota-manifest.mjs`](site/tools/gen-ota-manifest.mjs),
  [`app/ios/App/App/OTAUpdater.swift`](app/ios/App/App/OTAUpdater.swift),
  [`site/public/_headers`](site/public/_headers), [`.github/workflows/ci.yml`](.github/workflows/ci.yml)):
  a crisis-number fix merged to `main` now reaches installed apps on their next
  launch — no App Store release — and nothing unsigned can ever be installed. The
  site build emits `/ota/manifest.json` (sha256 of every content file) plus an
  ed25519 signature; the app verifies the signature against a public key compiled
  into the binary, delta-downloads only changed files (each verified against the
  signed manifest), stages a complete content root (unchanged files hard-linked),
  and activates on the next launch with the previous root kept for rollback —
  current → previous → bundle, so there is always a last-known-good. A new binary
  discards older OTA state; `/ota/*` is edge-cache-exempt like `sw.js`. Verified
  end-to-end in the simulator: a signed update was fetched, verified, staged, and
  served (with the crisis-page freshness banner picking up the new date); an
  unsigned manifest was refused; a corrupted root was detected at launch and rolled
  back to the bundle. CI now proves the sign→verify roundtrip and tamper-rejection
  on every PR. Goes live once `OTA_SIGNING_KEY` is set as a Cloudflare Pages secret
  (key ceremony in [`app/README.md`](app/README.md)). Phase 1B of
  [`docs/app-remediation-plan.md`](docs/app-remediation-plan.md) — resolves the
  review's finding #3.
- **In-app freshness notice on crisis pages** (2026-07-23,
  [`site/src/components/AppBanner.astro`](site/src/components/AppBanner.astro)): the native
  app ships a bundled snapshot of the site, so on a life-safety page the reader should know
  they may be looking at a saved copy — and how to reach the current one. A crisis-page-only
  notice now shows the bundle's build date ("You're reading a saved copy from …") and links
  to the same page on the live origin. It is hidden by default and revealed only inside the
  Capacitor shell (via `window.Capacitor`/`capacitor:` origin) once it can read the bundle's
  build stamp; on the website the stamp doesn't exist and the origin is http, so it never
  shows there. Counterpart to the install announcement (suppressed on crisis pages; this
  shows only there). Verified in the simulator (shows with the correct date, dismissible) and
  in the browser (stays hidden, no console errors). Phase 1A of
  [`docs/app-remediation-plan.md`](docs/app-remediation-plan.md).

### Changed
- **Native app upgraded to Capacitor 8** (2026-07-23,
  [`app/package.json`](app/package.json), [`app/ios/`](app/ios/)): Capacitor 6 reached
  end-of-support on 2026-01-20; the app is now on 8.4.2 (core/ios/cli, `@capacitor/app`
  8.1.1). Near-zero-source change — the shell uses none of the deprecated App-plugin
  types or CAP notifications v7/v8 altered, and Cap 8's `Router` protocol is identical
  to what `WikiRouter` implements. iOS deployment target raised to 15.0 (v8 minimum).
  Verified: clean `pod install`, `xcodebuild` BUILD SUCCEEDED under Xcode 26.6, and the
  app launches and renders the bundled site in the simulator.

### Security
- **Native iOS bundle can no longer ship stale life-safety content** (2026-07-23,
  [`app/tools/`](app/tools/), [`.github/workflows/ci.yml`](.github/workflows/ci.yml)):
  the app bundle (`app/ios/App/App/public`) is a git-ignored copy of `site/dist` made by
  a manual `cap copy`, and a content merge after the last sync silently diverged it — the
  abuse hub shipped in the bundle with **zero** hotline numbers while the live page had
  six (the deleted `abuse-resources` orphan survived only in the stale bundle), with
  nothing to catch it. [`app/tools/build-release.sh`](app/tools/build-release.sh) is now
  the only sanctioned release path (build → `cap copy` → contribute hand-off → stamp →
  verify → archive), gated by [`app/tools/verify-bundle.mjs`](app/tools/verify-bundle.mjs):
  crisis parity (byte-identical to the build, no orphans), a phone-number census that
  names which numbers went missing from which page, a freshness check, and a
  contribute-safety check. CI self-tests the tripwire (passes a faithful sync, rejects a
  tampered crisis page) so it can't rot. Phase 0 of
  [`docs/app-remediation-plan.md`](docs/app-remediation-plan.md).

### Changed
- **Accent border on the app banner** (2026-07-18,
  [`site/src/components/AppBanner.astro`](site/src/components/AppBanner.astro)): the low
  accent surface alone was easy to scroll past — the repo owner, who knew the banner
  existed and was looking for it, still missed it on first load. Added a 3px accent rule
  on the inline-start edge: a visual anchor without raising the bar's colour weight, so it
  still does not compete with crisis content. Matches the offline note on the crisis index
  pages so the two read as the same kind of aside. Uses `border-inline-start` rather than
  `border-left` so it stays on the correct edge if an RTL locale is ever added. Verified in
  both themes (accent tracks the theme; 5.19:1 against the banner surface in dark).

### Fixed
- **Restored two pieces the abuse-page merge dropped** (2026-07-18,
  [`crisis/abuse-neglect-exploitation.md`](crisis/abuse-neglect-exploitation.md),
  [`es/crisis/abuse-neglect-exploitation.md`](es/crisis/abuse-neglect-exploitation.md)):
  the merge below condensed ~750 lines to ~270; most was genuine de-duplication, but two
  things went with it that were not duplicates, and the merge commit disclosed neither.
  (1) **"Why abuse happens"** is a section again, placed between the warning signs and the
  response options — after someone recognises what is happening, before deciding what to
  do. The merged page had kept only a single inline "it is not your fault" line; on a page
  for people frequently told the abuse is the price of being cared for, that framing earns
  its own section, and it now names the disability-specific form of the self-blame ("no one
  else would put up with you"). (2) **Reporting to police is an explicit option again** —
  the merged page had narrowed it to "Reporting to police is your choice," losing that
  someone can file a report, press charges, go to court, and ask for a protection order.
  The page's stance is preserved rather than reversed: it still says plainly that involving
  police or state agencies increases danger for some people, and the restored text adds
  that declining to report is equally legitimate and that no hotline or service on the page
  requires a report. Both directions are named so neither reads as the expected choice. ES
  mirrors EN section for section. Verified under `wrangler pages dev` in both locales.
- **Sweden's sterilization figure understated by an order of magnitude** (2026-07-18,
  [`history/eugenics.md`](history/eugenics.md), [`es/history/eugenics.md`](es/history/eugenics.md),
  [`docs/CLAIMS.md`](docs/CLAIMS.md)): the page said "Sweden sterilized thousands into the
  late 1970s." The verified total is **~63,000**, mostly women, under laws running to 1976 —
  of whom a Swedish government commission found ~21,000 were sterilized by force, ~6,000
  coerced into "voluntary" procedures, and ~4,000 indeterminate. "Thousands" is off by an
  order of magnitude on a page about state violence against disabled people. Fixed EN and
  `es/` together; grepped repo-wide, the phrasing had not propagated. Found while verifying
  two external research briefs before drafting from them — a five-pass check against primary
  sources that also caught, and kept out of the wiki, a subminimum-wage claim that had gone
  stale (the DOL §14(c) phase-out rule was **withdrawn 2025-07-07**, not pending), a Cuban
  population figure and a $3.40/hour wage figure with no locatable source, and a Russian
  institutionalization number off by ~20× (it counts all children without parental care, not
  disabled children specifically). Results recorded in `docs/CLAIMS.md` with an explicit
  do-not-publish list, plus two standing gotchas: take polio case counts from GPEI Polio This
  Week rather than WHO Emergency Committee statements, and fetch cited pages rather than
  trusting search snippets — this pass caught the search layer echoing query language back as
  false confirmation.
- **Retired abuse URL 404'd at its canonical (trailing-slash) form** (2026-07-18,
  [`site/public/_redirects`](site/public/_redirects)): the page-merge above added
  `_redirects` rules for the slashless form only. But canonical URLs on this site carry a
  **trailing slash** — production serves `/crisis/abuse/abuse-resources/` with a 200, the
  sitemap indexes that form, and it is what people bookmarked and search engines hold. That
  exact URL returned **404** after the merge, so someone reaching for abuse hotlines from a
  saved link or a search result got nothing. Offline users failed twice: the old URL was in
  the service-worker precache, and the build both dropped it and 404'd on the network, so
  there was no fallback. Added both URL forms for both locales, pointed at the
  trailing-slash target so each is a single-hop 301 rather than a 301 followed by a 308.
  **Found by runtime verification under `wrangler pages dev`** — `astro preview` does not
  honour `_redirects` at all, so the original rules could not have been checked against it.
  Recipe recorded in [`.claude/skills/verify/SKILL.md`](.claude/skills/verify/SKILL.md).
- **Abuse hotlines were on a page nobody linked to** (2026-07-18,
  [`crisis/abuse-neglect-exploitation.md`](crisis/abuse-neglect-exploitation.md),
  [`es/crisis/abuse-neglect-exploitation.md`](es/crisis/abuse-neglect-exploitation.md),
  [`site/public/_redirects`](site/public/_redirects)): the abuse section had two parallel
  pages, and the inbound links pointed at the wrong one. `/crisis/abuse-neglect-exploitation`
  carried ~25 EN + ~15 ES inbound links — every crisis-hotline page, `crisis/index`,
  `foundations/welcome` — but contained **zero phone numbers**. The 668-line
  `/crisis/abuse/abuse-resources` held all 21 hotline numbers and had **zero inbound content
  links**, reachable only by sidebar browsing. Several inbound links were even labelled
  "Abuse & Violence Resources" — the orphan's title — while resolving to the page with no
  numbers. The UK Rape Crisis correction from the 2026-06 audit
  (0808 802 9999 → **0808 500 2222**) had also landed on the orphan, leaving a verified
  life-safety number stranded. Merged the orphan's content into the linked hub, keeping the
  hub's URL so no inbound link changed: hotlines moved to the top, the hub's editorial
  stance ("police may increase danger") preserved and extended to the immediate-danger
  block, which had previously advised calling police without qualification. Condensed
  ~750 lines to ~270 by dropping the expository "types of abuse" material the hub already
  covered and two duplicate hotline blocks; kept the disability-specific abuse,
  dependence-on-abuser, and safety-planning sections. Dropped two organisation names that
  could not be verified to exist rather than carry them forward. All 21 numbers verified
  present after the merge, EN/ES number sets identical, both orphan URLs 301'd, and the
  merged page is precached in the offline service worker.
- **Missing space before the app banner's install link** (2026-07-18,
  [`site/src/components/AppBanner.astro`](site/src/components/AppBanner.astro)): the live
  banner read "A native app is on the way.**How to install**" — the sentence ran straight
  into the link. The source *had* a literal space (`{t.text} <a href=…>`), but **Astro's
  compiler drops whitespace between an expression and an adjacent element**, so it never
  reached the output. That is why it survived review: the source reads correctly and only
  the rendered HTML shows the defect. Fixed with an explicit `{' '}` expression, which
  survives compilation and will not regress on reformat; commented at the call site so it
  is not "tidied" back. Verified in the built output for both locales.
- **Auth callback crashed on the real Workers runtime — "Illegal invocation"** (2026-07-17,
  [`site/src/lib/auth/oidc.ts`](site/src/lib/auth/oidc.ts),
  [`site/src/lib/auth/session-store.ts`](site/src/lib/auth/session-store.ts),
  [`site/src/lib/contribution-store.ts`](site/src/lib/contribution-store.ts)): a real
  sign-in reached Keycloak and returned to `/api/auth/callback`, which then failed closed
  to `/contribute/sign-in-required/`. Root cause: `exchangeCode` and both Supabase stores
  captured the global `fetch` into a parameter (`fetchImpl: typeof fetch = fetch`) and
  invoked it as a **detached** reference — which throws `Illegal invocation` on Cloudflare's
  workerd (a captured built-in loses its `this`). Neither node's `--test` nor local
  `wrangler pages dev` (miniflare) enforce that check, so the 45 green unit tests and local
  runs never caught it; it only surfaces on the production edge. Fixed by defaulting
  `fetchImpl` to a wrapper that calls the global `fetch` **by identifier**. Pinpointed with
  a temporary `?e=…&m=…` tag on the callback's fail-closed redirect.
- **Contribution env now actually binds in production** (2026-07-17,
  [`site/wrangler.jsonc`](site/wrangler.jsonc)): `/api/auth/*` returned 404 and
  contributions fail-closed 401 after *every* redeploy because the Pages Functions
  never received the `KEYCLOAK_*` / `SUPABASE_URL` vars. Root cause: a `wrangler` config
  file in the project makes Cloudflare **ignore dashboard-set plaintext variables** — but
  the vars had only ever been set in the dashboard, so nothing bound. Moved the four
  non-secret vars into `wrangler.jsonc` `"vars"` (issuer is now the neutral BAS IdP
  `id.beauaccesssolutions.com`, client `disability-wiki-web`); `SUPABASE_SERVICE_ROLE_KEY`
  stays a dashboard **Secret** (encrypted secrets still apply in wrangler-managed mode).
  Verified with `wrangler pages dev`: login **302**s to the BAS authorize URL (PKCE
  `S256`), callback with no cookie **303**s to sign-in-required, `POST /api/contributions`
  **401**s. Corrects [`docs/deploy-contribution-backend.md`](docs/deploy-contribution-backend.md) §3.

### Added
- **Pacing and Energy Management page** (2026-07-19,
  [`daily-living/pacing-and-energy-management.md`](daily-living/pacing-and-energy-management.md)):
  fills gap #4 on the BUILD FIRST list in `CONTENT_GAPS_2026-06-05.md` — the operational
  method behind spoon theory, previously only implied in `healthcare/pain-and-fatigue`.
  The draft already existed untracked in the working tree and was good; it was verified,
  corrected, and completed rather than rewritten. This is a contested clinical area where
  wrong advice has a documented record of harming people, so every load-bearing claim was
  checked against primary sources. **No life-safety errors were found in the draft.** Six
  refinements, one that matters: the widely circulated heart-rate threshold of "55% of 220
  minus age" is usually credited to the **Workwell Foundation, which explicitly advises
  against it** — more than 85% of people with ME/CFS have chronotropic incompetence and
  cannot reach the age-predicted maximum the formula assumes, so it sets the ceiling too
  high and pushes people past the limit it is meant to protect. The page now says so and
  gives Workwell's actual method. Also: NICE NG206 anchored precisely (rec 1.11.14, Oct
  2021, reaffirmed Jan 2025), noting it says "energy management" not "pacing" and prohibits
  only *fixed incremental increase*, not movement; the page states which sense of "pacing"
  it means, since clinical and community usage differ; CDC's split position is named
  (pacing endorsed publicly, deconditioning caution on the clinician page) rather than
  implying guidance has uniformly moved, given the most-cited evidence synthesis still
  favours exercise therapy and its re-review was abandoned in Dec 2024; "not relieved by
  rest" corrected to attach to fatigue rather than PEM; delay windows attributed rather
  than stated flatly, so nobody concludes a 60-hour crash was not PEM. All 9 organization
  URLs fetched and confirmed live — Bateman Horne Center 403'd to curl even with a browser
  UA and was confirmed in a real browser rather than assumed dead, the same bot-block
  signature as `post-polio.org`. Body Politic corrected: its Slack peer-support community
  closed May 2023 but the site remains up as advocacy, so "wound down" was too strong.
- **Claim-integrity check — a regression guard for rejected facts** (2026-07-19,
  [`scripts/check_claims.py`](scripts/check_claims.py), [`docs/CLAIMS.md`](docs/CLAIMS.md),
  [`.github/workflows/ci.yml`](.github/workflows/ci.yml)): adapted in spirit from the
  Langworthywatch fact-check validator, which validates that *verification happened*
  rather than trying to adjudicate truth. Its per-page Sources section maps to our
  central `CLAIMS.md` ledger, its archive.org check to org-URL liveness, its claims
  regex to load-bearing figure detection, and its credibility score to a ledger
  coverage score. **The addition their domain does not need is the regression guard.**
  A verification pass that *rejects* a claim produces knowledge that otherwise dies
  with the session — six months later the same source is re-imported and the same wrong
  number ships again, and nothing in this repo prevented that. `CLAIMS.md` now carries a
  machine-readable rejected-claims block (`tier :: regex :: why`; the delimiter is `::`
  because the patterns use `|` for alternation) and CI **fails** if one reappears. Seeded
  with 13 rules from the 2026-07-18 verification pass, including the two that were live
  or nearly live: the Sweden sterilization understatement (both locales) and an invented
  "$3.40/hour" subminimum-wage figure. Blocking on regressions only; stale ledger rows,
  unledgered figures, and dead org URLs are advisory. Verified by injecting rejected
  claims into EN and ES content and confirming exit 1, then exit 0 on a clean tree — the
  first test reported a false pass because `$?` after a pipe captures the last command in
  the pipeline rather than python, and a gate that reports while returning 0 is not a
  gate. Baseline: 537 files, 35 ledger rows, 0 blocking, score 83/100. Archive backups
  are at 0, the one Langworthywatch idea not yet applied here and the obvious next step.
- **Runtime page verifier** (2026-07-19, [`scripts/verify_page.py`](scripts/verify_page.py),
  [`.claude/skills/verify/SKILL.md`](.claude/skills/verify/SKILL.md)): ad-hoc
  `curl | grep` checks produced **three false signals in one session**, and each time the
  page was correct and the check was wrong — a keyword miss reported as content loss on a
  life-safety page ("legal rights DROPPED", when the material had survived reworded); a
  deploy poll that re-fetched a hashed CSS asset captured *once*, so it timed out on a
  change that had already shipped; and an ordering check that searched whole-page HTML,
  where Starlight's on-this-page nav repeats every heading. Shared root cause: grepping raw
  HTML with boolean pattern-matches instead of scoping to rendered content and comparing
  sets. The script provides `order` (markers in sequence inside `<main>` only), `kept` (set
  difference of phone numbers between source files and the rendered page — makes a
  "content was dropped" claim impossible to state without evidence), `numbers` (for diffing
  EN against ES), and `await-asset` (re-resolves hashed assets each poll, cache-busts every
  fetch). All exit non-zero on failure. Each subcommand was checked against the case it
  originally got wrong **and** given a negative control. All three failures were false
  *negatives*; since the dangerous direction here is a check that passes on a broken crisis
  page, the skill now prefers set-difference assertions over `if X in html`.
- **Iron lung and political-economy history pages** (2026-07-19,
  [`history/iron-lung.md`](history/iron-lung.md),
  [`history/political-economy.md`](history/political-economy.md), plus enrichment of
  [`history/independent-living-movement.md`](history/independent-living-movement.md),
  [`history/industrialization.md`](history/industrialization.md), and
  [`history/institutionalization-and-deinstitutionalization.md`](history/institutionalization-and-deinstitutionalization.md)):
  drafted from two external research briefs, but **only after** a five-pass verification
  against primary sources, recorded in [`docs/CLAIMS.md`](docs/CLAIMS.md). House voice
  required inverting the iron-lung brief's structure: it leads with abandonment and power,
  the wiki leads with agency, so the page opens with what polio survivors *built* — Gini
  Laurie's peer newsletter becoming Post-Polio Health International, the 1959 attendant-care
  campaign that in her words "cleared the path for the independent living movement," Ed
  Roberts demanding dormitory rather than hospital status, and survivors identifying
  post-polio syndrome before medicine accepted it. **Five claims were dropped as
  unsourceable** (the "UK's last iron lung user died 2017" line; a Cuban population figure;
  an English 1776 relief figure; a §14(c) "$3.40/hour" figure that appears invented; and
  Medicare Advantage denial rates with no primary source). **Ten more were corrected before
  publishing**, including a §14(c) phase-out presented as pending when it had been withdrawn
  2025-07-07, a Russian institutionalization figure off by ~20×, and the Tuskegee polio
  centre's relationship to the syphilis study, which ran through the *same hospital* rather
  than merely the same campus. The Soviet "1968 ban on integrated employment" took two
  passes and split in half: the broad claim is unsupported and contradicted within its own
  source, the narrow one about institution residents is supported and is what the page
  states. Gini Laurie had appeared nowhere in the history section despite it already
  covering Roberts and the Rolling Quads. Verified: 0 broken links across 2,642; build 539
  pages; the rejected claims appear nowhere in the built output. Note: both pages are
  English-only, so Spanish readers get the fallback notice until translated.
- **Spanish emergency-preparedness crisis page** (2026-07-18,
  [`es/crisis/emergency-disaster-preparedness.md`](es/crisis/emergency-disaster-preparedness.md)):
  the last untranslated page in the ES crisis section. Spanish readers were served the
  English content behind Starlight's untranslated-content notice — correct degradation,
  but English-only emergency-preparedness guidance in a life-safety section is a real
  gap. Translated per the **spanish-wiki-translation** skill (neutral Latin-American
  Spanish, person-first, `tú`, Spanish sentence-case headings, `/es/` link rewriting,
  canonical `Contribuye` footer copied verbatim rather than re-improvised; non-translated
  frontmatter preserved byte-for-byte). **EN/ES crisis parity is now complete (29/29).**
  Verified: `check_translation.py` clean, built page serves `lang="es"` with the fallback
  notice gone, and it is precached for offline like every other crisis page.
- **App announcement banner + install page** (2026-07-18,
  [`site/src/components/AppBanner.astro`](site/src/components/AppBanner.astro),
  [`start/app.md`](start/app.md), [`es/start/app.md`](es/start/app.md)): a slim
  dismissible bar on every **non-crisis** page announcing the installable PWA (live
  today) and the in-progress native iOS app, as a Starlight `Banner` override. Deliberately
  **not** a modal — this site is used to look up crisis hotline numbers, and an overlay
  that traps focus or interrupts a screen reader mid-lookup is the wrong trade for an
  announcement; the bar also uses the low accent surface so it does not compete with
  crisis content. Dismissal persists in `localStorage` under a versioned key
  (`ANNOUNCEMENT_ID`, bump to re-show); the flag is set on `<html>` by an inline script
  *before* the element parses, so a dismissed banner never paints. With JS off the banner
  shows — the safe direction to fail. Per-page `banner` frontmatter still renders. Dismiss
  target is 44×44 (WCAG 2.5.5). The new EN/ES pages give per-platform install steps and
  state plainly that the native app is not available, with **no release date promised**.
  Verified: contrast AA in both themes (light 10.24/5.83, dark 8.58/10.72), link validator
  `--strict` 0 broken, no console errors.
  **Suppressed entirely on `crisis/` and `es/crisis/`** — markup *and* both inline
  scripts, so those pages ship zero announcement code (verified per-route in `dist/`).
  Someone reading a crisis page *right now* is the person least able to act on "install
  an app"; installing is a preparedness action taken in a calm moment, and that reader
  still meets the banner on the other ~530 pages. Cost was measured before deciding: the
  bar pushed the "call 911" line from 277px to 344px at 320×568 — still above the fold,
  so the layout case was weak and the audience mismatch is the actual reason.
- **Offline note on the crisis index pages** (2026-07-18,
  [`crisis/index.md`](crisis/index.md), [`es/crisis/index.md`](es/crisis/index.md)): a
  permanent line stating these pages stay readable with no connection once the wiki is
  added to the home screen. This is where the offline message belongs on crisis routes —
  `crisis/` is the section that is actually precached ([`site/tools/gen-sw.mjs`](site/tools/gen-sw.mjs)),
  the note outlives the announcement banner, and it sits *below* the emergency-services
  line rather than above it.
- **Contribution-backend deploy runbook** (2026-07-16,
  [`docs/deploy-contribution-backend.md`](docs/deploy-contribution-backend.md)): the
  copy-paste steps to go live — Supabase project + apply the two migrations, register
  the Keycloak client (redirect `https://disabilitywiki.org/api/auth/callback`, pairwise
  `sub`), the exact Cloudflare Pages env vars (service-role key only — the publishable
  key isn't used), and the go-live negative-test. Secrets go in Pages encrypted env,
  never git.
- **BFF auth routes** (2026-07-16, Phase 3): `site/functions/api/auth/{login,callback,logout}.ts`
  complete the Keycloak BFF — the HTTP endpoints over the tested auth core, at
  `/api/auth/*` to match the other BAS apps' convention. Zero-JS:
  sign-in is a link (`/api/auth/login` → 302 to Keycloak with PKCE `S256`, stashing
  state/nonce/verifier in httpOnly `/api/auth`-scoped cookies), the callback validates
  CSRF state → exchanges the code → verifies the id_token → upserts the contributor
  by pairwise `sub` → mints a revocable session cookie, and sign-out is a form POST
  that revokes + clears. The orchestration lives in `login-flow.ts` (extracted to be
  unit-testable). Every route is gated behind `keycloakConfigured()` → 404 until
  `KEYCLOAK_*` env is set. **10 new tests (45 total)**: login-flow happy path + CSRF /
  missing-code / missing-verifier / exchange-failure / nonce-mismatch, plus the store
  write-method request construction. Verified via `wrangler pages dev`: unconfigured →
  404; configured (fake `KEYCLOAK_*`) → `/api/auth/login` 302 to the real authorize URL +
  temp cookies, and callback with no state cookie → 303 sign-in-required (CSRF
  fail-closed). **Still needs a registered Keycloak client** for the live happy-path
  integration test (real code → token → JWKS verify → session).
- **Zero-JS contribution UI** (2026-07-14, Phase 2/3): `src/pages/contribute.astro`
  (+ `contribute/{thanks,sign-in-required,error}`) — a suggest-edit / propose-page
  form rendered via `StarlightPage` (full site chrome, theme, a11y). No script:
  native HTML validation (`required`/`minlength`/`maxlength`) runs client-side, and
  the endpoint now accepts native `application/x-www-form-urlencoded` posts and
  answers browsers with a **303** to a static outcome page (JSON clients still get
  JSON). Category options are single-sourced from the validator's `CONTENT_CATEGORIES`.
  Verified end-to-end in a browser: fill + submit → Thank-you page; and fail-closed
  (no auth) → sign-in-required (no data stored). Not linked in nav yet — direct
  visitors hit a graceful sign-in-required until auth is live.
- **Keycloak auth core (BFF)** (2026-07-14, Phase 3): the server-side identity
  layer for gated contribution, mirroring Access Atlas's BFF (browser only ever
  holds an httpOnly session cookie — keeps contribute pages zero-JS, keeps the OIDC
  token server-side, BAS invariant #1). `site/src/lib/auth/`: OIDC Auth-Code+PKCE
  (`oidc.ts`, WebCrypto), id_token verification via **`jose`** against Keycloak's
  JWKS (`verify.ts` — never hand-rolled), the app's own **revocable** session
  (`session.ts` — httpOnly cookie, only the SHA-256 hash stored, so a DB leak can't
  be replayed), and `resolve.ts` which turns a session cookie into a pairwise `sub`.
  The write endpoint's `resolveSub` is now wired to it — fail-closed at every step
  (not-configured / no-cookie / no-live-session → refused). Migration
  `0002_contributor_identity.sql` adds `contributors` + `contributor_sessions`
  (RLS on, service_role-only). **23 unit tests, incl. 6 negative auth cases**
  (wrong audience/issuer, expired, nonce-replay, forged-key). Enables only when
  `KEYCLOAK_*` env is set. Deferred (needs a registered Keycloak client to
  integration-test): the `/auth/login|callback|logout` HTTP routes.
- **Contribution store — Supabase** (2026-07-14, Phase 2): `SupabaseContributionStore`
  behind the existing `ContributionStore` interface — a dependency-free PostgREST insert
  (plain `fetch`, bundles cleanly in the Pages Function/workerd runtime) using the
  server-only **service-role** key. `selectStore(env)` uses it when `SUPABASE_URL` +
  `SUPABASE_SERVICE_ROLE_KEY` are set, else the no-persistence stub. Migration
  `site/supabase/migrations/0001_wiki_contributions.sql` creates the moderation-queue
  table with RLS **on**, public roles **revoked**, and explicit **service_role** grants
  (encodes the RLS≠GRANT lesson) — the queue is server-only and never publicly readable.
  Endpoint now selects the store and returns 503 on a store failure. 3 store unit tests
  (request construction, error path, selection) + endpoint e2e re-verified; a TS
  parameter-property that broke node's `--test` type-stripping was rewritten to explicit
  fields. Still inert in production until Keycloak (Phase 3) + a real Supabase project.
- **Contribution seam + write endpoint** (2026-07-14, Phase 2 foundation): the
  fail-closed core of the community-contribution flow, host defaulted to **Cloudflare
  Pages Functions** (keeps the wiki on one platform). `site/src/lib/contribution.ts` —
  pure, unit-tested validation (suggest-edit / propose-page), pairwise-`sub` identity
  derivation (never trusts client-supplied identity), and a fail-closed write gate (an
  unauthenticated write is refused unless `ALLOW_PROVISIONAL_CONTRIBUTIONS=true`, which
  is local/preview only). `site/functions/api/contributions.ts` is a thin Pages Function
  over it; `contribution-store.ts` is the datastore seam (no-persistence stub until the
  hosting/data-controller call). **Verified end-to-end** via `wrangler pages dev`: 202
  authed, **401 in prod-simulation (no flag)**, 422 validation, 405 wrong-method. No UI
  yet and the endpoint is inert in production (fail-closed), so the live site is
  unchanged. Keycloak session wiring is Phase 3 (IdP is already live).
- **Joined the Beau Access Solutions platform** (2026-07-14, Phase 1 — governance
  onboarding only): scoped like Access Atlas — public browsing stays account-free and
  100% static; identity will gate *contribution* only. Adds
  [`docs/platform-membership.md`](docs/platform-membership.md) (governance pointer +
  the five invariants as a local fallback, per BAS ADR-002 §3),
  [`docs/contribution-model.md`](docs/contribution-model.md) (the chosen community-
  contribution design: pseudonymous suggest-edit/propose-page → moderation queue →
  **promotion into markdown**, so the published site never depends on a database — this
  deliberately preserves the Wiki.js→static migration), and `.github/CODEOWNERS`
  (invariant #4 — required review on governance, life-safety `crisis/`, `CLAIMS.md`,
  security headers, and the pre-guarded Phase-2 contribution paths). i18n ownership
  (invariant #5) is already satisfied by the EN/ES + Spanish-review discipline. The
  contribution endpoint + Keycloak identity wiring are deferred (Phase 2/3). The
  platform IdP (Keycloak) is already live, so identity is buildable; the remaining call
  is hosting/data-controller for submissions (adopt Access Atlas's now-live DO App
  Platform + Supabase, or use Cloudflare Pages Functions to keep one host).
- **Capacitor native-app spike** (2026-07-14, `app/`): scaffold for the phase-2
  iOS/Android wrapper — Capacitor project + config that bundles the existing
  `site/dist` (`webDir: ../site/dist`), so the app launches offline-first with no
  second UI codebase. Scaffold only: CLI verified, native `ios/`/`android/` platforms
  not yet added (needs full Xcode / a JDK). `app/README.md` holds the turnkey build
  steps and the open questions a first `cap run` must answer (SW-in-WKWebView, `tel:`
  dialing, 87 MB binary → trim + OTA, App Store §4.2). Not published (only symlinked
  content reaches the live site).
- **PWA: installable + offline crisis pages** (2026-07-14): web app manifest with
  crisis-hotline shortcuts (EN + ES), icons generated from the site logo, and a
  build-generated service worker (`site/tools/gen-sw.mjs`). All `crisis/` and
  `es/crisis/` pages (~58) plus the asset bundle are precached at install —
  discovered by walking `dist/`, never hand-listed. HTML is network-first (a stale
  crisis number is never served while online; cache is the offline fallback only);
  cache version is a hash of precached content, so a crisis-page fix re-precaches on
  the next visit. Bilingual offline fallback page (`offline.html`) deliberately
  contains **no hotline numbers** — it links to the precached pages instead, so
  life-safety facts stay single-sourced (CLAIMS discipline). `_headers` keeps
  `sw.js`/manifest out of the Cloudflare edge cache. First phase of the native-app
  (Capacitor) plan.
- **CI merge-gate** (2026-06-22, `.github/workflows/ci.yml`): the cutover made publishing = merge to main with no review gate; every PR now runs the same Astro build Cloudflare runs (blocking) + `validate_wiki_links.py --strict` (blocking; baseline 0 broken links) + `check_accessibility.py` (advisory — current findings are all the emoji-as-info house style). Adds a `--strict` exit flag to the link validator. Ported from sibling projects' CI discipline.
- **Incident-response runbook** (2026-06-22, `docs/INCIDENT_RESPONSE.md`): severity levels tuned to a life-safety static site (a wrong/dead crisis hotline number is SEV1); documents both rollback paths and that the droplet path (A records → `167.71.97.167`) expires at the 2026-07-10 decommission. Adapted from the `benefits-navigator` runbook.
- **Canonical claims ledger** (2026-06-22, `docs/CLAIMS.md`): `public-ledger`-style registry of load-bearing facts (crisis numbers, benefits figures, legal deadlines) → primary source + verify date, seeded from the 2026-06 audits and the fact-check error heatmap. Internal, not published.

### Fixed
- **SW: redirect-tainted cache entries break offline navigation in production**
  (2026-07-14, `site/tools/gen-sw.mjs`): Cloudflare Pages 308s bare-file URLs
  (`/offline.html` → `/offline`) and no-slash page URLs (`/x` → `/x/`) — behaviors
  `astro preview` doesn't reproduce, so local offline tests passed while production
  would fail: browsers reject redirected responses served to navigations. Fixes:
  offline page moved to `/offline/` (directory-style like every other URL, no
  redirect), and runtime page-caching now strips the `redirected` flag by rewrapping
  the response. Found because the first production deploy stalled and live checks
  ran against the real edge. Known residual: the zone's Browser Cache TTL (4h)
  overrides the `no-cache` `_headers` rule for `sw.js` on the custom domain —
  harmless for SW updates (browsers bypass HTTP cache for update checks), but worth
  flipping to "Respect existing headers" in the dashboard.
- **Offline-page a11y (design review)** (2026-07-14, `site/public/offline.html`):
  dark-theme "Try again" button was white-on-`#5a9be0` at 2.9:1 contrast (fails
  WCAG 1.4.3) → dark text on the light accent, 5.2:1; button hit area was 38px →
  44px (house 44/48 bar); hover affordance added to card links. Found by the
  `bas-design-review` checklist — contrast verified in both themes, targets
  measured at 375px viewport.

### Changed
- **Shared cross-project lessons wired into `claude.md`** (2026-06-22): `@import` of `~/.claude/shared/LESSONS.md`, and three transferable wiki lessons pushed back to it (Cloudflare edge-cache `?v=` doesn't bust it; auto-deploy needs a CI gate; machine translation reproduces source errors).

### Security
- **Stale `sitemap-*` DNS-only A record deleted** (2026-06-12): it pointed at the old droplet and was the last record exposing the origin IP (flagged by Cloudflare's "origin IP partially exposed" recommendation). Remaining post-cutover DNS item: DMARC record (tracked for the 2026-07-10 decommission checklist).

---

## [2026-07-10] — Droplet decommission (migration Phase 5)

Final phase of the Wiki.js → static-site migration, run via the Claude scheduled
task `droplet-decommission-day` (health-check → archive → destroy → DNS → docs).

### Removed
- **Legacy Wiki.js droplet destroyed** (DigitalOcean, `167.71.97.167`, hostname
  `Disability-Wiki`, SSH alias `cripchronicle`). It had served as the rollback
  fallback since the 2026-06-12 cutover; the ~4-week rollback window is up. No block
  volumes or manual snapshots existed; the 4 automated weekly backups can't be
  force-deleted (DigitalOcean has no delete action for them) but carry no charge once
  the Droplet is destroyed and auto-expire by ~2026-08-01. **There is no longer a
  fallback origin** — a Cloudflare Pages platform outage is now handled by dashboard
  deployment-rollback / Cloudflare support only.
- **Final droplet archive taken before destruction** → `backups/final-droplet-archive/`
  (local-only, git-ignored): fresh `pg_dump` of the Wiki.js DB (`gzip -t` verified),
  `docker-compose.yml`, and `.env` (as `wiki.env`), plus a provenance/restore README.

### Added
- **DMARC record** for `disabilitywiki.org` (was missing; Cloudflare had been
  recommending it): `TXT _dmarc = "v=DMARC1; p=quarantine; rua=mailto:zb2252@columbia.edu"`.
  Completes email auth alongside the existing SPF + DKIM on the Cloudflare Email
  Routing setup.

### Changed
- **Docs rewritten to the static-site reality**: `claude.md` (removed the legacy
  Wiki.js server/deploy/backup sections, added the Astro-Starlight-on-Pages
  description + a pointer to the final archive); the **disability-wiki-edit** skill
  (retired the GraphQL API / pull-mode sync / SSH-recovery / never-`git rm`
  machinery, replaced with the edit→PR→merge-to-main workflow — `git rm` is now the
  correct way to delete a page); `docs/INCIDENT_RESPONSE.md` (retired the droplet
  "path 2" DNS-rollback per its own post-decommission instruction). Project memory
  (`static-site-migration`, `wikijs-ops-gotchas`) marked historical.

### Security
- **Confirmed no DNS records point at the destroyed droplet.** The zone has no `A`
  records at all (apex + `www` are proxied CNAMEs to `disability-wiki.pages.dev`); the
  stale `sitemap-*` `A` record was already deleted at cutover. Origin IP no longer
  exposed anywhere in DNS.

---

## [2026-06-11 — 2026-06-12] — Static-site migration & cutover

### Changed
- **CUTOVER (2026-06-12): disabilitywiki.org now serves the Astro Starlight static site from Cloudflare Pages.** Custom domains (apex + www) attached to the `disability-wiki` Pages project; verified live: pages 200 (EN + es), `/en/*` 301s, stub/index/case redirects, 404, valid TLS. Publishing is now merge-to-main. The Wiki.js droplet remains as rollback until decommission — **scheduled for 2026-07-10** (Claude scheduled task `droplet-decommission-day`: final archived backup, droplet destroy, DNS cleanup, docs/skill rewrite); CLAUDE.md and the edit skill carry legacy banners.

### Fixed
- **Phantom git submodule entry removed** (`disability-wiki` gitlink with no `.gitmodules`): harmless locally for months, but it made Cloudflare's repo clone fail (`fatal: No url found for submodule path`), blocking the first Workers Builds deployment.
- **17 broken Spanish links fixed (live bugs)** — surfaced by the migration Phase 3 link verification (143,514 rendered hrefs checked, now 0 broken): wrong community/condition/crisis slugs across 14 es/ files, including crisis-hotline paths and one wrong-region link (Indonesia under south-america). The repo link validator misses es-slug mismatches; verification report: `docs/migration/VERIFICATION_2026-06-12.md`.
- **Wiki.js-era "This page has moved" stubs become true redirects on the static site** (8 stubs: accessibility-statement root, foundations/how-to-use-this-wiki, start/{disability-models,for-allies,what-is-disability} EN + es): marked `draft: true` so the static build excludes them from pages/sidebar and serves redirects instead; Wiki.js ignores the field, so the live stubs keep working until cutover. FAQ links repointed from stubs to the canonical foundations/ pages.
- **Residual `[[wikilink]]` syntax cleared from the four start/ pages (EN + es)**: ~50 unsupported wikilinks rendering as literal bracket text (missed by the 2026-06-08 sweep), many pointing at pages that moved (`/about/contact` → `/start/contact`, `/start/welcome` → `/foundations/welcome`, `/library` → `/media`) or were never created (`/about/privacy` etc., now unlinked plain text). Broken hand-maintained "Previous/Next page" nav lines removed.

### Changed
- **Frontmatter titles aligned to each page's written H1** (119 pages, EN + es): many frontmatter titles were slug-generated ("Tv Shows", "Tiktok Creators") while the body H1 carried the real title ("Disability on Television"); titles now match the H1. Improves Wiki.js page titles/search/SEO today and lets the new static site render a single H1. One inverse fix: the es filing-a-complaint H1 was all-caps and now uses the frontmatter title.

### Added
- **Static-site migration Phase 4 (deploy config)**: `site/wrangler.jsonc` for Cloudflare Workers static-assets hosting (assets from `dist/`, 404-page handling) — Workers Builds deploys on merge; Pages is in maintenance mode upstream, so the site targets Workers from the start.
- **Static-site migration Phase 2** (`site/`): Cloudflare `_redirects` file (`/en/*` → `/*` 301s, home aliases, stub-page targets, dropped `/regions`); custom 404 leading with crisis links (EN + es); `robots.txt` + sitemap pointer; pride-flag favicon; WCAG-AA accent palette for light/dark themes. Sweep guard (`scripts/sweep_noncontent_pages.py`) now covers the `site/` prefix — the 404 page leaked into Wiki.js as a published page and was unpublished.
- **New site nav: autogenerated sidebar** (`site/`): the hand-maintained Wiki.js nav (22 groups / 153 links, English-only labels on `/es/`) is replaced by a sidebar autogenerated from the 23 content directories — ordered start/foundations/crisis first, section labels from index-page titles with proper Spanish translations, and it can never go stale when pages are added.
- **Static-site migration Phase 1** (`site/`): Astro Starlight scaffold that builds all wiki content — 539 pages in ~13s — with existing markdown symlinked in place (no content moves), en at root + es under `/es/` (URLs unchanged), sidebar generated from the Wiki.js nav export, Pagefind search (en+es), git-derived last-updated dates, and a generated sitemap (Wiki.js served none). Not yet deployed.

### Fixed
- **48 pages had YAML-invalid frontmatter** (unquoted colons in title/description) — tolerated by Wiki.js, fatal to strict parsers; values now quoted (rendering unchanged).

### Removed
- **Legacy duplicate rights stubs deleted** (6 pages, EN + es): `Rights/Overview` and `Rights/North-America/US/{ADA,Fair-Housing}` were 25-line unpublished leftovers shadowing the real `rights/us/*` pages (flagged in the 2026-06-05 page review). DB rows deleted via API first, then repo files.

### Added
- **Static-site migration Phase 0** (`docs/migration/`): decided Wiki.js → Astro Starlight on Cloudflare Pages; exported the DB-only state (nav tree, site config, logo) and reconciled DB vs repo — two nav-linked pages that existed only in the Wiki.js DB (`foundations/welcome`, `crisis/emergency-disaster-preparedness`) exported into the repo so it is now the complete source of truth; `regions/index` (empty, unlinked) marked drop+redirect. Plan and findings in `docs/migration/MIGRATION_PLAN.md`.

### Fixed
- **Unfilled footer placeholders replaced with real `/start/contribute` links** (54 instances, 26 files): `**Share feedback:** [Feedback link]` and `[Link to contribution form]` were published as-is on 12 English pages (the eight daily-living pages, adult-and-continuing-education, in-person-community, youth-student-communities, family-control-and-gaslighting) and their 12 `es/` counterparts; the EN and es glossary indexes had three unlinked `[Link to form →]`-style placeholders each. All now point to `/start/contribute` (`/es/start/contribute` on Spanish pages) per the canonical contribute pathway.

### Changed
- **Hand-maintained "Last updated" footer lines removed from all content pages** (~510 stamps across 484 EN + es pages). Most stamps said "January 2026" or "November 2025" even on pages corrected in the June 2026 audits, understating freshness on exactly the pages (crisis hotlines) where it matters. Wiki.js's automatic updated-at timestamp is now the single source of truth for page freshness.

### Fixed
- **Spanish sync of the 2026-06-10 audit corrections** ([PR #20](https://github.com/Beaudoin0zach/disability-wiki/pull/20), pending merge): all 18 `es/` counterparts of the corrected English pages updated — fabricated/wrong crisis numbers removed from Spanish (Nigeria SURPIN, Kenya 1199, Vietnam, Venezuela, Ghana, Zimbabwe, Egypt, Hungary, Canada 988) plus Aktion T4 / CRPD / VA SAH / LeDeR / Ruderman / JAWS fact corrections. Two new English-source flags recorded in `docs/translation-source-accuracy-flags.md` (Nigeria "Lifeline works nationwide" leftover; Thailand leaf page's obsolete Samaritans number).

---

## [2026-06-10]

### Fixed
- **Accuracy audit of ~200 previously unaudited English pages** (PR #19; tracker `AUDIT_RESULTS_2026-06-10.md`):
  - Verified crisis-hotline corrections (2+ primary sources each): fabricated "Lifeline Nigeria" removed → SURPIN; Kenya Red Cross → 1199; Vietnam's listed "hotline" was a bank's customer-service line → Ngày Mai; Venezuela → FPV LAPSI; Ghana MHA; Zimbabwe → Samaritans Bulawayo; Egypt MoH 16328; Indonesia → Healing119; Thailand Samaritans number change; Hungary LESZ/Kék Vonal relabel; retired Talk Suicide Canada → 988; Trans Lifeline hours.
  - Factual corrections: Aktion T4 death-toll contradiction reconciled (USHMM); CRPD 193 parties / 164 signatories + enforceability hedge; VA SAH grant $126,526 FY2026; police-killings and arrest stats attributed (Ruderman 2016, McCauley AJPH 2017); UK learning-disability mortality gap corrected to LeDeR; JAWS pricing date-stamped.
- `community/online-communities/discord.md` rewritten as a genuine Discord page (was duplicated Reddit content); scam/safety note added to the online-communities index.

### Added
- National Domestic Violence Hotline safety box on `relationships/dating-and-relationships.md`.

---

## [2026-06-09]

### Changed
- **Contribute pathway canonicalized on `/start/contribute`** (PRs #14–#18): dead Google Form dropped in favor of the email CTA, site nav repointed, 244 inbound links repointed (EN + es), `/glossary/how-to-contribute` reframed as the Technical Contribution Guide.

### Fixed
- **Mexico/Argentina crisis-number corrections** (PR #11, life-safety): unverifiable CONADIS/CNDH and ANDIS numbers replaced with verified ones; Argentina emergency-number block corrected (100 = firefighters, not police).
- Intersectionality essays sourced/hedged per Tier D audit (PR #12); RespectAbility survey deep-linked.
- Accessibility: sole-carrier emoji replaced with plain-text labels, image alt fixed (PR #9); bare-path link text relabeled across 64 links (PR #14).

### Added
- Politics of Disability reading pathway + expanded books/bibliography, with full Spanish parity (PRs #7–#8); `professionals/accessible-course-design.md`.
- `scripts/publish_page.py` — pushes file content into the Wiki.js DB when force-sync fails to import it (the known sync quirk).

---

## [2026-06-06 — 2026-06-08]

### Fixed
- **First full content accuracy audit** (`AUDIT_RESULTS_2026-06-06.md`, employment/education/benefits/rights/crisis): Tier A crisis-hotline corrections (Mexico Línea de la Vida, Thailand DMH 1323, India Tele-MANAS, Indonesia Healing119, Philippines NCMH, UK lines); blanket "all free/confidential/24-7" and false "verified" claims replaced with hedged per-service wording; benefits figures refreshed to 2026 (SSI $994 FBR / $1,690 SGA, Medicare, veterans MAPRs); IDEA complaint deadlines + OCR misrouting fixed; §503/§504 conflation and Spain LISMI naming corrected.
- **Broken links cleared to zero repo-wide**: validator script repaired, ~110 stale links fixed, dangling in-page TOC anchors repaired (EN + es), unsupported `[[wikilinks]]` converted.

### Added
- **Full Spanish locale (`es/`, ~269 pages)** committed to the repo and synced to all audit corrections, with translation glossary/conventions, canonical crisis-page blocks, language-aware meta descriptions, and a source-accuracy flags log (`docs/translation-source-accuracy-flags.md`).
- Claude Code project skills tracked in-repo (`.claude/skills/`): Spanish translation/sync, AI-slop detection, accuracy fact-checking, wiki editing/publishing, link hygiene, content accessibility audit.

---

## [2026-06-04 — 2026-06-05]

### Fixed
- Dead-link audit + remediation (PR #2); full page review + remediation (PR #3, `PAGE_REVIEW_2026-06-05.md`).

### Added
- Intersectionality stubs pilot, 4 pages (PR #4); self-management pilot pages — Autistic Burnout, ADHD Medication Access (PR #6).

---

## [2026-01-11 — 2026-01-13]

### Security
- Removed hardcoded credentials from the repo; added `SECURITY.md` hardening guide; documented implemented security features (TLS/HSTS, security headers, rate limiting, **daily automated backups at 3 AM UTC**).

### Removed
- Unrelated langworthywatch Hugo content split out to its own project.

---

## [2.5.310] - 2026-01-06

### Updated
- **Wiki.js Version**: Upgraded from 2.5.309 to 2.5.310
  - Updated local installation (Mac)
  - Updated live production server (DigitalOcean)
- **Repository Organization**: Major cleanup and restructuring
  - Created `scripts/` directory for Python utilities
  - Created `docs/` directory for documentation
  - Created `backups/` directory for archives
  - Moved files to appropriate locations

### Added
- **Documentation**:
  - `claude.md` - Comprehensive technical documentation covering:
    - DigitalOcean server details
    - Wiki.js deployment (local and live)
    - Docker configuration
    - Update procedures
    - Maintenance tasks
    - Troubleshooting guide
  - `QUICK_REFERENCE.md` - Fast command reference guide
  - `scripts/README.md` - Utility scripts documentation
  - `docs/README.md` - Documentation directory guide
  - Updated `README.md` with new structure

- **Scripts**:
  - `scripts/generate_descriptions.py` - SEO meta description generator
    - Updated 232 of 254 files with descriptions
  - `scripts/validate_wiki_links.py` - Internal link validator
    - Validated 1,758 links across 254 files
    - Found 15 broken links

- **Infrastructure**:
  - `.gitignore` improvements (Docker volumes, Python cache, backups)
  - `backups/.gitkeep` to maintain directory structure

### Fixed
- Meta descriptions added to 232 markdown files (155-160 characters each)
- Identified 15 broken internal links for repair
- Repository structure now properly organized

---

## [2.5.309] - 2026-01-06

### Updated
- **Wiki.js Version**: Upgraded live server from 2.5.308 to 2.5.309
  - Backed up configuration: `docker-compose.yml.backup-2.5.309`
  - Successfully pulled and deployed new image
  - Verified startup and database connectivity

### Changed
- Docker Compose configuration updated on live server
- Image version pinned to `requarks/wiki:2.5.309`

---

## [2.5.308] - Initial Deployment

### Added
- Initial Wiki.js installation on DigitalOcean
- PostgreSQL 13 database setup
- Docker Compose configuration
- 254 markdown content files across categories:
  - Benefits & Programs
  - Disability Rights
  - Housing Resources
  - Employment Rights
  - Education
  - Healthcare
  - Legal Resources
  - Assistive Technology
  - Transportation

### Infrastructure
- DigitalOcean Ubuntu 22.04 LTS droplet
- Docker containerization
- Port mapping: 8080:3000
- Database volume persistence

---

## Content Statistics

### Current Content (as of 2026-06-10)
- **English Pages**: ~290 markdown content files
- **Spanish Pages**: 269 markdown files under `es/` (full locale)
- **SEO Coverage**: meta descriptions regenerated repo-wide, EN + es (June 2026)
- **Link Health**: 0 broken internal links (cleared June 2026; run `scripts/validate_wiki_links.py` to re-check)
- **Accuracy**: two full content audits completed (`AUDIT_RESULTS_2026-06-06.md`, `AUDIT_RESULTS_2026-06-10.md`)

### Categories
- Benefits (SSDI, SSI, Medicaid, Medicare, VA)
- Rights (ADA, IDEA, Section 504, Fair Housing)
- Housing (Accessible housing, modifications)
- Employment (Accommodations, workplace rights)
- Education (K-12, IEPs, 504 plans, college)
- Healthcare (Conditions, treatments, resources)
- Legal (Disability law, advocacy)
- Technology (Assistive tech, accessibility)
- Transportation (Transit, paratransit)
- Crisis (Emergency resources, hotlines)

---

## Maintenance History

### Database Backups
- Automated daily backups active since January 2026 (3 AM UTC; daily/weekly/monthly rotation — see CLAUDE.md)

### Security Updates
- Server OS: Ubuntu 22.04.5 LTS
- TLS/HSTS, security headers, and rate limiting active (January 2026 hardening)
- Wiki.js: Version 2.5.310

---

## Known Issues

Open content work is tracked in the audit files and translation flags log:
- Remaining P1 unsourced statistics and P2 safeguard additions — see `AUDIT_RESULTS_2026-06-10.md` "OPEN"
- Re-sweep of files skipped by the 2026-06-10 scan (sports/media/get-involved/relationships)
- `es/community/online-communities/discord.md` still carries the old Reddit content (English rewritten 2026-06-10)
- Two EN crisis-page flags: Nigeria "Lifeline works nationwide" leftover; Thailand leaf's obsolete Samaritans number — see `docs/translation-source-accuracy-flags.md`

### Missing Features
- [ ] Monitoring/alerting for downtime
- [ ] Email configuration for Wiki.js

---

## Planned Improvements

### Short Term
- [ ] Close remaining 2026-06-10 audit items (P1 verification rounds, P2 safeguards)
- [ ] Automated link checking (CI/CD)

### Medium Term
- [ ] Staging environment
- [ ] Search analytics

### Long Term
- [ ] Enhanced search with Elasticsearch
- [ ] Community contribution system
- [ ] Mobile app integration

### Completed (formerly planned)
- [x] Automated backup system (January 2026)
- [x] Broken-link cleanup — 0 broken repo-wide (June 2026)
- [x] Content contribution guidelines — `/start/contribute` canonical (June 2026)
- [x] Multi-language support — full Spanish locale (June 2026)

---

## Version Numbering

Infrastructure releases use Wiki.js version numbers (`[2.5.310] - YYYY-MM-DD`). Content and tooling changes are tracked by date (`[YYYY-MM-DD]`), grouped per day or per work stretch. Work merged but not yet deployed/verified live goes under `[Unreleased]`.

---

## Contributing

When making changes:
1. Update this CHANGELOG with your changes
2. Include date and version number
3. Categorize changes: Added, Changed, Deprecated, Removed, Fixed, Security
4. Link to related issues or PRs when applicable
5. Be specific and concise

---

*Changelog maintained since January 6, 2026*
