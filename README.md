# React 博客全栈练习

## react脚手架设置代理
在package.json中增加
```json
"proxy": "http://localhost:5000/api"
```

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
import React from 'react'
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
import React from 'react'
import { RouterProvider } from 'react-router-dom'
import router from './router/index'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}
```

## 使用 createContext 创建上下文来使整个应用共享登录状态信息
```js
// authContext.js
import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'

const toastOptions = {
  position: 'bottom-right',
  autoClose: 1000,
  pauseOnHover: true,
  draggable: true,
  theme: 'dark',
}

/**
 * 弹出提示消息
 * @param {String} message 提示消息
 * @param {String} type 提示类型
 */
const showToast = (message, type = 'error') => {
  toast[type](message, toastOptions)
}

/**
 * 登录状态上下文
 */
export const AuthContext = createContext()

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

/**
 * 登录状态提供组件
 * @param {HTMLElement} children
 * @returns
 */
export function AuthContextProvider({ children }) {
  // 当前登录用户信息
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('blog_user')) || null
  )
  // 每当currentUser变化的时候就更新本地缓存中的数据
  useEffect(() => {
    localStorage.setItem('blog_user', JSON.stringify(currentUser))
  }, [currentUser])

  /**
   * 退出方法
   */
  const logout = async () => {
    const data = await fetch('/auth/logout').then((res) => res.json())
    if (data.status === 'success') {
      setCurrentUser(null)
      showToast(data.message, 'warn')
      return true
    }
    showToast(data.message)
    return false
  }

  // 此上下文容器提供了当前登录用户信息,登录和退出方法
  return (
    <AuthContext.Provider
      value={{ currentUser, setCurrentUser, logout, showToast }}
    >
      {children}
    </AuthContext.Provider>
  )
}
```

在需要的页面或组件中引入 authContext
```js
// Login.jsx
import { AuthContext } from '../../context/authContext'
...
const { currentUser, setCurrentUser, showToast } = useContext(AuthContext)
useEffect(() => {
  if (currentUser) {
    navigate('/')
  }
}, [])
...
```

## 当子组件是一个函数式组件, 这时通过ref调用子组件时会提示一个警告信息
> Warning: forwardRef render functions do not support propTypes or defaultProps. Did you accidentally pass a React component?
```js
// 子组件
import React, { useState, useEffect, useImperativeHandle } from 'react'
function WangEditor({ html, setHtml }, ref) {
  ...
  // 通过 useImperativeHandle 把子组件的方法暴露给父组件
  useImperativeHandle(ref, () => ({
    setFocus: () => {
      if (editor === null) return
      editor.focus()
    },
  }))
  ...
}
export default React.forwardRef(WangEditor)
```

```js
// 父组件
import React, { useEffect, useState, useContext, useRef } from 'react'
import WangEditor from '../../components/WangEditor/WangEditor'
export default function Publish() {
  ...
  const editorRef = useRef(null)
  const handleValidation = () => {
    ...
    if (!html.trim()) {
      showToast('请输入文章内容')
      editorRef.current.setFocus()
      return false
    }
    ...
  }
  return (
    ...
    <WangEditor html={html} setHtml={setHtml} ref={editorRef} />
    ...
  )
}
```

> 把子组件改成类组件就能够消除该警告信息了
```js
class WangEditor extends React.Component {
  ...
  constructor(props) {
    super(props)
    this.state = {
      editor: null,
    }
    this.setFocus = this.setFocus.bind(this)
  }
  setFocus() {
    if (this.state.editor === null) return
    this.state.editor.focus()
  }
  ...
}
export default WangEditor
```

## 通过图片url获取相应的File对象
```js
const getImageFileFromUrl = async (url) => {
  const fileName = url.substring(url.replace('\\', '/').lastIndexOf('/') + 1)
  const bolb = await fetch(url).then((res) => res.blob())
  return new File([bolb], fileName, { type: bolb.type })
}
```

------

## 后端使用express + mysql
安装
```
npm i express mysql
```

## 一些关于mysql模块的占位符 ? 和 ?? 的踩坑记录
> 对象会被转换为占位符上的可枚举属性的键值对, 例如
```js
// SELECT * FROM users WHERE `email` = '10000@qq.com' AND `username` = 'jandan'
db.format('SELECT * FROM users WHERE ? AND ?', [{email: '10000@qq.com'}, {username: 'jandan'}])
```

> 列名如果和mysql的保留字或关键字冲突的时候要用反引号包裹起来
```js
db.format('SELECT * FROM categories WHERE `key` = ?', ['gossip'])
```

> 单个 ? 的占位符只会被替换为数字或字符串
```js
// SELECT * FROM posts WHERE id = 1 OR title = '标题'
db.format('SELECT * FROM posts WHERE id = ? OR title = ?', [1, '标题'])
```

> 两个 ?? 的占位符会被替换为由反引号包裹起来的值, 这些值可能会是 库名, 表名, 列名, 操作符, 关键字, 保留字 等等。最佳实践是仅用 ?? 来代替库名,表名,列名
```js
// SELECT `title`, `content` FROM posts WHERE title LIKE '%测试%'
db.format(
  'SELECT ?? FROM posts WHERE title LIKE ?',
  [['title', 'content'], '%测试%']
)

