import React from 'react'
import { Col, Image, Row } from 'antd'

const lstBank = [{
  avatar: 'Sacombank',
  bankCode: 'STB',
  accountNumber: '970403********011'
}, {
  avatar: 'Vietcombank',
  bankCode: 'VCB',
  accountNumber: '970436********123'
}]

const TransListBanks = props => {
  return (
    <Row align={'left'} gutter={[16, 16]}>
      {
        lstBank.map(item =>
          <Col xxl={8} xl={8} lg={12} md={12} sm={24} xs={24}>
            <Row>
              <Image src={'/assets/images/SACOMBANK.png'} />
              <span>{item.bankCode}</span>
            </Row>
          </Col>,
        )
      }
    </Row>
  )
}

TransListBanks.propTypes = {}

export default TransListBanks