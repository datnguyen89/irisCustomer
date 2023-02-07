import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ReactToPrint from 'react-to-print'
import { ColorText, ColorTitleNoBg, RowFlexEndDiv } from '../CommonStyled/CommonStyled'
import {
  BodyPrintPage,
  HeaderPrintPage,
  NoticeColumn,
  NoticeRow,
  PrintPageWrapper,
  PrintViewWrapper,
  ReportPrintStatementTable,
} from './PrintStatementPdfModalStyled'
import IMAGES from '../../images'
import moment from 'moment'
import { LONG_DATE } from '../../utils/constant'
import dateUtils from '../../utils/dateUtils'
import numberUtils from '../../utils/numberUtils'

const PrintStatementPdfModal = props => {
  // region props, hook, state =================
  const { record, button } = props
  const componentRef = useRef()

  const [timePrint, setTimePrint] = useState('')
  // endregion
  // region destructuring ======================

  // endregion
  // region variable ===========================
  const ids = ['1']
  // endregion
  // region function handle logic ==============
  const handleBeforePrint = () => {
    let timeString = moment().format('DD-MM-YYYY HH:mm:ss')
    setTimePrint(timeString)
    return Promise.resolve()
  }
  // endregion
  // region function render ====================

  // endregion
  // region side effect ========================

  // endregion
  return (
    <>
      <ReactToPrint
        onBeforeGetContent={() => handleBeforePrint()}
        trigger={() => button}
        content={() => componentRef.current}
      />
      <PrintViewWrapper>
        <PrintPageWrapper ref={componentRef}>
          <HeaderPrintPage>
            <img src={IMAGES.REPORT_STATEMENT_MOBI_LOGO} alt={''} height={32} />
            <ColorTitleNoBg color={'#333'}>GIẤY BÁO {record?.InComeAmount > 0 ? 'CÓ' : 'NỢ'}</ColorTitleNoBg>
            <ColorText className={'datePrint'}>Ngày in: {timePrint}</ColorText>
          </HeaderPrintPage>
          <BodyPrintPage>
            <p>Số tài khoản: {record?.AccountName}</p>
            <p>Tên tài khoản: {record?.accountFullName}</p>
            <NoticeRow>
              <NoticeColumn>
                <strong>Kính gửi: {record?.accountFullName}</strong>
              </NoticeColumn>
              <NoticeColumn>
                Mobifone xin trân trọng thông báo: Tài khoản của Quý khách hàng đã được
                ghi {record?.InComeAmount > 0 ? 'Có' : 'Nợ'} với nội dung sau:
              </NoticeColumn>
            </NoticeRow>
            <ReportPrintStatementTable>
              <thead>
              <tr>
                <th className={'w20'}>Ngày hiệu lực</th>
                <th className={'w40'}>Số tiền</th>
                <th className={'w20'}>Loại tiền</th>
                <th className={'w40'}>Diễn giải</th>
              </tr>
              </thead>
              <tbody>
              <tr>
                <td className={'date'}>{dateUtils.convertToStrDate(record?.TransTime, LONG_DATE)}</td>
                <td className={'amount'}>
                  {
                    record?.InComeAmount > 0
                      ? numberUtils.thousandSeparator(record?.InComeAmount)
                      : numberUtils.thousandSeparator(record?.ExpenseAmount)
                  }
                </td>
                <td className={'currency'}>VND</td>
                <td className={'description'}>{record?.Description}</td>
              </tr>
              </tbody>

            </ReportPrintStatementTable>
            <RowFlexEndDiv>
              Chứng từ được in từ chương trình Mobifone Money bởi user: {record?.userFullName}
            </RowFlexEndDiv>
          </BodyPrintPage>
        </PrintPageWrapper>
      </PrintViewWrapper>
    </>
  )
}

PrintStatementPdfModal.propTypes = {
  record: PropTypes.object,
  button: PropTypes.node,
}

export default PrintStatementPdfModal
