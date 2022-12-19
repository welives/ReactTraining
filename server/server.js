// 加载配置
require('dotenv').config({ path: './config.env' })
// 连接数据库
require('./db')

const app = require('./app')

// 未捕获的错误
process.on('uncaughtException', (err) => {
  console.error(`出现未捕获的错误! 💥 服务器即将关闭...`)
  process.exit(1)
})

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`)
})

// 未处理的错误
process.on('unhandledRejection', (err) => {
  console.error(`出现未处理的错误! 💥 服务器即将关闭...`)
  server.close(() => process.exit(1))
})
