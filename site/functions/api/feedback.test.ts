// Page-path validation for the feedback endpoint — the gate between an open POST
// route and arbitrary rows in the tally a maintainer reads.
// Run: node --test functions/api/feedback.test.ts
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { isValidPagePath, isCrisisPath } from './feedback.ts';

test('accepts the real page shapes on this site', () => {
  for (const p of [
    '/',
    '/benefits/us/ssi/',
    '/es/benefits/us/ssi/',
    '/start/faq/',
    '/conditions/long-covid/',
    '/reuse/',
    '/glossary/',
  ]) {
    assert.equal(isValidPagePath(p), true, p);
  }
});

test('rejects anything that is not a bare site path', () => {
  for (const p of [
    '',
    'benefits/us/ssi/', // relative
    'https://evil.example/x', // absolute URL
    '//evil.example/x', // protocol-relative
    '/a/../../etc/passwd', // traversal
    '/a//b', // doubled separator
    '/a?b=c', // query
    '/a#frag', // fragment
    '/a\\b', // backslash
    '/a b', // space
    '/a<script>', // markup
    '/' + 'x'.repeat(300), // unbounded length
  ]) {
    assert.equal(isValidPagePath(p), false, JSON.stringify(p));
  }
});

test('the page path can never become an open redirect', () => {
  // The no-JS path echoes `return` into a Location header. Anything that could
  // steer a reader off-site must fail validation before it gets there.
  for (const p of ['https://evil.example', '//evil.example', '/\\evil.example', '/%2F%2Fevil']) {
    assert.equal(isValidPagePath(p), false, p);
  }
});

test('crisis pages are refused — the widget is never shown there', () => {
  for (const p of [
    '/crisis/',
    '/crisis/global-crisis-hotlines/',
    '/es/crisis/',
    '/es/crisis/abuse-neglect-exploitation/',
  ]) {
    assert.equal(isCrisisPath(p), true, p);
  }
});

test('pages that merely mention crisis are not treated as crisis pages', () => {
  for (const p of ['/crisis-planning-guide/', '/conditions/crisis/', '/es/start/crisis-info/']) {
    assert.equal(isCrisisPath(p), false, p);
  }
});
