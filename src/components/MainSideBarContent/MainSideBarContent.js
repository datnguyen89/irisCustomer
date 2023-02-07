import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import {
  BankAvatarWrapper,
  EnterpriseInfoArea,
  MainSideBarContentWrapper,
  MenuSidebarArea, MenuSidebarItem, SocialIconWrapper,
} from './MainSideBarContentStyled'

import IMAGES from '../../images'
import { CaretLeftOutlined } from '@ant-design/icons'
import { DEVICE, PAGES, ROLES } from '../../utils/constant'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import ICONS from '../../icons'
import { Link, useHistory } from 'react-router-dom'

const MainSideBarContent = props => {
  // region props, hook, state =================
  const { commonStore, profileStore, authenticationStore } = props
  const history = useHistory()

  // endregion
  // region destructuring ======================
  const { entUserProfile, entProfile } = profileStore
  const { isCollapse, device, pageName } = commonStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleToggleSideBar = (collapse) => {
    commonStore.setIsCollapse(collapse)
  }
  const handleClickMenu = (path) => {
    history.push(path)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (device === DEVICE.TABLET) {
      commonStore.setIsCollapse(true)
    }
  }, [device])

  // endregion

  return (
    <MainSideBarContentWrapper
      className={`
        ${isCollapse ? ' sidebar-collapse ' : ' sidebar-expand '} 
        ${device === DEVICE.MOBILE ? ' sidebar-hidden ' : ' sidebar-show '}
      `}
    >
      <EnterpriseInfoArea
        className={`
        ${isCollapse ? ' sidebar-hidden ' : ' sidebar-show '} 
      `}
        color={commonStore.appTheme.solidColor}
      >
        <BankAvatarWrapper>
          <img src={IMAGES.LOGO_ENT_DEFAULT} alt={''} height={60} />
        </BankAvatarWrapper>
        <span className={'bank-name-sidebar'}>{entProfile?.businessName}</span>
        <CaretLeftOutlined
          onClick={() => handleToggleSideBar(true)}
          className={`collapse-sidebar-icon ${(device === DEVICE.MOBILE || device === DEVICE.TABLET) ? 'icon-hidden' : 'icon-show'}`}
        />
      </EnterpriseInfoArea>
      <FontAwesomeIcon
        onClick={() => handleToggleSideBar(false)}
        className={`expand-sidebar-icon ${(!isCollapse || device !== DEVICE.DESKTOP) ? 'icon-hidden' : 'icon-show'}`}
        icon={faBars} />
      <MenuSidebarArea>
        <MenuSidebarItem
          onClick={() => handleClickMenu(PAGES.IDENTITY.PATH)}
          className={pageName === PAGES.IDENTITY.NAME ? 'active' : ''}
          color={commonStore.appTheme.solidColor}>
          <img src={ICONS.TTDD_ICON} alt={''} />
          <span
            className={'menu-sidebar-label'}
            style={{ display: isCollapse ? 'none' : 'block' }}>
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
            style={{ display: isCollapse ? 'none' : 'block' }}>
            Quản lý yêu cầu
          </span>
        </MenuSidebarItem>
        {
          authenticationStore.checkRole(ROLES.SUMREPORT) &&
          <MenuSidebarItem
            onClick={() => handleClickMenu(PAGES.REPORT_SUMMARY.PATH)}
            className={pageName === PAGES.REPORT_SUMMARY.NAME ? 'active' : ''}
            color={commonStore.appTheme.solidColor}>
            <img src={ICONS.BCTH_ICON} alt={''} />
            <span
              className={'menu-sidebar-label'}
              style={{ display: isCollapse ? 'none' : 'block' }}>
            Báo cáo tổng hợp
          </span>
          </MenuSidebarItem>
        }
        {
          authenticationStore.checkRole(ROLES.DETAILREPORT) &&
          <MenuSidebarItem
            onClick={() => handleClickMenu(PAGES.REPORT_DETAIL.PATH)}
            className={pageName === PAGES.REPORT_DETAIL.NAME ? 'active' : ''}
            color={commonStore.appTheme.solidColor}>
            <img src={ICONS.BCCT_ICON} alt={''} />
            <span
              className={'menu-sidebar-label'}
              style={{ display: isCollapse ? 'none' : 'block' }}>
            Báo cáo chi tiết
          </span>
          </MenuSidebarItem>
        }
        {
          authenticationStore.checkRole(ROLES.STATEMENTREPORT) &&
          <MenuSidebarItem
            onClick={() => handleClickMenu(PAGES.REPORT_STATEMENT.PATH)}
            className={pageName === PAGES.REPORT_STATEMENT.NAME ? 'active' : ''}
            color={commonStore.appTheme.solidColor}>
            <img src={ICONS.BCSC_ICON} alt={''} />
            <span
              className={'menu-sidebar-label'}
              style={{ display: isCollapse ? 'none' : 'block' }}>
            Báo cáo sao kê
          </span>
          </MenuSidebarItem>
        }

        {/*<MenuSidebarItem*/}
        {/*  onClick={() => handleClickMenu(PAGES.LIMIT_SETTING.PATH)}*/}
        {/*  className={pageName === PAGES.LIMIT_SETTING.NAME ? 'active' : ''}*/}
        {/*  color={commonStore.appTheme.solidColor}>*/}
        {/*  <img src={ICONS.CDHM_ICON} alt={''} />*/}
        {/*  <span*/}
        {/*    className={'menu-sidebar-label'}*/}
        {/*    style={{ display: isCollapse ? 'none' : 'block' }}>*/}
        {/*    Cài đặt hạn mức*/}
        {/*  </span>*/}
        {/*</MenuSidebarItem>*/}
      </MenuSidebarArea>
      <SocialIconWrapper flexDirection={isCollapse ? 'column' : 'row'}>
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

MainSideBarContent.propTypes = {}
export default inject('commonStore', 'profileStore', 'authenticationStore')(observer(MainSideBarContent))
