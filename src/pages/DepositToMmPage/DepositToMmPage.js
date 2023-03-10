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

const DepositToMmPage = props => {
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
  const [depositToMmAmount, setDepositToMmAmount] = useState(null)
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
    setDepositToMmAmount(e)
    setSelectedAmountMoney(e)
  }
  const handleSubmitDepositToMm = (e) => {
    console.log(e)
    setFormCollected(e)

    // L???y ph?? giao d???ch sau ???? show modal confirm
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
              name: 'T??i kho???n V??',
              value: selectedAccountWallets?.accountName,
            },
            {
              name: 'T??n t??i kho???n V??',
              value: entProfile?.businessName,
            },
            {
              name: 'S??? t??i kho???n nh???n',
              value: e.receiverAccount,
            },
            {
              name: 'T??n t??i kho???n nh???n',
              value: transactionUserMMInfo,
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
          TransferType: TRANSFER_TYPE.DEPOSIT_MM,
          Passport: formCollected?.receiverSSN,
          AccountName: selectedAccountWallets?.accountName,
          AccountFullName: entProfile?.businessName,
        },
      },
    }
    orderStore.createDepositMMExecution(payload)
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
    return () => {
      resetForm()
    }
  }, [])
  // endregion

  return (
    <>
      <Helmet>
        <title>N???p ti???n TK ti???n di ?????ng</title>
      </Helmet>
      <DepositToMmPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.DEPOSIT_TO_MM} />
        <WhiteRoundedBox>
          <TitleInfoService>Th??ng tin n???p ti???n TK ti???n di ?????ng</TitleInfoService>
          <Form
            size={'large'}
            onFinish={handleSubmitDepositToMm}
            form={formAmount}>
            <Row justify={'center'}>
              <Col xxl={12} xl={12} lg={18} md={20} sm={24} xs={24}>
                <AccountSelectBox />
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
                  <ReceiverName>{transactionUserMMInfo || 'T??n ng?????i nh???n'}</ReceiverName>
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
                    placeholder={'Nh???p n???i dung chuy???n ti???n'} />
                </Form.Item>
              </Col>
            </Row>
            <AreaCreateCommand>
              <Button
                disabled={!transactionUserMMInfo}
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
          title={'X??c nh???n n???p ti???n TK ti???n di ?????ng'}
          visible={visibleConfirm} />
      </DepositToMmPageWrapper>
    </>
  )
}

DepositToMmPage.propTypes = {}

export default inject(
  'paymentStore',
  'profileStore',
  'providerStore',
  'authenticationStore',
  'bankStore',
  'orderStore',
  'commonStore',
  'accountWalletStore')(observer(DepositToMmPage))