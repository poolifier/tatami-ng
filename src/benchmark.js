import {
  defaultSamples,
  defaultTime,
  emptyFunction,
  jsonOutputFormat,
  tatamiNgGroup,
} from './constants.js';
import {
  os,
  AsyncFunction,
  checkBenchmarkArgs,
  convertReportToBmf,
  cpu,
  measure,
  mergeDeepRight,
  noColor,
  overrideBenchmarkDefaults,
  version,
  writeFileSync,
} from './lib.js';
import { logger } from './logger.js';
import * as clr from './reporter/clr.js';
import * as table from './reporter/table.js';
import { runtime } from './runtime.js';

let groupName = null;
const groups = new Map();
const benchmarks = [];

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
      `expected string, object or function, got ${name.constructor.name}`,
    );
  if ([Function, AsyncFunction].includes(name.constructor)) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    cb = name;
  }
  if (![Function, AsyncFunction].includes(cb.constructor))
    throw new TypeError(`expected function, got ${cb.constructor.name}`);
  if (Object.prototype.toString.call(name).slice(8, -1) === 'Object') {
    if (name.name != null && 'string' !== typeof name.name)
      throw new TypeError(
        `expected string as 'name' option, got ${name.name.constructor.name}`,
      );
    if (name.summary != null && 'boolean' !== typeof name.summary)
      throw new TypeError(
        `expected boolean as 'summary' option, got ${name.summary.constructor.name}`,
      );
    if (
      name.before != null &&
      ![Function, AsyncFunction].includes(name.before.constructor)
    )
      throw new TypeError(
        `expected function as 'before' option, got ${name.before.constructor.name}`,
      );
    if (
      name.after != null &&
      ![Function, AsyncFunction].includes(name.after.constructor)
    )
      throw new TypeError(
        `expected function as 'after' option, got ${name.after.constructor.name}`,
      );
  }

  groupName =
    ('string' === typeof name ? name.trim() : name.name?.trim()) ||
    `${tatamiNgGroup}${groups.size + 1}`;
  if (!groups.has(groupName))
    groups.set(groupName, {
      summary: name.summary ?? true,
      before: name.before ?? emptyFunction,
      after: name.after ?? emptyFunction,
    });
  if (AsyncFunction === cb.constructor) {
    cb().then(() => {
      groupName = null;
    });
  } else {
    cb();
    groupName = null;
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
    fn = name;
    // biome-ignore lint/style/noParameterAssign: <explanation>
    name = fn.name;
  }
  checkBenchmarkArgs(fn, opts);
  // biome-ignore lint/style/noParameterAssign: <explanation>
  name = name.trim();

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
  });
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
    fn = name;
    // biome-ignore lint/style/noParameterAssign: <explanation>
    name = fn.name;
  }
  checkBenchmarkArgs(fn, opts);
  // biome-ignore lint/style/noParameterAssign: <explanation>
  name = name.trim();

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
  });
}

/**
 * Clear previously defined benchmarks.
 * Permits to define and run benchmarks in multiple steps.
 *
 * @example
 * group(() => {
 *   bench('foo1', () => {});
 *   baseline('bar1', () => {});
 * });
 * await run();
 * clear();
 * group(() => {
 *   bench('foo2', () => {});
 *   baseline('bar2', () => {});
 * });
 * await run();
 */
export function clear() {
  groups.clear();
  benchmarks.length = 0;
}

/**
 * Run defined benchmarks.
 *
 * @param {Object} [opts={}] options object
 * @param {Boolean} [opts.units=false] print units cheatsheet
 * @param {Boolean} [opts.silent=false] enable/disable stdout output
 * @param {Boolean|Number|'bmf'} [opts.json=false] enable/disable json output
 * @param {String} [opts.file=undefined] write json output to file
 * @param {Boolean} [opts.colors=true] enable/disable colors
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark time in nanoseconds
 * @param {Boolean} [opts.warmup=true] enable/disable benchmark warmup
 * @param {Boolean} [opts.avg=true] enable/disable time (avg) column
 * @param {Boolean} [opts.iter=true] enable/disable iter/s column
 * @param {Boolean} [opts.rmoe=true] enable/disable error margin column
 * @param {Boolean} [opts.min_max=true] enable/disable (min...max) column
 * @param {Boolean} [opts.percentiles=true] enable/disable percentile columns
 * @returns {Promise<Object>} defined benchmarks report
 */
