import styled from 'styled-components'

export const ViewDetailTransferMultipleModalWrapper = styled.div`

`
export const DividerWrapper = styled.div`
  background-color: #F6F6F6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 16px;
  margin: 16px 0;
`
export const DividerLeft = styled.div`
  font-size: 1.6rem;
  .value {
    margin: 0 4px;
    color: ${props => props.color};
  }
  .text {
    color: #848788;
  }
`
export const DividerRight = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  .export-file {
    color: ${props => props.color};
    text-decoration: underline;
    cursor: pointer;
    font-size: 1.6rem;    
  }
`