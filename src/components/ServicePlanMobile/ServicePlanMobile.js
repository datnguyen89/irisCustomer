import React, { useEffect } from 'react'
import {
  DiscountText,
  ProviderWrapper,
  TagProvider, TitlePickProviders, TopupVoucherContent, TopupVouchersArea,
} from './ServicePlanMobileStyled'
import { inject, observer } from 'mobx-react'
import numberUtils from '../../utils/numberUtils'

const _ = require('lodash')

const ServicePlanMobile = props => {
  const { mobileNetworkOperatorStore, selectedTopUpVoucher, handleSelectedTopUpVoucher, title } = props


  useEffect(() => {
    mobileNetworkOperatorStore.getTopUpVoucher()
  }, [])

  const handlerSetSelectTopUpVoucher = (value) => {
    handleSelectedTopUpVoucher(value)
  }

  return (
    <ProviderWrapper>
      <TitlePickProviders>{title}</TitlePickProviders>
      <TagProvider>
        {
          mobileNetworkOperatorStore.topUpVouchers.map(item =>
            <TopupVouchersArea span={6} onClick={() => handlerSetSelectTopUpVoucher(item)} key={item.id}>
              <TopupVoucherContent borderColor={item.id === selectedTopUpVoucher?.id ? '#0465B0' : '#E0E0E0'}
                                   color={item.id === selectedTopUpVoucher?.id ? '#0465B0' : '#333333'}>
                <h4>{numberUtils.thousandSeparator(item.denominations)}<span>đ</span></h4>
                <DiscountText
                  colorText={item.id === selectedTopUpVoucher?.id ? '#0465B0' : '#B4B4B4'}>{numberUtils.thousandSeparator(item.discount)}<span>đ</span></DiscountText>
              </TopupVoucherContent>
            </TopupVouchersArea>,
          )
        }
      </TagProvider>
    </ProviderWrapper>
  )
}

ServicePlanMobile.propTypes = {}

export default inject('mobileNetworkOperatorStore')(observer(ServicePlanMobile))