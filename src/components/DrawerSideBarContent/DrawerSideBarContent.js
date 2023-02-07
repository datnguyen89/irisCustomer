import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import {
  BankAvatarWrapper,
  EnterpriseInfoArea,
  MainSideBarContentWrapper,
  MenuSidebarArea,
  MenuSidebarItem,
  SocialIconWrapper,
} from './DrawerSideBarContentStyled'

import IMAGES from '../../images'
import { PAGES } from '../../utils/constant'
import ICONS from '../../icons'
import { Link, useHistory } from 'react-router-dom'

const DrawerSideBarContent = props => {
  // region props, hook, state
  const { commonStore, profileStore, onClose } = props
  const history = useHistory()

  // endregion
  // region destructuring
  const { entProfile } = profileStore
  const { pageName } = commonStore
  // endregion
  // region variable

  // endregion
  // region function handle logic

  // endregion
  // region function render

  // endregion
  // region side effect

  // endregion

  const handleClickMenu = (path) => {
    history.push(path)
    onClose && onClose()
  }

  return (
    <MainSideBarContentWrapper
      className={`sidebar-expand sidebar-show`}
    >
      <EnterpriseInfoArea
        className={`sidebar-show`}
        color={commonStore.appTheme.solidColor}
      >
        <BankAvatarWrapper>
          <img src={IMAGES.LOGO_ENT_DEFAULT} alt={''} height={60} />
        </BankAvatarWrapper>
        <span className={'bank-name-sidebar'}>{entProfile?.businessName}</span>

      </EnterpriseInfoArea>

      <MenuSidebarArea>
        <MenuSidebarItem
          onClick={() => handleClickMenu(PAGES.IDENTITY.PATH)}
          className={pageName === PAGES.IDENTITY.NAME ? 'active' : ''}
          color={commonStore.appTheme.solidColor}>
          <img src={ICONS.TTDD_ICON} alt={''} />
          <span
            className={'menu-sidebar-label'}
          >
            Thông tin định danh
          </span>
        </MenuSidebarItem>
        <MenuSidebarItem
          onClick={() => handleClickMenu(PAGES.TRANSACTION_MANAGE.PATH)}
          className={pageName === PAGES.TRANSACTION_MANAGE.NAME ? 'active' : ''}
          color={commonStore.appTheme.solidColor}>
          <img src={ICONS.QLGD_ICON} alt={''} />
          <span
            className={'menu-sidebar-label'}
          >
            Quản lý yêu cầu
          </span>
        </MenuSidebarItem>
        <MenuSidebarItem
          onClick={() => handleClickMenu(PAGES.REPORT_SUMMARY.PATH)}
          className={pageName === PAGES.REPORT_SUMMARY.NAME ? 'active' : ''}
          color={commonStore.appTheme.solidColor}>
          <img src={ICONS.BCTH_ICON} alt={''} />
          <span
            className={'menu-sidebar-label'}
          >
            Báo cáo tổng hợp
          </span>
        </MenuSidebarItem>
        <MenuSidebarItem
          onClick={() => handleClickMenu(PAGES.REPORT_DETAIL.PATH)}
          className={pageName === PAGES.REPORT_DETAIL.NAME ? 'active' : ''}
          color={commonStore.appTheme.solidColor}>
          <img src={ICONS.BCCT_ICON} alt={''} />
          <span
            className={'menu-sidebar-label'}
          >
            Báo cáo chi tiết
          </span>
        </MenuSidebarItem>
        {/*<MenuSidebarItem*/}
        {/*  onClick={() => handleClickMenu(PAGES.LIMIT_SETTING.PATH)}*/}
        {/*  className={pageName === PAGES.LIMIT_SETTING.NAME ? 'active' : ''}*/}
        {/*  color={commonStore.appTheme.solidColor}>*/}
        {/*  <img src={ICONS.CDHM_ICON} alt={''} />*/}
        {/*  <span*/}
        {/*    className={'menu-sidebar-label'}*/}
        {/*  >*/}
        {/*    Cài đặt hạn mức*/}
        {/*  </span>*/}
        {/*</MenuSidebarItem>*/}
      </MenuSidebarArea>
      <SocialIconWrapper flexDirection={'row'}>
        <Link to={'#'}>
          <img src={ICONS.FACEBOOK} alt={''} />
        </Link>
        <Link to={'#'}>
          <img src={ICONS.INSTAGRAM} alt={''} />
        </Link>
        <Link to={'#'}>
          <img src={ICONS.YOUTUBE} alt={''} />
        </Link>
      </SocialIconWrapper>
    </MainSideBarContentWrapper>
  )
}

DrawerSideBarContent.propTypes = {
  onClose: PropTypes.func,
}
export default inject('commonStore', 'profileStore')(observer(DrawerSideBarContent))
