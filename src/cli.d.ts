export function group(cb: () => void): void;
export function group(name: string, cb: () => void): void;
export function group(
  options: {
    name?: string;
    summary?: boolean;
    before?: () => void | Promise<void>;
    after?: () => void | Promise<void>;
  },
  cb: () => void,
): void;
export function bench(
  name: string,
  fn: () => void | Promise<void>,
  options?: {
    warmup?: boolean;
    before?: () => void | Promise<void>;
    after?: () => void | Promise<void>;
  },
): void;

export function baseline(
  name: string,
  fn: () => void | Promise<void>,
  options?: {
    warmup?: boolean;
    before?: () => void | Promise<void>;
    after?: () => void | Promise<void>;
  },
): void;

export function clear(): void;

export function run(options?: {
  silent?: boolean;
  colors?: boolean;
  samples?: number;
  avg?: boolean;
  min_max?: boolean;
  percentiles?: boolean;
  json?: number | boolean;
  units?: boolean;
  /**
   * @deprecated does not do anything since 0.1.7
   */
  collect?: boolean;
}): Promise<Report>;

export interface Report {
  cpu: string;
  runtime: string;

  benchmarks: {
    name: string;
    samples: number;
    time: number;
    before: () => void | Promise<void>;
    fn: () => void | Promise<void>;
    after: () => void | Promise<void>;
    async: boolean;
    warmup: boolean;
    baseline: boolean;
    group: string | null;

    error?: Error;

    stats?: {
      samples: number;
      min: number;
      max: number;
      p50: number;
      p75: number;
      p99: number;
      p999: number;
      avg: number;
      std: number;
      rawSamples: number;
      rawAvg: number;
      rawStd: number;
    };
  }[];
}
