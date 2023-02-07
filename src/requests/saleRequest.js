import axios from 'axios'
import { apiUrl } from '../config'
import authenticationStore from '../stores/authenticationStore'
import commonStore from '../stores/commonStore'

const source = axios.CancelToken.source()

export const saleRequest = {
  cancelRequest: () => {
    source.cancel()
  },
  getHomeProducts: (payload) => {
    return axios({
      method: 'get',
      url: `${apiUrl}/GetHomeProducts`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      params: payload,
    })
  },
  getSaleProducts: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetSaleProducts`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
    })
  },
  checkTelCo: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/CheckTelCo`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
    })
  },
  getProductDetail: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetProductDetail`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
    })
  },
  partnerCheckAccount: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/PartnerCheckAccount`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
    })
  },
  getTotalPaidAmount: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetSaleProducts`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
    })
  },
  getListPackageData: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetListPackageData`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
    })
  },
  getInfoBuyProduct: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetInfoBuyProduct`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
    })
  },


}
