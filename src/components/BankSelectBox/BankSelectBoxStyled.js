import styled from 'styled-components'

export const BankSelectBoxWrapper = styled.div`
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
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
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
export const ConfirmModalTitle = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  text-align: center;
`
export const ConfirmModalDescription = styled.h6`
  text-align: center;
  margin-bottom: 16px;
`
