import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { MainContentWrapper } from './MainContentStyled'

const MainContent = props => {
  const { children, commonStore } = props

  return (
    <MainContentWrapper>
      {children}
    </MainContentWrapper>
  )
}

MainContent.propTypes = {}
export default inject('commonStore')(observer(MainContent))