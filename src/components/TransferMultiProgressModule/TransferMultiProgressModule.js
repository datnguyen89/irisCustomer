import React from 'react'
import PropTypes from 'prop-types'
import { Col, Row } from 'antd'
import CustomProgress from '../CustomProgress'
import { ColorText, RowSpaceBetweenDiv } from '../CommonStyled/CommonStyled'
import { ERROR_COLOR, INFO_COLOR, SUCCESS_COLOR, WARNING_COLOR } from '../../utils/constant'
import numberUtils from '../../utils/numberUtils'

const TransferMultiProgressModule = props => {
  // region props, hook, state =================
  const {
    errorAmount,
    errorCount,
    unknownCount,
    unknownAmount,
    waitingAmount,
    waitingCount,
    successAmount,
    successCount,
    totalAmount,
    totalCount,
  } = props
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <Row gutter={[0, 8]} style={{
      border: '1px solid #f0f0f0',
      padding: 16,
    }}>
      <Col span={24}>
        <strong>Kết quả thực hiện giao dịch theo lô</strong>
      </Col>
      <Col span={24}>
        <CustomProgress
          className={'custom-process'}
          successNumber={waitingCount}
          errorNumber={unknownCount}
          totalNumber={totalCount} />
      </Col>
      <Col span={24}>
        <RowSpaceBetweenDiv>
          <ColorText color={INFO_COLOR}>
            {/*Chưa xử lý đến*/}
            Chờ xử lý ({waitingCount}/{totalCount})
          </ColorText>
          <ColorText color={INFO_COLOR}>
            {numberUtils.thousandSeparator(waitingAmount)}đ/{numberUtils.thousandSeparator(totalAmount)}đ
          </ColorText>
        </RowSpaceBetweenDiv>
        <RowSpaceBetweenDiv>
          <ColorText color={WARNING_COLOR}>
            {/*Giao dịch nghi vấn*/}
            Đang xử lý ({unknownCount}/{totalCount})
          </ColorText>
          <ColorText color={WARNING_COLOR}>
            {numberUtils.thousandSeparator(unknownAmount)}đ/{numberUtils.thousandSeparator(totalAmount)}đ
          </ColorText>
        </RowSpaceBetweenDiv>
      </Col>
      <Col span={24}>
        <CustomProgress
          className={'custom-result'}
          successNumber={successCount}
          errorNumber={errorCount}
          totalNumber={totalCount} />
      </Col>
      <Col span={24}>
        <RowSpaceBetweenDiv>
          <ColorText color={SUCCESS_COLOR}>
            Thành công ({successCount}/{totalCount})
          </ColorText>
          <ColorText color={SUCCESS_COLOR}>
            {numberUtils.thousandSeparator(successAmount)}đ/{numberUtils.thousandSeparator(totalAmount)}đ
          </ColorText>
        </RowSpaceBetweenDiv>
        <RowSpaceBetweenDiv>
          <ColorText color={ERROR_COLOR}>
            Thất bại ({errorCount}/{totalCount})
          </ColorText>
          <ColorText color={ERROR_COLOR}>
            {numberUtils.thousandSeparator(errorAmount)}đ/{numberUtils.thousandSeparator(totalAmount)}đ
          </ColorText>
        </RowSpaceBetweenDiv>
      </Col>
    </Row>
  )
}

TransferMultiProgressModule.propTypes = {
  totalCount: PropTypes.number,
  totalAmount: PropTypes.number,
  waitingCount: PropTypes.number,
  waitingAmount: PropTypes.number,
  unknownCount: PropTypes.number,
  unknownAmount: PropTypes.number,
  successCount: PropTypes.number,
  successAmount: PropTypes.number,
  errorCount: PropTypes.number,
  errorAmount: PropTypes.number,
}

export default TransferMultiProgressModule