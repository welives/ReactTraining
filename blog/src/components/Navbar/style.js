import styled from 'styled-components'

export const Container = styled.header`
  position: relative;
  height: 60px;
  padding: 12px 0;
  background-color: #161b22;
  nav {
    display: flex;
    align-items: center;
    font-weight: bold;
  }
`

export const NavLogo = styled.div`
  margin-right: 1rem;
  a {
    display: block;
  }
  svg {
    color: #f0f6fc;
    font-size: 2rem;
  }
`

export const SearchBar = styled.div`
  width: 300px;
  margin-right: 1rem;
  background-color: rgba(255, 255, 255, 0.12);
  input {
    color: #f0f6fc;
    background-color: rgba(255, 255, 255, 0.25);
    border: none;
    &::placeholder {
      color: #f0f6fc;
    }
    &:hover {
      background-color: rgba(255, 255, 255, 0.12);
    }
  }
`

export const StyledNavbar = styled.ul`
  li {
    float: left;
    a {
      display: block;
      padding: 5px 0;
      margin-right: 1rem;
      color: #f0f6fc;
      text-transform: capitalize;
    }
    &:hover {
      a {
        color: rgba(255, 255, 255, 0.7);
        text-decoration: none;
      }
    }
  }
`

export const UserNav = styled.ul`
  margin-left: auto;
  display: flex;
  align-items: center;
  li {
    position: relative;
    margin-left: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f0f6fc;
    cursor: pointer;
    &:hover {
      color: rgba(255, 255, 255, 0.7);
    }
    svg {
      display: inline-block;
      vertical-align: text-bottom;
      font-size: 1.1rem;
    }
  }
  .dropdown-caret {
    margin-left: 3px;
    border-bottom-color: #0000; // #00000000 的缩写
    border-left-color: #0000;
    border-right-color: #0000;
    border-style: solid;
    border-width: 4px 4px 0;
    content: '';
    display: inline-block;
    vertical-align: middle;
    height: 0;
    width: 0;
  }
`

export const Details = styled.details`
  > summary {
    list-style: none; // 隐藏伪元素::marker
    transition: 80ms cubic-bezier(0.33, 1, 0.68, 1);
    transition-property: color, background-color, box-shadow, border-color;
  }
  /*
    ① 先找到没有open属性的details元素
    ② 接着再从符合的details元素下查找不是summary元素的其他子元素
  */
  &:not([open]) > :not(summary) {
    display: none;
  }
  /* 使用伪类制作全屏遮罩 */
  &[open] > summary::before {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 80;
    display: block;
    cursor: default;
    content: '';
    background: transparent;
  }
`

export const DropdownMenu = styled.div`
  position: absolute;
  right: 0;
  width: 160px;
  margin-top: 8px;
  padding: 4px 0;
  z-index: 100;
  box-shadow: 0 8px 24px #010409;
  border-radius: 6px;
  border: 1px solid #30363d;
  background-color: #161b22;
  background-clip: padding-box;
  /* 伪元素制作倒三角 */
  &::before,
  &::after {
    position: absolute;
    display: inline-block;
    content: '';
  }
  &::before {
    left: auto;
    right: 9px;
    top: -16px;
    border: 8px solid #0000;
    border-bottom: 8px solid #30363d;
  }
  &::after {
    left: auto;
    right: 10px;
    top: -14px;
    border: 7px solid #0000;
    border-bottom: 7px solid #161b22;
  }
  .dropdown-item {
    color: #c9d1d9;
    display: block;
    overflow: hidden;
    padding: 4px 8px 4px 16px;
    text-overflow: ellipsis;
    white-space: nowrap;
    &:hover {
      color: white;
      background-color: #1f6feb;
      text-decoration: none;
    }
  }
`
