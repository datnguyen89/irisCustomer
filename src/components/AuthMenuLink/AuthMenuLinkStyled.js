import styled from 'styled-components'

export const AuthMenuLinkWrapper = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 50%;
  margin-top: 16px;
  color: ${props => props.color};
  a {
    color: ${props => props.color};
  }

  @media only screen and (max-width: 1600px) {
    width: 70%;
  }
  @media only screen and (max-width: 1200px) {
    width: 90%;
  }
`
export const AuthMenuLinkItem = styled.li`

`