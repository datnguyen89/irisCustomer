import { action, observable } from 'mobx'
import { commonRequest } from '../requests/commonRequest'
import { THEME_LIST } from '../utils/constant'

class commonStore {
  @observable appLoading = 0
  @action setAppLoading = status => {
    if (status) {
      this.appLoading = this.appLoading + 1
    } else {
      if (this.appLoading > 0) {
        this.appLoading = this.appLoading - 1
      }
    }
  }
  @observable firstLoadToken = true
  @action setFirstLoadToken = status => {
    this.firstLoadToken = status
  }
  @observable pageName = ''
  @action setPageName = name => {
    this.pageName = name
  }
  // Device
  @observable device = null

  @action setDevice(device) {
    this.device = device
  }

  // ipAddress
  @observable ipAddress = localStorage.getItem('ipAddress') || ''
  @action resetIpAddress = () => {
    this.ipAddress = null
  }
  @action setIpAddress = (ip) => {
    this.ipAddress = ip
    localStorage.setItem('ipAddress', ip)
  }

  // App theme
  @observable appTheme = THEME_LIST[0]
  @action setTheme = name => {
    let newTheme = THEME_LIST.find(item => item.name === name)
    console.log(newTheme)
    if (newTheme) {
      this.appTheme = newTheme
    } else {
      this.appTheme = THEME_LIST[0]
    }
  }

  // Mouse coordinate
  @observable mouseCoordinate = {
    x: 0,
    y: 0,
  }

  @action setMouseCoordinate(x, y) {
    this.mouseCoordinate = { x: x, y: y }
  }

  // App language
  @observable appLanguage = 'vi'

  @action setAppLanguage(lang) {
    this.appLanguage = lang
  }

  // Sidebar collapse
  @observable isCollapse = JSON.parse(localStorage.getItem('isCollapse')) || false

  @action setIsCollapse(status) {
    localStorage.setItem('isCollapse', status)
    this.isCollapse = status
  }

  @action resendOtpActive = (payload) => {
    return new Promise((resolve, reject) => {
      commonRequest.resendOtpActive(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action resendOtpTransaction = (payload) => {
    return new Promise((resolve, reject) => {
      commonRequest.resendOtpTransaction(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }


}

export default new commonStore()
