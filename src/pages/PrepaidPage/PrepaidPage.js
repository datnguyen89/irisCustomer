import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA, ERROR_COLOR, ERROR_TITLE,
  FEE_TYPE,
  PAGES, PARENT_PRODUCT_PAY_BILL,
  PAYMENT_TYPE,
  PAYTYPE,
  RESPONSE_CODE, ROLES,
  SUCCESS_COLOR, SUCCESS_TITLE, TEXT_403, WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import {
  BorderRoundedBox,
  ColorText,
  ColorTitleNoBg,
  PackInfoWrapper,
  PackItem, PackSubInfoWrapper,
  PrefixIconWrapper, ProviderItemWrapper,
  QuantityInput,
  RowCenterDiv,
  ScrollBarsWrapper,
  TextInput,
  TitleBackgroundGray,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'
import { PrepaidPageWrapper } from './PrepaidPageStyled'
import { inject, observer } from 'mobx-react'
import { Button, Col, notification, Row } from 'antd'
import HorizontalScroll from 'react-horizontal-scrolling'
import { Scrollbars } from 'react-custom-scrollbars'
import PaymentMoneySource from '../../components/PaymentMoneySource/PaymentMoneySource'
import { MobileOutlined, RightOutlined, WarningOutlined } from '@ant-design/icons'
import numberUtils from '../../utils/numberUtils'
import ConfirmInfoModal from '../../components/ConfirmInfoModal/ConfirmInfoModal'
import IMAGES from '../../images'
import EmptyProduct from '../../components/EmptyProduct'
import { Link, useHistory } from 'react-router-dom'
import ICONS from '../../icons'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'

const PrepaidPage = props => {
  // region props, hook, state =================
  const {
    match,
    location,
    commonStore,
    saleStore,
    orderStore,
    paymentStore,
    accountWalletStore,
    bankStore,
    authenticationStore,
  } = props

  const history = useHistory()

  const [productAccount, setProductAccount] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [payloadExecution, setPayloadExecution] = useState(null)
  const [parentProduct, setParentProduct] = useState(null)
  const [validForm, setValidForm] = useState(false)
  // endregion
  // region destructuring ======================
  const { roles } = authenticationStore
  const { appTheme } = commonStore
  const { editingExecution } = orderStore
  const { accountWallets } = accountWalletStore
  const { listLinkedBanks } = bankStore
  const {
    listSaleProduct,
    selectedSaleProduct,
    buyingSaleProduct,
    selectedPaymentObj,
    selectedPaymentType,
  } = saleStore
  const { ProductServiceID } = match.params


  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const onChangePhoneNumber = (e) => {
    let phoneNumber = e.target.value?.trim()

    setProductAccount(phoneNumber)
    if ((phoneNumber?.trim()?.length < 10) || (phoneNumber?.trim()?.length < 11 && phoneNumber?.trim()?.slice(0, 4) == '0121')) {
      if (selectedSaleProduct) {
        saleStore.resetSelectedSaleProduct()
        setPayloadExecution(null)
        setArrConfirmInfo([])
      }
      setValidForm(false)
      return
    }
    const regex = /(0[0-9])+([0-9]{8,9})\b/g
    if (!regex.test(phoneNumber)) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Số điện thoại không đúng định dạng',
      })
      return
    }
    let payload = {
      Mobile: phoneNumber,
      ProductService: parentProduct?.ProductCode,
    }
    saleStore.checkTelCo(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          if (res?.param?.PhoneType?.includes('POSTPAID')) {
            notification.warning({
              message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
              description: 'Thuê bao quý khách là thuê bao trả sau. Vui lòng nhập số thuê bao trả trước để thực hiện dịch vụ',
            })
          } else {
            let productCode = res?.param?.ProductCode
            if (productCode?.includes('PREPAID')) {
              const newSelectedSaleProduct = listSaleProduct.find(x => x.productCode === productCode)
              saleStore.setSelectedSaleProduct(newSelectedSaleProduct)
            } else {
              notification.warning({
                message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
                description: 'Thuê bao quý khách là thuê bao trả sau. Vui lòng nhập số thuê bao trả trước để thực hiện dịch vụ',
              })
            }
          }
        }
      })
  }
  const handleClickChosenProduct = (product) => {
    saleStore.setBuyingSaleProduct(product)
  }
  const resetForm = () => {
    setPayloadExecution(null)
    setProductAccount(null)
    setArrConfirmInfo([])
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
            saleStore.resetSelectedSaleProduct()
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
            saleStore.resetSelectedSaleProduct()
            resetForm()
          }
        })
    }
  }
  const handleCancelConfirm = () => {
    setVisibleConfirm(false)
    setPayloadExecution(null)
  }
  // const onClickCreateOrder = () => {
  //   let fund = ''
  //   let payType = null
  //   console.log(selectedPaymentType)
  //   switch (selectedPaymentType) {
  //     case PAYMENT_TYPE.WALLET:
  //       let firstChar = selectedPaymentObj?.accountName?.slice(0, 1)
  //       fund = firstChar?.toLowerCase() === 'e' ? selectedPaymentObj?.accountName?.slice(1) : selectedPaymentObj?.accountName
  //       payType = PAYTYPE.PAYMENT_WALLET
  //       break
  //     case PAYMENT_TYPE.LINKED_BANK:
  //       fund = `${selectedPaymentObj?.bankName} | ${selectedPaymentObj?.bankAccount}`
  //       payType = PAYTYPE.PAYMENT_LINKED_BANK
  //       break
  //     case PAYMENT_TYPE.NAPAS:
  //       fund = `${selectedPaymentObj?.bankName}`
  //       break
  //     default:
  //       break
  //   }
  //   let payloadFee = {
  //     PayType: payType,
  //     Amount: buyingSaleProduct.PriceAmount,
  //     FeeType: FEE_TYPE.PAYMENT,
  //   }
  //   paymentStore.getFee(payloadFee)
  //     .then(res => {
  //       if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
  //         let param = JSON.parse(res?.param)
  //         let feeTransaction = Number(param?.transferFee) >= 0 ? Number(param?.transferFee) : 0
  //         let payload = {
  //           ExecutionData: {
  //             PaymentInfo: {
  //               Provider: '',
  //               ProductTypeName: parentProduct?.ProductName, // Tên loại sản phẩm
  //               ProductName: buyingSaleProduct.ProductName, // Tên sản phẩm
  //               Fund: fund, // Nguồn tiền
  //               CustomerName: '',
  //               CustomerAddress: '',
  //               ProductFee: `${buyingSaleProduct?.RateFee > 0 ? buyingSaleProduct?.RateFee + '%' : ''}${(buyingSaleProduct?.RateFee > 0 && buyingSaleProduct?.FixFee > 0) ? ' + ' : ''}${buyingSaleProduct?.FixFee > 0 ? buyingSaleProduct?.FixFee : ''}`,
  //               TransferFee: feeTransaction,
  //               TotalAmount: buyingSaleProduct.PriceAmount, // Giá sau khi tính phí, chiết khấu
  //               OriginalAmount: buyingSaleProduct.ParValue, // Giá gốc
  //               TotalAmountToPaid: buyingSaleProduct.PriceAmount + feeTransaction, // TotalAmount + phí giao dịch
  //               Discount: `${buyingSaleProduct?.RateDiscount > 0 ? buyingSaleProduct?.RateDiscount + '%' : ''}${(buyingSaleProduct?.RateDiscount > 0 && buyingSaleProduct?.FixDiscount > 0) ? ' + ' : ''}${buyingSaleProduct?.FixDiscount > 0 ? buyingSaleProduct?.FixDiscount : ''}`,
  //               PeriodPayment: '', // Kỳ thanh toán
  //               ProductID: buyingSaleProduct?.ProductID,
  //               ProductAccount: productAccount, // Thuê bao hoặc số hóa đơn
  //               Quantity: null, //số lượng (truyền nếu mua sp có số lượng. VD: mã thẻ)
  //               ParValue: null, // số tiền thanh toán (trường hợp trả sau)
  //               AccountType: null, //loại số dư TK (nếu MM truyền 2, # hoặc ko truyền thì là ví)
  //               PaymentType: selectedPaymentType,
  //               BankAccountID: selectedPaymentObj?.bankAccountID,
  //               BankCode: selectedPaymentObj?.bankCode,
  //               EditPathUrl: window.location.pathname,
  //               AccountName: selectedPaymentObj?.accountName,
  //             },
  //           },
  //         }
  //         setPayloadExecution(payload)
  //         let infos = [
  //           {
  //             name: 'Nguồn tiền',
  //             value: fund,
  //           },
  //           {
  //             name: 'Dịch vụ',
  //             value: parentProduct?.ProductName,
  //           },
  //           {
  //             name: 'Sản phẩm',
  //             value: buyingSaleProduct.ProductName,
  //           },
  //           {
  //             name: 'Mệnh giá',
  //             value: numberUtils.thousandSeparator(buyingSaleProduct.ParValue) + 'đ',
  //           },
  //
  //
  //         ]
  //         if ((buyingSaleProduct?.RateDiscount > 0) || (buyingSaleProduct?.FixDiscount > 0)) {
  //           infos.push({
  //             name: 'Chiết khấu',
  //             value: `
  //             ${buyingSaleProduct?.RateDiscount > 0 ? buyingSaleProduct?.RateDiscount + '%' : ''}
  //             ${(buyingSaleProduct?.RateDiscount > 0 && buyingSaleProduct?.FixDiscount > 0) ? ' + ' : ''}
  //             ${buyingSaleProduct?.FixDiscount > 0 ? buyingSaleProduct?.FixDiscount : ''}
  //             (${numberUtils.thousandSeparator(buyingSaleProduct?.MinDiscount)} \u2264 chiết khấu \u2264 ${numberUtils.thousandSeparator(buyingSaleProduct?.MaxDiscount)})
  //             `,
  //           })
  //         }
  //         if ((buyingSaleProduct?.RateFee > 0) || (buyingSaleProduct?.FixFee > 0)) {
  //           infos.push({
  //             name: 'Phí sản phẩm',
  //             value: `
  //             ${buyingSaleProduct?.RateFee > 0 ? buyingSaleProduct?.RateFee + '%' : ''}
  //             ${(buyingSaleProduct?.RateFee > 0 && buyingSaleProduct?.FixFee > 0) ? ' + ' : ''}
  //             ${buyingSaleProduct?.FixFee > 0 ? buyingSaleProduct?.FixFee : ''}
  //             (${numberUtils.thousandSeparator(buyingSaleProduct?.MinFee)} \u2264 phí sản phẩm \u2264 ${numberUtils.thousandSeparator(buyingSaleProduct?.MaxFee)})
  //             `,
  //           })
  //         }
  //         infos.push(
  //           {
  //             name: 'Số điện thoại',
  //             value: productAccount,
  //           },
  //           {
  //             name: 'Giá bán',
  //             value: numberUtils.thousandSeparator(buyingSaleProduct.PriceAmount) + 'đ',
  //           },
  //           {
  //             name: 'Phí giao dịch',
  //             value: feeTransaction > 0 ? numberUtils.thousandSeparator(feeTransaction) + 'đ' : 'Miễn phí',
  //           },
  //           {
  //             name: 'Thành tiền',
  //             value: numberUtils.thousandSeparator(buyingSaleProduct.PriceAmount + feeTransaction) + 'đ',
  //           },
  //         )
  //         setArrConfirmInfo(infos)
  //         setVisibleConfirm(true)
  //       }
  //     })
  // }

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
      ProductID: buyingSaleProduct?.ProductID,
      ProductAccount: productAccount,
      Quantity: 1,
      ParValue: 0,
      AppliedVersion: 1,
      AccountType: 0,
      BillInfo: null,
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
                OriginalAmount: param?.productData?.parValue, // Giá gốc
                TotalAmountToPaid: param?.productData?.priceAmount + param?.paymentFee, // priceAmount + paymentFee
                PeriodPayment: '', // Kỳ thanh toán
                ProductID: buyingSaleProduct?.ProductID,
                ProductCode: buyingSaleProduct?.ProductCode,
                ProductAccount: productAccount, // Thuê bao hoặc số hóa đơn
                Quantity: null, //số lượng (truyền nếu mua sp có số lượng. VD: mã thẻ)
                ParValue: null, // số tiền thanh toán (trường hợp trả sau)
                AccountType: null, //loại số dư TK (nếu MM truyền 2, # hoặc ko truyền thì là ví)
                PaymentType: selectedPaymentType,
                BankAccountID: selectedPaymentObj?.bankAccountID,
                BankCode: selectedPaymentObj?.bankCode,
                EditPathUrl: window.location.pathname,
                AccountName: selectedPaymentObj?.accountName,
                BillInfo: '',
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
              name: 'Mệnh giá',
              value: numberUtils.thousandSeparator(Number(param?.productData?.parValue)) + 'đ',
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

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    resetForm()
    saleStore.setBuyingSaleProduct(null)
    saleStore.setListSaleProduct(null)
    saleStore.getSaleProducts({ ProductServiceID })
  }, [ProductServiceID])
  useEffect(() => {
    if (selectedPaymentObj && buyingSaleProduct) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  }, [selectedPaymentObj, buyingSaleProduct])
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
    if (!editingExecution) return
    if (!listSaleProduct) return
    if (!parentProduct) return
    let productAccountSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductAccount
    let payload = {
      Mobile: productAccountSaved,
      ProductService: parentProduct?.ProductCode,
    }
    saleStore.checkTelCo(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          if (res?.param?.PhoneType?.includes('POSTPAID')) {
            notification.warning({
              message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
              description: 'Thuê bao quý khách là thuê bao trả sau. Vui lòng nhập số thuê bao trả trước để thực hiện dịch vụ',
            })
          } else {
            let productCode = res?.param?.ProductCode
            if (productCode?.includes('PREPAID')) {
              const newSelectedSaleProduct = listSaleProduct.find(x => x.productCode === productCode)
              saleStore.setSelectedSaleProduct(newSelectedSaleProduct)
            } else {
              notification.warning({
                message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
                description: 'Thuê bao quý khách là thuê bao trả sau. Vui lòng nhập số thuê bao trả trước để thực hiện dịch vụ',
              })
            }
          }
        }
      })
    setProductAccount(productAccountSaved)
  }, [editingExecution, listSaleProduct, parentProduct])

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
    if (!selectedSaleProduct) return
    let productIdSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductID
    let buyingProductSelected = selectedSaleProduct?.childs.find(x => x.ProductID === productIdSaved)
    saleStore.setBuyingSaleProduct(buyingProductSelected)
  }, [editingExecution, selectedSaleProduct])

  useEffect(() => {
    return () => {
      resetForm()
      orderStore.resetEditingExecution()
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
      <PrepaidPageWrapper>
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
          <Row justify={'center'}>
            <Col xxl={16} xl={18} lg={24} md={24} sm={24} xs={24}>
              <BorderRoundedBox>
                <TextInput
                  value={productAccount}
                  onChange={onChangePhoneNumber}
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
                <ColorTitleNoBg marginBottom={'16px'}>
                  Chọn gói / mệnh giá
                </ColorTitleNoBg>
                {
                  selectedSaleProduct ?
                    <Scrollbars
                      autoHeight
                      autoHeightMin={0}
                      autoHeightMax={200}>
                      <ScrollBarsWrapper>
                        {
                          Number(ProductServiceID) === PARENT_PRODUCT_PAY_BILL.TOPUP_DATA
                            ?
                            <Row gutter={[16, 16]}>
                              {
                                selectedSaleProduct?.childs && selectedSaleProduct?.childs.map(item =>
                                  <Col xxl={6} xl={6} lg={8} md={12} sm={24} xs={24} key={item.ProductID}>
                                    <PackItem
                                      onClick={() => handleClickChosenProduct(item)}
                                      active={buyingSaleProduct?.ProductID === item?.ProductID}
                                      justifyContent={'space-between'}
                                      appTheme={appTheme}>
                                      <PackInfoWrapper width={'75%'}>
                                        <ColorText fontWeight={600}
                                                   cursor={'pointer'}>{numberUtils.thousandSeparator(item.ParValue)}đ</ColorText>
                                        <ColorText cursor={'pointer'}
                                                   color={'#B4B4B4'}>{numberUtils.thousandSeparator(item.PriceAmount)}đ</ColorText>
                                      </PackInfoWrapper>
                                      {
                                        item?.SubDetail &&
                                        <PackSubInfoWrapper>
                                          <div>{JSON.parse(item?.SubDetail)?.package}</div>
                                        </PackSubInfoWrapper>
                                      }

                                    </PackItem>
                                  </Col>,
                                )
                              }
                            </Row>
                            :
                            <Row gutter={[16, 16]}>
                              {
                                selectedSaleProduct?.childs && selectedSaleProduct?.childs.map(item =>
                                  <Col xxl={3} xl={6} lg={8} md={12} sm={24} xs={24} key={item.ProductID}>
                                    <PackItem
                                      onClick={() => handleClickChosenProduct(item)}
                                      active={buyingSaleProduct?.ProductID === item?.ProductID}
                                      appTheme={appTheme}>
                                      <PackInfoWrapper>
                                        <ColorText fontWeight={600}
                                                   cursor={'pointer'}>{numberUtils.thousandSeparator(item.ParValue)}đ</ColorText>
                                        <ColorText cursor={'pointer'}
                                                   color={'#B4B4B4'}>{numberUtils.thousandSeparator(item.PriceAmount)}đ</ColorText>
                                      </PackInfoWrapper>
                                    </PackItem>
                                  </Col>,
                                )
                              }
                            </Row>
                        }

                      </ScrollBarsWrapper>
                    </Scrollbars>
                    :
                    <EmptyProduct description={'Vui lòng nhập số điện thoại để hiển thị mệnh giá'} />
                }
              </BorderRoundedBox>

            </Col>
          </Row>
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
      </PrepaidPageWrapper>
    </>
  )
}

PrepaidPage.propTypes = {}

export default inject(
  'commonStore',
  'saleStore',
  'orderStore',
  'paymentStore',
  'bankStore',
  'authenticationStore',
  'accountWalletStore')(observer(PrepaidPage))