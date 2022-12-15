const AppError = require('../utils/appError')
const catchAsync = require('../utils/catchAsync')
const db = require('../db')
const postService = require('../services/postService')

/**
 * 获取文章列表
 */
exports.getPosts = catchAsync(async (req, res) => {
  const result = await postService.getPosts(req.query)
  res.status(200).json({
    status: 'success',
    result: { data: result },
  })
})

/**
 * 获取单篇文章
 */
exports.getPost = (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  const sql =
    'SELECT posts.*, users.username AS author FROM posts JOIN users ON posts.uid = users.id'
  const where = db.format(' WHERE posts.id = ?', req.params.id)
  db.query(sql + where, (err, result) => {
    if (err) return next(new AppError('数据库操作错误', 500))
    res.status(200).json({
      status: 'success',
      result: { data: result.length ? result[0] : null },
    })
  })
}

/**
 * 相关推荐
 */
exports.getRecommend = catchAsync(async (req, res) => {
  const result = await postService.getRecommend(req.query)
  res.status(200).json({
    status: 'success',
    result: { data: result.filter((el) => el.id != req.query.id) },
  })
})
