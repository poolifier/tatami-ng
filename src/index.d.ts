export type GroupOptions = {
  name?: string
  summary?: boolean
  samples?: number // minimum number of samples
  time?: number // minimum execution time
  warmup?: number | boolean
  now?: () => number
  before?: () => void | Promise<void>
  after?: () => void | Promise<void>
}

export function group(cb: () => void | Promise<void>): void
export function group(name: string, cb: () => void | Promise<void>): void
export function group(
  options: GroupOptions,
  cb: () => void | Promise<void>
): void

export type BenchmarkOptions = {
  samples?: number // minimum number of samples
  time?: number // minimum execution time
  warmup?: number | boolean
  now?: () => number
  before?: () => void | Promise<void>
  after?: () => void | Promise<void>
}

export function bench(
  fn: () => void | Promise<void>,
  options?: BenchmarkOptions
): void
export function bench(
  name: string,
  fn: () => void | Promise<void>,
  options?: BenchmarkOptions
): void

export function baseline(
  fn: () => void | Promise<void>,
  options?: BenchmarkOptions
): void
export function baseline(
  name: string,
  fn: () => void | Promise<void>,
  options?: BenchmarkOptions
): void

export function run(options?: {
  now?: () => number
  silent?: boolean
  colors?: boolean
  samples?: number // minimum number of samples
  time?: number // minimum execution time
  warmup?: number | boolean
  latency?: boolean
  throughput?: boolean
  latencyMinMax?: boolean
  latencyPercentiles?: boolean
  json?: number | boolean | 'bmf'
  file?: string
  units?: boolean
}): Promise<Report>

export type Stats = {
  min: number
  max: number
  p50: number // median
  p75: number
  p99: number
  p995: number
  avg: number // average
  vr: number // variance
  sd: number // standard deviation
  rmoe: number // relative margin of error
  aad: number // average time absolute deviation
  mad: number // median time absolute deviation
}

export type BenchmarkReport = {
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
    now: () => number
    before: () => void | Promise<void>
    after: () => void | Promise<void>

    error?: Error

    stats?: {
      samples: number // number of samples
      ss: boolean // statistical significance
      latency: Stats
      throughput: Stats
    }
  }
}

export type Report = BenchmarkReport[]
