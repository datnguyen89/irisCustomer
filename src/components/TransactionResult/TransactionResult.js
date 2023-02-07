import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import {
  AreaTransactionInfo,
  ResultCustom,
  TransactionCode,
  TransactionResultWrapper, TransactionResultWrapperModal,
  TransactionTime,
} from './TransactionResultStyled'
import { SpanLabel } from '../AreaEnterpriseInfo/AreaEnterpriseInfoStyled'

const TransactionResult = props => {
  // region props, hook, state =================
  const { status, title, visible, infoModel, callbackTransResult } = props
  const [buttonProcessText, updateButtonProcessText] = useState('')

  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleOk = () => {
    callbackTransResult(false)
  }
  const handleCancel = () => {
    callbackTransResult(false)
  }
  // endregion
  // region function render ====================
  const renderColor = (status) => {
    switch (status) {
      case 'success':
        return '#53C305'
      case 'warning':
        return '#F78212'
      case 'error':
        return '#EB2101'
    }
  }
  // endregion
  // region side effect ========================
  useEffect(() => {
    if (status === 'success')
      updateButtonProcessText('Về trang chủ')
    else
      updateButtonProcessText('Thử lại')
  }, [status])
  // endregion

  return (
    <TransactionResultWrapperModal
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      cancelText={buttonProcessText}
      okText='Giao dịch khác'>
      <TransactionResultWrapper>
        <ResultCustom
          status={status}
          title={title}
          subTitle={infoModel.countMoney}
          colorText={renderColor(status)}
          extra={[
            <AreaTransactionInfo>
              <TransactionCode>
                <SpanLabel>{status === 'success' ? 'Mã giao dịch' : 'Mã đối soát'}</SpanLabel>
                <span>{infoModel.transactionCode}</span>
              </TransactionCode>
              <TransactionTime>
                <SpanLabel>Thời gian</SpanLabel>
                <span>{infoModel.transactionTime}</span>
              </TransactionTime>
            </AreaTransactionInfo>,
            // <Button type='default'>{status === 'success' ? 'Về trang chủ' : 'Thử lại'}</Button>,
            // <Button type='primary'>Giao dịch khác</Button>,
          ]}
        />
      </TransactionResultWrapper>
    </TransactionResultWrapperModal>
  )
}

TransactionResult.propTypes = {
  status: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  infoModel: PropTypes.object.isRequired,
}

export default TransactionResult