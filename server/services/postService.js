const AppError = require('../utils/appError')
const db = require('../db')

/**
 * 获取文章列表
 */
exports.getPosts = (otp = {}) => {
  const sql =
    'SELECT posts.*, users.username AS author FROM posts JOIN users ON posts.uid = users.id'
  const where = otp.category
    ? db.format(
        ' JOIN categories ON posts.category_id = categories.id WHERE `key` = ?',
        otp.category
      )
    : ''
  return new Promise((resolve, reject) => {
    db.query(sql + where, (err, result) => {
      if (err) reject(new AppError('数据库操作错误', 500))
      resolve(result)
    })
  })
}

/**
 * 相关推荐
 */
exports.getRecommend = (opt = {}) => {
  let where = ' WHERE 1'
  if (opt.uid && opt.cid) {
    where += db.format(' AND uid = ? OR category_id = ?', [opt.uid, opt.cid])
  } else if (opt.uid) {
    where += db.format(' AND uid = ?', opt.uid)
  } else if (opt.cid) {
    where += db.format(' AND category_id = ?', opt.cid)
  }
  const sql =
    'SELECT posts.*, users.username AS author FROM posts JOIN users ON posts.uid = users.id'
  return new Promise((resolve, reject) => {
    db.query(sql + where, (err, result) => {
      if (err) reject(new AppError('数据库操作错误', 500))
      resolve(result)
    })
  })
}
