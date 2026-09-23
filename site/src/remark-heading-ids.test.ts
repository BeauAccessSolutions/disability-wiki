import { test } from 'node:test';
import { strict as assert } from 'node:assert';
import { remarkHeadingIds } from './remark-heading-ids.mjs';

// Build a one-heading mdast the way remark would, with source positions.
function run(source: string, text: string) {
  const heading: any = {
    type: 'heading',
    depth: 2,
    children: [{ type: 'text', value: text }],
    position: { start: { offset: 0 }, end: { offset: source.length } },
  };
  const tree = { type: 'root', children: [heading] };
  remarkHeadingIds()(tree, { value: source });
  return heading;
}

test('{#id} suffix becomes the heading id and leaves the text', () => {
  const h = run('## Canadá {#canada}', 'Canadá {#canada}');
  assert.equal(h.data.hProperties.id, 'canada');
  assert.equal(h.children[0].value, 'Canadá');
});

test('id comes from the raw source, not the smartypants-rewritten text', () => {
  // smartypants runs first and turns `--` into an em dash in the text node.
  const h = run('## Pista y campo {#track--field}', 'Pista y campo {#track—field}');
  assert.equal(h.data.hProperties.id, 'track--field');
  assert.equal(h.children[0].value, 'Pista y campo');
});

test('headings without {#id} are untouched', () => {
  const h = run('## Plain heading', 'Plain heading');
  assert.equal(h.data, undefined);
  assert.equal(h.children[0].value, 'Plain heading');
});
