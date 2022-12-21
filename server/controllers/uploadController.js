const fs = require('fs')
const path = require('path')
const multer = require('multer')
const dayjs = require('dayjs')
const uuid = require('uuid')
const attachService = require('../services/attachService')
const AppError = require('../utils/appError')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = this.isUploadPathExist()
    const savePath = this.isSavePathExist(uploadPath)
    cb(null, savePath)
  },
  filename: (req, file, cb) => {
    cb(null, uuid.v1() + path.extname(file.originalname))
  },
})
exports.upload = multer({ storage })

/**
 * 检查上传的根目录是否存在并创建
 */
exports.isUploadPathExist = () => {
  // 文件上传的根目录
  const uploadPath = path.resolve(__dirname, `../public/uploads`)
  try {
    fs.accessSync(uploadPath)
  } catch (error) {
    fs.mkdirSync(uploadPath)
  }
  return uploadPath
}

/**
 * 检查保存目录是否存在并创建
 * @param {String} uploadPath
 * @param {Number} date
 * @returns
 */
exports.isSavePathExist = (uploadPath, date = Date.now()) => {
  // 最终是按日期生成文件夹保存
  const savePath = path.join(uploadPath, dayjs(date).format('YYYY-MM-DD'))
  try {
    fs.accessSync(savePath)
  } catch (error) {
    fs.mkdirSync(savePath)
  }
  return savePath
}

/**
 * 单文件上传
 */
exports.uploadOne = (req, res, next) => {
  this.upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return next(new AppError('上传失败', 500))
    } else if (err) {
      return next(new AppError('上传失败', 500))
    }
    try {
      let result = await attachService.create(req.file, {
        type: req.body.type,
        user_id: req.user.id,
      })
      result = await attachService.findOne({ id: result.insertId })
      res.status(200).json({
        status: 'success',
        message: 'ok',
        result: { data: result },
      })
    } catch (error) {
      next(error)
    }
  })
}
