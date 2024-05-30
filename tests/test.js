import { baseline, bench, clear, group, run } from '../src/index.js';

bench('noop', () => {}, {
  before: () => {},
  after: () => {},
});
bench('async noop', async () => {});
baseline('aaa', () => {});
bench('async noop2', async () => Promise.resolve());
bench('error', () => {
  throw new Error('error');
});

group(() => {
  bench('a', () => {});
  bench('b', () => {});
  bench('e', () => {
    throw new Error("error 'e'");
  });
});

group('group', () => {
  baseline('baseline', () => {});
  bench('Date.now()', () => {
    Date.now();
  });
  bench('performance.now()', () => {
    performance.now();
  });
});

group({ summary: false, after: () => {} }, () => {
  bench('aa', () => {});
  bench('bb', () => {});
});

group({ name: 'group2', summary: false }, () => {
  bench('new Array(0)', () => {
    new Array(0);
  });
  bench('new Array(1024)', () => {
    new Array(1024);
  });
});

const report = await run({
  avg: true, // enable/disable avg column (default: true)
  json: false, // enable/disable json output (default: false)
  colors: true, // enable/disable colors (default: true)
  min_max: true, // enable/disable (min...max) column (default: true)
  percentiles: false, // enable/disable percentile columns (default: true)
});

clear();

await run({
  avg: true, // enable/disable avg column (default: true)
  json: false, // enable/disable json output (default: false)
  colors: true, // enable/disable colors (default: true)
  min_max: true, // enable/disable (min...max) column (default: true)
  percentiles: false, // enable/disable percentile columns (default: true)
});
