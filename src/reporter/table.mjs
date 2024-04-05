import * as clr from './clr.mjs';
import { duration } from './fmt.mjs';

export function size(names) {
  let max = 9;
  for (const name of names) if (max < name.length) max = name.length;

  return 2 + max;
}

export function br({ size, avg = true, min_max = true, percentiles = true }) {
  return (
    '-'.repeat(size + 14 * avg + 24 * min_max) +
    (!percentiles ? '' : ` ${'-'.repeat(9 + 10 + 10)}`)
  );
}

export function benchmark_error(
  n,
  e,
  { size, avg = true, colors = true, min_max = true, percentiles = true },
) {
  return `${n.padEnd(size, ' ')}${clr.red(colors, 'error')}: ${e.message}${
    e.stack ? `\n${clr.gray(colors, e.stack)}` : ''
  }`;
}

export function units({ colors = true } = {}) {
  return clr.gray(
    colors,
    `
      1 ps = 1 picosecond = 1e-12s
      1 ns = 1 nanosecond = 0.000000001s
      1 μs = 1 microsecond = 1'000ns = 0.000001s
      1 ms = 1 millisecond = 1'000μs = 1'000'000ns = 0.001s
    `,
  );
}

export function header({
  size,
  avg = true,
  min_max = true,
  percentiles = true,
}) {
  return (
    'benchmark'.padEnd(size, ' ') +
    (!avg ? '' : 'time (avg)'.padStart(14, ' ')) +
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
  n,
  b,
  { size, avg = true, colors = true, min_max = true, percentiles = true },
) {
  return (
    n.padEnd(size, ' ') +
    (!avg
      ? ''
      : `${clr.yellow(colors, duration(b.avg))}/iter`.padStart(
          14 + 10 * colors,
          ' ',
        )) +
    (!min_max
      ? ''
      : `(${clr.cyan(colors, duration(b.min))} … ${clr.magenta(
          colors,
          duration(b.max),
        )})`.padStart(24 + 2 * 10 * colors, ' ')) +
    (!percentiles
      ? ''
      : ` ${clr
          .gray(colors, duration(b.p75))
          .padStart(9 + 10 * colors, ' ')} ${clr
          .gray(colors, duration(b.p99))
          .padStart(9 + 10 * colors, ' ')} ${clr
          .gray(colors, duration(b.p999))
          .padStart(9 + 10 * colors, ' ')}`) +
    (0 !== b.min && b.avg > 0.25 ? '' : ` ${clr.red(colors, '!')}`)
  );
}

export function summary(benchmarks, { colors = true } = {}) {
  // biome-ignore lint/style/noParameterAssign: <explanation>
  benchmarks = benchmarks.filter(b => b.error == null);
  benchmarks.sort((a, b) => a.stats.avg - b.stats.avg);
  const baseline = benchmarks.find(b => b.baseline) ?? benchmarks[0];

  return `${
    clr.bold(colors, 'summary') +
    (null == baseline.group || baseline.group.startsWith?.('$mitata_group')
      ? ''
      : clr.gray(colors, ` for ${baseline.group}`))
  }\n  ${clr.bold(colors, clr.cyan(colors, baseline.name))}${benchmarks
    .filter(b => b !== baseline)
    .map(b => {
      const diff = Number(((1 / baseline.stats.avg) * b.stats.avg).toFixed(2));
      const inv_diff = Number(
        ((1 / b.stats.avg) * baseline.stats.avg).toFixed(2),
      );
      return `\n   ${clr[1 > diff ? 'red' : 'green'](
        colors,
        1 <= diff ? diff : inv_diff,
      )}x ${1 > diff ? 'slower' : 'faster'} than ${clr.bold(
        colors,
        clr.cyan(colors, b.name),
      )}`;
    })
    .join('')}`;
}
