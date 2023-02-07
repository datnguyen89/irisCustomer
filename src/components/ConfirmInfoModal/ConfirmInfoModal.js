import React from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { ConfirmInfoModalWrapper } from './ConfirmInfoModalStyled'
import { Button, Descriptions, Modal } from 'antd'
import { ColorText, RowCenterDiv } from '../CommonStyled/CommonStyled'

const ConfirmInfoModal = props => {
  // region props, hook, state
  const { visible, onClose, arrConfirmInfo, onSuccess, title, commonStore } = props

  // endregion
  // region destructuring
  const { appTheme } = commonStore

  // endregion
  // region variable

  // endregion
  // region function handle logic
  const handleCancel = () => {
    onClose()
  }

  // endregion
  // region function render

  // endregion
  // region side effect

  // endregion


  return (
    <ConfirmInfoModalWrapper>
      <Modal
        maskClosable={false}
        style={{ top: 50 }}
        width={700}
        visible={visible}
        title={title}
        footer={null}
        onCancel={handleCancel}
      >
        <Descriptions
          labelStyle={{ width: '40%' }}
          bordered column={1}>
          {
            arrConfirmInfo && arrConfirmInfo?.length > 0 && arrConfirmInfo.map(item =>
              <Descriptions.Item
                key={item.name}
                label={item.name}>
                <ColorText color={item?.color ? item?.color : 'inherit'}>{item.value}</ColorText>
              </Descriptions.Item>,
            )
          }
        </Descriptions>
        <RowCenterDiv margin={'16px 0 0 0 '}>
          <Button
            onClick={() => onSuccess()}
            type={'primary'}>
            Xác nhận
          </Button>
        </RowCenterDiv>
      </Modal>
    </ConfirmInfoModalWrapper>
  )
}

ConfirmInfoModal.propTypes = {
  arrConfirmInfo: PropTypes.array,
  visible: PropTypes.bool,
  onClose: PropTypes.func,
  onSuccess: PropTypes.func,
  title: PropTypes.node,
}

export default inject('commonStore')(observer(ConfirmInfoModal))