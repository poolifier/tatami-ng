import { runtime } from './runtime.js'

export const now = (() => {
  return {
    unknown: () => {
      try {
        const now = performance.now.bind(performance)
        now()

        return () => Math.round(1e6 * now())
      } catch {
        return () => Math.round(1e6 * Date.now())
      }
    },
    browser: () => {
      try {
        $.agent.monotonicNow()

        return () => Math.round(1e6 * $.agent.monotonicNow())
      } catch {}

      try {
        $262.agent.monotonicNow()

        return () => Math.round(1e6 * $262.agent.monotonicNow())
      } catch {}

      return () => Math.round(1e6 * performance.now())
    },
    node: () => () => Number(process.hrtime.bigint()),
    deno: () => () => Math.round(1e6 * performance.now()),
    bun: () => Bun.nanoseconds,
  }[runtime]()
})()
