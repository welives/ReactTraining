const categoryService = require('../services/categoryService')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')

/**
 * 获取分类列表
 */
exports.getList = catchAsync(async (req, res) => {
  const result = await categoryService.select(req.query)
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: result },
  })
})

/**
 * 根据id获取单个分类
 */
exports.getOneById = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  const result = await categoryService.findOne({ id: req.params.id })
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: result },
  })
})
