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
  time?: number;
  avg?: boolean;
  iter?: boolean;
  min_max?: boolean;
  rmoe?: boolean;
  percentiles?: boolean;
  json?: number | boolean;
  units?: boolean;
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
      p995: number;
      avg: number;
      vr: number;
      sd: number;
      rmoe: number;
      iter: number;
      ss: boolean;
    };
  }[];
}
