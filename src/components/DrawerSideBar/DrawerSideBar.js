import React from 'react'
import { DrawerSideBarWrapper } from './DrawerSideBarStyled'
import DrawerSideBarContent from '../DrawerSideBarContent'
import PropTypes from 'prop-types'

const DrawerSideBar = props => {
  const { onClose } = props
  const handleClose = () => {
    onClose && onClose()
  }
  return (
    <DrawerSideBarWrapper>
      <DrawerSideBarContent onClose={handleClose} />
    </DrawerSideBarWrapper>
  )
}

DrawerSideBar.propTypes = {
  onClose: PropTypes.func,
}

export default DrawerSideBar