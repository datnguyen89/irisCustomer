import axios from 'axios'
import { apiUrl } from '../config'
import authenticationStore from '../stores/authenticationStore'
import commonStore from '../stores/commonStore'

const source = axios.CancelToken.source()

export const profileRequest = {
  cancelRequest: () => {
    source.cancel()
  },
  getProfile: () => {
    return axios({
      method: 'get',
      url: `${apiUrl}/GetProfile`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
    })
  },

}
