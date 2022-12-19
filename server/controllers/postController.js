const postService = require('../services/postService')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

/**
 * 获取文章列表
 */
exports.getList = catchAsync(async (req, res) => {
  const result = await postService.select({ category_key: req.query.category })
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: result },
  })
})

/**
 * 根据id获取单篇文章
 */
exports.getPostById = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  const result = await postService.findOne({ id: req.params.id })
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: result },
  })
})

/**
 * 新增文章
 */
exports.createPost = catchAsync(async (req, res, next) => {
  const { title, content, cover, cover_uuid, category_id, category_key } =
    req.body
  if (title && content && cover && cover_uuid && category_id && category_key) {
    let result = await postService.createPost({
      ...req.body,
      user_id: req.user.id,
    })
    result = await postService.findOne({ id: result.insertId })
    res.status(200).json({
      status: 'success',
      message: 'ok',
      result: { data: result },
    })
  } else {
    return next(new AppError('参数不足', 400))
  }
})

/**
 * 相关推荐
 */
exports.getRecommend = catchAsync(async (req, res) => {
  // query可能的值为id, user_id和category_id, 根据这三个参数的携带情况进行推荐
  const { id, user_id, category_id } = req.query
  const result = await postService.getRecommend({ user_id, category_id })
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: id ? result.filter((el) => el.id != id) : result },
  })
})

/**
 * 删除文章
 */
exports.deletePost = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  const result = await postService.deleteOne({
    id: req.params.id,
    user_id: req.user.id,
  })
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: result },
  })
})
