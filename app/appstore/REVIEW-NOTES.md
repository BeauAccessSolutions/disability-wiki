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

- ⚠️ **If a reviewer raises the "Was this page helpful?" section of the privacy
  policy:** that is a **website-only** feature and is not present in the app. The
  linked policy at `disabilitywiki.org/privacy` covers both surfaces and says so
  explicitly ("The app never asks"). The widget is gated off natively — it is not
  rendered under the `capacitor://` origin — so the app still transmits nothing but
  a signed content-update download. "Data Not Collected" remains the correct answer.
  Added 2026-07-27; the policy changed while build 7 was in review, so expect the
  question.

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

**Actual result: 16+** (entered and saved 2026-07-25), driven by Mature Themes plus
the medical declaration. Apple's current scale has no 17+ tier — devices on OS
versions earlier than 26 show the equivalent 17+. Korea 15+, Brazil per its own
board. That is correct and appropriate for an adult reference resource about abuse,
crisis, and rights. **Do not engineer it lower** — but do keep it *accurate*: the
first pass entered four answers that didn't match the measured table below
(Profanity Infrequent, Drugs Frequent, Sexual Content Infrequent, and Realistic
Violence **None**), which inflated the result to 18+ *and* under-declared violence.
Correcting all four to the measured values is what produced 16+. It also dropped the
local-law sale restriction from 7 countries to none (at Reference/Education
categories).

⚠️ Answering **Frequent** to "Medical or Treatment Information" makes App Store
Connect require a **Regulated Medical Device Declaration** (App Information →
App Store Regulations & Permits). Answer: **No** — the wiki gives management
*information*, and has no diagnosis, monitoring, or treatment function. Left for
Zach to attest personally.

Every answer below was **measured against the content**, not estimated. Counts are
English pages; `es/` mirrors them.

### In-app controls and capabilities — all NO
| Question | Answer | Basis |
|---|---|---|
| Parental Controls | No | No such feature |
| Age Assurance | No | No age-verification mechanism |
| **Unrestricted Web Access** | **No** | **Verified on device 2026-07-23:** tapping an external link opens **Safari**, not an in-app browser. The app serves bundled content from its own local origin and has no way to browse arbitrarily inside the app |
| User-Generated Content | No | The in-app contribute form is replaced at build time with a hand-off to the website; nothing user-submitted is created or shown in the app. **Revisit if the deferred in-app contribution flow ships** |
| Social Media | No | No feeds or interaction |
| Social Media Disabled Under 13 | No | Moot — no social media |
| Messaging and Chat | No | No user-to-user communication |
| Advertising | No | No ads |

