import moment from 'moment'
import { LONG_DATE } from './constant'

const dateUtils = {
  convertToMilliseconds: momentDate => {
    if (!momentDate) return 0
    return momentDate.valueOf()
  },
  convertToMillisecondsStartOfDay: momentDate => {
    if (!momentDate) return 0
    return momentDate.startOf('day').valueOf()
  },
  convertToMillisecondsEndOfDay: momentDate => {
    if (!momentDate) return 0
    return momentDate.endOf('day').valueOf()
  },
  convertToStrDate: (milliseconds, format) => {
    if (!milliseconds) return ''
    try {
      return moment(Number(milliseconds)).format(format || LONG_DATE)
    } catch (e) {
      return ''
    }
  },
  getAbsoluteMonths: (momentDate) => {
    const months = Number(momentDate.format('MM'))
    const years = Number(momentDate.format('YYYY'))
    return months + (years * 12)
  },
}

export default dateUtils