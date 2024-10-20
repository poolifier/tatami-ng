import { runtime } from './runtime.js'

export const now = (() => {
  return {
    unknown: () => {
      try {
        const now = performance.now.bind(performance)
        now()

        return () => 1e6 * now()
      } catch {
        const now = Date.now.bind(Date)
        return () => 1e6 * now()
      }
    },
    browser: () => {
      try {
        $.agent.monotonicNow()

        return () => 1e6 * $.agent.monotonicNow()
      } catch {}

      try {
        $262.agent.monotonicNow()

        return () => 1e6 * $262.agent.monotonicNow()
      } catch {}

      return () => {
        const now = performance.now.bind(performance)
        return 1e6 * now()
      }
    },
    node: () => () => {
      const hrtimeNow = process.hrtime.bigint.bind(process)
      return Number(hrtimeNow())
    },
    deno: () => () => {
      const now = performance.now.bind(performance)
      return 1e6 * now()
    },
    bun: () => {
      const now = Bun.nanoseconds.bind(Bun)
      return now
    },
  }[runtime]()
})()
