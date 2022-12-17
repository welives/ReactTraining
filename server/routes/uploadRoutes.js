const express = require('express')
const multer = require('multer')
const dayjs = require('dayjs')
const fs = require('fs')
const path = require('path')
const Auth = require('../controllers/authController')
const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // 文件上传的根目录
    const uploadPath = path.resolve(__dirname, `../public/uploads`)
    try {
      fs.accessSync(uploadPath)
    } catch (error) {
      fs.mkdirSync(uploadPath)
    }
    // 最终是按日期生成文件夹保存
    const savePath = path.join(
      uploadPath,
      dayjs(Date.now()).format('YYYY-MM-DD')
    )
    try {
      fs.accessSync(savePath)
    } catch (error) {
      fs.mkdirSync(savePath)
    }
    cb(null, savePath)
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-[${req.user.username}]-${file.originalname}`)
  },
})
const upload = multer({ storage })

router
  .route('/')
  .post(Auth.authCheck, upload.single('file'), (req, res, next) => {
    console.log(req.file)
    const savePath = path.join(
      path.basename(req.file.destination),
      req.file.filename
    )
    res.status(200).json({
      status: 'success',
      message: 'ok',
      result: { data: savePath },
    })
  })

module.exports = router
