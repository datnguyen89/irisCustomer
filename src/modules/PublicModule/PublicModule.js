import React from 'react'
import { inject, observer } from 'mobx-react'
import { Switch, Route } from 'react-router-dom'
import DefaultLayout from '../../layouts/DefaultLayout'
import { PAGES } from '../../utils/constant'
import NotPermissionPage from '../../pages/NotPermissionPage'
import TestPage from '../../pages/TestPage/TestPage'


const PublicModule = (props) => {
  return (
    <DefaultLayout>
      <Switch>
        <Route
          exact path={PAGES.NOT_PERMISSION.PATH}
          component={NotPermissionPage} />
        <Route
          exact path={PAGES.TEST.PATH}
          component={TestPage} /> {/*Test*/}
      </Switch>
    </DefaultLayout>
  )
}

PublicModule.propTypes = {}

export default inject('commonStore')(observer(PublicModule))