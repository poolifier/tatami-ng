import { runtime } from './runtime.mjs';
import { now } from './time.mjs';

export const AsyncFunction = (async () => {}).constructor;
const GeneratorFunction = function* () {}.constructor;
const AsyncGeneratorFunction = async function* () {}.constructor;

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
    node: async () => (await import('node:os')).cpus()[0].model,
    deno: async () => {
      try {
        const os = await import('node:os');
        if (os?.cpus?.()?.[0]?.model) return os.cpus()[0].model;
      } catch {}

      return 'unknown';
    },
    bun: async () => {
      try {
        const os = await import('node:os');
        if (os?.cpus?.()?.[0]?.model) return os.cpus()[0].model;
      } catch {}

      return 'unknown';
    },
  }[runtime]();
})();

export const no_color = (() => {
  return {
    unknown: () => false,
    browser: () => true,
    node: () => !!process.env.NO_COLOR,
    deno: () => Deno.noColor,
    bun: () => !!process.env.NO_COLOR,
  }[runtime]();
})();

export async function measure(fn, opts) {
  if (
    ![
      Function,
      AsyncFunction,
      GeneratorFunction,
      AsyncGeneratorFunction,
    ].includes(fn.constructor)
  )
    throw new Error(
      `expected function or generator, got ${fn.constructor.name}`,
    );
  if ([GeneratorFunction, AsyncGeneratorFunction].includes(fn.constructor))
    throw new Error('generator is not supported yet');

  const async = [AsyncFunction, AsyncGeneratorFunction].includes(
    fn.constructor,
  );
  const generator = [GeneratorFunction, AsyncGeneratorFunction].includes(
    fn.constructor,
  );
  opts.warmup =
    false === opts.warmup
      ? false
      : {
          warmup: opts.warmup ?? true,
          samples: opts.warmup?.samples ?? 128,
        };

  const t0 = now();
  !async ? fn() : await fn();
  const fnExecutionTime = now() - t0;

  const b = new (!async ? Function : AsyncFunction)(
    '$fn',
    '$now',
    `
    let $w = ${fnExecutionTime};

    ${
      !opts.warmup
        ? ''
        : fnExecutionTime > 250_000_000
          ? ''
          : `
            warmup: {
              const samples = new Array(${opts.warmup.samples - 1});

              for (let i = 0; i < ${opts.warmup.samples - 1}; i++) {
                const t0 = $now();
                ${!async ? '' : 'await'} $fn();
                const t1 = $now();

                samples.push(t1 - t0);
              }

              samples.sort((a, b) => a - b);
              $w = samples[1];
            }
          `
    }

    let s = 0;
    let t = 600_000_000;
    let samples = new Array();

    if ($w > 10_000) {
      while (s < t || 10 > samples.length) {
        const t0 = $now();
        ${!async ? '' : 'await'} $fn();
        const t1 = $now();

        s += samples[samples.push(t1 - t0) - 1];
      }
    } else {
      while (s < t || 128 > samples.length) {
        const t0 = $now();

        for (let i = 0; i < 256; i++) {
          ${`${!async ? '' : 'await'} $fn();\n`.repeat(8)}
        }

        const t1 = $now();

        s += t1 - t0;
        samples.push((t1 - t0) / 2048);
      }
    }

    samples.sort((a, b) => a - b);
    samples = samples.slice(1, -1);

    return {
      // samples,
      min: samples[0],
      max: samples[samples.length - 1],
      p50: samples[(.50 * samples.length) | 0],
      p75: samples[(.75 * samples.length) | 0],
      p99: samples[(.99 * samples.length) | 0],
      p999: samples[(.999 * samples.length) | 0],
      avg: samples.reduce((a, b) => a + b, 0) / samples.length,
    };
  `,
  );

  const stats = !async ? b(fn, now) : await b(fn, now);
  return { stats, async, warmup: opts.warmup, generator };
}
