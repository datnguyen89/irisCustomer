import { action, observable } from 'mobx'

class mobileNetworkOperatorStore {

  @observable mobileNetworkOperators = [];
  @observable servicePlanMobiles = [];
  @observable topUpVouchers = [];

  constructor(  ) {
  }

  @action getMobileNetworkOperators = () => {
    return new Promise((resolve, reject) => {
      this.mobileNetworkOperators = [
        { id: 1, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Mobifone' },
        { id: 2, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Vinaphone' },
        { id: 3, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
        { id: 4, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
        { id: 5, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
        { id: 6, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
        { id: 7, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
        { id: 8, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
      ];
    })
  }

  @action getServicePlanMobile = () => {
    return new Promise((resolve, reject) => {
      this.mobileNetworkOperators = [
        { id: 1, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Mobifone' },
        { id: 2, imageUrl: require('../media/icons/payment/vinaphone.png'), name: 'Vinaphone' },
        { id: 3, imageUrl: require('../media/icons/payment/viettel.png'), name: 'Viettel' },
        { id: 4, imageUrl: require('../media/icons/payment/vietnamobile.png'), name: 'Vietnamobile' },
        { id: 5, imageUrl: require('../media/icons/payment/g_mobile.png'), name: 'GMobile' },
        { id: 6, imageUrl: require('../media/icons/payment/indochina.png'), name: 'IndochinaTelecom' },
        { id: 7, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
        { id: 8, imageUrl: require('../media/icons/payment/mobifone.png'), name: 'Viettel' },
      ];
    })
  }

  @action getTopUpVoucher = () => {
    return new Promise((resolve, reject) => {
      this.topUpVouchers = [
        { id: 1, denominations: '10000', discount: '9500', name: 'M?? th??? Mobifone 10k', data: '500MB', rangeTimeValid: '1 Ng??y' },
        { id: 2, denominations: '20000', discount: '19500', name: 'M?? th??? Mobifone 20k', data: '1GB', rangeTimeValid: '1 Ng??y' },
        { id: 3, denominations: '50000', discount: '47500', name: 'M?? th??? Mobifone 50k', data: '1GB', rangeTimeValid: '1 Ng??y' },
        { id: 4, denominations: '100000', discount: '95000', name: 'M?? th??? Mobifone 100k', data: '1GB', rangeTimeValid: '1 Ng??y' },
        { id: 5, denominations: '200000', discount: '190500', name: 'M?? th??? Mobifone 200k', data: '1GB', rangeTimeValid: '1 Ng??y' },
        { id: 6, denominations: '500000', discount: '475000', name: 'M?? th??? Mobifone 500k', data: '1GB', rangeTimeValid: '1 Ng??y' },
      ];
    })
  }
}

export default new mobileNetworkOperatorStore()