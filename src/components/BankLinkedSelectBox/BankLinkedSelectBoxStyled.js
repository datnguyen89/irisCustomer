import styled from 'styled-components'

export const BankLinkedSelectBoxWrapper = styled.div`
  border: 1px solid #E0E0E0;
  border-radius: 4px;
  padding: 16px;
`
export const BankSelectBoxTitle = styled.div`
  color: #979797;
  font-size: 1.6rem;
  margin-bottom: 8px;
`
export const BankItemWrapper = styled.div`
  border: 1px solid ${props => props.selected ? props.color : '#E0E0E0'};
  border-radius: 4px;
  padding: 4px 16px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;

  &:hover {
    border: 1px solid ${props => props.color};
  }

  img {
    height: 60px;
    object-fit: contain;
    object-position: center;
  }
`
export const BankItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
`
export const BankName = styled.span`
  font-weight: 600;
`
export const NoLinkedBankWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  width: 100%;
`
export const NoLinkedBank = styled.div`
  display: flex;
  align-items: center;
`
export const NoLinkedBankText = styled.div`
  color: #a1a1a1;
  margin-left: 16px;
  font-size: 1.6rem;
  margin-top: 4px;
  font-weight: 600;
`