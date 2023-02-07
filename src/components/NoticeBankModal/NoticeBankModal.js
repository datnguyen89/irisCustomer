import React from 'react'
import PropTypes from 'prop-types'
import { Button, Col, Modal, Row } from 'antd'
import IMAGES from '../../images'
import { ConfirmModalDescription } from '../BankSelectBox/BankSelectBoxStyled'

const NoticeBankModal = props => {
  // region props, hook, state =================
  const {visible, onClose, description} = props
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
    <Modal
      width={600}
      visible={visible}
      footer={null}
      onCancel={() => onClose()}
      title={'Thông báo'}>
      <Row justify={'space-around'} align={'middle'}>
        <Col span={24} style={{ textAlign: 'center' }}>
          <img src={IMAGES.LINK_SUGGEST} alt={''} height={180} />
        </Col>
        <Col span={24}>
          <ConfirmModalDescription>
            {description}
          </ConfirmModalDescription>
        </Col>
        <Col span={11}>
          <Button
            onClick={() => onClose()}
            block
            type={'primary'}>
            Đóng
          </Button>
        </Col>
      </Row>
    </Modal>
  )
}

NoticeBankModal.propTypes = {
  visible: PropTypes.bool,
  description: PropTypes.string,
  onClose: PropTypes.func,
}

export default NoticeBankModal