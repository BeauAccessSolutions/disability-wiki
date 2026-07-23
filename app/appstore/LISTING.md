# App Store listing — Disability Wiki

Copy for the App Store Connect submission. Fill these into the product page
(English (U.S.) primary; Spanish (Mexico) localization below). Character limits noted.

---

## Field-by-field map of the version page

Every field on **App Store Connect → your app → iOS App 1.0**, in the order it
appears, with where the value lives.

| Field on the page | What to enter |
|---|---|
| **Previews and Screenshots** | See "Screenshots" below — order matters |
| **Promotional Text** | The block below (169 chars) |
| **Description** | The block below |
| **Keywords** | The block below (99 chars) |
| **Support URL** | `https://disabilitywiki.org` |
| **Marketing URL** | `https://disabilitywiki.org` |
| **Version** | `1.0` |
| **Copyright** | `2026 Beau Access Solutions` |
| **Routing App Coverage File** | Skip — maps/navigation apps only |
| **App Clip / iMessage App / In-App Purchases / Game Center** | None — skip all |
| **Build** | Add the latest processed build |
| **App Review → Sign-In Information** | **Leave "Sign-in required" UNCHECKED** (no account exists for any feature) |
| **App Review → Contact Information** | Your name / phone / email |
| **App Review → Notes** | Paste the Notes block from [`REVIEW-NOTES.md`](REVIEW-NOTES.md) |
| **App Review → Attachment** | None needed |
| **App Store Version Release** | **Manually release this version** — control when a first release goes live |

**Not on this page, but required before you can submit** (left sidebar, on the
*app* rather than the *version*): **App Privacy** → "Data Not Collected", and the
**Age Rating** questionnaire. Both answered in [`REVIEW-NOTES.md`](REVIEW-NOTES.md).

## Screenshots

Two sets are in `screenshots/`, both generated from a real build:

- **`6.9-inch/`** — 1320×2868, the native captures. Upload via *View All Sizes in
  Media Manager* → 6.9" slot.
- **`6.5-inch/`** — 1284×2778, resized from the above (aspect differs by 0.4%, so
  they're scaled and trimmed ~12px rather than distorted). These fit the 6.5" slot
  shown by default on the version page.

Apple only needs **one** iPhone size — use whichever slot your page offers.

**Upload order matters: only the first 3 appear on the app installation sheet.**
Lead with the differentiator:

1. `2-crisis-hub` — offline crisis page with the freshness banner and Crisis button
2. `3-offline-search` — search working with no connection
3. `1-home` — what the app is
4. `4-content-status` — the update mechanism

---

## App name (30 char max)
```
Disability Wiki
```
*(15 chars. Alternative if you want a keyword in the name: "Disability Wiki: Rights" — 23.)*

## Subtitle (30 char max)
```
Rights, benefits & crisis help
```
*(30 chars exactly.)*

## Promotional text (170 char max — editable without a new build)
```
Offline-first disability rights, benefits, and crisis resources — built by and for disabled people. Hotline numbers stay readable with no signal, no account, no tracking.
```
*(169 chars.)*

## Description (4000 char max)
```
Disability Wiki is a free, community-built guide to disability rights, benefits, and crisis support — created by and for disabled people, allies, and advocates. It works offline from the moment you install it, so the information you need is there when connection isn't.

WORKS WITHOUT A SIGNAL
Every crisis page — hotline numbers, abuse and safety resources, emergency planning — is saved on your device. No connection, no data, no account required. When you're online, the app keeps its crisis information current on its own.

CRISIS HELP, TWO TAPS AWAY
• A Crisis button is on every screen — one tap to hotlines and immediate-help resources.
• Long-press the app icon for quick actions: crisis help, hotlines, and abuse support, straight from your home screen.
• Global crisis hotlines organized by region and situation.

SEARCH THAT WORKS OFFLINE
Find any page — benefits, rights, housing, crisis — instantly, even with no connection.

WHAT'S INSIDE
• Benefits: SSI, SSDI, and how to apply, in plain language
• Rights & laws: the ADA, Fair Housing Act, IDEA, and how to file a complaint
• Crisis & safety: hotlines, abuse and neglect resources, emergency preparedness
• Housing, healthcare, community, and disability history and culture
• Available in English and Spanish

PRIVATE BY DESIGN
No account. No tracking. No ads. The app collects nothing about you. Reading a crisis page shouldn't cost you your privacy.

ALWAYS CURRENT
Crisis numbers and key figures are verified against primary sources, and corrections reach the app automatically — you don't have to wait for an update or even notice it happened.

"Nothing About Us Without Us." This is a living resource, built in the open.
```
*(~1,480 chars.)*

## Keywords (100 char max, comma-separated, no spaces after commas)
```
disability,disabled,SSI,SSDI,benefits,ADA,rights,crisis,hotline,988,accessibility,advocacy,offline
```
*(99 chars. Don't repeat words already in the app name/subtitle — Apple indexes those separately.)*

## Support URL
```
https://disabilitywiki.org
```

## Marketing URL (optional)
```
https://disabilitywiki.org
```

## Version
```
1.0
```

## Copyright (200 char max)
```
2026 Beau Access Solutions
```
*(App Store convention is year + rights holder, with no "©" — Apple adds it.)*

## Category
- Primary: **Reference**
- Secondary (optional): **Medical** or **Education**
  *(Reference avoids Medical's stricter review scrutiny; the content is informational, not diagnostic.)*

---

## Spanish (Mexico) localization

**Subtitle:** `Derechos, apoyo y crisis`

**Promotional text:**
```
Derechos, beneficios y recursos de crisis para personas con discapacidad, sin conexión. Los números de ayuda funcionan sin señal, sin cuenta y sin rastreo.
```

**Description (short form — mirror the EN structure if you want the full version):**
```
Disability Wiki es una guía gratuita y comunitaria sobre derechos, beneficios y apoyo en crisis para personas con discapacidad, creada por y para personas con discapacidad. Funciona sin conexión desde el momento en que la instalas.

FUNCIONA SIN SEÑAL
Cada página de crisis —líneas de ayuda, recursos ante el abuso, preparación para emergencias— se guarda en tu dispositivo. Sin conexión, sin datos y sin cuenta. Cuando tienes conexión, la app mantiene la información de crisis al día por su cuenta.

AYUDA EN CRISIS A DOS TOQUES
Un botón de crisis en cada pantalla y acciones rápidas desde la pantalla de inicio.

PRIVADA POR DISEÑO
Sin cuenta, sin rastreo, sin anuncios. La app no recopila nada sobre ti.
```

---

## Screenshot captions (overlay text, if you frame them)
6.9" screenshots are in `screenshots/6.9-inch/` (1320×2868). Suggested captions:
1. **1-home** — "Built by and for disabled people"
2. **2-crisis-hub** — "Crisis help works offline — no signal needed"
3. **3-offline-search** — "Search everything, even with no connection"
4. **4-content-status** — "Crisis info stays current, automatically"

*(App Store accepts bare screenshots too; captions are optional but lift conversion.)*
