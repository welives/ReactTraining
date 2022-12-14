import styled from 'styled-components'

export default styled.div`
  position: relative;
  padding-top: 50%;
  > img {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 5px;
  }
`
