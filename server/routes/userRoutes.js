const express = require('express')
const userController = require('../controllers/userController')
const Auth = require('../controllers/authController')

const router = express.Router()

router.route('/register').post(userController.register)
router.route('/login').post(userController.login)
router.route('/logout').get(Auth.authCheck, userController.logout)

module.exports = router
