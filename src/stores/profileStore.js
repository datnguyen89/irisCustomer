import { action, autorun, observable } from 'mobx'
import { profileRequest } from '../requests/profileRequest'
import { RESPONSE_CODE } from '../utils/constant'
import stringUtils from '../utils/stringUtils'

class profileStore {
  constructor() {
    autorun(() => {
      this.entUserFullName = this.entUserProfile ? this.entUserProfile?.fullName : undefined
    })
    autorun(() => {
      this.entUserAvatar = this.entUserProfile ? this.entUserProfile?.avatar : undefined
    })
    autorun(() => {
      this.currUserName = this.entUserProfile ? this.entUserProfile?.accountName : undefined
    })
  }
  @observable currUserName = undefined
  @observable entUserProfile = undefined
  @observable entUserFullName = undefined
  @observable entUserAvatar = undefined
  @observable entProfile = undefined
  @action clearProfile = () => {
    this.entUserProfile = undefined
    this.entProfile = undefined
  }

  @action getProfile = () => {
    return new Promise((resolve, reject) => {
      profileRequest.getProfile()
        .then(response => {
          if (response.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            let param = JSON.parse(response.data?.param)
            this.entUserProfile = param?.user
            this.entProfile = param?.enterprize
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

}

export default new profileStore()
