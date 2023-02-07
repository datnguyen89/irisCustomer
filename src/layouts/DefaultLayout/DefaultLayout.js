import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { DefaultLayoutWrapper } from './DefaultLayoutStyled'
import MainSideBar from '../../components/MainSideBar'
import MainContent from '../../components/MainContent/MainContent'
import MainHeader from '../../components/MainHeader'
import MainBody from '../../components/MainBody'
import MainFooter from '../../components/MainFooter'
import { useHistory, useLocation } from 'react-router-dom'
import { ERROR_COLOR, ERROR_TITLE, FULL_DATE, PAGES } from '../../utils/constant'
import LoadingExportPopUp from '../../components/LoadingExportPopUp'
import moment from 'moment'
import cypherUtil from '../../utils/cypherUtil'
import authenticationStore from '../../stores/authenticationStore'
import { Modal, notification } from 'antd'
import { ColorText } from '../../components/CommonStyled/CommonStyled'

const DefaultLayout = props => {
  // region props, hook, state =================
  const { children, commonStore, authenticationStore } = props
  const location = useLocation()
  const history = useHistory()

  // endregion
  // region destructuring ======================
  const { roles } = authenticationStore

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============


  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    // console.log('location.pathname', location.pathname)
    const segment = location.pathname.split(PAGES.HOME.PATH).filter(item => item !== '')
    if (segment.length === 0) {
      commonStore.setPageName('home')
    } else {
      commonStore.setPageName(segment[0])
    }
  }, [location.pathname])
  // endregion

  return (
    <DefaultLayoutWrapper
      color={commonStore.appTheme.solidColor}>
      <MainHeader />
      <MainContent>
        <MainSideBar />
        <MainBody>
          {children}
          <MainFooter />
        </MainBody>
      </MainContent>
      <LoadingExportPopUp />
    </DefaultLayoutWrapper>
  )
}

DefaultLayout.propTypes = {}

export default inject('commonStore', 'authenticationStore')(observer(DefaultLayout))