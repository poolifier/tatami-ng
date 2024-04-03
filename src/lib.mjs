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

// doesn't actually support generators yet (1.0.0 feature)
export function measure(fn, ctx, _ = {}) {
  if (
    !(
      fn instanceof Function ||
      fn instanceof AsyncFunction ||
      fn instanceof GeneratorFunction ||
      fn instanceof AsyncGeneratorFunction
    )
  )
    throw new Error('fn must be a function or generator');

  if (!_.spc) {
    const t0 = now();

    _.spc = true;
    const r = fn();
    _.t = now() - t0;
    if (r instanceof Promise)
      return r.then(
        // biome-ignore lint/suspicious/noAssignInExpressions: <explanation>
        // biome-ignore lint/style/noCommaOperator: <explanation>
        () => ((_.a = true), (_.t = now() - t0), measure(fn, ctx, _)),
      );
  }

  _.t ??= 0;
  ctx.warmup =
    false === ctx.warmup ? false : { samples: ctx.warmup?.samples ?? 128 };
  const async =
    _.a ?? [AsyncFunction, AsyncGeneratorFunction].includes(fn.constructor);
  const generator = [GeneratorFunction, AsyncGeneratorFunction].includes(
    fn.constructor,
  );

  const b = new (!async ? Function : AsyncFunction)(
    '$fn',
    '$now',
    `
    let $w = ${_.t};

    ${
      !ctx.warmup
        ? ''
        : (() => {
            if (_.t > 250_000_000) return '';

            return `
              warmup: {
                const samples = new Array(${ctx.warmup.samples - 1});

                for (let o = 0; o < ${ctx.warmup.samples - 1}; o++) {
                  const t0 = $now();
                  const t1 = (${!async ? '' : 'await'} $fn(), $now());

                  samples[o] = t1 - t0;
                }

                $w = (samples.sort((a, b) => a - b), samples[1]);
              }
            `;
          })()
    }

    let s = 0;
    let t = 600_000_000;
    let samples = new Array;

    if ($w > 10_000) {
      while (s < t || 10 > samples.length) {
        const t0 = $now();
        const t1 = (${!async ? '' : 'await'} $fn(), $now());

        s += samples[samples.push(t1 - t0) - 1];
      }
    }

    else {
      while (s < t || 128 > samples.length) {
        const t0 = $now();

        for (let o = 0; o < 256; o++) {
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

  const stats = b(fn, now);
  return stats instanceof Promise
    ? stats.then(stats => ({ stats, async, warmup: ctx.warmup, generator }))
    : { stats, async, warmup: ctx.warmup, generator };
}
