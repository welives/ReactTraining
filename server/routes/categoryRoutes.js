const express = require('express')
const cateController = require('../controllers/categoryController')
const router = express.Router()

router.route('/list').get(cateController.getList)
router.route('/:id').get(cateController.getOneById)

module.exports = router
