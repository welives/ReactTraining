// 加载配置
require('dotenv').config({ path: './config.env' })
// 连接数据库
require('./db')

const app = require('./app')

// 未捕获的错误
process.on('uncaughtException', (err) => {
  console.log(`${'uncaught Exception!'.toUpperCase()} 💥 Shutting down...`)
  process.exit(1)
})

const server = app.listen(process.env.PORT, () => {
  console.log(`App running on port ${process.env.PORT}...`)
})

// 未处理的错误
process.on('unhandledRejection', (err) => {
  console.log(`${'unhandled Rejection!'.toUpperCase()} 💥 Shutting down...`)
  server.close(() => process.exit(1))
})
