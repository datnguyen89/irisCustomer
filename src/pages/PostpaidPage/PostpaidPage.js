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
        description: 'Vui lòng nhập số điện thoại',
      })
      return
    }
    if (!regex.test(newProductAccount)) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Số điện thoại không đúng định dạng',
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
            description: 'Thuê bao quý khách là thuê bao trả trước. Vui lòng nhập số thuê bao trả sau để thực hiện dịch vụ',
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
                    case RESPONSE_CODE.PAYMENT_AMOUNT_EXACTLY:    // responseCode == 1 // Nợ cước thanh toán đúng số tiền trả ra
                      formPayBill.setFieldsValue({
                        inputAmount: amount,
                      })
                      setInputAmount(amount)
                      setRadioPack({ ...res?.param, responseCode: res?.responseCode })
                      setCheckPartnerDescription(res?.description)
                      break
                    case RESPONSE_CODE.PAYMENT_AMOUNT_EDITABLE:   // responseCode == 2 // nợ cước cho phep sửa số tiền thanh toán
                    case RESPONSE_CODE.PAYMENT_AMOUNT_NOT_OWNED:  // responseCode == -100402 // Không chính chủ cho phép nhập số tiền cần thanh toán
                    case RESPONSE_CODE.PAYMENT_AMOUNT_UNKNOW:     // responseCode == 3 // Không tra được thông tin nợ cước, vẫn muốn thanh toán
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
                description: 'Số điện thoại tại nhà cung cấp dịch vụ đang bị khóa hoặc không hỗ trợ',
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
                ProductTypeName: param?.productData?.parentName, // Tên loại sản phẩm
                ProductName: param?.productData?.productName, // Tên sản phẩm
                Fund: fund, // Nguồn tiền
                CustomerName: '',
                CustomerAddress: '',
                ProductFee: param?.productData?.fee, // Phí bán hàng
                Discount: param?.productData?.discount > 0 ? `${numberUtils.thousandSeparator(param?.productData?.discount) + 'đ '}` + `(${productDiscount?.rateAmount > 0 ? productDiscount?.rateAmount + '%' : ''}${(productDiscount?.rateAmount > 0 && productDiscount?.fixAmount > 0) ? ' + ' : ''}${productDiscount?.fixAmount > 0 ? numberUtils.thousandSeparator(productDiscount?.fixAmount) + 'đ' : ''})` : '',
                TransferFee: param?.paymentFee, // Phí giao dịch
                TotalAmount: param?.productData?.priceAmount, // Giá sau khi tính phí, chiết khấu
                OriginalAmount: param?.productData?.productValue, // Giá gốc
                TotalAmountToPaid: param?.productData?.priceAmount + param?.paymentFee, // priceAmount + paymentFee
                PeriodPayment: radioPack?.dataInfo?.map(x => x.period + ' ')?.toString(), // Kỳ thanh toán
                ProductID: buyingSaleProduct?.childs[0]?.ProductID,
                ProductCode: buyingSaleProduct?.childs[0]?.ProductCode,
                ProductAccount: productAccount, // Thuê bao hoặc số hóa đơn
                Quantity: null, //số lượng (truyền nếu mua sp có số lượng. VD: mã thẻ)
                ParValue: inputAmount, // số tiền thanh toán (trường hợp trả sau)
                AccountType: null, //loại số dư TK (nếu MM truyền 2, # hoặc ko truyền thì là ví)
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
              name: 'Nguồn tiền',
              value: fund,
            },
            {
              name: 'Dịch vụ',
              value: param?.productData?.parentName,
            },
            {
              name: 'Sản phẩm',
              value: param?.productData?.productName,
            },
            {
              name: 'Số điện thoại',
              value: productAccount,
            },
            {
              name: 'Cước thanh toán',
              value: numberUtils.thousandSeparator(Number(inputAmount)) + 'đ',
            },
          ]
          if (param?.productData?.fee > 0) {
            infos.push({
              name: 'Phí bán hàng',
              value: `${numberUtils.thousandSeparator(param?.productData?.fee)}đ`,
            })
          }
          if ((productDiscount?.rateAmount > 0) || (productDiscount?.fixAmount > 0)) {
            infos.push({
              name: 'Chiết khấu',
              value: param?.productData?.discount > 0 ? `${numberUtils.thousandSeparator(param?.productData?.discount) + 'đ '}` + `(${productDiscount?.rateAmount > 0 ? productDiscount?.rateAmount + '%' : ''}${(productDiscount?.rateAmount > 0 && productDiscount?.fixAmount > 0) ? ' + ' : ''}${productDiscount?.fixAmount > 0 ? numberUtils.thousandSeparator(productDiscount?.fixAmount) + 'đ' : ''})` : '',
            })
          }
          infos.push(
            {
              name: 'Giá bán',
              value: numberUtils.thousandSeparator(param?.productData?.priceAmount) + 'đ',
            },
            {
              name: 'Phí giao dịch',
              value: param?.paymentFee > 0 ? numberUtils.thousandSeparator(param?.paymentFee) + 'đ' : 'Miễn phí',
            },
            {
              name: 'Thành tiền',
              value: numberUtils.thousandSeparator(param?.productData?.priceAmount + param?.paymentFee) + 'đ',
            },
          )
          setArrConfirmInfo(infos)
          setVisibleConfirm(true)
        }
      })
  }
  const handleConfirm = () => {
    if (editingExecution) {
      // Cập nhật yêu cầu
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
      // Tạo yêu cầu
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
              description: 'Thuê bao quý khách là thuê bao trả trước. Vui lòng nhập số thuê bao trả sau để thực hiện dịch vụ',
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
                      case 1:                      // responseCode == 1 // Nợ cước thanh toán đúng số tiền trả ra
                      case 2:                      // responseCode == 2 // nợ cước cho phep sửa số tiền thanh toán
                      case -100402:                // responseCode == -100402 // Không chính chủ cho phép nhập số tiền cần thanh toán
                      case 3:                      // responseCode == 3 // Không tra được thông tin nợ cước, vẫn muốn thanh toán
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
                description: 'Thuê bao quý khách là thuê bao trả trước. Vui lòng nhập số thuê bao trả sau để thực hiện dịch vụ',
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
            { ID: 28, LABEL: 'Trang chủ', PATH: PAGES.HOME.PATH },
            { ID: 29, LABEL: `${editingExecution ? `Sửa yêu cầu ` : ''}${parentProduct?.ProductName}`, PATH: null },
          ]
        } />
        <WhiteRoundedBox>
          <TitleBackgroundGray>
            Thông tin dịch vụ
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
                        placeholder='Nhập số điện thoại'
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
                                <Descriptions.Item label={'Nhà cung cấp'} labelStyle={{ width: '30%' }}>
                                  {renderProviderName(selectedSaleProduct?.childs[0]?.ProductCode) || 'Không có thông tin'}
                                </Descriptions.Item>
                                {
                                  radioPack?.customerInfo?.customerName &&
                                  <Descriptions.Item label={'Tên khách hàng'} labelStyle={{ width: '30%' }}>
                                    {radioPack?.customerInfo?.customerName}
                                  </Descriptions.Item>
                                }
                                {
                                  radioPack?.dataInfo?.length > 0 &&
                                  <Descriptions.Item label={'Kỳ thanh toán'} labelStyle={{ width: '30%' }}>
                                    <PaymentPeriodWrapper>
                                      <Timeline>
                                        <Timeline>
                                          {
                                            radioPack?.dataInfo?.length > 0 && radioPack?.dataInfo.map((item, index) =>
                                              <Timeline.Item key={index}>
                                                <ColorText
                                                  color={appTheme.solidColor}>{item?.period}</ColorText>: {numberUtils.thousandSeparator(item?.amount)}đ
                                              </Timeline.Item>,
                                            )
                                          }
                                        </Timeline>
                                      </Timeline>
                                    </PaymentPeriodWrapper>
                                  </Descriptions.Item>
                                }
                                <Descriptions.Item label={'Số dư nợ cước'} labelStyle={{ width: '30%' }}>
                                  {
                                    Number(radioPack?.amount) > 0
                                      ? numberUtils.thousandSeparator(Number(radioPack?.amount)) + 'đ'
                                      : radioPack?.responseCode !== RESPONSE_CODE.PAYMENT_AMOUNT_EXACTLY
                                        ? numberUtils.thousandSeparator(Number(radioPack?.amount)) + 'đ'
                                        : <ColorText color={'red'}>{checkPartnerDescription}</ColorText>
                                  }
                                </Descriptions.Item>
                              </>
                              :
                              <Descriptions.Item label={'Thanh toán'} labelStyle={{ width: '30%' }}>
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
                              { required: true, message: 'Vui lòng nhập số tiền' },
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
                              placeholder={'Nhập số tiền'}
                              maxLength={19}
                              min={5000}
                              step={1000}
                              onChange={handleChangeInputAmount}
                            />
                          </Form.Item>
                        }
                      </>
                      :
                      <EmptyProduct description={'Vui lòng nhập số điện thoại'} />
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
              {editingExecution ? 'Cập nhật' : 'Tạo yêu cầu'}
            </Button>
          </RowCenterDiv>

        </WhiteRoundedBox>
        <ConfirmInfoModal
          onSuccess={handleConfirm}
          arrConfirmInfo={arrConfirmInfo}
          onClose={handleCancelConfirm}
          title={editingExecution ? `Xác nhận sửa yêu cầu ${parentProduct?.ProductName}` : `Xác nhận ${parentProduct?.ProductName}`}
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
