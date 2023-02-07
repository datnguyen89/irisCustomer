import React from 'react'
import PropTypes from 'prop-types'
import { Progress } from 'antd'

const CustomProgress = props => {
  // region props, hook, state =================
  const { className, errorNumber, successNumber, totalNumber } = props
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <Progress
      className={className}
      percent={(successNumber + errorNumber) / totalNumber * 100}
      success={{ percent: errorNumber / totalNumber * 100 }}
      size='small'
      showInfo={false} />
  )
}

CustomProgress.propTypes = {
  className: PropTypes.oneOf(['custom-process', 'custom-result']),
  totalNumber: PropTypes.number,
  successNumber: PropTypes.number,
  errorNumber: PropTypes.number,
}

export default CustomProgress