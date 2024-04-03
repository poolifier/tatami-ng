import * as clr from '../reporter/clr.mjs';
import * as table from '../reporter/table.mjs';
import { measure } from './lib.mjs';
import { logger } from './logger.mjs';
import { runtime } from './runtime.mjs';

let _gc = 0;
let g = null;
const summaries = {};
const benchmarks = [];
const groups = new Set();
const AsyncFunction = (async () => {}).constructor;

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

function version() {
  return {
    unknown: () => '',
    browser: () => '',
    node: () => process.version,
    deno: () => Deno.version.deno,
    bun: () => process.versions.bun,
  }[runtime()]();
}

function os() {
  return {
    unknown: () => 'unknown',
    browser: () => 'unknown',
    node: () => `${process.arch}-${process.platform}`,
    deno: () => Deno.build.target,
    bun: () => `${process.arch}-${process.platform}`,
  }[runtime()]();
}

function no_color() {
  return {
    unknown: () => false,
    browser: () => true,
    node: () => !!process.env.NO_COLOR,
    deno: () => Deno.noColor,
    bun: () => !!process.env.NO_COLOR,
  }[runtime()]();
}

async function cpu() {
  return await {
    unknown: () => 'unknown',
    browser: () => 'unknown',
    node: () => import('node:os').then(v => v.cpus()[0].model),

    deno: async () => {
      try {
        try {
          const os = await import('node:os');
          if (os?.cpus?.()?.[0]?.model) return os.cpus()[0].model;
        } catch {}

        if ('darwin' === Deno.build.os) {
          try {
            const p = new Deno.Command('sysctl', {
              args: ['-n', 'machdep.cpu.brand_string'],
            });

            const { code, stdout } = await p.output();
            if (0 === code) return new TextDecoder().decode(stdout).trim();
          } catch {}
        }

        if ('linux' === Deno.build.os) {
          const info = new TextDecoder()
            .decode(Deno.readFileSync('/proc/cpuinfo'))
            .split('\n');

          for (const line of info) {
            const [key, value] = line.split(':');
            if (
              /model name|Hardware|Processor|^cpu model|chip type|^cpu type/.test(
                key,
              )
            )
              return value.trim();
          }
        }

        if ('windows' === Deno.build.os) {
          try {
            const p = new Deno.Command('wmic', {
              args: ['cpu', 'get', 'name'],
            });

            const { code, stdout } = await p.output();
            if (0 === code)
              return new TextDecoder().decode(stdout).split('\n').at(-1).trim();
          } catch {}
        }
      } catch {}

      return 'unknown';
    },

    bun: async () => {
      try {
        const os = await import('node:os');
        if (os?.cpus?.()?.[0]?.model) return os.cpus()[0].model;
      } catch {}

      try {
        if ('linux' === process.platform) {
          const fs = await import('node:fs');
          const buf = new Uint8Array(64 * 1024);
          const fd = fs.openSync('/proc/cpuinfo', 'r');
          const info = new TextDecoder()
            .decode(buf.subarray(0, fs.readSync(fd, buf)))
            .split('\n');
          fs.closeSync(fd);

          for (const line of info) {
            const [key, value] = line.split(':');
            if (
              /model name|Hardware|Processor|^cpu model|chip type|^cpu type/.test(
                key,
              )
            )
              return value.trim();
          }
        }

        if ('darwin' === process.platform) {
          const { ptr, dlopen, CString } = Bun.FFI;

          const sysctlbyname = dlopen('libc.dylib', {
            sysctlbyname: {
              args: ['ptr', 'ptr', 'ptr', 'ptr', 'isize'],
              returns: 'isize',
            },
          }).symbols.sysctlbyname;

          const buf = new Uint8Array(256);
          const len = new BigInt64Array([256n]);
          const cmd = new TextEncoder().encode('machdep.cpu.brand_string\0');
          if (-1 === Number(sysctlbyname(ptr(cmd), ptr(buf), ptr(len), 0, 0)))
            throw 0;

          return new CString(ptr(buf));
        }
      } catch {}

      // TODO: add Windows support

      return 'unknown';
    },
  }[runtime()]();
}

export async function run(opts = {}) {
  opts.silent ??= false;
  opts.colors ??= !no_color();
  opts.json = !!opts.json ?? 0 === opts.json;
  opts.size = table.size(benchmarks.map(b => b.name));

  const log = opts.silent ? () => {} : logger;

  const report = {
    benchmarks,
    cpu: await cpu(),
    runtime: `${`${runtime()} ${version()}`.trim()} (${os()})`,
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
