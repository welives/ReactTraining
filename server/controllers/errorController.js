const AppError = require('../utils/appError')

// 开发环境打印错误
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  })
}

// 生产环境打印错误
const sendErrorProd = (err, res) => {
  // 已知的自定义错误，可以发送到客户端
  if (err.isHandler) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
    // 服务器、程序自身或其他未知的错误
  } else {
    // 1）记录错误日志
    console.error('Error 💥:', err)
    // 2）发送错误信息
    res.status(500).json({
      status: 'error',
      message: '服务器异常!',
    })
  }
}

const handleJWTError = () => new AppError('token验证失败,请重新登录', 401)

const handleJWTExpiredError = () => new AppError('token已失效,请重新登录', 401)

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else {
    let error = { ...err }
    // 处理自定义错误
    if (err.name === 'JsonWebTokenError') error = handleJWTError(err)
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(err)
    sendErrorProd(error, res)
  }
}
