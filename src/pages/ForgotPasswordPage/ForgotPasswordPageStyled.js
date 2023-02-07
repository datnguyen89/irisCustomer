import styled from 'styled-components'

export const ForgotPasswordPageWrapper = styled.div`
  width: 50%;
  @media only screen and (max-width: 1600px) {
    width: 70%;
  }
  @media only screen and (max-width: 1200px) {
    width: 90%;
  }

  //.ant-input {
  //  height: 53px !important;
  //  border-radius: 5px;
  //}
  //
  //.ant-input-password {
  //  border-radius: 5px;
  //}
  
`
export const ForgotPasswordFormTitle = styled.h1`
  text-align: center;
  margin-bottom: 16px;
`
export const TitleWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`
export const InfoLabel = styled.div`
  color: #4C68EF;
`
export const ErrorLabel = styled.div`
  font-size: 1.3rem;
  text-align: center;
`