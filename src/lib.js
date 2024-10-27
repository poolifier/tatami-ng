import { spawnSync as nodeSpawnSync } from 'node:child_process'
import { setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'
import {
  defaultSamples,
  defaultTime,
  defaultWarmupRuns,
  defaultWarmupTime,
  emptyFunction,
  minimumSamples,
  tTable,
} from './constants.js'
import { runtime } from './runtime.js'
import {
  absoluteDeviation,
  average,
  medianSorted,
  quantileSorted,
  variance,
} from './stats-utils.js'
import { now } from './time.js'
import {
  checkDividend,
  isAsyncFunction,
  isFunction,
  isFunctionAsyncResource,
  isObject,
} from './utils.js'

export const version = (() => {
  return {
    unknown: () => '',
    browser: () => '',
    node: () => globalThis.process.version,
    deno: () => globalThis.Deno.version.deno,
    bun: () => globalThis.process.versions.bun,
  }[runtime]()
})()

export const os = (() => {
  return {
    unknown: () => 'unknown',
    browser: () => 'unknown',
    node: () => `${globalThis.process.arch}-${globalThis.process.platform}`,
    deno: () => Deno.build.target,
    bun: () => `${globalThis.process.arch}-${globalThis.process.platform}`,
  }[runtime]()
})()

export const cpuModel = await (async () => {
  return await {
    unknown: () => 'unknown',
    browser: () => 'unknown',
    node: async () => (await import('node:os'))?.cpus?.()?.[0]?.model,
    deno: async () => (await import('node:os'))?.cpus?.()?.[0]?.model,
    bun: async () => (await import('node:os'))?.cpus?.()?.[0]?.model,
  }[runtime]()
})()

export const colors = (() => {
  return {
    unknown: () =>
      globalThis.process?.env?.FORCE_COLOR != null ||
      (!globalThis.process?.env?.NO_COLOR &&
        !globalThis.process?.env?.NODE_DISABLE_COLORS),
    browser: () => false,
    node: () =>
      globalThis.process.env.FORCE_COLOR != null ||
      (!globalThis.process.env.NO_COLOR &&
        !globalThis.process.env.NODE_DISABLE_COLORS),
    deno: () => !Deno.noColor,
    bun: () =>
      globalThis.process.env.FORCE_COLOR != null ||
      (!globalThis.process.env.NO_COLOR &&
        !globalThis.process.env.NODE_DISABLE_COLORS),
  }[runtime]()
})()

export const writeFileSync = await (async () => {
  return await {
    unknown: async () => {
      try {
        await import('node:fs')

        return (await import('node:fs')).writeFileSync
      } catch {
        return emptyFunction
      }
    },
    browser: () => emptyFunction,
    node: async () => (await import('node:fs')).writeFileSync,
    deno: () => Deno.writeTextFileSync,
    bun: async () => (await import('node:fs')).writeFileSync,
  }[runtime]()
})()

export const spawnSync = (() => {
  return {
    unknown: () => emptyFunction,
    browser: () => emptyFunction,
    node: () => command =>
      nodeSpawnSync(
        command.trim().split(/\s+/)[0],
        command.trim().split(/\s+/).slice(1)
      ),
    deno: () => command => {
      const cmd = new Deno.Command(command.trim().split(/\s+/)[0], {
        args: command.trim().split(/\s+/).slice(1),
      })
      cmd.outputSync()
    },
    bun: () => command => Bun.spawnSync(command.trim().split(/\s+/)),
  }[runtime]()
})()

export const gc = (() => {
  return {
    unknown: () =>
      isFunction(globalThis.gc) ? () => globalThis.gc() : emptyFunction,
    browser: () => {
      try {
        globalThis.$262.gc()

        return () => globalThis.$262.gc()
      } catch {
        return emptyFunction
      }
    },
    node: () => () => {
      setFlagsFromString('--expose_gc')
      const gc = runInNewContext('gc')
      gc()
    },
    deno: () =>
      isFunction(globalThis.gc) ? () => globalThis.gc() : emptyFunction,
    bun: () => () => Bun.gc(true),
  }[runtime]()
})()

export const checkBenchmarkArgs = (fn, opts = {}) => {
  if (!isFunction(fn))
    throw new TypeError(`expected function, got ${fn.constructor.name}`)
  if (!isObject(opts))
    throw new TypeError(`expected object, got ${opts.constructor.name}`)
  if (opts.samples != null && 'number' !== typeof opts.samples)
    throw new TypeError(
      `expected number as 'samples' option, got ${opts.samples.constructor.name}`
    )
  if (opts.time != null && 'number' !== typeof opts.time)
    throw new TypeError(
      `expected number as 'time' option, got ${opts.time.constructor.name}`
    )
  if (
    opts.warmup != null &&
    'number' !== typeof opts.warmup &&
    'boolean' !== typeof opts.warmup
  )
    throw new TypeError(
      `expected number or boolean as 'warmup' option, got ${opts.warmup.constructor.name}`
    )
  if (opts.warmupTime != null && 'number' !== typeof opts.warmupTime)
    throw new TypeError(
      `expected number as 'warmupTime' option, got ${opts.warmupTime.constructor.name}`
    )
  if (opts.now != null && !isFunction(opts.now))
    throw new TypeError(
      `expected function as 'now' option, got ${opts.now.constructor.name}`
    )
  if (opts.before != null && !isFunction(opts.before))
    throw new TypeError(
      `expected function as 'before' option, got ${opts.before.constructor.name}`
    )
  if (opts.beforeEach != null && !isFunction(opts.beforeEach))
    throw new TypeError(
      `expected function as 'beforeEach' option, got ${opts.beforeEach.constructor.name}`
    )
  if (opts.after != null && !isFunction(opts.after))
    throw new TypeError(
      `expected function as 'after' option, got ${opts.after.constructor.name}`
    )
  if (opts.afterEach != null && !isFunction(opts.afterEach))
    throw new TypeError(
      `expected function as 'afterEach' option, got ${opts.afterEach.constructor.name}`
    )
}

export const overrideBenchmarkOptions = (benchmark, opts) => {
  benchmark.now = opts.now ?? benchmark.now
  benchmark.samples = opts.samples ?? benchmark.samples
  benchmark.time = opts.time ?? benchmark.time
  benchmark.warmup = opts.warmup ?? benchmark.warmup
  benchmark.warmupTime = opts.warmupTime ?? benchmark.warmupTime
}

/**
 * Measure a function runtime.
 *
 * @param {Function} fn function to measure
 * @param {Object} [opts={}] options object
 * @param {Boolean} [opts.async=undefined] function is async
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark execution time in nanoseconds
 * @param {Boolean|Number} [opts.warmup=true] benchmark warmup or benchmark minimum warmup run(s)
 * @param {Number} [opts.warmupTime=250_000_000] benchmark warmup minimum execution time in nanoseconds
 * @param {Function} [opts.now=undefined] nanoseconds timestamp function
 * @param {Function} [opts.before=()=>{}] before function hook
 * @param {Function} [opts.after=()=>{}] after function hook
 * @param {Function} [opts.beforeEach=()=>{}] beforeEach iteration function hook
 * @param {Function} [opts.afterEach=()=>{}] afterEach iteration function hook
 * @returns {Promise<Object>} benchmark stats
 */
export async function measure(fn, opts = {}) {
  checkBenchmarkArgs(fn, opts)
  if (opts.async != null && 'boolean' !== typeof opts.async)
    throw new TypeError(
      `expected boolean as 'async' option, got ${opts.async.constructor.name}`
    )

  opts.async = opts.async ?? isFunctionAsyncResource(fn)
  opts.time = opts.time ?? defaultTime
  opts.samples = opts.samples ?? defaultSamples
  opts.warmup =
    'number' === typeof opts.warmup
      ? opts.warmup
      : opts.warmup === true
        ? defaultWarmupRuns
        : 0
  opts.warmupTime = opts.warmupTime ?? defaultWarmupTime
  opts.now = opts.now ?? now
  opts.before = opts.before ?? emptyFunction
  opts.beforeEach = opts.beforeEach ?? emptyFunction
  opts.after = opts.after ?? emptyFunction
  opts.afterEach = opts.afterEach ?? emptyFunction

  const asyncBefore = isAsyncFunction(opts.before)
  const asyncBeforeEach = isAsyncFunction(opts.beforeEach)
  const asyncAfter = isAsyncFunction(opts.after)
  const asyncAfterEach = isAsyncFunction(opts.afterEach)

  const measureFn = async (samples, time) => {
    if (asyncBefore) {
      await opts.before.call(this)
    } else {
      opts.before.call(this)
    }
    const executionSamples = []
    let executionTime = 0
    while (executionTime < time || samples > executionSamples.length) {
      if (asyncBeforeEach) {
        await opts.beforeEach.call(this)
      } else {
        opts.beforeEach.call(this)
      }
      let diff
      if (opts.async) {
        const ts = opts.now()
        await fn.call(this)
        diff = opts.now() - ts
      } else {
        const ts = opts.now()
        fn.call(this)
        diff = opts.now() - ts
      }
      executionSamples.push(diff)
      executionTime += diff
      if (asyncAfterEach) {
        await opts.afterEach.call(this)
      } else {
        opts.afterEach.call(this)
      }
    }
    if (asyncAfter) {
      await opts.after.call(this)
    } else {
      opts.after.call(this)
    }
    return executionSamples
  }

  if (opts.warmup) {
    await measureFn(opts.warmup, opts.warmupTime)
  }
  const samples = await measureFn(opts.samples, opts.time)

  return buildMeasurementStats(samples)
}

const buildMeasurementStats = latencySamples => {
  if (!Array.isArray(latencySamples))
    throw new TypeError(
      `expected array, got ${latencySamples.constructor.name}`
    )
  if (latencySamples.length === 0)
    throw new Error('expected non-empty array, got empty array')

  // Latency
  latencySamples.sort((a, b) => a - b)
  const latencyStats = getStatsSorted(latencySamples)

  // Throughput
  const throughputSamples = latencySamples
    .map(
      sample => (sample !== 0 ? 1e9 / sample : 1e9 / latencyStats.avg) // Use latency average as imputed sample
    )
    .sort((a, b) => a - b)

  return {
    samples: latencySamples.length,
    ss: latencySamples.length >= minimumSamples,
    latency: latencyStats,
    throughput: getStatsSorted(throughputSamples),
  }
}

const getStatsSorted = samples => {
  const avg = average(samples)
  const vr = variance(samples, avg)
  const sd = Math.sqrt(vr)
  const sem = sd / Math.sqrt(samples.length)
  const df = samples.length - 1
  const critical = tTable[(df || 1).toString()] || tTable.infinity
  const moe = sem * critical
  const rmoe = (moe / checkDividend(avg)) * 100
  const p50 = medianSorted(samples)

  return {
    min: samples[0],
    max: samples[df],
    p50,
    p75: quantileSorted(samples, 0.75),
    p99: quantileSorted(samples, 0.99),
    p995: quantileSorted(samples, 0.995),
    avg,
    vr,
    sd,
    moe,
    rmoe,
    aad: absoluteDeviation(samples, average, avg),
    mad: absoluteDeviation(samples, medianSorted, p50),
  }
}
