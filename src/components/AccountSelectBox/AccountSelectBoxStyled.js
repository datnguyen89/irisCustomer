import styled from 'styled-components'

export const AccountSelectBoxWrapper = styled.div`
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  background: #FFFFFF;
  padding: 16px;
  margin-bottom: 24px;
`
export const AccountTitle = styled.div`
  color: #979797;
  font-size: 1.6rem;
`
export const AccountName = styled.div`
  font-size: 1.6rem;
  font-weight: 500;
`
export const AccountNumber = styled.div`
  font-size: 2.4rem;
  font-weight: 500;
`
export const AccountBalance = styled.div`
  font-size: 1.6rem;
`
export const AccountScroller = styled.div`
  background-color: #F8F8F8;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  max-height: 340px;
  overflow-y: auto;
`
export const AccountItemBox = styled.div`
  border: ${props => props.selected ? `1px solid ${props.color}` : '1px solid #E0E0E0'};
  border-radius: 4px;
  background: #FFFFFF;
  margin: 16px;
  padding: 16px;
`
export const ChangeAccountText = styled.div`
  color: ${props => props.color};
  cursor: pointer;
`