import React, { useContext } from 'react'
import { FaGithub, FaBell, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Input, Avatar } from 'antd'
import { toast } from 'react-toastify'
import {
  Container,
  NavLogo,
  SearchBar,
  StyledNavbar,
  UserNav,
  Details,
  DropdownMenu,
} from './style'
import avatarImg from '../../assets/img/avatar.jpg'
import { AuthContext } from '../../context/authContext'

export default function Navbar() {
  const toastOptions = {
    position: 'bottom-right',
    autoClose: 1000,
    pauseOnHover: true,
    draggable: true,
    theme: 'dark',
  }
  const { currentUser, logout } = useContext(AuthContext)
  const handleLogout = () => {
    const res = logout()
    if (res.status === 'success') {
      toast.warn(res.message, toastOptions)
    }
  }
  const handleDropdownClick = (e) => {
    document.querySelector('details[open]').removeAttribute('open')
    switch (e) {
      case 'logout':
        handleLogout()
        break
      case 'publish':
        break
      default:
        break
    }
  }
  return (
    <Container>
      <nav className="container clearfix">
        <NavLogo>
          <Link to="/">
            <FaGithub />
          </Link>
        </NavLogo>
        <SearchBar>
          <Input placeholder="暂无搜索" />
        </SearchBar>
        <StyledNavbar>
          <li>
            <Link to="/?category=frontend">前端</Link>
          </li>
          <li>
            <Link to="/?category=backend">后端</Link>
          </li>
          <li>
            <Link to="/?category=technology">技术</Link>
          </li>
          <li>
            <Link to="/?category=design">设计</Link>
          </li>
          <li>
            <Link to="/?category=language">外语</Link>
          </li>
          <li>
            <Link to="/?category=gossip">杂谈</Link>
          </li>
        </StyledNavbar>
        <UserNav>
          <li>
            <FaBell />
          </li>
          <li>
            <Details>
              <summary>
                <FaPlus />
                <span className="dropdown-caret" />
              </summary>
              <DropdownMenu>
                <Link
                  to="publish"
                  onClick={() => handleDropdownClick('publish')}
                  className="dropdown-item"
                >
                  发布文章
                </Link>
              </DropdownMenu>
            </Details>
          </li>
          <li>
            {currentUser ? (
              <Details>
                <summary>
                  <Avatar size="small" src={avatarImg} />
                  <span className="dropdown-caret" />
                </summary>
                <DropdownMenu>
                  <Link
                    onClick={() => handleDropdownClick('logout')}
                    className="dropdown-item"
                  >
                    退出
                  </Link>
                </DropdownMenu>
              </Details>
            ) : (
              <Link to="/login">登录</Link>
            )}
          </li>
        </UserNav>
      </nav>
    </Container>
  )
}
