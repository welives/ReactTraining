import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import Container from './style'

export default function Register() {
  const navigate = useNavigate()
  useEffect(() => {
    if (localStorage.getItem('blog_user')) {
      navigate('/')
    }
  }, [])
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const handleValidation = () => {
    const { username, email, password, confirmPassword } = values
    if (!username) {
      toast.error('请输入用户名', toastOptions)
      document.querySelector('input[name="username"]').focus()
      return false
    }
    if (!email) {
      toast.error('请输入邮箱', toastOptions)
      document.querySelector('input[name="email"]').focus()
      return false
    }
    if (password.length < 8) {
      toast.error('密码至少8个字符', toastOptions)
      document.querySelector('input[name="password"]').focus()
      return false
    }
    if (password !== confirmPassword) {
      toast.error('两次输入的密码不一致', toastOptions)
      document.querySelector('input[name="confirmPassword"]').focus()
      return false
    }

    return true
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      fetch('/auth/register', {
        method: 'POST',
        credentials: 'include', // 允许客户端保存cookie
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
        body: JSON.stringify({ ...values }),
      }).then(async (res) => {
        const data = await res.json()
        if (data.status === 'success') {
          toast.success(data.message, toastOptions)
          localStorage.setItem('blog_user', JSON.stringify(data.result.data))
          setTimeout(() => {
            navigate('/')
          }, 1000)
        }
      })
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
