const postService = require('../services/postService')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

/**
 * 获取文章列表
 */
exports.getList = catchAsync(async (req, res) => {
  const result = await postService.getPosts(req.query)
  res.status(200).json({
    status: 'success',
    result: { data: result },
  })
})

/**
 * 获取单篇文章
 */
exports.getPost = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  const result = await postService.getPost(req.params.id)
  res.status(200).json({
    status: 'success',
    result: { data: result.length ? result[0] : null },
  })
})

/**
 * 相关推荐
 */
exports.getRecommend = catchAsync(async (req, res) => {
  const result = await postService.getRecommend(req.query)
  res.status(200).json({
    status: 'success',
    result: { data: result },
  })
})
