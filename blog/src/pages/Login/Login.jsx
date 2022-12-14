import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/authContext'
import Container from './style'

export default function Login() {
  const navigate = useNavigate()
  const { currentUser, login } = useContext(AuthContext)
  useEffect(() => {
    if (currentUser) {
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
    email: '',
    password: '',
  })
  const handleChange = (event) => {
    setValues({ ...values, [event.target.name]: event.target.value })
  }
  const handleValidation = () => {
    const { email, password } = values
    if (!email) {
      toast.error('请输入邮箱', toastOptions)
      document.querySelector('input[name="email"]').focus()
      return false
    }
    if (!password) {
      toast.error('请输入密码', toastOptions)
      document.querySelector('input[name="password"]').focus()
      return false
    }
    return true
  }
  const handleSubmit = async (event) => {
    event.preventDefault()
    if (handleValidation()) {
      const res = await login(values)
      if (res.status === 'success') {
        toast.success(res.message, toastOptions)
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
