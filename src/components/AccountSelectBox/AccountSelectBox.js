import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {
  AccountBalance, AccountItemBox,
  AccountName,
  AccountNumber, AccountScroller,
  AccountSelectBoxWrapper,
  AccountTitle, ChangeAccountText,
} from './AccountSelectBoxStyled'
import numberUtils from '../../utils/numberUtils'
import { RowFlexEndDiv } from '../CommonStyled/CommonStyled'
import { Dropdown, Menu } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { Scrollbars } from 'react-custom-scrollbars'
import { BALANCE_TYPES } from '../../utils/constant'

const AccountSelectBox = props => {
  // region props, hook, state =================
  const { accountWalletStore, profileStore, commonStore ,hiddenChange } = props

  // endregion
  // region destructuring ======================
  const { appTheme } = commonStore
  const { selectedAccountWallets, accountWallets } = accountWalletStore
  const { entUserProfile, entProfile } = profileStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleClickSelect = e => {
    accountWalletStore.setSelectedAccountWallets(e)
  }

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    let payload = {
      BalanceType: BALANCE_TYPES.PAYMENT,
      Currency: '',
    }
    accountWalletStore.getAccountWallets(payload)
      .then(res => {
        console.log(res)
      })
  }, [])

  // endregion

  const menu = (
    <AccountScroller>
      {
        accountWallets && accountWallets?.length > 0 ? accountWallets.map(item =>
          <AccountItemBox
            color={appTheme.solidColor}
            key={item?.accountID}
            selected={item?.accountID === selectedAccountWallets?.accountID}
            onClick={() => handleClickSelect(item)}
          >
            <AccountTitle>Tài khoản ví</AccountTitle>
            <AccountName>{entProfile?.businessName}</AccountName>
            <AccountNumber>{item?.accountName}</AccountNumber>
            <AccountBalance>
              {numberUtils.thousandSeparator(item?.balance)}{item?.currency}
            </AccountBalance>
          </AccountItemBox>,
        ) : <div />
      }
    </AccountScroller>
  )


  return (
    <AccountSelectBoxWrapper>
      {
        selectedAccountWallets ?
          <>
            <AccountTitle>Tài khoản ví</AccountTitle>
            <AccountName>{entProfile?.businessName}</AccountName>
            <AccountNumber>{selectedAccountWallets?.accountName}</AccountNumber>
            <AccountBalance>
              {numberUtils.thousandSeparator(selectedAccountWallets?.balance)}{selectedAccountWallets?.currency}
            </AccountBalance>
          </> : <div />
      }
      {
        !hiddenChange &&
        <Dropdown overlay={menu} trigger={['click']}>
          <RowFlexEndDiv>
            <ChangeAccountText color={appTheme.solidColor}>
              Đổi tài khoản <DownOutlined />
            </ChangeAccountText>
          </RowFlexEndDiv>
        </Dropdown>
      }


    </AccountSelectBoxWrapper>
  )
}

AccountSelectBox.propTypes = {
  hiddenChange: PropTypes.bool
}

export default inject('profileStore', 'accountWalletStore', 'commonStore')(observer(AccountSelectBox))
