import React, { useEffect, useState } from 'react'
import { PostpaidPageWrapper } from './PostpaidPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  ERROR_COLOR,
  ERROR_TITLE, FEE_TYPE, PAGES,
  PARENT_PRODUCT_PAY_BILL,
  PAYMENT_TYPE, PAYTYPE, POSTPAID_PRODUCT_CODE,
  RESPONSE_CODE, ROLES, SUCCESS_COLOR, SUCCESS_TITLE, TEXT_403, WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import {
  BorderRoundedBox,
  ColorText,
  ColorTitleNoBg,
  TextInput,
  TextInputWrapper,
  PackInfoWrapper,
  PackItem,
  PackSubInfoWrapper, QuantityInput,
  RowCenterDiv,
  ScrollBarsWrapper,
  TitleBackgroundGray,
  WhiteRoundedBox, PaymentPeriodWrapper, ProviderItemWrapper, PrefixIconWrapper,
} from '../../components/CommonStyled/CommonStyled'
import { inject, observer } from 'mobx-react'
import { Button, Col, Descriptions, Form, InputNumber, notification, Row, Timeline } from 'antd'
import HorizontalScroll from 'react-horizontal-scrolling'
import { Scrollbars } from 'react-custom-scrollbars'
import PaymentMoneySource from '../../components/PaymentMoneySource/PaymentMoneySource'
import ICONS from '../../icons'
import EmptyProduct from '../../components/EmptyProduct'
import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import numberUtils from '../../utils/numberUtils'
import ConfirmInfoModal from '../../components/ConfirmInfoModal/ConfirmInfoModal'
import { Link, useHistory } from 'react-router-dom'
import { toJS } from 'mobx'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'

