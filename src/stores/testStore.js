import { action, autorun, observable } from 'mobx'
import { testRequest } from '../requests/testRequest'

class testStore {
  @action testRq = (payload) => {
    return new Promise((resolve, reject) => {
      testRequest.testRq(payload)
        .then(response => {
          resolve(response.data)
        })
        .catch(error => reject(error))
    })
  } 

}

export default new testStore()