// SELECT `posts`.*, `users`.`username` AS `author` FROM posts JOIN users ON `posts`.`user_id` = `users`.`id`
db.format('SELECT ??.?, ?? AS ?? FROM posts JOIN users ON ?? ? ??', [
  'posts',
  mysql.raw('*'), // 最好不要用占位符来代替mysql的限定符或操作符,此处只是演示而已
  'users.username',
  'author',
  'posts.user_id',
  mysql.raw('='), // 最好不要用占位符来代替mysql的限定符或操作符,此处只是演示而已
  'users.id',
])
// 正确的做法是写成这样 SELECT ??.*, ?? AS ?? FROM posts JOIN users ON ?? = ??
```

> 在使用join的时候难免会出现重叠列名的情况，mysql模块会按照接收列的顺序覆盖冲突的列名，导致接收到的一些值不可用。当前mysql模块也为我们提供了解决方案，那就是把query方法的第一个入参改成对象的形式，该入参对象携带 nestTables: true
```js
const sql = 'SELECT * FROM posts JOIN users ON posts.user_id = users.id'
const where = db.format(' WHERE posts.?', [opt])
const options = {
  sql: sql + where,
  nestTables: true,
}
return new Promise((resolve, reject) => {
  db.query(options, (err, res) => {
    /**
     * 查询结果res将会以类似如下数组的形式展现
    [{
      posts: {
        id: '...',
        ...
      },
      users: {
        id: '...',
        ...
      }
    }]
    */
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
```

## 构建express server
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
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Cross-Origin-Resource-Policy', 'cross-origin')
  next()
}, express.static(path.resolve(__dirname, 'public')))

app.use('/api/upload', require('./routes/uploadRoutes'))
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
```

db.js
```js
const mysql = require('mysql')
// 创建一个数据库连接对象
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
})
// 建立连接
db.connect((err) => {
  if (err) {
    console.error('MySQL连接失败: ' + err.stack)
    return
  }
  console.log('MySQL连接成功,id为' + db.threadId)
})
// 用户表
db.query(
  `CREATE TABLE IF NOT EXISTS users(
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  username varchar(45) NOT NULL COMMENT '用户名',
  email varchar(255) NOT NULL COMMENT '邮箱',
  password varchar(255) NOT NULL COMMENT '密码',
  avatar varchar(255) DEFAULT NULL COMMENT '头像',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';`,
  (err, res) => {
    if (err) throw err
  }
)

// 分类表
db.query(
  `CREATE TABLE IF NOT EXISTS categories(
  id tinyint(4) unsigned NOT NULL AUTO_INCREMENT,
  \`key\` varchar(30) NOT NULL DEFAULT '' COMMENT '键',
  label varchar(100) NOT NULL DEFAULT '' COMMENT '描述',
  pid tinyint(4) unsigned NOT NULL DEFAULT '0' COMMENT '父级',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='分类表';`,
  (err, res) => {
    if (err) throw err
  }
)

// 文章表
db.query(
  `CREATE TABLE IF NOT EXISTS posts(
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  title varchar(255) NOT NULL DEFAULT '' COMMENT '标题',
  content text COMMENT '内容',
  cover varchar(255) NOT NULL DEFAULT '' COMMENT '封面',
  cover_uuid varchar(150) NOT NULL DEFAULT '' COMMENT '附件资源id',
  category_id tinyint(4) unsigned NOT NULL COMMENT '分类id',
  category_key varchar(30) NOT NULL DEFAULT '' COMMENT '分类key',
  user_id int(10) unsigned NOT NULL COMMENT '作者',
  created_at datetime DEFAULT NULL,
  updated_at datetime DEFAULT NULL,
  PRIMARY KEY (id),
  KEY fk_uid (user_id),
  KEY fk_cid (category_id),
  CONSTRAINT fk_cid FOREIGN KEY (category_id) REFERENCES categories (id),
  CONSTRAINT fk_uid FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='文章表';`,
  (err, res) => {
    if (err) throw err
  }
)

// 附件表
db.query(
  `CREATE TABLE IF NOT EXISTS attachments(
  id int(10) unsigned NOT NULL AUTO_INCREMENT,
  uuid varchar(150) NOT NULL COMMENT '资源id',
  type varchar(50) NOT NULL DEFAULT '' COMMENT '类型',
  mime_type varchar(50) DEFAULT NULL,
  size double unsigned NOT NULL COMMENT '文件大小,单位字节',
  width int(10) DEFAULT NULL COMMENT '图片宽度',
  height int(10) DEFAULT NULL COMMENT '图片高度',
  original_name varchar(255) NOT NULL COMMENT '文件原始名字',
  save_path varchar(255) NOT NULL COMMENT '保存路径',
  memo varchar(255) DEFAULT NULL COMMENT '备注',
  user_id int(10) unsigned NOT NULL DEFAULT '0' COMMENT '上传者',
  created_at datetime DEFAULT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='附件表';`,
  (err, res) => {
    if (err) throw err
  }
)
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

## 文件上传
```js
// uploadController.js
const fs = require('fs')
const path = require('path')
const multer = require('multer')
const dayjs = require('dayjs')
const uuid = require('uuid')
const attachService = require('../services/attachService')
const AppError = require('../utils/appError')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = this.isUploadPathExist()
    const savePath = this.isSavePathExist(uploadPath)
    cb(null, savePath)
  },
  filename: (req, file, cb) => {
    cb(null, uuid.v1() + path.extname(file.originalname))
  },
})
exports.upload = multer({ storage })

/**
 * 检查上传的根目录是否存在并创建
 */
exports.isUploadPathExist = () => {
  // 文件上传的根目录
  const uploadPath = path.resolve(__dirname, `../public/uploads`)
  try {
    fs.accessSync(uploadPath)
  } catch (error) {
    fs.mkdirSync(uploadPath)
  }
  return uploadPath
}

/**
 * 检查保存目录是否存在并创建
 * @param {String} uploadPath
 * @param {Number} date
 * @returns
 */
exports.isSavePathExist = (uploadPath, date = Date.now()) => {
  // 最终是按日期生成文件夹保存
  const savePath = path.join(uploadPath, dayjs(date).format('YYYY-MM-DD'))
  try {
    fs.accessSync(savePath)
  } catch (error) {
    fs.mkdirSync(savePath)
  }
  return savePath
}

/**
 * 单文件上传
 */
exports.uploadOne = (req, res, next) => {
  this.upload.single('file')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return next(new AppError('上传失败', 500))
    } else if (err) {
      return next(new AppError('上传失败', 500))
    }
    try {
      let result = await attachService.create(req.file, {
        type: req.body.type,
        user_id: req.user.id,
      })
      result = await attachService.findOne({ id: result.insertId })
      res.status(200).json({
        status: 'success',
        message: 'ok',
        result: { data: result },
      })
    } catch (error) {
      next(error)
    }
  })
}
```

```js
const db = require('../db')
const path = require('path')
const sizeOf = require('image-size')
const AppError = require('../utils/appError')

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
  const sql = db.format('INSERT INTO attachments(??) VALUES(?)', [
    columns,
    values,
  ])
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res) => {
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
  const sql = db.format('SELECT * FROM attachments WHERE ?', [opt])
  return new Promise((resolve, reject) => {
    db.query(sql, (err, res) => {
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
```