### Mature Themes
| Type | Answer | Basis |
|---|---|---|
| Profanity or Crude Humor | **None** | Zero profanity found across all pages. The 9 occurrences of "retard*" are historical proper nouns being named and retired (*UN Declaration on the Rights of Mentally Retarded Persons, 1971*; Denmark's *Mental Retardation Act, 1959*; "formerly called 'mental retardation,' a term now considered offensive") — language history, not vulgarity |
| Horror/Fear Themes | **None** | The category targets horror as a genre device. Difficult factual material (eugenics, abuse) is presented supportively with content notes — distressing subject matter is not horror themes |
| Alcohol, Tobacco, Drug Use or References | **Infrequent** | 49 / 712 files (~7%), clustered in `crisis-hotlines/`; context is service *referral* ("numbers for mental health, substance use, self-harm…"), not depiction of use |

### Medical or Wellness
| Type | Answer | Basis |
|---|---|---|
| **Medical or Treatment Information** | **Frequent** | **55 of 75** pages in `conditions/`, `healthcare/`, `daily-living/`, `crisis/` give explicit management guidance ("Treatment focuses on managing symptoms…", "Pacing is essential"). Conditions and Healthcare are top-level nav sections, so users encounter this routinely |
| Health or Wellness Topics | **Yes** | Pacing, energy management, self-care, cooking and nutrition — a core section |

> ⚠️ **Correction.** An earlier version of this file said Medical/Treatment
> Information was "None (informational reference, not diagnosis or treatment)."
> That was written from impression before the content was measured, and it was
> wrong. "Not diagnosis" is true, but the definition covers **management**, which
> this wiki does extensively. Declare **Frequent**.

### Sexuality or Nudity
| Type | Answer | Basis |
|---|---|---|
| **Mature or Suggestive Themes** | **Frequent** | 45 files reference sexual abuse/assault/violence; `crisis/` is a 28-page top-level section (suicide, self-harm, abuse); `history/` covers forced sterilization and institutionalization. Squarely "real-world issues… complex, intense, or sensitive" |
| Sexual Content or Nudity | **None** | `relationships/sexuality-and-reproductive-health.md` is health education and rights advocacy ("the same rights to sexual health… reproductive choice"; "Say 'I need STI testing'"), not *depiction* of sexual behavior |
| Graphic Sexual Content and Nudity | **None** | Nothing explicit exists |

### Violence
| Type | Answer | Basis |
|---|---|---|
| Cartoon or Fantasy Violence | **None** | No fiction, games, or fantastical content |
| **Realistic Violence** | **Infrequent** | ~7 pages describe physical harm (`crisis/abuse/`, `relationships/abuse-safety-and-consent`, a few provider pages), written so readers can *recognize* abuse happening to them. Descriptions exist → not None; concentrated in one subsection → not Frequent |
| Prolonged Graphic or Sadistic Realistic Violence | **None** | Nothing prolonged or graphic; the project ran a deliberate "sensationalism sweep" removing lurid framing from crisis pages |
| Guns or Other Weapons | **None** | Zero real weapons references across all pages. The single regex match is the metaphor "using disability as guilt weapon" |

### Gambling / contests
All **None**.
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

Engineering side (verifiable from this repo — all green as of 2026-07-25):
- [x] Build 6 archived and accepted by App Store Connect (2026-07-24, upload state
      `success`; archive stamp `6059a18` == its commit)
- [x] OTA channel live and signed — `/ota/manifest.sig` verifies against the pubkey
      pinned in `OTAUpdater.swift`, so the key ceremony is done and updates activate
- [x] Privacy policy live at https://disabilitywiki.org/privacy
- [x] Screenshots generated (`screenshots/6.9-inch/` + `6.5-inch/`)

App Store Connect console (verified in the console 2026-07-25):
- [x] Build 6 processed ("Ready to Submit") and attached to version 1.0
- [x] Screenshots uploaded — 4 at the 6.5" slot; ES localization inherits them
- [x] Description / keywords / subtitle / promo text, **EN + ES (Spanish (Mexico))**
- [x] Support + Marketing URL, Version 1.0, Copyright
- [x] Privacy Policy URL set to https://disabilitywiki.org/privacy
- [x] App Privacy = Data Not Collected (published)
- [x] Age rating questionnaire completed → **16+** (see correction note above)
- [x] Review notes pasted; Sign-in required **unchecked**; contact info filled
- [x] Pricing = Free, availability = all 175 countries or regions
- [x] Primary category **Reference**, secondary **Education**
- [x] Content Rights = yes, rights held
- [x] App Store Version Release = **Manually release this version**
- [x] App Accessibility draft: Larger Text, Dark Interface, Sufficient Contrast,
      Reduced Motion (iPhone). VoiceOver deliberately NOT claimed until the
      real-device pass. Apple only lets you **Publish** this after the app is
      released — do it then.
- [ ] **Regulated Medical Device Declaration** — required because Medical/Treatment
      Information is "Frequent". Answer **No**. Zach's own attestation
- [ ] **Digital Services Act trader verification** (App Information → App Store
      Regulations & Permits). Needed for EU distribution; publishes trader contact
      details, so Zach decides what to enter

Still to do (on a real iPhone, from the TestFlight build — the simulator cannot
answer any of these):
- [ ] Home-screen quick actions appear in the icon long-press menu and deep-link
- [ ] A `tel:` link raises the system dial prompt
- [ ] System text-size changes scale the content (Dynamic Type bridge)
- [ ] Crisis pages surface in Spotlight search
