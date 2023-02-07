import React, { useState, useEffect } from 'react'
import {
  PackDataText,
  PackDataPageWrapper, PackInfoButton,
  PackInfoIconWrapper, PackInfoImage, PackInfoNotice,
  PackInfoOverlay,
  PackInfoTable,
  PackInfoTableItem,
} from './PackDataPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import {
  BREADCRUMB_DATA, ERROR_COLOR, ERROR_TITLE,
  FEE_TYPE, INFO_COLOR, INFO_TITLE, PAGES,
  PAYMENT_TYPE,
  PAYTYPE,
  RESPONSE_CODE, ROLES,
  SUCCESS_COLOR,
  SUCCESS_TITLE, TEXT_403, WARNING_COLOR, WARNING_TITLE,
} from '../../utils/constant'
import {
  BorderRoundedBox, ColorStrikeText, ColorText, ColorTitle,
  ColorTitleNoBg, EllipsisText, PackInfoData,
  PackInfoWrapper, PackInfoWrapperData,
  PackItem, PackPriceWrapper, PrefixIconWrapper, ProviderItemWrapper,
  RowCenterDiv, RowSpaceBetweenDiv,
  ScrollBarsWrapper,
  TextInput, TextInputWrapper,
  TitleBackgroundGray,
  WhiteRoundedBox,
} from '../../components/CommonStyled/CommonStyled'


import { inject, observer } from 'mobx-react'
import { Button, Col, Divider, Form, notification, Row, Tooltip } from 'antd'
import HorizontalScroll from 'react-horizontal-scrolling'
import { Scrollbars } from 'react-custom-scrollbars'
import PaymentMoneySource from '../../components/PaymentMoneySource/PaymentMoneySource'
import ICONS from '../../icons'
import { RightOutlined, WarningOutlined } from '@ant-design/icons'
import { toJS } from 'mobx'
import numberUtils from '../../utils/numberUtils'
import EmptyProduct from '../../components/EmptyProduct'
import ConfirmInfoModal from '../../components/ConfirmInfoModal/ConfirmInfoModal'
import { Link, useHistory } from 'react-router-dom'
import {
  BankLinkedSelectBoxWrapper,
  NoLinkedBank,
  NoLinkedBankText,
  NoLinkedBankWrapper,
} from '../../components/BankLinkedSelectBox/BankLinkedSelectBoxStyled'

