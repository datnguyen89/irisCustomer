import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { Button, Descriptions, Modal } from 'antd'
import { RESULT_TRANSACTION_TITLE, SUCCESS_COLOR } from '../../utils/constant'
import { ColorText, RowCenterDiv, RowFlexEndDiv } from '../CommonStyled/CommonStyled'
import { CheckCircleOutlined } from '@ant-design/icons'
import numberUtils from '../../utils/numberUtils'
import TransferMultiProgressModule from '../TransferMultiProgressModule'

const TransferMultiResultModal = props => {
  // region props, hook, state =================
  const { socketStore, onClose, visible } = props
  const {
    dataViewingExecution,
  } = socketStore
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleCancel = () => {
    socketStore.resetViewingExecution()
    onClose()
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <Modal
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      width={600}
      title={RESULT_TRANSACTION_TITLE}
    >
      <>
        <RowCenterDiv margin={'16px 0'}>
          <CheckCircleOutlined style={{ fontSize: 32, color: SUCCESS_COLOR }} />
          <ColorText fontSize={'1.6rem'} margin={'0 0 0 16px'} color={SUCCESS_COLOR}>
            Ghi nhận yêu cầu chuyển tiền theo lô thành công
          </ColorText>
        </RowCenterDiv>
        <Descriptions
          bordered
          column={1}
          labelStyle={{ width: '35%' }}
          contentStyle={{ width: '65%' }}
          size={'small'}>
          <Descriptions.Item label={'Tổng số tiền'}>
            <RowFlexEndDiv>
              <strong>
                {numberUtils.thousandSeparator(dataViewingExecution?.totalAmount)}đ
              </strong>
            </RowFlexEndDiv>
          </Descriptions.Item>
          <Descriptions.Item label={'Số yêu cầu chuyển'}>
            <RowFlexEndDiv>
              {Number(Number(dataViewingExecution?.totalCount))}
            </RowFlexEndDiv>
          </Descriptions.Item>
        </Descriptions>
        <TransferMultiProgressModule
          totalCount={dataViewingExecution?.totalCount}
          totalAmount={dataViewingExecution?.totalAmount}
          waitingCount={dataViewingExecution?.totalWaitCount}
          waitingAmount={dataViewingExecution?.totalWaitAmount}
          unknownCount={dataViewingExecution?.totalPendingCount}
          unknownAmount={dataViewingExecution?.totalPendingAmount}
          successCount={dataViewingExecution?.totalSuccessCount}
          successAmount={dataViewingExecution?.totalSuccessAmount}
          errorCount={dataViewingExecution?.totalFailedCount}
          errorAmount={dataViewingExecution?.totalFailedAmount}
        />
        <RowCenterDiv margin={'16px 0 0 0'}>
          <Button
            type={'primary'}
            onClick={handleCancel}>Đóng</Button>
        </RowCenterDiv>
      </>
    </Modal>
  )
}

TransferMultiResultModal.propTypes = {
  visible: PropTypes.bool,
  onClose: PropTypes.func,
}

export default inject('socketStore')(observer(TransferMultiResultModal))