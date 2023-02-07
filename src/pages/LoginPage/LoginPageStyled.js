import styled from 'styled-components'

export const LoginPageWrapper = styled.div`
  width: 50%;
  @media only screen and (max-width: 1600px) {
    width: 70%;
  }
  @media only screen and (max-width: 1200px) {
    width: 90%;
  }
  
`
export const LoginFormTitle = styled.h1`
  text-align: center;
  margin-bottom: 16px;
`
export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`