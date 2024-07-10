#!/usr/bin/env node

import { readFileSync } from 'node:fs'
import { peowly } from 'peowly'

import {
  baseline as baselineBenchmark,
  bench as benchmark,
  run,
} from './src/index.js'
import { spawnSync } from './src/lib.js'

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)))

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
      description: 'Number of warmup runs',
      type: 'string',
      short: 'w',
    },
    silent: {
      listGroup: 'Output options',
      description: 'No stdout output',
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
    'no-avg': {
      listGroup: 'Output options',
      description: 'No average column',
      type: 'boolean',
    },
    'no-iter': {
      listGroup: 'Output options',
      description: 'No iterations per second column',
      type: 'boolean',
    },
    'no-min_max': {
      listGroup: 'Output options',
      description: 'No (min...max) column',
      type: 'boolean',
    },
    'no-rmoe': {
      listGroup: 'Output options',
      description: 'No error margin column',
      type: 'boolean',
    },
    'no-percentiles': {
      listGroup: 'Output options',
      description: 'No percentile columns',
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
  baselineBenchmark(baseline, () => {
    spawnSync(baseline)
  })
}
if (bench != null) {
  for (const b of bench) {
    benchmark(b, () => {
      spawnSync(b)
    })
  }
}

if (flags.json != null) {
  const json = Number.parseInt(flags.json)
  if (!Number.isNaN(json)) {
    flags.json = json
  }
}

await run({
  ...(flags.samples != null && { samples: Number.parseInt(flags.samples) }),
  ...(flags.time != null && { time: Number.parseFloat(flags.time) }),
  ...(flags.warmup != null && { warmup: Number.parseInt(flags.warmup) }),
  ...(flags.silent != null && { silent: flags.silent }),
  ...(flags.json != null && { json: flags.json }),
  ...(flags.file != null && { file: flags.file }),
  ...(flags['no-colors'] != null && { colors: !flags['no-colors'] }),
  ...(flags['no-avg'] != null && { avg: !flags['no-avg'] }),
  ...(flags['no-rmoe'] != null && { rmoe: !flags['no-rmoe'] }),
  ...(flags['no-iter'] != null && { iter: !flags['no-iter'] }),
  ...(flags['no-min_max'] != null && { min_max: !flags['no-min_max'] }),
  ...(flags['no-percentiles'] != null && {
    percentiles: !flags['no-percentiles'],
  }),
  ...(flags.units != null && { units: flags.units }),
})
