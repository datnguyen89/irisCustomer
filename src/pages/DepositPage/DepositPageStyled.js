import styled from 'styled-components'
import { Button, InputNumber, Modal, Row } from 'antd'

export const DepositPageWrapper = styled.div`
  padding: 16px;
`

export const TitleInfoService = styled.div`
  padding: 8px;
  color: ${props => props.color || '#848788'};
  background: ${props => props.background || '#F6F6F6'};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || '16px'};
  text-align: ${props => props.textAlign || 'left'};
`

export const TitleFunds = styled.div`
  padding: 8px;
  color: ${props => props.color || '#848788'};
  background: ${props => props.background || '#F6F6F6'};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || '16px'};
  text-align: ${props => props.textAlign || 'left'};
`
export const AreaCreateCommand = styled(Row)`
  display: flex;
  justify-content: center;
  margin: 22px 0 15px;
`
