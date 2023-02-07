import React from 'react'
import PropTypes from 'prop-types'
import { SupportPageWrapper } from './SupportPageStyled'
import DefaultLayout from '../../layouts/DefaultLayout'
import { Helmet } from 'react-helmet/es/Helmet'
import { BREADCRUMB_DATA } from '../../utils/constant'
import MainBreadCrumb from '../../components/MainBreadCrumb'

const SupportPage = props => {
  // region props, hook, state =================

  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <>
      <Helmet>
        <title>Trợ giúp</title>
      </Helmet>
      <SupportPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.SUPPORT} />
        SupportPage
      </SupportPageWrapper>
    </>

  )
}

SupportPage.propTypes = {

}

export default SupportPage