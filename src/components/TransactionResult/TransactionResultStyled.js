import styled from 'styled-components'
import { Modal, Result } from 'antd'

export const TransactionResultWrapperModal = styled(Modal)`
  .ant-modal-body {
    padding-bottom: 0;
  }
  .ant-result {
    padding-bottom: 0;
  }
  .ant-modal-footer {
    border-top: none;
    display: flex;
    justify-content: center;
    padding-bottom: 25px;
  }
`

export const TransactionResultWrapper = styled.div`
`

export const ResultCustom = styled(Result)`
  .ant-result-title {
    font-size: 2rem;
  }
  .ant-result-title {
    color: ${props => props.colorText} !important;
  }
 .ant-result-subtitle {
   font-weight: bold;
   font-size: 4rem;
   color: ${props => props.colorText} !important;
 } 
`

export const AreaTransactionInfo = styled.div`
  width: 100%;
  margin: 0 auto;
`

export const TransactionCode = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
  padding-bottom: 10px;
`

export const TransactionTime = styled.div`
  display: flex;
  justify-content: space-between;
  padding-bottom: 10px;
`

export const SpanLabel = styled.span`
  color: #B4B4B4;
`