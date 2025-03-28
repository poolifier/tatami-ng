import { baseline, bench, group, run } from '../src/index.js'

bench('noop', () => {}, {
  samples: 64,
  time: 1000,
  now: () => 1e6 * performance.now(),
  before: () => {},
  after: () => {},
})
bench('async noop', async () => {})
baseline('baseline noop', () => {})
bench('async promise noop', () => Promise.resolve())
bench('error', () => {
  throw new Error('error')
})
bench('async promise reject', () => Promise.reject(new Error('reject')))

group(() => {
  bench('a', () => {})
  bench('b', () => {})
  bench('e', () => {
    throw new Error("error 'e'")
  })
  bench('r', () => Promise.reject(new Error("reject 'r'")))
})

group('group', () => {
  baseline('baseline noop', () => {})
  bench('Date.now()', () => {
    Date.now()
  })
  bench('performance.now()', () => {
    performance.now()
  })
})

group({ summary: false, samples: 64, time: 10000, after: () => {} }, () => {
  bench('aa', () => {})
  bench('bb', () => {})
})

group({ name: 'group2', summary: false }, () => {
  bench('new Array(0)', () => {
    new Array(0)
  })
  bench('new Array(1024)', () => {
    new Array(1024)
  })
})

const report = await run({
  latency: true, // enable/disable time/iter column (default: true)
  throughput: true, // enable/disable iters/s column (default: true)
  json: false, // enable/disable json output or set json output indentation (default: false)
  colors: true, // enable/disable colors (default: true)
  latencyMinMax: true, // enable/disable latency (min...max) column (default: true)
  latencyPercentiles: true, // enable/disable latency percentile columns (default: true)
})

console.log(report)

await run({
  latency: true, // enable/disable time/iter column (default: true)
  throughput: true, // enable/disable iters/s column (default: true)
  json: false, // enable/disable json output or set json output indentation (default: false)
  colors: true, // enable/disable colors (default: true)
  latencyMinMax: true, // enable/disable latency (min...max) column (default: true)
  latencyPercentiles: true, // enable/disable latency percentile columns (default: true)
})
