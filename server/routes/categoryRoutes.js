const express = require('express')
const cateController = require('../controllers/categoryController')

const router = express.Router()

router.route('/list').get(cateController.getCategories)
router.route('/:id').get(cateController.getCategory)

module.exports = router
