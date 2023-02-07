import React, { useEffect, useState } from 'react'
import {
  ImageProviderArea, ImgWrapper, ProviderWrapper, SearchImg, SearchInputPhoneNumber,
} from './SearchMobileNetworkOperatorPostPaidStyled'
import { inject, observer } from 'mobx-react'
import HorizontalScroll from 'react-scroll-horizontal'
import { toJS } from 'mobx'
import ScrollbarCustomProviders from '../ScrollbarCustomProviders'

const _ = require('lodash')

const SearchMobileNetworkOperatorPostPaid = props => {
  const { selectedProvider, handleSelectedProvider, phoneNumber, setPhoneNumber, customerStore, mobileNetworkOperatorStore, setCustomer } = props


  useEffect(() => {
    mobileNetworkOperatorStore.getServicePlanMobile();
  }, []);

  const handleOnChange = (value) => {
    setPhoneNumber(value.target.value);
  }

  const handleSearchCustomer = () => {
    if (phoneNumber !== "") {
      customerStore.getCustomerByPhoneNumber(phoneNumber)
        .then(res => {
          let itemMatched = toJS(mobileNetworkOperatorStore.mobileNetworkOperators).find(item => item.id === toJS(res).customerNetworkMobileId);
          if (itemMatched) {
            handleSelectedProvider(itemMatched);
            setCustomer(res);
          }
        })
    } else {
      setCustomer(null);
    }
  }
  const handlerSetSelectProvider = (value) => {
    handleSelectedProvider(value);
  }
                         
  return (
    <ProviderWrapper>
      <SearchInputPhoneNumber placeholder={"Nhập số điện thoại"} onChange={(value) => handleOnChange(value)} />
      <SearchImg src={require('../../media/icons/search_cus.png')} alt={"search_cus"} onClick={handleSearchCustomer}/>
      <ScrollbarCustomProviders selectedProvider={selectedProvider} handlerSetSelectProvider={handlerSetSelectProvider} data={mobileNetworkOperatorStore.mobileNetworkOperators}/>
    </ProviderWrapper>
  )
}

SearchMobileNetworkOperatorPostPaid.propTypes = {
}

export default inject('mobileNetworkOperatorStore', 'customerStore')(observer(SearchMobileNetworkOperatorPostPaid))