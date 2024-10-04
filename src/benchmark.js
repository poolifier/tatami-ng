import {
  defaultSamples,
  defaultTime,
  emptyFunction,
  jsonOutputFormat,
  tatamiNgGroup,
} from './constants.js'
import {
  os,
  checkBenchmarkArgs,
  colors,
  cpuModel,
  gc,
  measure,
  overrideBenchmarkOptions,
  version,
  writeFileSync,
} from './lib.js'
import { logger } from './logger.js'
import { bmf } from './reporter/json/index.js'
import {
  benchmarkError,
  benchmarkReport,
  br,
  groupHeader,
  header,
  size,
  summary,
  units,
  warning,
} from './reporter/terminal/index.js'
import { runtime } from './runtime.js'
import { now } from './time.js'
import { isAsyncFunction, isFunction, isObject } from './utils.js'

let groupName = null
const groups = new Map()
const benchmarks = []

/**
 * @callback CallbackType
 * @returns {void|Promise<void>}
 */

/**
 * @callback NowType
 * @returns {number}
 */

/**
 * Define a group of benchmarks.
 *
 * @param {String|Object|CallbackType} name name of the group or options object or callback function
 * @param {String} [name.name] name of the group
 * @param {Boolean} [name.summary=true] display summary
 * @param {Number} [name.samples=128] minimum number of benchmark samples
 * @param {Number} [name.time=1_000_000_000] minimum benchmark execution time in nanoseconds
 * @param {Boolean|Number} [name.warmup=true] enable/disable benchmark warmup or set benchmark warmup run(s)
 * @param {NowType} [name.now=undefined] custom nanoseconds timestamp function to replace default one
 * @param {CallbackType} [name.before=()=>{}] before hook
 * @param {CallbackType} [name.after=()=>{}] after hook
 * @param {CallbackType} [cb] callback function
 */
export function group(name, cb = undefined) {
  if (
    name != null &&
    'string' !== typeof name &&
    !isObject(name) &&
    !isFunction(name)
  )
    throw new TypeError(
      `expected string, object or function, got ${name.constructor.name}`
    )
  if (isFunction(name)) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    cb = name
  }
  if (!isFunction(cb))
    throw new TypeError(`expected function, got ${cb.constructor.name}`)
  if (isObject(name)) {
    if (name.name != null && 'string' !== typeof name.name)
      throw new TypeError(
        `expected string as 'name' option, got ${name.name.constructor.name}`
      )
    if (name.summary != null && 'boolean' !== typeof name.summary)
      throw new TypeError(
        `expected boolean as 'summary' option, got ${name.summary.constructor.name}`
      )
    if (name.samples != null && 'number' !== typeof name.samples)
      throw new TypeError(
        `expected number as 'samples' option, got ${name.samples.constructor.name}`
      )
    if (name.time != null && 'number' !== typeof name.time)
      throw new TypeError(
        `expected number as 'time' option, got ${name.time.constructor.name}`
      )
    if (
      name.warmup != null &&
      'number' !== typeof name.warmup &&
      'boolean' !== typeof name.warmup
    )
      throw new TypeError(
        `expected number or boolean as 'warmup' option, got ${name.warmup.constructor.name}`
      )
    if (name.now != null && Function !== name.now.constructor)
      throw new TypeError(
        `expected function as 'now' option, got ${name.now.constructor.name}`
      )
    if (name.before != null && !isFunction(name.before))
      throw new TypeError(
        `expected function as 'before' option, got ${name.before.constructor.name}`
      )
    if (name.after != null && !isFunction(name.after))
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
      samples: name.samples ?? defaultSamples,
      time: name.time ?? defaultTime,
      warmup: name.warmup ?? true,
      now: name.now ?? now,
      before: name.before ?? emptyFunction,
      after: name.after ?? emptyFunction,
    })
  if (isAsyncFunction(cb)) {
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
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark execution time in nanoseconds
 * @param {Boolean|Number} [opts.warmup=true] enable/disable benchmark warmup or set benchmark warmup run(s)
 * @param {NowType} [opts.now=undefined] custom nanoseconds timestamp function to replace default one
 * @param {CallbackType} [opts.before=()=>{}] before hook
 * @param {CallbackType} [opts.after=()=>{}] after hook
 */
export function bench(name, fn = undefined, opts = {}) {
  if (isFunction(name)) {
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
    now: opts.now ?? now,
    group: groupName,
    time: opts.time ?? defaultTime,
    samples: opts.samples ?? defaultSamples,
    warmup: opts.warmup ?? true,
    baseline: false,
    async: isAsyncFunction(fn),
  })
}

