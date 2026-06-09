#!/usr/bin/env python3
"""Publish one or more markdown files to the wiki DB via the Wiki.js GraphQL API.

WHY: Wiki.js force-`sync` does NOT reliably import file changes into the DB — it
pulls the commits (the server's `.md` files are correct) but can skip *new* files
(page 404s) and leave *modified* files showing stale content. This pushes a file's
on-disk content straight into the DB: `pages.create` if the page doesn't exist yet,
`pages.update` (resend all fields) if it does. Avoids `importAll` (which re-publishes
everything you'd unpublished). See the disability-wiki-edit skill.

USAGE
-----
    python3 scripts/publish_page.py media/foo.md es/media/foo.md ...
    python3 scripts/publish_page.py --dry-run <files>      # show create-vs-update, no writes

Path/locale are derived from the file path: `es/<p>.md` -> locale=es, path=<p>;
anything else -> locale=en, path=<file without .md>. A trailing `/index` is stripped
(`crisis/index.md` -> path `crisis`). Token: $WIKIJS_TOKEN else /tmp/wjs.txt.
"""
import json, os, re, sys, urllib.request

API = 'https://disabilitywiki.org/graphql'
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124.0 Safari/537.36'
DRY = '--dry-run' in sys.argv
files = [a for a in sys.argv[1:] if not a.startswith('--')]

def token():
    t = os.environ.get('WIKIJS_TOKEN')
    return t.strip() if t else open('/tmp/wjs.txt').read().strip()

def gql(q, v=None):
    body = json.dumps({'query': q, 'variables': v or {}}).encode()
    req = urllib.request.Request(API, body, {
        'Authorization': 'Bearer ' + token(), 'Content-Type': 'application/json', 'User-Agent': UA})
    return json.load(urllib.request.urlopen(req))

def locale_path(f):
    p = f[3:] if f.startswith('es/') else f
    loc = 'es' if f.startswith('es/') else 'en'
    if p.endswith('.md'):
        p = p[:-3]
    # NOTE: Wiki.js keeps index pages at their full path (`crisis/index`,
    # `media/index`) — do NOT strip `/index`.
    return loc, p

def parse(f):
    raw = open(f, encoding='utf-8').read()
    m = re.match(r'^---\n(.*?)\n---\n(.*)$', raw, re.S)
    if not m:
        raise SystemExit(f'{f}: no frontmatter')
    fm, body = m.group(1), m.group(2).lstrip('\n')
    def field(name):
        # [ \t]* (not \s*) so an empty value doesn't let .* swallow the next line
        mm = re.search(rf'^{name}:[ \t]*(.*)$', fm, re.M)
        return mm.group(1).strip() if mm else ''
    title, desc = field('title'), field('description')
    # tags: YAML list OR inline comma
    tags = []
    block = re.search(r'^tags:\s*\n((?:\s*-\s*.+\n?)+)', fm, re.M)
    if block:
        tags = [t.strip() for t in re.findall(r'^\s*-\s*(.+)$', block.group(1), re.M)]
    else:
        inline = field('tags')
        if inline:
            tags = [t.strip() for t in inline.split(',') if t.strip()]
    pub = field('published').lower() != 'false'
    return title, desc, tags, body, pub

LIST = '{ pages { list { id path locale } } }'
SINGLE = '''query($id:Int!){ pages{ single(id:$id){ editor isPrivate scriptCss scriptJs } } }'''
CREATE = '''mutation($content:String!,$description:String!,$editor:String!,$isPublished:Boolean!,
  $isPrivate:Boolean!,$locale:String!,$path:String!,$tags:[String]!,$title:String!){
  pages{ create(content:$content,description:$description,editor:$editor,isPublished:$isPublished,
    isPrivate:$isPrivate,locale:$locale,path:$path,tags:$tags,title:$title){
    responseResult{ succeeded message } page{ id } }}}'''
UPDATE = '''mutation($id:Int!,$content:String!,$description:String!,$editor:String!,
  $isPublished:Boolean!,$isPrivate:Boolean!,$locale:String!,$path:String!,
  $tags:[String]!,$title:String!,$scriptCss:String,$scriptJs:String){
  pages{ update(id:$id,content:$content,description:$description,editor:$editor,
    isPublished:$isPublished,isPrivate:$isPrivate,locale:$locale,path:$path,
    tags:$tags,title:$title,scriptCss:$scriptCss,scriptJs:$scriptJs){
    responseResult{ succeeded message } }}}'''

if not files:
    raise SystemExit('usage: publish_page.py [--dry-run] <file.md> ...')

existing = {(p['locale'], p['path']): p['id'] for p in gql(LIST)['data']['pages']['list']}
for f in files:
    loc, path = locale_path(f)
    title, desc, tags, body, pub = parse(f)
    pid = existing.get((loc, path))
    action = 'UPDATE' if pid else 'CREATE'
    if DRY:
        print(f'  [{action}] {loc}:{path}  (id {pid})  title={title!r} tags={tags}')
        continue
    if pid:
        meta = gql(SINGLE, {'id': pid})['data']['pages']['single']
        v = {'id': pid, 'content': body, 'description': desc, 'editor': meta['editor'] or 'markdown',
             'isPublished': pub, 'isPrivate': meta['isPrivate'], 'locale': loc, 'path': path,
             'tags': tags, 'title': title, 'scriptCss': meta['scriptCss'], 'scriptJs': meta['scriptJs']}
        r = gql(UPDATE, v)['data']['pages']['update']['responseResult']
    else:
        v = {'content': body, 'description': desc, 'editor': 'markdown', 'isPublished': pub,
             'isPrivate': False, 'locale': loc, 'path': path, 'tags': tags, 'title': title}
        r = gql(CREATE, v)['data']['pages']['create']['responseResult']
    print(f'  {"OK  " if r["succeeded"] else "FAIL"} [{action}] {loc}:{path} :: {r["message"]}')
