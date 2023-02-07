import React, { useEffect } from 'react'
import { inject, observer } from 'mobx-react'
import { GlobalStyle } from './ThemeProviderStyled'
import { useTranslation } from 'react-i18next'
import { useMediaQuery } from 'react-responsive/src'
import { DEVICE } from '../../utils/constant'
import viVN from 'antd/es/locale/vi_VN'
import { ConfigProvider } from 'antd'

const ThemeProvider = props => {
  // region props, hook, state =================
  const { commonStore, children } = props
  const { i18n } = useTranslation()
  const isDesktop = useMediaQuery({ minWidth: 1024 })
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 1023 })
  const isMobile = useMediaQuery({ maxWidth: 767 })
  // endregion
  // region destructuring ======================
  const { isCollapse } = commonStore

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    i18n.changeLanguage(commonStore.appLanguage)
  }, [commonStore.appLanguage])
  useEffect(() => {
    if (!isDesktop) return
    commonStore.setDevice(DEVICE.DESKTOP)
  }, [isDesktop])
  useEffect(() => {
    if (!isTablet) return
    commonStore.setDevice(DEVICE.TABLET)
  }, [isTablet])
  useEffect(() => {
    if (!isMobile) return
    commonStore.setDevice(DEVICE.MOBILE)
  }, [isMobile])
  // endregion

  return (
    <ConfigProvider locale={viVN}>
      <GlobalStyle
        theme={commonStore.appTheme}
      />
      {children}
    </ConfigProvider>
  )
}

export default inject('commonStore')(observer(ThemeProvider))
