const AppError = require('../../utils/appError')
const query = require('../../pool')
const { format } = require('mysql')

/**
 * 查询多个
 */
exports.select = (opt = {}) => {
  // 将查询条件整理成数组, 数组的排列规则按照下面的 where方法
  const whereArr = Object.keys(opt).reduce((prev, cur) => {
    const curTemp =
      cur === 'label' ? [cur, 'LIKE', `%${opt[cur]}%`] : [cur, opt[cur]]
    return [...prev, curTemp]
  }, [])
  let where = ''
  // 拼接查询条件字符串
  whereArr.map((el) => {
    where += this.where(el)
  })
  /**
   * 第二个回调函数的参数说明:
   * match 是当前匹配项
   * index 是当前匹配项在字符串中的位置
   * str 是原始字符串
   */
  // 把多余的 WHERE 关键字替换成 AND
  where = where.replace(/\bWHERE\b/g, (match, index, str) =>
    index === 1 ? match : 'AND'
  )
  const sql = 'SELECT * FROM categories'
  return new Promise((resolve, reject) => {
    query(sql + where, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 查询单个
 * @param {Object} opt 查询条件
 * @returns
 */
exports.findOne = (opt = {}) => {
  const sql = format('SELECT * FROM categories WHERE ?', [opt])
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      if (res.length === 0) return reject(new AppError('资源不存在', 404))
      resolve(res[0])
    })
  })
}

/**
 * 新增
 * @param {Object} opt
 * @returns
 */
exports.createOne = (opt = {}) => {
  const columns = ['key', 'label', 'pid', 'created_at']
  const values = [opt.key, opt.label, opt.pid ?? 0, new Date()]
  const sql = format('INSERT INTO categories(??) VALUES(?)', [columns, values])
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
    key: opt.key,
    label: opt.label,
    pid: opt.pid,
    updated_at: new Date(),
  }
  for (const key in columns) {
    if (!columns[key]) delete columns[key]
  }
  const where = { id: opt.id }
  const sql = format('UPDATE categories SET ? WHERE ?', [columns, where])
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
    })
  })
}

/**
 * 删除单个
 * @param {Number | String} id
 * @returns
 */
exports.deleteById = (id) => {
  const sql = format('DELETE FROM categories WHERE id = ?', id)
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      resolve(res)
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
