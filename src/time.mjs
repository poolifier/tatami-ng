import { runtime } from './runtime.mjs';

const time = (() => {
  const diff = (a, b) => a - b;
  const ceil = Math.ceil;
  return {
    unknown: () => {
      return {
        diff,
        now: () => ceil(1e6 * performance.now()),
      };
    },
    browser: () => {
      try {
        $.agent.monotonicNow();

        return {
          diff,
          now: () => ceil(1e6 * $.agent.monotonicNow()),
        };
      } catch {}

      return {
        diff,
        now: () => ceil(1e6 * performance.now()),
      };
    },
    node: () => {
      return {
        diff,
        now: () => Number(process.hrtime.bigint()),
      };
    },
    deno: () => {
      return {
        diff,
        now: () => ceil(1e6 * performance.now()),
      };
    },
    bun: () => {
      return {
        diff,
        now: Bun.nanoseconds,
      };
    },
  }[runtime]();
})();

export const now = time.now;
export const diff = time.diff;
