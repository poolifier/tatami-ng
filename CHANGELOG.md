# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.5.2](https://github.com/poolifier/tatami-ng/compare/0.5.1...0.5.2) (2024-07-10)


### 🚀 Features

* allow to specify the number of warmup runs ([9f29086](https://github.com/poolifier/tatami-ng/commit/9f2908640bf9112f59908738795b9f7d4e2c468b))
* **cli:** allow to execute custom commands at benchmarking steps ([69c1fdc](https://github.com/poolifier/tatami-ng/commit/69c1fdc52d3c2818520d124014dc0ef48a9cff0c))


### ✨ Polish

* cleanup empty function usage ([007345d](https://github.com/poolifier/tatami-ng/commit/007345da0f00e0a39aa948e4e1a7ad96c3c71e3c))

## [0.5.1](https://github.com/poolifier/tatami-ng/compare/0.5.0...0.5.1) (2024-07-09)


### 📚 Documentation

* fix CLI usage documentation ([33735e3](https://github.com/poolifier/tatami-ng/commit/33735e3ff99721a6b672745e3f1213f2ca1768c5))

## [0.5.0](https://github.com/poolifier/tatami-ng/compare/0.4.16...0.5.0) (2024-07-09)


### ⚠ BREAKING CHANGES

* add CLI ([#8](https://github.com/poolifier/tatami-ng/issues/8))

### 🚀 Features

* add CLI ([#8](https://github.com/poolifier/tatami-ng/issues/8)) ([d20b094](https://github.com/poolifier/tatami-ng/commit/d20b0940891741ec04a510423aca0e6839559bee))


### 🐞 Bug Fixes

* ensure `file` write default JSON output to configured file ([394b033](https://github.com/poolifier/tatami-ng/commit/394b03323ecc030467011aaa0954a2a88ea87dc3))


### 📚 Documentation

* add ToC in README.md ([abd1504](https://github.com/poolifier/tatami-ng/commit/abd15047735b67e5b0f931d037a08a5244719c20))

## [0.4.16](https://github.com/poolifier/tatami-ng/compare/0.4.15...0.4.16) (2024-07-05)


### 🚀 Features

* switch to release-please release manager ([234f244](https://github.com/poolifier/tatami-ng/commit/234f244a679656c69c9b8b1a6bdab55c10a664c3))


### 📚 Documentation

* add PR template ([ad0fd01](https://github.com/poolifier/tatami-ng/commit/ad0fd01e378f01c0d7914cf20b0534da4d9f151b))
* refine README.md badges ([8fc2a37](https://github.com/poolifier/tatami-ng/commit/8fc2a373ff685dd59acd70be64b6b5c116eb8cb6))


### ✨ Polish

* **ci:** cleanup GH action ([ee255e7](https://github.com/poolifier/tatami-ng/commit/ee255e740160c9b09ceab165b8bfe89895d29b5e))
* refine GH action setup-bun configuration ([25382b6](https://github.com/poolifier/tatami-ng/commit/25382b696e162e8e35df37f033eefc53a859e40f))
* switch biome.js configuration to standard.js style ([5d9754a](https://github.com/poolifier/tatami-ng/commit/5d9754a7a395cecbd5e57080b4cf9b5e8b07f589))


### 🤖 Automation

* **ci:** add autofix GH action ([736c4f8](https://github.com/poolifier/tatami-ng/commit/736c4f839f1c75a36313922fe5ea8601ff181f7d))
* **ci:** do not cancel workflow on autofix.ci error ([d2b04dc](https://github.com/poolifier/tatami-ng/commit/d2b04dc873a996ecf119597e173041ac80f134a2))
* **ci:** fix setup-bun configuration ([a12a9d0](https://github.com/poolifier/tatami-ng/commit/a12a9d0dca53784c115f0327d29828da7c532831))
* **ci:** really ensure tag version is not prefixed with 'v' ([7dbb1be](https://github.com/poolifier/tatami-ng/commit/7dbb1be94f81c280acefd9c8b4ff14c17ec22584))
* **ci:** remove v prefix in release-please tag ([1aa36d1](https://github.com/poolifier/tatami-ng/commit/1aa36d13df2375c3367f56b4592bd65751f3a42d))
* **deps-dev:** apply updates ([51d9eea](https://github.com/poolifier/tatami-ng/commit/51d9eeafdd4fbb4427d053d067fb90300ce9a02e))
* **deps-dev:** apply updates ([e8d8302](https://github.com/poolifier/tatami-ng/commit/e8d8302f3ea0d8742419160cd75e9051288a39fe))
* **deps-dev:** apply updates ([8603c48](https://github.com/poolifier/tatami-ng/commit/8603c484dc691ac55660293880711e2d22aa03aa))
* **deps-dev:** apply updates ([0a7ace0](https://github.com/poolifier/tatami-ng/commit/0a7ace0fbd8fd9fe1d65fc15103106e726d67a3a))
* **deps-dev:** apply updates ([0785cfc](https://github.com/poolifier/tatami-ng/commit/0785cfcc6fa5e26056a10dd21fed3cebf0a1de3e))
* **deps-dev:** apply updates ([1f3034e](https://github.com/poolifier/tatami-ng/commit/1f3034e8f6a37f67225c111982849e4384af0392))
* **deps-dev:** apply updates ([b9bb1e0](https://github.com/poolifier/tatami-ng/commit/b9bb1e0de4e816cf385b9e759a45c13406171306))
* **deps:** bump oven-sh/setup-bun from 1 to 2 ([9c3fe1b](https://github.com/poolifier/tatami-ng/commit/9c3fe1b62ebe0eb05b3704fe1a5dc44b2347615c))

## [0.4.15] - 2024-06-16

### Fixed

- Fix a sanity check at benchmarks summary display.

## [0.4.14] - 2024-06-16

### Fixed

- Ensure benchmarks summary is only displayed with two valid benchmarks.

## [0.4.13] - 2024-05-25

### Changed

- Maintenance release.

## [0.4.12] - 2024-05-18

### Fixed

- Fix benchmark throughput computation.

## [0.4.11] - 2024-05-17

### Changed

- Add benchmark relative speed ratio error margin to summary.

## [0.4.10] - 2024-05-16

### Fixed

- Fix `run()` `warmup` option handling.
- Display summary for no group benchmarks.

## [0.4.9] - 2024-05-13

### Changed

- Add `file` to `run()` option allowing to save the JSON output to a file.

## [0.4.8] - 2024-05-13

### Fixed

- Ensure report returned by `run()` is not cleared.
- Fix `run()` `json` option handling.

## [0.4.7] - 2024-05-13 (not released)

### Fixed

- Ensure report returned by `run()` is not cleared.

## [0.4.6] - 2024-05-13

### Changed

- Add JSON BMF benchmark report format support to allow integration with [Bencher](https://bencher.dev/).

## [0.4.5] - 2024-05-11

### Changed

- Move benchmark options to `run()`.

## [0.4.4] - 2024-04-19

### Fixed

- Fix benchmark function JSDoc type definition.

### Changed

- Add `group()` asynchronous callback support.

## [0.4.3] - 2024-04-17

### Fixed

- Fix JSDoc API description.

## [0.4.2] - 2024-04-17

### Fixed

- Fix `bench()` and `baseline()` type definitions.

## [0.4.1] - 2024-04-16

### Fixed

- Fix browser support.

## [0.4.0] - 2024-04-15

### Fixed

- Fix ESM browser export.

### Changed

- BREAKING CHANGE: rename the default exported file to a more de facto
  standardized namespace. Usage in browser is impacted.

## [0.3.4] - 2024-04-14

### Added

- Add releasing on JSR.

## [0.3.3] - 2024-04-14

### Fixed

- Fix rate computation and formatting in summary.
- Less biased timestamp rounding.
- Refine minimum number of samples for Student t-distribution.

## [0.3.2] - 2024-04-13

### Changed

- Add accurate two-tailed Student t-distribution table for 95% confidence level.

## [0.3.1] - 2024-04-12

### Fixed

- Ensure default minimum samples guarantee statistical significance.

## [0.3.0] - 2024-04-10

### Fixed

- Fix statistical significance threshold value and reporting in JSON.

### Changed

- Add error margin to report.
- Remove IQR filtering since error margin permits to evaluate the results
  statistical significance.
- BREAKING CHANGE: rename in JSON report `std` to `sd` for the standard
  deviation.
- BREAKING CHANGE: switch percentile p999 to p995 in report.

## [0.2.3] - 2024-04-08

### Fixed

- Align `iter/s` with `time (avg)` formatting.

### Changed

- Add median (p50) to console output.

## [0.2.2] - 2024-04-08

### Changed

- Optimize benchmark statistics computation.

## [0.2.1] - 2024-04-07

### Changed

- Add `time: number` to `run()` options specifying the minimum benchmark time in
  nanoseconds.

## [0.2.0] - 2024-04-07

### Fixed

- Fix `measure()` asynchronous implementation.
- Fix percentiles computation.
- Fix inconsistent benchmark behavior: the samples statistical significance
  shall be done on the same measurement base.

### Changed

- Add `clear()` benchmark clearing primitive.
- Optimize JavaScript runtime environment detection code (constify environment
  variables).
- Add IQR samples outlier detection and removal.
- Add standard deviation to JSON report.
- Add `samples: number` to `run()` options specifying the minimum number of
  benchmark samples.
- Add
  `options: { before: () => void | Promise<void>; after: () => void | Promise<void> }`
  to `bench()` and `baseline()` specifying callbacks to run before and after the
  benchmark.
- Add
  `options: { before: () => void | Promise<void>; after: () => void | Promise<void> }`
  to `group()` specifying callbacks to run before and after the group.
- Add `iter/s` to report.
- Add package publication GitHub workflow.

## [0.1.11] - 2024-02-20
