import { ratioStandardDeviation } from '../../stats-utils.js'

export const bmf = report => {
  return report.benchmarks
    .filter(benchmark => benchmark.error == null)
    .map(({ name, stats }) => {
      const throughputSd = ratioStandardDeviation(1e9, 0, stats?.avg, stats?.sd)
      return {
        [name]: {
          latency: {
            value: stats?.avg,
            lower_value: stats?.avg - stats?.sd,
            upper_value: stats?.avg + stats?.sd,
          },
          throughput: {
            value: stats?.iters,
            lower_value: stats?.iters - throughputSd,
            upper_value: stats?.iters + throughputSd,
          },
        },
      }
    })
    .reduce((obj, item) => Object.assign(obj, item), {})
}
