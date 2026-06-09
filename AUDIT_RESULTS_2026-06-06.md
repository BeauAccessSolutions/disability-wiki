---
title: Audit Results
description: Internal results of the independent audit scoped in AUDIT_SCOPE_2026-06-06.md. Not for publication.
published: false
tags:
editor: markdown
---

# Audit Results — AI-generated/edited content (2026-06-06)

This audit checked the highest-risk claims in `AUDIT_SCOPE_2026-06-06.md` against
current primary sources, reviewed the Tier 2 essays and pending branch, and ran
the repository's structural checks. Findings are ordered by severity.

## 🔴 High — correct before relying on the page

### `benefits/us/ssi`

- **SSI is not taxable income.** The page says, “SSI is taxed as federal income
  assistance.” SSI payments are not taxable. Rewrite this sentence.
- **The gifts myth is backwards.** “Most gifts don't count; only $20/month of
  gifts count” is false. Cash gifts generally count as unearned income; the
  general income exclusion can exclude the first $20 of income in a month.
- **In-kind food is outdated.** Food stopped being included in SSI in-kind
  support and maintenance calculations effective September 30, 2024. Shelter
  support can still reduce SSI.
- **The resource exclusions are inaccurate.** One vehicle per household and
  most personal belongings/household goods are excluded. The page incorrectly
  says one car is excluded only “up to certain value” and lists “most valuable
  personal property” as countable.
- **SGA needs an application-stage caveat.** SSA applies the $1,690 non-blind
  SGA test when deciding whether a disability applicant qualifies. Once a
  person receives SSI, SSA calculates countable income instead; SGA is not the
  continuing-eligibility test. The page currently presents SGA as a general
  ongoing work limit.
- **Noncitizen eligibility is overstated.** “Legal resident” alone does not
  establish SSI eligibility; noncitizens must meet additional status and
  eligibility requirements.

Primary sources:
- https://www.ssa.gov/ssi/eligibility
- https://www.ssa.gov/ssi/text-income-ussi.htm
- https://www.ssa.gov/ssi/limits-exceptions
- https://www.ssa.gov/ssi/text-living-ussi.htm

### `rights/us/ada`

- **Punitive damages are not available against government entities under Title
  II.** The remedies list currently says compensatory and punitive damages are
  available in “government services cases.” Remove punitive damages from that
  category.
- **The LGBTQ+ exclusions are materially overstated.** The page says the ADA
  excludes LGBTQ+ people and broadly says “gender identity” is excluded. The
  statute's wording is narrower, and LGBTQ+ people remain protected when they
  have an ADA-covered disability. Rewrite with precise statutory language and a
  current legal caveat.

### `crisis/crisis-hotlines/north-america/canada`

- **Remove the nonexistent 9-8-8 chat route.** Canada's official 9-8-8 service
  offers calls and texts; the page repeatedly advertises `988.ca/chat`.
- **Do not promise “100+ languages.”** English and French are available 24/7;
  phone interpretation in another language may be available but is not
  guaranteed. Texting is English/French.
- **Emergency-services wording is too absolute.** “Police only involved if
  you're in immediate danger” should reflect the service's actual policy:
  emergency services are involved rarely, when there is serious imminent risk,
  and responders try other safety-planning options first.

Primary source: https://988.ca/get-help/what-to-expect

### `crisis/crisis-hotlines/europe/united-kingdom`

- **Rape Crisis number is obsolete.** Replace `0808 802 9999` with the current
  24/7 Rape & Sexual Abuse Support Line: `0808 500 2222`.

Primary source: https://rapecrisis.org.uk/get-help/want-to-talk/

## 🟠 Medium — correct or strengthen sourcing

### `rights/us/section-504`

- The July 8, 2026 accessible-medical-equipment sentence is overbroad. By that
  date, covered recipients using exam tables or weight scales must have at
  least one accessible unit of each used type. Other acquisition and scoping
  requirements began July 8, 2024; the rule does not simply require every item
  of diagnostic equipment to be accessible by July 2026.

Primary source:
https://www.hhs.gov/civil-rights/for-individuals/disability/section-504-rehabilitation-act-of-1973/ocr-detailed-504-fact-sheet/

### `rights/us/state-disability-rights-laws`

- The New York summary correctly says all employers are covered, but the later
  New York detail still says “4+ employees.” Make both sections say all
  employers.
- The first California summary still names DFEH even though the later detail
  correctly uses the California Civil Rights Department (CRD).

Primary sources:
- https://dhr.ny.gov/disability-employment
- https://calcivilrights.ca.gov/deptnamechange/

### `benefits/us/medicare`

- The audited 2026 figures are correct: Part A deductible `$1,736`, standard
  Part B premium `$202.90`, Part B deductible `$283`, maximum Part D deductible
  `$615`, and Part D out-of-pocket threshold `$2,100`.
- Remove or source the generic/brand copay ranges and Medigap monthly-price
  range; costs vary by plan and location.
- “Medicare Advantage: higher out-of-pocket costs” and “must get referrals” are
  not universal. Qualify them as plan-dependent.
- A later section still says the “donut hole coverage gap affects costs,”
  contradicting the correctly updated Part D section.
- Medicare does not generally cover bathroom safety equipment; remove it from
  the covered-equipment examples or explain the narrow exceptions.

Primary sources:
- https://www.cms.gov/newsroom/fact-sheets/2026-medicare-parts-b-premiums-deductibles
- https://www.medicare.gov/health-drug-plans/part-d/basics/costs

### `benefits/us/veterans-benefits`

- The scoped 2026 compensation, pension net-worth, clothing-allowance, and PACT
  Act claims checked out.
- The caregiver stipend range is presented as universal but stipend amounts
  depend on locality and level; source and explain it or remove the range.
- “Automatic if VA already providing prosthetic/orthotic” overstates clothing
  allowance eligibility and process.
- “TDRP typically lasts 5 years” needs updating/qualification; rules differ by
  placement date and service process.

### `rights/us/air-carrier-access-act`

- The 45-day and six-month descriptions are directionally correct but should
  track DOT's wording: airlines need not address complaints received more than
  45 days after the incident unless DOT refers them; DOT refers all
  disability-related complaints it receives within six months.

Primary source:
https://www.transportation.gov/airconsumer/disabilitybillofrights

### Tier 2 live essays

- `intersectionality/disability-and-homelessness` says researchers consistently
  estimate that around half of people experiencing homelessness are disabled.
  Definitions and populations vary substantially; current federal sheltered
  population data is closer to 35%. Add a named source and scope, or soften the
  claim.
- The other three live essays use substantial but generally hedged statistics.
  They need inline source links rather than organization names in parentheses
  before they can be considered fully audited.

### Tier 2 pending branch

- The six essays remain stubs on `main`; the completed versions are on
  `content/intersectionality-remaining-6`.
- `incarceration-and-criminalization` uses the older 2011–12 BJS estimate
  (32% of prisoners). BJS published a newer 2016 prisoner estimate of 38%;
  either update or explain why the older combined prison/jail comparison is
  retained.
- `immigration-and-refugees` correctly warns that public-charge policy is
  volatile, but its “late 2025 federal moves” sentence needs a dated primary
  source immediately beside it before merge.
- `indigenous-disability-perspectives` appropriately requests Indigenous
  disabled review. That review remains a publication-quality prerequisite.

## 🟡 Passed / low-risk observations

- `daily-living/adhd-medication-access`: the incorrect federal six-month
  Schedule II expiration claim and refill-timing advice were fixed. The
  one-transfer electronic-prescription rule matches DEA guidance. No dosing
  advice was found.
- `conditions/autistic-burnout`: the DSM hedge, medical rule-out note,
  qualitative-evidence caveat, non-guaranteed recovery language, and
  emergency-services disclosure are present. The Clarey et al. 2025 citation
  is valid.
- `rights/us/ada`: the 2024 Title II web-rule dates and thresholds checked out.
- `rights/us/section-504`: the web/mobile deadlines, Section 503 `$20,000`
  threshold, QALY protection, and *Cummings* emotional-distress caveat checked
  out.
- UK Switchboard, HOPELINE247, and Shout contact details checked out.
- Canada 9-8-8 call/text number and Hope for Wellness number checked out.

## Structural audit

- The bundled `scripts/validate_wiki_links.py` is misconfigured:
  `BASE_DIR = Path(__file__).parent / 'disability-wiki'`, so running it from
  this repository scans zero files and then fails trying to write inside
  `scripts/`.
- When run against the repository through a temporary compatibility path, it
  reports 677 broken links, but that count includes documentation examples,
  image paths, and intentional redirects. The validator needs repair before its
  totals can be trusted.
- Six Tier 2 pages are currently published stubs on `main`.
- The user-created untracked `es/` tree was not modified or included in this
  audit.

## Tier 2 detailed audit

Scope: all four complete Tier 2 essays on `main`, plus all six complete essays
on `content/intersectionality-remaining-6`. The six corresponding files on
`main` are still stubs. No Tier 2 page was edited during this audit.

### 🔴 Publication blockers

#### `intersectionality/rural-disability` (pending branch)

- Remove “friends sharing medication” from the examples of rural mutual aid.
  Sharing prescription medication can be dangerous and unlawful; the page
  should not normalize it.
- The WHO 2011 report does not support the claim that a “large majority” of
  disabled people in developing countries live in rural areas. It documents
  rural access barriers and major data gaps, but not that population estimate.
  Remove the claim unless a direct, reliable source is found.

#### `intersectionality/indigenous-disability-perspectives` (pending branch)

- The IHS sterilization sentence misstates the government finding. GAO found
  that reviewed IHS areas were generally not complying with IHS consent
  regulations; it did not report violations of a “court moratorium.” Replace
  that phrase and cite GAO directly.
- Claims about Indigenous knowledge, language, and disability remain
  community-specific and culturally sensitive. The page's own scope note is
  responsible, but Indigenous disabled review remains required before merge.

Primary source: https://www.gao.gov/products/hrd-77-3

#### `intersectionality/immigration-and-refugees` (pending branch)

- The “late 2025 federal moves” public-charge sentence is too vague and
  potentially misleading without a dated source. As of the latest USCIS
  materials checked, the 2022 final rule remains the operative framework,
  while health is one statutory factor considered in the totality of
  circumstances. State exactly which policy memorandum or proposal is meant
  and distinguish proposals, guidance, and effective rules.
- The Section 504 statement is directionally sound because the statute covers
  federally conducted executive-agency programs, including DOJ, but it should
  cite the applicable agency rules and avoid implying that accommodations are
  automatically delivered or enforced uniformly in every proceeding.

Primary sources:
- https://www.uscis.gov/green-card/green-card-processes-and-procedures/public-charge/public-charge-resources
- https://www.justice.gov/archives/usam/archives/usam-1-11000-nondiscrimination-basis-disability

### 🟠 Correct or source before merge

#### `intersectionality/disability-and-homelessness` (live)

- “Researchers consistently estimate around half” is not a defensible
  universal estimate. Disability definitions, sheltered/unsheltered status,
  and survey methods materially change the result. Use a named dataset and
  population, or say that disabled people are substantially overrepresented.
- “Disabled people of color experience the highest rates of homelessness”
  needs a named, scoped source rather than a universal formulation.
- Calling homelessness a violation of CRPD Article 19 is an advocacy/legal
  interpretation, not the article's verbatim rule; attribute the
  interpretation.

Primary source gateway: https://www.huduser.gov/portal/datasets/ahar.html

#### `intersectionality/race-and-disability` (live)

- The “quarter of Native women of childbearing age” sterilization estimate is
  widely repeated but contested and not established by the cited GAO review.
  Attribute it to a specific historian/study or replace it with GAO's narrower
  documented finding.
- Attach dates and direct sources to statistics. The Black student
  identification disparity is supported by Child Trends; current CDC data
  place American Indian/Alaska Native adults at 38.7% disability prevalence;
  and 2023 Black maternal mortality was about 3.5 times the White rate.

Primary sources:
- https://www.cdc.gov/media/releases/2024/s0716-Adult-disability.html
- https://www.cdc.gov/nchs/data/hestat/maternal-mortality/2023/maternal-mortality-rates-2023.htm
- https://www.childtrends.org/publications/5-things-to-know-about-racial-and-ethnic-disparities-in-special-education

#### `intersectionality/poverty-and-class` (live)

- “Benefits systems are designed to keep disabled people poor” states intent
  as fact. Use “can keep” or “are structured in ways that keep,” unless the
  claim is explicitly attributed as advocacy analysis.
- Medicaid-loss and work-disincentive claims vary by state, program, and
  eligibility pathway. Qualify them and link to current program rules.
- “Earn less even doing the same work” needs a direct source that controls for
  occupation and relevant worker characteristics.

#### `intersectionality/incarceration-and-criminalization` (pending branch)

- Keep the BJS prison/jail prevalence comparison only with its 2011–12 date.
  BJS found 32% of prisoners and 40% of jail inmates reported a disability;
  newer 2016 prisoner data estimate 38%.
- “Roughly half of prison and jail suicides occur in solitary” needs a precise
  source and population definition or should be removed.
- “Hundreds of criminalization bills followed” after *Grants Pass* needs a
  countable source and timeframe.
- The FCC accessibility claim needs the exact order and implementation date;
  avoid suggesting every facility had videophone access immediately in 2024.

Primary sources:
- https://bjs.ojp.gov/library/publications/disabilities-among-prison-and-jail-inmates-2011-12
- https://bjs.ojp.gov/library/publications/use-restrictive-housing-us-prisons-and-jails-2011-12

#### `intersectionality/rural-disability` (pending branch)

- The hospital sentence mixes full closures with loss of inpatient services.
  USDA reports that from 2005–2023, 81 rural hospitals fully closed and 65
  converted away from acute inpatient care. Use those categories explicitly.
- Source the 20-mile/40-mile travel figures, physician-share comparison,
  AgrAbility outcome, rural prevalence figures, broadband/telehealth claim,
  and assertion that the prevalence gap remains after accounting for age.
- ADA complementary paratransit's three-quarter-mile service-area statement is
  correct, but applies as a complement to covered fixed-route systems.
- The reviewed ACL CIL overview does not itself establish the page's claimed
  “statutory rural-outreach mandate.” Cite the specific statutory provision or
  soften the wording.

Primary sources:
- https://ers.usda.gov/data-products/charts-of-note/110927
- https://www.ada.gov/law-and-regs/ada/
- https://acl.gov/programs/aging-and-disability-networks/centers-independent-living

### 🟡 Supported, with attribution improvements

#### `intersectionality/lgbtq-and-disability` (live)

- The DSM chronology is sound. Add direct sources for prevalence,
  discrimination, and conversion-therapy risk statistics.
- “Every major medical association” is an unnecessarily absolute formulation;
  name the associations or say “major medical associations.”
- `https://rad.org/` did not resolve during the link check. Confirm or replace
  it. `https://dqrc.org/` loaded successfully.

#### `intersectionality/gender-and-disability` (pending branch)

- NWLC supports the 2022 statement that 31 states plus Washington, D.C. had
  laws explicitly allowing forced sterilization. Because a 2025 NWLC item says
  30 states plus D.C., date the figure and check for legal changes before
  publication.
- The sexual-violence claims are supported: a meta-analysis found an overall
  odds ratio of 2.27 for disabled people, and a U.S. study found disabled women
  reported lifetime sexual violence at about twice the proportion of
  nondisabled women. Link these studies directly.

Primary sources:
- https://nwlc.org/resource/forced-sterilization-of-disabled-people-in-the-united-states/
- https://pmc.ncbi.nlm.nih.gov/articles/PMC9425723/

#### `intersectionality/religion-and-disability` (pending branch)

- The faith-inclusion survey supports the approximately 22% accommodation
  exclusion claim for disabled respondents, but name the 2021 survey and its
  respondent population.
- The AAPD IDAC URL redirects to a 2011 press release rather than a current
  coalition resource. Replace it with a current resource or clearly describe
  it as historical.
- The RespectAbility Jewish-toolkit URL redirects to Disability Belongs; update
  the link to its current destination.

Primary source:
https://www.disabilitybelongs.org/faith-spirituality/2021-faith-survey-jewish/

### Tier 2 coverage conclusion

- Audited all 10 Tier 2 essays: four live complete pages and six pending
  complete branch versions.
- None of the six pending essays should merge unchanged.
- The strongest pending pages are `gender-and-disability` and
  `religion-and-disability`; their remaining issues are mostly attribution,
  dating, and link maintenance.
- `rural-disability`, `indigenous-disability-perspectives`, and
  `immigration-and-refugees` require substantive corrections before merge.

## Tier 3 detailed audit

Scope: the merged `what-is-disability` page, nine redirect stubs, the reported
link/frontmatter/fence/date cleanup, and all 253 descriptions recorded in
`backups/pagereview-2026-06-05/META_APPLIED.json`. No wiki page was edited
during this audit.

### 🔴 Structural blocker

#### Broken canonical redirect: `start/disability-models`

- The redirect stub points to `/foundations/disability-models`, but no
  `foundations/disability-models.md` exists on `main` or anywhere in the
  repository's git history.
- The missing canonical path is referenced 17 times, including by `home`,
  `foundations/index`, the merged `foundations/what-is-disability`, and the
  redirect stub itself.
- Restore/create the canonical page before treating the duplicate-page
  consolidation as complete.

### 🟠 Internal links need another remediation pass

- An independent English-page scan found **48 unresolved unique internal
  paths across 195 references**, even after treating links such as `/rights`
  as valid when `/rights/index` exists.
- High-frequency unresolved targets include:
  - `/foundations/disability-models` — 17 references
  - `/community/online-communities` — 16
  - `/community/disability-specific-peer-groups` — 15
  - `/crisis/emergency-disaster-preparedness` — 14
  - `/foundations/language-terminology-identity` — 11
- A repeated mechanical path error affects condition pages: links such as
  `/benefits/us-ssdi.md`, `/benefits/us-ssi.md`, and
  `/benefits/canada-benefits.md` do not match the existing nested paths.
- Some remaining links are clearly misplaced, including
  `/crisis/crisis-hotlines/south-america/indonesia`.
- The merged `foundations/what-is-disability` page has no duplicated headings,
  but two of its related-page links are unresolved:
  `/foundations/disability-models` and
  `/foundations/language-terminology-identity`.
- The repository's bundled link validator remains unsuitable as a release
  gate because of its base-directory bug and inconsistent treatment of
  documentation, assets, casing, `.md` suffixes, and index pages.

### 🟠 Generated descriptions need editorial cleanup

- The application record contains exactly **253 generated descriptions**.
  Every recorded page still has a description; four Tier 2 descriptions were
  subsequently replaced with better custom text.
- **191 of 253** generated descriptions end in an ellipsis, frequently cutting
  off a sentence mid-thought.
- **14** end with a colon, leaving the description grammatically incomplete.
- **34 descriptions across six groups are exact duplicates.** This includes:
  - 10 intersectionality descriptions copied from the contribution footer
  - 9 country crisis pages with the same generic “call the number below” text
  - 7 crisis index/resource pages with the same generic help statement
- `Rights/Filing-a-Disability-Complaint` received the unusable description
  “2. Try Internal Process First (Usually).”
- Six fact-check descriptions are source/byline metadata rather than page
  summaries. The example-entry description also exposes `[DATE]` and
  `[Archive.org link will go here]` placeholders.
- The generic POTS/EDS/MCAS descriptions accurately reflect the pages'
  introductory language but do not identify the conditions, making them poor
  search-result descriptions.
- Seven published redirect stubs still have empty descriptions. This is low
  harm, but a short “Moved to…” description would be cleaner.

### 🟡 Targeted mechanical fixes passed

- All **seven reported frontmatter leaks** are gone:
  `archetypes/fact-checks`, `benefits/poverty-and-benefits-trap`,
  `benefits/proving-disability`, `crisis/abuse/recognizing-violence`,
  `crisis/abuse/what-is-it`, `Healthcare`, and
  `healthcare/medical-dismissal`.
- The code fences on `benefits/other-countries-benefits` and
  `benefits/us/state-benefits` are balanced. No unbalanced fenced code block
  was found on an English wiki page.
- The three targeted `[Date]` replacements on `community/index`,
  `crisis/index`, and `education/adult-and-continuing-education` are complete.
  Remaining date placeholders occur in templates/internal audit material or
  unrelated page content.
- Eight of the nine reviewed redirect stubs point to existing canonical pages.
  Their bodies are short, consistent, and preserve the prior-content notice.
- `start/what-is-disability` correctly points to the merged
  `foundations/what-is-disability` page.

### Tier 3 coverage conclusion

- The focused frontmatter, code-fence, date, and most redirect work passed.
- Tier 3 is **not fully cleared** because one redirect points to a nonexistent
  canonical page, the merged page contains two unresolved links, and the
  broader internal-link remediation left 195 unresolved references.
- The description rollout succeeded mechanically, but most descriptions should
  be treated as drafts rather than publication-quality metadata.

## Full-wiki audit expansion

The detailed content audit is now expanding beyond the original scope. Using
the same 278-page English Markdown inventory behind the earlier estimate, 21
pages had already received detailed content audits, leaving **257 pages**.

Risk-prioritized remaining inventory at expansion start:

- **26 life-safety pages:** crisis, hotline, emergency, and abuse resources
- **109 other high-stakes pages:** benefits, legal rights, healthcare,
  conditions, education, employment, housing, transport, relationships, and
  professional guidance
- **50 factual/reference pages:** history, research, foundations, technology,
  and daily living
- **40 resource/directory pages:** community, media, sports, participation,
  and glossary pages
- **32 internal/other pages:** navigation, redirects, templates, internal
  documents, and fact-check content

### Full audit batch 1 — life-safety country pages

Pages completed:

- `crisis/crisis-hotlines/north-america/united-states`
- `crisis/crisis-hotlines/north-america/mexico`
- `crisis/crisis-hotlines/asian-pacific/australia`
- `crisis/crisis-hotlines/asian-pacific/india`
- `crisis/crisis-hotlines/asian-pacific/indonesia`
- `crisis/crisis-hotlines/asian-pacific/philippines`
- `crisis/crisis-hotlines/asian-pacific/thailand`
- `crisis/abuse/abuse-resources`

Progress after batch 1: **29 detailed audits complete; 249 pages remain.**

#### 🔴 Correct immediately

##### `crisis/crisis-hotlines/north-america/mexico`

- The page's lead crisis contact is the U.S. number `1-800-SUICIDE`, not a
  Mexican national service. It also lists the obsolete U.S.
  `1-800-273-8255` number.
- Replace the lead contact with Mexico's national **Línea de la Vida:
  800-911-2000**, available 24/7 for mental-health, emotional-crisis, suicide
  risk, and substance-use support.
- Remove blanket claims that all listed services are free, confidential, and
  available 24/7.

Primary source:
https://www.gob.mx/conasama/articulos/linea-de-la-vida-800-911-2000

##### `crisis/crisis-hotlines/asian-pacific/india`

- The page omits India's national Tele-MANAS service and instead leads with
  AASRA. Add **Tele-MANAS: 14416 or 1800-89-14416**, a national toll-free
  24/7 service available in multiple Indian languages.
- The page's claims that iCALL is 24/7, that AASRA offers WhatsApp, and that
  all listed services are free and 24/7 require direct verification or
  removal.

Primary source:
https://www.mohfw.gov.in/?q=en/press-info/8648

##### `crisis/crisis-hotlines/asian-pacific/indonesia`

- The page leads with `Telp Teman Sejiwa (021) 7588-8888`, while the current
  Indonesian Ministry of Health resource is **Healing119.id / call 119
  extension 8**. Replace the lead service and verify every legacy number.
- `119` itself is the national medical emergency service; clearly distinguish
  emergency dispatch from the mental-health extension.
- Remove blanket confidentiality, free-service, and 24/7 promises unless each
  listed service supports them.

Primary sources:
- https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/FAQ_Cegah_Bunuh_Diri%2C_Dukung_Kesehatan_Jiwa__Kenali_Layanan_Healing119.id.pdf
- https://kemkes.go.id/id/layanan/psc-119

##### `crisis/crisis-hotlines/asian-pacific/philippines`

- The page leads with old Hopeline landline numbers and a Hopeline chat URL.
  Replace the lead listing with the current **National Center for Mental
  Health Crisis Hotline: 1553**, plus current mobile/landline routes from an
  official Department of Health source.
- Remove the unsupported claim that every listed service is free,
  confidential, and available 24/7.

Primary source:
https://bicol.doh.gov.ph/health-events/september-10-is-world-suicide-prevention-day-2/

##### `crisis/crisis-hotlines/asian-pacific/thailand`

- The page leads with `02-713-6791` and calls `1300` the Department of Mental
  Health line. Thailand's Department of Mental Health identifies **1323** as
  its free, 24-hour mental-health hotline.
- Replace the lead listing with 1323 and independently verify the Samaritans,
  emergency, abuse, child-protection, and disability-resource numbers.

Primary source: https://dmh.go.th/

##### `crisis/crisis-hotlines/north-america/united-states`

- Trans Lifeline is incorrectly listed as 24/7. Its current published hours
  are Monday–Friday, 10 a.m.–6 p.m. Pacific.
- “Police only called if you're in immediate, life-threatening danger” is too
  absolute. 988 says identifiable information may be shared in rare imminent
  risk cases, when otherwise required by law, and under valid warrants or
  court orders; individual centers also have their own policies.
- “All services listed are completely free” and the final statement that all
  services are available 24/7 are false as universal claims.
- SAMHSA's National Helpline is a treatment-referral and information service,
  not counseling; label it accordingly.

Primary sources:
- https://translifeline.org/hotline/
- https://988lifeline.org/confidentiality/
- https://www.samhsa.gov/find-help/helplines/national-helpline

##### `crisis/abuse/abuse-resources`

- The UK Rape Crisis number `0808 802 9999` is obsolete. Replace it with the
  current 24/7 Rape & Sexual Abuse Support Line: `0808 500 2222`.
- The page repeats many legal, reporting, and service claims across countries;
  those sections need jurisdiction-specific sourcing in a later legal pass.

Primary source: https://rapecrisis.org.uk/get-help/want-to-talk/

#### 🟠 Qualify broad promises

##### `crisis/crisis-hotlines/asian-pacific/australia`

- The core Lifeline contact routes checked out: call `13 11 14`, text
  `0477 13 11 14`, or use chat, all available 24/7.
- The page's final statement that **all** listed services are free or
  low-cost, confidential, and available 24/7 is contradicted by its own
  listings, including QLife's limited hours. Replace it with
  service-specific wording.
- Remove “local call rate only” for Lifeline; Lifeline currently describes its
  call, text, and chat services as free.

Primary source:
https://www.lifeline.org.au/get-help/national-services/lifeline-crisis-support

### Full audit batch 2 — Africa and global overview pages

Pages completed:

- `crisis/crisis-hotlines/africa/kenya`
- `crisis/crisis-hotlines/africa/nigeria`
- `crisis/crisis-hotlines/africa/south-africa`
- `crisis/crisis-hotlines/africa`
- `crisis/crisis-hotlines/north-america`
- `crisis/global-crisis-hotlines`

Progress after batch 2: **35 detailed audits complete; 243 pages remain.**

#### 🔴 Correct immediately

##### `crisis/crisis-hotlines/africa/kenya`

- The detailed page leads with `0800 721 100`, but the Kenya Red Cross
  emergency and tele-counselling route documented in Kenyan clinical guidance
  and the regional wiki page is **1199**. Replace the lead number with 1199
  unless an authoritative source for `0800 721 100` is produced.
- The page claims every listed service is free, confidential, and available
  24/7. It also promises that police are involved only for immediate danger
  and that Kenya Red Cross provides confidential LGBTQ+ support. These
  universal promises are unsupported and should be removed.
- “All numbers verified through official Kenyan sources” is not accurate.

Primary source:
https://www.mntrh.go.ke/sites/default/files/2024-10/NATIONAL%20CLINICAL%20GUIDELINES%20NEW.pdf

##### `crisis/crisis-hotlines/africa/nigeria`

- The detailed page is built around “Lifeline Nigeria” at
  `+234-809-063-0000`, but the audit could not verify the organization, number,
  claimed email domain, 24/7 availability, language coverage, or service
  descriptions. Remove it as the lead resource unless authoritative evidence
  is supplied.
- Nigeria's national emergency number is **112**. The page's suggestion that
  `911` works in some areas should be removed unless specifically sourced.
- The regional page identifies **She Writes Woman: 0800 800 2000** as a
  toll-free mental-health line. A current Nigerian mental-health directory
  also lists 112 and other support options. Rebuild the page around currently
  verifiable resources.
- Remove promises that all listed resources are free, confidential, 24/7,
  multilingual, and safe for LGBTQ+ callers.

Source gateway:
https://www.nigerianmentalhealth.org/helplines

##### `crisis/crisis-hotlines/africa/south-africa`

- `10177` is an ambulance number, not a combined police/ambulance number and
  not a gender-based-violence line. Police emergencies use `10111`; cellphones
  can use `112`.
- Remove `10119` as a suggested SAPS emergency number unless a current
  provincial source is supplied.
- The page says all major services run 24/7 and all services are free or
  low-cost and confidential. Those promises are unsupported.
- The detailed page and regional page disagree about SADAG hours and numbers.
  Reconcile them against current SADAG materials before retaining a lead
  recommendation.

Primary sources:
- https://www.saps.gov.za/services/cc_10111.php
- https://www.westerncape.gov.za/health-wellness/know-who-you-can-call-emergency
- https://www.sadag.org/images/2025/PDFs/How_To_Contact_SADAG.pdf

##### `crisis/global-crisis-hotlines`

- The “countries with no verified crisis hotlines” warning contradicts the
  regional pages: the global page says Ethiopia and Zimbabwe have no telephone
  crisis lines, while the Africa page lists two Ethiopian hotline numbers and
  Lifeline Zimbabwe. Resolve the contradiction or say that verification is
  incomplete.
- The Indonesia detailed-page link incorrectly points to
  `/crisis/crisis-hotlines/south-america/indonesia`; the actual page is under
  `asian-pacific`.
- The page says `911` works in “most Caribbean/Central America” countries.
  Emergency numbering varies substantially and this broad claim is unsafe
  without a country-by-country source.
- The “verified December 2025” claim is undermined by the obsolete and
  contradictory contacts found throughout the linked regional and detailed
  pages. Remove the verification badge until a documented re-verification is
  complete.

#### 🟠 Regional pages require systematic re-verification

##### `crisis/crisis-hotlines/africa`

- The regional page is more accurate than several detailed pages, but it still
  contains hundreds of high-stakes service, hours, and emergency-number claims
  without inline sources.
- Links for the Nigeria and South Africa detailed pages incorrectly use
  `/crisis/nigeria` and `/crisis/south-africa`.
- The South Africa listing conflicts with the detailed page about SADAG's
  number and hours. The Kenya listing correctly uses 1199, exposing the
  detailed Kenya page's bad lead number.
- The page says Zimbabwe has a Lifeline service, contradicting the global
  page's claim that Zimbabwe has no telephone crisis line.
- “African Union Mental Health Commission” needs verification; the audit did
  not find a clearly identifiable current body matching that name.
- The heading link `### Other Countries](#other-african-countries)` is
  malformed.

##### `crisis/crisis-hotlines/north-america`

- The Canada section retains the legacy Crisis Services Canada
  `1-833-456-4566` and `45645` text route alongside 988. Verify whether those
  routes remain supported before recommending them.
- “Both [US and Canada 988] are ... confidential” is too absolute. Each
  service has exceptions and distinct policies.
- The regional page contains dozens of Caribbean and Central American contact
  and emergency numbers without inline sources. Because several country-detail
  pages were already materially outdated, these listings need
  country-by-country re-verification before the page can carry a current
  accuracy claim.
- The page's top-level “help is available immediately, confidentially, and
  without judgment” statement is a promise the wiki cannot make for every
  listed service.

#### 🟡 Supported observations

- The global page correctly identifies Trans Lifeline's current weekday hours.
- The global page correctly identifies India Tele-MANAS `14416` and Indonesia
  `119` extension 8, confirming that the corresponding detailed pages are
  outdated.
- Nigeria's `112`, Kenya Red Cross `1199`, and South Africa's emergency
  distinction among `10111`, `10177`, and cellphone `112` are supported by the
  sources reviewed.

---

## Full audit expansion — batch 3 (12 pages)

Detailed content and safety audit completed for:

- `crisis/crisis-hotlines/south-america/argentina`
- `crisis/crisis-hotlines/south-america/brazil`
- `crisis/crisis-hotlines/south-america`
- `crisis/crisis-hotlines/asian-pacific`
- `crisis/crisis-hotlines/europe`
- `crisis/index`
- `crisis/disabled-crisis-support`
- `crisis/emergency/emergency-preparedness`
- `crisis/emergency/medical-cards`
- `crisis/abuse-neglect-exploitation`
- `crisis/abuse/recognizing-violence`
- `crisis/abuse/what-is-it`

Progress after batch 3: **47 detailed audits complete; 231 pages remain.**

#### 🔴 Correct immediately

##### `crisis/crisis-hotlines/south-america/argentina`

- The page tells a person in crisis to call Teléfono de la Esperanza at
  `(011) 4758-2142`, but the audit could not verify its claimed national,
  free, confidential, 24/7 service. Argentina's official emergency directory
  identifies **Línea 135** for suicide assistance. Make 135 the supported lead
  route unless a current authoritative source supports the other number.
- `911` is the national emergency center, but the page incorrectly says it is
  the ambulance number and says `100` is police in some places. The official
  directory identifies **107 for medical emergencies** and **100 for
  firefighters**.
- ANDIS is expanded incorrectly as “Asociación Nacional de Discapacitados.” It
  is Argentina's **Agencia Nacional de Discapacidad**.
- Remove the blanket claim that every listed service is free, confidential,
  and available 24/7. The page's own hours and the official sources do not
  support that promise.

Primary sources:
- https://www.argentina.gob.ar/tema/emergencias
- https://www.argentina.gob.ar/node/192388

##### `crisis/abuse/what-is-it`

- The instruction “Report suspected abuse. You're legally required to; do it”
  is false as a universal rule and can create danger. Reporting duties vary by
  jurisdiction, type of abuse, and the reporter's role. Replace it with
  jurisdiction-specific guidance that acknowledges safety planning and the
  possible risks of state intervention.
- “Video relay or TTY available on most hotlines” is unsupported. Accessibility
  must be documented service by service.
