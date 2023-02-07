import React from 'react'
import PropTypes from 'prop-types'
import { AuthBodyRightWrapper } from './AuthBodyRightStyled'

const AuthBodyRight = props => {
  const { children } = props
  return (
    <AuthBodyRightWrapper>
      {children}
    </AuthBodyRightWrapper>
  )
}

AuthBodyRight.propTypes = {}

export default AuthBodyRight