const express = require('express')
const cateController = require('../controllers/categoryController')
const router = express.Router()

router.route('/list').get(cateController.getList)
router.route('/').post(cateController.createCategory)
router
  .route('/:id')
  .get(cateController.getCateById)
  .patch(cateController.updateCategory)
  .delete(cateController.deleteCategory)

module.exports = router
