import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import {
  PrintAllStatementPdfWrapper,
  PrintPageHeader,
  PrintPageWrapper,
  ReportPrintAllStatementTable,
  TableHeaderItem,
} from './PrintAllStatementPdfStyled'
import IMAGES from '../../images'
import { ColorText, CommonTitle, RowCenterDiv, RowFlexEndDiv, RowSpaceBetweenDiv } from '../CommonStyled/CommonStyled'
import moment from 'moment'
import ReactToPrint from 'react-to-print'
import numberUtils from '../../utils/numberUtils'
import dateUtils from '../../utils/dateUtils'
import { LONG_DATE } from '../../utils/constant'

const PrintAllStatementPdf = props => {
  // region props, hook, state =================
  const { report, button } = props
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
      <PrintAllStatementPdfWrapper>
        <PrintPageWrapper ref={componentRef}>
          <PrintPageHeader>
            <img src={IMAGES.REPORT_STATEMENT_MOBI_LOGO} alt={''} height={32} />
            <CommonTitle fontSize={'1.6rem'} textAlign={'center'}>BẢNG SAO KÊ TÀI KHOẢN</CommonTitle>
          </PrintPageHeader>
          <CommonTitle fontWeight={'400'} textAlign={'center'} margin={'16px'}>
            Số tài khoản: {report?.AccountName} - Tên tài khoản: {report?.infoResult?.FullName}
          </CommonTitle>
          <CommonTitle fontWeight={'400'} textAlign={'center'} margin={'16px'}>
            Từ ngày: {report?.FromDate} - Đến ngày: {report?.ToDate}
          </CommonTitle>
          <RowSpaceBetweenDiv>
            <ColorText>
              Thời gian xuất: {timePrint}
            </ColorText>
            <ColorText fontWeight={500}>
              Số dư đầu kỳ: {numberUtils.thousandSeparator(report?.infoResult?.DebitBalanceOpen)} (VND)
            </ColorText>
          </RowSpaceBetweenDiv>
          <ReportPrintAllStatementTable>
            <thead>
            <tr>
              <TableHeaderItem width={'6%'}>STT</TableHeaderItem>
              <TableHeaderItem width={'14%'}>MÃ GIAO DỊCH</TableHeaderItem>
              <TableHeaderItem width={'14%'}>NGÀY GIAO DỊCH</TableHeaderItem>
              <TableHeaderItem width={'14%'}>NỘI DUNG</TableHeaderItem>
              <TableHeaderItem width={'13%'}>TỪ/ĐẾN</TableHeaderItem>
              <TableHeaderItem width={'13%'}>GHI NỢ</TableHeaderItem>
              <TableHeaderItem width={'13%'}>GHI CÓ</TableHeaderItem>
              <TableHeaderItem width={'13%'}>SỐ DƯ</TableHeaderItem>
            </tr>
            </thead>
            <tbody>
            {
              report?.reports?.length > 0 && report?.reports.map((item, index) =>
                <>
                  <tr key={index}>
                    <td className={'center'}>{item.STT}</td>
                    <td className={'center'}>{item.TransactionID}</td>
                    <td className={'center'}>{dateUtils.convertToStrDate(item?.TransTime, LONG_DATE)}</td>
                    <td className={'left'}>{item?.Description}</td>
                    <td className={'center'}>{item?.RelatedAccount}</td>
                    <td className={'right'}>{numberUtils.thousandSeparator(item?.ExpenseAmount)}</td>
                    <td className={'right'}>{numberUtils.thousandSeparator(item?.InComeAmount)}</td>
                    <td className={'right'}>{numberUtils.thousandSeparator(item?.CloseBalance)}</td>
                  </tr>
                </>
              )
            }

            </tbody>

          </ReportPrintAllStatementTable>
          <RowFlexEndDiv>
            <ColorText fontWeight={500}>
              Số dư cuối kỳ: {numberUtils.thousandSeparator(report?.infoResult?.DebitBalance)} (VND)
            </ColorText>
          </RowFlexEndDiv>
          <RowCenterDiv>
            Chứng từ được in từ chương trình Mobifone Money bởi user: {report?.EntUserFullName}
          </RowCenterDiv>
        </PrintPageWrapper>
      </PrintAllStatementPdfWrapper>
    </>
  )
}

PrintAllStatementPdf.propTypes = {
  report: PropTypes.object,
  button: PropTypes.node,
}

export default PrintAllStatementPdf