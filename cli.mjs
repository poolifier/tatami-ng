#!/usr/bin/env node

import { peowly } from 'peowly'

const { options } = peowly({
  options: {
    baseline: {
      listGroup: 'Benchmark options',
      description: '',
      type: 'string',
    },
    bench: {
      listGroup: 'Benchmark options',
      description: '',
      type: 'string',
      multiple: true,
    },
    silent: {
      listGroup: 'Output options',
      description: 'Silences output',
      type: 'boolean',
    },
    json: {
      listGroup: 'Output options',
      description: 'Outputs as JSON',
      type: 'boolean' | 'number' | 'bmf',
    },
    file: {
      listGroup: 'Output options',
      description: 'Outputs as JSON to a file',
      type: 'string',
    },
  },
  description: 'tatami-ng CLI for running benchmarks',
  examples: ['--bench <command> --bench <command>'],
  name: 'tatami',
})
