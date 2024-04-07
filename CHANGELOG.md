# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.0-0] - 2024-04-07

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
  `{ before: () => void | Promise<void>; after: () => void | Promise<void> }` to
  `group()` specifying callbacks to run before and after the group.
- Add `iter/s` to report.

## [0.1.11] - 2024-02-20
