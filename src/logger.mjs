let _logger;
try {
  _logger = console.log;
  if ('function' !== typeof _logger) throw 1;
} catch {
  _logger = print;
}

export const logger = _logger;
