import { ACTION_EXECUTION, EXECUTION_ORDER_STATUS, ROLE_TYPE, USER_PROCESS_STATUS } from './constant'
import ICONS from '../icons'

const executionUtils = {
  renderExecutionStatusIcon: (status) => {
    let icon = ''
    switch (status) {
      case EXECUTION_ORDER_STATUS.WAIT_APPROVAL:
        icon = ICONS.WAITING_ICON
        break
      case EXECUTION_ORDER_STATUS.REJECT:
        icon = ICONS.REJECTED_ICON
        break
      case EXECUTION_ORDER_STATUS.APPROVED:
        icon = ICONS.APPROVED_ICON
        break
      case EXECUTION_ORDER_STATUS.REVIEWED:
        icon = ICONS.REVIEWED_ICON
        break
      case EXECUTION_ORDER_STATUS.IN_PROGRESS:
        icon = ICONS.IN_PROGRESS_ICON
        break
      default:
        icon = ICONS.DEFAULT_ICON
        break
    }
    return icon
  },
  renderCollapseExecutionStatusIcon: (status) => {
    let icon = ''
    switch (status) {
      case EXECUTION_ORDER_STATUS.WAIT_APPROVAL:
        icon = ICONS.WAITING_ICON
        break
      case EXECUTION_ORDER_STATUS.REJECT:
        icon = ICONS.REJECTED_ICON
        break
      case EXECUTION_ORDER_STATUS.APPROVED:
        icon = ICONS.APPROVED_ICON
        break
      case EXECUTION_ORDER_STATUS.REVIEWED:
        icon = ICONS.REVIEWED_ICON
        break
      case EXECUTION_ORDER_STATUS.IN_PROGRESS:
        icon = ICONS.IN_PROGRESS_ICON
        break
      default:
        icon = ICONS.WAIT_APPROVING_ICON
        break
    }
    return icon
  },
  renderUserApprovedIcon: (status) => {
    let icon = ''
    switch (status) {
      case EXECUTION_ORDER_STATUS.REVIEWED:
        icon = ICONS.USER_REVIEWED
        break
      case EXECUTION_ORDER_STATUS.REJECT:
        icon = ICONS.USER_REJECTED
        break
      case EXECUTION_ORDER_STATUS.APPROVED:
        icon = ICONS.USER_APPROVED
        break
      default:
        icon = ''
        break
    }
    return icon
  },
  renderActionButton: (roleType, action) => {
    let icon = ''
    switch (roleType) {
      case ROLE_TYPE.INIT:
        switch (action) {
          case ACTION_EXECUTION.INIT_EDIT:
            icon = ICONS.EDIT_BLUE
            break
          case ACTION_EXECUTION.INIT_DELETE:
            icon = ICONS.TRASH_RED
            break
          default:
            break
        }
        break
      case ROLE_TYPE.REVIEW:
        switch (action) {
          case ACTION_EXECUTION.REVIEW:
            icon = ICONS.CONFIRMING_ICON
            break
          case ACTION_EXECUTION.REJECT:
            icon = ICONS.REJECTING_ICON
            break
          default:
            break
        }
        break
      case ROLE_TYPE.APPROVE:
        switch (action) {
          case ACTION_EXECUTION.APPROVE:
            icon = ICONS.APPROVING_ICON
            break
          case ACTION_EXECUTION.REJECT:
            icon = ICONS.REJECTING_ICON
            break
          default:
            break
        }
        break
      default:
        break
    }
    return icon
  },
}

export default executionUtils
