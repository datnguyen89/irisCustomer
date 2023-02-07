import React from 'react'
import PropTypes from 'prop-types'
import { AboutUsPageWrapper } from './AboutUsPageStyled'
import DefaultLayout from '../../layouts/DefaultLayout'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BREADCRUMB_DATA } from '../../utils/constant'

const AboutUsPage = props => {
  return (
    <>
      <Helmet>
        <title>Giới thiệu</title>
      </Helmet>
      <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.ABOUT_US} />
      <AboutUsPageWrapper>
        AboutUs
      </AboutUsPageWrapper>
    </>

  )
}

AboutUsPage.propTypes = {

}

export default AboutUsPage