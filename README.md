<h1 align=center>tatami-ng</h1>
<h2 align=center>Cross JavaScript runtime benchmarking library</h2>

## Install

### Node

```shell
npm install tatami-ng
```

### Deno

```shell
deno add npm:tatami-ng
```

Deno versions >= 1.40.x are supported.

The `--allow-hrtime` permission flag is recommended to allow high-resolution
time measurement.

### Bun

```shell
bun add tatami-ng
```

Bun versions >= 1.x are supported.

### Browser

```js
<script type="module">
import {
 ...
} from 'https://cdn.jsdelivr.net/npm/tatami-ng@0.2.0/src/cli.mjs'
</script>
```

## Example

```js
import { baseline, bench, clear, group, run } from 'tatami-ng';

bench('noop', () => {});
bench('noop2', () => {});

group('group', () => {
  baseline('baseline', () => {});
  bench('Date.now()', () => Date.now());
  bench('performance.now()', () => performance.now());
});

group({ name: 'group2', summary: false }, () => {
  bench('new Array(0)', () => new Array(0));
  bench('new Array(1024)', () => new Array(1024));
});

await run({
  units: false, // print units cheatsheet (default: false)
  silent: false, // enable/disable stdout output (default: undefined)
  json: false, // enable/disable json output (default: false)
  colors: true, // enable/disable colors (default: true)
  samples: 128, // minimum number of benchmark samples (default: 128)
  time: 600_000_000 // minimum benchmark time in nanoseconds (default: 600_000_000)
  iter: true, // enable/disable iter/s column (default: true)
  avg: true, // enable/disable time (avg) column (default: true)
  min_max: true, // enable/disable (min...max) column (default: true)
  percentiles: false, // enable/disable percentile columns (default: true)
});

clear();
```

## Development

The JavaScript runtime environment used for development is Bun.

## License

MIT © [Evan](https://github.com/evanwashere),
[Jerome Benoit](https://github.com/jerome-benoit)
