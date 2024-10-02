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
import { checkDividend, isObject } from './utils.js'

export const AsyncFunction = (async () => {}).constructor

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
      typeof globalThis.gc === 'function'
        ? () => globalThis.gc()
        : emptyFunction,
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
      typeof globalThis.gc === 'function'
        ? () => globalThis.gc()
        : emptyFunction,
    bun: () => () => Bun.gc(true),
  }[runtime]()
})()

export const checkBenchmarkArgs = (fn, opts = {}) => {
  if (![Function, AsyncFunction].includes(fn.constructor))
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
  if (opts.now != null && Function !== opts.now.constructor)
    throw new TypeError(
      `expected function as 'now' option, got ${opts.now.constructor.name}`
    )
  if (
    opts.before != null &&
    ![Function, AsyncFunction].includes(opts.before.constructor)
  )
    throw new TypeError(
      `expected function as 'before' option, got ${opts.before.constructor.name}`
    )
  if (
    opts.after != null &&
    ![Function, AsyncFunction].includes(opts.after.constructor)
  )
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

  opts.async = opts.async ?? AsyncFunction === fn.constructor
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

  const asyncBefore = AsyncFunction === opts.before.constructor
  const asyncAfter = AsyncFunction === opts.after.constructor

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

const buildMeasurementStats = samples => {
  if (!Array.isArray(samples))
    throw new TypeError(`expected array, got ${samples.constructor.name}`)
  if (samples.length === 0)
    throw new Error('expected non-empty array, got empty array')

  samples.sort((a, b) => a - b)

  const time = samples.reduce((a, b) => a + b, 0)
  const avg = time / samples.length
  const vr = variance(samples, avg)
  const sd = Math.sqrt(vr)
  const sem = sd / Math.sqrt(samples.length)
  const critical =
    tTable[(samples.length - 1 || 1).toString()] || tTable.infinity
  const moe = sem * critical
  const rmoe = (moe / checkDividend(avg)) * 100

  return {
    samples: samples.length,
    min: samples[0],
    max: samples[samples.length - 1],
    p50: medianSorted(samples),
    p75: quantileSorted(samples, 0.75),
    p99: quantileSorted(samples, 0.99),
    p995: quantileSorted(samples, 0.995),
    avg,
    iters: (1e9 * samples.length) / checkDividend(time),
    vr,
    sd,
    rmoe,
    aad: absoluteDeviation(samples, average),
    mad: absoluteDeviation(samples, medianSorted),
    ss: samples.length >= minimumSamples,
  }
}
