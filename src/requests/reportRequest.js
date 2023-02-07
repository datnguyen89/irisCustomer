import axios from 'axios'
import { apiUrl } from '../config'
import authenticationStore from '../stores/authenticationStore'
import commonStore from '../stores/commonStore'

const source = axios.CancelToken.source()

export const reportRequest = {
  cancelRequest: () => {
    source.cancel()
  },
  // region Sum
  exportCustomerBillingReportsSum: (payload, source) => {
    return axios({
      disabledSpinner: true,
      method: 'post',
      url: `${apiUrl}/ExportExcelCustomerBillingReportsSum`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
      cancelToken: source.token,
    })
  },
  getCustomerBillingReportsSum: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetCustomerBillingReportsSum`,
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

  // endregion

  // region Detail
  exportCustomerBillingReportsDetail: (payload, source) => {
    return axios({
      disabledSpinner: true,
      method: 'post',
      url: `${apiUrl}/ExportExcelCustomerBillingReportsDetail`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
      cancelToken: source.token,
    })
  },
  getCustomerBillingReportsDetail: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetCustomerBillingReportsDetail`,
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
  loadBatchExecutionFilesByAccountID: (payload) => {
    return axios({
      disabledSpinner: true,
      method: 'post',
      url: `${apiUrl}/LoadBatchExecutionFilesByAccountID`,
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
  // endregion

  // region Statement
  getStatementReport: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetStatementReport`,
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
  getStatementReportExcel: (payload, source) => {
    return axios({
      disabledSpinner: true,
      method: 'post',
      url: `${apiUrl}/GetStatementReportExcel`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
      cancelToken: source.token,
    })
  },
  getStatementReportPdf: (payload, source) => {
    return axios({
      disabledSpinner: true,
      method: 'post',
      url: `${apiUrl}/GetStatementReportPDF`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authenticationStore.accessToken || ''}`,
        'Token-Core-System': `Bearer ${authenticationStore.tokenKey || ''}`,
        'Ent-Token-System': `Bearer ${authenticationStore.entTokenKey || ''}`,
        'Ip-Address': commonStore.ipAddress,
      },
      data: payload,
      cancelToken: source.token,
    })
  },

  // endregion

  // region common
  getSysVarForReport: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/GetSysVarForReport`,
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
  loadSysvar: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/LoadSysvar`,
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

  getInfoAccountNameForReport: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/getInfoAccountNameForReport`,
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
  loadDepartmentsByUser: (payload) => {
    return axios({
      method: 'get',
      url: `${apiUrl}/LoadDepartmentsByUser`,
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
  loadAccountsByMemberID: (payload) => {
    return axios({
      method: 'post',
      url: `${apiUrl}/LoadAccountsByMemberID`,
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

  // endregion
}
