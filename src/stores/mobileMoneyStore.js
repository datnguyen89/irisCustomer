import { action, observable } from 'mobx'
import { authenticationRequest } from '../requests/authenticationRequest'

class mobileMoneyStore {
  @observable MMUserInfo = null
  @action getMMUserInfo = (payload) => {
    return new Promise((resolve, reject) => {
      if (payload.mobileMoneyAccount === '1') {
        this.MMUserInfo = { Id: 1, name: 'Nguyễn Văn A', passport: '0123456789' }
      } else {
        this.MMUserInfo = null
      }
      resolve()
    })
  }
}

export default new mobileMoneyStore()