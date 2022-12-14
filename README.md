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
    <div>
      <RouterProvider router={router} />
    </div>
  )
}
```
