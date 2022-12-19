const AppError = require('../utils/appError')
const db = require('../db')

/**
 * 获取文章列表
 */
exports.getPosts = (otp = {}) => {
  const sql =
    'SELECT posts.*, users.username AS author FROM posts JOIN users ON posts.user_id = users.id'
  const where = otp.category
    ? db.format(
        ' JOIN categories ON posts.category_id = categories.id WHERE `key` = ?',
        otp.category
      )
    : ''
  const order = ' ORDER BY posts.id DESC' // 倒序
  return new Promise((resolve, reject) => {
    db.query(sql + where + order, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 获取单篇文章
 */
exports.getPost = (id) => {
  const sql =
    'SELECT posts.*, users.username AS author FROM posts JOIN users ON posts.user_id = users.id'
  const where = db.format(' WHERE posts.id = ?', id)
  return new Promise((resolve, reject) => {
    db.query(sql + where, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 新增
 * @param {Object} opt
 * @returns
 */
exports.createPost = (opt = {}) => {
  const columns = [
    'title',
    'content',
    'cover',
    'cover_uuid',
    'category_id',
    'category_key',
    'user_id',
    'created_at',
  ]
  const values = [
    opt.title,
    opt.content,
    opt.cover,
    opt.coverUuid,
    opt.categoryId,
    opt.categoryKey,
    opt.user_id,
    new Date(),
  ]
  const sql = db.format('INSERT INTO attachments(??) VALUES(?)', [
    columns,
    values,
  ])
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 删除文章
 * @param {Object} opt
 * @returns
 */
exports.deleteOne = (opt = {}) => {
  const sql = 'DELETE FROM posts'
  const where = db.format(' WHERE ? AND ?', [
    { id: opt.id },
    { user_id: opt.user_id },
  ])
  return new Promise((resolve, reject) => {
    db.query(sql + where, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 相关推荐
 */
exports.getRecommend = (opt = {}) => {
  let where = ' WHERE 1'
  // 根据文章的作者或分类进行推荐
  if (opt.user_id && opt.category_id) {
    where += db.format(' AND user_id = ? OR category_id = ?', [
      opt.user_id,
      opt.category_id,
    ])
    // 根据文章作者进行推荐
  } else if (opt.user_id) {
    where += db.format(' AND user_id = ?', opt.user_id)
    // 根据文章分类进行推荐
  } else if (opt.category_id) {
    where += db.format(' AND category_id = ?', opt.category_id)
  }
  const sql =
    'SELECT posts.*, users.username AS author FROM posts JOIN users ON posts.user_id = users.id'
  const limit = ' LIMIT 0,5' // 只要前5条
  const order = ' ORDER BY posts.id DESC' // 倒序
  return new Promise((resolve, reject) => {
    db.query(sql + where + order + limit, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      opt.id ? resolve(res.filter((el) => el.id != opt.id)) : resolve(res)
    })
  })
}

/**
 * 构造查询条件
 * @param {Array} map
 * @returns
 */
exports.where = (map = []) => {
  let where = ''
  // 只有一个值的时候默认找id
  if (map.length === 1) {
    where += db.format(` WHERE ?`, [{ id: map[0] }])
    // 两个值的时候,下标0是字段名, 下标1是要查的值
  } else if (map.length === 2) {
    where += db.format(` WHERE ?`, [{ [map[0]]: map[1] }])
    // 三个值的时候下标0是字段名, 下标1是操作符, 下标2是要查的值
  } else if (map.length === 3) {
    where += db.format(` WHERE ?? ${map[1]} ?`, [map[0], map[2]])
  }
  return where
}
