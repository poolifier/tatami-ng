import { spawnSync as nodeSpawnSync } from 'node:child_process'
import { setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'
import {
  defaultSamples,
  defaultTime,
  defaultWarmupRuns,
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
  AsyncFunction,
  checkDividend,
  isAsyncFunction,
  isFunction,
  isObject,
} from './utils.js'

export const version = (() => {
  return {
    unknown: () => '',
    browser: () => '',
    node: () => globalThis.process.version,
    deno: () => globalThis.Deno.version.deno,
    bun: () => globalThis.process.versions.bun,
    // hermes: () =>
    //   globalThis.HermesInternal?.getRuntimeProperties?.()?.[
    //     'OSS Release Version'
    //   ],
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
  if (opts.now != null && !isFunction(opts.now))
    throw new TypeError(
      `expected function as 'now' option, got ${opts.now.constructor.name}`
    )
  if (opts.before != null && !isFunction(opts.before))
    throw new TypeError(
      `expected function as 'before' option, got ${opts.before.constructor.name}`
    )
  if (opts.after != null && !isFunction(opts.after))
    throw new TypeError(
      `expected function as 'after' option, got ${opts.after.constructor.name}`
    )
}

export const overrideBenchmarkOptions = (benchmark, opts) => {
  benchmark.now = opts.now ?? benchmark.now
  benchmark.samples = opts.samples ?? benchmark.samples
  benchmark.time = opts.time ?? benchmark.time
  benchmark.warmup = opts.warmup ?? benchmark.warmup
}

/**
 * Measure a function runtime.
 *
 * @param {Function} [fn] function to measure
 * @param {Object} [opts={}] options object
 * @param {Boolean} [opts.async=undefined] function is async
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark execution time in nanoseconds
 * @param {Boolean|Number} [opts.warmup=true] benchmark warmup or benchmark warmup run(s)
 * @param {Function} [opts.now=undefined] nanoseconds timestamp function
 * @param {Function} [opts.before=()=>{}] before function hook
 * @param {Function} [opts.after=()=>{}] after function hook
 * @returns {Object} benchmark stats
 */
export async function measure(fn, opts = {}) {
  checkBenchmarkArgs(fn, opts)
  if (opts.async != null && 'boolean' !== typeof opts.async)
    throw new TypeError(
      `expected boolean as 'async' option, got ${opts.async.constructor.name}`
    )

  opts.async = opts.async ?? isAsyncFunction(fn)
  opts.time = opts.time ?? defaultTime
  opts.samples = opts.samples ?? defaultSamples
  opts.warmup =
    'number' === typeof opts.warmup
      ? opts.warmup
      : opts.warmup === true
        ? defaultWarmupRuns
        : 0
  opts.now = opts.now ?? now
  opts.before = opts.before ?? emptyFunction
  opts.after = opts.after ?? emptyFunction

  const asyncBefore = isAsyncFunction(opts.before)
  const asyncAfter = isAsyncFunction(opts.after)

  const asyncFunction = opts.async || asyncBefore || asyncAfter

  const benchmark = new (asyncFunction ? AsyncFunction : Function)(
    '$fn',
    '$before',
    '$after',
    '$now',
    `
    ${
      !opts.warmup
        ? ''
        : `
          ${asyncBefore ? 'await' : ''} $before();
          for (let i = 0; i < ${opts.warmup}; i++) {
            const t0 = $now();
            ${opts.async ? 'await' : ''} $fn();
            const t1 = $now();
          }
          ${asyncAfter ? 'await' : ''} $after();
          `
    }

    const samples = new Array();
    let time = 0;

    ${asyncBefore ? 'await' : ''} $before();
    while (time < ${opts.time} || ${opts.samples} > samples.length) {
      const t0 = $now();
      ${opts.async ? 'await' : ''} $fn();
      const t1 = $now();

      const diff = t1 - t0;
      time += diff;
      samples.push(diff);
    }
    ${asyncAfter ? 'await' : ''} $after();

    return samples;
  `
  )

  const samples = asyncFunction
    ? await benchmark(fn, opts.before, opts.after, opts.now)
    : benchmark(fn, opts.before, opts.after, opts.now)

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
  const latencyAvg = average(latencySamples)
  const latencyVr = variance(latencySamples, latencyAvg)
  const latencySd = Math.sqrt(latencyVr)
  const latencySem = latencySd / Math.sqrt(latencySamples.length)
  const latencyCritical =
    tTable[(latencySamples.length - 1 || 1).toString()] || tTable.infinity
  const latencyMoe = latencySem * latencyCritical
  const latencyRmoe = (latencyMoe / checkDividend(latencyAvg)) * 100

  // Throughput
  const throughputSamples = latencySamples
    .map(
      sample => (sample !== 0 ? 1e9 / sample : 1e9 / latencyAvg) // Use latency average as imputed sample
    )
    .sort((a, b) => a - b)
  const throughputAvg = average(throughputSamples)
  const throughputVr = variance(throughputSamples, throughputAvg)
  const throughputSd = Math.sqrt(throughputVr)
  const throughputSem = throughputSd / Math.sqrt(throughputSamples.length)
  const throughputCritical =
    tTable[(throughputSamples.length - 1 || 1).toString()] || tTable.infinity
  const throughputMoe = throughputSem * throughputCritical
  const throughputRmoe = (throughputMoe / checkDividend(throughputAvg)) * 100

  return {
    samples: latencySamples.length,
    ss: latencySamples.length >= minimumSamples,
    latency: {
      min: latencySamples[0],
      max: latencySamples[latencySamples.length - 1],
      p50: medianSorted(latencySamples),
      p75: quantileSorted(latencySamples, 0.75),
      p99: quantileSorted(latencySamples, 0.99),
      p995: quantileSorted(latencySamples, 0.995),
      avg: latencyAvg,
      vr: latencyVr,
      sd: latencySd,
      moe: latencyMoe,
      rmoe: latencyRmoe,
      aad: absoluteDeviation(latencySamples, average),
      mad: absoluteDeviation(latencySamples, medianSorted),
    },
    throughput: {
      min: throughputSamples[0],
      max: throughputSamples[latencySamples.length - 1],
      p50: medianSorted(throughputSamples),
      p75: quantileSorted(throughputSamples, 0.75),
      p99: quantileSorted(throughputSamples, 0.99),
      p995: quantileSorted(throughputSamples, 0.995),
      avg: throughputAvg,
      vr: throughputVr,
      sd: throughputSd,
      moe: throughputMoe,
      rmoe: throughputRmoe,
      aad: absoluteDeviation(throughputSamples, average),
      mad: absoluteDeviation(throughputSamples, medianSorted),
    },
  }
}
