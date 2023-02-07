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

import { AreaCreateCommand, TitleFunds, TitleInfoService, WithdrawPageWrapper } from './WithdrawPageStyled'
import AccountSelectBox from '../../components/AccountSelectBox'
import BankLinkedSelectBox from '../../components/BankLinkedSelectBox'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import numberUtils from '../../utils/numberUtils'
import { useHistory } from 'react-router-dom'

const WithdrawPage = props => {
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
  const [withdrawAmount, setWithdrawAmount] = useState(null)
  const [selectedAmountMoney, setSelectedAmountMoney] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [stateFee, setStateFee] = useState(0)
  // endregion
  // region destructuring ======================
  const { selectedAccountWallets } = accountWalletStore
  const { jwtDecode, userProfile, roles } = authenticationStore
  const { selectedLinkedBank } = bankStore
  const { accessToken, tokenKey } = authenticationStore

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
    setWithdrawAmount(e)
    setSelectedAmountMoney(e)
  }
  const handleSubmitWithdraw = (e) => {
    // Lấy phí giao dịch sau đó show modal confirm
    let payload = {
      PayType: PAYTYPE.WITHDRAW_LINKED_BANK,
      Amount: selectedAmountMoney,
      BankCode: selectedLinkedBank?.bankCode,
      BankID: selectedLinkedBank?.bankID,
      BankServiceID: selectedLinkedBank?.bankServiceID,
      AppliedType: 'entWallet',
      FeeType: FEE_TYPE.WITHDRAW,
      TransferType: null, // chỉ truyền khi FeeType === 3
    }
    paymentStore.getFee(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          let feeTransaction = JSON.parse(res?.param)
          setStateFee(Number(feeTransaction?.transferFee))
          let infos = [
            {
              name: 'Tài khoản ví rút',
              value: selectedAccountWallets?.accountName,
            },
            {
              name: 'Ngân hàng nhận',
              value: selectedLinkedBank?.bankName,
            },
            {
              name: 'Tài khoản nhận',
              value: selectedLinkedBank?.bankAccount,
            },
            {
              name: 'Số tiền',
              value: numberUtils.thousandSeparator(selectedAmountMoney) + 'đ',
            },
            {
              name: 'Phí giao dịch',
              value: Number(feeTransaction?.transferFee) > 0 ? numberUtils.thousandSeparator(Number(feeTransaction?.transferFee)) + 'đ' : 'Miễn phí',
              // value: Number(feeTransaction?.transferFee),
            },
            {
              name: 'Tổng tiền',
              value: numberUtils.thousandSeparator(selectedAmountMoney + Number(feeTransaction?.transferFee)) + 'đ',
            },
          ]
          setArrConfirmInfo(infos)
          setVisibleConfirm(true)
        }
      })

  }
  const handleConfirm = () => {
    let payload = {
      DepartmentID: userProfile?.departmentID,
      OrganizationID: userProfile?.organizationID,
      ExecutionData: {
        WithdrawInfo: {
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
    orderStore.createWithDrawalOrder(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          notification.success({
            message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
            description: res?.description,
          })
          resetForm()
        }
      })
  }
  const resetForm = () => {
    formAmount.resetFields()
    setVisibleConfirm(false)
    setWithdrawAmount(null)
    setSelectedAmountMoney(null)
    bankStore.resetSelectedLinkedBank()
    accountWalletStore.resetSelectedAccountWallets()
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.INITWITHDRAW)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    if (!tokenKey || !accessToken) return
    bankStore.getLinkBanks({ bankServiceType: BANKSERVICETYPE.WITHDRAW })
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
        <title>Rút tiền</title>
      </Helmet>
      <WithdrawPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.WITHDRAW} />
        <WhiteRoundedBox>
          <TitleInfoService>Thông tin rút tiền</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitWithdraw}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                <AccountSelectBox />
                <Form.Item
                  rules={[
                    { required: true, message: 'Vui lòng nhập số tiền' },
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
                    placeholder={'Nhập số tiền'}
                    maxLength={19}
                    min={1}
                    step={1000}
                  />
                </Form.Item>
                <SuggestPriceList
                  amountMoney={withdrawAmount}
                  selectedAmountMoney={selectedAmountMoney}
                  selectedSuggestAmountMoneyCallback={handleSelectedSuggestAmountMoney} />
              </Col>
            </Row>
            <TitleFunds marginTop={'16px'}>Tài khoản nhận</TitleFunds>
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
                Tạo yêu cầu
              </Button>
            </AreaCreateCommand>
          </Form>
        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={() => setVisibleConfirm(false)}
          title={'Xác nhận rút tiền'}
          visible={visibleConfirm} />
      </WithdrawPageWrapper>
    </>
  )
}

WithdrawPage.propTypes = {}

export default inject(
  'paymentStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'accountWalletStore')(observer(WithdrawPage))