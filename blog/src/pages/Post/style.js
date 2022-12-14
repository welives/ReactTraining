import styled from 'styled-components'
import ImgBox from '../../components/style'

export const ImageBox = styled(ImgBox)`
  padding-top: ${(props) => (props.top ? `${props.top}%` : '50%')};
`

export const Container = styled.div`
  margin-top: 50px;
  display: grid;
  grid-template-columns: 75% 25%;
`

export const ContentBox = styled.div`
  margin-right: 30px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  .user {
    display: flex;
    align-items: center;
    gap: 10px;
    h6 {
      font-weight: bold;
      margin-bottom: 0;
    }
    span {
      font-size: 12px;
      color: #ccc;
    }
    .edit {
      font-size: 1.3rem;
      svg {
        margin-right: 5px;
        cursor: pointer;
        &:nth-child(1) {
          fill: #6cc644;
        }
        &:nth-child(2) {
          fill: #bd2c00;
        }
      }
    }
  }
  .content {
    h1 {
      font-size: 2rem;
      font-weight: bold;
      color: 333;
    }
    p {
      text-align: justify;
      line-height: 1.5;
    }
  }
`
