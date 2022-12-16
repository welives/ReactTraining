import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import Container from './style'

export default function Login() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, showToast } = useContext(AuthContext)
  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [])
  const [values, setValues] = useState({
    email: '',
    password: '',
  })
  /**
   * 表单输入变化
   * @param {Object} event
   */
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  /**
   * 表单校验
   * @returns
   */
  const handleValidation = () => {
    const { email, password } = values
    if (!email) {
      showToast('请输入邮箱')
      document.querySelector('input[name="email"]').focus()
      return false
    }
    if (!password) {
      showToast('请输入密码')
      document.querySelector('input[name="password"]').focus()
      return false
    }
    return true
  }
  /**
   * 表单提交
   * @param {Object} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      const data = await fetch('/auth/login', {
        method: 'POST',
        credentials: 'include', // 允许客户端保存cookie
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify(values),
      }).then((res) => res.json())
      if (data.status === 'success') {
        setCurrentUser(data.result.data)
        showToast(data.message, 'success')
        setTimeout(() => {
          navigate('/')
        }, 500)
      }
    }
  }
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <h1>jandan</h1>
        <input
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          onChange={handleChange}
        />
        <button type="submit">Log In</button>
        <span>
          Don&apos;t have an account ? <Link to="/register">Register</Link>
        </span>
      </form>
    </Container>
  )
}
