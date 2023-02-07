import React from 'react'
import PropTypes from 'prop-types'
import { ContactPageWrapper } from './ContactPageStyled'
import DefaultLayout from '../../layouts/DefaultLayout'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BREADCRUMB_DATA } from '../../utils/constant'

const ContactPage = props => {
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
        <title>Liên hệ</title>
      </Helmet>
      <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.CONTACT} />
      <ContactPageWrapper>
        ContactPage
      </ContactPageWrapper>
    </>

  )
}

ContactPage.propTypes = {

}

export default ContactPage