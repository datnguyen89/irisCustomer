import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { AuthMenuLinkItem, AuthMenuLinkWrapper } from './AuthMenuLinkStyled'
import { Link } from 'react-router-dom'

const AuthMenuLink = props => {
  const { commonStore } = props
  return (
    <AuthMenuLinkWrapper color={commonStore.appTheme.solidColor}>
      <AuthMenuLinkItem>
        <Link to={'#'}>Giới thiệu</Link>
      </AuthMenuLinkItem>
      -
      <AuthMenuLinkItem>
        <Link to={'#'}>Liên hệ</Link>
      </AuthMenuLinkItem>
      -
      <AuthMenuLinkItem>
        <Link to={'#'}>Chính sách</Link>
      </AuthMenuLinkItem>
      -
      <AuthMenuLinkItem>
        <Link to={'#'}>Điều khoản</Link>
      </AuthMenuLinkItem>
    </AuthMenuLinkWrapper>
  )
}

AuthMenuLink.propTypes = {}

export default inject('commonStore')(observer(AuthMenuLink))