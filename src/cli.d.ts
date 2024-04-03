export function group(fn: () => void): void;
export function group(name: string, fn: () => void): void;
export function group(
  options: { name?: string; summary?: boolean },
  fn: () => void,
): void;
export function bench(name: string, fn: () => void | Promise<void>): void;

export function baseline(name: string, fn: () => void | Promise<void>): void;

export function clear(): void;

export function run(options?: {
  avg?: boolean;
  silent?: boolean;
  colors?: boolean;
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
    time: number;
    fn: () => void | Promise<void>;
    async: boolean;
    warmup: boolean;
    baseline: boolean;
    group: string | null;

    error?: Error;

    stats?: {
      avg: number;
      min: number;
      max: number;
      p50: number;
      p75: number;
      p99: number;
      p999: number;
    };
  }[];
}