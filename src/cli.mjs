import {
  defaultSamples,
  defaultTime,
  emptyFunction,
  tatamiGroup,
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

let _gc = 0;
let groupName = null;
const groups = new Map();
const benchmarks = [];

export function group(name, cb) {
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
  if (cb != null && ![Function, AsyncFunction].includes(cb.constructor))
    throw new TypeError(`expected function, got ${cb.constructor.name}`);
  if (
    Object.prototype.toString.call(name).slice(8, -1) === 'Object' &&
    name.name != null &&
    'string' !== typeof name.name
  )
    throw new TypeError(`expected string, got ${name.name.constructor.name}`);
  if (
    Object.prototype.toString.call(name).slice(8, -1) === 'Object' &&
    name.summary != null &&
    'boolean' !== typeof name.summary
  )
    throw new TypeError(
      `expected boolean, got ${name.summary.constructor.name}`,
    );
  if (
    Object.prototype.toString.call(name).slice(8, -1) === 'Object' &&
    name.before != null &&
    ![Function, AsyncFunction].includes(name.before.constructor)
  )
    throw new TypeError(
      `expected function, got ${name.before.constructor.name}`,
    );
  if (
    Object.prototype.toString.call(name).slice(8, -1) === 'Object' &&
    name.after != null &&
    ![Function, AsyncFunction].includes(name.after.constructor)
  )
    throw new TypeError(
      `expected function, got ${name.after.constructor.name}`,
    );

  groupName =
    ('string' === typeof name ? name.trim() : name.name?.trim()) ||
    `${tatamiGroup}${++_gc}`;
  if (!groups.has(groupName))
    groups.set(groupName, {
      summary: name.summary ?? true,
      before: name.before ?? emptyFunction,
      after: name.after ?? emptyFunction,
    });
  cb();
  groupName = null;
}

export function bench(name, fn, opts = {}) {
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

export function baseline(name, fn, opts = {}) {
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

export function clear() {
  _gc = 0;
  groups.clear();
  benchmarks.length = 0;
}

export async function run(opts = {}) {
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

  let _baseline = false;
  let _first = false;
  for (const benchmark of benchmarks) {
    if (benchmark.group) continue;
    if (benchmark.baseline) _baseline = true;

    benchmark.samples = opts.samples ?? benchmark.samples;
    _first = true;
    try {
      benchmark.stats = (
        await measure(benchmark.fn, benchmark.before, benchmark.after, {
          async: benchmark.async,
          warmup: benchmark.warmup,
          time: benchmark.time,
          samples: benchmark.samples,
        })
      ).stats;
      if (!opts.json)
        log(table.benchmark(benchmark.name, benchmark.stats, opts));
    } catch (err) {
      benchmark.error = { stack: err.stack, message: err.message };
      if (!opts.json) log(table.benchmarkError(benchmark.name, err, opts));
    }
  }

  if (_baseline && !opts.json)
    log(
      `\n${table.summary(
        benchmarks.filter(benchmark => benchmark.group == null),
        opts,
      )}`,
    );

  for (const [group, groupOpts] of groups) {
    if (!opts.json) {
      if (_first) log('');
      if (!group.startsWith(tatamiGroup)) log(`• ${group}`);
      if (_first || !group.startsWith(tatamiGroup))
        log(clr.gray(opts.colors, table.br(opts)));
    }

    AsyncFunction === groupOpts.before.constructor
      ? await groupOpts.before()
      : groupOpts.before();

    for (const benchmark of benchmarks) {
      if (group !== benchmark.group) continue;

      benchmark.samples = opts.samples ?? benchmark.samples;
      _first = true;
      try {
        benchmark.stats = (
          await measure(benchmark.fn, benchmark.before, benchmark.after, {
            async: benchmark.async,
            warmup: benchmark.warmup,
            time: benchmark.time,
            samples: benchmark.samples,
          })
        ).stats;
        if (!opts.json)
          log(table.benchmark(benchmark.name, benchmark.stats, opts));
      } catch (err) {
        benchmark.error = { stack: err.stack, message: err.message };
        if (!opts.json) log(table.benchmarkError(benchmark.name, err, opts));
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
