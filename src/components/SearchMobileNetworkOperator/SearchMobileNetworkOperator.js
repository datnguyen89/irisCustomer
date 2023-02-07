import React, { useEffect } from 'react'
import {
  ImageProviderArea, ImgWrapper, ProviderWrapper, ScrollbarsCustom, SearchInputPhoneNumber,
} from './SearchMobileNetworkOperatorStyled'
import { inject, observer } from 'mobx-react'
import { Scrollbars } from 'react-custom-scrollbars'
import ScrollbarCustomProviders from '../ScrollbarCustomProviders'

const _ = require('lodash')

const SearchMobileNetworkOperator = props => {
  const {
    mobileNetworkOperatorStore,
    selectedProvider,
    handleSelectedProvider,
    setPhoneNumber,
  } = props

  useEffect(() => {
    mobileNetworkOperatorStore.getServicePlanMobile()
  }, [])

  const handlerSetSelectProvider = (value) => {
    handleSelectedProvider(value)
  }

  const handleOnChange = (value) => {
    setPhoneNumber(value.target.value)
  }

  return (
    <ProviderWrapper>
      <SearchInputPhoneNumber placeholder={'Nhập số điện thoại'} onChange={(value) => handleOnChange(value)} />
      <ScrollbarCustomProviders selectedProvider={selectedProvider} handlerSetSelectProvider={handlerSetSelectProvider}
                                data={mobileNetworkOperatorStore.mobileNetworkOperators} />
    </ProviderWrapper>
  )
}

SearchMobileNetworkOperator.propTypes = {}

export default inject('mobileNetworkOperatorStore')(observer(SearchMobileNetworkOperator))