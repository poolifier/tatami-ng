# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
