const express = require('express')
const postController = require('../controllers/postController')
const Auth = require('../controllers/authController')
const router = express.Router()

router.route('/list').get(postController.getList)
router.route('/recommend').get(postController.getRecommend)

router.route('/').post(Auth.authCheck, postController.createPost)
router
  .route('/:id')
  .get(postController.getPost)
  .delete(Auth.authCheck, postController.deletePost)

module.exports = router
