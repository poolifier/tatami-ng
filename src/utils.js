export const isFunction = fn => {
  return typeof fn === 'function'
}

export const AsyncFunction = (async () => {}).constructor

export const isAsyncFunction = fn => {
  return AsyncFunction === fn.constructor
}

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
