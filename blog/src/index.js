import React from 'react'
import ReactDOM from 'react-dom/client'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { AuthContextProvider } from './context/authContext'
import App from './App'
import 'dayjs/locale/zh-cn'

dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
)