- Claims about guardianship laws giving abusers sexual control, broad patterns
  across the “Global South,” and the disability movement “always” centering
  abuse prevention need precise sources and narrower wording.
- “National Disabled Women's Network” needs a correct organization name and
  link. The malformed `[[Restraining Orders & Protection:****` link and many
  other unresolved wiki-style links must be repaired.

Primary source on U.S. mandatory-reporting variation:
https://www.childwelfare.gov/topics/safety-and-risk/mandated-reporting/

#### 🟠 High-stakes corrections and re-verification

##### `crisis/crisis-hotlines/south-america/brazil`

- The core emergency routes `188` (CVV), `190` (police), `192` (ambulance),
  and `193` (fire) are plausible and consistent with current official/public
  materials, but all WhatsApp routes, hours, and service-unit counts need
  current inline sourcing before the page can claim verification.
- “Authorities contacted only if immediate danger” is an unsupported promise.
  Explain each service's documented privacy and escalation policy instead.
- Retain and source the federal rights-reporting routes **Disque 100** and
  **Ligue 180**; distinguish reporting services from emotional-crisis support.

Primary source:
https://www.gov.br/mdh/pt-br/navegue-por-temas/disque-100-e-ligue-180/disque-100-e-ligue-180

##### `crisis/crisis-hotlines/south-america`

- The Brazil detailed-page link incorrectly points to `/crisis/brazil`; the
  actual page is under `/crisis/crisis-hotlines/south-america/brazil`.
- The regional Argentina listing correctly uses 135 and identifies limited
  hours, while the detailed Argentina page leads with a different, unverified
  number and promises 24/7 service. Reconcile the pages.
- The page contains dozens of high-stakes country contacts and emergency
  numbers without inline sources. Complete country-by-country verification
  before describing the list as current.
- “Help is available immediately, confidentially, and without judgment” is an
  unsupported promise across all listed services.

##### `crisis/crisis-hotlines/asian-pacific`

- Detailed-page links for Australia and Indonesia use incorrect `/crisis/...`
  paths instead of the `crisis-hotlines/asian-pacific` paths.
- The regional page omits India's current Tele-MANAS routes `14416` and
  `1800-89-14416`, Indonesia's Healing119 route `119` extension 8, and the
  Philippines' NCMH route `1553`; its linked detailed pages were already found
  to be outdated.
- Emergency-number and service claims for Pakistan, Sri Lanka, and the many
  countries without detailed pages need systematic official-source review.
  Do not retain a current-verification claim based on this unsourced list.

##### `crisis/crisis-hotlines/europe`

- `112` is correctly described as the free EU emergency number for ambulance,
  fire, and police. The page should not imply that 112 operators can always
  connect callers to local mental-health crisis services; the EU's official
  description makes no such guarantee.
- Hundreds of service numbers and hours lack inline sources and need
  country-by-country re-verification. Remove universal promises about
  immediate, confidential, nonjudgmental support.

Primary source:
https://digital-strategy.ec.europa.eu/en/policies/112

##### `crisis/index`

- The Canada quick route still prioritizes the legacy `1-833-456-4566`
  service rather than 988. Verify the legacy route and make 988 the supported
  national lead.
- Three links to `/crisis/emergency-disaster-preparedness` are broken; the
  actual page is `/crisis/emergency/emergency-preparedness`.
- Remove unsupported claims that all resources were verified for
  accessibility, that services have “disability-aware staff,” and that crisis
  lines are “line-accessible with mobility devices.”
- Verify whether “DisabilityWiki Community Crisis Response Team” is a real
  maintainer identity before publishing it. Reconcile the duplicate “Last
  updated” dates of June 2026 and January 2026.

##### `crisis/emergency/emergency-preparedness`

- Verify the “Disability and Disaster Hotline” `1-800-626-4959` and “Disaster
  Assist” `1-800-018-444` before recommending them. The page gives no source
  or geographic scope for either number.
- Change “Trauma is normal response to emergency” to non-universal language,
  such as “Trauma responses are common after emergencies.”
- Equipment and medication planning is useful, but recommendations involving
  oxygen, ventilators, CPAP, backup power, and medication supplies should
  direct readers to make a plan with relevant clinicians, suppliers, and
  emergency-management authorities.
- Repair unresolved wiki-style links and add authoritative emergency-planning
  sources by jurisdiction.

##### `crisis/emergency/medical-cards`

- “Your emergency card prevents this” is an unsafe guarantee. An emergency
  card can reduce communication risk, but responders may not find, read, or
  follow it.
- The practical template is otherwise useful; add the limitation clearly and
  encourage redundant ways of carrying critical information.

##### `crisis/abuse/recognizing-violence`

- Broad claims about forced sterilization, medical violence, policing, and
  patterns across the “Global South” and Western countries require specific,
  current sources and narrower wording. The underlying risks are real, but
  the current geographic generalizations are too sweeping to publish as fact.
- Verify and correctly name “National Disabled Women's Network.” Repair the
  many unresolved wiki-style links.
- The page implies crisis numbers appear at the end in large text; ensure the
  rendered page actually provides clear, verified, geographically scoped
  routes or remove that promise.

#### 🟢 Pass with limited cautions

##### `crisis/disabled-crisis-support`

- The page appropriately avoids promises of safety, emphasizes consent, and
  tells contributors to document police-involvement policies and access needs.
- It currently describes categories and contribution standards rather than
  providing concrete disabled-led crisis resources. Clarify that scope in the
  title/introduction or add verified examples before presenting it as a
  resource directory.

##### `crisis/abuse-neglect-exploitation`

- The short overview is careful, appropriately hedged, and explicitly notes
  that involving police or state agencies can increase danger. No material
  accuracy or safety issue found.

---

## Full audit expansion — batch 4 (8 pages)

Detailed content and safety audit completed for:

- `relationships/abuse-safety-and-consent`
- `professionals/emergency-planners`
- `professionals/public-safety-officers`
- `healthcare/mental-health`
- `healthcare/medical-bias`
- `healthcare/medical-dismissal`
- `healthcare/medical-gaslighting`
- `healthcare/medical-equipment-and-at`

Progress after batch 4: **55 detailed audits complete; 223 pages remain.**

#### 🔴 Correct immediately

##### `relationships/abuse-safety-and-consent`

- The page attributes `1-800-787-3224` to Abused Deaf Women's Advocacy
  Services. That is the National Domestic Violence Hotline's legacy TTY route,
  not ADWAS's current national Deaf Hotline contact. The Deaf Hotline lists
  videophone **855-812-1001** and additional chat/email options.
- “Guardians cannot consent to sexual activity on someone's behalf” and
  “You're not required to report” are presented as universal law. Capacity,
  guardianship, and reporting rules vary by jurisdiction, age, role, and care
  setting. Retain the autonomy principle but direct readers to local legal or
  survivor advocacy.
- “Anyone can report” to Adult Protective Services and “you can report [to
  police] without pressing charges” also require jurisdiction-specific
  qualification; reporting may trigger actions a survivor cannot control.
- The page says both that mandatory reporters must report and that the reader
  is not required to report. Explain the distinction clearly and avoid giving
  individualized legal advice.

Primary sources:
- https://www.thedeafhotline.org/
- https://www.childwelfare.gov/topics/safety-and-risk/mandated-reporting/

##### `healthcare/mental-health`

- Replace Canada's legacy Crisis Services Canada `1-833-456-4566` listing and
  “988 (in many provinces)” wording with the current national **call or text
  9-8-8 anywhere in Canada** route.
- “Crisis lines (free)” is an unsupported blanket claim across services and
  countries. State cost and privacy terms only when documented for the named
  service.
- The summary of involuntary-treatment law is too broad. Criteria and process
  differ substantially by jurisdiction and may include standards other than
  danger to self or others. Rights during a hold also vary.
- Psychologists' prescribing authority and the legal effect of psychiatric
  diagnoses vary by jurisdiction. Scope all provider-role and legal-rights
  claims geographically.

Primary source:
https://988.ca/

#### 🟠 Legal, medical, and professional-guidance corrections

##### `professionals/emergency-planners`

- The page mixes sound recommendations with claims framed as universal legal
  requirements. “All public briefings must include qualified ASL interpreters,”
  a mandatory 3rd–4th-grade reading level, a `350+ lb` cot capacity, and a
  roll-in-shower rule for shelters with `50+` beds need specific authority or
  should be reframed as recommended practice. DOJ's shelter checklist supports
  the 17–19-inch cot height and 36-inch clear space, but not all of those added
  specifications.
- “Dialysis patients must receive treatment approximately every other day or
  they die” is overly absolute and medically imprecise. Explain that missed
  dialysis can become life-threatening and emergency plans must be made with
  patients' dialysis providers.
- Utility “priority reconnection lists” can create false expectations and vary
  by utility. Explain their limits.
- The page's disability/disaster hotline is supported by the named
  disability-led organization, but the associated individual-preparedness page
  lists it without identifying the organization or scope.
- Repair the broken related-page link
  `/crisis/emergency-disaster-preparedness`.

Primary sources:
- https://archive.ada.gov/pcatoolkit/chap7shelterchk.htm
- https://www.fema.gov/node/what-kind-services-are-offered-emergency-shelter

##### `professionals/public-safety-officers`

- “Service animals must be allowed everywhere the public goes—including crime
  scenes, ambulances, emergency vehicles, and holding facilities” and “never
  separate” omit important ADA exceptions. For example, an animal may travel
  separately if it would interfere with emergency treatment in a crowded
  ambulance; exclusion may also be allowed for a direct threat, lack of
  control, lack of housebreaking, or fundamental alteration.
- Effective communication is required, but a qualified interpreter is not
  automatically the required aid for every arrest or complex interaction. The
  appropriate auxiliary aid depends on the communication and circumstances.
- Source and contextualize the contested `30–50%` police-killing disability
  estimate, the arrest-rate claim, the fixed `10 seconds` processing rule, and
  the claim that Memphis CIT significantly reduced officer injuries.
- “When in doubt, assume disability” is a useful de-escalation heuristic, not a
  legal or diagnostic rule. Say so explicitly.

Primary sources:
- https://www.ada.gov/topics/service-animals/
- https://www.ada.gov/resources/service-animals-faqs/

##### `healthcare/medical-bias`

- The page places fibromyalgia, ME/CFS, functional neurological disorder, and
  IBS under “catch-all diagnoses” and says they describe symptoms rather than
  identified underlying causes. This framing is overly broad, clinically
  contentious, and can stigmatize established diagnoses. Separate diagnostic
  misuse from claims about the diagnoses themselves and cite condition-specific
  clinical sources.
- Statements implying that later recognition proves an earlier diagnosis was
  never psychological, or that normal testing may simply mean medicine has not
  caught up, need stronger uncertainty language. Normal results can be limited,
  but they can also meaningfully lower the likelihood of disease.
- Preserve the anti-dismissal framing while adding a clear boundary: new,
  worsening, or emergency symptoms require qualified medical assessment, and
  the page cannot determine which tests or diagnoses are appropriate.

##### `healthcare/medical-dismissal`

- The essay relies heavily on commercial/self-selected survey percentages
  (`94%`, `61%`, `72%`, `35%`, and `48%`) without inline links, sampling
  limitations, or clear separation from peer-reviewed prevalence evidence.
  Add direct citations and label nonrepresentative surveys as such.
- The `85%` Ehlers-Danlos participant figure and physician burnout/depression
  figures likewise need direct links and study-population context.
- Self-advocacy suggestions are generally careful, but requesting a specific
  test or referral should be framed as starting a clinical discussion, not as
  establishing that the test is needed.

##### `healthcare/medical-gaslighting`

- “Your body is telling you the truth” is validating but medically unsafe as
  an absolute. Symptoms are real experiences, while their cause and meaning
  can remain uncertain. Replace it with wording that validates symptoms without
  implying a diagnosis.
- “You can fire providers,” “you can refuse,” “you can leave,” and “you don't
  owe providers politeness” need practical/legal qualifiers for emergencies,
  involuntary treatment, continuity of prescriptions, and situations where
  leaving may create medical risk.
- Advice to insist on particular tests and to trust one's own assessment should
  encourage collaborative evaluation and second opinions, not imply that
  clinicians must provide requested testing or that patient self-diagnosis is
  necessarily correct.
- The page otherwise provides useful documentation, support-person, boundary,
  and complaint strategies.

##### `healthcare/medical-equipment-and-at`

- The U.S. Medicare summary is broadly sound: Part B covers medically necessary
  home DME and the patient generally pays 20% after the deductible when the
  supplier accepts assignment. Add those conditions directly beside the 20%
  statement; nonparticipating suppliers can cost more.
