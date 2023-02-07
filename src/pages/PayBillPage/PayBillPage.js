import React, { useEffect, useState } from 'react'
import { PayBillPageWrapper } from './PayBillPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA, DEVICE, ERROR_COLOR, ERROR_TITLE, FEE_TYPE, INFO_COLOR, INFO_TITLE,
  PAGES,
  PARENT_PRODUCT_PAY_BILL, PAYMENT_TYPE, PAYTYPE,
  RESPONSE_CODE, ROLES,
  SUCCESS_COLOR,
  SUCCESS_TITLE, TEXT_403, WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import {
  BorderRoundedBox, ColorText, EllipsisText,
  PaymentPeriodWrapper, PaymentTag, ProviderIconWrapper, ProviderInfoWrapper, ProviderItem, ProviderSearchInput,
  QuantityInput, RowAlignCenterDiv,
  RowCenterDiv, RowFlexEndDiv, ScrollBarsWrapper,
  TextInput,
  TextInputWrapper,
  TitleBackgroundGray,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'
import { inject, observer } from 'mobx-react'
import { Button, Col, Descriptions, Empty, Form, notification, Radio, Row, Timeline, Tooltip } from 'antd'
import ICONS from '../../icons'
import PaymentMoneySource from '../../components/PaymentMoneySource/PaymentMoneySource'
import HorizontalScroll from 'react-horizontal-scrolling'
import { Scrollbars } from 'react-custom-scrollbars'
import { toJS } from 'mobx'
import EmptyProduct from '../../components/EmptyProduct'
import ConfirmInfoModal from '../../components/ConfirmInfoModal/ConfirmInfoModal'
import numberUtils from '../../utils/numberUtils'
import stringUtils from '../../utils/stringUtils'
import { Link, useHistory } from 'react-router-dom'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'
import { WarningOutlined } from '@ant-design/icons'

const PayBillPage = props => {
  // region props, hook, state =================
  const {
    match,
    commonStore,
    saleStore,
    orderStore,
    paymentStore,
    accountWalletStore,
    bankStore,
    authenticationStore,
  } = props

  const [parentProduct, setParentProduct] = useState(null)
  const [keywordSearchProvider, setKeywordSearchProvider] = useState(null)
  const [selectedTag, setSelectedTag] = useState(null)

  const [productAccount, setProductAccount] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [payloadExecution, setPayloadExecution] = useState(null)

  const [radioPack, setRadioPack] = useState(null)
  const [showRadioPack, setShowRadioPack] = useState(false)
  const [showPeriod, setShowPeriod] = useState(true)
  const [showInputAmount, setShowInputAmount] = useState(false)
  const [checkPartnerDescription, setCheckPartnerDescription] = useState(null)

  const [validForm, setValidForm] = useState(false)
  // endregion
  // region destructuring ======================
  const history = useHistory()
  const { ProductServiceID } = match.params

  const { accountWallets } = accountWalletStore
  const { listLinkedBanks } = bankStore
  const { roles } = authenticationStore

  const [formPayBill] = Form.useForm()
  const { appTheme, device } = commonStore
  const { editingExecution } = orderStore
  const {
    listSaleProduct,
    selectedSaleProduct,
    buyingSaleProduct,
    selectedPaymentObj,
    selectedPaymentType,
    checkedAccountInfo,
  } = saleStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const onSearchProvider = (keyword) => {
    setKeywordSearchProvider(keyword)
  }
  const handleClickTag = (tag) => {
    setSelectedTag(tag)
  }
  const handleClickChosenProvider = (product) => {
    saleStore.setBuyingSaleProduct(product)
    if (buyingSaleProduct?.productCode === product?.productCode) return
    setPayloadExecution(null)
    setArrConfirmInfo([])
    saleStore.setCheckedAccountInfo(null)
    setRadioPack(null)
    setCheckPartnerDescription(null)
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

  const resetForm = () => {
    setPayloadExecution(null)
    setProductAccount(null)
    setArrConfirmInfo([])
    setShowRadioPack(false)
    formPayBill.resetFields()
    saleStore.setCheckedAccountInfo(null)
    saleStore.resetSelectedSaleProduct()
    setRadioPack(null)
    setCheckPartnerDescription(null)
    setKeywordSearchProvider(null)
  }

  const onChangeProductAccount = () => {
    setRadioPack(null)
    setShowRadioPack(false)
    setShowInputAmount(false)
    setCheckPartnerDescription(null)
    saleStore.setCheckedAccountInfo(null)

    let newProductAccount = formPayBill.getFieldValue('productAccount')?.trim()
    if (buyingSaleProduct) {
      if (newProductAccount?.trim()?.length > 0) {
        let payload = {
          ProductAccount: newProductAccount,
          ProductID: buyingSaleProduct?.childs[0]?.ProductID,
          AppliedVersion: 1,
        }
        saleStore.partnerCheckAccount(payload)
          .then(res => {

            let param = res?.param
            const amount = param?.amount
            if (param?.billType?.includes('PREBILL')) {

              if (param?.dataInfo?.length > 0) {
                if (amount == 0 && param.dataInfo.length == 1) {
                  // Trường hợp nhập số tiền nạp dịch vụ trả trước
                  setRadioPack(res?.param)
                  setShowInputAmount(true)
                  setShowPeriod(false)
                  setCheckPartnerDescription(res?.description)
                } else {
                  // K+ và các trường hợp phải chọn gói
                  setShowRadioPack(true)
                  setShowPeriod(true)
                }
              } else {
                setCheckPartnerDescription(res?.description)
                setShowPeriod(true)
              }
            } else {
              if (res?.param?.amount == 0) {
                setShowPeriod(false)
              }
              setRadioPack(res?.param)
              setCheckPartnerDescription(res?.description)
            }
          })
      } else {
        notification.error({
          message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
          description: 'Vui lòng nhập mã khách hàng',
        })
      }
    } else {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui lòng chọn nhà cung cấp',
      })
    }
    setProductAccount(newProductAccount)
  }

  const onChangeRadioPack = (pack) => {
    setRadioPack(pack)
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
      ParValue: radioPack?.amount,
      AppliedVersion: 1,
      AccountType: 0,
      BillInfo: showInputAmount ? radioPack?.dataInfo[0]?.id : radioPack?.id,
    }
    saleStore.getInfoBuyProduct(payloadGetInfoBuyProduct)
      .then(res => {
        console.log('radioPack', toJS(radioPack))
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          const { param } = res
          const product = param?.productData?.productDiscount
          const productDiscount = product.find(x => x.policyType === 1)

          let payload = {
            ExecutionData: {
              PaymentInfo: {
                Provider: param?.productData?.productName,
                ProductTypeName: param?.productData?.parentName, // Tên loại sản phẩm
                ProductName: param?.productData?.productName, // Tên sản phẩm
                Fund: fund, // Nguồn tiền
                CustomerName: checkedAccountInfo?.customerInfo?.customerName,
                CustomerAddress: checkedAccountInfo?.customerInfo?.address,
                ProductFee: param?.productData?.fee, // Phí bán hàng
                Discount: param?.productData?.discount > 0 ? `${numberUtils.thousandSeparator(param?.productData?.discount) + 'đ '}` + `(${productDiscount?.rateAmount > 0 ? productDiscount?.rateAmount + '%' : ''}${(productDiscount?.rateAmount > 0 && productDiscount?.fixAmount > 0) ? ' + ' : ''}${productDiscount?.fixAmount > 0 ? numberUtils.thousandSeparator(productDiscount?.fixAmount) + 'đ' : ''})` : '',
                TransferFee: param?.paymentFee, // Phí giao dịch
                TotalAmount: param?.productData?.priceAmount, // Giá sau khi tính phí, chiết khấu
                OriginalAmount: param?.productData?.parValue, // Giá gốc
                TotalAmountToPaid: param?.productData?.priceAmount + param?.paymentFee, // priceAmount + paymentFee
                PeriodPayment: radioPack?.dataInfo?.map(x => x.period + ' ')?.toString(), // Kỳ thanh toán
                ProductID: buyingSaleProduct?.childs[0]?.ProductID,
                ProductCode: buyingSaleProduct?.childs[0]?.ProductCode,
                ProductAccount: productAccount, // Thuê bao hoặc số hóa đơn
                Quantity: null, //số lượng (truyền nếu mua sp có số lượng. VD: mã thẻ)
                ParValue: showInputAmount ? Number(param?.productData?.parValue) : null, // số tiền thanh toán (trường hợp trả sau)
                AccountType: null, //loại số dư TK (nếu MM truyền 2, # hoặc ko truyền thì là ví)
                PaymentType: selectedPaymentType,
                BankAccountID: selectedPaymentObj?.bankAccountID,
                BankCode: selectedPaymentObj?.bankCode,
                EditPathUrl: window.location.pathname,
                AccountName: selectedPaymentObj?.accountName,
                BillInfo: showInputAmount ? radioPack?.dataInfo[0]?.id : radioPack?.id,
                RateAmount: productDiscount?.rateAmount, // chiết khấu rate của core
                FixAmount: productDiscount?.fixAmount, // Chiết khấu fix của core
                ShowPeriod: showPeriod,
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
              name: 'Nhà cung cấp',
              value: param?.productData?.productName,
            },
            {
              name: 'Mã khách hàng',
              value: productAccount,
            },
          ]
          if (checkedAccountInfo?.customerInfo?.customerName) {
            infos.push({
              name: 'Tên khách hàng',
              value: checkedAccountInfo?.customerInfo?.customerName,
            })
          }

          if (checkedAccountInfo?.customerInfo?.address) {
            infos.push({
              name: 'Địa chỉ',
              value: checkedAccountInfo?.customerInfo?.address,
            })
          }
          if ((radioPack?.dataInfo?.map(x => x.period + ' ')?.toString() || radioPack?.period) && showPeriod) {
            infos.push({
              name: 'Kỳ thanh toán',
              value: radioPack?.dataInfo?.map(x => x.period + ' ')?.toString() || radioPack?.period,
            })
          }

          if (radioPack?.package) {
            infos.push({
              name: 'Tên gói cước',
              value: radioPack?.package,
            })
          }
          infos.push(
            {
              name: 'Số tiền',
              value: numberUtils.thousandSeparator(Number(param?.productData?.parValue)) + 'đ',
            },
          )
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
  const handleChangePaymentAmount = (e) => {
    console.log(e)
    let newRadioPack = { ...radioPack, amount: e }
    setRadioPack(newRadioPack)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!ProductServiceID) return
    resetForm()
    formPayBill.resetFields()
    setKeywordSearchProvider(null)
    setSelectedTag(null)
    saleStore.setListSaleProduct(null)
    saleStore.getProductDetail({ ProductID: ProductServiceID })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          setParentProduct(res?.param)
          if (res?.param?.Detail) {
            let tagList = JSON.parse(res?.param?.Detail)?.tags
            if (tagList?.length > 0) {
              setSelectedTag(tagList[0])
            }
          }
          saleStore.getSaleProducts({ ProductServiceID })
        }
      })
  }, [ProductServiceID])

  useEffect(() => {
    console.log(selectedPaymentObj, radioPack)
    if (selectedPaymentObj && radioPack && Number(radioPack?.amount) > 0) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  }, [selectedPaymentObj, radioPack])

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
    let productID = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductID
    let newBuyingSaleProduct = listSaleProduct.find(x => x.groupId === productID)
    if (newBuyingSaleProduct?.detail) {
      let newTags = JSON.parse(newBuyingSaleProduct?.detail)?.tags
      if (newTags?.length > 0) {
        setSelectedTag(newTags[0])
      }
    }
    saleStore.setBuyingSaleProduct(newBuyingSaleProduct)
  }, [editingExecution, listSaleProduct])

  useEffect(() => {
    if (!editingExecution) return
    let productID = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductID
    let productAccountSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductAccount
    let payload = {
      ProductAccount: productAccountSaved,
      ProductID: productID,
      AppliedVersion: 1,
    }
    saleStore.partnerCheckAccount(payload)
      .then(res => {
        setProductAccount(productAccountSaved)
        formPayBill.setFieldsValue({
          productAccount: productAccountSaved,
        })

        let param = res?.param
        const amount = param?.amount
        if (param?.billType?.includes('PREBILL')) {
          setShowPeriod(true)
          if (param.dataInfo || param.dataInfo.length > 0) {
            if (amount == 0 && param.dataInfo.length == 1) {
              // Trường hợp nhập số tiền nạp dịch vụ trả trước
              setRadioPack({
                ...res?.param,
                amount: JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ParValue,
              })
              setShowInputAmount(true)
              setCheckPartnerDescription(res?.description)
              formPayBill.setFieldsValue({
                paymentAmount: JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ParValue,
              })
            } else {
              // K+ và các trường hợp phải chọn gói
              setShowRadioPack(true)
              let billInfoId = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.BillInfo
              let billInfoSaved = res?.param?.dataInfo.find(x => x.id === billInfoId)
              setRadioPack(billInfoSaved)
              setCheckPartnerDescription(res?.description)
            }
          }
        } else {
          if (res?.param?.amount == 0) {
            setShowPeriod(false)
          }
          setShowRadioPack(false)
          let newRadioPack = {
            ...res?.param,
            amount: Number(JSON.parse(editingExecution?.executionData)?.PaymentInfo?.OriginalAmount),
          }
          setRadioPack(newRadioPack)
          setCheckPartnerDescription(res?.description)
          formPayBill.setFieldsValue({
            paymentAmount: Number(JSON.parse(editingExecution?.executionData)?.PaymentInfo?.OriginalAmount),
          })
        }


      })
  }, [editingExecution])

  useEffect(() => {
    if (!roles) return
    if (authenticationStore.checkRole(ROLES.INITPAYMENT)) return
    history.push(PAGES.HOME.PATH)
    notification.warning({
      message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
      description: TEXT_403,
    })
  }, [roles])
  useEffect(() => {
    console.log(toJS(checkedAccountInfo))
  }, [checkedAccountInfo])
  // endregion

  return (
    <>
      <Helmet>
        <title>{parentProduct?.ProductName}</title>
      </Helmet>
      <PayBillPageWrapper>
        <MainBreadCrumb breadcrumbData={
          [
            { ID: 1, LABEL: 'Trang chủ', PATH: PAGES.HOME.PATH },
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

                <BorderRoundedBox margin={'16px 0 0 0'}>
                  <Form.Item name={'provider'} noStyle>
                    <ProviderSearchInput
                      placeholder='Tìm kiếm nhà cung cấp'
                      onSearch={onSearchProvider}
                      style={{ marginBottom: 16 }}
                    />
                  </Form.Item>
                  {
                    parentProduct?.Detail && JSON.parse(parentProduct?.Detail)?.tags &&
                    <HorizontalScroll className={'provider-water'}>
                      {
                        JSON.parse(parentProduct?.Detail)?.tags.map(item =>
                          <PaymentTag
                            key={item}
                            appTheme={appTheme}
                            onClick={() => handleClickTag(item)}
                            active={item === selectedTag}>
                            {item}
                          </PaymentTag>,
                        )
                      }
                    </HorizontalScroll>
                  }

                  {
                    listSaleProduct && listSaleProduct
                      ?.filter(x => {
                        if (!selectedTag || selectedTag === 'Tất cả') {
                          return x
                        } else {
                          return x?.detail?.includes(selectedTag)
                        }
                      })
                      ?.filter(x => {
                        if (!keywordSearchProvider || keywordSearchProvider?.trim()?.length === 0) {
                          return x
                        } else {
                          return x?.productName?.toLowerCase()?.includes(keywordSearchProvider?.toLowerCase())
                        }
                      })?.length > 0
                      ?
                      <Scrollbars
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax={255}>
                        <ScrollBarsWrapper>
                          <Row gutter={[16, 16]}>
                            {
                              listSaleProduct && listSaleProduct
                                ?.filter(x => {
                                  if (!selectedTag || selectedTag === 'Tất cả') {
                                    return x
                                  } else {
                                    return x?.detail?.includes(selectedTag)
                                  }
                                })
                                ?.filter(x => {
                                  if (!keywordSearchProvider || keywordSearchProvider?.trim()?.length === 0) {
                                    return x
                                  } else {
                                    return x?.productName?.toLowerCase()?.includes(keywordSearchProvider?.toLowerCase())
                                  }
                                })
                                ?.map(item =>
                                  <Col key={item?.productCode} xxl={8} xl={12} lg={12} md={12} sm={24} xs={24}>
                                    <ProviderItem
                                      onClick={() => handleClickChosenProvider(item)}
                                      active={buyingSaleProduct?.productCode === item?.productCode}
                                      appTheme={appTheme}>
                                      <ProviderIconWrapper>
                                        <img src={item?.logo} alt={''} />
                                      </ProviderIconWrapper>
                                      <ProviderInfoWrapper>
                                        <Tooltip
                                          mouseEnterDelay={0.5}
                                          title={item?.productName}>
                                          <EllipsisText width={'220px'}>
                                            <ColorText whiteSpace={'nowrap'}
                                                       cursor={'pointer'}>{item?.productName}</ColorText>
                                          </EllipsisText>
                                        </Tooltip>
                                        <Tooltip title={item?.childs[0]?.Description}>
                                          <EllipsisText width={'220px'}>
                                            <ColorText whiteSpace={'nowrap'} cursor={'pointer'} color={'#B4B4B4'}>
                                              {item?.childs[0]?.Description}
                                            </ColorText>
                                          </EllipsisText>
                                        </Tooltip>
                                      </ProviderInfoWrapper>
                                    </ProviderItem>
                                  </Col>,
                                )
                            }
                          </Row>
                        </ScrollBarsWrapper>
                      </Scrollbars>
                      :
                      <EmptyProduct description={'Không có thông tin nhà cung cấp'} />
                  }

                  <TextInputWrapper>
                    <Form.Item name={'productAccount'} noStyle>
                      <TextInput placeholder={'Nhập mã khách hàng/hợp đồng'} />
                    </Form.Item>
                    <img src={ICONS.CUSTOMER_SEARCH} alt={''} onClick={onChangeProductAccount} />
                  </TextInputWrapper>

                  {
                    checkedAccountInfo
                      ?
                      <>
                        {
                          !showRadioPack && checkedAccountInfo &&
                          <Descriptions bordered column={1}>
                            <Descriptions.Item label={'Nhà cung cấp'} labelStyle={{ width: '30%' }}>
                              {buyingSaleProduct?.productName}
                            </Descriptions.Item>
                            <Descriptions.Item label={'Mã khách hàng/hợp đồng'} labelStyle={{ width: '30%' }}>
                              {productAccount}
                            </Descriptions.Item>
                            {
                              checkedAccountInfo?.customerInfo?.customerName &&
                              <Descriptions.Item label={'Tên khách hàng'} labelStyle={{ width: '30%' }}>
                                {checkedAccountInfo?.customerInfo?.customerName ? checkedAccountInfo?.customerInfo?.customerName : 'Không có thông tin'}
                              </Descriptions.Item>
                            }
                            {
                              checkedAccountInfo?.customerInfo?.address &&
                              <Descriptions.Item label={'Địa chỉ'} labelStyle={{ width: '30%' }}>
                                {checkedAccountInfo?.customerInfo?.address ? checkedAccountInfo?.customerInfo?.address : 'Không có thông tin'}
                              </Descriptions.Item>
                            }
                            {
                              checkedAccountInfo?.dataInfo?.length > 0 && showPeriod &&
                              <Descriptions.Item label={'Kỳ thanh toán'} labelStyle={{ width: '30%' }}>
                                <PaymentPeriodWrapper>
                                  <Timeline>
                                    {
                                      checkedAccountInfo?.dataInfo?.length > 0 && checkedAccountInfo?.dataInfo.map(item =>
                                        <Timeline.Item key={item?.id}>
                                          <ColorText
                                            color={appTheme.solidColor}>{item?.period}
                                          </ColorText>: {numberUtils.thousandSeparator(item?.amount)}đ
                                        </Timeline.Item>,
                                      )
                                    }
                                  </Timeline>
                                </PaymentPeriodWrapper>
                              </Descriptions.Item>
                            }
                            {
                              !showInputAmount &&
                              <Descriptions.Item label={'Số tiền'} labelStyle={{ width: '30%' }}>
                                {
                                  checkedAccountInfo?.amount > 0
                                    ? numberUtils.thousandSeparator(checkedAccountInfo?.amount) + 'đ'
                                    : <ColorText color={'red'}>{checkPartnerDescription || '0 đ'}</ColorText>
                                }
                              </Descriptions.Item>
                            }

                          </Descriptions>
                        }

                        {
                          showRadioPack && checkedAccountInfo?.dataInfo?.length > 0 &&
                          <Radio.Group
                            style={{ width: '100%' }}
                            value={radioPack?.id}>
                            <Descriptions
                              layout={device === DEVICE.MOBILE ? 'vertical' : 'horizontal '}
                              style={{ marginTop: 16 }}
                              bordered
                              column={1}>
                              {
                                checkedAccountInfo?.dataInfo?.map(item =>
                                  <Descriptions.Item
                                    key={item?.id}
                                    label={
                                      <Radio
                                        onClick={() => onChangeRadioPack(item)}
                                        value={item?.id}>
                                        {item?.period}
                                      </Radio>
                                    }
                                    labelStyle={{ width: '30%' }}>
                                    <RowAlignCenterDiv
                                      justifyContent={device === DEVICE.MOBILE ? 'flext-start' : 'flex-end'}>
                                      {numberUtils.thousandSeparator(item?.amount)} đ
                                    </RowAlignCenterDiv>
                                  </Descriptions.Item>,
                                )
                              }
                            </Descriptions>
                          </Radio.Group>
                        }
                        {
                          showInputAmount &&
                          <Form.Item name={'paymentAmount'} noStyle>
                            <QuantityInput
                              style={{
                                width: '100%',
                                marginTop: 16,
                              }}
                              size={'large'}
                              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                              parser={(value) => value.replace(/\$\s?|(\.*)/g, '')}
                              placeholder={'Nhập số tiền'}
                              maxLength={19}
                              min={1}
                              step={1000}
                              onChange={handleChangePaymentAmount}
                            />
                          </Form.Item>
                        }
                      </>

                      :
                      <Empty description={'Vui lòng nhập mã khách hàng'} />
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
          // title={editingExecution ? `Xác nhận sửa yêu cầu thanh toán ${parentProduct?.ProductName}` : `Xác nhận thanh toán ${parentProduct?.ProductName}`}
          title={editingExecution ? `Xác nhận sửa giao dịch` : `Xác nhận giao dịch`}
          visible={visibleConfirm} />
      </PayBillPageWrapper>
    </>

  )
}

PayBillPage.propTypes = {}

export default inject(
  'commonStore',
  'saleStore',
  'orderStore',
  'paymentStore',
  'accountWalletStore',
  'bankStore',
  'authenticationStore')(observer(PayBillPage))