import React, { createContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

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
   * 登录方法
   * @param {Object} inputs 登录表单信息
   * @returns
   */
  const login = async (inputs) => {
    const data = await fetch('/auth/login', {
      method: 'POST',
      credentials: 'include', // 允许客户端保存cookie
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(inputs),
    }).then((res) => res.json())
    if (data.status === 'success') {
      setCurrentUser(data.result.data)
    }
    return data
  }
  /**
   * 退出方法
   * @returns
   */
  const logout = async () => {
    const data = await fetch('/auth/logout').then((res) => res.json())
    setCurrentUser(null)
    return data
  }
  // 此上下文容器提供了当前登录用户信息,登录和退出方法
  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
