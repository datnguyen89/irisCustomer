import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {
  MoneySourceItemWrapper,
  MoneySourceIconWrapper,
  PaymentMoneySourceWrapper,
  MoneySourceInfoWrapper,
} from './PaymentMoneySourceStyled'
import {
  BorderRoundedBox,
  ColorText,
  ColorTitle,
  ColorTitleNoBg,
  TitleBackgroundGray,
} from '../CommonStyled/CommonStyled'
import { Col, Row } from 'antd'
import ICONS from '../../icons'
import numberUtils from '../../utils/numberUtils'
import { toJS } from 'mobx'
import { BALANCE_TYPES, BANKSERVICETYPE, PAYMENT_TYPE, RESPONSE_CODE } from '../../utils/constant'

const PaymentMoneySource = props => {
  // region props, hook, state =================
  const {
    accountWalletStore,
    profileStore,
    commonStore,
    saleStore,
    bankStore,
  } = props

  // endregion
  // region destructuring ======================
  const { appTheme } = commonStore
  const { selectedAccountWallets, accountWallets } = accountWalletStore
  const { entUserProfile, entProfile } = profileStore
  const { selectedPaymentObj } = saleStore
  const { listLinkedBanks } = bankStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const onClickChosenPaymentMethod = (paymentObj, paymentType) => {
    saleStore.setSelectedPaymentMethod(paymentObj, paymentType)
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
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          let accounts = JSON.parse(res?.param)
          let newSelectedPaymentObj = (accounts && accounts?.length) > 0 ? accounts[0] : {}
          saleStore.setSelectedPaymentMethod(newSelectedPaymentObj, PAYMENT_TYPE.WALLET)
        }

      })
    bankStore.getLinkBanks({ bankServiceType: BANKSERVICETYPE.PAYMENT })
  }, [])
  // endregion
  return (
    <PaymentMoneySourceWrapper>
      <TitleBackgroundGray marginTop={'16px'}>
        Nguồn tiền
      </TitleBackgroundGray>
      <Row justify={'center'} gutter={[16, 16]}>
        {
          selectedAccountWallets &&
          <Col
            xxl={(listLinkedBanks?.length > 0) ? 4 : 16}
            xl={(listLinkedBanks?.length > 0) ? 4 : 18}
            lg={(listLinkedBanks?.length > 0) ? 8 : 24}
            md={24}
            sm={24}
            xs={24}>
            <BorderRoundedBox>
              <ColorTitleNoBg marginBottom={'16px'}>
                Ví điện tử
              </ColorTitleNoBg>
              <MoneySourceItemWrapper
                active={selectedPaymentObj?.accountID === selectedAccountWallets?.accountID}
                appTheme={appTheme}
                onClick={() => onClickChosenPaymentMethod(selectedAccountWallets, PAYMENT_TYPE.WALLET)}
              >
                <MoneySourceIconWrapper>
                  <img src={ICONS.EWALLET} alt={''} />
                </MoneySourceIconWrapper>
                <MoneySourceInfoWrapper>
                  <ColorText fontWeight={500}>{selectedAccountWallets?.accountName}</ColorText>
                  <ColorText color={'#B4B4B4'}>
                    {numberUtils.thousandSeparator(selectedAccountWallets?.balance)}{selectedAccountWallets?.currency}
                  </ColorText>
                </MoneySourceInfoWrapper>
              </MoneySourceItemWrapper>
            </BorderRoundedBox>
          </Col>
        }
        {
          listLinkedBanks && listLinkedBanks?.length > 0 &&
          <Col
            xxl={(listLinkedBanks?.length > 0) ? 12 : 16}
            xl={(listLinkedBanks?.length > 0) ? 12 : 18}
            lg={(listLinkedBanks?.length > 0) ? 16 : 24}
            md={24}
            sm={24}
            xs={24}>
            <BorderRoundedBox margin={'0'}>
              <ColorTitleNoBg marginBottom={'16px'}>
                Ngân hàng liên kết trực tiếp
              </ColorTitleNoBg>
              <Row gutter={[16, 16]}>
                {
                  listLinkedBanks.map(item =>
                    <Col
                      key={item?.bankID}
                      xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                      <MoneySourceItemWrapper
                        active={item?.bankID === selectedPaymentObj?.bankID}
                        appTheme={appTheme}
                        onClick={() => onClickChosenPaymentMethod(item, PAYMENT_TYPE.LINKED_BANK)}
                      >
                        <MoneySourceIconWrapper>
                          <img src={item?.logo} alt={''} />
                        </MoneySourceIconWrapper>
                        <MoneySourceInfoWrapper>
                          <ColorText fontWeight={500}>{item.bankName}</ColorText>
                          <ColorText color={'#B4B4B4'}>{item.bankAccount}</ColorText>
                        </MoneySourceInfoWrapper>
                      </MoneySourceItemWrapper>
                    </Col>,
                  )
                }


              </Row>
            </BorderRoundedBox>
          </Col>
        }

      </Row>
    </PaymentMoneySourceWrapper>
  )
}

PaymentMoneySource.propTypes = {}

export default inject('commonStore', 'accountWalletStore', 'profileStore', 'saleStore', 'bankStore')(observer(PaymentMoneySource))
