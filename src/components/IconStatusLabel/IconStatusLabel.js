import React from 'react'
import PropTypes from 'prop-types'
import { IconStatusLabelText, IconStatusLabelWrapper } from './IconStatusLabelStyled'
import { TRANSACTION_STATUS } from '../../utils/constant'
import ICONS from '../../icons'

const IconStatusLabel = props => {
  const { label, icon, iconHeight, iconWidth, fontSize } = props

  return (
    <IconStatusLabelWrapper>
      <img src={icon} alt={''} height={iconHeight || 24} width={iconWidth || 24} />
      <IconStatusLabelText fontSize={fontSize || 'inherit'}>{label}</IconStatusLabelText>
    </IconStatusLabelWrapper>
  )
}

IconStatusLabel.propTypes = {
  icon: PropTypes.string,
  iconHeight: PropTypes.number,
  iconWidth: PropTypes.number,
  fontSize: PropTypes.string,
  label: PropTypes.node.isRequired,
}

export default IconStatusLabel