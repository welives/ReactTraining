const bcrypt = require('bcryptjs')
const validator = require('validator')
const AppError = require('../utils/appError')
const Auth = require('./authController')
const db = require('../db')

/**
 * 注册
 */
exports.register = (req, res, next) => {
  const { username, email, password } = req.body
  if (!validator.isEmail(email))
    return next(new AppError('邮箱格式不正确', 400))

  // 1. 先查出是否被占用
  let sql = 'SELECT * FROM `users` WHERE `email` = ? OR `username` = ?'
  db.query(sql, [email, username], (err, data) => {
    if (err) return next(new AppError('数据库操作错误', 500))
    if (data.length) return next(new AppError('用户已存在', 409))

    // 2. 没被占用就对提交上来的密码进行加密
    const hashPassword = bcrypt.hashSync(password, 12)
    sql =
      'INSERT INTO users(`username`, `email`, `password`, `created_at`) VALUES(?)'
    const values = [username, email, hashPassword, new Date()]
    // 3. 插入一条新记录
    db.query(sql, [values], (err, data) => {
      if (err) return next(new AppError('数据库操作错误', 500))
      console.log(data)
      Auth.sendToken(
        { id: data.insertId, username, email },
        201,
        '注册成功',
        res
      )
    })
  })
}

/**
 * 登录
 */
exports.login = (req, res, next) => {
  if (!validator.isEmail(req.body.email))
    return next(new AppError('邮箱格式不正确', 400))

  // 1. 先查找是否有该用户
  let sql = 'SELECT * FROM `users` WHERE `email` = ?'
  db.query(sql, req.body.email, (err, data) => {
    if (err) return next(new AppError('数据库操作错误', 500))
    if (data.length === 0) return next(new AppError('用户不存在', 404))

    // 2. 如果有的话就进行密码比对
    const isPasswordCorrect = bcrypt.compareSync(
      req.body.password,
      data[0].password
    )
    if (!isPasswordCorrect) return next(new AppError('邮箱或密码不正确', 404))
    const { password, ...other } = data[0]
    Auth.sendToken(other, 200, '登陆成功', res)
  })
}

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
