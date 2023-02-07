import { action, observable } from 'mobx'
import { testRequest } from '../requests/testRequest'

class socketStore {
  @observable viewingExecutionID = null
  @action setViewingExecutionID = (id) => {
    this.viewingExecutionID = id
  }
  @observable dataViewingExecution = null
  @action setDataViewingExecution = e => {
    this.dataViewingExecution = e
  }
  @action resetViewingExecution = () => {
    this.viewingExecutionID = null
    this.dataViewingExecution = null
  }
}

export default new socketStore()
