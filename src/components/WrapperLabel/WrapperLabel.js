import React from 'react'
import PropTypes from 'prop-types'
import { PrimaryLabel, Label } from './WrapperLabelStyled'

const WrapperLabel = ({ color, value }) => {
  if (color === 'primary')
    return (
      <PrimaryLabel>{value}</PrimaryLabel >
    )
  else
    return (
      <Label>{value}</Label >
    )
}

WrapperLabel.propTypes = {
  color: PropTypes.string
}

WrapperLabel.defaultProps = {
  color: 'default'
}

export default WrapperLabel