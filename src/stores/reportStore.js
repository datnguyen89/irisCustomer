import { action, autorun, observable } from 'mobx'
import { reportRequest } from '../requests/reportRequest'
import moment from 'moment'
import { RESPONSE_CODE, STRING_DATE } from '../utils/constant'

class reportStore {

  // region Sum

  @observable listTransTypeForReportSum = null
  @action getListTransTypeForReportSum = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.loadSysvar(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listTransTypeForReportSum = response?.data?.sysvar
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable exportSumLoading = false
  @action setExportSumLoading = e => {
    this.exportSumLoading = e
  }

  @observable listPayTypeForReportSum = null
  @action getPayTypeForReportSum = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.getSysVarForReport(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listPayTypeForReportSum = response?.data?.sysVar
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable listAccountNameForReportSum = null
  @action getInfoAccountNameForReportSum = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.getInfoAccountNameForReport(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listAccountNameForReportSum = response?.data?.infoAccountName
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @observable listDepartmentsByUserSum = null
  @action loadDepartmentsByUserSum = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.loadDepartmentsByUser(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listDepartmentsByUserSum = response?.data?.deptItems
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable objFilterSum = {
    Fromdate: moment().startOf('month').format(STRING_DATE),
    Todate: moment().format(STRING_DATE),
    PayType: 'ALL',
    AccountID: 0,
    CreatedOrg: 'ALL',
    TranType: 0,
    PageSize: 50,
    PageIndex: 1,
  }
  @observable objExportSum = {
    Fromdate: moment().startOf('month').format(STRING_DATE),
    Todate: moment().format(STRING_DATE),
    PayType: 'ALL',
    AccountID: 0,
    CreatedOrg: 'ALL',
    TranType: 0,
    PageSize: 1000000000,
    PageIndex: 1,
    CompanyName: '',
  }

  @observable totalCountSum = 0
  @observable listBillingReportsSum = null

  @action resetBillingReportsSum = () => {
    this.totalCountSum = 0
    this.listBillingReportsSum = null
    this.objFilterSum = {
      Fromdate: moment().startOf('month').format(STRING_DATE),
      Todate: moment().format(STRING_DATE),
      PayType: 'ALL',
      AccountID: 0,
      CreatedOrg: 'ALL',
      TranType: 0,
      PageSize: 50,
      PageIndex: 1,
    }
    this.objExportSum = {
      Fromdate: moment().startOf('month').format(STRING_DATE),
      Todate: moment().format(STRING_DATE),
      PayType: 'ALL',
      AccountID: 0,
      CreatedOrg: 'ALL',
      TranType: 0,
      PageSize: 1000000000,
      PageIndex: 1,
      CompanyName: '',
    }
  }

  @action getCustomerBillingReportsSum = () => {
    return new Promise((resolve, reject) => {
      reportRequest.getCustomerBillingReportsSum(this.objFilterSum)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listBillingReportsSum = response?.data?.reports
            this.totalCountSum = response?.data?.infoResult?.TotalRecords
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable sourceCancelSum = null
  @action exportCustomerBillingReportsSum = (source) => {
    return new Promise((resolve, reject) => {
      this.sourceCancelSum = source
      reportRequest.exportCustomerBillingReportsSum(this.objExportSum, source)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // endregion

  // region Detail
  @observable exportDetailLoading = false
  @action setExportDetailLoading = e => {
    this.exportDetailLoading = e
  }

  @observable listTransTypeForReportDetail = null
  @action getListTransTypeForReportDetail = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.loadSysvar(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listTransTypeForReportDetail = response?.data?.sysvar
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable listDepartmentsByUserDetail = null
  @action loadDepartmentsByUserDetail = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.loadDepartmentsByUser(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listDepartmentsByUserDetail = response?.data?.deptItems
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @observable listPayTypeForReportDetail = null
  @action getPayTypeForReportDetail = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.getSysVarForReport(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listPayTypeForReportDetail = response?.data?.sysVar
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @observable listOrderStatusCodeForReportDetail = null
  @action getOrderStatusCodeForReportDetail = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.getSysVarForReport(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listOrderStatusCodeForReportDetail = response?.data?.sysVar
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable listAccountNameForReportDetail = null
  @action getInfoAccountNameForReportDetail = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.getInfoAccountNameForReport(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listAccountNameForReportDetail = response?.data?.infoAccountName
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable objFilterDetail = {
    Fromdate: moment().startOf('month').format(STRING_DATE),
    Todate: moment().format(STRING_DATE),
    PayType: 'ALL',
    OrderStatusCode: 'ALL',
    ExecutionID: 0,
    AccountID: 0,
    CreatedOrg: 'ALL',
    TranType: 0,
    PageSize: 50,
    PageIndex: 1,
  }
  @observable objExportDetail = {
    Fromdate: moment().startOf('month').format(STRING_DATE),
    Todate: moment().format(STRING_DATE),
    PayType: 'ALL',
    OrderStatusCode: 'ALL',
    ExecutionID: 0,
    AccountID: 0,
    CreatedOrg: 'ALL',
    TranType: 0,
    PageSize: 1000000000,
    PageIndex: 1,
    CompanyName: '',
  }

  @observable totalCountDetail = 0
  @observable listBillingReportsDetail = null

  @action resetBillingReportsDetail = () => {
    this.totalCountDetail = 0
    this.listBillingReportsDetail = null
    this.listExecutionFiles = null
    this.objFilterDetail = {
      Fromdate: moment().startOf('month').format(STRING_DATE),
      Todate: moment().format(STRING_DATE),
      PayType: 'ALL',
      OrderStatusCode: 'ALL',
      AccountID: 0,
      CreatedOrg: 'ALL',
      TranType: 0,
      PageSize: 50,
      PageIndex: 1,
    }
    this.objExportDetail = {
      Fromdate: moment().startOf('month').format(STRING_DATE),
      Todate: moment().format(STRING_DATE),
      PayType: 'ALL',
      OrderStatusCode: 'ALL',
      AccountID: 0,
      CreatedOrg: 'ALL',
      TranType: 0,
      PageSize: 1000000000,
      PageIndex: 1,
      CompanyName: '',
    }
  }

  @action getCustomerBillingReportsDetail = () => {
    return new Promise((resolve, reject) => {
      reportRequest.getCustomerBillingReportsDetail(this.objFilterDetail)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listBillingReportsDetail = response?.data?.reports
            this.totalCountDetail = response?.data?.infoResult?.TotalRecords
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable listExecutionFiles = null
  @action loadBatchExecutionFilesByAccountID = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.loadBatchExecutionFilesByAccountID(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listExecutionFiles = response?.data?.batchExecutionFiles
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable sourceCancelDetail = null
  @action exportCustomerBillingReportsDetail = (source) => {
    return new Promise((resolve, reject) => {
      this.sourceCancelDetail = source
      reportRequest.exportCustomerBillingReportsDetail(this.objExportDetail, source)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // endregion

// region Statement

  @observable objFilterStatement = {
    Fromdate: moment().startOf('month').format(STRING_DATE),
    Todate: moment().format(STRING_DATE),
    AccountName: '',
    PageSize: 50,
    PageIndex: 1,
  }
  @observable objExportStatement = {
    Fromdate: moment().startOf('month').format(STRING_DATE),
    Todate: moment().format(STRING_DATE),
    AccountName: '',
    PageSize: 10000000,
    PageIndex: 1,
  }

  @observable totalCountStatement = 0
  @observable debitBalanceOpen = null // Số dư đầu kỳ tổng
  @observable debitBalance = null // Số dư cuối kỳ tổng
  @observable availableBalanceOpen = null // Số dư đầu kỳ khả dụng
  @observable availableBalance = null // Số dư cuối kỳ khả dụng
  @observable accountFullName = null // Tên tài khoản
  @observable listBillingReportsStatement = null

  @action resetBillingReportsStatement = () => {
    this.totalCountStatement = 0
    this.debitBalanceOpen = null
    this.debitBalance = null
    this.availableBalanceOpen = null
    this.availableBalance = null

    this.listBillingReportsStatement = null
    this.objFilterStatement = {
      Fromdate: moment().startOf('month').format(STRING_DATE),
      Todate: moment().format(STRING_DATE),
      AccountName: '',
      PageSize: 50,
      PageIndex: 1,
    }
    this.objExportStatement = {
      Fromdate: moment().startOf('month').format(STRING_DATE),
      Todate: moment().format(STRING_DATE),
      AccountName: '',
      PageSize: 10000000,
      PageIndex: 1,
    }
  }

  @action getStatementReport = () => {
    return new Promise((resolve, reject) => {
      reportRequest.getStatementReport(this.objFilterStatement)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listBillingReportsStatement = response?.data?.reports
            this.totalCountStatement = response?.data?.infoResult?.TotalRecords
            this.debitBalanceOpen = response?.data?.infoResult?.DebitBalanceOpen
            this.debitBalance = response?.data?.infoResult?.DebitBalance
            this.availableBalanceOpen = response?.data?.infoResult?.AvailableBalanceOpen
            this.availableBalance = response?.data?.infoResult?.AvailableBalance

            this.accountFullName = response?.data?.infoResult?.FullName
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable exportStatementLoading = false
  @action setExportStatementLoading = e => {
    this.exportStatementLoading = e
  }
  @observable sourceCancelStatement = null
  @action getStatementReportExcel = (source) => {
    return new Promise((resolve, reject) => {
      this.sourceCancelStatement = source
      reportRequest.getStatementReportExcel(this.objExportStatement, source)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @observable exportStatementPdfLoading = false
  @action setExportStatementPdfLoading = e => {
    this.exportStatementPdfLoading = e
  }
  @observable sourceCancelStatementPdf = null
  @action getStatementReportPdf = (source) => {
    return new Promise((resolve, reject) => {
      this.sourceCancelStatementPdf = source
      reportRequest.getStatementReportPdf(this.objExportStatement, source)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable listAccountsByMemberID = null
  @action loadAccountsByMemberID = (payload) => {
    return new Promise((resolve, reject) => {
      reportRequest.loadAccountsByMemberID(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.listAccountsByMemberID = response?.data?.accounts
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion
}

export default new reportStore()
