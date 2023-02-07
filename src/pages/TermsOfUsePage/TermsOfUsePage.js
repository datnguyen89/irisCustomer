import React from 'react'
import PropTypes from 'prop-types'
import { TermsOfUsePageWrapper } from './TermsOfUsePageStyled'
import DefaultLayout from '../../layouts/DefaultLayout'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BREADCRUMB_DATA } from '../../utils/constant'

const TermsOfUsePage = props => {
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
        <title>Điều khoản sử dụng</title>
      </Helmet>
      <TermsOfUsePageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.TERM_OF_USE} />
        TermsOfUsePage
      </TermsOfUsePageWrapper>
    </>
  )
}

TermsOfUsePage.propTypes = {}

export default TermsOfUsePage