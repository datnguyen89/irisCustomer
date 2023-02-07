import { action, autorun, observable } from 'mobx'
import { paymentRequest } from '../requests/paymentRequest'
import { RESPONSE_CODE } from '../utils/constant'

class paymentStore {
  // region Common
  // Lấy phí giao dịch
  @action getFee = (payload) => {
    return new Promise((resolve, reject) => {
      paymentRequest.getFee(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }


  // Lấy thông tin tài khoản theo số điện thoại hoặc số tài khoản
  @observable transactionUserInfo = null
  @observable transactionUserType = null
  @action resetTransactionUserInfo = () => {
    this.transactionUserInfo = null
    this.transactionUserType = null
  }
  @action checkUserInfo = (payload) => {
    return new Promise((resolve, reject) => {
      paymentRequest.checkUserInfo(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.transactionUserInfo = response?.data?.param?.fullName
            this.transactionUserType = response?.data?.param?.userType
          } else {
            this.transactionUserInfo = null
            this.transactionUserType = null
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable transactionUserMMInfo = null
  @observable transactionUserMMType = null
  @action resetTransactionUserMMInfo = e => {
    this.transactionUserMMInfo = e
    this.transactionUserMMType = e
  }
  @action checkUserMMInfo = (payload) => {
    return new Promise((resolve, reject) => {
      paymentRequest.checkUserMMInfo(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.transactionUserMMInfo = response?.data?.param?.fullName
            this.transactionUserMMType = response?.data?.param?.userType
          } else {
            this.transactionUserMMInfo = null
            this.transactionUserMMType = null
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getCardDetail = (payload) => {
    return new Promise((resolve, reject) => {
      paymentRequest.getCardDetail(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion
}

export default new paymentStore()
