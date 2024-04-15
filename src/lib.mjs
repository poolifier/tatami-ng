import {
  defaultSamples,
  defaultTime,
  emptyFunction,
  minimumSamples,
  tTable,
} from './constants.mjs';
import { runtime } from './runtime.mjs';
import { now } from './time.mjs';

export const AsyncFunction = (async () => {}).constructor;

export const version = (() => {
  return {
    unknown: () => '',
    browser: () => '',
    node: () => process.version,
    deno: () => Deno.version.deno,
    bun: () => process.versions.bun,
  }[runtime]();
})();

export const os = (() => {
  return {
    unknown: () => 'unknown',
    browser: () => 'unknown',
    node: () => `${process.arch}-${process.platform}`,
    deno: () => Deno.build.target,
    bun: () => `${process.arch}-${process.platform}`,
  }[runtime]();
})();

export const cpu = await (async () => {
  return await {
    unknown: () => 'unknown',
    browser: () => 'unknown',
    node: async () => (await import('node:os'))?.cpus?.()?.[0]?.model,
    deno: async () => (await import('node:os'))?.cpus?.()?.[0]?.model,
    bun: async () => (await import('node:os'))?.cpus?.()?.[0]?.model,
  }[runtime]();
})();

export const noColor = (() => {
  return {
    unknown: () => false,
    browser: () => true,
    node: () => !!process.env.NO_COLOR,
    deno: () => Deno.noColor,
    bun: () => !!process.env.NO_COLOR,
  }[runtime]();
})();

export const checkBenchmarkArgs = (fn, opts = {}) => {
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`);
  if (Object.prototype.toString.call(opts).slice(8, -1) !== 'Object')
    throw new TypeError(`expected object, got ${opts.constructor.name}`);
  if (opts.warmup != null && 'boolean' !== typeof opts.warmup)
    throw new TypeError(
      `expected boolean as 'warmup' option, got ${opts.warmup.constructor.name}`,
    );
  if (
    opts.before != null &&
    ![Function, AsyncFunction].includes(opts.before.constructor)
  )
    throw new TypeError(
      `expected function as 'before' option, got ${opts.before.constructor.name}`,
    );
  if (
    opts.after != null &&
    ![Function, AsyncFunction].includes(opts.after.constructor)
  )
    throw new TypeError(
      `expected function as 'after' option, got ${opts.after.constructor.name}`,
    );
};

export function mergeDeepRight(target, source) {
  const targetClone = structuredClone(target);

  for (const key in source) {
    if (Object.prototype.toString.call(target[key]).slice(8, -1) === 'Object') {
      if (
        Object.prototype.toString.call(target[key]).slice(8, -1) === 'Object'
      ) {
        targetClone[key] = mergeDeepRight(target[key], source[key]);
      } else {
        targetClone[key] = source[key];
      }
    } else {
      targetClone[key] = source[key];
    }
  }

  return targetClone;
}

export async function measure(
  fn,
  before = emptyFunction,
  after = emptyFunction,
  opts = {},
) {
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`);
  if (![Function, AsyncFunction].includes(before.constructor))
    throw new TypeError(`expected function, got ${before.constructor.name}`);
  if (![Function, AsyncFunction].includes(after.constructor))
    throw new TypeError(`expected function, got ${after.constructor.name}`);
  if (Object.prototype.toString.call(opts).slice(8, -1) !== 'Object')
    throw new TypeError(`expected object, got ${opts.constructor.name}`);

  // biome-ignore lint/style/noParameterAssign: <explanation>
  opts = mergeDeepRight(
    {
      async: AsyncFunction === fn.constructor,
      warmup: true,
      time: defaultTime,
      samples: defaultSamples,
    },
    opts,
  );

  const asyncBefore = AsyncFunction === before.constructor;
  const asyncAfter = AsyncFunction === after.constructor;

  const benchmark = new (!opts.async ? Function : AsyncFunction)(
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
          for (let i = 0; i < ${opts.samples - 1}; i++) {
            const t0 = $now();
            ${!opts.async ? '' : 'await'} $fn();
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
      ${!opts.async ? '' : 'await'} $fn();
      const t1 = $now();

      const diff = t1 - t0;
      time += diff;
      samples.push(diff);
    }
    ${asyncAfter ? 'await' : ''} $after();

    return samples;
  `,
  );

  const samples = !opts.async
    ? benchmark(fn, before, after, now)
    : await benchmark(fn, before, after, now);

  return buildStats(samples);
}

const quantile = (arr, q) => {
  const base = (arr.length - 1) * q;
  const baseIndex = Math.floor(base);
  if (arr[baseIndex + 1] != null) {
    return (
      arr[baseIndex] +
      (base - baseIndex) * (arr[baseIndex + 1] - arr[baseIndex])
    );
  }
  return arr[baseIndex];
};

const buildStats = samples => {
  if (!Array.isArray(samples)) {
    throw new TypeError(`expected array, got ${samples.constructor.name}`);
  }
  if (Array.isArray(samples) && samples.length === 0) {
    throw new Error('expected non-empty array, got empty array');
  }

  samples.sort((a, b) => a - b);

  const time = samples.reduce((a, b) => a + b, 0);
  const avg = time / samples.length;
  const vr =
    samples.reduce((a, b) => a + (b - avg) ** 2, 0) / (samples.length - 1);
  const sd = Math.sqrt(vr);
  const sem = sd / Math.sqrt(samples.length);
  const critical =
    tTable[(samples.length - 1 || 1).toString()] || tTable.infinity;
  const moe = sem * critical;
  const rmoe = (moe / avg) * 100;

  return {
    samples: samples.length,
    min: samples[0],
    max: samples[samples.length - 1],
    p50: quantile(samples, 0.5),
    p75: quantile(samples, 0.75),
    p99: quantile(samples, 0.99),
    p995: quantile(samples, 0.995),
    avg,
    iter: samples.length / (time / 1e9),
    vr,
    sd,
    rmoe,
    ss: samples.length >= minimumSamples,
  };
};
