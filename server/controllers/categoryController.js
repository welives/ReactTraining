const categoryService =
  process.env.DB_CONNECT_TYPE === 'pool'
    ? require('../services/pool/categoryService')
    : require('../services/categoryService')
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
exports.getCateById = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  const result = await categoryService.findOne({ id: req.params.id })
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: result },
  })
})

/**
 * 新增分类
 */
exports.createCategory = catchAsync(async (req, res, next) => {
  const { key, label } = req.body
  if (key && label) {
    await categoryService.createOne({ ...req.body })
    res.status(201).json({
      status: 'success',
      message: 'ok',
      result: { data: null },
    })
  } else {
    return next(new AppError('参数不足', 400))
  }
})

/**
 * 修改分类
 */
exports.updateCategory = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  await categoryService.updateOne({
    ...req.body,
    id: req.params.id,
  })
  const result = await categoryService.findOne({ id: req.params.id })
  res.status(200).json({
    status: 'success',
    message: 'ok',
    result: { data: result },
  })
})

/**
 * 删除分类
 */
exports.deleteCategory = catchAsync(async (req, res, next) => {
  if (!req.params.id) return next(new AppError('缺少id', 400))
  await categoryService.deleteById(req.params.id)
  res.status(204).json({
    status: 'success',
    message: 'ok',
    result: { data: null },
  })
})
