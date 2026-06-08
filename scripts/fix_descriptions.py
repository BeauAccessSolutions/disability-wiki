#!/usr/bin/env python3
"""
Meta-description fixer for the disability wiki.

Re-derives clean meta descriptions for PUBLISHED English pages whose current
description is bad (truncated mid-sentence, ends with a colon, a copied
boilerplate/duplicate, a placeholder, too short, or missing). Leaves good
descriptions untouched.

Rules for a generated description:
  - Built from the page's first real intro prose (skips the H1, blockquotes,
    lists, tables, and the "short version" callout).
  - Whole sentences only, never cut mid-sentence; <= MAX_LEN chars.
  - Never ends with a colon.
  - Deduplicated: if two pages would get the same text, the later one is
    extended with its next sentence to differentiate (logged if still dup).

Scope: repo-root content only. Skips es/ (own sync workflow), backups/,
.claude/, docs/, node_modules/, .git/. Only touches `published: true` pages.

Usage:
  python3 scripts/fix_descriptions.py            # dry-run: writes a report
  python3 scripts/fix_descriptions.py --apply     # rewrite the files
"""
import re, sys, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAX_LEN = 158
APPLY = '--apply' in sys.argv
LANG = 'es' if '--es' in sys.argv else 'en'

# In English mode, scan repo-root content and skip es/. In Spanish mode, scan ONLY es/.
SKIP_PREFIXES = ('es/', 'backups/', '.claude/', 'docs/', 'node_modules/', '.git/', 'scripts/')


def is_content(rel: str) -> bool:
    if LANG == 'es':
        return rel.startswith('es/')
    return not any(rel.startswith(x) for x in SKIP_PREFIXES)


def split_doc(text):
    """Return (frontmatter_lines, body) or (None, None)."""
    if not text.startswith('---'):
        return None, None
    parts = text.split('---', 2)
    if len(parts) < 3:
        return None, None
    return parts[1], parts[2]


def fm_get(fm_text, key):
    for line in fm_text.split('\n'):
        if line.startswith(key + ':'):
            return line.split(':', 1)[1].strip()
    return None


def clean_inline(s):
    s = re.sub(r'!\[([^\]]*)\]\([^\)]+\)', '', s)          # images
    s = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', s)         # links -> text
    s = re.sub(r'\[\[([^\]|]+\|)?([^\]]+)\]\]', r'\2', s)   # wikilinks
    s = re.sub(r'[*_]{1,3}([^*_]+)[*_]{1,3}', r'\1', s)     # bold/italic
    s = re.sub(r'`([^`]+)`', r'\1', s)                      # code
    s = s.replace('—', '—')
    return ' '.join(s.split())


STOPWORDS_END_EN = {'in', 'and', 'the', 'to', 'of', 'a', 'for', 'with', 'by',
                    'that', 'is', 'are', 'or', 'as', 'at', 'on', 'an', 'their',
                    'this', 'including', 'such'}
STOPWORDS_END_ES = {'de', 'la', 'el', 'los', 'las', 'y', 'o', 'a', 'en', 'que',
                    'con', 'para', 'un', 'una', 'del', 'al', 'su', 'sus', 'por',
                    'como', 'se', 'lo', 'es', 'son', 'e', 'u', 'tu', 'sobre'}
STOPWORDS_END = STOPWORDS_END_ES if LANG == 'es' else STOPWORDS_END_EN


def intro_sentences(body):
    """Yield cleaned sentences from the first real prose paragraphs."""
    paras = []
    for block in body.split('\n\n'):
        b = block.strip()
        if not b:
            continue
        first = b.lstrip()[:1]
        if first in ('#', '>', '|', '-', '*'):      # heading/quote/table/list
            continue
        if re.match(r'^\d+\.\s', b):                 # numbered list
            continue
        if b.startswith('---'):
            continue
        c = clean_inline(b)
        if c.endswith(':'):          # list lead-in — makes a poor description
            continue
        if len(c) > 40:
            paras.append(c)
        if len(paras) >= 5:
            break
    text = ' '.join(paras)
    return re.split(r'(?<=[.!?])\s+', text) if text else []


BOILERPLATE_EN = re.compile(
    r"^(all (disabled people|people with disabilities|people|deaf|states parties)\b"
    r"|this page (centers|is informed by|complements|discusses|addresses|explains|walks|offers|covers|provides|helps)"
    r"|⚠️|content note|trigger warning"
    r"|you don't have to read everything"
    r"|crisis lines help you get through"
    r"|if this is overwhelming"
    r"|help is available)",
    re.IGNORECASE)

BOILERPLATE_ES = re.compile(
    r"^(tod[oa]s? (las personas|los? )?(con discapacidad|las personas con discapacidad)\b"
    r"|tod[oa]s? las personas (con discapacidad|tienen|sordas)\b"
    r"|tod[oa]s? los estados partes\b"
    r"|esta página (pone en el centro|se basa|complementa|aborda|explica|ofrece|cubre|trata|brinda|te ayuda)"
    r"|⚠️|nota de contenido|advertencia"
    r"|no tienes que leer todo"
    r"|si esto te resulta abrumador|si estás en crisis|hay ayuda disponible"
    r"|¿tienes experiencia vivida)",
    re.IGNORECASE)

BOILERPLATE = BOILERPLATE_ES if LANG == 'es' else BOILERPLATE_EN


def is_boilerplate(sentence):
    return bool(BOILERPLATE.match(sentence.strip()))


def _word_truncate(s, max_len):
    s = s[:max_len].rsplit(' ', 1)[0].rstrip(',;:.—-')
    words = s.split()
    while words and words[-1].lower() in STOPWORDS_END:
        words.pop()
    return (' '.join(words) + '…') if words else ''


