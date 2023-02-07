import styled from 'styled-components'
import IMAGES from '../../images'

export const AuthLayoutWrapper = styled.section`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-image: url(${IMAGES.AUTH_BACKGROUND});
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
`