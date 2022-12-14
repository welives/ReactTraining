import styled from 'styled-components'
import ImgBox from '../../components/style'

export const ImageBox = styled(ImgBox)`
  padding-top: ${(props) => (props.top ? `${props.top}%` : '50%')};
`

export const Container = styled.div`
  margin-top: 50px;
  display: grid;
  grid-template-columns: 80% 20%;
`

export const ContentBox = styled.div`
  margin-right: 20px;
  .titleBox {
    display: flex;
    gap: 20px;
    .title {
      flex: 5;
    }
  }
  .category {
    flex: 2;
    position: relative;
    display: table;
    width: 100%;
    font-size: 14px;
    line-height: 1.5;
    > span {
      display: table-cell;
      padding: 0 11px;
      width: 1px;
      white-space: nowrap;
      vertical-align: middle;
      text-align: center;
      color: rgba(0, 0, 0, 0.88);
      background-color: rgba(0, 0, 0, 0.02);
      border-radius: 6px;
      border: 1px solid #d9d9d9;
      border-inline-end: 0;
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }
    .select {
      border: 1px solid #d9d9d9;
      border-radius: 6px;
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }
  }
`

export const UploadBox = styled.div`
  margin-left: 20px;
  display: flex;
  flex-direction: column;
  button {
    margin-top: auto;
  }
`
