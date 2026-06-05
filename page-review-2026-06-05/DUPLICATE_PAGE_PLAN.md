# Duplicate-page consolidation plan (proposed — needs your approval)

The site has two parallel "getting started" trees (`/start/*` and `/foundations/*`) plus a set of capital-letter `/Rights/*` and `/Healthcare` pages that duplicate lowercase ones. Because Wiki.js paths are **case-sensitive**, the capital versions are genuinely separate live pages. Recommendations below; nothing applied yet.

How to act on each: in Wiki.js you can either **delete** the non-canonical page or, better, keep its slug working by replacing its body with a short redirect note linking to the canonical page (Wiki.js Community edition has no built-in redirect, so a stub-with-link is the safe option). Check inbound links first (the nav uses `/foundations/*`).

## /start/* vs /foundations/* (nav points to /foundations)
| Topic | Canonical (keep) | Redirect/retire | Why |
|---|---|---|---|
| Disability Models | **foundations/disability-models** (17.5k, newer) | start/disability-models (13k) | Foundations is newer & longer; nav uses it |
| For Allies | **foundations/for-allies** (14.7k, newer) | start/for-allies (9.3k) | Same |
| How to Use | **start/how-to-use** (16k) | foundations/how-to-use-this-wiki (3.2k) | ⚠️ Reversed — the start version is far more complete |
| What is Disability | **review needed** | — | foundations 9.3k vs start 13.2k — start is longer but older; merge best of both |
| Accessibility Statement | **start/accessibility-statement** (12k) | accessibility-statement (root, 8k) | Start version is more complete |

→ Recommended: before retiring any `/start/*` page, diff it against its `/foundations/*` twin and graft anything unique into the canonical page. "How to Use" and "Accessibility Statement" especially — the `/start` version is the better one there.

## Capital-case duplicates (Wiki.js treats as separate pages)
| Capital page (retire) | Canonical lowercase (keep) |
|---|---|
| Rights/North-America/US/ADA | rights/us/ada |
| Rights/North-America/US/Fair-Housing | rights/us/fair-housing-act |
| Rights/Overview | rights/index |
| Rights/Filing-a-Disability-Complaint | (no lowercase equiv — **rename** to rights/us/filing-a-complaint) |
| Rights/Finding-Legal-Aid | (no lowercase equiv — **rename** to rights/finding-legal-aid) |
| Healthcare | healthcare/index |

→ Recommended: retire the duplicated capital pages; **rename** the two `/Rights/*` pages that have no lowercase equivalent (Filing-a-Disability-Complaint, Finding-Legal-Aid) into the lowercase `rights/` tree so they match the site's convention and stay discoverable.

## Also worth fixing (separate data bug)
7 pages render raw YAML frontmatter as visible body text (the `title:/published:/tags:` block leaked into content): `archetypes/fact-checks`, `benefits/poverty-and-benefits-trap`, `benefits/proving-disability`, `crisis/abuse/recognizing-violence`, `crisis/abuse/what-is-it`, `Healthcare`, `healthcare/medical-dismissal`. Fix = delete the leading frontmatter lines from each page body. I can do this mechanically on your go-ahead.