const PostpaidPage = props => {
  // region props, hook, state =================
  const {
    match,
    commonStore,
    saleStore,
    orderStore,
    paymentStore,
    bankStore,
    accountWalletStore,
    authenticationStore,
  } = props


  const [parentProduct, setParentProduct] = useState(null)
  const [productAccount, setProductAccount] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [payloadExecution, setPayloadExecution] = useState(null)

  const [radioPack, setRadioPack] = useState(null)
  const [checkPartnerDescription, setCheckPartnerDescription] = useState(null)

  const [validForm, setValidForm] = useState(false)
  const [inputAmount, setInputAmount] = useState(0)
  // endregion
  // region destructuring ======================
  const { roles } = authenticationStore
  const history = useHistory()
  const { ProductServiceID } = match.params
  const [formPayBill] = Form.useForm()
  const { appTheme, device } = commonStore
  const { editingExecution } = orderStore
  const { listLinkedBanks } = bankStore
  const { accountWallets } = accountWalletStore

  const {
    listSaleProduct,
    selectedSaleProduct,
    buyingSaleProduct,
    selectedPaymentObj,
    selectedPaymentType,
  } = saleStore

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const onChangeProductAccount = () => {

    saleStore.setBuyingSaleProduct(null)
    setPayloadExecution(null)
    setArrConfirmInfo([])
    setRadioPack(null)
    setCheckPartnerDescription(null)
    saleStore.setCheckedAccountInfo(null)
    saleStore.setSelectedSaleProduct(null)


    let newProductAccount = formPayBill.getFieldValue('productAccount')?.trim()
    const regex = /(0[0-9])+([0-9]{8,9})\b/g
    if (!newProductAccount) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui l??ng nh???p s??? ??i???n tho???i',
      })
      return
    }
    if (!regex.test(newProductAccount)) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng',
      })
      return
    }
    let payload = {
      Mobile: newProductAccount,
      ProductService: parentProduct?.ProductCode,
    }
    saleStore.checkTelCo(payload)
      .then(res => {
        if (res?.param?.PhoneType?.includes('PREPAID')) {
          notification.warning({
            message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
            description: 'Thu?? bao qu?? kh??ch l?? thu?? bao tr??? tr?????c. Vui l??ng nh???p s??? thu?? bao tr??? sau ????? th???c hi???n d???ch v???',
          })
        } else {
          let productCode = res?.param?.ProductCode
          if (productCode?.includes('POSTPAID')) {
            const newSelectedSaleProduct = listSaleProduct.find(x => x.productCode === productCode)
            if (newSelectedSaleProduct) {
              saleStore.setSelectedSaleProduct(newSelectedSaleProduct)
              saleStore.setBuyingSaleProduct(newSelectedSaleProduct)
              let payloadCheckAccount = {
                ProductAccount: newProductAccount,
                ProductID: newSelectedSaleProduct?.groupId,
                AppliedVersion: 1,
              }

              saleStore.partnerCheckAccount(payloadCheckAccount)
                .then(res => {
                  let amount = Number(res?.param?.amount)
                  switch (res?.responseCode) {
                    case RESPONSE_CODE.PAYMENT_AMOUNT_EXACTLY:    // responseCode == 1 // N??? c?????c thanh to??n ????ng s??? ti???n tr??? ra
                      formPayBill.setFieldsValue({
                        inputAmount: amount,
                      })
                      setInputAmount(amount)
                      setRadioPack({ ...res?.param, responseCode: res?.responseCode })
                      setCheckPartnerDescription(res?.description)
                      break
                    case RESPONSE_CODE.PAYMENT_AMOUNT_EDITABLE:   // responseCode == 2 // n??? c?????c cho phep s???a s??? ti???n thanh to??n
                    case RESPONSE_CODE.PAYMENT_AMOUNT_NOT_OWNED:  // responseCode == -100402 // Kh??ng ch??nh ch??? cho ph??p nh???p s??? ti???n c???n thanh to??n
                    case RESPONSE_CODE.PAYMENT_AMOUNT_UNKNOW:     // responseCode == 3 // Kh??ng tra ???????c th??ng tin n??? c?????c, v???n mu???n thanh to??n
                      formPayBill.setFieldsValue({
                        inputAmount: amount > 0 ? amount : 5000,
                      })
                      setInputAmount(amount > 0 ? amount : 5000)
                      setRadioPack({ ...res?.param, responseCode: res?.responseCode })
                      setCheckPartnerDescription(res?.description)
                      break
                    case -100001:
                      notification.error({
                        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
                        description: res?.description,
                      })
                      break
                    default:
                      break
                  }

                })
            } else {
              notification.error({
                message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
                description: 'S??? ??i???n tho???i t???i nh?? cung c???p d???ch v??? ??ang b??? kh??a ho???c kh??ng h??? tr???',
              })
            }
          } else {

          }

        }
      })

    setProductAccount(newProductAccount)
  }
  const onClickCreateOrder = () => {
    let fund = ''
    let payType = null
    switch (selectedPaymentType) {
      case PAYMENT_TYPE.WALLET:
        let firstChar = selectedPaymentObj?.accountName?.slice(0, 1)
        fund = firstChar?.toLowerCase() === 'e' ? selectedPaymentObj?.accountName?.slice(1) : selectedPaymentObj?.accountName
        payType = PAYTYPE.PAYMENT_WALLET
        break
      case PAYMENT_TYPE.LINKED_BANK:
        fund = `${selectedPaymentObj?.bankName} | ${selectedPaymentObj?.bankAccount}`
        payType = PAYTYPE.PAYMENT_LINKED_BANK
        break
      case PAYMENT_TYPE.NAPAS:
        fund = `${selectedPaymentObj?.bankName}`
        break
      default:
        break
    }

    let payloadGetInfoBuyProduct = {
      ProductID: buyingSaleProduct?.childs[0]?.ProductID,
      ProductAccount: productAccount,
      Quantity: 1,
      ParValue: Number(inputAmount),
      AppliedVersion: 1,
      AccountType: 0,
      BillInfo: radioPack?.id || null,
    }
    saleStore.getInfoBuyProduct(payloadGetInfoBuyProduct)
      .then(res => {
        console.log(res)
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          const { param } = res
          const product = param?.productData?.productDiscount
          const productDiscount = product.find(x => x.policyType === 1)

          let payload = {
            ExecutionData: {
              PaymentInfo: {
                Provider: '',
                ProductTypeName: param?.productData?.parentName, // T??n lo???i s???n ph???m
                ProductName: param?.productData?.productName, // T??n s???n ph???m
                Fund: fund, // Ngu???n ti???n
                CustomerName: '',
                CustomerAddress: '',
                ProductFee: param?.productData?.fee, // Ph?? b??n h??ng
                Discount: param?.productData?.discount > 0 ? `${numberUtils.thousandSeparator(param?.productData?.discount) + '?? '}` + `(${productDiscount?.rateAmount > 0 ? productDiscount?.rateAmount + '%' : ''}${(productDiscount?.rateAmount > 0 && productDiscount?.fixAmount > 0) ? ' + ' : ''}${productDiscount?.fixAmount > 0 ? numberUtils.thousandSeparator(productDiscount?.fixAmount) + '??' : ''})` : '',
                TransferFee: param?.paymentFee, // Ph?? giao d???ch
                TotalAmount: param?.productData?.priceAmount, // Gi?? sau khi t??nh ph??, chi???t kh???u
                OriginalAmount: param?.productData?.productValue, // Gi?? g???c
                TotalAmountToPaid: param?.productData?.priceAmount + param?.paymentFee, // priceAmount + paymentFee
                PeriodPayment: radioPack?.dataInfo?.map(x => x.period + ' ')?.toString(), // K??? thanh to??n
                ProductID: buyingSaleProduct?.childs[0]?.ProductID,
                ProductCode: buyingSaleProduct?.childs[0]?.ProductCode,
                ProductAccount: productAccount, // Thu?? bao ho???c s??? h??a ????n
                Quantity: null, //s??? l?????ng (truy???n n???u mua sp c?? s??? l?????ng. VD: m?? th???)
                ParValue: inputAmount, // s??? ti???n thanh to??n (tr?????ng h???p tr??? sau)
                AccountType: null, //lo???i s??? d?? TK (n???u MM truy???n 2, # ho???c ko truy???n th?? l?? v??)
                PaymentType: selectedPaymentType,
                BankAccountID: selectedPaymentObj?.bankAccountID,
                BankCode: selectedPaymentObj?.bankCode,
                EditPathUrl: window.location.pathname,
                AccountName: selectedPaymentObj?.accountName,
                BillInfo: radioPack?.id,
                RateAmount: productDiscount?.rateAmount,
                FixAmount: productDiscount?.fixAmount,
              },
            },
          }
          setPayloadExecution(payload)
          let infos = [
            {
              name: 'Ngu???n ti???n',
              value: fund,
            },
            {
              name: 'D???ch v???',
              value: param?.productData?.parentName,
            },
            {
              name: 'S???n ph???m',
              value: param?.productData?.productName,
            },
            {
              name: 'S??? ??i???n tho???i',
              value: productAccount,
            },
            {
              name: 'C?????c thanh to??n',
              value: numberUtils.thousandSeparator(Number(inputAmount)) + '??',
            },
          ]
          if (param?.productData?.fee > 0) {
            infos.push({
              name: 'Ph?? b??n h??ng',
              value: `${numberUtils.thousandSeparator(param?.productData?.fee)}??`,
            })
          }
          if ((productDiscount?.rateAmount > 0) || (productDiscount?.fixAmount > 0)) {
            infos.push({
              name: 'Chi???t kh???u',
              value: param?.productData?.discount > 0 ? `${numberUtils.thousandSeparator(param?.productData?.discount) + '?? '}` + `(${productDiscount?.rateAmount > 0 ? productDiscount?.rateAmount + '%' : ''}${(productDiscount?.rateAmount > 0 && productDiscount?.fixAmount > 0) ? ' + ' : ''}${productDiscount?.fixAmount > 0 ? numberUtils.thousandSeparator(productDiscount?.fixAmount) + '??' : ''})` : '',
            })
          }
          infos.push(
            {
              name: 'Gi?? b??n',
              value: numberUtils.thousandSeparator(param?.productData?.priceAmount) + '??',
            },
            {
              name: 'Ph?? giao d???ch',
              value: param?.paymentFee > 0 ? numberUtils.thousandSeparator(param?.paymentFee) + '??' : 'Mi???n ph??',
            },
            {
              name: 'Th??nh ti???n',
              value: numberUtils.thousandSeparator(param?.productData?.priceAmount + param?.paymentFee) + '??',
            },
          )
          setArrConfirmInfo(infos)
          setVisibleConfirm(true)
        }
      })
  }
  const handleConfirm = () => {
    if (editingExecution) {
      // C???p nh???t y??u c???u
      let payloadEdit = { ExecutionID: editingExecution?.executionID, ...payloadExecution }
      orderStore.updatePaymentOrder(payloadEdit)
        .then(res => {
          if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
            notification.success({
              message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
              description: res?.description,
            })
            setVisibleConfirm(false)
            resetForm()
            orderStore.resetEditingExecution()
            saleStore.setBuyingSaleProduct(null)
            history.push(PAGES.TRANSACTION_MANAGE.PATH)
          }
        })
    } else {
      // T???o y??u c???u
      orderStore.createPaymentOrder(payloadExecution)
        .then(res => {
          if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
            notification.success({
              message: <ColorText fontSize={'20px'} color={SUCCESS_COLOR}>{SUCCESS_TITLE}</ColorText>,
              description: res?.description,
            })
            setVisibleConfirm(false)
            saleStore.setBuyingSaleProduct(null)
            resetForm()
          }
        })
    }
  }
  const handleCancelConfirm = () => {
    setVisibleConfirm(false)
    setPayloadExecution(null)
  }
  const handleChangeInputAmount = (e) => {
    setInputAmount(e)
  }

  const resetForm = () => {
    setPayloadExecution(null)
    setProductAccount(null)
    setArrConfirmInfo([])
    formPayBill.resetFields()
    setRadioPack(null)
    setCheckPartnerDescription(null)
    saleStore.setCheckedAccountInfo(null)
    saleStore.resetSelectedSaleProduct()
  }
  // endregion
  // region function render ====================
  const renderProviderName = (productCode) => {
    switch (productCode) {
      case POSTPAID_PRODUCT_CODE.MOBI:
        return 'Mobifone'
      case POSTPAID_PRODUCT_CODE.VINA:
        return 'Vinapohone'
      case POSTPAID_PRODUCT_CODE.VTEL:
        return 'Viettel'
      case POSTPAID_PRODUCT_CODE.VNM:
        return 'Vietnammobile'
      case POSTPAID_PRODUCT_CODE.GTEL:
        return 'Gmobile'
      default:
        return
    }
  }
  // endregion
  // region side effect ========================
  useEffect(() => {
    resetForm()
    saleStore.setBuyingSaleProduct(null)
    saleStore.setListSaleProduct(null)
    saleStore.getSaleProducts({ ProductServiceID: Number(ProductServiceID) })
  }, [ProductServiceID])
  useEffect(() => {
    if (!ProductServiceID) return
    saleStore.getProductDetail({ ProductID: ProductServiceID })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          setParentProduct(res?.param)
        }
      })
  }, [ProductServiceID])
  useEffect(() => {
    if (selectedPaymentObj && radioPack && inputAmount > 0) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  }, [selectedPaymentObj, radioPack, inputAmount])


  useEffect(() => {
    if (!editingExecution) return
    if (!listLinkedBanks) return
    let paymentTypeSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.PaymentType
    let accountNameSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.AccountName
    let bankAccountIDSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.BankAccountID

    switch (paymentTypeSaved) {
      case PAYMENT_TYPE.WALLET:
        let selectedWallet = accountWallets.find(x => x.accountName === accountNameSaved)
        saleStore.setSelectedPaymentMethod(selectedWallet, paymentTypeSaved)
        break
      case PAYMENT_TYPE.LINKED_BANK:
        let selectedLinkedBank = listLinkedBanks.find(x => x.bankAccountID === bankAccountIDSaved)
        saleStore.setSelectedPaymentMethod(selectedLinkedBank, paymentTypeSaved)
        break
    }
  }, [editingExecution, listLinkedBanks])
  useEffect(() => {
    if (!editingExecution) return
    if (!listSaleProduct) return
    let productAccountSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductAccount
    let parValueSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ParValue
    formPayBill.setFieldsValue({
      productAccount: productAccountSaved,
    })
    setProductAccount(productAccountSaved)

    let payload = {
      Mobile: productAccountSaved,
      ProductService: parentProduct?.ProductCode,
    }
    saleStore.checkTelCo(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          if (res?.param?.PhoneType?.includes('PREPAID')) {
            notification.warning({
              message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
              description: 'Thu?? bao qu?? kh??ch l?? thu?? bao tr??? tr?????c. Vui l??ng nh???p s??? thu?? bao tr??? sau ????? th???c hi???n d???ch v???',
            })
          } else {
            let productCode = res?.param?.ProductCode
            if (productCode?.includes('POSTPAID')) {
              const newSelectedSaleProduct = listSaleProduct.find(x => x.productCode === productCode)
              if (newSelectedSaleProduct) {
                saleStore.setSelectedSaleProduct(newSelectedSaleProduct)
                saleStore.setBuyingSaleProduct(newSelectedSaleProduct)
                let payloadCheckAccount = {
                  ProductAccount: productAccountSaved,
                  ProductID: newSelectedSaleProduct?.groupId,
                  AppliedVersion: 1,
                }

                saleStore.partnerCheckAccount(payloadCheckAccount)
                  .then(res => {
                    switch (res?.responseCode) {
                      case 1:                      // responseCode == 1 // N??? c?????c thanh to??n ????ng s??? ti???n tr??? ra
                      case 2:                      // responseCode == 2 // n??? c?????c cho phep s???a s??? ti???n thanh to??n
                      case -100402:                // responseCode == -100402 // Kh??ng ch??nh ch??? cho ph??p nh???p s??? ti???n c???n thanh to??n
                      case 3:                      // responseCode == 3 // Kh??ng tra ???????c th??ng tin n??? c?????c, v???n mu???n thanh to??n
                        formPayBill.setFieldsValue({
                          inputAmount: Number(parValueSaved),
                        })
                        setInputAmount(parValueSaved)
                        setRadioPack({ ...res?.param, responseCode: res?.responseCode })
                        setCheckPartnerDescription(res?.description)
                        break
                      case -100001:
                        notification.error({
                          message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
                          description: res?.description,
                        })
                        break
                      default:
                        break
                    }
                  })
              }
            } else {
              notification.warning({
                message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
                description: 'Thu?? bao qu?? kh??ch l?? thu?? bao tr??? tr?????c. Vui l??ng nh???p s??? thu?? bao tr??? sau ????? th???c hi???n d???ch v???',
              })
            }
          }
        }
      })

  }, [editingExecution, listSaleProduct])

  useEffect(() => {
    return () => {
      resetForm()
      orderStore.resetEditingExecution()
      saleStore.setBuyingSaleProduct(null)
      saleStore.setListSaleProduct(null)
      saleStore.resetSelectedSaleProduct()
    }
  }, [])
  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.INITPAYMENT)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  // endregion

  return (
    <>
      <Helmet>
        <title>{parentProduct?.ProductName}</title>
      </Helmet>
      <PostpaidPageWrapper>
        <MainBreadCrumb breadcrumbData={
          [
            { ID: 28, LABEL: 'Trang ch???', PATH: PAGES.HOME.PATH },
            { ID: 29, LABEL: `${editingExecution ? `S???a y??u c???u ` : ''}${parentProduct?.ProductName}`, PATH: null },
          ]
        } />
        <WhiteRoundedBox>
          <TitleBackgroundGray>
            Th??ng tin d???ch v???
          </TitleBackgroundGray>
          <Form
            form={formPayBill}
            style={{ width: '100%' }}
          >
            <Row justify={'center'}>
              <Col xxl={16} xl={18} lg={24} md={24} sm={24} xs={24}>
                <BorderRoundedBox>
                  <TextInputWrapper>
                    <Form.Item
                      name={'productAccount'}
                      noStyle>
                      <TextInput
                        value={productAccount}
                        prefix={
                          <PrefixIconWrapper>
                            {
                              selectedSaleProduct
                                ?
                                <img src={selectedSaleProduct?.logo} alt={''} />
                                :
                                <img src={ICONS.DEFAULT_TELCO} alt={''} />
                            }

                          </PrefixIconWrapper>
                        }
                        maxLength={11}
                        showCount
                        placeholder='Nh???p s??? ??i???n tho???i'
                        style={{ marginBottom: 16 }} />
                    </Form.Item>
                    <img src={ICONS.CUSTOMER_SEARCH} alt={''} onClick={onChangeProductAccount} />
                  </TextInputWrapper>
                  {
                    listSaleProduct &&
                    <HorizontalScroll>
                      {
                        listSaleProduct.map(item =>
                          <ProviderItemWrapper
                            key={item?.productCode}
                            active={selectedSaleProduct?.productCode === item?.productCode}
                            appTheme={appTheme}>
                            <img src={item?.logo} alt={''} />
                          </ProviderItemWrapper>,
                        )
                      }
                    </HorizontalScroll>
                  }
                </BorderRoundedBox>
                <BorderRoundedBox margin={'16px 0 0 0'}>
                  {
                    radioPack ?
                      <>
                        <Descriptions bordered column={1}>
                          {
                            radioPack?.responseCode !== RESPONSE_CODE.PAYMENT_AMOUNT_UNKNOW
                              ?
                              <>
                                <Descriptions.Item label={'Nh?? cung c???p'} labelStyle={{ width: '30%' }}>
                                  {renderProviderName(selectedSaleProduct?.childs[0]?.ProductCode) || 'Kh??ng c?? th??ng tin'}
                                </Descriptions.Item>
                                {
                                  radioPack?.customerInfo?.customerName &&
                                  <Descriptions.Item label={'T??n kh??ch h??ng'} labelStyle={{ width: '30%' }}>
                                    {radioPack?.customerInfo?.customerName}
                                  </Descriptions.Item>
                                }
                                {
                                  radioPack?.dataInfo?.length > 0 &&
                                  <Descriptions.Item label={'K??? thanh to??n'} labelStyle={{ width: '30%' }}>
                                    <PaymentPeriodWrapper>
                                      <Timeline>
                                        <Timeline>
                                          {
                                            radioPack?.dataInfo?.length > 0 && radioPack?.dataInfo.map((item, index) =>
                                              <Timeline.Item key={index}>
                                                <ColorText
                                                  color={appTheme.solidColor}>{item?.period}</ColorText>: {numberUtils.thousandSeparator(item?.amount)}??
                                              </Timeline.Item>,
                                            )
                                          }
                                        </Timeline>
                                      </Timeline>
                                    </PaymentPeriodWrapper>
                                  </Descriptions.Item>
                                }
                                <Descriptions.Item label={'S??? d?? n??? c?????c'} labelStyle={{ width: '30%' }}>
                                  {
                                    Number(radioPack?.amount) > 0
                                      ? numberUtils.thousandSeparator(Number(radioPack?.amount)) + '??'
                                      : radioPack?.responseCode !== RESPONSE_CODE.PAYMENT_AMOUNT_EXACTLY
                                        ? numberUtils.thousandSeparator(Number(radioPack?.amount)) + '??'
                                        : <ColorText color={'red'}>{checkPartnerDescription}</ColorText>
                                  }
                                </Descriptions.Item>
                              </>
                              :
                              <Descriptions.Item label={'Thanh to??n'} labelStyle={{ width: '30%' }}>
                                {checkPartnerDescription}
                              </Descriptions.Item>
                          }

                        </Descriptions>
                        {
                          (radioPack?.responseCode === RESPONSE_CODE.PAYMENT_AMOUNT_EDITABLE
                            || radioPack?.responseCode === RESPONSE_CODE.PAYMENT_AMOUNT_NOT_OWNED
                            || radioPack?.responseCode === RESPONSE_CODE.PAYMENT_AMOUNT_UNKNOW) &&
                          <Form.Item
                            name={'inputAmount'}
                            noStyle
                            rules={[
                              { required: true, message: 'Vui l??ng nh???p s??? ti???n' },
                            ]}>
                            <QuantityInput
                              style={{
                                width: '100%',
                                marginTop: 16,
                              }}
                              size={'large'}
                              // disabled={radioPack?.responseCode === 1}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                              parser={(value) => value.replace(/\$\s?|(\.*)/g, '')}
                              placeholder={'Nh???p s??? ti???n'}
                              maxLength={19}
                              min={5000}
                              step={1000}
                              onChange={handleChangeInputAmount}
                            />
                          </Form.Item>
                        }
                      </>
                      :
                      <EmptyProduct description={'Vui l??ng nh???p s??? ??i???n tho???i'} />
                  }


                </BorderRoundedBox>

              </Col>
            </Row>
          </Form>

          <PaymentMoneySource />
          <RowCenterDiv margin={'16px 0 0 0'}>
            <Button
              onClick={onClickCreateOrder}
              disabled={!validForm}
              type={'primary'}
              style={{ padding: '0 40px' }}
            >
              {editingExecution ? 'C???p nh???t' : 'T???o y??u c???u'}
            </Button>
          </RowCenterDiv>

        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={handleCancelConfirm}
          title={editingExecution ? `X??c nh???n s???a y??u c???u ${parentProduct?.ProductName}` : `X??c nh???n ${parentProduct?.ProductName}`}
          visible={visibleConfirm} />
      </PostpaidPageWrapper>
    </>

  )
}

PostpaidPage.propTypes = {}

export default inject(
  'commonStore',
  'saleStore',
  'orderStore',
  'paymentStore',
  'bankStore',
  'accountWalletStore',
  'authenticationStore')(observer(PostpaidPage))
