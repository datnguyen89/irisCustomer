import React, { useEffect } from 'react'
import { apiUrl } from './config'
import { deviceDetect } from 'react-device-detect'
// Axios
import axios from 'axios'
// Encrypt
import cypherUtil from './utils/cypherUtil'
// ability
// util
import stringUtils from './utils/stringUtils'
// provider
import DataProvider from './providers/DataProvider'
// Styling
import './App.less'
import ThemeProvider from './providers/ThemeProvider'
import LoadingOverLay from './components/LoadingOverLay'
// React Router
import { Redirect, Route, Router, Switch } from 'react-router-dom'
import { createBrowserHistory } from 'history'
// MobX
import { Provider } from 'mobx-react'
import commonStore from './stores/commonStore.js'
import mobileMoneyStore from './stores/mobileMoneyStore.js'
import infoAccountStore from './stores/infoAccountStore.js'
import testStore from './stores/testStore.js'
import profileStore from './stores/profileStore.js'
import authenticationStore from './stores/authenticationStore.js'
import accountWalletStore from './stores/accountWalletStore'
import providerStore from './stores/providerStore'
import mobileNetworkOperatorStore from './stores/mobileNetworkOperatorStore'
import bankStore from './stores/bankStore'
import orderStore from './stores/orderStore'
import propertyStore from './stores/propertyStore'
import paymentStore from './stores/paymentStore'
import reportStore from './stores/reportStore'
import socketStore from './stores/socketStore'
import saleStore from './stores/saleStore'
//moment
import moment from 'moment'
import 'moment/locale/vi'
import {
  CLOSE_TEXT,
  ERROR_COLOR,
  ERROR_TITLE, LONG_DATE,
  PAGES,
  RESPONSE_CODE,
  RESULT_TRANSACTION_TITLE,
  WARNING_COLOR,
  WARNING_TITLE,
} from './utils/constant'
import NotFoundPage from './pages/NotFoundPage'
import AuthModule from './modules/AuthModule'
import PublicModule from './modules/PublicModule'
import ProtectedModule from './modules/ProtectedModule'
import { Descriptions, message, Modal, notification } from 'antd'
import { ColorText, RowCenterDiv } from './components/CommonStyled/CommonStyled'
import publicIp from 'public-ip'
import { CloseCircleOutlined } from '@ant-design/icons'
import numberUtils from './utils/numberUtils'
import dateUtils from './utils/dateUtils'


const history = createBrowserHistory()

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !localStorage.getItem('jwt') ? (
        <Redirect
          to={{
            pathname: PAGES.LOGIN.PATH,
            state: { from: window.location.pathname },
          }}
        />
      ) : (
        <Component {...props} />
      )
    }
  />
)

moment.locale('en', {
  week: {
    dow: 1,
  },
})

message.config({
  duration: 5,
  top: 50,
  maxCount: 1,
})
notification.config({
  duration: 5,
  top: 60,
  maxCount: 1,
  placement: 'top',
})

const rootStores = {
  commonStore,
  mobileMoneyStore,
  infoAccountStore,
  authenticationStore,
  accountWalletStore,
  providerStore,
  mobileNetworkOperatorStore,
  testStore,
  profileStore,
  bankStore,
  orderStore,
  propertyStore,
  paymentStore,
  reportStore,
  socketStore,
  saleStore,
}

axios.defaults.timeout = 1800000

let isAlreadyFetchingAccessToken = false
let subscribers = []
const addSubscriber = (callback) => {
  subscribers.push(callback)
}
const onAccessTokenFetched = (token) => {
  subscribers = subscribers.filter((callback) => callback(token))
}

const handleRefreshToken = (originalRequest) => {
  if (!isAlreadyFetchingAccessToken) {
    isAlreadyFetchingAccessToken = true
    new Promise((resolve, reject) => {
      return authenticationStore.handleRefreshToken({ RefreshToken: localStorage.getItem('refreshToken') })
        .then((res) => {
          if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
            isAlreadyFetchingAccessToken = false
            onAccessTokenFetched(res?.param)
          } else {
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
            return reject(error?.message)
          }
        })
        .catch((error) => {
          isAlreadyFetchingAccessToken = false
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
          return reject(error?.message)
        })
    })
  }
  const retryOriginalRequest = new Promise(
    (resolve) => {
      addSubscriber((token) => {
        originalRequest.headers.Authorization = 'Bearer ' + token
        return resolve(axios(originalRequest))
      })
    },
  )
  return retryOriginalRequest
}

