// Rewrite the bundled /contribute page into a safe hand-off, run by
// build-release.sh AFTER `cap copy` and BEFORE verify-bundle.
//
// Why: the web contribute page has two <form>s that POST to a RELATIVE
// /api/contributions Pages Function. On the web that's fine. In the app the
// origin is capacitor://localhost, so the POST targets a route that doesn't
// exist in the bundle — WikiRouter serves the 404 page, a full navigation that
// throws away whatever the user typed. Contribution also depends on the
// deferred identity build, so there is nothing to submit to yet anyway.
//
// So in the native bundle we replace the forms with a single hand-off card that
// opens the live contribute page (which works, online, against the real origin).
// Idempotent: once the forms are gone, re-running is a no-op.

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const here = new URL('.', import.meta.url).pathname;
const page = process.argv[2] || join(here, '..', 'ios', 'App', 'App', 'public', 'contribute', 'index.html');

if (!existsSync(page)) {
  console.error(`native-contribute: no contribute page at ${page} — did the site build include it?`);
  process.exit(1);
}

const FORM_RE = /<form\b[^>]*action="\/api\/contributions"[^>]*>[\s\S]*?<\/form>/g;

const CARD = `<div class="native-contribute" style="margin:2rem 0;padding:1.25rem 1.5rem;border:1px solid var(--sl-color-gray-5);border-radius:0.5rem">
  <p style="margin-top:0">Contributions are submitted on the website. Open the contribute page in your browser to suggest an edit or propose a new page — you'll need a connection.</p>
  <a href="https://disabilitywiki.org/contribute/" rel="noopener" style="display:inline-block;min-height:44px;line-height:44px;padding:0 1.4rem;font-weight:600;color:var(--sl-color-black);background:var(--sl-color-accent-high);border-radius:0.4rem;text-decoration:none">Open the contribute page &rarr;</a>
</div>`;

const html = readFileSync(page, 'utf8');
let n = 0;
const out = html.replace(FORM_RE, () => (n++ === 0 ? CARD : ''));

if (n === 0) {
  console.log('native-contribute: no /api/contributions forms found (already handed off, or page changed) — nothing to do.');
} else {
  writeFileSync(page, out);
  console.log(`native-contribute: replaced ${n} dead-end form(s) with the live hand-off.`);
}
