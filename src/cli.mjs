import { os, AsyncFunction, cpu, measure, no_color, version } from './lib.mjs';
import { logger } from './logger.mjs';
import * as clr from './reporter/clr.mjs';
import * as table from './reporter/table.mjs';
import { runtime } from './runtime.mjs';

let _gc = 0;
let groupName = null;
const groups = new Set();
const benchmarks = [];

export function group(name, cb) {
  if ('function' === typeof name) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    cb = name;
  }
  if (cb != null && ![Function, AsyncFunction].includes(cb.constructor))
    throw new TypeError(`expected function, got ${cb.constructor.name}`);
  const group = {
    name:
      ('string' === typeof name ? name : name.name) || `$mitata_group${++_gc}`,
    summary: name.summary ?? true,
  };

  groupName = group.name;
  groups.add(group);
  cb();
  groupName = null;
}

export function bench(name, fn) {
  if ([Function, AsyncFunction].includes(name.constructor)) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    fn = name;
    // biome-ignore lint/style/noParameterAssign: <explanation>
    name = fn.name;
  }
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`);

  benchmarks.push({
    fn,
    name,
    group: groupName,
    warmup: true,
    baseline: false,
    async: AsyncFunction === fn.constructor,
  });
}

export function baseline(name, fn) {
  if ([Function, AsyncFunction].includes(name.constructor)) {
    // biome-ignore lint/style/noParameterAssign: <explanation>
    fn = name;
    // biome-ignore lint/style/noParameterAssign: <explanation>
    name = fn.name;
  }
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`);

  benchmarks.push({
    fn,
    name,
    group: groupName,
    warmup: true,
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
      `expected number or boolean as 'json' options, got ${opts.json.constructor.name}`,
    );
  opts.silent ??= false;
  opts.colors ??= !no_color;
  opts.size = table.size(benchmarks.map(benchmark => benchmark.name));

  const log = opts.silent === true ? () => {} : logger;

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

  let _f = false;
  let _b = false;
  for (const benchmark of benchmarks) {
    if (benchmark.group) continue;
    if (benchmark.baseline) _b = true;

    _f = true;
    try {
      benchmark.stats = (
        await measure(benchmark.fn, {
          async: benchmark.async,
          time: benchmark.time,
        })
      ).stats;
      if (!opts.json)
        log(table.benchmark(benchmark.name, benchmark.stats, opts));
    } catch (err) {
      benchmark.error = { stack: err.stack, message: err.message };
      if (!opts.json) log(table.benchmark_error(benchmark.name, err, opts));
    }
  }

  if (_b && !opts.json)
    log(
      `\n${table.summary(
        benchmarks.filter(benchmark => null == benchmark.group),
        opts,
      )}`,
    );

  for (const group of groups) {
    if (!opts.json) {
      if (_f) log('');
      if (!group.name.startsWith('$mitata_group')) log(`• ${group.name}`);
      if (_f || !group.name.startsWith('$mitata_group'))
        log(clr.gray(opts.colors, table.br(opts)));
    }

    _f = true;
    for (const benchmark of benchmarks) {
      if (group.name !== benchmark.group) continue;

      try {
        benchmark.stats = (
          await measure(benchmark.fn, {
            async: benchmark.async,
            time: benchmark.time,
          })
        ).stats;
        if (!opts.json)
          log(table.benchmark(benchmark.name, benchmark.stats, opts));
      } catch (err) {
        benchmark.error = { stack: err.stack, message: err.message };
        if (!opts.json) log(table.benchmark_error(benchmark.name, err, opts));
      }
    }

    if (group.summary === true && !opts.json)
      log(
        `\n${table.summary(
          benchmarks.filter(benchmark => group.name === benchmark.group),
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
