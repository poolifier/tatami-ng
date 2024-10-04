#!/usr/bin/env node

import { peowly } from 'peowly'

import pkg from './package.json' with { type: 'json' }
import {
  baseline as baselineBenchmark,
  bench as benchmark,
  run,
} from './src/index.js'
import { spawnSync } from './src/lib.js'

const {
  flags: { baseline, bench, ...flags },
} = peowly({
  options: {
    baseline: {
      listGroup: 'Benchmark options',
      description: 'Baseline command',
      type: 'string',
      short: 'B',
    },
    bench: {
      listGroup: 'Benchmark options',
      description: 'Benchmark command',
      type: 'string',
      multiple: true,
      short: 'b',
    },
    samples: {
      listGroup: 'Benchmark options',
      description: 'Minimum number of samples',
      type: 'string',
      short: 's',
    },
    time: {
      listGroup: 'Benchmark options',
      description: 'Minimum time in nanoseconds',
      type: 'string',
      short: 't',
    },
    warmup: {
      listGroup: 'Benchmark options',
      description: 'Number of warmup run(s)',
      type: 'string',
      short: 'w',
    },
    prepare: {
      listGroup: 'Benchmark options',
      description: 'Command to prepare benchmark(s)',
      type: 'string',
    },
    before: {
      listGroup: 'Benchmark options',
      description: 'Command before each benchmark',
      type: 'string',
    },
    after: {
      listGroup: 'Benchmark options',
      description: 'Command after each benchmark',
      type: 'string',
    },
    silent: {
      listGroup: 'Output options',
      description: 'No standard output',
      type: 'boolean',
    },
    json: {
      listGroup: 'Output options',
      description: 'Outputs as JSON',
      type: 'string',
      short: 'j',
    },
    file: {
      listGroup: 'Output options',
      description: 'Outputs as JSON to a file',
      type: 'string',
      short: 'f',
    },
    'no-colors': {
      listGroup: 'Output options',
      description: 'No colors in output',
      type: 'boolean',
    },
    'no-latency': {
      listGroup: 'Output options',
      description: 'No time/iter column',
      type: 'boolean',
    },
    'no-throughput': {
      listGroup: 'Output options',
      description: 'No iters/s column',
      type: 'boolean',
    },
    'no-latency-min_max': {
      listGroup: 'Output options',
      description: 'No latency (min...max) column',
      type: 'boolean',
    },
    'no-latency-percentiles': {
      listGroup: 'Output options',
      description: 'No latency percentile columns',
      type: 'boolean',
    },
    units: {
      listGroup: 'Output options',
      description: 'Prints units cheatsheet',
      type: 'boolean',
      short: 'u',
    },
  },
  description: 'tatami-ng CLI for running benchmark',
  examples: ["--baseline '<command>' --bench '<command>' --bench '<command>'"],
  name: 'tatami',
  pkg,
})

if (baseline != null) {
  baselineBenchmark(
    baseline,
    () => {
      spawnSync(baseline)
    },
    {
      ...(flags.before != null && { before: () => spawnSync(flags.before) }),
      ...(flags.after != null && { after: () => spawnSync(flags.after) }),
    }
  )
}
if (bench != null) {
  for (const b of bench) {
    benchmark(
      b,
      () => {
        spawnSync(b)
      },
      {
        ...(flags.before != null && { before: () => spawnSync(flags.before) }),
        ...(flags.after != null && { after: () => spawnSync(flags.after) }),
      }
    )
  }
}

if (flags.json != null) {
  const json = Number.parseInt(flags.json)
  if (!Number.isNaN(json)) {
    flags.json = json
  }
}

if (flags.prepare != null) {
  spawnSync(flags.prepare)
}

await run({
  ...(flags.samples != null && { samples: Number.parseInt(flags.samples) }),
  ...(flags.time != null && { time: Number.parseFloat(flags.time) }),
  ...(flags.warmup != null && { warmup: Number.parseInt(flags.warmup) }),
  ...(flags.silent != null && { silent: flags.silent }),
  ...(flags.json != null && { json: flags.json }),
  ...(flags.file != null && { file: flags.file }),
  ...(flags['no-colors'] != null && { colors: !flags['no-colors'] }),
  ...(flags['no-latency'] != null && { latency: !flags['no-latency'] }),
  ...(flags['no-throughput'] != null && {
    throughput: !flags['no-throughput'],
  }),
  ...(flags['no-latency-min_max'] != null && {
    latencyMinMax: !flags['no-latency-min_max'],
  }),
  ...(flags['no-latency-percentiles'] != null && {
    latencyPercentiles: !flags['no-latency-percentiles'],
  }),
  ...(flags.units != null && { units: flags.units }),
})
