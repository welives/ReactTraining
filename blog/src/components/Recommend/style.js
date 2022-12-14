import styled from 'styled-components'
import ImgBox from '../style'

export const ImageBox = styled(ImgBox)`
  padding-top: ${(props) => (props.top ? `${props.top}%` : '50%')};
`

export const Container = styled.div`
  padding: 0 10px;
  h3 {
    padding-bottom: 10px;
    border-bottom: 1px solid #eaecef;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 30px;
  }
  .item {
    display: flex;
    flex-direction: column;
    gap: 10px;
    cursor: pointer;
    h2 {
      font-size: 20px;
      color: #555;
    }
  }
`
