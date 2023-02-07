import React from 'react'
import PropTypes from 'prop-types'
import { Tag } from 'antd'
import { EXECUTION_STATUS } from '../../utils/constant'

const ExecutionStatusTag = props => {
  // region props, hook, state =================
  const { executionStatus, executionStatusDescription } = props
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================

  // endregion
  // region function handle logic ==============

  // endregion
  // region function render ====================
  const renderTagColor = (status) => {
    let color = 'default'
    switch (status) {
      case EXECUTION_STATUS.SUCCESS:
        color = 'success'
        break
      case EXECUTION_STATUS.UNKNOWN:
        color = 'warning'
        break
      case EXECUTION_STATUS.FAIL:
        color = 'error'
        break
      default:
        break
    }
    return color
  }
  // endregion
  // region side effect ========================

  // endregion
  return (
    <Tag color={renderTagColor(executionStatus)}>{executionStatusDescription}</Tag>
  )
}

ExecutionStatusTag.propTypes = {
  executionStatus: PropTypes.number,
  executionStatusDescription: PropTypes.string,
}

export default ExecutionStatusTag