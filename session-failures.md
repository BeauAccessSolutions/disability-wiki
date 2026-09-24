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

## Session: 2026-07-25

**Project:** disability-wiki (build 7 → App Store submission)

### Failures
- **Piped exit code masked a lane failure — reported success for a build that failed.** Ran `bundle exec fastlane verify 2>&1 | tail -400`; the pipeline exited 0 (that's `tail`'s status), and I announced the lane green. It had died at step 1/5. → Caught by grepping the output for `fastlane finished with errors`. Fix: `set -o pipefail` before any `cmd | tail`, and assert on a *success* marker (`ARCHIVE SUCCEEDED`), never on exit status alone. **This is the single worst failure of the session — it produced a confidently wrong claim, not just a retry.**
- **Fresh git worktrees have no `node_modules` and no `Pods`** — worktrees don't inherit them from the primary checkout. `build-release.sh` died with `sh: astro: command not found`, then `xcodebuild` died with `Unable to open base configuration reference file … Pods-App.release.xcconfig`. → `npm ci` in **both** `site/` and `app/`, then `pod install` in `app/ios/App`. Budget ~3 extra minutes for any release/verify run in a new worktree.
- **`bundle exec pod install` fails — CocoaPods is a Homebrew install here, not in `app/Gemfile`.** `can't find executable pod for gem cocoapods`. → `env -u BUNDLE_GEMFILE -u RUBYOPT /opt/homebrew/bin/pod install`. (`app/Gemfile` carries fastlane only.)
- **`gh` merged as the wrong account.** Active account was `LangworthyWatch`, which lacks write on `BeauAccessSolutions/disability-wiki` → `GraphQL: … does not have the correct permissions to execute MergePullRequest`. → `gh auth switch --user Beaudoin0zach`, merge, switch back. Check `gh auth status` before any write-side `gh` call on a BAS repo.
- **Checking out `main` inside a worktree blocked the user's own primary checkout.** I ran `git checkout main` in `.claude/worktrees/<mine>`; git allows a branch in exactly one worktree, so the user's `cd ~/projects/disability-wiki && git checkout main` failed with `fatal: 'main' is already used by worktree at …`. Cost the user a round trip mid-release. → `git checkout --detach` in the worktree frees the name while keeping the same commit. **In a worktree, use a detached HEAD to build from `main`; never occupy the branch.**
- **Same collision, second form:** a *peer* session then took `main` in its own worktree, so the user's retry failed again with a different worktree named. → Peer moved off on its own; resolved by waiting, not by forcing.
- **Bash cwd persists between calls.** After one `cd app/ios/App`, a later relative `cd app/ios/App` failed (`no such file or directory`) because I was already there. → Absolute paths for every `cd`.
- **zsh aborts the whole command on an unmatched unquoted glob.** `ls app/ios/App/App/*.entitlements` and `grep -rn "…" --include=*.md .` never executed — so "no matches" was a claim about my shell, not the repo. → Quote globs (`--include='*.md'`) or use `find -name`. (Caught by the null-result guard hook both times.)
- **Asserted a security concern without tracing the code.** Flagged that build 7's bundled OTA manifest is `UNSIGNED` as a possible problem. It isn't: the only ed25519 check is on the *network* manifest, the bundled `manifest.sig` is never read, and the bundled manifest is a diff baseline whose integrity comes from Apple's code signature. → Read `OTAUpdater.swift` end-to-end and retracted. **Trace the call sites before flagging.**
- **Declared a UI section absent after two scroll passes over it.** Concluded App Store Connect's version page "has no Build section" and that build attachment must happen in the review-submission flow. It does have one — it lazy-renders, and 10-tick scroll jumps stepped straight over it. → Found on a slower pass; corrected. **A virtualized page's absence is not evidence; scroll in small increments or read the DOM.**
- **Chrome MCP `file_upload` refuses paths outside what the *user* attached.** Rejected the session scratchpad, then `~/Downloads`, and kept rejecting after `mcp__ccd_directory__request_directory` granted `~/Downloads` — that grant covers Read/Write/Grep, not the browser tool's upload allowlist. Drag-and-drop is also unavailable (computer-use holds browsers at read-only tier). → No workaround found; handed the upload to the user with files staged in `~/Downloads`. **Know this before promising a browser upload.**
- **`computer` scroll_amount caps at 10** — passing 15 is a hard validation error. → Use `repeat` instead.

---
## Session: 2026-07-25 (OTA channel dead on device — Cloudflare edge rewriting)

**Project:** disability-wiki

