import React from 'react'
import PropTypes from 'prop-types'
import { ConditionDisplayWrapper } from './ConditionDisplayStyled'

const ConditionDisplay = props => {
  const { visible, children } = props
  return (
    <ConditionDisplayWrapper display={visible ? 'block' : 'none'}>
      {children}
    </ConditionDisplayWrapper>
  )
}

ConditionDisplay.propTypes = {
  visible: PropTypes.bool.isRequired,
}

export default ConditionDisplay