const PackDataPage = props => {
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
  const { appTheme } = commonStore

  const history = useHistory()

  const [parentProduct, setParentProduct] = useState(null)

  const [inputProductAccount, setInputProductAccount] = useState(null)
  const [productAccount, setProductAccount] = useState(null)
  const [visibleConfirm, setVisibleConfirm] = useState(false)
  const [arrConfirmInfo, setArrConfirmInfo] = useState([])
  const [payloadExecution, setPayloadExecution] = useState(null)

  const [radioPack, setRadioPack] = useState(null)

  const [validForm, setValidForm] = useState(false)
  // endregion
  // region destructuring ======================
  const [formPayBill] = Form.useForm()
  const { ProductServiceID } = match.params

  const { roles } = authenticationStore
  const { accountWallets } = accountWalletStore
  const { listLinkedBanks } = bankStore

  const { editingExecution } = orderStore

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
  const onChangePhoneNumber = (e) => {

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
      ProductAccount: productAccount,
      Quantity: 1,
      ParValue: 0,
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
                OriginalAmount: param?.productData?.parValue, // Giá gốc
                TotalAmountToPaid: param?.productData?.priceAmount + param?.paymentFee, // priceAmount + paymentFee
                PeriodPayment: radioPack?.dataInfo?.map(x => x.period + ' ')?.toString(), // Kỳ thanh toán
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
  const onChangeProductAccount = () => {
    setPayloadExecution(null)
    setProductAccount(null)
    setArrConfirmInfo([])
    saleStore.setCheckedAccountInfo(null)
    saleStore.resetSelectedSaleProduct()
    saleStore.setListSaleProduct(null)

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
    setProductAccount(newProductAccount)
    let payload = { ProductServiceID: ProductServiceID, ProductAccount: newProductAccount }
    saleStore.getSaleProducts(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS && res?.param?.length > 0) {
          saleStore.setSelectedSaleProduct(res?.param[0])
        } else {
          notification.info({
            message: <ColorText fontSize={'20px'} color={INFO_COLOR}>{INFO_TITLE}</ColorText>,
            description: 'Không có gói data nào phù hợp với số thuê bao của bạn',
          })
        }
      })
    // // Lấy danh sách gói data hiện có
    // saleStore.getListPackageData({
    //   ProductID: '409045000',
    //   ProductAccount: newProductAccount,
    // })
    //   .then(res => {
    //     console.log(res)
    //   })
  }

  const resetForm = () => {
    setPayloadExecution(null)
    setProductAccount(null)
    setArrConfirmInfo([])
    formPayBill.resetFields()
    saleStore.setCheckedAccountInfo(null)
    saleStore.resetSelectedSaleProduct()
  }
  const handleChosenBuyingProduct = (product) => {
    saleStore.setBuyingSaleProduct(product)
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
            saleStore.setListSaleProduct(null)
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
            saleStore.setListSaleProduct(null)
            resetForm()
          }
        })
    }
  }
  const handleCancelConfirm = () => {
    setVisibleConfirm(false)
    setPayloadExecution(null)
  }
  const handleChangeInputProductAccount = (e) => {
    console.log(e.target.value)
    const inputValue = e.target.value

  }
  // endregion
  // region function render ====================
  const packInfoOverLay = (item) => {
    return (
      <PackInfoOverlay>
        {/*<PackInfoImage>*/}
        {/*  <img src={ICONS.PACK_DETAIL_INFO} alt={''} height={40} />*/}
        {/*</PackInfoImage>*/}
        <ColorTitleNoBg
          color={'#333'}
          textAlign={'center'}
          fontWeight={600}
          fontSize={'1.6rem'}
          marginTop={'8px'}
          marginBottom={'0'}
        >
          {item.Detail && JSON.parse(item.Detail)?.package}
        </ColorTitleNoBg>
        <Divider />
        <PackInfoTable>
          <PackInfoTableItem>
            <ColorText color={'#B4B4B4'}>
              Lưu lượng
            </ColorText>
            <ColorText fontWeight={600}>
              {JSON.parse(item.Detail)?.capacity}
            </ColorText>
          </PackInfoTableItem>
          <PackInfoTableItem>
            <ColorText color={'#B4B4B4'}>
              Thời hạn
            </ColorText>
            <ColorText fontWeight={600}>
              {JSON.parse(item.Detail)?.session}
            </ColorText>
          </PackInfoTableItem>
          <PackInfoTableItem>
            <ColorText color={'#B4B4B4'}>
              Giá cước
            </ColorText>
            <ColorText fontWeight={600}>
              {numberUtils.thousandSeparator(item.PriceAmount)}đ
            </ColorText>
          </PackInfoTableItem>
        </PackInfoTable>
        <ColorText color={'#B4B4B4'}>
          Lưu ý
        </ColorText>
        <ul
          style={{ color: '#222', marginTop: 16 }}
          dangerouslySetInnerHTML={{ __html: JSON.parse(item.Detail)?.noteDetail }}>

        </ul>
        {/*<PackInfoNotice>- Chiết khấu <ColorText color={appTheme.solidColor}>30%</ColorText> chỉ còn <ColorText*/}
        {/*  color={appTheme.solidColor}>12.000đ</ColorText> khi đăng ký qua Ví điện tử PayMobi.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- Gói Data chỉ áp dụng cho các thuê bao di động MobiFone trả trước/trả sau.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- Hạn dùng được tính từ ngày đăng ký cho đến đủ 30 ngày.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- Sau khi hết data của gói khách hàng sẽ không thể tiếp tục truy cập.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- Gói Data tự động gia hạn khi hết chu kỳ.</PackInfoNotice>*/}
        {/*<PackInfoButton*/}
        {/*  type={'primary'}*/}
        {/*  block*/}
        {/*>*/}
        {/*  <ColorTitleNoBg color={'#fff'} fontWeight={'600'} textAlign={'center'}>12,000đ</ColorTitleNoBg>*/}
        {/*  <ColorText color={'#ffffffb5'}>Đăng ký qua Ví điện tử PayMobi</ColorText>*/}
        {/*</PackInfoButton>*/}
        {/*<PackInfoButton*/}
        {/*  type={'default'}*/}
        {/*  block*/}
        {/*>*/}
        {/*  <ColorTitleNoBg color={appTheme.solidColor} fontWeight={'600'} textAlign={'center'}>15,000đ</ColorTitleNoBg>*/}
        {/*  <ColorText color={'#B4B4B4'}>Đăng ký qua tài khoản viễn thông</ColorText>*/}
        {/*</PackInfoButton>*/}
      </PackInfoOverlay>
    )
  }
  // endregion
  // region side effect ========================

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
    let productAccountSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductAccount
    let productIDSaved = JSON.parse(editingExecution?.executionData)?.PaymentInfo?.ProductID
    formPayBill.setFieldsValue({
      productAccount: productAccountSaved,
    })
    setProductAccount(productAccountSaved)
    let payload = { ProductServiceID: ProductServiceID, ProductAccount: productAccountSaved }
    saleStore.getSaleProducts(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS && res?.param?.length > 0) {
          saleStore.setSelectedSaleProduct(res?.param[0])
          let buyingProductSaved = res?.param[0]?.childs.find(x => x.ProductID === productIDSaved)
          saleStore.setBuyingSaleProduct(buyingProductSaved)
        }
      })

  }, [editingExecution])

  useEffect(() => {
    if (selectedPaymentObj && buyingSaleProduct) {
      setValidForm(true)
    } else {
      setValidForm(false)
    }
  }, [selectedPaymentObj, buyingSaleProduct])

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
      <PackDataPageWrapper>
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
                    <Form.Item name={'productAccount'} noStyle>
                      <TextInput
                        value={inputProductAccount}
                        onChange={handleChangeInputProductAccount}
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
                        placeholder='Nhập số điện thoại' />
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
                            allowHover
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
                    Danh sách gói
                  </ColorTitleNoBg>
                  {
                    selectedSaleProduct
                      ?
                      <Scrollbars
                        autoHeight
                        autoHeightMin={0}
                        autoHeightMax={300}>
                        <ScrollBarsWrapper>
                          <Row gutter={[16, 16]}>

                            {
                              selectedSaleProduct?.childs?.map(item =>
                                <Col key={item?.ProductID} xxl={8} xl={12} lg={12} md={24} sm={24} xs={24}>
                                  <PackItem
                                    flexDirection={'column'}
                                    padding={'16px'}
                                    active={buyingSaleProduct?.ProductID === item?.ProductID}
                                    onClick={() => handleChosenBuyingProduct(item)}
                                    appTheme={appTheme}>
                                    <PackInfoWrapperData>
                                      <img
                                        src={item?.Logo}
                                        alt={''}
                                        height={48}
                                        width={48} />
                                      <PackInfoData>
                                        <Tooltip
                                          title={
                                            item.Detail && JSON.parse(item.Detail)?.package
                                          }
                                          mouseEnterDelay={0.5}>
                                          <PackDataText fontWeight={600}>
                                            {item.Detail && JSON.parse(item.Detail)?.package}
                                          </PackDataText>
                                        </Tooltip>
                                        <Tooltip title={item?.SubProductName} mouseEnterDelay={0.5}>
                                          <PackDataText color={'#707070'}>
                                            {item?.SubProductName}
                                          </PackDataText>
                                        </Tooltip>
                                      </PackInfoData>
                                    </PackInfoWrapperData>
                                    <Divider style={{ margin: '16px 0', width: '80%' }} />
                                    <PackPriceWrapper>
                                      <PackDataText>
                                        <ColorTitleNoBg
                                          color={'#222'}>
                                          Giá gói cước: {numberUtils.thousandSeparator(item?.PriceAmount)}đ
                                          <ColorStrikeText
                                            color={'#979797'}
                                            margin={'0 0 0 8px'}>
                                            ({numberUtils.thousandSeparator(item?.ParValue)}đ)
                                          </ColorStrikeText>
                                        </ColorTitleNoBg>
                                      </PackDataText>
                                    </PackPriceWrapper>
                                    <PackInfoIconWrapper>
                                      <Tooltip
                                        // visible={true}
                                        color={'#fff'}
                                        placement='right'
                                        overlayClassName={'tooltip-pack-data'}
                                        title={() => packInfoOverLay(item)}
                                      >
                                        <img src={ICONS.PACK_INFO} alt={''} width={16} height={16} />
                                      </Tooltip>
                                    </PackInfoIconWrapper>
                                  </PackItem>
                                </Col>,
                              )
                            }
                          </Row>
                        </ScrollBarsWrapper>
                      </Scrollbars>
                      :
                      <EmptyProduct description={'Vui lòng nhập số điện thoại để hiển thị danh sách gói data'} />
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
          title={editingExecution ? 'Xác nhận sửa yêu cầu mua gói data' : 'Xác nhận mua gói data'}
          visible={visibleConfirm} />
      </PackDataPageWrapper>
    </>

  )
}

PackDataPage.propTypes = {}

export default inject(
  'commonStore',
  'saleStore',
  'orderStore',
  'paymentStore',
  'accountWalletStore',
  'authenticationStore',
  'bankStore')(observer(PackDataPage))