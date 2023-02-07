import React, { useEffect, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  ACCOUNT_TYPES,
  BREADCRUMB_DATA,
  DEVICE_TYPE,
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
  WARNING_COLOR,
  WARNING_TITLE,
} from '../../utils/constant'
import { Helmet } from 'react-helmet/es/Helmet'
import { ColorText, WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { Button, Col, Form, Input, InputNumber, notification, Row } from 'antd'
import SuggestPriceList from '../../components/SuggestAmountMoney'
import { inject, observer } from 'mobx-react'

import { AreaCreateCommand, DepositToMmPageWrapper, ReceiverName, TitleInfoService } from './DepositToMmPageStyled'
import AccountSelectBox from '../../components/AccountSelectBox'
import ConfirmInfoModal from '../../components/ConfirmInfoModal'
import numberUtils from '../../utils/numberUtils'
import { InfoCircleOutlined, WarningOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'

let inputStyle = {
  width: '100%',
  borderRadius: 4,
}

const DepositToMmEditPage = props => {
  // region props, hook, state =================
  const {
    accountWalletStore,
    bankStore,
    authenticationStore,
    orderStore,
    paymentStore,
    profileStore,
  } = props

  const { listLinkedBanks } = bankStore

  const history = useHistory()
  const [formAmount] = Form.useForm()
  const [formCollected, setFormCollected] = useState(null)
  const [depositToMmAmount, setDepositToMmAmount] = useState(null)
  const [selectedAmountMoney, setSelectedAmountMoney] = useState(null)
  const [stateFee, setStateFee] = useState(0)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])

  // endregion
  // region destructuring ======================
  const { transactionUserMMInfo } = paymentStore
  const { userProfile, roles } = authenticationStore
  const { entProfile } = profileStore
  const { editingExecution } = orderStore
  const { selectedAccountWallets, accountWallets } = accountWalletStore
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
    setDepositToMmAmount(e)
    setSelectedAmountMoney(e)
  }
  const handleSubmitDepositToMm = (e) => {
    console.log(e)
    setFormCollected(e)

    // Lấy phí giao dịch sau đó show modal confirm
    let payload = {
      Amount: selectedAmountMoney,
      FeeType: FEE_TYPE.TRANSFER,
      TransferType: TRANSFER_TYPE.DEPOSIT_MM,
    }
    paymentStore.getFee(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          let feeTransaction = JSON.parse(res?.param)
          setStateFee(Number(feeTransaction?.transferFee))
          let infos = [
            {
              name: 'Tài khoản Ví',
              value: selectedAccountWallets?.accountName,
            },
            {
              name: 'Tên tài khoản Ví',
              value: entProfile?.businessName,
            },
            {
              name: 'Số tài khoản nhận',
              value: e.receiverAccount,
            },
            {
              name: 'Tên tài khoản nhận',
              value: transactionUserMMInfo,
            },
            {
              name: 'Số giấy tờ tùy thân',
              value: e.receiverSSN,
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
    let relatedUser = JSON.parse(editingExecution.executionData)?.TransferInfo?.RelatedUser
    let passport = JSON.parse(editingExecution.executionData)?.TransferInfo?.Passport
    let payload = {
      ExecutionID: Number(editingExecution?.executionID),
      DepartmentID: userProfile?.departmentID,
      OrganizationID: userProfile?.organizationID,
      ExecutionData: {
        DeviceType: DEVICE_TYPE,
        TransferInfo: {
          Amount: Number(selectedAmountMoney),
          RelatedUser: relatedUser,
          RelatedFullName: transactionUserMMInfo,
          IsSetReceiverFee: false,
          Description: formCollected?.content,
          TotalAmount: Number(selectedAmountMoney) + stateFee,
          Fee: stateFee,
          FeeType: FEE_TYPE.TRANSFER,
          TransferType: TRANSFER_TYPE.PAY_MM_OTHER,
          Passport: passport,
          AccountName: selectedAccountWallets?.accountName,
          AccountFullName: entProfile?.businessName,
        },
      },
    }
    orderStore.updateDepositMMExecution(payload)
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
  const handleBlurReceiverAccount = (e) => {
    e.persist()
    formAmount.validateFields(['receiverAccount', 'receiverSSN'])
      .then(() => {
        console.log(formAmount.getFieldValue('receiverSSN'))
        paymentStore.checkUserMMInfo({
          AccountName: formAmount.getFieldValue('receiverAccount'),
          Passport: formAmount.getFieldValue('receiverSSN'),
        })

      })
      .catch(() => {
      })

  }
  const handleChangeReceiverInfo = () => {
    paymentStore.resetTransactionUserInfo()
  }
  const resetForm = () => {
    formAmount.resetFields()
    setVisibleConfirm(false)
    setDepositToMmAmount(null)
    setSelectedAmountMoney(null)
    accountWalletStore.resetSelectedAccountWallets()
    paymentStore.resetTransactionUserMMInfo()
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.INITDEPOSITMM)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    if (!accountWallets || accountWallets?.length === 0) return

    if (!editingExecution) {
      history.push(PAGES.TRANSACTION_MANAGE.PATH)
    } else {
      let amount = Number(JSON.parse(editingExecution.executionData)?.TransferInfo?.Amount)
      let content = JSON.parse(editingExecution.executionData)?.TransferInfo?.Description
      let relatedUser = JSON.parse(editingExecution.executionData)?.TransferInfo?.RelatedUser
      let passport = JSON.parse(editingExecution.executionData)?.TransferInfo?.Passport
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
      paymentStore.checkUserMMInfo({
        AccountName: relatedUser,
        Passport: passport,
      })

      formAmount.setFieldsValue({
        amount: amount,
        content: content,
        receiverAccountType: accountType,
        receiverAccount: relatedUser,
        receiverSSN: passport,
      })
      setSelectedAmountMoney(amount)
    }
  }, [editingExecution, accountWallets])
  useEffect(() => {
    return () => {
      resetForm()
      orderStore.resetEditingExecution()
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>Sửa yêu cầu nạp tiền TK tiền di động</title>
      </Helmet>
      <DepositToMmPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.DEPOSIT_TO_MM_EDIT} />
        <WhiteRoundedBox>
          <TitleInfoService>Sửa yêu cầu nạp tiền TK tiền di động</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitDepositToMm}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={18} md={20} sm={24} xs={24}>
                <AccountSelectBox hiddenChange={true} />
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Form.Item
                      name={'receiverAccount'}
                      rules={[
                        { required: true, message: 'Vui lòng nhập số tài khoản tiền di động' },
                      ]}
                    >
                      <Input
                        disabled
                        onBlur={handleBlurReceiverAccount}
                        onChange={handleChangeReceiverInfo}
                        placeholder={'Nhập số tài khoản tiền di động'} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      rules={[
                        { required: true, message: 'Vui lòng nhập số giấy tờ tùy thân' },
                      ]}
                      name={'receiverSSN'}
                    >
                      <Input
                        disabled
                        onChange={handleChangeReceiverInfo}
                        onBlur={handleBlurReceiverAccount}
                        suffix={<InfoCircleOutlined style={{ fontSize: 16, color: '#ccc' }} />}
                        placeholder={'Nhập số giấy tờ tùy thân'} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <ReceiverName>{transactionUserMMInfo || 'Tên người nhận'}</ReceiverName>
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
                    amountMoney={depositToMmAmount}
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
                disabled={!transactionUserMMInfo}
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
          title={'Xác nhận sửa yêu cầu nạp tiền TK tiền di động'}
          visible={visibleConfirm} />
      </DepositToMmPageWrapper>
    </>
  )
}

DepositToMmEditPage.propTypes = {}

export default inject(
  'paymentStore',
  'profileStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'commonStore',
  'accountWalletStore')(observer(DepositToMmEditPage))