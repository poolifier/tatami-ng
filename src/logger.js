/**
 * @returns {Function} logger
 */
const getLogger = () => {
  let logger
  if (typeof globalThis.console?.log === 'function') {
    logger = globalThis.console.log
  } else if (typeof globalThis.print === 'function') {
    logger = globalThis.print
  } else {
    throw new Error('no logger function found')
  }
  return logger
}

export const logger = getLogger()
