const db = require('../db')

exports.getPosts = (req, res, next) => {
  res.status(200).json({
    status: 'success',
    result: {
      data: null,
    },
  })
}
