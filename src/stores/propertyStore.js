import { action, autorun, observable } from 'mobx'
import { propertyRequest } from '../requests/propertyRequest'
import { EXECUTION_ORDER_STATUS, RESPONSE_CODE } from '../utils/constant'
import ICONS from '../icons'

class propertyStore {
  constructor() {
    autorun(() => {
      this.hostFileUpload = this.commonProperty ? this.commonProperty?.hosts.find(item => item?.name === 'FileUploadHost')?.value : ''
      this.dropdownExecutionStatus = this.commonProperty ? this.commonProperty?.executionOrderStatus.filter(item => ['IN_PROGRESS', 'WAIT_APPROVAL', 'APPROVED', 'REJECT', 'REVIEWED'].includes(item?.name)) : []
    })
  }

  @observable hostFileUpload = ''
  @observable listNational = []
  @observable listCity = []
  @observable listDistrict = []
  @observable listWards = []
  @observable commonProperty = null
  @observable dropdownExecutionStatus

  @action renderTransactionStatusLabel = (status) => {
    if (!this.commonProperty) return ''
    return this.commonProperty?.executionOrderStatus.find(item => item.value === status)?.title || ''
  }

  @action getListNational = () => {
    return new Promise((resolve, reject) => {
      propertyRequest.getLocation({ locationLevel: 1 })
        .then(response => {
          this.listNational = response?.data?.param
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getListCity = () => {
    return new Promise((resolve, reject) => {
      propertyRequest.getLocation({ locationLevel: 2 })
        .then(response => {
          this.listCity = response?.data?.param
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getListDistrict = () => {
    return new Promise((resolve, reject) => {
      propertyRequest.getLocation({ locationLevel: 3 })
        .then(response => {
          this.listDistrict = response?.data?.param
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }
  @action getListWards = () => {
    return new Promise((resolve, reject) => {
      propertyRequest.getLocation({ locationLevel: 4 })
        .then(response => {
          this.listWards = response?.data?.param
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @action getCommonProperty = () => {
    return new Promise((resolve, reject) => {
      propertyRequest.getCommonProperty()
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            this.commonProperty = response?.data?.param
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

  @observable listTreeRoleByRoleType = []
  @observable listRoleDefault = []
  @action resetTreeRole = () => {
    this.listTreeRoleByRoleType = []
    this.listRoleDefault = []
  }
  @action getTreeRoleByRoleType = (payload) => {
    return new Promise((resolve, reject) => {
      propertyRequest.getTreeRoleByRoleType(payload)
        .then(response => {
          if (response?.data?.responseCode === RESPONSE_CODE.SUCCESS) {
            let param = JSON.parse(response?.data?.param)
            this.listTreeRoleByRoleType = param?.treeRolesModel?.children
            this.listRoleDefault = param?.rolesDefaultModel
          }
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  }

}

export default new propertyStore()
