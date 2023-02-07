import { action, autorun, observable } from 'mobx'
import { infoAccountRequest } from '../requests/infoAccountRequest'
import { accountWalletRequest } from '../requests/accountWalletRequest'
import { RESPONSE_CODE } from '../utils/constant'

class accountWalletStore {
  constructor() {
    autorun(() => {
    })
  }

  @observable accountWallets = []
  @observable selectedAccountWallets = null
  @action setSelectedAccountWallets = account => {
    this.selectedAccountWallets = account
  }
   @action setSelectedAccountWalletsByAccountName = accountName => {
    this.selectedAccountWallets = this.accountWallets?.find(item => item.accountName === accountName)
  }

  @action resetSelectedAccountWallets = () => {
    this.selectedAccountWallets = this.accountWallets[0]
  }

  @action getAccountWallets = (payload) => {
    return new Promise((resolve, reject) => {
      accountWalletRequest.getAccountsBusiness(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            let accounts = JSON.parse(response?.data?.param)
            this.accountWallets = accounts
            this.selectedAccountWallets = (accounts && accounts?.length) > 0 ? accounts[0] : {}
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @action setAccountWallets = (arr) => {
    this.accountWallets = arr
  }


}

export default new accountWalletStore()