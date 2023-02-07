import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import OtpInput from 'react-otp-input'
import PropTypes from 'prop-types'
import { ExpiredLabel, OtpDescription, OtpModalWrapper, ResendOtp, TimeLeft, WaitingResendOtp } from './OtpModalStyled'
import { Button, Col, Form, message, Modal, notification, Row } from 'antd'
import { ColorText } from '../CommonStyled/CommonStyled'
import { ERROR_COLOR, ERROR_TITLE, RESPONSE_CODE } from '../../utils/constant'

const _ = require('lodash')

const OtpModal = props => {
  // region props, hook, state =================
  const {
    visible,
    expiredCountTime,
    onCancel,
    hiddenResend,
    callbackOtp,
    description,
    otpLength,
    isAuthentication,
    commonStore,
  } = props

  const [timeLeft, setTimeLeft] = useState(expiredCountTime || 180)
  const [timeResend, setTimeResend] = useState(30)
  const [otpDescription, setOtpDescription] = useState('Vui lòng nhập mã OTP')
  const [otp, setOtp] = useState('')
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================
  const containerStyle = {
    width: '100%',
    justifyContent: 'center',
    margin: '16px 0',
  }
  const inputStyle = {
    width: '45px',
    height: '45px',
    margin: '0 8px',
    outline: 'none',
    border: '1px solid #ccc',
    borderRadius: '8px',
  }
  const focusStyle = {
    border: '1px solid #0261AD',
  }
  // endregion
  // region function handle logic ==============
  const handleOk = () => {
    let checkOtpLength = otpLength || 6
    if (!otp) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: 'Vui lòng nhập mã OTP',
      })
      return
    }
    if (otp.length < checkOtpLength) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: `Vui lòng nhập đủ ${checkOtpLength} ký tự OTP`,
      })
      return
    }
    callbackOtp(otp)
  }
  const handleInputOtp = (value) => {
    const reg = /^-?\d+\.?\d*$/
    if (reg.test(value)) {
      setOtp(value)
    } else {
      setOtp('')
    }
  }
  const handleCancel = () => {
    onCancel()
  }
  const handleClickResend = () => {
    if (isAuthentication) {
      // Lấy otp liên quan đến authen
      commonStore.resendOtpActive()
        .then(res => {
          if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
            setTimeResend(30)
            setTimeLeft(expiredCountTime || 180)
            setOtpDescription(res?.description)
          }
        })
    } else {
      // Lấy otp liên quan đến giao dịch
      commonStore.resendOtpTransaction()
        .then(res => {
          if (res?.responseCode === RESPONSE_CODE.SUCCESS) {
            setTimeResend(30)
            setTimeLeft(expiredCountTime || 180)
            setOtpDescription(res?.description)
          }
        })
    }
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    if (!timeLeft) return
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [timeLeft])
  useEffect(() => {
    if (!timeResend) return
    const intervalId = setInterval(() => {
      setTimeResend(timeResend - 1)
    }, 1000)
    return () => clearInterval(intervalId)
  }, [timeResend])
  useEffect(() => {
    if (!visible) return
    setTimeLeft(expiredCountTime || 180)
    setTimeResend(30)
    setOtp('')
  }, [visible, expiredCountTime])
  useEffect(() => {
    if (!description) return
    setOtpDescription(description)
  }, [description])
  // endregion

  return (
    <OtpModalWrapper
      title='Nhập mã xác thực'
      maskClosable={false}
      visible={visible}
      footer={null}
      onCancel={handleCancel}>
      <Form onFinish={handleOk}>
        <Form.Item noStyle>
          <Row justify={'center'}>
            <Col span={24}>
              <OtpDescription>
                {otpDescription}
                <br />
                {
                  !hiddenResend &&
                  <>
                    Nếu không nhận được OTP vui lòng ấn
                    {
                      timeResend === 0 && timeLeft < 150
                        ?
                        <ResendOtp onClick={handleClickResend}>Gửi lại</ResendOtp>
                        :
                        <WaitingResendOtp>(Gửi lại sau {timeResend} giây)</WaitingResendOtp>
                    }
                  </>
                }
              </OtpDescription>
            </Col>
            <Col span={24}>
              <OtpInput
                shouldAutoFocus={true}
                isInputNum={true}
                value={otp}
                numInputs={otpLength || 6}
                onChange={handleInputOtp}
                containerStyle={containerStyle}
                inputStyle={inputStyle}
                focusStyle={focusStyle}
                separator={''} />
            </Col>
            <Col span={24}>
              <ExpiredLabel>
                Mã OTP sẽ hết hạn sau <TimeLeft>{timeLeft}</TimeLeft> giây
              </ExpiredLabel>
            </Col>
            <Col span={8}>
              <Button block type={'primary'} htmlType={'submit'}>Xác nhận</Button>
            </Col>
          </Row>
        </Form.Item>
      </Form>

    </OtpModalWrapper>
  )
}

OtpModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  callbackOtp: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  description: PropTypes.string,
  otpLength: PropTypes.number,
  isAuthentication: PropTypes.bool,
  hiddenResend: PropTypes.bool,
  expiredCountTime: PropTypes.number,
}

export default inject('commonStore')(observer(OtpModal))