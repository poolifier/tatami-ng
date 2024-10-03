export const bmf = report => {
  return report.benchmarks
    .filter(benchmark => benchmark.error == null)
    .map(({ name, stats }) => {
      // https://en.wikipedia.org/wiki/Propagation_of_uncertainty#Example_formulae
      const throughputSd = (1e9 * stats?.sd) / stats?.avg ** 2
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
