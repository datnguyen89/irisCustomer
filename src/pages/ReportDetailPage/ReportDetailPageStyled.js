import styled from 'styled-components'

export const ReportDetailPageWrapper = styled.div`
  padding: 16px;
`
export const SummaryText = styled.div`
  font-size: 1.6rem;
`
export const ExportText = styled.div`
  color: ${props => props.color || '#333'};
  font-size: 1.6rem;
  cursor: pointer;
  text-align: ${props => props.textAlign};
`
