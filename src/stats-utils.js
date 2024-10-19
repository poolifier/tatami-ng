import { checkDividend } from './utils.js'

export const variance = (samples, avg = average(samples)) => {
  return (
    samples.reduce((a, b) => a + (b - avg) ** 2, 0) /
    checkDividend(samples.length - 1) // Bessel's correction
  )
}

export const quantileSorted = (samples, q) => {
  if (!Array.isArray(samples)) {
    throw new TypeError(`expected array, got ${samples.constructor.name}`)
  }
  if (samples.length === 0) {
    throw new Error('expected non-empty array, got empty array')
  }
  if (q < 0 || q > 1) {
    throw new Error('q must be between 0 and 1')
  }
  if (q === 0) {
    return samples[0]
  }
  if (q === 1) {
    return samples[samples.length - 1]
  }
  const base = (samples.length - 1) * q
  const baseIndex = Math.floor(base)
  if (samples[baseIndex + 1] != null) {
    return (
      samples[baseIndex] +
      (base - baseIndex) * (samples[baseIndex + 1] - samples[baseIndex])
    )
  }
  return samples[baseIndex]
}

export const medianSorted = samples => quantileSorted(samples, 0.5)

export const average = samples => {
  if (!Array.isArray(samples)) {
    throw new TypeError(`expected array, got ${samples.constructor.name}`)
  }
  if (samples.length === 0) {
    throw new Error('expected non-empty array, got empty array')
  }

  return samples.reduce((a, b) => a + b, 0) / samples.length
}

export const absoluteDeviation = (
  samples,
  aggFn,
  aggValue = aggFn(samples)
) => {
  const absoluteDeviations = []

  for (const sample of samples) {
    absoluteDeviations.push(Math.abs(sample - aggValue))
  }

  return aggFn(absoluteDeviations)
}

// https://en.wikipedia.org/wiki/Propagation_of_uncertainty#Example_formulae
export const ratioStandardDeviation = (avgA, sdA, avgB, sdB) => {
  return (
    (avgA / checkDividend(avgB)) *
    Math.sqrt(
      (sdA / checkDividend(avgA)) ** 2 + (sdB / checkDividend(avgB)) ** 2
    )
  )
}
