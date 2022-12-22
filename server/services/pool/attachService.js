const query = require('../../pool')
const { format } = require('mysql')
const path = require('path')
const sizeOf = require('image-size')
const AppError = require('../../utils/appError')

/**
 * 新增
 * @param {Object} file
 * @param {Object} opt
 * @returns
 */
exports.create = (file, opt = {}) => {
  let columns, values
  const uuid = path.basename(file.filename, path.extname(file.filename))
  const savePath = path.join(path.basename(file.destination), file.filename)
  if (opt.type === 'image') {
    const { width, height } = sizeOf(file.path)
    columns = [
      'uuid',
      'type',
      'mime_type',
      'size',
      'width',
      'height',
      'original_name',
      'save_path',
      'user_id',
      'created_at',
    ]
    values = [
      uuid,
      opt.type,
      file.mimetype,
      file.size,
      width,
      height,
      file.originalname,
      savePath,
      opt.user_id,
      new Date(),
    ]
  }
  const sql = format('INSERT INTO attachments(??) VALUES(?)', [columns, values])
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
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
  const sql = format('SELECT * FROM attachments WHERE ?', [opt])
  return new Promise((resolve, reject) => {
    query(sql, (err, res) => {
      if (err) return reject(new AppError('数据库操作错误', 500))
      if (res.length === 0) return reject(new AppError('资源不存在', 404))
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
