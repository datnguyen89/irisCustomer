import React, { useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Dropdown, Modal, notification } from 'antd'
import UserAvatar from '../UserAvatar'
import ICONS from '../../icons'
import { DropdownUserSetting, HeaderUserAreaWrapper } from './HeaderUserAreaStyled'
import { useHistory } from 'react-router-dom'
import ChangePasswordModal from '../ChangePasswordModal'
import { PAGES, SUCCESS_COLOR, SUCCESS_TITLE, WARNING_COLOR, WARNING_TITLE } from '../../utils/constant'
import {
  ColorText,
  HeaderDropdownIconWrapper,
  HeaderDropdownItem,
  HeaderDropdownItemText,
  HeaderDropdownWrapper,
  RowCenterDiv,
} from '../CommonStyled/CommonStyled'
import { WarningOutlined } from '@ant-design/icons'

const HeaderUserArea = props => {
  // region props, hook, state
  const { commonStore, authenticationStore, profileStore } = props
  const history = useHistory()
  const [visibleChangePassword, setVisibleChangePassword] = useState(false)

  // endregion
  // region destructuring
  const { jwtDecode } = authenticationStore
  const { entUserFullName, entUserAvatar } = profileStore
  // endregion
  // region variable

  // endregion
  // region function handle logic
  const handleClickLogout = () => {
    Modal.confirm({
      className: 'custom-notice',
      width: 600,
      title: WARNING_TITLE,
      okText: 'Xác nhận',
      cancelText: 'Hủy',
      onOk: () => {
        authenticationStore.logout()
          .finally(() => {
            history.push(PAGES.LOGIN.PATH)
          })
      },
      onCancel: () => {
      },
      content:
        <>
          <RowCenterDiv margin={'16px 0'}>
            <WarningOutlined style={{ fontSize: 32, color: WARNING_COLOR }} />
            <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={WARNING_COLOR}>
              Bạn có chắc chắn muốn đăng xuất ?
            </ColorText>
          </RowCenterDiv>
        </>,
    })


  }
  const handleSuccessChangePassword = () => {
    authenticationStore.logout()
      .finally(() => {
        history.push(PAGES.LOGIN.PATH)
      })
  }
  const handleChangeAppTheme = themeName => {
    commonStore.setTheme(themeName)
  }
  // endregion
  // region function render

  // endregion
  // region side effect

  // endregion

  const menu = (
    <HeaderDropdownWrapper>
      <HeaderDropdownItem
        justifyContent={'center'}
        columns={2}
        onClick={() => setVisibleChangePassword(true)}
        color={commonStore.appTheme.solidColor}>
        <HeaderDropdownIconWrapper>
          {ICONS.SETTING}
        </HeaderDropdownIconWrapper>
        <HeaderDropdownItemText>
          Đổi mật khẩu
        </HeaderDropdownItemText>
      </HeaderDropdownItem>
      <HeaderDropdownItem
        justifyContent={'center'}
        columns={2}
        onClick={() => handleClickLogout()}
        color={commonStore.appTheme.solidColor}>
        <HeaderDropdownIconWrapper>
          {ICONS.LOGOUT}
        </HeaderDropdownIconWrapper>
        <HeaderDropdownItemText>
          Đăng xuất
        </HeaderDropdownItemText>
      </HeaderDropdownItem>
    </HeaderDropdownWrapper>
  )
  return (
    <HeaderUserAreaWrapper id={'user-menu-wrapper'} color={commonStore.appTheme.solidColor}>
      <Dropdown overlay={menu}
                overlayClassName={'header-user-area'}
                placement={'bottomRight'}
                trigger={['click']}
                getPopupContainer={() => document.getElementById('user-menu-wrapper')}>
        <DropdownUserSetting>
          <UserAvatar avatarUrl={entUserAvatar} />
          <span>{entUserFullName}</span>
          <img src={ICONS.WHITE_ARROW_DOWN} alt={''} height={8} />
        </DropdownUserSetting>
      </Dropdown>
      <ChangePasswordModal
        visible={visibleChangePassword}
        onSuccess={handleSuccessChangePassword}
        onClose={() => setVisibleChangePassword(false)} />

    </HeaderUserAreaWrapper>
  )
}

HeaderUserArea.propTypes = {}

export default inject('commonStore', 'authenticationStore', 'profileStore')(observer(HeaderUserArea))