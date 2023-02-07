import React from 'react'
import { MainSideBarWrapper } from './MainSideBarStyled'
import MainSideBarContent from '../MainSideBarContent'

const MainSideBar = props => {

  return (
    <MainSideBarWrapper>
      <MainSideBarContent />
    </MainSideBarWrapper>
  )
}

MainSideBar.propTypes = {}

export default MainSideBar