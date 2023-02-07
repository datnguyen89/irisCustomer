import styled from 'styled-components'
import { Row } from 'antd'

export const ProviderWrapper = styled(Row)`
`

export const SuggestAmountMoneyArea = styled.div`
  &:hover {
    border-color: #0465B0;
  }
  
  cursor: pointer;
  padding: 5px 16px 3px 16px;
  border: ${props => props.selected ? '1px solid #0465B0' : '1px solid #E0E0E0'} ;
  border-radius: 8px;
  text-align: center;
  color: #979797;
  font-weight: 500;
  font-size: 18px;
`