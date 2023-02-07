import React, { useRef, useState } from 'react'
import PropTypes from 'prop-types'
import ReactToPrint from 'react-to-print'
import {
  ColorText,
  ColorTitleNoBg,
  RowCenterDiv,
  RowFlexEndDiv,
  RowSpaceBetweenDiv,
} from '../CommonStyled/CommonStyled'
import {
  AmountInFigures,
  BodyPrintPage, DividerSolid, DottedDiv,
  HeaderPrintPage,
  NoticeColumn,
  NoticeRow, OrderStatusDataInfo,
  PrintPageWrapper,
  PrintViewWrapper,
  ReportPrintStatementTable,
} from './PrintExecutionPdfModalStyled'
import IMAGES from '../../images'
import moment from 'moment'
import { EXECUTION_TYPE_ID, LONG_DATE, ROLE_TYPE } from '../../utils/constant'
import dateUtils from '../../utils/dateUtils'
import numberUtils from '../../utils/numberUtils'
import stringUtils from '../../utils/stringUtils'

const PrintExecutionPdfModal = props => {
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
    let timeString = moment().format('DD-MMM-YY')
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
      {
        record &&
        <PrintViewWrapper>
          <PrintPageWrapper ref={componentRef}>
            <HeaderPrintPage>
              <RowCenterDiv>
                <img className={'business-logo'} src={IMAGES.REPORT_STATEMENT_MOBI_LOGO} alt={''} height={32} />
                <ColorTitleNoBg textAlign={'center'} color={'#333'}>LỆNH CHI<br />PAYMENT ORDER</ColorTitleNoBg>
              </RowCenterDiv>
              <RowFlexEndDiv margin={'8px 0 0 0'}>
                <ColorText className={'datePrint'}>
                <span style={{ marginRight: 40 }}>
                  Số/No.: {
                  dateUtils.convertToStrDate(JSON.parse(record?.orderStatusData).findLast(item => item.RoleType === ROLE_TYPE.APPROVE)?.StatusTime, 'YYYYMMDD') + record?.executionID.toString()
                }
                </span>
                  <span>Ngày/Date: {timePrint}</span>
                </ColorText>
              </RowFlexEndDiv>
            </HeaderPrintPage>

            <BodyPrintPage>
              <RowCenterDiv margin={'16px 16px 0 16px'}>
                <div style={{ minWidth: 165 }}>Tên đơn vị chuyển/Payer:</div>
                <DottedDiv>
                  {
                    record?.executionType === EXECUTION_TYPE_ID.TRANSFER_MULTIPLE
                      ? JSON.parse(record?.executionData)?.TransferMultiInfo?.AccountName
                      : JSON.parse(record?.executionData)?.TransferInfo?.AccountFullName
                  }
                </DottedDiv>
              </RowCenterDiv>
              <RowCenterDiv margin={'0 16px 16px 16px'}>
                <div style={{ minWidth: 165 }}>Tài khoản nợ/Debit A/C:</div>
                <DottedDiv>
                  {
                    record?.executionType === EXECUTION_TYPE_ID.TRANSFER_MULTIPLE
                      ? JSON.parse(record?.executionData)?.TransferMultiInfo?.AccountNumber
                      : JSON.parse(record?.executionData)?.TransferInfo?.AccountName
                  }
                </DottedDiv>
              </RowCenterDiv>
              <DividerSolid />
              <RowSpaceBetweenDiv flexWrap={'no-wrap'} margin={'16px'}>
                <div style={{ paddingRight: 16 }}>
                  <div>Số tiền bằng chữ/Amount in words:</div>
                  <strong>
                    {
                      record?.executionType === EXECUTION_TYPE_ID.TRANSFER_MULTIPLE
                        ? numberUtils.currencyToText(JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalSuccessfulAmount || 0) + './'
                        : numberUtils.currencyToText(JSON.parse(record?.executionData)?.TransferInfo?.Amount || 0) + './'
                    }
                  </strong>
                </div>
                <AmountInFigures>
                  <div>Số tiền bằng số/Amount in figures:</div>
                  <strong>
                    {
                      record?.executionType === EXECUTION_TYPE_ID.TRANSFER_MULTIPLE
                        ? numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.TransferMultiInfo?.TotalSuccessfulAmount || 0)
                        : numberUtils.thousandSeparator(JSON.parse(record?.executionData)?.TransferInfo?.Amount || 0)
                    } VND
                  </strong>
                </AmountInFigures>
              </RowSpaceBetweenDiv>
              <DividerSolid />
              <RowCenterDiv margin={'16px 16px 0 16px'}>
                <div style={{ minWidth: 165 }}>Tên đơn vị nhận/Payer:</div>
                <DottedDiv>
                  {
                    record?.executionType === EXECUTION_TYPE_ID.TRANSFER_MULTIPLE
                      ? 'Theo danh sách đính kèm'
                      : JSON.parse(record?.executionData)?.TransferInfo?.RelatedFullName
                  }
                </DottedDiv>
              </RowCenterDiv>
              <RowCenterDiv margin={'0 16px 0 16px'}>
                <div style={{ minWidth: 165 }}>Tài khoản có/Debit A/C:</div>
                <DottedDiv>
                  {
                    record?.executionType === EXECUTION_TYPE_ID.TRANSFER_MULTIPLE
                      ? 'Theo danh sách đính kèm'
                      : JSON.parse(record?.executionData)?.TransferInfo?.RelatedUser
                  }
                </DottedDiv>
              </RowCenterDiv>
              <RowCenterDiv margin={'0 16px 16px 16px'}>
                <div style={{ minWidth: 165 }}>Nội dung/Remarks:</div>
                <DottedDiv>
                  {
                    record?.executionType === EXECUTION_TYPE_ID.TRANSFER_MULTIPLE
                      ? JSON.parse(record?.executionData)?.TransferMultiInfo?.TransferMultiContent
                      : JSON.parse(record?.executionData)?.TransferInfo?.Description
                  }
                </DottedDiv>
              </RowCenterDiv>
              <DividerSolid />
              <RowFlexEndDiv margin={'16px'}>
                <div style={{ minWidth: 320 }}>
                  Ngày hạch toán/Accounting
                  date: {dateUtils.convertToStrDate(JSON.parse(record?.orderStatusData).findLast(item => item.RoleType === ROLE_TYPE.APPROVE)?.StatusTime, 'YYYYMMDD HH:mm:ss')}
                </div>
              </RowFlexEndDiv>
              <RowSpaceBetweenDiv margin={'16px'}>
                <OrderStatusDataInfo>
                  Người tạo lệnh
                  <br />
                  <br />
                  {JSON.parse(record?.orderStatusData).findLast(item => item.RoleType === ROLE_TYPE.INIT)?.FullName}
                </OrderStatusDataInfo>
                <OrderStatusDataInfo>
                  Người kiểm soát
                  <br />
                  <br />
                  {JSON.parse(record?.orderStatusData).findLast(item => item.RoleType === ROLE_TYPE.REVIEW)?.FullName || JSON.parse(record?.orderStatusData).findLast(item => item.RoleType === ROLE_TYPE.APPROVE)?.FullName}
                </OrderStatusDataInfo>
                <OrderStatusDataInfo>
                  Người kiểm duyệt
                  <br />
                  <br />
                  {JSON.parse(record?.orderStatusData).findLast(item => item.RoleType === ROLE_TYPE.APPROVE)?.FullName}
                </OrderStatusDataInfo>
              </RowSpaceBetweenDiv>
            </BodyPrintPage>
          </PrintPageWrapper>
        </PrintViewWrapper>
      }
    </>
  )
}

PrintExecutionPdfModal.propTypes = {
  record: PropTypes.object,
  button: PropTypes.node,
}

export default PrintExecutionPdfModal
