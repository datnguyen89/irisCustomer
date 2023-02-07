import { action, observable } from 'mobx'
import { bankRequest } from '../requests/bankRequest'
import { RESPONSE_CODE } from '../utils/constant'

class bankStore {

  // region CallBackFromBank
  @observable dataCallback = null
  @action setDataCallback = (e) => {
    this.dataCallback = e
  }
  // endregion

  @observable listBanks = []
  @observable listBankLinkable = []
  @observable selectedBank = null
  @action setSelectedBank = e => {
    this.selectedBank = e
  }
  @action setListBankLinkable = e => {
    this.listBankLinkable = e
  }
  @action getBanks = (payload) => {
    return new Promise((resolve, reject) => {
      bankRequest.getBanks(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            let param = JSON.parse(response?.data?.param)
            // Bỏ các bank đã link
            let listLinkedBanksCode = this.listLinkedBanks?.map(item => item.bankCode)
            // let listBanks = param?.banks.filter(item => !listLinkedBanksCode?.includes(item.bankCode) && item.linkable === true)
            let listBanks = param?.banks.filter(item => !listLinkedBanksCode?.includes(item.bankCode))
            let listBankLinkable = param?.bankLinkable.filter(item => !listLinkedBanksCode?.includes(item.bankCode))
            console.log(listBanks)
            this.listBanks = listBanks
            this.listBankLinkable = listBankLinkable
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable listLinkedBanks = null
  @observable selectedLinkedBank = null
  @action setSelectedLinkedBank = e => {
    this.selectedLinkedBank = e
  }
  @action setSelectedLinkedBankByBankCode = (bankCode) => {
    this.selectedLinkedBank = this.listLinkedBanks?.find(item => item.bankCode === bankCode)
  }
  @action resetSelectedLinkedBank = () => {
    this.selectedLinkedBank = this.listLinkedBanks?.length > 0 ? this.listLinkedBanks[0] : null
  }
  @action getLinkBanks = (params) => {
    return new Promise((resolve, reject) => {
      bankRequest.getLinkBanks(params)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            let param = response?.data?.param
            this.listLinkedBanks = param
            this.selectedLinkedBank = param?.length > 0 ? param[0] : null
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @action callbackLinkBank = (payload) => {
    return new Promise((resolve, reject) => {
      bankRequest.callbackLinkBank(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
}

export default new bankStore()
