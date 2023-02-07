import styled from 'styled-components'

export const CollapsePanelPaymentWrapper = styled.div`
`

export const SpaceIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  column-gap: 16px;

  .action-icon {
    cursor: pointer;
  }

  .approve {
    font-size: 24px;
    margin-top: 2px;
    color: green;
  }
`
export const ResultSuccessModal = styled.div`
  .ant-collapse-content-box {
    padding: 0 !important;
  }
`