axios.defaults.headers.common['X-Frame-Options'] = 'DENY'
const getUniqueId = () => {
  let uniqueId = localStorage.getItem('UniqueId')
  if (uniqueId) {
    return uniqueId
  } else {
    let newUniqueId = stringUtils.randomId(16)
    localStorage.setItem('UniqueId', newUniqueId)
    return newUniqueId
  }

}
axios.defaults.headers.common['Device'] = JSON.stringify({
  'DeviceId': deviceDetect()?.userAgent,
  'DeviceType': 13,
  'SystemName': deviceDetect()?.osName,
  'SystemVersion': deviceDetect()?.osVersion,
  'UniqueId': getUniqueId(),
  'DeviceName': deviceDetect()?.browserName,
})
axios.defaults.headers.common['HostClient'] = window.location.host
axios.interceptors.request.use(
  config => {
    if (config.disabledSpinner) {
      commonStore.setAppLoading(false)
    } else {
      commonStore.setAppLoading(true)
    }
    console.log('REQUEST', config.url.replace(apiUrl, ''), config.data)
    if (config._retry) {
      // Nếu là retry sau khi refresh token thì cho đi luôn vì đã mã hóa rồi
      console.log('Nếu là retry sau khi refresh token thì cho đi luôn vì đã mã hóa rồi')
      return config
    }
    let k = stringUtils.randomId(16)
    let obj = { key: k, iv: k }
    let strDataKey = JSON.stringify(obj)
    let strData = JSON.stringify({ ...config.data })
    let encryptedDataKey = cypherUtil.rsaEncrypt(strDataKey)
    let encryptedData = cypherUtil.aesEncrypt(strData, k, k)

    if (!config.disabledEncrypted) {
      config.data = { data: encryptedData, objKey: encryptedDataKey }
    }

    return config
  },
  error => {
    commonStore.setAppLoading(false)
    return Promise.reject(error)
  },
)


axios.interceptors.response.use(
  response => {
    commonStore.setAppLoading(false)
    console.log('RESPONSE', response.config.url.replace(apiUrl, ''), response)
    switch (response.data.responseCode) {
      case RESPONSE_CODE.SUCCESS:
      case RESPONSE_CODE.LOGIN_REQUEST_OTP:
      case RESPONSE_CODE.REQUIRE_CONFIRM_BANK:
      case RESPONSE_CODE.REQUIRE_OTP:
      case RESPONSE_CODE.REQUIRE_WALLET_PASSWORD:
      case RESPONSE_CODE.PAYMENT_ORDER_QUESTIONABLE:
      case RESPONSE_CODE.PAYMENT_TRANSACTION_PENDING:
      case RESPONSE_CODE.PAYMENT_TRANSACTION_UNKNOW:
      case RESPONSE_CODE.PAYMENT_TRANSACTION_ERROR:
      case RESPONSE_CODE.EXECUTION_PAYMENT_INFO_CHANGED:
      case 1:
      case 2:
      case 3:
        break
      case 401:
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
        break
      default:
        if (!response?.data?.ip) {
          notification.destroy()
          Modal.destroyAll()
          if (response?.data?.paymentResultDetailModel) {
            Modal.info({
              className: 'custom-notice',
              width: 600,
              title: RESULT_TRANSACTION_TITLE,
              okText: CLOSE_TEXT,
              onOk: () => {
              },
              onCancel: () => {
              },
              content:
                <>
                  <RowCenterDiv margin={'16px 0'}>
                    <CloseCircleOutlined style={{ fontSize: 32, color: ERROR_COLOR }} />
                    <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={ERROR_COLOR}>
                      {response.data?.description}
                    </ColorText>
                  </RowCenterDiv>

                  <Descriptions
                    bordered
                    column={1}
                    labelStyle={{ width: '35%' }}
                    contentStyle={{ width: '65%' }}
                    size={'small'}>
                    <Descriptions.Item label={'Số tiền'}>
                      <strong>
                        {numberUtils.thousandSeparator(response.data?.paymentResultDetailModel?.grandAmount)}đ
                      </strong>
                    </Descriptions.Item>
                    <Descriptions.Item label={
                      (response.data?.paymentResultDetailModel?.transactionId && response.data?.paymentResultDetailModel?.transactionId != 0)
                        ? 'Mã giao dịch'
                        : 'Mã đối soát'
                    }>
                      {(response.data?.paymentResultDetailModel?.transactionId && response.data?.paymentResultDetailModel?.transactionId != 0)
                        ? response.data?.paymentResultDetailModel?.transactionId
                        : response.data?.paymentResultDetailModel?.paymentOrderID}
                    </Descriptions.Item>
                    <Descriptions.Item label={'Thời gian'}>
                      {response.data?.paymentResultDetailModel?.createdTime ? dateUtils.convertToStrDate(response.data?.paymentResultDetailModel?.createdTime, LONG_DATE) : ''}
                    </Descriptions.Item>
                  </Descriptions>
                </>,
            })
          } else {
            notification.error({
              message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
              description: response.data?.description,
            })
          }
        }
        break
    }
    return response
  },
  error => {
    const originalConfig = error.config
    commonStore.setAppLoading(false)
    notification.destroy()
    Modal.destroyAll()

    if (error instanceof axios.Cancel) {

    } else {
      switch (error?.response?.status) {
        case 401:
          if (!originalConfig._retry) {
            originalConfig._retry = true
            return handleRefreshToken(originalConfig)
          } else {
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
            return
          }
        case 403:
          notification.warning({
            message: <ColorText fontSize={'20px'} color={WARNING_COLOR}>{WARNING_TITLE}</ColorText>,
            description: 'Bạn không có quyền sử dụng chức năng này',
          })
          break
        case 404:
          notification.error({
            message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
            description: 'Chức năng không tồn tại',
          })
          break
        case 500:
          notification.error({
            message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
            description: 'Có lỗi xảy ra vui lòng liên hệ admin',
          })
          break
        default:
          notification.error({
            message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
            description: error?.message,
          })
          break
      }
    }

    return Promise.reject(error)
  },
)


