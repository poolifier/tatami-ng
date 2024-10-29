import { JSRuntime } from './constants.js'

const isBun = !!globalThis.Bun || !!globalThis.process?.versions?.bun
const isDeno = !!globalThis.Deno
const isNode = globalThis.process?.release?.name === 'node'
// const isHermes = !!globalThis.HermesInternal
// const isWorkerd = globalThis.navigator?.userAgent === 'Cloudflare-Workers'
const isBrowser = !!globalThis.navigator

export const runtime = (() => {
  if (isBun) return JSRuntime.bun
  if (isDeno) return JSRuntime.deno
  if (isNode) return JSRuntime.node
  // if (isHermes) return JSRuntime.hermes
  // if (isWorkerd) return JSRuntime.workerd
  if (isBrowser) return JSRuntime.browser

  return 'unknown'
})()
