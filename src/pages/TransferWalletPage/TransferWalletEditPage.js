import React, { useEffect, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  ACCOUNT_TYPES,
  BREADCRUMB_DATA,
  DEVICE_TYPE,
  ERROR_COLOR,
  ERROR_TITLE,
  EXECUTION_TYPE_ID,
  FEE_TYPE,
  PAGES,
  RESPONSE_CODE,
  ROLES,
  SUCCESS_COLOR,
  SUCCESS_TITLE,
  SUGGEST_AMOUNT,
  TEXT_403,
  TRANSFER_TYPE,
  USER_TYPE,
  WARNING_COLOR,
  WARNING_TITLE,
} from '../../utils/constant'
import { Helmet } from 'react-helmet/es/Helmet'
import { ColorText, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { Button, Col, Form, Input, InputNumber, notification, Row, Select } from 'antd'
import SuggestPriceList from '../../components/SuggestAmountMoney'
import { inject, observer } from 'mobx-react'

import {
  AreaCreateCommand,
  ReceiverName,
  TitleInfoService,
  TransferWalletPageWrapper,
} from './TransferWalletPageStyled'
import AccountSelectBox from '../../components/AccountSelectBox'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import numberUtils from '../../utils/numberUtils'
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import validator from '../../validator'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'

let inputStyle = {
  width: '100%',
  borderRadius: 4,
}

const TransferWalletEditPage = props => {
  // region props, hook, state =================
  const {
    accountWalletStore,
    bankStore,
    authenticationStore,
    orderStore,
    paymentStore,
    profileStore,
    commonStore,
  } = props

  const { listLinkedBanks } = bankStore

  const history = useHistory()
  const [formAmount] = Form.useForm()
  const [formCollected, setFormCollected] = useState(null)
  const [transferWalletAmount, setTransferWalletAmount] = useState(null)
  const [selectedAmountMoney, setSelectedAmountMoney] = useState(null)
  const [stateFee, setStateFee] = useState(0)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  // endregion
  // region destructuring ======================
  const { transactionUserInfo, transactionUserType } = paymentStore
  const { selectedAccountWallets, accountWallets } = accountWalletStore
  const { userProfile, roles } = authenticationStore
  const { entProfile } = profileStore
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
    setTransferWalletAmount(e)
    setSelectedAmountMoney(e)
  }
  const handleSubmitTransferWallet = (e) => {
    console.log(e)
    setFormCollected(e)
    // e.receiverAccountType  0 : ví điện tử | 1 : tiền di động
    let transferType = 0
    switch (e.receiverAccountType) {
      case ACCOUNT_TYPES.WALLET:
        if (selectedAccountWallets?.accountName === e.receiverAccount) {
          notification.error({
            message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
            description: `Bạn không thể chuyển tiền cho chính mình`,
          })
          return
        } else {
          transferType = TRANSFER_TYPE.PAY_PAY
        }
        break
      case ACCOUNT_TYPES.MM:
        transferType = TRANSFER_TYPE.PAY_MM_OTHER
        break
      default:
        break
    }
    // Lấy phí giao dịch sau đó show modal confirm

    let payload = {
      Amount: selectedAmountMoney,
      FeeType: FEE_TYPE.TRANSFER,
      TransferType: transferType,
    }
    paymentStore.getFee(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          let feeTransaction = JSON.parse(res?.param)
          setStateFee(Number(feeTransaction?.transferFee))
          let infos = [
            {
              name: 'Tài khoản chuyển',
              value: selectedAccountWallets?.accountName,
            },
            {
              name: 'Tên tài khoản chuyển',
              value: entProfile?.businessName,
            },
            {
              name: 'Tài khoản nhận',
              value: e.receiverAccountType === ACCOUNT_TYPES.WALLET ? 'Ví điện tử' : 'Tiền di động',
            },
            {
              name: 'Số Tài khoản nhận',
              value: e.receiverAccount,
            },
            {
              name: 'Tên tài khoản nhận',
              value: transactionUserInfo,
            },
            {
              name: 'Số tiền',
              value: numberUtils.thousandSeparator(selectedAmountMoney) + 'đ',
            },
            {
              name: 'Nội dung',
              value: e.content,
            },
            {
              name: 'Phí giao dịch',
              value: Number(feeTransaction?.transferFee) > 0 ? numberUtils.thousandSeparator(Number(feeTransaction?.transferFee)) + 'đ' : 'Miễn phí',
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
      ExecutionID: Number(editingExecution?.executionID),
      DepartmentID: userProfile?.departmentID,
      OrganizationID: userProfile?.organizationID,
      ExecutionData: {
        DeviceType: DEVICE_TYPE,
        TransferInfo: {
          Amount: Number(selectedAmountMoney),
          RelatedUser: formCollected?.receiverAccount,
          RelatedFullName: transactionUserInfo,
          IsSetReceiverFee: false,
          Description: formCollected?.content,
          TotalAmount: Number(selectedAmountMoney) + stateFee,
          Fee: stateFee,
          FeeType: FEE_TYPE.TRANSFER,
          AccountName: selectedAccountWallets?.accountName,
          AccountFullName: entProfile?.businessName,
        },
      },
    }
    switch (formCollected?.receiverAccountType) {
      case ACCOUNT_TYPES.WALLET:
        // ví điện tử
        switch (transactionUserType) {
          // cá nhân
          case USER_TYPE.WALLET:
            orderStore.updateTransferPersonalExecution(payload)
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
            break
          // doanh nghiệp
          case USER_TYPE.ENTERPRISE:
            orderStore.updateTransferEntExecution(payload)
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
            break
          default:
            break
        }
        break
      case ACCOUNT_TYPES.MM:
        // MM
        orderStore.updateTransferMMExecution(payload)
          .then(res => {
            if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
              notification.success({
                message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
                description: res?.description,
              })
              setVisibleConfirm(false)
              history.push(PAGES.TRANSACTION_MANAGE.PATH)
              resetForm()
            }
          })
        break
      default:
        break
    }

  }
  const validateReceiverAccountType = (rule, value, callback) => {
    if (isNaN(value)) {
      callback('Vui lòng chọn loại tài khoản nhận')
    } else {
      callback()
    }
  }
  const handleBlurReceiverAccount = (e) => {
    e.persist()
    let receiverAccountType = formAmount.getFieldValue('receiverAccountType')
    let receiverAccount = formAmount.getFieldValue('receiverAccount')
    if (!receiverAccount) {
      return
    }
    if (isNaN(receiverAccountType)) {
      formAmount.validateFields(['receiverAccountType'])
      return
    }
    checkUser(receiverAccount, receiverAccountType)
  }
  const handleChangeReceiverAccountType = (e) => {
    let receiverAccountType = formAmount.getFieldValue('receiverAccountType')
    let receiverAccount = formAmount.getFieldValue('receiverAccount')
    if (!receiverAccount || receiverAccount?.trim()?.length === 0) {
      formAmount.validateFields(['receiverAccount'])
      return
    }
    checkUser(receiverAccount, receiverAccountType)
  }
  const checkUser = (receiverAccount, receiverAccountType) => {
    paymentStore.checkUserInfo({
      AccountName: receiverAccount,
      BalanceType: receiverAccountType,
    })

  }
  const handleChangeReceiverAccount = () => {
    paymentStore.resetTransactionUserInfo()
  }
  const resetForm = () => {
    formAmount.resetFields()
    setVisibleConfirm(false)
    setTransferWalletAmount(null)
    setSelectedAmountMoney(null)
    accountWalletStore.resetSelectedAccountWallets()
    paymentStore.resetTransactionUserInfo()
  }

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkMultipleRole([
      ROLES.INITTRANSFERPERSONAL,
      ROLES.INITTRANSFERENTERPRISE,
      ROLES.INITTRANSFERMM,
    ])) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    return () => {
      resetForm()
      orderStore.resetEditingExecution()
    }
  }, [])
  useEffect(() => {
    if (!accountWallets || accountWallets?.length === 0) return

    if (!editingExecution) {
      history.push(PAGES.TRANSACTION_MANAGE.PATH)
    } else {

      let amount = Number(JSON.parse(editingExecution.executionData)?.TransferInfo?.Amount)
      let content = JSON.parse(editingExecution.executionData)?.TransferInfo?.Description
      let relatedUser = JSON.parse(editingExecution.executionData)?.TransferInfo?.RelatedUser
      let accountName = JSON.parse(editingExecution.executionData)?.TransferInfo?.AccountName
      accountWalletStore.setSelectedAccountWalletsByAccountName(accountName)
      let accountType = null
      switch (editingExecution?.executionType) {
        case EXECUTION_TYPE_ID.TRANSFER_PERSONAL:
          accountType = ACCOUNT_TYPES.WALLET
          break
        case EXECUTION_TYPE_ID.TRANSFER_ENT:
          accountType = ACCOUNT_TYPES.WALLET
          break
        case EXECUTION_TYPE_ID.TRANSFER_MM:
          accountType = ACCOUNT_TYPES.MM
          break
        default:
          break
      }
      checkUser(relatedUser, accountType)
      formAmount.setFieldsValue({
        amount: amount,
        content: content,
        receiverAccountType: accountType,
        receiverAccount: relatedUser,
      })
      setSelectedAmountMoney(amount)
    }
  }, [editingExecution, accountWallets])
  // endregion

  return (
    <>
      <Helmet>
        <title>Chuyển tiền</title>
      </Helmet>
      <TransferWalletPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.TRANSFER_WALLET} />
        <WhiteRoundedBox>
          <TitleInfoService>Thông tin chuyển tiền</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitTransferWallet}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={18} md={20} sm={24} xs={24}>
                <AccountSelectBox hiddenChange={true} />
                <Form.Item
                  name={'receiverAccountType'}
                  rules={[
                    { validator: validateReceiverAccountType },
                  ]}
                >
                  <Select disabled onChange={handleChangeReceiverAccountType} placeholder={'Tài khoản nhận'}>
                    {
                      authenticationStore.checkMultipleRole([
                        ROLES.INITTRANSFERPERSONAL,
                        ROLES.INITTRANSFERENTERPRISE,
                      ])
                      && <Select.Option value={ACCOUNT_TYPES.WALLET}>Ví điện tử</Select.Option>
                    }
                    {
                      authenticationStore.checkRole(ROLES.INITTRANSFERMM)
                      && <Select.Option value={ACCOUNT_TYPES.MM}>Tiền di động</Select.Option>
                    }
                  </Select>
                </Form.Item>
                <Form.Item
                  name={'receiverAccount'}
                  rules={[
                    { required: true, message: 'Vui lòng nhập số tài khoản/số điện thoại nhận' },
                    { validator: validator.validateTrim },
                  ]}
                >
                  <Input
                    disabled
                    maxLength={20}
                    onChange={handleChangeReceiverAccount}
                    onBlur={handleBlurReceiverAccount}
                    suffix={<InfoCircleOutlined style={{ fontSize: 16, color: '#ccc' }} />}
                    placeholder={'Nhập số tài khoản/số điện thoại nhận'} />
                </Form.Item>
                <Form.Item>
                  <ReceiverName>{transactionUserInfo || 'Tên người nhận'}</ReceiverName>
                </Form.Item>
                <Form.Item
                  rules={[
                    { required: true, message: 'Vui lòng nhập số tiền' },
                  ]}
                  name={'amount'}>
                  <InputNumber
                    style={inputStyle}
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
                <Form.Item>
                  <SuggestPriceList
                    amountMoney={transferWalletAmount}
                    selectedAmountMoney={selectedAmountMoney}
                    selectedSuggestAmountMoneyCallback={handleSelectedSuggestAmountMoney} />
                </Form.Item>
                <Form.Item
                  name={'content'}>
                  <Input.TextArea
                    rows={3}
                    showCount
                    maxLength={35}
                    placeholder={'Nhập nội dung chuyển tiền'} />
                </Form.Item>
              </Col>
            </Row>
            <AreaCreateCommand>
              <Button
                disabled={!transactionUserInfo}
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
          title={'Xác nhận chuyển tiền'}
          visible={visibleConfirm} />
      </TransferWalletPageWrapper>
    </>
  )
}

TransferWalletEditPage.propTypes = {}

export default inject(
  'paymentStore',
  'profileStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'commonStore',
  'accountWalletStore')(observer(TransferWalletEditPage))