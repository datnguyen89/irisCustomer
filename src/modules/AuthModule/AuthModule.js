import React from 'react'
import { inject, observer } from 'mobx-react'
import { Route, Switch } from 'react-router-dom'
import { PAGES } from '../../utils/constant'
import AuthLayout from '../../layouts/AuthLayout'
import LoginPage from '../../pages/LoginPage/LoginPage'
import ForgotPasswordPage from '../../pages/ForgotPasswordPage'


const AuthModule = (props) => {
  return (
    <AuthLayout>
      <Switch>

        <Route
          exact path={PAGES.LOGIN.PATH}
          component={LoginPage} /> {/*Đăng nhập*/}
        <Route
          exact path={PAGES.FORGOT_PASSWORD.PATH}
          component={ForgotPasswordPage} /> {/*Quên mật khẩu*/}
      </Switch>
    </AuthLayout>
  )
}

AuthModule.propTypes = {}

export default inject('commonStore')(observer(AuthModule))