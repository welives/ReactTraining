import styled from 'styled-components'

export default styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  background-color: #131324;
  h1 {
    margin-bottom: 0;
    text-align: center;
    color: white;
    text-transform: uppercase;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    background-color: #00000076;
    border-radius: 2rem;
    padding: 5rem;
    input {
      width: 100%;
      padding: 1rem;
      font-size: 1rem;
      color: white;
      transition: 0.5s ease-in-out;
      background-color: transparent;
      border: 0.1rem solid #4e0eff;
      border-radius: 0.4rem;
      &:focus {
        border: 0.1rem solid #997af0;
        outline: none;
      }
    }
    button {
      padding: 1rem 2rem;
      font-size: 1rem;
      font-weight: bold;
      text-transform: uppercase;
      color: white;
      background-color: #997af0;
      transition: 0.5s ease-in-out;
      border-radius: 0.4rem;
      border: none;
      cursor: pointer;
      &:hover {
        background-color: #4e0eff;
      }
    }
    span {
      color: white;
      text-transform: uppercase;
      a {
        color: #4e0eff;
        text-decoration: none;
        font-weight: bold;
      }
    }
  }
`
