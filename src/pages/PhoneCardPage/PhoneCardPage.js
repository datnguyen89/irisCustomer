import React, { useEffect, useState } from 'react'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA,
  FEE_TYPE, PAGES,
  PAYMENT_TYPE,
  PAYTYPE,
  RESPONSE_CODE, ROLES,
  SUCCESS_COLOR,
  SUCCESS_TITLE, TEXT_403, WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import { Helmet } from 'react-helmet/es/Helmet'
import {
  BorderRoundedBox,
  ColorText,
  ColorTitleNoBg,
  PackInfoWrapper,
  PackItem, ProviderItemWrapper, QuantityInput, RowCenterDiv,
  ScrollBarsWrapper,
  TitleBackgroundGray,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'
import { inject, observer } from 'mobx-react'
import HorizontalScroll from 'react-horizontal-scrolling'
import { PhoneCardPageWrapper } from './PhoneCardPageStyled'
import { Button, Col, Divider, notification, Row } from 'antd'
import { Scrollbars } from 'react-custom-scrollbars'
import PaymentMoneySource from '../../components/PaymentMoneySource/PaymentMoneySource'
import numberUtils from '../../utils/numberUtils'
import EmptyProduct from '../../components/EmptyProduct'
import ConfirmInfoModal from '../../components/ConfirmInfoModal/ConfirmInfoModal'
import { Link, useHistory } from 'react-router-dom'
import {
  BankLinkedSelectBoxWrapper, NoLinkedBank, NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'
import { WarningOutlined } from '@ant-design/icons'

const PhoneCardPage = props => {
  // region props, hook, state =================
  const {
    match,
    commonStore,
    saleStore,
    paymentStore,
    orderStore,
    accountWalletStore,
    bankStore,
    authenticationStore,
  } = props
  const { appTheme } = commonStore

  const history = useHistory()

  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [payloadExecution, setPayloadExecution] = useState(null)
  const [parentProduct, setParentProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const [validForm, setValidForm] = useState(false)
  // endregion
  // region destructuring ======================
  const { roles } = authenticationStore
  const { editingExecution } = orderStore
  const { accountWallets } = accountWalletStore
  const { listLinkedBanks } = bankStore
  const { ProductServiceID } = match.params
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
  const resetForm = () => {
    setPayloadExecution(null)
    setArrConfirmInfo([])
    setQuantity(1)
  }
  const handleClickChosenProduct = (product) => {
    saleStore.setBuyingSaleProduct(product)
  }
  const handleClickChosenSaleProduct = (item) => {
    const newSelectedSaleProduct = listSaleProduct.find(x => x.productCode === item.productCode)
    saleStore.setSelectedSaleProduct(newSelectedSaleProduct)
    saleStore.setBuyingSaleProduct(null)
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
      ProductID: buyingSaleProduct?.ProductID,
      ProductAccount: null,
      Quantity: quantity,
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
                TotalAmountToPaid: (param?.productData?.priceAmount * quantity) + param?.paymentFee, // priceAmount + paymentFee
                PeriodPayment: '', // Kỳ thanh toán
                ProductID: buyingSaleProduct?.ProductID,
                ProductCode: buyingSaleProduct?.ProductCode,
                ProductAccount: null, // Thuê bao hoặc số hóa đơn
                Quantity: quantity, //số lượng (truyền nếu mua sp có số lượng. VD: mã thẻ)
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
            // {
            //   name: 'Số điện thoại',
            //   value: productAccount,
            // },
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
              name: 'Số lượng',
              value: numberUtils.thousandSeparator(quantity),
            },
            {
              name: 'Tổng tiền',
              value: numberUtils.thousandSeparator(param?.productData?.priceAmount * quantity),
            },
            {
              name: 'Phí giao dịch',
              value: param?.paymentFee > 0 ? numberUtils.thousandSeparator(param?.paymentFee) + 'đ' : 'Miễn phí',
            },
            {
              name: 'Thành tiền',
              value: numberUtils.thousandSeparator((param?.productData?.priceAmount * quantity) + param?.paymentFee) + 'đ',
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
  const onChangeQuantity = (e) => {
    setQuantity(e)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    resetForm()
    saleStore.setBuyingSaleProduct(null)
    saleStore.setListSaleProduct(null)
    saleStore.getSaleProducts({ ProductServiceID: Number(ProductServiceID) })
  }, [ProductServiceID])
  useEffect(() => {
    if (selectedPaymentObj && buyingSaleProduct && quantity > 0) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  }, [selectedPaymentObj, buyingSaleProduct, quantity])
  useEffect(() => {
    if (!ProductServiceID) return
    saleStore.getProductDetail({ ProductID: Number(ProductServiceID) })
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
    let productIdSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductID
    saleStore.getProductDetail({ ProductID: productIdSaved })
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          const newSelectedSaleProduct = listSaleProduct.find(x => x.groupId === res?.param?.ParentID)
          saleStore.setSelectedSaleProduct(newSelectedSaleProduct)
        }
      })
  }, [editingExecution, listSaleProduct, parentProduct])

  useEffect(() => {
    if (!editingExecution) return
    if (!selectedSaleProduct) return
    let productIdSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductID
    let buyingProductSelected = selectedSaleProduct?.childs.find(x => x.ProductID === productIdSaved)
    saleStore.setBuyingSaleProduct(buyingProductSelected)
  }, [editingExecution, selectedSaleProduct])

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
    let quantitySaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.Quantity
    setQuantity(Number(quantitySaved))
  }, [editingExecution])

  useEffect(() => {
    return () => {
      resetForm()
      orderStore.resetEditingExecution()
      saleStore.resetSelectedSaleProduct()
      saleStore.setListSaleProduct(null)
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
      <PhoneCardPageWrapper>
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
                <ColorTitleNoBg marginBottom={'16px'}>
                  Chọn nhà cung cấp
                </ColorTitleNoBg>
                {
                  listSaleProduct &&
                  <HorizontalScroll>
                    {
                      listSaleProduct.map(item =>
                        <ProviderItemWrapper
                          key={item?.productCode}
                          allowHover
                          onClick={() => handleClickChosenSaleProduct(item)}
                          cursor={'pointer'}
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
                        <Row gutter={[16, 16]}>
                          {
                            selectedSaleProduct?.childs && selectedSaleProduct?.childs.map(item =>
                              <Col
                                xxl={4}
                                xl={6}
                                lg={8}
                                md={12}
                                sm={24}
                                xs={24} key={item.ProductID}>
                                <PackItem
                                  onClick={() => handleClickChosenProduct(item)}
                                  active={buyingSaleProduct?.ProductID === item?.ProductID}
                                  appTheme={appTheme}>
                                  <PackInfoWrapper alignItems={'center'}>
                                    <ColorText
                                      fontWeight={600}
                                      cursor={'pointer'}>
                                      {numberUtils.thousandSeparator(item.ParValue)}đ
                                    </ColorText>
                                    <ColorText
                                      cursor={'pointer'}
                                      color={'#B4B4B4'}>
                                      {numberUtils.thousandSeparator(item.PriceAmount)}đ
                                    </ColorText>
                                    {
                                      item?.Detail && JSON.parse(item?.Detail)?.package &&
                                      <>
                                        <Divider style={{ margin: 8 }} />
                                        <ColorText
                                          cursor={'pointer'}
                                          color={appTheme.solidColor}>
                                          {JSON.parse(item?.Detail)?.package}
                                        </ColorText>
                                      </>
                                    }
                                  </PackInfoWrapper>
                                </PackItem>
                              </Col>,
                            )
                          }
                        </Row>
                      </ScrollBarsWrapper>
                    </Scrollbars>
                    :
                    <EmptyProduct description={'Vui lòng chọn nhà cung cấp để hiển thị mệnh giá'} />
                }
              </BorderRoundedBox>
              <QuantityInput
                value={quantity}
                onChange={onChangeQuantity}
                step={1}
                min={1}
                placeholder={'Nhập số lượng'}
                margin={'16px 0'}
              />
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
      </PhoneCardPageWrapper>
    </>

  )
}

PhoneCardPage.propTypes = {}

export default inject(
  'commonStore',
  'saleStore',
  'paymentStore',
  'orderStore',
  'accountWalletStore',
  'bankStore',
  'authenticationStore')(observer(PhoneCardPage))