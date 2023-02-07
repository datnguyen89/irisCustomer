import styled, {css} from 'styled-components'

export const WaterBillPageWrapper = styled.div`
  padding: 16px;
  min-height: 100vh;
`
export const ProviderItem = styled.div`
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
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
export const ProviderIconWrapper = styled.div`
  border-radius: 50%;
  padding: 4px;
  border: 1px solid #ccc;
  cursor: pointer;
  
  img {
    height: 32px;
    width: 32px;
    object-fit: cover;
    object-position: center;
  }
`
export const ProviderInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  cursor: pointer;
`