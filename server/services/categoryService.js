const AppError = require('../utils/appError')
const db = require('../db')

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
    db.query(sql + where, (err, res) => {
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
  const sql = db.format('SELECT * FROM categories WHERE ?', [opt])
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      if (res.length === 0) return reject(new AppError('分类不存在', 404))
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
