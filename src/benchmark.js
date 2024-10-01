import {
  defaultSamples,
  defaultTime,
  emptyFunction,
  jsonOutputFormat,
  tatamiNgGroup,
} from './constants.js'
import {
  os,
  AsyncFunction,
  checkBenchmarkArgs,
  colors,
  convertReportToBmf,
  cpuModel,
  gc,
  measure,
  mergeDeepRight,
  overrideBenchmarkDefaults,
  version,
  writeFileSync,
} from './lib.js'
import { logger } from './logger.js'
import * as clr from './reporter/clr.js'
import * as table from './reporter/table.js'
import { runtime } from './runtime.js'

let groupName = null
const groups = new Map()
const benchmarks = []

/**
 * @callback CallbackType
 * @returns {void|Promise<void>}
 */

/**
 * Define a group of benchmarks.
 *
 * @param {String|Object|CallbackType} name name of the group or options object or callback function
 * @param {String} [name.name] name of the group
 * @param {Boolean} [name.summary=true] display summary
 * @param {CallbackType} [name.before=()=>{}] before hook
 * @param {CallbackType} [name.after=()=>{}] after hook
 * @param {CallbackType} [cb] callback function
 */
export function group(name, cb = undefined) {
  if (
    name != null &&
    'string' !== typeof name &&
    Object.prototype.toString.call(name).slice(8, -1) !== 'Object' &&
    ![Function, AsyncFunction].includes(name.constructor)
  )
    throw new TypeError(
      `expected string, object or function, got ${name.constructor.name}`
    )
  if ([Function, AsyncFunction].includes(name.constructor)) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    cb = name
  }
  if (![Function, AsyncFunction].includes(cb.constructor))
    throw new TypeError(`expected function, got ${cb.constructor.name}`)
  if (Object.prototype.toString.call(name).slice(8, -1) === 'Object') {
    if (name.name != null && 'string' !== typeof name.name)
      throw new TypeError(
        `expected string as 'name' option, got ${name.name.constructor.name}`
      )
    if (name.summary != null && 'boolean' !== typeof name.summary)
      throw new TypeError(
        `expected boolean as 'summary' option, got ${name.summary.constructor.name}`
      )
    if (
      name.before != null &&
      ![Function, AsyncFunction].includes(name.before.constructor)
    )
      throw new TypeError(
        `expected function as 'before' option, got ${name.before.constructor.name}`
      )
    if (
      name.after != null &&
      ![Function, AsyncFunction].includes(name.after.constructor)
    )
      throw new TypeError(
        `expected function as 'after' option, got ${name.after.constructor.name}`
      )
  }

  groupName =
    ('string' === typeof name ? name.trim() : name.name?.trim()) ||
    `${tatamiNgGroup}${groups.size + 1}`
  if (!groups.has(groupName))
    groups.set(groupName, {
      summary: name.summary ?? true,
      before: name.before ?? emptyFunction,
      after: name.after ?? emptyFunction,
    })
  if (AsyncFunction === cb.constructor) {
    cb().then(() => {
      groupName = null
    })
  } else {
    cb()
    groupName = null
  }
}

/**
 * Define a benchmark.
 *
 * @param {String|CallbackType} name name of the benchmark or benchmark function
 * @param {CallbackType} [fn] benchmark function
 * @param {Object} [opts={}] options object
 * @param {CallbackType} [opts.before=()=>{}] before hook
 * @param {CallbackType} [opts.after=()=>{}] after hook
 */
export function bench(name, fn = undefined, opts = {}) {
  if ([Function, AsyncFunction].includes(name.constructor)) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    fn = name
    // biome-ignore lint/style/noParameterAssign: <explanation>
    name = fn.name
  }
  checkBenchmarkArgs(fn, opts)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  name = name.trim()

  benchmarks.push({
    before: opts.before ?? emptyFunction,
    fn,
    after: opts.after ?? emptyFunction,
    name,
    group: groupName,
    time: defaultTime,
    samples: defaultSamples,
    warmup: true,
    baseline: false,
    async: AsyncFunction === fn.constructor,
  })
}

/**
 * Define a baseline benchmark.
 * Baseline benchmarks are used as a reference to compare other benchmarks.
 *
 * @param {String|CallbackType} name name of the baseline benchmark or baseline benchmark function
 * @param {CallbackType} [fn] baseline benchmark function
 * @param {Object} [opts={}] options object
 * @param {CallbackType} [opts.before=()=>{}] before hook
 * @param {CallbackType} [opts.after=()=>{}] after hook
 */
export function baseline(name, fn = undefined, opts = {}) {
  if ([Function, AsyncFunction].includes(name.constructor)) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    fn = name
    // biome-ignore lint/style/noParameterAssign: <explanation>
    name = fn.name
  }
  checkBenchmarkArgs(fn, opts)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  name = name.trim()

  benchmarks.push({
    before: opts.before ?? emptyFunction,
    fn,
    after: opts.after ?? emptyFunction,
    name,
    group: groupName,
    time: defaultTime,
    samples: defaultSamples,
    warmup: true,
    baseline: true,
    async: AsyncFunction === fn.constructor,
  })
}

/**
 * Clear previously defined benchmarks.
 */
function clear() {
  groups.clear()
  benchmarks.length = 0
}

