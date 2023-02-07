import styled from 'styled-components'
import { Modal } from 'antd'

export const OtpModalWrapper = styled(Modal)`
  .ant-modal-close-x {
    width: auto;
    line-height: initial;
    margin: 12px;
  }

  .ant-modal-header {
    font-weight: 500;
    padding: 12px 16px;
  }

  .ant-modal-body {
    padding: 16px;
  }


`
export const OtpDescription = styled.div`
  text-align: center;
`
export const ExpiredLabel = styled.div`
  text-align: center;
  margin-bottom: 16px;
`
export const ResendOtp = styled.span`
  cursor: pointer;
  color: #0261AD;
  margin-left: 4px;
`
export const TimeLeft = styled.span`
  color: red;
`
export const WaitingResendOtp = styled.span`
  color: #ccc;
  margin-left: 4px;
`