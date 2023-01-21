const AppError = require('./AppError');

class KonnectError extends AppError {
  constructor(message, extra) {
    super(404, 'NOT_FOUND', message || 'Not found.');
    this.extra = extra;
  }
}

module.exports = KonnectError;