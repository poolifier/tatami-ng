import {
  defaultSamples,
  defaultTime,
  defaultWarmupRuns,
  emptyFunction,
  minimumSamples,
  tTable,
} from './constants.js'
import { runtime } from './runtime.js'
import { now } from './time.js'

import { spawnSync as nodeSpawnSync } from 'node:child_process'
import { setFlagsFromString } from 'node:v8'
import { runInNewContext } from 'node:vm'

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

export const convertReportToBmf = report => {
  return report.benchmarks
    .map(({ name, stats }) => {
      return {
        [name]: {
          latency: {
            value: stats?.avg,
            lower_value: stats?.min,
            upper_value: stats?.max,
          },
          throughput: {
            value: stats?.iters,
          },
        },
      }
    })
    .reduce((obj, item) => Object.assign(obj, item), {})
}

export const checkBenchmarkArgs = (fn, opts = {}) => {
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`)
  if (Object.prototype.toString.call(opts).slice(8, -1) !== 'Object')
    throw new TypeError(`expected object, got ${opts.constructor.name}`)
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

export const overrideBenchmarkDefaults = (benchmark, opts) => {
  benchmark.samples ??= opts.samples
  benchmark.time ??= opts.time
  benchmark.warmup ??= opts.warmup
}

export const mergeDeepRight = (target, source) => {
  const targetClone = structuredClone(target)

  for (const key in source) {
    if (Object.prototype.toString.call(target[key]).slice(8, -1) === 'Object') {
      if (
        Object.prototype.toString.call(target[key]).slice(8, -1) === 'Object'
      ) {
        targetClone[key] = mergeDeepRight(target[key], source[key])
      } else {
        targetClone[key] = source[key]
      }
    } else {
      targetClone[key] = source[key]
    }
  }

  return targetClone
}

export const checkDividend = n => {
  if ('number' !== typeof n)
    throw new TypeError(`expected number, got ${n.constructor.name}`)
  if (n === 0 || Number.isNaN(n)) throw new RangeError(`Invalid dividend: ${n}`)
  return n
}

export async function measure(
  fn,
  before = emptyFunction,
  after = emptyFunction,
  opts = {}
) {
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`)
  if (![Function, AsyncFunction].includes(before.constructor))
    throw new TypeError(`expected function, got ${before.constructor.name}`)
  if (![Function, AsyncFunction].includes(after.constructor))
    throw new TypeError(`expected function, got ${after.constructor.name}`)
  if (Object.prototype.toString.call(opts).slice(8, -1) !== 'Object')
    throw new TypeError(`expected object, got ${opts.constructor.name}`)

  // biome-ignore lint/style/noParameterAssign: <explanation>
  opts = mergeDeepRight(
    {
      async: AsyncFunction === fn.constructor,
      time: defaultTime,
      samples: defaultSamples,
      warmup: true,
    },
    opts
  )

  opts.warmup =
    'number' === typeof opts.warmup
      ? opts.warmup
      : opts.warmup === true
        ? defaultWarmupRuns
        : 0

  const asyncBefore = AsyncFunction === before.constructor
  const asyncAfter = AsyncFunction === after.constructor

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
    ? await benchmark(fn, before, after, now)
    : benchmark(fn, before, after, now)

  return buildStats(samples)
}

const quantileSorted = (samples, q) => {
  if (!Array.isArray(samples)) {
    throw new TypeError(`expected array, got ${samples.constructor.name}`)
  }
  if (samples.length === 0) {
    throw new Error('expected non-empty array, got empty array')
  }
  if (q < 0 || q > 1) {
    throw new Error('q must be between 0 and 1')
  }
  if (q === 0) {
    return samples[0]
  }
  if (q === 1) {
    return samples[samples.length - 1]
  }
  const base = (samples.length - 1) * q
  const baseIndex = Math.floor(base)
  if (samples[baseIndex + 1] != null) {
    return (
      samples[baseIndex] +
      (base - baseIndex) * (samples[baseIndex + 1] - samples[baseIndex])
    )
  }
  return samples[baseIndex]
}

const medianSorted = samples => quantileSorted(samples, 0.5)

const average = samples => {
  if (!Array.isArray(samples)) {
    throw new TypeError(`expected array, got ${samples.constructor.name}`)
  }
  if (samples.length === 0) {
    throw new Error('expected non-empty array, got empty array')
  }

  return samples.reduce((a, b) => a + b, 0) / samples.length
}

const absoluteDeviation = (samples, aggFn) => {
  const value = aggFn(samples)
  const absoluteDeviations = []

  for (const elt of samples) {
    absoluteDeviations.push(Math.abs(elt - value))
  }

  return aggFn(absoluteDeviations)
}

const buildStats = samples => {
  if (!Array.isArray(samples))
    throw new TypeError(`expected array, got ${samples.constructor.name}`)
  if (samples.length === 0)
    throw new Error('expected non-empty array, got empty array')

  samples.sort((a, b) => a - b)

  const time = samples.reduce((a, b) => a + b, 0)
  const avg = time / samples.length
  const vr =
    samples.reduce((a, b) => a + (b - avg) ** 2, 0) /
    checkDividend(samples.length - 1) // Bessel's correction
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
