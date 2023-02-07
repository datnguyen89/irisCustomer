import React from 'react'
import PropTypes from 'prop-types'
import { LimitSettingPageWrapper } from './LimitSettingPageStyled'
import DefaultLayout from '../../layouts/DefaultLayout/DefaultLayout'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BREADCRUMB_DATA } from '../../utils/constant'

const LimitSettingPage = props => {
  return (
    <>
      <Helmet>
        <title>Cài đặt hạn mức</title>
      </Helmet>
      <LimitSettingPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.LIMIT_SETTING} />
        Cài đặt hạn mức
      </LimitSettingPageWrapper>
    </>
  )
}

LimitSettingPage.propTypes = {

}

export default LimitSettingPage