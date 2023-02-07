import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { BREADCRUMB_DATA } from '../../utils/constant'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import HomeServices from '../../components/HomeServices'
import { HomePageWrapper } from './HomePageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import { toJS } from 'mobx'

const HomePage = props => {
  const { saleStore } = props
  const {
    listSaleProduct,
  } = saleStore
  useEffect(() => {
    console.log('listSaleProduct', toJS(listSaleProduct))
  }, [listSaleProduct])
  return (
    <>
      <Helmet>
        <title>Trang chủ</title>
      </Helmet>
      <HomePageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.HOME} />
        {/*<HomeWidgets />*/}
        <HomeServices />
        {/*<CarouselWrapper>*/}
        {/*  <img src={IMAGES.HOME_CAROUSEL} alt={''} />*/}
        {/*</CarouselWrapper>*/}
      </HomePageWrapper>
    </>
  )
}

HomePage.propTypes = {}

export default inject('commonStore', 'saleStore')(observer(HomePage))