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
                ProductTypeName: param?.productData?.parentName, // T??n lo???i s???n ph???m
                ProductName: param?.productData?.productName, // T??n s???n ph???m
                Fund: fund, // Ngu???n ti???n
                CustomerName: '',
                CustomerAddress: '',
                ProductFee: param?.productData?.fee, // Ph?? b??n h??ng
                Discount: param?.productData?.discount > 0 ? `${numberUtils.thousandSeparator(param?.productData?.discount) + '?? '}` + `(${productDiscount?.rateAmount > 0 ? productDiscount?.rateAmount + '%' : ''}${(productDiscount?.rateAmount > 0 && productDiscount?.fixAmount > 0) ? ' + ' : ''}${productDiscount?.fixAmount > 0 ? numberUtils.thousandSeparator(productDiscount?.fixAmount) + '??' : ''})` : '',
                TransferFee: param?.paymentFee, // Ph?? giao d???ch
                TotalAmount: param?.productData?.priceAmount, // Gi?? sau khi t??nh ph??, chi???t kh???u
                OriginalAmount: param?.productData?.parValue, // Gi?? g???c
                TotalAmountToPaid: param?.productData?.priceAmount + param?.paymentFee, // priceAmount + paymentFee
                PeriodPayment: radioPack?.dataInfo?.map(x => x.period + ' ')?.toString(), // K??? thanh to??n
                ProductID: buyingSaleProduct?.ProductID,
                ProductCode: buyingSaleProduct?.ProductCode,
                ProductAccount: productAccount, // Thu?? bao ho???c s??? h??a ????n
                Quantity: null, //s??? l?????ng (truy???n n???u mua sp c?? s??? l?????ng. VD: m?? th???)
                ParValue: null, // s??? ti???n thanh to??n (tr?????ng h???p tr??? sau)
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
              name: 'M???nh gi??',
              value: numberUtils.thousandSeparator(Number(param?.productData?.parValue)) + '??',
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
    setProductAccount(newProductAccount)
    let payload = { ProductServiceID: ProductServiceID, ProductAccount: newProductAccount }
    saleStore.getSaleProducts(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS && res?.param?.length > 0) {
          saleStore.setSelectedSaleProduct(res?.param[0])
        } else {
          notification.info({
            message: <ColorText fontSize={'20px'} color={INFO_COLOR}>{INFO_TITLE}</ColorText>,
            description: 'Kh??ng c?? g??i data n??o ph?? h???p v???i s??? thu?? bao c???a b???n',
          })
        }
      })
    // // L???y danh s??ch g??i data hi???n c??
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
            saleStore.resetSelectedSaleProduct()
            saleStore.setListSaleProduct(null)
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
              L??u l?????ng
            </ColorText>
            <ColorText fontWeight={600}>
              {JSON.parse(item.Detail)?.capacity}
            </ColorText>
          </PackInfoTableItem>
          <PackInfoTableItem>
            <ColorText color={'#B4B4B4'}>
              Th???i h???n
            </ColorText>
            <ColorText fontWeight={600}>
              {JSON.parse(item.Detail)?.session}
            </ColorText>
          </PackInfoTableItem>
          <PackInfoTableItem>
            <ColorText color={'#B4B4B4'}>
              Gi?? c?????c
            </ColorText>
            <ColorText fontWeight={600}>
              {numberUtils.thousandSeparator(item.PriceAmount)}??
            </ColorText>
          </PackInfoTableItem>
        </PackInfoTable>
        <ColorText color={'#B4B4B4'}>
          L??u ??
        </ColorText>
        <ul
          style={{ color: '#222', marginTop: 16 }}
          dangerouslySetInnerHTML={{ __html: JSON.parse(item.Detail)?.noteDetail }}>

        </ul>
        {/*<PackInfoNotice>- Chi???t kh???u <ColorText color={appTheme.solidColor}>30%</ColorText> ch??? c??n <ColorText*/}
        {/*  color={appTheme.solidColor}>12.000??</ColorText> khi ????ng k?? qua V?? ??i???n t??? PayMobi.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- G??i Data ch??? ??p d???ng cho c??c thu?? bao di ?????ng MobiFone tr??? tr?????c/tr??? sau.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- H???n d??ng ???????c t??nh t??? ng??y ????ng k?? cho ?????n ????? 30 ng??y.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- Sau khi h???t data c???a g??i kh??ch h??ng s??? kh??ng th??? ti???p t???c truy c???p.</PackInfoNotice>*/}
        {/*<PackInfoNotice>- G??i Data t??? ?????ng gia h???n khi h???t chu k???.</PackInfoNotice>*/}
        {/*<PackInfoButton*/}
        {/*  type={'primary'}*/}
        {/*  block*/}
        {/*>*/}
        {/*  <ColorTitleNoBg color={'#fff'} fontWeight={'600'} textAlign={'center'}>12,000??</ColorTitleNoBg>*/}
        {/*  <ColorText color={'#ffffffb5'}>????ng k?? qua V?? ??i???n t??? PayMobi</ColorText>*/}
        {/*</PackInfoButton>*/}
        {/*<PackInfoButton*/}
        {/*  type={'default'}*/}
        {/*  block*/}
        {/*>*/}
        {/*  <ColorTitleNoBg color={appTheme.solidColor} fontWeight={'600'} textAlign={'center'}>15,000??</ColorTitleNoBg>*/}
        {/*  <ColorText color={'#B4B4B4'}>????ng k?? qua t??i kho???n vi???n th??ng</ColorText>*/}
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
                        placeholder='Nh???p s??? ??i???n tho???i' />
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
                    Danh s??ch g??i
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
                                          Gi?? g??i c?????c: {numberUtils.thousandSeparator(item?.PriceAmount)}??
                                          <ColorStrikeText
                                            color={'#979797'}
                                            margin={'0 0 0 8px'}>
                                            ({numberUtils.thousandSeparator(item?.ParValue)}??)
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
                      <EmptyProduct description={'Vui l??ng nh???p s??? ??i???n tho???i ????? hi???n th??? danh s??ch g??i data'} />
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
          title={editingExecution ? 'X??c nh???n s???a y??u c???u mua g??i data' : 'X??c nh???n mua g??i data'}
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