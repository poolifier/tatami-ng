# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
