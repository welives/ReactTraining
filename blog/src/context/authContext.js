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
 * @param {any} children
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
