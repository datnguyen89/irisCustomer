import { action, autorun, observable, toJS } from 'mobx'
import authenticationStore from './authenticationStore'
import { orderRequest } from '../requests/orderRequest'
import { APP_PAGE_SIZE, EXECUTION_ORDER_STATUS, RESPONSE_CODE } from '../utils/constant'
import dateUtils from '../utils/dateUtils'
import moment from 'moment'

class orderStore {
  // region Edit
  @observable editingExecution = localStorage.getItem('editingExecution') ? JSON.parse(localStorage.getItem('editingExecution')) : null
  @action setEditingExecution = e => {
    localStorage.setItem('editingExecution', JSON.stringify(e))
    this.editingExecution = e
  }
  @action resetEditingExecution = () => {
    localStorage.removeItem('editingExecution')
    this.editingExecution = null
  }
  // endregion

  // region Common
  // obj tìm kiếm chung
  @observable objFilterOrder = {
    Status: null,
    CreatedFrom: dateUtils.convertToMillisecondsStartOfDay(moment().add(-30, 'days')),
    CreatedTo: dateUtils.convertToMillisecondsEndOfDay(moment()),
    Keyword: '',
  }
  @action setObjFilterOrder = e => {
    this.objFilterOrder = e
  }
  @action resetObjFilterOrder = () => {
    this.objFilterOrder = {
      Status: null,
      CreatedFrom: dateUtils.convertToMillisecondsStartOfDay(moment().add(-30, 'days')),
      CreatedTo: dateUtils.convertToMillisecondsEndOfDay(moment()),
      Keyword: '',
    }
  }
  // obj lưu trữ phân trang riêng cho từng collapse
  @observable objPagination = {}
  @action resetObjPagination = () => {
    this.objPagination = {}
  }
  // obj lưu trữ data riêng cho từng collapse
  @observable objListData = {} // Dynamic Object data
  // dynamic array danh sách collapse trả từ server
  @observable listExecutionTypeGrouped = []
  @action setListExecutionTypeGrouped = e => {
    this.listExecutionTypeGrouped = e
  }
  // lấy dynamic array danh sách collapse trả từ server
  @action getListExecutionTypeGrouped = (userProfile) => {
    return new Promise((resolve, reject) => {
      let obj = {
        ...this.objFilterOrder,
        DeptID: userProfile?.departmentID,
      }
      orderRequest.getListExecutionTypeGrouped(obj)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            let list = response?.data?.param
            this.listExecutionTypeGrouped = list
            let objPaging = {}
            list.forEach(item => {
              objPaging[item.GroupTypeID] = {
                PageIndex: this.objPagination[item.GroupTypeID]?.PageIndex || 1,
                PageSize: this.objPagination[item.GroupTypeID]?.PageSize || APP_PAGE_SIZE,
                TotalCount: this.objPagination[item.GroupTypeID]?.TotalCount || 0,
              }
            })
            this.objPagination = objPaging
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // lấy danh sách yêu cầu của từng collapse
  @action getOrders = (groupTypeID, userProfile) => {
    return new Promise((resolve, reject) => {
      let payload = {
        PageIndex: this.objPagination[Number(groupTypeID)]?.PageIndex || 1,
        PageSize: this.objPagination[Number(groupTypeID)]?.PageSize || APP_PAGE_SIZE,
        CreatedDateFrom: this.objFilterOrder.CreatedFrom,
        CreatedDateTo: this.objFilterOrder.CreatedTo,
        BusinessCertification: this.objFilterOrder.Keyword,
        CreatedUser: userProfile?.memberID,
        CreatedDept: userProfile?.departmentID,
        ExecutionOrderStatus: this.objFilterOrder.Status,
        GroupTypeID: Number(groupTypeID),
      }
      orderRequest.getOrders(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.objListData[payload?.GroupTypeID] = response?.data?.param
            this.objPagination[payload?.GroupTypeID].TotalCount = response?.data?.totalCount
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // chuyển về trạng thái chờ duyệt nếu tắt OTP
  @action revertOrderStatusExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.revertOrderStatusExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion
  // region LinkBank
  // Tạo yêu cầu link bank
  @action createLinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createLinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // Check link bank lấy data require field từ server
  @action checkLinkBank = (params) => {
    return new Promise((resolve, reject) => {
      orderRequest.checkLinkBank(params)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // duyệt link bank
  @action approveLinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveLinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // kiểm soát link bank
  @action reviewLinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewLinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewLinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewLinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // xóa yêu cầu link bank
  @action deleteLinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteLinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // tạo yêu cầu hủy link bank
  @action createUnlinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createUnlinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // duyệt yêu cầu hủy link bank
  @action approveUnLinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveUnLinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmUnlinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmUnlinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // kiểm soát yêu cầu hủy link bank
  @action reviewUnLinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewUnLinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewUnlinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewUnlinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // xóa yêu cầu unlink bank
  @action deleteUnlinkBankExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteUnlinkBankExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion
  // region Deposit
  // tạo yêu cầu nạp tiền
  @action createDepositOrder = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createDepositOrder(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // kiểm soát yêu cầu nạp tiền
  @action reviewDepositExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewDepositExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewDepositExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewDepositExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // duyệt yêu cầu nạp tiền
  @action approveDepositExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveDepositExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // nhập otp duyệt yêu cầu nạp tiền
  @action confirmDepositExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmDepositExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateDepositOrder = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateDepositOrder(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteDepositExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteDepositExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion
  // region Withdraw
  // tạo yêu cầu rút tiền
  @action createWithDrawalOrder = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createWithDrawalOrder(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // xác nhận yêu cầu rút tiền
  @action reviewWithDrawalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewWithDrawalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewWithdrawalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewWithdrawalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // duyệt yêu cầu rút tiền
  @action approveWithDrawalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveWithDrawalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // xác nhận duyệt yêu cầu rút tiền
  @action confirmWithDrawalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmWithDrawalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateWithDrawalOrder = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateWithDrawalOrder(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteWithDrawalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteWithDrawalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion
  // region Transfer 1 - 1 (0: pay-pay) cá nhân
  //Tạo yêu cầu chuyển tiền
  @action createTransferPersonalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createTransferPersonalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action reviewTransferPersonalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewTransferPersonalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewTransferPersonalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewTransferPersonalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action approveTransferPersonalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveTransferPersonalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmTransferPersonalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmTransferPersonalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateTransferPersonalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateTransferPersonalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteTransferPersonalExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteTransferPersonalExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion
  // region Transfer 1 - 1 (0: pay-pay) doanh nghiệp
  //Tạo yêu cầu chuyển tiền
  @action createTransferEntExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createTransferEntExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action reviewTransferEntExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewTransferEntExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewTransferEntExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewTransferEntExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action approveTransferEntExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveTransferEntExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmTransferEntExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmTransferEntExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateTransferEntExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateTransferEntExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteTransferEntExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteTransferEntExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion

  // region MobileMoney
  // TRANSFERMM
  @action createTransferMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createTransferMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action reviewTransferMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewTransferMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewTransferMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewTransferMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action approveTransferMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveTransferMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmTransferMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmTransferMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateTransferMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateTransferMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteTransferMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteTransferMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // DEPOSITMM
  @action createDepositMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createDepositMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action reviewDepositMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewDepositMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewDepositMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewDepositMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action approveDepositMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveDepositMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmDepositMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmDepositMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateDepositMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateDepositMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteDepositMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteDepositMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  // WITHDRAWMM
  @action createWithdrawMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createWithdrawMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action reviewWithdrawMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewWithdrawMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewWithdrawMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewWithdrawMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action approveWithdrawMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveWithdrawMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmWithdrawMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmWithdrawMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateWithdrawMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateWithdrawMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteWithdrawMMExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteWithdrawMMExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion

  // region Transfer multiple
  @action validateTransferMultiExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.validateTransferMultiExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action createTransferMultipleExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createTransferMultipleExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updateTransferMultiExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updateTransferMultiExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action reviewTransferMultipleExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewTransferMultipleExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewTransferMultiExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewTransferMultiExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action approveTransferMultipleExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approveTransferMultipleExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmTransferMultiExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmTransferMultiExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @action getTransferMultiExecutionDetail = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.getTransferMultiExecutionDetail(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action deleteTransferMultipleExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deleteTransferMultipleExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getTransferMultiResult = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.getTransferMultiResult(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getTransferMultiPDF = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.getTransferMultiPDF(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion

  // region Payment
  @action createPaymentOrder = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.createPaymentOrder(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action updatePaymentOrder = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.updatePaymentOrder(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @action deletePaymentOrder = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.deletePaymentOrder(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action reviewPaymentExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.reviewPaymentExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmReviewPaymentExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmReviewPaymentExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action approvePaymentExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.approvePaymentExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action confirmPaymentExecution = (payload) => {
    return new Promise((resolve, reject) => {
      orderRequest.confirmPaymentExecution(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  // endregion

}

export default new orderStore()
