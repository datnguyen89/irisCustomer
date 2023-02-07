import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import {
  BankItemWrapper,
  BankSelectBoxTitle,
  BankLinkedSelectBoxWrapper,
  BankItemInfo, BankName, NoLinkedBankWrapper, NoLinkedBankText, NoLinkedBank,
} from './BankLinkedSelectBoxStyled'
import { Col, Row } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { PAGES } from '../../utils/constant'

const BankLinkedSelectBox = props => {
  // region props, hook, state =================
  const { bankStore, commonStore } = props

  // endregion
  // region destructuring ======================
  const { listLinkedBanks, selectedLinkedBank } = bankStore
  const { appTheme, pageName } = commonStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleClickSelect = e => {
    bankStore.setSelectedLinkedBank(e)
  }

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion



  return (
    <BankLinkedSelectBoxWrapper>
      <Row gutter={[16, 16]}>
        {
          listLinkedBanks && listLinkedBanks?.length > 0
            ?
            <Col span={24}>
              <BankSelectBoxTitle>Ngân hàng liên kết trực tiếp</BankSelectBoxTitle>
              <Row gutter={[8, 8]}>
                {
                  listLinkedBanks.map(item =>
                    <Col span={24} key={item?.bankID}>
                      <BankItemWrapper
                        onClick={() => handleClickSelect(item)}
                        selected={item?.bankID === selectedLinkedBank?.bankID}
                        color={appTheme.solidColor}>
                        <img src={item?.logo} alt={item?.bankName} />
                        <BankItemInfo>
                          <BankName>{item.bankName}</BankName>
                          <span>{item.bankAccount}</span>
                        </BankItemInfo>
                      </BankItemWrapper>
                    </Col>,
                  )
                }
              </Row>
            </Col>
            :
            <NoLinkedBankWrapper>
              <NoLinkedBank>
                <WarningOutlined style={{ fontSize: 32, color: 'orange' }} />
                <NoLinkedBankText>Tài khoản Ví doanh nghiệp chưa liên kết ngân hàng</NoLinkedBankText>
              </NoLinkedBank>
              <Link style={{ color: appTheme.solidColor }} to={PAGES.ADD_LINK.PATH}>Liên kết ngay</Link>
            </NoLinkedBankWrapper>
        }

      </Row>

    </BankLinkedSelectBoxWrapper>
  )
}

BankLinkedSelectBox.propTypes = {}

export default inject('bankStore', 'commonStore')(observer(BankLinkedSelectBox))