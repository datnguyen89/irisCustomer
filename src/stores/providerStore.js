import { action, observable } from 'mobx'

class providerStore {

  @observable areas = [];
  @observable providers = [];
  @observable providerDetail = null;
  @observable televisions = [];
  @observable television = null;
  @observable electrics = [];
  @observable electric = null;
  @observable internets = [];
  @observable internet = null;
  @observable schools = [];
  @observable school = null;

  constructor() {
  }

  @action getProviderAreas = () => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          area: 'Cấp nước miền trung',
        },
        {
          id: 2,
          area: 'Cấp nước miền nam',
        },
        {
          id: 3,
          area: 'Cấp nước miền bắc',
        },
        {
          id: 4,
          area: 'Cấp nước Hà Nội',
        },
        {
          id: 5,
          area: 'Cấp nước TP.HCM',
        },
      ]
      this.areas = data;
      resolve(data);
    })
  }


  @action getProviders = () => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          area: 'Cấp nước miền trung',
          areaId: 1,
          name: 'Công ty cổ phần Nước Sạch Hà Nội',
        },
        {
          id: 2,
          area: 'Cấp nước miền nam',
          areaId: 1,
          name: 'Công ty cổ phần cấp nước Phú Hòa Tan',
        },
        {
          id: 3,
          area: 'Cấp nước miền bắc',
          areaId: 2,
          name: 'Công ty cấp thoát nước Bình Dương',
        },
        {
          id: 4,
          area: 'Cấp nước Hà Nội',
          areaId: 2,
          name: 'Công ty cổ phần Nước Sạch VTS',
        },
        {
          id: 5,
          area: 'Cấp nước TP.HCM',
          areaId: 4,
          name: 'Công ty cổ phần cấp nước Hoa Phượng',
        },
        {
          id: 6,
          area: 'Cấp nước miền trung',
          areaId: 1,
          name: 'Công ty cổ phần Nước Sạch Hà Nội',
        },
        {
          id: 7,
          area: 'Cấp nước miền nam',
          areaId: 1,
          name: 'Công ty cổ phần cấp nước Phú Hòa Tan',
        },
        {
          id: 8,
          area: 'Cấp nước miền bắc',
          areaId: 2,
          name: 'Công ty cấp thoát nước Bình Dương',
        },
        {
          id: 9,
          area: 'Cấp nước Hà Nội',
          areaId: 2,
          name: 'Công ty cổ phần Nước Sạch VTS',
        },
        {
          id: 10,
          area: 'Cấp nước TP.HCM',
          areaId: 4,
          name: 'Công ty cổ phần cấp nước Hoa Phượng',
        },
        {
          id: 11,
          area: 'Cấp nước miền trung',
          areaId: 1,
          name: 'Công ty cổ phần Nước Sạch Hà Nội',
        },
        {
          id: 12,
          area: 'Cấp nước miền nam',
          areaId: 1,
          name: 'Công ty cổ phần cấp nước Phú Hòa Tan',
        },
        {
          id: 13,
          area: 'Cấp nước miền bắc',
          areaId: 2,
          name: 'Công ty cấp thoát nước Bình Dương',
        },
        {
          id: 14,
          area: 'Cấp nước Hà Nội',
          areaId: 2,
          name: 'Công ty cổ phần Nước Sạch VTS',
        },
        {
          id: 15,
          area: 'Cấp nước TP.HCM',
          areaId: 4,
          name: 'Công ty cổ phần cấp nước Hoa Phượng',
        },
        {
          id: 16,
          area: 'Cấp nước miền trung',
          areaId: 1,
          name: 'Công ty cổ phần Nước Sạch Hà Nội',
        },
        {
          id: 17,
          area: 'Cấp nước miền nam',
          areaId: 1,
          name: 'Công ty cổ phần cấp nước Phú Hòa Tan',
        },
        {
          id: 18,
          area: 'Cấp nước miền bắc',
          areaId: 2,
          name: 'Công ty cấp thoát nước Bình Dương',
        },
        {
          id: 19,
          area: 'Cấp nước Hà Nội',
          areaId: 2,
          name: 'Công ty cổ phần Nước Sạch VTS',
        },
        {
          id: 20,
          area: 'Cấp nước TP.HCM',
          areaId: 4,
          name: 'Công ty cổ phần cấp nước Hoa Phượng',
        },
      ]

      this.providers = data;
      resolve(data);
    })
  }

  @action getProviderDetail = (id) => {
    return new Promise((resolve, reject) => {
      let data = {
        id: 1,
        area: 'Cấp nước miền trung',
        areaId: 1,
        name: 'Công ty cổ phần Nước Sạch Hà Nội',
        customerCode: '00000123456',
        customerName: 'Nguyen Van A',
        customerAddress: '123 Liễu Giai, Ba Đình, Hà Nội',
        payTerms: 'Tiền điện tháng 9',
        taxPaid: '1000000'
      };
      this.providerDetail = data
      resolve(data)
    })
  }

  @action getTelevisions = () => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          name: 'K+',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        },
        {
          id: 2,
          name: 'K+1',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        },
        {
          id: 3,
          name: 'K+2',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        },
        {
          id: 4,
          name: 'K+3',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        },
        {
          id: 5,
          name: 'K+4',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        },
        {
          id: 6,
          name: 'K+5',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        },
        {
          id: 7,
          name: 'K+6',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        },
      ];
      this.televisions = data
      resolve(data)
    })
  }

  @action getApartmentByName = (name) => {
    return new Promise((resolve, reject) => {
      let data =
        {
          id: 1,
          name: 'Chung cư TTC Land',
          description: 'Công ty Cổ phần Địa ốc Sài Gòn Thương Tín',
          imageUrl: require('../media/images/ttc.png')
        };
      this.television = data
      resolve(data)
    })
  }

  @action getTelevisionByName = (name) => {
    return new Promise((resolve, reject) => {
      let data =
        {
          id: 1,
          name: 'K+',
          description: 'Truyền hình K+',
          imageUrl: require('../media/images/k_plus.png')
        };
      this.television = data
      resolve(data)
    })
  }

  @action getSchoolsByName = (name) => {
    return new Promise((resolve, reject) => {
      let data =
        {
          id: 1,
          name: 'HBU',
          description: 'Trường Đại học Quốc tế Hồng Bàng',
          imageUrl: require('../media/images/HBU.png')
        };
      this.school = data
      resolve(data)
    })
  }

  @action getInternetProviderByName = (name) => {
    return new Promise((resolve, reject) => {
      let data =
        {
          id: 1,
          name: 'SPT',
          description: 'Viễn thông SPT',
          imageUrl: require('../media/images/SPT.png')
        };
      this.internet = data
      resolve(data)
    })
  }

  @action getElectricProviderByName = (name) => {
    return new Promise((resolve, reject) => {
      let data =
        {
          id: 1,
          name: 'EVN Miền Bắc',
          description: 'Tập đoàn Điện lực Việt Nam - CN Miền Bắc',
          imageUrl: require('../media/images/electric.png')
        };
      this.electric = data
      resolve(data)
    })
  }

  @action getInternetProviders = () => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          name: 'SPT',
          description: 'Viễn thông SPT',
          imageUrl: require('../media/images/SPT1.png')
        },
        {
          id: 2,
          name: 'FPT',
          description: 'Viễn thông FPT',
          imageUrl: require('../media/images/SPT1.png')
        },
        {
          id: 3,
          name: 'VNPT',
          description: 'Viễn thông VNPT',
          imageUrl: require('../media/images/SPT1.png')
        },
        {
          id: 4,
          name: 'Viettel',
          description: 'Viễn thông Viettel',
          imageUrl: require('../media/images/SPT1.png')
        },
        {
          id: 5,
          name: 'SPT',
          description: 'Viễn thông SPT',
          imageUrl: require('../media/images/SPT1.png')
        },
        {
          id: 6,
          name: 'SPT',
          description: 'Viễn thông SPT',
          imageUrl: require('../media/images/SPT1.png')
        },
        {
          id: 7,
          name: 'SPT',
          description: 'Viễn thông SPT',
          imageUrl: require('../media/images/SPT1.png')
        },
      ];
      this.internets = data
      resolve(data)
    })
  }

  @action getElectricProviders = () => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          name: 'EVN Miền Bắc',
          description: 'Tập đoàn Điện lực Việt Nam - CN Miền Bắc',
          imageUrl: require('../media/images/electric.png')
        },
        {
          id: 2,
          name: 'EVN Miền Trung',
          description: 'Tập đoàn Điện lực Việt Nam - CN Miền Trung',
          imageUrl: require('../media/images/electric.png')
        },
        {
          id: 3,
          name: 'EVN Miền Nam',
          description: 'Tập đoàn Điện lực Việt Nam - CN Miền Nam',
          imageUrl: require('../media/images/electric.png')
        },
        {
          id: 4,
          name: 'EVN Hà Nội',
          description: 'Tổng công ty Điện lực TP Hà Nội',
          imageUrl: require('../media/images/electric.png')
        },
        {
          id: 5,
          name: 'EVN Hà Nội',
          description: 'Tổng công ty Điện lực TP Hà Nội',
          imageUrl: require('../media/images/electric.png')
        },
        {
          id: 6,
          name: 'EVN Hà Nội',
          description: 'Tổng công ty Điện lực TP Hà Nội',
          imageUrl: require('../media/images/electric.png')
        },
        {
          id: 7,
          name: 'EVN Hà Nội',
          description: 'Tổng công ty Điện lực TP Hà Nội',
          imageUrl: require('../media/images/electric.png')
        },
      ];
      this.electrics = data
      resolve(data)
    })
  }

  @action getSchoolProviders = () => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          name: 'HBU',
          description: 'Trường Đại học Quốc tế Hồng Bàng',
          imageUrl: require('../media/images/HBU.png')
        },
        {
          id: 2,
          name: 'LTU',
          description: 'Trường Đại học Dân lập Hoa Sen',
          imageUrl: require('../media/images/LTU.png')
        },
        {
          id: 3,
          name: 'Đại Học Mở TPHCM',
          description: 'Trường Đại học Mở Thành phố Hồ Chí Minh',
          imageUrl: require('../media/images/HOU.png')
        },
        {
          id: 4,
          name: 'NEU',
          description: 'Trường Đại học Kinh tế Quốc dân',
          imageUrl: require('../media/images/NEU.png')
        },
        {
          id: 5,
          name: 'NEU',
          description: 'Trường Đại học Kinh tế Quốc dân',
          imageUrl: require('../media/images/NEU.png')
        },
        {
          id: 6,
          name: 'NEU',
          description: 'Trường Đại học Kinh tế Quốc dân',
          imageUrl: require('../media/images/NEU.png')
        },
        {
          id: 7,
          name: 'NEU',
          description: 'Trường Đại học Kinh tế Quốc dân',
          imageUrl: require('../media/images/NEU.png')
        },
      ];
      this.schools = data
      resolve(data)
    })
  }

  @action getApartmentProviders = () => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          name: 'Chung Cư TTC Land',
          description: 'Công ty Cổ phần Địa ốc Sài Gòn Thương Tín',
          imageUrl: require('../media/images/ttc.png')
        },
        {
          id: 2,
          name: 'Chung cư HTC Land',
          description: 'Công ty Quản lý Toà Nhà HTC Sài Gòn',
          imageUrl: require('../media/images/htc.png')
        },
        {
          id: 3,
          name: 'Chung cư Vinaconex 2',
          description: 'Tổng công ty Cổ phần XNK và XD Việt Nam',
          imageUrl: require('../media/images/vinaconex.png')
        },
        {
          id: 4,
          name: 'Chung Cư VinHomes Ocean Park',
          description: 'Tập đoàn Bất động sản Vinhomes',
          imageUrl: require('../media/images/vinhomes.png')
        },
        {
          id: 5,
          name: 'Chung Cư VinHomes Ocean Park',
          description: 'Tập đoàn Bất động sản Vinhomes',
          imageUrl: require('../media/images/vinhomes.png')
        },
        {
          id: 6,
          name: 'Chung Cư VinHomes Ocean Park',
          description: 'Tập đoàn Bất động sản Vinhomes',
          imageUrl: require('../media/images/vinhomes.png')
        },
        {
          id: 7,
          name: 'Chung Cư VinHomes Ocean Park',
          description: 'Tập đoàn Bất động sản Vinhomes',
          imageUrl: require('../media/images/vinhomes.png')
        },
      ];
      this.televisions = data
      resolve(data)
    })
  }

  @action getPackagesByCustomerCodeOrContract = (code) => {
    return new Promise((resolve, reject) => {
      let data = [
        {
          id: 1,
          nameProvider: 'K+',
          packageName: 'Basic 5 Kênh Quốc tế',
          packagePrice: '35000',
        },
        {
          id: 2,
          nameProvider: 'K+',
          packageName: '1 Tháng Premieum HD+',
          packagePrice: '160000',
        },
        {
          id: 3,
          nameProvider: 'K+',
          packageName: '3 Tháng Premieum HD+',
          packagePrice: '290000',
        },
        {
          id: 4,
          nameProvider: 'K+',
          packageName: '6 Tháng Premieum HD+',
          packagePrice: '435000',
        },{
          id: 5,
          nameProvider: 'K+',
          packageName: '1 Năm Premieum HD+',
          packagePrice: '870000',
        },
        {
          id: 6,
          nameProvider: 'K+',
          packageName: '2 Năm Premieum HD+',
          packagePrice: '1500000',
        }
      ];
      this.television = data
      resolve(data)
    })
  }
}
export default new providerStore()