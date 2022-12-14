# React 博客全栈练习

## 所需页面
```
Home.jsx
Login.jsx
Register.jsx
Post.jsx
Publish.jsx
```

## 创建路由
```js
// router/index.js
import { createBrowserRouter, Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import Register from '../pages/Register/Register'
import Login from '../pages/Login/Login'
import Home from '../pages/Home/Home'
import Post from '../pages/Post/Post'
import Publish from '../pages/Publish/Publish'
function Layout() {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  )
}
const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/post/:id',
        element: <Post />,
      },
      {
        path: '/publish',
        element: <Publish />,
      },
    ],
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/register',
    element: <Register />,
  },
])
```

## 挂载路由
```js
// App.js
import { RouterProvider } from 'react-router-dom'
import router from './router/index'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}
```

## 后端使用express + mysql
安装
```
npm i express mysql
```

app.js
```js
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
app.use('/api/posts', require('./routes/postRoutes'))

// 捕获所有未被匹配的路由,必须放在所有路由的最后
app.all('*', (req, res, next) => {
  next(new AppError(`没有找到与 ${req.originalUrl} 相匹配的路由`, 404))
})

// 错误处理中间件
app.use(globalErrorHandler)

module.exports = app
```

db.js
```js
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
module.exports = db
```

server.js
```js
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
```

## 自定义错误处理
appError.js
```js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message)
    this.statusCode = statusCode
    if (`${statusCode}`.startsWith('2')) {
      this.status = 'success'
    } else if (`${statusCode}`.startsWith('4')) {
      this.status = 'fail'
    } else {
      this.status = 'error'
    }
    // 用来标识自定义错误
    this.isHandler = true

    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = AppError
```

```js
const AppError = require('../utils/appError')

// 开发环境打印错误
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
  })
}

// 生产环境打印错误
const sendErrorProd = (err, res) => {
  // 已知的自定义错误，可以发送到客户端
  if (err.isHandler) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    })
    // 服务器、程序自身或其他未知的错误
  } else {
    // 1）记录错误日志
    console.error('Error 💥:', err)
    // 2）发送错误信息
    res.status(500).json({
      status: 'error',
      message: '服务器异常!',
    })
  }
}

const handleJWTError = () => new AppError('token验证失败,请重新登录', 401)

const handleJWTExpiredError = () => new AppError('token已失效,请重新登录', 401)

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res)
  } else {
    let error = { ...err }
    // 处理自定义错误
    if (err.name === 'JsonWebTokenError') error = handleJWTError(err)
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError(err)
    sendErrorProd(error, res)
  }
}
```