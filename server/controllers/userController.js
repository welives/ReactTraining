const bcrypt = require('bcryptjs')
const validator = require('validator')
const Auth = require('./authController')
const userService =
  process.env.DB_CONNECT_TYPE === 'pool'
    ? require('../services/pool/userService')
    : require('../services/userService')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

/**
 * 注册
 */
exports.register = catchAsync(async (req, res, next) => {
  const { username, email } = req.body
  if (!validator.isEmail(email))
    return next(new AppError('邮箱格式不正确', 400))

  // 1. 先查出是否已存在
  if (await userService.isExist({ username, email })) {
    return next(new AppError('用户名或邮箱已被占用', 409))
  } else {
    // 没被占用就创建一个新用户
    const hashPassword = bcrypt.hashSync(req.body.password, 12)
    const result = await userService.createUser({
      ...req.body,
      password: hashPassword,
    })
    Auth.sendToken(
      { id: result.insertId, username, email },
      201,
      '注册成功',
      res
    )
  }
})

/**
 * 登录
 */
exports.login = catchAsync(async (req, res, next) => {
  if (!validator.isEmail(req.body.email))
    return next(new AppError('邮箱格式不正确', 400))

  const result = await userService.findOne({ email: req.body.email })
  const isPasswordCorrect = bcrypt.compareSync(
    req.body.password,
    result.password
  )
  if (!isPasswordCorrect) return next(new AppError('邮箱或密码不正确', 404))
  const { password, ...other } = result
  Auth.sendToken(other, 200, '登陆成功', res)
})

/**
 * 退出
 */
exports.logout = (req, res, next) => {
  res
    .clearCookie('access_token', { sameSite: 'none', secure: true })
    .status(200)
    .json({
      status: 'success',
      message: '您已退出',
      result: null,
    })
}
