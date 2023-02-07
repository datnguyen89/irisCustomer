import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { ResultTransactionPageWrapper } from './ResultTransactionPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import { BREADCRUMB_DATA, PAGES } from '../../utils/constant'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { useHistory } from 'react-router-dom'
import { useQuery } from '../../hooks/useQuery'

const ResultTransactionPage = props => {
  // region props, hook, state =================
  let query = useQuery()
  const history = useHistory()
  // endregion
  // region destructuring ======================
  const { bankStore } = props

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!query) return

    let payload = {
      OrderID: isNaN(Number(query.get('OrderID'))) ? 0 : Number(query.get('OrderID')),
      ResponseCode: isNaN(Number(query.get('ResponseCode'))) ? 0 : Number(query.get('ResponseCode')),
      Data: query.get('Data')
    }
    bankStore.callbackLinkBank(payload)
      .then(res => {
        bankStore.setDataCallback({
          BankAmount: Number(query.get('BankAmount')),
          Data: query.get('Data'),
          OrderID: query.get('OrderID'),
          ResponseCode: query.get('ResponseCode'),
          Result: query.get('Result'),
          Signature: query.get('Signature'),
          AccountName: query.get('AccountName'),
          Description: res?.description,
        })
        history.push(PAGES.TRANSACTION_MANAGE.PATH)
      })
  }, [query])
  // endregion

  return (
    <>
      <Helmet>
        <title>Kết quả giao dịch</title>
      </Helmet>
      <ResultTransactionPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.RESULT_TRANSACTION} />

      </ResultTransactionPageWrapper>
    </>
  )
}

ResultTransactionPage.propTypes = {}

export default inject('bankStore')(observer(ResultTransactionPage))