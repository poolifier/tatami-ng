import { tatamiNgGroup } from '../constants.mjs';
import * as clr from './clr.mjs';
import { duration } from './fmt.mjs';

export function size(names) {
  let size = 9;
  for (const name of names) if (size < name.length) size = name.length;

  return 2 + size;
}

export function br({
  size,
  avg = true,
  iter = true,
  min_max = true,
  percentiles = true,
}) {
  return (
    '-'.repeat(size + 14 * avg + 14 * iter + 24 * min_max) +
    (!percentiles ? '' : ` ${'-'.repeat(9 + 10 + 10)}`)
  );
}

export function benchmarkError(name, error, { size, colors = true }) {
  return `${name.padEnd(size, ' ')}${clr.red(colors, 'error')}: ${
    error.message
  }${error.stack ? `\n${clr.gray(colors, error.stack)}` : ''}`;
}

export function units({ colors = true } = {}) {
  return clr.gray(
    colors,
    `
      1 ps = 1 picosecond = 1e-12s
      1 ns = 1 nanosecond = 1'000ps = 1e-9s
      1 μs = 1 microsecond = 1'000ns = 1'000'000ps = 1e-6s
      1 ms = 1 millisecond = 1'000μs = 1'000'000ns = 1e-9ps = 1e-3s
    `,
  );
}

export function header({
  size,
  avg = true,
  iter = true,
  min_max = true,
  percentiles = true,
}) {
  return (
    'benchmark'.padEnd(size, ' ') +
    (!avg ? '' : 'time (avg)'.padStart(14, ' ')) +
    (!iter ? '' : 'iter/s'.padStart(14, ' ')) +
    (!min_max ? '' : '(min … max)'.padStart(24, ' ')) +
    (!percentiles
      ? ''
      : ` ${'p75'.padStart(9, ' ')} ${'p99'.padStart(9, ' ')} ${'p999'.padStart(
          9,
          ' ',
        )}`)
  );
}

export function benchmark(
  name,
  stats,
  {
    size,
    avg = true,
    iter = true,
    colors = true,
    min_max = true,
    percentiles = true,
  },
) {
  return (
    name.padEnd(size, ' ') +
    (!avg
      ? ''
      : `${clr.yellow(colors, duration(stats.avg))}/iter`.padStart(
          14 + 10 * colors,
          ' ',
        )) +
    (!iter
      ? ''
      : `${clr.yellow(colors, stats.iter.toFixed(2))}`.padStart(
          14 + 10 * colors,
          ' ',
        )) +
    (!min_max
      ? ''
      : `(${clr.cyan(colors, duration(stats.min))} … ${clr.magenta(
          colors,
          duration(stats.max),
        )})`.padStart(24 + 2 * 10 * colors, ' ')) +
    (!percentiles
      ? ''
      : ` ${clr
          .gray(colors, duration(stats.p75))
          .padStart(9 + 10 * colors, ' ')} ${clr
          .gray(colors, duration(stats.p99))
          .padStart(9 + 10 * colors, ' ')} ${clr
          .gray(colors, duration(stats.p999))
          .padStart(9 + 10 * colors, ' ')}`) +
    // Statistical significance
    (stats.samples > 100 ? '' : ` ${clr.red(colors, '!')}`)
  );
}

export function summary(benchmarks, { colors = true }) {
  // biome-ignore lint/style/noParameterAssign: <explanation>
  benchmarks = benchmarks.filter(benchmark => benchmark.error == null);
  benchmarks.sort(
    (benchmarkA, benchmarkB) => benchmarkA.stats.avg - benchmarkB.stats.avg,
  );
  const baseline =
    benchmarks.find(benchmark => benchmark.baseline) ?? benchmarks[0];

  return `${
    clr.bold(colors, 'summary') +
    (baseline.group == null || baseline.group.startsWith(tatamiNgGroup)
      ? ''
      : clr.gray(colors, ` for ${baseline.group}`))
  }\n  ${clr.bold(colors, clr.cyan(colors, baseline.name))}${benchmarks
    .filter(benchmark => benchmark !== baseline)
    .map(benchmark => {
      const diff = Number(
        ((1 / baseline.stats.avg) * benchmark.stats.avg).toFixed(2),
      );
      const invDiff = Number(
        ((1 / benchmark.stats.avg) * baseline.stats.avg).toFixed(2),
      );
      return `\n   ${clr[1 > diff ? 'red' : 'green'](
        colors,
        1 <= diff ? diff : invDiff,
      )}x ${1 > diff ? 'slower' : 'faster'} than ${clr.bold(
        colors,
        clr.cyan(colors, benchmark.name),
      )}`;
    })
    .join('')}`;
}
