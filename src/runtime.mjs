const runtimes = {
  bun: 'bun',
  deno: 'deno',
  node: 'node',
  browser: 'browser',
};

export const isBun = !!globalThis.Bun || !!globalThis.process?.versions?.bun;
export const isDeno = !!globalThis.Deno;
export const isNode = globalThis.process?.release?.name === 'node';
export const isBrowser = !!globalThis.navigator;

export function runtime() {
  if (isBun) return runtimes.bun;
  if (isDeno) return runtimes.deno;
  if (isNode) return runtimes.node;
  if (isBrowser) return runtimes.browser;

  return 'unknown';
}
