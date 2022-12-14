class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    if (`${statusCode}`.startsWith('2')) {
      this.status = 'success'
    } else if (`${statusCode}`.startsWith('4')) {
      this.status = 'fail'
    } else {
      this.status = 'error'
    }
    // 用来标识自定义错误
    this.isHandler = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
