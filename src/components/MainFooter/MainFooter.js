import React from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhoneVolume } from '@fortawesome/free-solid-svg-icons'
import {
  CompanyName, FooterRightMenu, FooterRightMenuItem, FooterRightPhone,
  MainFooterLeft,
  MainFooterLeftInfo,
  MainFooterRight,
  MainFooterWrapper,
  TelsArea,
} from './MainFooterStyled'
import IMAGES from '../../images'
import { Link } from 'react-router-dom'
import { PAGES } from '../../utils/constant'

const MainFooter = props => {
  const { commonStore } = props
  const { appTheme } = commonStore
  return (
    <MainFooterWrapper solidColor={appTheme.solidColor}>
      <MainFooterLeft>
        <Link to={'#'}>
          <img src={IMAGES.FOOTER_LOGO} alt={''} height={48} />
        </Link>
        <MainFooterLeftInfo>
          <CompanyName color={appTheme.solidColor}>Tổng công ty Viễn Thông MobiFone </CompanyName>
          <p>Số 01 phố Phạm Văn Bạch, Yên Hòa, Cầu Giấy, Hà Nội</p>
          <TelsArea>
            <a href={'tel:84243781800'}>
              (+84-24) 3783 1800
            </a>
            <span style={{ margin: '0 8px' }}>-</span>
            <a href={'tel:842437831734'}>
              (+84-24) 3783 1734
            </a>
          </TelsArea>
        </MainFooterLeftInfo>
      </MainFooterLeft>
      <MainFooterRight>
        <FooterRightMenu>
          <FooterRightMenuItem
            className={commonStore.pageName === PAGES.ABOUT_US.NAME ? 'active' : ''}
            color={commonStore.appTheme.solidColor}
            to={PAGES.ABOUT_US.PATH}>
            Giới thiệu
          </FooterRightMenuItem>
          <span style={{ margin: '0 8px' }}>-</span>
          <FooterRightMenuItem
            className={commonStore.pageName === PAGES.CONTACT.NAME ? 'active' : ''}
            color={commonStore.appTheme.solidColor}
            to={PAGES.CONTACT.PATH}>
            Liên hệ
          </FooterRightMenuItem>
          <span style={{ margin: '0 8px' }}>-</span>
          <FooterRightMenuItem
            className={commonStore.pageName === PAGES.POLICY.NAME ? 'active' : ''}
            color={commonStore.appTheme.solidColor}
            to={PAGES.POLICY.PATH}>
            Chính sách
          </FooterRightMenuItem>
          <span style={{ margin: '0 8px' }}>-</span>
          <FooterRightMenuItem
            className={commonStore.pageName === PAGES.TERM_OF_USE.NAME ? 'active' : ''}
            color={commonStore.appTheme.solidColor}
            to={PAGES.TERM_OF_USE.PATH}>
            Điều khoản
          </FooterRightMenuItem>
        </FooterRightMenu>
        <FooterRightPhone>
          <a href={'tel:18001090'}>
            <FontAwesomeIcon icon={faPhoneVolume} style={{ marginRight: 8 }} />
            18001090
          </a>
        </FooterRightPhone>
      </MainFooterRight>
    </MainFooterWrapper>
  )
}

MainFooter.propTypes = {}

export default inject('commonStore')(observer(MainFooter))