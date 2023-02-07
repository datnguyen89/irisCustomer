import React from 'react'
import PropTypes from 'prop-types'
import { AuthLayoutWrapper } from './AuthLayoutStyled'
import AuthHeader from '../../components/AuthHeader'
import AuthBody from '../../components/AuthBody'
import AuthBodyLeft from '../../components/AuthBodyLeft'
import AuthBodyRight from '../../components/AuthBodyRight'
import AuthMenuLink from '../../components/AuthMenuLink'
import AuthFooter from '../../components/AuthFooter'

const AuthLayout = props => {
  const { children } = props
  return (
    <AuthLayoutWrapper>
      <AuthHeader />
      <AuthBody>
        <AuthBodyLeft />
        <AuthBodyRight>
          {children}
          <AuthMenuLink />
        </AuthBodyRight>
      </AuthBody>
      <AuthFooter />
    </AuthLayoutWrapper>
  )
}

AuthLayout.propTypes = {}

export default AuthLayout