export async function run(opts = {}) {
  if (Object.prototype.toString.call(opts).slice(8, -1) !== 'Object')
    throw new TypeError(`expected object, got ${opts.constructor.name}`);
  if (opts.samples != null && 'number' !== typeof opts.samples)
    throw new TypeError(
      `expected number as 'samples' option, got ${opts.samples.constructor.name}`,
    );
  if (opts.time != null && 'number' !== typeof opts.time)
    throw new TypeError(
      `expected number as 'time' option, got ${opts.time.constructor.name}`,
    );
  if (opts.warmup != null && 'boolean' !== typeof opts.warmup)
    throw new TypeError(
      `expected boolean as 'warmup' option, got ${opts.warmup.constructor.name}`,
    );
  if (
    opts.json != null &&
    'number' !== typeof opts.json &&
    'boolean' !== typeof opts.json &&
    'string' !== typeof opts.json
  )
    throw new TypeError(
      `expected number or boolean or string as 'json' option, got ${opts.json.constructor.name}`,
    );
  if (
    'string' === typeof opts.json &&
    !Object.values(jsonOutputFormat).includes(opts.json)
  )
    throw new TypeError(
      `expected one of ${Object.values(jsonOutputFormat).join(
        ', ',
      )} as 'json' option, got ${opts.json}`,
    );
  if (opts.file != null && 'string' !== typeof opts.file)
    throw new TypeError(
      `expected string as 'file' option, got ${opts.file.constructor.name}`,
    );
  if ('string' === typeof opts.file && opts.file.trim().length === 0)
    throw new TypeError(`expected non-empty string as 'file' option`);
  // biome-ignore lint/style/noParameterAssign: <explanation>
  opts = mergeDeepRight(
    {
      silent: false,
      colors: !noColor,
      size: table.size(benchmarks.map(benchmark => benchmark.name)),
    },
    opts,
  );

  const log = opts.silent === true ? emptyFunction : logger;

  const report = {
    benchmarks,
    cpu,
    runtime: `${runtime} ${version} (${os})`,
  };

  if (!opts.json && benchmarks.length > 0) {
    log(clr.gray(opts.colors, `cpu: ${report.cpu}`));
    log(clr.gray(opts.colors, `runtime: ${report.runtime}`));

    log('');
    log(table.header(opts));
    log(table.br(opts));
  }

  const noGroupBenchmarks = benchmarks.filter(
    benchmark => benchmark.group == null,
  );
  let first = false;
  for (const benchmark of noGroupBenchmarks) {
    overrideBenchmarkDefaults(benchmark, opts);
    first = true;
    try {
      benchmark.stats = await measure(
        benchmark.fn,
        benchmark.before,
        benchmark.after,
        {
          async: benchmark.async,
          samples: benchmark.samples,
          time: benchmark.time,
          warmup: benchmark.warmup,
        },
      );
      if (!opts.json)
        log(table.benchmark(benchmark.name, benchmark.stats, opts));
    } catch (err) {
      benchmark.error = err;
      if (!opts.json)
        log(table.benchmarkError(benchmark.name, benchmark.error, opts));
    }
  }

  if (!opts.json && noGroupBenchmarks.length > 0) {
    log('');
    log(table.summary(noGroupBenchmarks, opts));
  }

  for (const [group, groupOpts] of groups) {
    if (!opts.json) {
      if (first) log('');
      if (!group.startsWith(tatamiNgGroup)) log(`• ${group}`);
      if (first || !group.startsWith(tatamiNgGroup))
        log(clr.gray(opts.colors, table.br(opts)));
    }

    AsyncFunction === groupOpts.before.constructor
      ? await groupOpts.before()
      : groupOpts.before();

    const groupBenchmarks = benchmarks.filter(
      benchmark => benchmark.group === group,
    );
    for (const benchmark of groupBenchmarks) {
      overrideBenchmarkDefaults(benchmark, opts);
      first = true;
      try {
        benchmark.stats = await measure(
          benchmark.fn,
          benchmark.before,
          benchmark.after,
          {
            async: benchmark.async,
            samples: benchmark.samples,
            time: benchmark.time,
            warmup: benchmark.warmup,
          },
        );
        if (!opts.json)
          log(table.benchmark(benchmark.name, benchmark.stats, opts));
      } catch (err) {
        benchmark.error = err;
        if (!opts.json)
          log(table.benchmarkError(benchmark.name, benchmark.error, opts));
      }
    }

    AsyncFunction === groupOpts.after.constructor
      ? await groupOpts.after()
      : groupOpts.after();

    if (
      groupOpts.summary === true &&
      !opts.json &&
      groupBenchmarks.length > 0
    ) {
      log('');
      log(table.summary(groupBenchmarks, opts));
    }
  }

  if (!opts.json && opts.units) log(table.units(opts));
  if (opts.json) {
    let jsonReport;
    switch (opts.json) {
      case jsonOutputFormat.bmf:
        jsonReport = JSON.stringify(convertReportToBmf(report));
        break;
      default:
        jsonReport = JSON.stringify(
          report,
          undefined,
          'number' !== typeof opts.json ? 0 : opts.json,
        );
    }
    log(jsonReport);
    if (opts.file) writeFileSync(opts.file, jsonReport);
  }

  return JSON.parse(JSON.stringify(report));
}
