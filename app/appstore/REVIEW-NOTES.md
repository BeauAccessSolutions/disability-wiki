# App Review — notes & questionnaire answers

Everything App Store Connect asks for at submission, pre-answered. This app is an
unusually clean review case: no account, no tracking, no data collection.

---

## App Review Information → Notes (paste into the "Notes" field)
```
Disability Wiki is a free, offline-first reference app for disability rights,
benefits, and crisis resources. No sign-in or account is required to use any
feature — please review as a guest; there is nothing gated.

Beyond a repackaged website (Guideline 4.2), the app provides native
functionality: the full content is bundled and works fully offline from first
launch; a native Crisis button on every screen and Home-screen Quick Actions
give two-tap access to hotline numbers with no network; content search works
offline; and a native content-status view shows freshness and checks for
verified updates.

Content updates: crisis information is refreshed over the air via a
cryptographically signed content channel (ed25519; the app rejects anything
unsigned). No user data is involved.

The app collects no data, uses no third-party analytics or ads, and requires no
permissions. Phone (tel:) links open the system dialer — the user always
confirms before any call is placed.
```

*No demo account needed — leave those fields blank. Contact info: your Apple
Developer contact.*

---

## App Privacy ("nutrition label") questionnaire

Answer: **"Data Not Collected."** The app has no backend that receives user data,
no analytics SDK, no accounts, and no ads. When asked "Do you or your third-party
partners collect data from this app?" → **No.**

- If asked about the OTA update mechanism: it is a one-way *download* of public
  content signed by you; the app sends no user data to fetch it (a standard HTTPS
  GET of public files). It does not constitute data collection.
- No tracking → App Tracking Transparency prompt is **not** required.

---

## Export Compliance
Already answered in the build: `ITSAppUsesNonExemptEncryption = false` in Info.plist.
The app uses only exempt encryption — HTTPS and ed25519 signature *verification*
(authentication/integrity), both within Apple's standard exemptions — so App Store
Connect will not prompt for a CCATS/year-end self-classification.

---

## Age Rating questionnaire
Expected result: **17+** (or 12+), driven by mature/suggestive-themes questions —
the content discusses abuse, self-harm, and suicide (crisis resources). Answer
honestly:
- **Medical/Treatment Information:** None (it's informational reference, not
  diagnosis or treatment) — but if you prefer to be conservative, "Infrequent/Mild"
  is defensible.
- **Mature/Suggestive Themes → Realistic depictions of... / references to suicide
  or self-harm in a supportive context:** answer per the current questionnaire;
  crisis-support references typically land the rating at 17+. That is fine and
  appropriate for the audience.
- Everything else (violence, gambling, contests, unrestricted web access): No.
  (The app has no open web browser — it serves bundled content; external links open
  in the system browser, which Apple does not treat as "unrestricted web access"
  within the app.)

---

## Content Rights
"Does your app contain, display, or access third-party content?" → the content is
your own community-built material plus references/links to public resources. Answer
**Yes** if you want to be safe, and note you have the rights to all bundled content.

---

## Pre-submission checklist
- [ ] Build 4 processed and selected on the version
- [ ] Screenshots uploaded (6.9" required; `screenshots/6.9-inch/`) — 6.5" optional
- [ ] Description / keywords / subtitle / promo text (see LISTING.md), EN + ES
- [ ] Support URL set
- [ ] Privacy Policy URL set (REQUIRED — draft in PRIVACY-POLICY.md)
- [ ] App Privacy = Data Not Collected
- [ ] Age rating questionnaire completed
- [ ] Review notes pasted (above)
- [ ] Pricing = Free
```
