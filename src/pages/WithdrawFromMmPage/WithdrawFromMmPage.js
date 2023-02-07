import React, { useEffect, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  DEVICE_TYPE,
  FEE_TYPE,
  PAGES,
  RESPONSE_CODE,
  ROLES,
  SUCCESS_COLOR,
  SUCCESS_TITLE,
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
  BankLinkedSelectBoxWrapper,
  NoLinkedBank,
  NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'
import commonStore from '../../stores/commonStore'

let inputStyle = {
  width: '100%',
  borderRadius: 4,
}

const WithdrawFromMmPage = props => {
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
    setWithdrawFromMmAmount(e)
    setSelectedAmountMoney(e)
  }
  const handleSubmitWithdrawFromMm = (e) => {
    console.log(e)
    setFormCollected(e)

    // Lấy phí giao dịch sau đó show modal confirm
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
              name: 'Số tài khoản chuyển',
              value: e.receiverAccount,
            },
            {
              name: 'Tên tài khoản chuyển',
              value: transactionUserMMInfo,
            },
            {
              name: 'Tài khoản nhận',
              value: selectedAccountWallets?.accountName,
            },
            {
              name: 'Tên tài khoản nhận',
              value: entProfile?.businessName,
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
    let payload = {
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
    orderStore.createWithdrawMMExecution(payload)
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
    return () => {
      resetForm()
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>Rút tiền TK tiền di động</title>
      </Helmet>
      <WithdrawFromMmPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.WITHDRAW_FROM_MM} />
        <WhiteRoundedBox>
          <TitleInfoService>Thông tin rút tiền TK tiền di động</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitWithdrawFromMm}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={18} md={20} sm={24} xs={24}>
                <AccountSelectBox />
                <Row gutter={[24, 0]}>
                  <Col span={12}>
                    <Form.Item
                      name={'receiverAccount'}
                      rules={[
                        { required: true, message: 'Vui lòng nhập số tài khoản tiền di động' },
                      ]}
                    >
                      <Input
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
                        onChange={handleChangeReceiverInfo}
                        onBlur={handleBlurReceiverAccount}
                        suffix={<InfoCircleOutlined style={{ fontSize: 16, color: '#ccc' }} />}
                        placeholder={'Nhập số giấy tờ tùy thân'} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <ReceiverName>{transactionUserMMInfo || 'Tên người rút'}</ReceiverName>
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
                    placeholder={'Nhập nội dung chuyển tiền'} />
                </Form.Item>
              </Col>
            </Row>
            <AreaCreateCommand>
              <Button
                disabled={!transactionUserMMInfo}
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
          title={'Xác nhận rút tiền TK tiền di động'}
          visible={visibleConfirm} />
      </WithdrawFromMmPageWrapper>
    </>
  )
}

WithdrawFromMmPage.propTypes = {}

export default inject(
  'paymentStore',
  'profileStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'accountWalletStore')(observer(WithdrawFromMmPage))