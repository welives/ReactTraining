const express = require('express')
const postController = require('../controllers/postController')

const router = express.Router()

router.route('/list').get(postController.getList)
router.route('/recommend').get(postController.getRecommend)
router.route('/:id').get(postController.getPost)

module.exports = router
