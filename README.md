<h1 align=center>tatami-ng</h1>

<h2 align=center>Cross JavaScript runtime benchmarking library and CLI</h2>

<div align="center">

[![GitHub commit activity (master)](https://img.shields.io/github/commit-activity/m/poolifier/tatami-ng/master?color=brightgreen&logo=github)](https://github.com/poolifier/tatami-ng/graphs/commit-activity)
[![Npm Version](https://badgen.net/npm/v/tatami-ng?icon=npm)](https://www.npmjs.com/package/tatami-ng)
[![JSR Version](https://jsr.io/badges/@poolifier/tatami-ng)](https://jsr.io/@poolifier/tatami-ng)
[![CI Workflow](https://github.com/poolifier/tatami-ng/actions/workflows/ci.yml/badge.svg)](https://github.com/poolifier/tatami-ng/actions/workflows/ci.yml)
[![PRs Welcome](https://badgen.net/static/PRs/welcome/green)](https://makeapullrequest.com)

</div>

- CLI and JS library support ✔
- Library API backward compatible with [mitata](https://github.com/evanwashere/mitata) up to version 0.1.14 ✔
- Benchmark latency and throughput ✔
- Support for sync and async benchmark ✔
- Advanced benchmark statistics: significance, error margin, variance, standard deviation, p-quantiles, ... ✔
- Multiple JS runtime support at zero cost abstraction (primary support for node, deno, bun and browsers but works with all JS runtime) ✔
- Support for ESM and TypeScript ✔

## Table of contents

- [Library installation](#library-installation)
  - [Node](#node)
    - [npmjs](#npmjs)
    - [JSR](#jsr)
  - [Deno](#deno)
  - [Bun](#bun)
    - [npmjs](#npmjs-1)
    - [JSR](#jsr-1)
  - [Browser](#browser)
- [Library usage example](#library-usage-example)
- [CLI installation](#cli-installation)
  - [Node](#node-1)
  - [Deno](#deno-1)
  - [Bun](#bun-1)
- [CLI standalone binary](#cli-standalone-binary)
  - [Deno](#deno-2)
  - [Bun](#bun-2)
- [CLI usage examples](#cli-usage-examples)
- [Development](#development)
- [License](#license)

## Library installation

### Node

#### npmjs

```shell
npm install tatami-ng
```

#### JSR

```shell
npx jsr add @poolifier/tatami-ng
```

### Deno

```shell
deno add @poolifier/tatami-ng
```

Deno versions >= 1.40.x are supported.

The `--allow-hrtime` permission flag is recommended to allow high-resolution time measurement with Deno v1.x.x.

### Bun

#### npmjs

```shell
bun add tatami-ng
```

#### JSR

```shell
bunx jsr add @poolifier/tatami-ng
```

Bun versions >= 1.x are supported.

### Browser

<!-- x-release-please-start-version -->

```js
<script type="module">
import {
 ...
} from 'https://cdn.jsdelivr.net/npm/tatami-ng@0.8.0/dist/browser/index.js'
</script>
```

<!-- x-release-please-end -->

## Library usage example

```js
// adapt import to the targeted JS runtime
import { baseline, bench, group, run, bmf } from 'tatami-ng'

bench('noop', () => {})
bench('noop2', () => {})

group('group', () => {
  baseline('baseline', () => {})
  bench('Date.now()', () => {
    Date.now()
  })
  bench('performance.now()', () => {
    performance.now()
  })
})

group({ name: 'group2', summary: false }, () => {
  bench('new Array(0)', () => {
    new Array(0)
  })
  bench('new Array(1024)', () => {
    new Array(1024)
  })
})

await run({
  units: false, // print units cheatsheet (default: false)
  silent: false, // enable/disable stdout output (default: false)
  json: false, // enable/disable json output or set json output indentation (default: false)
  reporter: bmf // custom reporter function (default: undefined)
  file: 'results.json', // write json output to file (default: undefined)
  colors: true, // enable/disable colors (default: true)
  now: () => 1e6 * performance.now.bind(performance)(), // custom nanoseconds timestamp function to replace default one (default: undefined)
  samples: 128, // minimum number of benchmark samples (default: 128)
  time: 1_000_000_000, // minimum benchmark execution time in nanoseconds (default: 1_000_000_000)
  warmup: true, // enable/disable benchmark warmup or set benchmark warmup run(s) (default: true)
  latency: true, // enable/disable time/iter column (default: true)
  throughput: true, // enable/disable iters/s column (default: true)
  latencyMinMax: true, // enable/disable latency (min...max) column (default: true)
  latencyPercentiles: false, // enable/disable latency percentile columns (default: true)
})
```

The [tests](./tests) directory contains more examples.

## CLI installation

### Node

```shell
npm install tatami-ng -g
```

### Deno

```shell
deno install -g --allow-read --allow-run --allow-sys -n tatami npm:tatami-ng
```

### Bun

```shell
bun add tatami-ng -g
```

Ensure the global installation directory is in your path:

- Unix: `${HOME}/.bun/bin`
- Windows: TODO

## CLI standalone binary

In the cloned repository root directory, run:

### Deno

```shell
bun build:cli:deno
```

### Bun

```shell
bun build:cli:bun
```

The standalone binary in `./dist/<runtime_name>` can be moved to a directory in your path.

## CLI usage examples

```shell
tatami --help
```

```shell
tatami --bench 'hexdump <file>' --bench 'xxd <file>'
```

## Development

The JavaScript runtime environment used for development is [bun](https://bun.sh/).

## License

MIT © [Evan](https://github.com/evanwashere), [Jerome Benoit](https://github.com/jerome-benoit)
