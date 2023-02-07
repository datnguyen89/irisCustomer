import React from 'react'
import PropTypes from 'prop-types'
import { ConfirmModalDescription, ConfirmModalTitle, ConfirmModalWrapper } from './ConfirmModalStyled'
import { Button, Col, Row } from 'antd'

const ConfirmModal = props => {
  // region props, hook, state
  const { visible, onCancel, icon, description, title, submitText, cancelText, callbackConfirm } = props

  // endregion
  // region destructuring

  // endregion
  // region variable

  // endregion
  // region function handle logic
  const handleSubmit = (isOk) => {
    if (isOk) {
      callbackConfirm()
    } else {
      onCancel()
    }
  }

  // endregion
  // region function render

  // endregion
  // region side effect

  // endregion



  return (
    <ConfirmModalWrapper
      width={430}
      visible={visible}
      closable={false}
      footer={null}
      title={null}>
      <Row justify={'space-around'} align={'middle'}>
        {
          icon &&
          <Col span={24} style={{ textAlign: 'center' }}>
            <img src={icon} alt={''} height={124} />
          </Col>
        }
        <Col span={24}>
          <ConfirmModalTitle>
            {title || 'Thông báo'}
          </ConfirmModalTitle>
        </Col>
        <Col span={24}>
          <ConfirmModalDescription>
            {description || 'Bạn có chắc chắn muốn thực hiện hành động này?'}
          </ConfirmModalDescription>
        </Col>
        <Col span={11}>
          <Button block type={'default'} onClick={() => handleSubmit(false)}>{cancelText || 'Hủy'}</Button>
        </Col>
        <Col span={11}>
          <Button block type={'primary'} onClick={() => handleSubmit(true)}>{submitText || 'Đồng ý'}</Button>
        </Col>
      </Row>
    </ConfirmModalWrapper>
  )
}

ConfirmModal.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  callbackConfirm: PropTypes.func.isRequired,
}

export default ConfirmModal