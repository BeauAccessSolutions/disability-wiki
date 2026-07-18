/*
 * Validate the GENERATED dist/sw.js against the offline-navigation contract.
 *
 * Why this exists: `npm run build` runs gen-sw.mjs, but running a generator
 * asserts nothing. The two bugs this guards against both passed local preview
 * and failed only in production, silently, for offline users of a life-safety
 * wiki:
 *
 *   1. Non-canonical precache URLs. Cloudflare Pages 308s `/page.html` -> `/page`
 *      and `/x` -> `/x/` (astro preview does neither). Precaching a non-canonical
 *      URL stores a redirect-tainted response.
 *   2. Caching a redirected response. Browsers refuse to serve a response with
 *      `redirected: true` to a navigation, so the offline fallback silently
 *      fails even though the cache "has" the page.
 *
 * The redirect check below EXECUTES the generated service worker against stub
 * caches/fetch rather than grepping it for `response.redirected` — a grep would
 * pass on code that computes the rewrap and then caches the original.
 *
 * Run: node tools/check-sw.mjs   (after npm run build)
 */

import { readFileSync, existsSync } from 'node:fs';
import { strict as assert } from 'node:assert';
import vm from 'node:vm';

const SW_PATH = new URL('../dist/sw.js', import.meta.url).pathname;
assert.ok(existsSync(SW_PATH), `dist/sw.js missing — run \`npm run build\` first (${SW_PATH})`);
const source = readFileSync(SW_PATH, 'utf8');

let failures = 0;
function check(name, fn) {
  try {
    fn();
    console.log(`  ok   - ${name}`);
  } catch (e) {
    console.error(`  FAIL - ${name}\n         ${e.message}`);
    failures++;
  }
}

// ------------------------------------------------------------ load the SW

const ORIGIN = 'https://disabilitywiki.example';
const listeners = {};
const store = new Map(); // key: url string -> response-ish

const cacheStub = {
  async match(request, _opts) {
    const key = typeof request === 'string' ? request : request.url;
    return store.get(key) || store.get(new URL(key, ORIGIN).pathname);
  },
  async put(request, response) {
    const key = typeof request === 'string' ? request : request.url;
    store.set(key, response);
  },
  async addAll(urls) {
    for (const u of urls) store.set(u, { ok: true, redirected: false });
  },
};

let fetchImpl = async () => {
  throw new Error('offline');
};

const context = {
  self: {
    addEventListener: (type, fn) => {
      listeners[type] = fn;
    },
    skipWaiting: async () => {},
    clients: { claim: async () => {} },
  },
  caches: {
    open: async () => cacheStub,
    keys: async () => [],
    delete: async () => true,
  },
  location: { origin: ORIGIN },
  fetch: (...args) => fetchImpl(...args),
  Response,
  Headers,
  Blob,
  URL,
  AbortController,
  setTimeout,
  clearTimeout,
  console,
};
vm.createContext(context);
vm.runInContext(source, context);

// Recover PRECACHE from the executed module rather than re-parsing the file.
// Copy into a host array: values built inside a vm context carry that realm's
// prototypes, and assert's strict deepEqual compares prototypes — so even
// `[]` vs `[]` fails across the boundary.
const PRECACHE = [...vm.runInContext('PRECACHE', context)];
const CACHE = vm.runInContext('CACHE', context);

// ------------------------------------------------------- static invariants

check('the service worker registers install, activate and fetch handlers', () => {
  for (const type of ['install', 'activate', 'fetch']) {
    assert.ok(listeners[type], `no ${type} listener registered`);
  }
});

check('PRECACHE is non-empty and includes the offline fallback + crisis pages', () => {
  // Anti-vacuity: every URL assertion below is trivially true on an empty list.
  assert.ok(Array.isArray(PRECACHE) && PRECACHE.length > 0, 'PRECACHE is empty');
  assert.ok(PRECACHE.includes('/offline/'), 'offline fallback must be precached, in directory form');
  const crisis = PRECACHE.filter((u) => u.startsWith('/crisis/'));
  assert.ok(crisis.length > 0, 'no /crisis/ pages precached — the offline path is for exactly these');
  assert.ok(
    PRECACHE.some((u) => u.startsWith('/es/crisis/')),
    'no /es/crisis/ pages precached — the Spanish crisis pages must work offline too'
  );
  assert.ok(typeof CACHE === 'string' && CACHE.startsWith('dw-'), 'cache name must be content-versioned');
});

check('every precached page URL is canonical (trailing slash, never .html)', () => {
  const bareHtml = PRECACHE.filter((u) => u.endsWith('.html'));
  assert.deepEqual(bareHtml, [], `Pages 308s .html URLs; these would cache a redirect: ${bareHtml.join(', ')}`);

  // Assets (/_astro/*, manifest, icons) are files, not navigations — only page
  // URLs need the trailing slash. A page URL is anything not carrying a file
  // extension in its last segment.
  const pages = PRECACHE.filter((u) => !/\.[a-z0-9]+$/i.test(u.split('/').pop() || ''));
  const nonCanonical = pages.filter((u) => !u.endsWith('/'));
  assert.deepEqual(
    nonCanonical,
    [],
    `Pages 308s /x -> /x/; these would cache a redirect: ${nonCanonical.join(', ')}`
  );
});

// -------------------------------------------------- behavioural: no redirect
// taint in the cache

const navRequest = (url) => ({ url, method: 'GET', mode: 'navigate' });

async function drive(request) {
  const handler = listeners.fetch;
  let promise;
  handler({ request, respondWith: (p) => (promise = p) });
  return promise === undefined ? undefined : promise;
}

async function behavioural() {
  // A response that came back through a 308, as Pages serves it.
  const redirectedResponse = {
    ok: true,
    status: 200,
    statusText: 'OK',
    redirected: true,
    headers: new Headers({ 'content-type': 'text/html' }),
    clone() {
      return { blob: async () => new Blob(['<html>crisis</html>'], { type: 'text/html' }) };
    },
  };

  store.clear();
  fetchImpl = async () => redirectedResponse;
  const url = `${ORIGIN}/crisis/suicide/`;
  await drive(navRequest(url));

  const cached = store.get(url);
  check('a redirected navigation response is rewrapped before caching', () => {
    assert.ok(cached, 'the page was not cached at all');
    assert.equal(
      cached.redirected,
      false,
      'cached a response with redirected=true — browsers refuse to serve these to a navigation, ' +
        'so the offline fallback would silently fail in production only'
    );
  });

  check('the rewrapped response keeps status and body intact', async () => {
    assert.equal(cached.status, 200);
  });
  if (cached && typeof cached.text === 'function') {
    const body = await cached.text();
    check('the rewrapped response preserves the page body', () => {
      assert.match(body, /crisis/, 'rewrapping must not drop the body');
    });
  }

  // A normal (non-redirected) response must still be cached.
  store.clear();
  fetchImpl = async () => new Response('<html>ok</html>', { status: 200, headers: { 'content-type': 'text/html' } });
  const url2 = `${ORIGIN}/crisis/overdose/`;
  await drive(navRequest(url2));
  check('a normal navigation response is still cached (offline fallback stays populated)', () => {
    assert.ok(store.get(url2), 'nothing cached for a clean 200 — offline would have no page to serve');
  });
}

await behavioural();

console.log(
  `\nsw.js: ${PRECACHE.length} precached URLs checked${failures ? ` — ${failures} FAILED` : ' — all checks passed'}`
);
if (failures > 0) process.exitCode = 1;
