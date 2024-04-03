import * as clr from '../reporter/clr.mjs';
import * as table from '../reporter/table.mjs';
import { os, AsyncFunction, cpu, measure, no_color, version } from './lib.mjs';
import { logger } from './logger.mjs';
import { runtime } from './runtime.mjs';

let _gc = 0;
let g = null;
const summaries = {};
const benchmarks = [];
const groups = new Set();

export function group(name, cb) {
  if ('function' === typeof name) {
    cb = name;
  }
  if (cb != null && ![Function, AsyncFunction].includes(cb.constructor))
    throw new TypeError(`expected function, got ${cb.constructor.name}`);
  const o = {
    summary: name.summary ?? true,
    name:
      ('string' === typeof name ? name : name.name) || `$mitata_group${++_gc}`,
  };

  g = o.name;
  groups.add(g);
  summaries[g] = o.summary;
  cb();
  g = null;
}

export function bench(name, fn) {
  if ([Function, AsyncFunction].includes(name.constructor)) {
    fn = name;
    name = fn.name;
  }
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`);

  benchmarks.push({
    fn,
    name,
    group: g,
    time: 500,
    warmup: true,
    baseline: false,
    async: AsyncFunction === fn.constructor,
  });
}

export function baseline(name, fn) {
  if ([Function, AsyncFunction].includes(name.constructor)) {
    fn = name;
    name = fn.name;
  }
  if (![Function, AsyncFunction].includes(fn.constructor))
    throw new TypeError(`expected function, got ${fn.constructor.name}`);

  benchmarks.push({
    fn,
    name,
    group: g,
    time: 500,
    warmup: true,
    baseline: true,
    async: AsyncFunction === fn.constructor,
  });
}

export function clear() {
  _gc = 0;
  for (const key in summaries) {
    delete summaries[key];
  }
  benchmarks.length = 0;
  groups.clear();
}

export async function run(opts = {}) {
  opts.silent ??= false;
  opts.colors ??= !no_color;
  opts.json = !!opts.json ?? 0 === opts.json;
  opts.size = table.size(benchmarks.map(b => b.name));

  const log = opts.silent ? () => {} : logger;

  const report = {
    benchmarks,
    cpu,
    runtime: `${`${runtime} ${version}`.trim()} (${os})`,
  };

  if (!opts.json) {
    log(clr.gray(opts.colors, `cpu: ${report.cpu}`));
    log(clr.gray(opts.colors, `runtime: ${report.runtime}`));

    log('');
    log(table.header(opts));
    log(table.br(opts));
  }

  let _f = false;
  let _b = false;
  for (const b of benchmarks) {
    if (b.group) continue;
    if (b.baseline) _b = true;

    _f = true;

    try {
      b.stats = (await measure(b.fn, {})).stats;
      if (!opts.json) log(table.benchmark(b.name, b.stats, opts));
    } catch (err) {
      b.error = { stack: err.stack, message: err.message };
      if (!opts.json) log(table.benchmark_error(b.name, err, opts));
    }
  }

  if (_b && !opts.json)
    log(
      `\n${table.summary(
        benchmarks.filter(b => null === b.group),
        opts,
      )}`,
    );

  for (const group of groups) {
    if (!opts.json) {
      if (_f) log('');
      if (!group.startsWith('$mitata_group')) log(`• ${group}`);
      if (_f || !group.startsWith('$mitata_group'))
        log(clr.gray(opts.colors, table.br(opts)));
    }

    _f = true;
    for (const b of benchmarks) {
      if (group !== b.group) continue;

      try {
        b.stats = (await measure(b.fn, {})).stats;
        if (!opts.json) log(table.benchmark(b.name, b.stats, opts));
      } catch (err) {
        b.error = { stack: err.stack, message: err.message };
        if (!opts.json) log(table.benchmark_error(b.name, err, opts));
      }
    }

    if (summaries[group] && !opts.json)
      log(
        `\n${table.summary(
          benchmarks.filter(b => group === b.group),
          opts,
        )}`,
      );
  }

  if (!opts.json && opts.units) log(table.units(opts));
  if (opts.json)
    log(
      JSON.stringify(
        report,
        null,
        'number' !== typeof opts.json ? 0 : opts.json,
      ),
    );

  return report;
}
