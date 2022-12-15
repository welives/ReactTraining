const AppError = require('../utils/appError')
const db = require('../db')

/**
 * 获取分类列表
 */
exports.getCategories = (req, res, next) => {
  const sql = 'SELECT * FROM categories'
  const where = req.query.id
    ? db.format(' WHERE id = ?', req.query.id)
    : req.query.key
    ? db.format(' WHERE `key` = ?', req.query.key)
    : req.query.label
    ? db.format(' WHERE label LIKE ?', `%${req.query.label}%`)
    : ''
  db.query(sql + where, (err, result) => {
    if (err) return next(new AppError('数据库操作错误', 500))
    res.status(200).json({
      status: 'success',
      result: { data: result },
    })
  })
}

/**
 * 获取单个分类
 */
exports.getCategory = (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  const sql = 'SELECT * FROM categories'
  const where = db.format(' WHERE id = ?', req.params.id)
  db.query(sql + where, (err, result) => {
    if (err) return next(new AppError('数据库操作错误', 500))
    res.status(200).json({
      status: 'success',
      result: { data: result.length ? result[0] : null },
    })
  })
}
