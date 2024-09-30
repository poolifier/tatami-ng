export function group(cb: () => void | Promise<void>): void
export function group(name: string, cb: () => void | Promise<void>): void
export function group(
  options: {
    name?: string
    summary?: boolean
    before?: () => void | Promise<void>
    after?: () => void | Promise<void>
  },
  cb: () => void | Promise<void>
): void

export function bench(
  fn: () => void | Promise<void>,
  options?: {
    before?: () => void | Promise<void>
    after?: () => void | Promise<void>
  }
): void
export function bench(
  name: string,
  fn: () => void | Promise<void>,
  options?: {
    before?: () => void | Promise<void>
    after?: () => void | Promise<void>
  }
): void

export function baseline(
  fn: () => void | Promise<void>,
  options?: {
    before?: () => void | Promise<void>
    after?: () => void | Promise<void>
  }
): void
export function baseline(
  name: string,
  fn: () => void | Promise<void>,
  options?: {
    before?: () => void | Promise<void>
    after?: () => void | Promise<void>
  }
): void

export function run(options?: {
  silent?: boolean
  colors?: boolean
  samples?: number
  time?: number
  warmup?: number | boolean
  avg?: boolean
  iters?: boolean
  min_max?: boolean
  rmoe?: boolean
  percentiles?: boolean
  json?: number | boolean | 'bmf'
  file?: string
  units?: boolean
}): Promise<Report>

export interface Report {
  cpu: string
  runtime: string

  benchmarks: {
    name: string
    samples: number // minimum number of samples
    time: number // minimum execution time
    warmup: number | boolean
    async: boolean
    baseline: boolean
    group: string | null

    error?: Error

    stats?: {
      samples: number // number of samples
      min: number
      max: number
      p50: number // median
      p75: number
      p99: number
      p995: number
      avg: number // average time per iteration
      iters: number // iterations per second
      vr: number // variance
      sd: number // standard deviation
      rmoe: number // relative margin of error
      aad: number // average time absolute deviation
      mad: number // median time absolute deviation
      ss: boolean // statistical significance
    }
  }[]
}
