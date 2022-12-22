const AppError = require('../../utils/appError')
const query = require('../../pool')
const { format } = require('mysql')

/**
 * 检查是否已被占用
 * @param {Object} opt 邮箱或用户名
 * @returns
 */
exports.isExist = (opt = {}) => {
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
  const sql = 'SELECT * FROM users'
  return new Promise((resolve, reject) => {
    query(sql + where, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      res.length ? resolve(true) : resolve(false)
    })
  })
}

/**
 * 新增用户
 * @param {Object} opt 新增用户参数
 * @returns
 */
exports.createUser = (opt = {}) => {
  const columns = ['username', 'email', 'password', 'created_at']
  const values = [opt.username, opt.email, opt.password, new Date()]
  const sql = format('INSERT INTO users(??) VALUES(?)', [columns, values])
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 查询单个
 * @param {Object} opt 邮箱或用户名
 * @returns
 */
exports.findOne = (opt = {}) => {
  const sql = format('SELECT * FROM users WHERE ?', [opt])
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      if (res.length === 0) return reject(new AppError('用户不存在', 404))
      resolve(res[0])
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
