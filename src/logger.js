/**
 * @returns {Function} logger
 */
const buildLogger = () => {
  let logger
  try {
    logger = console.log
  } catch {
    logger = print
  }
  if ('function' !== typeof logger)
    throw new TypeError(`logger is not a function: ${typeof logger}`)
  return logger
}

export const logger = buildLogger()
