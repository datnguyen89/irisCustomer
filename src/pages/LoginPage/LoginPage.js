import React, { useEffect, useState } from 'react'
import { inject, observer } from 'mobx-react'
import { Button, Col, Form, Input, notification, Row } from 'antd'
import { AuthShadowBox, ColorText, RowCenterDiv } from '../../components/CommonStyled/CommonStyled'
import IMAGES from '../../images'
import { LoginFormTitle, LoginPageWrapper, TitleWrapper } from './LoginPageStyled'
import { Link, useHistory, useLocation } from 'react-router-dom'
import OtpModal from '../../components/OtpModal'
import { APP_CLIENT_ID, ERROR_COLOR, ERROR_TITLE, PAGES, RESPONSE_CODE } from '../../utils/constant'
import stringUtils from '../../utils/stringUtils'
import ReCAPTCHA from 'react-google-recaptcha'
import ConditionDisplay from '../../components/ConditionDisplay'
import validator from '../../validator'
import { recapchaSitekey } from '../../config'

const LoginPage = props => {
  // region props, hook, state =================
  const { commonStore, authenticationStore } = props
  const history = useHistory()
  const location = useLocation()
  const [formLogin] = Form.useForm()
  const [numberLoginFail, setNumberLoginFail] = useState(0)
  const [capChaValue, setCapChaValue] = useState(null)
  const [visibleOtp, setVisibleOtp] = useState(false)
  const [currPayload, setCurrPayload] = useState({})
  const [extendData, setExtendData] = useState('')
  // endregion
  // region destructuring ======================
  const { appLoading } = commonStore

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============
  const onFinish = (formCollection) => {
    if (appLoading) return
    if (numberLoginFail >= 2 && !capChaValue) {
      notification.error({
        message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
        description: `Bạn chưa tích capcha`,
      })
      return
    }
    let payload = {
      ExtendData: '',
      ActiveCode: '',
      UserName: formCollection.userName,
      Password: formCollection.password,
      ClientId: APP_CLIENT_ID,
    }
    authenticationStore.userLogin(payload)
      .then(res => {
        switch (res?.responseCode) {
          case RESPONSE_CODE.SUCCESS:
            history.push((location?.state?.from && location?.state?.from !== PAGES.LOGIN.PATH) ? location?.state?.from : PAGES.HOME.PATH)
            break
          case RESPONSE_CODE.LOGIN_REQUEST_OTP:
            let newPayload = { ...payload, description: res?.description }
            setCurrPayload(newPayload)
            setVisibleOtp(true)
            setExtendData(res?.extendData)
            break
          case RESPONSE_CODE.LOCK_ACCOUNT:
            setNumberLoginFail(0)
            notification.error({
              message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
              description: res?.description,
            })
            break
          default:
            let numLoginFail = numberLoginFail + 1
            if (numLoginFail >= 3) {
              notification.error({
                message: <ColorText fontSize={'20px'} color={ERROR_COLOR}>{ERROR_TITLE}</ColorText>,
                description: `Quý khách đã đăng nhập sai thông tin ${numLoginFail} lần. Vui lòng chọn Quên mật khẩu trên màn hình nếu Quý khách không nhớ mật khẩu. Tài khoản sẽ bị khóa nếu nhập sai mật khẩu 5 lần trở lên`,
              })
            }
            setNumberLoginFail(numLoginFail)
            break
        }
      })
  }
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
  }
  const handleSubmitOtp = (otp) => {
    let payload = {
      ExtendData: extendData,
      ActiveCode: otp,
      UserName: currPayload.UserName,
      Password: currPayload.Password,
      ClientId: APP_CLIENT_ID,
    }
    authenticationStore.activeDevice(payload)
      .then(res => {
        switch (res?.responseCode) {
          case RESPONSE_CODE.SUCCESS:
            history.push((location?.state?.from && location?.state?.from !== PAGES.LOGIN.PATH) ? location?.state?.from : PAGES.HOME.PATH)
            break
          case -10105:
          case -1:
            setVisibleOtp(false)
            setCurrPayload({})
            setExtendData('')
            formLogin.resetFields()
            break
          default:
            break
        }
      })
  }
  const handleCancelOtp = () => {
    setVisibleOtp(false)
    setCurrPayload({})
    setExtendData('')
  }
  const handleChangeUsername = (e) => {
    let inputText = e.currentTarget.value.trim().replaceAll(' ', '')
    if (inputText.length === 0) return
    inputText = stringUtils.removeVietnameseCharMark(inputText)
    formLogin.setFieldsValue({
      username: inputText,
    })
  }
  const onChange = (value) => {
    setCapChaValue(value)
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================
  useEffect(() => {
    return () => {
      setNumberLoginFail(0)
      setCapChaValue(null)
      setVisibleOtp(false)
      setCurrPayload({})
      setExtendData('')
    }
  }, [])
  useEffect(() => {
    console.log(numberLoginFail)
  }, [numberLoginFail])
  // endregion

  return (
    <>
      <LoginPageWrapper>
        <AuthShadowBox color={commonStore.appTheme.solidColor}>
          <TitleWrapper>
            <img src={IMAGES.LOGIN_LOGO} alt={''} width={50} height={50} />
            <img src={IMAGES.FLAG_VI} alt={''} width={40} height={26} />
          </TitleWrapper>
          <LoginFormTitle>ĐĂNG NHẬP VÍ ĐIỆN TỬ DOANH NGHIỆP</LoginFormTitle>
          <Form
            form={formLogin}
            name='basic'
            labelCol={{ span: 0 }}
            wrapperCol={{ span: 24 }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete='off'
          >
            <Form.Item
              label=''
              name='userName'
              rules={[
                { required: true, message: 'Vui lòng nhập tên đăng nhập' },
                { validator: validator.validateUserName },
              ]}
            >
              <Input className={'auth-input'} maxLength={30} showCount onChange={handleChangeUsername}
                     placeholder={'Tên đăng nhập'} />
            </Form.Item>

            <Form.Item
              label=''
              name='password'
              rules={[
                {required: true, message:'Vui lòng nhập mật khẩu'},
                { validator: validator.validateLoginPassword },
              ]}
            >
              <Input.Password maxLength={30} showCount className={'auth-input'} placeholder={'Mật khẩu'} />
            </Form.Item>
            <ConditionDisplay visible={numberLoginFail >= 2}>
              <RowCenterDiv margin={'0 0 16px 0'}>
                <ReCAPTCHA
                  sitekey={recapchaSitekey}
                  onChange={onChange}
                />
              </RowCenterDiv>
            </ConditionDisplay>
            <Form.Item>
              <Row align={'middle'}>
                <Col span={12}>
                  <Link to={'/forgot-password'}>Quên mật khẩu</Link>
                </Col>
                <Col span={12}>
                  <Button type='primary' htmlType='submit' block>
                    Đăng nhập
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </AuthShadowBox>
        <OtpModal
          isAuthentication={true}
          description={currPayload?.description || ''}
          hiddenResend={true}
          visible={visibleOtp}
          onCancel={handleCancelOtp}
          callbackOtp={handleSubmitOtp} />
      </LoginPageWrapper>
    </>
  )
}

LoginPage.propTypes = {}

export default inject('commonStore', 'authenticationStore')(observer(LoginPage))