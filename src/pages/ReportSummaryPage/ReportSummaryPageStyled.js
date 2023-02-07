import styled from 'styled-components'

export const ReportSummaryPageWrapper = styled.div`
  padding: 16px;
  min-height: 100vh;
`
export const SummaryText = styled.div`
  font-size: 1.6rem;
`
export const ExportText = styled.div`
  color: ${props => props.color || '#333'};
  font-size: 1.6rem;
  cursor: pointer;
`