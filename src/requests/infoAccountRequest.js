import axios from 'axios'
import { apiUrl } from '../config'
import authenticationStore from '../stores/authenticationStore'
const source = axios.CancelToken.source()
export const infoAccountRequest = {

  getInfoAccount: () => {
    return axios({
      method: 'get',
      url: `${apiUrl}/InfoAccount`,
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