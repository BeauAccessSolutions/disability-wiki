// Wiki.js section indexes lived at /<dir>/index; Starlight serves /<dir>.
// For every built page, emit a 301 in dist/_redirects (SEO for old URLs)
// and a meta-refresh page (local preview parity).
import { readdirSync, statSync, existsSync, mkdirSync, writeFileSync, appendFileSync } from 'node:fs';
import { join } from 'node:path';

const DIST = new URL('../dist', import.meta.url).pathname;
const rules = [];
function walk(dir, url) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (!statSync(p).isDirectory() || name === 'index') continue;
    const u = `${url}/${name}`;
    if (existsSync(join(p, 'index.html')) && !existsSync(join(p, 'index', 'index.html'))) {
      rules.push(`${u}/index ${u} 301`);
      mkdirSync(join(p, 'index'), { recursive: true });
      writeFileSync(
        join(p, 'index', 'index.html'),
        `<!doctype html><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${u}"><link rel="canonical" href="${u}">`
      );
    }
    walk(p, u);
  }
}
walk(DIST, '');
appendFileSync(join(DIST, '_redirects'), `\n# generated: Wiki.js /<page>/index aliases\n${rules.join('\n')}\n`);
console.log(`index-alias redirects: ${rules.length}`);
