import {
  highRelativeMarginOfError,
  tTable,
  tatamiNgGroup,
} from '../../constants.js'
import { ratioStandardDeviation } from '../../stats-utils.js'
import { checkDividend } from '../../utils.js'
import {
  blue,
  bold,
  cyan,
  dim,
  gray,
  green,
  italic,
  magenta,
  red,
  white,
  yellow,
} from './clr.js'
import { duration, errorMargin, itersPerSecond, speedRatio } from './fmt.js'

export function size(names) {
  let size = 9
  for (const name of names) if (size < name.length) size = name.length

  return 2 + size
}

export function br({
  size,
  avg = true,
  iters = true,
  rmoe = true,
  min_max = true,
  percentiles = true,
}) {
  return `${'-'.repeat(
    size + 14 * avg + 14 * iters + 14 * rmoe + 24 * min_max
  )}${!percentiles ? '' : ` ${'-'.repeat(20 + 10 + 10 + 10)}`}`
}

export function benchmarkError(name, error, { size, colors = true }) {
  return `${name.padEnd(size, ' ')}${red(colors, 'error')}: ${
    error.message
  }${error.stack ? `\n${gray(colors, error.stack)}` : ''}`
}

export function units({ colors = true } = {}) {
  return dim(
    colors,
    white(
      colors,
      `
      1 ps = 1 picosecond = 1e-12s
      1 ns = 1 nanosecond = 1'000ps = 1e-9s
      1 μs = 1 microsecond = 1'000ns = 1'000'000ps = 1e-6s
      1 ms = 1 millisecond = 1'000μs = 1'000'000ns = 1e9ps = 1e-3s
    `
    )
  )
}

export function header(
  report,
  {
    size,
    avg = true,
    iters = true,
    colors = true,
    rmoe = true,
    min_max = true,
    percentiles = true,
  }
) {
  return `${dim(colors, white(colors, `cpu: ${report.cpu}`))}\n${dim(colors, white(colors, `runtime: ${report.runtime}`))}\n\n${'benchmark'.padEnd(size, ' ')}${
    !avg ? '' : 'time/iter'.padStart(14, ' ')
  }${!iters ? '' : 'iters/s'.padStart(14, ' ')}${
    !rmoe ? '' : 'error margin'.padStart(14, ' ')
  }${!min_max ? '' : '(min … max)'.padStart(24, ' ')}${
    !percentiles
      ? ''
      : ` ${'p50/median'.padStart(20, ' ')} ${'p75'.padStart(9, ' ')} ${'p99'.padStart(9, ' ')} ${'p995'.padStart(9, ' ')}`
  }`
}

export function groupHeader(
  name,
  opts = {
    size,
    avg: true,
    iters: true,
    colors: true,
    rmoe: true,
    min_max: true,
    percentiles: true,
  }
) {
  // biome-ignore lint/style/noParameterAssign: <explanation>
  if (name.startsWith(tatamiNgGroup)) name = italic(opts.colors, 'unnamed')
  return `• ${bold(opts.colors, name)}\n${dim(opts.colors, white(opts.colors, br(opts)))}`
}

export function benchmarkReport(
  name,
  stats,
  {
    size,
    avg = true,
    iters = true,
    colors = true,
    rmoe = true,
    min_max = true,
    percentiles = true,
  }
) {
  return `${name.padEnd(size, ' ')}${
    !avg
      ? ''
      : `${yellow(colors, duration(stats.avg))}`.padStart(14 + 10 * colors, ' ')
  }${
    !iters
      ? ''
      : `${yellow(colors, itersPerSecond(stats.iters))}`.padStart(
          14 + 10 * colors,
          ' '
        )
  }${
    !rmoe
      ? ''
      : `± ${(stats.rmoe > highRelativeMarginOfError ? red : blue)(colors, errorMargin(stats.rmoe))}`.padStart(
          14 + 10 * colors,
          ' '
        )
  }${
    !min_max
      ? ''
      : `(${cyan(colors, duration(stats.min))} … ${magenta(
          colors,
          duration(stats.max)
        )})`.padStart(24 + 2 * 10 * colors, ' ')
  }${
    !percentiles
      ? ''
      : ` ${
          stats.mad > 0
            ? `${green(colors, duration(stats.p50))} ± ${red(colors, duration(stats.mad))}`.padStart(
                20 + 2 * 10 * colors,
                ' '
              )
            : green(colors, duration(stats.p50)).padStart(20 + 10 * colors, ' ')
        } ${green(colors, duration(stats.p75)).padStart(9 + 10 * colors, ' ')} ${green(colors, duration(stats.p99)).padStart(9 + 10 * colors, ' ')} ${green(colors, duration(stats.p995)).padStart(9 + 10 * colors, ' ')}`
  }`
}

