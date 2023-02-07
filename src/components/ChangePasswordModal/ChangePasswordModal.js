import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import PropTypes from 'prop-types'
import { ChangePasswordModalWrapper } from './ChangePasswordModalStyled'
import { Button, Col, Form, Input, message, notification, Row } from 'antd'
import { ErrorLabel } from '../../pages/ForgotPasswordPage/ForgotPasswordPageStyled'
import OtpModal from '../OtpModal'
import SuccessModal from '../SuccessModal'
import validator from '../../validator'
import { ColorText } from '../CommonStyled/CommonStyled'
import { ERROR_COLOR, ERROR_TITLE, RESPONSE_CODE } from '../../utils/constant'

const ChangePasswordModal = props => {
  // region props, hook, state =================
  const { onClose, onSuccess, visible, authenticationStore, profileStore } = props
  const [formChangePassword] = Form.useForm()
  const [visibleOtp, setVisibleOtp] = useState(false)
  const [visibleSuccess, setVisibleSuccess] = useState(false)
  const [currPayload, setCurrPayload] = useState(null)
  const [extendData, setExtendData] = useState(null)
  // endregion
  // region destructuring ======================
  const { jwtDecode } = authenticationStore
  const { entUserProfile } = profileStore
  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const handleCancel = () => {
    onClose()
    formChangePassword.resetFields()
    setExtendData(null)
    setCurrPayload(null)
  }
  const onFinishChangePassword = (formCollection) => {
    if (formCollection.oldPassword === formCollection.password) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Mật khẩu mới không được trùng với mật khẩu cũ',
      })
      return
    }
    let payload = {
      Step: 1,
      OldPassword: formCollection.oldPassword,
      NewPassword: formCollection.password,
    }
    authenticationStore.transferExtendDataForChangePassword(payload)
      .then(res => {
        if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
          let newPayload = { ...payload, description: res?.description }
          onClose()
          setExtendData(res?.extendData)
          setCurrPayload(newPayload)
          setVisibleOtp(true)
        }
      })
  }
  const handleCallbackOtp = (otp) => {
    let payload = {
      Step: 2,
      UserId: jwtDecode.sub,
      OldPassword: currPayload.OldPassword,
      NewPassword: currPayload.NewPassword,
      ExtendData: extendData,
      SecureCode: otp,
    }
    authenticationStore.changePasswordForCustomer(payload)
      .then(res => {
        switch (res?.responseCode) {
          case RESPONSE_CODE.SUCCESS:
            setVisibleOtp(false)
            setVisibleSuccess(true)
            break
          case -671:
          case -10002:
            setVisibleOtp(false)
            break
          default:
            break
        }
      })
  }
  const handleSuccessChangePassword = () => {
    setVisibleSuccess(false)
    onSuccess()
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    formChangePassword.resetFields()
  }, [visible])

  // endregion

  return (
    <>
      <ChangePasswordModalWrapper
        title='Đổi mật khẩu'
        forceRender={true}
        maskClosable={false}
        visible={visible}
        footer={null}
        onCancel={handleCancel}>
        <Form
          form={formChangePassword}
          name='basic'
          labelCol={{ span: 0 }}
          wrapperCol={{ span: 24 }}
          onFinish={onFinishChangePassword}
          autoComplete='off'
          colon={false}
        >
          <Form.Item
            label=''
            name='oldPassword'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu hiện tại' },
              { validator: validator.validateLoginPassword },
            ]}
          >
            <Input.Password maxLength={30} showCount className={'auth-input'} placeholder={'Mật khẩu hiện tại'} />
          </Form.Item>
          <Form.Item
            label=''
            name='password'
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { validator: validator.validateLoginPassword },
            ]}
          >
            <Input.Password maxLength={30} showCount className={'auth-input'} placeholder={'Mật khẩu mới'} />
          </Form.Item>
          <Form.Item
            label=''
            dependencies={['password']}
            name='confirmPassword'
            rules={[
              { required: true, message: 'Vui lòng nhập lại mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không trùng khớp'))
                },
              }),
            ]}
          >
            <Input.Password maxLength={30} showCount className={'auth-input'} placeholder={'Xác nhận mật khẩu mới'} />
          </Form.Item>
          <Form.Item>
            <ErrorLabel>
              * Vui lòng đặt mật khẩu gồm cả số và chữ, tối thiểu 8 ký tự và chứa ký tự đặc biệt
            </ErrorLabel>
          </Form.Item>
          <Row align={'middle'} justify={'center'}>
            <Col span={11}>
              <Button type='primary' htmlType='submit' block>
                Tiếp theo
              </Button>
            </Col>
          </Row>
        </Form>
      </ChangePasswordModalWrapper>
      <OtpModal
        description={currPayload?.description}
        isAuthentication={true}
        visible={visibleOtp}
        callbackOtp={handleCallbackOtp}
        onCancel={() => setVisibleOtp(false)}
        phoneNumber={entUserProfile?.mobile} />
      <SuccessModal
        visible={visibleSuccess}
        description={'Đối mật khẩu thành công, vui lòng đăng nhập lại'}
        callbackSuccess={handleSuccessChangePassword} />
    </>

  )
}

ChangePasswordModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
}

export default inject('authenticationStore', 'profileStore')(observer(ChangePasswordModal))