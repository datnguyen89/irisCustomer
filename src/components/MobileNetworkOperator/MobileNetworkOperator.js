import React, { useEffect } from 'react'
import {
  ImageProviderArea, ProviderWrapper, ScrollbarsCustom,
  TitlePickProviders,
} from './MobileNetworkOperatorStyled'
import { inject, observer } from 'mobx-react'
import ScrollbarCustomProviders from '../ScrollbarCustomProviders'

const _ = require('lodash')

const MobileNetworkOperator = props => {
  const { mobileNetworkOperatorStore, selectedProvider, handleSelectedProvider } = props


  useEffect(() => {
    mobileNetworkOperatorStore.getMobileNetworkOperators()
  }, [])

  const handlerSetSelectProvider = (value) => {
    handleSelectedProvider(value)
  }

  return (
    <ProviderWrapper>
      <TitlePickProviders>Chọn nhà cung cấp</TitlePickProviders>
      <ScrollbarCustomProviders selectedProvider={selectedProvider} handlerSetSelectProvider={handlerSetSelectProvider} data={mobileNetworkOperatorStore.mobileNetworkOperators}/>
    </ProviderWrapper>
  )
}

MobileNetworkOperator.propTypes = {}

export default inject('mobileNetworkOperatorStore')(observer(MobileNetworkOperator))