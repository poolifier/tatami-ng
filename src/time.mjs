import { runtime } from './runtime.mjs';

const time = (() => {
  const diff = (a, b) => a - b;
  const round = Math.round;
  return {
    unknown: () => {
      return {
        diff,
        now: () => round(1e6 * performance.now()),
      };
    },
    browser: () => {
      try {
        $.agent.monotonicNow();

        return {
          diff,
          now: () => round(1e6 * $.agent.monotonicNow()),
        };
      } catch {}

      return {
        diff,
        now: () => round(1e6 * performance.now()),
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
        now: () => round(1e6 * performance.now()),
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

export const { diff, now } = time;
