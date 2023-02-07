import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import {
  AuthBodyLeftContent,
  AuthBodyLeftWrapper,
  AuthImageWrapper,
  AuthSlogan,
  AuthSubSlogan,
} from './AuthBodyLeftStyled'
import IMAGES from '../../images'

const AuthBodyLeft = props => {
  const { commonStore } = props
  const { appTheme } = commonStore
  return (
    <AuthBodyLeftWrapper>
      <AuthBodyLeftContent>
        <AuthSubSlogan color={appTheme.solidColor}>Thanh toán mọi nơi</AuthSubSlogan>
        <AuthSlogan color={appTheme.solidColor}>An toàn - Tiện lợi - Dễ dàng</AuthSlogan>
        <AuthImageWrapper>
          <img src={IMAGES.AUTH_LEFT_BACKGROUND} alt={''} />
        </AuthImageWrapper>
      </AuthBodyLeftContent>
    </AuthBodyLeftWrapper>
  )
}

AuthBodyLeft.propTypes = {}

export default inject('commonStore')(observer(AuthBodyLeft))