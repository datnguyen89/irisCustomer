import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { AuthHeaderWrapper, SubTitleLogo } from './AuthHeaderStyled'
import IMAGES from '../../images'

const AuthHeader = props => {
  // region props, hook, state =================
  const { commonStore } = props

  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <AuthHeaderWrapper>
      <img src={IMAGES.AUTH_LOGO} alt={''} height={60} width={60} />
      <SubTitleLogo color={commonStore.appTheme.fontColor}>Ví điện tử Doanh nghiệp</SubTitleLogo>
    </AuthHeaderWrapper>
  )
}

AuthHeader.propTypes = {}

export default inject('commonStore')(observer(AuthHeader))