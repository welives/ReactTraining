import styled from 'styled-components'

export const Container = styled.div`
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  gap: 50px;
`

export const PostItem = styled.div`
  display: flex;
  gap: 100px;
  margin-bottom: 50px;
  &:nth-child(2n) {
    flex-direction: row-reverse;
    .imgBox::after {
      left: auto;
      right: -15px;
    }
  }
  .imgBox {
    flex: 2;
    position: relative;
    max-height: 400px;
    img {
      height: 100%;
      width: 100%;
      border-radius: 3px;
      object-fit: cover;
    }
    &::after {
      content: '';
      position: absolute;
      top: 15px;
      left: -15px;
      width: 100%;
      height: 100%;
      background-color: #f8f8f8;
      border-radius: 3px;
      z-index: -1;
    }
  }
  .content {
    flex: 4;
    display: flex;
    flex-direction: column;
    gap: 30px;
    a {
      color: #222;
      &:hover {
        text-decoration: none;
      }
      &.view {
        width: max-content;
      }
    }
    h1 {
      margin-bottom: 15px;
      font-size: 2.5rem;
      font-weight: bold;
    }
    p {
      font-size: 1.1rem;
      line-height: 1.5;
    }
  }
`
