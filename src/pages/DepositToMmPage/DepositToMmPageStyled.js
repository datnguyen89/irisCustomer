import styled from 'styled-components'
import { Button, Input, Modal, Row } from 'antd'

const { TextArea } = Input

export const DepositToMmPageWrapper = styled.div`
  padding: 16px;
`

export const ReceiverName = styled.div`
  background-color: #f5f5f5;
  border: 1px solid #E0E0E0;
  padding: 8px 16px;
  border-radius: 4px;
  color: #979797;
  height: 40px;
  cursor: not-allowed;
`

export const TitleInfoService = styled.div`
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

