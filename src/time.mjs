import { runtime } from './runtime.mjs';

export const now = (() => {
  return {
    unknown: () => () => Math.round(1e6 * performance.now()),
    browser: () => {
      try {
        $.agent.monotonicNow();

        return () => Math.round(1e6 * $.agent.monotonicNow());
      } catch {}

      return () => Math.round(1e6 * performance.now());
    },
    node: () => () => Number(process.hrtime.bigint()),
    deno: () => () => Math.round(1e6 * performance.now()),
    bun: () => Bun.nanoseconds,
  }[runtime]();
})();
