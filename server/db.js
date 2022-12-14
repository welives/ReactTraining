const mysql = require('mysql')

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})

db.connect((err) => {
  if (err) {
    console.error('MySQL连接失败: ' + err.stack)
    return
  }
  console.log('MySQL连接成功,id为' + db.threadId)
})
db.on('error', (err) => {
  console.error('数据库错误:', err)
})

module.exports = db
