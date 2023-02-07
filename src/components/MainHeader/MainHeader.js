import React, { Fragment, useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faList } from '@fortawesome/free-solid-svg-icons'
import { Scrollbars } from 'react-custom-scrollbars'
import {
  CustomLink,
  HeaderLogoArea,
  HeaderMenuText,
  HeaderTransactionArea,
  HeaderTransactionItem,
  MainHeaderRight,
  MainHeaderRightMobile,
  MainHeaderWrapper,
} from './MainHeaderStyled'
import IMAGES from '../../images'
import ICONS from '../../icons'
import { Divider, Drawer, Dropdown, Menu, Modal } from 'antd'
import HeaderUserArea from '../HeaderUserArea'
import { useHistory } from 'react-router-dom'
import {
  DEVICE, GROUP_EXECUTION_TYPE_ID,
  PAGES, ROLE_TYPE,
  ROLES,
  SIDEBAR_WIDTH_EXPAND,
  TRANSFER_GROUP_PAGES,
  TRANSFERS,
} from '../../utils/constant'
import DrawerSideBar from '../DrawerSideBar'
import {
  HeaderDropdownIconWrapper,
  HeaderDropdownItem,
  HeaderDropdownItemText,
  HeaderDropdownWrapper, PaymentDropdownItemWrapper,
  RowAlignCenterDiv, RowCenterDiv,
} from '../CommonStyled/CommonStyled'
import { toJS } from 'mobx'

