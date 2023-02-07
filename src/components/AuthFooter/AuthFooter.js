import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { AuthFooterLeft, AuthFooterRight, AuthFooterRightCompany, AuthFooterWrapper } from './AuthFooterStyled'
import IMAGES from '../../images'

const AuthFooter = props => {
  const { commonStore } = props
  return (
    <AuthFooterWrapper>
      <AuthFooterLeft color={commonStore.appTheme.solidColor}>
        <span>Sản phẩm của</span>
        <img src={IMAGES.LOGO_MOBIFONE} alt={''} />
      </AuthFooterLeft>
      <AuthFooterRight color={commonStore.appTheme.solidColor}>
        <AuthFooterRightCompany color={commonStore.appTheme.solidColor}>
          Tổng công ty Viễn Thông MobiFone
        </AuthFooterRightCompany>
        <a href={'#'}>Số 01 phố Phạm Văn Bạch, Yên Hòa, Cầu Giấy, Hà Nội</a>
        <br />
        <a href={'tel:842437831800'}>(+84-24) 3783 1800</a>
        <br />
        <a href={'tel:842437831734'}>(+84-24) 3783 1734</a>
      </AuthFooterRight>
    </AuthFooterWrapper>
  )
}

AuthFooter.propTypes = {}

export default inject('commonStore')(observer(AuthFooter))