const App = () => {
  useEffect(() => {
    publicIp.v4()
      .then(res => {
        commonStore.setIpAddress(res)
      })
  }, [])

  return (
    <Provider {...rootStores}>
      <ThemeProvider>
        <Router history={history}>
          <DataProvider>
            <Switch>
              <Route
                exact path={[
                PAGES.LOGIN.PATH,
                PAGES.FORGOT_PASSWORD.PATH,
              ]}
                component={AuthModule}
              />
              <Route
                exact path={[
                PAGES.TEST.PATH,
                PAGES.NOT_PERMISSION.PATH,
              ]}
                component={PublicModule}
              />
              <ProtectedRoute
                exact path={[
                PAGES.HOME.PATH,
                PAGES.IDENTITY.PATH,
                PAGES.TRANSACTION_MANAGE.PATH,
                PAGES.TRANSACTION_HISTORY.PATH,
                PAGES.TERM_OF_USE.PATH,
                PAGES.SUPPORT.PATH,
                PAGES.ABOUT_US.PATH,
                PAGES.CONTACT.PATH,
                PAGES.POLICY.PATH,

                `${PAGES.PAY_BILL.PATH}/:ProductServiceID`,
                `${PAGES.PREPAID.PATH}/:ProductServiceID`,
                `${PAGES.POSTPAID.PATH}/:ProductServiceID`,
                `${PAGES.PHONE_CARD.PATH}/:ProductServiceID`,
                `${PAGES.PACK_DATA.PATH}/:ProductServiceID`,

                PAGES.PHONE_DATA.PATH,
                PAGES.CARD_DATA.PATH,
                PAGES.WATER_BILL.PATH,

                PAGES.DEPOSIT.PATH,
                PAGES.TRANSFER_WALLET.PATH,
                PAGES.TRANSFER_MULTIPLE.PATH,
                PAGES.WITHDRAW_FROM_MM.PATH,
                PAGES.DEPOSIT_TO_MM.PATH,
                PAGES.LINK_BANK.PATH,
                PAGES.ADD_LINK.PATH,
                PAGES.WITHDRAW.PATH,
                PAGES.REPORT_SUMMARY.PATH,
                PAGES.REPORT_DETAIL.PATH,
                PAGES.REPORT_STATEMENT.PATH,
                PAGES.LIMIT_SETTING.PATH,
                PAGES.RESULT_TRANSACTION.PATH,
                PAGES.DEPOSIT_EDIT.PATH,
                PAGES.WITHDRAW_EDIT.PATH,
                PAGES.TRANSFER_WALLET_EDIT.PATH,
                PAGES.DEPOSIT_MM_EDIT.PATH,
                PAGES.WITHDRAW_MM_EDIT.PATH,
                PAGES.TRANSFER_MULTIPLE_EDIT.PATH,

              ]}
                component={ProtectedModule} />

              <Route component={NotFoundPage} />
            </Switch>
          </DataProvider>
        </Router>
        <LoadingOverLay />
      </ThemeProvider>
    </Provider>
  )
}

export default App
