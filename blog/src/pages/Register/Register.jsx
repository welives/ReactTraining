import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/authContext'
import Container from './style'

export default function Register() {
  const navigate = useNavigate()
  const { currentUser, setCurrentUser, showToast } = useContext(AuthContext)
  useEffect(() => {
    if (currentUser) {
      navigate('/')
    }
  }, [])
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  /**
   * 表单输入变化
   * @param {InputEvent} event
   */
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  /**
   * 表单校验
   * @returns
   */
  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values
    if (!username) {
      showToast('请输入用户名')
      document.querySelector('input[name="username"]').focus()
      return false
    }
    if (!email) {
      showToast('请输入邮箱')
      document.querySelector('input[name="email"]').focus()
      return false
    }
    if (password.length < 8) {
      showToast('密码至少8个字符')
      document.querySelector('input[name="password"]').focus()
      return false
    }
    if (password !== confirmPassword) {
      showToast('两次输入的密码不一致')
      document.querySelector('input[name="confirmPassword"]').focus()
      return false
    }

    return true
  }
  /**
   * 表单提交
   * @param {SubmitEvent} event
   */
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      const data = await fetch('/auth/register', {
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
          type="text"
          placeholder="请输入用户名"
          name="username"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="请输入邮箱"
          name="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="请输入密码"
          name="password"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="再次输入密码"
          name="confirmPassword"
          onChange={handleChange}
        />
        <button type="submit">Create User</button>
        <span>
          Already have an account ? <Link to="/login">Login</Link>
        </span>
      </form>
    </Container>
  )
}
