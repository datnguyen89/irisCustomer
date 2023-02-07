import styled from 'styled-components'

export const PrintViewWrapper = styled.div`
  //border: 1px solid #e1e1e1;
  margin-top: 16px;
  display: none;
`
export const PrintPageWrapper = styled.div`
  border: 1px solid #e1e1e1;
  margin: 16px;
`
export const ReportPrintStatementTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e1e1e1;
  margin: 16px 0;

  .w20 {
    width: 20%;
  }

  .w40 {
    width: 40%;
  }

  th {
    font-weight: 600;
    text-align: center;
    padding: 4px 8px;
    border: 1px solid #e1e1e1;
  }

  td {
    padding: 4px 8px;
    border: 1px solid #e1e1e1;
  }

  .date {
    width: 20%;
    text-align: center;
  }

  .amount {
    width: 40%;
    text-align: right;
  }

  .currency {
    width: 20%;
    text-align: center;
  }

  .description {
    width: 40%;
    text-align: left;
  }
`

export const HeaderPrintPage = styled.div`
  position: relative;
  padding: 16px;
  border-bottom: 1px solid #e1e1e1;

  .business-logo {
    position: absolute;
    top: 16px;
    left: 16px;
  }

  .datePrint {
    align-self: flex-end;
  }
`
export const BodyPrintPage = styled.div`
`
export const NoticeRow = styled.div`
  display: flex;
  gap: 16px;
`
export const NoticeColumn = styled.div`
  width: 50%;
`
export const DividerDotted = styled.div`
  width: 100%;
  height: 0;
  border-bottom: 1px dotted #939393;
`
export const DividerSolid = styled.div`
  width: 100%;
  height: 0;
  border-bottom: 1px solid #e1e1e1;
`
export const AmountInFigures = styled.div`
  border: 1px solid #9b9b9b;
  border-radius: 2px;
  padding: 8px;
  min-width: 235px;
`
export const OrderStatusDataInfo = styled.div`
  text-align: center;
  font-weight: 600;
`
export const DottedDiv = styled.div`
  border-bottom: 1px dotted #939393;
  flex-grow: 1;
  margin-left: 8px;
  min-height: 24px;
`