/**
 * Define a baseline benchmark.
 * Baseline benchmarks are used as a reference to compare other benchmarks.
 *
 * @param {String|CallbackType} name name of the baseline benchmark or baseline benchmark function
 * @param {CallbackType} [fn] baseline benchmark function
 * @param {Object} [opts={}] options object
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark execution time in nanoseconds
 * @param {Boolean|Number} [opts.warmup=true] enable/disable benchmark warmup or set benchmark warmup run(s)
 * @param {NowType} [opts.now=undefined] custom nanoseconds timestamp function to replace default one
 * @param {CallbackType} [opts.before=()=>{}] before hook
 * @param {CallbackType} [opts.after=()=>{}] after hook
 */
export function baseline(name, fn = undefined, opts = {}) {
  if (isFunction(name)) {
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
    now: opts.now ?? now,
    group: groupName,
    time: opts.time ?? defaultTime,
    samples: opts.samples ?? defaultSamples,
    warmup: opts.warmup ?? true,
    baseline: true,
    async: isAsyncFunction(fn),
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
    overrideBenchmarkOptions(benchmark, groupOpts)
    overrideBenchmarkOptions(benchmark, opts)
    try {
      gc()
      benchmark.stats = await measure(benchmark.fn, {
        async: benchmark.async,
        samples: benchmark.samples,
        time: benchmark.time,
        warmup: benchmark.warmup,
        now: benchmark.now,
        before: benchmark.before,
        after: benchmark.after,
      })
      if (!opts.json)
        logFn(benchmarkReport(benchmark.name, benchmark.stats, opts))
    } catch (err) {
      benchmark.error = err
      if (!opts.json)
        logFn(benchmarkError(benchmark.name, benchmark.error, opts))
    }
  }
  // biome-ignore lint/style/noParameterAssign: <explanation>
  benchmarks = benchmarks.filter(benchmark => benchmark.error == null)
  if (!opts.json && warning(benchmarks, opts)) {
    logFn('')
    logFn(warning(benchmarks, opts))
  }
  if (
    (Object.keys(groupOpts).length === 0 || groupOpts.summary === true) &&
    !opts.json &&
    benchmarks.length > 1
  ) {
    logFn('')
    logFn(summary(benchmarks, opts))
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
 * @param {NowType} [opts.now=undefined] custom nanoseconds timestamp function to replace default one
 * @param {Boolean} [opts.colors=true] enable/disable colors
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark execution time in nanoseconds
 * @param {Boolean|Number} [opts.warmup=true] enable/disable benchmark warmup or set benchmark warmup run(s)
 * @param {Boolean} [opts.latency=true] enable/disable time/iter column
 * @param {Boolean} [opts.throughput=true] enable/disable iters/s column
 * @param {Boolean} [opts.latencyMinMax=true] enable/disable latency (min...max) column
 * @param {Boolean} [opts.latencyPercentiles=true] enable/disable latency percentile columns
 * @returns {Promise<Object>} defined benchmarks report
 */
export async function run(opts = {}) {
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
  if (opts.now != null && Function !== opts.now.constructor)
    throw new TypeError(
      `expected function as 'now' option, got ${opts.now.constructor.name}`
    )

  opts.silent = opts.silent ?? false
  opts.units = opts.units ?? false
  opts.colors = opts.colors ?? colors
  opts.size = size(benchmarks.map(benchmark => benchmark.name))

  const log = opts.silent === true ? emptyFunction : logger

  const report = {
    benchmarks,
    cpu: `${cpuModel}`,
    runtime: `${runtime} ${version} (${os})`,
  }

  if (!opts.json && benchmarks.length > 0) {
    log(header(report, opts))
    log(br(opts))
  }

  let once = await executeBenchmarks(
    benchmarks.filter(benchmark => benchmark.group == null),
    log,
    opts
  )

  for (const [groupName, groupOpts] of groups) {
    if (!opts.json) {
      if (once) log('')
      log(groupHeader(groupName, opts))
    }

    isAsyncFunction(groupOpts.before)
      ? await groupOpts.before()
      : groupOpts.before()

    once = await executeBenchmarks(
      benchmarks.filter(benchmark => benchmark.group === groupName),
      log,
      opts,
      groupOpts
    )

    isAsyncFunction(groupOpts.after)
      ? await groupOpts.after()
      : groupOpts.after()
  }

  if (!opts.json && opts.units) log(units(opts))
  if (opts.json || opts.file) {
    let jsonReport
    switch (opts.json) {
      case jsonOutputFormat.bmf:
        jsonReport = JSON.stringify(bmf(report))
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
