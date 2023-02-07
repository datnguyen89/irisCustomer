import React from 'react'
import { inject, observer } from 'mobx-react'
import { LoadingOverLayWrapper } from './LoadingOverLayStyled'
import { Spin } from 'antd'

const LoadingOverLay = props => {
  // region props, hook, state =================
  const { commonStore } = props

  // endregion
  // region destructuring ======================
  const { appLoading } = commonStore

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
    appLoading > 0 &&
    <LoadingOverLayWrapper>
      <Spin size={'large'} />
    </LoadingOverLayWrapper>
  )
}

export default inject('commonStore')(observer(LoadingOverLay))