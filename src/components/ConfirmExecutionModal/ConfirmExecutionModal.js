import React from 'react'
import PropTypes from 'prop-types'
import { ConfirmExecutionModalWrapper, ConfirmModalDescription } from './ConfirmExecutionModalStyled'
import { Button, Col, Form, Input, Row } from 'antd'
import validator from '../../validator'

const ConfirmExecutionModal = props => {
  // region props, hook, state
  const {
    visible,
    onCancel,
    icon,
    description,
    title,
    submitText,
    callbackConfirm,
    executionStatus,
  } = props
  const [formConfirm] = Form.useForm()

  // endregion
  // region destructuring

  // endregion
  // region variable

  // endregion
  // region function handle logic
  const handleSubmit = (e) => {
    callbackConfirm(e)
    formConfirm.resetFields()
  }
  const handleCancel = () => {
    onCancel()
    formConfirm.resetFields()
  }
  // endregion
  // region function render

  // endregion
  // region side effect

  // endregion

  return (
    <ConfirmExecutionModalWrapper
      width={430}
      visible={visible}
      onCancel={handleCancel}
      footer={null}
      title={title || 'Thông báo'}>
      <Form
        form={formConfirm}
        colon={false}
        onFinish={handleSubmit}
      >
        <Row justify={'center'} align={'middle'}>
          {/*<Col span={24}>*/}
          {/*  <ConfirmModalTitle>*/}
          {/*    {title || 'Thông báo'}*/}
          {/*  </ConfirmModalTitle>*/}
          {/*</Col>*/}
          {
            icon &&
            <Col span={24} style={{ textAlign: 'center' }}>
              <img src={icon} alt={''} height={124} />
            </Col>
          }
          {
            executionStatus ?
              <Col span={24}>
                <ConfirmModalDescription>
                  <strong>{description || 'Bạn có chắc chắn muốn thực hiện hành động này?'}</strong>
                </ConfirmModalDescription>
              </Col>
              :
              <Col span={24}>
                <Form.Item
                  name={'reason'}
                  rules={[
                    { required: true, message: 'Vui lòng nhập lý do từ chối' },
                    { validator: validator.validateTrim },
                  ]}
                >
                  <Input.TextArea
                    style={{ width: '100%' }}
                    showCount
                    rows={4}
                    maxLength={200}
                    placeholder={'Nhập lý do từ chối'} />
                </Form.Item>
              </Col>
          }
          <Col span={11}>
            <Button block type={'primary'} htmlType={'submit'}>{submitText || 'Xác nhận'}</Button>
          </Col>
        </Row>
      </Form>

    </ConfirmExecutionModalWrapper>
  )
}

ConfirmExecutionModal.propTypes = {
  executionStatus: PropTypes.bool,
  icon: PropTypes.string,
  title: PropTypes.node,
  description: PropTypes.node.isRequired,
  submitText: PropTypes.string,
  cancelText: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  callbackConfirm: PropTypes.func.isRequired,
}

export default ConfirmExecutionModal