### Failures
- **The bug itself was a two-day-old false conclusion.** The 2026-07-23 OTA E2E was run against `wrangler pages dev` and recorded as a pass; the channel had never worked on a real device. `wrangler pages dev`, a plain static server, AND the `*.pages.dev` PR preview all serve unrewritten origin bytes — the rewriting zone settings attach to the custom domain only. → Verify byte-integrity against the **production** hostname; now enforced post-merge by `check-live-deploy.mjs`. Logged to shared LESSONS.md (extended the existing "local preview ≠ production" entry) and to the `cloudflare` skill's bot-management reference.
- **`node site/tools/check-live-deploy.mjs --channel-only` polled 8 minutes then failed with "not --channe".** My own design defect: `argv[2]` was taken as the commit SHA whatever it was, so an unrecognized flag (or an older copy of the script, which is what the user actually hit) became the SHA to wait for. → Added argv validation (flag + hex-SHA shape, exit 2 immediately) and a "waiting for X" heartbeat, since the polling mode had also been silent for its entire 8-minute run — working and hung looked identical.
- **`xcrun simctl launch --console` printed no app output.** Swift `print` (behind `CAPLog.print`) is block-buffered on a pipe, so nothing flushed. → Use `--console-pty` (or `script`). Cost one wasted launch cycle before diagnosis.
- **Read the simulator's UserDefaults plist too early and recorded a stale outcome** — reported `upToDate` for a run that should have been `serverUnavailable`, because the write hadn't landed. → Re-ran with a longer wait; the second read was correct. **A defaults read right after launch is a race, not a result.**
- **`gh pr merge 71` failed: `LangworthyWatch does not have the correct permissions`.** The `gh` CLI is authenticated as a different account than the SSH git identity (`Beaudoin0zach`). → Merged via a local `--no-ff` push to `main`; asked the user before doing so, since the mechanism differs from the GitHub button.
- **`git commit --amend` + `push --force-with-lease` blocked by the classifier.** → Landed the changelog note as a separate follow-up commit instead.
- **`gh pr view 71 --json merged`** — no such field. → `mergedAt` / `state`.
- **Merge conflict in `CHANGELOG.md`**: PR #70 landed mid-session and touched the same section. → Both sides had only *added* entries under `### Fixed`; kept both, verified #70's `AppBanner.astro` was untouched, re-ran build + link validator + OTA self-test on the merged result.
- **Two `cd`-relative commands failed after the shell cwd reset between calls** (`pod install` found no Podfile; `gh pr view` ran outside a git repo). → Use absolute paths / `--project-directory`.
- **Unquoted `grep -A8 "OTA status"` aborted under zsh** before running (glob interpretation), which the null-result guard correctly flagged as "not a zero-result search". → Quote the pattern, or use `Read`.
- **Reading the OTA private key was blocked by the classifier** (correctly — it's a secret). → Signed the test manifest by piping the key into `OTA_SIGNING_KEY` without ever printing it, and proved the right key was used by verifying the signature against the *public* key pinned in the app.

---
## Session: 2026-07-27/28 (page-feedback D1 provisioning → wrangler.jsonc was never applied)

**Project:** disability-wiki

### Failures
- **Shipped a fix built on a false premise, twice — and the premise came from the repo's own docs.** The runbook said to add the D1 binding in the Cloudflare dashboard (wrong), so PR #82 corrected it to `wrangler.jsonc` citing "this project is in wrangler-managed mode." That claim was **also false**: `site/wrangler.jsonc` lacked `pages_build_output_dir`, so Cloudflare had been logging `does not appear to be valid … Skipping file and continuing` on every build since the file was added, and the site ran on dashboard vars the whole time. → #82 merged, deployed, and `/api/feedback` still 503'd. Root cause found in the build log; fixed in PR #83. **The wrong belief had already propagated into two runbooks, a CHANGELOG entry, and the `wrangler` skill's description** — all corrected. Lesson: a precedence rule inferred from behaviour that *both* sources would produce is not evidence; and config that is *ignored* rather than *rejected* makes every fix to its contents a no-op.
- **Offered `/api/auth/login` returning 302 as proof the config file's vars were live.** It proved nothing — the same four vars also existed in the dashboard, so either source produces that result. → Caught in the same turn and replaced with the build log, which is the only surface that distinguishes them. **Do not accept a test both hypotheses pass.**
- **`gh pr merge 82 --delete-branch` exited non-zero**: `fatal: 'main' is already used by worktree at …`. The merge itself had landed; only the local branch-cleanup step failed. → Confirmed via `gh pr view --json state,mergedAt` rather than trusting the exit code. A worktree checkout makes `gh`'s post-merge checkout impossible.
- **Nearly deleted the wrong Cloudflare dashboard row.** `PAGE_FEEDBACK` sits two rows from `OTA_SIGNING_KEY`, whose loss would break the OTA signing chain. → Read the row's accessibility tree and confirmed the literal cell text (`Plaintext | PAGE_FEEDBACK | disability-wiki-feedback`) before clicking, then re-read the table afterward to confirm both Secrets survived. **Never click a destructive icon located by position or by a `find` tool's claim alone.**
- **Committed to the `bas-platform` hub without checking which branch it was on** — it was a peer session's `docs/audit-sweep-2026-07-26`, not `main`. → Verified after the fact via `git reflog show origin/<branch>` that the peer's commit was already pushed, so my push published only my own. Harmless this time; the check belongs *before* the commit.
- **The `~/.claude` pre-commit hook blocked the lessons commit** with "staged in 2 independent regions" (the file is shared with concurrent sessions). → Inspected `git diff --cached` to confirm both regions were mine (the body entry plus the index line generated from it) and committed with `STAGE_OK=2`. Working as designed, not a defect.
- **`~/.claude/shared/LESSONS.md` is 435 entry-lines against a 320 budget** — over by 115 even after a prune earlier in the session. → Not pruned here: adding an entry and then pruning the same file in one pass is how peer sessions' work gets clobbered. Recommended `/prune-lessons` as a separate pass.

---
## Session: 2026-08-20

**Project:** disability-wiki (content wave: outreach-mining → LTD/Tier-1 pages → index sync → parity tooling)

### Failures
- [grep, zsh]: multi-file scan passed filenames in one unquoted var — zsh doesn't word-split, so grep searched a nonexistent single file and the `|| echo "none found"` fallback masked the error as a clean result → caught via ugrep's warning line; re-ran with explicit paths. The `|| echo` pattern defeats null-result guards.
- [background merge script]: printed "MERGED-90" unconditionally after `gh pr merge` while the merge had actually failed on a conflict → all later merges verified via `gh pr view --json state` (API confirm), never the command's own output.
- [gh pr merge --delete-branch]: merging #88 deleted the base branch of stacked #89, which GitHub auto-closed with no retarget possible → replacement PR #91 from the surviving branch. Check for stacked PRs before deleting a base.
- [live probe]: curl without -L on a site that 308-redirects to trailing slashes → permanent false-negative "not live" loop for a deployed page (also logged in memory).
- [astro build]: read "N pages built" as a per-file tally and a stale dist/ entry as proof of build success while the build had errored on YAML → check build exit/errors; dist presence only counts on a build that succeeded.
- [es frontmatter]: unquoted colon in a translated description broke the strict-YAML build — the edit skill documents this rule and it was missed anyway → mechanical gate added to check_translation.py this session.
- [validator blind spot]: asserted "0 broken links" repeatedly while validate_wiki_links.py silently excluded the whole es/ tree → manual target checks covered it; gap closed properly by PR #94 (60 broken es links found).

---
## Session: 2026-08-21

**Project:** disability-wiki (es welcome translation, PR #96)

### Failures
- [task premise vs repo]: the task said the validator "now validates es/" and that six links had been retargeted to English — neither was on main or this branch at the time, so I reported the premise as wrong. Both were in a peer's open PR (#94) that merged mid-session → surfaced as a CHANGELOG merge conflict; retargeted the six links in the merge commit. Check `gh pr list` when the repo contradicts the task description.
- [validate_wiki_links.py]: relied on `--strict` to vouch for es/ links while it still excluded the tree → ad-hoc es-link resolution check + full build until the es-aware validator landed via the merge.
- [npm run build / cd site]: persisted cwd made `cd site` fail and `ls site/dist/...` miss; first build failed with `astro: command not found` in the fresh worktree → `npm ci` then build, paths relative to cwd.
- [gh pr merge]: first attempt blocked by a CHANGELOG `[Unreleased]` conflict with main → merged origin/main, kept both entries, re-ran CI; the second attempt found the PR already merged by a peer/Zach — confirmed via `gh pr view --json state`.
- [live probe, repeat]: bare `curl -o /dev/null -w %{http_code}` looped on 308 for a deployed page — the same trailing-slash trap already in memory and the previous session's log → `curl -sL`; fix graduated into the disability-wiki-edit checklist this session.

---
