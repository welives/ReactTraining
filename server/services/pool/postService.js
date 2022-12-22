const AppError = require('../../utils/appError')
const query = require('../../pool')
const { format } = require('mysql')

/**
 * 查询多个
 */
exports.select = (opt = {}) => {
  const sql = 'SELECT * FROM posts JOIN users ON posts.user_id = users.id'
  const where = opt.category_key
    ? format(' WHERE posts.?', [{ category_key: opt.category_key }])
    : ''
  const order = ' ORDER BY posts.id DESC' // 倒序
  const options = {
    sql: sql + where + order,
    nestTables: true,
  }
  return new Promise((resolve, reject) => {
    query(options, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      const posts = res.map((el) => {
        return {
          ...el.posts,
          author: { id: el.users.id, username: el.users.username },
        }
      })
      resolve(posts)
    })
  })
}

/**
 * 查询单个
 * @param {Object} opt 查询条件
 * @returns
 */
exports.findOne = (opt = {}) => {
  const sql = 'SELECT * FROM posts JOIN users ON posts.user_id = users.id'
  const where = format(' WHERE posts.?', [opt])
  const options = {
    sql: sql + where,
    nestTables: true,
  }
  return new Promise((resolve, reject) => {
    query(options, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      if (res.length === 0) return reject(new AppError('资源不存在', 404))
      const { posts, users } = res[0]
      posts.author = {
        id: users.id,
        username: users.username,
      }
      resolve(posts)
    })
  })
}

/**
 * 新增
 * @param {Object} opt
 * @returns
 */
exports.createOne = (opt = {}) => {
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
  const sql = format('INSERT INTO posts(??) VALUES(?)', [columns, values])
  console.log(sql)
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 修改单个
 * @param {Object} opt
 * @returns
 */
exports.updateOne = (opt = {}) => {
  const columns = {
    title: opt.title,
    content: opt.content,
    cover: opt.cover,
    cover_uuid: opt.cover_uuid,
    category_id: opt.category_id,
    category_key: opt.category_key,
    updated_at: new Date(),
  }
  for (const key in columns) {
    if (!columns[key]) delete columns[key]
  }
  const where = { id: opt.id }
  const sql = format('UPDATE posts SET ? WHERE ?', [columns, where])
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
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
  const where = format(' WHERE ? AND ?', [
    { id: opt.id },
    { user_id: opt.user_id },
  ])
  return new Promise((resolve, reject) => {
    query(sql + where, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 相关推荐
 */
exports.getRecommend = (opt = {}) => {
  const whereArr = Object.keys(opt).reduce((prev, cur) => {
    return [...prev, [cur, opt[cur]]]
  }, [])
  let where = ''
  whereArr.map((el) => {
    where += this.where(el)
  })
  where = where.replace(/\bWHERE\b/g, (match, index, str) =>
    index === 1 ? match : 'OR'
  )
  const sql = 'SELECT * FROM posts JOIN users ON posts.user_id = users.id'
  const limit = ' LIMIT 0,5' // 只要前5条
  const order = ' ORDER BY posts.id DESC' // 倒序
  const options = {
    sql: sql + where + order + limit,
    nestTables: true,
  }
  return new Promise((resolve, reject) => {
    query(options, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      if (res.length === 0) return reject(new AppError('暂无推荐', 404))
      const posts = res.map((el) => {
        return {
          ...el.posts,
          author: { id: el.users.id, username: el.users.username },
        }
      })
      resolve(posts)
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
    where += format(` WHERE ?`, [{ id: map[0] }])
    // 两个值的时候,下标0是字段名, 下标1是要查的值
  } else if (map.length === 2) {
    where += format(` WHERE ?`, [{ [map[0]]: map[1] }])
    // 三个值的时候下标0是字段名, 下标1是操作符, 下标2是要查的值
  } else if (map.length === 3) {
    where += format(` WHERE ?? ${map[1]} ?`, [map[0], map[2]])
  }
  return where
}
