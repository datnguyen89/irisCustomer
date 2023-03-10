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

import {
  AreaCreateCommand,
  ReceiverName,
  TitleInfoService,
  WithdrawFromMmPageWrapper,
} from './WithdrawFromMmPageStyled'
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

const WithdrawFromMmEditPage = props => {
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
  const [withdrawFromMmAmount, setWithdrawFromMmAmount] = useState(null)
  const [selectedAmountMoney, setSelectedAmountMoney] = useState(null)
  const [stateFee, setStateFee] = useState(0)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  // endregion
  // region destructuring ======================
  const { transactionUserMMInfo } = paymentStore
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
    setWithdrawFromMmAmount(e)
    setSelectedAmountMoney(e)
  }
  const handleSubmitWithdrawFromMm = (e) => {
    console.log(e)
    setFormCollected(e)

    // L???y ph?? giao d???ch sau ???? show modal confirm
    let payload = {
      Amount: selectedAmountMoney,
      FeeType: FEE_TYPE.TRANSFER,
      TransferType: TRANSFER_TYPE.WITHDRAW_MM,
      TransferAccount: e?.receiverAccount,
    }
    paymentStore.getFee(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          let feeTransaction = JSON.parse(res?.param)
          setStateFee(Number(feeTransaction?.transferFee))
          let infos = [
            {
              name: 'S??? t??i kho???n chuy???n',
              value: e.receiverAccount,
            },
            {
              name: 'T??n t??i kho???n chuy???n',
              value: transactionUserMMInfo,
            },
            {
              name: 'T??i kho???n nh???n',
              value: selectedAccountWallets?.accountName,
            },
            {
              name: 'T??n t??i kho???n nh???n',
              value: entProfile?.businessName,
            },

            {
              name: 'S??? gi???y t??? t??y th??n',
              value: e.receiverSSN,
            },
            {
              name: 'S??? ti???n',
              value: numberUtils.thousandSeparator(selectedAmountMoney) + '??',
            },
            {
              name: 'N???i dung',
              value: e.content,
            },
            {
              name: 'Ph?? giao d???ch',
              value: Number(feeTransaction?.transferFee) > 0 ? numberUtils.thousandSeparator(Number(feeTransaction?.transferFee)) + '??' : 'Mi???n ph??',
            },
            {
              name: 'T???ng ti???n',
              value: numberUtils.thousandSeparator(selectedAmountMoney + Number(feeTransaction?.transferFee)) + '??',
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
          RelatedFullName: transactionUserMMInfo,
          IsSetReceiverFee: false,
          Description: formCollected?.content,
          TotalAmount: Number(selectedAmountMoney) + stateFee,
          Fee: stateFee,
          FeeType: FEE_TYPE.TRANSFER,
          TransferType: TRANSFER_TYPE.PAY_MM_OTHER,
          Passport: formCollected?.receiverSSN,
          AccountName: selectedAccountWallets?.accountName,
          AccountFullName: entProfile?.businessName,
        },
      },
    }
    orderStore.updateWithdrawMMExecution(payload)
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
        console.log()
        paymentStore.checkUserMMInfo({
          AccountName: formAmount.getFieldValue('receiverAccount'),
          Passport: formAmount.getFieldValue('receiverSSN'),
        })

      })
      .catch(() => {
      })

  }
  const handleChangeReceiverInfo = () => {
    paymentStore.resetTransactionUserMMInfo(null)
  }
  const resetForm = () => {
    formAmount.resetFields()
    setVisibleConfirm(false)
    setWithdrawFromMmAmount(null)
    setSelectedAmountMoney(null)
    accountWalletStore.resetSelectedAccountWallets()
    paymentStore.resetTransactionUserMMInfo(null)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.INITWITHDRAWMM)) return
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
        <title>S???a y??u c???u r??t ti???n TK ti???n di ?????ng</title>
      </Helmet>
      <WithdrawFromMmPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.WITHDRAW_FROM_MM_EDIT} />
        <WhiteRoundedBox>
          <TitleInfoService>S???a y??u c???u r??t ti???n TK ti???n di ?????ng</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitWithdrawFromMm}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={18} md={20} sm={24} xs={24}>
                <AccountSelectBox hiddenChange={true} />
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Form.Item
                      name={'receiverAccount'}
                      rules={[
                        { required: true, message: 'Vui l??ng nh???p s??? t??i kho???n ti???n di ?????ng' },
                      ]}
                    >
                      <Input
                        onBlur={handleBlurReceiverAccount}
                        onChange={handleChangeReceiverInfo}
                        placeholder={'Nh???p s??? t??i kho???n ti???n di ?????ng'} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      rules={[
                        { required: true, message: 'Vui l??ng nh???p s??? gi???y t??? t??y th??n' },
                      ]}
                      name={'receiverSSN'}
                    >
                      <Input
                        onChange={handleChangeReceiverInfo}
                        onBlur={handleBlurReceiverAccount}
                        suffix={<InfoCircleOutlined style={{ fontSize: 16, color: '#ccc' }} />}
                        placeholder={'Nh???p s??? gi???y t??? t??y th??n'} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <ReceiverName>{transactionUserMMInfo || 'T??n ng?????i r??t'}</ReceiverName>
                </Form.Item>
                <Form.Item
                  rules={[
                    { required: true, message: 'Vui l??ng nh???p s??? ti???n' },
                  ]}
                  name={'amount'}>
                  <InputNumber
                    style={inputStyle}
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
                <Form.Item>
                  <SuggestPriceList
                    amountMoney={withdrawFromMmAmount}
                    selectedAmountMoney={selectedAmountMoney}
                    selectedSuggestAmountMoneyCallback={handleSelectedSuggestAmountMoney} />
                </Form.Item>
                <Form.Item
                  name={'content'}>
                  <Input.TextArea
                    rows={3}
                    showCount
                    maxLength={35}
                    placeholder={'Nh???p n???i dung chuy???n ti???n'} />
                </Form.Item>
              </Col>
            </Row>
            <AreaCreateCommand>
              <Button
                disabled={!transactionUserMMInfo}
                htmlType={'submit'}
                type={'primary'}>
                C???p nh???t
              </Button>
            </AreaCreateCommand>
          </Form>
        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={() => setVisibleConfirm(false)}
          title={'X??c nh???n s???a y??u c???u r??t ti???n TK ti???n di ?????ng'}
          visible={visibleConfirm} />
      </WithdrawFromMmPageWrapper>
    </>
  )
}

WithdrawFromMmEditPage.propTypes = {}

export default inject(
  'paymentStore',
  'profileStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'accountWalletStore')(observer(WithdrawFromMmEditPage))