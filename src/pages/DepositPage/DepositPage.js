import React, { useEffect, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BANKSERVICETYPE,
  BREADCRUMB_DATA,
  DEVICE_TYPE,
  FEE_TYPE,
  PAGES,
  PAYTYPE,
  RESPONSE_CODE,
  ROLES,
  SUCCESS_COLOR,
  SUCCESS_TITLE,
  TEXT_403,
  WARNING_COLOR,
  WARNING_TITLE,
} from '../../utils/constant'
import { Helmet } from 'react-helmet/es/Helmet'
import { ColorText, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { Button, Col, Form, InputNumber, notification, Row } from 'antd'
import SuggestPriceList from '../../components/SuggestAmountMoney'
import { inject, observer } from 'mobx-react'

import { AreaCreateCommand, DepositPageWrapper, TitleFunds, TitleInfoService } from './DepositPageStyled'
import AccountSelectBox from '../../components/AccountSelectBox'
import BankLinkedSelectBox from '../../components/BankLinkedSelectBox'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import numberUtils from '../../utils/numberUtils'
import { useHistory } from 'react-router-dom'
import NoticeBankModal from '../../components/NoticeBankModal'

const DepositPage = props => {
  // region props, hook, state =================
  const {
    accountWalletStore,
    bankStore,
    authenticationStore,
    orderStore,
    paymentStore,
  } = props
  const history = useHistory()
  const [formAmount] = Form.useForm()
  const [depositAmount, setDepositAmount] = useState(null)
  const [selectedAmountMoney, setSelectedAmountMoney] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [stateFee, setStateFee] = useState(0)

  const [visibleSuggest, setVisibleSuggest] = useState(false)
  const [suggestBank, setSuggestBank] = useState(null)
  // endregion
  // region destructuring ======================
  const { selectedAccountWallets } = accountWalletStore
  const { jwtDecode, userProfile, roles, accessToken, tokenKey } = authenticationStore
  const { selectedLinkedBank } = bankStore

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleSelectedSuggestAmountMoney = (value) => {
    formAmount.setFieldsValue({
      amount: value,
    })
    setSelectedAmountMoney(value)
  }
  const handleChangeAmount = (e) => {
    setDepositAmount(e)
    setSelectedAmountMoney(e)
  }
  const handleSubmitDeposit = (e) => {
    orderStore.checkLinkBank({ bankCode: selectedLinkedBank?.bankCode })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          // N???u bankLinkType === 1 || bankLinkType === 3 : cho ph??p ch???n ????? t???o y??u c???u
          if (res?.param?.bankLinkType === 1 || res?.param?.bankLinkType === 3) {
            // L???y ph?? giao d???ch sau ???? show modal confirm
            let payload = {
              PayType: PAYTYPE.DEPOSIT_LINKED_BANK,
              Amount: selectedAmountMoney,
              BankCode: selectedLinkedBank?.bankCode,
              BankID: selectedLinkedBank?.bankID,
              BankServiceID: selectedLinkedBank?.bankServiceID,
              AppliedType: 'entWallet',
              FeeType: FEE_TYPE.DEPOSIT,
              TransferType: null, // ch??? truy???n khi FeeType === 3
            }
            paymentStore.getFee(payload)
              .then(res => {
                if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
                  let feeTransaction = JSON.parse(res?.param)
                  setStateFee(Number(feeTransaction?.transferFee))
                  let infos = [
                    {
                      name: 'Ngu???n ti???n',
                      value: `${selectedLinkedBank?.bankCode} | ${selectedLinkedBank?.bankAccount}`,
                    },
                    {
                      name: 'T??i kho???n V?? n???p',
                      value: selectedAccountWallets?.accountName,
                    },
                    {
                      name: 'S??? ti???n',
                      value: numberUtils.thousandSeparator(selectedAmountMoney),
                    },
                    {
                      name: 'Ph?? giao d???ch',
                      value: Number(feeTransaction?.transferFee) > 0 ? numberUtils.thousandSeparator(Number(feeTransaction?.transferFee)) : 'Mi???n ph??',
                      // value: Number(feeTransaction?.transferFee),
                    },
                    {
                      name: 'T???ng ti???n',
                      value: numberUtils.thousandSeparator(selectedAmountMoney + Number(feeTransaction?.transferFee)),
                    },
                  ]
                  setArrConfirmInfo(infos)
                  setVisibleConfirm(true)
                }
              })
          } else {
            setSuggestBank(selectedLinkedBank)
            setVisibleSuggest(true)
          }
        }
      })

  }
  const handleConfirm = () => {
    let payload = {
      DepartmentID: userProfile?.departmentID,
      OrganizationID: userProfile?.organizationID,
      ExecutionData: {
        DepositInfo: {
          BankID: selectedLinkedBank?.bankID,
          BankCode: selectedLinkedBank?.bankCode,
          BankAccountID: selectedLinkedBank?.bankAccountID,
          Amount: Number(selectedAmountMoney),
          TotalAmount: stateFee + Number(selectedAmountMoney),
          Fee: stateFee,
          BankAccount: selectedLinkedBank?.bankAccount,
          AccountName: selectedAccountWallets?.accountName,
          BankServiceID: selectedLinkedBank?.bankServiceID,
        },
        ReviewReason: '',
        ApproveReason: '',
        Email: '',
        DeviceType: DEVICE_TYPE,
        FullNameInitUser: jwtDecode.name,
        FullNameReviewUser: '',
        ReviewedTime: 0,
        FullNameApproveUser: '',
        ApprovedTime: 0,
        OrderID: 0,
      },
    }
    orderStore.createDepositOrder(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          notification.success({
            message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
            description: res?.description,
          })
          setVisibleConfirm(false)
          resetForm()
        }
      })
  }
  const resetForm = () => {
    formAmount.resetFields()
    setVisibleConfirm(false)
    setDepositAmount(null)
    setSelectedAmountMoney(null)
    bankStore.resetSelectedLinkedBank()
    accountWalletStore.resetSelectedAccountWallets()
  }
  const handleCloseSuggest = () => {
    setVisibleSuggest(false)
    setSuggestBank(null)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.INITDEPOSIT)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    if (!tokenKey || !accessToken) return
    bankStore.getLinkBanks({ bankServiceType: BANKSERVICETYPE.DEPOSIT })
  }, [accessToken, tokenKey])
  useEffect(() => {
    return () => {
      resetForm()
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>N???p ti???n</title>
      </Helmet>
      <DepositPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.DEPOSIT} />
        <WhiteRoundedBox>
          <TitleInfoService>Th??ng tin n???p ti???n</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitDeposit}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                <AccountSelectBox />
                <Form.Item
                  rules={[
                    { required: true, message: 'Vui l??ng nh???p s??? ti???n' },
                  ]}
                  name={'amount'}>
                  <InputNumber
                    style={{
                      width: '100%',
                    }}
                    onChange={handleChangeAmount}
                    size={'large'}
                    formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={(value) => value.replace(/\$\s?|(\.*)/g, '')}
                    placeholder={'Nh???p s??? ti???n'}
                    maxLength={19}
                    min={1}
                    step={1000}
                  />
                </Form.Item>
                <SuggestPriceList
                  amountMoney={depositAmount}
                  selectedAmountMoney={selectedAmountMoney}
                  selectedSuggestAmountMoneyCallback={handleSelectedSuggestAmountMoney} />
              </Col>
            </Row>
            <TitleFunds marginTop={'16px'}>Ngu???n ti???n</TitleFunds>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                <BankLinkedSelectBox />
              </Col>
            </Row>
            <AreaCreateCommand>
              <Button
                disabled={
                  !selectedAccountWallets
                  || !selectedLinkedBank
                  || !(selectedAmountMoney > 0)
                }
                htmlType={'submit'}
                type={'primary'}>
                T???o y??u c???u
              </Button>
            </AreaCreateCommand>
          </Form>
        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={() => setVisibleConfirm(false)}
          title={'X??c nh???n N???p ti???n V??'}
          visible={visibleConfirm} />

        <NoticeBankModal
          visible={visibleSuggest}
          description={`Qu?? kh??ch vui l??ng th???c hi???n n???p ti???n tr??n c??c k??nh giao d???ch c???a Ng??n h??ng ${suggestBank?.bankName} ho???c li??n h??? Ng??n h??ng ????? ???????c h??? tr???.`}
          onClose={handleCloseSuggest} />
      </DepositPageWrapper>
    </>
  )
}

DepositPage.propTypes = {}

export default inject(
  'paymentStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'accountWalletStore')(observer(DepositPage))