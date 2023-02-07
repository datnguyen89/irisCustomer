import React from 'react'
import { CardDataPageWrapper } from './CardDataPageStyled'
import { Helmet } from 'react-helmet/es/Helmet'
import MainBreadCrumb from '../../components/MainBreadCrumb'
import { BREADCRUMB_DATA } from '../../utils/constant'
import { WhiteRoundedBox } from '../../components/CommonStyled/CommonStyled'
import { inject, observer } from 'mobx-react'

const CardDataPage = props => {
  // region props, hook, state =================
  const { commonStore } = props
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
        <title>Mã thẻ data</title>
      </Helmet>
      <CardDataPageWrapper>
        <MainBreadCrumb breadcrumbData={BREADCRUMB_DATA.CARD_DATA} />
        <WhiteRoundedBox>

        </WhiteRoundedBox>
      </CardDataPageWrapper>

    </>

  )
}

CardDataPage.propTypes = {}

export default inject('commonStore')(observer(CardDataPage))