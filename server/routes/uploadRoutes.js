const express = require('express')
const Auth = require('../controllers/authController')
const uploadController = require('../controllers/uploadController')
const router = express.Router()

router.route('/').post(Auth.authCheck, uploadController.uploadOne)

module.exports = router
