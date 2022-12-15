import React, { useContext, useEffect, useState } from 'react'
import { FaGithub, FaBell, FaPlus } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import { Input, Avatar } from 'antd'
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
  const [cates, setCates] = useState([])
  useEffect(() => {
    ;(async () => {
      const data = await fetch('/category/list').then((res) => res.json())
      if (data.status === 'success') {
        setCates(data.result.data)
      }
    })()
  }, [])

  const { currentUser, logout } = useContext(AuthContext)
  const handleDropdownClick = (e) => {
    document.querySelector('details[open]').removeAttribute('open')
    switch (e) {
      case 'logout':
        logout()
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
          {/* <li>
            <Link to="/?category=frontend">前端</Link>
          </li> */}
          {cates.map((el) => (
            <li key={el.id}>
              <Link to={`/?category=${el.key}`}>{el.label}</Link>
            </li>
          ))}
        </StyledNavbar>
        <UserNav>
          <li>
            <FaBell />
          </li>
          {currentUser && (
            <li>
              <Details>
                <summary>
                  <FaPlus />
                  <span className="dropdown-caret" />
                </summary>
                <DropdownMenu>
                  <Link
                    to="publish"
                    onClick={handleDropdownClick}
                    className="dropdown-item"
                  >
                    发布文章
                  </Link>
                </DropdownMenu>
              </Details>
            </li>
          )}
          <li>
            {currentUser ? (
              <Details>
                <summary>
                  <span className="name">{currentUser.username}</span>
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
