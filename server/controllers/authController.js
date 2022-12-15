const jwt = require('jsonwebtoken')
const AppError = require('../utils/appError')
const db = require('../db')

/**
 * 生成token签名
 * @param {String} id 用户id
 * @returns token签名
 */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })

/**
 * 发送token给用户
 * @param {Object} user 用户对象
 * @param {Number} statusCode http状态码
 * @param {String} message 返回消息
 * @param {Object} res 响应体
 */
exports.sendToken = (user, statusCode, message, res) => {
  const token = signToken(user.id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 100
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true
  res
    .cookie('access_token', token, cookieOptions)
    .status(statusCode)
    .json({
      status: 'success',
      message,
      result: {
        data: user,
      },
    })
}

/**
 * 验证token
 */
exports.authCheck = (req, res, next) => {
  // 1) 获取token
  const token =
    req.headers.authorization && req.headers.authorization.startsWith('Bearer')
      ? req.headers.authorization.split(' ')[1]
      : req.cookies.access_token ?? req.cookies.access_token
  if (!token)
    return next(new AppError('您还未登录! 请先登录再进行相关操作', 401))
  // 2) 验证token
  const decode = jwt.verify(token, process.env.JWT_SECRET)
  // 3) 检查token所携带的用户信息
  const sql = 'SELECT * FROM users'
  const where = db.format(' WHERE id = ?', decode.id)
  db.query(sql + where, (err, result) => {
    if (err) return next(new AppError('数据库操作错误', 500))
    if (result.length === 0) return next(new AppError('用户不存在', 404))
    // 传递用户信息给下一个中间件
    req.user = result[0]
    next()
  })
}