const MainHeader = props => {
  // region props, hook, state =================
  const {
    commonStore,
    authenticationStore,
    saleStore,
    orderStore,
    bankStore,
  } = props

  const { listLinkedBanks } = bankStore

  const history = useHistory()
  const [visibleMobileDrawerLeft, setVisibleMobileDrawerLeft] = useState(false)
  const [visibleMobileDrawerRight, setVisibleMobileDrawerRight] = useState(false)

  // endregion
  // region destructuring ======================
  const { listHomeProduct } = saleStore
  const { pageName } = commonStore
  const { roles, jwtDecode } = authenticationStore
  const { device } = commonStore

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleClickDrawerMenu = (e) => {
    console.log('handleClickDrawerMenu', e.key)
    history.push(e.key)
    setVisibleMobileDrawerRight(false)
  }

  const handleClickItem = (item) => {
    
    orderStore.resetEditingExecution()
    switch (jwtDecode?.RoleType) {
      case ROLE_TYPE.INIT:
        let detail = {}
        if (item?.Detail) {
          detail = JSON.parse(item?.Detail)
        }
        let product = { ...item }
        if (detail?.replacementId) {
          product.ProductID = detail?.replacementId
        }
        if (item.ProductCode.includes('INVOICE')) {
          history.push(`${PAGES.PAY_BILL.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('PREPAID')) {
          history.push(`${PAGES.PREPAID.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('POSTPAID')) {
          history.push(`${PAGES.POSTPAID.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('CARD')) {
          history.push(`${PAGES.PHONE_CARD.PATH}/${product.ProductID}`)
        } else if (item.ProductCode.includes('DATA-REG')) {
          history.push(`${PAGES.PACK_DATA.PATH}/${product.ProductID}`)
        }
        break
      case ROLE_TYPE.REVIEW:
      case ROLE_TYPE.APPROVE:
        history.push({
          pathname: PAGES.TRANSACTION_MANAGE.PATH,
          state: { groupTypeID: GROUP_EXECUTION_TYPE_ID.PAYMENT },
        })
        break
      default:
        break
    }
  }
  // endregion
  // region function render ====================
  const transferOverlay = (
    <HeaderDropdownWrapper>
      {
        TRANSFERS.map(item =>
          authenticationStore.checkMultipleRole(item.ROLES) &&
          <HeaderDropdownItem
            width={'auto'}
            onClick={() => history.push(item.PATH)}
            key={item.ID}
            color={commonStore.appTheme.solidColor}>
            <HeaderDropdownIconWrapper>
              <img src={item.ICON} alt={''} />
            </HeaderDropdownIconWrapper>
            <HeaderDropdownItemText>
              {item.LABEL}
            </HeaderDropdownItemText>
          </HeaderDropdownItem>,
        )
      }
    </HeaderDropdownWrapper>
  )
  const paymentOverlay = (
    <Scrollbars
      autoHeight
      autoHeightMin={0}
      autoHeightMax={220}
      style={{
        borderRadius: 4,
        boxShadow: '0 3px 6px -4px rgb(0 0 0 / 12%), 0 6px 16px 0 rgb(0 0 0 / 8%), 0 9px 28px 8px rgb(0 0 0 / 5%)',
      }}
    >
      <HeaderDropdownWrapper
        flexDirection={'column'}
        width={'480px'}>
        {
          listHomeProduct && listHomeProduct.map((item, index) =>
            <Fragment key={index}>
              <PaymentDropdownItemWrapper>
                {
                  item?.Childrens && item?.Childrens.map(product =>
                    <HeaderDropdownItem
                      key={product.ProductID}
                      width={'220px'}
                      onClick={() => handleClickItem(product)}
                      color={commonStore.appTheme.solidColor}>
                      <HeaderDropdownIconWrapper>
                        <img src={product.Logo} alt={''} />
                      </HeaderDropdownIconWrapper>
                      <HeaderDropdownItemText>
                        {product.ProductName}
                      </HeaderDropdownItemText>
                    </HeaderDropdownItem>,
                  )
                }
              </PaymentDropdownItemWrapper>
              {
                index < listHomeProduct?.length - 1 &&
                <Divider style={{ margin: '8px 0' }} />
              }
            </Fragment>,
          )
        }
      </HeaderDropdownWrapper>
    </Scrollbars>
  )
  // endregion
  // region side effect ========================

  // endregion

  return (
    <MainHeaderWrapper>
      <HeaderLogoArea>
        <img src={IMAGES.MAIN_LOGO} alt={''} style={{ cursor: 'pointer' }}
             onClick={() => history.push(PAGES.HOME.PATH)} />
        <span>Ví điện tử Doanh Nghiệp</span>
        <FontAwesomeIcon
          onClick={() => setVisibleMobileDrawerLeft(true)}
          icon={faList}
          size={'2x'}
          style={{
            display: device === DEVICE.MOBILE ? 'block' : 'none',
            cursor: 'pointer',
            color: '#fff',
            marginLeft: 8,
          }} />
        <Drawer
          title={null}
          placement='left'
          closable={false}
          width={SIDEBAR_WIDTH_EXPAND}
          style={{ padding: 0 }}
          onClose={() => setVisibleMobileDrawerLeft(false)}
          visible={visibleMobileDrawerLeft}>
          <DrawerSideBar onClose={() => setVisibleMobileDrawerLeft(false)} />
        </Drawer>
      </HeaderLogoArea>
      <MainHeaderRight>
        <HeaderTransactionArea>
          {
            authenticationStore.checkRole(ROLES.INITPAYMENT) &&
            <HeaderTransactionItem
              className={''} // selected
              id={'header-payment-area'}>
              <Dropdown
                overlay={paymentOverlay}
                overlayClassName={'header-payment-area'}
                trigger={'hover'}
                placement={'bottom'}
                getPopupContainer={() => document.getElementById('header-payment-area')}>
                <HeaderMenuText>{ICONS.PAYMENT_ICON}<span>Thanh toán</span></HeaderMenuText>
              </Dropdown>
            </HeaderTransactionItem>
          }

          {
            authenticationStore.checkRole(ROLES.INITWITHDRAWMM) &&
            <HeaderTransactionItem className={pageName === PAGES.WITHDRAW_FROM_MM.NAME ? 'selected' : ''}>
              <CustomLink to={PAGES.WITHDRAW_FROM_MM.PATH}>{ICONS.WITHDRAW_MM_ICON}<span>Rút tiền TK tiền di động</span></CustomLink>
            </HeaderTransactionItem>
          }
          {
            authenticationStore.checkRole(ROLES.INITDEPOSITMM) &&
            <HeaderTransactionItem className={pageName === PAGES.DEPOSIT_TO_MM.NAME ? 'selected' : ''}>
              <CustomLink
                to={PAGES.DEPOSIT_TO_MM.PATH}>{ICONS.DEPOSIT_MM_ICON}<span>Nạp tiền TK tiền di động</span></CustomLink>
            </HeaderTransactionItem>
          }
          {
            authenticationStore.checkRole(ROLES.INITDEPOSIT) &&
            <HeaderTransactionItem className={pageName === PAGES.DEPOSIT.NAME ? 'selected' : ''}>
              <CustomLink to={PAGES.DEPOSIT.PATH}>{ICONS.DEPOSIT_ICON}<span>Nạp tiền</span></CustomLink>
            </HeaderTransactionItem>
          }
          {
            authenticationStore.checkMultipleRole([
              ROLES.INITTRANSFERPERSONAL,
              ROLES.INITTRANSFERMM,
              ROLES.INITTRANSFERENTERPRISE,
              ROLES.INITTRANSFERMULTI,
              ROLES.INITWITHDRAWMM,
              ROLES.INITDEPOSITMM,
            ]) &&
            <HeaderTransactionItem
              className={TRANSFER_GROUP_PAGES.includes(pageName) ? 'selected' : ''}
              id={'header-transfer-area'}>
              <Dropdown
                overlay={transferOverlay}
                overlayClassName={'header-transfer-area'}
                trigger={'click'}
                placement={'bottom'}
                getPopupContainer={() => document.getElementById('header-transfer-area')}>
                <HeaderMenuText>{ICONS.TRANSFER_ICON}<span>Chuyển tiền</span></HeaderMenuText>
              </Dropdown>
            </HeaderTransactionItem>
          }
          {
            authenticationStore.checkRole(ROLES.INITLINK) &&
            <HeaderTransactionItem className={pageName === PAGES.LINK_BANK.NAME ? 'selected' : ''}>
              <CustomLink to={PAGES.LINK_BANK.PATH}>{ICONS.LINK_BANK_ICON}<span>Liên kết</span> </CustomLink>
            </HeaderTransactionItem>
          }
          {
            authenticationStore.checkRole(ROLES.INITWITHDRAW) &&
            <HeaderTransactionItem className={pageName === PAGES.WITHDRAW.NAME ? 'selected' : ''}>
              <CustomLink to={PAGES.WITHDRAW.PATH}>{ICONS.WITHDRAW_ICON}<span>Rút tiền</span></CustomLink>
            </HeaderTransactionItem>
          }
        </HeaderTransactionArea>
        {/*<HeaderNotifyArea>*/}
        {/*  <NotifyBell />*/}
        {/*</HeaderNotifyArea>*/}
        <HeaderUserArea />
      </MainHeaderRight>
      <MainHeaderRightMobile>
        <FontAwesomeIcon
          onClick={() => setVisibleMobileDrawerRight(true)}
          icon={faBars}
          size={'2x'}
          color={'#fff'}
          style={{ cursor: 'pointer', marginTop: 4 }} />
        <Drawer
          title={'Ví doanh nghiệp'}
          width={300}
          placement='right'
          style={{ padding: 0 }}
          onClose={() => setVisibleMobileDrawerRight(false)}
          visible={visibleMobileDrawerRight}>
          <Menu
            onClick={handleClickDrawerMenu}
            style={{ width: '100%' }}
            selectedKeys={`/${pageName}`}
            mode='inline'
          >
            {
              authenticationStore.checkRole(ROLES.INITPAYMENT) &&
              <Menu.Item key={PAGES.DEPOSIT.PATH}>
                <RowAlignCenterDiv>
                  {ICONS.DEPOSIT_ICON_BLUE} Nạp tiền
                </RowAlignCenterDiv>
              </Menu.Item>
            }
            {
              authenticationStore.checkMultipleRole([
                ROLES.INITTRANSFERPERSONAL, ROLES.INITTRANSFERMM, ROLES.INITTRANSFERENTERPRISE,
              ]) &&
              <Menu.Item key={PAGES.TRANSFER_WALLET.PATH}>
                <RowAlignCenterDiv>
                  <img src={ICONS.TRANSFER1} alt={''} /> Chuyển tiền ví
                </RowAlignCenterDiv>
              </Menu.Item>
            }
            {
              authenticationStore.checkMultipleRole([
                ROLES.INITTRANSFERMULTI,
              ]) &&
              <Menu.Item key={PAGES.TRANSFER_MULTIPLE.PATH}>
                <RowAlignCenterDiv>
                  <img src={ICONS.TRANSFER2} alt={''} /> Chuyển tiền theo lô
                </RowAlignCenterDiv>
              </Menu.Item>
            }
            {
              authenticationStore.checkRole(ROLES.INITWITHDRAWMM) &&
              <Menu.Item key={PAGES.WITHDRAW_FROM_MM.PATH}>
                <RowAlignCenterDiv>
                  <img src={ICONS.TRANSFER3} alt={''} /> Rút tiền TK tiền di động
                </RowAlignCenterDiv>
              </Menu.Item>
            }
            {
              authenticationStore.checkRole(ROLES.INITDEPOSITMM) &&
              <Menu.Item key={PAGES.DEPOSIT_TO_MM.PATH}>
                <RowAlignCenterDiv>
                  <img src={ICONS.TRANSFER4} alt={''} /> Nạp tiền TK tiền di động
                </RowAlignCenterDiv>
              </Menu.Item>
            }
            {
              authenticationStore.checkRole(ROLES.INITLINK) &&
              <Menu.Item key={PAGES.LINK_BANK.PATH}>
                <RowAlignCenterDiv>
                  {ICONS.LINK_BANK_ICON_BLUE} Liên kết
                </RowAlignCenterDiv>
              </Menu.Item>
            }
            {
              authenticationStore.checkRole(ROLES.INITWITHDRAW) &&
              <Menu.Item key={PAGES.WITHDRAW.PATH}>
                <RowAlignCenterDiv>
                  {ICONS.WITHDRAW_ICON_BLUE} Rút tiền
                </RowAlignCenterDiv>
              </Menu.Item>
            }
          </Menu>
        </Drawer>
      </MainHeaderRightMobile>
    </MainHeaderWrapper>

  )
}

MainHeader.propTypes = {}

export default inject('commonStore', 'authenticationStore', 'saleStore', 'orderStore', 'bankStore')(observer(MainHeader))