- “Schools (IDEA): remains at school (doesn't go home)” is too absolute. AT may
  need to be available at home or elsewhere when required for the student to
  receive FAPE. Replace with individualized IEP-team language.
- “Private insurance rarely covers [hearing aids] fully,” the `$2,000–7,000`
  average, Medicare SGD rental rules, and country-specific funding summaries
  need current sources and scope. Original Medicare's hearing-aid exclusion is
  supported, but Medicare Advantage benefits may differ.
- Equipment selection, repair, and used-equipment guidance should warn readers
  to involve appropriate clinicians/suppliers for devices where fit,
  programming, electrical safety, infection control, or life support matters.

Primary sources:
- https://www.medicare.gov/coverage/durable-medical-equipment-dme-coverage
- https://www.medicare.gov/coverage/hearing-aids

---

## Full audit expansion — batch 5 (6 pages)

Detailed content and safety audit completed for:

- `benefits/us/able-accounts`
- `benefits/us/benefits-overview`
- `benefits/us/family-caregiver-pay`
- `benefits/us/medicaid`
- `benefits/us/snap`
- `benefits/us/tanf`

Progress after batch 5: **61 detailed audits complete; 217 pages remain.**

#### 🟠 Benefits-rule corrections

##### `benefits/us/able-accounts`

- The page avoids giving a current age threshold even though the June 2026
  publication should state it clearly: effective **January 1, 2026**, the
  disability must have begun **before age 46** rather than before age 26.
- Explain the distinct benefit limits: up to `$100,000` in an ABLE account is
  excluded from the SSI resource calculation, while Medicaid treatment and
  plan/account limits differ. “Up to certain limits” is safe but not useful
  enough for a benefits page.
- Add a dated annual-contribution figure or a direct official lookup link, and
  explain that employed beneficiaries may qualify for an additional
  contribution. Do not imply that all account funds are risk-free investments.

Sources:
- https://www.ablenrc.org/the-able-age-adjustment-act-fact-sheet/
- https://www.irs.gov/newsroom/able-savings-accounts-and-other-tax-benefits-for-persons-with-disabilities

##### `benefits/us/family-caregiver-pay`

- “It may count as earned income” is directionally useful but incomplete.
  Certain qualifying Medicaid HCBS waiver payments for care provided in the
  caregiver's home may be excluded from federal gross income under IRS Notice
  2014-7, while employment-tax and benefit-program treatment can still differ.
  Add this caveat and direct readers to program-specific benefits advice.
- Repair the broken overview links: `/benefits/us-benefits-overview` and
  `/benefits/international-benefits-overview` do not match the repository's
  nested paths.
- The remainder is appropriately cautious about state variation and does not
  promise that a relative can be paid.

Primary source:
https://www.irs.gov/medicaidwaiverpayments

##### `benefits/us/medicaid`

- “Many SSI recipients automatically qualify” is broadly accurate, but add the
  important state distinction: some states use their own Medicaid eligibility
  criteria rather than automatic SSI-linked enrollment.
- HCBS coverage and waitlists vary by waiver, entitlement category, service,
  and state. Avoid implying that all listed community services are available
  to every enrollee.
- Repair the broken related links `/benefits/us-ssi` and
  `/benefits/us-medicare`; the actual pages use nested `/benefits/us/...`
  paths.

##### `benefits/us/snap`

- The page says some states allow higher medical-expense deductions. Federal
  SNAP rules allow qualifying elderly/disabled households to deduct allowable,
  unreimbursed medical expenses above **$35 per month**; states may implement
  approved demonstrations or standard deductions. State the federal baseline
  and explain variation precisely.
- “Everything is considered when determining eligibility and amount” is too
  broad. SNAP has countable-income/resource rules and exclusions; direct
  readers to the state agency rather than implying every benefit or asset
  counts.
- Clarify that SSI and disability benefits generally count as unearned income,
  while categorical-eligibility and household rules can change the calculation.

Primary sources:
- https://www.fns.usda.gov/snap/eligibility/elderly-disabled-special-rules
- https://www.fns.usda.gov/snap/medical-expenses-guide

#### 🟡 Pass with minor corrections

##### `benefits/us/benefits-overview`

- The high-level descriptions are appropriately cautious and materially
  accurate. Add a qualifier to “Most people end up combining several” and
  “Appeals are normal; many people are denied at first and win later,” or
  support those prevalence claims with current program data.
- SSI-linked Medicaid is correctly described as automatic only in many states,
  not all states.

##### `benefits/us/tanf`

- The page appropriately emphasizes state variation, work-rule exemptions,
  sanctions, and the need for legal-aid support. No material benefits-rule
  error found.
- Repair the broken `/benefits/us-benefits-overview` link.

---

## Full audit expansion — batch 6 (9 pages)

Detailed content and safety audit completed for:

- `benefits/us/ssdi`
- `benefits/benefit-denials-and-appeals`
- `benefits/us/state-benefits`
- `rights/us/fair-housing-act`
- `rights/us/idea`
- `rights/filing-a-disability-complaint`
- `employment/workplace-accommodations`
- `education/k12-education`
- `education/higher-education`

Progress after batch 6: **70 detailed audits complete; 208 pages remain.**

#### 🔴 Correct immediately

##### `rights/filing-a-disability-complaint`

- The education-complaint section conflates three different processes. The
  U.S. Department of Education Office for Civil Rights (OCR) enforces Section
  504 and ADA Title II, not IDEA. An IDEA State complaint generally covers an
  alleged violation from the prior **one year**; an IDEA due-process complaint
  generally uses a **two-year knew-or-should-have-known** period unless state
  law sets a different period. The page's repeated “180 days for IDEA” claim
  is wrong. OCR discrimination complaints generally use 180 calendar days.
- “Due Process Hearing (Required in most cases)” and “Mediation first (usually
  required)” are wrong. IDEA mediation is voluntary and cannot be used to deny
  or delay the right to a due-process hearing.
- The hearing timeline is incomplete. The ordinary IDEA hearing decision is
  generally due 45 days after the 30-day resolution period ends, subject to
  permitted extensions; it is not simply “usually in 45 days” from filing.
- “Try Internal Process First” can cost readers rights if understood as a
  prerequisite. OCR does not generally require use of a school's grievance
  process first, and EEOC/HUD/IDEA deadlines continue to matter while a reader
  pursues informal resolution. State the rules for each route instead of a
  general recommendation.
- The EEOC sequence is inaccurate. A private-sector ADA claimant generally
  must first file an EEOC charge and receive a Notice of Right to Sue. EEOC
  issues the notice when it closes an investigation; a claimant may request it
  earlier under specific timing rules. Filing suit is not merely the next step
  when someone is “not satisfied.”
- “ADA lawsuit: 2–3 years” is dangerously overgeneralized. ADA Title I uses
  the EEOC charge and 90-day right-to-sue deadlines described above. Other ADA
  titles borrow different limitation periods depending on the claim and
  jurisdiction. Remove the single table entry and direct readers to prompt
  legal advice.

Primary sources:
- https://www.ed.gov/laws-and-policy/civil-rights-laws/file-complaint/questions-and-answers-ocrs-complaint-process
- https://sites.ed.gov/idea/regs/b/b/300.153
- https://sites.ed.gov/idea/regs/b/e/300.506
- https://sites.ed.gov/idea/regs/b/e/300.507
- https://www.eeoc.gov/time-limits-filing-charge
- https://www.eeoc.gov/filing-lawsuit

##### `rights/us/idea`

- The discipline trigger is misstated in two places. A manifestation
  determination is required when discipline constitutes a **change of
  placement**, including removal for more than 10 consecutive school days or a
  qualifying pattern of removals totaling more than 10 days. It is not
  triggered automatically whenever removals exceed 10 total days.
- “Student cannot be suspended/expelled for that behavior” is too absolute
  after a manifestation finding. IDEA still permits a 45-school-day interim
  alternative setting for weapons, drugs, or serious bodily injury, and a
  hearing officer may order an interim setting where maintaining placement is
  substantially likely to result in injury.
- The functional-behavior language omits an important distinction: after a
  manifestation finding, the team conducts an FBA and implements a BIP unless
  one was already conducted before the behavior; if a BIP already exists, the
  team reviews and modifies it as necessary.
- “Once the IEP is finalized with parent consent” implies federal IDEA requires
  consent to each finalized IEP. Federal rules require consent before the
  **initial provision** of special education and related services; states may
  add other consent requirements. Preserve the important initial-consent rule
  without implying a universal annual veto.
- The reevaluation rule needs its exceptions: no more than once a year unless
  parent and agency agree otherwise, and at least once every three years unless
  they agree it is unnecessary.
- IDEA Part C is for infants and toddlers **under age three**, not “birth to age
  3.” Part B preschool eligibility begins at age three.

Primary sources:
- https://sites.ed.gov/idea/regs/b/d/300.300
- https://sites.ed.gov/idea/regs/b/d/300.303
- https://sites.ed.gov/idea/regs/b/e/300.530/e
- https://sites.ed.gov/idea/idea-files/guidance-discipline-procedures/

#### 🟠 Legal-rights and benefits corrections

##### `education/k12-education`

- “Section 504 protects all students with disabilities” is overbroad. A
  student must meet Section 504's disability definition, including a physical
  or mental impairment that substantially limits a major life activity (or the
  record/regarded-as prongs); provision of Section 504 FAPE applies to
  qualified students who need special education or related aids and services.
- “Not be excluded, suspended, or expelled because of disability” should not
  imply disabled students can never be disciplined. Disability discrimination
  is prohibited, and IDEA-eligible students have discipline safeguards, but
  lawful discipline remains possible.
- The U.S. overview repeats the IDEA-page overstatement that a “full evaluation”
  occurs every three years. A reevaluation is due at least every three years
  unless parent and agency agree it is unnecessary; the team determines what
  additional assessment data, if any, are needed.
- The Wales summary is outdated. Wales is no longer merely “similar to
  England”: from September 2025 its former SEN system was replaced by the
  Additional Learning Needs system, with Individual Development Plans and
  appeals to the Education Tribunal for Wales.

Primary sources:
- https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/frequently-asked-questions-section-504-free-appropriate-public-education-fape
- https://sites.ed.gov/idea/regs/b/d/300.303
- https://www.gov.wales/data-monitor-additional-learning-needs-aln-system-html

##### `rights/us/fair-housing-act`

- Add the Fair Housing Act's narrow coverage exceptions. The page currently
  states protections and landlord duties as universal, without mentioning
  certain owner-occupied buildings with four or fewer units and qualifying
  owner-rented single-family homes. Discriminatory advertising remains
  prohibited, and state/local laws may still apply.
- Assistance-animal accommodations are not unconditional. HUD identifies
  case-specific exceptions for undue financial and administrative burden,
  fundamental alteration, a direct threat from the specific animal that
  cannot be reduced by another accommodation, and significant property damage
  that cannot be reduced. Add these beside the repeated “must allow” language.
- “Legitimate documentation comes from your actual healthcare provider” is
  narrower than HUD's standard. HUD calls for reliable disability-related
  information when the disability or need is not apparent; do not imply that
  only an existing treating healthcare provider can supply it.
- The new-construction date should say covered multifamily dwellings designed
  and constructed for **first occupancy after March 13, 1991**, not simply
  buildings “built after March 1991.” Substantial rehabilitation alone does
  not make an older building subject to these design-and-construction rules.
- Remove the unsupported restoration examples (“grab bars typically required”
  and “widened doorways often not required”). A housing provider may require
  reasonable restoration of an interior modification only where the
  modification could interfere with the next tenant's use.
- The HUD/private-lawsuit description should make clear that a person may file
  a private suit even after filing with HUD, subject to statutory limits and
  exceptions; it is not simply an appeal taken when dissatisfied with HUD.

Primary sources:
- https://www.hud.gov/sites/dfiles/FHEO/documents/DISABILITY_RIGHTS_LAWS.pdf
- https://www.hud.gov/program_offices/fair_housing_equal_opp/assistance_animals
- https://www.hud.gov/sites/dfiles/FHEO/documents/Design-and-Construction-Requirements-of-the-Fair-Housing-Act-Technical-Overview-Part-1-Participant-Workbook.pdf
- https://www.hud.gov/program_offices/fair_housing_equal_opp/complaint-process

##### `employment/workplace-accommodations`

- Correct the U.S. legal-framework list: **Section 503**, not Section 504, is
  the Rehabilitation Act provision covering qualifying federal contractors
  and subcontractors. Section 504 applies to federally conducted programs and
  programs or activities receiving federal financial assistance.
- “Employers can only deny accommodations if they cause undue hardship” omits
  other central limits. Under the ADA, the person must be a qualified
  individual with a covered disability, the accommodation must address a
  disability-related barrier, and an employer need not remove essential
  functions, create a position, provide an ineffective accommodation, or
  eliminate an unmitigable direct threat.
- The page lists an emotional support animal as though it is automatically a
  workplace accommodation. Unlike the housing framework, the employment ADA
  does not create a separate ESA category; an animal may be considered through
  the ordinary individualized reasonable-accommodation process.
- “You don't have to accept accommodations that don't work” needs a legal
  qualifier. An employer may choose among effective accommodations and does
  not always have to provide the worker's preferred option.
- “Specific diagnosis” is not categorically off limits when relevant.
  Employers generally may request only reasonable documentation sufficient to
  establish an ADA disability and the need for accommodation, not unrelated or
  complete medical records.

Primary sources:
- https://www.dol.gov/general/topic/discrimination/disabilitydisc
- https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada
- https://www.eeoc.gov/laws/guidance/enforcement-guidance-disability-related-inquiries-and-medical-examinations-employees

##### `benefits/us/ssdi`

- The plain-language disability test is too loose. “Can't work at your previous
  level” can imply reduced capacity alone is enough. SSA generally asks whether
  the claimant can perform past relevant work or adjust to other work and
  whether work is above substantial gainful activity, alongside the duration
  requirement.
- “Worked for years” can discourage eligible younger workers. SSA notes that
  younger workers may qualify with fewer credits; state the insured-status
  rule without implying a long work history is always required.
- State the Medicare timing because it is a consequential benefits rule:
  SSDI beneficiaries generally become eligible after a 24-month qualifying
  period of disability-benefit entitlement, with exceptions including ALS.
- The page's broad claim that many people win on reconsideration or at a
  hearing needs current SSA outcome data and careful denominator definitions,
  or should be softened.

Primary sources:
- https://www.ssa.gov/disability/eligibility
- https://www.ssa.gov/disabilityresearch/wi/medicare.htm
- https://www.ssa.gov/OP_Home/cfr20/404/404-0315.htm

##### `education/higher-education`

- The U.S. statement that students have a “right to appeal denied
  accommodations” is too universal. Institutions may have grievance or
  reconsideration processes, and external OCR/court routes may exist, but the
  exact internal appeal right and procedure varies. Direct students to the
  institution's published grievance process and preserve external deadlines.
- “All colleges and universities receiving federal funding (virtually all of
  them)” should distinguish Section 504 coverage from ADA coverage. Public
  institutions are covered by ADA Title II; private nonreligious institutions
  are generally covered by Title III; religious entities are exempt from Title
  III but may still have Section 504 obligations if they receive federal
  financial assistance.
- The list of common accommodations should make clear that substitutions,
  flexible attendance, and deadline changes require individualized review and
  need not be provided when they would fundamentally alter an essential
  academic requirement.

Primary sources:
- https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/disability-discrimination-key-issues/disability-discrimination-academic-adjustments-postsecondary-students
- https://www.ada.gov/resources/title-iii-manual/
- https://www.ed.gov/laws-and-policy/civil-rights-laws/file-complaint/questions-and-answers-ocrs-complaint-process

#### 🟡 Pass with minor corrections

##### `benefits/benefit-denials-and-appeals`

- The page is appropriately general and repeatedly directs readers to
  country- and program-specific rules. No concrete deadline or procedural rule
  is misstated.
- “Agencies save money by denying first” is an unsupported universal
  motive claim. Replace it with sourced program-specific evidence or describe
  documented systemic barriers without assigning intent to every agency.
- Add a warning that some programs have a short, separate deadline to request
  continued benefits while an appeal is pending; the decision notice and
  qualified local advice control.

##### `benefits/us/state-benefits`

- This is accurately framed as a placeholder and makes no material promise
  about eligibility or availability. No benefits-rule error found.
- The sample future paths under `/benefits/us/state/...` do not currently
  exist; label them explicitly as proposed paths or omit them until pages are
  created.

---

## Full audit expansion — batch 7 (9 pages)

Detailed content and safety audit completed for:

- `rights/us/federal-rights`
- `rights/sign-language-interpreters`
- `rights/finding-legal-aid`
- `housing/housing-rights`
- `housing/tenants-rights-with-disabilities`
- `housing/group-homes-and-institutions`
- `healthcare/healthcare-rights`
- `healthcare/insurance-claims-appeals`
- `healthcare/insurance-navigation`

Progress after batch 7: **79 detailed audits complete; 199 pages remain.**

#### 🔴 Correct immediately

##### `housing/housing-rights`

- CRPD Article 19 is an international human-rights standard and a treaty
  obligation for states parties; it is not directly enforceable in every
  country and does not “apply universally regardless of your government's CRPD
  status.” Distinguish the standard from enforceable domestic rights and the
  available complaint mechanisms in each jurisdiction.
- The UK section contains multiple material legal errors. There is no single UK
  “Residential Tenancies Act”; housing and tenancy law differs among England,
  Wales, Scotland, and Northern Ireland. Housing-discrimination cases are not
  brought in employment tribunals. Direct readers to jurisdiction-specific
  advice and the correct court/tribunal route.
- Do not state that emotional support animals “must be accommodated” in UK
  housing or that landlords categorically cannot refuse or charge fees. UK
  reasonable-adjustment and assistance-dog questions are fact- and
  jurisdiction-specific; the U.S. Fair Housing Act assistance-animal framework
  does not transfer wholesale.
- The U.S. section says any licensed healthcare provider the tenant sees is an
  acceptable verifier. HUD's standard is reliable disability-related
  information when the disability or need is not apparent, not an automatic
  rule based only on licensure or an existing provider relationship.
- “In federally-funded housing, landlords pay” is too broad. Section 504
  recipients generally bear reasonable-modification costs unless doing so
  would impose an undue financial and administrative burden or fundamentally
  alter the program; identify the covered recipient and exceptions.
- Remove or directly source the page's many hard comparative claims, including
  Sweden's “10% of housing stock” accessibility claim, the UK DFG “6% of
  eligible renters” claim, the `$711 million` figure, the unnamed 2023 Supreme
  Court holding, and broad country rankings.

Primary sources:
- https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-persons-disabilities
- https://www.hud.gov/program_offices/fair_housing_equal_opp/assistance_animals
- https://www.gov.uk/government/publications/disabled-facilities-grant-dfg-delivery-guidance-for-local-authorities-in-england
- https://www.equalityhumanrights.com/guidance/housing

##### `housing/tenants-rights-with-disabilities`

- The page presents CRPD-derived “universal” tenant rules as though they are
  directly enforceable everywhere, including categorical rights to
  accommodations, assistance animals, accessible processes, and protection
  from eviction. These are important standards but the legal tests, coverage,
  remedies, and enforceability vary by country and housing type.
- The U.S. assistance-animal section incorrectly imports ADA public-access
  questions into housing. Housing providers use the Fair Housing Act
  reasonable-accommodation analysis; they are not limited to asking only the
  ADA's two service-animal questions.
- “Landlords cannot ask about animal type [or] training” is wrong. HUD's
  assistance-animal process distinguishes animals commonly kept in households
  from unique animals and permits reliable disability-related information when
  the need is not apparent.
- Breed and weight restrictions do not automatically control an assistance
  animal request, but the page omits HUD's case-specific direct-threat,
  significant-property-damage, undue-burden, and fundamental-alteration
  exceptions.
- The eviction guidance is dangerously absolute. A disability-related nexus
  can support an accommodation request, but the Fair Housing Act does not
  categorically bar eviction after one crisis, for noise, or until a landlord
  completes a formally named “interactive process.” Direct threats, property
  damage, nonpayment, and other lease violations require individualized,
  jurisdiction-specific analysis.
- The claimed `90–180 day` presumption of retaliation is not a federal Fair
  Housing Act rule and cannot be presented as a general state rule without
  citations.
- The Canada, EU, UK, and Australia animal and eviction sections repeatedly
  generalize U.S.-style rules across distinct jurisdictions. Replace them with
  sourced jurisdiction-specific summaries or direct readers to local advice.

Primary sources:
- https://www.hud.gov/program_offices/fair_housing_equal_opp/assistance_animals
- https://www.hud.gov/sites/dfiles/FHEO/documents/Fair-Housing-Act-Reasonable-Modifications-and-Reasonable-Accommodations-Participant-Workbook.pdf
- https://www.hud.gov/program_offices/fair_housing_equal_opp/complaint-process

##### `rights/sign-language-interpreters`

- The “primary consideration” rule is applied too broadly. Under DOJ guidance,
  ADA Title II state/local government entities must give primary consideration
  to the person's requested aid or service. Title III businesses and nonprofits
  are encouraged to consult the person but may choose another aid if it
  provides effective communication. Employment uses the Title I reasonable-
  accommodation framework. Rewrite the page by legal setting.
- An interpreter is not legally required for every interaction. Effective
  communication depends on the nature, length, complexity, and context of the
  communication and the person's usual method. DOJ specifically recognizes
  that written notes may be effective for some simple interactions.
- “Same-day or emergency interpretation must also be provided” is too
  absolute. Walk-in requests must be honored to the extent possible, and the
  entity must provide an effective aid or service; that may not always be an
  on-site interpreter.
- Covered entities generally cannot impose a surcharge for required auxiliary
  aids, but the page omits undue-burden and fundamental-alteration limits and
  the obligation to provide an effective alternative when one applies.
- VRI is not legally restricted to brief, routine interactions. It may be used
  where effective and where the regulatory performance standards are met; an
  on-site interpreter is required when VRI is ineffective in the specific
  circumstances.
- “All Deaf and Hard of Hearing people have the right to effective
  communication in their preferred language” overstates U.S. law and global
  enforceability. Preserve the human-rights principle while accurately
  describing each covered entity's legal duty.

Primary source:
https://www.ada.gov/resources/effective-communication/

##### `rights/finding-legal-aid`

- The education section repeats the dangerous falsehood that IDEA mediation is
  “usually required first.” IDEA mediation is voluntary and cannot delay or
  deny a due-process hearing.
- Do not imply that a free lawyer is generally available after an unsuccessful
  IDEA hearing. Families may seek legal aid or fee-shifting where legally
  available, but there is no general right to appointed counsel in IDEA civil
  cases.
- “Contingency basis” is not necessarily “FREE upfront,” and the quoted
  `25–33%` range is not universal. Clients may remain responsible for costs,
  fee agreements vary, and statutory fee rules differ by case type.
- The list labels several national advocacy/membership organizations as though
  they provide individual legal help. Verify and describe each organization's
  actual intake and representation scope; do not send urgent readers to groups
  that do not accept individual cases.
- P&A agencies do not take every disability-rights matter and generally use
  statutory program authority, priorities, and available resources to decide
  what help they can provide. Add this expectation-setting caveat.
- Social Security representative fees are regulated and require SSA
  authorization; describe the fee-agreement/fee-petition process rather than
  calling it ordinary contingency representation.

Primary sources:
- https://sites.ed.gov/idea/regs/b/e/300.506
- https://www.ssa.gov/representation/fees
- https://www.ndrn.org/about/ndrn-member-agencies/

#### 🟠 Legal and healthcare corrections

##### `rights/us/federal-rights`

- The IDEA enforcement list should not imply an individual can file an IDEA
  complaint with federal OCR. IDEA disputes generally use local resolution,
  State complaints, mediation, and due process; OCR separately enforces
  Section 504 and ADA Title II disability discrimination in education.
- “Section 504 covers all students with disabilities” is overbroad. Coverage
  requires the statutory disability definition, and Section 504 FAPE duties
  apply to qualified students who need special education or related aids and
  services.
- Add the ADA Title III religious-entity and private-club exemptions beside
  the private-school/public-accommodation summary.
- The Fair Housing Act table and summary need the Act's narrow housing
  exemptions and the precise covered-new-construction rule: covered
  multifamily dwellings designed and constructed for first occupancy after
  March 13, 1991.
- “Section 504 has no minimum employer size—covers all entities receiving
  federal funds” oversimplifies Section 504 employment coverage and conflates
  receipt of assistance with every employment relationship. Direct readers to
  agency-specific Section 504 rules and Section 503 for federal contractors.

Primary sources:
- https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/frequently-asked-questions-section-504-free-appropriate-public-education-fape
- https://sites.ed.gov/idea/regs/b/e/300.506
- https://www.ada.gov/resources/title-iii-manual/
- https://www.hud.gov/sites/dfiles/FHEO/documents/DISABILITY_RIGHTS_LAWS.pdf

##### `housing/group-homes-and-institutions`

- The U.S. rights list is dangerously universal. A right to appointed counsel,
  treatment refusal, visits, community access, and a particular release
  procedure depends on the type of placement, governing statute, state law,
  guardianship/capacity rules, and court process. Direct readers urgently to
  the relevant P&A agency or qualified local counsel.
- The Olmstead summary omits the decision's central conditions. Community
  placement is required when appropriate, the affected person does not oppose
  it, and placement can be reasonably accommodated considering state resources
  and the needs of others receiving services; it is not an unconditional
  individual entitlement to a requested placement.
- HCBS settings rules apply to Medicaid-funded HCBS settings, not “all Medicaid
  HCBS waiver services” in a way that guarantees every listed outcome to every
  person. Distinguish setting requirements from service eligibility and
  availability.
- The global and country sections contain many unsourced hard figures and
  categorical rankings (`2.6 million`, `900,000+`, `40,000–50,000`,
  `40,000+`, `21` states, `18,000+`, “largely complete,” and country-by-country
  progress claims). Add dated direct sources and definitions or remove them.
- Claims that institutional care is always more expensive and that most
  institutionalized people could live in community are plausible advocacy
  positions but require defined populations and evidence; do not present them
  as universal empirical facts.

Primary sources:
- https://www.ada.gov/resources/olmstead-mandate/
- https://www.medicaid.gov/medicaid/home-community-based-services/guidance/home-community-based-services-final-regulation
- https://www.ndrn.org/about/ndrn-member-agencies/

##### `healthcare/healthcare-rights`

- The U.S. effective-communication list implies every Deaf patient is entitled
  to a sign-language interpreter and every requested format. The legal duty is
  effective communication; the appropriate aid depends on context, and Title
  II and Title III selection rules differ.
- “Accessible facilities and exam rooms” and “accessible medical equipment”
  are stated as though every room and item must already be accessible. Covered
  providers must make services accessible and comply with applicable
  construction/equipment rules, but the exact scoping and compliance duties
  differ by law, facility, and effective date.
- Decision-making language omits capacity, authorized surrogates other than
  guardians, emergencies, and jurisdiction-specific consent law. Preserve the
  presumption of autonomy without presenting an absolute rule.
- ACA insurance protections are overbroad. The pre-existing-condition rule,
  essential-health-benefit requirements, and ban on annual/lifetime dollar
  limits apply differently by market and plan type; the lifetime/annual-limit
  ban concerns essential health benefits, not every covered service.
- HHS OCR's 180-day complaint period may be extended for good cause. State it
  as the general filing period, not an absolute cutoff.

Primary sources:
- https://www.ada.gov/resources/effective-communication/
- https://www.hhs.gov/civil-rights/for-individuals/section-1557/index.html
- https://www.healthcare.gov/health-care-law-protections/lifetime-and-yearly-limits/

##### `healthcare/insurance-claims-appeals`

- The page applies ACA appeal rules too broadly to “Employer-Sponsored and ACA
  Marketplace Plans.” ACA internal/external-review rules generally apply to
  non-grandfathered plans, and external review covers specified categories of
  adverse determinations. Readers must check the denial notice, plan document,
  regulator, and plan status.
- “Every denial must include” the listed information is too universal across
  countries and insurance types. Scope the claim to the governing U.S. plan
  rules and identify the regulator.
- The claim-file right is stated universally. Access to relevant claim
  documents is a major protection under ERISA/ACA-governed processes, but the
  exact right and procedure depend on plan type and governing law.
- The ERISA section says some plans give less than 180 days. ERISA group health
  and disability-benefit claim procedures generally must provide at least 180
  days to appeal; government and church plans may be exempt from ERISA, and
  other plan types use other rules.
- Remove or directly source the `40–50%` external-review overturn claim and
  clarify its population, years, states, and denial types.
- Australia's Administrative Appeals Tribunal was replaced by the
  Administrative Review Tribunal on **October 14, 2024**. Update the NDIS
  external-review route.

Primary sources:
- https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/indexappealinghealthplandecisions
- https://www.cms.gov/CCIIO/Programs-and-Initiatives/Consumer-Support-and-Information/External-Appeals.html
- https://www.dol.gov/agencies/ebsa/about-ebsa/our-activities/resource-center/publications/filing-a-claim-for-your-health-benefits
- https://www.art.gov.au/about-us

##### `healthcare/insurance-navigation`

- “You have a right to appeal all denials” and “external review is available
  for most plans” are too broad. Appeal and external-review rights depend on
  the program, plan status, governing law, and denial category. Some external
  reviews are limited to medical-necessity, appropriateness, setting,
  effectiveness, experimental/investigational, or rescission decisions.
- The Medicare Part D section is outdated because it still describes coverage
  gaps (“donut hole”) as a current plan feature. The Medicare page elsewhere
  correctly notes the redesigned Part D out-of-pocket structure.
- Marketplace open enrollment is described as “November–January typically.”
  Dates vary by year and state-based marketplace; use a dated official lookup
  rather than a generic range.
- The ACA pre-existing-condition statement needs plan scope. It is a major
  protection for applicable health coverage, but it should not imply every
  insurance product, including disability, life, or long-term-care insurance,
  is covered by the ACA rule.
- “State insurance departments can help” needs an ERISA/self-funded-plan
  caveat; those plans are primarily federally regulated, although states may
  still help route the reader.

Primary sources:
- https://www.cms.gov/cciio/resources/fact-sheets-and-faqs/indexappealinghealthplandecisions
- https://www.healthcare.gov/glossary/external-review/
- https://www.medicare.gov/health-drug-plans/part-d/basics/costs
- https://www.healthcare.gov/coverage/pre-existing-conditions/
## Full audit expansion — batch 8 (9 pages)

Pages audited:
- `benefits/proving-disability`
- `benefits/debt-budgeting-financial-rights`
- `benefits/poverty-and-benefits-trap`
- `benefits/international/benefits-overview`
- `rights/us-state-rights`
- `rights/international-rights`
- `education/early-intervention`
- `education/transition-to-adulthood`
- `employment/supported-employment-and-voc-rehab`

**Progress:** 88 of 278 pages audited; 190 remain.

### 🔴 Correct immediately

#### `benefits/proving-disability`
- The SSA overview incorrectly makes generic “treatment history and compliance” sound like a basic requirement for proving disability. SSA may decide a claim at steps 4–5 using residual functional capacity; failure to follow prescribed treatment is a separate rule used only in defined circumstances and subject to good-cause exceptions. Rewrite this section around the five-step process and separately explain the prescribed-treatment rule.
- “Most successful applicants must appeal,” the 51–58% ALJ approval figure, and the claim that 62% of initial applications were denied in 2024 need direct, current SSA data with clear denominators. Distinguish medical denials, technical denials, claims, and people.
- “Social Security estimates less than 1% fraud” is unsupported and potentially misleading. SSA/OIG reporting does not establish a simple program-wide fraud prevalence rate. Remove it or cite a source that precisely measures the stated population and period.
- The housing section is too categorical in saying landlords cannot request diagnoses or medical records and may request “only verification.” HUD permits reliable disability-related information when disability or need is not apparent; what may be requested is fact-specific, although detailed medical records are generally unnecessary.
- The higher-education statement that schools “often require” an evaluation from the last 3–5 years risks presenting a common practice as a legal standard. Federal OCR says institutions may set reasonable documentation requirements; recency must be justified by the circumstances.
- Canada, UK, and Australia eligibility/denial claims require current primary sources. In particular, NDIS access is not simply a test of whether someone is “likely to require lifelong support.”
- Primary checks: [SSA Blue Book general information](https://www.ssa.gov/disability/professionals/bluebook/general-info.htm), [20 CFR §404.1530](https://www.ssa.gov/OP_Home/cfr20/404/404-1530.htm), [SSA DI Annual Statistical Report](https://www.ssa.gov/policy/docs/statcomps/di_asr/2024/sect04.html), [Education Department OCR guidance](https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/disability-discrimination-key-issues/disability-discrimination-academic-adjustments-postsecondary-students), [HUD assistance-animal guidance](https://www.hud.gov/program_offices/fair_housing_equal_opp/assistance_animals), [NDIS access criteria](https://www.ndis.gov.au/applying-access-ndis/am-i-eligible).

#### `rights/us-state-rights`
- New York is wrong in two places: the New York State Human Rights Law covers all employers, not only employers with four or more employees.
- Illinois is also wrong: the Illinois Human Rights Act’s employment-discrimination protections apply to employers with one or more employees, not 15 or more.
- Rebuild the state-threshold table from current state-agency or statutory sources. The heading “States covering employers with 1+ employees” conflicts with the following generalized threshold language.
- Do not imply dual filing with state and federal agencies is automatic. Worksharing and dual filing may occur, but people should preserve each applicable deadline and confirm filing status.
- The service-animal discussion should distinguish ADA-covered settings from additional state protections. State law cannot narrow federal ADA rights where the ADA applies.
- Protection and Advocacy agencies cannot necessarily explain or file every complaint; assistance depends on mandate, priorities, and resources.
- Primary checks: [New York disability-employment guidance](https://dhr.ny.gov/disability-employment), [Illinois employment charge guidance](https://dhr.illinois.gov/filing-a-charge/employment.html), [EEOC filing guidance](https://www.eeoc.gov/filing-charge-discrimination), [ADA service-animal FAQs](https://www.ada.gov/resources/service-animals-faqs/).

#### `rights/international-rights`
- Replace the dated CRPD signature, ratification, and Optional Protocol counts with live UN treaty-status links and an access date; these counts are volatile.
- The Optional Protocol complaint criteria are incomplete. A complainant must be under the jurisdiction of a state party to the Optional Protocol, and inadmissibility rules include anonymous submissions, abuse/incompatibility, prior examination, and other international proceedings. Exhaustion also has exceptions when remedies are unavailable, ineffective, or unreasonably prolonged.
- “Committee decisions are not legally binding” needs careful explanation: treaty-body views do not operate like domestic court judgments, but they are authoritative findings concerning treaty obligations.
- The institutionalization discussion cites the wrong CRPD article for liberty. Liberty and security are addressed by CRPD Article 14, not Article 5.
- Article 21 does not specifically recognize indigenous sign languages and cultural identity. Article 21 concerns expression, information, and recognition/promotion of sign languages generally; cultural and linguistic identity, including deaf culture, appears in Article 30.
- Country rankings, immigration-status assertions, and other broad enforceability claims need dated primary sources and domestic-law caveats.
- Primary checks: [UN CRPD treaty status](https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4), [UN Optional Protocol status](https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15-a&chapter=4), [CRPD text](https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-persons-disabilities), [Optional Protocol text](https://www.ohchr.org/en/instruments-mechanisms/instruments/optional-protocol-convention-rights-persons-disabilities).

#### `employment/supported-employment-and-voc-rehab`
- The federal vocational-rehabilitation eligibility explanation reverses an important presumption. Applicants are presumed able to benefit from VR services in terms of an employment outcome; an agency needs clear and convincing evidence, generally after trial work experiences, to find otherwise.
- The 60-day eligibility determination has exceptions for agreed extensions caused by exceptional and unforeseen circumstances and for trial-work assessment.
- Supported-employment services are not always capped at exactly 24 months. The period may be extended to achieve the employment outcome, and youth with the most significant disabilities have specific extended-services rules.
- The claim that VR should not close a case without successful employment unless the person withdraws or stops participating is incomplete. Federal rules permit closure for several other reasons, with required procedures.
- Calling an individualized plan for employment a “contract” is legally misleading. It is an approved written plan with review, amendment, and appeal rights.
- Ticket to Work does not itself create trial work periods. The trial work period is a separate SSDI work incentive and does not apply to SSI in the same way.
- PASS can involve qualifying income or resources, not only earnings.
- Verify the Australia program names and structure against current sources; the employment-services system has changed.
- Primary checks: [34 CFR §361.42](https://www.law.cornell.edu/cfr/text/34/361.42), [34 CFR §361.41](https://www.law.cornell.edu/cfr/text/34/361.41), [34 CFR §361.5](https://www.law.cornell.edu/cfr/text/34/361.5), [34 CFR §361.43](https://www.law.cornell.edu/cfr/text/34/361.43), [SSA trial work period](https://www.ssa.gov/disabilityresearch/wi/trialwork.htm), [SSA PASS](https://www.ssa.gov/work/pass.html).

### 🟠 Important clarification

#### `benefits/poverty-and-benefits-trap`
- The stated $943 federal SSI benefit is the 2024 amount and is outdated for a report dated June 2026. Use the current amount with an effective date or avoid a fixed figure.
- The ABLE eligibility threshold is outdated. Effective January 1, 2026, qualifying disability onset must be before age 46, not before age 26.
- “When SSI ends, so does Medicaid in many states” and the hypothetical loss scenarios overstate the cliff. Section 1619(b), SSI-linked state rules, and other Medicaid eligibility categories can preserve coverage. Explain the variation and direct readers to state-specific advice.
- The inheritance-reporting instruction should use SSA’s precise timing rule rather than simply “within 10 days”: report relevant changes no later than the tenth day of the month after the change, subject to the applicable reporting method and rule.
- The $1 reduction for every $2 earned must be presented with the earned-income exclusions and other-income caveats.
- The estimated $10,000–$30,000 annual disability-related cost needs a named study and defined population or should be removed.
- Claims that work disincentives “ensure a permanent cheap labor pool” and the “who benefits” assertions are unsourced motive claims. Label them as analysis and support them, or rewrite neutrally.
- Primary checks: [SSA SSI amount](https://www.ssa.gov/ssi/amount), [SSA reporting changes](https://www.ssa.gov/ssi/reporting/changes), [SSA section 1619(b)](https://www.ssa.gov/disabilityresearch/wi/1619b.htm), [IRS ABLE guidance](https://www.irs.gov/newsroom/able-savings-accounts-and-other-tax-benefits-for-persons-with-disabilities).

#### `education/early-intervention`
- IDEA Part C covers infants and toddlers under age three, not “birth to age 3.” Correct the repeated phrasing.
- Clarify that participating states and jurisdictions operate statewide Part C systems and set eligibility criteria within federal requirements; eligibility is not uniform nationally.
- “Early intervention under Part C is free in most states” is misleading. Some services must be provided at public expense, while states may use family-cost participation or insurance for other services. Inability to pay cannot delay or deny services.
- Natural-environment services are required to the maximum extent appropriate. Another setting may be used when outcomes cannot be achieved satisfactorily in the natural environment; avoid implying every service must occur at home or childcare.
- Transition requirements occur before the third birthday and have specific notification, conference, and planning timelines, rather than beginning only “at age 3.”
- Primary checks: [34 CFR §303.21](https://sites.ed.gov/idea/regs/c/a/303.21), [§303.209](https://sites.ed.gov/idea/regs/c/b/303.209), [§303.420](https://sites.ed.gov/idea/regs/c/d/303.420), [§303.520](https://sites.ed.gov/idea/regs/c/f/303.520), [§303.126](https://sites.ed.gov/idea/regs/c/b/303.126).

#### `education/transition-to-adulthood`
- State the federal transition-plan timing precisely: transition services must be included in the IEP in effect when the student turns 16, or younger if determined appropriate or required by state law.
- “Services continue until graduation or age 21 (some states age 22)” is too broad. IDEA eligibility depends on state law and generally ends with a regular high-school diploma or aging out; certificates and alternate diplomas may be treated differently.
- “Apply for VR at age 16+” creates a false universal threshold. Pre-employment transition services are available to students who are eligible or potentially eligible, and referral/application timing varies.
- Do not imply a family may simply elect special education through age 21 or 22 regardless of diploma status and state eligibility.
- England’s education, health and care plans do not automatically continue to age 25 whenever someone remains in education or training; the local authority must determine that the plan remains necessary.
- Primary checks: [34 CFR §300.320(b)](https://sites.ed.gov/idea/regs/b/d/300.320/b), [§300.102](https://sites.ed.gov/idea/regs/b/a/300.102), [§300.305(e)](https://sites.ed.gov/idea/regs/b/b/300.305/e), [Education Department VR interpretation](https://www.ed.gov/laws-and-policy/individuals-disabilities/rehabilitation-act-of-1973/notice-interp), [England EHC-plan guidance](https://www.gov.uk/government/publications/send-19-to-25-year-olds-entitlement-to-ehc-plans/send-19-to-25-year-olds-entitlement-to-ehc-plans).

### 🟡 Pass with minor notes

#### `benefits/debt-budgeting-financial-rights`
- The page appropriately stays general, notes that laws vary, and avoids presenting itself as legal advice.
- Add a prominent warning not to acknowledge a debt, promise payment, settle, or provide bank information before validating the collector and checking local law; some actions can affect legal rights or limitation periods.
- Keep benefit-garnishment and account-seizure protections carefully scoped because treatment depends on the benefit program, account history, debt type, and jurisdiction.
- Useful primary source: [CFPB debt-collector guidance](https://www.consumerfinance.gov/ask-cfpb/what-should-i-do-when-a-debt-collector-contacts-me-en-1695/).

#### `benefits/international/benefits-overview`
- Pass. This is a clearly labeled overview/map and does not state concrete eligibility rules or deadlines that create immediate reliance risk.
- Because benefit programs change frequently, every country page linked from this overview should use official sources with access dates and prominently state its jurisdiction and update date.

## Full audit expansion — batch 9 (9 pages)

Pages audited:
- `employment/employment-rights-by-country`
- `rights/advocacy-and-self-advocacy`
- `benefits/australia/benefits`
- `benefits/canada/benefits`
- `benefits/united-kingdom/benefits`
- `benefits/european-union/benefits`
- `benefits/other-countries-benefits`
- `benefits/us/medicare`
- `benefits/us/veterans-benefits`

**Progress:** 97 of 278 pages audited; 181 remain.

### 🔴 Correct immediately

#### `benefits/us/medicare`
- The eligibility section incorrectly presents ten years of work history and U.S. citizenship or five-year permanent residence as universal requirements. Work credits generally determine premium-free Part A, not whether every eligible person can enroll or buy coverage; disability, ALS, ESRD, age, Railroad Retirement, spouse, and premium-Part-A pathways differ. Replace the checklist with scenario-specific official guidance.
- “Missing [the initial enrollment] deadline = permanent penalty (1% extra per month delayed)” is wrong and dangerous. Part A, Part B, and Part D have different penalty formulas, durations, exceptions, and Special Enrollment Periods. Do not summarize them as one penalty.
- The page contradicts itself by saying plan changes are limited to enrollment periods but that people with Original Medicare “can switch any time.” Switching into Medicare Advantage or changing drug coverage is generally limited to applicable enrollment periods or Special Enrollment Periods.
- Statements that Medicare Advantage has higher out-of-pocket costs, requires specialist referrals, or offers more predictable costs are not universally true; these vary by plan. The page should direct readers to compare the specific plan’s network, authorization rules, maximum, and evidence of coverage.
- The appeal sequence beginning with “Reconsideration: Request within 180 days” is inaccurate as a universal Medicare appeal rule. Original Medicare, Medicare Advantage, and Part D have different first-level processes and deadlines. Link to the denial notice and the relevant official appeal pathway rather than give one blended timeline.
- The working-disabled section implies Medicare simply continues whenever SSDI stops due to work. Extended Medicare coverage has detailed timing and eligibility rules and is not indefinite.
- “SHIP: Free counseling (1-800-MEDICARE)” conflates two services. SHIPs have state-specific contact information; `1-800-MEDICARE` is Medicare’s national line.
- Avoid unsupported price ranges for Part D premiums/copays and Medigap premiums; costs vary by plan, location, rating method, pharmacy, drug, and eligibility.
- Primary checks: [Medicare 2026 costs](https://www.medicare.gov/basics/costs/medicare-costs), [Medicare eligibility paths](https://www.medicare.gov/basics/get-started-with-medicare/other-paths), [working past 65](https://www.medicare.gov/basics/get-started-with-medicare/medicare-basics/working-past-65), [Medicare appeals](https://www.medicare.gov/providers-services/claims-appeals-complaints/appeals), [SHIP locator](https://www.shiphelp.org/).

#### `benefits/us/veterans-benefits`
- “Served on active duty (includes National Guard and Reserves)” is overbroad. Guard and Reserve eligibility depends on qualifying duty/status and the facts of the condition; membership alone is not active duty.
- VA disability compensation does not require a condition to be permanent or long-standing. The core requirement is a current condition connected to qualifying service; ratings can be temporary and may change.
- “Available for life” is misleading. Compensation continues while eligibility and the service-connected rating remain in effect, and ratings may be reduced or severed subject to legal protections and procedures.
- The application section names VA Form 21-0966 as the application for disability compensation. That form is only an intent to file. The paper disability-compensation application is VA Form 21-526EZ.
- The PCAFC section is seriously outdated and inaccurate: it is not limited to veterans injured in Iraq/Afghanistan or to combat-related injury, and stipend amounts should not be stated without current, location- and tier-specific sourcing. Current eligibility includes a VA disability rating of 70% or more and a need for in-person personal-care services for at least six continuous months, plus other criteria.
- VR&E eligibility is wrong. It does not require “any percentage,” inability to work, or a universal application within 12 years. Eligibility and entitlement depend on discharge, service-connected rating, employment handicap, discharge/rating dates, and statutory exceptions.
- The page confuses the Temporary Disability Retired List with a “Temporary Disability Retirement Pay” VA bridge benefit. TDRL is a military disability-retirement status, not a VA benefit, and current maximum placement duration should be verified from Defense Department sources.
- VA home-loan eligibility is not based on being service connected or receiving priority at a 30% rating. It depends on service requirements and other qualifying categories.
- “Accredited representatives can charge fees” and “VA-accredited attorney: more expensive” need the statutory timing/fee restrictions. Accredited attorneys and agents generally may not charge for help with an initial claim before VA issues an initial decision.
- Review every hard-coded 2026 amount and threshold against the applicable VA effective-date table. Also distinguish disability compensation from pension and do not imply both can freely combine with SSI; VA payments can affect means-tested benefits.
- Primary checks: [VA disability eligibility](https://www.va.gov/disability/eligibility/), [VA filing instructions](https://www.va.gov/disability/how-to-file-claim/), [VA Form 21-526EZ](https://www.va.gov/find-forms/about-form-21-526ez/), [VA intent to file](https://www.va.gov/resources/your-intent-to-file-a-va-claim/), [PCAFC eligibility](https://www.caregiver.va.gov/CAREGIVER/PCAFC.asp), [VR&E eligibility](https://www.va.gov/careers-employment/vocational-rehabilitation/eligibility/), [VA home-loan eligibility](https://www.va.gov/housing-assistance/home-loans/eligibility/).

### 🟠 Important clarification

#### `employment/employment-rights-by-country`
- The universal-principles section states CRPD norms as if they are identically enforceable domestic rights everywhere. Distinguish the international standard from each country’s implementing law, coverage, defenses, remedies, and enforcement.
- The U.S. Section 504 summary conflates federal agencies, federal contractors, and recipients of federal financial assistance. Federal employment is principally covered by Rehabilitation Act Section 501; federal contractors have Section 503 obligations; Section 504 applies to programs or activities receiving federal assistance and requires a more careful employment explanation.
- “Employers can’t ask about disability before making a job offer” is too absolute. ADA-covered employers generally cannot ask disability-related questions or require medical exams before a conditional offer, but may ask how an applicant would perform job functions, ask limited accommodation questions in defined circumstances, and invite voluntary self-identification under applicable rules.
- “Employers must engage in an interactive process” should explain that the goal is an effective accommodation; an employer may choose among effective options, and interactive-process liability varies by jurisdiction and facts.
- In the UK section, “internal processes first” is not a legal prerequisite and could cause someone to miss the tribunal deadline. A grievance does not stop the clock. Most claimants must notify Acas within the applicable limit, usually three months minus one day; early conciliation then affects time calculation.
- Access to Work does not replace the employer’s reasonable-adjustment duty and has eligibility limits, including a separate Northern Ireland system.
- Verify every EU country quota, threshold, agency name, and program description against current official national sources before publication.
- Primary checks: [EEOC pre-employment inquiries](https://www.eeoc.gov/pre-employment-inquiries-and-disability), [Acas tribunal time limits](https://www.acas.org.uk/employment-tribunal-time-limits), [Acas early conciliation](https://www.acas.org.uk/early-conciliation/how-early-conciliation-works), [Access to Work eligibility](https://www.gov.uk/access-to-work/eligibility).

#### `rights/advocacy-and-self-advocacy`
- This is useful practical guidance, but its broad “right to” lists need jurisdiction and setting qualifiers. Rights to second opinions, records, privacy, accommodation, accessible formats, and participation differ by law, program, relationship, and country.
- “You don’t owe explanations” conflicts with the later and more accurate accommodation guidance. People often need to provide limited information establishing disability-related need or a nexus; advise disclosing only what is necessary rather than promising no explanation is required.
- Asking a clinician to document a refusal can be a useful request, but the page should not imply a patient can require a clinician to add the patient’s preferred wording to the record. Explain amendment/addendum and complaint rights where applicable.
- Statements about decision-making by guardians, supporters, and family require capacity- and jurisdiction-specific caveats. A right to express preferences does not by itself define who has legal authority.

### 🟡 Pass with minor notes

#### `benefits/australia/benefits`
- Pass. This is a cautious high-level map that avoids specific amounts, deadlines, and categorical eligibility promises.
- Add direct Services Australia and NDIS links, an access date, and a clear note that NDIS access, planning, and review rules are changing. Avoid describing every listed NDIS support as available to every participant.

#### `benefits/canada/benefits`
- Pass. The page prominently warns that details change and stays at a high level.
- The Canada Disability Benefit is now an active program rather than merely a benefit “when implemented/where applicable.” Update the description only after checking current federal eligibility, application, payment, and interaction rules.
- Clarify that combining CPP-D with provincial disability income or other supports can cause offsets or affect amounts; “may receive at the same time” does not mean fully additive.

#### `benefits/united-kingdom/benefits`
- Pass with a regional-scope warning. The overview appropriately avoids amounts and deadlines, but several named benefits and processes differ across England, Scotland, Wales, and Northern Ireland.
- DLA is not only a legacy benefit for children and people not migrated; jurisdiction and age matter. Add official country-specific links before expanding the eligibility description.

#### `benefits/european-union/benefits`
- Pass. It clearly identifies itself as a regional overview and repeatedly warns that benefits are country-specific.
- Add a warning that EU coordination rules for cross-border workers and movers are not the same as a single EU disability-benefit entitlement. Future country pages should cite the relevant national agency and EU coordination guidance.

#### `benefits/other-countries-benefits`
- Pass. This is explicitly a contribution scaffold and contains no actionable eligibility, amount, or deadline claims.
- Before adding country sections, require official sources, access dates, local-language review where possible, and a warning against treating NGO support as a substitute for public entitlements.

## Full audit expansion — batch 10 (9 pages)

Pages audited:
- `rights/us/ada`
- `rights/us/air-carrier-access-act`
- `rights/us/section-504`
- `rights/us/state-disability-rights-laws`
- `benefits/us/state-benefits`
- `benefits/us/family-caregiver-pay`
- `benefits/us/tanf`
- `employment/entrepreneurship-and-self-employment`
- `employment/job-searching-with-a-disability`

**Progress:** 106 of 278 pages audited; 172 remain.

### 🔴 Correct immediately

#### `rights/us/ada`
- The EEOC deadline explanation is too broad. The charge period may extend from 180 to 300 days when a state or local agency enforces a law prohibiting the same type of discrimination; it is not simply 300 days in every state with an anti-discrimination law. Federal employees use a different process and generally must contact an EEO counselor within 45 days.
- Preserve the distinction between an administrative complaint deadline and the deadline for a private lawsuit. Title II administrative complaints generally must be filed within 180 days unless extended for good cause, but private-suit limitation periods vary by jurisdiction and claim. A reader should not infer that filing with DOJ preserves a lawsuit.
- The remedies section overstates monetary relief. Compensatory and punitive damages under Title I require intentional discrimination and are subject to statutory rules and caps; punitive damages are unavailable against government entities. Title II damages also require the applicable intent showing, and emotional-distress damages are unavailable under Spending Clause statutes such as Section 504.
- “The ADA does not protect people with all types of disabilities equally—particularly” the listed groups is an advocacy characterization, not a legal coverage rule. Explain the concrete exclusions, qualification requirements, and enforcement barriers instead.
- “Primary consideration” for a requested communication aid applies to Title II public entities. Title III entities must consult and provide effective communication but do not use the identical primary-consideration standard. Separate the two.
- Primary checks: [EEOC filing deadlines](https://www.eeoc.gov/time-limits-filing-charge), [ADA Title II regulations §35.170](https://www.ada.gov/law-and-regs/regulations/title-ii-2010-regulations/), [DOJ ADA complaint page](https://www.ada.gov/file-a-complaint/), [ADA effective-communication guidance](https://www.ada.gov/resources/effective-communication/).

#### `rights/us/section-504`
- The coverage list incorrectly includes federal contractors merely because they have federal contracts. Procurement contracts generally are not federal financial assistance; federal-contractor disability obligations arise under Section 503, not Section 504. Remove contractors from the Section 504 coverage list and employment test.
- The education comparison incorrectly says IDEA “requires specific learning disabilities or categories.” IDEA eligibility requires a qualifying disability category **and**, because of it, a need for special education and related services; it is not limited to learning disabilities.
- Federal Section 504 rules do not universally require annual review of every 504 plan. Schools must periodically reevaluate and reevaluate before a significant placement change; annual review may be local policy or best practice.
- Do not promise that a parent is necessarily a required member of a Section 504 eligibility “team” in the same way as an IDEA IEP team. Section 504 requires decisions by a knowledgeable group and procedural safeguards, including parent notice and challenge rights.
- “Recipients of federal funds must have grievance procedures” is overbroad. Under major Section 504 regulations, grievance-procedure and coordinator requirements commonly depend on recipient size, such as employing 15 or more people. State the relevant agency rule.
- The remedies section should say compensatory damages generally require intentional discrimination and that emotional-distress damages are unavailable under *Cummings*. Do not list “compensatory damages” without these reliance-critical limits.
- Primary checks: [Education Department Section 504 FAQ](https://www.ed.gov/laws-and-policy/individuals-disabilities/section-504), [HHS Section 504 final rule](https://www.federalregister.gov/documents/2024/05/09/2024-09237/), [Labor Department Section 503 overview](https://www.dol.gov/agencies/ofccp/section-503).

#### `employment/entrepreneurship-and-self-employment`
- “Social Security counts NET self-employment income” is dangerously incomplete. SSI generally counts net earnings from self-employment on a taxable-year basis, while SSDI substantial-gainful-activity and trial-work determinations can evaluate the value, hours, comparability, and worth of self-employment services—not only net profit.
- A trial-work month for self-employment can be triggered by hours worked or earnings. “Unlimited earnings” during the trial work period does not mean work need not be reported or cannot later inform disability cessation after the period.
- PASS does not simply let someone set aside money “without affecting SSI.” It requires SSA approval, a specific feasible work goal, qualifying income/resources and expenses, and ongoing compliance.
- IRWE is not synonymous with ordinary disability-related business expenses. It has separate requirements, including that the expense be necessary for work, paid by the person, not reimbursed, and reasonable.
- The SBA statement implies disability-specific grants may be available. SBA generally does not provide grants for starting or expanding ordinary small businesses; distinguish loans, counseling, contracting programs, and limited grant contexts.
- The UK New Enterprise Allowance ended in 2022 and must be removed. Universal Credit’s start-up period and Minimum Income Floor rules also need current official wording rather than “may apply after 12 months.”
- Australia’s Disability Support Pension does not use the pension Work Bonus in the general way implied here. Verify current DSP income-test, working-credit, and self-employment rules.
- “LLC: liability protection” needs a caveat that protection is limited, formalities and guarantees matter, and state law varies.
- Primary checks: [SSA self-employment evaluation](https://www.ssa.gov/OP_Home/cfr20/404/404-1575.htm), [SSA trial-work rule](https://www.ssa.gov/OP_Home/cfr20/404/404-1592.htm), [SSA PASS](https://www.ssa.gov/disabilityresearch/wi/pass.htm), [SBA funding programs](https://www.sba.gov/funding-programs).

#### `employment/job-searching-with-a-disability`
- “After job offer … can’t legally be rescinded for disability” is false as written. After a conditional offer, an employer may make permitted disability-related inquiries or medical examinations and may withdraw an offer when the applicant cannot perform essential functions with reasonable accommodation, accommodation would cause undue hardship, or a properly assessed direct threat cannot be reduced.
- Disclosure is not always purely a personal choice in every job or jurisdiction. Safety-sensitive roles, permitted post-offer examinations, benefit reporting, and accommodation requests can create lawful disclosure obligations. Scope this section to ordinary U.S. ADA-covered hiring and note exceptions.
- “Illegal questions (in most jurisdictions)” mixes U.S. ADA examples into a globally framed page. State that the rules shown are for ADA-covered U.S. employers and that smaller employers and other countries may differ.
- The SSDI trial-work period and 36-month extended period are oversimplified. Trial-work months are triggered by earnings or, for self-employment, services/hours; after the trial period, the extended period is not 36 months of guaranteed payments, and benefits are generally payable only for eligible months under the work rules.
- The WIPA reference should warn that services are aimed at eligible Social Security beneficiaries and availability/prioritization may vary; “work with a benefits counselor before accepting a job” may not always be possible.
- Primary checks: [EEOC pre-employment disability guidance](https://www.eeoc.gov/pre-employment-inquiries-and-disability), [SSA returning-to-work guidance](https://www.ssa.gov/disability/work), [SSA trial-work rule](https://www.ssa.gov/OP_Home/cfr20/404/404-1592.htm).

### 🟠 Important clarification

#### `rights/us/air-carrier-access-act`
- The opening advance-notice guidance should identify the accommodations for which airlines may require up to 48 hours’ notice and early check-in. Advance notice is not merely optional for every service.
- Service-animal form timing needs exceptions. An airline may require submission up to 48 hours before departure when the reservation was made before that point, but must accommodate later bookings and passengers unable to complete the form because of disability under the applicable rules.
- “Airlines can require [a] service animal to fit within passenger’s foot space” is incomplete. DOT rules address the animal fitting in the handler’s foot space or, when appropriate, on the handler’s lap, and airlines must consider seating options before denying transport.
- The onboard-wheelchair statement is inaccurate. On aircraft with more than 60 seats without an accessible lavatory, an airline must provide an onboard wheelchair when a passenger gives the required advance notice; the rule is not limited to aircraft already having accessible lavatories.
- Update the mobility-device section for DOT’s 2024 wheelchair rule, including the strengthened standards for safe and dignified assistance, prompt return, mishandling, repair/replacement, loaner devices, and training, with each provision’s effective date.
- Clarify that airport accessibility obligations can arise under the ADA and Section 504 depending on the airport/entity; airports are not uniformly “public accommodations.”
- Primary checks: [DOT disability bill of rights](https://www.transportation.gov/airconsumer/disabilitybillofrights), [DOT ACAA summary](https://www.transportation.gov/airconsumer/passengers-disabilities), [DOT wheelchair final rule](https://www.transportation.gov/airconsumer/final-rule-ensuring-safe-accommodations-air-travelers-PDF).

#### `rights/us/state-disability-rights-laws`
- The page contains many state-specific thresholds, remedy claims, and superlatives such as “strongest” that require current statutory or agency citations and access dates. Keep the corrected New York and Illinois thresholds, but verify every other state entry before publication.
- “Every state has an agency responsible for civil rights enforcement” is too categorical; enforcement structures and jurisdiction vary, and some agencies may not cover the reader’s claim. Direct readers to an official state directory and counsel.
- Cross-filing is not automatic. State and federal worksharing arrangements, claim coverage, and filing choices vary; readers should confirm whether a charge was actually dual-filed and preserve the shortest deadline.
- P&A organizations do not necessarily provide free legal help or representation for every disability-rights issue. Their statutory programs, priorities, capacity, and intake criteria control.
- “No cap on damages” statements should identify which damages, claims, defendants, and statutes are meant; other legal limits can still apply.

### 🟡 Pass with minor notes

#### `benefits/us/state-benefits`
- Pass. This is explicitly a placeholder and avoids concrete program eligibility, amounts, or deadlines.
- Future state sections should require official program links, effective/access dates, interaction rules, and separate treatment of short-term disability insurance, public assistance, Medicaid waivers, and public-employee pensions.

#### `benefits/us/family-caregiver-pay`
- Pass. The page clearly warns that eligibility and permitted family caregivers vary by state and program.
- Add that Medicaid self-direction may involve assessed need, service-plan approval, employer/payroll responsibilities, caps, and waiting lists. Paid-caregiver income can also receive special tax or benefit treatment in some circumstances, so it should not always be described as ordinary earned income.

#### `benefits/us/tanf`
- Pass. The page appropriately stays general and emphasizes state variation.
- Add a stronger warning to request disability-related reasonable modifications or exemptions promptly, document the request, and appeal sanctions by the notice deadline. TANF time-limit, family-cap, work-rule, and sanction policies must be sourced state by state.

## Full audit expansion — batch 11 (9 pages)

Pages audited:
- `rights/North-America/US/ADA`
- `rights/Overview`
- `rights/global-overview`
- `rights/history-of-disability-rights`
- `rights/index`
- `benefits/index`
- `education/adult-and-continuing-education`
- `education/disclosure-to-teachers`
- `employment/index`

**Progress:** 115 of 278 pages audited; 163 remain.

### 🔴 Correct immediately

#### `benefits/index`
- The SSDI section says Medicare begins “after 9 months of benefits.” This is false and may distort health-coverage planning. Medicare generally begins after 24 months of entitlement to Social Security disability benefits, with different rules for ALS and ESRD. The nine-month figure belongs to the trial work period, not Medicare eligibility.
- The SSI section incorrectly treats the $943 2024 federal benefit amount as an income eligibility limit. SSI countable-income eligibility is not determined by simply earning less than the maximum federal payment, and the amount is outdated.
- “You’re a U.S. citizen or permanent resident” overstates SSI noncitizen eligibility. Only certain qualified noncitizens meeting additional conditions qualify; lawful permanent residence alone is insufficient.
- “Car up to certain value” is outdated SSI resource guidance. One vehicle used for transportation is generally excluded regardless of value; other vehicle/resource rules differ.
- Section 1619(b) is placed under “SSDI Work Incentives” and says Medicaid can continue when SSDI stops. Section 1619(b) is an **SSI** work incentive for qualifying former SSI cash recipients. Correct this immediately.
- A trial work period is not simply nine months of “any amount” of work. Months count when the beneficiary performs services under SSA rules; self-employment hours and activity matter, and work must be reported.
- Expedited reinstatement is not a promise that benefits will be restored “quickly.” It has a five-year request window, disability/work requirements, provisional-benefit rules, and a new determination.
- Means-tested programs are not “available to anyone meeting income requirements”; disability, age, household, immigration, categorical, work, and state rules also apply.
- “Having help increases your chances of winning” needs a defined evidence source or should be rewritten without promising an outcome.
- Primary checks: [SSA Medicare information](https://www.ssa.gov/disabilityresearch/wi/medicare.htm), [SSA SSI eligibility](https://www.ssa.gov/ssi/eligibility), [SSA section 1619(b)](https://www.ssa.gov/disabilityresearch/wi/1619b.htm), [SSA returning-to-work guidance](https://www.ssa.gov/disability/work).

#### `rights/index`
- The employment quick guide is materially wrong. Federal employees are protected by Rehabilitation Act Section 501, not ADA Title I. Title IX is not the general disability-employment law for school or university employees. Federal contractors are principally covered by Section 503, not Section 504 merely because they are contractors.
- The education quick guide overstates coverage. Private colleges are not automatically covered by ADA Title II; Title II applies to public entities, while Title III and Section 504 coverage depend on the institution and funding. Religious schools may be exempt from ADA Title III.
- The housing guide says “any housing receiving federal funding” is covered by the Fair Housing Act. FHA coverage does not depend on federal funding and has exemptions; federally assisted housing may also be covered by Section 504 and other rules.
- “ADA Complaints: File with DOJ, HHS, Department of Education, or FTC depending on sector” is unreliable. The FTC is not the general ADA complaint agency, and employment, transportation, air travel, and other claims have distinct agencies and procedures.
- “IDEA complaints: File with your state Department of Education” is incomplete. IDEA offers state complaints, due-process complaints/hearings, mediation, and other procedures with different issues, deadlines, and exhaustion consequences.
- The legal-aid section promises “you don’t need to hire a lawyer” and describes resources as free too broadly. Availability, eligibility, scope, and capacity vary; some matters are difficult to pursue without counsel.
- Primary checks: [EEOC Rehabilitation Act overview](https://www.eeoc.gov/rehabilitation-act-1973), [ADA complaint routing](https://www.ada.gov/file-a-complaint/), [Education Department IDEA dispute-resolution resources](https://sites.ed.gov/idea/parents-families/).

#### `rights/global-overview`
- The African regional-framework section is outdated: the African Disability Protocol is no longer “not yet in force.” It entered into force on **May 3, 2024** after the fifteenth ratification instrument was deposited.
- The page makes dozens of current country-law, institutional, implementation, and organizing claims without citations or access dates. Treat this as a high-risk comparative-law page: verify each country section against official law/status sources and local disability-led expertise.
- “Most countries have signed CRPD” is imprecise and uses signature rather than ratification/party status as the meaningful obligation measure. Link to the live UN treaty status and distinguish signature, ratification, accession, and domestic enforceability.
- Statements such as “strong government commitment,” “strong legal framework,” “good laws,” and “limited independent organizing” require defined criteria and sources or should be framed as attributed analysis.
- The U.S. enforcement list incorrectly associates the Education Department OCR with IDEA enforcement without explaining that IDEA dispute resolution is principally administered through state educational agencies and distinct procedures.
- Primary checks: [African Union Disability Protocol text/status page](https://au.int/pt/node/36233), [African Commission 2024 entry-into-force resolution](https://africanlii.org/en/akn/aa-au/doc/resolution/2024-11-06/617/eng%402024-11-06/source.pdf), [UN CRPD treaty status](https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4).

#### `employment/index`
- Federal employees are not protected by ADA Title I as stated; federal-sector disability employment protection arises under Rehabilitation Act Section 501, using ADA standards.
- “Trial Work Period: 9 months of any earnings without losing benefits” is wrong. Months count when SSA’s services threshold is met, including self-employment activity/hours, and all work must be reported.
- The accommodation documentation advice is too rigid: a doctor’s note is not always required, and an employer may seek only reasonable documentation when disability or need is not obvious. Other appropriate professionals may document the need.
- “Modified job duties” should distinguish restructuring marginal functions from eliminating essential functions, which is generally not required.
- “Traditional employment” is not necessarily paid at minimum wage or higher; lawful subminimum-wage arrangements still exist in limited contexts. Do not define them out of existence.
- “Supported employment … support is available permanently” is a dangerous promise. Funding source, eligibility, extended-services provider, and duration vary; VR-supported-employment funding itself is time-limited subject to specific extensions/rules.
- The EEOC deadline shorthand again needs the correct 180/300-day explanation and a separate federal-employee process.
- Primary checks: [EEOC federal disability protection](https://www.eeoc.gov/disability-discrimination-and-employment-decisions), [EEOC accommodation guidance](https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada), [SSA returning-to-work guidance](https://www.ssa.gov/disability/work).

### 🟠 Important clarification

#### `education/adult-and-continuing-education`
- “Self-diagnosis, doctor letters, and diverse evidence all count” and “you don’t need a formal diagnosis” are presented too categorically. A person may request an accommodation without special wording, but a covered institution may require reasonable documentation of disability and need when not obvious. Informal and non-covered programs may have different duties.
- “Vocational rehabilitation … provides free training” is an overpromise. VR eligibility, individualized-plan approval, comparable benefits, financial participation, service scope, and funding vary; not every desired training program is funded.
- WIOA programs are not universally free training for every adult with barriers. Eligibility, priority, local funding, approved providers, and available services vary.
- The list of “platforms with good accessibility” needs current testing or attribution. Platform accessibility can vary by course content, authoring choices, app/version, and feature.
- The statement that SSI/SSDI work incentives protect benefits “while you learn/earn” conflates education with work and overstates protection. Explain the applicable incentive and reporting rule.
- Primary check: [Education Department postsecondary accommodation guidance](https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/disability-discrimination-key-issues/disability-discrimination-academic-adjustments-postsecondary-students).

#### `education/disclosure-to-teachers`
- “This is a decision you get to make” and “you never have to share [a] specific diagnosis” need context. A student can control disclosure to an individual instructor in many situations, but may need to provide appropriate disability documentation to an authorized office to establish eligibility; K–12 schools also have existing records and implementation duties.
- “Teachers should already know about your accommodations” may not be operationally true and could encourage reliance. Schools must implement plans, but communication failures occur; students/families should know the designated escalation path.
- Higher-education processes vary. Not every institution uses letters delivered by the student, and instructors do not independently approve or reject authorized accommodations.
- “College: full responsibility for disclosure and advocacy” is too absolute. Students initiate accommodation requests, but institutions retain nondiscrimination, accessibility, interactive-process, and effective-implementation duties.
- The K–12 least-restrictive-environment statement is specifically an IDEA rule; do not present it as an identical entitlement for every student covered only by Section 504.

#### `rights/history-of-disability-rights`
- The page is valuable but contains many uncited historical superlatives, precise dates/counts, causal claims, and broad regional summaries. Add citations, especially for “first” and “longest” claims, protest attendance, organization founding dates, and claims about movement impact.
- “Indigenous communities worldwide often integrated disabled people with distinct spiritual or social roles” is an unsupported global generalization that risks flattening highly diverse cultures. Replace it with specific, sourced examples.
- “This principle … has been central to every successful movement” is an absolute interpretive claim; attribute it or narrow it.
- The Capitol Crawl account should distinguish the size of the broader rally from the number of activists who crawled and cite a reliable historical source.

### 🟡 Pass with minor notes

#### `rights/North-America/US/ADA`
- Pass. This is a clear moved-page pointer to the maintained ADA page and contains no substantive legal guidance.
- Correct the title typo (“Disabilties”) when source-page editing is permitted.

#### `rights/Overview`
- Pass. This is a clear moved-page pointer to the maintained rights index and contains no substantive legal guidance.

## Full audit expansion — batch 12 (9 pages)

Pages audited:
- `healthcare/accessible-healthcare`
- `healthcare/home-and-community-care`
- `healthcare/hospital-preparation`
- `healthcare/index`
- `healthcare/pain-and-fatigue`
- `healthcare/systemic-trauma`
- `healthcare/weight-bias`
- `transport/air-travel-rights`
- `transport/service-animals`

**Progress:** 124 of 278 pages audited; 154 remain.

### 🔴 Correct immediately

#### `healthcare/home-and-community-care`
- The *Olmstead* summary omits reliance-critical limits. The ADA integration mandate does not create an unconditional entitlement to any requested community service; the analysis includes whether community placement is appropriate, the person does not oppose it, and the placement can be reasonably accommodated, considering state resources and the needs of others.
- “State Plan Services: Covered for all Medicaid beneficiaries who need them” is false. Home health is mandatory for certain eligible groups, while personal care and many other HCBS authorities are optional; medical/functional eligibility, service limits, state plan terms, authorization, and provider availability apply.
- Medicare home health is not categorically “time-limited.” Coverage can continue while the beneficiary continues to meet the homebound, skilled-service, plan-of-care, and other requirements; Medicare does not cover 24-hour home care or personal care alone.
- “SSI recipients are automatically Medicaid-eligible in most states” needs a section 1634/SSI-criteria/209(b) state distinction and a warning to apply or verify status.
- NDIS access criteria are oversimplified, and “people who become disabled after 65 aren’t eligible” obscures residence, age-at-access-request, early-intervention, and continued-participant rules. Link to current NDIS access criteria.
- Self-direction does not inherently produce more service hours because agency overhead is avoided. Authorized hours/budgets, wage rules, fiscal-management costs, and program design control.
- Do not imply CILs can assess eligibility, secure immediate care, or assist every applicant; services and capacity vary.
- Primary checks: [DOJ *Olmstead* guidance](https://www.ada.gov/resources/olmstead-mandate/), [Medicaid HCBS authorities](https://www.medicaid.gov/medicaid/home-community-based-services/index.html), [Medicare home health coverage](https://www.medicare.gov/coverage/home-health-services), [NDIS access criteria](https://www.ndis.gov.au/applying-access-ndis/am-i-eligible).

#### `healthcare/index`
- “You have the right to medication that works for you” is not a legal or clinical entitlement and can imply a provider must prescribe a requested drug. Patients generally have rights to informed participation, nondiscrimination, appropriate assessment, and refusal subject to exceptions—not a guaranteed medication or outcome.
- “You have the right to refuse medication” needs exceptions for incapacity, emergencies, court orders, guardianship/substitute decision-making, and jurisdiction-specific involuntary-treatment law.
- “You have the right to pain management options” is too categorical. Patients have rights to nondiscriminatory assessment and informed care, but no universal right to a particular pain treatment or opioid prescription.
- The reproductive-rights list is framed as universally enforceable despite major jurisdictional restrictions, capacity/guardianship issues, and changing abortion law. Distinguish human-rights principles from current domestic legal access.
- “It’s okay to cancel” needs a practical warning about urgent symptoms, medication continuity, cancellation fees, dismissal policies, and rescheduling essential care.

#### `transport/service-animals`
- The U.S. definition is wrong: under the ADA, service animals are dogs. Miniature horses are addressed under a separate reasonable-modification assessment; they are not included in the regulatory definition of “service animal.”
- “Go anywhere the public goes” is overbroad. ADA service-animal access has entity exemptions and context-specific limits, including private clubs/religious organizations and areas where the animal’s presence would fundamentally alter the service or pose a legitimate safety risk.
- The removal grounds list is incomplete. Direct threat and fundamental alteration can also support exclusion under the applicable rules, in addition to lack of control and failure to housebreak.
- Workplace access is not automatic service-animal public access. It is assessed as a reasonable accommodation under Title I, and an employer may request reasonable documentation of disability and accommodation need when not obvious—not merely ask about tasks.
- Fair Housing Act assistance-animal protections are not an unconditional rule that all landlords “must allow” every service animal or ESA. FHA exemptions, disability-related need, reliable information when need is not apparent, direct threat, undue financial/administrative burden, fundamental alteration, and damage responsibility matter.
- ESA housing documentation need not always come from a “licensed mental health provider” with a treatment relationship. HUD discusses reliable disability-related information and warns against insufficient internet certificates; state laws may add rules.
- U.S. air-travel rules do not impose a blanket advance-notice requirement for service dogs. Airlines may require DOT forms and advance submission only under specified timing conditions.
- Primary checks: [ADA service-animal requirements](https://www.ada.gov/resources/service-animals-2010-requirements/), [EEOC accommodation guidance](https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada), [HUD assistance-animal guidance](https://www.hud.gov/program_offices/fair_housing_equal_opp/assistance_animals), [DOT service-animal rule](https://www.transportation.gov/individuals/aviation-consumer-protection/final-rule-traveling-air-service-animals).

#### `transport/air-travel-rights`
- This page duplicates the ACAA page but omits the critical airline-complaint timing rules: airlines need not address a direct written complaint received more than 45 days after the incident unless DOT refers it, and DOT refers complaints received within six months. Add these prominently.
- “Right to specific seats,” “should receive wheelchair back at aircraft door,” and “airlines must accept wheelchairs” all require aircraft, safety, space, advance-notice, and operational qualifications. Use DOT’s precise disability bill of rights rather than categorical shorthand.
- The safety-assistant statement “they must provide one or give a free ticket” is imprecise and may cause a passenger to arrive without required assistance. Explain the exact rule for a carrier-required assistant, disagreement with the passenger’s self-assessment, and who selects/provides the assistant.
- Canada’s one-person-one-fare policy is not a universal rule for every airline, route, or extra seat. Scope it to the applicable Canadian Transportation Agency rules and carrier/route coverage.
- The EU coverage sentence is wrong. Regulation 1107/2006 generally covers passengers using EU airports, with some provisions for arrivals from third countries applying only when the operating carrier is an EU carrier; state the exact scope.
- “Laws of departure country apply at departure; laws of arrival country apply at arrival” is an unsafe oversimplification. Carrier nationality, route, airport, treaty, and regulation scope determine coverage.
- “You’re entitled to reasonable expenses while waiting” for lost medical equipment is not established as a universal rule. Explain the applicable baggage/assistive-device claim process and preserve receipts without promising reimbursement.
- Update the U.S. wheelchair section for DOT’s 2024 final rule and its provision-specific effective dates.
- Primary checks: [DOT disability bill of rights](https://www.transportation.gov/airconsumer/disabilitybillofrights), [DOT ACAA overview](https://www.transportation.gov/airconsumer/passengers-disabilities), [DOT wheelchair final rule](https://www.transportation.gov/airconsumer/final-rule-ensuring-safe-accommodations-air-travelers-PDF), [EU air rights for reduced mobility](https://transport.ec.europa.eu/transport-themes/passenger-rights/passenger-rights-travel-air/people-reduced-mobility_en).

### 🟠 Important clarification

#### `healthcare/accessible-healthcare`
- The entitlement list is too categorical. Accessible equipment, extended appointment time, transfer assistance, support-person presence, and particular communication aids depend on the governing law, effective dates, individualized need, safety, fundamental-alteration/undue-burden standards, and setting.
- A provider generally cannot charge the patient for required effective-communication aids, but not every requested interpreter or aid is automatically required; the provider must ensure effective communication after an individualized assessment.
- “Sign language interpreter (often need 48+ hours notice)” risks shifting legal responsibility to the patient. Advance requests help operationally, but covered providers remain responsible for effective communication and must address urgent care.
- Recording an appointment is governed by consent/privacy law and facility policy. “Ask if you can record” is sound; add that covert recording may be unlawful.
- Bringing a support person is not an absolute access right in every clinical situation; privacy, infection control, safety, patient preference, and essential clinical restrictions can affect access, while reasonable modification duties still apply.

#### `healthcare/hospital-preparation`
- “Family members cannot be required to provide interpretation or assistance” needs the ADA’s narrow emergency/imminent-threat and patient-request exceptions for accompanying adults, plus the stricter limits concerning minor children.
- Do not imply every hospital is covered identically by ADA Titles II and III, Section 504, and ACA Section 1557. Coverage depends on whether it is a public entity, public accommodation, federal-funds recipient, or covered health program/activity.
- “Written notes are not adequate for complex medical communication” may often be true but requires an individualized effective-communication assessment; avoid declaring one aid legally inadequate in every case.
- “Request copies of all medical records before leaving” may not be feasible, free, or immediately available. Advise requesting discharge materials before leaving and using the applicable records-access process for the complete record.
- P&A organizations and DREDF cannot necessarily provide individual representation or technical assistance in every case; qualify availability.

#### `healthcare/pain-and-fatigue`
- “Tapering should be gradual and with your input” is directionally consistent with federal guidance for many long-term opioid patients, but it is not an absolute right; urgent life-threatening concerns can justify faster action. Advise against abrupt discontinuation except when clinically necessary and direct readers to urgent care for withdrawal, overdose, or crisis risks.
- “Pacing is the answer” for a boom-bust cycle is too prescriptive across heterogeneous conditions. Pacing may help, especially with post-exertional malaise, but individualized medical evaluation is needed and some symptoms require urgent investigation.
- The medication examples and movement suggestions need a clear medical-safety disclaimer because contraindications and condition-specific harms differ.
- Employment/school/public accommodation rights depend on disability status, covered entity, qualification, and requested modification; do not promise accommodation solely because someone experiences pain or fatigue.
- Primary check: [CDC opioid-guideline recommendation 5](https://www.cdc.gov/overdose-prevention/hcp/clinical-guidance/recommendations-and-principles.html).

#### `healthcare/systemic-trauma`
- The “what gets misdiagnosed” table can inadvertently validate dangerous symptoms or discourage appropriate care by reframing paranoia, nonadherence, health anxiety, depression, or attachment concerns as merely reasonable responses. Present these as possibilities requiring trauma-informed assessment, not alternate diagnoses.
- Add urgent-safety guidance for psychosis, suicidality, severe withdrawal, abuse, and immediate medical danger. Systemic harm and a treatable medical or psychiatric emergency can coexist.
- “Providers who believe your account” should become providers who take the account seriously, assess carefully, communicate uncertainty, and avoid dismissal. Clinicians should not be expected to accept every interpretation without evaluation.
- Avoid recommending disengagement or minimizing contact with necessary systems without a safety/continuity plan.

#### `healthcare/weight-bias`
- The page makes broad clinical claims—“many treatments work regardless of weight,” BMI cutoffs are “often arbitrary,” most people regain weight, health behaviors matter more than weight, and weight-neutral approaches have better outcomes—without named studies, populations, treatment contexts, or limitations. Source and narrow each claim.
- “You have the right to decline being weighed” is not universal. A patient may generally refuse, but a provider may determine weight is clinically necessary for dosing, anesthesia, equipment safety, monitoring, or treatment and may decline to proceed safely without it.
- Asking that a clinician document a denial is useful, but patients cannot necessarily dictate chart language. Explain record-access and amendment/addendum rights.
- Avoid implying all weight-based treatment criteria are discriminatory. Require individualized, evidence-based assessment and distinguish unjustified bias from clinically supported risk criteria.

## Full audit expansion — batch 13 (9 pages)

Pages audited:
- `transport/driving-and-adaptive-driving`
- `transport/index`
- `transport/mobility-aids`
- `transport/paratransit`
- `transport/public-transit-rights`
- `housing/accessible-housing-search-guide`
- `housing/home-modifications`
- `housing/homelessness-and-disability`
- `housing/international-housing-rights`

**Progress:** 133 of 278 pages audited; 145 remain.

### 🔴 Correct immediately

#### `transport/paratransit`
- The page omits the ADA’s 21-day decision rule. If an agency has not made an eligibility determination within 21 days after receiving a completed application, the applicant must receive presumptive eligibility until a decision is made.
- “During appeal, you may be entitled to service” is misleading. Continued service during an initial eligibility appeal is not generally required merely because an appeal is pending; presumptive eligibility applies after the agency misses the 21-day determination deadline. Service is required during an appeal of a suspension when the appeal is filed under the applicable rule.
- The service-area rule needs rail and corridor qualifications. Complementary paratransit generally covers corridors three-quarters of a mile on each side of fixed bus routes and areas around rail stations, with specific boundary rules; it is not simply every location within three-quarters of any route.
- The fare rule needs precision: ADA complementary-paratransit fare may not exceed twice the full fixed-route fare for a similar trip at a similar time, excluding discounts. A personal care attendant rides free; at least one companion must be allowed and pays the same fare as the eligible rider, with additional companions accepted on a space-available basis.
- The page does not state that agencies must allow reservations during normal business hours on all days before service days and may negotiate pickup time only within one hour before or after the requested time.
- “Door-to-door” is too categorical. Complementary paratransit is origin-to-destination service; agencies may use curb-to-curb service but must provide assistance beyond the curb when needed for an eligible rider to complete the trip.
- Eligibility is not limited to a person who “cannot” use transit in all circumstances; conditional eligibility may apply trip by trip when environmental or architectural conditions prevent use.
- The no-show section must state that suspensions may be imposed only for a pattern or practice of missed trips, excluding circumstances beyond the rider’s control, and require notice and appeal rights.
- Primary checks: [FTA ADA Circular, Chapter 9](https://www.transit.dot.gov/regulations-and-guidance/fta-circulars/americans-disabilities-act-guidance-pdf), [49 CFR Part 37](https://www.ecfr.gov/current/title-49/subtitle-A/part-37).

#### `transport/index`
- “Companion can ride free if needed for accessibility” is wrong for ADA complementary paratransit. A personal care attendant rides free; a companion generally pays the same fare as the eligible rider.
- The paratransit summary says it is door-to-door and has “limited hours.” ADA complementary paratransit is origin-to-destination and must operate during the same days and hours as the corresponding fixed route, though non-ADA community transport can differ.
- The air-travel section promises “accessible seating (wide seats, extra legroom),” medication/equipment storage, and wheelchair accessibility too broadly. Aircraft configuration, safety rules, assistive-device priority, and required accommodations are more specific; use DOT’s disability bill of rights.
- The service-animal section says cats on planes may use pet rules directly beside mandatory service-dog language, risking confusion. Only trained dogs qualify as service animals under current U.S. air-travel rules; cats are pets subject to carrier policy.
- “Only dogs and miniature horses are legally considered service animals under ADA” is wrong. Dogs are the ADA-defined service animals; miniature horses are subject to a separate reasonable-modification assessment.
- The mobility-equipment funding summary implies Medicare/Medicaid coverage generally without eligibility, medical-necessity, supplier, home-use, authorization, and state-plan limits.
- Primary checks: [FTA ADA paratransit guidance](https://www.transit.dot.gov/regulations-and-guidance/civil-rights-ada/ada-regulations), [DOT disability bill of rights](https://www.transportation.gov/airconsumer/disabilitybillofrights), [ADA service-animal requirements](https://www.ada.gov/resources/service-animals-2010-requirements/).

#### `housing/home-modifications`
- The U.S. funding amounts are stale or wrong. The FY2025 SAH maximum is outdated for a June 2026 audit; HISA is not simply “up to $2,000” and has different lifetime limits based on whether the condition is service connected; USDA Section 504 grant/loan limits and age requirements must use current official guidance.
- Do not direct ordinary VA-benefit questions to the Veterans Crisis Line. That line is for crisis support, not grant administration; direct readers to VA housing-adaptation and prosthetic/sensory-aids contacts.
- “Section 504 requires landlords to pay for modifications in federally-assisted housing” is too broad. Section 504 applies to recipients’ programs and generally requires necessary structural changes unless an applicable defense exists; coverage and responsibility depend on the recipient/program, not merely any tenant using a Section 8 voucher in otherwise private housing.
- “Some modifications can be installed without landlord permission if they don’t damage property” is unsafe legal advice. Lease terms, building rules, code, and state/local law may require permission even for apparently minor installations. Advise obtaining written consent.
- The suggested 14-day response deadline is not a universal legal deadline. Label it as a requested response date, not a requirement.
- The medical-expense deduction explanation omits that deductible capital improvements may be reduced by any resulting increase in property value and that only taxpayers itemizing and exceeding the applicable threshold benefit.
- Canada’s Community Care Access Centres no longer exist in Ontario, and “Accessibility Supports Ontario” needs verification. The provincial section is stale.
- The European Accessibility Act does not generally establish funding or physical home-modification standards, and EN 301 549 is not simply “equivalent to WCAG.” Remove this misleading connection.
- UK Disabled Facilities Grant maximums and means testing vary by nation; £30,000 is the England maximum, not a UK-wide rule. Children’s applications are not means tested in England.
- Australia NDIS home-modification funding is not accurately summarized by an unsupported “average $5,000–15,000.” Remove the figure and use current NDIS guidance.
- Primary checks: [VA housing grants](https://www.va.gov/housing-assistance/disability-housing-grants/), [VA HISA](https://www.prosthetics.va.gov/psas/HISA2.asp), [USDA Section 504 repair program](https://www.rd.usda.gov/programs-services/single-family-housing-programs/single-family-housing-repair-loans-grants), [HUD Section 504 FAQ](https://www.hud.gov/program_offices/fair_housing_equal_opp/disabilities/sect504faq), [UK Disabled Facilities Grants](https://www.gov.uk/disabled-facilities-grants).

#### `housing/homelessness-and-disability`
- Nearly every headline statistic lacks a named source, geography, definition, denominator, and year. This includes “50%” disabled, mental-health/substance-use/IDD prevalence ranges, 2.5 million U.S. annual homelessness, HUD-VASH/PATH counts, country totals, Housing First retention/cost savings, the 88% reduction, and the claimed 73% increase “where Housing First not fully implemented.” Remove or rebuild from primary datasets and named studies.
- CRPD ratification is stale at “186 countries,” and treaty parties should not be described casually as countries. Use the live UN treaty-status page with an access date.
- “Homelessness represents the most severe violation” of Article 19 is an unsourced normative ranking, not treaty language. Attribute or narrow it.
- Housing First evidence is overstated as one universal result for all disabled people and all contexts. Define the model, population, comparison, outcomes, period, and study; distinguish housing stability from other health/social outcomes.
- Finland has not “effectively eliminated chronic homelessness.” It substantially reduced long-term homelessness but homelessness persists; use current official Finnish statistics.
- Homelessness Australia is not a federal agency; it is a national homelessness peak body. Correct the organizational description.
- “Community Legal Centers: Free legal assistance” and similar resource promises need eligibility/capacity caveats.
- The page contains unsupported causal claims about austerity, welfare cuts, mental-health-service cuts, and policy implementation. These may be defensible but require direct evidence.
- Primary checks: [UN CRPD treaty status](https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4), [HUD annual homelessness reports](https://www.huduser.gov/portal/datasets/ahar.html), [Finland homelessness statistics](https://www.ara.fi/en-US/Materials/Homelessness_reports), [Homelessness Australia](https://homelessnessaustralia.org.au/).

### 🟠 Important clarification

#### `transport/public-transit-rights`
- Amtrak is not accurately summarized as private transportation covered by ADA Title III. Intercity and commuter rail have specific statutory/regulatory provisions; separate public entities, private entities primarily engaged in transportation, Amtrak, commuter rail, and demand-responsive services.
- “Vehicles must be accessible” needs acquisition/date/vehicle-type and equivalent-service qualifications. Legacy systems and inaccessible vehicles/stations remain subject to more specific rules.
- Complementary paratransit is not an entitlement merely because someone cannot use transit in a general sense; the fixed-route operator, trip, disability-related functional limitation, service area, and eligibility process matter.
- Drivers must use lifts/ramps and provide required assistance, but the page should distinguish assistance with boarding/securement from personal services not required by the ADA.
- Update EU rail law references: Regulation (EU) 2021/782 recast the rail-passenger-rights framework and applies from June 7, 2023, replacing the older Regulation 1371/2007 for current guidance.
- UK Passenger Assist notice and turn-up-and-go descriptions require current operator/ORR sourcing and should not promise successful assistance in every circumstance.
- Primary checks: [FTA ADA regulations and guidance](https://www.transit.dot.gov/regulations-and-guidance/civil-rights-ada/ada-regulations), [EU rail passenger rights](https://transport.ec.europa.eu/transport-themes/passenger-rights/rail_en).

#### `transport/mobility-aids`
- Medicare Part B does not simply cover listed mobility aids. Coverage generally requires DME criteria, medical necessity for use in the home, a prescription/order and documentation, and an enrolled supplier; power mobility has additional rules.
- “Uses competitive bidding suppliers” is outdated/overbroad because the Medicare DMEPOS Competitive Bidding Program’s prior contracts ended and current supplier rules should be checked by location/item.
- Insurance-denial steps are not universal. Peer-to-peer review, external review, insurance-department jurisdiction, and deadlines vary by plan type and governing law; tell readers to follow the denial notice immediately.
- Used equipment can create fit, safety, recall, battery, repair, and infection-control risks. Add professional assessment and inspection guidance, especially for seating, complex rehab, and powered mobility.
- “Airlines must transport wheelchairs and mobility devices free” needs aircraft size/physical impossibility and hazardous-battery qualifications plus current DOT mishandling remedies.
- Primary checks: [Medicare mobility-device coverage](https://www.medicare.gov/coverage/wheelchairs-scooters), [DOT disability bill of rights](https://www.transportation.gov/airconsumer/disabilitybillofrights).

#### `transport/driving-and-adaptive-driving`
- “Professional evaluation is essential” is strong safety advice but not a universal legal requirement. Distinguish recommended driver-rehabilitation assessment from each licensing authority’s actual requirements.
- State/provincial medical-reporting duties vary significantly and can be mandatory, permissive, or prohibited in specific circumstances. Link readers to the licensing authority and warn that failure to report a required condition can affect licensing or insurance.
- Funding descriptions should not imply VR, VA, workers’ compensation, charities, or provincial assistive-device programs will fund a vehicle or adaptations. Eligibility, employment nexus, service connection, authorization, and exclusions matter.
- Ontario’s Assistive Devices Program generally should not be presented as a likely vehicle-adaptation fund without a current program-specific source.
- The UK list of reportable conditions is illustrative and can become stale; direct readers to DVLA’s current medical-condition checker.
- Primary check: [DVLA medical conditions](https://www.gov.uk/health-conditions-and-driving).

#### `housing/accessible-housing-search-guide`
- Verify every named database before publication. The claimed “National Accessible Apartment Clearinghouse” and its 46,000-unit figure need a reliable source; state housing-search coverage and phone numbers can change.
- A 1:12 ramp slope, 32-inch doorway, bathroom dimensions, toilet height, turning circle, and grab-bar strength are design-reference values, not universal tests of whether a home is legally accessible or usable by a particular person. Identify the relevant code/standard and advise individualized assessment.
- “Housing authorities must provide accessible unit lists upon request” is too categorical. They have reasonable-accommodation and program-accessibility duties, but the exact records/tools available vary.
- A voucher payment standard up to 120% of FMR may be approved as a reasonable accommodation in defined circumstances; it is not an automatic “additional right,” and amounts above 120% generally require HUD approval.
- The Fair Housing Act’s March 13, 1991 design-and-construction date applies to covered multifamily dwellings first occupied after that date, not every building “constructed after” the date.
- UK Equality Act reasonable-adjustment duties for let premises do not generally mean landlords can always be required to install physical accessibility features. State the premises-specific limitations and use current UK housing guidance.
- Correct the Housing Ombudsman URL typo and distinguish its jurisdiction from private-sector tenancy remedies.
- Primary checks: [HUD reasonable accommodations under the voucher program](https://www.hud.gov/sites/dfiles/PIH/documents/HCV_Guidebook_Reasonable_Accommodations.pdf), [HUD Fair Housing design requirements](https://www.hud.gov/program_offices/fair_housing_equal_opp/disabilities/fhefhag).

#### `housing/international-housing-rights`
- Replace the stale “ratified by 186 countries” count with the live UN treaty-status link and distinguish states parties from countries/signatories.
- The statement that CRPD “guides domestic interpretation” in the United States is too broad. It is not ratified and therefore not binding federal treaty law; any persuasive use is court- and context-specific.
- Article 12 does not simply “reject guardianship.” The Committee’s interpretation strongly favors supported decision-making and abolition of substitute regimes, but domestic law and international debate/enforcement must be described accurately.
- The ICESCR Optional Protocol does not create an enforcement mechanism for every state party; complaints apply only against states parties to the Optional Protocol and require admissibility conditions.
- Regional instruments do not all “establish that housing discrimination based on disability is prohibited” in the same direct way. Cite the relevant provision and jurisdiction.
- CRPD obligations are binding on states parties, not automatically on private landlords everywhere. Domestic implementation determines direct claims and remedies.
- “This applies universally regardless of your government’s CRPD ratification status” is false as a legal statement. It may be presented as an advocacy standard, not a binding treaty obligation for nonparties.
- Primary checks: [UN CRPD treaty status](https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-15&chapter=4), [CRPD text](https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-persons-disabilities), [ICESCR Optional Protocol status](https://treaties.un.org/pages/ViewDetails.aspx?src=TREATY&mtdsg_no=IV-3-a&chapter=4).

## Full audit expansion — batch 14 (9 pages)

Pages audited:
- `relationships/boundaries-disclosure`
- `relationships/caregiver-dynamics`
- `relationships/caregiving`
- `relationships/dating-and-relationships`
- `relationships/family-control-and-gaslighting`
- `relationships/parenting-with-a-disability`
- `relationships/parents-of-disabled-children`
- `relationships/sexuality-and-reproductive-health`
- `intersectionality/incarceration-and-criminalization`

**Progress:** 142 of 278 pages audited; 136 remain.

### 🔴 Correct immediately

#### `relationships/parenting-with-a-disability`
- “Disability alone is not grounds for removal—actual harm or risk must be demonstrated” is directionally important but too categorical as nationwide legal advice. Child-welfare and custody standards vary by jurisdiction, proceeding, evidentiary stage, and emergency authority. State agencies and courts may not rely on stereotypes and must conduct individualized assessments and provide applicable ADA/Section 504 modifications, while child safety remains part of the analysis.
- The page should tell a parent facing investigation, removal, custody loss, or termination of parental rights to seek a qualified local attorney immediately and comply with court deadlines. General disability-rights advocacy is not a substitute for dependency/family-law counsel.
- “Most countries have laws against disability discrimination that should protect parenting rights” requires country-specific sources; domestic family law may not directly implement CRPD principles or provide an individual remedy.
- The estimated 4.1 million U.S. disabled parents and assertions about investigation/removal rates need named studies, definitions, and dates.
- The pregnancy/medication discussion needs a prominent warning not to stop or change medication without timely clinical advice; medication and pregnancy risks are individualized.
- “You have the right to” childbirth preferences should distinguish informed participation and reasonable modifications from clinical emergencies, safety standards, and the absence of a guaranteed birth method or outcome.
- Primary checks: [DOJ/HHS guidance protecting parents with disabilities](https://www.ada.gov/resources/protecting-parent-rights/), [HHS child-welfare resources](https://www.childwelfare.gov/).

#### `relationships/parents-of-disabled-children`
- “Informed consent applies to children too” is legally inaccurate without qualification. Parents/guardians usually provide permission for minors, subject to state-law exceptions, emergencies, emancipation, court authority, and specific services; children should receive developmentally appropriate information and assent when possible.
- “Not forcing compliance with distressing treatments” could discourage medically necessary care. Replace it with trauma-informed preparation, assent when possible, pain/anxiety management, least-restrictive approaches, and careful weighing of necessity and alternatives.
- “You have the right to appropriate education for your child” should specify the jurisdiction and applicable standard. In the U.S., IDEA FAPE applies only to eligible children and has a defined statutory meaning; Section 504 uses a different FAPE standard.
- The statement that formal IEP meetings “include” parents needs exceptions and procedural precision; schools must take steps to ensure participation, but meetings can proceed under defined circumstances after documented attempts.
- The page’s strong recommendations against parent-led organizations and certain emotional responses are values-based guidance. Attribute them to disabled advocates rather than present them as settled evidence.
- Add safeguarding advice: suspected abuse, neglect, suicidality, dangerous restraint/seclusion, or urgent medical concerns require immediate local professional or emergency help.
- Primary checks: [HHS HIPAA personal-representative guidance for minors](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/personal-representatives/index.html), [IDEA parent-participation rule](https://sites.ed.gov/idea/regs/b/d/300.322).

#### `relationships/sexuality-and-reproductive-health`
- “All contraception options are available to disabled people” is false and medically unsafe. Contraindications, medication interactions, age, pregnancy possibility, coercion risk, access, and jurisdiction affect available options. Say all patients deserve nondiscriminatory individualized contraceptive counseling.
- The page repeatedly states universal rights to contraception, fertility treatment, abortion/reproductive decisions, privacy, parenting, and sexual decisions without distinguishing human-rights principles from current domestic law, capacity standards, guardianship/court orders, age-of-consent law, safeguarding duties, and provider obligations.
- “Guardianship doesn’t eliminate sexual rights” needs careful jurisdiction-specific explanation. Guardianship scope varies, but a guardian cannot create legal capacity to consent to sex where it is absent; sexual-consent and abuse laws require individualized legal analysis.
- Supported decision-making must never be framed as helping someone reach or communicate another person’s preferred sexual choice. Add explicit anti-coercion and safeguarding language.
- Pregnancy and sexual-function advice needs medical-safety warnings and direct clinical review where autonomic dysreflexia, medication effects, pregnancy complications, STI exposure, or abuse may be involved.
- “You have the right to have children” in the child-welfare scenario is not enough practical protection. Add immediate local legal-help guidance and cite disability-nondiscrimination standards without promising custody outcomes.
- Primary checks: [CRPD Article 23](https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-persons-disabilities), [DOJ/HHS parents-with-disabilities guidance](https://www.ada.gov/resources/protecting-parent-rights/).

#### `relationships/caregiving`
- Statements that an adult receiving care has the right to make every decision and that a caregiver’s role is never to manage life omit applicable capacity law, guardianship or health-care-agent authority, emergencies, and mandated-reporting/safeguarding duties. Preserve autonomy as the default while explaining lawful exceptions.
- “You have the right to direct your own care” is an advocacy principle and may be a program right, but a person does not necessarily control every worker, task, schedule, or clinical method under agency rules, labor law, service plans, safety standards, and available funding.
- Advice to “address directly with caregiver” before reporting problems is unsafe when abuse, retaliation, neglect, theft, sexual violence, or immediate danger is possible. Put safety planning and emergency/abuse resources first.
- Care workers’ labor rights differ sharply by worker classification, family relationship, live-in status, funding program, and jurisdiction. Do not promise ordinary wage/hour protections without those caveats.
- Family-caregiver payment and tax descriptions need program-specific sources; some Medicaid waiver payments may receive special federal tax treatment, and payment can affect benefits differently.
- HIPAA does not automatically give a family caregiver access to an adult’s records. Access depends on permission, involvement in care, incapacity, applicable law, or personal-representative authority.
- Primary check: [HHS HIPAA personal representatives](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/personal-representatives/index.html).

### 🟠 Important clarification

#### `relationships/boundaries-disclosure`
- “Generally, you only need to disclose if you need accommodations,” “you don’t need to disclose in applications,” and “retaliation for disclosure is illegal” are too broad across countries and contexts. Safety-sensitive roles, lawful post-offer inquiries, benefit/program rules, licensure, and non-covered entities can change obligations and protections.
- Medical confidentiality is not absolute. Providers may disclose information for treatment/payment/operations, as required by law, to prevent serious threats, and to authorized personal representatives; the rules differ outside HIPAA-covered entities and outside the U.S.
- A family member, guardian, health-care agent, school, insurer, or program may lawfully receive some disability information in defined circumstances. “You don’t have to tell family anything” requires age, capacity, dependency, and legal-authority caveats.
- The linked `/relationships/dating-disclosure` page appears inconsistent with the current file map and should be checked for a broken route.

#### `relationships/caregiver-dynamics`
- The page is strong practical guidance, but it needs a visible emergency/safeguarding box before recommending relationship conversations. Withholding essential care, medication, food, mobility equipment, communication access, or emergency help can require immediate intervention.
- Do not imply a safe transition period with an abusive caregiver is always possible. Safety planning should account for device/document theft, retaliation, surveillance, immigration status, financial control, and inaccessible shelters.
- The recommendation to use therapy/couples counseling needs a warning that joint counseling can be unsafe or contraindicated in coercive-control or abuse situations.
- Caregiver access to health information and authority to make decisions are not automatic; distinguish informal care from a legally authorized personal representative.

#### `relationships/family-control-and-gaslighting`
- “Guardianship removes legal autonomy” is too absolute. Guardianship scope and retained rights vary by order and jurisdiction; limited guardianship and rights restoration may be available.
- Add a prominent warning that confronting a controlling or abusive family member, changing passwords, moving money, or announcing plans can escalate danger. Recommend individualized safety planning before action.
- Adult Protective Services eligibility, confidentiality, investigation powers, and outcomes vary; reporting can have unintended consequences. Explain limits and offer legal/domestic-violence advocacy options.
- Domestic-violence programs do not necessarily serve every type of family abuse or provide accessible shelter. Qualify availability and include emergency/local-service guidance.
- Advice about financial control should distinguish exploitation from lawful representative-payee, guardian, power-of-attorney, or shared-account arrangements while explaining challenge/accounting options.

#### `relationships/dating-and-relationships`
- Reproductive-right and abuse sections need the same jurisdiction/capacity caveats as the dedicated sexuality page. Avoid promising access to contraception, fertility treatment, abortion, or custody outcomes.
- Safety advice should state that leaving or confronting an abusive partner can increase danger; encourage individualized safety planning and emergency help rather than a generic directive.
- Couples counseling should not be recommended when coercive control or abuse is present without a safety warning.
- Disclosure and consent discussions should explicitly distinguish legal capacity/age-of-consent rules from the ethical principle that all intimacy requires freely given, ongoing consent.

### 🟡 Pass with minor notes

#### `intersectionality/incarceration-and-criminalization`
- Pass as a stub. It contains no substantive legal or safety guidance.
- Because this will be an exceptionally high-stakes page, future content should distinguish criminal, jail/prison, probation/parole, immigration detention, juvenile, and psychiatric-forensic systems; cite jurisdiction-specific disability-accommodation, medical-care, grievance, and deadline rules.

## Full audit expansion — batch 15 (9 pages)

Pages audited:
- `intersectionality/disability-and-homelessness`
- `intersectionality/gender-and-disability`
- `intersectionality/immigration-and-refugees`
- `intersectionality/index`
- `intersectionality/lgbtq-and-disability`
- `intersectionality/poverty-and-class`
- `intersectionality/race-and-disability`
- `intersectionality/religion-and-disability`
- `intersectionality/rural-disability`

**Progress:** 151 of 278 pages audited; 127 remain.

### 🔴 Correct immediately

#### `intersectionality/index`
- This hub describes four linked pages—gender, immigration/refugees, incarceration/criminalization, and rural disability—as if they contain substantial guidance, but those pages are stubs. Readers seeking urgent immigration, incarceration, violence, or rural-service help are routed to no actionable information. Clearly label stub status on the hub.
- The immigration section is especially risky despite the linked page being empty. Disability-related admissibility, medical screening, benefits eligibility, public-charge analysis, asylum/refugee law, confidentiality, and deportation risk are country-, status-, benefit-, and fact-specific. Add a warning not to make an immigration or benefits decision from the overview and direct readers to qualified immigration counsel.
- The incarceration section makes broad current claims about disability prevalence, policing, prison access, mental-health care, and alternatives without jurisdiction or sources. Future guidance must distinguish immediate safety, criminal defense, accommodation requests, medical grievances, administrative exhaustion, and filing deadlines.
- Reproductive-coercion, maternal-health, conversion-therapy, police-violence, and immigration claims need named sources and current legal-status dates.
- “Benefits designed to keep people in poverty” and similar motive claims should be attributed analysis, not stated as established program purpose.
- The Indigenous section makes broad claims about “traditional approaches,” spiritual roles, and interdependence across diverse peoples. Replace global generalizations with nation/community-specific, Indigenous-authored sources.
- The hub should include crisis/safety routing wherever it discusses violence, conversion practices, police encounters, incarceration, homelessness, or reproductive coercion.

#### `intersectionality/poverty-and-class`
- SSI’s resource limit does not make it “illegal to have meaningful savings.” Resources over the limit can make a person ineligible and can cause overpayments if not reported, but saving itself is not a crime. Rewrite immediately to avoid deterring lawful saving and use of exclusions such as ABLE accounts and PASS.
- The statement that earning more can cost someone Medicaid “their life depends on” overstates an automatic cliff. Section 1619(b), Medicaid Buy-In programs, expansion/adult categories, and state-specific pathways may preserve coverage.
- Marriage does not uniformly cut “benefits” for all disabled people. SSI deeming and some means-tested programs can be affected; SSDI worker benefits generally are not reduced merely because the beneficiary marries, though auxiliary/child benefits and other programs differ.
- The poverty-rate comparison needs a current Census dataset, disability measure, age/population scope, and year.
- “Disabled people earn less … even doing the same work” needs a wage-analysis source that controls for job, hours, experience, and other factors or narrower wording.
- The page should direct U.S. readers to qualified benefits counseling before changing work, marriage, savings, or living arrangements.
- Primary checks: [SSA SSI resource rules](https://www.ssa.gov/ssi/limits-exceptions), [SSA section 1619(b)](https://www.ssa.gov/disabilityresearch/wi/1619b.htm), [SSA Spotlight on ABLE accounts](https://www.ssa.gov/ssi/spotlights/spot-able.html).

### 🟠 Important clarification

#### `intersectionality/disability-and-homelessness`
- “Around half of people experiencing homelessness are disabled” and “two to three times” the general-population rate need a defined geography, homelessness measure, disability measure, source, and year. Do not present a global headline from mixed datasets.
- “Most housing isn’t physically accessible,” highest-rate claims, LGBTQ+ youth risk, institutional discharge frequency, and other causal assertions need named sources.
- Landlord refusal based on mental-health condition or substance-use history may be unlawful in some circumstances, but current illegal drug use and other exclusions/defenses complicate the rule. Avoid implying every refusal is disability discrimination.
- Calling homelessness one of the “most severe” Article 19 violations is an attributed normative interpretation, not treaty text.
- The benefits claim should not imply every disability program has low income/asset caps; insurance-based programs such as SSDI do not.

#### `intersectionality/lgbtq-and-disability`
- The page responsibly warns that statistics vary, but the figures still need direct links, survey years, sample/population definitions, and limitations. “Every major medical association” is an unsourced absolute.
- The minority-stress statement says worse mental-health outcomes “are explained by” systems, which overstates a complex body of evidence and can erase individual clinical needs. Say minority stress is an important contributor and encourage appropriate care.
- Conversion-therapy law and crisis-resource availability change quickly. Add access dates, geographic scope, and a warning to use emergency services when there is immediate danger.
- Verify every organization and hotline periodically; peer-support lines are not substitutes for emergency care and may have limited hours/capacity.

#### `intersectionality/race-and-disability`
- The page names source organizations and years but generally does not link the underlying studies. Add direct citations for every statistic and historical claim, especially disability prevalence, poverty, maternal mortality, police killings, school identification, sterilization, and the “longest occupation” superlative.
- The claim that environmental racism, medical neglect, and disinvestment drive a particular racial disability-rate statistic is a causal interpretation requiring supporting research, not merely the prevalence source.
- “Up to half of people killed by police are disabled” is appropriately labeled an estimate but remains based on an older media-derived report; pair it with current datasets/research and explain uncertainty.
- The statement that an estimated quarter of Native women of childbearing age were sterilized needs precise sourcing and care about population, facilities, period, and evidentiary uncertainty.
- Avoid implying racial groups are uniform; add scope and community-specific sources, especially for Indigenous peoples.

### 🟡 Pass with minor notes

#### `intersectionality/gender-and-disability`
- Pass as a stub. Future content on reproductive coercion, violence, maternal health, and trans disability must include current jurisdiction-specific safety/legal resources and direct sources.

#### `intersectionality/immigration-and-refugees`
- Pass as a stub. Add an urgent warning before expansion: immigration status, public benefits, medical inadmissibility, public charge, asylum, detention, and reporting consequences require qualified, jurisdiction-specific advice.

#### `intersectionality/religion-and-disability`
- Pass as a stub. Future guidance should distinguish protected religious exercise, disability-access law and religious-entity exemptions, safeguarding, coercive “healing,” and emergency medical care.

#### `intersectionality/rural-disability`
- Pass as a stub. Future content should verify telehealth licensure, emergency transport, rural transit, benefits, provider availability, and cross-state care rules rather than generalizing.

## Full audit expansion — batch 16 (7 pages)

Pages audited:
- `professionals/architects-and-designers`
- `professionals/educators`
- `professionals/employers-and-hr`
- `professionals/healthcare-providers`
- `professionals/index`
- `professionals/public-officials`
- `professionals/social-workers`

**Progress:** 158 of 278 pages audited; 120 remain.

### 🔴 Correct immediately

#### `professionals/educators`
- The comparison table instructs educators to replace “requiring documentation before accommodations” with “believing students about their access needs.” This is unsafe legal guidance. Schools and postsecondary institutions must respond appropriately, but eligibility and accommodation processes may require evaluations or reasonable documentation; UDL and informal flexibility do not replace IDEA, Section 504, or ADA procedures.
- “Student narratives … constitute valid evidence of access needs” may be useful evidence but are not necessarily sufficient to establish legal eligibility or a particular accommodation. State the applicable process and avoid directing staff to bypass it.
- The LRE discussion must state IDEA’s actual standard: placement decisions are individualized, and removal occurs only when education in regular classes with supplementary aids and services cannot be achieved satisfactorily. LRE does not require one placement for every child and does not apply identically to students covered only by Section 504.
- “Restraint and seclusion … are never educational interventions” is sound policy advocacy, but the page needs immediate-safety and jurisdiction-specific legal context. It should never normalize restraint/seclusion, yet must distinguish prohibited discipline/convenience from emergency safety actions allowed under applicable law.
- “Presume competence—always” should not replace valid assessment, safeguarding, or individualized instruction. Presume dignity and potential while assessing support and safety needs accurately.
- The page blurs K–12 IDEA/504 duties with higher-education ADA/504 duties. Separate these systems, including who initiates evaluation/accommodation, documentation, parental participation, essential requirements, and due-process mechanisms.
- Primary checks: [IDEA LRE rule](https://sites.ed.gov/idea/regs/b/b/300.114), [Education Department postsecondary guidance](https://www.ed.gov/laws-and-policy/civil-rights-laws/disability-discrimination/disability-discrimination-key-issues/disability-discrimination-academic-adjustments-postsecondary-students), [Education Department restraint/seclusion resources](https://www.ed.gov/laws-and-policy/key-policy-letters/guidance-and-regulatory-information/seclusion-and-restraint).

#### `professionals/healthcare-providers`
- The HHS Section 504 medical-diagnostic-equipment section inaccurately implies immediate, universal equipment specifications and duties. State the rule’s recipient scope, employee-size/web deadlines, July 8, 2026 accessible-MDE deadline, scoping requirement for at least one accessible unit of each type used by covered recipients, and exceptions/standards precisely.
- “Qualified ASL interpreters are required for complex medical discussions” is too categorical. Covered providers must ensure effective communication after individualized assessment; the required aid depends on communication method, complexity, context, and effectiveness. Family/friends may be used only under narrow patient-request or emergency/imminent-threat circumstances.
- “Self-report is always the gold standard” is clinically unsafe for patients who cannot reliably self-report because of consciousness, delirium, development, cognition, or other factors. Prioritize self-report when reliable and use validated observational/clinical assessment when needed.
- “Patients have the right to refuse treatment” needs emergency, incapacity, substitute-decision-maker, court-order, involuntary-treatment, public-health, and minor-patient qualifications.
- “Get consent for each step” is a valuable trauma-informed practice, not necessarily a separate legal consent requirement for every routine action. Distinguish informed consent, assent, notice, permission, and emergency care.
- “Emergencies don’t waive ADA requirements” is directionally correct but incomplete. Providers must ensure effective communication, while immediate stabilization should not be dangerously delayed; emergency circumstances affect which aid is effective and available at that moment.
- Reproductive-right claims require current jurisdiction/capacity law and anti-coercion safeguards. Do not imply every requested reproductive service must be provided.
- The weight-bias statistics require direct sources and defined populations.
- Primary checks: [HHS Section 504 final rule](https://www.federalregister.gov/documents/2024/05/09/2024-09237/), [ADA effective-communication guidance](https://www.ada.gov/resources/effective-communication/), [HHS HIPAA personal representatives](https://www.hhs.gov/hipaa/for-professionals/privacy/guidance/personal-representatives/index.html).

#### `professionals/social-workers`
- “Social workers are mandatory reporters in all states” is overbroad and dangerous professional guidance. Reporting duties depend on jurisdiction, population, setting, licensure/role, type of suspected harm, and applicable privilege/confidentiality rules.
- “Report typically within 24–48 hours” is not a usable rule. Some laws require immediate or prompt reports, different reports to different entities, and written follow-up. Direct professionals to their current state/tribal/federal law, employer protocol, licensing guidance, and legal counsel.
- “Your role is ensuring clients have complete information, not overriding their choices” omits emergencies, incapacity, guardianship/agent authority, child/adult-protection duties, court orders, program rules, and serious/imminent threats. Preserve autonomy while identifying lawful duties.
- The SDM-versus-guardianship table inaccurately treats all guardianship as plenary removal of rights and all SDM as retention of every right. Guardianship scope and SDM recognition vary; limited orders and retained rights exist.
- The *Olmstead* summary omits the reasonable-modification/fundamental-alteration framework and the conditions concerning appropriateness and the person’s wishes. A waiting list is not automatically a violation.
- Benefits guidance is stale/wrong: $943 is the 2024 SSI amount; SSDI does not have an ordinary “income limit” but has detailed work/SGA rules; PASS/IRWE/Ticket/TWP descriptions are oversimplified; ABLE age eligibility changed in 2026; and “$100,000+ without affecting SSI/Medicaid” needs precise account-balance and program caveats.
- Primary checks: [DOJ *Olmstead* guidance](https://www.ada.gov/resources/olmstead-mandate/), [SSA SSI information](https://www.ssa.gov/ssi), [SSA work incentives](https://www.ssa.gov/disability/work).

#### `professionals/employers-and-hr`
- “Employers must engage in an interactive process” should be framed carefully. The interactive process is the recognized mechanism for identifying effective accommodations, but liability for a process failure and the underlying statutory duty vary by facts and jurisdiction; the employer may choose among effective accommodations.
- “Disclosure must remain voluntary except when specific accommodations are needed” is too absolute. Covered employers may make certain post-offer inquiries/exams applied to all entering employees in the same job category and may make employee inquiries that are job-related and consistent with business necessity.
- “Interviewers cannot ask about disabilities” needs the pre-offer ADA scope and permitted questions: ability to perform job functions, accommodation for the hiring process, and limited accommodation questions in defined circumstances.
- “Undue hardship … rarely applies” is not legal guidance. It is a fact-specific defense considering cost/resources/operations; low average accommodation cost does not decide an individual request.
- Leave may be a reasonable accommodation, but indefinite leave, unreliable attendance, and essential-function issues are fact-specific. Do not imply all disability-related leave must be granted or never penalized.
- Remote work is not automatically effective or reasonable merely because it worked during the pandemic; assess essential functions and current circumstances individually.
- The workforce, disclosure, engagement, accommodation-cost, performance, and labor-force-participation statistics need direct dated sources and defined populations.
- Primary checks: [EEOC reasonable-accommodation guidance](https://www.eeoc.gov/laws/guidance/enforcement-guidance-reasonable-accommodation-and-undue-hardship-under-ada), [EEOC pre-employment inquiries](https://www.eeoc.gov/pre-employment-inquiries-and-disability).

### 🟠 Important clarification

#### `professionals/architects-and-designers`
- “At least two accessible means of egress are required from any accessible portion” is not a universal rule. Requirements and exceptions depend on occupancy, stories, building code, sprinklering, alteration/new construction, and adopted jurisdiction. Designers must use the governing code and standards.
- The U.S. Access Board develops guidelines; DOJ and DOT adopt enforceable ADA standards, while state/local building codes and other federal rules may also apply. “The Access Board establishes minimums” is incomplete.
- ADA Standards do not govern every building or every accessibility issue. Fair Housing Act, ABA, Section 504, local codes, and program-specific standards can apply.
- Sensory-design instructions such as avoiding all fluorescent lighting, bright colors, stark white, or strong contrast are too prescriptive and can conflict with low-vision needs. Offer controllability, testing, and user-specific design rather than one universal sensory palette.
- Emergency-egress guidance must be reviewed by qualified fire/life-safety professionals; never imply evacuation devices or areas of refuge are interchangeable with a code-compliant emergency plan.
- “ADA minimums were negotiated compromises from the 1990s” and cost claims should be sourced or presented as commentary.
- Primary checks: [U.S. Access Board ADA Standards guide](https://www.access-board.gov/ada/guides/), [ADA standards information](https://www.ada.gov/law-and-regs/design-standards/).

#### `professionals/public-officials`
- “Your office must be accessible” oversimplifies Title II program accessibility. Public entities must ensure programs, services, and activities are accessible when viewed in their entirety; structural changes or relocation may be required depending on the circumstances, but every existing facility need not be altered.
- Auxiliary-aid and reasonable-modification duties are subject to effective-communication, fundamental-alteration, undue-financial/administrative-burden, and direct-threat frameworks. “Ask, then provide” is good practice but not the complete legal test.
- WCAG 2.1 AA is now a specific Title II web/mobile standard for covered state/local governments with April 24, 2026 or April 26, 2027 compliance dates, subject to rule details and exceptions; explain current deadlines instead of a generic minimum.
- Voluntary disability registries in emergency planning raise privacy, security, maintenance, and false-assurance risks. They cannot substitute for inclusive planning.
- The “2–4 times” disaster-death claim and accommodation-cost claims need named studies and scope.
- Replace the stale CRPD ratification count and distinguish treaty obligations from domestic implementation.
- Primary checks: [ADA Title II web rule](https://www.ada.gov/resources/2024-03-08-web-rule/), [ADA Title II regulations](https://www.ada.gov/law-and-regs/regulations/title-ii-2010-regulations/).

#### `professionals/index`
- Replace the stale “ratified by 186 countries” CRPD count with the live UN status and an access date.
- “Assume disabled people can … make decisions … until proven otherwise” is a valuable anti-bias principle but poor professional/legal wording. Capacity is presumed in many contexts yet can require decision-specific assessment under applicable law; failure to communicate is not proof of incapacity, but professionals must still assess safety and authority when required.
- “The right to make choices—including choices you consider unwise—is fundamental” needs lawful-exception caveats for minors, incapacity, emergencies, court orders, and safeguarding duties.
- The toolkit descriptions should warn readers that professional duties vary by jurisdiction, role, licensure, setting, and current law.

## Full audit expansion — batch 17 (9 pages)

Pages audited:
- `conditions/EDS`
- `conditions/MCAS`
- `conditions/POTS`
- `conditions/intellectual-and-developmental-disability`
- `conditions/psychiatric-and-psychosocial-disability`
- `daily-living/medication-management`
- `daily-living/living-alone`
- `daily-living/cooking-and-nutrition`
- `daily-living/diy-assistive-devices`

**Progress:** 167 of 278 pages audited; 111 remain.

### 🔴 Correct immediately

#### `conditions/POTS`
- The page confuses **sodium** with **salt (sodium chloride)**. It recommends `3,000–10,000 mg of sodium daily`; the cited expert-consensus range is up to `10–12 g NaCl` daily, which is only about `4–4.8 g sodium`. Ten grams of sodium is roughly 25 grams of salt and can be dangerous. State units precisely and make all fluid/salt changes clinician-directed, especially with hypertension, kidney disease, heart disease, pregnancy, or interacting medication.
- “Start your day with 16–20 oz of water,” “eat salty breakfast,” blanket instructions against diuretics/high-dose beta blockers, and the specific midodrine timing instruction are individualized medical advice. Keep general education, but direct readers to their prescriber and the medication label rather than prescribing a regimen.
- The exercise section presents one protocol as “the exercise protocol that works,” gives a fixed month-by-month prescription, and claims it is better than medication. Exercise can help selected patients, but no treatment is uniformly successful; programs should be individualized and supervised, particularly where post-exertional malaise, Long COVID, ME/CFS, cardiac disease, or mobility limitations are present.
- The EDS/POTS/MCAS “trifecta” section overstates both evidence and the 2025 AGA guidance. The AGA says to test for POTS or MCAS when suggestive symptoms are present and explicitly says universal testing is not recommended; it does not say every diagnosis should prompt screening for the other two.
- Primary checks: [Heart Rhythm Society POTS consensus](https://www.hrsonline.org/wp-content/uploads/2025/02/2015-HRS-POTS-IST-VVS.pdf), [AGA clinical-practice-update summary](https://med.emory.edu/departments/medicine/_documents/nasser.aga.heds.pots.mcas.guideline-1.pdf).

#### `conditions/MCAS`
- The treatment section gives readers a self-directed regimen: H1 antihistamines at “2–4 times the standard dose,” combined H1/H2 therapy, cromolyn timing, compounded ketotifen, quercetin/luteolin/vitamin C, low-dose aspirin, and a request for a medication trial even when testing is inconclusive. These drugs and supplements have contraindications, interactions, adverse effects, and uncertain evidence. Replace dosing/titration instructions with clinician-directed, diagnosis-specific guidance.
- “All MCAS patients should carry two epinephrine auto-injectors” is too categorical. People at risk of anaphylaxis need an individualized emergency plan and prescribed epinephrine; a page cannot diagnose that risk or prescribe devices to every person labeled with MCAS.
- The page presents the broader “Consensus-2” framework as a roughly coequal diagnostic alternative and says MCAS may affect up to 17% of people. Clearly distinguish broadly accepted consensus criteria from contested proposals, and do not imply that response to empiric medication alone establishes MCAS.
- The “trifecta” prevalence figures, proposed connective-tissue mechanism, and claim that the AGA recommends screening whenever any one condition is diagnosed are overstated. The AGA recommends symptom-directed testing and says universal testing is not recommended.
- Low-histamine and other elimination advice can cause nutritional harm and should be framed as a time-limited clinician/dietitian-guided trial, not a general MCAS diet.
- Primary check: [AGA clinical-practice-update summary](https://med.emory.edu/departments/medicine/_documents/nasser.aga.heds.pots.mcas.guideline-1.pdf).

#### `conditions/EDS`
- The page calls KLK15 a “major 2024 breakthrough,” says KLK15 variants were found in 33% of hEDS patients, and calls this the first concrete genetic marker. The peer-reviewed paper was published in 2025 and identifies a disease-associated candidate gene with experimental evidence; it does not create a clinical diagnostic marker for one-third of patients. Rewrite cautiously and state that hEDS still has no established diagnostic genetic test.
- “For the other 12 types, genetic testing can confirm the diagnosis” is too absolute. Molecular testing can confirm many non-hEDS types when a pathogenic variant is found, but negative, uncertain, or incomplete testing does not universally resolve diagnosis.
- The EDS/POTS/MCAS “trifecta” is presented as medically established, with highly specific prevalence figures and a proposed mechanism stated too confidently. The AGA guidance says symptom-directed POTS/MCAS testing and explicitly rejects universal testing.
- The page turns selection-biased figures into general prevalence claims, especially “CCI: 85%” from an EDS population already seeking neurosurgical evaluation. Remove or clearly label referral-sample statistics so readers do not infer population risk.
- Medication, bracing, physical-therapy, surgery, and routine-monitoring advice should be individualized by EDS type and patient risk. Avoid universal statements such as one PT approach being the most important treatment or traditional PT being harmful.
- Primary checks: [KLK15 study](https://pmc.ncbi.nlm.nih.gov/articles/PMC12424230/), [AGA clinical-practice-update summary](https://med.emory.edu/departments/medicine/_documents/nasser.aga.heds.pots.mcas.guideline-1.pdf).

#### `daily-living/medication-management`
- “If you can't remember whether you took a dose, it's often safer to skip than to double up” is not a safe general rule. Missed-dose instructions are medication-specific; direct readers to the prescription label, pharmacist, prescriber, or poison-control/emergency help when an overdose may have occurred.
- “A few crackers or a handful of nuts is sufficient” for most take-with-food instructions is unsafe. The amount and type of food can materially affect absorption, irritation, interactions, and effectiveness; readers must follow the specific label or pharmacist advice.
- Pill-organizer and pre-sorting advice needs a warning that some products must remain in original packaging because of stability, identification, timing, or safety requirements. “Bubble packing removes the sorting work” also does not fit all medicines.
- Cost-saving pill splitting needs stronger limits. FDA says splitting should occur only under professional supervision; many unscored and modified-release tablets are not evaluated or suitable for splitting, and FDA advises against splitting an entire supply in advance.
- “Use one pharmacy … they check interactions” can create false reassurance. A pharmacy can screen only the prescriptions and disclosed OTC drugs/supplements it knows about, and interaction screening does not guarantee safety.
- Primary checks: [FDA tablet-splitting guidance](https://www.fda.gov/drugs/buying-using-medicine-safely/tablet-splitting), [FDA medicine-safety guidance](https://www.fda.gov/drugs/information-consumers-and-patients-drugs/you-age-you-and-your-medicines).

#### `daily-living/diy-assistive-devices`
- Remove the suggestion that a smooth plywood board can serve as an emergency transfer board. Board strength, dimensions, surface, weight rating, positioning, transfer technique, skin protection, and fall risk require individualized assessment; failure can cause a serious fall or injury.
- Remove the pool-noodle “bed rail” suggestion and do not encourage improvised rails. Adult portable bed rails carry entrapment, asphyxiation, and fall risks and are subject to a federal safety standard; CPSC advises compatible, compliant products and says not to modify them.
- DIY wheelchair padding and armrest padding can alter posture, stability, transfers, pressure distribution, or skin risk. Keep decoration/storage ideas separate from seating, positioning, structural, brake, wheel, and pressure-relief modifications that require qualified assessment.
- Weighted lap pads filled with rice/beans and described as heatable need burn, moisture/mold, allergy, choking, ingestion, suffocation, weight, mobility, and inability-to-remove warnings. Never suggest weighted products for infants or people unable to remove them independently without specialist review.
- “Sort medications once weekly” and alternative craft-container storage need the same medication-specific packaging, labeling, stability, child-safety, and mix-up warnings as the dedicated medication page.
- Primary check: [CPSC adult portable bed-rail safety guidance](https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Adult-Portable-Bed-Rails).

#### `daily-living/cooking-and-nutrition`
- “Soft foods, no choking risk” is false. Soft or texture-modified foods and thickened liquids do not eliminate aspiration or choking risk and can introduce dehydration or nutrition risks. Texture and liquid modifications should follow individualized swallowing assessment.
- “Restricted diets acceptable,” “elimination diets if needed,” and “anti-inflammatory foods” need clinical and nutrition safeguards. Validate sensory-safe foods without implying that severe restriction is medically harmless; flag unintended weight loss, deficiency, dehydration, eating-disorder risk, and pediatric growth concerns.
- The page should add basic food-safety guidance. “Slow cooker (set and leave),” batch cooking, thawing, prepared foods, and low-energy meal strategies can be useful, but immunocompromised, pregnant, older, and medically vulnerable readers may face higher foodborne-illness risk.
- “Stool with wheels for moving around kitchen” is a fall/burn hazard, especially near hot surfaces and sharp tools. Recommend stable seating selected for the person and environment.
- Primary checks: [ASHA adult dysphagia guidance](https://www.asha.org/practice-portal/clinical-topics/adult-dysphagia/), [FDA food-safety guidance](https://www.fda.gov/food/consumers/people-risk-foodborne-illness).

### 🟠 Important clarification

#### `daily-living/living-alone`
- Bed rails are listed as a simple leverage aid without an entrapment/asphyxiation warning. Recommend individualized assessment and a compliant, compatible product; CPSC reports serious injuries and deaths and advises users not to modify rails.
- Step stools by high beds and voice-activated emergency calling need safety qualifications. A step stool may increase fall risk, and smart speakers/devices may fail during power, internet, account, location, accessibility, or service outages; they should not be the sole emergency route.
- Utility medical-equipment registries may provide notices or restoration consideration, but they do not guarantee priority restoration. Readers need a backup-power, evacuation, and emergency-services plan.
- “Maintain extra supply” of medication should acknowledge refill limits, controlled-substance law, insurance rules, expiration/storage, and emergency-refill procedures.
- The autonomy framing is valuable, but the page should include an explicit immediate-danger route for fire, gas/carbon monoxide, falls with injury, inability to access essential medication/food/water, abuse, and acute psychiatric or medical crisis.
- Primary check: [CPSC adult portable bed-rail safety guidance](https://www.cpsc.gov/Safety-Education/Safety-Education-Centers/Adult-Portable-Bed-Rails).

#### `conditions/intellectual-and-developmental-disability`
- “People with IDD have the right to make decisions” and the relationships/sexuality/parenting sections need decision-specific capacity, age, guardianship/court-order, consent, abuse-prevention, and safeguarding caveats. Preserve autonomy and presumed dignity without implying every choice is legally effective in every circumstance.
- Powers of attorney and representative payees should not be presented as interchangeable general alternatives to guardianship. Powers of attorney generally require the principal's valid authorization; a representative payee controls only covered benefit payments, not healthcare, residence, or other decisions.
- The *Olmstead* summary—“People have the right to live in the community”—omits the decision's conditions and reasonable-modification/fundamental-alteration framework. Unjustified segregation can violate Title II, but the case does not guarantee any requested placement or service.
- “People with IDD have the right to work in competitive integrated employment” is an important policy goal and applies in some program/legal contexts, but it should not be phrased as a universal individually enforceable guarantee across countries.
- Add immediate safeguarding routes for suspected abuse, exploitation, sexual violence, dangerous restraint/seclusion, neglect, or urgent medical risk.
- Primary check: [DOJ *Olmstead* guidance](https://www.ada.gov/resources/olmstead-mandate/).

#### `conditions/psychiatric-and-psychosocial-disability`
- “Treatment is your choice” is too absolute even though a later sentence briefly notes involuntary-treatment laws. Capacity, emergencies, court orders, minor status, substitute decision-makers, public-health law, and jurisdiction-specific involuntary treatment can affect consent and refusal. State the limits wherever the promise appears.
- “Voting rights cannot be denied based on disability” and “mental illness alone is not grounds for termination” need jurisdiction and proceeding-specific precision. Disability discrimination and stereotypes are unlawful in covered contexts, but state capacity/voting rules and child-welfare/custody standards vary.
- The crisis section lists alternatives but does not clearly tell a reader in immediate danger, after an overdose, unable to care for basic needs, or at imminent risk of harming self/others to seek immediate local emergency help. Peer support and warmlines are not emergency substitutes.
- “Community Mental Health Centers serve people regardless of ability to pay” is too broad; eligibility, fees, catchment area, services, and capacity vary.
- “Eating disorders have the highest mortality rate of any mental illness” is a common but contested superlative that depends on diagnosis, metric, and population. Use a precise sourced statement that eating disorders can be life-threatening and require timely specialized care.

## Full audit expansion — batch 18 (9 pages)

Pages audited:
- `conditions/chronic-illness`
- `conditions/invisible-disabilities`
- `conditions/invisible-fluctuating-episodic`
- `conditions/multiple-disabilities`
- `conditions/neurodivergence`
- `conditions/physical-disabilities`
- `conditions/rare-diseases`
- `conditions/sensory-disabilities`
- `conditions/index`

**Progress:** 176 of 278 pages audited; 102 remain.

### 🔴 Correct immediately

#### `conditions/invisible-disabilities`
- “You're never obligated to disclose” is false as a universal statement. Disclosure or accurate medical information may be required to obtain benefits, accommodations, protected leave, insurance coverage, licenses, safety-sensitive clearances, or services; lawful post-offer employment inquiries and court/program rules also vary. Preserve the privacy message while identifying context-specific exceptions.
- The benefits advice to “describe your worst days, not your best” risks encouraging an incomplete or misleading application. Readers should accurately describe frequency, duration, variability, typical functioning, bad days, good days, and support needs, consistent with the form and under applicable attestations.
- “Record or take notes on the assessment” needs a warning that recording consent laws and agency rules vary. Taking personal notes is different from audio/video recording.
- “You don't have to give your diagnosis to your employer” is too broad. An employer may request reasonable medical documentation when disability or need is not obvious; documentation scope and who receives it vary.
- Public-accommodation statements should distinguish eligibility from entitlement. A person may use a permit or accommodation they lawfully qualify for, but need alone does not establish every venue's legal obligation or priority rule.

#### `conditions/invisible-fluctuating-episodic`
- The page converts examples of possible accommodations into promises: “Flexible scheduling is a reasonable accommodation” and “Telework can be a reasonable accommodation” need a fact-specific caveat. The ADA may require an effective accommodation for a qualified employee absent undue hardship, but not every requested schedule or telework arrangement is reasonable for every job.
- “Request accommodations for your worst days, not average days” and “Describe worst days, not best days” can produce misleading records. Accommodation and benefit requests should accurately document the full pattern, including frequency, duration, predictability, typical function, and functional impact when active.
- “Trust self-report” and the suggestion that requiring proof of each episode may be discriminatory are useful principles but incomplete legal guidance. Covered entities may request reasonable documentation in defined circumstances; documentation demands should be limited, relevant, and lawful.
- Attendance modifications, deadline flexibility, and recording lectures are not automatic rights. Essential requirements, fundamental alteration, licensing/accreditation rules, privacy, and alternative effective accommodations matter.
- Primary check: [EEOC telework guidance](https://www.eeoc.gov/laws/guidance/work-hometelework-reasonable-accommodation).

#### `conditions/rare-diseases`
- “Right to Try … allows access to experimental treatments” overpromises a narrow pathway. It applies only to eligible patients with life-threatening conditions and eligible investigational drugs after approved options are exhausted and trial participation is unavailable; physician certification and written consent are required, and sponsors are not required to provide the drug.
- Clinical trials are not simply treatment access. Investigational products may be ineffective or harmful, eligibility is limited, assignment may involve a control/placebo where ethically permitted, and participation requires informed consent. Present trials primarily as research with possible but uncertain individual benefit.
- “Research your symptoms,” find people with similar symptoms, pursue genetic testing, and “don't give up” need safeguards against self-diagnosis, unvalidated commercial testing, incidental findings, scams, and delaying urgent or evidence-based care.
- Rare-disease prevalence, “over 7,000,” “80% genetic,” diagnostic-delay, and doctors-seen figures need named sources, definitions, geography, and dates; estimates vary materially by database and definition.
- Primary checks: [FDA Right to Try](https://www.fda.gov/patients/learn-about-expanded-access-and-other-treatment-options/right-try), [FDA investigational-drug guidance](https://www.fda.gov/patients/learn-about-expanded-access-and-other-treatment-options/understanding-investigational-drugs).

### 🟠 Important clarification

#### `conditions/neurodivergence`
- Clearly distinguish community self-identification from clinical diagnosis. Self-identification may support identity and peer connection, but it does not establish a medical diagnosis, rule out other conditions, or necessarily satisfy accommodation, benefit, treatment, or service eligibility requirements.
- “Neurodivergent people aren't … disordered,” “problems largely stem from environments,” and co-occurring mental-health conditions “aren't caused by neurodivergence itself” are values-based or causal claims stated too absolutely. Preserve the neurodiversity framing while recognizing intrinsic impairment, medical risk, and heterogeneous experiences.
- The ADHD explanation reduces the condition to differences in “brain chemistry and structure, particularly dopamine systems.” This is an oversimplified causal account. Rejection sensitive dysphoria is also not a formal diagnosis and needs an evidence/status caveat.
- Lists of autism, ADHD, and dyslexia “strengths” risk stereotyping. Attribute them as experiences some people report rather than expected traits.
- Treatment and support sections should advise individualized licensed evaluation where symptoms may reflect sleep disorders, trauma, anxiety, substance effects, learning disorders, neurological disease, or other causes.

#### `conditions/sensory-disabilities`
- “You have the right to qualified interpreters in healthcare, legal, employment settings” is too categorical. Covered entities must ensure effective communication, but the appropriate aid depends on context and effectiveness, and the governing law, coverage, defenses, and procedures vary.
- “Professional interpreters should be certified” confuses certification with the ADA's functional “qualified” standard. Certification may be required by a jurisdiction or setting and can be strong evidence of skill, but it is not universally required under the ADA.
- Update the UK organization listing: Action on Hearing Loss renamed itself **RNID**; it did not become part of RNIB.
- Benefit, education, NDIS, and vocational-rehabilitation descriptions should be framed as eligibility-dependent, not generally available to every person with a sensory disability.
- Primary check: [ADA effective-communication guidance](https://www.ada.gov/resources/effective-communication/).

#### `conditions/physical-disabilities`
- “Medicare Part B covers durable medical equipment with doctor's prescription” is incomplete. Coverage also depends on medical necessity, Medicare eligibility and rules, qualifying equipment/use, and participating/enrolled suppliers; a prescription alone does not establish coverage.
- “Medical necessity documentation … can be fought” and repeated “appeal denials—many are overturned” language should be replaced with program-specific appeal rights, deadlines, and qualified assistance rather than an unsourced success implication.
- Australia's NDIS access rule is more precise than “eligible people under 65”: a person generally must meet age and other access criteria when applying before age 65; participants may remain after turning 65.
- Country sections contain broad service/funding promises that need current program links and eligibility caveats, especially personal care, home modifications, equipment, and rehabilitation.

#### `conditions/multiple-disabilities`
- “Multiple conditions can strengthen [an SSA disability] case” is misleading. SSA evaluates the combined effect of medically determinable impairments, but the number of diagnoses does not itself strengthen a claim; evidence of functional limitations and duration controls.
- “You don't have to disclose diagnoses—just functional limitations and needs” is too broad for accommodation requests. Reasonable medical documentation may be requested where disability or need is not obvious.
- IEP/504, PIP, NDIS, Medicaid-waiver, and complex-care descriptions should distinguish a duty to consider combined effects from any guarantee of a requested service, accommodation, plan, or benefit.
- The EDS/POTS/MCAS “trifecta” should carry the same evidence caveat as the dedicated condition pages and should not imply an established shared cause.

#### `conditions/chronic-illness`
- “Appeals often succeed—don't give up after first denial” needs a program-specific source and should foreground appeal deadlines; a generic encouragement can cause readers to miss different procedures or assume success.
- Long COVID, ME/CFS, persistent symptoms after Lyme disease, fibromyalgia, and other contested or heterogeneous conditions need direct current clinical sources and careful distinctions between established diagnostic criteria, uncertainty, and unsupported treatments.
- The page appropriately warns that exercise can harm people with ME/CFS when it ignores post-exertional malaise. Extend that safeguard to all exercise/pacing links so generic activity advice elsewhere does not override it.
- Country healthcare, benefit, referral, and medication-coverage descriptions are broad and should link to current official eligibility and access rules.

### 🟡 Pass with minor notes

#### `conditions/index`
- Pass as a navigation page. It makes few direct medical claims.
- Add a visible statement that community guidance does not diagnose conditions or replace individualized medical care, and that urgent symptoms require local emergency help.

## Full audit expansion — batch 19 (8 pages)

Pages audited:
- `daily-living/exercise-and-adaptive-sports`
- `daily-living/personal-care`
- `daily-living/wheelchair-maintenance`
- `daily-living/pets-and-service-animals`
- `daily-living/accessible-travel`
- `daily-living/recreation-travel-and-outdoors`
- `daily-living/assistive-technology-overview`
- `daily-living/fashion-beauty-and-adaptive-wear`

**Progress:** 184 of 278 pages audited; 94 remain.

### 🔴 Correct immediately

#### `daily-living/pets-and-service-animals`
- The U.S. rights section improperly combines three different legal regimes. ADA public-access rules, Fair Housing Act assistance-animal rules, employment accommodations, and Air Carrier Access Act rules have different definitions, documentation, defenses, and procedures. Separate them before readers rely on the page.
- Correct the ADA questions. Staff may ask whether the dog is a service animal **required because of a disability** and what work or task it has been trained to perform. Miniature horses are addressed through a separate reasonable-modification assessment, not simply a usual service-animal exception.
- “Businesses cannot deny access unless genuinely disruptive” is incomplete. ADA exclusions and removal rules include lack of control, not being housebroken, direct-threat and legitimate-safety issues, and settings where the animal would fundamentally alter the service or compromise sterile operations.
- The air-travel promises are false or overbroad: U.S. airlines may require DOT service-animal forms, may treat emotional-support animals as pets, and may apply lawful size, number, behavior, health, documentation, and international-entry rules. A dog is not guaranteed unrestricted floor space or carriage in every circumstance.
- The emotional-support section dangerously says public-access documentation is “usually not required or enforced.” Emotional-support animals have no general ADA public-access right; readers should not be encouraged to bring them into no-pets public spaces.
- Mobility bracing, pulling, fall prevention, seizure/blood-sugar/heart/blood-pressure/allergy alerting, and similar task claims need veterinary, handler-safety, and evidence caveats. Some work can injure a dog or handler, and alert reliability varies.
- Primary checks: [ADA service-animal requirements](https://www.ada.gov/resources/service-animals-2010-requirements/), [DOT service-animal air-transportation form](https://www.transportation.gov/individuals/aviation-consumer-protection/service-animals/Air_Transportation_Form).

#### `daily-living/wheelchair-maintenance`
- “Check all bolts and screws for tightness,” axle/brake adjustment, bearing work, caster/stem adjustment, lubrication, fuse work, battery-terminal cleaning, battery replacement, joystick recalibration, and visible-connection checks can alter safety-critical setup, torque, alignment, electronics, or warranty. Direct users to the model-specific manual and qualified technician; do not give generic repair authorization.
- Tire sealants, CO2 inflators, solid-tire conversion, and tire-pressure-by-squeeze advice need manufacturer-specific compatibility, rated pressure, chemical, valve, overinflation, and handling warnings. A squeeze is not a pressure measurement.
- Do not recommend WD-40 or a generic lubricant. Lubricant type and permitted lubrication points vary; the wrong product can damage components, attract debris, or affect braking.
- “Can often wait or DIY: … battery replacement” is unsafe for power chairs. Batteries are heavy electrical/hazardous-material components; type, wiring, polarity, terminal protection, lifting, programming, and disposal matter.
- Pool noodles, cushion upgrades, lateral supports, headrests, armrest padding, and other positioning modifications can affect pressure injury risk, posture, stability, transfers, and safe operation. Separate cosmetic/storage modifications from clinical seating and structural work.

#### `daily-living/personal-care`
- Remove suction-cup grab bars from suggested temporary modifications. They can detach without warning and should not be relied on for body weight, transfers, or fall prevention. Recommend properly installed/rated equipment and individualized assessment.
- Shower chairs, transfer benches, toilet frames, raised seats, bath lifts, bedpans, and grab bars require compatibility, weight-capacity, transfer-safety, skin, entrapment, and installation checks. Listing them as generally safe tools without assessment can cause falls or injury.
- Catheterization is described mainly as reducing toileting and infection risk is understated. Catheter type, technique, schedule, supplies, complications, and urgent warning signs require clinical training and follow-up; indwelling catheters carry substantial risks.
- Foot/nail care, hair-removal creams, waxing, soaking, and pedicures need warnings for diabetes, neuropathy, circulation problems, fragile skin, infection risk, allergies, wounds, and anticoagulation.
- Add immediate safeguarding guidance for intimate-care abuse, coercion, pain, neglect, privacy violations, and unsafe attendants. “Direct your care” alone is not enough when a person cannot safely confront a caregiver.

#### `daily-living/exercise-and-adaptive-sports`
- “Moderate pain may improve with movement” and “severe pain usually requires rest” are not safe triage rules. New/severe pain, chest pain, breathing difficulty, fainting, neurological changes, injury, heat illness, and other red flags require appropriate medical evaluation; pain intensity alone does not determine whether movement or rest is safe.
- Generic lists of “good approaches” and activities—stretching, yoga, swimming, range of motion, strength work, walking, climbing, and others—need condition-specific risk caveats. Joint instability, autonomic disease, cardiac/pulmonary disease, seizure disorders, osteoporosis, spinal cord injury, pressure injury, and medication effects can change safety.
- “Exercise during health flares” appears as an advantage of online exercise and conflicts with the page's own warnings. Flares, infection, post-exertional malaise, and acute injury may require stopping activity and clinical advice.
- The ME/CFS warning is important but should be stronger: fixed progression or graded-exercise assumptions can cause harm when post-exertional malaise is present. Link to current clinical guidance and distinguish individualized symptom-contingent activity from generic conditioning.
- Adaptive sport equipment, guides, spotters, pool access, and transfer assistance require trained safety procedures, emergency plans, and venue-specific assessment.

### 🟠 Important clarification

#### `daily-living/accessible-travel`
- “Airlines handle mobility devices carefully (usually free)” is misleading. Carriage is generally without a mobility-device fee under applicable U.S. rules, but devices are frequently damaged; readers need model-specific handling instructions, documentation, inspection, complaint procedures, and a contingency plan.
- Mobility-device batteries are regulated hazardous materials. The page needs battery-type, watt-hour, removal, terminal-protection, spare-battery, airline-notification, and manufacturer-instruction guidance before recommending air travel with powered devices.
- Bulkhead seating is not “wheelchair space,” accessible seating is not guaranteed in every requested location, and onboard aisle-chair/lavatory access varies by aircraft and operation. Verify with the carrier and avoid promising bathroom access.
- Backup medication, refills abroad, controlled substances, refrigerated medication, oxygen/medical equipment, insurance for pre-existing conditions, and destination entry rules require medication- and country-specific planning.
- “Europe generally more accessible than US” and similar destination generalizations are unreliable. Accessibility varies by city, route, building, disability, and current service status.
- Primary check: [FAA wheelchair and mobility-device battery guidance](https://www.faa.gov/hazmat/packsafe/wheelchairs-mobility-devices).

#### `daily-living/recreation-travel-and-outdoors`
- Apply the same air-travel, medication, battery, service-animal, accommodation, and destination-specific caveats as the dedicated accessible-travel page.
- “Airlines can't charge for mobility aids,” personal attendants “often travel free or discounted,” and accessible-seat/bathroom requests need jurisdiction, operator, route, and eligibility qualifications.
- Outdoor and adaptive-activity advice needs risk planning for weather, water, terrain, evacuation, communication coverage, medication, equipment failure, guides/spotters, and emergency response. “Modified participation” does not by itself make an activity safe.
- Avoid broad claims that activities improve health or reduce caregiver burden; effects and access vary, and respite for a caregiver should not be framed as a benefit of the disabled person's recreation.

#### `daily-living/assistive-technology-overview`
- Mobility aids, shower chairs, raised toilet seats, grab bars, orthotics, prosthetics, powered wheelchairs, AAC, eye tracking, and weighted utensils are not simple interchangeable products. Fit, assessment, training, pressure/skin risk, falls, communication access, and safe setup matter.
- “Weighted utensils reduce tremor” is not universally true; they may worsen fatigue or control for some users. Present as one option to trial with appropriate guidance.
- Vendor specialists have a financial conflict and should not be presented like independent clinicians. Encourage trials, return policies, peer input, and qualified assessment for safety-critical or communication-critical equipment.
- Cost ranges, product examples, software names, and funding statements become stale quickly and need dates/current links. Insurance, Medicaid, schools, veterans programs, and nonprofits do not guarantee coverage.
- Consumer apps for anxiety, crisis support, focus, or communication need privacy, evidence, subscription, accessibility, data-loss, and emergency-limitations caveats.

#### `daily-living/fashion-beauty-and-adaptive-wear`
- Magnetic closures need a medical-device warning. Strong magnets can interfere with pacemakers, defibrillators, neurostimulators, some shunts, cochlear/hearing implants, and other devices; users should follow implant/manufacturer guidance and consider proximity to other people with implants.
- Compression garments and “adaptive compression clothes” require fit and medical caveats; inappropriate compression can harm people with arterial disease, neuropathy, skin injury, infection, or other conditions.
- Custom orthotics, arch-support, stable-shoe, and neuropathy footwear advice should be individualized. People with diabetes, neuropathy, wounds, swelling, circulation problems, or significant gait/balance issues may need professional foot and footwear assessment.
- DIY replacement of buttons with magnets, open-side alterations, seams, and catheter/ostomy access can create choking, skin, snag, device, exposure, or dignity risks. Add testing and safety guidance.
- Primary check: [FDA magnet and implanted-device safety communication](https://www.fda.gov/radiation-emitting-products/cell-phones-and-smart-watches-may-affect-pacemakers-and-other-implanted-medical-devices).

## Full audit expansion — batch 20 (12 pages)

Pages audited:
- `get-involved/accessible-protest-guide`
- `get-involved/advocacy-101`
- `get-involved/community-organizing`
- `get-involved/policy-advocacy`
- `get-involved/starting-organizations`
- `get-involved/volunteering`
- `community/in-person-community`
- `community/youth-student-communities`
- `community/index`
- `community/online-communities/discord`
- `community/online-communities/facebook`
- `community/online-communities/reddit`

**Progress:** 196 of 278 pages audited; 82 remain.

### 🔴 Correct immediately

#### `get-involved/accessible-protest-guide`
- The tactics section presents blocking transit, occupations, arrests, banner drops from buildings/bridges, and die-ins without prominent legal and physical-risk warnings. These actions can lead to arrest, falls, traffic injury, emergency-access obstruction, or harm to participants who cannot quickly disperse. Historical description must not read as operational encouragement; direct readers to experienced local organizers and qualified legal support.
- “If arrested, you have the right to request accommodations,” “request that essential medications stay with you,” and “ask for accessible holding areas” can create dangerous expectations. Disability law may require reasonable modifications and necessary medical care, but detention practices, medication verification/administration, equipment access, and remedies vary; a request does not guarantee immediate provision.
- Bringing “extra” medication to a protest can create controlled-substance, storage, loss, confiscation, dosing, and identification risks. Use medication-specific planning with original labels where applicable and a plan made with a prescriber/pharmacist and legal-support team.
- Add specific warnings about surveillance, phone/device search and seizure, photographs identifying other protesters, audio-recording law, immigration consequences, probation/parole, outstanding warrants, minors, guardianship, and benefits/employment exposure. A generic “know your rights” line is not enough.
- The guide needs immediate-danger and dispersal planning that accounts for blocked exits, crowd crush, chemical irritants, heat/cold, fire, police action, loss of mobility/AAC equipment, service animals, and inaccessible transport.
- Primary check: [ACLU protesters' rights](https://www.aclu.org/know-your-rights/protesters-rights).

#### `get-involved/volunteering`
- “Volunteering generally doesn't affect [SSI/SSDI],” “a few hours per month typically won't affect benefits,” and reimbursement/compensation rules are unsafe generalizations. SSA can consider the nature, value, regularity, and circumstances of activity when evaluating ability to work, and cash/in-kind support or reimbursements can affect programs differently.
- The page incorrectly frames SGA as the main volunteering issue for both SSI and SSDI recipients. SGA applies differently by program and stage; for SSI recipients already receiving benefits, countable income rather than SGA ordinarily determines payment, while volunteer activity may still be relevant to disability review or evidence of function.
- Replace “BPAO” with current **WIPA** terminology and direct readers to a qualified benefits counselor before beginning substantial, regular, work-like, reimbursed, or stipend-supported activity.
- Volunteer transportation, medication delivery, peer support, crisis response, interpretation, access support, research, and handling personal data require screening, training, boundaries, privacy, safeguarding, insurance, and emergency procedures. They should not be presented as casual roles anyone can safely undertake.
- Primary checks: [SSA Ticket to Work and WIPA](https://www.ssa.gov/disabilityresearch/ttw.htm), [SSA work-activity evaluation rule](https://www.ssa.gov/OP_Home/cfr20/404/404-1574.htm).

#### `community/online-communities/discord`
- This is not a Discord page. The frontmatter says Discord, but the heading, body, community listings, links, and footer are a Reddit guide. It routes readers seeking Discord-specific privacy and safety guidance to inaccurate platform information. Replace or clearly mark as unavailable before publication.
- Discord requires distinct guidance on server/member visibility, direct messages, minors and adult spaces, account security, scams, grooming/exploitation, doxxing, moderation permissions, deleted-message retention by bots/screenshots, voice/video safety, and crisis escalation.

#### `community/youth-student-communities`
- “You have rights to [an IEP or 504 plan] even without formal diagnosis in some cases” is imprecise and potentially misleading. Eligibility does not require a particular medical label in every case, but IDEA and Section 504 each require their own evaluation and eligibility standards; a student does not have an automatic right to a plan merely by requesting one.
- The accommodation lists present modified assignments, alternative assignments, flexible attendance, homebound instruction, virtual learning, medical leave without academic penalty, course modifications, housing, recording, and deadline flexibility as generally available. Each depends on individualized eligibility, essential requirements, placement/process rules, and whether the modification would fundamentally alter the program.
- “Professors may ask for disability documentation” needs correction. Postsecondary institutions set documentation/accommodation processes; individual instructors generally should not demand diagnosis records outside those processes.
- “Legal guardianship … locks you out of decisions,” “medical decision-making shifts to you,” and privacy/record-access descriptions are too absolute. Age of majority, capacity, guardianship scope, educational-right transfer, healthcare consent, confidentiality exceptions, and parent access vary.
- The page actively directs minors to Discord, Reddit, TikTok, Instagram, Facebook, local meetups, camps, and mentorship without a safeguarding section. Add guidance on grooming, exploitation, sexual content, scams, privacy, location sharing, mandatory reporting, trusted adults, background checks, transportation, and immediate-danger help.

#### `community/index`
- “Confidentiality: What's said in community stays in community” is a false promise. Participants may screenshot, disclose, subpoena, report, or misuse information; platforms and organizers may retain data, and safeguarding/mandatory-reporting duties can apply. State limits before encouraging disclosure.
- “Most disability spaces ask for verification” is unsupported and may normalize requests for sensitive medical or identity information. Verification methods can exclude people, expose diagnoses, and create security risks.
- “Peer support is often more valuable than professional support” is too broad for crisis, medical, legal, abuse, benefits, and mental-health needs. Peer support can complement but does not replace qualified or emergency help.
- Starting a group “doesn't require formal training” needs boundaries. Social groups may be informal, but crisis response, minors, transportation, healthcare advice, benefits/legal advice, money handling, and safeguarding require appropriate expertise and systems.

### 🟠 Important clarification

#### `community/in-person-community`
- Informal transport, volunteer drivers, carpools, home visits, childcare sharing, equipment sharing, physical help, and “community shows up” during crisis require safeguarding, consent, background/driver checks where appropriate, insurance, accessibility, emergency, infection-control, and liability planning.
- A group cannot promise ASL/CART, childcare, service-animal access, transportation, or fragrance-free conditions unless actually arranged and verified. Accessibility statements should accurately describe what is confirmed, limitations, and how to request changes.
- “Accessibility is non-negotiable” is a valuable goal, but access conflicts are not always fully solvable. The page should include a transparent process for assessing safety, feasibility, competing needs, and alternatives without blaming excluded participants.
- “Restorative practices, not punishment” is unsafe as a universal conflict rule. Abuse, stalking, sexual misconduct, threats, exploitation, and repeated boundary violations may require removal, reporting, emergency action, or professional help.
- Broad “Western,” “Global South,” and Indigenous community descriptions stereotype diverse cultures. Use specific community-authored sources or remove the generalizations.

#### `community/online-communities/facebook`
- The page makes many time-sensitive, unsourced evaluations of group size, leadership, moderation, safety, and culture. Verify each named group at publication and add access dates; groups can change ownership, privacy, rules, and quality quickly.
- Do not suggest creating a separate Facebook profile without checking current platform rules and explaining account-linkage/privacy limits. A separate profile does not guarantee anonymity from Meta, group administrators, data brokers, employers, family, or other members.
- Add explicit safeguarding guidance for minors, dependent adults, abuse survivors, financial scams, fake clinicians, sale/trade of medication or equipment, fundraising fraud, and requests for private records/photos.
- Screenshots may preserve harassment evidence but can also expose other people's sensitive information; advise secure storage, redaction, and qualified legal/safety support where needed.

#### `community/online-communities/reddit`
- Every named subreddit, membership estimate, leadership claim, moderation assessment, and “best for” recommendation is time-sensitive and needs verification/access dates. Do not call a space autistic-led, blind-led, safe, or well-moderated without a current documented basis.
- Reddit is moderated at both platform and subreddit levels; “Reddit is unmoderated” is inaccurate. Say moderation quality and enforcement vary.
- The page recommends benefits, legal, wheelchair-maintenance, medical, medication, provider, and accommodation discussions. Strengthen warnings that peer reports are not determinations of eligibility, legal advice, equipment assessment, or clinical guidance.
- Add safeguarding for minors, private messages, grooming, scams, doxxing, brigading, impersonation, fundraising, medication/equipment transactions, and crisis posts.

#### `get-involved/starting-organizations`
- The structure section is too casual for legal formation. Informal groups, mutual aid, nonprofits, fiscal sponsorships, chapters, and cooperatives create different tax, reporting, employment, insurance, fundraising-registration, fiduciary, privacy, safeguarding, and liability obligations.
- “Nonprofit corporation: can receive tax-exempt donations” is misleading. State nonprofit formation does not automatically create federal tax exemption or make donations deductible; most organizations must separately qualify and comply with ongoing federal and state requirements.
- Fiscal sponsorship does not simply preserve project independence. A legitimate sponsor generally retains legal and fiduciary control over charitable funds and may impose policies, fees, reporting, and risk controls.
- Add qualified legal/accounting guidance before accepting money, hiring workers, using volunteers, serving minors/vulnerable adults, collecting health information, transporting people, offering mutual aid, lobbying, or entering contracts.
- Primary check: [IRS guidance before applying for tax-exempt status](https://www.irs.gov/charities-non-profits/before-applying-for-tax-exempt-status).

#### `get-involved/policy-advocacy`
- Advocacy, lobbying, election activity, testimony, gifts, campaign-finance rules, and government-employee restrictions vary by organization and jurisdiction. The page should warn nonprofit, grant-funded, public-employee, and campaign participants to check applicable rules.
- Public comments and testimony become public records in many processes and can expose names, addresses, diagnoses, immigration status, or other sensitive facts. Add privacy and retaliation planning before encouraging personal stories.
- Accommodation requests for hearings should be made early, but access, speaking time, remote participation, and deadline extensions are not guaranteed. Include complaint/escalation paths and alternatives.

### 🟡 Pass with minor notes

#### `get-involved/advocacy-101`
- Pass as a general overview. Add a short warning that legal, benefits, medical, crisis, and safety advocacy may require qualified support and strict deadlines.

#### `get-involved/community-organizing`
- Pass as high-level organizing guidance, but direct-action examples should link to the protest guide's risk caveats rather than romanticize arrest or imply a tactic caused a particular policy victory by itself.


## Full audit expansion — batch 21 (10 pages)

Pages audited:
- `sports/adaptive-fitness`
- `sports/getting-started`
- `sports/wheelchair-sports`
- `sports/blind-sports`
- `sports/deaf-sports`
- `sports/special-olympics`
- `sports/paralympic-movement`
- `tech/communication-access-and-aac`
- `tech/digital-disability-justice`
- `tech/web-accessibility`

**Progress:** 206 of 278 pages audited; 72 remain.

### 🔴 Correct immediately

#### `sports/adaptive-fitness`
- The page recommends resistance bands, weights, pull-up bars, stability balls, cable/weight machines, transfers, swimming, home workouts, outdoor equipment, yoga, tai chi, and breath work without a general safety screen or emergency-stop guidance. Disability type alone does not establish that an activity or adaptation is safe; cardiopulmonary disease, autonomic dysfunction, seizures, osteoporosis, joint instability, pressure injuries, impaired sensation, medication effects, and recent injury materially change risk.
- “Yoga can be adapted for virtually any body,” meditation/breath work has “no physical barriers” and is “accessible to all disability types,” and the listed benefits are too absolute. Practices can trigger pain, dislocation, falls, respiratory symptoms, trauma responses, dizziness, or sensory/cognitive barriers.
- Bed-based range-of-motion and resistance exercise, wheelchair exercise, adaptive grips, transfer options, pool access, and all-terrain equipment need individualized fit, positioning, skin/pressure, entrapment, fall, drowning, equipment-failure, and emergency planning.
- The page should carry the same strong post-exertional-malaise warning as the dedicated exercise page and make clear that generic exercise advice must not override symptom-contingent pacing or current clinical guidance.

#### `sports/getting-started`
- Used sport chairs, prostheses, cycles, skis, grips, and other adaptive equipment are presented primarily as a cost solution. Fit, structural integrity, crash history, pressure/skin risk, restraint/release systems, compatibility, maintenance, and trained setup are safety-critical; peer or marketplace advice is not a substitute for qualified assessment.
- “Programs want you to participate; they’ll help you access gear,” “VA covers equipment for veterans,” and insurance/workers’ compensation funding statements overpromise. Programs, grants, eligibility, covered purposes, authorization, cost-sharing, and available inventory vary.
- Classification is not universally a simple medical-documentation-plus-functional-assessment process, and formal competition does not always require classification. Rules, eligible impairments, status, review, protest/appeal processes, and documentation are sport- and competition-specific.
- Mental-health benefit claims are presented as consistent outcomes without acknowledging study quality, selection effects, adverse experiences, or individual variability.

#### `sports/special-olympics`
- The comparison table says every Special Olympics athlete medals, and the divisioning section says every division has medals and recognition. This is inaccurate: Special Olympics award protocols distinguish medals for first through third place and ribbons for later places or participation/disqualification outcomes. Correct before publication.
- “It’s free: Special Olympics doesn’t charge athletes” is too broad. Program fees, travel, uniforms, equipment, medical forms, and fundraising expectations can vary by local program and event even where participation is subsidized.
- The eligibility summary is incomplete. Eligibility, registration, medical clearance, age rules, sport-specific restrictions, and Unified Sports partner rules should link to current official program rules rather than imply a diagnosis alone guarantees entry.
- “2027 Summer World Games: TBD” is stale and shows that the page’s “recent/upcoming” section requires current verification before publication.

#### `sports/blind-sports`
- The page presents B1/B2/B3 acuity and visual-field thresholds as universal “Paralympic visual impairment classifications.” Classification is sport-specific and current rules, testing methods, eligible underlying conditions, status, and class criteria must come from the relevant international federation. Do not use a generic historical table as an eligibility determination.
- “Blind and sighted judoka compete together” is misleading in a Paralympic-sport explanation. Para judo has eligibility and classification rules; inclusive or mainstream participation is a separate context.
- Tappers, guide running, tandem cycling, skiing, swimming, climbing, ball sports, radio systems, tactile cueing, and blackout eyeshades all need trained-guide, communication, collision/fall, equipment, emergency, and consent protocols. The page currently makes these adaptations sound self-executing.

### 🟠 Important clarification

#### `sports/wheelchair-sports`
- Sport chairs are safety-critical equipment, not simply lighter/more maneuverable alternatives. Add fit, seating/pressure, anti-tip/stability, restraint, transfer, collision, maintenance, inspection, and trained-program guidance before recommending loans, used markets, or custom purchases.
- Collision/contact sports, racing, water sports, skiing, surfing, hockey, handcycling, and power soccer need activity-specific protective equipment, emergency response, concussion/injury, water rescue, traffic/terrain, battery, and equipment-failure guidance.
- “Most programs loan equipment,” “most sports offer” try-it sessions, “most major ski resorts have adaptive programs,” cost ranges, classifications, rules, athlete records, and organizational names are time-sensitive and need sourced access dates.
- Several sport-rule and classification summaries are too categorical. Eligibility and class rules change and differ between recreational leagues, national federations, and international competition.

#### `sports/deaf-sports`
- The “recent/upcoming” list is stale after the 2024 Winter and 2025 Summer Deaflympics. Verify dates, locations, sport programs, and next events from ICSD before publication.
- “Everyone communicates in sign language,” coaches are fluent in sign language, and learning sign language is “essential for full participation” overgeneralize diverse Deaf/HOH athletes and programs. Communication modes, language access, and fluency vary.
- Deaflympics hearing thresholds and the prohibition on hearing aids/cochlear implants should be quoted from and linked to current ICSD audiogram/eligibility rules; do not turn a summary into an eligibility determination.
- Visual signals, removal of hearing devices, contact/water sports, and emergency communication require safety planning so athletes can receive warnings, evacuation instructions, and medical help.

#### `sports/paralympic-movement`
- Generic B1/B2/B3 descriptions and the implication that athletes simply compete against others with similar function oversimplify sport-specific eligibility, classification, class status, combined events, review, protest/appeal, and evidence requirements.
- “Held every four years, immediately following the Olympic Games in the same host city,” “world’s third-largest sporting event,” participating-country totals, event counts, ticket accessibility/affordability, broadcast information, and “most recent” statements are time-sensitive or contestable and need sources/dates.
- “Deaf athletes excluded” is imprecise: deafness alone is not an eligible impairment in the Paralympic classification system, while an athlete who independently meets another sport’s eligibility criteria may compete. Similar care is needed for chronic illness and intellectual-disability summaries.

#### `tech/communication-access-and-aac`
- Add explicit authorship and consent safeguards: do not infer, complete, override, or publicly attribute a message without the communicator’s confirmation; distinguish independent communication from partner-assisted methods and disclose assistance where material.
- AAC and communication technology can fail through battery loss, damage, locked accounts, network outages, vocabulary deletion, software updates, positioning/access changes, or loss of a support person. Add backup communication, emergency-access, repair, charging, data-export, and continuity planning.
- Remote interpreting, captions, transcripts, recordings, messaging, and cloud AAC tools create privacy, confidentiality, consent, retention, and security risks. Automatic captions and speech-to-text can also be dangerously inaccurate in healthcare, legal, educational, or emergency settings.
- The page should distinguish communication access principles from legal entitlements and link accommodation claims to current jurisdiction-specific effective-communication rules.

### 🟡 Pass with minor notes

#### `tech/digital-disability-justice`
- Pass as a high-level values and issues page. Add sourced case studies and distinguish documented harms from illustrative possibilities; link surveillance/data concerns to practical privacy, security, and immediate-harm resources.

#### `tech/web-accessibility`
- Pass as a basic overview. Link directly to the current WCAG version and jurisdiction-specific official guidance, date legal summaries, and state clearly that automated checks and conformance claims do not establish real-world usability or legal compliance.


## Full audit expansion — batch 22 (8 pages)

Pages audited:
- `sports/athletes-directory`
- `sports/index`
- `tech/browsers-assistive-tech`
- `tech/gaming-accessibility`
- `tech/index`
- `tech/mobile-and-os-accessibility`
- `tech/screen-reader-comparison`
- `tech/social-media-accessibility`

**Progress:** 214 of 278 pages audited; 64 remain.

### 🔴 Correct immediately

#### `sports/athletes-directory`
- The directory contains a clear factual error: Gia Pergolini is listed as a rising Paralympic snowboarder, but she is a para swimmer. Audit every athlete, sport, medal total, record, disability label, status, and “first” claim against reliable current sources before publication.
- Multiple entries are stale or internally suspect, including “1984-present” for Heinz Frei, medal totals and “ongoing” labels that do not reflect a consistent as-of date, a “Rising Stars (as of 2025)” section published in 2026, and dynamic records or superlatives without citations.
- The contribution rule “athlete must be disabled” conflicts with the page’s own acknowledgement that not all listed people identify as disabled. Disability/diagnosis labels can be sensitive and contested; include only reliably public, relevant, self-described or carefully sourced information and avoid reducing people to diagnoses.
- RJ Mitte is explicitly listed under cerebral-palsy athletes while the row says “Not athlete.” Remove non-athletes from the athlete directory or create a clearly separate section with an editorial rationale.
- The page needs source citations and access dates for each entry or a maintainable structured sourcing system. Unsourced “GOAT,” “iconic,” “legend,” “pioneer,” “first,” and record-holder labels create accuracy, fairness, and reputational risks.

#### `tech/browsers-assistive-tech`
- The compatibility tables rate browser/AT combinations “Excellent,” “Good,” or “Limited” without versions, platforms, test tasks, methodology, sources, or dates. These claims can quickly become wrong and may cause readers to choose software that fails for critical work. Replace with versioned test results or clearly framed user reports.
- “Try incognito/private mode (no extensions)” is inaccurate; extensions may be permitted in private/incognito mode. Explain how to verify extension state rather than treating private mode as a clean test.
- Recommending users roll back browsers or assistive technology after an update needs a strong security and support warning. Downgrades can restore known vulnerabilities, break profiles/data, or leave users unsupported; use vendor-approved recovery steps and qualified help.
- Extensions recommended for accessibility can read or alter page content and browsing data. Add developer/reputation, permissions, privacy, security, update, abandonment, and enterprise-policy checks before installation.
- “Incompatibility often means something needs updating” can cause harmful troubleshooting churn. Updates can introduce regressions; users should preserve settings/backups, test critical workflows, review release notes, and maintain an alternate access path.

#### `tech/screen-reader-comparison`
- The page uses anonymous first-person quotations under “What users say” without attribution, sourcing, collection method, or indication that they are illustrative. Do not publish fabricated-looking testimonials as user evidence; source, label, or remove them.
- Prices, license terms, platform support, features, training availability, braille-display costs, and comparative ratings are time-sensitive and need official links, regions, versions, and access dates. “JAWS required by some employers” should be reframed carefully: employers may standardize tools, but accommodation duties and effective alternatives are context-specific.
- The guide repeatedly makes subjective or unsupported superlatives such as “most popular,” “most feature-rich,” “excellent,” “strong,” “good enough,” and “95%” without a defined test basis. Clearly distinguish editorial judgment, individual experience, survey evidence, and vendor claims.
- Rollback advice needs the same security/data-loss/support caveat as the browser guide. “Adjust speech rate (faster = less processing)” is unsupported troubleshooting advice and should be removed unless technically sourced.

### 🟠 Important clarification

#### `tech/gaming-accessibility`
- DIY hardware modifications, adaptive controllers, switches, eye/head tracking, and voice control need electrical, battery, mounting, entrapment, repetitive-strain, fit, warranty, and equipment-damage cautions. Link to qualified or established adaptive-gaming support for safety-critical setups.
- Anti-cheat systems may block or penalize assistive software/hardware. Add advice to verify current game/platform rules and seek written accessibility support before risking account sanctions.
- Motion-heavy and flashing content can trigger serious symptoms, but toggles do not guarantee safety. Add pre-play checks, stop guidance, emergency planning, and current official warnings where seizure or other acute risk exists.
- Online gaming also needs privacy and safeguarding guidance for minors and adults: voice/chat exposure, grooming, harassment, doxxing, scams, purchases, account security, streaming, and disclosure of disability.

#### `tech/index`
- “Your disability data is yours” is an ethical principle, not a reliable statement of legal ownership or technical control. Once data is disclosed, collected, inferred, sold, retained, or required, rights and remedies vary by jurisdiction, contract, and data type. Explain practical consent, minimization, deletion/access rights, and limits.
- The AAC section incorrectly groups video relay service under text-based communication and defines voice banking as “recording voice for use by others.” Correct the terminology and link to the dedicated AAC page’s consent, privacy, authorship, and continuity safeguards.
- “All phones have built-in accessibility features,” “screen reader users navigate websites using keyboard,” and several platform feature lists are overbroad. Features, names, support, input methods, region, device, and OS version vary.
- Publicly reporting access failures or filing complaints can expose identity and create retaliation/privacy risks. Add jurisdiction, coverage, deadline, evidence-preservation, and qualified-support caveats.

#### `tech/social-media-accessibility`
- Accessibility practices should address the limits of alt text and captions: descriptions can disclose private or sensitive information, auto-caption errors can be dangerous, and platform fields may be truncated, hidden, or changed. Obtain consent before describing identifiable people or sensitive disability information.
- The safety section is too narrow. Add minors/dependent adults, grooming, impersonation, doxxing, location/metadata exposure, scams, fundraising, fake clinicians, medication/equipment sales, account takeover, evidence preservation, and immediate-danger escalation.
- Platform features and workarounds change rapidly. Any platform-specific instructions should include tested versions/access dates and should not imply that blocking, muting, locked accounts, or moderation reliably prevent harm.

### 🟡 Pass with minor notes

#### `tech/mobile-and-os-accessibility`
- Pass as a deliberately high-level scaffold. Future platform instructions need device/OS versions, official sources, backup/recovery steps, privacy implications, and warnings that updates can alter or break access-critical configurations.

#### `sports/index`
- Pass as navigation, but remove or source the attributed IPC quotation, qualify broad physical/mental-health benefit claims, and avoid repeating the contestable “world’s third-largest sporting event” claim without a metric and source.


## Full audit expansion — batch 23 (11 pages)

Pages audited:
- `research/academic-programs`
- `research/accessible-research-tools`
- `research/disability-statistics`
- `research/ethical-research-with-disabled-communities`
- `research/how-to-interpret-disability-data`
- `research/index`
- `research/studies-archive`
- `housing/independent-living-philosophy-and-centers`
- `housing/index`
- `daily-living/accessible-parties-and-games`
- `get-involved/index`

**Progress:** 225 of 278 pages audited; 53 remain.

### 🔴 Correct immediately

#### `housing/index`
- The page routes readers in urgent or legally consequential situations to numerous housing pages that do not exist in the repository, including housing rights, international housing rights, accessible housing search, home modifications, tenant rights, homelessness, and group homes/institutions. This is a publication blocker: readers facing discrimination, eviction, homelessness, or institutionalization are promised practical help and sent to dead destinations.
- The links include `.md` in public-facing paths, creating an additional routing risk even if pages are later added. Verify generated URLs rather than source filenames.
- “All disabled people worldwide have the right to live independently in the community with support” is presented as directly enforceable because of CRPD Article 19 and a ratification count. Treaty status, reservations, domestic implementation, enforceability, available supports, eligibility, and remedies vary by jurisdiction. Clearly distinguish an international human-rights standard from an immediately enforceable individual remedy.
- “Which programs cover costs,” “protecting yourself from eviction,” “what’s illegal,” and similar descriptions promise outcomes from absent pages and need jurisdiction-, eligibility-, deadline-, and fact-specific caveats.

#### `housing/independent-living-philosophy-and-centers`
- “Call them—services are free,” “most disabled people qualify,” “no disability excluded; no gatekeeping,” and descriptions of what CILs provide are unsafe promises. CIL service area, statutory eligibility, intake, funding, staffing, waitlists, available services, and charges for particular activities vary. A philosophy of broad access is not a guarantee of a requested service.
- The U.S. funding explanation is materially misleading: it says most CILs receive funding through Medicaid, vocational rehabilitation, or other programs and that this enables free services. CIL funding structures are more specific and varied; Medicaid personal-care funding is not interchangeable with federal/state Independent Living program funding.
- Self-direction is presented as “you recruit, hire, train, and fire” and “you’re the employer.” Some people use agency-employed workers, fiscal intermediaries, representatives, or other models; employer status carries payroll, tax, labor, immigration, insurance, safety, abuse-reporting, and recordkeeping obligations. Do not imply everyone can or should directly employ attendants.
- Peer support is asserted to be “more effective than professional-only models” without evidence or scope. Peer support can be valuable but does not replace qualified medical, legal, benefits, safeguarding, crisis, or emergency help.
- Country and region sections make broad, unsourced claims about funding, rights, personal budgets, service availability, and movement development. They need current official sources and careful jurisdiction-specific treatment.
- Add safeguarding and urgent-help guidance for abuse, coercion, neglect, exploitation, unsafe attendants, loss of essential support, homelessness, and immediate medical risk.

#### `research/ethical-research-with-disabled-communities`
- The page repeatedly overstates what CRPD Articles 30 and 31 establish, including a right to participate in research and a rule that research be conducted with the “full consent” of disabled people involved. Article 31 concerns statistics/data collection and safeguards; Article 30 concerns cultural, recreation, leisure, and sport participation. Use precise treaty language and separately explain applicable research-ethics and domestic legal requirements.
- “People must be able to withdraw without penalty at any time” and a “right to access findings about oneself” are too absolute. Withdrawal, compensation, retention/use of already-collected data or specimens, return of individual results, and destruction requests depend on consent terms, study design, law, feasibility, and ethics-board requirements.
- “Never assume inability to consent” is important, but the page omits decision-specific capacity assessment, legally authorized representatives, assent/dissent, supported decision-making limits, emergencies, mandatory reporting, and jurisdiction-specific rules. Accessible communication does not itself establish legally valid consent.
- “Include both child assent and parent/guardian consent” is not universal; age, capacity, emancipated/minor status, risk, waivers, guardianship, and local law vary.
- Add concrete rules for IRB/research-ethics review, data minimization, reidentification risk, recordings/transcripts, biospecimens/genetics, incidental findings, mandatory reporting, adverse events, conflicts, compensation/undue influence, international data transfer, AI use, publication, and community/member confidentiality.
- Seeking community review or consent before publication can be valuable in participatory research but is not universally appropriate and can threaten independence, confidentiality, or reporting of unfavorable findings. Define governance and publication authority in advance.

#### `research/disability-statistics`
- “Disaggregate data and cross-tabulate” is presented as a general best practice without warning that small cells and intersecting characteristics can reidentify people or produce unstable/misleading estimates. Require disclosure review, suppression/aggregation, uncertainty, and statistical-validity checks.
- The page omits essential statistical interpretation safeguards: sampling design and weights, margins of error/confidence intervals, missing data, measurement error, nonresponse adjustment, multiple comparisons, denominator choice, age standardization, trend comparability, and the difference between association and causation.
- Washington Group questions are described as measuring disability prevalence consistently. Their sets and cutoffs serve particular purposes and may undercount or omit some populations/conditions; estimates are not interchangeable with diagnosis, legal disability, benefit eligibility, or all-purpose prevalence.
- Proxy responses can introduce error but may also be necessary for inclusion. Present their limitations and ethical use rather than treating them mainly as a defect.

### 🟠 Important clarification

#### `research/how-to-interpret-disability-data`
- Add the missing statistical safeguards from the disability-statistics page: uncertainty, weights/complex design, missingness, denominator and rate choice, multiple testing, temporal comparability, and association versus causation.
- “Disaggregate whenever possible” needs privacy, small-cell, statistical-power, and disclosure-control limits. Intersectional analysis can expose the very people it is intended to represent.
- A social/rights-based lens is valuable, but the instruction to replace “medical-model” analysis with social causes should not erase clinically relevant impairment, disease, treatment effects, or individual-level mechanisms. Match the interpretive framework to the question and evidence.

#### `research/accessible-research-tools`
- Support persons, interpreters, multiple response modes, transcript review, flexible timing, and alternative formats can improve access but can also affect privacy, coercion, authorship, measurement equivalence, standardization, and data validity. Plan and disclose these effects rather than treating adaptations as neutral.
- “Accept communication in whatever form works” needs an authorship/confirmation safeguard and a plan for partner-assisted communication. Do not let a support person answer for a participant without a defined, consented protocol.
- Sharing transcripts creates confidentiality and data-security risks and may not be part of every study. Explain secure delivery, redaction, correction scope, deadlines, and whether transcript review is promised in consent materials.
- A generic sixth-to-eighth-grade reading-level target is not a substitute for user testing, Easy Read expertise, language access, or legally/ethically complete consent information.

#### `research/academic-programs`
- Program names, degree levels, online status, “first” claims, new-major launch dates, faculty composition, accessibility, and career pathways are time-sensitive. Verify every listing with an access date and do not imply that a program will provide accommodations readily or lead to listed careers.
- Add tuition, accreditation/credential relevance, admissions, residency, placement/fieldwork access, funding, and complaint-process considerations before readers make substantial education decisions.

#### `research/studies-archive`
- This is a short curated reading list, not a research database or archive. Rename it or add structured metadata, source verification, update dates, link checks, versioning, search/browse functions, and a maintenance policy.
- Featured resources mix a 2011 global report, annually updated sources, articles, toolkits, and datasets without explaining currency, supersession, evidence quality, peer review, or appropriate use. Summaries should be verified against the cited source and dated.
- Contributor summaries of “key findings” need editorial review for accuracy, causal overstatement, conflicts, retraction/correction status, and harmful or stigmatizing framing.

#### `daily-living/accessible-parties-and-games`
- Ingredient labels and asking about allergies do not make food safe; cross-contact, substitutions, preparation surfaces, serving utensils, and emergency plans matter. Hosts should not promise allergen safety they cannot verify.
- “Having alcohol available is fine” and the parallel cannabis advice need age, consent, intoxication, medication/health interaction, respiratory exposure, transportation, storage, local-law, and emergency safeguards. No-pressure language alone is insufficient.
- Game accessibility ratings are categorical and sometimes inaccurate: text, vision, color, motor, cognition, timing, hearing, online-chat, and content demands vary by edition and player. Present them as features to verify, not “highly accessible” recommendations.
- Large events and home gatherings need evacuation, emergency communication, service-animal, medication, mobility-device charging, infection-control, abuse/harassment, minors, and privacy planning.

### 🟡 Pass with minor notes

#### `research/index`
- Pass as navigation after correcting the repeated CRPD research-rights attribution and linking readers to the ethics page’s required legal/ethics-review caveats.

#### `get-involved/index`
- Pass as navigation. The protest, organization, policy-advocacy, and volunteering links should visibly signal the legal, safety, benefits, and safeguarding cautions identified on those pages.


## Full audit expansion — batch 24 (8 pages)

Pages audited:
- `history/eugenics`
- `history/institutionalization-and-deinstitutionalization`
- `history/war-and-colonialism`
- `history/industrialization`
- `history/early-movements`
- `history/pre-industrial`
- `history/global-timelines`
- `history/index`

**Progress:** 233 of 278 pages audited; 45 remain.

### 🔴 Correct immediately

#### `history/pre-industrial`
- This page is not publication-ready. Its central claim that “for most of human history” the general pattern was inclusion, accommodation, and valuing disabled people is unsupported and contradicts the page’s later acknowledgement of incomplete evidence and substantial variation. Pre-industrial societies cannot be treated as a single disability system.
- It repeatedly invents or overstates evidence about entire populations: hunter-gatherers transporting people with portable dwellings; blind people joining hunts; autistic/ADHD people serving as shamans; Deaf communities and ancient sign languages; ramps and accessible public spaces in China; Roman modified tools; Indigenous canoe modifications; government disability programs in ancient China; African “Ubuntu” inclusion; Pacific Islander integration; and disabled people’s standard economic/spiritual roles. Each claim needs a specific culture, period, primary/credible secondary source, and uncertainty statement or must be removed.
- Retrospectively diagnosing ancient people or assigning modern categories such as autism, ADHD, neurodivergence, mental health conditions, and disability identity is methodologically risky. Do not infer diagnoses or social roles from sparse archaeological or textual evidence.
- The claim that karma is “not about blame/punishment,” that disability was generally seen as natural rather than a problem, and that impairment was separated from social oppression imposes modern preferred interpretations on diverse religious and cultural traditions.
- “Disability segregation is choice, not necessity,” “ableism is learned, not natural,” and “community responsibility works” are normative conclusions presented as historical findings. Preserve them as arguments, not claims proven by the preceding evidence.
- The page romanticizes Indigenous and Global South societies while flattening them into broad categories. Indigenous knowledge must be attributed to specific peoples and community-authorized sources; avoid implying colonization alone created every harmful disability practice.
- Several links are dead or misnamed, including `/history/accommodations-history`. The Google Forms contribution link also creates privacy, moderation, sourcing, and consent risks for Indigenous/community knowledge.

#### `history/global-timelines`
- The timeline contains too many unsourced, legally consequential, and time-sensitive entries to publish as a reference. Every entry needs a reliable source and a precise description of what changed; enactment, commencement, amendment, ratification, implementation, and litigation outcomes are not interchangeable.
- Several entries appear inaccurate or misleading, including the 1980 U.S. “Social Security Disability Benefits Reform Act,” the claim that the 1970 Urban Mass Transportation Act required accessible transit without qualification, Sweden’s “first personal assistance legislation” in 1967, and the European Day of Disabled People date/name. Conduct a line-by-line source audit.
- “Milan Conference … banning sign language in schools internationally” overstates a conference resolution’s legal effect and erases varied implementation and Deaf resistance.
- “Brown v. Board … later applied to disability segregation,” laws that “include disability provisions,” and other compressed entries need named cases/provisions and careful causal language rather than implying direct or comprehensive protection.
- Current CRPD signature/ratification counts and “present” ranges need an as-of date and official treaty-status source. Do not infer domestic enforceability from ratification.
- Historical terminology in law titles may be necessary for accuracy but should be clearly marked as quoted historical language.

#### `history/institutionalization-and-deinstitutionalization`
- The U.S. legal summaries overstate holdings. *O’Connor v. Donaldson* did not establish that every “non-dangerous” person cannot be confined against their will under all circumstances; *Olmstead* includes treatment-professional, individual-preference, reasonable-modification, and fundamental-alteration conditions. Each case needs a precise primary-source summary.
- The page implies deinstitutionalization caused homelessness because people were discharged without support. The history is more complex and requires evidence distinguishing hospital closures, housing policy, service funding, poverty, incarceration, and other causes.
- “Large group homes (more than 4 people)” do not count as community living is presented as a universal legal threshold. Institutional characteristics and applicable definitions vary by framework and jurisdiction; size alone is not the only criterion.
- Nursing-home population, age, placement reason, racial disparity, psychiatric-hospital population, and incarceration figures need dates, definitions, and primary sources. “Estimated 2 million people with serious mental health conditions are incarcerated annually” is especially unclear and risks confusing jail bookings, unique people, diagnoses, and incarceration prevalence.
- Add immediate safeguarding/help routes for people currently facing abuse, involuntary confinement, restraint/seclusion, neglect, unsafe discharge, homelessness, or loss of essential support. Historical framing alone is insufficient on a page describing ongoing harm.

#### `history/war-and-colonialism`
- The page makes sweeping claims about colonized and Indigenous societies without specific evidence, including that colonial systems replaced “robust Indigenous frameworks,” disabled people had established integrated roles, sign languages were preserved in secret, and colonial disability systems were designed for control rather than care. These may be supportable in particular contexts but cannot be asserted globally.
- Statements about millions disabled by forced labor, disabled enslaved people being “often killed,” mission schools broadly punishing disabled children, and named countries’ experimentation require specific sources, dates, populations, and distinctions among documented cases.
- The Guatemala syphilis experiments occurred in 1946–1948 and were U.S.-led research in Guatemala; placing them under generic colonial/wartime experimentation requires precise framing. Aktion T4 was a Nazi killing program, not simply medical experimentation “leading to” itself.
- “Global South communities often reject Western disability frameworks” treats enormous, diverse populations as a single viewpoint. Attribute critiques to named scholars, organizations, or communities.

### 🟠 Important clarification

#### `history/eugenics`
- “Sterilization almost always happened without true consent,” “eugenics and institutionalization became dominant global systems,” and lists of targeted disability groups/countries are too broad without jurisdiction-specific evidence. Distinguish compulsory, coerced, nonconsensual, and formally consented-but-abusive practices.
- The T4 section conflates phases and populations. The commonly cited roughly 70,000 figure generally refers to the centralized adult killing phase through August 1941; child killings and decentralized killings continued and raise the total substantially. State the scope of each estimate.
- “California alone sterilized over 20,000, disproportionately targeting Mexican and Mexican-American women,” U.S. 2010s claims, colonial experimentation, and residential-school links need direct sources and careful distinctions among eugenic statutes, prison sterilizations, medical abuse, and colonial policy.
- “This was social control—not science” is a defensible ethical judgment but should accompany, not replace, explanation of how eugenicists used institutions and claims of scientific legitimacy.

#### `history/industrialization`
- The title and page repeatedly claim industrialization created or birthed modern ableism. Industrialization profoundly reshaped disability categories and labor exclusion, but causal claims need attribution and must acknowledge earlier and non-industrial forms of exclusion, violence, stigma, and accommodation.
- Pre-industrial work is romanticized as flexible and inclusive, while factory work is treated as uniformly standardized and exclusionary. Experiences varied by class, gender, slavery/forced labor, impairment, household, occupation, region, and period.
- Claims that statistical averages directly created “normal” bodies, employers excluded disabled workers on that basis, and welfare categories followed people for life need named histories and jurisdiction-specific evidence.
- Colonialism sections repeat broad claims about Indigenous/community systems without specific community-authored sourcing.

#### `history/early-movements`
- The page presents thinly sourced activities as coherent “movements” across 1800–1960 and globally. Distinguish formal organizations, mutual aid, individual resistance, family advocacy, professional-led reform, and retrospective movement interpretation.
- “The 1880 Milan Conference imposed oralism—the banning of sign languages—in many countries” overstates its authority and obscures local law, school policy, implementation, and resistance.
- Claims about underground asylum organizing, blind guilds/cooperatives globally, Indigenous kinship support, anti-colonial disability framing, and cross-disability coalitions need named examples and sources.
- Family resistance should not automatically be characterized as disabled-led organizing; identify whose voice and interests were represented.

### 🟡 Pass with minor notes

#### `history/index`
- Pass as navigation only after the linked pages’ sweeping causal and global claims are corrected. The index currently repeats contested conclusions as settled history, especially that industrialization constructed ableism and pre-industrial societies offered broad flexibility/inclusion.


## Full audit expansion — batch 25 (12 pages)

Pages audited:
- `history/ada-history`
- `history/disability-rights-movement`
- `history/independent-living-movement`
- `history/accommodations`
- `history/deaf-history-culture`
- `history/disability-in-media-history`
- `foundations/disability-identity`
- `foundations/disability-models`
- `foundations/disability-culture`
- `foundations/for-allies`
- `foundations/handling-intrusive-questions`
- `foundations/how-to-use-this-wiki`

**Progress:** 245 of 278 pages audited; 33 remain.

### 🔴 Correct immediately

#### `history/accommodations`
- This page is not publication-ready. It presents dozens of highly specific historical examples as documented fact without citations, including accessible Egyptian temples and Roman forums, medieval castle/cathedral ramps intended for disabled access, accessible Chinese government buildings, Indigenous accessible ceremonial structures and modified canoes, disability-modified medieval homes, one-handed tools, blind craftspeople, Deaf sailors, inclusive pirates, and state disability support in ancient Egypt. Many claims appear speculative, anachronistic, or invented.
- A ramp, incline, wide path, carried chair, prosthetic, or tool does not establish that it was designed as a disability accommodation or that disabled people had equal community access. Distinguish archaeological object/function evidence from modern interpretation.
- The “pirate example” is especially unreliable and unsafe: it claims pirates provided pain medication, rest, shared compensation, flexible disability roles, and community safety, with named crews but no sources. Rum/alcohol and historical opiates should not be romanticized as pain-management accommodations.
- The page repeatedly diagnoses or labels historical people without evidence (“neurodivergent thinkers”), assigns occupations by disability (“blind weavers,” “Deaf carpenters”), and claims quality/equal status/outcomes that are not sourced.
- “Industrialization,” “capitalism,” “medicine,” and “colonialism” are each presented as singular causes that destroyed accommodation and produced segregation. These are interpretive arguments requiring attribution, scope, and counterevidence, not settled universal facts.
- Indigenous and other community knowledge must be attributed to specific peoples and authorized sources. Do not solicit sensitive cultural knowledge through an external form without privacy, consent, attribution, moderation, and stewardship protocols.

#### `history/deaf-history-culture`
- Conduct a full Deaf-led factual review before publication. The page makes broad claims about Deaf people, sign-language origins, ancient/global Deaf communities, education outcomes, cognition, communication, arts, professions, and cultural consensus without citations or attention to regional variation.
- Do not frame cochlear implants, genetic testing, prenatal decisions, or mainstream education as a simple “threat to Deaf culture.” These are ethically and medically complex, individual/family decisions involving language access, informed consent, child development, risk, and diverse Deaf/HOH perspectives.
- Claims that Deaf children in hearing families receive no sign language, delayed language causes stated outcomes, mainstreaming produces worse outcomes, and specific technologies threaten Deaf futures require careful current evidence and should not be generalized.
- “Hear perfectly fine (through sign language)” confuses hearing with communication and can erase hard-of-hearing, late-deafened, deafblind, oral, implanted, and multilingual experiences.
- The external contribution form creates privacy and consent risks for personal stories and cultural knowledge; define editorial review, attribution, and data handling.

#### `foundations/disability-identity`
- “Self-diagnosis is valid,” “no one can tell you whether you’re really disabled,” “there is no disabled enough,” and unconditional belonging statements need a firm distinction between personal/community identity and claims made in clinical, legal, benefits, accommodation, research, sport, or service contexts. Self-identification does not establish a diagnosis, rule out urgent/alternative conditions, or satisfy eligibility/documentation standards.
- “Your experience is valid whether or not medicine has caught up” can unintentionally reinforce a specific self-diagnosis and delay appropriate evaluation. Validate symptoms and barriers without validating an unconfirmed cause.
- The page suggests diagnosis provides access to legal protections and benefits, while identity may be necessary for accommodations. Diagnosis alone does not establish eligibility, and personal identity is generally not sufficient; applicable definitions, functional effects, evidence, and process matter.
- Visibility advice should include disclosure/privacy consequences, employment/insurance/benefits implications, harassment, scams, safety, and the fact that lanyards or symbols do not guarantee recognition or accommodation.

### 🟠 Important clarification

#### `history/ada-history`
- “World’s first comprehensive civil rights law for disabled people” is a contestable superlative needing a defined metric and comparative source. Earlier national/subnational laws and constitutional protections complicate the claim.
- The Capitol Crawl section needs a primary-source audit. Participant, crawler, step, leader, arrest, and impact claims vary across accounts; arrests associated with adjacent actions should not be conflated with the crawl. “Credited with pushing reluctant House members” is a causal claim requiring evidence.
- ADA title summaries are too broad for practical reliance. Accommodation, accessibility, coverage, defenses, remedies, and effective dates vary; Title III does not require every existing barrier removed, and Title I does not guarantee a requested accommodation.
- “Emotional support animals: not covered” is misleading outside ADA public access; assistance-animal protections differ under housing and other laws. The web-accessibility section also needs current, title-specific law and official guidance rather than a generic “courts split” statement.
- “Food handling … answer was no” oversimplifies the ADA’s infectious/communicable-disease and food-handling provisions.

#### `history/disability-rights-movement`
- “Every legal protection … was won through organizing” and “rights are … taken” are movement rhetoric, not complete causal history. Legislation and enforcement also reflect litigation, administration, research, elections, institutions, coalition conflict, and opposition; label rhetoric as such.
- Section 504, IDEA, ADA, CRPD, and country-law summaries imply broader guarantees than the laws provide. Use precise scope and avoid turning historical pages into legal advice.
- Capitol Crawl and 504 sit-in counts/durations, “longest occupation” claims, ADAPT’s founding/name history, CRPD ratification totals, and current-issue statistics need sourced dates.
- “The CRPD represents the global consensus” overstates agreement and domestic implementation; treaty ratification, reservations, enforcement, and state practice vary.

#### `history/independent-living-movement`
- “World’s first CIL,” “first Centers for Independent Living,” worldwide CIL spread, global movement descriptions, and claims that IL influenced named countries’ laws need sources and careful distinction between the Berkeley model and other earlier/concurrent disabled-led organizations.
- “Legal frameworks guaranteeing community living” overpromises enforceability. CRPD and domestic integration rights do not guarantee every requested support, placement, or funding outcome.
- The Latin America, Africa, Asia-Pacific, Scandinavia, and Japan sections compress diverse movements into unsupported summaries. Name organizations, activists, dates, and sources or narrow the claims.
- The page should acknowledge that personal assistance/self-direction models create labor, funding, safeguarding, and access tensions and do not work identically for every person.

#### `history/disability-in-media-history`
- Media examples, “dominant” tropes, telethon fundraising totals, movement impacts, and claims about current casting/representation need sources and dates. Distinguish critical interpretation from factual history.
- “All agree” about freak-show legacy and “increasingly answered no” regarding nondisabled actors are false consensus claims. Attribute positions to named scholars/advocates and acknowledge disagreement.
- The creators section inconsistently includes nondisabled creators or works with only indirect disability relevance, while implying a disabled-creators list. Apply transparent inclusion criteria and verify public disability identity before labeling people.
- Disability, diagnosis, and identity labels for living people create reputational/privacy risks and require reliable public sourcing.

#### `foundations/disability-models`
- Present models as analytical traditions with multiple versions and critics, not fixed boxes with universally agreed “problems” and “solutions.” Attribute origins and distinguish the UK social model from later relational, minority, human-rights, cultural, and justice frameworks.
- The moral/religious section risks flattening diverse traditions into punishment, karma, destiny, or healing narratives. Use specific traditions and disabled theologian/community sources rather than broad cultural claims.
- The medical model is caricatured as necessarily treating disabled people as defects and professionals as sole experts. Critique medicalization while distinguishing clinical care, biomedical research, public health, rehabilitation, and individual treatment goals.

#### `foundations/disability-culture`
- Historical facts repeat errors identified elsewhere, including ADAPT beginning in 1978, a 26-day/“longest occupation” 504 claim, and broad movement/atrocity totals. Source and harmonize these claims across the wiki.
- Online-community recommendations route users, including potentially minors, toward public hashtags, Reddit, Discord, Facebook, and external forms without privacy, grooming, scam, harassment, doxxing, or crisis safeguards.
- “The autistic community mostly prefers,” “the Deaf community strongly prefers,” and other language claims need current survey/community sourcing and recognition of regional and individual variation.
- Claims about poverty causing disability, police violence, employment discrimination, institutionalization, and culture should be sourced and precisely framed.

#### `foundations/for-allies`
- Advice to attend protests, contact legislators, publicly amplify content, intervene, donate, share professional skills, or step into harassment situations needs safety, privacy, consent, legal, employment, campaign/lobbying, and safeguarding caveats.
- “Don’t take jobs, positions, or platforms that should go to disabled people” is too categorical and can become discriminatory or tokenizing. Emphasize equitable recruitment, removing barriers, compensation, and disabled leadership without assigning roles based solely on disability status.
- Workplace, education, healthcare, design, and accommodation instructions blur ethical best practice with legal duty. Covered entities may require defined processes/documentation; qualified professionals must still exercise appropriate judgment and meet safety/essential-requirement standards.
- “Presume competence” should not erase decision-specific capacity, safeguarding, communication support, or legal authority.

#### `foundations/handling-intrusive-questions`
- “You can decline questions unrelated to reason for visit” is too broad in healthcare. A clinician may need seemingly unrelated information for safe diagnosis, medication, procedures, safeguarding, billing, or legal duties; patients can ask why, discuss limits, or seek support, but refusal may affect care.
- “Rudeness gets rudeness,” direct confrontation, absurd answers, and advising allies to interrupt can escalate danger. Add context-specific personal-safety planning, especially where the questioner has authority or where leaving is difficult.
- Reporting harassment to police “if warranted” needs caution: police contact can create particular risks for disabled, racialized, immigrant, psychiatric, and otherwise marginalized people. Offer multiple safety/support routes.
- Workplace/education privacy, harassment, and accommodation processes vary; HR is not inherently confidential or protective.

### 🟡 Pass with minor notes

#### `foundations/how-to-use-this-wiki`
- Pass as a redirect stub. Verify the destination remains live and that duplicate/archived pages are excluded from the published navigation and audit count.


## Full audit expansion — batch 26 (11 pages)

Pages audited:
- `media/blogs-and-websites`
- `media/books`
- `media/disability-arts-and-performance`
- `media/disabled-creators-directory`
- `media/documentaries-and-films`
- `media/index`
- `media/media-tropes-and-representation`
- `media/podcasts`
- `media/tiktok-creators`
- `media/tv-shows`
- `media/youtube-channels`

**Progress:** 256 of 278 pages audited; 22 remain.

### 🔴 Correct immediately

#### `media/disabled-creators-directory`
- The page promises that all listed creators are openly disabled, but includes Lennard Davis with only “son of Deaf parents” in the disability field. Having Deaf parents is not itself a disability. This contradiction shows the directory lacks a reliable inclusion and verification process.
- The directory duplicates Sandie Yi under two names/rows with conflicting disability descriptions. Conduct a full deduplication and identity/source audit.
- Publishing named living people alongside diagnoses or disability labels creates privacy and reputational risk. Require reliable public self-disclosure, a citation/access date, relevant context, correction/removal process, and preferably consent before listing sensitive health information.
- “Self-identification accepted” for a person adding themselves is different from a third party assigning or repeating a diagnosis. The contribution workflow must distinguish these and prohibit inference.
- Awards, roles, institutions, public identities, and “notable” work change. Use structured records with source links, verified dates, last-reviewed fields, and archival/removal status.

#### `media/tiktok-creators`
- The list publishes sensitive disability and intellectual-disability labels for living people, including young creators, without citations or evidence of consent. Do not infer or repeat diagnoses from content; verify public self-description and create a correction/removal process.
- Handles, identities, ownership, age, content, safety, and moderation change rapidly. Each listing needs a verified date and link; several handles contain apparent formatting/errors, and “highly recommended,” popularity, and follower claims are unsourced.
- Directing readers toward hashtags, comments, duets, stitches, and algorithm training needs robust privacy/safeguarding guidance for minors and adults: grooming, scams, impersonation, health misinformation, harassment, doxxing, location/metadata exposure, fundraising, and account security.
- TikTok creators are not vetted medical, legal, benefits, or safety authorities merely because they discuss disability. Clearly distinguish lived experience from qualified advice.

#### `media/tv-shows`
- The “Currently Airing (as of December 2025)” section is already stale or incorrect and includes ended shows and limited series. Publication in June 2026 requires a current line-by-line status and availability check.
- Authentic-casting and disabled-creator symbols, disability labels, behind-the-scenes claims, and representation-quality judgments need citations. Do not label living actors/creators with disability or diagnosis unless reliably public and relevant.
- The directory presents subjective judgments such as “essential viewing,” “positive,” “authentic,” and “groundbreaking” as editorial fact without review criteria or attribution. Add transparent criteria and date reviews.
- Streaming availability, platform ownership, cancellation/renewal status, regional access, captions, audio description, and other accessibility features vary and need current region/version-specific verification.

#### `media/youtube-channels`
- The page says it features disabled YouTubers and marks entries with the disabled-creator symbol, yet explicitly includes nondisabled creators/parent-led channels such as Special Books by Special Kids and Fathering Autism. Separate disabled-led work, family/parent perspectives, organizations, and nondisabled interviewers rather than blurring them.
- Publishing diagnoses, disability labels, and deceased-creators’ archives needs sourcing, consent/public-self-disclosure standards, respectful archival context, and a correction/removal policy.
- Subscriber counts, channel activity, identities, links, content quality, and accessibility change rapidly. Add last-verified dates and remove unsupported “highly recommended,” “most influential,” and accessibility judgments.
- Parent/family channels involving disabled children raise privacy, consent, monetization, exploitation, dignity, and long-term digital-footprint concerns that must be disclosed before recommendation.

### 🟠 Important clarification

#### `media/documentaries-and-films`
- Conduct a title-by-title factual audit. The list misclassifies works, applies authentic-casting/disabled-filmmaker markers inconsistently, and includes uncertain or incorrect titles/dates. For example, *The Specials* is a narrative feature, not a documentary; *Hush* is marked as authentic representation despite a hearing lead; and the listed *Deaf President Now* date/title requires verification.
- “Essential,” “authentic,” “dignity-centered,” “nuanced,” “changed perceptions,” and representation warnings are critical judgments requiring named reviewers or transparent editorial criteria, not factual labels.
- Streaming availability and platform accessibility are regional and dynamic. Checking for captions or audio description is not enough; quality, language, device, title, and region vary.
- Films involving abuse, restraint, suicide/assisted death, institutionalization, violence, or intense medical content need specific content/safety notes without presenting a single community interpretation as consensus.

#### `media/books`
- The page contains promotional-sounding quotation fragments and evaluative claims without attribution, including claims that books are “remarkably authentic,” “seamless,” “stigma-free,” or will change readers forever. Cite the reviewer/source or rewrite as transparent editorial assessment.
- Author disability, race, ethnicity, and other identity classifications require reliable public sourcing and relevant context. Do not infer identities or use them as directory metadata without a correction/removal process.
- Some summaries make questionable interpretive claims, such as using *Things Fall Apart* primarily as disability representation and stating what it promotes. Distinguish literary criticism from plot description and cite scholarship.
- Medical/clinical books, older memoirs, and health-strategy books need currency/evidence warnings; inclusion is not endorsement or individualized guidance.

#### `media/blogs-and-websites`
- “Disabled-led,” “currently active,” “essential,” “influential,” and organizational descriptions are dynamic and unsourced. Verify ownership, leadership, activity, editorial standards, accessibility, and links with an access date.
- The page recommends health, psychiatric, autism, ADHD, travel, legal-policy, and family resources without assessing evidence quality, conflicts, fundraising, privacy, medical misinformation, or whether content is advice versus lived experience.
- The evaluation checklist focuses mostly on language and leadership; add sourcing, corrections, evidence, privacy/security, commercial conflicts, crisis limitations, safeguarding, and current accessibility.

#### `media/podcasts`
- Podcast titles, hosts, disability-led status, activity, archive availability, and descriptions need verification; several generic-sounding listings may be inactive, difficult to identify, or inaccurately characterized.
- Mental-health, psychiatric, chronic-illness, and health-management podcasts require evidence, crisis, treatment, misinformation, and professional-advice caveats. Critical perspectives on psychiatry should not be mistaken for individualized treatment guidance.
- Add transcript/caption availability and accessibility quality as core review fields rather than assuming an audio directory is accessible.

#### `media/disability-arts-and-performance`
- Artist disability labels, organizational leadership, activity, events, and “first” or influence claims need reliable public sources and dates. Separate historical record from current recommendations.
- Accessibility of a disability-arts organization, venue, festival, or performance should never be assumed. Verify physical, communication, sensory, financial, digital, and content access for each event.
- External opportunities, auditions, workshops, and organizations require scam, fee, privacy, labor, safeguarding, and exploitation checks before recommendation.

#### `media/media-tropes-and-representation`
- “Research shows” media directly affects outcomes from hiring to policy support, “most disabled people” have similar quality of life, disabled actors are unemployed at “80%+,” and disabled frustration “typically” comes from barriers all need precise sources, populations, and dates.
- The page often presents community consensus where views differ, especially around cure, casting, assisted death, representation quality, and whether a work is harmful. Attribute critiques and include variation without treating all views as equally evidenced.
- “Good representation” is an editorial framework, not an objective checklist. Disabled creators and authentic casting can still produce contested work; nondisabled collaborators do not automatically make work harmful.

### 🟡 Pass with minor notes

#### `media/index`
- Pass as navigation after directories adopt sourcing, verification dates, inclusion criteria, correction/removal processes, privacy safeguards, and transparent editorial-review standards.


## Full audit expansion — batch 27 (15 pages)

Pages audited:
- `glossary/acronyms`
- `glossary/bibliography`
- `glossary/citation-guide`
- `glossary/editorial-guidelines`
- `glossary/how-to-contribute`
- `glossary/index`
- `glossary/terminology`
- `start/accessibility-statement`
- `start/contact`
- `start/contribute`
- `start/disability-culture--pride`
- `start/faq`
- `start/for-allies`
- `start/how-to-use`
- `start/language-and-terminology`

**Progress:** 271 of 278 pages audited; 7 remain.

### 🔴 Correct immediately

#### `start/accessibility-statement`
- The statement makes unverified absolute promises that the wiki works with named screen readers, can be entirely navigated without a mouse, has no keyboard traps, uses visible focus, works on older devices/slow connections, is seizure-safe, has good contrast, has descriptive links and image descriptions, and is tested with NVDA/JAWS. The audit has already found broken/mismatched links, inconsistent headings, missing safeguards, and other defects. Publish only claims supported by documented testing, scope, versions, dates, and known limitations.
- “This page is: Accessible to screen readers | Mobile-friendly | Plain language | Keyboard navigable” is a conformance claim without evidence. Do not self-certify individual pages this way.
- The contact/report links use unresolved Wiki.js syntax and placeholder routes/email text, so the accessibility-reporting mechanism itself may not work. A statement must provide a functioning accessible contact method.
- Promises that feedback will be read by disabled maintainers, fixes prioritized, interpreters available on request, and alternative formats/translations added according to need require actual capacity, process, ownership, and response commitments.
- “Global North” and “Global South” sections stereotype infrastructure, devices, internet, and access across enormous regions. Replace with performance targets and tested conditions.
- Identify the standard/version and conformance goal, audit method, testing date, responsible owner, known issues, remediation plan, and enforcement/contact process. Accessibility values are not a substitute for measurable claims.

#### `start/faq`
- The FAQ claims source citation, peer review, moderator verification, page markers, high-stakes accuracy prioritization, legal/medical disclaimers on all relevant pages, screen-reader compatibility, semantic headings, alt text, minimal tracking, aggregate-only analytics, no ads/third-party trackers, and disabled-volunteer/shared governance practices that are not demonstrated and in several cases are contradicted by the audit. Remove or verify each operational claim before publication.
- It routes people in active crisis to local emergency services first and to nonexistent/broken crisis pages. Emergency services can create risks and are not the only first-line option; provide accurate country/context-specific routes and never point crisis users to missing pages.
- The privacy policy is explicitly “to be created,” yet the page makes privacy/data-use promises. Do not collect submissions or claim privacy practices without a current public policy explaining processors, forms, email, logs, analytics, retention, access, deletion, security, minors, international transfer, and incident response.
- “You don’t need a diagnosis, proof, or permission” is appropriate for reading the wiki or community identity but must not imply eligibility for benefits, accommodations, treatment, legal protections, or services.
- The wiki license claim, governance details, response paths, verification markers, and linked planned pages must be confirmed before readers rely on them.

#### `start/contribute`
- The page solicits disability, cultural, regional, Global South, Indigenous, LGBTQ+, and multiply marginalized lived experience through a Google form and Gmail account without a privacy notice, informed consent, data-minimization rules, retention/deletion policy, attribution options, licensing terms, security warning, minors policy, or explanation of who reviews submissions.
- Soliciting Indigenous knowledge requires community-specific authority, consent, attribution, stewardship, and restrictions on publication/reuse; an open external form is not an adequate protocol.
- “We’ll credit your contributions” and “you’ll have agency in your contributions” are undefined promises. Explain editing rights, license, anonymity/pseudonymity, withdrawal limits after publication, disputes, removal/correction requests, compensation, and editorial control.
- The page has inconsistent contact methods and a placeholder response time. Verify ownership and monitored capacity before inviting sensitive submissions.

#### `glossary/index`
- The page claims all pages meet accessibility standards/WCAG, information is accurate and verified, errors are corrected promptly, citations are included, content is updated, an editorial team reviews submissions, and the wiki is maintained by disabled volunteers. These are unverified governance and conformance claims contradicted by the audit.
- Contribution-form links are placeholders, while the page invites sensitive lived experience and Indigenous/community knowledge. Do not solicit submissions until a real intake, privacy, licensing, consent, moderation, and safeguarding process exists.
- “Disclosure: choice about when/if to disclose” is too absolute; disclosure/documentation can be required to request benefits, accommodations, services, insurance, licenses, or other determinations.
- The medical model is labeled simply “outdated,” while the social model is described as the foundation of modern theory. Present these as contested analytical frameworks, not an official hierarchy.

### 🟠 Important clarification

#### `glossary/editorial-guidelines`
- The guidelines are far too light for a wiki containing medical, legal, benefits, crisis, equipment-safety, child-safety, and abuse content. Add mandatory expert/primary-source review, jurisdiction/as-of dates, red-flag escalation, emergency language, evidence grading, conflict checks, and publication gates for high-stakes pages.
- “Prefer primary sources” incorrectly gives peer-reviewed studies as an example of primary authority alongside legislation. Define a source hierarchy by claim type: statutes/regulations/cases and official program materials for law/benefits; current clinical guidelines/regulators/systematic reviews for health; original datasets plus methodology for statistics; credible scholarship/archives for history.
- A fixed 12-month review is insufficient for rapidly changing high-stakes information. Define shorter event-triggered reviews and expiration/unpublish rules.
- Add privacy, defamation, living-person biography, diagnosis/identity labeling, Indigenous knowledge, minors, copyright, corrections/retractions, AI-generated content, translations, contributor consent, and records-management policies.

#### `glossary/citation-guide`
- The guide teaches formatting but not source reliability. Add claim-level inline citations, direct links, access/as-of dates, archival links, source hierarchy, quotation/page verification, jurisdiction, version, retraction/correction checks, and independent verification for high-stakes claims.
- It should warn that a citation does not make a claim accurate; contributors must represent the source faithfully, distinguish fact from inference/opinion/lived experience, avoid causal overstatement, and disclose uncertainty/conflicts.
- Opening external links in new tabs is not automatically more accessible and can disorient users. If used, it must be consistent and clearly announced; do not prescribe it casually.
- The sample WHO link/citation is old and potentially broken. Examples should be valid and complete.

#### `glossary/bibliography`
- This is a broad resource list, not evidence that individual wiki claims are sourced. Require page/claim-level citations rather than relying on a central bibliography.
- Links, laws, regulations, organizations, programs, academic programs, standards, and crisis resources require periodic verification and access dates. WCAG 2.1 is listed without acknowledging the current WCAG version or explaining which version applies to a claim.
- Legal sources need current/amended versions and jurisdictional context; crisis resources need availability, geography, privacy, accessibility, and emergency-limitations notes.
- “Credible, accessible, and relevant” is not a sufficient inclusion test. Add evidence quality, conflict, retraction, supersession, harmful-content, licensing, and maintenance criteria.

#### `glossary/terminology`
- The sample glossary is too sparse and presents contested definitions as settled. “Accessibility” does not guarantee the “same independence,” assistive technology is broader than tools that make impossible functions possible, and disability justice/independent living require attribution and regional context.
- Add citations, cross-references, usage notes, legal/clinical distinctions, region/language, historical terminology labels, and an update process.

#### `start/language-and-terminology`
- The guide turns preferences into universal good/bad rules. “Visually impaired,” “handicapped,” person-first language, “dependent,” and other terms may be preferred, legally required, historically quoted, or standard in some regions/communities. Ask and contextualize rather than declaring universal offense.
- “Cerebral palsy affecting cognition” is incorrectly placed as an example of intellectual/developmental disability; cerebral palsy is primarily a movement/posture condition and does not itself establish intellectual disability.
- “AAC users CAN communicate” is important, but presenting “can’t talk” as always wrong confuses speech with communication; some people do not speak. Use precise respectful language.
- The social-model definition is presented as the definition of disability and says bodies cannot change and should not have to. Bodies can change, and people may seek treatment; distinguish a model from universal fact.

#### `start/disability-culture--pride`
- The page makes broad cultural claims about Deaf, blind, neurodivergent, chronic-illness, Mad, Indigenous, Global South, and national disability cultures without sourcing or acknowledging substantial internal variation.
- “Access intimacy” is incorrectly reduced to a trusting relationship built through shared disability experience or personal care. Use the originator’s framing and do not make personal care a defining example without consent/boundary safeguards.
- Online community recommendations need the privacy, minors, grooming, scam, harassment, doxxing, and crisis safeguards identified elsewhere.
- “All entry points … are valid” needs the same distinction between personal exploration/community participation and formal diagnosis/eligibility claims.

#### `start/how-to-use`
- The page makes unsupported universal accessibility/browser claims, including compatibility with all versions of major browsers, all pages having proper headings/alt text/descriptive links, no keyboard traps, any-size zoom, optimized printing, and particular browser/screen-reader combinations being “best.” Replace with tested configurations, dates, limitations, and the accessibility statement.
- Many navigation and crisis links are broken, mismatched, planned, or point to pages absent from the repository. Conduct an automated and manual link audit before presenting this as the navigation authority.
- “Verified vs. Community Pages” describes indicators that do not appear to be implemented. Remove until a real publication-status system exists.
- External contribution forms need privacy/consent warnings and should not be the default route for reporting urgent harmful content or accessibility barriers.

#### `start/contact`
- Verify that all listed domain email addresses exist, are monitored, and have secure handling/retention procedures. The separate Gmail contribution address elsewhere creates confusion.
- Response-time promises, especially 24–48 hours for urgent accessibility issues, require actual staffing and an escalation process. Do not promise response times that cannot be reliably met.
- The crisis link appears absent from the repository. The contact page must not route urgent users to nonexistent resources and should clearly state that email is not monitored for emergencies.
- Add privacy, confidentiality limits, sensitive-information warning, minors policy, records retention, security, and reporting options for abuse/legal threats.

#### `glossary/how-to-contribute`
- The repository workflow omits licensing, contributor consent, privacy, living-person/diagnosis rules, Indigenous/community knowledge, conflicts, copyright, high-stakes review, source verification, and correction/withdrawal processes.
- “A moderator or co-editor will review” is an operational claim that needs a defined accountable review process before publication.
- Tell contributors not to submit private medical/legal records, identifying stories about others, or urgent crisis reports through pull requests.

### 🟡 Pass with minor notes

#### `glossary/acronyms`
- Pass as a stub. Add region, current official source, expansion/meaning distinctions, deprecated terms, and links; do not call WCAG simply a global standard without version/context.

#### `start/for-allies`
- Pass as a redirect stub. Verify the destination and remove duplicate pages from navigation/audit counts.


## Full audit expansion — batch 28 (7 pages)

Pages audited:
- `accessibility-statement`
- `Healthcare`
- `start/disability-models`
- `start/what-is-disability`
- `Rights/North-America/US/Fair-Housing`
- `Rights/Overview`
- `Rights/North-America/US/ADA`

**Progress:** 278 of 278 pages audited; full audit complete.

### 🟠 Important clarification

#### Published duplicate/redirect stubs
- These pages are not true HTTP redirects; they are separately published content pages containing a link to a canonical page. Readers, search engines, internal search, analytics, and external citations may continue to land on the duplicate URL. Implement real redirects or unpublish/exclude the stubs after confirming route behavior.
- The uppercase/case-variant `Rights/...` and `Healthcare` paths create inconsistent URL conventions and may behave differently across filesystems, hosting, Wiki.js routing, link checkers, and search engines. Canonicalize path casing and test production routes.
- Several stubs have blank meta descriptions, while `start/what-is-disability` retains a substantive description that can make the duplicate appear canonical in search results. Add consistent redirect/noindex metadata or remove duplicate publication.
- `Rights/North-America/US/ADA` misspells “Disabilities” as “Disabilties” in both title and heading, harming search and credibility.
- “Previous content is preserved in the site’s git history and local backups” is an internal operational claim exposed to readers and may become false as retention practices change. Remove it from public-facing stubs or document the retention policy.
- Verify every canonical destination in production and add automated checks that prevent redirect targets from disappearing or redirect loops from forming.

### 🟡 Pass with minor notes

#### Individual targets
- `accessibility-statement` points to `/start/accessibility-statement`, but the canonical page contains the serious unverified conformance claims recorded in batch 27.
- `Healthcare` points to `/healthcare/index`; target exists.
- `start/disability-models` points to `/foundations/disability-models`; target exists.
- `start/what-is-disability` points to `/foundations/what-is-disability`; target exists.
- `Rights/North-America/US/Fair-Housing` points to `/rights/us/fair-housing-act`; target exists.
- `Rights/Overview` points to `/rights/index`; target exists.
- `Rights/North-America/US/ADA` points to `/rights/us/ada`; target exists.

## Targeted post-completion audit — batch 29 (8 pages)

Pages audited:
- `community/disability-specific-peer-groups`
- `es/community/disability-specific-peer-groups`
- `foundations/epistemic-injustice`
- `es/foundations/epistemic-injustice`
- `foundations/language-terminology-identity`
- `es/foundations/language-terminology-identity`
- `daily-living/mobility-aid-stigma`
- `es/daily-living/mobility-aid-stigma`

**Scope:** Targeted post-completion review of organization superlatives, the Miranda Fricker attribution, community-norm/framing claims, and translation parity. The full-audit count remains 278 of 278 pages.

### 🔴 Correct immediately

#### `community/disability-specific-peer-groups` and `es/community/disability-specific-peer-groups`
- The objective claim that NAD is “the largest Deaf-led civil rights organization in the US” / “la mayor organización…” is not supported by NAD’s current About Us page, which calls NAD the nation’s “premier” civil-rights organization of, by, and for deaf and hard-of-hearing people. No comparative membership, revenue, reach, or other methodology is given for “largest.” Replace it with a sourced factual description or clearly attribute NAD’s own current self-description.
- The claim that CommunicationFIRST is “the only US nonprofit led by and for people who rely on AAC” / “la única organización sin fines de lucro…” is broader than the organization’s own current claims. CommunicationFIRST describes itself as the only nonprofit dedicated to protecting the civil rights of people in the United States who cannot rely on speech alone, and elsewhere as the only civil-rights organization led by and for that population. “People who rely on AAC,” “nonprofit,” and “led by and for” are not interchangeable scopes. Attribute the claim to CommunicationFIRST, preserve its exact scope, add an as-of date, or remove “only.”
- Both English superlatives are reproduced as unqualified facts in Spanish. Translation does not cure the sourcing problem; any hedge, attribution, scope, and as-of date must be carried into both versions.

### 🟠 Important clarification

#### `foundations/epistemic-injustice` and `es/foundations/epistemic-injustice`
- The Miranda Fricker (2007) attribution is confirmed: Oxford University Press published *Epistemic Injustice: Power and the Ethics of Knowing* on June 1, 2007, and the book treats testimonial injustice and hermeneutical injustice as its two central forms. Add a direct citation rather than leaving the parenthetical year unsupported.
- The page’s definition of hermeneutical injustice is too broad when it treats concepts that merely “do not exist yet or are not widely known” as sufficient. In Fricker’s account, the interpretive gap is an injustice because prejudicial structural conditions and hermeneutical marginalization place someone at an unfair disadvantage. Preserve that causal element in both languages.
- The disability applications, examples, and claims that the framework is widely used by disability scholars and activists require disability-specific sources. Do not imply that Fricker’s original book itself established every listed disability example or that any unfamiliar vocabulary automatically constitutes hermeneutical injustice.

#### `foundations/language-terminology-identity` and `es/foundations/language-terminology-identity`
- The pages appropriately acknowledge individual and regional variation, but still make many uncited collective-preference claims: which communities strongly prefer identity-first language, which terms are widely reclaimed or criticized, what major disabled-led organizations use, and which words reliably track harmful assumptions. Source and date these claims, attribute them to named communities or style guides, and avoid converting a common preference into a universal rule.
- The Spanish page adds a broad unsupported claim that “personas con discapacidad” is the most recognized and respected formula across the Spanish-speaking sphere. Spanish disability language varies substantially by country, community, legal context, and individual preference; this needs regionally diverse Spanish-language sourcing or a narrower formulation.
- Reclaimed or derogatory English terms do not map cleanly across languages. Phrases such as “tiempo lisiado” and the Spanish list of casual insults need review by disabled Spanish-speaking editors across regions, with context explaining that reclamation, severity, and ordinary usage may differ from English.

#### `daily-living/mobility-aid-stigma` and `es/daily-living/mobility-aid-stigma`
- The affirming community framing is reasonable, but empirical claims such as ambulatory wheelchair use being “common,” the “dominant story,” what causes public reactions, and what “many disabled people” report are uncited. Mark lived-experience/editorial framing as such or add evidence; do not present broad cultural explanations as settled fact.
- “Mobility aids are freedom” is a valuable corrective to stigma, but the pages should not imply that every aid automatically increases range, energy, or independence for every user. Device choice, fit, training, environment, cost, and safety are individualized; add a brief practical caveat without undermining part-time or ambulatory use.
- The Spanish heading “Apropiación y vigilancia” does not accurately convey the English point that strangers feel *entitled* to disabled people’s bodies and equipment; “apropiación” instead suggests appropriation or taking possession. Review this and region-specific equipment terms such as “andador con asiento” with disabled Spanish-speaking editors.

### Verification sources consulted
- NAD, “About Us”: https://www.nad.org/about-us
- CommunicationFIRST, homepage and “About Us”: https://communicationfirst.org/ and https://communicationfirst.org/aboutus/
- Oxford Academic, Miranda Fricker, *Epistemic Injustice: Power and the Ethics of Knowing* (published June 1, 2007): https://academic.oup.com/book/doi/10.1093/acprof:oso/9780198237907.001.0001
- National Center on Disability and Journalism, “Disability Language Style Guide”: https://ncdj.org/style-guide/
