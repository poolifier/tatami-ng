# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Fix `measure()` asynchronous implementation.
- Fix percentiles computation.
- Fix warmup status in JSON report.

### Changed

- Add `clear()` benchmark clearing primitive.
- Optimize JavaScript runtime environment detection code (constify environment
  variables).
- Add measurement outliers detection and removal.
- Add standard deviation to JSON report.
- Add `samples: { warmup: number; benchmark: number }` to `run()` options
  specifying the number of samples to run during warmup and benchmark.
- Add
  `options: { before: () => void | Promise<void>; after: () => void | Promise<void> }`
  to `bench()` and `baseline()` specifying actions to run before and after the
  benchmark.

## [0.1.11] - 2024-02-20
