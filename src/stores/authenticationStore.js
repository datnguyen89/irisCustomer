import { action, autorun, observable } from 'mobx'
import { authenticationRequest } from '../requests/authenticationRequest'
import userStore from './profileStore'
import { RESPONSE_CODE } from '../utils/constant'
import stringUtils from '../utils/stringUtils'
import commonStore from './commonStore'

class authenticationStore {
  constructor() {
    autorun(() => {
      this.jwtDecode = this.accessToken ? stringUtils.jwtDecode(this.accessToken) : undefined
    })

    autorun(() => {
      this.roles = this.jwtDecode ? this.jwtDecode?.role : undefined
    })
  }

  @observable connection = null

  @action setConnection = (e) => {
    this.connection = e
  }

  @observable jwtDecode = undefined
  @observable roles = undefined
  @observable accessToken = localStorage.getItem('jwt') || undefined
  @observable refreshToken = localStorage.getItem('refreshToken') || undefined
  @observable tokenKey = localStorage.getItem('tokenKey') || undefined
  @observable entTokenKey = localStorage.getItem('entTokenKey') || undefined

  @action setAccessToken = token => {
    this.accessToken = token
    localStorage.setItem('jwt', token)
  }

  @action checkRole = e => {
    if (!this.roles || this.roles?.length === 0) return false
    if (typeof this.roles === 'string') {
      return e === this.roles
    } else {
      return this.roles.includes(e)
    }

  }
  @action checkMultipleRole = e => {
    // Check nếu có ít nhất 1 quyền trong e thì hiển thị
    if (!this.roles || this.roles?.length === 0) return false
    if (typeof this.roles === 'string') {
      return e.includes(this.roles)
    } else {
      return this.roles.some(r => e.includes(r))
    }
  }

  @action userLogin = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.userLogin(payload)
        .then(response => {
          switch (response.data?.responseCode) {
            case RESPONSE_CODE.SUCCESS:
              let param = response.data?.param
              const tokenData = param?.token
              const tokenKeyData = param?.tokenKey
              const entTokenKeyData = param?.entTokenKey
              const refreshToken = param?.refreshToken

              const jwtDecodeData = tokenData ? stringUtils.jwtDecode(tokenData) : undefined
              const rolesData = jwtDecodeData ? jwtDecodeData?.role : undefined

              localStorage.setItem('jwt', tokenData)
              localStorage.setItem('tokenKey', tokenKeyData)
              localStorage.setItem('entTokenKey', entTokenKeyData)
              localStorage.setItem('refreshToken', refreshToken)

              this.accessToken = tokenData
              this.tokenKey = tokenKeyData
              this.entTokenKey = entTokenKeyData
              this.refreshToken = refreshToken

              this.jwtDecode = jwtDecodeData
              this.roles = rolesData
              break
            default:
              break
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action handleRefreshToken = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.refreshToken(payload)
        .then(response => {
          switch (response.data?.responseCode) {
            case RESPONSE_CODE.SUCCESS:
              const tokenData = response.data?.param
              console.log(tokenData)
              const jwtDecodeData = tokenData ? stringUtils.jwtDecode(tokenData) : undefined
              const rolesData = jwtDecodeData ? jwtDecodeData?.role : undefined

              localStorage.setItem('jwt', tokenData)

              this.accessToken = tokenData
              this.jwtDecode = jwtDecodeData
              this.roles = rolesData
              break
            default:
              break
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action activeDevice = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.activeDevice(payload)
        .then(response => {
          switch (response.data?.responseCode) {
            case RESPONSE_CODE.SUCCESS:
              let param = response.data?.param
              const tokenData = param?.token
              const tokenKeyData = param?.tokenKey
              const entTokenKeyData = param?.entTokenKey
              const refreshToken = param?.refreshToken

              const jwtDecodeData = tokenData ? stringUtils.jwtDecode(tokenData) : undefined
              const rolesData = jwtDecodeData ? jwtDecodeData?.role : undefined

              localStorage.setItem('jwt', tokenData)
              localStorage.setItem('tokenKey', tokenKeyData)
              localStorage.setItem('entTokenKey', entTokenKeyData)
              localStorage.setItem('refreshToken', refreshToken)

              this.accessToken = tokenData
              this.tokenKey = tokenKeyData
              this.entTokenKey = entTokenKeyData
              this.refreshToken = refreshToken

              this.jwtDecode = jwtDecodeData
              this.roles = rolesData
              break
            default:
              break
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action transferExtendDataForChangePassword = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.transferExtendDataForChangePassword(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action changePasswordForCustomer = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.changePasswordForCustomer(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action logout = () => {
    return new Promise((resolve, reject) => {
      authenticationRequest.logout()
        .then(response => {
          this.accessToken = undefined
          this.tokenKey = undefined
          this.entTokenKey = undefined
          this.refreshToken = undefined

          this.jwtDecode = undefined
          this.roles = undefined

          localStorage.removeItem('jwt')
          localStorage.removeItem('tokenKey')
          localStorage.removeItem('entTokenKey')
          localStorage.removeItem('ipAddress')
          localStorage.removeItem('refreshToken')

          userStore.clearProfile()
          commonStore.resetIpAddress()
          commonStore.setFirstLoadToken(true)
          resolve()
        })
        .catch(error => reject(error))
    })
  }
  @action transferExtendDataForResetPassword = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.transferExtendDataForResetPassword(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action enterInfoForResetPasswordCustomer = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.enterInfoForResetPasswordCustomer(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action resetPasswordCustomer = (payload) => {
    return new Promise((resolve, reject) => {
      authenticationRequest.resetPasswordCustomer(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable userProfile = undefined
  @action getUserProfile = () => {
    return new Promise((resolve, reject) => {
      authenticationRequest.getUserProfile()
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.userProfile = JSON.parse(response?.data?.param)
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

}

export default new authenticationStore()
