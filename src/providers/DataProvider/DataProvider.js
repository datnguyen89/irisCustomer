import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import commonStore from '../../stores/commonStore'
import { wsUrl } from '../../config'
import {
  BANKSERVICETYPE,
  ERROR_COLOR,
  ERROR_TITLE,
  EXECUTION_STATUS, FULL_DATE,
  MESSAGE_ACTION,
  PAGES,
  SOCKET_ACTION,
} from '../../utils/constant'
import { useHistory } from 'react-router-dom'
import authenticationStore from '../../stores/authenticationStore'
import { Modal, notification } from 'antd'
import { ColorText } from '../../components/CommonStyled/CommonStyled'
import moment from 'moment'
import cypherUtil from '../../utils/cypherUtil'
import { minuteScaleOnClick } from '../../config'

const signalR = require('@microsoft/signalr')

const DataProvider = props => {
  // region props, hook, state =================
  const {
    children,
    profileStore,
    authenticationStore,
    commonStore,
    propertyStore,
    socketStore,
    saleStore,
    bankStore,
  } = props

  const [message, setMessage] = useState(null)
  const history = useHistory()
  // endregion
  // region destructuring ======================
  const { accessToken, tokenKey } = authenticationStore
  const { isRefresh, firstLoadToken, pageName } = commonStore

  let {
    viewingExecutionID,
  } = socketStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleScaleExpiredTime = () => {
    localStorage.setItem('expired', cypherUtil.base64Encrypt(moment().add(minuteScaleOnClick, 'minutes').format(FULL_DATE)))
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!authenticationStore.accessToken) return
    const connect = new signalR.HubConnectionBuilder()
      .withUrl(wsUrl, {
        skipNegotiation: true,
        accessTokenFactory: () => authenticationStore.accessToken,
        transport: signalR.HttpTransportType.WebSockets,
      })
      .configureLogging(signalR.LogLevel.Debug)
      .withAutomaticReconnect()
      .build()
    authenticationStore.setConnection(connect)
  }, [authenticationStore.accessToken])
  useEffect(() => {
    if (!authenticationStore.connection) return
    if (authenticationStore.connection._connectionState !== 'Disconnected') return
    authenticationStore.connection
      .start()
      .then(() => {
        console.log('Connected!')
        authenticationStore.connection.on('ReceiveMessage', (message) => {
          console.log(message)
          setMessage(message)
        })
        authenticationStore.connection.on('RefreshAccessToken', (message) => {
          console.log(message)
          authenticationStore.setAccessToken(message)
        })
        authenticationStore.connection.on('NotifyInactive', (message) => {
          if (message === 0) {
            authenticationStore.logout()
              .finally(() => {
                history.push(PAGES.LOGIN.PATH)
                notification.error({
                  message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
                  description: 'Tài khoản của bạn đã ngừng hoạt động',
                })
              })
          }
        })
      })
      .catch((error) => console.log(error))
  }, [
    authenticationStore.connection,
  ])
  useEffect(() => {
    if (!message) return
    switch (message?.action) {
      case SOCKET_ACTION.HANDLE_TRANS_MULTI_RESULT:
        let data = JSON.parse(message?.data)
        if (data?.executionID === viewingExecutionID) {
          socketStore.setDataViewingExecution(data)
        }
        break
      default:
        break
    }
  }, [
    message,
  ])
  useEffect(() => {
    if (!firstLoadToken) return
    if (!tokenKey || !accessToken) return
    console.log('tokenKey', tokenKey)
    console.log('accessToken', accessToken)
    // commonStore.getMyIp()
    propertyStore.getCommonProperty()
    authenticationStore.getUserProfile()
    profileStore.getProfile()
    commonStore.setFirstLoadToken(false)
    saleStore.getHomeProducts()
  }, [tokenKey, accessToken, firstLoadToken])

  useEffect(() => {
    console.log('UPDATE TIME 12/05/2022 11:00')
    return () => {
      profileStore.clearProfile()
    }
  }, [])

  useEffect(() => {
    const intervalId = setInterval(() => {
      if (!localStorage.getItem('expired')) {
        localStorage.setItem('expired', cypherUtil.base64Encrypt(moment().add(minuteScaleOnClick, 'minutes').format(FULL_DATE)))
      }
      let exp = moment(cypherUtil.base64Decrypt(localStorage.getItem('expired')), FULL_DATE)
      let now = moment()
      // console.log(exp.format(FULL_DATE), '--', now.format(FULL_DATE))
      if (exp.isBefore(now)) {
        if (authenticationStore.accessToken) {
          authenticationStore.logout()
            .finally(() => {
              history.push({
                pathname: PAGES.LOGIN.PATH,
                state: { from: window.location.pathname },
              })
            })
          notification.destroy()
          Modal.destroyAll()
          notification.error({
            message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
            description: 'Phiên đăng nhập hết hạn',
          })
        }
      } else {
        // Xử lý khi còn hạn
      }
    }, [1000])
    return () => {
      clearInterval(intervalId)
    }
  }, [])
  // endregion

  return (
    <div onClick={handleScaleExpiredTime}>
      {children}
    </div>
  )
}

DataProvider.propTypes = {}

export default inject(
  'profileStore',
  'authenticationStore',
  'commonStore',
  'bankStore',
  'socketStore',
  'saleStore',
  'propertyStore')(observer(DataProvider))