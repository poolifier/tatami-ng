import { baseline, bench, group, run } from '../src/index.js'

bench('noop', () => {}, {
  samples: 64,
  time: 1000,
  now: () => 1e6 * performance.now.bind(performance)(),
  before: () => {},
  after: () => {},
})
bench('async noop', async () => {})
baseline('baseline noop', () => {})
bench('async noop2', async () => Promise.resolve())
bench('error', () => {
  throw new Error('error')
})

group(() => {
  bench('a', () => {})
  bench('b', () => {})
  bench('e', () => {
    throw new Error("error 'e'")
  })
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
  avg: true, // enable/disable time/iter average column (default: true)
  json: false, // enable/disable json output or set json output format (default: false)
  colors: true, // enable/disable colors (default: true)
  min_max: true, // enable/disable (min...max) column (default: true)
  percentiles: true, // enable/disable percentile columns (default: true)
})

console.log(report)

await run({
  avg: true, // enable/disable time/iter average column (default: true)
  json: false, // enable/disable json output or set json output format (default: false)
  colors: true, // enable/disable colors (default: true)
  min_max: true, // enable/disable (min...max) column (default: true)
  percentiles: true, // enable/disable percentile columns (default: true)
})
