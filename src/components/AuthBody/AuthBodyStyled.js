import styled from 'styled-components'

export const AuthBodyWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  flex-grow: 1;
  width: 100%;
  padding: 0 64px;
  @media only screen and (max-width: 1200px) {
    padding: 0 24px;
  }
  @media only screen and (max-width: 576px) {
    padding: 0;
  }
`