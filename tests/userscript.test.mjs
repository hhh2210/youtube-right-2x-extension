import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const userScriptPath = path.join(rootDir, 'youtube-right-2x.user.js');

test('userscript file exists with required metadata', () => {
  assert.equal(fs.existsSync(userScriptPath), true, 'missing youtube-right-2x.user.js');

  const source = fs.readFileSync(userScriptPath, 'utf8');

  assert.match(source, /^\/\/ ==UserScript==/m);
  assert.match(source, /^\/\/ @name\s+YouTube Right Arrow: 2× Fast-Forward/m);
  assert.match(source, /^\/\/ @match\s+\*:\/\/www\.youtube\.com\/\*/m);
  assert.match(source, /^\/\/ @grant\s+none/m);
  assert.match(source, /LONG_PRESS_DELAY\s*=\s*300/);
  assert.match(source, /Shift\+R/);
});
