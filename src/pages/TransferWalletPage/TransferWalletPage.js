import React, { useEffect, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  DEVICE_TYPE,
  ERROR_COLOR, ERROR_TITLE,
  FEE_TYPE, PAGES, RECEIVER_ACCOUNT_TYPE, RESPONSE_CODE, ROLES,
  SUCCESS_COLOR, SUCCESS_TITLE, TEXT_403,
  TRANSFER_TYPE,
  USER_TYPE, WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import { Helmet } from 'react-helmet/es/Helmet'
import { ColorText, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { Button, Col, Form, Input, InputNumber, message, notification, Row, Select } from 'antd'
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

const TransferWalletPage = props => {
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
  const { selectedAccountWallets } = accountWalletStore
  const { userProfile, roles } = authenticationStore
  const { entProfile } = profileStore
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
    // e.receiverAccountType  1 : cá nhân | 2: doanh nghiệp | 3 : tiền di động
    let transferType = 0
    switch (e.receiverAccountType) {
      case RECEIVER_ACCOUNT_TYPE.PERSONAL:
      case RECEIVER_ACCOUNT_TYPE.ENTERPRISE:
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
      case RECEIVER_ACCOUNT_TYPE.MM:
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
              value: renderReceiveAccountTypeName(e.receiverAccountType),
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
      case RECEIVER_ACCOUNT_TYPE.PERSONAL:
        orderStore.createTransferPersonalExecution(payload)
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
        break
      case RECEIVER_ACCOUNT_TYPE.ENTERPRISE:
        orderStore.createTransferEntExecution(payload)
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
        break
      case RECEIVER_ACCOUNT_TYPE.MM:
        orderStore.createTransferMMExecution(payload)
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
      ReceiverAccountType: receiverAccountType,
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
  const renderReceiveAccountTypeName = (e) => {
    switch (e) {
      case RECEIVER_ACCOUNT_TYPE.PERSONAL:
        return 'Ví cá nhân'
      case RECEIVER_ACCOUNT_TYPE.ENTERPRISE:
        return 'Ví doanh nghiệp'
      case RECEIVER_ACCOUNT_TYPE.MM:
        return 'Tiền di động'
      default:
        return ''
    }
  }
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
    }
  }, [])
  // endregion


  return (
    <>
      <Helmet>
        <title>Chuyển tiền ví</title>
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
                <AccountSelectBox />
                <Form.Item
                  name={'receiverAccountType'}
                  rules={[
                    { validator: validateReceiverAccountType },
                  ]}
                >
                  <Select onChange={handleChangeReceiverAccountType} placeholder={'Tài khoản nhận'}>
                    {
                      authenticationStore.checkRole(ROLES.INITTRANSFERPERSONAL)
                      && <Select.Option value={RECEIVER_ACCOUNT_TYPE.PERSONAL}>Ví cá nhân</Select.Option>
                    }
                    {
                      authenticationStore.checkRole(ROLES.INITTRANSFERENTERPRISE)
                      && <Select.Option value={RECEIVER_ACCOUNT_TYPE.ENTERPRISE}>Ví doanh nghiệp</Select.Option>
                    }
                    {
                      authenticationStore.checkRole(ROLES.INITTRANSFERMM)
                      && <Select.Option value={RECEIVER_ACCOUNT_TYPE.MM}>Tiền di động</Select.Option>
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
                Tạo yêu cầu
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

TransferWalletPage.propTypes = {}

export default inject(
  'paymentStore',
  'profileStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'commonStore',
  'accountWalletStore')(observer(TransferWalletPage))