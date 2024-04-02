import { runtime } from './runtime.mjs';

const time = (() => {
  const ceil = Math.ceil;
  return {
    unknown: () => {
      return {
        diff: (a, b) => a - b,
        now: () => ceil(1e6 * performance.now()),
      };
    },
    browser: () => {
      try {
        $.agent.monotonicNow();

        return {
          diff: (a, b) => a - b,
          now: () => ceil(1e6 * $.agent.monotonicNow()),
        };
      } catch {}

      return {
        diff: (a, b) => a - b,
        now: () => ceil(1e6 * performance.now()),
      };
    },
    node: () => {
      return {
        diff: (a, b) => a - b,
        now: () => Number(process.hrtime.bigint()),
      };
    },
    deno: () => {
      return {
        diff: (a, b) => a - b,
        // FIXME: use Deno HR time
        now: () => ceil(1e6 * performance.now()),
      };
    },
    bun: () => {
      return {
        diff: (a, b) => a - b,
        now: Bun.nanoseconds,
      };
    },
  }[runtime()]();
})();

export const now = time.now;
export const diff = time.diff;