const executeBenchmarks = async (
  benchmarks,
  logFn,
  opts = {},
  groupOpts = {}
) => {
  let once = false
  for (const benchmark of benchmarks) {
    once = true
    overrideBenchmarkDefaults(benchmark, opts)
    try {
      gc()
      benchmark.stats = await measure(
        benchmark.fn,
        benchmark.before,
        benchmark.after,
        {
          async: benchmark.async,
          samples: benchmark.samples,
          time: benchmark.time,
          warmup: benchmark.warmup,
        }
      )
      if (!opts.json)
        logFn(table.benchmark(benchmark.name, benchmark.stats, opts))
    } catch (err) {
      benchmark.error = err
      if (!opts.json)
        logFn(table.benchmarkError(benchmark.name, benchmark.error, opts))
    }
  }
  // biome-ignore lint/style/noParameterAssign: <explanation>
  benchmarks = benchmarks.filter(benchmark => benchmark.error == null)
  if (table.warning(benchmarks, opts)) {
    logFn('')
    logFn(table.warning(benchmarks, opts))
  }
  if (
    (Object.keys(groupOpts).length === 0 || groupOpts.summary === true) &&
    !opts.json &&
    benchmarks.length > 1
  ) {
    logFn('')
    logFn(table.summary(benchmarks, opts))
  }
  return once
}

/**
 * Run defined benchmarks.
 *
 * @param {Object} [opts={}] options object
 * @param {Boolean} [opts.units=false] print units cheatsheet
 * @param {Boolean} [opts.silent=false] enable/disable stdout output
 * @param {Boolean|Number|'bmf'} [opts.json=false] enable/disable json output or set json output format
 * @param {String} [opts.file=undefined] write json output to file
 * @param {Boolean} [opts.colors=true] enable/disable colors
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark execution time in nanoseconds
 * @param {Boolean|Number} [opts.warmup=true] enable/disable benchmark warmup or set benchmark warmup run(s)
 * @param {Boolean} [opts.avg=true] enable/disable time/iter average column
 * @param {Boolean} [opts.iters=true] enable/disable iters/s column
 * @param {Boolean} [opts.rmoe=true] enable/disable error margin column
 * @param {Boolean} [opts.min_max=true] enable/disable (min...max) column
 * @param {Boolean} [opts.percentiles=true] enable/disable percentile columns
 * @returns {Promise<Object>} defined benchmarks report
 */
export async function run(opts = {}) {
  if (Object.prototype.toString.call(opts).slice(8, -1) !== 'Object')
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
  if (
    opts.json != null &&
    'number' !== typeof opts.json &&
    'boolean' !== typeof opts.json &&
    'string' !== typeof opts.json
  )
    throw new TypeError(
      `expected number or boolean or string as 'json' option, got ${opts.json.constructor.name}`
    )
  if (
    'string' === typeof opts.json &&
    !Object.values(jsonOutputFormat).includes(opts.json)
  )
    throw new TypeError(
      `expected one of ${Object.values(jsonOutputFormat).join(
        ', '
      )} as 'json' option, got ${opts.json}`
    )
  if (opts.file != null && 'string' !== typeof opts.file)
    throw new TypeError(
      `expected string as 'file' option, got ${opts.file.constructor.name}`
    )
  if ('string' === typeof opts.file && opts.file.trim().length === 0)
    throw new TypeError(`expected non-empty string as 'file' option`)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  opts = mergeDeepRight(
    {
      silent: false,
      colors,
      size: table.size(benchmarks.map(benchmark => benchmark.name)),
    },
    opts
  )

  const log = opts.silent === true ? emptyFunction : logger

  const report = {
    benchmarks,
    cpu: `${cpuModel}`,
    runtime: `${runtime} ${version} (${os})`,
  }

  if (!opts.json && benchmarks.length > 0) {
    log(clr.dim(opts.colors, clr.white(opts.colors, `cpu: ${report.cpu}`)))
    log(
      clr.dim(opts.colors, clr.white(opts.colors, `runtime: ${report.runtime}`))
    )

    log('')
    log(table.header(opts))
    log(table.br(opts))
  }

  let once = await executeBenchmarks(
    benchmarks.filter(benchmark => benchmark.group == null),
    log,
    opts
  )

  for (const [group, groupOpts] of groups) {
    if (!opts.json) {
      if (once) log('')
      if (!group.startsWith(tatamiNgGroup))
        log(`• ${clr.bold(opts.colors, group)}`)
      if (once || !group.startsWith(tatamiNgGroup))
        log(clr.dim(opts.colors, clr.white(opts.colors, table.br(opts))))
    }

    AsyncFunction === groupOpts.before.constructor
      ? await groupOpts.before()
      : groupOpts.before()

    once = await executeBenchmarks(
      benchmarks.filter(benchmark => benchmark.group === group),
      log,
      opts,
      groupOpts
    )

    AsyncFunction === groupOpts.after.constructor
      ? await groupOpts.after()
      : groupOpts.after()
  }

  if (!opts.json && opts.units) log(table.units(opts))
  if (opts.json || opts.file) {
    let jsonReport
    switch (opts.json) {
      case jsonOutputFormat.bmf:
        jsonReport = JSON.stringify(convertReportToBmf(report))
        break
      default:
        jsonReport = JSON.stringify(
          report,
          undefined,
          'number' !== typeof opts.json ? 0 : opts.json
        )
    }
    if (opts.json) log(jsonReport)
    if (opts.file) writeFileSync(opts.file, jsonReport)
  }

  const clonedReport = JSON.parse(JSON.stringify(report))
  clear()
  return clonedReport
}
