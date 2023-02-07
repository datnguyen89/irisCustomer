import styled from 'styled-components'
import { Button, Row } from 'antd'

export const AddLinkPageWrapper = styled.div`
  padding: 16px;
  min-height: 100vh;
  .ant-descriptions-view {
    border-radius: 8px;
    border: none;
  }
`

export const AreaChooseBank = styled.div `
  display: flex;
`

export const TitleInfoLink = styled.div `
  padding: 8px;
  color: ${props => props.color || '#848788'};
  background: ${props => props.background || '#F6F6F6'};
  margin-top: ${props => props.marginTop || 0};
  margin-bottom: ${props => props.marginBottom || '16px'};
  text-align: ${props => props.textAlign || 'left'};
`

export const WhiteRoundedInfoLink = styled.div `
  background: #fff;
  border-radius: ${props => props.borderRadius || '8px'};
  padding: ${props => props.padding || '16px'};
  margin: ${props => props.margin || '0'};
  border: ${props => props.border || '1px solid #E0E0E0'};
`

export const AreaCreateCommand = styled(Row) `
  display: flex;
  justify-content: center;
  margin: 22px 0px 15px;
`

