#!/usr/bin/env python3
"""
pin_anchors.py — make in-page anchor links work in translated es/ pages.

Problem: a Spanish page's manual TOC links to English-slug anchors (e.g.
`[Estados Unidos](#united-states)`), but Wiki.js generates heading IDs from the
*translated* heading text (`## Estados Unidos` -> `#estados-unidos`), so the link
breaks. Wiki.js enables markdown-it-attrs, so we can pin an explicit ID on the
Spanish heading: `## Estados Unidos {#united-states}` — and the existing
English-named anchors (intra-page AND cross-page) resolve again.

Method (no slug guessing on the link side — the English file is ground truth):
  - Pair EN and ES headings positionally (abort if counts differ — safety).
  - For each EN heading whose slug is used as an anchor target on the ES page,
    append `{#<en-slug>}` to the corresponding ES heading.
  - Self-check: every anchor target on the page must be reproduced by some EN
    heading slug; otherwise report it (likely a cross-page or section target) so
    a human can look.

Idempotent: headings that already carry a `{#id}` are left alone.

Usage:
  python pin_anchors.py <en_source.md> <es_target.md>           # dry run
  python pin_anchors.py --apply <en_source.md> <es_target.md>   # write changes
"""
import re
import sys
import unicodedata

HEAD_RE = re.compile(r'^(#{1,6})\s+(.*?)\s*$')
EXISTING_ID_RE = re.compile(r'\s*\{#[^}]+\}\s*$')
LINK_TARGET_RE = re.compile(r'\]\(#([^)]+)\)')


def _base(text):
    t = text.strip().lower()
    return re.sub(r'[*`]', '', t)  # drop emphasis/code marks


def slugify(text):
    """ASCII slug: transliterate accents (ó->o), drop other punct, each space
    -> one hyphen (NO collapsing — '&' leaves a double hyphen, like Wiki.js)."""
    t = _base(text)
    t = unicodedata.normalize('NFKD', t).encode('ascii', 'ignore').decode()
    t = re.sub(r'[^a-z0-9\s-]', '', t)
    return re.sub(r'\s', '-', t).strip('-')


def slugify_keep(text):
    """Accent-preserving variant (some agents kept accents in the anchor)."""
    t = _base(text)
    t = re.sub(r'[^\w\s-]', '', t, flags=re.UNICODE)
    return re.sub(r'\s', '-', t).strip('-')


def _dedup(slugs):
    """Replicate markdown-it-anchor duplicate handling: 2nd+ identical slug
    gets -1, -2, ... appended."""
    seen, out = {}, []
    for s in slugs:
        if s in seen:
            seen[s] += 1
            out.append(f'{s}-{seen[s]}')
        else:
            seen[s] = 0
            out.append(s)
    return out


def headings(lines):
    """Return list of (line_index, level, text_without_id, has_existing_id)."""
    out, fence = [], False
    for i, l in enumerate(lines):
        if l.lstrip().startswith('```'):
            fence = not fence
        if fence:
            continue
        m = HEAD_RE.match(l)
        if m:
            raw = m.group(2)
            has_id = EXISTING_ID_RE.search(raw) is not None
            text = EXISTING_ID_RE.sub('', raw).strip()
            out.append((i, len(m.group(1)), text, has_id))
    return out


def process(en_path, es_path, apply=False):
    en = open(en_path, encoding='utf-8').read().splitlines()
    es = open(es_path, encoding='utf-8').read().splitlines()
    targets = set(LINK_TARGET_RE.findall('\n'.join(es)))
    if not targets:
        return f'{es_path}: no in-page anchor targets — skip'

    en_h, es_h = headings(en), headings(es)
    if len(en_h) != len(es_h):
        return (f'{es_path}: SKIP — heading count mismatch '
                f'(EN {len(en_h)} vs ES {len(es_h)}); handle manually')

    # Deduped slug lists (computed over all headings, in document order, so the
    # -1/-2 suffixes line up with how Wiki.js numbers duplicate headings).
    en_ascii = _dedup([slugify(t) for _, _, t, _ in en_h])
    es_keep = _dedup([slugify_keep(t) for _, _, t, _ in es_h])
    es_ascii = _dedup([slugify(t) for _, _, t, _ in es_h])

    pinnable = set()
    pins = []
    for idx, (es_i, lvl, es_text, has_id) in enumerate(es_h):
        # Pin the FIRST candidate that is an actual anchor target on this page —
        # i.e. the literal id the link already uses, onto the heading whose own
        # slug equals it. Cannot mis-route by construction.
        chosen = next((c for c in (en_ascii[idx], es_keep[idx], es_ascii[idx])
                       if c in targets), None)
        if chosen:
            pinnable.add(chosen)
            if not has_id:
                es[es_i] = es[es_i].rstrip() + f' {{#{chosen}}}'
                pins.append((chosen, es_text))

    unmatched = sorted(targets - pinnable)

    if apply and pins:
        open(es_path, 'w', encoding='utf-8').write('\n'.join(es) + '\n')

    status = 'APPLIED' if (apply and pins) else 'dry-run'
    lines = [f'{es_path}: {status} — {len(pins)} id(s) pinned, '
             f'{len(targets)} targets, heads EN/ES {len(en_h)}/{len(es_h)}']
    for sl, txt in pins[:6]:
        lines.append(f'    + {{#{sl}}} -> "{txt}"')
    if len(pins) > 6:
        lines.append(f'    ... +{len(pins)-6} more')
    if unmatched:
        lines.append(f'    ! targets not matched to a heading (check): {unmatched}')
    return '\n'.join(lines)


def main():
    args = sys.argv[1:]
    apply = '--apply' in args
    args = [a for a in args if a != '--apply']
    if len(args) != 2:
        print(__doc__)
        return 1
    print(process(args[0], args[1], apply=apply))
    return 0


if __name__ == '__main__':
    sys.exit(main())
