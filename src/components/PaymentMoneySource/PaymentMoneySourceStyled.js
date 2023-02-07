import styled, {css} from 'styled-components'

export const PaymentMoneySourceWrapper = styled.div`

`
export const MoneySourceItemWrapper = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid #E0E0E0;
  border-radius: 8px;
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;
  &:nth-last-child(1) {
    margin-bottom: 0;
  }
  &:hover {
    border: 1px solid ${props => props.appTheme.solidColor};
  }
  ${(props) => {
    switch (props.active) {
      case true:
        return css`
          border: 1px solid ${props.appTheme.solidColor};
        `
      default:
        return css`
        `
    }
  }}
`
export const MoneySourceIconWrapper = styled.div`
  overflow: hidden;
  img {
    height: 48px;
    width: auto;
    object-fit: cover;
    object-position: center;
  }
`
export const MoneySourceInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
`