def build(sentences, skip=0, max_len=MAX_LEN):
    """Greedily join whole sentences <= max_len, starting after `skip` of them."""
    sents = [s.strip() for s in sentences[skip:] if s.strip()]
    out = ''
    for i, sent in enumerate(sents):
        candidate = (out + ' ' + sent).strip() if out else sent
        if len(candidate) <= max_len:
            out = candidate
        elif out and len(out) < 80:
            # a too-terse lead sentence reads poorly alone; pull the next one
            # in, word-truncating if it overflows
            out = candidate if len(candidate) <= max_len + 27 else _word_truncate(candidate, max_len)
            break
        else:
            break
    if out.endswith(':'):
        trimmed = re.split(r'(?<=[.!?])\s+', out)
        out = ' '.join(trimmed[:-1]).strip() if len(trimmed) > 1 else out
    # first sentence alone exceeds max_len
    if not out and sents:
        first = sents[0]
        # accept a slightly-long *complete* sentence rather than chop it
        if first[-1:] in '.!?' and len(first) <= max_len + 22:
            out = first
        else:
            out = _word_truncate(first, max_len)
    return out


def is_bad(desc):
    if not desc:
        return 'missing'
    if desc.endswith('…') or desc.endswith('...'):
        return 'truncated'
    if desc.endswith(':'):
        return 'colon'
    if re.search(r'\[DATE\]|\[Archive|\[FECHA\]|Comprehensive guide to|Guía completa', desc):
        return 'placeholder'
    if len(desc) < 50:
        return 'short'
    return None


def main():
    files = sorted(p for p in ROOT.glob('**/*.md')
                   if is_content(str(p.relative_to(ROOT))))
    records = []
    desc_owners = {}  # current desc text -> list of paths (for dup detection)
    for p in files:
        text = p.read_text(encoding='utf-8', errors='replace')
        fm, body = split_doc(text)
        if fm is None:
            continue
        if fm_get(fm, 'published') != 'true':
            continue
        desc = fm_get(fm, 'description') or ''
        records.append([p, fm, body, desc])
        desc_owners.setdefault(desc, []).append(p)

    dup_paths = {pp for d, ps in desc_owners.items() if d and len(ps) > 1 for pp in ps}

    assigned = {}   # path -> new desc
    used_texts = set()
    report = []
    for p, fm, body, desc in records:
        reason = is_bad(desc)
        if reason is None and p not in dup_paths:
            used_texts.add(desc)   # keep good unique ones reserved
            continue
        reason = reason or 'duplicate'
        title = (fm_get(fm, 'title') or p.stem.replace('-', ' ')).strip()
        sents = intro_sentences(body)
        # prefer page-specific sentences (drop the house-formula boilerplate)
        specific = [s for s in sents if not is_boilerplate(s)]
        new = build(specific) or build(sents)
        # if it collides, cascade: skip leading sentences, then a
        # title-anchored fallback — so duplicates become page-specific
        if new in used_texts or not new:
            for pool in (specific, sents):
                for sk in (1, 2, 3):
                    cand = build(pool, skip=sk)
                    if cand and cand not in used_texts:
                        new = cand
                        break
                if new and new not in used_texts:
                    break
        if (new in used_texts or not new) and title:
            if LANG == 'es':
                fallback = f"{title}: orientación, derechos y recursos para la comunidad de la discapacidad."
            else:
                fallback = f"{title}: guidance, rights, and resources for the disability community."
            if fallback not in used_texts:
                new = fallback
        status = 'OK'
        if not new:
            status = 'NO-INTRO (left unchanged)'
        elif new in used_texts:
            status = 'STILL-DUP'
        if new:
            assigned[p] = new
            used_texts.add(new)
        report.append((str(p.relative_to(ROOT)), reason, status, desc, new))

    # write report
    rep_path = ROOT / 'description_fix_report.txt'
    with rep_path.open('w', encoding='utf-8') as f:
        f.write(f"Pages scanned (published): {len(records)}\n")
        f.write(f"Pages to rewrite: {len(assigned)}\n")
        from collections import Counter
        by_reason = Counter(r[1] for r in report)
        f.write(f"By reason: {dict(by_reason)}\n")
        still = [r for r in report if r[2] != 'OK']
        f.write(f"Needs attention: {len(still)}\n\n")
        for rel, reason, status, old, new in report:
            f.write(f"[{reason}] {rel}\n  OLD: {old}\n  NEW: {new}  <{len(new)}ch> {status}\n\n")
    print(f"scanned={len(records)} rewrite={len(assigned)} by_reason={dict(__import__('collections').Counter(r[1] for r in report))}")
    print(f"needs-attention (no-intro/still-dup): {len([r for r in report if r[2] != 'OK'])}")
    print(f"report -> {rep_path}")

    if APPLY:
        n = 0
        for p, new in assigned.items():
            text = p.read_text(encoding='utf-8')
            parts = text.split('---', 2)
            fm_lines = parts[1].split('\n')
            has_desc = any(l.startswith('description:') for l in fm_lines)
            out_lines, done = [], False
            for line in fm_lines:
                if line.startswith('description:'):
                    # replace the FIRST existing description; drop any others
                    if not done:
                        out_lines.append(f'description: {new}')
                        done = True
                    continue
                out_lines.append(line)
                # only insert after title when there is no description line at all
                if line.startswith('title:') and not has_desc and not done:
                    out_lines.append(f'description: {new}')
                    done = True
            if not done:
                out_lines.append(f'description: {new}')
            p.write_text(f"---{chr(10).join(out_lines)}---{parts[2]}", encoding='utf-8')
            n += 1
        print(f"APPLIED to {n} files")


if __name__ == '__main__':
    main()
