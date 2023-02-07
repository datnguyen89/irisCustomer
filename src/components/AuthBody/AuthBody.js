import React from 'react'
import PropTypes from 'prop-types'
import { AuthBodyWrapper } from './AuthBodyStyled'

const AuthBody = props => {
  const { children } = props
  return (
    <AuthBodyWrapper>
      {children}
    </AuthBodyWrapper>
  )
}

AuthBody.propTypes = {}

export default AuthBody