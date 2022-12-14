import React, { createContext, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext()

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

export function AuthContextProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem('blog_user')) || null
  )
  const login = async (inputs) => {
    const data = await fetch('/auth/login', {
      method: 'POST',
      credentials: 'include', // 允许客户端保存cookie
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(inputs),
    }).then((res) => res.json())
    setCurrentUser(data.result.data)
  }
  const logout = async (inputs) => {
    await fetch('/auth/logout', {
      method: 'POST',
      credentials: 'include', // 允许客户端保存cookie
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify(inputs),
    }).then((res) => res.json())
    setCurrentUser(null)
  }
  useEffect(() => {
    localStorage.setItem('blog_user', JSON.stringify(currentUser))
  }, [currentUser])
  const value = useMemo(() => ({ currentUser, login, logout }), [])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
