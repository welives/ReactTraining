const express = require('express')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const AppError = require('./utils/appError')
const globalErrorHandler = require('./controllers/errorController')
const app = express()

// HTTP Header信息保护
app.use(helmet())

// 开发环境日志记录
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// 解析json格式的请求体数据
app.use(express.json())
// 解析url-encoded格式的数据
app.use(express.urlencoded({ extended: false }))

// cookie解析
app.use(cookieParser())

// 静态资源
app.use(express.static(path.resolve(__dirname, 'public')))

app.use('/api/auth', require('./routes/userRoutes'))
app.use('/api/post', require('./routes/postRoutes'))
app.use('/api/category', require('./routes/categoryRoutes'))

// 捕获所有未被匹配的路由,必须放在所有路由的最后
app.all('*', (req, res, next) => {
  next(new AppError(`没有找到与 ${req.originalUrl} 相匹配的路由`, 404))
})

// 错误处理中间件
app.use(globalErrorHandler)

module.exports = app
