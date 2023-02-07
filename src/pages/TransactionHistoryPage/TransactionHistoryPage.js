import React from 'react'
import PropTypes from 'prop-types'
import { TransactionHistoryPageWrapper } from './TransactionHistoryPageStyled'
import DefaultLayout from '../../layouts/DefaultLayout'
import { Helmet } from 'react-helmet/es/Helmet'
import { BREADCRUMB_DATA } from '../../utils/constant'
import MainBreadCrumb from '../../components/MainBreadCrumb'

const TransactionHistoryPage = props => {
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
        <title>Lịch sử giao dịch</title>
      </Helmet>
      <TransactionHistoryPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.TRANSACTION_HISTORY} />
        TransactionHistoryPage
      </TransactionHistoryPageWrapper>
    </>
  )
}

TransactionHistoryPage.propTypes = {

}

export default TransactionHistoryPage