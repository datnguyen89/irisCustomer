import styled from 'styled-components'
import IMAGES from '../../images'

export const AuthBodyLeftWrapper = styled.div`
  width: 50%; 
  display: flex;
  align-items: center;
  justify-content: center;
  @media only screen and (max-width: 768px) {
    width: 100%;
  }
`
export const AuthBodyLeftContent = styled.div`
  width: 80%;
  img {
    margin: 0 auto;
    max-height: 520px;
    @media only screen and (max-width: 768px) {
      max-height: 260px;
    }
  }
`
export const AuthSubSlogan = styled.p`
  color: ${props => props.color};
`
export const AuthSlogan = styled.h1`
  color: ${props => props.color};
  font-size: 2.4rem;
`
export const AuthImageWrapper = styled.div`
  text-align: center;
`