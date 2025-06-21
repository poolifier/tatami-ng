export function duration(ns) {
  if (ns < 1) return `${(ns * 1e3).toFixed(2)} ps`
  if (ns < 1e3) return `${ns.toFixed(2)} ns`
  // biome-ignore lint/style/noParameterAssign: explanation
  ns /= 1000
  if (ns < 1e3) return `${ns.toFixed(2)} µs`
  // biome-ignore lint/style/noParameterAssign: explanation
  ns /= 1000
  if (ns < 1e3) return `${ns.toFixed(2)} ms`
  // biome-ignore lint/style/noParameterAssign: explanation
  ns /= 1000
  if (ns < 1e3) return `${ns.toFixed(2)} s`
  // biome-ignore lint/style/noParameterAssign: explanation
  ns /= 60
  if (ns < 1e3) return `${ns.toFixed(2)} m`
  // biome-ignore lint/style/noParameterAssign: explanation
  ns /= 60
  return `${ns.toFixed(2)} h`
}

export function itersPerSecond(iters) {
  return `${iters.toFixed(0)}`
}

export function errorMargin(rmoe) {
  return `${rmoe.toFixed(2)} %`
}

export function speedRatio(ratio) {
  return `${ratio.toFixed(2)}`
}
