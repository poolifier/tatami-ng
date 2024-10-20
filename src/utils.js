import { emptyFunction } from './constants.js'

/**
 * Checks if a value is a promise-like object.
 *
 * @param {unknown} maybePromiseLike the value to check
 * @returns {Boolean} true if the value is a promise-like object
 */
const isPromiseLike = maybePromiseLike =>
  maybePromiseLike !== null &&
  typeof maybePromiseLike === 'object' &&
  typeof maybePromiseLike.then === 'function'

/**
 * Checks if a value is a function.
 *
 * @param {unknown} fn the value to check
 * @returns {Boolean} true if the value is a function
 */
export const isFunction = fn => {
  return typeof fn === 'function'
}

/**
 * An async function check helper only considering runtime support async syntax.
 *
 * @param {Function} fn the function to check
 * @returns {Boolean} true if the function is an async function
 */
export const isAsyncFunction = fn => {
  return (async () => {}).constructor === fn?.constructor
}

/**
 * An async function check helper considering runtime support async syntax and promise return.
 *
 * @param {Function} fn the function to check
 * @returns {Boolean} true if the function is an async function or returns a promise
 */
export const isFunctionAsyncResource = fn => {
  if (fn == null) {
    return false
  }
  if (isAsyncFunction(fn)) {
    return true
  }
  try {
    const fnCall = fn()
    const promiseLike = isPromiseLike(fnCall)
    if (promiseLike) {
      // silence promise rejection
      try {
        fnCall.then(emptyFunction)?.catch(emptyFunction)
      } catch {
        // ignore
      }
    }
    return promiseLike
  } catch {
    return false
  }
}

/**
 * Checks if a value is an object.
 *
 * @param {unknown} value the value to check
 * @returns {Boolean} true if the value is an object
 */
export const isObject = value => {
  return Object.prototype.toString.call(value).slice(8, -1) === 'Object'
}

export function roundDuration(ns) {
  if (ns < 1) return (ns * 1e3).toFixed(2)
  if (ns < 1e3) return ns.toFixed(2)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  ns /= 1000
  if (ns < 1e3) return ns.toFixed(2)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  ns /= 1000
  if (ns < 1e3) return ns.toFixed(2)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  ns /= 1000
  if (ns < 1e3) return ns.toFixed(2)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  ns /= 60
  if (ns < 1e3) return ns.toFixed(2)
  // biome-ignore lint/style/noParameterAssign: <explanation>
  ns /= 60
  return ns.toFixed(2)
}

export const checkDividend = n => {
  if (n == null) throw new TypeError(`Invalid dividend: ${n}`)
  if ('number' !== typeof n)
    throw new TypeError(`expected number, got ${n.constructor.name}`)
  if (n === 0 || Number.isNaN(n)) throw new RangeError(`Invalid dividend: ${n}`)
  return n
}
