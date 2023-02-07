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
  SUGGEST_AMOUNT,
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

const DepositEditPage = props => {
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
  const { selectedAccountWallets, accountWallets } = accountWalletStore
  const { jwtDecode, userProfile, roles,  accessToken, tokenKey } = authenticationStore
  const { selectedLinkedBank, listLinkedBanks } = bankStore
  const { editingExecution } = orderStore
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
    orderStore.checkLinkBank({ bankCode: selectedLinkedBank.bankCode })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          // Nếu bankLinkType === 1 || bankLinkType === 3 : cho phép chọn để tạo yêu cầu
          if (res?.param?.bankLinkType === 1 || res?.param?.bankLinkType === 3) {
            // Lấy phí giao dịch sau đó show modal confirm
            let payload = {
              PayType: PAYTYPE.DEPOSIT_LINKED_BANK,
              Amount: selectedAmountMoney,
              BankCode: selectedLinkedBank?.bankCode,
              BankID: selectedLinkedBank?.bankID,
              BankServiceID: selectedLinkedBank?.bankServiceID,
              AppliedType: 'entWallet',
              FeeType: FEE_TYPE.DEPOSIT,
              TransferType: null, // chỉ truyền khi FeeType === 3
            }
            paymentStore.getFee(payload)
              .then(res => {
                if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
                  let feeTransaction = JSON.parse(res?.param)
                  setStateFee(Number(feeTransaction?.transferFee))
                  let infos = [
                    {
                      name: 'Nguồn tiền',
                      value: `${selectedLinkedBank?.bankCode} | ${selectedLinkedBank?.bankAccount}`,
                    },
                    {
                      name: 'Tài khoản Ví nạp',
                      value: selectedAccountWallets?.accountName,
                    },
                    {
                      name: 'Số tiền',
                      value: numberUtils.thousandSeparator(selectedAmountMoney),
                    },
                    {
                      name: 'Phí giao dịch',
                      value: Number(feeTransaction?.transferFee) > 0 ? numberUtils.thousandSeparator(Number(feeTransaction?.transferFee)) : 'Miễn phí',
                      // value: Number(feeTransaction?.transferFee),
                    },
                    {
                      name: 'Tổng tiền',
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
      ExecutionID: Number(editingExecution?.executionID),
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
    orderStore.updateDepositOrder(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          notification.success({
            message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
            description: res?.description,
          })
          setVisibleConfirm(false)
          resetForm()
          history.push(PAGES.TRANSACTION_MANAGE.PATH)
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
      orderStore.resetEditingExecution()
    }
  }, [])
  useEffect(() => {
    if (!listLinkedBanks || listLinkedBanks?.length === 0) return
    if (!accountWallets || accountWallets?.length === 0) return
    if (!editingExecution) {
      history.push(PAGES.TRANSACTION_MANAGE.PATH)
    } else {
      let amount = Number(JSON.parse(editingExecution.executionData)?.DepositInfo?.Amount)
      let bankCode = JSON.parse(editingExecution.executionData)?.DepositInfo?.BankCode
      let accountName = JSON.parse(editingExecution.executionData)?.DepositInfo?.AccountName
      accountWalletStore.setSelectedAccountWalletsByAccountName(accountName)
      formAmount.setFieldsValue({
        amount: amount,
      })
      setSelectedAmountMoney(amount)
      bankStore.setSelectedLinkedBankByBankCode(bankCode)
    }
  }, [editingExecution, listLinkedBanks, accountWallets])
  // endregion

  return (
    <>
      <Helmet>
        <title>Sửa yêu cầu nạp tiền</title>
      </Helmet>
      <DepositPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.DEPOSIT_EDIT} />
        <WhiteRoundedBox>
          <TitleInfoService>Sửa yêu cầu nạp tiền</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitDeposit}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={12} md={24} sm={24} xs={24}>
                <AccountSelectBox hiddenChange={true} />
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
                  amountMoney={depositAmount}
                  selectedAmountMoney={selectedAmountMoney}
                  selectedSuggestAmountMoneyCallback={handleSelectedSuggestAmountMoney} />
              </Col>
            </Row>
            <TitleFunds marginTop={'16px'}>Nguồn tiền</TitleFunds>
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
                Cập nhật
              </Button>
            </AreaCreateCommand>
          </Form>
        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={() => setVisibleConfirm(false)}
          title={'Xác nhận sửa yêu cầu nạp tiền Ví'}
          visible={visibleConfirm} />

        <NoticeBankModal
          visible={visibleSuggest}
          description={`Quý khách vui lòng thực hiện nạp tiền trên các kênh giao dịch của Ngân hàng ${suggestBank?.bankName} hoặc liên hệ Ngân hàng để được hỗ trợ.`}
          onClose={handleCloseSuggest} />
      </DepositPageWrapper>
    </>
  )
}

DepositEditPage.propTypes = {}

export default inject(
  'paymentStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'accountWalletStore')(observer(DepositEditPage))