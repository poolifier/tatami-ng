import { runtimes } from './constants.js';

const isBun = !!globalThis.Bun || !!globalThis.process?.versions?.bun;
const isDeno = !!globalThis.Deno;
const isNode = globalThis.process?.release?.name === 'node';
const isBrowser = !!globalThis.navigator;

export const runtime = (() => {
  if (isBun) return runtimes.bun;
  if (isDeno) return runtimes.deno;
  if (isNode) return runtimes.node;
  if (isBrowser) return runtimes.browser;

  return 'unknown';
})();
