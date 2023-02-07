import styled from 'styled-components'

export const AuthFooterWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 16px 64px;
  @media only screen and (max-width: 576px) {
    flex-wrap: wrap;
    padding: 8px;
  }
`
export const AuthFooterLeft = styled.div`
  display: flex;
  flex-direction: column;

  span {
    color: ${props => props.color};
    font-weight: 700;
    font-size: 1.4rem;
  }

  @media only screen and (max-width: 576px) {
    width: 100%;
    align-items: center;
    img {
      width: 180px;
    }
  }
`
export const AuthFooterRight = styled.div`
  text-align: right;
  
  a {
    color: ${props => props.color};
  }
  
  @media only screen and (max-width: 576px) {
    width: 100%;
    margin-top: 16px;
    text-align: center;
  }
`
export const AuthFooterRightCompany = styled.h1`
  color: ${props => props.color};
  font-size: 1.4rem;
  font-weight: 700;
`