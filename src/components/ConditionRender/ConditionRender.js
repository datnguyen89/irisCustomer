import React from 'react'
import PropTypes from 'prop-types'

const ConditionRender = props => {
  const { visible, children } = props
  return (
    visible &&
    <>
      {children}
    </>
  )
}

ConditionRender.propTypes = {
  visible: PropTypes.bool.isRequired,
}

export default ConditionRender