import { action, autorun, observable } from 'mobx'
import { saleRequest } from '../requests/saleRequest'
import { PAYMENT_TYPE, RESPONSE_CODE } from '../utils/constant'
import accountWalletStore from './accountWalletStore'

class saleStore {

  @observable listHomeProduct = null

  @action getHomeProducts = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.getHomeProducts(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listHomeProduct = response?.data?.param
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @observable selectedPaymentObj = null // Ví hoặc ngân hàng liên kết đã chọn
  @observable selectedPaymentType = null

  @observable listSaleProduct = null
  @observable selectedSaleProduct = null
  @action setSelectedSaleProduct = e => {
    this.selectedSaleProduct = e
  }
  @action setListSaleProduct = e => {
    this.listSaleProduct = e
  }
  @observable buyingSaleProduct = null
  @action resetSelectedSaleProduct = () => {
    this.selectedSaleProduct = null
    this.buyingSaleProduct = null
    this.selectedPaymentObj = accountWalletStore.accountWallets ? accountWalletStore.accountWallets[0] : null
    this.selectedPaymentType = accountWalletStore.accountWallets ? PAYMENT_TYPE.WALLET : null
  }
  @action setBuyingSaleProduct = e => {
    this.buyingSaleProduct = e
  }
  @action setSelectedPaymentMethod = (paymentObj, paymentType) => {
    this.selectedPaymentObj = paymentObj
    this.selectedPaymentType = paymentType
  }
  @action getSaleProducts = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.getSaleProducts(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listSaleProduct = response?.data?.param
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action checkTelCo = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.checkTelCo(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getProductDetail = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.getProductDetail(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable checkedAccountInfo = null
  @action setCheckedAccountInfo = e => {
    this.checkedAccountInfo = e
  }
  @action partnerCheckAccount = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.partnerCheckAccount(payload)
        .then(response => {
          if (response?.data?.responseCode === 1) {
            this.checkedAccountInfo = response?.data?.param
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getTotalPaidAmount = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.getTotalPaidAmount(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getListPackageData = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.getListPackageData(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getInfoBuyProduct = (payload) => {
    return new Promise((resolve, reject) => {
      saleRequest.getInfoBuyProduct(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

}

export default new saleStore()
