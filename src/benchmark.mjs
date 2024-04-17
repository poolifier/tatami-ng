import {
  defaultSamples,
  defaultTime,
  emptyFunction,
  tatamiNgGroup,
} from './constants.mjs';
import {
  os,
  AsyncFunction,
  checkBenchmarkArgs,
  cpu,
  measure,
  mergeDeepRight,
  noColor,
  version,
} from './lib.mjs';
import { logger } from './logger.mjs';
import * as clr from './reporter/clr.mjs';
import * as table from './reporter/table.mjs';
import { runtime } from './runtime.mjs';

let groupName = null;
const groups = new Map();
const benchmarks = [];

/**
 * Define a group of benchmarks.
 *
 * @param {String|Object|Function} name name of the group or options object or callback function
 * @param {String} [name.name] name of the group
 * @param {Boolean} [name.summary=true] display summary
 * @param {Function} [name.before=()=>{}] before hook
 * @param {Function} [name.after=()=>{}] after hook
 * @param {Function} [cb] callback function
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
  cb();
  groupName = null;
}

/**
 * Define a benchmark.
 *
 * @param {String|Function} name name of the benchmark or benchmark function
 * @param {Function} [fn] benchmark function
 * @param {Object} [opts={}] options object
 * @param {Boolean} [opts.warmup=true] warmup
 * @param {Function} [opts.before=()=>{}] before hook
 * @param {Function} [opts.after=()=>{}] after hook
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
    warmup: opts.warmup ?? true,
    samples: defaultSamples,
    baseline: false,
    async: AsyncFunction === fn.constructor,
  });
}

/**
 * Define a baseline benchmark.
 * Baseline benchmarks are used as a reference to compare other benchmarks.
 *
 * @param {String|Function} name name of the baseline benchmark or baseline benchmark function
 * @param {Function} [fn] baseline benchmark function
 * @param {Object} [opts={}] options object
 * @param {Boolean} [opts.warmup=true] warmup
 * @param {Function} [opts.before=()=>{}] before hook
 * @param {Function} [opts.after=()=>{}] after hook
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
    warmup: opts.warmup ?? true,
    samples: defaultSamples,
    baseline: true,
    async: AsyncFunction === fn.constructor,
  });
}

/**
 * Clear all benchmarks.
 * Permits to define and run benchmarks in multiple steps.
 *
 * @example
 * group(() => {
 *   bench('foo1()', () => {});
 *   baseline('bar1()', () => {});
 * });
 * await run();
 * clear();
 * group(() => {
 *   bench('foo2()', () => {});
 *   baseline('bar2()', () => {});
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
 * @param {Boolean|Number} [opts.json=false] enable/disable json output
 * @param {Boolean} [opts.colors=true] enable/disable colors
 * @param {Number} [opts.samples=128] minimum number of benchmark samples
 * @param {Number} [opts.time=1_000_000_000] minimum benchmark time in nanoseconds
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
  if (
    opts.json != null &&
    'number' !== typeof opts.json &&
    'boolean' !== typeof opts.json
  )
    throw new TypeError(
      `expected number or boolean as 'json' option, got ${opts.json.constructor.name}`,
    );
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

  let baseline = false;
  let first = false;
  for (const benchmark of benchmarks) {
    if (benchmark.group) continue;
    if (benchmark.baseline) baseline = true;

    benchmark.samples = opts.samples ?? benchmark.samples;
    benchmark.time = opts.time ?? benchmark.time;
    first = true;
    try {
      benchmark.stats = await measure(
        benchmark.fn,
        benchmark.before,
        benchmark.after,
        {
          async: benchmark.async,
          warmup: benchmark.warmup,
          samples: benchmark.samples,
          time: benchmark.time,
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

  if (baseline && !opts.json)
    log(
      `\n${table.summary(
        benchmarks.filter(benchmark => benchmark.group == null),
        opts,
      )}`,
    );

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

    for (const benchmark of benchmarks) {
      if (group !== benchmark.group) continue;

      benchmark.samples = opts.samples ?? benchmark.samples;
      benchmark.time = opts.time ?? benchmark.time;
      first = true;
      try {
        benchmark.stats = await measure(
          benchmark.fn,
          benchmark.before,
          benchmark.after,
          {
            async: benchmark.async,
            warmup: benchmark.warmup,
            samples: benchmark.samples,
            time: benchmark.time,
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

    if (groupOpts.summary === true && !opts.json)
      log(
        `\n${table.summary(
          benchmarks.filter(benchmark => group === benchmark.group),
          opts,
        )}`,
      );
  }

  if (!opts.json && opts.units) log(table.units(opts));
  if (opts.json)
    log(
      JSON.stringify(
        report,
        undefined,
        'number' !== typeof opts.json ? 0 : opts.json,
      ),
    );

  return report;
}
