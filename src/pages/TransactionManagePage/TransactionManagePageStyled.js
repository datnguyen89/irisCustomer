import styled from 'styled-components'

export const TransactionManagePageWrapper = styled.div`
  padding: 16px;
  min-height: 100vh;
`
export const TransactionManagerBody = styled.div`
  padding: 16px;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;

  .site-collapse-custom-collapse {
    margin-top: 16px;
    background-color: transparent;
  }

  .site-collapse-custom-panel {
    margin-bottom: 16px;
    background-color: #fafafa;
    border: 1px solid #ccc;
  }
`
export const ExpandContent = styled.div`
  background: #fff;
`

export const GroupBoxCountWrapper = styled.div`
  padding: 2px 8px;
  border: 1px solid #ccc;
  border-radius: 16px;
`
export const GroupCount = styled.span`
  margin-left: 8px;
  //color: ${props => props.color};
`