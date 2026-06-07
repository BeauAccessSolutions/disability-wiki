---
name: disability-wiki-accuracy
description: >-
  Fact-check and correct disability-wiki pages — verify figures, legal claims, and
  crisis/hotline numbers against primary official sources, then fix and publish.
  Use when the user wants to audit, fact-check, verify, or correct wiki content, or
  when acting on an external audit (e.g. AUDIT_RESULTS_*.md). Especially for
  benefits dollar amounts, legal rules/deadlines, and life-safety crisis numbers.
  Encodes the cross-verification discipline that caught real errors, plus the
  blanket-claim and attribution checks.
---

# Disability-Wiki Accuracy Review (Fact-Check)

This site gives real-world benefits, legal, medical, and crisis guidance — wrong
facts cause real harm. Review and fix with primary-source verification.

## Risk tiers (fix in this order)

1. **🚑 Life-safety** — crisis/hotline numbers, emergency info, suicide/abuse
   resources. A wrong number can cost a life.
2. **🔴 High** — benefits dollar amounts/eligibility, legal rules/agencies/deadlines,
   medical/controlled-substance claims.
3. **🟠 Medium** — figures that drift (premiums, thresholds), agency renames,
   structural claims.
4. **🟡 Low** — prose, descriptions, link text, formatting.

## The non-negotiable rules

- **Verify against the PRIMARY official source**, not a blog or a single AI:
  - Crisis numbers → the country's government health ministry / the service's own site
    (988lifeline.org, 988.ca, gob.mx/conasama, telemanas.mohfw.gov.in, etc.)
  - SSA/benefits → ssa.gov, cms.gov, va.gov, federalregister.gov
  - Legal → the statute, the enforcing agency (DOJ/EEOC/HHS OCR/DOT/HUD), court opinions
- **Never trust a single AI on a life-safety number.** Cross-verify (a second
  independent check) before publishing a crisis number. The audit + a verification
  pass both confirming = good; a lone claim = not enough.
- **Date-stamp drift-prone facts** and link the live source ("as of June 2026…").
- **Distinguish fact from interpretation/estimate.** Hedge estimates ("researchers
  estimate up to ~half…, an estimate from media-reported cases, not a census").
  Attribute advocacy framing.

## Recurring error patterns to hunt (found in this wiki)

- **Foreign/obsolete lead numbers** on country crisis pages (e.g. a US number leading
  a Mexico page; an old hotline as the headline). Check the *lead* contact first.
- **Blanket promises:** "All services are free, confidential, and available 24/7" and
  false "All numbers verified through official sources" footers. Soften to "cost,
  confidentiality, and hours vary by service — check each listing." Note 988-style
  emergency-services policy precisely (not "police only if you want them").
- **Stale dollar figures** (2024 values on a 2026 page); update to current and date them.
- **Self-contradiction** (a page stating two different numbers for the same thing).
- **Overstated legal claims** (e.g. "punitive damages vs. government" — not under ADA
  Title II, *Barnes v. Gorman*; "ADA excludes LGBTQ+ people" — overstated; statute
  says LGB "not impairments", and people with a disability are still protected).
- **Agency renames** (CA DFEH → Civil Rights Department; "1300"→"1323" Thailand DMH).
- **Propagated copies of one error.** The same wrong claim is often pasted across
  sibling pages. The audit flagged "one car excluded *up to a value*" on `ssi.md`;
  the identical error was also sitting unflagged on `benefits/index.md`. So when you
  confirm an error, **`grep` the exact wrong phrasing across the repo** (English
  content; exclude `es/`) and fix every copy in the same pass — don't trust that the
  audit found them all.
- **Frontmatter leaking into the body**, unbalanced code fences, `[Date]`/placeholder
  text, dead org URLs, `forms.gle` placeholders.

## Workflow

1. Scope by risk tier; read the page(s).
2. For each checkable claim, fetch the primary source (or dispatch parallel research
   agents grouped by region/domain to verify, returning value + source URL + a clear
   confirm/contradict). For life-safety, require independent cross-verification.
3. Make **targeted edits** (don't rewrite whole pages); preserve frontmatter.
4. Commit per tier with a clear message; **force-sync** life-safety fixes immediately
   (use disability-wiki-edit). Lower tiers can ride the 5-min auto-pull.
5. **Verify after:** re-check the old wrong values are gone and the new ones present.
   Then **`grep` the exact wrong phrasing repo-wide** to catch the same error pasted
   onto sibling pages, and fix those too.
6. If you changed an English page, flag its `es/` counterpart as out of sync.
7. Track progress in a status doc (e.g. AUDIT_REMEDIATION_STATUS.md) for multi-pass work.

## When acting on an external audit
Cross-check each finding yourself before applying — a second AI's audit is a strong
signal but not infallible (it can be right on the headline and slightly off on a
detail). Verify the *replacement* value, not just that the old one was wrong.
Two independent AIs agreeing on a life-safety number is the bar.
