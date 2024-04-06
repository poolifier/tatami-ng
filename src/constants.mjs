export const runtimes = {
  bun: 'bun',
  deno: 'deno',
  node: 'node',
  browser: 'browser',
};

export const limits = {
  warmup: 10_000,
  benchmark: 250_000_000,
};

export const defaultTime = 600_000_000;

export const defaultSamples = {
  warmup: 128,
  benchmark: 128,
};

export const mitataGroup = '$mitata_group';