export function warning(benchmarks, { colors = true }) {
  if (benchmarks.some(benchmark => benchmark.error != null)) {
    throw new Error('Cannot display warning on benchmarks with error')
  }
  const warnings = []
  for (const benchmark of benchmarks) {
    if (benchmark.stats.ss === false) {
      warnings.push(
        `${bold(colors, yellow(colors, 'Warning'))}: ${bold(colors, cyan(colors, benchmark.name))} has a sample size below statistical significance: ${red(colors, benchmark.samples)}`
      )
    }
    if (benchmark.stats.rmoe > highRelativeMarginOfError) {
      warnings.push(
        `${bold(colors, yellow(colors, 'Warning'))}: ${bold(colors, cyan(colors, benchmark.name))} has a high relative margin of error: ${red(colors, errorMargin(benchmark.stats.rmoe))}`
      )
    }
    if (benchmark.stats.mad > 0) {
      warnings.push(
        `${bold(colors, yellow(colors, 'Warning'))}: ${bold(colors, cyan(colors, benchmark.name))} has a non zero median absolute deviation: ${red(colors, duration(benchmark.stats.mad))}`
      )
    }
  }
  return warnings.join('\n')
}

/**
 * Display summary of benchmarks.
 *
 * @param {Array} benchmarks - array of benchmarks
 */
export function summary(benchmarks, { colors = true }) {
  if (benchmarks.some(benchmark => benchmark.error != null)) {
    throw new Error('Cannot summarize benchmarks with error')
  }
  if (benchmarks.length < 2) {
    throw new Error('Cannot summarize less than two benchmarks')
  }
  benchmarks.sort(
    (benchmarkA, benchmarkB) => benchmarkA.stats.avg - benchmarkB.stats.avg
  )
  const baseline =
    benchmarks.find(benchmark => benchmark.baseline) ?? benchmarks[0]

  return `${`${
    baseline.group == null || baseline.group.startsWith(tatamiNgGroup)
      ? ''
      : `${bold(colors, white(colors, baseline.group.trim().split(/\s+/).length > 1 ? `'${baseline.group}'` : `${baseline.group}`))} `
  }${bold(colors, white(colors, 'summary'))}`}\n  ${bold(colors, cyan(colors, baseline.name))}${benchmarks
    .filter(benchmark => benchmark !== baseline)
    .map(benchmark => {
      const ratio = benchmark.stats.avg / checkDividend(baseline.stats.avg)
      const ratioSd = ratioStandardDeviation(
        benchmark.stats.avg,
        benchmark.stats.sd,
        baseline.stats.avg,
        baseline.stats.sd
      )
      const ratioSem =
        ratioSd /
        checkDividend(
          Math.sqrt(baseline.stats.samples + benchmark.stats.samples)
        )
      const critical =
        tTable[
          (baseline.stats.samples + benchmark.stats.samples - 1 || 1).toString()
        ] || tTable.infinity
      const ratioMoe = ratioSem * critical
      const ratioRmoe = (ratioMoe / checkDividend(ratio)) * 100
      return `\n    ${(1 > ratio ? red : green)(
        colors,
        1 > ratio ? speedRatio(1 / checkDividend(ratio)) : speedRatio(ratio)
      )} ± ${blue(colors, errorMargin(ratioRmoe))} times ${
        1 > ratio ? 'slower' : 'faster'
      } than ${bold(colors, cyan(colors, benchmark.name))}`
    })
    .join('')}`
}
