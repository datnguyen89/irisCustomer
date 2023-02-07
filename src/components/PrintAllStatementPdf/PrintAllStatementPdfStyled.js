import styled from 'styled-components'

export const PrintAllStatementPdfWrapper = styled.div`
  display: none;
`
export const PrintPageWrapper = styled.div`
  padding: 24px;
`
export const PrintPageHeader = styled.div`
  position: relative;
  text-align: center;


  img {
    position: absolute;
    top: 16px;
    left: 16px;
  }
`
export const ReportPrintAllStatementTable = styled.table`
  table-layout: fixed;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e1e1e1;
  margin: 16px 0;

  td {
    padding: 4px 8px;
    border: 1px solid #e1e1e1;
  }

  .center {
    text-align: center;
  }

  .left {
    text-align: left;
  }

  .right {
    text-align: right;
  }
`
export const TableHeaderItem = styled.th`
  font-weight: 600;
  text-align: center;
  padding: 4px 8px;
  border: 1px solid #e1e1e1;
  width: ${props => props.width ? props.width : 'auto'};
`