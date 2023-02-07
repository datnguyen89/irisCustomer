import React, { useEffect } from 'react'
import {
  DiscountText,
  ProviderWrapper,
  TagProvider, TitlePickProviders, TopupVoucherContent, TopupVoucherData, TopupVoucherPrice, TopupVouchersArea,
} from './ServicePlanMobileDataStyled'
import { inject, observer } from 'mobx-react'
import numberUtils from '../../utils/numberUtils'

const _ = require('lodash')

const ServicePlanMobileData = props => {
  const { mobileNetworkOperatorStore, selectedTopUpVoucher, handleSelectedTopUpVoucher } = props


  useEffect(() => {
    mobileNetworkOperatorStore.getTopUpVoucher();
  }, []);

  const handlerSetSelectTopUpVoucher = (value) => {
    handleSelectedTopUpVoucher(value);
  }

  return (
    <ProviderWrapper>
      <TitlePickProviders>Chọn mệnh giá</TitlePickProviders>
      <TagProvider>
        {
          mobileNetworkOperatorStore.topUpVouchers.map(item =>
            <TopupVouchersArea span={6} onClick={() => handlerSetSelectTopUpVoucher(item)} key={item.id}>
                <TopupVoucherContent
                  borderColor={item.id === selectedTopUpVoucher?.id ? '#0465B0' : '#E0E0E0'}
                  color={item.id === selectedTopUpVoucher?.id ? '#0465B0' : '#333333'}>
                  <TopupVoucherPrice>
                    <h4>{numberUtils.thousandSeparator(item.denominations)}<span>đ</span></h4>
                    <DiscountText colorText={item.id === selectedTopUpVoucher?.id ? '#0465B0' : '#B4B4B4'}>{numberUtils.thousandSeparator(item.discount)}<span>đ</span></DiscountText>
                  </TopupVoucherPrice>
                  <TopupVoucherData>
                    <h5>{item.data}/</h5>
                    <h6>{item.rangeTimeValid}</h6>
                  </TopupVoucherData>
                </TopupVoucherContent>
            </TopupVouchersArea>
          )
        }
      </TagProvider>
    </ProviderWrapper>
  )
}

ServicePlanMobileData.propTypes = {
}

export default inject('mobileNetworkOperatorStore')(observer(ServicePlanMobileData))