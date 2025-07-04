/**
 * Bencher Metric Format (BMF).
 *
 * @param {Object} report tatami-ng report
 * @returns {Object} BMF report
 */
export const bmf = report => {
  return (
    report.benchmarks
      .filter(benchmark => benchmark.error == null)
      .map(({ name, stats }) => {
        return {
          [name]: {
            latency: {
              value: stats?.latency?.avg,
              lower_value: stats?.latency?.avg - stats?.latency?.sd,
              upper_value: stats?.latency?.avg + stats?.latency?.sd,
            },
            throughput: {
              value: stats?.throughput?.avg,
              lower_value: stats?.throughput?.avg - stats?.throughput?.sd,
              upper_value: stats?.throughput?.avg + stats?.throughput?.sd,
            },
          },
        }
      })
      // biome-ignore lint/performance/noAccumulatingSpread: explanation
      .reduce((obj, item) => Object.assign(obj, item), {})
  )
}
