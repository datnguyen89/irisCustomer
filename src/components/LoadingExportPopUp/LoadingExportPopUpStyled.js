import styled from 'styled-components'

export const LoadingExportPopUpWrapper = styled.div`
  position: fixed;
  right: 50px;
  bottom: 20px;
  width: 275px;
  z-index: 99;
`
export const LoadingExportItem = styled.div`
  background-color: ${props => props.backgroundColor};
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 4px;
`
export const LoadingExportText = styled.div`
  margin: 0 16px;
  color: ${props => props.color}
`